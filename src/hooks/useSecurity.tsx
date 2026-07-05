// Hook de segurança completo: bloqueios, moderação, conteúdo

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { canPerformAction, logAction, ACTIONS, isBlocked } from '../services/security';
import { moderateText, moderateImage, moderateUsername, preModerateContent } from '../services/contentModeration';
import { useAuth } from '../context/AuthContext';

interface BlockInfo {
  blocked: boolean;
  blockSeverity?: string;
  blockReason?: string;
  rateLimited?: boolean;
  [key: string]: unknown;
}

interface ModerationResult {
  allowed: boolean;
  blocked?: boolean;
  warning?: boolean;
  message?: string;
  clean?: boolean;
  warned?: boolean;
  [key: string]: unknown;
}

interface SecurityCheck {
  blocked: boolean;
  rateLimited: boolean;
  blockSeverity?: string;
  blockReason?: string;
  [key: string]: unknown;
}

interface UseSecurityReturn {
  checkAndPerform: (_actionType: string, _blockType: string, _actionFn: () => Promise<void>, _errorMessage?: string) => Promise<boolean>;
  checkBlock: (_blockType: string) => Promise<BlockInfo | null>;
  log: (_action: string, _entityType: string, _entityId: string, _details?: Record<string, unknown>) => Promise<void>;
  checkText: (_text: string) => ModerationResult;
  checkImage: (_file: unknown) => ModerationResult;
  checkUsername: (_username: string) => ModerationResult;
  checkContent: (_contentType: string, _content: string) => Promise<ModerationResult>;
  getCensoredText: (_text: string) => string;
  blocked: BlockInfo | null;
  clearBlocked: () => void;
  ACTIONS: typeof ACTIONS;
}

export function useSecurity(): UseSecurityReturn {
  const { user } = useAuth();
  const [blocked, setBlocked] = useState<BlockInfo | null>(null);

  const checkAndPerform = useCallback(async (
    actionType: string,
    blockType: string,
    actionFn: () => Promise<void>,
    errorMessage?: string,
  ): Promise<boolean> => {
    if (!user?.id) return false;

    const check: SecurityCheck = await canPerformAction(user.id, actionType, blockType) as any;

    if (check.blocked) {
      setBlocked(check as BlockInfo);
      Alert.alert(
        'Conta Bloqueada',
        check.blockSeverity === 'permanent'
          ? `Sua conta foi bloqueada permanentemente.\n\nMotivo: ${check.blockReason}`
          : `Sua conta está bloqueada temporariamente.\n\nMotivo: ${check.blockReason}\n\nTente novamente mais tarde.`,
        [{ text: 'OK' }]
      );
      return false;
    }

    if (check.rateLimited) {
      Alert.alert(
        'Muitas ações',
        'Você está fazendo muitas ações rapidamente. Aguarde alguns minutos.',
        [{ text: 'OK' }]
      );
      return false;
    }

    try {
      await actionFn();
      return true;
    } catch (_err) {
      if (errorMessage) {
        Alert.alert('Erro', errorMessage);
      }
      return false;
    }
  }, [user?.id]);

  const checkBlock = useCallback(async (blockType: string): Promise<BlockInfo | null> => {
    if (!user?.id) return null;
    const result = await isBlocked(user.id, blockType);
    setBlocked(result.blocked ? (result as any) : null);
    return result as any;
  }, [user?.id]);

  const log = useCallback(async (action: string, entityType: string, entityId: string, details?: Record<string, unknown>): Promise<void> => {
    if (!user?.id) return;
    await logAction(user.id, action, entityType, entityId, details);
  }, [user?.id]);

  const checkText = useCallback((text: string): ModerationResult => {
    const result = moderateText(text, user?.id as any);

    if (result.blocked) {
      Alert.alert('Conteúdo Bloqueado', result.message, [{ text: 'OK' }]);
      return { ...result, allowed: false } as ModerationResult;
    }

    if (result.warning) {
      Alert.alert('Atenção', result.message, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Publicar Mesmo Assim', onPress: () => {} },
      ]);
      return { ...result, allowed: true, warned: true } as ModerationResult;
    }

    return { allowed: true, clean: true };
  }, [user?.id]);

  const checkImage = useCallback((file: unknown): ModerationResult => {
    const result = moderateImage(file, user?.id as any);

    if (result.blocked) {
      Alert.alert('Imagem Bloqueada', result.message, [{ text: 'OK' }]);
      return { ...result, allowed: false } as ModerationResult;
    }

    return { allowed: true, clean: true };
  }, [user?.id]);

  const checkUsername = useCallback((username: string): ModerationResult => {
    const result = moderateUsername(username);

    if (!result.allowed) {
      Alert.alert('Nome Inválido', result.message, [{ text: 'OK' }]);
      return { ...result, allowed: false } as ModerationResult;
    }

    return { allowed: true };
  }, []);

  const checkContent = useCallback(async (contentType: string, content: string): Promise<ModerationResult> => {
    if (!user?.id) return { allowed: true };
    return preModerateContent(user.id, contentType as any, content) as any;
  }, [user?.id]);

  const getCensoredText = useCallback((text: string): string => {
    const { censorText } = require('../data/bannedWords');
    return censorText(text);
  }, []);

  return {
    checkAndPerform,
    checkBlock,
    log,
    checkText,
    checkImage,
    checkUsername,
    checkContent,
    getCensoredText,
    blocked,
    clearBlocked: () => setBlocked(null),
    ACTIONS,
  };
}

export default useSecurity;
