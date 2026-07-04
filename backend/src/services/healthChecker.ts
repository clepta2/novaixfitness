// src/services/healthChecker.ts
// Serviço de verificação de integridade e saúde do backend - NOVAIX FITNESS

import supabase from '../config/supabase';
import * as asaas from './asaas';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  latencyMs: number;
  error?: string;
}

async function checkDatabase(): Promise<HealthStatus> {
  const start = Date.now();
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) throw error;
    return { status: 'healthy', latencyMs: Date.now() - start };
  } catch (err: any) {
    return { status: 'unhealthy', error: err.message, latencyMs: Date.now() - start };
  }
}

async function checkAsaas(): Promise<HealthStatus> {
  const start = Date.now();
  try {
    // Busca clientes leves para testar conexao da API e chave
    await asaas.request('/customers?limit=1', { method: 'GET' });
    return { status: 'healthy', latencyMs: Date.now() - start };
  } catch (err: any) {
    return { status: 'unhealthy', error: err.message, latencyMs: Date.now() - start };
  }
}

async function sendMonitoringAlert(service: string, errorMsg?: string): Promise<void> {
  const webhookUrl = process.env.MONITORING_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Nix Monitor',
        avatar_url: 'https://novaix.fitness/logo.png',
        embeds: [{
          title: `🚨 Alerta de Instabilidade: ${service}`,
          description: `O serviço **${service}** apresentou falha no teste de saúde.`,
          color: 16711680,
          fields: [
            { name: 'Erro', value: errorMsg || 'Sem detalhes', inline: false },
            { name: 'Ambiente', value: process.env.NODE_ENV || 'development', inline: true },
            { name: 'Timestamp', value: new Date().toISOString(), inline: true }
          ]
        }]
      })
    });
  } catch (err: any) {
    console.error('[Monitor Alert] Falha ao enviar alerta para webhook:', err.message);
  }
}

async function getFullHealth(): Promise<any> {
  const [dbResult, asaasResult] = await Promise.all([
    checkDatabase(),
    checkAsaas()
  ]);

  if (dbResult.status === 'unhealthy') {
    await sendMonitoringAlert('Database (Supabase)', dbResult.error);
  }
  if (asaasResult.status === 'unhealthy') {
    await sendMonitoringAlert('Payment Gateway (Asaas)', asaasResult.error);
  }

  const memory = process.memoryUsage();
  return {
    status: (dbResult.status === 'healthy' && asaasResult.status === 'healthy') ? 'ok' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: dbResult,
      asaas: asaasResult
    },
    system: {
      memoryUsage: {
        rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`
      },
      cpu: process.cpuUsage()
    }
  };
}

export {
  checkDatabase,
  checkAsaas,
  getFullHealth,
  sendMonitoringAlert
};
