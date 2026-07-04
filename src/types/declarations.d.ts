declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}

declare module 'expo-crypto' {
  export enum CryptoDigestAlgorithm { SHA1 = 'SHA-1', SHA256 = 'SHA-256', SHA384 = 'SHA-384', SHA512 = 'SHA-512' }
  export enum CryptoEncoding { HEX = 'hex', BASE64 = 'base64' }
  export function digestStringAsync(algorithm: CryptoDigestAlgorithm | string, data: string, encoding?: CryptoEncoding): Promise<string>;
  export function randomUUID(): string;
}

declare module 'expo-device' {
  export function getDeviceNameAsync(): Promise<string>;
  export function getDeviceTypeAsync(): Promise<number>;
  export const brand: string | null;
  export const modelName: string | null;
  export const isDevice: boolean;
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
  export function reverseGeocodeAsync(location: { latitude: number; longitude: number }): Promise<Array<{ city?: string; street?: string; name?: string; region?: string; postalCode?: string; isoCountryCode?: string }>>;
}

declare module 'expo-file-system' {
  export const documentDirectory: string | null;
  export const cacheDirectory: string | null;
}

declare module 'react-native-view-shot' {
  import React from 'react';
  const ViewShot: React.ComponentType<any>;
  export default ViewShot;
  export function captureRef(ref: any, options?: any): Promise<string>;
}

declare module '@sentry/react-native' {
  interface SentryScope {
    setTag(key: string, value: string): void;
    setUser(user: Record<string, any>): void;
    addBreadcrumb(breadcrumb: Record<string, any>): void;
    setContext(key: string, context: Record<string, any>): void;
  }
  export type Scope = SentryScope;
  export function init(options: any): void;
  export function captureException(error: any): void;
  export function captureMessage(message: string): void;
  export function withScope(callback: (scope: SentryScope) => void): void;
  export function setUser(user: Record<string, any>): void;
  export function setTag(key: string, value: string): void;
  export function addBreadcrumb(breadcrumb: Record<string, any>): void;
  export function startTransaction(options: Record<string, any>): any;
  export function flush(timeout?: number): Promise<boolean>;
  export function close(timeout?: number): Promise<void>;
}

declare module '../../core/engine' {
  export function createTranslator(options: any): any;
}

declare module '../../core/types' {
  export type Language = string;
}
