import { ProfileConfigScreen } from '../../../src/components';
import { useI18n } from '../../../src/i18n';
import { useResponsive } from '../../../src/hooks/useResponsive';

export default function ProfileScreen() {
  const { t } = useI18n();
  const { isSmall } = useResponsive();
  return <ProfileConfigScreen headerIcon="person" screenName={t('profile.account')} tutorialKey="perfil" isSmall={isSmall} />;
}
