import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, setSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. 필수 값 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 모두 입력해 주세요.' },
        { status: 400 }
      );
    }

    // 2. 이메일 존재 여부 체크
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 잘못되었습니다.' },
        { status: 401 }
      );
    }

    // 3. 비밀번호 일치 체크
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 잘못되었습니다.' },
        { status: 401 }
      );
    }

    // 4. 세션 쿠키 설정
    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      message: '로그인에 성공했습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('로그인 에러:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
