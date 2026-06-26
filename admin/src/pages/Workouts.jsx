// src/pages/Workouts.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', level: '', video_url: '', duration_minutes: '' });

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setWorkouts(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('workouts').insert(form);
    if (!error) {
      setShowModal(false);
      setForm({ title: '', description: '', category: '', level: '', video_url: '', duration_minutes: '' });
      loadWorkouts();
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Excluir este treino?')) {
      await supabase.from('workouts').delete().eq('id', id);
      loadWorkouts();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Treinos</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-novaix-primary text-black font-bold rounded-lg hover:opacity-90"
        >
          + Novo Treino
        </button>
      </div>

      <div className="bg-novaix-surface rounded-xl border border-novaix-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-novaix-border">
              <th className="p-4">Título</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Nível</th>
              <th className="p-4">Duração</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : workouts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">Nenhum treino cadastrado</td>
              </tr>
            ) : (
              workouts.map((w) => (
                <tr key={w.id} className="border-b border-novaix-border hover:bg-novaix-hover">
                  <td className="p-4 font-medium">{w.title}</td>
                  <td className="p-4 text-gray-400">{w.category || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      w.level === 'advanced' ? 'bg-red-500/20 text-red-400' :
                      w.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {w.level || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{w.duration_minutes ? `${w.duration_minutes}min` : '-'}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(w.id)} className="text-novaix-error hover:underline text-sm">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-novaix-surface p-6 rounded-xl w-full max-w-md border border-novaix-border">
            <h3 className="text-xl font-bold mb-4">Novo Treino</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Título"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 bg-novaix-bg border border-novaix-border rounded-lg mb-3 focus:outline-none focus:border-novaix-primary"
                required
              />
              <textarea
                placeholder="Descrição"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 bg-novaix-bg border border-novaix-border rounded-lg mb-3 focus:outline-none focus:border-novaix-primary h-24"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-novaix-bg border border-novaix-border rounded-lg mb-3 focus:outline-none focus:border-novaix-primary"
              >
                <option value="">Categoria</option>
                <option value="calistenia">Calistenia</option>
                <option value="musculacao">Musculação</option>
                <option value="cardio">Cardio</option>
                <option value="flexibilidade">Flexibilidade</option>
              </select>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-4 py-3 bg-novaix-bg border border-novaix-border rounded-lg mb-3 focus:outline-none focus:border-novaix-primary"
              >
                <option value="">Nível</option>
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
              <input
                type="url"
                placeholder="URL do vídeo (YouTube)"
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                className="w-full px-4 py-3 bg-novaix-bg border border-novaix-border rounded-lg mb-3 focus:outline-none focus:border-novaix-primary"
              />
              <input
                type="number"
                placeholder="Duração (minutos)"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                className="w-full px-4 py-3 bg-novaix-bg border border-novaix-border rounded-lg mb-4 focus:outline-none focus:border-novaix-primary"
              />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-novaix-primary text-black font-bold rounded-lg">
                  Salvar
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-novaix-bg border border-novaix-border rounded-lg">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
