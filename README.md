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
- `modules/headset` — нативный модуль: тип аудиовыхода (провод/USB/Bluetooth) и команды next/previous с гарнитуры
- `plugins/withSceneDelegate.js` — scene lifecycle для iOS 27
