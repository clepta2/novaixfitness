import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface LocationTaggerProps {
  onLocationSelect: (location: string) => void;
  currentLocation?: string;
}

export default function LocationTagger({ onLocationSelect, currentLocation }: LocationTaggerProps) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(currentLocation || '');

  useEffect(() => {
    if (currentLocation) setLocation(currentLocation);
  }, [currentLocation]);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const pos = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      const name = place ? `${place.name || ''}, ${place.city || ''}`.trim() : '';
      if (name) {
        setLocation(name);
        onLocationSelect(name);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  if (location) {
    return (
      <View style={styles.tag}>
        <Ionicons name="location" size={14} color={COLORS.primary} />
        <Text style={styles.locationText}>{location}</Text>
        <TouchableOpacity onPress={() => { setLocation(''); onLocationSelect(''); }}>
          <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.addBtn} onPress={fetchLocation} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <Ionicons name="location-outline" size={16} color={COLORS.primary} />
      )}
      <Text style={styles.addText}>{loading ? 'Obtendo local...' : 'Adicionar localização'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.md,
  },
  locationText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textTitle,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.md,
  },
  addText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.primary,
  },
});
