// __mocks__/supabase-test.js
// Mock compartilhado para testes de serviço
// Usage: require('../../__mocks__/supabase-test')({data: [...], error: null})

function createServiceMock(defaultState = { data: null, error: null }) {
  const state = { ...defaultState };
  const chain = {};

  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.neq = jest.fn(() => chain);
  chain.gt = jest.fn(() => chain);
  chain.lt = jest.fn(() => chain);
  chain.gte = jest.fn(() => chain);
  chain.lte = jest.fn(() => chain);
  chain.like = jest.fn(() => chain);
  chain.ilike = jest.fn(() => chain);
  chain.in = jest.fn(() => chain);
  chain.is = jest.fn(() => chain);
  chain.order = jest.fn(() => chain);
  chain.limit = jest.fn(() => chain);
  chain.range = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.update = jest.fn(() => chain);
  chain.delete = jest.fn(() => chain);
  chain.upsert = jest.fn(() => chain);
  chain.count = jest.fn(() => chain);
  chain.head = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.maybeSingle = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.then = (resolve, reject) =>
    Promise.resolve({ data: state.data, error: state.error }).then(resolve, reject);
  chain.catch = (fn) =>
    Promise.resolve({ data: state.data, error: state.error }).catch(fn);

  chain._setData = (d) => { state.data = d; };
  chain._setError = (e) => { state.error = e; };
  chain._getState = () => state;

  chain._reset = () => {
    state.data = defaultState.data;
    state.error = defaultState.error;
    chain.from.mockReturnValue(chain);
    chain.select.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    chain.neq.mockReturnValue(chain);
    chain.gt.mockReturnValue(chain);
    chain.lt.mockReturnValue(chain);
    chain.gte.mockReturnValue(chain);
    chain.lte.mockReturnValue(chain);
    chain.like.mockReturnValue(chain);
    chain.ilike.mockReturnValue(chain);
    chain.in.mockReturnValue(chain);
    chain.is.mockReturnValue(chain);
    chain.order.mockReturnValue(chain);
    chain.limit.mockReturnValue(chain);
    chain.range.mockReturnValue(chain);
    chain.insert.mockReturnValue(chain);
    chain.update.mockReturnValue(chain);
    chain.delete.mockReturnValue(chain);
    chain.upsert.mockReturnValue(chain);
    chain.count.mockReturnValue(chain);
    chain.head.mockReturnValue(chain);
    chain.single.mockImplementation(() =>
      Promise.resolve({ data: state.data, error: state.error }));
    chain.maybeSingle.mockImplementation(() =>
      Promise.resolve({ data: state.data, error: state.error }));
  };

  chain._reset();
  return chain;
}

module.exports = { createServiceMock };
