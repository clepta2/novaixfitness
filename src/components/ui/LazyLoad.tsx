// src/components/ui/LazyLoad.js
// Componente de lazy loading para images e conteudo - NOVAIX FITNESS

import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export function LazyImage({ source, style, placeholderColor = COLORS.surface, resizeMode = 'cover' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const opacity = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (loaded) {
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [loaded, opacity]);

  if (error) {
    return <View style={[styles.placeholder, { backgroundColor: placeholderColor }, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.placeholder, { backgroundColor: placeholderColor }]} />
      {!loaded && (
        <Animated.View style={[styles.loader, { opacity: opacity.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }) }]}>
          <View style={styles.shimmer} />
        </Animated.View>
      )}
    </View>
  );
}

export function LazySection({ children, threshold = 0.1 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = {
      observe: () => setVisible(true),
      unobserve: () => {},
    };

    if (ref.current && 'IntersectionObserver' in global) {
      const io = new (global as any).IntersectionObserver(([entry]: any) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      }, { threshold });
      io.observe(ref.current);
      return () => io.disconnect();
    }

    setVisible(true);
  }, [threshold]);

  return (
    <View ref={ref} style={styles.lazySection}>
      {visible ? children : <View style={styles.placeholderSection} />}
    </View>
  );
}

export function InfiniteScroll({ items, renderItem, onLoadMore, hasMore, loading }) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!loading && hasMore) {
      const timer = setTimeout(() => {
        setPage(prev => prev + 1);
        onLoadMore?.(page + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, hasMore, page, onLoadMore]);

  return (
    <View>
      {items.map((item, index) => (
        <React.Fragment key={item.id || index}>
          {renderItem({ item, index })}
        </React.Fragment>
      ))}
      {loading && <View style={styles.loadingIndicator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  placeholder: {
    ...StyleSheet.absoluteFill,
  },
  loader: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  lazySection: {
    minHeight: 100,
  },
  placeholderSection: {
    height: 100,
    backgroundColor: COLORS.surface,
  },
  loadingIndicator: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
