// __tests__/middleware/validate.test.js
// Testes completos do middleware de validação - NOVAIX FITNESS

const {
  sanitizeString,
  sanitizeObject,
  validateEmail,
  validatePassword,
  validateRequired,
  validateRange,
  validateQuery,
  validateBody,
} = require('../../src/middleware/validate');

describe('Validate Middleware', () => {
  // ===================================================================
  // sanitizeString
  // ===================================================================
  describe('sanitizeString', () => {
    it('deve remover caracteres < e >', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('deve fazer trim em espaços', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('deve retornar non-string como está', () => {
      expect(sanitizeString(123)).toBe(123);
      expect(sanitizeString(null)).toBe(null);
      expect(sanitizeString(undefined)).toBe(undefined);
    });

    it('deve limpar múltiplos tags', () => {
      expect(sanitizeString('<b><i>text</i></b>')).toBe('bitext/i/b');
    });

    it('deve manter strings sem tags', () => {
      expect(sanitizeString('hello world')).toBe('hello world');
    });
  });

  // ===================================================================
  // sanitizeObject
  // ===================================================================
  describe('sanitizeObject', () => {
    it('deve sanitizar strings em objeto', () => {
      const input = { name: '<b>test</b>', age: 25 };
      const result = sanitizeObject(input);
      expect(result.name).toBe('btest/b');
      expect(result.age).toBe(25);
    });

    it('deve sanitizar objetos aninhados', () => {
      const input = { nested: { value: '<img src=x onerror=alert(1)>' } };
      const result = sanitizeObject(input);
      expect(result.nested.value).not.toContain('<');
    });

    it('deve retornar non-object como está', () => {
      expect(sanitizeObject(null)).toBe(null);
      expect(sanitizeObject('string')).toBe('string');
      expect(sanitizeObject(123)).toBe(123);
    });

    it('deve converter arrays para objetos', () => {
      const input = { items: [1, 2, 3] };
      const result = sanitizeObject(input);
      expect(result.items).toEqual({ 0: 1, 1: 2, 2: 3 });
    });

    it('deve sanitizar array de strings', () => {
      const input = { tags: ['<b>bold</b>', 'normal'] };
      const result = sanitizeObject(input);
      expect(result.tags[0]).toBe('bbold/b');
      expect(result.tags[1]).toBe('normal');
    });

    it('deve lidar com objeto vazio', () => {
      expect(sanitizeObject({})).toEqual({});
    });
  });

  // ===================================================================
  // validateEmail
  // ===================================================================
  describe('validateEmail', () => {
    it('deve aceitar emails válidos', () => {
      expect(validateEmail('test@test.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('a+b@test.com')).toBe(true);
    });

    it('deve rejeitar emails inválidos', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@test.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('test.com')).toBe(false);
      expect(validateEmail('test @test.com')).toBe(false);
    });
  });

  // ===================================================================
  // validatePassword
  // ===================================================================
  describe('validatePassword', () => {
    it('deve aceitar senhas com 6+ caracteres', () => {
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('password')).toBe(true);
      expect(validatePassword('a'.repeat(100))).toBe(true);
    });

    it('deve rejeitar senhas curtas', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('')).toBe(false);
      expect(validatePassword('abc')).toBe(false);
    });

    it('deve rejeitar non-string', () => {
      expect(validatePassword(123456)).toBe(false);
      expect(validatePassword(null)).toBe(false);
      expect(validatePassword(undefined)).toBe(false);
    });
  });

  // ===================================================================
  // validateRequired
  // ===================================================================
  describe('validateRequired', () => {
    it('deve retornar null quando todos campos presentes', () => {
      const result = validateRequired(['name', 'email'], { name: 'Test', email: 'test@test.com' });
      expect(result).toBeNull();
    });

    it('deve retornar erro com campos faltantes', () => {
      const result = validateRequired(['name', 'email'], { name: 'Test' });
      expect(result).toContain('email');
    });

    it('deve retornar erro com múltiplos campos faltantes', () => {
      const result = validateRequired(['name', 'email', 'phone'], { name: 'Test' });
      expect(result).toContain('email');
      expect(result).toContain('phone');
    });

    it('deve tratar string vazia como ausente', () => {
      const result = validateRequired(['name'], { name: '' });
      expect(result).toContain('name');
    });

    it('deve tratar null como ausente', () => {
      const result = validateRequired(['name'], { name: null });
      expect(result).toContain('name');
    });
  });

  // ===================================================================
  // validateRange
  // ===================================================================
  describe('validateRange', () => {
    it('deve retornar número válido', () => {
      expect(validateRange('5', 1, 10, 'test')).toBe(5);
    });

    it('deve retornar erro para número acima do max', () => {
      expect(typeof validateRange('15', 1, 10, 'test')).toBe('string');
    });

    it('deve retornar erro para número abaixo do min', () => {
      expect(typeof validateRange('0', 1, 10, 'test')).toBe('string');
      expect(typeof validateRange('-5', 1, 10, 'test')).toBe('string');
    });

    it('deve retornar erro para NaN', () => {
      expect(typeof validateRange('abc', 1, 10, 'test')).toBe('string');
    });

    it('deve aceitar valor no limite', () => {
      expect(validateRange('1', 1, 10, 'test')).toBe(1);
      expect(validateRange('10', 1, 10, 'test')).toBe(10);
    });
  });

  // ===================================================================
  // validateQuery middleware
  // ===================================================================
  describe('validateQuery', () => {
    let req, res, next;

    beforeEach(() => {
      req = { query: {} };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    it('deve chamar next para query válida', () => {
      req.query = { limit: '10' };
      const middleware = validateQuery({ limit: { type: 'number', min: 1, max: 100 } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve converter string para número', () => {
      req.query = { limit: '25' };
      const middleware = validateQuery({ limit: { type: 'number', min: 1, max: 100 } });
      middleware(req, res, next);
      expect(req.query.limit).toBe(25);
    });

    it('deve retornar 400 para número fora do range', () => {
      req.query = { limit: '999' };
      const middleware = validateQuery({ limit: { type: 'number', min: 1, max: 100 } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar enum válido', () => {
      req.query = { level: 'beginner' };
      const middleware = validateQuery({ level: { enum: ['beginner', 'advanced'] } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 para enum inválido', () => {
      req.query = { level: 'invalid' };
      const middleware = validateQuery({ level: { enum: ['beginner', 'advanced'] } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve ignorar query params não definidos no schema', () => {
      req.query = { unknown: 'value' };
      const middleware = validateQuery({});
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve ignorar query params vazios', () => {
      req.query = { search: '' };
      const middleware = validateQuery({ search: { type: 'string' } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve validar campo required', () => {
      req.query = {};
      const middleware = validateQuery({ id: { required: true } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar pattern', () => {
      req.query = { code: 'ABC123' };
      const middleware = validateQuery({ code: { pattern: /^[A-Z]{3}\d{3}$/ } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 para pattern inválido', () => {
      req.query = { code: 'invalid' };
      const middleware = validateQuery({ code: { pattern: /^[A-Z]{3}\d{3}$/ } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ===================================================================
  // validateBody middleware
  // ===================================================================
  describe('validateBody', () => {
    let req, res, next;

    beforeEach(() => {
      req = { body: {} };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    it('deve chamar next para body válido', () => {
      req.body = { email: 'test@test.com', password: '123456' };
      const middleware = validateBody({
        email: { required: true, type: 'email' },
        password: { required: true, type: 'password' },
      });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 para campo obrigatório faltando', () => {
      req.body = { email: 'test@test.com' };
      const middleware = validateBody({
        email: { required: true },
        password: { required: true },
      });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve retornar 400 para email inválido', () => {
      req.body = { email: 'invalid' };
      const middleware = validateBody({ email: { type: 'email' } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve sanitizar body', () => {
      req.body = { name: '<script>alert(1)</script>' };
      const middleware = validateBody({});
      middleware(req, res, next);
      expect(req.body.name).not.toContain('<script>');
    });

    it('deve validar type string', () => {
      req.body = { name: 123 };
      const middleware = validateBody({ name: { type: 'string' } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar minLength', () => {
      req.body = { name: 'ab' };
      const middleware = validateBody({ name: { type: 'string', minLength: 3 } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar maxLength', () => {
      req.body = { name: 'a'.repeat(101) };
      const middleware = validateBody({ name: { type: 'string', maxLength: 100 } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar enum válido', () => {
      req.body = { status: 'active' };
      const middleware = validateBody({ status: { enum: ['active', 'inactive'] } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 para enum inválido', () => {
      req.body = { status: 'invalid' };
      const middleware = validateBody({ status: { enum: ['active', 'inactive'] } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar type number', () => {
      req.body = { age: 'abc' };
      const middleware = validateBody({ age: { type: 'number' } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar number min', () => {
      req.body = { age: 5 };
      const middleware = validateBody({ age: { type: 'number', min: 18 } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar number max', () => {
      req.body = { age: 200 };
      const middleware = validateBody({ age: { type: 'number', max: 150 } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve aceitar number válido', () => {
      req.body = { age: 25 };
      const middleware = validateBody({ age: { type: 'number', min: 0, max: 150 } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve validar type array', () => {
      req.body = { items: 'not-array' };
      const middleware = validateBody({ items: { type: 'array' } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar array minItems', () => {
      req.body = { items: [1] };
      const middleware = validateBody({ items: { type: 'array', minItems: 3 } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar array maxItems', () => {
      req.body = { items: [1, 2, 3, 4, 5, 6] };
      const middleware = validateBody({ items: { type: 'array', maxItems: 3 } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar array minItems (após sanitização)', () => {
      req.body = { items: [] };
      const middleware = validateBody({ items: { type: 'array', minItems: 1 } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve validar password curta', () => {
      req.body = { password: '123' };
      const middleware = validateBody({ password: { type: 'password' } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve aceitar password válida', () => {
      req.body = { password: '123456' };
      const middleware = validateBody({ password: { type: 'password' } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve validar pattern', () => {
      req.body = { code: 'ABC123' };
      const middleware = validateBody({ code: { pattern: /^[A-Z]{3}\d{3}$/ } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 400 para pattern inválido', () => {
      req.body = { code: 'invalid' };
      const middleware = validateBody({ code: { pattern: /^[A-Z]{3}\d{3}$/ } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve ignorar campos não definidos no schema', () => {
      req.body = { unknown: 'value' };
      const middleware = validateBody({});
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve ignorar campos com valor vazio quando não required', () => {
      req.body = { name: '' };
      const middleware = validateBody({ name: { type: 'string', minLength: 3 } });
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve tratar null como ausente para required', () => {
      req.body = { name: null };
      const middleware = validateBody({ name: { required: true } });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve retornar múltiplos erros', () => {
      req.body = {};
      const middleware = validateBody({
        name: { required: true },
        email: { required: true },
        age: { required: true }
      });
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const errorCall = res.json.mock.calls[0][0];
      expect(errorCall.error).toContain('name');
      expect(errorCall.error).toContain('email');
      expect(errorCall.error).toContain('age');
    });
  });
});
