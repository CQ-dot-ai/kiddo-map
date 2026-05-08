// Kiddo Map - 5 个精选 KL 亲子地点
// 设计原则：每个地点突出不同体验维度

export const PLACES = [
  {
    id: 'aquaria-klcc',
    name: 'Aquaria KLCC',
    nameEn: 'Aquaria KLCC',
    emoji: '🐠',
    category: '水族馆',
    
    // 位置信息
    coordinates: [101.7128, 3.1577], // [lng, lat] - Mapbox 格式
    address: 'Concourse Level, Kuala Lumpur Convention Centre, KLCC',
    area: 'KLCC 会议中心',
    
    // 评分（手动整理自 Google Maps）
    googleRating: 4.4,
    googleReviewCount: 18432,
    
    // 我们的精选评分
    ourRating: 4.6,
    
    // 关键信息
    indoor: true,
    weatherSafe: true,
    ageMin: 1,
    ageMax: 14,
    durationHours: '2-3',
    cost: 75,
    costLabel: 'RM 75/成人',
    
    // 童趣文案
    tagline: '雨天首选 · 海底世界',
    description: '钻进 90 米长的海底隧道，鲨鱼从头顶游过！妈妈最爱这里有冷气，孩子最爱触摸池能摸到海星。',
    
    // 三个亮点
    highlights: [
      { emoji: '👩‍👧', text: '妈妈视角', detail: '冷气足，可推婴儿车' },
      { emoji: '👶', text: '孩子最爱', detail: '90 米海底隧道 + 触摸池' },
      { emoji: '⏰', text: '小贴士', detail: '11 点鲨鱼喂食最精彩' },
    ],
    
    // 设施友好度（1-5 星）
    facilities: {
      stroller: 5,    // 婴儿车
      nursing: 4,     // 哺乳室
      diaper: 5,      // 尿布台
      aircon: 5,      // 冷气
      food: 4,        // 餐饮
      restroom: 5,    // 厕所
    },
    
    // 高质量图片（Unsplash 免费图）
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
    
    // 童趣配色
    color: { 
      primary: '#64B5F6',    // Sky Blue
      light: '#E3F2FD',
      dark: '#1976D2',
    },
  },
  
  {
    id: 'petrosains',
    name: 'Petrosains 探索中心',
    nameEn: 'Petrosains Discovery Centre',
    emoji: '🧪',
    category: '科学探索',
    
    coordinates: [101.7117, 3.1581],
    address: 'Level 4, Suria KLCC, KLCC',
    area: 'Suria KLCC 商场 4 楼',
    
    googleRating: 4.5,
    googleReviewCount: 8231,
    ourRating: 4.8,
    
    indoor: true,
    weatherSafe: true,
    ageMin: 4,
    ageMax: 14,
    durationHours: '3-5',
    cost: 30,
    costLabel: 'RM 30/成人',
    
    tagline: 'STEM 启蒙 · 玩中学',
    description: '7,000 m² 的科学游乐场，按按钮、转齿轮、模拟太空舱。最划算的"半天活动"，孩子能玩到不想走！',
    
    highlights: [
      { emoji: '👩‍👧', text: '妈妈视角', detail: '商场内，可同时购物吃饭' },
      { emoji: '👶', text: '孩子最爱', detail: '可以动手玩的展品超过 100 个' },
      { emoji: '💰', text: '超值', detail: 'RM 30 玩 4 小时 = 史上最值' },
    ],
    
    facilities: {
      stroller: 5, nursing: 5, diaper: 5, aircon: 5, food: 5, restroom: 5,
    },
    
    image: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=800&q=80',
    
    color: { 
      primary: '#FFD54F',    // Sunshine
      light: '#FFF8E1',
      dark: '#F57F17',
    },
  },
  
  {
    id: 'kidzania',
    name: 'KidZania 儿童城',
    nameEn: 'KidZania Kuala Lumpur',
    emoji: '👨‍🚒',
    category: '职业体验',
    
    coordinates: [101.6111, 3.1574],
    address: 'The Curve, Mutiara Damansara',
    area: 'The Curve 商场',
    
    googleRating: 4.3,
    googleReviewCount: 12453,
    ourRating: 4.6,
    
    indoor: true,
    weatherSafe: true,
    ageMin: 4,
    ageMax: 14,
    durationHours: '4-6',
    cost: 100,
    costLabel: 'RM 100/儿童',
    
    tagline: '半天托管 · 家长解放',
    description: '让孩子化身消防员、医生、记者…家长可以在专属休息室喝咖啡，孩子在城里"工作赚钱"。妈妈终于有时间发个朋友圈。',
    
    highlights: [
      { emoji: '👩‍👧', text: '妈妈视角', detail: '家长 lounge 有咖啡和 WiFi ☕' },
      { emoji: '👶', text: '孩子最爱', detail: '60+ 种职业，开 KidZos 工资' },
      { emoji: '⏰', text: '小贴士', detail: '建议早上 10 点入场，避开下午高峰' },
    ],
    
    facilities: {
      stroller: 3, nursing: 5, diaper: 5, aircon: 5, food: 5, restroom: 5,
    },
    
    image: 'https://images.unsplash.com/photo-1555009393-f20bdb245c4d?w=800&q=80',
    
    color: { 
      primary: '#FF8A65',    // Soft Coral
      light: '#FFE0B2',
      dark: '#E64A19',
    },
  },
  
  {
    id: 'kl-bird-park',
    name: 'KL 飞禽公园',
    nameEn: 'KL Bird Park',
    emoji: '🦜',
    category: '动物·自然',
    
    coordinates: [101.6857, 3.1431],
    address: 'Jalan Cenderawasih, Tasik Perdana',
    area: '湖滨公园',
    
    googleRating: 4.3,
    googleReviewCount: 21234,
    ourRating: 4.4,
    
    indoor: false,
    weatherSafe: false,
    ageMin: 1,
    ageMax: 99,
    durationHours: '2-4',
    cost: 75,
    costLabel: 'RM 75/成人',
    
    tagline: '巨型鸟笼 · 自由飞翔',
    description: '世界最大的自由飞行鸟笼，3000 多只鸟在你头顶盘旋。孔雀、鹈鹕、犀鸟…孩子能近距离喂食和合影。',
    
    highlights: [
      { emoji: '👩‍👧', text: '妈妈视角', detail: '大部分有遮荫，但记得带水' },
      { emoji: '👶', text: '孩子最爱', detail: '11:30 鹈鹕喂食秀超震撼' },
      { emoji: '☀️', text: '小贴士', detail: '早上去最凉快，鸟也最活跃' },
    ],
    
    facilities: {
      stroller: 4, nursing: 2, diaper: 3, aircon: 1, food: 3, restroom: 4,
    },
    
    image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800&q=80',
    
    color: { 
      primary: '#81C784',    // Mint
      light: '#E8F5E9',
      dark: '#2E7D32',
    },
  },
  
  {
    id: 'farm-in-the-city',
    name: '城市农场',
    nameEn: 'Farm in the City',
    emoji: '🐴',
    category: '农场·动物',
    
    coordinates: [101.7298, 3.0517],
    address: 'Lot 40187, Jalan Prima Tropika Barat, Seri Kembangan',
    area: '士毛月',
    
    googleRating: 4.5,
    googleReviewCount: 9876,
    ourRating: 4.5,
    
    indoor: false,
    weatherSafe: false,
    ageMin: 1,
    ageMax: 12,
    durationHours: '3-4',
    cost: 48,
    costLabel: 'RM 48/成人',
    
    tagline: '近距离亲子 · 喂养体验',
    description: '亲手喂兔子、抚摸龙猫、和孔雀合影。布局紧凑、动物友好，最适合"第一次"接触动物的小朋友。',
    
    highlights: [
      { emoji: '👩‍👧', text: '妈妈视角', detail: '有遮荫，路平好推车' },
      { emoji: '👶', text: '孩子最爱', detail: '可以喂食 + 触摸 30+ 种动物' },
      { emoji: '🌧️', text: '小贴士', detail: '雨天部分动物会撤回笼内' },
    ],
    
    facilities: {
      stroller: 4, nursing: 3, diaper: 4, aircon: 1, food: 3, restroom: 4,
    },
    
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80',
    
    color: { 
      primary: '#9575CD',    // Lavender
      light: '#EDE7F6',
      dark: '#5E35B6',
    },
  },
];

// 筛选选项
export const FILTERS = [
  { id: 'all', label: '全部', emoji: '🗺️' },
  { id: 'indoor', label: '室内', emoji: '❄️' },
  { id: 'outdoor', label: '户外', emoji: '🌳' },
  { id: 'cheap', label: '< RM 50', emoji: '💰' },
  { id: 'favorites', label: '收藏', emoji: '❤️' },
];
