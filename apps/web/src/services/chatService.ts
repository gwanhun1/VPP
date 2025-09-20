import { 
  createUserChatSession,
  sendChatMessage,
  fetchUserChatSessions,
  fetchChatMessages,
  subscribeToChatMessagesUpdates,
  type ChatSession,
  type ChatMessage,
  type AuthUser
} from '@vpp/core-logic';

// 타입들은 @vpp/core-logic에서 가져옴
export type { ChatMessage, ChatSession } from '@vpp/core-logic';

/**
 * 채팅 메시지를 Firestore에 저장
 */
export async function saveChatMessage(
  authUser: AuthUser,
  text: string,
  isUser: boolean,
  sessionId: string
): Promise<string> {
  if (!sessionId) {
    throw new Error('세션 ID가 필요합니다.');
  }

  try {
    const messageId = await sendChatMessage(
      sessionId,
      text,
      isUser ? 'user' : 'assistant',
      'web',
      'webview'
    );
    console.log('[ChatService] 메시지 저장 완료:', messageId);
    return messageId;
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
  sessionId: string,
  onMessagesUpdate: (messages: Array<ChatMessage & { id: string }>) => void
): () => void {
  if (!sessionId) {
    console.warn('[ChatService] 세션 ID가 없어 구독을 건너뛵니다.');
    return () => {};
  }

  try {
    return subscribeToChatMessagesUpdates(sessionId, (messages) => {
      console.log('[ChatService] 메시지 업데이트:', messages.length, '개');
      onMessagesUpdate(messages);
    });
  } catch (error) {
    console.error('[ChatService] 메시지 구독 오류:', error);
    return () => {};
  }
}

/**
 * 새 채팅 세션 생성
 */
export async function createChatSession(
  authUser: AuthUser,
  title: string = '새 채팅'
): Promise<string> {
  try {
    const sessionId = await createUserChatSession(title, 'web', 'webview');
    console.log('[ChatService] 채팅 세션 생성 완료:', sessionId);
    return sessionId;
  } catch (error) {
    console.error('[ChatService] 채팅 세션 생성 실패:', error);
    throw error;
  }
}

/**
 * 사용자의 채팅 세션 목록 조회
 */
export async function getChatSessions(authUser: AuthUser): Promise<Array<ChatSession & { id: string }>> {
  try {
    const sessions = await fetchUserChatSessions();
    console.log('[ChatService] 채팅 세션 조회 완료:', sessions.length, '개');
    return sessions;
  } catch (error) {
    console.error('[ChatService] 채팅 세션 조회 실패:', error);
    return [];
  }
}

/**
 * 특정 세션의 메시지 조회
 */
export async function getSessionMessages(authUser: AuthUser, sessionId: string): Promise<Array<ChatMessage & { id: string }>> {
  try {
    const messages = await fetchChatMessages(sessionId);
    console.log('[ChatService] 세션 메시지 조회 완료:', messages.length, '개');
    return messages;
  } catch (error) {
    console.error('[ChatService] 세션 메시지 조회 실패:', error);
    return [];
  }
}
