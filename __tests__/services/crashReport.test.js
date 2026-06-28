jest.mock('../../src/config/supabase', () => ({
  supabase: { from: jest.fn(() => ({ insert: jest.fn().mockResolvedValue({}) })) },
}));

jest.mock('react-native', () => ({ Platform: { OS: 'ios', Version: '17.0' } }));

const { setCrashUser, addBreadcrumb, reportCrash, reportHandledError } = require('../../src/services/crashReport');

beforeEach(() => jest.clearAllMocks());

describe('crashReport', () => {
  it('reportCrash sends data to supabase', async () => {
    await reportCrash(new Error('test error'), { screen: 'home' });
    const { supabase } = require('../../src/config/supabase');
    expect(supabase.from).toHaveBeenCalledWith('crash_reports');
  });

  it('reportCrash does nothing when error is null', async () => {
    await reportCrash(null);
    const { supabase } = require('../../src/config/supabase');
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('reportHandledError sends to supabase', async () => {
    await reportHandledError(new Error('handled'), 'login');
    const { supabase } = require('../../src/config/supabase');
    expect(supabase.from).toHaveBeenCalledWith('handled_errors');
  });

  it('addBreadcrumb stores breadcrumbs', () => {
    addBreadcrumb('nav', 'screen opened', { screen: 'home' });
    addBreadcrumb('action', 'button pressed', { button: 'start' });
  });
});
