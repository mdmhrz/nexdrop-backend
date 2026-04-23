export interface RevenueSummary {
  totalRevenue: number;
  totalPayments: number;
  averageOrderValue: number;
  currency: string;
}

export interface RevenueByPaymentMethod {
  paymentMethod: string;
  totalRevenue: number;
  paymentCount: number;
  percentage: number;
}

export interface RevenueByDistrict {
  district: string;
  totalRevenue: number;
  parcelCount: number;
  averageOrderValue: number;
}

export interface RevenueOverTime {
  date: string;
  revenue: number;
  paymentCount: number;
}

export interface RevenueAnalyticsResponse {
  summary: RevenueSummary;
  byPaymentMethod: RevenueByPaymentMethod[];
  byDistrict: RevenueByDistrict[];
  overTime: RevenueOverTime[];
}
