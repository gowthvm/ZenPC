'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import {
  User, Lock, Bookmark, LogOut, Settings, Shield, Bell,
  Mail, Calendar, Award, Zap, TrendingUp, CheckCircle2
} from 'lucide-react';
import {
  PremiumCard, PremiumButton, GradientText, AnimatedBadge, StatCard,
  TimelineItem
} from '@/components/ui/AdvancedComponents';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'builds' | 'achievements'>('profile');

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
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'builds', label: 'My Builds', icon: Bookmark },
    { id: 'achievements', label: 'Achievements', icon: Award },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-accent/30 border-t-accent" />
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-4">
        <motion.div
          className="card-gradient p-12 text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Zap size={48} className="mx-auto mb-4 text-accent" />
          <h2 className="text-2xl font-bold text-text-primary mb-3">Not Signed In</h2>
          <p className="text-text-muted mb-8">
            Please sign in to view your account details and access your builds.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login">
              <PremiumButton variant="primary" fullWidth>
                Sign In
              </PremiumButton>
            </Link>
            <Link href="/register">
              <PremiumButton variant="secondary" fullWidth>
                Create Account
              </PremiumButton>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <PremiumCard variant="accent" className="overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-accent/20 to-accent-secondary/20" />
            <div className="px-8 pb-8 relative">
              <div className="flex flex-col md:flex-row md:items-end gap-6 md:-mt-16">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary border-4 border-bg flex items-center justify-center overflow-hidden">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name || 'User'}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-white">
                        {profile.email?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                    {profile.full_name || 'Welcome'}
                  </h1>
                  <p className="text-text-muted flex items-center gap-2 mb-4">
                    <Mail size={16} />
                    {profile.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <AnimatedBadge variant="success">
                      <CheckCircle2 size={14} />
                      Active Member
                    </AnimatedBadge>
                    <AnimatedBadge variant="neon">
                      <TrendingUp size={14} />
                      Building for PC mastery
                    </AnimatedBadge>
                  </div>
                </div>
                <motion.button
                  onClick={handleSignOut}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-1/40 hover:bg-surface-1/60 text-text-muted hover:text-text-primary transition-all border border-border/10"
                >
                  <LogOut size={18} />
                  Sign Out
                </motion.button>
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8 p-2 bg-surface-1/30 rounded-2xl border border-border/10 backdrop-blur-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${activeTab === tab.id
                    ? 'bg-accent/20 text-accent border border-accent/40'
                    : 'text-text-muted hover:text-text-primary border border-transparent'
                  }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid md:grid-cols-2 gap-6">
              <PremiumCard variant="gradient" className="p-8">
                <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
                  Profile Settings
                </h2>
                <form className="space-y-6">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      defaultValue={profile.full_name || ''}
                      placeholder="Enter your full name"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={profile.email}
                      className="form-input opacity-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-text-muted mt-2">
                      Contact support to change your email
                    </p>
                  </div>
                  <PremiumButton variant="primary" fullWidth>
                    Update Profile
                  </PremiumButton>
                </form>
              </PremiumCard>

              <div className="space-y-6">
                <PremiumCard variant="neon" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-neon-cyan" />
                    <div>
                      <div className="text-xs text-text-muted">Member Since</div>
                      <div className="text-lg font-semibold text-text-primary">
                        {new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </PremiumCard>

                <StatCard
                  value="24"
                  label="Builds Created"
                  icon={<Bookmark size={24} />}
                  change={{ value: 12, isPositive: true }}
                />

                <StatCard
                  value="3.2K"
                  label="Community Likes"
                  icon={<TrendingUp size={24} />}
                  change={{ value: 8, isPositive: true }}
                />
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="grid md:grid-cols-2 gap-6">
              <PremiumCard variant="gradient" className="p-8">
                <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
                  <Shield className="inline mr-3 text-accent" size={28} />
                  Security Settings
                </h2>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-surface-1/40 border border-border/10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-text-primary">Password</h3>
                        <p className="text-sm text-text-muted">Last changed 30 days ago</p>
                      </div>
                      <CheckCircle2 size={20} className="text-green-400" />
                    </div>
                    <PremiumButton variant="secondary" size="sm" fullWidth>
                      Change Password
                    </PremiumButton>
                  </div>

                  <div className="p-4 rounded-lg bg-surface-1/40 border border-border/10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-text-primary">Two-Factor Authentication</h3>
                        <p className="text-sm text-text-muted">Extra layer of security</p>
                      </div>
                    </div>
                    <PremiumButton variant="primary" size="sm" fullWidth>
                      Enable 2FA
                    </PremiumButton>
                  </div>

                  <div className="p-4 rounded-lg bg-surface-1/40 border border-border/10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-text-primary">Active Sessions</h3>
                        <p className="text-sm text-text-muted">1 active session</p>
                      </div>
                    </div>
                    <PremiumButton variant="ghost" size="sm" fullWidth>
                      Manage Sessions
                    </PremiumButton>
                  </div>
                </div>
              </PremiumCard>

              <div className="space-y-6">
                <PremiumCard variant="accent" className="p-6">
                  <Lock className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold text-text-primary mb-2">Security Score</h3>
                  <div className="text-3xl font-bold text-accent mb-4">85/100</div>
                  <div className="w-full h-2 bg-surface-1/40 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-accent to-accent-secondary" />
                  </div>
                  <p className="text-xs text-text-muted mt-3">
                    Excellent security! Enable 2FA to improve further.
                  </p>
                </PremiumCard>

                <PremiumCard variant="neon" className="p-6">
                  <Bell className="w-8 h-8 text-neon-cyan mb-3" />
                  <h3 className="font-semibold text-text-primary mb-4">Notifications</h3>
                  <label className="flex items-center gap-3 mb-3">
                    <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                    <span className="text-sm text-text-primary">Security alerts</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                    <span className="text-sm text-text-primary">Product updates</span>
                  </label>
                </PremiumCard>
              </div>
            </div>
          )}

          {/* My Builds Tab */}
          {activeTab === 'builds' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <PremiumCard variant="gradient" className="p-12 text-center">
                <Bookmark size={48} className="mx-auto mb-4 text-accent/50" />
                <h3 className="font-display text-2xl font-bold text-text-primary mb-3">
                  Your PC Builds
                </h3>
                <p className="text-text-muted max-w-md mx-auto mb-8">
                  You haven&apos;t created any builds yet. Start building your first dream PC today!
                </p>
                <Link href="/builder">
                  <PremiumButton
                    variant="primary"
                    onClick={() => { }}
                  >
                    Create Your First Build
                  </PremiumButton>
                </Link>
              </PremiumCard>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Your Achievements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '🏆', title: 'First Build', desc: 'Created your first PC' },
                  { icon: '⭐', title: 'Popular Builder', desc: '100+ likes received' },
                  { icon: '🔧', title: 'Master Builder', desc: '50 builds created' },
                  { icon: '🎯', title: 'Budget Expert', desc: '$500 or less build' },
                ].map((achievement, i) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <PremiumCard variant="accent" className="p-6 text-center h-full">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h3 className="font-semibold text-text-primary text-sm mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-text-muted">{achievement.desc}</p>
                    </PremiumCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
