// ── Shared types matching Django serializers ──

export interface Service {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  rating: number;
  priority: number;
  date: string;
}

export interface ServiceDetail extends Service {
  content: string;
  sub_services: SubService[];
}

export interface SubService {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  content: string;
  rating: number;
  priority: number;
  date: string;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  sub_service_name: string | null;
  priority: number;
  date: string;
}

export interface ProjectDetail extends Project {
  content: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  video_url: string;
  content: string;
  service: number | null;
  service_name: string | null;
  priority: number;
  date: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  author: string;
  image_url: string;
  short_content: string;
  priority: number;
  date: string;
}

export interface BlogDetail {
  id: number;
  title: string;
  slug: string;
  author: string;
  image_url: string;
  content: string;
  priority: number;
  date: string;
}

export interface HomeSlider {
  id: number;
  big_text: string;
  small_text: string;
  image_url: string;
  priority: number;
}

export interface CustomerReview {
  id: number;
  name: string;
  review: string;
  occupation: string;
  priority: number;
  date: string;
}

export interface Employee {
  id: number;
  name: string;
  job_title: string;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  image_url: string;
  priority: number;
}

export interface Partner {
  id: number;
  company: string;
  image_url: string;
  priority: number;
}

export interface PropertyUser {
  id: number;
  username: string;
  email: string;
}

export interface Property {
  id: number;
  name: string;
  description: string | null;
  category: string;
  sub_category: string;
  property_images: string[];
  property_videos: string[];
  landmarks: string[];
  address: string;
  city: string;
  state: string;
  latitude: string | null;
  longitude: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  created_by: PropertyUser;
}

// Keep aliases for backward compatibility in pages
export type PropertyListItem = Property;
export type PropertyDetail = Property;

export interface Job {
  id: number;
  title: string;
  slug: string;
  location: string;
  job_type: string;
  experience_level?: string;
  salary_range: string | null;
  image_url: string;
  deadline: string | null;
  is_active: boolean;
  is_remote?: boolean;
  priority: number;
  date: string;
  description?: string;
  requirements?: string[] | string;
  responsibilities?: string[] | string;
  company?: string;
  benefits?: string;
  created_at?: string;
}

export interface JobDetail extends Job {
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
}

export interface HomepageData {
  sliders: HomeSlider[];
  services: Service[];
  products_by_service: {
    service: Service;
    products: Product[];
  }[];
  projects: Project[];
  blogs: Blog[];
  reviews: CustomerReview[];
  partners: Partner[];
  employees_count: number;
  project_count: number;
  happy_customer_count: number;
}

export interface PaginatedProperties {
  items: Property[];
  total: number;
  page: number;
  size: number;
  pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface FileUploadResponse {
  url: string;
  filename: string | null;
}

export interface AboutData {
  employees: Employee[];
  partners: Partner[];
  employees_count: number;
  project_count: number;
  happy_customer_count: number;
}

export interface AvailabilityResponse {
  available: boolean;
  message: string;
}
