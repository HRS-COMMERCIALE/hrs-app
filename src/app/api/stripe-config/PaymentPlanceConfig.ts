// Payment Plans Configuration
// This file contains all available payment plans with their details
// Prices are stored here to prevent frontend manipulation

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  description?: string;
}

export const PAYMENT_PLANS: Record<string, PaymentPlan> = {
  'premium': {
    id: 'premium',
    name: 'Premium',
    price: 99.99,
    currency: 'USD',
    features: [
      '1 Company Account',
      '5 User Accounts',
      '1 Mobile Sales Rep (Free)',
      'Sales & Purchase Modules',
      'Finance & HR (Standard)',
      'Unlimited Products & Stock',
      'Customer & Supplier Management',
      'Customer-Specific Pricing',
    ],
    buttonText: 'Subscribe',
    description: 'Perfect for small to medium businesses'
  },
  'platinum': {
    id: 'platinum',
    name: 'Platinum',
    price: 190.99,
    currency: 'USD',
    features: [
      '1 Company Account',
      '5 User Accounts',
      '1 Mobile Sales Rep (Free)',
      'Sales & Purchase Modules',
      'Finance & HR (Standard)',
      'Leave & Expense Management',
      'CRM Mobile (Offline & Online)',
      'Meeting Planning & Reports',
      'Revenue Dashboard & Surveys',
      'Recovery & Call Management',
    ],
    buttonText: 'Subscribe',
    popular: true,
    description: 'Most popular choice for growing businesses'
  },
  'diamond': {
    id: 'diamond',
    name: 'Diamond',
    price: 270.00,
    currency: 'USD',
    features: [
      '3 Company Accounts',
      '15 User Accounts',
      '5 Mobile Sales Reps (Free)',
      'Sales Cycles & Project Management',
      'Advanced HR & Fleet Management',
      'Periodic Invoice Planning',
      'CRM Mobile (Offline & Online)',
      'Meeting Planning & Reports',
      'Revenue Dashboard & Surveys',
      'Recovery & Call Management',
    ],
    buttonText: 'Subscribe',
    description: 'Enterprise solution for large organizations'
  },
  'custom': {
    id: 'custom',
    name: 'Custom Plan',
    price: 0, // Custom pricing - will be handled separately
    currency: 'USD',
    features: [
      'All modules available',
      'Unlimited users',
      '24/7 dedicated support',
      'Training & custom integrations'
    ],
    buttonText: 'Contact Us',
    description: 'Solution adapted to your specific needs'
  }
};

// Helper function to get plan by ID
export function getPlanById(planId: string): PaymentPlan | null {
  return PAYMENT_PLANS[planId] || null;
}

// Helper function to validate plan ID
export function isValidPlanId(planId: string): boolean {
  return planId in PAYMENT_PLANS;
}

// Helper function to get all available plans
export function getAllPlans(): PaymentPlan[] {
  return Object.values(PAYMENT_PLANS);
}

// Helper function to get plans for frontend display (without sensitive pricing logic)
export function getPlansForDisplay(): Omit<PaymentPlan, 'price'>[] {
  return Object.values(PAYMENT_PLANS).map(plan => ({
    id: plan.id,
    name: plan.name,
    currency: plan.currency,
    features: plan.features,
    buttonText: plan.buttonText,
    popular: plan.popular,
    description: plan.description
  }));
}
