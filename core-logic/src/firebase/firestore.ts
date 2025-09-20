import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './app';

// Firestore 데이터 타입 정의
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: 'anonymous' | 'google' | 'naver' | 'kakao' | 'password';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserDevice {
  expoPushToken: string | null;
  fcmToken: string | null;
  platform: 'ios' | 'android' | 'web';
  appVersion: string | null;
  updatedAt: Timestamp;
}

export interface UserStats {
  learnedTerms: number;
  bookmarks: number;
  quizScore: number; // 정답률(%) 0~100
  studyDays: number; // 연속 학습일
  totalQuizzes: number;
  correctAnswers: number;
  lastStudyDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Bookmark {
  termId: string;
  termName: string;
  definition: string;
  category: string;
  createdAt: Timestamp;
}

export interface RecentActivity {
  type: 'quiz' | 'bookmark' | 'chat' | 'study';
  title: string;
  description: string;
  createdAt: Timestamp;
}

export interface UserNotification {
  title: string;
  body: string;
  data: Record<string, any>;
  status: 'queued' | 'sent' | 'failed';
  createdAt: Timestamp;
  sentAt: Timestamp | null;
  readAt: Timestamp | null;
}

export interface ChatSession {
  userId: string; // == uid
  title: string | null;
  lastMessage: string | null;
  messageCount: number;
  platform: 'web' | 'mobile';
  source: 'webview' | 'native';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Timestamp;
  platform: 'web' | 'mobile';
  source: 'webview' | 'native';
}

export interface QuizResult {
  quizId: string | null; // 템플릿 연결 시 사용
  quizType: string; // 예: '전력시장 용어 퀴즈'
  score: number; // 0~100
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // 초 단위
  completedAt: Timestamp;
}

// ===== 사용자 프로필 관리 =====
export async function createUserProfile(
  userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'>
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const userDoc = doc(db, 'users', userProfile.uid);
  await setDoc(userDoc, {
    ...userProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const userDoc = doc(db, 'users', uid);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const userDoc = doc(db, 'users', uid);
  await updateDoc(userDoc, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ===== 디바이스 관리 =====
export async function updateUserDevice(
  uid: string,
  deviceId: string,
  deviceInfo: Omit<UserDevice, 'updatedAt'>
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const deviceDoc = doc(db, 'users', uid, 'devices', deviceId);
  await setDoc(deviceDoc, {
    ...deviceInfo,
    updatedAt: serverTimestamp(),
  });
}

export async function getUserDevice(
  uid: string,
  deviceId: string
): Promise<UserDevice | null> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const deviceDoc = doc(db, 'users', uid, 'devices', deviceId);
  const docSnap = await getDoc(deviceDoc);

  if (docSnap.exists()) {
    return docSnap.data() as UserDevice;
  }
  return null;
}

export async function getUserDevices(
  uid: string
): Promise<Record<string, UserDevice>> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const devicesCol = collection(db, 'users', uid, 'devices');
  const snapshot = await getDocs(devicesCol);

  const devices: Record<string, UserDevice> = {};
  snapshot.forEach((doc) => {
    devices[doc.id] = doc.data() as UserDevice;
  });

  return devices;
}

// ===== 사용자 통계 관리 =====
export async function createUserStats(uid: string): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const statsDoc = doc(db, 'users', uid, 'stats', 'summary');
  await setDoc(statsDoc, {
    learnedTerms: 0,
    bookmarks: 0,
    quizScore: 0,
    studyDays: 0,
    totalQuizzes: 0,
    correctAnswers: 0,
    lastStudyDate: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserStats(uid: string): Promise<UserStats | null> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const statsDoc = doc(db, 'users', uid, 'stats', 'summary');
  const docSnap = await getDoc(statsDoc);

  if (docSnap.exists()) {
    return docSnap.data() as UserStats;
  }
  return null;
}

export async function updateUserStats(
  uid: string,
  updates: Partial<Omit<UserStats, 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const statsDoc = doc(db, 'users', uid, 'stats', 'summary');
  await updateDoc(statsDoc, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ===== 북마크 관리 =====
export async function addBookmark(
  uid: string,
  bookmark: Omit<Bookmark, 'createdAt'>
): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const bookmarksCol = collection(db, 'users', uid, 'bookmarks');
  const docRef = await addDoc(bookmarksCol, {
    ...bookmark,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function removeBookmark(
  uid: string,
  bookmarkId: string
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const bookmarkDoc = doc(db, 'users', uid, 'bookmarks', bookmarkId);
  await deleteDoc(bookmarkDoc);
}

export async function getUserBookmarks(
  uid: string,
  limitCount?: number
): Promise<Array<Bookmark & { id: string }>> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const bookmarksCol = collection(db, 'users', uid, 'bookmarks');
  let q = query(bookmarksCol, orderBy('createdAt', 'desc'));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Bookmark),
  }));
}

// ===== 최근 활동 관리 =====
export async function addRecentActivity(
  uid: string,
  activity: Omit<RecentActivity, 'createdAt'>
): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const activitiesCol = collection(db, 'users', uid, 'activities');
  const docRef = await addDoc(activitiesCol, {
    ...activity,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getUserRecentActivities(
  uid: string,
  limitCount = 10
): Promise<Array<RecentActivity & { id: string }>> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const activitiesCol = collection(db, 'users', uid, 'activities');
  const q = query(
    activitiesCol,
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as RecentActivity),
  }));
}

// ===== 퀴즈 결과 관리 =====
export async function addQuizResult(
  uid: string,
  result: Omit<QuizResult, 'completedAt'>
): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const resultsCol = collection(db, 'users', uid, 'quizResults');
  const docRef = await addDoc(resultsCol, {
    ...result,
    completedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getUserQuizResults(
  uid: string,
  limitCount?: number
): Promise<Array<QuizResult & { id: string }>> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const resultsCol = collection(db, 'users', uid, 'quizResults');
  let q = query(resultsCol, orderBy('completedAt', 'desc'));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as QuizResult),
  }));
}

// ===== 채팅 세션 관리 =====
export async function createChatSession(
  uid: string,
  sessionData: Omit<ChatSession, 'createdAt' | 'updatedAt'>
): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const chatsCol = collection(db, 'users', uid, 'chats');
  const docRef = await addDoc(chatsCol, {
    ...sessionData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getChatSession(
  uid: string,
  sessionId: string
): Promise<ChatSession | null> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const sessionDoc = doc(db, 'users', uid, 'chats', sessionId);
  const docSnap = await getDoc(sessionDoc);

  if (docSnap.exists()) {
    return docSnap.data() as ChatSession;
  }
  return null;
}

export async function updateChatSession(
  uid: string,
  sessionId: string,
  updates: Partial<Omit<ChatSession, 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const sessionDoc = doc(db, 'users', uid, 'chats', sessionId);
  await updateDoc(sessionDoc, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function getUserChatSessions(
  uid: string,
  limitCount?: number
): Promise<Array<ChatSession & { id: string }>> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const chatsCol = collection(db, 'users', uid, 'chats');
  let q = query(chatsCol, orderBy('updatedAt', 'desc'));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as ChatSession),
  }));
}

export async function deleteChatSession(
  uid: string,
  sessionId: string
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const sessionDoc = doc(db, 'users', uid, 'chats', sessionId);
  await deleteDoc(sessionDoc);
}

// ===== 채팅 메시지 관리 =====
export async function addChatMessage(
  uid: string,
  sessionId: string,
  message: Omit<ChatMessage, 'timestamp'>
): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const messagesCol = collection(
    db,
    'users',
    uid,
    'chats',
    sessionId,
    'messages'
  );
  const docRef = await addDoc(messagesCol, {
    ...message,
    timestamp: serverTimestamp(),
  });

  // 채팅 세션의 lastMessage와 messageCount 업데이트
  await updateChatSession(uid, sessionId, {
    lastMessage: message.text,
    messageCount: await getChatMessageCount(uid, sessionId),
  });

  return docRef.id;
}

export async function getChatMessages(
  uid: string,
  sessionId: string,
  limitCount?: number
): Promise<Array<ChatMessage & { id: string }>> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const messagesCol = collection(
    db,
    'users',
    uid,
    'chats',
    sessionId,
    'messages'
  );
  let q = query(messagesCol, orderBy('timestamp', 'asc'));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as ChatMessage),
  }));
}

export async function getChatMessageCount(
  uid: string,
  sessionId: string
): Promise<number> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const messagesCol = collection(
    db,
    'users',
    uid,
    'chats',
    sessionId,
    'messages'
  );
  const snapshot = await getDocs(messagesCol);
  return snapshot.size;
}

// ===== 알림 관리 =====
export async function addUserNotification(
  uid: string,
  notification: Omit<UserNotification, 'createdAt' | 'sentAt' | 'readAt'>
): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const notificationsCol = collection(db, 'users', uid, 'notifications');
  const docRef = await addDoc(notificationsCol, {
    ...notification,
    createdAt: serverTimestamp(),
    sentAt: null,
    readAt: null,
  });

  return docRef.id;
}

export async function getUserNotifications(
  uid: string,
  limitCount?: number
): Promise<Array<UserNotification & { id: string }>> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const notificationsCol = collection(db, 'users', uid, 'notifications');
  let q = query(notificationsCol, orderBy('createdAt', 'desc'));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as UserNotification),
  }));
}

export async function markNotificationAsRead(
  uid: string,
  notificationId: string
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const notificationDoc = doc(
    db,
    'users',
    uid,
    'notifications',
    notificationId
  );
  await updateDoc(notificationDoc, {
    readAt: serverTimestamp(),
  });
}

export async function markNotificationAsSent(
  uid: string,
  notificationId: string
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const notificationDoc = doc(
    db,
    'users',
    uid,
    'notifications',
    notificationId
  );
  await updateDoc(notificationDoc, {
    status: 'sent',
    sentAt: serverTimestamp(),
  });
}

// ===== 사용자 초기화 헬퍼 함수 =====
export async function initializeNewUser(
  userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'>
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  // 사용자 프로필 생성
  await createUserProfile(userProfile);

  // 사용자 통계 초기화
  await createUserStats(userProfile.uid);

  // 첫 활동 기록
  await addRecentActivity(userProfile.uid, {
    type: 'study',
    title: 'VPP 가입',
    description: '전력시장 AI 서비스에 가입했습니다.',
  });
}

// ===== 실시간 구독 함수들 =====
export function subscribeToUserStats(
  uid: string,
  callback: (stats: UserStats | null) => void
): () => void {
  const db = getFirebaseFirestore();
  if (!db) {
    callback(null);
    return () => {};
  }

  const statsDoc = doc(db, 'users', uid, 'stats', 'summary');
  return onSnapshot(
    statsDoc,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as UserStats);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('사용자 통계 구독 오류:', error);
      callback(null);
    }
  );
}

export function subscribeToUserBookmarks(
  uid: string,
  callback: (bookmarks: Array<Bookmark & { id: string }>) => void
): () => void {
  const db = getFirebaseFirestore();
  if (!db) {
    callback([]);
    return () => {};
  }

  const bookmarksCol = collection(db, 'users', uid, 'bookmarks');
  const q = query(bookmarksCol, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const bookmarks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Bookmark),
      }));
      callback(bookmarks);
    },
    (error) => {
      console.error('북마크 구독 오류:', error);
      callback([]);
    }
  );
}

export function subscribeToUserRecentActivities(
  uid: string,
  callback: (activities: Array<RecentActivity & { id: string }>) => void,
  limitCount = 10
): () => void {
  const db = getFirebaseFirestore();
  if (!db) {
    callback([]);
    return () => {};
  }

  const activitiesCol = collection(db, 'users', uid, 'activities');
  const q = query(
    activitiesCol,
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const activities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as RecentActivity),
      }));
      callback(activities);
    },
    (error) => {
      console.error('최근 활동 구독 오류:', error);
      callback([]);
    }
  );
}

export function subscribeToChatMessages(
  uid: string,
  sessionId: string,
  callback: (messages: Array<ChatMessage & { id: string }>) => void
): () => void {
  const db = getFirebaseFirestore();
  if (!db) {
    callback([]);
    return () => {};
  }

  const messagesCol = collection(
    db,
    'users',
    uid,
    'chats',
    sessionId,
    'messages'
  );
  const q = query(messagesCol, orderBy('timestamp', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as ChatMessage),
      }));
      callback(messages);
    },
    (error) => {
      console.error('채팅 메시지 구독 오류:', error);
      callback([]);
    }
  );
}

export function subscribeToUserNotifications(
  uid: string,
  callback: (notifications: Array<UserNotification & { id: string }>) => void
): () => void {
  const db = getFirebaseFirestore();
  if (!db) {
    callback([]);
    return () => {};
  }

  const notificationsCol = collection(db, 'users', uid, 'notifications');
  const q = query(
    notificationsCol,
    orderBy('createdAt', 'desc'),
    where('readAt', '==', null)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as UserNotification),
      }));
      callback(notifications);
    },
    (error) => {
      console.error('알림 구독 오류:', error);
      callback([]);
    }
  );
}
