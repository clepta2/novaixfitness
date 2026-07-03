// src/services/library-helpers.js
// Auxiliares para a biblioteca de treinos - NOVAIX FITNESS

export const userLevelMap = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' };
export const CATEGORIES_MAP = { musculacao: 'Musculação', calistenia: 'Calistenia', cardio: 'Cardio', flexibilidade: 'Flexibilidade' };
export const MUSCLE_MAP = {
  chest: 'Peito', back: 'Costas', shoulders: 'Ombros', arms: 'Braços',
  legs: 'Pernas', core: 'Core', glutes: 'Glúteos', full_body: 'Corpo Todo'
};

export function filterLibraryWorkouts({
  workouts,
  selectedCategory,
  searchQuery,
  filterByMyLevel,
  userPhysicalLevel,
  levelFilter,
  durationFilter,
  accessFilter,
  equipmentFilter,
  muscleFilter,
  EQUIPMENT_TO_TAG,
  MUSCLE_TO_BODY_PART
}) {
  const list = workouts || [];
  return list.filter(w => {
    const matchesCat = !selectedCategory || selectedCategory === 'all' || 
      (selectedCategory === 'musculacao' && w.category?.toLowerCase().includes('muscula')) ||
      (selectedCategory === 'calistenia' && w.category?.toLowerCase().includes('calist')) ||
      (selectedCategory === 'cardio' && w.category?.toLowerCase().includes('cardio')) ||
      (selectedCategory === 'flexibilidade' && w.category?.toLowerCase().includes('flexi'));
      
    const query = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || 
      w.title?.toLowerCase().includes(query) || 
      w.name?.toLowerCase().includes(query) ||
      w.category?.toLowerCase().includes(query) ||
      w.exercises?.some(ex => 
        ex.name?.toLowerCase().includes(query) || 
        ex.muscle?.toLowerCase().includes(query)
      );

    const matchesLevel = levelFilter && levelFilter !== 'all' ? w.level === levelFilter : (!filterByMyLevel || !userPhysicalLevel || w.level === userPhysicalLevel);
    
    let matchesDuration = true;
    if (durationFilter && durationFilter !== 'all') {
      const d = w.duration_minutes || w.duration || 30;
      if (durationFilter === 'under30') matchesDuration = d < 30;
      else if (durationFilter === '30to45') matchesDuration = d >= 30 && d <= 45;
      else if (durationFilter === 'over45') matchesDuration = d > 45;
    }

    let matchesAccess = true;
    if (accessFilter && accessFilter !== 'all') {
      if (accessFilter === 'free') matchesAccess = !w.is_premium;
      else if (accessFilter === 'premium') matchesAccess = !!w.is_premium;
    }

    let matchesEquipment = true;
    if (equipmentFilter && equipmentFilter !== 'all') {
      if (equipmentFilter === 'none') {
        matchesEquipment = !w.equipment || w.equipment.length === 0;
      } else {
        matchesEquipment = w.equipment && w.equipment.some(eq => EQUIPMENT_TO_TAG[eq] === equipmentFilter);
      }
    }

    let matchesMuscle = true;
    if (muscleFilter && muscleFilter !== 'all') {
      matchesMuscle = w.exercises && w.exercises.some(ex => {
        const bodyPart = MUSCLE_TO_BODY_PART[ex.muscle];
        return bodyPart === muscleFilter;
      });
    }

    return matchesCat && matchesQuery && matchesLevel && matchesDuration && matchesAccess && matchesEquipment && matchesMuscle;
  });
}
