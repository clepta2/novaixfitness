// src/components/WorkoutModal.jsx
import { useState, useEffect } from 'react';

const emptyForm = { title: '', description: '', category: 'musculacao', level: 'beginner', video_url: '', duration_minutes: 30, thumbnail_url: '', is_premium: false, exercises: [] };

const exercisesPlaceholder = [{
  id: '1', name: 'Exercício Exemplo', sets: 3, reps: 12, rest: 45, muscle: 'Peito', equipment: 'Halteres',
  steps: [
    { step: 1, text: 'Posição inicial do exercício.', image: 'https://via.placeholder.com/300x200/1E232A/CCFF00?text=Passo+1' },
    { step: 2, text: 'Execução do movimento.', image: 'https://via.placeholder.com/300x200/1E232A/CCFF00?text=Passo+2' }
  ],
  tips: ['Mantenha a postura', 'Respire no topo'], mistakes: ['Curvar as costas'], alternatives: []
}];

export default function WorkoutModal({ isOpen, onClose, onSubmit, workout }) {
  const [form, setForm] = useState(emptyForm);
  const [exercisesText, setExercisesText] = useState('[]');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (workout) {
      setForm({
        title: workout.title || '', description: workout.description || '', category: workout.category || 'musculacao',
        level: workout.level || 'beginner', video_url: workout.video_url || '', duration_minutes: workout.duration_minutes || workout.duration || 30,
        thumbnail_url: workout.thumbnail_url || '', is_premium: workout.is_premium || false, exercises: workout.exercises || []
      });
      setExercisesText(JSON.stringify(workout.exercises || [], null, 2));
    } else {
      setForm(emptyForm);
      setExercisesText(JSON.stringify(exercisesPlaceholder, null, 2));
    }
    setJsonError('');
  }, [workout, isOpen]);

  if (!isOpen) return null;

  const handleExercisesChange = (val) => {
    setExercisesText(val);
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) {
        setJsonError('Exercícios precisam ser uma lista (Array JSON []).');
      } else {
        setJsonError('');
        setForm(prev => ({ ...prev, exercises: parsed }));
      }
    } catch (err) {
      setJsonError('JSON inválido: ' + err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jsonError) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-novaix-surface p-6 rounded-xl w-full max-w-2xl border border-novaix-border my-8">
        <h3 className="text-xl font-bold mb-4 text-novaix-primary">
          {workout ? 'Editar Treino' : 'Novo Treino'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Título</label>
              <input
                type="text"
                placeholder="Ex: Peito e Tríceps"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Duração (minutos)</label>
              <input
                type="number"
                placeholder="Ex: 45"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Descrição</label>
            <textarea
              placeholder="Descrição detalhada do treino..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary h-16 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Categoria</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
              >
                <option value="calistenia">Calistenia</option>
                <option value="musculacao">Musculação</option>
                <option value="cardio">Cardio</option>
                <option value="flexibilidade">Flexibilidade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nível</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL do Vídeo (YouTube)</label>
              <input
                type="url"
                placeholder="https://youtube.com/..."
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL da Imagem de Capa</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white focus:outline-none focus:border-novaix-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="is_premium"
              checked={form.is_premium}
              onChange={(e) => setForm({ ...form, is_premium: e.target.checked })}
              className="w-4 h-4 accent-novaix-primary rounded bg-novaix-bg border-novaix-border"
            />
            <label htmlFor="is_premium" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
              Marcar treino como exclusivo para assinantes Premium / Ultra Premium (🔒)
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-400">Exercícios & Carrossel de Imagens (JSON)</label>
              <span className="text-xs text-novaix-primary">Edite os passos, fotos e dicas aqui</span>
            </div>
            <textarea
              value={exercisesText}
              onChange={(e) => handleExercisesChange(e.target.value)}
              className="w-full px-4 py-2 bg-novaix-bg border border-novaix-border rounded-lg text-white font-mono text-xs focus:outline-none focus:border-novaix-primary h-40"
            />
            {jsonError && <p className="text-xs text-red-500 mt-1">{jsonError}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!!jsonError}
              className="flex-1 py-2 bg-novaix-primary text-black font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {workout ? 'Atualizar Treino' : 'Cadastrar Treino'}
            </button>
            <button
              type="button"
              onClick={onClose}
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
