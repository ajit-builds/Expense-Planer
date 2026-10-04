import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import { User, Mail, Calendar, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'October 2026';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Account & Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your personal account credentials and security preferences.
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-indigo-500">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-lg font-bold text-slate-900">{user?.name || 'User'}</h2>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1.5 mt-0.5 font-medium">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email || 'user@example.com'}</span>
            </p>
            <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Active Account</span>
            </div>
          </div>
        </div>

        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-50 text-xs">
            <div className="flex items-center space-x-3 text-slate-600 font-semibold">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Full Name</span>
            </div>
            <span className="font-bold text-slate-900">{user?.name}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-50 text-xs">
            <div className="flex items-center space-x-3 text-slate-600 font-semibold">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Email Address</span>
            </div>
            <span className="font-bold text-slate-900">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-50 text-xs">
            <div className="flex items-center space-x-3 text-slate-600 font-semibold">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Account Created</span>
            </div>
            <span className="font-bold text-slate-900">{formattedDate}</span>
          </div>

          <div className="flex items-center justify-between py-2 text-xs">
            <div className="flex items-center space-x-3 text-slate-600 font-semibold">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Security Level</span>
            </div>
            <span className="font-bold text-emerald-600">JWT Token Protected</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={logout}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
