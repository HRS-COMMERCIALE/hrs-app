export type SubscriptionPayload = {
  selectedPlanId: string;
  selectedPlanName: string;
  selectedPlanPrice: string;
};

export type BusinessPayload = {
  businessName: string;
  taxId: string;
  industry: string;
  currency: string;
  size: string;
  website?: string;
  cnssCode: string;
  documentHeaderColor?: string;
  tableHeaderBackgroundColor?: string;
  tableHeaderTitleColor?: string;
  referralCode?: string;
  logoFile?: unknown;
};

export type AddressPayload = {
  country: string;
  governorate: string;
  postalCode: string;
  address: string;
  phone: string;
  fax?: string;
};

export type UserPayload = {
  status?: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  landline?: string;
  password: string;
};

export type OrderPayload = {
  planId: string;
  seats: number;
  billingCycle: "monthly" | "yearly";
  coupon?: string;
};

export type RegisterPayload = {
  subscription: SubscriptionPayload;
  business: BusinessPayload;
  address: AddressPayload;
  user: UserPayload;
  order: OrderPayload;
};


