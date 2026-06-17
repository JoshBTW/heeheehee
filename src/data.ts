import { Memory, LoveCoupon, ReasonToLove } from './types';

export const REASONS_TO_LOVE: ReasonToLove[] = [
  {
    id: 'key',
    title: 'The Key to My Vault',
    text: 'You have shown me a side of myself that I thought was locked away forever. You hold the master key.',
    details: 'Before you came, my heart was a secure vault, closed and quiet. You stepped in with your grace, warmth, and laughter, opening it effortlessly. Now, my love for you flows evermore, unstoppable.',
    emoji: '🔑'
  },
  {
    id: 'future',
    title: 'My Yesterday, Today & Tomorrow',
    text: 'I love you not only in this present second, but in every single lifetime we have lived and will live.',
    details: 'You are in every breath I take, every movement I make, and every word I speak. To love you is natural, infinite, and transcends time itself. Yesterday was beautiful because of you, today is a dream, and tomorrow is a promise.',
    emoji: '⌛'
  },
  {
    id: 'dream',
    title: 'My Living Dream',
    text: 'Younger me could have never expected a literal dream like you to step into my ordinary life.',
    details: 'If someone told my younger self that a girl as kind, beautiful, and absolutely magical as Megan would love him, he would have laughed in disbelief. You are my dream come true, Le Xuan.',
    emoji: '✨'
  },
  {
    id: 'smile',
    title: 'Your Radiant Smile',
    text: 'The absolute prettiest sight in this world is when you smile, especially when I am the reason.',
    details: 'Your smile carries a warm magic that immediately melts away all my worries. It represents warmth, home, and absolute happiness. I say "I love you" so much just to see you smile or blush.',
    emoji: '🌸'
  }
];

export const LOVE_COUPONS: LoveCoupon[] = [
  {
    id: 'coupon-1',
    title: 'Infinite Cuddles',
    description: 'Redeem this for warm, tight hugs and endless snuggles from Joshua, lasting for as long as you desire.',
    code: 'MEG-INF-CUDDLES',
    isRedeemed: false,
    emoji: '🧸'
  },
  {
    id: 'coupon-2',
    title: 'Infinite Kisses',
    description: 'Good for unlimited sweet pecks, forehead kisses, and warm embraces anytime, anywhere.',
    code: 'MEG-INF-KISSES',
    isRedeemed: false,
    emoji: '💋'
  },
  {
    id: 'coupon-3',
    title: 'Late Night Talks',
    description: 'Brew some warm tea or hot cocoa, cuddle under a blanket, and spill our thoughts into the quiet late night together.',
    code: 'MEG-LATE-TALKS',
    isRedeemed: false,
    emoji: '🌙'
  }
];

export const MEMORIES_TIMELINE: Memory[] = [
  {
    id: 'mem-1',
    title: 'Our First Sparks',
    date: 'The Beginning',
    description: 'That initial realization that you were someone incredibly special. The way my heart fluttered just seeing your name.',
    category: 'milestone',
    iconName: 'Sparkles'
  },
  {
    id: 'mem-2',
    title: 'Late Night Chats',
    date: 'Infinite Conversations',
    description: 'Those hours spent on the phone or texting, when holidays gave me all the free time in the world, and I just wanted to spend every second talking with you.',
    category: 'cozy',
    iconName: 'MessageCircleHeart'
  },
  {
    id: 'mem-3',
    title: 'Unlocking the Vault',
    date: 'Finding the Key',
    description: 'The sweet moment when I realized you held the key to my heart. No more guards, no more walls—just pure, overflowing affection.',
    category: 'everyday',
    iconName: 'HeartHandshake'
  }
];
