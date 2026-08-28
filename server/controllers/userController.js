import User from '../models/User.js';
import Task from '../models/Task.js';

/**
 * @desc    Get all users with task counts and filtering
 * @route   GET /api/users
 * @access  Private (Admin Only)
 */
export const getUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    const query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    // Attach task count for each user
    const userIds = users.map((u) => u._id);
    const taskCounts = await Task.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    taskCounts.forEach((tc) => {
      countMap[tc._id.toString()] = tc.count;
    });

    const usersWithStats = users.map((u) => ({
      ...u.toObject(),
      taskCount: countMap[u._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single user details by ID
 * @route   GET /api/users/:id
 * @access  Private (Admin Only)
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const tasks = await Task.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);
    const taskCount = await Task.countDocuments({ userId: user._id });

    res.status(200).json({
      success: true,
      user,
      taskCount,
      recentTasks: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user (Role, Status, Name, Email)
 * @route   PUT /api/users/:id
 * @access  Private (Admin Only)
 */
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const { name, email, role, isActive } = req.body;

    // Safety: Prevent admin from deactivating or demoting themselves
    if (user._id.toString() === req.user.id) {
      if (isActive === false) {
        return res.status(400).json({
          success: false,
          message: 'You cannot deactivate your own admin account.',
        });
      }
      if (role && role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'You cannot remove your own admin privileges.',
        });
      }
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role && ['user', 'admin'].includes(role)) user.role = role;
    if (isActive !== undefined) user.isActive = Boolean(isActive);

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user and cascade delete their tasks
 * @route   DELETE /api/users/:id
 * @access  Private (Admin Only)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent admin from deleting their own account
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    // Cascade delete: remove all tasks created by this user
    await Task.deleteMany({ userId: user._id });

    // Remove user
    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: 'User and all associated tasks deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
