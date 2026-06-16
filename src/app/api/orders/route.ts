import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// 1. 주문 하기 (POST) - 트랜잭션 적용
export async function POST(request: Request) {
  try {
    // 1-1. 세션 확인 (로그인 유저 검증)
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요한 서비스입니다.' },
        { status: 401 }
      );
    }

    const { items } = await request.json(); // items: Array<{ menuId: number, quantity: number }>

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: '장바구니가 비어 있습니다.' },
        { status: 400 }
      );
    }

    // 1-2. 클라이언트 가격 변조 방지를 위해 DB에서 실시간 메뉴 정보 조회
    const menuIds = items.map((item: any) => item.menuId);
    const dbMenus = await prisma.menu.findMany({
      where: { id: { in: menuIds } },
    });

    // 조회한 메뉴 매핑 맵 생성
    const menuMap = new Map(dbMenus.map((menu) => [menu.id, menu]));

    let calculatedTotalPrice = 0;
    const orderItemsData: { menuId: number; quantity: number; price: number }[] = [];

    // 주문 상세 데이터 빌드 및 총액 계산
    for (const item of items) {
      const menu = menuMap.get(item.menuId);
      if (!menu) {
        return NextResponse.json(
          { error: `존재하지 않는 메뉴(ID: ${item.menuId})가 포함되어 있습니다.` },
          { status: 400 }
        );
      }
      const itemPrice = menu.price * item.quantity;
      calculatedTotalPrice += itemPrice;

      orderItemsData.push({
        menuId: menu.id,
        quantity: item.quantity,
        price: menu.price, // 주문 당시의 가격 저장 (가치 보존)
      });
    }

    // 1-3. 데이터베이스 트랜잭션 적용 (주문과 주문상세를 묶어서 안전하게 등록)
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. 주문 생성
      const order = await tx.order.create({
        data: {
          userId: session.id,
          totalPrice: calculatedTotalPrice,
          status: '접수', // 기본 상태: 접수
        },
      });

      // 2. 주문 상세들 생성
      await tx.orderItem.createMany({
        data: orderItemsData.map((item) => ({
          ...item,
          orderId: order.id,
        })),
      });

      return order;
    });

    return NextResponse.json(
      { message: '주문이 성공적으로 완료되었습니다.', orderId: newOrder.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('주문 처리 중 에러:', error);
    return NextResponse.json(
      { error: '주문 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 2. 내 주문 내역 조회 (GET)
export async function GET() {
  try {
    // 2-1. 세션 확인
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요한 서비스입니다.' },
        { status: 401 }
      );
    }

    // 2-2. 해당 사용자의 모든 주문 내역 가져오기 (주문 상세, 메뉴 정보, 식당 정보까지 조인)
    const orders = await prisma.order.findMany({
      where: { userId: session.id },
      include: {
        orderItems: {
          include: {
            menu: {
              include: {
                restaurant: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // 최신 주문부터 정렬
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('주문 내역 조회 에러:', error);
    return NextResponse.json(
      { error: '주문 내역을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
