// src/pages/Users.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import UserModal from '../components/UserModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Users({ loggedInUserRole }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenCreate = () => { setSelectedUser(null); setShowModal(true); };
  const handleOpenEdit = (user) => { setSelectedUser(user); setShowModal(true); };

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` };
  };

  const handleSubmit = async (formValues) => {
    const headers = await getAuthHeaders();
    let response;

    if (selectedUser) {
      // Editar usuário existente
      response = await fetch(`${API_BASE}/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: formValues.name,
          role: formValues.role,
          subscription_plan: formValues.subscription_plan,
          subscription_status: formValues.subscription_status
        })
      });
    } else {
      // Criar novo usuário
      response = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formValues)
      });
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao salvar usuário.');
    }

    alert(selectedUser ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (loggedInUserRole !== 'admin') return;
    if (confirm('Deseja realmente excluir esta conta permanentemente?')) {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Erro ao excluir usuário.');
      } else {
        alert('Usuário excluído com sucesso!');
        loadUsers();
      }
    }
  };

  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const canEdit = loggedInUserRole === 'admin' || loggedInUserRole === 'manager';
  const canDelete = loggedInUserRole === 'admin';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Usuários</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
          />
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-novaix-primary text-black font-bold rounded-lg hover:opacity-90"
          >
            + Novo Usuário
          </button>
        </div>
      </div>

      <div className="bg-novaix-surface rounded-xl border border-novaix-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-novaix-border">
              <th className="p-4">Nome</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Cargo</th>
              <th className="p-4">Plano</th>
              <th className="p-4">Status</th>
              {(canEdit || canDelete) && <th className="p-4">Ações</th>}
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
                <tr key={user.id} className="border-b border-novaix-border hover:bg-novaix-hover transition-colors">
                  <td className="p-4 font-medium text-white">{user.name || '-'}</td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300 font-semibold uppercase">
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                      user.subscription_plan === 'ultra' ? 'bg-purple-500/20 text-purple-400 font-extrabold' :
                      user.subscription_plan === 'premium' ? 'bg-yellow-500/20 text-yellow-400 font-bold' :
                      user.subscription_plan === 'intermediate' ? 'bg-novaix-primary/20 text-novaix-primary' :
                      user.subscription_plan === 'basic' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {user.subscription_plan || 'free'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                      user.subscription_status === 'active' ? 'bg-novaix-success/20 text-novaix-success font-semibold' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {user.subscription_status || 'free'}
                    </span>
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="p-4 space-x-3">
                      {canEdit && (user.role !== 'admin' || loggedInUserRole === 'admin') && (
                        <button onClick={() => handleOpenEdit(user)} className="text-novaix-primary hover:underline text-sm font-semibold">
                          Editar
                        </button>
                      )}
                      {canDelete && user.role !== 'admin' && (
                        <button onClick={() => handleDelete(user.id)} className="text-novaix-error hover:underline text-sm font-semibold">
                          Excluir
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Total: {filteredUsers.length} usuário(s)
      </div>

      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        loggedInUserRole={loggedInUserRole}
      />
    </div>
  );
}
