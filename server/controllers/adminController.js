import User from '../models/User.js';
import Task from '../models/Task.js';
import { seedInitialData } from '../utils/seedData.js';

/**
 * @desc    Get aggregated system statistics and chart analytics for admin
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Basic Counts
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      Task.countDocuments(),
      Task.countDocuments({ status: 'Pending' }),
      Task.countDocuments({ status: 'In Progress' }),
      Task.countDocuments({ status: 'Completed' }),
      Task.countDocuments({ status: { $ne: 'Completed' }, dueDate: { $lt: todayStart } }),
    ]);

    // Tasks grouped by Status
    const tasksByStatus = [
      { name: 'Pending', value: pendingTasks, color: '#f59e0b' },
      { name: 'In Progress', value: inProgressTasks, color: '#3b82f6' },
      { name: 'Completed', value: completedTasks, color: '#10b981' },
    ];

    // Tasks grouped by Priority
    const priorityAgg = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);
    const priorityMap = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    priorityAgg.forEach((p) => {
      if (p._id) priorityMap[p._id] = p.count;
    });

    const tasksByPriority = [
      { name: 'Low', count: priorityMap['Low'] || 0, fill: '#10b981' },
      { name: 'Medium', count: priorityMap['Medium'] || 0, fill: '#3b82f6' },
      { name: 'High', count: priorityMap['High'] || 0, fill: '#f59e0b' },
      { name: 'Urgent', count: priorityMap['Urgent'] || 0, fill: '#ef4444' },
    ];

    // Tasks grouped by Category
    const categoryAgg = await Task.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const tasksByCategory = categoryAgg.map((c) => ({
      category: c._id || 'General',
      count: c.count,
    }));

    // Tasks timeline (last 7 days activity)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const tasksLast7Days = await Task.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          created: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format last 7 days array to ensure every day is represented
    const timelineData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const found = tasksLast7Days.find((t) => t._id === dateStr);
      timelineData.push({
        date: dateStr,
        day: dayName,
        created: found ? found.created : 0,
        completed: found ? found.completed : 0,
      });
    }

    // Top active users by task creation
    const topUsersAgg = await Task.aggregate([
      { $group: { _id: '$userId', taskCount: { $sum: 1 }, completedCount: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } } } },
      { $sort: { taskCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          _id: 1,
          name: '$userInfo.name',
          email: '$userInfo.email',
          role: '$userInfo.role',
          taskCount: 1,
          completedCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      charts: {
        tasksByStatus,
        tasksByPriority,
        tasksByCategory,
        timelineData,
        topUsers: topUsersAgg,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset and re-seed sample demo data
 * @route   POST /api/admin/reset-seed
 * @access  Private (Admin Only)
 */
export const resetSeedData = async (req, res, next) => {
  try {
    await seedInitialData();
    res.status(200).json({
      success: true,
      message: 'Demo database successfully re-seeded with sample users and tasks!',
    });
  } catch (error) {
    next(error);
  }
};
