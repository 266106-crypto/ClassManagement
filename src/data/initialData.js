export const INITIAL_STUDENTS = Array.from({ length: 25 }, (_, i) => {
  const names = [
    '강민준', '김서연', '김도윤', '박지아', '이준우',
    '최하은', '정시우', '강예린', '조현우', '윤수아',
    '장서준', '임지민', '한유준', '오채원', '서건우',
    '신다은', '권우진', '황나은', '송주원', '전소율',
    '홍지호', '유아린', '고태양', '문하윤', '황지우'
  ];
  
  const initialBalances = [1200, 850, 2100, 1500, 950, 1750, 1300, 2400, 1100, 1900, 1400, 1650, 800, 2250, 1050, 1850, 1350, 1600, 2000, 900, 1700, 1450, 1950, 1150, 1250];
  const balance = initialBalances[i] || 1000;
  
  // EXP는 화폐와 동일하게 축적되며 레벨 계산: Lv.1 (0~499), Lv.2 (500~999), Lv.3 (1000~1999), Lv.4 (2000~3499), Lv.5 (3500+)
  const exp = balance;
  let level = 1;
  if (exp >= 3500) level = 5;
  else if (exp >= 2000) level = 4;
  else if (exp >= 1000) level = 3;
  else if (exp >= 500) level = 2;

  // 1인 1역 ID 배정 (1~10 반복)
  const roleId = `role-${(i % 10) + 1}`;

  return {
    id: `student-${i + 1}`,
    number: i + 1,
    name: names[i],
    balance: balance,
    exp: exp,
    level: level,
    roleId: roleId,
    avatar: ['🦁', '🐯', '🦊', '🐻', '🐼', '🐨', '🐰', '🐱', '🐶', '🦄'][i % 10],
    roleTaskCompletedToday: i % 2 === 0, // 샘플 당일 수행 여부
    completedMissions: i % 3 === 0 ? ['mission-1'] : []
  };
});

export const INITIAL_ROLES = [
  { id: 'role-1', title: '칠판 반장', description: '매 쉬는시간마다 칠판을 깨끗이 지우고 분필 정리하기', reward: 100, icon: '🧹' },
  { id: 'role-2', title: '우유 도우미', description: '아침 우유 급식 상자 수령 및 정돈', reward: 120, icon: '🥛' },
  { id: 'role-3', title: '컴퓨터 & 프로젝터 반장', description: '수업 전 TV/컴퓨터 전원 켜기 및 정동', reward: 100, icon: '💻' },
  { id: 'role-4', title: '급식 순서 도우미', description: '줄서기 지도 및 급식실 질서 유지', reward: 150, icon: '🍱' },
  { id: 'role-5', title: '분리수거 환경 가디언', description: '재활용 분리수거함 상태 점검 및 정리', reward: 130, icon: '♻️' },
  { id: 'role-6', title: '학급 신문/유인물 반장', description: '알림장 유인물 및 학습지 인원수대로 배부', reward: 100, icon: '📄' },
  { id: 'role-7', title: '에너지 절약 반장', description: '이동 수업 시 전등 끄기 및 창문 닫기', reward: 110, icon: '💡' },
  { id: 'role-8', title: '식물 사랑 관리사', description: '학급 화분 물주기 및 햇빛 쬐어주기', reward: 100, icon: '🪴' },
  { id: 'role-9', title: '학급 도서관 정리원', description: '학급 문고 책장 정돈 및 대출 관리', reward: 120, icon: '📚' },
  { id: 'role-10', title: '체육 기구 관리사', description: '체육 시간 체육용품 수령 및 반납 확인', reward: 140, icon: '⚽' }
];

export const INITIAL_SHOP_ITEMS = [
  { id: 'item-1', title: '원하는 자리 1주일 지정권', price: 1500, stock: 5, description: '1주일 동안 내가 원하는 자리에 앉을 수 있습니다.', icon: '🪑' },
  { id: 'item-2', title: '급식 1등 선택권', price: 800, stock: 10, description: '급식 배식을 학급에서 가장 먼저 받습니다.', icon: '🍱' },
  { id: 'item-3', title: '숙제 1회 면제권', price: 2000, stock: 3, description: '일일 과제 또는 일기 쓰기 1회를 면제받습니다.', icon: '✏️' },
  { id: 'item-4', title: '자유시간 10분 이용권', price: 1000, stock: 8, description: '창의적 체험활동 시 자유시간 10분을 얻습니다.', icon: '⏱️' },
  { id: 'item-5', title: '선생님과 보드게임 1판', price: 1200, stock: 4, description: '점심시간에 담임 선생님과 원하는 보드게임을 합니다.', icon: '🎲' },
  { id: 'item-6', title: '학급 대표 음악 DJ권', price: 600, stock: 12, description: '청소 시간이나 점심시간에 내가 틀고 싶은 노래를 신청합니다.', icon: '🎵' }
];

export const INITIAL_MISSIONS = [
  { id: 'mission-1', title: '아침 독서 10분 실천하기', reward: 50, expReward: 50, category: '학습', icon: '📖' },
  { id: 'mission-2', title: '교실 바닥 쓰레기 3개 줍기', reward: 40, expReward: 40, category: '인성/환경', icon: '🧹' },
  { id: 'mission-3', title: '짝꿍에게 고마운 이유 1가지 말하기', reward: 50, expReward: 50, category: '관계', icon: '🤝' },
  { id: 'mission-4', title: '수업 시간 3회 이상 발표하기', reward: 60, expReward: 60, category: '수업참여', icon: '🙋‍♂️' }
];

export const INITIAL_COUPONS = [
  {
    id: 'coupon-101',
    studentId: 'student-1',
    itemId: 'item-2',
    title: '급식 1등 선택권',
    price: 800,
    icon: '🍱',
    purchasedAt: '2026-10-04',
    status: 'USED' // USED, PENDING, ACTIVE
  },
  {
    id: 'coupon-102',
    studentId: 'student-1',
    itemId: 'item-4',
    title: '자유시간 10분 이용권',
    price: 1000,
    icon: '⏱️',
    purchasedAt: '2026-10-05',
    status: 'ACTIVE' // 사용 가능
  },
  {
    id: 'coupon-103',
    studentId: 'student-3',
    itemId: 'item-1',
    title: '원하는 자리 1주일 지정권',
    price: 1500,
    icon: '🪑',
    purchasedAt: '2026-10-05',
    status: 'PENDING' // 교사 승인/사용 제출 대기중
  }
];

export const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', studentId: 'student-1', type: 'EARN', amount: 200, reason: '학급 화단 가꾸기 우수 봉사', date: '2026-10-05 09:30' },
  { id: 'tx-2', studentId: 'student-1', type: 'SPEND', amount: 1000, reason: '자유시간 10분 이용권 구매', date: '2026-10-05 10:15' },
  { id: 'tx-3', studentId: 'student-3', type: 'EARN', amount: 500, reason: '학급 규칙 준수왕 포상금', date: '2026-10-04 15:00' }
];

export const LEVEL_CONFIG = [
  { level: 1, title: 'Lv.1 싹트는 꿈나무', minExp: 0, maxExp: 499, icon: '🌱' },
  { level: 2, title: 'Lv.2 성실한 탐험가', minExp: 500, maxExp: 999, icon: '🔍' },
  { level: 3, title: 'Lv.3 열정 신입 리더', minExp: 1000, maxExp: 1999, icon: '⭐' },
  { level: 4, title: 'Lv.4 빛나는 모범생', minExp: 2000, maxExp: 3499, icon: '👑' },
  { level: 5, title: 'Lv.5 학급 경제 마스터', minExp: 3500, maxExp: 99999, icon: '🏆' }
];
