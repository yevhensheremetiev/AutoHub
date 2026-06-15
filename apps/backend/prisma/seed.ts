import {
  PrismaClient,
  type AccountType,
  type BookingStatus,
  type ServiceLocationArea,
  type ServiceType,
} from '@prisma/client';
import { randomBytes, randomUUID, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';

const prisma = new PrismaClient();
const scrypt = promisify(scryptCallback);

const DEMO_PASSWORD = 'Demo1234!';
const MARKER_EMAIL = 'demo.driver@autohub.local';
const DEMO_EMAIL_SUFFIX = '@autohub.local';

type OfferingSeed = {
  name: string;
  description: string;
  durationMinutes: number;
  priceUah: number;
};

type ServiceSeed = {
  slug: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  serviceType: ServiceType;
  locationArea: ServiceLocationArea;
  lat: number;
  lng: number;
  staffEmail: string;
  staffName: string;
  offerings: OfferingSeed[];
};

const DEMO_SERVICES: ServiceSeed[] = [
  {
    slug: 'spark-wash',
    name: 'Spark Wash Київ',
    address: 'вул. Хрещатик, 10, Київ',
    phone: '+380 44 100 11 11',
    hours: 'Пн–Сб 8:00–20:00',
    serviceType: 'WASH',
    locationArea: 'CENTER',
    lat: 50.4478,
    lng: 30.5229,
    staffEmail: 'sparkwash@autohub.local',
    staffName: 'Адмін Spark Wash',
    offerings: [
      {
        name: 'Мийка кузова + пилосос',
        description: 'Зовнішня мийка, колеса та пилосос салону.',
        durationMinutes: 45,
        priceUah: 650,
      },
      {
        name: 'Детейлінг салону',
        description: 'Глибоке чищення сидінь, килимків і панелей.',
        durationMinutes: 90,
        priceUah: 1400,
      },
      {
        name: 'Нанокераміка кузова',
        description: 'Захисне покриття з поліруванням.',
        durationMinutes: 180,
        priceUah: 4500,
      },
    ],
  },
  {
    slug: 'autodoc',
    name: 'AutoDoc СТО',
    address: 'просп. Оболонський, 22, Київ',
    phone: '+380 44 100 22 22',
    hours: 'Пн–Пт 9:00–19:00',
    serviceType: 'REPAIR',
    locationArea: 'LEFT_BANK',
    lat: 50.511,
    lng: 30.4985,
    staffEmail: 'autodoc@autohub.local',
    staffName: 'Майстерня AutoDoc',
    offerings: [
      {
        name: 'Заміна масла та фільтра',
        description: 'Моторна олива та масляний фільтр.',
        durationMinutes: 40,
        priceUah: 1200,
      },
      {
        name: 'Перевірка гальм',
        description: 'Діагностика гальмівної системи.',
        durationMinutes: 90,
        priceUah: 450,
      },
      {
        name: 'Заміна ременя ГРМ',
        description: 'Комплект ГРМ з натяжним роликом.',
        durationMinutes: 240,
        priceUah: 8500,
      },
    ],
  },
  {
    slug: 'tirepro',
    name: 'TirePro Шиномонтаж',
    address: 'вул. Печерська, 5, Київ',
    phone: '+380 44 100 33 33',
    hours: 'Щодня 8:00–21:00',
    serviceType: 'TIRE',
    locationArea: 'RIGHT_BANK',
    lat: 50.4265,
    lng: 30.538,
    staffEmail: 'tirepro@autohub.local',
    staffName: 'TirePro Київ',
    offerings: [
      {
        name: 'Сезонна перебортовка',
        description: 'Монтаж і балансування сезонних шин.',
        durationMinutes: 50,
        priceUah: 800,
      },
      {
        name: 'Балансування коліс',
        description: 'Балансування усіх чотирьох коліс.',
        durationMinutes: 30,
        priceUah: 350,
      },
    ],
  },
  {
    slug: 'scanline',
    name: 'ScanLine Діагностика',
    address: 'Андріївський узвіз, 8, Київ',
    phone: '+380 44 100 44 44',
    hours: 'Пн–Сб 10:00–18:00',
    serviceType: 'DIAGNOSTIC',
    locationArea: 'CENTER',
    lat: 50.4592,
    lng: 30.518,
    staffEmail: 'scanline@autohub.local',
    staffName: 'ScanLine Lab',
    offerings: [
      {
        name: 'OBD-сканування',
        description: 'Швидка електронна діагностика.',
        durationMinutes: 30,
        priceUah: 500,
      },
      {
        name: 'Повна електронна діагностика',
        description: 'Комплексна перевірка систем авто.',
        durationMinutes: 120,
        priceUah: 2200,
      },
    ],
  },
  {
    slug: 'pro-moyka',
    name: 'ProМойка Оболонь',
    address: 'вул. Героїв Дніпра, 15, Київ',
    phone: '+380 44 100 55 55',
    hours: 'Пн–Нд 7:00–22:00',
    serviceType: 'WASH',
    locationArea: 'LEFT_BANK',
    lat: 50.5182,
    lng: 30.5011,
    staffEmail: 'promoyka@autohub.local',
    staffName: 'ProМойка',
    offerings: [
      {
        name: 'Експрес-мийка',
        description: 'Кузов і вікна за 20 хвилин.',
        durationMinutes: 20,
        priceUah: 350,
      },
      {
        name: 'Комплекс «Стандарт»',
        description: 'Мийка, пилосос, пластик салону.',
        durationMinutes: 60,
        priceUah: 750,
      },
    ],
  },
  {
    slug: 'masters-sto',
    name: 'Masters СТО Поділ',
    address: 'вул. Верхній Вал, 33, Київ',
    phone: '+380 44 100 66 66',
    hours: 'Пн–Сб 9:00–18:00',
    serviceType: 'REPAIR',
    locationArea: 'CENTER',
    lat: 50.4654,
    lng: 30.5156,
    staffEmail: 'masters@autohub.local',
    staffName: 'Masters СТО',
    offerings: [
      {
        name: 'Комп\'ютерна діагностика',
        description: 'Сканування помилок та live-data.',
        durationMinutes: 45,
        priceUah: 600,
      },
      {
        name: 'Регулювання розвалу-сходження',
        description: 'Стенд 3D, перевірка кутів.',
        durationMinutes: 75,
        priceUah: 1100,
      },
    ],
  },
  {
    slug: 'express-tire',
    name: 'ЕкспресШиномонтаж Троєщина',
    address: 'просп. Воскресенський, 12, Київ',
    phone: '+380 44 100 77 77',
    hours: 'Щодня 8:00–20:00',
    serviceType: 'TIRE',
    locationArea: 'LEFT_BANK',
    lat: 50.5089,
    lng: 30.5954,
    staffEmail: 'express-tire@autohub.local',
    staffName: 'Адмін ЕкспресШиномонтаж',
    offerings: [
      {
        name: 'Шиномонтаж R13–R16',
        description: 'Монтаж, балансування, герметизація.',
        durationMinutes: 40,
        priceUah: 600,
      },
      {
        name: 'Ремонт проколу',
        description: 'Грибок або жгут, перевірка тиску.',
        durationMinutes: 20,
        priceUah: 250,
      },
    ],
  },
  {
    slug: 'carspa-left',
    name: 'CarSpa Лівий берег',
    address: 'вул. Оноре де Бальзака, 28, Київ',
    phone: '+380 44 100 88 88',
    hours: 'Пн–Нд 9:00–21:00',
    serviceType: 'WASH',
    locationArea: 'LEFT_BANK',
    lat: 50.5213,
    lng: 30.5287,
    staffEmail: 'carspa@autohub.local',
    staffName: 'CarSpa Київ',
    offerings: [
      {
        name: 'Преміум-мийка',
        description: 'Двофазна мийка, воск, сушка.',
        durationMinutes: 75,
        priceUah: 950,
      },
      {
        name: 'Хімчистка сидінь',
        description: 'Пилосос, піна, сушка.',
        durationMinutes: 120,
        priceUah: 1800,
      },
    ],
  },
  {
    slug: 'elektron-diag',
    name: 'Електрон СТО',
    address: 'вул. Болсуновська, 14, Київ',
    phone: '+380 44 100 99 99',
    hours: 'Пн–Пт 9:00–18:00',
    serviceType: 'DIAGNOSTIC',
    locationArea: 'RIGHT_BANK',
    lat: 50.4012,
    lng: 30.5568,
    staffEmail: 'elektron@autohub.local',
    staffName: 'Електрон Діагностика',
    offerings: [
      {
        name: 'Діагностика ходової',
        description: 'Перевірка амортизаторів, сайлентблоків.',
        durationMinutes: 60,
        priceUah: 700,
      },
      {
        name: 'Сканування CAN-шини',
        description: 'Читання всіх блоків, звіт PDF.',
        durationMinutes: 90,
        priceUah: 1500,
      },
    ],
  },
  {
    slug: 'grease-monkey',
    name: 'Grease Monkey Автосервіс',
    address: 'вул. Сім\'ї Бродських, 8, Київ',
    phone: '+380 44 100 00 10',
    hours: 'Пн–Сб 8:00–19:00',
    serviceType: 'REPAIR',
    locationArea: 'RIGHT_BANK',
    lat: 50.4128,
    lng: 30.5241,
    staffEmail: 'grease-monkey@autohub.local',
    staffName: 'Grease Monkey',
    offerings: [
      {
        name: 'Заміна гальмівних колодок',
        description: 'Передня або задня вісь, перевірка дисків.',
        durationMinutes: 60,
        priceUah: 900,
      },
      {
        name: 'Заміна амортизаторів',
        description: 'Пара амортизаторів з роботою.',
        durationMinutes: 120,
        priceUah: 3200,
      },
      {
        name: 'Заміна свічок запалювання',
        description: 'Комплект свічок, очищення колодок.',
        durationMinutes: 45,
        priceUah: 650,
      },
    ],
  },
];

type DriverSeed = {
  email: string;
  name: string;
  cars: Array<{
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin: string;
  }>;
};

const DEMO_DRIVERS: DriverSeed[] = [
  {
    email: MARKER_EMAIL,
    name: 'Олексій Коваленко',
    cars: [
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        licensePlate: 'AA1234BB',
        vin: 'SEEDVIN0000000001',
      },
      {
        make: 'Renault',
        model: 'Duster',
        year: 2021,
        licensePlate: 'KA5678IM',
        vin: 'SEEDVIN0000000002',
      },
    ],
  },
  {
    email: 'olena.driver@autohub.local',
    name: 'Олена Шевченко',
    cars: [
      {
        make: 'Volkswagen',
        model: 'Golf',
        year: 2020,
        licensePlate: 'BI9012AC',
        vin: 'SEEDVIN0000000003',
      },
    ],
  },
  {
    email: 'ivan.driver@autohub.local',
    name: 'Іван Мельник',
    cars: [
      {
        make: 'BMW',
        model: 'X5',
        year: 2018,
        licensePlate: 'CE3456HX',
        vin: 'SEEDVIN0000000004',
      },
    ],
  },
  {
    email: 'maria.driver@autohub.local',
    name: 'Марія Бондар',
    cars: [
      {
        make: 'Hyundai',
        model: 'Tucson',
        year: 2022,
        licensePlate: 'KA1122AB',
        vin: 'SEEDVIN0000000005',
      },
    ],
  },
  {
    email: 'andriy.driver@autohub.local',
    name: 'Андрій Ткаченко',
    cars: [
      {
        make: 'Skoda',
        model: 'Octavia',
        year: 2017,
        licensePlate: 'BI7788CE',
        vin: 'SEEDVIN0000000006',
      },
      {
        make: 'Ford',
        model: 'Focus',
        year: 2015,
        licensePlate: 'AA9900KK',
        vin: 'SEEDVIN0000000007',
      },
    ],
  },
  {
    email: 'natalia.driver@autohub.local',
    name: 'Наталія Лисенко',
    cars: [
      {
        make: 'Mazda',
        model: 'CX-5',
        year: 2020,
        licensePlate: 'KA3344IM',
        vin: 'SEEDVIN0000000008',
      },
    ],
  },
  {
    email: 'dmytro.driver@autohub.local',
    name: 'Дмитро Гриценко',
    cars: [
      {
        make: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2016,
        licensePlate: 'AA5566BB',
        vin: 'SEEDVIN0000000009',
      },
    ],
  },
  {
    email: 'sofia.driver@autohub.local',
    name: 'Софія Кравчук',
    cars: [
      {
        make: 'Kia',
        model: 'Sportage',
        year: 2023,
        licensePlate: 'KA7788AC',
        vin: 'SEEDVIN0000000010',
      },
    ],
  },
  {
    email: 'vitaliy.driver@autohub.local',
    name: 'Віталій Савченко',
    cars: [
      {
        make: 'Audi',
        model: 'A4',
        year: 2019,
        licensePlate: 'CE2233HX',
        vin: 'SEEDVIN0000000011',
      },
    ],
  },
  {
    email: 'yulia.driver@autohub.local',
    name: 'Юлія Мороз',
    cars: [
      {
        make: 'Nissan',
        model: 'Qashqai',
        year: 2021,
        licensePlate: 'BI4455CE',
        vin: 'SEEDVIN0000000012',
      },
      {
        make: 'Toyota',
        model: 'RAV4',
        year: 2020,
        licensePlate: 'KA6677IM',
        vin: 'SEEDVIN0000000013',
      },
    ],
  },
];

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

function daysFromNow(days: number, hour = 10): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function daysAgo(days: number, hour = 11): Date {
  return daysFromNow(-days, hour);
}

async function refreshRatings(serviceId: string, offeringId: string) {
  const [offeringStats, serviceStats] = await Promise.all([
    prisma.review.aggregate({
      where: { booking: { offeringId } },
      _avg: { rating: true },
      _count: { id: true },
    }),
    prisma.review.aggregate({
      where: { booking: { serviceId } },
      _avg: { rating: true },
      _count: { id: true },
    }),
  ]);

  const toFields = (count: number, avg: number | null) => ({
    ratingCount: count,
    ratingAvg: count > 0 && avg != null ? Math.round(avg * 10) / 10 : null,
  });

  await Promise.all([
    prisma.offering.update({
      where: { id: offeringId },
      data: toFields(offeringStats._count.id, offeringStats._avg.rating),
    }),
    prisma.service.update({
      where: { id: serviceId },
      data: toFields(serviceStats._count.id, serviceStats._avg.rating),
    }),
  ]);
}

async function cleanupDemoData() {
  await prisma.user.deleteMany({
    where: { email: { endsWith: DEMO_EMAIL_SUFFIX } },
  });

  const demoNames = DEMO_SERVICES.map((s) => s.name);
  await prisma.service.deleteMany({
    where: { name: { in: demoNames } },
  });

  const legacyNames = [
    'Spark Wash',
    'AutoDoc Service',
    'TirePro',
    'ScanLine Diag',
  ];
  await prisma.service.deleteMany({
    where: { name: { in: legacyNames } },
  });
}

async function ensureService(demo: ServiceSeed) {
  let service = await prisma.service.findFirst({
    where: { name: demo.name },
    include: { offerings: true },
  });

  if (!service) {
    service = await prisma.service.create({
      data: {
        name: demo.name,
        address: demo.address,
        phone: demo.phone,
        hours: demo.hours,
        serviceType: demo.serviceType,
        locationArea: demo.locationArea,
        lat: demo.lat,
        lng: demo.lng,
        offerings: { create: demo.offerings },
      },
      include: { offerings: true },
    });
    return service;
  }

  const existingNames = new Set(service.offerings.map((o) => o.name));
  for (const offering of demo.offerings) {
    if (!existingNames.has(offering.name)) {
      await prisma.offering.create({
        data: { serviceId: service.id, ...offering },
      });
    }
  }

  return prisma.service.findUniqueOrThrow({
    where: { id: service.id },
    include: { offerings: true },
  });
}

async function ensureUser(params: {
  email: string;
  name: string;
  accountType: AccountType;
  passwordHash: string;
  serviceId?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: params.email },
  });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      id: randomUUID(),
      email: params.email,
      name: params.name,
      passwordHash: params.passwordHash,
      accountType: params.accountType,
      serviceId: params.serviceId ?? null,
    },
  });
}

async function createBooking(params: {
  userId: string;
  carId: string;
  serviceId: string;
  offeringId: string;
  scheduledAt: Date;
  status: BookingStatus;
  notes?: string;
  workResult?: string;
}) {
  return prisma.booking.create({
    data: {
      userId: params.userId,
      carId: params.carId,
      serviceId: params.serviceId,
      offeringId: params.offeringId,
      scheduledAt: params.scheduledAt,
      status: params.status,
      notes: params.notes ?? null,
      workResult: params.workResult ?? null,
    },
  });
}

async function createReview(params: {
  userId: string;
  bookingId: string;
  serviceId: string;
  offeringId: string;
  rating: number;
  comment: string;
}) {
  await prisma.review.create({
    data: {
      userId: params.userId,
      bookingId: params.bookingId,
      rating: params.rating,
      comment: params.comment,
    },
  });
  await refreshRatings(params.serviceId, params.offeringId);
}

type BookingSeed = {
  driverEmail: string;
  carIndex?: number;
  serviceSlug: string;
  offeringIndex?: number;
  daysOffset: number;
  hour?: number;
  status: BookingStatus;
  notes?: string;
  workResult?: string;
  review?: { rating: number; comment: string };
};

const BOOKING_SEEDS: BookingSeed[] = [
  // Олексій — багата історія
  { driverEmail: MARKER_EMAIL, serviceSlug: 'spark-wash', offeringIndex: 0, daysOffset: -45, status: 'COMPLETED', notes: 'Сильне забруднення на дверях', workResult: 'Виконано мийку та пилосос. Рекомендовано нанокераміку через 2 тижні.', review: { rating: 5, comment: 'Дуже акуратно помили, салон пахне свіжо. Рекомендую!' } },
  { driverEmail: MARKER_EMAIL, serviceSlug: 'autodoc', offeringIndex: 0, daysOffset: -30, status: 'COMPLETED', workResult: 'Замінено оливу 5W-30, фільтр Mann. Наступна заміна через 10 000 км.', review: { rating: 4, comment: 'Швидко, але довелося почекати 20 хв у черзі.' } },
  { driverEmail: MARKER_EMAIL, carIndex: 1, serviceSlug: 'tirepro', offeringIndex: 0, daysOffset: -14, status: 'COMPLETED', workResult: 'Встановлено зимовий комплект, балансування в нормі.', review: { rating: 5, comment: 'Перебортовали за годину, тиск перевірили.' } },
  { driverEmail: MARKER_EMAIL, serviceSlug: 'scanline', offeringIndex: 1, daysOffset: -7, status: 'COMPLETED', workResult: 'Знайдено помилку P0420 — рекомендовано перевірити каталізатор.', review: { rating: 4, comment: 'Детальний звіт на email, все зрозуміло.' } },
  { driverEmail: MARKER_EMAIL, serviceSlug: 'spark-wash', offeringIndex: 1, daysOffset: 2, hour: 14, status: 'CONFIRMED', notes: 'Потрібен догляд після поїздки на море' },
  { driverEmail: MARKER_EMAIL, carIndex: 1, serviceSlug: 'autodoc', offeringIndex: 1, daysOffset: 5, hour: 9, status: 'PENDING', notes: 'Скрип при гальмуванні' },
  { driverEmail: MARKER_EMAIL, serviceSlug: 'masters-sto', offeringIndex: 1, daysOffset: 0, hour: 15, status: 'IN_PROGRESS' },
  { driverEmail: MARKER_EMAIL, serviceSlug: 'pro-moyka', offeringIndex: 0, daysOffset: -3, status: 'CANCELLED', notes: 'Перенесено — не встиг приїхати' },

  // Олена
  { driverEmail: 'olena.driver@autohub.local', serviceSlug: 'spark-wash', offeringIndex: 0, daysOffset: -20, status: 'COMPLETED', workResult: 'Стандартна мийка виконана.', review: { rating: 5, comment: 'Чисто і швидко, персонал привітний.' } },
  { driverEmail: 'olena.driver@autohub.local', serviceSlug: 'pro-moyka', offeringIndex: 1, daysOffset: -60, status: 'COMPLETED', workResult: 'Комплекс «Стандарт» — без зауважень.', review: { rating: 4, comment: 'Гарна ціна за Оболонню.' } },
  { driverEmail: 'olena.driver@autohub.local', serviceSlug: 'tirepro', offeringIndex: 1, daysOffset: 3, hour: 11, status: 'CONFIRMED' },
  { driverEmail: 'olena.driver@autohub.local', serviceSlug: 'scanline', offeringIndex: 0, daysOffset: 8, hour: 12, status: 'PENDING' },
  { driverEmail: 'olena.driver@autohub.local', serviceSlug: 'carspa-left', offeringIndex: 0, daysOffset: -35, status: 'COMPLETED', review: { rating: 4, comment: 'Нормальна мийка, трохи дорого.' } },
  { driverEmail: 'olena.driver@autohub.local', serviceSlug: 'express-tire', offeringIndex: 0, daysOffset: -50, status: 'COMPLETED', review: { rating: 5, comment: 'Зручний запис онлайн, все вчасно.' } },

  // Іван
  { driverEmail: 'ivan.driver@autohub.local', serviceSlug: 'autodoc', offeringIndex: 2, daysOffset: -90, status: 'COMPLETED', workResult: 'ГРМ замінено, всі зазори в нормі.', review: { rating: 5, comment: 'Складна робота — зробили за 2 дні, дали гарантію.' } },
  { driverEmail: 'ivan.driver@autohub.local', serviceSlug: 'masters-sto', offeringIndex: 0, daysOffset: -25, status: 'COMPLETED', workResult: 'Скинуто помилки DME, прошивка актуальна.', review: { rating: 4, comment: 'Професійно, але паркування біля СТО тісне.' } },
  { driverEmail: 'ivan.driver@autohub.local', serviceSlug: 'spark-wash', offeringIndex: 2, daysOffset: 12, hour: 10, status: 'PENDING', notes: 'BMW X5, великий кузов' },
  { driverEmail: 'ivan.driver@autohub.local', serviceSlug: 'grease-monkey', offeringIndex: 0, daysOffset: -40, status: 'COMPLETED', workResult: 'Замінено передні колодки, диски в нормі.', review: { rating: 5, comment: 'Якісна робота, гальма не скриплять.' } },

  // Марія
  { driverEmail: 'maria.driver@autohub.local', serviceSlug: 'carspa-left', offeringIndex: 1, daysOffset: -15, status: 'COMPLETED', workResult: 'Хімчистка сидінь виконана.', review: { rating: 5, comment: 'Салон як новий, приємний запах.' } },
  { driverEmail: 'maria.driver@autohub.local', serviceSlug: 'express-tire', offeringIndex: 1, daysOffset: -8, status: 'COMPLETED', workResult: 'Прокол на правому передньому — усунено.', review: { rating: 4, comment: 'Швидко, але трохи дорого за жгут.' } },
  { driverEmail: 'maria.driver@autohub.local', serviceSlug: 'elektron-diag', offeringIndex: 0, daysOffset: 4, hour: 10, status: 'CONFIRMED', notes: 'Стук у передній підвісці' },
  { driverEmail: 'maria.driver@autohub.local', serviceSlug: 'spark-wash', offeringIndex: 0, daysOffset: 7, status: 'PENDING' },

  // Андрій
  { driverEmail: 'andriy.driver@autohub.local', serviceSlug: 'autodoc', offeringIndex: 0, daysOffset: -22, status: 'COMPLETED', workResult: 'Заміна оливи на Octavia.', review: { rating: 4, comment: 'Все ок, запис зручний.' } },
  { driverEmail: 'andriy.driver@autohub.local', carIndex: 1, serviceSlug: 'pro-moyka', offeringIndex: 0, daysOffset: -5, status: 'COMPLETED', workResult: 'Експрес-мийка Ford Focus.', review: { rating: 3, comment: 'Нормально, але вода залишилась на дзеркалах.' } },
  { driverEmail: 'andriy.driver@autohub.local', serviceSlug: 'grease-monkey', offeringIndex: 2, daysOffset: -60, status: 'COMPLETED', workResult: 'Свічки замінено на Octavia 1.6.', review: { rating: 5, comment: 'Мотор став рівніше працювати.' } },
  { driverEmail: 'andriy.driver@autohub.local', serviceSlug: 'tirepro', offeringIndex: 0, daysOffset: 6, status: 'PENDING' },

  // Наталія
  { driverEmail: 'natalia.driver@autohub.local', serviceSlug: 'scanline', offeringIndex: 0, daysOffset: -18, status: 'COMPLETED', review: { rating: 5, comment: 'Знайшли причину Check Engine за 15 хвилин.' } },
  { driverEmail: 'natalia.driver@autohub.local', serviceSlug: 'spark-wash', offeringIndex: 1, daysOffset: -55, status: 'COMPLETED', workResult: 'Детейлінг салону Mazda CX-5.', review: { rating: 5, comment: 'Ідеально чистий салон.' } },
  { driverEmail: 'natalia.driver@autohub.local', serviceSlug: 'masters-sto', offeringIndex: 1, daysOffset: 1, hour: 11, status: 'IN_PROGRESS' },
  { driverEmail: 'natalia.driver@autohub.local', serviceSlug: 'carspa-left', offeringIndex: 0, daysOffset: 9, status: 'PENDING' },

  // Дмитро
  { driverEmail: 'dmytro.driver@autohub.local', serviceSlug: 'grease-monkey', offeringIndex: 1, daysOffset: -70, status: 'COMPLETED', workResult: 'Заміна задніх амортизаторів Mercedes E-Class.', review: { rating: 5, comment: 'Ходова як на новій машині.' } },
  { driverEmail: 'dmytro.driver@autohub.local', serviceSlug: 'elektron-diag', offeringIndex: 1, daysOffset: -12, status: 'COMPLETED', workResult: 'CAN-сканування — помилок немає.', review: { rating: 4, comment: 'Детальний PDF-звіт.' } },
  { driverEmail: 'dmytro.driver@autohub.local', serviceSlug: 'autodoc', offeringIndex: 1, daysOffset: 3, hour: 14, status: 'CONFIRMED', notes: 'Перевірка гальм перед дальньою поїздкою' },
  { driverEmail: 'dmytro.driver@autohub.local', serviceSlug: 'spark-wash', offeringIndex: 2, daysOffset: -2, status: 'CANCELLED', notes: 'Скасовано через дощ' },

  // Софія
  { driverEmail: 'sofia.driver@autohub.local', serviceSlug: 'pro-moyka', offeringIndex: 1, daysOffset: -10, status: 'COMPLETED', workResult: 'Комплекс «Стандарт» на Kia Sportage.', review: { rating: 5, comment: 'Свіжа машина, рекомендую!' } },
  { driverEmail: 'sofia.driver@autohub.local', serviceSlug: 'express-tire', offeringIndex: 0, daysOffset: -28, status: 'COMPLETED', workResult: 'Літній комплект встановлено.', review: { rating: 4, comment: 'Швидко, але черга була 30 хв.' } },
  { driverEmail: 'sofia.driver@autohub.local', serviceSlug: 'scanline', offeringIndex: 1, daysOffset: 5, status: 'PENDING', notes: 'Перший раз на діагностиці' },
  { driverEmail: 'sofia.driver@autohub.local', serviceSlug: 'tirepro', offeringIndex: 1, daysOffset: 0, hour: 16, status: 'CONFIRMED' },

  // Віталій
  { driverEmail: 'vitaliy.driver@autohub.local', serviceSlug: 'masters-sto', offeringIndex: 0, daysOffset: -33, status: 'COMPLETED', workResult: 'Діагностика Audi A4 — знайдено несправність катушки.', review: { rating: 4, comment: 'Професійно, але дорого.' } },
  { driverEmail: 'vitaliy.driver@autohub.local', serviceSlug: 'autodoc', offeringIndex: 0, daysOffset: -6, status: 'COMPLETED', workResult: 'Заміна оливи 5W-40.', review: { rating: 5, comment: 'Швидко і акуратно.' } },
  { driverEmail: 'vitaliy.driver@autohub.local', serviceSlug: 'carspa-left', offeringIndex: 0, daysOffset: 2, hour: 12, status: 'CONFIRMED' },
  { driverEmail: 'vitaliy.driver@autohub.local', serviceSlug: 'grease-monkey', offeringIndex: 0, daysOffset: 10, status: 'PENDING', notes: 'Скрип гальм' },

  // Юлія
  { driverEmail: 'yulia.driver@autohub.local', serviceSlug: 'tirepro', offeringIndex: 0, daysOffset: -42, status: 'COMPLETED', workResult: 'Сезонна перебортовка Qashqai.', review: { rating: 5, comment: 'Все швидко, тиск перевірили.' } },
  { driverEmail: 'yulia.driver@autohub.local', carIndex: 1, serviceSlug: 'spark-wash', offeringIndex: 0, daysOffset: -20, status: 'COMPLETED', workResult: 'Мийка RAV4.', review: { rating: 4, comment: 'Добре, але трохи довго чекала.' } },
  { driverEmail: 'yulia.driver@autohub.local', serviceSlug: 'elektron-diag', offeringIndex: 0, daysOffset: -3, status: 'COMPLETED', workResult: 'Ходова Qashqai — зауважень немає.', review: { rating: 5, comment: 'Уважні майстри.' } },
  { driverEmail: 'yulia.driver@autohub.local', serviceSlug: 'pro-moyka', offeringIndex: 0, daysOffset: 4, status: 'PENDING' },
  { driverEmail: 'yulia.driver@autohub.local', carIndex: 1, serviceSlug: 'express-tire', offeringIndex: 0, daysOffset: 11, status: 'PENDING' },
];

async function main() {
  const force = process.env.SEED_FORCE === 'true';
  const marker = await prisma.user.findUnique({
    where: { email: MARKER_EMAIL },
  });

  if (marker && !force) {
    console.log('Демо-дані вже є в базі. Для повторного наповнення: SEED_FORCE=true npm run prisma:seed');
    return;
  }

  if (force || marker) {
    console.log('Очищення попередніх демо-даних…');
    await cleanupDemoData();
  }

  const passwordHash = await hashPassword(DEMO_PASSWORD);

  console.log('Створення сервісних центрів…');
  const services: Record<
    string,
    Awaited<ReturnType<typeof ensureService>>
  > = {};

  for (const demo of DEMO_SERVICES) {
    services[demo.slug] = await ensureService(demo);
    await ensureUser({
      email: demo.staffEmail,
      name: demo.staffName,
      accountType: 'SERVICE',
      passwordHash,
      serviceId: services[demo.slug].id,
    });
  }

  console.log('Створення водіїв та авто…');
  const drivers: Array<{
    user: Awaited<ReturnType<typeof ensureUser>>;
    cars: Array<{ id: string }>;
  }> = [];

  for (const driver of DEMO_DRIVERS) {
    const user = await ensureUser({
      email: driver.email,
      name: driver.name,
      accountType: 'DRIVER',
      passwordHash,
    });

    const cars = [];
    for (const car of driver.cars) {
      const row = await prisma.car.upsert({
        where: { vin: car.vin },
        create: { userId: user.id, ...car },
        update: { make: car.make, model: car.model, year: car.year, licensePlate: car.licensePlate },
      });
      cars.push(row);
    }
    drivers.push({ user, cars });
  }

  const offering = (slug: string, index = 0) =>
    services[slug].offerings[index]?.id ??
    services[slug].offerings[0]!.id;

  const driverByEmail = new Map(
    drivers.map((d) => [d.user.email!, d]),
  );

  console.log('Створення бронювань та відгуків…');

  for (const seed of BOOKING_SEEDS) {
    const driver = driverByEmail.get(seed.driverEmail);
    if (!driver) continue;

    const car = driver.cars[seed.carIndex ?? 0];
    if (!car) continue;

    const svc = services[seed.serviceSlug];
    if (!svc) continue;

    const offId = offering(seed.serviceSlug, seed.offeringIndex ?? 0);
    const scheduledAt =
      seed.daysOffset >= 0
        ? daysFromNow(seed.daysOffset, seed.hour)
        : daysAgo(-seed.daysOffset, seed.hour);

    const booking = await createBooking({
      userId: driver.user.id,
      carId: car.id,
      serviceId: svc.id,
      offeringId: offId,
      scheduledAt,
      status: seed.status,
      notes: seed.notes,
      workResult: seed.workResult,
    });

    if (seed.review) {
      await createReview({
        userId: driver.user.id,
        bookingId: booking.id,
        serviceId: svc.id,
        offeringId: offId,
        rating: seed.review.rating,
        comment: seed.review.comment,
      });
    }
  }

  console.log('\n✅ Базу наповнено демо-даними.\n');
  console.log('Пароль для всіх акаунтів @autohub.local:', DEMO_PASSWORD);
  console.log('\nВодії:');
  for (const d of DEMO_DRIVERS) {
    console.log(`  • ${d.email} — ${d.name}`);
  }
  console.log('\nСервісні центри (вхід):');
  for (const s of DEMO_SERVICES) {
    console.log(`  • ${s.staffEmail} — ${s.name}`);
  }
  console.log('\nГоловний акаунт для тесту: demo.driver@autohub.local');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
