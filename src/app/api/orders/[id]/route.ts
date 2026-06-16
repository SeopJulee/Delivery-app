import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// 주문 상태 업데이트 API (PATCH) - 가산점 기능 (주문 상태 접수/배달중/완료 시뮬레이션용)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요한 서비스입니다.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { status } = await request.json(); // status: '접수' | '배달중' | '완료'

    if (!status) {
      return NextResponse.json(
        { error: '변경할 상태 값이 필요합니다.' },
        { status: 400 }
      );
    }

    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: '올바르지 않은 주문 ID입니다.' },
        { status: 400 }
      );
    }

    // 주문 정보 존재 및 소유권 체크
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: '해당 주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 다른 유저가 주문 상태를 고치는 것 차단
    if (order.userId !== session.id) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 주문 상태 변경
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({
      message: '주문 상태가 업데이트되었습니다.',
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('주문 상태 업데이트 에러:', error);
    return NextResponse.json(
      { error: '주문 상태 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
