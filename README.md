# freshr 🎓

> **The all-in-one campus super-app for MIT Manipal students.**
> Built with React Native + Expo at a hackathon.

---

## ✨ What is freshr?

freshr is a mobile-first campus companion that brings everything a college student needs into one beautifully designed app — from ordering food at the canteen to tracking event registrations, solving daily coding challenges, and scrolling a TikTok-style club feed.

---

## 📱 Screenshots & screens

| Tab | Description |
|-----|-------------|
| 🏠 **Home** | Personalised dashboard with a featured event hero, campus alerts, quick-access service grid, upcoming events strip, and a daily coding streak banner |
| 🌊 **Waves** | Full-screen vertical reel feed (Instagram Reels–style) for club posts — like, share, follow clubs, and RSVP to embedded events inline |
| 🧭 **Explore** | Browse all campus events and clubs with filter pills and animated spring cards |
| 🍱 **Food** | Order food from campus counters — search menus, add to cart, track orders, and view order history |
| 📅 **Calendar** | Visual calendar view of registered and upcoming events |

### Additional screens

- **Event Detail** (`/event/[id]`) — Full event page with ticket types, attendee count, seat urgency indicator, and one-tap registration
- **Club Detail** (`/club/[id]`) — Club profile with posts and event listings
- **Coding Challenge** (`/coding-challenge`) — Daily DSA problem with streak tracking
- **Faculty Directory** (`/teachers`) — Find and contact faculty members
- **Campus Map** (`/campus-map`) — Interactive map to navigate the campus
- **Print Shop** (`/print`) — Upload a PDF and schedule a 10-minute pick-up window at the stationery
- **Order Tracking** (`/order-tracking`) — Real-time food order status
- **Profile** (`/profile`) — Student profile and settings
- **Attendance** (`/attendance`) — Attendance tracker
- **Grades** (`/grades`) — Academic grades overview

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo](https://expo.dev) ~54 (SDK 54) + Expo Router v6 (file-based routing) |
| Language | TypeScript 5.9 + React 19 |
| UI | React Native 0.81 · `expo-linear-gradient` · `expo-image` · `expo-blur` |
| Animations | `react-native-reanimated` 4 · `react-native-gesture-handler` |
| State | [Zustand](https://zustand-demo.pmnd.rs/) 5 — `hybridStore`, `cartStore`, `userStore` |
| Data fetching | TanStack React Query 5 |
| Fonts | Sora (400 / 600 / 700 / 800) via `@expo-google-fonts/sora` |
| Icons | `@expo/vector-icons` (Ionicons) |
| Navigation | Expo Router (file-based) + React Navigation Bottom Tabs |
| Build | EAS Build (`eas.json`) |

---

## 🚀 Getting started

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- [Expo Go](https://expo.dev/go) on your physical device **or** an Android/iOS simulator

### Installation

```bash
# 1. Clone the repo
git clone <repo-url>
cd hackathon

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start
```

After the dev server starts, scan the QR code with **Expo Go** (Android) or your **Camera app** (iOS), or press:

| Key | Action |
|-----|--------|
| `a` | Open on Android emulator |
| `i` | Open on iOS simulator |
| `w` | Open in browser |

---

## 📂 Project structure

```
hackathon/
├── app/                        # Expo Router pages (file-based routing)
│   ├── (tabs)/                 # Bottom tab screens
│   │   ├── index.tsx           # Home
│   │   ├── waves.tsx           # Waves (club reels feed)
│   │   ├── explore.tsx         # Explore (events + clubs)
│   │   ├── food.tsx            # Food ordering
│   │   └── calendar.tsx        # Event calendar
│   ├── event/[id].tsx          # Event detail page
│   ├── club/[id].tsx           # Club profile page
│   ├── coding-challenge.tsx    # Daily coding challenge
│   ├── teachers.tsx            # Faculty directory
│   ├── campus-map.tsx          # Campus map
│   ├── print.tsx               # Print shop
│   ├── order-tracking.tsx      # Food order tracker
│   ├── grades.tsx              # Grades
│   ├── attendance.tsx          # Attendance
│   └── profile.tsx             # User profile
│
├── src/
│   ├── components/             # Shared UI components
│   ├── data/                   # Static seed data (events, food, academics, clubs…)
│   ├── store/                  # Zustand stores
│   │   ├── hybridStore.ts      # Core app state (events, clubs, feed ranking)
│   │   ├── cartStore.ts        # Food cart state
│   │   └── userStore.ts        # User / session state
│   └── theme/                  # Design tokens (Colors, Typography, Spacing, Shadows)
│
├── assets/                     # Icons, images, splash screen
├── app.json                    # Expo config (package: com.yugaaank.freshr)
└── eas.json                    # EAS Build profiles
```

---

## 🏗 Building for production

```bash
# Android APK / AAB
eas build --platform android

# iOS IPA
eas build --platform ios

# Both
eas build --platform all
```

Make sure you're logged in with `eas login` and have configured the right credentials.

---

## 🎨 Design system

All design tokens live in `src/theme/index.ts`:

- **Colors** — primary (`#FF6B35` orange), surface, text hierarchy, semantic colours
- **Typography** — Sora-based scale: `display`, `h1–h5`, `body1/2`, `caption`, `micro`, `label`
- **Spacing** — `xs` → `xxxl` uniform spacing scale
- **Radius** — `sm`, `md`, `lg`, `xl`, `xxl`, `pill`
- **Shadows** — `sm`, `md`, `colored(hex)`

---

## 🤝 Contributing

This was built as a hackathon project. PRs and issues are welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push and open a PR

---

## 📄 License

MIT — feel free to use, fork, and build on it.
