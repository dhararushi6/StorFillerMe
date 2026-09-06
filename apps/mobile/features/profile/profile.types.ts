export interface BuyerProfile {
  id: string;
  name: string;
  phone: string;
  walletBalance: number;
}

export interface ProfileMenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: number;
  route?: string;
}

export interface ProfileQuickAction {
  id: string;
  title: string;
  value?: string;
  icon: number;
  route?: string;
}
