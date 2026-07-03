// src/components/common/NotificationManager.tsx
// Componente reutilizável para gerenciamento de notificações

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import {   requestNotificationPermissions,
  setupWorkoutReminders,
  scheduleHydrationReminder,
  cancelAllWorkoutReminders,
  getActiveReminders } from '../../services/workout';

interface NotificationContextType {
  requestPermissions: () => Promise<boolean>;
  scheduleWorkoutReminder: (hour: number, minute: number, days: number[]) => Promise<boolean>;
  scheduleHydrationReminder: () => Promise<void>;
  cancelAll: () => Promise<void>;
  getActive: () => Promise<Notifications.NotificationRequest[]>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationManagerProps {
  children: ReactNode;
}

export function NotificationManager({ children }: NotificationManagerProps) {
  const requestPermissions = useCallback(async () => {
    return requestNotificationPermissions();
  }, []);

  const scheduleWorkout = useCallback(async (hour: number, minute: number, days: number[]) => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;

    for (const day of days) {
      await Notifications.scheduleNotificationAsync({
        content: { 
          title: 'Hora de treinar!', 
          body: 'Seu treino personalizado está esperando por você.', 
          data: { type: 'workout_reminder' } 
        },
        trigger: { weekday: day, hour, minute, repeats: true },
      });
    }
    return true;
  }, []);

  const scheduleHydration = useCallback(async () => {
    await scheduleHydrationReminder();
  }, []);

  const cancelAll = useCallback(async () => {
    await cancelAllWorkoutReminders();
  }, []);

  const getActive = useCallback(async () => {
    return getActiveReminders();
  }, []);

  return (
    <NotificationContext.Provider value={{
      requestPermissions,
      scheduleWorkoutReminder: scheduleWorkout,
      scheduleHydrationReminder: scheduleHydration,
      cancelAll,
      getActive,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationManager');
  }
  return context;
}
