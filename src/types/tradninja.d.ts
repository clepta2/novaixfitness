// Ambient module declaration for tradninja package
// Prevents TS from following into broken node_modules source files

declare module 'tradninja' {
  export type Language = string;
  export interface DictionaryEntry { [key: string]: any }
  export interface TranslateOptions { source?: string; target?: string; params?: Record<string, string | number> }
  export interface TranslationResult { text: string; [key: string]: any }
  export interface ModuleConfig { [key: string]: any }
  export interface PatternTemplate { [key: string]: any }
  export interface GrammarRule { [key: string]: any }
  export interface TranslationMap { [key: string]: any }
  export const DEFAULT_CONFIG: any;
  export const DICTIONARY: any;
  export const GRAMMAR_RULES: any[];
  export function applyRules(...args: any[]): any;
  export const PATTERNS: any[];
  export function interpolatePattern(...args: any[]): any;
  export function get(...args: any[]): any;
  export function set(...args: any[]): any;
  export function clear(...args: any[]): any;
  export function size(...args: any[]): any;
  export function configure(...args: any[]): any;
  export function getStats(...args: any[]): any;
  export function createTranslator(options?: any): any;
  export function scanForStrings(...args: any[]): any;
  export function generateTranslations(...args: any[]): any;
  export function extractComments(...args: any[]): any;
  export function translateComments(...args: any[]): any;
  export function translateSEO(...args: any[]): any;
  export function generateMetaFiles(...args: any[]): any;
  export function translateVideoMetadata(...args: any[]): any;
  export function translateContent(...args: any[]): any;
  export function pseudoLocalize(...args: any[]): any;
  export function generatePseudoLanguage(...args: any[]): any;
  export function getPseudoLocale(...args: any[]): any;
  export function isPseudoLocale(...args: any[]): any;
  export function resolveICU(...args: any[]): any;
  export function hasICUMessages(...args: any[]): any;
  export function extractICUKeys(...args: any[]): any;
  export function isRTLLanguage(...args: any[]): any;
  export function getRTLConfig(...args: any[]): any;
  export function applyRTLLayout(...args: any[]): any;
  export function getRTLanguages(...args: any[]): any;
  export function mirrorIfNeeded(...args: any[]): any;
  export const T: any;
  export const Trans: any;
  export const TranslationProvider: any;
  export function useTranslation(...args: any[]): any;
  export const TranslationContext: any;
}

declare module 'tradninja/react' {
  export const TranslationProvider: any;
  export function useTranslation(...args: any[]): any;
  export const TranslationContext: any;
  export const T: any;
  export const Trans: any;
}
