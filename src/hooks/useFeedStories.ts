// src/hooks/useFeedStories.ts
// Hook de stories e check-in do feed - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayCheckIn, getCheckInStreak, performCheckIn } from '../services/checkIn';
import { getActiveStories } from '../services/social';

const CHECKIN_SHOWN_KEY = '@novaix:checkin_shown_date';

interface StoryGroup {
  userId: string;
  name: string;
  avatar: string | null;
  stories: any[];
  seen: boolean;
}

export function useFeedStories(userId: string | undefined) {
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInStreak, setCheckInStreak] = useState(1);

  useEffect(() => {
    if (!userId) return;
    checkDailyCheckIn(userId);
    loadStories(userId);
  }, [userId]);

  const checkDailyCheckIn = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const shownDate = await AsyncStorage.getItem(CHECKIN_SHOWN_KEY);
      if (shownDate === today) return;
    } catch {}
    const existing = await getTodayCheckIn(uid);
    if (!existing) {
      const streak = await getCheckInStreak(uid);
      setCheckInStreak(streak + 1);
      setShowCheckIn(true);
      try { await AsyncStorage.setItem(CHECKIN_SHOWN_KEY, today); } catch {}
    }
  };

  const loadStories = async (uid: string) => {
    const data = await getActiveStories(uid) as any[];
    const grouped: Record<string, any[]> = {};
    data.forEach((s: any) => {
      if (!grouped[s.user_id]) grouped[s.user_id] = [];
      grouped[s.user_id].push(s);
    });
    setStories(Object.entries(grouped).map(([userId, userStories]) => ({
      userId, name: userStories[0]?.profiles?.name || 'User',
      avatar: userStories[0]?.profiles?.avatar_url || null,
      stories: userStories, seen: false,
    })));
  };

  return { stories, showCheckIn, checkInStreak, setShowCheckIn, loadStories: () => userId && loadStories(userId) };
}
