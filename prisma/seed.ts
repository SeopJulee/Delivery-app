import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;

// 데이터베이스 연결 설정 (Prisma 7 드라이버 어댑터 적용)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('초기 데이터 시딩(Seeding) 시작...');

  // 기존 데이터가 있다면 삭제 (초기화)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  console.log('이전 데이터 청소 완료.');

  // 1. 테스트 사용자 생성 (비밀번호는 나중에 bcrypt로 해싱하겠지만, 여기서는 테스트용 원본 문자열로 일단 입력)
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'password123', // 간단한 테스트 비밀번호
      name: '홍길동',
    },
  });
  console.log('테스트 유저 생성 완료:', user.email);

  // 2. 식당 및 메뉴 생성 (교수님 성함 '최성철'을 넣은 재미있는 이스터 에그 포함!)
  const r1 = await prisma.restaurant.create({
    data: {
      name: '성철 반점 (명품 중식)',
      description: '컴퓨터과학개론 최성철 교수님이 추천하는 정통 짜장면과 마파두부 맛집!',
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60',
      category: '중식',
      menus: {
        create: [
          { name: '교수님 추천 마파두부밥', price: 10000, description: '부드러운 연두부와 사천식 매콤한 소스의 조화', imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60' },
          { name: '대마왕 짜장면', price: 8000, description: '진한 춘장 소스와 쫄깃한 수타면', imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&auto=format&fit=crop&q=60' },
          { name: '바삭 바삭 꿔바로우', price: 18000, description: '찹쌀 반죽으로 튀겨내어 더욱 쫄깃한 북경식 탕수육', imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  const r2 = await prisma.restaurant.create({
    data: {
      name: '마이클 타코 (멕시칸)',
      description: '매콤하고 신선한 재료로 만드는 정통 타코와 퀘사디아 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=60',
      category: '멕시칸',
      menus: {
        create: [
          { name: '비프 타코 (3pcs)', price: 9500, description: '그릴에 구운 소고기와 신선한 과카몰리가 가득한 타코', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60' },
          { name: '치즈 퀘사디아', price: 11000, description: '녹아내리는 치즈와 구운 닭가슴살이 어우러진 퀘사디아', imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  const r3 = await prisma.restaurant.create({
    data: {
      name: '지민 스시 (초밥 전문)',
      description: '싱싱한 활어와 장인의 손맛이 느껴지는 스시 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60',
      category: '일식',
      menus: {
        create: [
          { name: '특선 모듬초밥 (12pcs)', price: 22000, description: '당일 엄선한 신선한 횟감으로 만든 고급 모듬 초밥', imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&auto=format&fit=crop&q=60' },
          { name: '노르웨이 연어 덮밥 (사케동)', price: 15000, description: '부드러운 연어 뱃살과 특제 소스를 얹은 덮밥', imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  console.log('식당 및 메뉴 초기 데이터 입력 완료!');
  console.log('성철 반점:', r1.name);
  console.log('마이클 타코:', r2.name);
  console.log('지민 스시:', r3.name);
  console.log('시딩 완료. 데이터베이스 준비 끝!');
}

main()
  .catch((e) => {
    console.error('시딩 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
