// src/components/Layout.jsx
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊', roles: ['admin', 'manager', 'employee'] },
  { path: '/users', label: 'Usuários', icon: '👥', roles: ['admin', 'manager', 'employee'] },
  { path: '/workouts', label: 'Treinos', icon: '💪', roles: ['admin', 'manager', 'creator'] },
  { path: '/payments', label: 'Pagamentos', icon: '💰', roles: ['admin'] },
];

export default function Layout({ children, user, profile, onLogout }) {
  const location = useLocation();
  const role = profile?.role || 'user';
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-novaix-surface border-r border-novaix-border">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-novaix-primary">NOVAIX</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="px-4">
          {visibleMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                location.pathname === item.path
                  ? 'bg-novaix-primary text-black'
                  : 'text-gray-300 hover:bg-novaix-hover'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-novaix-border">
          <div className="text-sm text-gray-400 mb-2">{user.email}</div>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 bg-novaix-error text-white rounded-lg hover:opacity-80"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
