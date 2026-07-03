import { StyleSheet } from 'react-native';
import { ThemeColors } from '../constants/colors';

type StyleFn<T> = (colors: ThemeColors) => T;

export function makeStyles<T extends Record<string, any>>(styleFn: StyleFn<T>) {
  return (colors: ThemeColors) => StyleSheet.create(styleFn(colors));
}
