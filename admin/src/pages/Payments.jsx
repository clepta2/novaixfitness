// src/pages/Payments.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, subscription_status, subscription_plan, created_at')
      .order('created_at', { ascending: false });

    if (!error) setPayments(data);
    setLoading(false);
  };

  const stats = {
    total: payments.length,
    active: payments.filter(p => p.subscription_status === 'active').length,
    free: payments.filter(p => !p.subscription_status || p.subscription_status === 'free').length,
  };

  const mrr = payments
    .filter(p => p.subscription_status === 'active')
    .reduce((sum, p) => {
      if (p.subscription_plan === 'premium') return sum + 119.90;
      if (p.subscription_plan === 'intermediate') return sum + 79.90;
      return sum + 49.90;
    }, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pagamentos</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-novaix-surface p-4 rounded-xl border border-novaix-border">
          <p className="text-gray-400 text-sm">MRR (Receita Mensal)</p>
          <p className="text-2xl font-bold text-novaix-success">R$ {mrr.toFixed(2)}</p>
        </div>
        <div className="bg-novaix-surface p-4 rounded-xl border border-novaix-border">
          <p className="text-gray-400 text-sm">Assinantes Ativos</p>
          <p className="text-2xl font-bold text-novaix-primary">{stats.active}</p>
        </div>
        <div className="bg-novaix-surface p-4 rounded-xl border border-novaix-border">
          <p className="text-gray-400 text-sm">Usuários Free</p>
          <p className="text-2xl font-bold text-gray-400">{stats.free}</p>
        </div>
        <div className="bg-novaix-surface p-4 rounded-xl border border-novaix-border">
          <p className="text-gray-400 text-sm">Total Usuários</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-novaix-surface rounded-xl border border-novaix-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-novaix-border">
              <th className="p-4">Usuário</th>
              <th className="p-4">Plano</th>
              <th className="p-4">Status</th>
              <th className="p-4">Valor Mensal</th>
              <th className="p-4">Desde</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : payments.map((p) => {
              const value = p.subscription_plan === 'premium' ? 119.90 :
                           p.subscription_plan === 'intermediate' ? 79.90 : 49.90;
              return (
                <tr key={p.id} className="border-b border-novaix-border hover:bg-novaix-hover">
                  <td className="p-4">
                    <div className="font-medium">{p.name || '-'}</div>
                    <div className="text-sm text-gray-400">{p.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      p.subscription_plan === 'premium' ? 'bg-yellow-500/20 text-yellow-400' :
                      p.subscription_plan === 'intermediate' ? 'bg-novaix-primary/20 text-novaix-primary' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {p.subscription_plan || 'Básico'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      p.subscription_status === 'active' ? 'bg-novaix-success/20 text-novaix-success' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {p.subscription_status || 'free'}
                    </span>
                  </td>
                  <td className="p-4 font-medium">
                    {p.subscription_status === 'active' ? `R$ ${value.toFixed(2)}` : '-'}
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(p.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
