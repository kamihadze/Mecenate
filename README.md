# Mecenate — Feed (test assignment)

Экран ленты публикаций для сервиса поддержки авторов Mecenate.
React Native + Expo, TypeScript, MobX + React Query, дизайн-токены из Figma.

## Что реализовано

- Экран `Feed` со списком постов (аватар, автор, обложка, заголовок, превью, счётчики лайков и комментариев).
- Курсорная пагинация через `useInfiniteQuery` (подгрузка при скролле вниз).
- Pull-to-refresh.
- Закрытый пост (`tier: "paid"`): обложка перекрывается оверлеем с сообщением и CTA «Отправить донат» — 1:1 по макету.
- Состояние ошибки: иллюстрация + «Не удалось загрузить публикации» + кнопка «Повторить».
- Скелетоны на первичной загрузке.
- Иконки (like, comment, donate) — из макета, вставлены как `react-native-svg` c оригинальными `path`.
- Шрифт **Manrope** (500/600/700) из `@expo-google-fonts/manrope`.
- Авторизация: случайный UUID v4, сохраняется в `AsyncStorage`, приходит в `Authorization: Bearer <uuid>`.

## Стек

- **Expo SDK 54**, **React Native 0.81**, **TypeScript**
- **@tanstack/react-query** — серверный state (фид, пагинация)
- **mobx** + **mobx-react-lite** — клиентский state (`SessionStore`)
- **@react-native-async-storage/async-storage** — персист userId
- **react-native-svg** — SVG-иконки из макета
- **expo-image** — кеш обложек/аватаров

## Структура

```
App.tsx                  # провайдеры, шрифты, hydrate store
src/
  api/                   # fetch-клиент, эндпоинты, типы
  theme/tokens.ts        # colors, typography, spacing, radii, sizes
  stores/                # RootStore, SessionStore, StoreContext
  providers/             # QueryProvider
  hooks/usePostsFeed.ts  # useInfiniteQuery
  screens/FeedScreen.tsx
  components/
    icons/               # LikeIcon, CommentIcon, DonateIcon
    Avatar, ActionChip, PostCard, PaidLock, ErrorState, PostSkeleton
assets/images/axolotl.png  # иллюстрация для ErrorState
```

## Переменные окружения

Скопируй `.env.example` в `.env` и при необходимости переопредели:

```
EXPO_PUBLIC_API_BASE_URL=https://k8s.mectest.ru/test-app
```

По умолчанию используется боевой URL тестового API.

## Запуск

```bash
cd mecenate-feed
npm install
npx expo start
```

Дальше — в терминале Expo:

- нажми `i` — iOS Simulator,
- нажми `a` — Android emulator,
- либо отсканируй QR в **Expo Go** (iOS/Android).

## Тестирование состояний

- **Успех**: запусти и пролистай ленту, потяни экран вниз для refresh.
- **Paid-пост**: приходит с API сам (каждый 4-й пост на стороне бэка).
- **Ошибка**: временно поставь в [src/hooks/usePostsFeed.ts](src/hooks/usePostsFeed.ts) `simulateError: true` → API вернёт 500 и покажется `ErrorState` с кнопкой «Повторить».

## Дизайн-токены

Полный набор токенов — [src/theme/tokens.ts](src/theme/tokens.ts).

Ключевые цвета (из Figma Ui-Kit):

| Токен | HEX | Назначение |
|---|---|---|
| screenBg | `#F5F8FD` | фон экрана |
| cardBg | `#FFFFFF` | фон карточки |
| textPrimary | `#111416` | основной текст |
| textSecondary | `#57626F` | вторичный, цифры на чипах |
| chipBg | `#EFF2F7` | фон action-чипа |
| primary | `#6115CD` | primary-кнопка |
| likeActive | `#FF2B75` | активный лайк |
| overlay | `rgba(0,0,0,.5)` | paid-заглушка |

## API

Эндпоинты (Swagger: `https://k8s.mectest.ru/test-app/openapi.json`):

- `GET /posts?limit&cursor&tier&simulate_error` — фид (используется)
- `GET /posts/{id}`, `POST /posts/{id}/like`, `/comments` — готовы к подключению, в рамках ТЗ не используются

Auth: любой валидный UUID → `Authorization: Bearer <uuid>`. UUID генерируется на клиенте при первом запуске и сохраняется в AsyncStorage.
