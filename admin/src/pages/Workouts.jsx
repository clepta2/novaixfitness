// src/pages/Workouts.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import WorkoutModal from '../components/WorkoutModal';

export default function Workouts({ loggedInUserRole }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const canWrite = loggedInUserRole === 'admin' || loggedInUserRole === 'creator';

  const loadWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('id, title, category, level, duration_minutes, is_premium, created_at')
      .order('created_at', { ascending: false });

    if (!error) setWorkouts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleOpenCreate = () => {
    setSelectedWorkout(null);
    setShowModal(true);
  };

  const handleOpenEdit = (w) => {
    setSelectedWorkout(w);
    setShowModal(true);
  };

  const handleSubmit = async (formValues) => {
    if (!canWrite) return;
    
    let error;
    if (selectedWorkout) {
      const { error: err } = await supabase
        .from('workouts')
        .update(formValues)
        .eq('id', selectedWorkout.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('workouts')
        .insert(formValues);
      error = err;
    }

    if (!error) {
      setShowModal(false);
      loadWorkouts();
    } else {
      alert('Erro ao salvar treino. Tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!canWrite) return;
    if (confirm('Deseja realmente excluir este treino?')) {
      const { error } = await supabase.from('workouts').delete().eq('id', id);
      if (!error) {
        loadWorkouts();
      } else {
        alert('Erro ao deletar treino: ' + error.message);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Treinos</h2>
        {canWrite && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-novaix-primary text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            + Novo Treino
          </button>
        )}
      </div>

      <div className="bg-novaix-surface rounded-xl border border-novaix-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-novaix-border">
              <th className="p-4">Título</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Nível</th>
              <th className="p-4">Duração</th>
              <th className="p-4">Plano</th>
              {canWrite && <th className="p-4">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : workouts.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">Nenhum treino cadastrado</td>
              </tr>
            ) : (
              workouts.map((w) => (
                <tr key={w.id} className="border-b border-novaix-border hover:bg-novaix-hover transition-colors">
                  <td className="p-4 font-medium">
                    <div>{w.title}</div>
                    {w.description && <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{w.description}</div>}
                  </td>
                  <td className="p-4 text-gray-400 capitalize">{w.category || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      w.level === 'advanced' ? 'bg-red-500/20 text-red-400' :
                      w.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {w.level || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{w.duration_minutes || w.duration ? `${w.duration_minutes || w.duration}min` : '-'}</td>
                  <td className="p-4">
                    {w.is_premium ? (
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 font-bold flex items-center gap-1 w-fit">
                        🔒 Premium / Ultra
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 w-fit">
                        Livre
                      </span>
                    )}
                  </td>
                  {canWrite && (
                    <td className="p-4 space-x-3">
                      <button onClick={() => handleOpenEdit(w)} className="text-novaix-primary hover:underline text-sm font-semibold">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(w.id)} className="text-novaix-error hover:underline text-sm font-semibold">
                        Excluir
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <WorkoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        workout={selectedWorkout}
      />
    </div>
  );
}
