# freshr 🎓

> **The all-in-one campus super-app for students.**
> A high-performance, visually stunning mobile companion built with React Native, Expo, and Supabase.

---

## ✨ What is freshr?

freshr is a modern campus ecosystem that consolidates essential student services into a single, cohesive experience. From ordering food and tracking attendance to discovering club events via a vertical reel feed, freshr is designed to make campus life seamless and engaging.

---

## 📱 Core Features

| Feature | Description |
|-----|-------------|
| 🏠 **Smart Dashboard** | Personalized home with featured events, real-time campus alerts, and quick-action service grids. |
| 🌊 **Waves Feed** | Vertical video/post feed (Reels-style) for campus clubs. Discover culture, follow clubs, and RSVP to events inline. |
| 🧭 **Campus Explore** | Searchable directory of all campus events and clubs with advanced filtering and animated spring cards. |
| 🍱 **Smart Dining** | Full-stack food ordering system — browse menus, manage carts, track real-time order status, and view history. |
| 📅 **Dynamic Calendar** | Integrated view of registered events and personal tasks with progress tracking and productivity analytics. |
| 💻 **Daily Challenge** | Gamified coding streak system with daily DSA problems to keep your technical skills sharp. |
| 📚 **Academics** | Integrated attendance tracker, grade overview, and assignment management. |
| 🗺️ **Interactive Map** | Navigate campus landmarks like libraries, labs, and food courts with real-time distance calculation. |
| 🖨️ **Digital Print** | Upload documents and schedule quick pick-up slots at the campus stationery shop. |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Expo SDK 54](https://expo.dev) + [Expo Router](https://expo.github.io/router) (File-based routing) |
| **Language** | TypeScript 5.9 + React 19 |
| **Runtime** | React Native 0.81.5 |
| **Backend** | [Supabase](https://supabase.com) (Auth, PostgreSQL, Realtime, Storage) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) 5 (Modular stores for Cart, Events, User, etc.) |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query) |
| **Animations** | `react-native-reanimated` 4 + `react-native-gesture-handler` |
| **UI Components** | Custom design system using `expo-blur`, `expo-linear-gradient`, and `expo-symbols` |
| **Typography** | Sora & DM Sans via Google Fonts |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- [Expo Go](https://expo.dev/go) on your device or an Android/iOS emulator

### Environment Setup

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd freshR

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

---

## 📂 Project Structure

```
freshR/
├── app/                        # Expo Router pages (Routes)
│   ├── (tabs)/                 # Bottom tab navigation screens
│   ├── cart/                   # Food checkout flow
│   ├── club/                   # Club profiles [id]
│   ├── event/                  # Event details [id]
│   └── ...                     # Feature-specific screens (attendance, map, etc.)
├── src/
│   ├── components/             # Reusable UI components & Layouts
│   ├── hooks/                  # Custom React hooks (useEvents, useFood, etc.)
│   ├── lib/
│   │   ├── db/                 # Supabase data access layers
│   │   ├── types/              # Database & Application types
│   │   └── supabase.ts         # Supabase client configuration
│   ├── store/                  # Zustand stores (Global state management)
│   └── theme/                  # Design system tokens (Colors, Typography)
├── supabase/                   # Database migrations, schema, and seed data
├── assets/                     # Static assets (images, fonts, icons)
└── ...                         # Configuration files (metro, babel, tsconfig)
```

---

## 🏗 Database Management

The project uses Supabase for its backend. You can find the schema and seed data in the `supabase/` directory.

- `schema.sql`: Core table definitions and RLS policies.
- `seed.sql`: Initial data for clubs, events, and landmarks.

To apply changes, use the Supabase SQL Editor or CLI.

---

## 🎨 Design Philosophy

freshr follows a high-contrast, modern aesthetic:
- **Primary Accent**: `#FF6B35` (Fresh Orange)
- **Typography**: Sora for headings (bold, modern) and DM Sans for body text (legibility).
- **Interactions**: Haptic feedback on interactions and fluid spring animations for layout transitions.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
