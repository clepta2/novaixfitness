# Helpers API Documentation - NOVAIX FITNESS

> Auto-generated API reference for all helpers in `src/helpers/`.

---

## Table of Contents

- [Authentication](#authentication)
- [Body Composition](#body-composition)
- [Chat](#chat)
- [CPF](#cpf)
- [Dates](#dates)
- [Navigation](#navigation)
- [Streaks](#streaks)
- [Timer](#timer)

---

## Authentication

### `auth.ts`

**`getClientIp(): Promise<string>`**

Fetches the client's public IP address via ipify API.

**Returns:** IP string or `'unknown'` on failure.

```typescript
import { getClientIp } from '../helpers/auth';

const ip = await getClientIp(); // "192.168.1.1"
```

---

## Body Composition

### `bodyComposition.ts`

Body composition calculations: BMI, body fat, TDEE.

**`calculateBMI(weight: number, height: number): BMIResult | null`**

Calculates Body Mass Index with category classification.

**Parameters:**
- `weight` - Weight in kg
- `height` - Height in cm

**Returns:**
```typescript
{
  value: string;      // e.g. "24.5"
  category: string;   // "Abaixo do peso" | "Peso normal" | "Sobrepeso" | "Obesidade"
  color: string;      // Corresponding UI color
} | null
```

**Example:**
```typescript
const result = calculateBMI(70, 175);
// { value: "22.9", category: "Peso normal", color: "#00D68F" }
```

---

**`calculateBodyFat(weight, height, age, gender, waist, neck, hip?): BodyFatResult | null`**

Calculates body fat percentage using the US Navy formula.

**Parameters:**
- `weight: number` - Weight in kg
- `height: number` - Height in cm
- `age: number` - Age in years
- `gender: string` - `'M'` (male) or `'F'` (female)
- `waist: number` - Waist circumference in cm
- `neck: number` - Neck circumference in cm
- `hip?: number` - Hip circumference in cm (required for females)

**Returns:**
```typescript
{
  value: string;     // e.g. "18.5"
  formula: string;   // "US Navy"
} | null
```

**Example:**
```typescript
const result = calculateBodyFat(75, 180, 30, 'M', 80, 40);
// { value: "16.2", formula: "US Navy" }
```

---

**`calculateTDEE(weight, height, age, gender, activity): number`**

Calculates Total Daily Energy Expenditure using Mifflin-St Jeor equation.

**Parameters:**
- `weight: number` - Weight in kg
- `height: number` - Height in cm
- `age: number` - Age in years
- `gender: string` - `'M'` (male) or `'F'` (female)
- `activity: string` - Activity level:
  - `'sedentario'` (1.2x)
  - `'leve'` (1.375x)
  - `'moderado'` (1.55x)
  - `'intenso'` (1.725x)
  - `'muito_intenso'` (1.9x)

**Returns:** `number` - Daily calorie needs in kcal.

**Example:**
```typescript
const tdee = calculateTDEE(70, 175, 25, 'M', 'moderado');
// 2554
```

---

## Chat

### `chatHelpers.ts`

Meal detection and formatting for the AI Coach chat.

**`detectMealLog(text: string): boolean`**

Detects if a user message contains a meal log (food items, quantities, meal keywords).

**Parameters:**
- `text: string` - User message text.

**Returns:** `boolean` - `true` if the text appears to be a meal log.

**Example:**
```typescript
detectMealLog("Comi 200g de frango com arroz"); // true
detectMealLog("Como treinar peito?");           // false
```

---

**`formatMealSummary(meal: Meal): string`**

Formats a meal object into a readable summary string.

**Parameters:**
- `meal: Meal` - `{ items?: string[]; description?: string; calories: number; protein: number; carbs: number; fat: number; fiber: number }`

**Returns:** `string` - Formatted meal summary with macros.

**Example:**
```typescript
const summary = formatMealSummary({
  items: ["Frango", "Arroz", "Salada"],
  calories: 550, protein: 45, carbs: 50, fat: 15, fiber: 8
});
// "Refeição registrada!\n\nFrango, Arroz, Salada\n\nMacros:\n• 550 kcal\n• 45g proteína\n..."
```

---

## CPF

### `cpf.ts`

Brazilian CPF (tax ID) validation and formatting.

**`validateCPF(c: string): boolean`**

Validates a CPF number using the official check-digit algorithm.

**Parameters:**
- `c: string` - CPF string (with or without formatting).

**Returns:** `boolean` - `true` if valid.

**Example:**
```typescript
validateCPF("529.982.247-25"); // true
validateCPF("123.456.789-00"); // false
```

---

**`formatCPF(v: string): string`**

Formats a CPF string to `XXX.XXX.XXX-XX`.

**Parameters:**
- `v: string` - Raw CPF digits.

**Returns:** `string` - Formatted CPF.

**Example:**
```typescript
formatCPF("52998224725"); // "529.982.247-25"
```

---

## Dates

### `dates.ts`

Date formatting and comparison utilities for Brazilian Portuguese.

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `formatDateBR(dateStr)` | `string` | `string` | Formats to pt-BR date (dd/mm/yyyy) |
| `formatRelativeDate(dateStr)` | `string` | `string` | "Hoje", "Ontem", "3 dias atrás", or date |
| `formatTimeBR(dateStr)` | `string` | `string` | Formats to pt-BR time |
| `formatSeconds(seconds)` | `number` | `string` | "5:30" format |
| `formatMinutes(minutes)` | `number` | `string` | "45min" or "1h30min" |
| `formatDuration(seconds)` | `number` | `string` | "1:30:00" or "5:30" |
| `isToday(dateStr)` | `string` | `boolean` | Checks if date is today |
| `isSameDay(a, b)` | `string, string` | `boolean` | Checks if two dates are same day |
| `getDaysBetween(a, b)` | `string, string` | `number` | Days between two dates |
| `formatDateShort(dateStr)` | `string` | `string` | "01/07" format |
| `formatDateSmart(dateStr)` | `string` | `string` | "Hoje 14:30", "Ontem 09:00", or full date |
| `formatDateWithTime(dateStr)` | `string` | `string` | "01/07/2026 14:30" |
| `formatTimeAgo(dateStr)` | `string` | `string` | "agora", "5 min", "3 h", "2 dias" |
| `formatTimestampAgo(ts)` | `number` | `string` | Same as above but from Unix timestamp |

**Example:**
```typescript
import { formatRelativeDate, formatMinutes } from '../helpers/dates';

formatRelativeDate("2026-06-28T10:00:00Z"); // "3 dias atrás"
formatMinutes(90);                            // "1h30min"
```

---

## Navigation

### `navigation.ts`

Route constants and animation presets.

**`ROUTES`** - All app route paths:
```typescript
{
  // Auth
  LOGIN: '/';
  REGISTER: '/register';
  FORGOT_PASSWORD: '/forgot-password';

  // Onboarding
  ONBOARDING_GOAL: '/onboarding/objetivo';
  ONBOARDING_PHYSICAL: '/onboarding/dados-fisicos';
  ONBOARDING_MODEL: '/onboarding/modelo';
  ONBOARDING_AVAILABILITY: '/onboarding/disponibilidade';
  ONBOARDING_GYM_TYPE: '/onboarding/tipo-academia';
  ONBOARDING_EXPERIENCE: '/onboarding/experiencia';
  ONBOARDING_PROCESSING: '/onboarding/processando';

  // Tabs
  HOME: '/(tabs)/home';
  FEED: '/(tabs)/feed';
  PROFILE: '/(tabs)/perfil';
  LIBRARY: '/(tabs)/library';
  HELP: '/(tabs)/ajuda';

  // Features
  PLAYER: '/player';
  PLAYER_LIST: '/player-list';
  PAYWALL: '/paywall';
  CHAT_COACH: '/chat-coach';
  DASHBOARD: '/dashboard';
  ANALYTICS: '/analytics';
  NOTIFICATIONS: '/notifications';
  ADMIN: '/admin';

  // Profile sub-pages
  LGPD: '/(tabs)/perfil/lgpd';
  HISTORY: '/(tabs)/perfil/history';

  // Body & Progress
  BODY_MEASURES: '/body-measures';
  PROGRESS_PHOTOS: '/progress-photos';
  WEEKLY_PROGRESS: '/weekly-progress';
  EXPORT_DATA: '/export-data';
  WORKOUT_DETAIL: '/workout-detail';
}
```

**`PLANS`** - Subscription plan IDs:
```typescript
{ FREE: 'free', BASIC: 'basic', INTERMEDIATE: 'intermediate', PREMIUM: 'premium', ULTRA: 'ultra' }
```

**`ANIMATIONS`** - Screen transition presets:
```typescript
{ FADE: 'fade', SLIDE_RIGHT: 'slide_from_right', SLIDE_LEFT: 'slide_from_left', SLIDE_BOTTOM: 'slide_from_bottom', SLIDE_TOP: 'slide_from_top' }
```

**Example:**
```typescript
import { ROUTES } from '../helpers/navigation';

router.push(ROUTES.PLAYER); // Navigate to player
router.push({ pathname: ROUTES.PLAYER, params: { id: workoutId } });
```

---

## Streaks

### `streaks.ts`

Workout streak calculation.

**`calcStreak(workouts: Workout[]): number`**

Calculates consecutive workout days from a list of completed workouts.

**Parameters:**
- `workouts: Workout[]` - Array of `{ completed?: boolean; completed_at?: string }`

**Returns:** `number` - Current streak in days.

**Example:**
```typescript
import { calcStreak } from '../helpers/streaks';

const streak = calcStreak([
  { completed: true, completed_at: '2026-06-30T10:00:00Z' },
  { completed: true, completed_at: '2026-06-29T10:00:00Z' },
  { completed: true, completed_at: '2026-06-28T10:00:00Z' },
]);
// 3
```

---

## Timer

### `timer.ts`

Timer formatting and circular progress constants.

**`formatTime(seconds: number): string`**

Formats seconds to `HH:MM:SS` or `MM:SS`.

**Parameters:**
- `seconds: number` - Time in seconds (absolute value used).

**Returns:** `string`

**Example:**
```typescript
formatTime(3661);  // "1:01:01"
formatTime(125);   // "2:05"
formatTime(-60);   // "1:00"
```

---

**`formatTimeShort(seconds: number): string`**

Formats seconds to `MM:SS` (always includes minutes).

**Parameters:**
- `seconds: number` - Time in seconds.

**Returns:** `string`

**Example:**
```typescript
formatTimeShort(90);   // "01:30"
formatTimeShort(5);    // "00:05"
```

---

**`CIRCLE_CONSTANTS`**

Constants for circular progress indicators.

```typescript
{
  SIZE: 200,         // Circle diameter in pixels
  STROKE: 8,         // Stroke width in pixels
  RADIUS: 96,        // Computed: (SIZE - STROKE) / 2
  CIRCUMFERENCE: 603.19  // Computed: 2 * PI * RADIUS
}
```

**Example:**
```typescript
import { CIRCLE_CONSTANTS } from '../helpers/timer';

const progress = elapsed / total;
const strokeDashoffset = CIRCLE_CONSTANTS.CIRCUMFERENCE * (1 - progress);
```
