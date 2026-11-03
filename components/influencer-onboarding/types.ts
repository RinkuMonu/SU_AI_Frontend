export interface SocialAccountItem {
  platform: 'instagram' | 'facebook' | 'linkedin';
  handle: string;
  url: string;
  connected: boolean;
  isVerified: boolean;
  followerCount?: number;
}

export interface CreatorOnboardingData {
  // Step 1: Welcome (no state needed)
  step: number; // 1 to 7

  // Step 2: Creator Profile
  fullName: string;
  username: string;
  profileImage: string;
  bio: string;
  location: string;
  gender: string;

  // Step 3: Niche
  niches: string[];
  customNiche?: string;

  // Step 4: Social Accounts (Available: Instagram, Facebook, LinkedIn)
  socialAccounts: SocialAccountItem[];

  // Step 5: Goals
  goals: string[];

  // Status
  isCompleted: boolean;
  completedAt?: string;
}

export const INITIAL_ONBOARDING_DATA: CreatorOnboardingData = {
  step: 1,
  fullName: '',
  username: '',
  profileImage: '',
  bio: '',
  location: 'Jaipur, India',
  gender: 'Female',
  niches: ['Fashion & Style'],
  socialAccounts: [
    { platform: 'instagram', handle: '', url: '', connected: false, isVerified: false },
    { platform: 'facebook', handle: '', url: '', connected: false, isVerified: false },
    { platform: 'linkedin', handle: '', url: '', connected: false, isVerified: false },
  ],
  goals: ['Get Brand Collaborations'],
  isCompleted: false,
};
