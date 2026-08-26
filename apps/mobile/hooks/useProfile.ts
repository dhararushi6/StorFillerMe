import { useQuery } from '@tanstack/react-query';

import type { BuyerProfile } from '@/features/profile/profile.types';

const MOCK_PROFILE: BuyerProfile = {
  id: 'profile-preview',
  name: 'Jagadeesh',
  phone: '9515185113',
  walletBalance: 500,
};

async function getProfile(): Promise<BuyerProfile> {
  return MOCK_PROFILE;
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getProfile,
  });
}
