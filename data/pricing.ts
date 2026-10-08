export const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses just getting started.',
    price: '$29',
    period: 'per month',
    features: [
      'Up to 5 social profiles',
      'Basic AI content generation',
      'Standard analytics',
      'Community support'
    ],
    popular: false
  },
  {
    name: 'Pro',
    description: 'Ideal for growing teams and agencies.',
    price: '$79',
    period: 'per month',
    features: [
      'Up to 15 social profiles',
      'Advanced AI generation',
      'Predictive analytics',
      'Priority email support',
      'Custom workflows'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with complex needs.',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited profiles',
      'Custom AI model training',
      'Dedicated account manager',
      '24/7 phone support',
      'API access',
      'White-labeling'
    ],
    popular: false
  }
];
