declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}

declare module 'expo-crypto' {
  export enum CryptoDigestAlgorithm { SHA1 = 'SHA-1', SHA256 = 'SHA-256', SHA384 = 'SHA-384', SHA512 = 'SHA-512' }
  export function digestStringAsync(algorithm: CryptoDigestAlgorithm | string, data: string): Promise<string>;
}

declare module 'expo-device' {
  export function getDeviceNameAsync(): Promise<string>;
  export function getDeviceTypeAsync(): Promise<number>;
  export const DeviceType: { PHONE: number; TABLET: number; DESKTOP: number };
}

declare module 'expo-image' {
  import React from 'react';
  export const Image: React.ComponentType<any>;
  export default Image;
}

declare module 'expo-location' {
  export function requestForegroundPermissionsAsync(): Promise<{ status: string }>;
  export function getCurrentPositionAsync(): Promise<any>;
}

declare module 'react-native-view-shot' {
  import React from 'react';
  const ViewShot: React.ComponentType<any>;
  export default ViewShot;
  export function captureRef(ref: any, options?: any): Promise<string>;
}

declare module '@sentry/react-native' {
  export function init(options: any): void;
  export function captureException(error: any): void;
  export function captureMessage(message: string): void;
}

declare module '../../core/engine' {
  export function createTranslator(options: any): any;
}

declare module '../../core/types' {
  export type Language = string;
}
