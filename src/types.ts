export interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  category: 'adventure' | 'cozy' | 'milestone' | 'everyday';
  iconName: string;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  code: string;
  isRedeemed: boolean;
  redeemedAt?: string;
  emoji: string;
}

export interface ReasonToLove {
  id: string;
  title: string;
  text: string;
  details: string;
  emoji: string;
}
