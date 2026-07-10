import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding CraftFlow...')

  const creatorUser = await prisma.user.upsert({
    where: { email: 'creator@craftflow.app' },
    update: {},
    create: { clerkId: 'demo_creator_001', email: 'creator@craftflow.app', name: 'Priya Sharma', role: 'CREATOR', onboarded: true, verificationStatus: 'VERIFIED' },
  })
  const creatorProfile = await prisma.creatorProfile.upsert({
    where: { userId: creatorUser.id },
    update: {},
    create: {
      userId: creatorUser.id, businessName: 'Priya Handicrafts', ownerName: 'Priya Sharma',
      gstNumber: '27ABCDE1234F1Z5', location: 'Johari Bazaar, Jaipur', city: 'Jaipur',
      state: 'Rajasthan', pincode: '302003', phone: '+91-98765-43210',
      productionCapacity: 500, experienceYears: 8, categories: ['Bangles', 'Jewelry', 'Accessories'],
      totalRevenue: 285000, totalOrders: 24, completedOrders: 19, rating: 4.7, reviewCount: 15,
      bio: 'Specializing in handcrafted Rajasthani bangles and jewelry for 8+ years.',
    },
  })
  const product1 = await prisma.product.create({
    data: {
      creatorId: creatorProfile.id, name: 'Rajasthani Lac Bangles Set', category: 'Bangles',
      description: 'Handcrafted traditional lac bangles with mirror work. Available in all sizes.',
      images: [], materials: ['Lac', 'Mirror', 'Thread'], pricePerUnit: 120,
      minOrderQty: 50, maxCapacity: 500, leadTimeDays: 7, customBranding: true,
      packagingOptions: ['Box packaging', 'Pouch packaging'], certifications: ['ISO 9001'],
    },
  })
  const brandUser = await prisma.user.upsert({
    where: { email: 'brand@craftflow.app' },
    update: {},
    create: { clerkId: 'demo_brand_001', email: 'brand@craftflow.app', name: 'Rahul Mehra', role: 'BRAND', onboarded: true, verificationStatus: 'VERIFIED' },
  })
  const brandProfile = await prisma.brandProfile.upsert({
    where: { userId: brandUser.id },
    update: {},
    create: {
      userId: brandUser.id, companyName: 'Ethnique Retail Pvt Ltd', contactPerson: 'Rahul Mehra',
      gstNumber: '29ABCDE5678G1Z3', phone: '+91-80000-11111', website: 'https://ethnique.in',
      categories: ['Bangles', 'Jewelry', 'Clothing'], totalSpend: 420000, totalOrders: 18, activeCreators: 6,
    },
  })
  const warehouse = await prisma.warehouse.create({
    data: {
      brandId: brandProfile.id, name: 'Bangalore Main Warehouse', address: '14, Industrial Layout, Peenya',
      city: 'Bangalore', state: 'Karnataka', pincode: '560058', contactPerson: 'Amit Kumar',
      phone: '+91-80000-22222', operatingHours: 'Mon-Sat 9am-6pm', isDefault: true,
    },
  })

  const ts = Date.now().toString(36).toUpperCase()
  const order1 = await prisma.order.create({
    data: {
      orderNumber: `CF-${ts}-001`, brandId: brandProfile.id, creatorId: creatorProfile.id,
      warehouseId: warehouse.id, status: 'PRODUCTION_50', paymentStatus: 'ADVANCE_PAID',
      totalAmount: 60000, advanceAmount: 24000, advancePaid: 24000, finalAmount: 36000,
      commissionAmount: 3000, colorVariants: ['Red', 'Blue', 'Green', 'Yellow', 'Pink'],
      materialRequirements: 'Premium lac only', packagingInstructions: 'Individual pouch per set',
      privateLabelRequired: true, brandLogoRequired: true,
      deliveryDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      confirmedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      productionStartedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      items: { create: [{ productId: product1.id, productName: product1.name, quantity: 500, unitPrice: 120, totalPrice: 60000 }] },
    },
  })
  await prisma.productionLog.createMany({
    data: [
      { orderId: order1.id, stage: 'CONFIRMED', percentage: 0, notes: 'Order confirmed' },
      { orderId: order1.id, stage: 'IN_PRODUCTION', percentage: 0, notes: 'Production started' },
      { orderId: order1.id, stage: 'PRODUCTION_50', percentage: 50, notes: '250/500 units done' },
    ],
  })
  await prisma.payment.create({
    data: { orderId: order1.id, amount: 24000, type: 'ADVANCE', status: 'PAID', method: 'NEFT', paidAt: new Date() },
  })
  await prisma.notification.createMany({
    data: [
      { userId: creatorUser.id, type: 'ORDER_CREATED', title: 'New Order', message: 'Ethnique Retail placed order worth ₹60,000', link: '/creator/orders', isRead: false },
      { userId: brandUser.id, type: 'PRODUCTION_UPDATE', title: 'Production 50%', message: `Order ${order1.orderNumber}: 50% complete`, link: '/brand/orders', isRead: false },
    ],
  })
  console.log('✅ Seed complete')
}
main().then(() => prisma.$disconnect()).catch(async e => { console.error(e); await prisma.$disconnect(); process.exit(1) })
