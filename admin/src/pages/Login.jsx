// src/pages/Login.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onLogin(data.user);
    }
  };

  return (
    <div className="min-h-screen bg-novaix-bg flex items-center justify-center">
      <div className="bg-novaix-surface p-8 rounded-2xl w-full max-w-md border border-novaix-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-novaix-primary">NOVAIX</h1>
          <p className="text-gray-400 mt-2">Painel Administrativo</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-novaix-bg border border-novaix-border rounded-lg focus:outline-none focus:border-novaix-primary"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-novaix-bg border border-novaix-border rounded-lg focus:outline-none focus:border-novaix-primary"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-novaix-error/20 text-novaix-error rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-novaix-primary text-black font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
