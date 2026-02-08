
export interface HouseQuery {
  city: string;
  locality: string;
  bhk: string;
  area: string;
  propertyType: 'Apartment' | 'Villa' | 'Plot' | 'Independent House';
  condition: 'New' | 'Resale' | 'Under Construction';
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface NearbyLocality {
  name: string;
  price: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface PredictionResult {
  report: string;
  estimatedPrice?: string;
  confidenceScore?: number;
  groundingSources: GroundingSource[];
  nearbyLocalities: NearbyLocality[];
  chartData: ChartDataPoint[];
}

export interface CityTrend {
  city: string;
  report: string;
  groundingSources: GroundingSource[];
}

export interface CityGuide {
  cityName: string;
  report: string;
  groundingSources: GroundingSource[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinedDate: string;
  avatarColor: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
