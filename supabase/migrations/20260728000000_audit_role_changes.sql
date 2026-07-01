-- ============================================
-- NOVAIX FITNESS - RASTREABILIDADE DE CARGOS (AUDIT LOG TRIGGER)
-- ============================================

-- 1. Criar função de trigger para capturar alterações de cargo
CREATE OR REPLACE FUNCTION public.log_profile_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.audit_log (user_id, action, entity_type, entity_id, details)
    VALUES (
      auth.uid(),
      'role_changed',
      'profile',
      NEW.id,
      jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Vincular o trigger de auditoria à tabela profiles
DROP TRIGGER IF EXISTS on_profile_role_change ON public.profiles;
CREATE TRIGGER on_profile_role_change
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_role_change();
