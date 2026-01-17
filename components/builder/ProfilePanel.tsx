'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface ProfilePanelProps {
  user: any;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export default function ProfilePanel({ user }: ProfilePanelProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ full_name: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        setProfile({
          id: user.id,
          email: user.email || '',
          full_name: data?.full_name || '',
          avatar_url: data?.avatar_url || '',
          created_at: data?.created_at || new Date().toISOString(),
        });

        setFormData({ full_name: data?.full_name || '' });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, full_name: formData.full_name } : null);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="text-5xl">🔐</div>
          <h2 className="font-display text-2xl font-semibold text-text-primary">Not Signed In</h2>
          <p className="text-text-muted max-w-sm">
            Sign in to your account to access your profile and manage your builds.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Link href="/login">
              <button className="px-6 py-2.5 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 ease-premium hover:shadow-lg active:scale-95">
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-2.5 rounded-lg border border-border/20 text-text-primary font-medium hover:bg-surface-1/50 transition-all duration-200 ease-premium">
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-text-muted">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Header */}
      <div className="p-6 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 transition-all duration-200 ease-premium shadow-glass">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '👤'}
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-text-primary">
                {profile?.full_name || 'User Profile'}
              </p>
              <p className="text-text-muted text-sm mt-1">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent font-medium text-sm border border-accent/30 transition-all duration-200 ease-premium"
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editMode && (
          <div className="space-y-4 pt-4 border-t border-border/10">
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ full_name: e.target.value })}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-lg bg-surface-1/75 backdrop-blur-sm border border-border/10
                text-text-primary placeholder-text-muted/50
                focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10
                transition-all duration-200 ease-premium"
            />
            <button
              onClick={handleUpdateProfile}
              className="w-full px-4 py-2.5 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 ease-premium hover:shadow-lg active:scale-95"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="p-6 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 transition-all duration-200 ease-premium shadow-glass space-y-4">
        <h3 className="font-display text-lg font-semibold text-text-primary">Account Information</h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase mb-1">Email</p>
            <p className="text-text-primary font-medium">{user?.email}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-muted uppercase mb-1">Member Since</p>
            <p className="text-text-primary font-medium">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-muted uppercase mb-1">Account Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <p className="text-text-primary font-medium">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="p-6 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 transition-all duration-200 ease-premium shadow-glass space-y-4">
        <h3 className="font-display text-lg font-semibold text-text-primary">Preferences</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-border/30 bg-surface-1/75 accent-accent"
            />
            <span className="text-text-primary">Email me about new features and updates</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-border/30 bg-surface-1/75 accent-accent"
            />
            <span className="text-text-primary">Notify me when my saved builds are updated</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border/30 bg-surface-1/75 accent-accent"
            />
            <span className="text-text-primary">Allow community to view my builds</span>
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm transition-all duration-200 space-y-4">
        <h3 className="font-display text-lg font-semibold text-red-300">Danger Zone</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary font-medium">Change Password</p>
              <p className="text-sm text-text-muted">Update your account password</p>
            </div>
            <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 font-medium text-sm transition-all duration-200 ease-premium">
              Change
            </button>
          </div>

          <div className="border-t border-red-500/20 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-primary font-medium">Delete Account</p>
                <p className="text-sm text-text-muted">Permanently delete your account and all data</p>
              </div>
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure? This cannot be undone.')) {
                    try {
                      await supabase.auth.signOut();
                      alert('Please contact support to delete your account permanently.');
                    } catch (error) {
                      console.error('Error:', error);
                    }
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-500/30 hover:bg-red-500/40 text-red-300 font-medium text-sm transition-all duration-200 ease-premium border border-red-500/50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
