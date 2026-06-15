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

  const [oleksiy, olena, ivan] = drivers;
  const offering = (slug: string, index = 0) =>
    services[slug].offerings[index]?.id ??
    services[slug].offerings[0]!.id;

  console.log('Створення бронювань та відгуків…');

  const b1 = await createBooking({
    userId: oleksiy.user.id,
    carId: oleksiy.cars[0]!.id,
    serviceId: services['spark-wash'].id,
    offeringId: offering('spark-wash', 0),
    scheduledAt: daysAgo(45),
    status: 'COMPLETED',
    notes: 'Сильне забруднення на дверях',
    workResult: 'Виконано мийку та пилосос. Рекомендовано нанокераміку через 2 тижні.',
  });
  await createReview({
    userId: oleksiy.user.id,
    bookingId: b1.id,
    serviceId: services['spark-wash'].id,
    offeringId: offering('spark-wash', 0),
    rating: 5,
    comment: 'Дуже акуратно помили, салон пахне свіжо. Рекомендую!',
  });

  const b2 = await createBooking({
    userId: oleksiy.user.id,
    carId: oleksiy.cars[0]!.id,
    serviceId: services['autodoc'].id,
    offeringId: offering('autodoc', 0),
    scheduledAt: daysAgo(30),
    status: 'COMPLETED',
    workResult: 'Замінено оливу 5W-30, фільтр Mann. Наступна заміна через 10 000 км.',
  });
  await createReview({
    userId: oleksiy.user.id,
    bookingId: b2.id,
    serviceId: services['autodoc'].id,
    offeringId: offering('autodoc', 0),
    rating: 4,
    comment: 'Швидко, але довелося почекати 20 хв у черзі.',
  });

  const b3 = await createBooking({
    userId: oleksiy.user.id,
    carId: oleksiy.cars[1]!.id,
    serviceId: services['tirepro'].id,
    offeringId: offering('tirepro', 0),
    scheduledAt: daysAgo(14),
    status: 'COMPLETED',
    workResult: 'Встановлено зимовий комплект, балансування в нормі.',
  });
  await createReview({
    userId: oleksiy.user.id,
    bookingId: b3.id,
    serviceId: services['tirepro'].id,
    offeringId: offering('tirepro', 0),
    rating: 5,
    comment: 'Перебортовали за годину, тиск перевірили.',
  });

  const b4 = await createBooking({
    userId: oleksiy.user.id,
    carId: oleksiy.cars[0]!.id,
    serviceId: services['scanline'].id,
    offeringId: offering('scanline', 1),
    scheduledAt: daysAgo(7),
    status: 'COMPLETED',
    workResult: 'Знайдено помилку P0420 — рекомендовано перевірити каталізатор.',
  });
  await createReview({
    userId: oleksiy.user.id,
    bookingId: b4.id,
    serviceId: services['scanline'].id,
    offeringId: offering('scanline', 1),
    rating: 4,
    comment: 'Детальний звіт на email, все зрозуміло.',
  });

  await createBooking({
    userId: oleksiy.user.id,
    carId: oleksiy.cars[0]!.id,
    serviceId: services['spark-wash'].id,
    offeringId: offering('spark-wash', 1),
    scheduledAt: daysFromNow(2, 14),
    status: 'CONFIRMED',
    notes: 'Потрібен догляд після поїздки на море',
  });

  await createBooking({
    userId: oleksiy.user.id,
    carId: oleksiy.cars[1]!.id,
    serviceId: services['autodoc'].id,
    offeringId: offering('autodoc', 1),
    scheduledAt: daysFromNow(5, 9),
    status: 'PENDING',
    notes: 'Скрип при гальмуванні',
  });

  await createBooking({
    userId: oleksiy.user.id,
    carId: oleksiy.cars[0]!.id,
    serviceId: services['masters-sto'].id,
    offeringId: offering('masters-sto', 1),
    scheduledAt: daysFromNow(0, 15),
    status: 'IN_PROGRESS',
  });

  await createBooking({
    userId: oleksiy.user.id,
    carId: oleksiy.cars[0]!.id,
    serviceId: services['pro-moyka'].id,
    offeringId: offering('pro-moyka', 0),
    scheduledAt: daysAgo(3),
    status: 'CANCELLED',
    notes: 'Перенесено — не встиг приїхати',
  });

  const bOlena1 = await createBooking({
    userId: olena.user.id,
    carId: olena.cars[0]!.id,
    serviceId: services['spark-wash'].id,
    offeringId: offering('spark-wash', 0),
    scheduledAt: daysAgo(20),
    status: 'COMPLETED',
    workResult: 'Стандартна мийка виконана.',
  });
  await createReview({
    userId: olena.user.id,
    bookingId: bOlena1.id,
    serviceId: services['spark-wash'].id,
    offeringId: offering('spark-wash', 0),
    rating: 5,
    comment: 'Чисто і швидко, персонал привітний.',
  });

  const bOlena2 = await createBooking({
    userId: olena.user.id,
    carId: olena.cars[0]!.id,
    serviceId: services['pro-moyka'].id,
    offeringId: offering('pro-moyka', 1),
    scheduledAt: daysAgo(60),
    status: 'COMPLETED',
    workResult: 'Комплекс «Стандарт» — без зауважень.',
  });
  await createReview({
    userId: olena.user.id,
    bookingId: bOlena2.id,
    serviceId: services['pro-moyka'].id,
    offeringId: offering('pro-moyka', 1),
    rating: 4,
    comment: 'Гарна ціна за Оболонню.',
  });

  await createBooking({
    userId: olena.user.id,
    carId: olena.cars[0]!.id,
    serviceId: services['tirepro'].id,
    offeringId: offering('tirepro', 1),
    scheduledAt: daysFromNow(3, 11),
    status: 'CONFIRMED',
  });

  await createBooking({
    userId: olena.user.id,
    carId: olena.cars[0]!.id,
    serviceId: services['scanline'].id,
    offeringId: offering('scanline', 0),
    scheduledAt: daysFromNow(8, 12),
    status: 'PENDING',
  });

  const bIvan = await createBooking({
    userId: ivan.user.id,
    carId: ivan.cars[0]!.id,
    serviceId: services['autodoc'].id,
    offeringId: offering('autodoc', 2),
    scheduledAt: daysAgo(90),
    status: 'COMPLETED',
    workResult: 'ГРМ замінено, всі зазори в нормі.',
  });
  await createReview({
    userId: ivan.user.id,
    bookingId: bIvan.id,
    serviceId: services['autodoc'].id,
    offeringId: offering('autodoc', 2),
    rating: 5,
    comment: 'Складна робота — зробили за 2 дні, дали гарантію.',
  });

  const bIvan2 = await createBooking({
    userId: ivan.user.id,
    carId: ivan.cars[0]!.id,
    serviceId: services['masters-sto'].id,
    offeringId: offering('masters-sto', 0),
    scheduledAt: daysAgo(25),
    status: 'COMPLETED',
    workResult: 'Скинуто помилки DME, прошивка актуальна.',
  });
  await createReview({
    userId: ivan.user.id,
    bookingId: bIvan2.id,
    serviceId: services['masters-sto'].id,
    offeringId: offering('masters-sto', 0),
    rating: 4,
    comment: 'Професійно, але паркування біля СТО тісне.',
  });

  await createBooking({
    userId: ivan.user.id,
    carId: ivan.cars[0]!.id,
    serviceId: services['spark-wash'].id,
    offeringId: offering('spark-wash', 2),
    scheduledAt: daysFromNow(12, 10),
    status: 'PENDING',
    notes: 'BMW X5, великий кузов',
  });

  const extraReviews: Array<{
    slug: string;
    offeringIdx: number;
    rating: number;
    comment: string;
    days: number;
  }> = [
    {
      slug: 'spark-wash',
      offeringIdx: 0,
      rating: 4,
      comment: 'Нормальна мийка, трохи дорого.',
      days: 35,
    },
    {
      slug: 'tirepro',
      offeringIdx: 0,
      rating: 5,
      comment: 'Зручний запис онлайн, все вчасно.',
      days: 50,
    },
    {
      slug: 'scanline',
      offeringIdx: 0,
      rating: 5,
      comment: 'Знайшли причину Check Engine за 15 хвилин.',
      days: 18,
    },
  ];

  for (const extra of extraReviews) {
    const svc = services[extra.slug];
    const offId = offering(extra.slug, extra.offeringIdx);
    const booking = await createBooking({
      userId: olena.user.id,
      carId: olena.cars[0]!.id,
      serviceId: svc.id,
      offeringId: offId,
      scheduledAt: daysAgo(extra.days),
      status: 'COMPLETED',
    });
    await createReview({
      userId: olena.user.id,
      bookingId: booking.id,
      serviceId: svc.id,
      offeringId: offId,
      rating: extra.rating,
      comment: extra.comment,
    });
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
