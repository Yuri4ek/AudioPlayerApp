# Плеер

Аудиоплеер на Expo SDK 57 + React Native + TypeScript, архитектура FSD.

## Запуск

Нужна dev-сборка (Expo Go не подходит из-за нативного модуля `modules/headset` и патча `expo-audio`).

```bash
npm install          # применяет patches/expo-audio через patch-package
npx expo run:ios     # или npx expo run:android
```

## Структура

- `src/app` — роуты expo-router
- `src/pages` — home, player, themes
- `src/widgets` — track-list, mini-player, headset-card
- `src/features` — add-tracks, remove-track, playback-controls, headset-controls, theme-picker
- `src/entities` — track, player, headset
- `src/shared` — ui, theme, lib, api
- `modules/headset` — нативный модуль: аудиовыходы и их выбор, отключение наушников (`onNoisy`), команды next/previous/play с гарнитуры, чтение тегов/обложки/текста из файла (Android)
- `plugins/withSceneDelegate.js` — scene lifecycle для iOS 27

## Патч expo-audio

`patches/expo-audio+57.0.5.patch` (Android): кнопки «назад/вперёд» в уведомлении и на экране блокировки,
обработка всех медиакнопок гарнитуры, полный аудиофокус, уведомление можно смахнуть на паузе.

В SDK 57 expo-audio по умолчанию подключается готовым AAR, и патч исходников в сборку не попадает.
Поэтому в `package.json` задано `expo.autolinking.android.buildFromSource: ["expo-audio"]` — не удаляйте.
