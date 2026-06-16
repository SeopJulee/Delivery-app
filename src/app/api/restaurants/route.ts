import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // 식당 카테고리 필터값 (가산점 기능)

    // 조건절 구성
    const whereClause = category && category !== '전체' ? { category } : {};

    // 식당 목록 및 해당 식당의 메뉴 목록을 DB에서 한 번에 조회 (1:N 관계 조인)
    const restaurants = await prisma.restaurant.findMany({
      where: whereClause,
      include: {
        menus: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json(restaurants);
  } catch (error: any) {
    console.error('식당/메뉴 조회 에러:', error);
    return NextResponse.json(
      { error: '데이터를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
