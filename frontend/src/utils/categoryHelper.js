import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  Tag,
} from 'lucide-react';

export const CATEGORIES_CONFIG = {
  Food: {
    label: 'Food',
    icon: Utensils,
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200/80',
    iconBg: 'bg-orange-100 text-orange-600',
    hex: '#f97316',
  },
  Travel: {
    label: 'Travel',
    icon: Car,
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200/80',
    iconBg: 'bg-sky-100 text-sky-600',
    hex: '#0284c7',
  },
  Shopping: {
    label: 'Shopping',
    icon: ShoppingBag,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200/80',
    iconBg: 'bg-purple-100 text-purple-600',
    hex: '#a855f7',
  },
  Bills: {
    label: 'Bills',
    icon: Zap,
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/80',
    iconBg: 'bg-rose-100 text-rose-600',
    hex: '#f43f5e',
  },
  Entertainment: {
    label: 'Entertainment',
    icon: Film,
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200/80',
    iconBg: 'bg-pink-100 text-pink-600',
    hex: '#ec4899',
  },
  Health: {
    label: 'Health',
    icon: HeartPulse,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/80',
    iconBg: 'bg-emerald-100 text-emerald-600',
    hex: '#10b981',
  },
  Education: {
    label: 'Education',
    icon: GraduationCap,
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200/80',
    iconBg: 'bg-indigo-100 text-indigo-600',
    hex: '#6366f1',
  },
  Other: {
    label: 'Other',
    icon: Tag,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    iconBg: 'bg-slate-200 text-slate-600',
    hex: '#64748b',
  },
};

export const getCategoryConfig = (category) => {
  return CATEGORIES_CONFIG[category] || CATEGORIES_CONFIG.Other;
};
