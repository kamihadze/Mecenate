# Mecenate — Feed + Post Detail (test assignment)

Двухэкранное мобильное приложение для платформы Mecenate: лента публикаций (ТЗ-1) и экран деталки с комментариями и real-time-обновлениями (ТЗ-2). React Native + Expo, TypeScript, MobX + React Query, дизайн-токены 1:1 из Figma.

## Что реализовано

### ТЗ-1 — Feed

- Список постов: аватар, имя автора, обложка 1:1, заголовок, превью, чипы лайков и комментариев.
- **Таб-фильтр** над списком: **Все / Бесплатные / Платные** (1:1 по макету: единый pill-контейнер, активный сегмент — purple).
- Курсорная пагинация через `useInfiniteQuery` (lazy-load на скролл).
- Pull-to-refresh.
- Закрытый пост (`tier: "paid"`): обложка перекрывается оверлеем + CTA «Отправить донат».
- Тап по карточке → переход на экран деталки.
- Состояние ошибки: иллюстрация + «Не удалось загрузить публикации» + кнопка «Повторить».
- Skeleton-загрузка на первичной отрисовке.

### ТЗ-2 — Post Detail

- Экран `PostDetail`: автор-роу, обложка full-bleed, заголовок, тело публикации.
- **Лайк с анимацией Reanimated 4**: spring-scale иконки `1 → 1.3 → 1`, плавный тик счётчика (translateY + opacity), `expo-haptics` impact (`Medium` при лайке, `Light` при снятии). Это та же `ActionChip` с макета — без отдельного big-button.
- **Комментарии** через `useInfiniteQuery`: `GET /posts/{id}/comments?cursor&limit`, lazy-load на скролл.
- **Композер**: pill-input «Ваш комментарий» + paper-plane (purple, 30×30). На отправке — оптимистичный prepend в кэш, инкремент `commentsCount`, инвалидация ленты.
- **Real-time WebSocket**: подключение `wss://k8s.mectest.ru/test-app/ws?token=<uuid>`. События `like_updated` и `comment_added` мержатся в кэш React Query через `setQueryData` (без `refetch`). Reconnect с exponential backoff `1s → 30s`.
- Floating-back в углу для возврата на ленту.

### Дополнительно

- `DonateModal` на paid-карточке (с подтверждением/отменой). Триггерит `ErrorState` через `UIStore.forceError` для ручной проверки error-флоу. На `ErrorState` появляется вторая кнопка «Назад».

## Стек

- **Expo SDK 54**, **React Native 0.81**, **TypeScript**
- **@tanstack/react-query** — серверный state, кэш-level error handling, инвалидация, оптимистичные мутации
- **mobx** + **mobx-react-lite** — клиентский state (`SessionStore`, `UIStore`, `RealtimeStore`)
- **@react-navigation/native** + **native-stack** — навигация
- **react-native-reanimated 4** + **react-native-worklets** — анимация лайка
- **expo-haptics** — haptic feedback
- **react-native-svg** — все иконки inline
- **expo-image** — кеш обложек/аватаров
- **@expo-google-fonts/manrope** — Manrope 500/600/700

## React Query — что устроено

- **Query key factory** ([src/api/queryKeys.ts](src/api/queryKeys.ts)) — иерархические ключи:
  - `postsKeys.all` → `feeds()` → `feed({ tier, simulateError })`
  - `postsKeys.details()` → `detail(id)`
  - `commentsKeys.all` → `byPost(postId)` → `list(postId)`
- **`QueryCache` + `MutationCache` с глобальным `onError`** ([src/providers/QueryProvider.tsx](src/providers/QueryProvider.tsx)) — любая ошибка сети попадает в `UIStore.reportError()`, готова к показу тостом/баннером.
- **Retry c exponential backoff** — до 3 попыток, `500ms → 1s → 2s → …` (cap 15s). 4xx-ошибки не ретраятся (`shouldRetry` различает `ApiError.status`).
- **`refetchOnReconnect: true`**, **`staleTime: 30s`**, **`gcTime: 5min`**.
- **Оптимистичные мутации** ([useToggleLike](src/hooks/useToggleLike.ts), [useCreateComment](src/hooks/usePostComments.ts)):
  - `useToggleLike`: `onMutate` патчит `postsKeys.detail(id)` И все `postsKeys.feeds()` (мнемоника: лайк виден в любой текущей вкладке Feed). `onError` откатывает по сохранённому `previousFeeds`. `onSuccess` синхронизирует с реальным ответом сервера.
  - `useCreateComment`: `onSuccess` prepend-ит в первую страницу комментариев, инкрементит `commentsCount` в `postsKeys.detail`, инвалидирует все ленты.
- **Real-time-инжектор** ([useRealtimeSync](src/hooks/useRealtimeSync.ts)): на WS-событие `like_updated` — `setQueryData` детали + всех лент; на `comment_added` — prepend в кэш комментов + инкремент в детали (без сетевого `refetch`).
- **Хук `useInvalidatePostsFeed()`** для таргетированной инвалидации.

## Структура

```
App.tsx                          # провайдеры, шрифты, hydrate, realtime sync
src/
  api/
    client.ts                    # fetch + ApiError envelope
    posts.ts                     # fetchPostsFeed, fetchPostById, fetchComments,
                                 #   createComment, toggleLike
    queryKeys.ts                 # postsKeys, commentsKeys (key factory)
    types.ts                     # Post, Comment, *Page, LikeResult
    ws.ts                        # buildWsUrl, parseEvent, WSEvent
  navigation/
    AppNavigator.tsx             # NativeStack: Feed → PostDetail
    types.ts                     # RootStackParamList
  providers/QueryProvider.tsx    # QueryCache/MutationCache, retry, onError
  stores/
    RootStore.ts                 # session + ui + realtime
    SessionStore.ts              # UUID + AsyncStorage
    UIStore.ts                   # forceError, lastErrorMessage
    RealtimeStore.ts             # WS connect/reconnect/subscribe
    StoreContext.tsx             # provider + hooks (useSessionStore etc.)
  hooks/
    usePostsFeed.ts              # useInfiniteQuery (Feed) + invalidate hook
    usePostDetail.ts             # useQuery (Detail) + cache patch hook
    usePostComments.ts           # useInfiniteQuery (комменты) + useCreateComment
    useToggleLike.ts             # useMutation с optimistic
    useRealtimeSync.ts           # WS → React Query setQueryData
  screens/
    FeedScreen.tsx               # таб-фильтр, лента, навигация на деталку
    PostDetailScreen.tsx         # деталка + комменты + композер
  components/
    icons/                       # LikeIcon, CommentIcon, DonateIcon,
                                 #   BackIcon, PaperPlaneIcon
    ActionChip.tsx               # чип-счётчик с иконкой
    AnimatedLikeChip.tsx         # тот же чип + Reanimated + haptics
    Avatar.tsx
    PostCard.tsx                 # карточка фида
    PaidLock.tsx                 # paid-overlay
    DonateModal.tsx              # модалка доната (доп. функционал)
    PostSkeleton.tsx
    ErrorState.tsx
    TabFilter.tsx                # таб-фильтр Feed
    CommentRow.tsx               # строка комментария
    CommentComposer.tsx          # инпут + кнопка отправки
assets/images/axolotl.png
```

## Переменные окружения

```
EXPO_PUBLIC_API_BASE_URL=https://k8s.mectest.ru/test-app
```

`.env.example` лежит в репозитории. По умолчанию используется боевой URL тестового API.

## Запуск

```bash
cd mecenate-feed
npm install
npx expo start
```

Затем в терминале Expo:

- `i` — iOS Simulator,
- `a` — Android emulator,
- QR в **Expo Go** на iOS/Android.

## Тестирование состояний

- **Успех**: пролистай ленту, переключай табы, потяни вниз для refresh, тапни на пост → деталка → лайк (анимация + haptic) → напиши комментарий.
- **Paid-пост**: каждый 4-й пост (тэг `tier: "paid"`).
- **Real-time**: открой два устройства/сеанса с разными UUID, лайкни/прокомменти на одном — на втором обновится без refresh (через WS). Сервер шлёт `like_updated` с задержкой 1–3с, `comment_added` сразу.
- **Ошибка (из UI)**: на paid-посте «Отправить донат» → в модалке подтверди → ErrorState с «Назад».
- **Ошибка (без UI)**: `ui.forceError = true`, либо в [src/hooks/usePostsFeed.ts](src/hooks/usePostsFeed.ts) `simulateError: true` → API 500.

## Дизайн-токены

Полный набор — [src/theme/tokens.ts](src/theme/tokens.ts). Все цвета через `colors.*`, проект свободен от hex-литералов вне токенов (audit: `grep -rE "#[0-9A-Fa-f]{3,8}|rgba?\\(" src/ | grep -v tokens.ts` → `0`).

Цвета (Figma Ui-Kit):

| Токен | HEX | Назначение |
|---|---|---|
| screenBg | `#F5F8FD` | фон экрана |
| cardBg | `#FFFFFF` | фон карточки/деталки |
| textPrimary | `#111416` | основной текст |
| textSecondary | `#57626F` | вторичный, цифры на чипах, неактивный таб |
| textMuted | `#68727D` | label «X комментариев» |
| placeholder | `#A4AAB0` | placeholder в композере |
| chipBg | `#EFF2F7` | фон action-чипа |
| divider | `#EFF2F7` | бордер инпута, разделители |
| tabBorder | `#E8ECEF` | бордер контейнера таб-фильтра |
| primary | `#6115CD` | primary-кнопка, активный таб, sort-link |
| primarySoft | `#C8A4F0` | paper-plane в idle |
| onPrimary | `#FFFFFF` | текст/иконки поверх primary |
| iconMuted | `#57626F` | приглушённые иконки |
| likeActive | `#FF2B75` | bg активного лайка |
| likeActiveText | `#FFEAF1` | иконка/текст активного лайка |
| skeleton | `#EEEFF1` | плейсхолдеры скелетонов |
| overlay | `rgba(0,0,0,.5)` | paid-заглушка, modal backdrop |
| scrim | `rgba(255,255,255,.85)` | подложка floating-back |
| gradientEnd | `#FFFFFF` | градиент превью |

Типографика — `typography.*` (Manrope 500/600/700; есть отдельные пресеты `commentText 14/20`, `tabActive/Inactive`, `sectionLabel`, `link`). Отступы — `spacing.*`, радиусы — `radii.*`, фикс-размеры — `sizes.*`.

## API

Swagger: `https://k8s.mectest.ru/test-app/openapi.json`

| Метод | Путь | Хук |
|---|---|---|
| GET | `/posts?limit&cursor&tier&simulate_error` | `usePostsFeed` |
| GET | `/posts/{id}` | `usePostDetail` |
| POST | `/posts/{id}/like` | `useToggleLike` |
| GET | `/posts/{id}/comments?limit&cursor` | `usePostComments` |
| POST | `/posts/{id}/comments` | `useCreateComment` |

Auth: любой валидный UUID v4 → `Authorization: Bearer <uuid>`. UUID генерируется на клиенте при первом запуске и сохраняется в AsyncStorage.

WS: `wss://k8s.mectest.ru/test-app/ws?token=<uuid>` (документация: `https://k8s.mectest.ru/test-app/docs`). События — `ping` (keepalive 30s), `like_updated`, `comment_added`. Сервер игнорит входящие; клиент должен переподключаться. Реализовано в [RealtimeStore](src/stores/RealtimeStore.ts).
