// src/routes/rankings.ts
// Rotas de Ranking Regional e Geolocalização - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../config/supabase';
import { authenticate } from '../middleware/auth';
import { validateBody, sanitizeString } from '../middleware/validate';
import { asyncHandler } from '../middleware/errorHandler';

const router: Router = express.Router();

// Atualizar localização do usuário
router.post('/location',
  authenticate,
  validateBody({
    state: { required: true, type: 'string', minLength: 2, maxLength: 50 },
    city: { required: true, type: 'string', minLength: 2, maxLength: 100 },
    neighborhood: { type: 'string', maxLength: 100 }
  }),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { state, city, neighborhood } = req.body;

    const cleanState = sanitizeString(state).toUpperCase();
    const cleanCity = sanitizeString(city);
    const cleanNeighborhood = neighborhood ? sanitizeString(neighborhood) : null;

    const { error } = await supabase
      .from('profiles')
      .update({
        state: cleanState,
        city: cleanCity,
        neighborhood: cleanNeighborhood,
        updated_at: new Date()
      })
      .eq('id', userId);

    if (error) throw error;

    res.json({ success: true, message: 'Localização regional atualizada com sucesso' });
  })
);

// Obter ranking regional dinâmico (Fallback de Nível Bairro -> Cidade -> Estado)
router.get('/',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    // 1. Obter localização do usuário logado
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('state, city, neighborhood')
      .eq('id', userId)
      .single();

    if (userError || !user || !user.state || !user.city) {
      return res.json({
        level: 'state',
        region: 'Geral',
        message: 'Defina sua localização para ver o ranking regional',
        rankings: []
      });
    }

    const currentPeriod = 'monthly';
    const periodStart = new Date().toISOString().substring(0, 7) + '-01';

    // 2. Tentar nível Bairro (Neighborhood)
    if (user.neighborhood) {
      const { count: neighborhoodCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('state', user.state)
        .eq('city', user.city)
        .eq('neighborhood', user.neighborhood);

      if (neighborhoodCount !== null && neighborhoodCount >= 10) {
        const { data: rankings, error } = await supabase
          .from('regional_rankings')
          .select('points, profiles(name, avatar_url)')
          .eq('region', user.state)
          .eq('city', user.city)
          .eq('neighborhood', user.neighborhood)
          .eq('period', currentPeriod)
          .order('points', { ascending: false })
          .limit(50);

        if (error) throw error;

        return res.json({
          level: 'neighborhood',
          region: user.neighborhood,
          rankings: rankings || []
        });
      }
    }

    // 3. Tentar nível Cidade (City)
    const { count: cityCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('state', user.state)
      .eq('city', user.city);

    if (cityCount !== null && cityCount >= 10) {
      const { data: rawRankings, error } = await supabase
        .from('regional_rankings')
        .select('user_id, points, profiles(name, avatar_url)')
        .eq('region', user.state)
        .eq('city', user.city)
        .eq('period', currentPeriod);

      if (error) throw error;

      // Agrupar pontos por usuário (vários bairros na mesma cidade)
      const aggregated: Record<string, { name: string; avatar_url: string | null; points: number }> = {};
      (rawRankings || []).forEach((r: any) => {
        const uid = r.user_id;
        if (!aggregated[uid]) {
          aggregated[uid] = {
            name: r.profiles?.name || 'Atleta',
            avatar_url: r.profiles?.avatar_url || null,
            points: 0
          };
        }
        aggregated[uid].points += r.points || 0;
      });

      const sorted = Object.values(aggregated)
        .sort((a, b) => b.points - a.points)
        .slice(0, 50);

      return res.json({
        level: 'city',
        region: user.city,
        rankings: sorted
      });
    }

    // 4. Fallback nível Estado (Region/State)
    const { data: rawRankings, error } = await supabase
      .from('regional_rankings')
      .select('user_id, points, profiles(name, avatar_url)')
      .eq('region', user.state)
      .eq('period', currentPeriod);

    if (error) throw error;

    const aggregated: Record<string, { name: string; avatar_url: string | null; points: number }> = {};
    (rawRankings || []).forEach((r: any) => {
      const uid = r.user_id;
      if (!aggregated[uid]) {
        aggregated[uid] = {
          name: r.profiles?.name || 'Atleta',
          avatar_url: r.profiles?.avatar_url || null,
          points: 0
        };
      }
      aggregated[uid].points += r.points || 0;
    });

    const sorted = Object.values(aggregated)
      .sort((a, b) => b.points - a.points)
      .slice(0, 50);

    res.json({
      level: 'state',
      region: user.state,
      rankings: sorted
    });
  })
);

export = router;
