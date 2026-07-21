const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const consultantPassword = await bcrypt.hash('consultant123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@consultax.com' },
    update: {},
    create: {
      email: 'admin@consultax.com',
      name: 'Abdullah Khalid',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`Created/Updated Super Admin: ${superAdmin.email}`);

  const consultant = await prisma.user.upsert({
    where: { email: 'consultant@consultax.com' },
    update: {},
    create: {
      email: 'consultant@consultax.com',
      name: 'Consultant User',
      password: consultantPassword,
      role: 'CONSULTANT',
    },
  });
  console.log(`Created/Updated Consultant: ${consultant.email}`);

  // 2. Create Service Categories & Sub-Services
  const services = [
    {
      slug: 'income-tax',
      name: 'Income Tax Services',
      description: 'Professional income tax compliance and registration services.',
      order: 1,
      subServices: [
        'FBR Registration (NTN)',
        'Income Tax Return Filing',
        'Revision of Income Tax Returns',
        'Reply to Tax Notices',
        'Tax Refund Processing',
      ],
    },
    {
      slug: 'sales-tax',
      name: 'Sales Tax Services',
      description: 'Comprehensive sales tax registration, filing, and advisory.',
      order: 2,
      subServices: [
        'Sales Tax Registration',
        'Monthly Sales Tax Returns',
        'Sales Tax Compliance',
        'Reply to Sales Tax Notices',
      ],
    },
    {
      slug: 'tax-planning',
      name: 'Tax Planning',
      description: 'Our experts provide tax planning solutions to help individuals and businesses legally optimize their tax liabilities while ensuring full compliance with tax regulations.',
      order: 3,
      subServices: [],
    },
    {
      slug: 'secp-compliance',
      name: 'SECP Compliance',
      description: 'Corporate registration and annual compliance management with SECP.',
      order: 4,
      subServices: [
        'Company Incorporation',
        'Submission of Annual Returns',
        'Corporate Compliance',
        'Statutory Filings',
      ],
    },
    {
      slug: 'management-accounting',
      name: 'Management Accounting Services',
      description: 'Bookkeeping, computerized accounts management, and performance analysis.',
      order: 5,
      subServices: [
        'Accounts Management',
        'Computerized Accounting',
        'Bookkeeping',
        'Preparation of Financial Statements',
        'Financial Reporting',
        'Business Performance Analysis',
      ],
    },
    {
      slug: 'internal-audit',
      name: 'Internal Audit',
      description: 'We conduct comprehensive internal audits to strengthen internal controls, improve operational efficiency, identify financial risks, and ensure regulatory compliance.',
      order: 6,
      subServices: [],
    },
    {
      slug: 'other-services',
      name: 'Other Services',
      description: 'Specialized registrations and software/development advisory.',
      order: 7,
      subServices: [
        'PSEB Registration',
      ],
    },
  ];

  for (const service of services) {
    const category = await prisma.serviceCategory.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        description: service.description,
        order: service.order,
      },
      create: {
        slug: service.slug,
        name: service.name,
        description: service.description,
        order: service.order,
      },
    });

    console.log(`Upserted category: ${category.name}`);

    // Create sub-services
    if (service.subServices.length > 0) {
      // First, delete existing subservices for this category to reload cleanly
      await prisma.subService.deleteMany({
        where: { categoryId: category.id },
      });

      for (let i = 0; i < service.subServices.length; i++) {
        await prisma.subService.create({
          data: {
            categoryId: category.id,
            name: service.subServices[i],
            order: i + 1,
          },
        });
      }
      console.log(`  Added ${service.subServices.length} sub-services for ${category.name}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
