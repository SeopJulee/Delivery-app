import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ message: '로그아웃 되었습니다.' });
  } catch (error: any) {
    console.error('로그아웃 에러:', error);
    return NextResponse.json(
      { error: '로그아웃 처리 중 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
}
