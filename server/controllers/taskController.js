import Task from '../models/Task.js';

/**
 * @desc    Get all tasks for current user (or all tasks if admin requested)
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      category,
      dueDateFilter,
      sortBy = 'newest',
      page = 1,
      limit = 50,
      all = false,
    } = req.query;

    // Base query filter
    const query = {};

    // If not admin OR not requesting all tasks, scope to logged in user
    if (req.user.role !== 'admin' || all !== 'true') {
      query.userId = req.user.id;
    }

    // Filter by Status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by Priority
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Filter by Category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by Due Date special ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (dueDateFilter === 'today') {
      query.dueDate = { $gte: todayStart, $lte: todayEnd };
    } else if (dueDateFilter === 'overdue') {
      query.dueDate = { $lt: todayStart };
      query.status = { $ne: 'Completed' };
    } else if (dueDateFilter === 'upcoming') {
      query.dueDate = { $gt: todayEnd };
      query.status = { $ne: 'Completed' };
    }

    // Search by title or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { category: searchRegex }];
    }

    // Sorting definition
    let sortOption = { createdAt: -1 }; // default newest
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'dueDateAsc') {
      sortOption = { dueDate: 1 };
    } else if (sortBy === 'dueDateDesc') {
      sortOption = { dueDate: -1 };
    } else if (sortBy === 'priority') {
      // Priority sort order will be handled or mapped
      sortOption = { priority: 1, dueDate: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('userId', 'name email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('userId', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Authorization: User must own the task, unless user is an Admin
    if (task.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to view this task.',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, status, dueDate, assignedUserId } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task title and due date.',
      });
    }

    // Target userId is either assigned (if admin specifies it) or authenticated user
    let targetUserId = req.user.id;
    if (req.user.role === 'admin' && assignedUserId) {
      targetUserId = assignedUserId;
    }

    const task = await Task.create({
      title,
      description: description || '',
      category: category || 'General',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: new Date(dueDate),
      userId: targetUserId,
    });

    const populatedTask = await Task.findById(task._id).populate('userId', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Authorization check
    if (task.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to update this task.',
      });
    }

    const { title, description, category, priority, status, dueDate, assignedUserId } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);
    if (req.user.role === 'admin' && assignedUserId !== undefined) {
      task.userId = assignedUserId;
    }

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id).populate('userId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick update status of a task
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${status}`,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Authorization check
    if (task.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to delete this task.',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics for user or system
 * @route   GET /api/tasks/stats/summary
 * @access  Private
 */
export const getTaskStats = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role !== 'admin' || req.query.personal === 'true') {
      query.userId = req.user._id;
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalTasks, pendingTasks, inProgressTasks, completedTasks, overdueTasks] =
      await Promise.all([
        Task.countDocuments(query),
        Task.countDocuments({ ...query, status: 'Pending' }),
        Task.countDocuments({ ...query, status: 'In Progress' }),
        Task.countDocuments({ ...query, status: 'Completed' }),
        Task.countDocuments({
          ...query,
          status: { $ne: 'Completed' },
          dueDate: { $lt: todayStart },
        }),
      ]);

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Fetch upcoming deadlines (next 5 tasks due soonest)
    const upcomingDeadlines = await Task.find({
      ...query,
      status: { $ne: 'Completed' },
      dueDate: { $gte: todayStart },
    })
      .sort({ dueDate: 1 })
      .limit(5);

    // Fetch recent tasks (latest 5 created/updated)
    const recentTasks = await Task.find(query)
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        completionRate,
      },
      upcomingDeadlines,
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};
