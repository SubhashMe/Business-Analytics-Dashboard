'use client';

import { useState } from 'react';
import { Save, User, Bell, Shield, PaintBucket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/theme-store';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const { accent, setAccent, theme, setTheme } = useThemeStore();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto relative">
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold">Settings Saved</h4>
            <p className="text-sm text-slate-300">Your preferences have been updated.</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and application preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === 'profile' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <User size={18} />
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === 'notifications' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <Bell size={18} />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === 'security' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <Shield size={18} />
            Security
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === 'appearance' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <PaintBucket size={18} />
            Appearance
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {activeTab === 'profile' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                  <p className="text-sm text-slate-500 mt-1">Update your personal details and public profile.</p>
                </div>
                <hr className="border-slate-100" />
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Shravan Kumar"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="shravan@dealflow.com"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Role / Title</label>
                    <input 
                      type="text" 
                      defaultValue="Account Executive"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
                  <p className="text-sm text-slate-500 mt-1">Control how and when you receive alerts.</p>
                </div>
                <hr className="border-slate-100" />
                <div className="space-y-4">
                  {[
                    { title: "New Deal Assignments", desc: "Get notified when a new deal is assigned to you." },
                    { title: "Pipeline Stage Changes", desc: "Alerts when deals move across stages." },
                    { title: "Daily Summary", desc: "Receive a morning email with your daily tasks." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Security Settings</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage your password and security questions.</p>
                </div>
                <hr className="border-slate-100" />
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <input 
                      type="password" 
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                  <button type="button" className="text-sm text-blue-600 font-medium hover:underline">
                    Enable Two-Factor Authentication (2FA)
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Corporate Branding & Appearance</h2>
                  <p className="text-sm text-slate-500 mt-1">Select your enterprise primary accent and interface style.</p>
                </div>
                <hr className="border-slate-100" />
                <div className="space-y-6 max-w-lg">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Corporate Accent Color</label>
                    <p className="text-xs text-slate-500 mb-3">Customizes primary action buttons, charts, and brand indicators.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'blue', label: 'Enterprise Blue', color: '#2563eb' },
                        { id: 'indigo', label: 'Sapphire Navy', color: '#4f46e5' },
                        { id: 'emerald', label: 'Growth Emerald', color: '#059669' },
                        { id: 'violet', label: 'Executive Slate', color: '#7c3aed' },
                        { id: 'rose', label: 'Dynamic Ruby', color: '#e11d48' },
                      ].map(acc => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => setAccent(acc.id)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left",
                            accent === acc.id 
                              ? "bg-slate-50 border-slate-900 text-slate-900 ring-2 ring-slate-900/10 shadow-sm" 
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: acc.color }} />
                          <span className="truncate">{acc.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Theme Mode</label>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-slate-900 block">Clean Corporate Light Mode</span>
                        <span className="text-xs text-slate-500">Standard business-focused enterprise appearance enabled.</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isSaving ? <span className="animate-pulse">Saving...</span> : <Save size={18} />}
                <span>{isSaving ? 'Saving' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
