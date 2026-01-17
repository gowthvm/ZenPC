'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../components/ui/button';

type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
};

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  // Supabase client is already imported from @/lib/supabaseClient

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          
          setProfile({
            id: user.id,
            email: user.email || '',
            full_name: data?.full_name || '',
            avatar_url: data?.avatar_url || '',
            created_at: data?.created_at || new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Removed supabase from dependencies

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-10 flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full py-10 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Not Signed In</h2>
        <p className="text-text-muted mb-6">Please sign in to view your account details.</p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="default">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="section-header mb-8">
        <h1 className="section-title">Account Settings</h1>
        <p className="section-subtitle">Manage your profile, security, and builds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="card p-6 sticky top-24">
            {/* Profile Card */}
            <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-border/10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center mb-4 border border-accent/20 shadow-lg">
                {profile.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt={profile.full_name || 'User'} 
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-2xl font-bold text-accent">
                    {profile.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-text-primary">{profile.full_name || 'User'}</h3>
              <p className="text-xs text-text-muted mt-1 truncate max-w-full">{profile.email}</p>
            </div>

            {/* Tab Navigation */}
            <nav className="space-y-2 mb-6">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'security', label: 'Security', icon: '🔒' },
                { id: 'saved', label: 'Saved Builds', icon: '💾' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left nav-item ${activeTab === tab.id ? 'nav-item-active' : 'nav-item-inactive'}`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="flex-1">{tab.label}</span>
                  {activeTab === tab.id && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </nav>

            {/* Sign Out Button */}
            <button 
              onClick={handleSignOut}
              className="w-full btn-outline text-red-400 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="panel">
              <div className="panel-header mb-6">
                <h2 className="panel-title">Profile Settings</h2>
                <p className="panel-subtitle">Update your personal information</p>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label className="form-label" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    defaultValue={profile.full_name || ''}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    disabled
                    value={profile.email}
                    className="form-input opacity-60 cursor-not-allowed"
                  />
                  <p className="mt-2 text-xs text-text-muted flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    Contact support to change your email
                  </p>
                </div>

                <div className="pt-4 border-t border-border/10">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="panel">
              <div className="panel-header mb-6">
                <h2 className="panel-title">Security</h2>
                <p className="panel-subtitle">Keep your account safe and secure</p>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm text-accent font-medium">
                    ℹ️ Security features coming soon
                  </p>
                  <p className="text-xs text-text-muted mt-2">
                    Password and two-factor authentication settings will be available soon.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-3">Account Activity</h3>
                  <div className="space-y-2 text-sm text-text-muted">
                    <div className="flex justify-between p-3 bg-surface-1/40 rounded-lg border border-border/10">
                      <span>Account Created</span>
                      <span className="text-text-primary font-medium">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="panel">
              <div className="panel-header mb-6 flex items-center justify-between">
                <div>
                  <h2 className="panel-title">Saved Builds</h2>
                  <p className="panel-subtitle">All your PC builds</p>
                </div>
                <Link href="/app/builder" className="btn-primary text-sm py-2">
                  New Build
                </Link>
              </div>

              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No Saved Builds</h3>
                <p className="empty-state-text">You don&apos;t have any saved builds yet. Start building your first PC.</p>
                <Link href="/app/builder" className="btn-primary">
                  Create Your First Build
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
