declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}

declare module 'expo-crypto' {
  export enum CryptoDigestAlgorithm { SHA1 = 'SHA-1', SHA256 = 'SHA-256', SHA384 = 'SHA-384', SHA512 = 'SHA-512' }
  export enum CryptoEncoding { HEX = 'hex', BASE64 = 'base64' }
  export namespace Crypto {
    const CryptoDigestAlgorithm: typeof CryptoDigestAlgorithm;
    const CryptoEncoding: typeof CryptoEncoding;
  }
  export function digestStringAsync(algorithm: any, data: string, encoding?: any): Promise<string>;
  export function randomUUID(): string;
}

declare module 'expo-device' {
  export function getDeviceNameAsync(): Promise<string>;
  export function getDeviceTypeAsync(): Promise<number>;
  export function getDeviceYearClassAsync(): Promise<number>;
  export function getIosModelName(): Promise<string | null>;
  export const brand: string | null;
  export const modelName: string | null;
  export const isDevice: boolean;
  export const osName: string;
  export const osVersion: string;
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
  export enum EncodingType { UTF8 = 'utf8', Base64 = 'base64' }
  export function writeAsStringAsync(fileUri: string, contents: string, options?: { encoding?: EncodingType | string }): Promise<void>;
  export function readAsStringAsync(fileUri: string, options?: { encoding?: EncodingType | string }): Promise<string>;
  export function getInfoAsync(fileUri: string, options?: { md5?: boolean; size?: boolean }): Promise<{ exists: boolean; uri: string; size?: number; md5?: string; isDirectory?: boolean }>;
  export function makeDirectoryAsync(fileUri: string, intermediates?: boolean): Promise<void>;
  export function deleteAsync(fileUri: string, options?: { idempotent?: boolean }): Promise<void>;
  export function readDirectoryAsync(fileUri: string): Promise<string[]>;
  export function createDownloadResumable(uri: string, fileUri: string, options?: any, callback?: (downloadProgress: any) => void): { downloadAsync: () => Promise<any>; pause: () => void; resume: () => void; cancel: () => void };
}

declare module 'expo-linking' {
  export function openURL(url: string): Promise<void>;
  export function canOpenURL(url: string): Promise<boolean>;
  export function addEventListener(type: string, handler: (event: any) => void): { remove: () => void };
  export function getInitialURL(): Promise<string>;
  export function makeUrl(path?: string, params?: Record<string, any>): string;
  export const Linking: {
    openURL: typeof openURL;
    canOpenURL: typeof canOpenURL;
    addEventListener: typeof addEventListener;
    getInitialURL: typeof getInitialURL;
    makeUrl: typeof makeUrl;
  };
  export default Linking;
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
    setExtra(key: string, value: any): void;
    setUser(user: Record<string, any>): void;
    addBreadcrumb(breadcrumb: Record<string, any>): void;
    setContext(key: string, context: Record<string, any>): void;
    setLevel(level: 'fatal' | 'error' | 'warning' | 'info' | 'debug'): void;
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
  export interface TranslationContextValue {
    t: (key: string, params?: Record<string, any>) => string;
    locale: string;
    setLocale: (locale: string) => void;
  }
}

declare module 'module' {}
declare module 'fs' {
  export function readFileSync(path: string, encoding?: string): any;
  export function writeFileSync(path: string, data: any, encoding?: string): void;
  export function readdirSync(path: string): string[];
  export function statSync(path: string): any;
}
declare module 'path' {
  export function join(...paths: string[]): string;
  export function extname(path: string): string;
  export function basename(path: string, ext?: string): string;
  export function dirname(path: string): string;
}
