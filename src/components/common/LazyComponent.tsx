// src/components/common/LazyComponent.tsx
// Wrapper para lazy loading de componentes - NOVAIX FITNESS

import React, { Suspense, lazy, ComponentType } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

interface LazyWrapperProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

// Fallback padrão
const DefaultFallback = () => (
  <View style={styles.fallback}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

// Wrapper de lazy loading
export function LazyComponent({ fallback, children }: LazyComponentProps) {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {children}
    </Suspense>
  );
}

// HOC para lazy loading
export function withLazyLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  LoadingComponent?: ComponentType
) {
  const LazyLoadedComponent = (props: P) => (
    <Suspense fallback={LoadingComponent ? <LoadingComponent /> : <DefaultFallback />}>
      <WrappedComponent {...props} />
    </Suspense>
  );

  LazyLoadedComponent.displayName = `withLazyLoading(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return LazyLoadedComponent;
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default LazyComponent;
