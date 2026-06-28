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
      setError(error.message === 'Invalid login credentials' ? 'Credenciais inválidas. Tente novamente.' : error.message);
      setLoading(false);
    } else {
      onLogin(data.user);
    }
  };

  return (
    <div className="min-h-screen bg-novaix-bg font-sans flex items-center justify-center p-4">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Styled SVG Logo matching the Nix brand mockup */}
          <div className="w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Green Runner + Upward Arrow Silhouette */}
              <path
                d="M30 75 L45 35 L55 35 L62 55 L75 30"
                stroke="#CCFF00"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M25 65 C25 60, 35 60, 35 65 C35 70, 25 70, 25 75 C25 80, 35 80, 35 75"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Arrow Head */}
              <path
                d="M40 42 L45 35 L52 40"
                stroke="#CCFF00"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Runner head dot */}
              <circle cx="75" cy="24" r="6" fill="#CCFF00" />
              {/* "ix" typography */}
              <text x="52" y="52" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="Montserrat">ix</text>
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold font-title text-novaix-primary tracking-wider uppercase">
            NOVAIX FITNESS
          </h1>
          <p className="text-gray-400 font-title font-semibold text-sm mt-1 tracking-wide">
            Sua Nova Evolução no Treino
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-novaix-surface p-8 rounded-2xl border border-novaix-border shadow-2xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                E-mail ou CPF
              </label>
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-novaix-bg border border-novaix-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-novaix-primary transition-colors text-sm"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Senha
                </label>
                <a href="#forgot" className="text-xs text-gray-500 hover:text-white transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
              <input
                type="password"
                placeholder="Sua senha secreta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-novaix-bg border border-novaix-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-novaix-primary transition-colors text-sm"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/30 border border-novaix-error/30 text-novaix-error rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-novaix-primary text-black font-extrabold font-title rounded-xl hover:opacity-90 active:scale-[0.99] transition-all tracking-wider text-sm"
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-6 pt-6 border-t border-novaix-border space-y-3">
            <button className="w-full py-2.5 bg-white text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.79 5.79 0 0 1 8.2 12.725a5.79 5.79 0 0 1 5.79-5.79c1.478 0 2.828.552 3.864 1.455l3.228-3.228C19.12 3.327 16.73 2.1 13.99 2.1c-5.464 0-9.9 4.436-9.9 9.9s4.436 9.9 9.9 9.9c5.29 0 9.774-3.834 9.774-9.9 0-.585-.052-1.15-.152-1.715H12.24Z"/>
              </svg>
              Entrar com Google
            </button>
            <button className="w-full py-2.5 bg-novaix-bg border border-novaix-border text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-novaix-hover transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.73-1.2 1.88-1.05 2.99 1.12.09 2.27-.57 3-1.44Z"/>
              </svg>
              Entrar com Apple
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Ainda não tem conta?{' '}
            <a href="#register" className="text-novaix-primary font-bold hover:underline transition-all">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
