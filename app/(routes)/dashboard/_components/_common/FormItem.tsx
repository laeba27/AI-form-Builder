"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ActivityIcon,
  EllipsisIcon,
  Globe,
  LockKeyholeIcon,
  MessageSquare,
  Sparkles,
  BarChart3,
  Clock,
  MoreVertical,
  Trash2,
  Edit3,
  Copy,
  Eye,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useRef } from "react";

type PropsType = {
  id: number;
  formId: string;
  name: string;
  responses: number;
  views: number;
  createdAt: Date;
  published: boolean;
  backgroundColor: string;
  onDelete?: (formId: string) => void;
};
const FormItem = (props: PropsType) => {
  const {
    id,
    formId,
    name,
    published,
    createdAt,
    responses = 0,
    views = 0,
    onDelete,
  } = props;

  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const onClick = useCallback(() => {
    if (!showMenu && !showDeleteConfirm) {
      router.push(`/dashboard/form/builder/${formId}`);
    }
  }, [formId, router, showMenu, showDeleteConfirm]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
    setShowMenu(false);
  }, []);

  const confirmDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(formId);
    }
    setShowDeleteConfirm(false);
  }, [formId, onDelete]);

  const cancelDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  }, []);

  const handleMenuToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }, [showMenu]);

  // Generate unique gradient based on form ID for visual diversity
  const gradientVariants = [
    "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
    "from-blue-500/20 via-cyan-500/20 to-teal-500/20", 
    "from-emerald-500/20 via-green-500/20 to-lime-500/20",
    "from-orange-500/20 via-red-500/20 to-pink-500/20",
    "from-indigo-500/20 via-blue-500/20 to-cyan-500/20"
  ];
  
  const gradientIndex = parseInt(formId.slice(-1), 16) % gradientVariants.length;
  const selectedGradient = gradientVariants[gradientIndex];

  return (
    <div 
      onClick={onClick} 
      role="button" 
      className="group relative w-full h-auto transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
    >
      {/* Main Card Container - Made Bigger */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[280px] min-w-[320px] ">
        
        {/* Header Section with Gradient Background - Made Bigger */}
        <div className={`relative h-32 bg-gradient-to-br ${selectedGradient} overflow-hidden`}>
          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-white/5 rounded-full blur-lg" />
          <div className="absolute top-4 left-4 w-8 h-8 bg-white/5 rounded-full blur-md" />
          
          {/* Status Indicator */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm ${
              published 
                ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
            }`}>
              {published ? (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Live</span>
                </>
              ) : (
                <>
                  <LockKeyholeIcon className="w-4 h-4" />
                  <span>Draft</span>
                </>
              )}
            </div>
          </div>

          {/* Form Icon */}
          <div className="absolute bottom-4 left-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Menu Button */}
          <div className="absolute bottom-4 right-6">
            <div className="relative" ref={menuRef}>
              <button 
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors duration-200"
                onClick={handleMenuToggle}
              >
                <MoreVertical className="w-5 h-5 text-white" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute bottom-12 right-0 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[160px] z-50">
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/form/builder/${formId}`);
                      setShowMenu(false);
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Form
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle view responses
                      setShowMenu(false);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    View Responses
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle duplicate
                      setShowMenu(false);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Form
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - Enhanced Padding */}
        <div className="p-6 space-y-4">
          
          {/* Form Title and Actions */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors duration-200 mb-2">
                {name}
              </h3>
              <p className="text-sm text-gray-500">
                Created {mounted ? formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true }) : 'recently'}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4 group-hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Responses</p>
                  <p className="text-2xl font-bold text-blue-900">{responses.toLocaleString()}</p>
                </div>
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 group-hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Views</p>
                  <p className="text-2xl font-bold text-emerald-900">{views.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                responses > 10 ? 'bg-emerald-400' : responses > 0 ? 'bg-amber-400' : 'bg-gray-300'
              }`} />
              <span className="text-sm text-gray-600 font-medium">
                {responses > 10 ? 'High engagement' : responses > 0 ? 'Getting responses' : 'No responses yet'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>ID: {formId.slice(-6).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl">
              <div className="text-center">
                <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Form</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{name}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button 
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                  <button 
                    className="flex-1 px-4 py-2 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-purple-200 transition-colors duration-300 pointer-events-none" />
      </div>
    </div>
  );
};

export default FormItem;
