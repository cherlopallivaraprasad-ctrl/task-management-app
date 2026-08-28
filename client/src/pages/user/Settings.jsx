import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Palette, Shield, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Settings = () => {
  const toast = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [defaultView, setDefaultView] = useState('table');

  const handleSavePreferences = (e) => {
    e.preventDefault();
    toast.success('Preferences saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application Settings
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Customize your task management workspace and notification triggers
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Bell className="w-5 h-5 text-brand-600" />
          <h4 className="font-bold text-slate-900 text-base">Notification Preferences</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">Email Notifications</p>
              <p className="text-xs text-slate-500">Receive email alerts when high-priority tasks are assigned or updated.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">Deadline Reminders</p>
              <p className="text-xs text-slate-500">Highlight overdue and urgent tasks on your primary dashboard.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={deadlineReminders}
                onChange={(e) => setDeadlineReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">Celebration Animations</p>
              <p className="text-xs text-slate-500">Show celebratory confetti when marking a task as completed.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 active:scale-95 transition shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
