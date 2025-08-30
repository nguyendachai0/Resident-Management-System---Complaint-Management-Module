import { PrismaClient, UserRole, ComplaintCategory, ComplaintStatus, Priority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create buildings first
  const building = await prisma.building.create({
    data: {
      name: 'ABC Apartment Complex',
      address: '123 Main Street, District 1, Ho Chi Minh City',
      floors: 10
    }
  });

  console.log('✅ Created building:', building.name);

  // Create users with different roles
  const users = await Promise.all([
    // Super Admin
    prisma.user.create({
      data: {
        email: 'admin@abc-apartment.com',
        passwordHash: await bcrypt.hash('admin123', 12),
        fullName: 'System Administrator',
        phone: '+84901234567',
        role: 'SUPER_ADMIN'
      }
    }),
    
    // Building Manager
    prisma.user.create({
      data: {
        email: 'manager@abc-apartment.com',
        passwordHash: await bcrypt.hash('manager123', 12),
        fullName: 'Nguyễn Văn Quản Lý',
        phone: '+84902345678',
        role: 'BUILDING_MANAGER'
      }
    }),

    // Staff members
    prisma.user.create({
      data: {
        email: 'staff1@abc-apartment.com',
        passwordHash: await bcrypt.hash('staff123', 12),
        fullName: 'Trần Thị Nhân Viên',
        phone: '+84903456789',
        role: 'STAFF'
      }
    }),

    // Residents
    prisma.user.create({
      data: {
        email: 'resident1@gmail.com',
        passwordHash: await bcrypt.hash('resident123', 12),
        fullName: 'Lê Văn Cư Dân',
        phone: '+84904567890',
        role: 'RESIDENT'
      }
    }),

    prisma.user.create({
      data: {
        email: 'resident2@gmail.com',
        passwordHash: await bcrypt.hash('resident123', 12),
        fullName: 'Phạm Thị Minh',
        phone: '+84905678901',
        role: 'RESIDENT'
      }
    }),

    prisma.user.create({
      data: {
        email: 'resident3@gmail.com',
        passwordHash: await bcrypt.hash('resident123', 12),
        fullName: 'Hoàng Văn Tùng',
        phone: '+84906789012',
        role: 'RESIDENT'
      }
    })
  ]);

  console.log('✅ Created users:', users.length);

  // Create apartments
  const apartments = await Promise.all([
    prisma.apartment.create({
      data: {
        unitNumber: 'A101',
        floor: 1,
        areaSqm: 85.5,
        buildingId: building.id,
        ownerId: users[3].id // resident1
      }
    }),

    prisma.apartment.create({
      data: {
        unitNumber: 'A102',
        floor: 1,
        areaSqm: 92.0,
        buildingId: building.id,
        ownerId: users[4].id // resident2
      }
    }),

    prisma.apartment.create({
      data: {
        unitNumber: 'B205',
        floor: 2,
        areaSqm: 78.5,
        buildingId: building.id,
        ownerId: users[5].id // resident3
      }
    }),

    // Some apartments without owners
    prisma.apartment.create({
      data: {
        unitNumber: 'A103',
        floor: 1,
        areaSqm: 85.5,
        buildingId: building.id
      }
    }),

    prisma.apartment.create({
      data: {
        unitNumber: 'B301',
        floor: 3,
        areaSqm: 95.0,
        buildingId: building.id
      }
    })
  ]);

  console.log('✅ Created apartments:', apartments.length);

  // Create sample complaints
  const complaints = await Promise.all([
    prisma.complaint.create({
      data: {
        title: 'Elevator not working properly',
        description: 'The elevator in building A frequently gets stuck between floors 3 and 4. This has happened 3 times this week.',
        category: 'MAINTENANCE',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        reporterId: users[3].id,
        apartmentId: apartments[0].id,
        assigneeId: users[2].id // staff1
      }
    }),

    prisma.complaint.create({
      data: {
        title: 'Water leak in bathroom',
        description: 'There is a water leak under the bathroom sink. Water is dripping constantly and may cause damage to the apartment below.',
        category: 'MAINTENANCE',
        priority: 'URGENT',
        status: 'PENDING',
        reporterId: users[4].id,
        apartmentId: apartments[1].id
      }
    }),

    prisma.complaint.create({
      data: {
        title: 'Noise complaint from upstairs neighbor',
        description: 'The neighbor upstairs plays loud music late at night, affecting my sleep quality. This has been ongoing for 2 weeks.',
        category: 'NOISE',
        priority: 'MEDIUM',
        status: 'RESOLVED',
        reporterId: users[5].id,
        apartmentId: apartments[2].id,
        assigneeId: users[1].id, // manager
        resolvedAt: new Date()
      }

      }),

   prisma.complaint.create({
     data: {
       title: 'Broken security camera in parking garage',
       description: 'Security camera #3 in the underground parking garage has been broken for over a week. This creates a security concern.',
       category: 'SECURITY',
       priority: 'HIGH',
       status: 'IN_PROGRESS',
       reporterId: users[3].id,
       apartmentId: apartments[0].id,
       assigneeId: users[2].id
     }
   }),

   prisma.complaint.create({
     data: {
       title: 'Air conditioning not cooling',
       description: 'The central air conditioning system is not working properly. Temperature remains high despite running all day.',
       category: 'UTILITIES',
       priority: 'MEDIUM',
       status: 'PENDING',
       reporterId: users[4].id,
       apartmentId: apartments[1].id
     }
   }),

   prisma.complaint.create({
     data: {
       title: 'Gym equipment needs maintenance',
       description: 'The treadmill in the fitness center is making strange noises and the belt is loose.',
       category: 'FACILITIES',
       priority: 'LOW',
       status: 'RESOLVED',
       reporterId: users[5].id,
       apartmentId: apartments[2].id,
       assigneeId: users[1].id,
       resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
     }
   })
 ]);

 console.log('✅ Created complaints:', complaints.length);

 // Create sample comments
 await Promise.all([
   prisma.comment.create({
     data: {
       content: 'We have contacted the elevator maintenance company. They will inspect tomorrow morning.',
       complaintId: complaints[0].id,
       authorId: users[2].id // staff1
     }
   }),

   prisma.comment.create({
     data: {
       content: 'Thank you for the quick response. Please let me know the scheduled time.',
       complaintId: complaints[0].id,
       authorId: users[3].id // resident1
     }
   }),

   prisma.comment.create({
     data: {
       content: 'Plumber has been scheduled for tomorrow at 2 PM. Please ensure someone is available.',
       complaintId: complaints[1].id,
       authorId: users[1].id // manager
     }
   }),

   prisma.comment.create({
     data: {
       content: 'I spoke with the upstairs neighbor. They have agreed to keep noise levels down after 10 PM.',
       complaintId: complaints[2].id,
       authorId: users[1].id // manager
     }
   })
 ]);

 console.log('✅ Created comments');

 console.log('\n🎉 Database seeding completed successfully!');
 console.log('\n📊 Summary:');
 console.log(`   • 1 Building created`);
 console.log(`   • ${users.length} Users created`);
 console.log(`   • ${apartments.length} Apartments created`);
 console.log(`   • ${complaints.length} Complaints created`);
 console.log(`   • 4 Comments created`);
 
 console.log('\n👥 Test Accounts:');
 console.log('   📧 admin@abc-apartment.com (password: admin123) - Super Admin');
 console.log('   📧 manager@abc-apartment.com (password: manager123) - Building Manager');
 console.log('   📧 staff1@abc-apartment.com (password: staff123) - Staff');
 console.log('   📧 resident1@gmail.com (password: resident123) - Resident');
 console.log('   📧 resident2@gmail.com (password: resident123) - Resident');
 console.log('   📧 resident3@gmail.com (password: resident123) - Resident');
}

main()
 .catch((e) => {
   console.error('❌ Error during seeding:', e);
   process.exit(1);
 })
 .finally(async () => {
   await prisma.$disconnect();
 });