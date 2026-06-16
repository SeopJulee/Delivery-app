import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('초기 데이터 시딩(Seeding) 시작...');

  // 기존 데이터 삭제 (연관 데이터가 많으므로 안전하게 역순 삭제)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  console.log('기존 데이터 초기화 완료.');

  // 1. 테스트 사용자 생성
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'password123',
      name: '홍길동',
    },
  });
  console.log('테스트 유저 생성 완료:', user.email);

  // 2. 카테고리별 식당 및 메뉴 데이터 추가

  // ==================== [한식] 카테고리 (6개 업소) ====================
  console.log('한식 데이터 추가 중...');
  await prisma.restaurant.create({
    data: {
      name: '종가집 김치찌개 전문',
      description: '푹 익은 묵은지와 국산 돼지고기로 깊은 맛을 낸 정통 김치찌개',
      imageUrl: '/delicious_kimchi.png', // 김치찌개 전용 고화질 이미지
      category: '한식',
      menus: {
        create: [
          { name: '돼지고기 듬뿍 김치찌개', price: 9000, description: '부드러운 돼지 앞다리살이 가득 들어간 베스트 메뉴', imageUrl: '/delicious_kimchi.png' },
          { name: '참치 반반 김치찌개', price: 9000, description: '고소한 참치와 깔끔한 국물 맛의 만남', imageUrl: '/delicious_kimchi.png' },
          { name: '햄소시지 부대김치찌개', price: 9500, description: '부대찌개 스타일로 즐기는 푸짐한 김치찌개', imageUrl: '/delicious_kimchi.png' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '한가람 제육볶음',
      description: '불맛 코팅 제대로 입힌 매콤 달콤한 밥도둑 제육볶음 전문점',
      imageUrl: '/delicious_jeyuk.png', // 제육볶음 전용 고화질 이미지
      category: '한식',
      menus: {
        create: [
          { name: '매콤 불 제육볶음', price: 9500, description: '화끈한 매운맛과 화려한 불향의 불제육', imageUrl: '/delicious_jeyuk.png' },
          { name: '달콤 단짠 간장제육', price: 9500, description: '아이들도 좋아하는 맵지 않은 마늘 간장 베이스 제육', imageUrl: '/delicious_jeyuk.png' },
          { name: '직화 오징어제육 믹스', price: 11000, description: '신선한 탱글탱글 오징어와 제육의 환상 조합', imageUrl: '/delicious_jeyuk.png' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '가마솥 전통 국밥',
      description: '진하게 우려낸 고기 육수와 든든한 머리고기가 가득한 국밥집',
      imageUrl: '/delicious_gukbab.png', // 국밥 전용 고화질 이미지
      category: '한식',
      menus: {
        create: [
          { name: '부산식 돼지국밥', price: 8500, description: '뽀얀 사골 육수에 고기가 듬뿍 들어간 오리지널 국밥', imageUrl: '/delicious_gukbab.png' },
          { name: '얼큰 순대국밥', price: 9000, description: '속이 꽉 찬 토종 순대와 칼칼한 양념의 국밥', imageUrl: '/delicious_gukbab.png' },
          { name: '소고기 장터국밥', price: 10000, description: '소고기와 시원한 무를 넣고 푹 끓여낸 육개장 풍 국밥', imageUrl: '/delicious_gukbab.png' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '담양 숯불갈비',
      description: '직화로 구워 기름기를 쏙 빼고 육즙만 살려낸 고품격 직화 갈비',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60',
      category: '한식',
      menus: {
        create: [
          { name: '숯불 돼지갈비', price: 14000, description: '주방에서 완벽히 직화로 구워 바로 먹는 돼지양념갈비', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60' },
          { name: '소갈비살 소금구이', price: 18000, description: '육즙이 풍부한 소갈비살을 고소하게 구워낸 구이', imageUrl: 'https://images.unsplash.com/photo-1432139786573-61502164e057?w=500&auto=format&fit=crop&q=60' },
          { name: '한우 육회 비빔밥', price: 12000, description: '신선한 한우 육회와 야채가 어우러진 특선 비빔밥', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '안동 마늘 찜닭',
      description: '간장 소스 베이스에 국내산 닭고기와 쫄깃한 당면이 가득한 찜닭',
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60',
      category: '한식',
      menus: {
        create: [
          { name: '안동 간장 찜닭 (소)', price: 23000, description: '단짠 비법 소스에 쫄깃 당면이 들어간 정통 찜닭', imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60' },
          { name: '눈꽃 치즈 순살찜닭', price: 26000, description: '먹기 편한 순살 닭고기 위에 모짜렐라 치즈가 눈꽃처럼', imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: '매콤 고추장찜닭', price: 24000, description: '청양고추의 알싸함과 찜닭 소스의 중독성 있는 조화', imageUrl: 'https://images.unsplash.com/photo-1598908314732-07113901949e?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '전주 비빔밥 가옥',
      description: '다양한 신선 나물과 정성이 깃든 한국 전통 비빔밥 전문점',
      imageUrl: '/delicious_bibimbap.png', // 비빔밥 전용 고화질 이미지
      category: '한식',
      menus: {
        create: [
          { name: '전주 전통 비빔밥', price: 9000, description: '오색 나물과 전통 고추장 소스로 비벼먹는 전통 비빔밥', imageUrl: '/delicious_bibimbap.png' },
          { name: '돌솥 낙지 비빔밥', price: 11000, description: '매콤하게 볶은 통통한 낙지를 올린 뜨끈한 돌솥 비빔밥', imageUrl: '/delicious_bibimbap.png' },
          { name: '뚝배기 소불고기', price: 10000, description: '달콤 짭조름한 양념의 소불고기와 당면이 뚝배기에 듬뿍', imageUrl: '/delicious_bibimbap.png' }
        ]
      }
    }
  });

  // ==================== [중식] 카테고리 (6개 업소) ====================
  console.log('중식 데이터 추가 중...');
  await prisma.restaurant.create({
    data: {
      name: '동화루 대반점',
      description: '30년 전통의 수타면과 깊은 불향을 자랑하는 동네 대표 짜장 맛집',
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60',
      category: '중식',
      menus: {
        create: [
          { name: '삼선간짜장면', price: 8500, description: '갓 볶아낸 아삭한 양파와 신선한 해산물이 가득한 소스', imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60' },
          { name: '얼큰 차돌짬뽕', price: 10000, description: '직화 고기 육수에 고소한 차돌박이를 얹어 깊은 맛', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60' },
          { name: '미니 탕수육', price: 12000, description: '바삭하게 튀겨내어 소스를 부어 먹는 레몬 탕수육', imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '수제 딤섬 만두향',
      description: '육즙 팡팡 터지는 수제 만두와 샤오롱바오 전문 중식당',
      imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&auto=format&fit=crop&q=60',
      category: '중식',
      menus: {
        create: [
          { name: '고기 왕만두 (5pcs)', price: 7000, description: '직접 밀어 만든 만두피 속에 고기가 꽉 찬 수제 만두', imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&auto=format&fit=crop&q=60' },
          { name: '바삭 군만두', price: 6500, description: '겉은 바삭하고 속은 촉촉하게 구워낸 군만두', imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60' },
          { name: '육즙 샤오롱바오 (6pcs)', price: 8000, description: '스푼에 얹어 톡 터뜨려 먹는 육즙 가득 상하이식 만두', imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '사천 마라 마스터',
      description: '얼얼하고 화끈한 중독성 강한 오리지널 사천 마라요리 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60',
      category: '중식',
      menus: {
        create: [
          { name: '셀프 마라탕 (기본)', price: 9000, description: '원하는 야채와 면류를 사골 육수에 맛있게 끓여낸 탕', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60' },
          { name: '화끈한 마라샹궈', price: 15000, description: '고급 마라 소스에 고기와 채소를 화력 세게 볶아낸 요리', imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60' },
          { name: '꿔바로우 (소)', price: 12000, description: '새콤달콤한 소스와 쫄깃한 전분 반죽의 등심 튀김', imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '북경 베이징덕 하우스',
      description: '겉바속촉 베이징 전통 화덕 오리구이와 고급 해물 요리 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60',
      category: '중식',
      menus: {
        create: [
          { name: '베이징덕 쌈 (1인분)', price: 18000, description: '화덕 오리 껍질과 살코기를 밀전병에 파채와 싸먹는 요리', imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60' },
          { name: '해물 누룽지탕', price: 20000, description: '구수한 누룽지 위에 각종 신선 해물과 걸쭉한 소스', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60' },
          { name: '매콤 칠리새우', price: 16000, description: '통통한 새우를 바삭하게 튀겨 매콤달콤 칠리소스에 버무린 요리', imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '황금룡 짬뽕 전문점',
      description: '다양한 해산물과 얼큰하고 진한 짬뽕 육수가 일품인 짬뽕 명가',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60',
      category: '중식',
      menus: {
        create: [
          { name: '황금 해물짬뽕', price: 9000, description: '오징어, 홍합 등 신선한 해산물이 가득한 기본 짬뽕', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60' },
          { name: '삼선우동', price: 9000, description: '해산물과 야채를 넣어 국물이 맵지 않고 시원하고 깔끔한 우동', imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60' },
          { name: '바삭 군만두', price: 6000, description: '노릇노릇하게 튀겨낸 사이드 바삭 군만두', imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  // 성철 반점은 반드시 맨 마지막 중식 식당이어야 함
  await prisma.restaurant.create({
    data: {
      name: '성철 반점',
      description: '신선한 식재료로 정성을 다해 요리하는 정통 중화요리 전문점',
      imageUrl: '/restaurant_seongcheol.png', // 중국요리 전문점 느낌의 맛있는 중식 한상 이미지로 교체
      category: '중식',
      menus: {
        create: [
          { 
            name: '마파두부밥', 
            price: 10000, 
            description: '부드러운 연두부와 사천식 매콤한 소스의 환상 조화', 
            imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60' 
          },
          { 
            name: '대마왕 짜장면', 
            price: 8000, 
            description: '윤기가 좌르르 흐르는 진한 춘장 소스의 진짜 맛있는 짜장면', 
            imageUrl: '/delicious_jajangmyeon.png' 
          },
          { 
            name: '바삭 바삭 꿔바로우', 
            price: 18000, 
            description: '찹쌀 반죽으로 튀겨내어 더욱 쫄깃쫄깃한 정통 꿔바로우', 
            imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60' 
          }
        ]
      }
    }
  });

  // ==================== [일식] 카테고리 (6개 업소) ====================
  console.log('일식 데이터 추가 중...');
  await prisma.restaurant.create({
    data: {
      name: '미소 스시 전문점',
      description: '신선한 활어와 장인의 손맛으로 빚어내는 모던 정통 초밥 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60',
      category: '일식',
      menus: {
        create: [
          { name: '특선 모듬초밥 (12p)', price: 18000, description: '광어, 연어, 참돔, 생새우 등 다양하고 신선한 활어 초밥 세트', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60' },
          { name: '연어 듬뿍 초밥 (10p)', price: 19500, description: '부드러운 최상급 노르웨이 연어초밥 (생연어반, 아부리반)', imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&auto=format&fit=crop&q=60' },
          { name: '활광어 초밥 (10p)', price: 20000, description: '쫄깃하고 담백한 식감이 뛰어난 국산 완도 광어 초밥', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '카츠쿠라 돈까스',
      description: '최상급 프리미엄 한돈을 숙성하여 육즙 가득 구워낸 카츠 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60',
      category: '일식',
      menus: {
        create: [
          { name: '두툼 등심돈카츠', price: 10500, description: '고소한 지방층이 어우러져 씹는 맛이 일품인 등심 카츠', imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60' },
          { name: '살살 안심돈카츠', price: 11500, description: '미디엄 웰던으로 부드러움의 끝판왕인 담백한 안심 카츠', imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&auto=format&fit=crop&q=60' },
          { name: '메밀소바 + 카츠 세트', price: 13000, description: '시원한 냉모밀과 함께 나오는 세트 메뉴', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '도쿄 라멘야',
      description: '진한 돈코츠 사골 육수와 자가제면의 조화가 매력적인 라멘 가게',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60',
      category: '일식',
      menus: {
        create: [
          { name: '진한 돈코츠 라멘', price: 9000, description: '진하고 담백한 하카타 스타일 오리지널 돼지 사골 라멘', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60' },
          { name: '카라이 매콤 라멘', price: 9500, description: '특제 매운 고추기름으로 맛을 내 칼칼하고 개운한 라멘', imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=500&auto=format&fit=crop&q=60' },
          { name: '차슈 볶음밥 (챠한)', price: 8000, description: '특제 차슈 조각과 불향을 입혀 볶아낸 일본식 볶음밥', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '텐동 전문점 텐야',
      description: '주문 즉시 튀겨 바삭함이 오래가는 모듬 튀김 덮밥 전문 매장',
      imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60',
      category: '일식',
      menus: {
        create: [
          { name: '에비 텐동', price: 12000, description: '통통한 새우튀김 4마리와 야채 튀김이 올라간 대표 텐동', imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60' },
          { name: '스페셜 모듬 텐동', price: 15000, description: '장어튀김, 새우튀김, 오징어 등 푸짐한 해산물 모듬 튀김 덮밥', imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&auto=format&fit=crop&q=60' },
          { name: '든든한 규동', price: 9500, description: '특제 간장소스에 볶아낸 부드러운 우삼겹 소고기 덮밥', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '돈부리 하우스',
      description: '신선한 연어와 수제 카츠를 올린 다양한 돈부리 맛집',
      imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60',
      category: '일식',
      menus: {
        create: [
          { name: '수제 가츠동', price: 8500, description: '바삭한 돈카츠와 부드러운 계란, 특제 간장 덮밥', imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60' },
          { name: '신선 사케동', price: 13000, description: '신선하고 고소한 노르웨이 생연어와 생와사비를 얹은 덮밥', imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&auto=format&fit=crop&q=60' },
          { name: '에비동', price: 9000, description: '큼직한 새우 튀김 3마리가 얹어진 수제 새우 튀김 덮밥', imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '사누키 우동 전문',
      description: '쫄깃하고 탱글탱글한 수제 면발과 깊은 가쓰오부시 육수의 우동 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60',
      category: '일식',
      menus: {
        create: [
          { name: '전통 사누키 우동', price: 7500, description: '일본 정통 스타일의 가쓰오부시 정갈한 국물 우동', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60' },
          { name: '튀김 우동 세트', price: 10500, description: '기본 우동과 갓 튀겨낸 새우 및 야채 모듬 튀김 세트', imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60' },
          { name: '시원한 냉모밀', price: 8000, description: '살얼음 동동 띄운 쯔유 육수에 메밀면을 적셔 먹는 냉소바', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  // ==================== [치킨] 카테고리 (5개 업소) ====================
  console.log('치킨 데이터 추가 중...');
  await prisma.restaurant.create({
    data: {
      name: '황금올리브 치킨나라',
      description: '최고급 올리브유로 바삭하게 튀겨내어 입안 가득 육즙이 터지는 후라이드 치킨',
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60',
      category: '치킨',
      menus: {
        create: [
          { name: '바삭 황금올리브 치킨', price: 20000, description: '바삭함의 정점, 고소한 올리브향이 살아있는 후라이드', imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: '단짠 비법 양념치킨', price: 21500, description: '매콤하고 달콤한 특제 고추장 소스 양념 치킨', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60' },
          { name: '치즈뿌링클 치킨', price: 22000, description: '짭조름한 마법의 치즈 야채 파우더가 가득 부려진 치킨', imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '마늘간장 통닭집',
      description: '달콤한 마늘 소스와 짭조름한 진간장으로 맛을 낸 치킨 강자',
      imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60',
      category: '치킨',
      menus: {
        create: [
          { name: '허니 마늘간장 치킨', price: 21000, description: '달콤한 국산 벌꿀과 짭조름한 수제 간장 베이스 치킨', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60' },
          { name: '레드 스파이시 핫간장', price: 22000, description: '베트남 고추의 알싸함이 더해진 중독성 있는 매운 치킨', imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: '바삭 똥집튀김', price: 12000, description: '겉바속촉 쫄깃한 닭똥집을 바삭하게 튀겨낸 별미 안주', imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '파닭 파닭 순살 전문',
      description: '아삭한 알싸한 파채와 오리엔탈 머스타드 소스의 기막힌 궁합',
      imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=60',
      category: '치킨',
      menus: {
        create: [
          { name: '웰빙 순살 파닭', price: 21000, description: '먹기 편한 순살 후라이드와 신선한 생파채의 만남', imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=60' },
          { name: '간장 와사비 파닭', price: 22000, description: '와사비 톡 쏘는 맛이 느끼함을 확 잡아주는 특제 파닭', imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: '뿌링 치즈 파닭', price: 22000, description: '뿌링클 파우더와 파채의 신선한 반전 웰빙 조합', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '가마솥 옛날통닭',
      description: '가마솥에서 튀겨내어 더욱 얇고 바삭한 튀김옷의 추억의 통닭',
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60',
      category: '치킨',
      menus: {
        create: [
          { name: '바삭 옛날통닭 (1마리)', price: 12000, description: '주문 즉시 튀겨내 바삭하고 짭조름한 통마리 치킨', imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60' },
          { name: '옛날통닭 (2마리 세트)', price: 22000, description: '가족 모두 든든하게 먹을 수 있는 가성비 통닭 세트', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60' },
          { name: '닭똥집 튀김', price: 10000, description: '쫄깃한 닭모래집을 매콤하고 쫄깃하게 튀겨낸 사이드 메뉴', imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });
  await prisma.restaurant.create({
    data: {
      name: '숯불 바베큐 치킨',
      description: '화끈한 직화 숯불구이로 구워 기름을 쏙 뺀 웰빙 건강 바베큐',
      imageUrl: '/delicious_bbq_chicken.png',
      category: '치킨',
      menus: {
        create: [
          { name: '매콤 숯불 양념 바베큐', price: 21000, description: '특제 매운 고추장 양념 소스를 발라 구운 시그니처 바베큐', imageUrl: '/delicious_bbq_chicken.png' },
          { name: '고소한 소금구이 바베큐', price: 20000, description: '천일염만 뿌려 닭고기 본연의 맛을 극대화한 담백한 맛', imageUrl: '/delicious_bbq_chicken.png' },
          { name: '치즈 떡사리 추가 바베큐', price: 22000, description: '매콤 바베큐에 모짜렐라 치즈와 쫄깃한 떡사리 추가', imageUrl: '/delicious_bbq_chicken.png' }
        ]
      }
    }
  });


  // ==================== [분식] 카테고리 (5개 업소) ====================
  console.log('분식 데이터 추가 중...');
  await prisma.restaurant.create({
    data: {
      name: '신선 떡볶이 연구소',
      description: '텁텁하지 않고 깔끔하고 시원한 비법 양념 국물 떡볶이',
      imageUrl: '/delicious_tteokbokki.png', // 떡볶이 전용 고화질 이미지
      category: '분식',
      menus: {
        create: [
          { name: '매콤 국물 떡볶이 (2인분)', price: 12000, description: '달짝지근 매콤한 국물에 어묵 and 밀떡이 듬뿍', imageUrl: '/delicious_tteokbokki.png' },
          { name: '치즈 폭포 떡볶이', price: 15000, description: '모짜렐라 치즈가 그릇을 가득 덮고 흘러내리는 떡볶이', imageUrl: '/delicious_tteokbokki.png' },
          { name: '로제 크림 떡볶이', price: 14000, description: '부드러운 생크림과 매콤한 떡볶이 소스의 크리미한 조합', imageUrl: '/delicious_tteokbokki.png' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '바삭 튀김천국',
      description: '주문 즉시 한 번 더 튀겨내어 최상의 바삭함을 유지하는 튀김집',
      imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop&q=60',
      category: '분식',
      menus: {
        create: [
          { name: '모듬 수제튀김 (8pcs)', price: 8000, description: '오징어, 김말이, 새우, 야채 등으로 구성된 수제튀김', imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop&q=60' },
          { name: '찰진 가마솥 순대', price: 5000, description: '가마솥에 쪄내어 더욱 쫄깃쫄깃한 토종 당면 순대', imageUrl: 'https://images.unsplash.com/photo-1547625125-e1247bf8440d?w=500&auto=format&fit=crop&q=60' },
          { name: '마약 꼬마김밥 (5p)', price: 4500, description: '특제 겨자 소스에 콕 찍어 먹어 무한대로 손이 가는 김밥', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '종로 분식',
      description: '학교 앞 추억의 맛, 정성을 다해 만드는 간편한 분식 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60',
      category: '분식',
      menus: {
        create: [
          { name: '야채 김밥', price: 3500, description: '신선한 야채가 듬뿍 들어간 기본에 충실한 웰빙 김밥', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60' },
          { name: '참치 마요 김밥', price: 4500, description: '고소한 참치와 부드러운 마요네즈가 가득한 인기 김밥', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60' },
          { name: '즉석 양은냄비 라면', price: 4000, description: '화력 센 불로 꼬들꼬들하게 끓여낸 정통 즉석 라면', imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '명동 칼국수',
      description: '진한 사골 육수에 손수 밀어 만든 부드러운 칼국수 전문점',
      imageUrl: '/delicious_kalguksu.png', // 칼국수 전용 고화질 이미지
      category: '분식',
      menus: {
        create: [
          { name: '수제 칼국수', price: 8000, description: '부드러운 면발과 뽀얗고 고소한 사골 육수가 매력적인 칼국수', imageUrl: '/delicious_kalguksu.png' },
          { name: '평양식 왕만두', price: 8500, description: '고기와 신선한 두부, 부추로 속을 꽉 채운 담백한 평양식 왕만두', imageUrl: '/delicious_kalguksu.png' },
          { name: '새콤달콤 비빔국수', price: 8000, description: '새콤한 비빔 양념 소스에 야채와 소면을 쫄깃하게 비벼낸 국수', imageUrl: '/delicious_kalguksu.png' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '김밥천국 본점',
      description: '다양한 메뉴를 가성비 넘치고 신속하게 제공하는 국민 분식점',
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60',
      category: '분식',
      menus: {
        create: [
          { name: '스페셜 정식', price: 10500, description: '수제 돈까스, 원조김밥, 새콤한 쫄면을 한 접시에 즐기는 대표 정식', imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60' },
          { name: '매콤 쫄면', price: 6500, description: '쫄깃한 쫄면 면발에 아삭한 콩나물과 비법 매콤 고추장 소스', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60' },
          { name: '원조 김밥', price: 3000, description: '우엉, 당근, 단무지, 햄 등을 말아 정통 스타일로 구현한 김밥', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  // ==================== [멕시칸] 카테고리 (4개 업소) ====================
  console.log('멕시칸 데이터 추가 중...');
  await prisma.restaurant.create({
    data: {
      name: '타코 벨라 전문점',
      description: '그릴에 구운 또띠아 위에 푸짐한 살사소스와 육즙 가득한 멕시칸 타코',
      imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60',
      category: '멕시칸',
      menus: {
        create: [
          { name: '비프 타코 세트 (3p)', price: 9500, description: '그릴 소고기와 양파, 아보카도 살사가 어우러진 정통 타코', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60' },
          { name: '치킨 퀘사디아', price: 11000, description: '치즈와 닭가슴살을 넣어 오븐에 바삭하게 구운 피자풍 메뉴', imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60' },
          { name: '나쵸 & 생과카몰리', price: 7000, description: '매일 아침 만드는 신선한 아보카도 과카몰리와 바삭한 나쵸', imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '도스 부리또 팩토리',
      description: '부드러운 밥과 육류, 야채를 또띠아에 꽉 눌러 담아 한 끼 든든한 부리또',
      imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60',
      category: '멕시칸',
      menus: {
        create: [
          { name: '소고기 감자 부리또', price: 8500, description: '든든한 소고기와 바삭한 웨지 감자가 함께 씹히는 부리또', imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60' },
          { name: '텐더 치킨 라이스부리또', price: 8000, description: '바삭한 치킨텐더와 특제 멕시칸 라이스로 꽉 찬 부리또', imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=60' },
          { name: '더블 믹스 점보부리또', price: 10000, description: '소고기+치킨이 모두 들어가 두 배 더 푸짐한 시그니처', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '멕시칸 그릴 칠리파우더',
      description: '불향 가득 구워낸 화이타와 나초, 매운 칠리 소스를 제공하는 멕시칸 그릴',
      imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60',
      category: '멕시칸',
      menus: {
        create: [
          { name: '그릴 비프 화이타', price: 22000, description: '양파, 파프리카와 구운 소고기를 또띠아에 직접 싸먹는 요리', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60' },
          { name: '칠리 치즈 프라이즈', price: 12000, description: '바삭한 감자튀김 위에 매콤 칠리 소스와 모짜렐라 치즈 듬뿍', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60' },
          { name: '치킨 타코 (3p)', price: 9000, description: '매콤하게 양념한 닭고기와 살사소스를 올린 대중적인 타코', imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '엘 파소 타코',
      description: '미국 텍사스 남부 스타일 타코와 멕시칸 윙 등 이색 타코 브랜드',
      imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60',
      category: '멕시칸',
      menus: {
        create: [
          { name: '매콤 쉬림프 타코 (3p)', price: 10500, description: '탱글탱글 튀긴 새우에 알싸하고 달콤한 치폴레 살사를 얹은 타코', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60' },
          { name: '치즈 가득 엔칠라다', price: 13000, description: '또띠아 속에 고기를 채우고 소스를 부어 구워낸 오븐 요리', imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60' },
          { name: '버팔로 윙 & 나쵸', price: 11000, description: '매콤새콤 정통 버팔로 윙 8조각과 바삭한 나쵸 바스켓', imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  // ==================== [햄버거] 카테고리 (4개 업소) ====================
  console.log('햄버거 데이터 추가 중...');
  await prisma.restaurant.create({
    data: {
      name: '버거 캐슬',
      description: '두툼한 패티와 폭신한 번으로 만드는 정통 어메리칸 버거 브랜드',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
      category: '햄버거',
      menus: {
        create: [
          { name: '더블 치즈 버거 세트', price: 9900, description: '소고기 패티 2장과 아메리칸 치즈 2장, 감자튀김, 콜라 세트', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
          { name: '베이컨 토마토 디럭스', price: 8500, description: '아삭한 토마토와 짭조름한 베이컨, 특제 스모크 소스', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60' },
          { name: '통치킨 갈릭 스파이시 버거', price: 7900, description: '두툼한 닭다리살 치킨 패티에 갈릭 마요네즈가 들어간 버거', imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '수제버거 팩토리',
      description: '유기농 번과 최고급 수입육을 매장에서 매일 아침 직접 갈아 만드는 버거',
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60',
      category: '햄버거',
      menus: {
        create: [
          { name: '하와이안 아보카도 버거', price: 11500, description: '달콤한 구운 파인애플과 생아보카도가 올라간 웰빙 수제버거', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60' },
          { name: '더블 베이컨 에그 버거', price: 12000, description: '에그프라이 반숙과 베이컨, 치즈 소스가 폭발하는 시그니처', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
          { name: '치즈 감자 프라이즈', price: 6000, description: '체다치즈 소스를 듬뿍 얹어 구워낸 시그니처 감자튀김', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '그릴 버거 마스터',
      description: '참숯 그릴에 직접 구워 훈연향이 듬뿍 밴 정통 프리미엄 수제버거 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
      category: '햄버거',
      menus: {
        create: [
          { name: '클래식 비프 버거', price: 7500, description: '육즙 가득한 소고기 패티와 신선한 상추, 양파, 토마토 기본 버거', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60' },
          { name: '머쉬룸 트러플 버거', price: 9500, description: '풍미 넘치는 트러플 소스와 졸인 새송이버섯이 들어간 수제버거', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
          { name: '어니언 링', price: 5000, description: '양파를 슬라이스하여 바삭하고 고소하게 튀겨낸 인기 튀김 사이드', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '치킨버거 스테이션',
      description: '부드러운 닭다리살 치킨 패티를 사용하여 꽉 찬 크기를 자랑하는 버거 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=60',
      category: '햄버거',
      menus: {
        create: [
          { name: '핫스파이시 징거버거 세트', price: 8900, description: '매콤하게 염지한 통닭가슴살 튀김패티가 올라간 세트 메뉴', imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=60' },
          { name: '마일드 싸이버거 세트', price: 8500, description: '부드럽고 쫄깃한 통닭다리살 패티와 달콤 화이트소스의 조화', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60' },
          { name: '고구마 치즈스틱', price: 4000, description: '달콤한 고구마 무스와 자연산 모짜렐라 치즈가 들어간 디저트 스틱', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  // ==================== [디저트] 카테고리 (4개 업소) ====================
  console.log('디저트 데이터 추가 중...');
  await prisma.restaurant.create({
    data: {
      name: '달콤 케이크 하우스',
      description: '천연 생크림과 유기농 설탕으로 만드는 고품격 조각 케이크 하우스',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60',
      category: '디저트',
      menus: {
        create: [
          { name: '딸기 생크림 조각케이크', price: 6800, description: '신선한 생딸기와 마스카포네 생크림이 레이어드된 케이크', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60' },
          { name: '초코 가나슈 브라우니', price: 6500, description: '꾸덕꾸덕한 리얼 초콜릿 가나슈와 진한 맛의 브라우니', imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60' },
          { name: '상콤달콤 레몬 타르트', price: 7000, description: '바삭한 시트 위에 프랑스산 상큼한 레몬크림을 얹은 타르트', imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '에스프레소 디 오리진',
      description: '스페셜티 원두 로스팅 전문 카페와 홈메이드 베이커리 디저트',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60',
      category: '디저트',
      menus: {
        create: [
          { name: '스페셜티 아메리카노 (Iced)', price: 4500, description: '다크 초콜릿향과 깔끔한 단맛이 살아있는 스페셜티 커피', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60' },
          { name: '리얼 아보카도 망고 스무디', price: 6500, description: '달콤한 애플망고와 고소한 아보카도를 통째로 갈아 만든 스무디', imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60' },
          { name: '꾸덕한 뉴욕 치즈케이크', price: 6000, description: '필라델피아 크림치즈를 사용해 밀도 높은 정통 치즈케이크', imageUrl: 'https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '와플 & 크로플 하우스',
      description: '겉바속촉 바로 구워 쫄깃하고 달콤함이 남다른 수제 디저트 카페',
      imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&auto=format&fit=crop&q=60',
      category: '디저트',
      menus: {
        create: [
          { name: '누텔라 바나나 크로플', price: 5500, description: '크로와상 생지로 구워낸 쫄깃한 와플 위에 초코잼과 바나나', imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&auto=format&fit=crop&q=60' },
          { name: '플레인 생크림 와플', price: 4800, description: '주문 즉시 구워 부드럽고 가벼운 동물성 생크림을 올린 오리지널 와플', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60' },
          { name: '시원한 허브 블렌딩 티', price: 4000, description: '캐모마일과 민트를 블렌딩하여 상쾌하고 피로를 풀어주는 티', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '제주 말차 빙수 전문점',
      description: '제주 유기농 말차 가루로 곱게 갈아 만든 시원하고 고소한 눈꽃빙수 맛집',
      imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&auto=format&fit=crop&q=60',
      category: '디저트',
      menus: {
        create: [
          { name: '제주 말차 팥빙수', price: 12000, description: '진하고 쌉싸름한 제주 말차 눈꽃 얼음에 국산 팥과 인절미 고명', imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&auto=format&fit=crop&q=60' },
          { name: '애플망고 눈꽃빙수', price: 14000, description: '우유 얼음 위에 신선하고 달콤한 애플망고 과육이 가득 올라간 빙수', imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60' },
          { name: '쫀득 인절미 토스트', price: 6000, description: '바삭하게 구운 식빵 사이에 쫄깃한 인절미 떡을 넣은 퓨전 브레드', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60' }
        ]
      }
    }
  });

  console.log('모든 카테고리 식당 및 메뉴 초기 데이터 입력 완료!');
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
