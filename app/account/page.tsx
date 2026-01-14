'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../components/ui/button';

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
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
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
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="card p-6 mb-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-surface-3/50 flex items-center justify-center mb-4 overflow-hidden">
                {profile.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt={profile.full_name || 'User'} 
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-text-muted">
                    {profile.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold">{profile.full_name || 'User'}</h2>
              <p className="text-sm text-text-muted">{profile.email}</p>
            </div>
            
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-surface-3/50 text-accent' 
                    : 'text-text-muted hover:bg-surface-2/50'
                }`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'security' 
                    ? 'bg-surface-3/50 text-accent' 
                    : 'text-text-muted hover:bg-surface-2/50'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'saved' 
                    ? 'bg-surface-3/50 text-accent' 
                    : 'text-text-muted hover:bg-surface-2/50'
                }`}
              >
                Saved Builds
              </button>
            </div>
          </div>
          
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="w-full"
          >
            Sign Out
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    defaultValue={profile.full_name || ''}
                    className="w-full px-4 py-2 bg-surface-1/50 border border-border/20 rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-accent/50 outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full px-4 py-2 bg-surface-2/30 text-text-muted rounded-lg border border-border/20 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-text-muted">
                    Contact support to change your email address
                  </p>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="default">
                    Update Profile
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">Security</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Password</h3>
                  <p className="text-sm text-text-muted mb-4">
                    Change your password to keep your account secure.
                  </p>
                  <Button variant="outline">
                    Change Password
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/10">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-text-muted mb-4">
                    Add an extra layer of security to your account.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {false ? 'Enabled' : 'Disabled'}
                    </span>
                    <Button variant={false ? 'outline' : 'default'}>
                      {false ? 'Disable' : 'Enable'} 2FA
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Saved Builds</h2>
                <Link href="/app/builder">
                  <Button variant="outline">
                    New Build
                  </Button>
                </Link>
              </div>
              
              <div className="text-center py-12">
                <div className="text-text-muted mb-4">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-text-muted mb-4">
                  You don&apos;t have any saved builds yet.
                </p>
                <Link href="/app/builder">
                  <Button variant="default">
                    Create Your First Build
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
