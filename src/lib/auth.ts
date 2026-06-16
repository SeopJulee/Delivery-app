import { cookies } from 'next/headers';
import crypto from 'crypto';

// 1. 비밀번호 단방향 해싱 함수 (SHA-256 + Salt)
// 교수님께 설명하기 아주 좋은 직관적인 암호화 로직입니다.
export function hashPassword(password: string): string {
  const salt = 'delivery_app_salt_1234!'; // 해싱에 사용할 솔트값
  return crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');
}

export interface SessionUser {
  id: number;
  email: string;
  name: string;
}

// 2. 세션 조회 함수 (쿠키에서 로그인된 유저 정보 가져오기)
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user_session');

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    // 세션 쿠키 값(Base64)을 디코딩하여 JSON 객체로 파싱
    const decodedValue = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const user = JSON.parse(decodedValue) as SessionUser;
    return user;
  } catch (error) {
    console.error('세션 파싱 실패:', error);
    return null;
  }
}

// 3. 세션 저장 함수 (쿠키에 유저 정보 Base64 저장)
export async function setSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  
  // 간단하고 직관적인 Base64 인코딩 세션 저장 (교육용 프로젝트에 적합)
  const sessionData = JSON.stringify({ id: user.id, email: user.email, name: user.name });
  const encodedValue = Buffer.from(sessionData).toString('base64');

  cookieStore.set('user_session', encodedValue, {
    httpOnly: true, // 브라우저 JS에서 쿠키에 접근하지 못하도록 설정 (보안 강화)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7일 유지
    path: '/',
  });
}

// 4. 세션 삭제 함수 (로그아웃용)
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('user_session');
}
