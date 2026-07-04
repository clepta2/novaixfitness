import React from 'react';
import TestRenderer from 'react-test-renderer';

export function renderHook(hookFn) {
  let result = { current: null };
  let error = null;

  const TestComponent = () => {
    try {
      result.current = hookFn();
    } catch (e) {
      error = e;
    }
    return null;
  };

  let renderer;
  const act = (callback) => {
    return new Promise(async (resolve) => {
      await TestRenderer.act(async () => {
        await callback();
      });
      resolve();
    });
  };

  TestRenderer.act(() => {
    renderer = TestRenderer.create(React.createElement(TestComponent));
  });

  return {
    result,
    rerender: () => {
      TestRenderer.act(() => {
        renderer.update(React.createElement(TestComponent));
      });
    },
    unmount: () => {
      renderer.unmount();
    },
  };
}

export const act = TestRenderer.act;
