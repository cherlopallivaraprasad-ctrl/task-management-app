import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Task from '../models/Task.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

export const seedInitialData = async () => {
  try {
    console.log('🌱 Starting Database Seeding Process...');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('🧹 Cleared existing users and tasks.');

    // 1. Create Admin User (admin@example.com / Admin@123)
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    });

    // 2. Create Primary Demo User (user@example.com / User@123)
    const primaryUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'user@example.com',
      password: 'User@123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    });

    // 3. Create Additional Team Members
    const userAlex = await User.create({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'User@123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    });

    const userElena = await User.create({
      name: 'Elena Rostova',
      email: 'elena@example.com',
      password: 'User@123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      isActive: false, // Inactive user for testing admin deactivate status
    });

    console.log('👤 Created demo users (Admin, Sarah, Alex, Elena).');

    // Dates reference
    const now = new Date();
    const addDays = (d, days) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy;
    };

    // 4. Create Sample Tasks for Primary User (Sarah)
    const primaryUserTasks = [
      {
        title: 'Design TaskFlow Mobile Responsive Layouts',
        description: 'Complete Figma UI wireframes and interactive prototypes for tablet and smartphone views.',
        category: 'Design',
        priority: 'High',
        status: 'In Progress',
        dueDate: addDays(now, 1),
        userId: primaryUser._id,
      },
      {
        title: 'Implement JWT Authentication Flow',
        description: 'Configure protected API routes, access token interceptors, and secure token storage.',
        category: 'Development',
        priority: 'Urgent',
        status: 'Completed',
        dueDate: addDays(now, -1), // yesterday (completed)
        userId: primaryUser._id,
      },
      {
        title: 'Quarterly OKR Planning & Task Breakdown',
        description: 'Review Q3 performance benchmarks and align upcoming project milestones with stakeholders.',
        category: 'Operations',
        priority: 'Medium',
        status: 'Pending',
        dueDate: addDays(now, 0), // due today
        userId: primaryUser._id,
      },
      {
        title: 'Fix High-Priority Bug in Dashboard Analytics',
        description: 'Resolve chart rendering glitches on Safari and improve chart loading skeleton state.',
        category: 'Development',
        priority: 'Urgent',
        status: 'In Progress',
        dueDate: addDays(now, 2),
        userId: primaryUser._id,
      },
      {
        title: 'Conduct User Experience Feedback Interviews',
        description: 'Gather feedback from 5 beta testers regarding the calendar drag-and-drop experience.',
        category: 'Marketing',
        priority: 'Low',
        status: 'Pending',
        dueDate: addDays(now, 5),
        userId: primaryUser._id,
      },
      {
        title: 'Review System Security Audit & Dependencies',
        description: 'Scan npm packages for vulnerabilities and enforce strict CSP headers.',
        category: 'Operations',
        priority: 'High',
        status: 'Pending',
        dueDate: addDays(now, -3), // overdue
        userId: primaryUser._id,
      },
      {
        title: 'Publish Product Release Announcement',
        description: 'Draft changelog notes and publish blog post detailing version 2.0 improvements.',
        category: 'Marketing',
        priority: 'Medium',
        status: 'Completed',
        dueDate: addDays(now, -2),
        userId: primaryUser._id,
      },
      {
        title: 'Organize Team Sync & Standup Notes',
        description: 'Archive weekly meeting logs and share summary action items in the slack channel.',
        category: 'General',
        priority: 'Low',
        status: 'Completed',
        dueDate: addDays(now, -5),
        userId: primaryUser._id,
      },
    ];

    // 5. Create Tasks for Alex Rivera
    const alexTasks = [
      {
        title: 'Build Dark Mode Theme Color Palette',
        description: 'Create CSS variables and Tailwind color tokens for high-contrast dark theme.',
        category: 'Design',
        priority: 'Medium',
        status: 'In Progress',
        dueDate: addDays(now, 3),
        userId: userAlex._id,
      },
      {
        title: 'Optimize REST API Response Times with Indexing',
        description: 'Add compound MongoDB indexes for userId and status query optimization.',
        category: 'Development',
        priority: 'High',
        status: 'Completed',
        dueDate: addDays(now, -1),
        userId: userAlex._id,
      },
      {
        title: 'Customer Onboarding Video Script',
        description: 'Write a 2-minute walkthrough script guiding new users through creating their first task.',
        category: 'Marketing',
        priority: 'Low',
        status: 'Pending',
        dueDate: addDays(now, 7),
        userId: userAlex._id,
      },
    ];

    // 6. Create Tasks for Admin (System Maintenance)
    const adminTasks = [
      {
        title: 'Perform Automated MongoDB Backup',
        description: 'Trigger weekly cluster snapshot and verify offsite encrypted storage integrity.',
        category: 'Operations',
        priority: 'Urgent',
        status: 'Completed',
        dueDate: addDays(now, -1),
        userId: adminUser._id,
      },
      {
        title: 'Update Production SSL Certificates',
        description: 'Renew wildcard TLS/SSL certificates and configure automated auto-renewal bot.',
        category: 'Operations',
        priority: 'High',
        status: 'In Progress',
        dueDate: addDays(now, 4),
        userId: adminUser._id,
      },
    ];

    await Task.insertMany([...primaryUserTasks, ...alexTasks, ...adminTasks]);
    console.log(`📋 Seeded ${primaryUserTasks.length + alexTasks.length + adminTasks.length} sample tasks.`);

    console.log('✅ Database Seeding Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log('🔑 DEMO CREDENTIALS:');
    console.log('👑 Admin: admin@example.com / Admin@123');
    console.log('👤 User:  user@example.com  / User@123');
    console.log('👤 User2: alex@example.com  / User@123');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mongoose
    .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow')
    .then(async () => {
      await seedInitialData();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
