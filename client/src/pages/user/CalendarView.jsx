import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CalendarView = () => {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'upcoming', 'overdue', 'completed'

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tasks?limit=200');
        if (res.data.success) {
          setTasks(res.data.tasks);
        }
      } catch (err) {
        toast.error('Failed to load tasks for calendar.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const due = new Date(t.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

    if (filter === 'completed') return t.status === 'Completed';
    if (filter === 'overdue') return dueDay < today && t.status !== 'Completed';
    if (filter === 'today') return dueDay.getTime() === today.getTime();
    if (filter === 'upcoming') return dueDay > today && t.status !== 'Completed';
    return true;
  });

  // Map tasks by date string 'YYYY-MM-DD'
  const tasksByDate = {};
  filteredTasks.forEach((t) => {
    const dStr = new Date(t.dueDate).toISOString().split('T')[0];
    if (!tasksByDate[dStr]) {
      tasksByDate[dStr] = [];
    }
    tasksByDate[dStr].push(t);
  });

  // Selected date tasks
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const selectedDayTasks = tasksByDate[selectedDateStr] || [];

  if (loading) {
    return <LoadingSpinner text="Generating calendar schedule..." />;
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar cells generation
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true,
    });
  }

  // Next month leading days
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
    });
  }

  const isSelected = (cellDate) => {
    return (
      cellDate.getDate() === selectedDate.getDate() &&
      cellDate.getMonth() === selectedDate.getMonth() &&
      cellDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (cellDate) => {
    const today = new Date();
    return (
      cellDate.getDate() === today.getDate() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Calendar Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-brand-600" />
            <span>Task Calendar</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Visual roadmap of your upcoming deadlines and deliverables
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'today', label: "Today's Tasks" },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'completed', label: 'Completed' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === f.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Month Grid (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          {/* Month Navigator */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Today
              </button>
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase tracking-wider text-slate-400 pb-2">
            {dayNames.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarCells.map((cell, idx) => {
              const cellDate = new Date(cell.year, cell.month, cell.day);
              const dateStr = cellDate.toISOString().split('T')[0];
              const cellTasks = tasksByDate[dateStr] || [];
              const hasTasks = cellTasks.length > 0;
              const cellIsSelected = isSelected(cellDate);
              const cellIsToday = isToday(cellDate);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(cellDate)}
                  className={`min-h-[70px] sm:min-h-[90px] p-2 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    cellIsSelected
                      ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20'
                      : cellIsToday
                      ? 'border-brand-300 bg-brand-50/20'
                      : cell.isCurrentMonth
                      ? 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      : 'border-transparent bg-slate-50/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        cellIsToday
                          ? 'bg-brand-600 text-white'
                          : cell.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {hasTasks && (
                      <span className="text-[10px] font-bold text-brand-600 bg-brand-100/70 px-1.5 py-0.2 rounded-full">
                        {cellTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Mini dots / titles preview */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {cellTasks.slice(0, 2).map((t) => (
                      <div
                        key={t._id}
                        className={`text-[10px] truncate px-1.5 py-0.5 rounded font-medium ${
                          t.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : t.priority === 'Urgent'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {cellTasks.length > 2 && (
                      <p className="text-[9px] font-bold text-slate-400 text-right">
                        +{cellTasks.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Tasks Drawer / Side panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Date</p>
                <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h4>
              </div>
              <Link
                to="/tasks/create"
                className="p-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition"
                title="Add task for this date"
              >
                <Plus className="w-4 h-4" />
              </Link>
            </div>

            {selectedDayTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CalendarIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-600">No tasks due on this date</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Click the "+" button to schedule a new task deadline.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {selectedDayTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <PriorityBadge priority={task.priority} size="sm" />
                      <StatusBadge status={task.status} size="sm" />
                    </div>

                    <Link
                      to={`/tasks/${task._id}`}
                      className="font-bold text-sm text-slate-900 hover:text-brand-600 block line-clamp-2"
                    >
                      {task.title}
                    </Link>

                    {task.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{task.category}</span>
                      <Link
                        to={`/tasks/${task._id}`}
                        className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/tasks"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>Go to Task List</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
