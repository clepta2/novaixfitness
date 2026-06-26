// src/pages/Users.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setUsers(data);
    setLoading(false);
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Usuários</h2>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg focus:outline-none focus:border-novaix-primary"
        />
      </div>

      <div className="bg-novaix-surface rounded-xl border border-novaix-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-novaix-border">
              <th className="p-4">Nome</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Plano</th>
              <th className="p-4">Status</th>
              <th className="p-4">Cadastro</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">Nenhum usuário encontrado</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-novaix-border hover:bg-novaix-hover">
                  <td className="p-4 font-medium">{user.name || '-'}</td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.subscription_plan === 'premium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : user.subscription_plan === 'intermediate'
                        ? 'bg-novaix-primary/20 text-novaix-primary'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {user.subscription_plan || 'Básico'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.subscription_status === 'active'
                        ? 'bg-novaix-success/20 text-novaix-success'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {user.subscription_status || 'free'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <button className="text-novaix-primary hover:underline text-sm">
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Total: {filteredUsers.length} usuário(s)
      </div>
    </div>
  );
}
