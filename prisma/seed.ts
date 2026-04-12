import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dentalbook.com' },
    update: {},
    create: {
      email: 'admin@dentalbook.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '1234567890',
      role: 'ADMIN',
    },
  })

  const dentist1User = await prisma.user.upsert({
    where: { email: 'dentist1@dentalbook.com' },
    update: {},
    create: {
      email: 'dentist1@dentalbook.com',
      password: hashedPassword,
      name: 'Dr. Sarah Johnson',
      phone: '1234567891',
      role: 'DENTIST',
    },
  })

  const dentist2User = await prisma.user.upsert({
    where: { email: 'dentist2@dentalbook.com' },
    update: {},
    create: {
      email: 'dentist2@dentalbook.com',
      password: hashedPassword,
      name: 'Dr. Michael Chen',
      phone: '1234567892',
      role: 'DENTIST',
    },
  })

  const dentist3User = await prisma.user.upsert({
    where: { email: 'dentist3@dentalbook.com' },
    update: {},
    create: {
      email: 'dentist3@dentalbook.com',
      password: hashedPassword,
      name: 'Dr. Emily Williams',
      phone: '1234567893',
      role: 'DENTIST',
    },
  })

  const dentist1 = await prisma.dentist.upsert({
    where: { userId: dentist1User.id },
    update: {},
    create: {
      userId: dentist1User.id,
      specialization: 'General Dentistry',
      bio: 'Dr. Sarah Johnson has over 10 years of experience in general and preventive dentistry.',
      consultationFee: 75,
      isActive: true,
    },
  })

  const dentist2 = await prisma.dentist.upsert({
    where: { userId: dentist2User.id },
    update: {},
    create: {
      userId: dentist2User.id,
      specialization: 'Cosmetic Dentistry',
      bio: 'Dr. Michael Chen specializes in cosmetic procedures including whitening and veneers.',
      consultationFee: 100,
      isActive: true,
    },
  })

  const dentist3 = await prisma.dentist.upsert({
    where: { userId: dentist3User.id },
    update: {},
    create: {
      userId: dentist3User.id,
      specialization: 'Orthodontics',
      bio: 'Dr. Emily Williams is an expert in orthodontics and teeth alignment.',
      consultationFee: 120,
      isActive: true,
    },
  })

  const services = [
    {
      name: 'Dental Consultation',
      description: 'Initial examination and discussion of dental concerns',
      duration: 30,
      price: 75,
      category: 'CONSULTATION' as const,
    },
    {
      name: 'Teeth Cleaning',
      description: 'Professional cleaning to remove plaque and tartar',
      duration: 45,
      price: 120,
      category: 'PREVENTIVE' as const,
    },
    {
      name: 'Teeth Whitening',
      description: 'Professional whitening treatment for brighter teeth',
      duration: 60,
      price: 300,
      category: 'COSMETIC' as const,
    },
    {
      name: 'Dental Filling',
      description: 'Treatment for cavities using composite or amalgam',
      duration: 45,
      price: 150,
      category: 'RESTORATIVE' as const,
    },
    {
      name: 'Root Canal',
      description: 'Treatment for infected tooth pulp',
      duration: 90,
      price: 800,
      category: 'SURGICAL' as const,
    },
    {
      name: 'Tooth Extraction',
      description: 'Safe removal of damaged or wisdom teeth',
      duration: 45,
      price: 200,
      category: 'SURGICAL' as const,
    },
    {
      name: 'Dental Crown',
      description: 'Custom crown to restore damaged tooth',
      duration: 60,
      price: 900,
      category: 'RESTORATIVE' as const,
    },
    {
      name: 'Dental Checkup',
      description: 'Comprehensive oral examination',
      duration: 20,
      price: 50,
      category: 'PREVENTIVE' as const,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.name.toLowerCase().replace(/ /g, '-') },
      update: service,
      create: {
        id: service.name.toLowerCase().replace(/ /g, '-'),
        ...service,
        isActive: true,
      },
    })
  }

  const daysOfWeek = [0, 1, 2, 3, 4]
  for (const dentist of [dentist1, dentist2, dentist3]) {
    for (const day of daysOfWeek) {
      await prisma.availability.upsert({
        where: { id: `${dentist.id}-${day}` },
        update: {},
        create: {
          id: `${dentist.id}-${day}`,
          dentistId: dentist.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          isBlocked: false,
        },
      })
    }
  }

  // Create test patients
  const patient1User = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      password: hashedPassword,
      name: 'John Doe',
      phone: '9876543210',
      role: 'PATIENT',
    },
  })

  const patient2User = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      phone: '9876543211',
      role: 'PATIENT',
    },
  })

  const patient3User = await prisma.user.upsert({
    where: { email: 'bob.wilson@example.com' },
    update: {},
    create: {
      email: 'bob.wilson@example.com',
      password: hashedPassword,
      name: 'Bob Wilson',
      phone: '9876543212',
      role: 'PATIENT',
    },
  })

  // Create patient profiles with file numbers
  await prisma.patient.upsert({
    where: { userId: patient1User.id },
    update: {},
    create: {
      fileNumber: 'P001',
      userId: patient1User.id,
      dateOfBirth: new Date('1990-05-15'),
      gender: 'MALE',
      bloodType: 'O+',
      allergies: 'Penicillin',
      emergencyContactName: 'Mary Doe',
      emergencyContactPhone: '9876543213',
    },
  })

  await prisma.patient.upsert({
    where: { userId: patient2User.id },
    update: {},
    create: {
      fileNumber: 'P002',
      userId: patient2User.id,
      dateOfBirth: new Date('1985-08-22'),
      gender: 'FEMALE',
      bloodType: 'A+',
      allergies: null,
      emergencyContactName: 'Tom Smith',
      emergencyContactPhone: '9876543214',
    },
  })

  await prisma.patient.upsert({
    where: { userId: patient3User.id },
    update: {},
    create: {
      fileNumber: 'P003',
      userId: patient3User.id,
      dateOfBirth: new Date('1978-12-01'),
      gender: 'MALE',
      bloodType: 'B+',
      allergies: 'Latex, Codeine',
      emergencyContactName: 'Alice Wilson',
      emergencyContactPhone: '9876543215',
    },
  })

  // Get patients to link to visits
  const patient1 = await prisma.patient.findUnique({ where: { userId: patient1User.id } })
  const patient2 = await prisma.patient.findUnique({ where: { userId: patient2User.id } })
  const patient3 = await prisma.patient.findUnique({ where: { userId: patient3User.id } })

  if (patient1 && patient2 && patient3) {
    // Create visits for patient 1 (John Doe)
    const visit1 = await prisma.visit.create({
      data: {
        patientId: patient1.id,
        dentistId: dentist1.id,
        date: new Date('2024-01-15'),
        chiefComplaint: 'Toothache on lower right molar',
        findings: 'Visible cavity on tooth #30, percussion sensitive',
        diagnosis: 'Dental caries with pulpitis',
        treatment: 'Root canal therapy initiated',
        notes: 'Patient referred for RCT. Scheduled follow-up.',
      },
    })

    const visit2 = await prisma.visit.create({
      data: {
        patientId: patient1.id,
        dentistId: dentist1.id,
        date: new Date('2024-02-20'),
        chiefComplaint: 'Follow-up after root canal',
        findings: 'Healing well, no symptoms',
        diagnosis: 'Post-RCT healing',
        treatment: 'Final restoration with crown',
        notes: 'Crown placed, occlusion checked',
      },
    })

    // Create prescriptions for patient 1
    const rx1 = await prisma.prescription.create({
      data: {
        patientId: patient1.id,
        visitId: visit1.id,
        dentistId: dentist1.id,
        date: new Date('2024-01-15'),
        instructions: 'Take medications as directed. Complete full course of antibiotics.',
        medications: {
          create: [
            { name: 'Amoxicillin', dosage: '500mg', frequency: '3 times daily', duration: '7 days', instructions: 'Take with food' },
            { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', duration: '5 days', instructions: 'Take for pain, max 3 per day' },
          ],
        },
      },
    })

    // Create visits for patient 2 (Jane Smith)
    const visit3 = await prisma.visit.create({
      data: {
        patientId: patient2.id,
        dentistId: dentist2.id,
        date: new Date('2024-03-10'),
        chiefComplaint: 'Cosmetic consultation for teeth whitening',
        findings: 'Mild staining on enamel, otherwise healthy',
        diagnosis: 'Extrinsic staining',
        treatment: 'Professional whitening recommended',
        notes: 'Discussed treatment options and costs',
      },
    })

    const rx2 = await prisma.prescription.create({
      data: {
        patientId: patient2.id,
        visitId: visit3.id,
        dentistId: dentist2.id,
        date: new Date('2024-03-10'),
        instructions: 'Use desensitizing toothpaste for 2 weeks before treatment.',
        medications: {
          create: [
            { name: 'Sensodyne', dosage: 'Regular', frequency: 'Twice daily', duration: '14 days', instructions: 'Use instead of regular toothpaste' },
          ],
        },
      },
    })

    // Create visits for patient 3 (Bob Wilson)
    const visit4 = await prisma.visit.create({
      data: {
        patientId: patient3.id,
        dentistId: dentist3.id,
        date: new Date('2024-04-05'),
        chiefComplaint: 'Teeth alignment consultation',
        findings: 'Mild crowding on upper and lower arch',
        diagnosis: 'Malocclusion class I',
        treatment: 'Invisalign treatment plan recommended',
        notes: 'Impressions taken, treatment plan sent to lab',
      },
    })

    // Create a prescription without a visit (standalone)
    await prisma.prescription.create({
      data: {
        patientId: patient3.id,
        dentistId: dentist3.id,
        date: new Date('2024-04-05'),
        instructions: 'Take pain medication as needed after procedure.',
        medications: {
          create: [
            { name: 'Paracetamol', dosage: '500mg', frequency: '1-2 tablets', duration: 'As needed', instructions: 'Max 4 per day' },
          ],
        },
      },
    })
  }

  console.log('Seed data created successfully!')
  console.log('Login credentials:')
  console.log('  Admin: admin@dentalbook.com / password123')
  console.log('  Dentist 1: dentist1@dentalbook.com / password123')
  console.log('  Dentist 2: dentist2@dentalbook.com / password123')
  console.log('  Dentist 3: dentist3@dentalbook.com / password123')
  console.log('')
  console.log('Test Patients:')
  console.log('  Patient 1: john.doe@example.com / password123 (File: P001)')
  console.log('  Patient 2: jane.smith@example.com / password123 (File: P002)')
  console.log('  Patient 3: bob.wilson@example.com / password123 (File: P003)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
