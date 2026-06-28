// src/components/UserModal.jsx
import { useState, useEffect } from 'react';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'user',
  subscription_plan: 'free',
  subscription_status: 'free'
};

export default function UserModal({ isOpen, onClose, onSubmit, user, loggedInUserRole }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '', // Não editamos senha diretamente
        role: user.role || 'user',
        subscription_plan: user.subscription_plan || 'free',
        subscription_status: user.subscription_status || 'free'
      });
    } else {
      // Valor padrão da role ao criar depende do cargo de quem está logado
      const defaultRole = 'user';
      setForm({
        ...emptyForm,
        role: defaultRole,
        subscription_plan: 'free',
        subscription_status: 'free'
      });
    }
  }, [user, isOpen, loggedInUserRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      alert(err.message || 'Erro ao processar.');
    } finally {
      setLoading(false);
    }
  };

  // Restrições de opções de cargo com base na hierarquia
  const getAvailableRoles = () => {
    if (loggedInUserRole === 'employee') {
      return [{ value: 'user', label: 'Aluno (Usuário)' }];
    }
    if (loggedInUserRole === 'manager') {
      return [
        { value: 'user', label: 'Aluno (Usuário)' },
        { value: 'employee', label: 'Funcionário' }
      ];
    }
    return [
      { value: 'user', label: 'Aluno (Usuário)' },
      { value: 'employee', label: 'Funcionário' },
      { value: 'manager', label: 'Gerente' },
      { value: 'creator', label: 'Criador de Conteúdo' },
      { value: 'admin', label: 'Administrador' }
    ];
  };

  const showPlanSelect = loggedInUserRole === 'admin' || loggedInUserRole === 'manager';

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-novaix-surface p-6 rounded-xl w-full max-w-md border border-novaix-border">
        <h3 className="text-xl font-bold mb-4 text-novaix-primary">
          {user ? 'Editar Conta' : 'Nova Conta'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome Completo</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
              required
              disabled={!!user} // Não permitimos trocar email na edição para evitar conflitos auth
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Senha Inicial</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
                required
                minLength={6}
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Cargo</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
            >
              {getAvailableRoles().map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {showPlanSelect && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Plano</label>
                <select
                  value={form.subscription_plan}
                  onChange={(e) => setForm({ ...form, subscription_plan: e.target.value })}
                  className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
                >
                  <option value="free">Livre (Free)</option>
                  <option value="basic">Básico</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="premium">Premium</option>
                  <option value="ultra">Ultra Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status Assinatura</label>
                <select
                  value={form.subscription_status}
                  onChange={(e) => setForm({ ...form, subscription_status: e.target.value })}
                  className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
                >
                  <option value="free">Grátis</option>
                  <option value="active">Ativa</option>
                  <option value="inactive">Inativa</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-novaix-primary text-black font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Processando...' : user ? 'Salvar Alterações' : 'Criar Conta'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 bg-novaix-bg border border-novaix-border text-white rounded-lg hover:bg-novaix-hover"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
