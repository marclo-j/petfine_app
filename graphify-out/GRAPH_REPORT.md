# Graph Report - D:\Scalio\PetFine  (2026-08-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 375 nodes · 699 edges · 41 communities (15 shown, 26 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ccb1603e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- repos.ts
- cn
- LoginScreen.tsx
- hooks.ts
- expo
- PostFormScreen.tsx
- package.json
- include
- client.ts
- dependencies
- metro.config.js
- theme.ts
- eslint.config.js
- graphify.js
- global.d.ts
- nativewind-env.d.ts
- expo
- expo-blur
- @expo-google-fonts/inter
- @expo/metro-runtime
- clsx
- nativewind
- react
- react-dom
- react-hook-form
- react-native
- react-native-reanimated
- react-native-safe-area-context
- react-native-screens
- react-native-web
- react-native-worklets
- @react-navigation/bottom-tabs
- @react-navigation/native
- @react-navigation/native-stack
- tailwind-merge
- @tanstack/react-query
- zod
- zustand

## God Nodes (most connected - your core abstractions)
1. `cn()` - 26 edges
2. `useAuthStore` - 13 edges
3. `expo` - 11 edges
4. `PostType` - 11 edges
5. `Post` - 11 edges
6. `Button()` - 9 edges
7. `AuthSession` - 9 edges
8. `useMe()` - 8 edges
9. `Icon()` - 8 edges
10. `User` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ChatBubbleProps` --references--> `Message`  [EXTRACTED]
  app/src/components/ChatBubble.tsx → app/src/types/domain.ts
- `PostCardProps` --references--> `Post`  [EXTRACTED]
  app/src/features/feed/components/PostCard.tsx → app/src/types/domain.ts
- `App()` --calls--> `useAuthStore`  [EXTRACTED]
  app/App.tsx → app/src/store/auth.ts
- `plugins` --extends--> `expo-image`  [EXTRACTED]
  app/app.json → app/package.json
- `usePost()` --calls--> `getFeedRepository()`  [EXTRACTED]
  app/src/api/hooks.ts → app/src/api/repos.ts

## Import Cycles
- None detected.

## Communities (41 total, 26 thin omitted)

### Community 0 - "repos.ts"
Cohesion: 0.06
Nodes (43): mockAuthRepository, mockChatRepository, mockFeedRepository, mockNotificationRepository, mockPostRepository, mockUserRepository, AuthRepository, ChatRepository (+35 more)

### Community 1 - "cn"
Cohesion: 0.07
Nodes (39): expo-image, ChatBubble(), ChatBubbleProps, PhotoPickerGrid(), PhotoPickerGridProps, SegmentedTab, SegmentedTabs(), SegmentedTabsProps (+31 more)

### Community 2 - "LoginScreen.tsx"
Cohesion: 0.10
Nodes (36): getAuthRepository(), Button(), ButtonProps, ButtonSize, ButtonVariant, sizeStyles, textStyles, variantStyles (+28 more)

### Community 3 - "hooks.ts"
Cohesion: 0.09
Nodes (36): queryKeys, useConversations(), useCreateConversation(), useFeed(), useMe(), useMessages(), useMyPosts(), useNotifications() (+28 more)

### Community 4 - "expo"
Cohesion: 0.07
Nodes (27): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, App(), expo (+19 more)

### Community 5 - "PostFormScreen.tsx"
Cohesion: 0.15
Nodes (18): useCreatePost(), getPostRepository(), AuthNavigator(), defaultPostFormValues, POST_TYPE_LABEL, PostFieldConfig, postFormConfig, PostFormSchema (+10 more)

### Community 6 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, eslint, eslint-config-expo, @types/react, typescript, main, name, private (+11 more)

### Community 7 - "include"
Cohesion: 0.15
Nodes (12): compilerOptions, paths, strict, types, extends, include, expo/tsconfig.base, global.d.ts (+4 more)

### Community 8 - "client.ts"
Cohesion: 0.25
Nodes (5): API_BASE_URL, client, USE_MOCK, ApiError, parseResponse()

### Community 9 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, babel-preset-expo, @hookform/resolvers, react-native-svg, babel-preset-expo, @hookform/resolvers, react-native-svg

### Community 10 - "metro.config.js"
Cohesion: 0.50
Nodes (3): config, { getDefaultConfig }, { withNativeWind }

### Community 11 - "theme.ts"
Cohesion: 0.50
Nodes (3): colors, radii, spacing

## Knowledge Gaps
- **146 isolated node(s):** `queryClient`, `name`, `slug`, `version`, `orientation` (+141 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `cn`, `expo`, `package.json`, `expo`, `expo-blur`, `@expo-google-fonts/inter`, `@expo/metro-runtime`, `clsx`, `nativewind`, `react`, `react-dom`, `react-hook-form`, `react-native`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`, `react-native-web`, `react-native-worklets`, `@react-navigation/bottom-tabs`, `@react-navigation/native`, `@react-navigation/native-stack`, `tailwind-merge`, `@tanstack/react-query`, `zod`, `zustand`?**
  _High betweenness centrality (0.294) - this node is a cross-community bridge._
- **Why does `expo-image` connect `cn` to `expo`?**
  _High betweenness centrality (0.256) - this node is a cross-community bridge._
- **Why does `expo-image` connect `cn` to `dependencies`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **What connects `queryClient`, `name`, `slug` to the rest of the system?**
  _146 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `repos.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.058173076923076925 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06823529411764706 - nodes in this community are weakly interconnected._
- **Should `LoginScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10289115646258504 - nodes in this community are weakly interconnected._