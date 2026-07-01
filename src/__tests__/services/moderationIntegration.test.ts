// src/__tests__/services/moderationIntegration.test.ts

import { moderateContent, reportAndModerate } from '../../services/moderationIntegration';
import { WordFilter } from '../../services/wordFilter';
import { moderateText } from '../../services/moderationFilters';
import { checkAndShadowBan, isShadowBanned } from '../../services/shadowBan';
import { alertModerationTeam } from '../../services/moderationAlert';
import { reportContent } from '../../services/moderation';
import { logAction } from '../../services/security/audit';

jest.mock('../../services/wordFilter');
jest.mock('../../services/moderationFilters');
jest.mock('../../services/shadowBan');
jest.mock('../../services/moderationAlert');
jest.mock('../../services/moderation');
jest.mock('../../services/security/audit');

const mockWordFilter = WordFilter as jest.Mocked<typeof WordFilter>;
const mockModerateText = moderateText as jest.MockedFunction<typeof moderateText>;
const mockIsShadowBanned = isShadowBanned as jest.MockedFunction<typeof isShadowBanned>;
const mockCheckAndShadowBan = checkAndShadowBan as jest.MockedFunction<typeof checkAndShadowBan>;
const mockAlertModerationTeam = alertModerationTeam as jest.MockedFunction<typeof alertModerationTeam>;
const mockReportContent = reportContent as jest.MockedFunction<typeof reportContent>;
const mockLogAction = logAction as jest.MockedFunction<typeof logAction>;

beforeEach(() => {
  jest.clearAllMocks();
  mockWordFilter.check.mockReturnValue({ clean: true, masked: '', violations: [] });
  mockModerateText.mockReturnValue({ allowed: true, clean: true });
  mockIsShadowBanned.mockResolvedValue(false);
  mockCheckAndShadowBan.mockResolvedValue(false);
  mockReportContent.mockResolvedValue(true);
  mockAlertModerationTeam.mockResolvedValue();
  mockLogAction.mockResolvedValue();
});

describe('moderateContent', () => {
  it('retorna allowed para conteúdo limpo', async () => {
    const result = await moderateContent('Treino bom!', 'user1');
    expect(result.allowed).toBe(true);
    expect(result.blocked).toBe(false);
    expect(result.severity).toBe('clean');
    expect(result.violations).toEqual([]);
  });

  it('bloqueia conteúdo severo do moderationFilters', async () => {
    mockModerateText.mockReturnValue({
      allowed: false, blocked: true, message: 'Proibido', flags: [],
    });

    const result = await moderateContent('palavrão grave', 'user1');
    expect(result.allowed).toBe(false);
    expect(result.blocked).toBe(true);
    expect(result.severity).toBe('severe');
  });

  it('retorna warning para conteúdo moderado', async () => {
    mockModerateText.mockReturnValue({
      allowed: true, warning: true, message: 'Atenção', flags: [],
    });

    const result = await moderateContent('conteúdo duvidoso', 'user1');
    expect(result.warning).toBe(true);
    expect(result.severity).toBe('moderate');
  });

  it('inclui violations do WordFilter', async () => {
    mockWordFilter.check.mockReturnValue({
      clean: false, masked: '***', violations: ['word'],
    });
    mockModerateText.mockReturnValue({
      allowed: true, warning: true, flags: [],
    });

    const result = await moderateContent('conteúdo', 'user1');
    expect(result.violations).toEqual(['word']);
    expect(result.masked).toBe('***');
  });

  it('bloqueia se usuário está shadow banned', async () => {
    mockIsShadowBanned.mockResolvedValue(true);

    const result = await moderateContent('ok', 'user1');
    expect(result.allowed).toBe(false);
    expect(result.shadowBanned).toBe(true);
  });
});

describe('reportAndModerate', () => {
  it('não cria report quando conteúdo é limpo', async () => {
    const result = await reportAndModerate('ok', 'reporter1', 'target1');
    expect(result.reportCreated).toBe(false);
    expect(result.actionLogged).toBe(false);
    expect(mockReportContent).not.toHaveBeenCalled();
  });

  it('cria report quando conteúdo é bloqueado', async () => {
    mockModerateText.mockReturnValue({
      allowed: false, blocked: true, message: 'Proibido', flags: [],
    });
    mockWordFilter.check.mockReturnValue({
      clean: false, masked: '***', violations: ['bad'],
    });

    const result = await reportAndModerate('ruim', 'reporter1', 'target1');
    expect(result.reportCreated).toBe(true);
    expect(result.actionLogged).toBe(true);
    expect(mockReportContent).toHaveBeenCalledWith('reporter1', expect.objectContaining({
      targetUser: { id: 'target1' },
    }));
    expect(mockLogAction).toHaveBeenCalledWith(
      'target1', 'content_flagged', 'content', null, expect.any(Object),
    );
  });

  it('chama checkAndShadowBan quando bloqueado', async () => {
    mockModerateText.mockReturnValue({
      allowed: false, blocked: true, flags: [],
    });

    await reportAndModerate('ruim', 'r1', 't1');
    expect(mockCheckAndShadowBan).toHaveBeenCalledWith('t1');
  });

  it('envia alerta Discord para severidade severe', async () => {
    mockModerateText.mockReturnValue({
      allowed: false, blocked: true, flags: [],
    });

    const result = await reportAndModerate('grave', 'r1', 't1');
    expect(result.alertSent).toBe(true);
    expect(mockAlertModerationTeam).toHaveBeenCalledWith('t1', 'grave', expect.any(Array));
  });

  it('não envia alerta para severidade moderada', async () => {
    mockModerateText.mockReturnValue({
      allowed: true, warning: true, flags: [],
    });

    const result = await reportAndModerate('meia boca', 'r1', 't1');
    expect(result.alertSent).toBe(false);
    expect(mockAlertModerationTeam).not.toHaveBeenCalled();
  });

  it('loga ação quando warning é retornado', async () => {
    mockModerateText.mockReturnValue({
      allowed: true, warning: true, flags: [],
    });

    await reportAndModerate('suspeito', 'r1', 't1');
    expect(mockLogAction).toHaveBeenCalledWith(
      't1', 'content_flagged', 'content', null, expect.objectContaining({
        severity: 'moderate',
      }),
    );
  });
});
