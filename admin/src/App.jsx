// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Workouts from './pages/Workouts';
import Payments from './pages/Payments';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setProfile(data);
      }
    }
    loadProfile();
  }, [user]);

  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen bg-novaix-bg flex items-center justify-center">
        <div className="text-novaix-primary text-xl font-bold">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const role = profile?.role || 'user';

  return (
    <Layout user={user} profile={profile} onLogout={() => supabase.auth.signOut()}>
      <Routes>
        {role === 'creator' ? (
          <>
            <Route path="/workouts" element={<Workouts loggedInUserRole={role} />} />
            <Route path="*" element={<Navigate to="/workouts" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users loggedInUserRole={role} />} />
            {(role === 'admin' || role === 'manager') && (
              <Route path="/workouts" element={<Workouts loggedInUserRole={role} />} />
            )}
            {role === 'admin' && (
              <Route path="/payments" element={<Payments />} />
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Layout>
  );
}

export default App;
