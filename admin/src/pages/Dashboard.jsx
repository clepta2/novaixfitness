// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalWorkouts: 0,
    recentSignups: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeSubscriptions } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    const { count: totalWorkouts } = await supabase
      .from('workouts')
      .select('*', { count: 'exact', head: true });

    const { data: recentSignups } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    setStats({
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubscriptions || 0,
      totalWorkouts: totalWorkouts || 0,
      recentSignups: recentSignups || []
    });
  };

  const cards = [
    { label: 'Total Usuários', value: stats.totalUsers, icon: '👥', color: 'text-blue-400' },
    { label: 'Assinaturas Ativas', value: stats.activeSubscriptions, icon: '⭐', color: 'text-novaix-primary' },
    { label: 'Total Treinos', value: stats.totalWorkouts, icon: '💪', color: 'text-green-400' },
    { label: 'Receita Mensal', value: 'R$ 0', icon: '💰', color: 'text-yellow-400' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-novaix-surface p-6 rounded-xl border border-novaix-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-3xl font-bold ${card.color}`}>{card.value}</span>
            </div>
            <p className="text-gray-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Signups */}
      <div className="bg-novaix-surface rounded-xl border border-novaix-border p-6">
        <h3 className="text-lg font-bold mb-4">Cadastros Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-novaix-border">
                <th className="pb-3">Nome</th>
                <th className="pb-3">E-mail</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSignups.map((user) => (
                <tr key={user.id} className="border-b border-novaix-border">
                  <td className="py-3">{user.name || '-'}</td>
                  <td className="py-3 text-gray-400">{user.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.subscription_status === 'active'
                        ? 'bg-novaix-success/20 text-novaix-success'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {user.subscription_status || 'free'}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
