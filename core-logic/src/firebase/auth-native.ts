import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  AuthRequest,
  ResponseType,
  DiscoveryDocument,
} from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getFirebaseAuth, initializeFirebase } from './app';
import type { AuthUser } from './types';

WebBrowser.maybeCompleteAuthSession();

function mapAuthUserFromFirebaseUser(user: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    providerId: 'google',
  };
}

export async function signInWithGoogle(): Promise<AuthUser> {
  initializeFirebase();
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth가 초기화되지 않았습니다. setFirebaseConfig를 확인하세요.');

  const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!clientId) throw new Error('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID가 설정되지 않았습니다.');

  const redirectUri = makeRedirectUri();

  const discovery: DiscoveryDocument = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };

  const request = new AuthRequest({
    clientId,
    redirectUri,
    responseType: ResponseType.IdToken,
    scopes: ['openid', 'email', 'profile'],
  });

  await WebBrowser.warmUpAsync();
  try {
    const result = await request.promptAsync(discovery);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token: string | undefined = (result as any)?.params?.id_token;
    if (!token) throw new Error('Google에서 id_token을 받지 못했습니다.');

    const credential = GoogleAuthProvider.credential(token);
    const cred = await signInWithCredential(auth, credential);
    const user = cred.user;
    return mapAuthUserFromFirebaseUser({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
  } finally {
    await WebBrowser.dismissBrowser().catch(() => undefined);
    await WebBrowser.coolDownAsync();
  }
}
