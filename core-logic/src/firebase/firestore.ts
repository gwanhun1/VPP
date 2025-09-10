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
  providerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserStats {
  uid: string;
  learnedTerms: number;
  bookmarks: number;
  quizScore: number;
  studyDays: number;
  totalQuizzes: number;
  correctAnswers: number;
  lastStudyDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Bookmark {
  id?: string;
  uid: string;
  termId: string;
  termName: string;
  definition: string;
  category: string;
  createdAt: Timestamp;
}

export interface ChatHistory {
  id?: string;
  uid: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id?: string;
  chatId: string;
  uid: string;
  content: string;
  isUser: boolean;
  createdAt: Timestamp;
}

export interface QuizResult {
  id?: string;
  uid: string;
  quizType: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // 초 단위
  completedAt: Timestamp;
}

export interface RecentActivity {
  id?: string;
  uid: string;
  type: 'quiz' | 'bookmark' | 'chat' | 'study';
  title: string;
  description: string;
  createdAt: Timestamp;
}

// 사용자 프로필 관리
export async function createUserProfile(userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
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

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const userDoc = doc(db, 'users', uid);
  await updateDoc(userDoc, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// 사용자 통계 관리
export async function createUserStats(uid: string): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const statsDoc = doc(db, 'userStats', uid);
  await setDoc(statsDoc, {
    uid,
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

  const statsDoc = doc(db, 'userStats', uid);
  const docSnap = await getDoc(statsDoc);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserStats;
  }
  return null;
}

export async function updateUserStats(uid: string, updates: Partial<UserStats>): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const statsDoc = doc(db, 'userStats', uid);
  await updateDoc(statsDoc, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// 북마크 관리
export async function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const bookmarksCollection = collection(db, 'bookmarks');
  const docRef = await addDoc(bookmarksCollection, {
    ...bookmark,
    createdAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function getUserBookmarks(uid: string): Promise<Bookmark[]> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const bookmarksQuery = query(
    collection(db, 'bookmarks'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(bookmarksQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Bookmark[];
}

export async function removeBookmark(bookmarkId: string): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const bookmarkDoc = doc(db, 'bookmarks', bookmarkId);
  await deleteDoc(bookmarkDoc);
}

// 채팅 기록 관리
export async function createChatHistory(chatHistory: Omit<ChatHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const chatCollection = collection(db, 'chatHistory');
  const docRef = await addDoc(chatCollection, {
    ...chatHistory,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function getUserChatHistory(uid: string, limitCount = 10): Promise<ChatHistory[]> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const chatQuery = query(
    collection(db, 'chatHistory'),
    where('uid', '==', uid),
    orderBy('updatedAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(chatQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatHistory[];
}

// 퀴즈 결과 관리
export async function saveQuizResult(quizResult: Omit<QuizResult, 'id' | 'completedAt'>): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const quizCollection = collection(db, 'quizResults');
  const docRef = await addDoc(quizCollection, {
    ...quizResult,
    completedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function getUserQuizResults(uid: string, limitCount = 10): Promise<QuizResult[]> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const quizQuery = query(
    collection(db, 'quizResults'),
    where('uid', '==', uid),
    orderBy('completedAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(quizQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as QuizResult[];
}

// 최근 활동 관리
export async function addRecentActivity(activity: Omit<RecentActivity, 'id' | 'createdAt'>): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const activityCollection = collection(db, 'recentActivities');
  const docRef = await addDoc(activityCollection, {
    ...activity,
    createdAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function getUserRecentActivities(uid: string, limitCount = 10): Promise<RecentActivity[]> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const activityQuery = query(
    collection(db, 'recentActivities'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(activityQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as RecentActivity[];
}

// 실시간 리스너 설정
export function subscribeToUserStats(uid: string, callback: (stats: UserStats | null) => void): () => void {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const statsDoc = doc(db, 'userStats', uid);
  return onSnapshot(statsDoc, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as UserStats);
    } else {
      callback(null);
    }
  });
}

export function subscribeToUserBookmarks(uid: string, callback: (bookmarks: Bookmark[]) => void): () => void {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');

  const bookmarksQuery = query(
    collection(db, 'bookmarks'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(bookmarksQuery, (querySnapshot) => {
    const bookmarks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Bookmark[];
    callback(bookmarks);
  });
}
