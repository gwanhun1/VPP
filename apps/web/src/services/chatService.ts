import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { getFirestore } from '../lib/firebase';
import type { AuthUser } from '@vpp/core-logic';

// 채팅 메시지 타입 정의
export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  isUser: boolean;
  timestamp: Timestamp;
  sessionId?: string;
  metadata?: {
    platform: 'web' | 'mobile';
    userAgent?: string;
    source: 'webview' | 'native';
  };
}

// 채팅 세션 타입 정의
export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  messageCount: number;
  platform: 'web' | 'mobile';
  source: 'webview' | 'native';
}

/**
 * 채팅 메시지를 Firestore에 저장
 */
export async function saveChatMessage(
  authUser: AuthUser,
  text: string,
  isUser: boolean,
  sessionId?: string
): Promise<string> {
  const db = getFirestore();
  if (!db) {
    throw new Error('Firestore가 초기화되지 않았습니다.');
  }

  const messageData: Omit<ChatMessage, 'id'> = {
    userId: authUser.uid,
    text,
    isUser,
    timestamp: serverTimestamp() as Timestamp,
    sessionId,
    metadata: {
      platform: 'web',
      userAgent: navigator.userAgent,
      source: 'webview',
    },
  };

  try {
    const docRef = await addDoc(collection(db, 'chatMessages'), messageData);
    console.log('[ChatService] 메시지 저장 완료:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[ChatService] 메시지 저장 실패:', error);
    throw error;
  }
}

/**
 * 사용자의 채팅 메시지 실시간 구독
 */
export function subscribeToChatMessages(
  authUser: AuthUser,
  sessionId: string | null,
  onMessagesUpdate: (messages: ChatMessage[]) => void
): () => void {
  const db = getFirestore();
  if (!db) {
    console.warn('[ChatService] Firestore가 초기화되지 않아 구독을 건너뜁니다.');
    return () => {};
  }

  let q;
  if (sessionId) {
    // 특정 세션의 메시지만 조회
    q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', authUser.uid),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );
  } else {
    // 전체 메시지 조회 (최근 50개로 제한)
    q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', authUser.uid),
      orderBy('timestamp', 'desc')
    );
  }

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as ChatMessage);
      });
      
      // 시간순 정렬 (오래된 것부터)
      if (!sessionId) {
        messages.reverse();
      }
      
      onMessagesUpdate(messages);
    },
    (error) => {
      console.error('[ChatService] 메시지 구독 오류:', error);
    }
  );

  return unsubscribe;
}

/**
 * 새 채팅 세션 생성
 */
export async function createChatSession(
  authUser: AuthUser,
  title: string = '새 채팅'
): Promise<string> {
  const db = getFirestore();
  if (!db) {
    throw new Error('Firestore가 초기화되지 않았습니다.');
  }

  const sessionData: Omit<ChatSession, 'id'> = {
    userId: authUser.uid,
    title,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    messageCount: 0,
    platform: 'web',
    source: 'webview',
  };

  try {
    const docRef = await addDoc(collection(db, 'chatSessions'), sessionData);
    console.log('[ChatService] 채팅 세션 생성 완료:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[ChatService] 채팅 세션 생성 실패:', error);
    throw error;
  }
}
