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

### Дополнительно (не по ТЗ, для удобства проверки)

- Кнопка **«Отправить донат»** на paid-посте открывает модалку (`DonateModal`) с подтверждением/отменой.
- Подтверждение в модалке триггерит `ErrorState` через `UIStore.forceError` — позволяет увидеть экран ошибки без правки кода.
- На `ErrorState` в этом сценарии появляется вторая кнопка **«Назад»**, возвращающая на нормальную ленту (`ui.clearError()`).
- `UIStore` — отдельный MobX-стор для клиентского UI-состояния, не связанного с сессией.

## Стек

- **Expo SDK 54**, **React Native 0.81**, **TypeScript**
- **@tanstack/react-query** — серверный state (фид, пагинация, кэш-level error handling, инвалидация)
- **mobx** + **mobx-react-lite** — клиентский state (`SessionStore`, `UIStore`)
- **@react-native-async-storage/async-storage** — персист userId
- **react-native-svg** — SVG-иконки из макета
- **expo-image** — кеш обложек/аватаров

### React Query — что сделано

- **Query key factory** ([src/api/queryKeys.ts](src/api/queryKeys.ts)) — иерархические ключи (`postsKeys.all` → `feeds()` → `feed({…})`, `details()` → `detail(id)`), позволяют таргетированную инвалидацию.
- **`QueryCache` / `MutationCache` с глобальным `onError`** ([src/providers/QueryProvider.tsx](src/providers/QueryProvider.tsx)) — любая ошибка сети попадает в `UIStore.reportError()`, откуда её можно показать тостом/баннером.
- **Retry с exponential backoff** — до 3 попыток, `500ms → 1s → 2s → …` (capped at 15s). 4xx-ошибки не ретраятся (логика в `shouldRetry`, различает `ApiError.status`).
- **`refetchOnReconnect: true`** — авто-обновление при возврате сети.
- **`staleTime: 30s`, `gcTime: 5min`** — baseline-настройки кэша.
- **Инвалидация** — хук `useInvalidatePostsFeed()` из [src/hooks/usePostsFeed.ts](src/hooks/usePostsFeed.ts) обнуляет все фид-кэши; используется после мутаций (like/donate), когда те будут подключены.

## Структура

```
App.tsx                  # провайдеры, шрифты, hydrate store
src/
  api/                   # fetch-клиент, эндпоинты, типы
  theme/tokens.ts        # colors, typography, spacing, radii, sizes
  stores/                # RootStore, SessionStore, UIStore, StoreContext
  providers/             # QueryProvider
  hooks/usePostsFeed.ts  # useInfiniteQuery
  screens/FeedScreen.tsx
  components/
    icons/               # LikeIcon, CommentIcon, DonateIcon
    Avatar, ActionChip, PostCard, PaidLock, DonateModal, ErrorState, PostSkeleton
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
- **Ошибка (из UI)**: тапни «Отправить донат» на paid-посте → в модалке подтверди → откроется `ErrorState`. Кнопка «Назад» вернёт на ленту.
- **Ошибка (без UI)**: либо `ui.forceError = true`, либо поставь в [src/hooks/usePostsFeed.ts](src/hooks/usePostsFeed.ts) `simulateError: true` → API вернёт 500.

## Дизайн-токены

Полный набор токенов — [src/theme/tokens.ts](src/theme/tokens.ts). Все цвета в компонентах идут через `colors.*` — проект свободен от hex-литералов, кроме самого файла токенов (это легко форсируется ESLint-правилом, если понадобится).

Цвета (из Figma Ui-Kit):

| Токен | HEX | Назначение |
|---|---|---|
| screenBg | `#F5F8FD` | фон экрана |
| cardBg | `#FFFFFF` | фон карточки |
| textPrimary | `#111416` | основной текст |
| textSecondary | `#57626F` | вторичный, цифры на чипах |
| chipBg | `#EFF2F7` | фон action-чипа |
| primary | `#6115CD` | primary-кнопка |
| onPrimary | `#FFFFFF` | текст/иконки поверх primary |
| iconMuted | `#57626F` | приглушённые иконки (like/comment outline) |
| likeActive | `#FF2B75` | активный лайк |
| likeActiveText | `#FFEAF1` | solid-иконка активного лайка |
| skeleton | `#EEEFF1` | плейсхолдеры скелетонов |
| overlay | `rgba(0,0,0,.5)` | paid-заглушка и backdrop модалок |
| gradientEnd | `#FFFFFF` | градиент превью поста |

Типографика — `typography.*` (Manrope 500/600/700), отступы — `spacing.*`, радиусы — `radii.*`, фиксированные размеры — `sizes.*`.

## API

Эндпоинты (Swagger: `https://k8s.mectest.ru/test-app/openapi.json`):

- `GET /posts?limit&cursor&tier&simulate_error` — фид (используется)
- `GET /posts/{id}`, `POST /posts/{id}/like`, `/comments` — готовы к подключению, в рамках ТЗ не используются

Auth: любой валидный UUID → `Authorization: Bearer <uuid>`. UUID генерируется на клиенте при первом запуске и сохраняется в AsyncStorage.
