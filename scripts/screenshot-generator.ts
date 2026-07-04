// scripts/generate-screenshots.js
// Script para gerar screenshots automaticas - NOVAIX FITNESS

const http = require('http');
const fs = require('fs');
const path = require('path');

const SCREENS = [
  { name: '01-login', title: 'NOVAIX FITNESS', subtitle: 'Sua Nova Evolucao no Treino', content: 'login' },
  { name: '02-home', title: 'BEM-VINDO, ATLETA!', subtitle: 'SEU PLANO DE HOJE', content: 'home' },
  { name: '03-player', title: 'TREINO ATIVO', subtitle: '00:45:20', content: 'player' },
  { name: '04-coach', title: 'COACH NIX IA', subtitle: 'Treino & Nutricao', content: 'coach' },
  { name: '05-profile', title: 'MEU PERFIL', subtitle: 'Nivel 5 - Atleta', content: 'profile' },
  { name: '06-dashboard', title: 'MEU PROGRESSO', subtitle: 'Analytics Completo', content: 'dashboard' },
  { name: '07-paywall', title: 'LIBERE TODO O POTENCIAL', subtitle: '7 DIAS GRATIS', content: 'paywall' },
  { name: '08-community', title: 'COMUNIDADE NOVAIX', subtitle: 'Conecte-se com atletas', content: 'community' },
];

function generateHTML(screen) {
  const colors = {
    bg: '#12161A',
    surface: '#1E232A',
    primary: '#CCFF00',
    text: '#FFFFFF',
    muted: '#94A3B8',
    success: '#00E676',
  };

  const contentHTML = generateContent(screen.content, colors);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    width: 390px;
    height: 844px;
    background: ${colors.bg};
    font-family: 'Inter', sans-serif;
    overflow: hidden;
    position: relative;
  }
  
  .status-bar {
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    color: ${colors.text};
    font-size: 14px;
    font-weight: 600;
  }
  
  .header {
    padding: 0 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header h1 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 24px;
    color: ${colors.text};
    text-transform: uppercase;
  }
  
  .header-sub {
    font-size: 12px;
    color: ${colors.muted};
  }
  
  .content {
    padding: 0 20px;
  }
  
  .card {
    background: ${colors.surface};
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    border: 1px solid #333;
  }
  
  .primary-btn {
    background: ${colors.primary};
    color: ${colors.bg};
    border: none;
    border-radius: 12px;
    padding: 16px;
    width: 100%;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
  }
  
  .timer {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 64px;
    color: ${colors.primary};
    text-align: center;
  }
  
  .stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .stat-card {
    background: ${colors.surface};
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    border: 1px solid #333;
  }
  
  .stat-value {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 28px;
    color: ${colors.primary};
  }
  
  .stat-label {
    font-size: 11px;
    color: ${colors.muted};
    margin-top: 4px;
  }
  
  .badge {
    background: ${colors.primary};
    color: ${colors.bg};
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    display: inline-block;
    margin-bottom: 16px;
  }
  
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background: ${colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 20px;
    color: ${colors.bg};
  }
  
  .chat-bubble {
    background: ${colors.surface};
    border-radius: 16px;
    padding: 12px 16px;
    margin-bottom: 8px;
    border: 1px solid #333;
    max-width: 85%;
  }
  
  .chat-user {
    background: ${colors.primary};
    color: ${colors.bg};
    align-self: flex-end;
    margin-left: auto;
  }
  
  .progress-bar {
    height: 6px;
    background: #333;
    border-radius: 3px;
    overflow: hidden;
    margin-top: 8px;
  }
  
  .progress-fill {
    height: 100%;
    background: ${colors.primary};
    border-radius: 3px;
  }
  
  .plan-card {
    background: ${colors.surface};
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    border: 2px solid #333;
  }
  
  .plan-card.popular {
    border-color: ${colors.primary};
  }
  
  .price {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 36px;
    color: ${colors.text};
  }
  
  .bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: ${colors.surface};
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #333;
  }
  
  .nav-item {
    text-align: center;
    color: ${colors.muted};
    font-size: 10px;
  }
  
  .nav-item.active {
    color: ${colors.primary};
  }
</style>
</head>
<body>
  <div class="status-bar">
    <span>9:41</span>
    <span>100%</span>
  </div>
  ${contentHTML}
</body>
</html>`;
}

function generateContent(type, c) {
  switch (type) {
    case 'login':
      return `
        <div style="padding: 60px 20px; text-align: center;">
          <div style="font-family: Montserrat; font-weight: 800; font-size: 48px; color: ${c.primary}; margin-bottom: 8px;">N<span style="color: ${c.text}">ix</span></div>
          <h1 style="font-family: Montserrat; font-weight: 800; font-size: 20px; color: ${c.text}; margin-bottom: 8px;">NOVAIX FITNESS</h1>
          <p style="color: ${c.muted}; margin-bottom: 40px;">Sua Nova Evolucao no Treino</p>
          <div style="margin-bottom: 16px;">
            <input style="width: 100%; padding: 16px; background: ${c.bg}; border: 1px solid #333; border-radius: 8px; color: ${c.text}; font-size: 14px; margin-bottom: 12px;" placeholder="E-mail ou CPF" />
            <input style="width: 100%; padding: 16px; background: ${c.bg}; border: 1px solid #333; border-radius: 8px; color: ${c.text}; font-size: 14px;" placeholder="Senha" type="password" />
          </div>
          <button class="primary-btn">ENTRAR</button>
          <div style="margin-top: 16px; display: flex; gap: 12px;">
            <button style="flex: 1; padding: 14px; background: ${c.surface}; border: 1px solid #333; border-radius: 8px; color: ${c.text}; font-size: 13px;">Google</button>
            <button style="flex: 1; padding: 14px; background: ${c.surface}; border: 1px solid #333; border-radius: 8px; color: ${c.text}; font-size: 13px;">Apple</button>
          </div>
          <p style="margin-top: 20px; color: ${c.muted}; font-size: 13px;">Nao tem conta? <span style="color: ${c.primary}; font-weight: 600;">Cadastre-se</span></p>
        </div>`;
    case 'home':
      return `
        <div class="header">
          <div>
            <p style="color: ${c.muted}; font-size: 12px;">BEM-VINDO,</p>
            <h1>CARLOS!</h1>
          </div>
          <div style="display: flex; gap: 8px;">
            <div style="width: 36px; height: 36px; border-radius: 18px; background: ${c.surface}; display: flex; align-items: center; justify-content: center; border: 1px solid #333;">💬</div>
          </div>
        </div>
        <div class="content">
          <p style="color: ${c.muted}; font-size: 11px; font-weight: 600; margin-bottom: 8px; letter-spacing: 1px;">SEU PLANO DE HOJE</p>
          <div class="card" style="border-color: ${c.primary};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h3 style="color: ${c.text}; font-size: 16px;">QUEIMA SUPERIORES</h3>
                <p style="color: ${c.muted}; font-size: 12px;">HIIT/CALISTENIA • 30 min</p>
              </div>
              <button style="background: ${c.primary}; color: ${c.bg}; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 12px;">INICIAR</button>
            </div>
          </div>
          <div class="card" style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 24px;">🔥</div>
            <div style="flex: 1;">
              <p style="color: ${c.muted}; font-size: 11px;">NIVEL 5 - ATLETA</p>
              <div class="progress-bar"><div class="progress-fill" style="width: 65%;"></div></div>
              <p style="color: ${c.muted}; font-size: 10px; margin-top: 4px;">2000 / 3500 XP</p>
            </div>
          </div>
          <p style="color: ${c.muted}; font-size: 11px; font-weight: 600; margin-bottom: 8px; letter-spacing: 1px;">SEU DESEMPENHO</p>
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-value">12</div><div class="stat-label">STREAK</div></div>
            <div class="stat-card"><div class="stat-value">47</div><div class="stat-label">TREINOS</div></div>
            <div class="stat-card"><div class="stat-value">23h</div><div class="stat-label">TOTAL</div></div>
            <div class="stat-card"><div class="stat-value">3250</div><div class="stat-label">XP</div></div>
          </div>
        </div>
        <div class="bottom-nav">
          <div class="nav-item active">🏋️<br>Treinos</div>
          <div class="nav-item">👥<br>Comunidade</div>
          <div class="nav-item">👤<br>Perfil</div>
          <div class="nav-item">❓<br>Ajuda</div>
          <div class="nav-item">📚<br>Biblioteca</div>
        </div>`;
    case 'player':
      return `
        <div class="content" style="padding-top: 8px;">
          <div style="background: #000; border-radius: 12px; height: 180px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 60px; height: 60px; border-radius: 30px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 24px;">▶</div>
          </div>
          <div style="display: flex; justify-content: space-around; margin-bottom: 16px;">
            <div style="text-align: center;"><div style="width: 24px; height: 24px; border-radius: 12px; background: ${c.success}; margin: 0 auto 4px;"></div><span style="color: ${c.muted}; font-size: 10px;">1</span></div>
            <div style="text-align: center;"><div style="width: 24px; height: 24px; border-radius: 12px; background: ${c.success}; margin: 0 auto 4px;"></div><span style="color: ${c.muted}; font-size: 10px;">2</span></div>
            <div style="text-align: center;"><div style="width: 24px; height: 24px; border-radius: 12px; background: ${c.primary}; margin: 0 auto 4px;"></div><span style="color: ${c.primary}; font-size: 10px; font-weight: 600;">3</span></div>
            <div style="text-align: center;"><div style="width: 24px; height: 24px; border-radius: 12px; background: #333; margin: 0 auto 4px;"></div><span style="color: ${c.muted}; font-size: 10px;">4</span></div>
            <div style="text-align: center;"><div style="width: 24px; height: 24px; border-radius: 12px; background: #333; margin: 0 auto 4px;"></div><span style="color: ${c.muted}; font-size: 10px;">5</span></div>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <p style="color: ${c.success}; font-size: 11px; font-weight: 600; letter-spacing: 2px;">EXERCICIO</p>
            <div class="timer">04:30</div>
            <p style="color: ${c.muted}; font-size: 14px;">Supino Reto Barra</p>
            <p style="color: ${c.muted}; font-size: 12px;">Serie 2 de 4</p>
          </div>
          <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 16px;">
            <div style="width: 50px; height: 50px; border-radius: 25px; background: ${c.surface}; border: 2px solid ${c.error}; display: flex; align-items: center; justify-content: center;">⏹</div>
            <div style="width: 70px; height: 70px; border-radius: 35px; background: ${c.primary}; display: flex; align-items: center; justify-content: center; font-size: 28px;">⏸</div>
            <div style="width: 50px; height: 50px; border-radius: 25px; background: ${c.surface}; border: 2px solid #333; display: flex; align-items: center; justify-content: center;">⏭</div>
          </div>
          <button class="primary-btn" style="background: ${c.success}; display: flex; align-items: center; justify-content: center; gap: 8px;">✓ CONCLUIR SERIE</button>
        </div>`;
    case 'coach':
      return `
        <div class="header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 36px; height: 36px; border-radius: 18px; background: ${c.primary}; display: flex; align-items: center; justify-content: center; font-size: 16px;">💪</div>
            <div>
              <h1 style="font-size: 16px;">Coach Nix IA</h1>
              <p style="color: ${c.primary}; font-size: 11px;">Treino & Nutricao</p>
            </div>
          </div>
        </div>
        <div class="content" style="display: flex; flex-direction: column; gap: 8px; height: 600px;">
          <div class="chat-bubble">
            <p style="color: ${c.text}; font-size: 13px;">Ola, Carlos! Sou seu Coach IA. Como posso ajudar?</p>
          </div>
          <div class="chat-bubble chat-user">
            <p style="font-size: 13px;">Montar treino de peito</p>
          </div>
          <div class="chat-bubble">
            <p style="color: ${c.text}; font-size: 13px;">Para treino de peito, recomendo: Supino Reto 4x12, Inclinado 3x10, Crucifixo 3x12. Descanse 60s entre series.</p>
          </div>
          <div class="chat-bubble chat-user">
            <p style="font-size: 13px;">Quanto de descanso?</p>
          </div>
          <div class="chat-bubble">
            <p style="color: ${c.text}; font-size: 13px;">Para hipertrofia, 60-90 segundos entre series. Para forca, 2-3 minutos.</p>
          </div>
        </div>
        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; background: ${c.surface}; border-top: 1px solid #333; display: flex; gap: 8px;">
          <input style="flex: 1; padding: 12px; background: ${c.bg}; border: 1px solid #333; border-radius: 8px; color: ${c.text}; font-size: 13px;" placeholder="Pergunte sobre treino..." />
          <div style="width: 40px; height: 40px; border-radius: 20px; background: ${c.primary}; display: flex; align-items: center; justify-content: center;">➤</div>
        </div>`;
    case 'profile':
      return `
        <div class="header">
          <h1>Meu Perfil</h1>
          <span style="color: ${c.primary};">✏️</span>
        </div>
        <div class="content">
          <div class="card" style="display: flex; align-items: center; gap: 16px;">
            <div class="avatar">CS</div>
            <div>
              <h3 style="color: ${c.text};">Carlos Silva</h3>
              <p style="color: ${c.muted}; font-size: 12px;">Membro desde Jan 2026</p>
            </div>
          </div>
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-value">12</div><div class="stat-label">Streak</div></div>
            <div class="stat-card"><div class="stat-value">47</div><div class="stat-label">Treinos</div></div>
            <div class="stat-card"><div class="stat-value">23h</div><div class="stat-label">Tempo</div></div>
            <div class="stat-card"><div class="stat-value">8</div><div class="stat-label">Favoritos</div></div>
          </div>
          <div class="card" style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 24px;">🔥</div>
            <div style="flex: 1;">
              <p style="color: ${c.muted}; font-size: 11px;">NIVEL 5 - ATLETA</p>
              <div class="progress-bar"><div class="progress-fill" style="width: 65%;"></div></div>
            </div>
            <span style="color: ${c.primary}; font-weight: 700;">3250 XP</span>
          </div>
          <p style="color: ${c.muted}; font-size: 11px; font-weight: 600; margin: 12px 0 8px; letter-spacing: 1px;">CONQUISTAS</p>
          <div style="display: flex; gap: 8px;">
            <div style="width: 70px; text-align: center;"><div style="width: 48px; height: 48px; border-radius: 24px; background: ${c.primary}20; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px;">🔥</div><p style="color: ${c.text}; font-size: 9px;">Streak 7d</p></div>
            <div style="width: 70px; text-align: center;"><div style="width: 48px; height: 48px; border-radius: 24px; background: ${c.primary}20; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px;">🏆</div><p style="color: ${c.text}; font-size: 9px;">10 Treinos</p></div>
            <div style="width: 70px; text-align: center;"><div style="width: 48px; height: 48px; border-radius: 24px; background: ${c.primary}20; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px;">⭐</div><p style="color: ${c.text}; font-size: 9px;">Nivel 5</p></div>
          </div>
        </div>
        <div class="bottom-nav">
          <div class="nav-item">🏋️<br>Treinos</div>
          <div class="nav-item">👥<br>Comunidade</div>
          <div class="nav-item active">👤<br>Perfil</div>
          <div class="nav-item">❓<br>Ajuda</div>
          <div class="nav-item">📚<br>Biblioteca</div>
        </div>`;
    case 'dashboard':
      return `
        <div class="header">
          <h1>Meu Progresso</h1>
        </div>
        <div class="content">
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-value">47</div><div class="stat-label">Treinos</div></div>
            <div class="stat-card"><div class="stat-value">23h</div><div class="stat-label">Tempo</div></div>
            <div class="stat-card"><div class="stat-value">12</div><div class="stat-label">Streak</div></div>
            <div class="stat-card"><div class="stat-value">3250</div><div class="stat-label">XP</div></div>
          </div>
          <div class="card">
            <p style="color: ${c.muted}; font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">FREQUENCIA SEMANAL</p>
            <div style="display: flex; align-items: flex-end; gap: 6px; height: 100px;">
              <div style="flex: 1; background: ${c.primary}; height: 30%; border-radius: 4px 4px 0 0;"></div>
              <div style="flex: 1; background: ${c.primary}; height: 60%; border-radius: 4px 4px 0 0;"></div>
              <div style="flex: 1; background: ${c.primary}; height: 80%; border-radius: 4px 4px 0 0;"></div>
              <div style="flex: 1; background: ${c.primary}; height: 40%; border-radius: 4px 4px 0 0;"></div>
              <div style="flex: 1; background: ${c.primary}; height: 100%; border-radius: 4px 4px 0 0;"></div>
              <div style="flex: 1; background: ${c.primary}; height: 50%; border-radius: 4px 4px 0 0;"></div>
              <div style="flex: 1; background: ${c.primary}; height: 20%; border-radius: 4px 4px 0 0;"></div>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 4px;">
              <span style="flex: 1; text-align: center; color: ${c.muted}; font-size: 9px;">Seg</span>
              <span style="flex: 1; text-align: center; color: ${c.muted}; font-size: 9px;">Ter</span>
              <span style="flex: 1; text-align: center; color: ${c.muted}; font-size: 9px;">Qua</span>
              <span style="flex: 1; text-align: center; color: ${c.muted}; font-size: 9px;">Qui</span>
              <span style="flex: 1; text-align: center; color: ${c.muted}; font-size: 9px;">Sex</span>
              <span style="flex: 1; text-align: center; color: ${c.muted}; font-size: 9px;">Sab</span>
              <span style="flex: 1; text-align: center; color: ${c.muted}; font-size: 9px;">Dom</span>
            </div>
          </div>
          <div class="card">
            <p style="color: ${c.muted}; font-size: 11px; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">CATEGORIAS</p>
            <div style="margin-bottom: 8px;"><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: ${c.text}; font-size: 12px;">Musculacao</span><span style="color: ${c.primary}; font-size: 12px;">18</span></div><div class="progress-bar"><div class="progress-fill" style="width: 70%;"></div></div></div>
            <div style="margin-bottom: 8px;"><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: ${c.text}; font-size: 12px;">Cardio</span><span style="color: ${c.primary}; font-size: 12px;">12</span></div><div class="progress-bar"><div class="progress-fill" style="width: 45%; background: #FF6B35;"></div></div></div>
            <div><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: ${c.text}; font-size: 12px;">Calistenia</span><span style="color: ${c.primary}; font-size: 12px;">8</span></div><div class="progress-bar"><div class="progress-fill" style="width: 30%; background: ${c.success};"></div></div></div>
          </div>
        </div>`;
    case 'paywall':
      return `
        <div class="content" style="padding-top: 20px;">
          <div class="badge">7 DIAS GRATIS</div>
          <h1 style="font-family: Montserrat; font-weight: 800; font-size: 20px; color: ${c.text}; margin-bottom: 4px;">LIBERE TODO O POTENCIAL</h1>
          <p style="color: ${c.muted}; font-size: 13px; margin-bottom: 20px;">Escolha o plano ideal</p>
          <div class="plan-card" style="margin-bottom: 12px;">
            <h3 style="color: ${c.text}; margin-bottom: 8px;">Basico</h3>
            <div class="price">R$ 49<span style="font-size: 14px; color: ${c.muted};">,90/mes</span></div>
            <p style="color: ${c.muted}; font-size: 12px; margin-top: 8px;">Treinos basicos • Cronometro</p>
          </div>
          <div class="plan-card popular" style="margin-bottom: 12px; position: relative;">
            <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: ${c.primary}; color: ${c.bg}; padding: 4px 12px; border-radius: 12px; font-size: 10px; font-weight: 700;">MAIS POPULAR</div>
            <h3 style="color: ${c.text}; margin-bottom: 8px; margin-top: 8px;">Intermediario</h3>
            <div class="price">R$ 79<span style="font-size: 14px; color: ${c.muted};">,90/mes</span></div>
            <p style="color: ${c.muted}; font-size: 12px; margin-top: 8px;">Treinos ilimitados • Coach IA</p>
          </div>
          <div class="plan-card" style="margin-bottom: 16px;">
            <h3 style="color: ${c.text}; margin-bottom: 8px;">Premium</h3>
            <div class="price">R$ 119<span style="font-size: 14px; color: ${c.muted};">,90/mes</span></div>
            <p style="color: ${c.muted}; font-size: 12px; margin-top: 8px;">Tudo + Nutricao IA</p>
          </div>
          <button class="primary-btn">LIBERAR MEU CRONOGRAMA</button>
          <p style="text-align: center; color: ${c.muted}; font-size: 11px; margin-top: 12px;">Pular por agora</p>
        </div>`;
    case 'community':
      return `
        <div class="header">
          <div>
            <h1>Comunidade</h1>
            <p style="color: ${c.muted}; font-size: 12px;">Veja o que seus amigos estao treinando</p>
          </div>
          <div style="width: 36px; height: 36px; border-radius: 18px; background: ${c.surface}; display: flex; align-items: center; justify-content: center; border: 1px solid #333;">🔔</div>
        </div>
        <div class="content">
          <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <span style="padding: 6px 14px; background: ${c.primary}; color: ${c.bg}; border-radius: 20px; font-size: 12px; font-weight: 600;">Todos</span>
            <span style="padding: 6px 14px; background: ${c.surface}; color: ${c.muted}; border-radius: 20px; font-size: 12px; border: 1px solid #333;">Populares</span>
            <span style="padding: 6px 14px; background: ${c.surface}; color: ${c.muted}; border-radius: 20px; font-size: 12px; border: 1px solid #333;">Recentes</span>
          </div>
          <div class="card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 18px; background: ${c.primary}; display: flex; align-items: center; justify-content: center; color: ${c.bg}; font-weight: 700; font-size: 12px;">MS</div>
              <div><p style="color: ${c.text}; font-size: 13px; font-weight: 600;">Maria Santos</p><p style="color: ${c.muted}; font-size: 10px;">Hoje</p></div>
            </div>
            <p style="color: ${c.text}; font-size: 13px; margin-bottom: 10px;">Acabei de completar o treino de pernas! 45 minutos de pura evolucao!</p>
            <div style="display: flex; gap: 16px; color: ${c.muted}; font-size: 12px;">
              <span>❤️ 24</span>
              <span>💬 8</span>
            </div>
          </div>
          <div class="card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 18px; background: ${c.primary}; display: flex; align-items: center; justify-content: center; color: ${c.bg}; font-weight: 700; font-size: 12px;">PL</div>
              <div><p style="color: ${c.text}; font-size: 13px; font-weight: 600;">Pedro Lima</p><p style="color: ${c.muted}; font-size: 10px;">Ontem</p></div>
            </div>
            <p style="color: ${c.text}; font-size: 13px; margin-bottom: 10px;">Streak de 30 dias! Nada pode me parar!</p>
            <div style="display: flex; gap: 16px; color: ${c.muted}; font-size: 12px;">
              <span>❤️ 56</span>
              <span>💬 12</span>
            </div>
          </div>
        </div>
        <div style="position: absolute; bottom: 100px; right: 20px; width: 56px; height: 56px; border-radius: 28px; background: ${c.primary}; display: flex; align-items: center; justify-content: center; font-size: 24px; color: ${c.bg}; box-shadow: 0 4px 16px rgba(204, 255, 0, 0.4);">+</div>
        <div class="bottom-nav">
          <div class="nav-item">🏋️<br>Treinos</div>
          <div class="nav-item active">👥<br>Comunidade</div>
          <div class="nav-item">👤<br>Perfil</div>
          <div class="nav-item">❓<br>Ajuda</div>
          <div class="nav-item">📚<br>Biblioteca</div>
        </div>`;
    default:
      return '';
  }
}

const PORT = 8888;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const screenName = url.searchParams.get('screen');

  if (screenName === 'all') {
    let html = '<html><head><title>NOVAIX Screenshots</title></head><body style="background:#12161A;padding:20px;">';
    html += '<h1 style="color:#CCFF00;font-family:Montserrat;">NOVAIX FITNESS - Screenshots</h1>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:20px;">';
    SCREENS.forEach(s => {
      html += `<div><h3 style="color:white;">${s.name}</h3>`;
      html += `<iframe src="/?screen=${s.name}" width="390" height="844" style="border:2px solid #333;border-radius:12px;"></iframe>`;
      html += '</div>';
    });
    html += '</div></body></html>';
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  const screen = SCREENS.find(s => s.name === screenName);
  if (!screen) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html><body style="background:#12161A;color:white;padding:40px;font-family:Inter;"><h1>NOVAIX Screenshot Generator</h1><p>Use ?screen=all para ver todas</p><p>Ou ?screen=01-login, etc.</p></body></html>');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(generateHTML(screen));
});

server.listen(PORT, () => {
  console.log(`\n📸 NOVAIX Screenshot Generator\n`);
  console.log(`Acesse: http://localhost:${PORT}/?screen=all\n`);
  console.log(`Screens individuais:`);
  SCREENS.forEach(s => {
    console.log(`  http://localhost:${PORT}/?screen=${s.name}`);
  });
  console.log(`\nPara capturar: Abra no navegador e use Print Screen`);
  console.log(`Ou use ferramenta de captura de tela\n`);
});
