# VPP (Virtual Power Plant) - 가상발전소 플랫폼

VPP는 전력시장과 가상발전소(VPP)를 쉽게 이해하고 학습할 수 있도록 돕는 **AI 기반 에너지 학습/상담 서비스**입니다.  
웹과 모바일 앱에서 모두 사용할 수 있으며, 실시간 채팅, 용어 사전, 퀴즈, 학습 통계 등을 통해 전력·에너지 개념을 단계적으로 익힐 수 있습니다.

## 🎯 서비스 개요

- **목표**  
  복잡한 전력시장·재생에너지 개념을 누구나 이해할 수 있도록,
  대화형 AI와 시각화/퀴즈 기능을 결합한 학습 경험을 제공합니다.

- **형태**

  - 웹: 브라우저에서 접속하는 VPP 학습·상담 서비스
  - 모바일 앱: Expo 기반 React Native 앱, 웹 서비스를 WebView로 통합하여 동일한 경험 제공

- **핵심 가치**
  - 전력·에너지 비전문가도 쉽게 접근 가능한 설명
  - 실제 용어/사례 기반 Q&A
  - 학습 히스토리와 퀴즈를 통한 반복 학습 지원

## ✨ 주요 기능

- **AI 채팅 어시스턴트**

  - 전력시장, 가상발전소(VPP), 재생에너지 관련 질문을 자유롭게 질의응답
  - 업로드된 문서/자료를 바탕으로 한 문서 기반 답변 제공
  - 이전 대화 세션을 불러와 이어서 질문 가능

- **용어 사전 & 북마크**

  - 전력·에너지 관련 용어를 사전 형태로 제공
  - 궁금한 용어를 북마크해 나만의 학습 리스트 구성

- **퀴즈 & 학습 통계**

  - 전력시장 용어 중심의 퀴즈 제공
  - 정답률, 학습 일수, 누적 퀴즈 수 등 학습 지표 확인

- **최근 활동 피드**

  - 최근 채팅, 퀴즈, 북마크 활동을 한 눈에 확인
  - 다시 보고 싶은 활동으로 빠르게 이동

- **멀티 플랫폼 사용성**
  - 하나의 Firebase 백엔드를 기준으로 웹/모바일에서 동일한 계정과 데이터를 사용
  - 모바일 앱은 WebView + 네이티브 기능(Firebase Auth 등)을 조합하여 구현

## 🧭 주요 사용 시나리오

- **전력시장/에너지 개념 빠르게 이해하기**

  1. 궁금한 개념을 AI 채팅에 질문합니다.
  2. 요약/예시/추가 설명을 받은 뒤, 관련 용어를 북마크합니다.
  3. 이후 퀴즈에서 같은 개념을 다시 확인하며 이해도를 점검합니다.

- **보고서·자료를 읽다가 막혔을 때**

  1. 문서 내용을 복사해 붙여넣고, 이해 안 되는 부분을 질문합니다.
  2. AI가 문장 단위로 의미를 풀어주고, 필요하면 추가 예시를 제시합니다.

- **학습 히스토리 기반 복습**
  1. 최근 활동 피드에서 이전 채팅/퀴즈 기록을 확인합니다.
  2. 다시 열고 싶은 세션을 선택해 AI와 이어서 대화하거나, 관련 퀴즈를 재도전합니다.

## 🏗️ 아키텍처 개요

### 전체 시스템 구조

```
VPP Platform
├── Mobile App (React Native + Expo)
│   ├── WebView Integration
│   ├── Firebase Auth
│   └── Native Features
├── Web App (React + Vite)
│   ├── Chat Interface
│   ├── Firebase Integration
│   └── WebView Bridge
├── Core Logic (@vpp/core-logic)
│   ├── Firebase SDK Wrapper
│   ├── Auth Management
│   ├── Shared Types
│   └── Zustand Store
├── Shared UI (@vpp/shared-ui)
│   └── Common Components
└── Firebase Backend
    ├── Authentication
    ├── Firestore Database
    └── Cloud Functions
```

### 모바일-웹 연동 아키텍처

```
Mobile App (React Native)
    ↓ postMessage (AUTH + FIREBASE_CONFIG)
WebView (Web App)
    ↓ Firebase SDK
Firestore Database
    ↑ Real-time sync
Both Platforms
```

## 🗄️ Firebase 데이터베이스 구조

### 데이터베이스 아키텍처 다이어그램

```
/ (root)
├─ users (collection)
│  └─ {uid} (doc)
│     ├─ fields:
│     │  ├─ uid: string
│     │  ├─ displayName: string|null
│     │  ├─ email: string|null
│     │  ├─ photoURL: string|null
│     │  ├─ providerId: 'anonymous'|'google'|'password'
│     │  ├─ createdAt: timestamp
│     │  └─ updatedAt: timestamp
│     ├─ devices (subcollection)
│     │  └─ {deviceId} (doc)
│     │     ├─ expoPushToken: string|null
│     │     ├─ fcmToken: string|null
│     │     ├─ platform: 'ios'|'android'|'web'
│     │     ├─ appVersion: string|null
│     │     └─ updatedAt: timestamp
│     ├─ stats (subcollection)
│     │  └─ summary (doc)
│     │     ├─ learnedTerms: number
│     │     ├─ bookmarks: number
│     │     ├─ quizScore: number            // 정답률(%) 0~100
│     │     ├─ studyDays: number            // 연속 학습일
│     │     ├─ totalQuizzes: number
│     │     ├─ correctAnswers: number
│     │     ├─ lastStudyDate: timestamp
│     │     ├─ createdAt: timestamp
│     │     └─ updatedAt: timestamp
│     ├─ bookmarks (subcollection)
│     │  └─ {bookmarkId} (doc)
│     │     ├─ termId: string
│     │     ├─ termName: string
│     │     ├─ definition: string
│     │     ├─ category: string
│     │     └─ createdAt: timestamp
│     ├─ activities (subcollection)
│     │  └─ {activityId} (doc)
│     │     ├─ type: 'quiz'|'bookmark'|'chat'|'study'
│     │     ├─ title: string
│     │     ├─ description: string
│     │     └─ createdAt: timestamp
│     ├─ notifications (subcollection)
│     │  └─ {notificationId} (doc)
│     │     ├─ title: string
│     │     ├─ body: string
│     │     ├─ data: map<string, any>
│     │     ├─ status: 'queued'|'sent'|'failed'
│     │     ├─ createdAt: timestamp
│     │     ├─ sentAt: timestamp|null
│     │     └─ readAt: timestamp|null
│     ├─ chats (subcollection)
│     │  └─ {sessionId} (doc)
│     │     ├─ userId: string               // == uid
│     │     ├─ title: string|null
│     │     ├─ lastMessage: string|null
│     │     ├─ messageCount: number
│     │     ├─ platform: 'web'|'mobile'
│     │     ├─ source: 'webview'|'native'
│     │     ├─ createdAt: timestamp
│     │     └─ updatedAt: timestamp
│     │     └─ messages (subcollection)
│     │        └─ {messageId} (doc)
│     │           ├─ role: 'user'|'assistant'
│     │           ├─ text: string
│     │           ├─ timestamp: timestamp
│     │           ├─ platform: 'web'|'mobile'
│     │           ├─ source: 'webview'|'native'
│     │           └─ isBookmarked: boolean // 메시지 단위 북마크 여부 (기본 false)
│     └─ quizResults (subcollection)
│        └─ {resultId} (doc)
│           ├─ quizId: string|null          // 템플릿 연결 시 사용
│           ├─ quizType: string             // 예: '전력시장 용어 퀴즈'
│           ├─ score: number                // 0~100
│           ├─ totalQuestions: number
│           ├─ correctAnswers: number
│           ├─ timeSpent: number            // 초 단위
│           └─ completedAt: timestamp
│
├─ terms (collection)                        // AI 사전(글로서리)
│  └─ {termId} (doc)
│     ├─ name: string
│     ├─ slug: string
│     ├─ definition: string
│     ├─ category: string
│     ├─ synonyms: array<string>
│     └─ updatedAt: timestamp
│
├─ quizzes (collection)                      // 퀴즈 템플릿
│  └─ {quizId} (doc)
│     ├─ title: string
│     ├─ category: string
│     ├─ difficulty: 'easy'|'medium'|'hard'
│     ├─ isActive: boolean
│     ├─ createdAt: timestamp
│     └─ updatedAt: timestamp
│     └─ questions (subcollection)
│        └─ {questionId} (doc)
│           ├─ type: 'multiple'|'ox'|'short'
│           ├─ question: string
│           ├─ options: array<string>|null  // multiple에서만
│           ├─ correctAnswer: string
│           ├─ description: string
│           └─ point: number                // 기본 10
│
└─ marketTrends (collection)                 // 외부 API 실시간 데이터
   └─ {trendId} (doc)
      ├─ type: string                        // 예: 'SMP'
      ├─ title: string
      ├─ description: string|null
      ├─ value: number|null
      ├─ change: number|null                 // 증감
      ├─ level: 'green'|'orange'|'red'|null
      ├─ date: timestamp
      ├─ source: string|null
      └─ updatedAt: timestamp
```

### 웹뷰 통합 Collections (신규)

#### `chatMessages` - 실시간 채팅 메시지

```typescript
{
  id: string,
  userId: string,
  text: string,
  isUser: boolean,
  timestamp: Timestamp,
  sessionId?: string,
  platform: 'web' | 'mobile',
  source: 'webview' | 'native'
}
```

#### `chatSessions` - 채팅 세션 관리

```typescript
{
  id: string,
  userId: string,
  title?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  platform: 'web' | 'mobile',
  source: 'webview' | 'native'
}
```

#### `userActivities` - 사용자 활동 추적

```typescript
{
  id: string,
  userId: string,
  type: 'login' | 'logout' | 'chat_message' | 'page_view' | 'quiz_attempt',
  data: Record<string, any>,
  timestamp: Timestamp,
  platform: 'web' | 'mobile',
  source: 'webview' | 'native'
}
```

#### `userStatus` - 실시간 사용자 상태

```typescript
{
  id: string, // userId
  userId: string,
  isOnline: boolean,
  lastSeen: Timestamp,
  platform: 'web' | 'mobile',
  source: 'webview' | 'native',
  activeSession?: string
}
```

### 기존 시스템 Collections

#### `users` - 사용자 프로필

```typescript
{
  uid: string,
  displayName: string | null,
  email: string | null,
  photoURL: string | null,
  providerId: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `userStats` - 사용자 학습 통계

```typescript
{
  uid: string,
  learnedTerms: number,
  bookmarks: number,
  quizScore: number,
  studyDays: number,
  totalQuizzes: number,
  correctAnswers: number,
  lastStudyDate: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `bookmarks` - 용어 북마크

```typescript
{
  id: string,
  uid: string,
  termId: string,
  termName: string,
  definition: string,
  category: string,
  createdAt: Timestamp
}
```

#### `chatHistory` - 채팅 기록 (기존)

```typescript
{
  id: string,
  uid: string,
  title: string,
  lastMessage: string,
  messageCount: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `quizResults` - 퀴즈 결과

```typescript
{
  id: string,
  uid: string,
  quizType: string,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  timeSpent: number,
  completedAt: Timestamp
}
```

#### `recentActivities` - 최근 활동

```typescript
{
  id: string,
  uid: string,
  type: 'quiz' | 'bookmark' | 'chat' | 'study',
  title: string,
  description: string,
  createdAt: Timestamp
}
```

## 🔥 Firebase 함수 및 서비스 정리

### Core Logic Firebase 함수 (@vpp/core-logic)

#### Firebase 초기화 및 설정

```typescript
// core-logic/src/firebase/app.ts
setFirebaseConfig(config: FirebaseConfig): void
getFirebaseConfig(): FirebaseConfig | null
initializeFirebase(): void
getFirebaseApp(): FirebaseApp | null
getFirebaseAuth(): Auth | null
getFirebaseFirestore(): Firestore | null
```

#### 사용자 프로필 관리

```typescript
// core-logic/src/firebase/firestore.ts
createUserProfile(userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void>
getUserProfile(uid: string): Promise<UserProfile | null>
updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void>
```

#### 사용자 통계 관리

```typescript
createUserStats(uid: string): Promise<void>
getUserStats(uid: string): Promise<UserStats | null>
updateUserStats(uid: string, updates: Partial<UserStats>): Promise<void>
subscribeToUserStats(uid: string, callback: (stats: UserStats | null) => void): () => void
```

#### 북마크 관리

```typescript
addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<string>
getUserBookmarks(uid: string): Promise<Bookmark[]>
removeBookmark(bookmarkId: string): Promise<void>
subscribeToUserBookmarks(uid: string, callback: (bookmarks: Bookmark[]) => void): () => void
```

#### 채팅 기록 관리 (기존 시스템)

```typescript
createChatHistory(chatHistory: Omit<ChatHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>
getUserChatHistory(uid: string, limitCount?: number): Promise<ChatHistory[]>
```

#### 퀴즈 결과 관리

```typescript
saveQuizResult(quizResult: Omit<QuizResult, 'id' | 'completedAt'>): Promise<string>
getUserQuizResults(uid: string, limitCount?: number): Promise<QuizResult[]>
```

#### 최근 활동 관리

```typescript
addRecentActivity(activity: Omit<RecentActivity, 'id' | 'createdAt'>): Promise<string>
getUserRecentActivities(uid: string, limitCount?: number): Promise<RecentActivity[]>
```

### 웹 앱 연동 (WebView + Zustand + Core Logic)

#### 인증/설정 초기화

```typescript
// apps/web/src/hooks/useWebViewAuth.ts, useWebAuth.ts
- Core Logic의 setFirebaseConfig / initializeFirebase 사용
- onAuthStateChanged로 AuthUser 동기화
- Zustand 전역 스토어(useAuthStore)로 상태 일원화
```

#### WebView 통신 레이어

```typescript
// core-logic/src/bridge/webview-bridge.ts
webViewBridge.postMessage({ type: 'REQUEST_AUTH' })
webViewBridge.sendAuth(authUser)
webViewBridge.sendFirebaseConfig(config)
webViewBridge.sendOpenSession(sessionId, messageId?)
```

#### 공통 유틸리티

```typescript
// core-logic/src/utils/type-guards.ts
isFirebaseTimestamp, toFirebaseTimestamp, toNumber, safeArrayAccess, safePropertyAccess;

// core-logic/src/utils/retry.ts
withRetry(fn, { maxAttempts, delayMs, exponentialBackoff });
```

#### 채팅 입력 프로바이더 (실시간 저장)

```typescript
// utils/inputProvider.tsx
- 채팅 메시지 즉시 Firebase 저장
- 사용자 활동 자동 로깅
- 세션 ID 자동 생성 및 관리
```

### Firebase 연동 플로우

#### 1. 모바일 → 웹 초기화

```
1. 모바일: getFirebaseConfig() → Firebase 설정 획득
2. 모바일: postMessage로 FIREBASE_CONFIG 전송
3. 웹: setFirebaseConfig() → Firebase 초기화
4. 웹: 사용자 상태 및 활동 로그 시작
```

#### 2. 실시간 채팅 저장

```
1. 사용자 메시지 입력
2. 로컬 상태 즉시 업데이트
3. Firebase chatMessages 컬렉션에 저장
4. Firebase userActivities에 채팅 활동 로그
5. 실시간 리스너를 통한 동기화
```

#### 3. 사용자 상태 추적

````
1. 로그인 시: userStatus 온라인 상태 업데이트
2. 페이지 뷰: userActivities에 페이지 방문 로그
3. 채팅 활동: 실시간 활동 추적
4. 로그아웃 시: 오프라인 상태 업데이트

## 🔧 개발 환경 설정

### 실행 명령어

```bash
# 웹 개발 서버 (Nx 문제 우회 시)
yarn --cwd apps/web vite --host 0.0.0.0 --port 5173

# 웹 빌드
cd core-logic && npx vite build
cd shared-ui && npx vite build
cd apps/web && npx vite build

# 모바일 앱 실행 (Expo)
cd apps/mobile && yarn start
````

### 환경 변수 설정

```bash
# Web App (.env)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Mobile App (.env)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_client_id
```

## 🔄 데이터 흐름

### 인증 흐름

1. **모바일**: Google OAuth → Firebase Auth
2. **모바일 → 웹**: postMessage로 AuthUser + Firebase Config 전송
3. **웹**: Firebase 초기화 → 사용자 상태 업데이트
4. **양방향**: Firestore에 활동 로그 저장

### 채팅 메시지 흐름

1. **사용자 입력**: 웹 또는 모바일에서 메시지 작성
2. **로컬 상태**: 즉시 UI 업데이트
3. **Firebase 저장**: chatMessages 컬렉션에 저장
4. **활동 로그**: userActivities에 채팅 활동 기록
5. **실시간 동기화**: 다른 클라이언트에 실시간 전파

## 📦 패키지 구조

### Monorepo 구성

- `apps/mobile/`: React Native + Expo 모바일 앱
- `apps/web/`: React + Vite 웹 앱
- `core-logic/`: 공용 비즈니스 로직 및 Firebase SDK
- `shared-ui/`: 공용 UI 컴포넌트
- `tailwind-config/`: 공용 Tailwind 설정

### 주요 기술 스택

- **Frontend**: React, React Native, TypeScript, Tailwind CSS
- **State Management**: Zustand (Vanilla Store, @vpp/core-logic의 useAuthStore)
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Build Tools**: Vite, Expo
- **Authentication**: Firebase Auth + Google OAuth

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
