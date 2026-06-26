// src/hooks/useWorkouts.js
// Hook para buscar treinos do Supabase - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { workouts, loading, error, refetch: fetchWorkouts };
}

export function useWorkout(id) {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchWorkout = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setWorkout(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  return { workout, loading, error };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('*, workouts(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Erro ao buscar favoritos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = async (workoutId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ workout_id: workoutId });

      if (error) throw error;
      fetchFavorites();
    } catch (err) {
      console.error('Erro ao adicionar favorito:', err);
    }
  };

  const removeFavorite = async (workoutId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('workout_id', workoutId);

      if (error) throw error;
      fetchFavorites();
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
    }
  };

  return { favorites, loading, addFavorite, removeFavorite, refetch: fetchFavorites };
}
