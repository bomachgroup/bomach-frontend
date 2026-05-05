/**
 * API layer — returns hardcoded static data from data.ts.
 * Form submissions still POST to the backend API.
 */

import type {
  HomepageData,
  Service,
  ServiceDetail,
  SubService,
  Project,
  ProjectDetail,
  Blog,
  BlogDetail,
  Employee,
  AboutData,
  PaginatedProperties,
  Property,
  Job,
  JobDetail,
  Product,
  TokenResponse,
  FileUploadResponse,
} from "./types";

import {
  homepageData,
  services as staticServices,
  serviceDetails,
  subServices,
  employees,
  aboutData,
  products as staticProducts,
} from "./data";

// Server-side uses the full backend URL; client-side uses the Next.js API route proxy to avoid CORS
const isServer = typeof window === "undefined";
const API_URL = isServer
  ? (process.env.NEXT_PUBLIC_API_URL || "https://backend.bomachgroup.com/api")
  : "/api";

/**
 * Build a URL that works on both server and client.
 * On client, strips trailing slashes to avoid Next.js 308 redirect loops.
 */
function buildUrl(endpoint: string): string {
  let url = `${API_URL}${endpoint}`;
  if (!isServer) {
    // Remove trailing slash before query string or end of URL
    url = url.replace(/\/(\?|$)/, '$1');
  }
  return url;
}

/**
 * Extract a readable error message from various error response formats
 */
function extractErrorMessage(
  error: any,
  defaultMessage: string = "Request failed",
): string {
  if (!error) return defaultMessage;

  if (error.detail) {
    if (typeof error.detail === "string") {
      return error.detail;
    } else if (Array.isArray(error.detail)) {
      return error.detail
        .map((err: any) =>
          typeof err === "string"
            ? err
            : err.msg
              ? err.msg
              : err.detail
                ? err.detail
                : JSON.stringify(err),
        )
        .join("; ");
    } else if (typeof error.detail === "object") {
      return Object.entries(error.detail)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; ");
    }
  }

  if (error.error) {
    return typeof error.error === "string"
      ? error.error
      : JSON.stringify(error.error);
  }

  if (error.message) {
    return error.message;
  }

  return defaultMessage;
}

/**
 * Fix double-nested Cloudinary URLs caused by corrupted DB entries.
 */
export function sanitizeImageUrl(url: string | null | undefined): string {
  if (!url) return "/images/logo/bomach-logo-hd.png";
  const doubleIndex = url.indexOf("https://", 8);
  if (doubleIndex > 0) {
    return url.substring(doubleIndex);
  }
  return url;
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const method = options?.method?.toUpperCase() || "GET";
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };
  // Only set Content-Type for requests with a body
  if (method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const url = buildUrl(endpoint);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(extractErrorMessage(error));
  }

  return res.json();
}

// ── Homepage ──

export async function getHomepageData(): Promise<HomepageData> {
  // Fetch dynamic data from API; static data only for things without backend endpoints
  const [projects, blogs] = await Promise.all([
    getProjects(1, 100).catch(() => []),
    getBlogs(1, 100).catch(() => []),
  ]);

  return {
    ...homepageData,
    projects,
    blogs,
    project_count: projects.length || homepageData.project_count,
  };
}

// ── Services ──

export async function getServices(): Promise<Service[]> {
  return staticServices;
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetail> {
  const detail = serviceDetails[slug];
  if (!detail) throw new Error("Service not found");
  return detail;
}

export async function getSubServices(serviceId: number): Promise<SubService[]> {
  return subServices[serviceId] || [];
}

// ── Projects ──

export async function getProjects(page = 1, size = 100): Promise<Project[]> {
  try {
    const data = await fetchAPI<{
      items: Project[];
      total: number;
      page: number;
      size: number;
      pages: number;
      has_next: boolean;
      has_previous: boolean;
    }>(`/properties/projects/?page=${page}&size=${size}`);
    return data.items;
  } catch (err) {
    console.warn("getProjects error:", err);
    throw err;
  }
}

export async function getProjectById(id: number): Promise<Project> {
  try {
    const project = await fetchAPI<Project>(`/properties/projects/${id}/`);
    return project;
  } catch (err) {
    console.warn("getProjectById error", err);
    throw err;
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail> {
  const projects = await getProjects(1, 100);
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error("Project not found");

  return {
    ...project,
    content: project.content || "",
  };
}

// ── Blogs ──

export async function getBlogs(page = 1, size = 100): Promise<Blog[]> {
  try {
    const data = await fetchAPI<{
      items: Blog[];
      total: number;
      page: number;
      size: number;
      pages: number;
      has_next: boolean;
      has_previous: boolean;
    }>(`/properties/blogs/?page=${page}&size=${size}`);
    return data.items;
  } catch (err) {
    console.warn("getBlogs error:", err);
    throw err;
  }
}

export async function getBlogById(id: number): Promise<Blog> {
  try {
    const blog = await fetchAPI<Blog>(`/properties/blogs/${id}/`);
    return blog;
  } catch (err) {
    console.warn("getBlogById error", err);
    throw err;
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogDetail> {
  try {
    // Try to fetch by slug directly if backend supports it via filter
    const data = await fetchAPI<{ items: Blog[] }>(`/properties/blogs/?slug=${slug}`);
    if (data.items && data.items.length > 0) {
      const blog = data.items[0];
      return {
        ...blog,
        content: blog.content || blog.short_content || "",
      };
    }
  } catch (err) {
    console.warn("getBlogBySlug direct lookup failed, falling back to list:", err);
  }

  // Fallback to searching the list
  const blogs = await getBlogs(1, 100);
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) throw new Error("Blog not found");

  return {
    ...blog,
    content: blog.content || blog.short_content || "",
  };
}

// ── Project CRUD Operations ──

export async function createProject(
  projectData: {
    name: string;
    slug: string;
    image_url?: string;
    sub_service_name?: string;
    content?: string;
    priority: number;
    date: string;
    is_published: boolean;
  },
  accessToken: string,
): Promise<Project> {
  return fetchAPI("/properties/projects/", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(projectData),
  });
}

export async function updateProject(
  id: number,
  projectData: Partial<{
    name: string;
    slug: string;
    image_url?: string;
    sub_service_name?: string;
    content?: string;
    priority: number;
    date: string;
    is_published: boolean;
  }>,
  accessToken: string,
): Promise<Project> {
  return fetchAPI(`/properties/projects/${id}/`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(projectData),
  });
}

export async function deleteProject(
  id: number,
  accessToken: string,
): Promise<{ message: string }> {
  return fetchAPI(`/properties/projects/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// ── Blog CRUD Operations ──

export async function createBlog(
  blogData: {
    title: string;
    slug: string;
    author?: string;
    image_url?: string;
    short_content?: string;
    content?: string;
    priority: number;
    date: string;
    is_published: boolean;
  },
  accessToken: string,
): Promise<Blog> {
  return fetchAPI("/properties/blogs/", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(blogData),
  });
}

export async function updateBlog(
  id: number,
  blogData: Partial<{
    title: string;
    slug: string;
    author?: string;
    image_url?: string;
    short_content?: string;
    content?: string;
    priority: number;
    date: string;
    is_published: boolean;
  }>,
  accessToken: string,
): Promise<Blog> {
  return fetchAPI(`/properties/blogs/${id}/`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(blogData),
  });
}

export async function deleteBlog(
  id: number,
  accessToken: string,
): Promise<{ message: string }> {
  return fetchAPI(`/properties/blogs/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// ── Team ──

export async function getTeam(): Promise<Employee[]> {
  return employees;
}

// ── About ──

export async function getAboutData(): Promise<AboutData> {
  return aboutData;
}

// ── Authentication ──

export async function registerUser(
  email: string,
  password: string,
  passwordConfirm: string,
): Promise<TokenResponse> {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      password_confirm: passwordConfirm,
    }),
  });
}

export async function loginUser(
  email: string,
  password: string,
): Promise<TokenResponse> {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshToken(
  refresh_token: string,
): Promise<{ access_token: string; token_type: string; expires_in: number }> {
  return fetchAPI("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });
}

export async function logoutUser(
  accessToken: string,
  refresh_token: string,
): Promise<{ detail: string }> {
  return fetchAPI("/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ refresh_token }),
  });
}

// ── Properties (fetched from backend API) ──

export async function getProperties(
  query?: string,
  page?: number,
  options?: {
    category?: string;
    city?: string;
    state?: string;
    is_featured?: boolean;
    sort_by?: string;
  },
): Promise<PaginatedProperties> {
  try {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (page) params.set("page", String(page));
    if (options?.category) params.set("category", options.category);
    if (options?.city) params.set("city", options.city);
    if (options?.state) params.set("state", options.state);
    if (options?.is_featured !== undefined)
      params.set("is_featured", String(options.is_featured));
    if (options?.sort_by) params.set("sort_by", options.sort_by);
    const res = await fetch(buildUrl(`/properties/all/?${params.toString()}`));
    if (!res.ok) throw new Error("API unavailable");
    return res.json();
  } catch {
    return {
      items: [],
      total: 0,
      page: 1,
      size: 10,
      pages: 0,
      has_next: false,
      has_previous: false,
    };
  }
}

export async function getFeaturedProperties(
  limit?: number,
): Promise<Property[]> {
  try {
    const params = limit ? `?limit=${limit}` : "";
    const res = await fetch(buildUrl(`/properties/featured/${params}`));
    if (!res.ok) throw new Error("API unavailable");
    return res.json();
  } catch {
    return [];
  }
}

export async function getPropertyById(id: number | string): Promise<Property> {
  return fetchAPI(`/properties/${id}/`);
}

// Keep old name as alias for backward compat
export const getPropertyBySlug = getPropertyById;

export async function getPropertyCities(): Promise<string[]> {
  try {
    const res = await fetch(buildUrl(`/properties/cities/`));
    if (!res.ok) throw new Error("API unavailable");
    return res.json();
  } catch {
    return [];
  }
}

// ── Jobs ──

export async function getJobs(query?: string, page?: number): Promise<Job[]> {
  try {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (page) params.set("page", String(page));

    const res = await fetch(buildUrl(`/properties/jobs/?${params.toString()}`));
    if (!res.ok) throw new Error("Jobs API unavailable");

    const data = await res.json();
    if (!Array.isArray(data.items))
      throw new Error("Invalid job list response");

    return data.items.map((job: any) => ({
      id: job.id,
      title: job.title,
      slug: String(job.id),
      location: job.location || "",
      job_type: job.job_type || "",
      salary_range: job.salary_range || null,
      image_url: job.image_url || "",
      deadline: job.deadline || null,
      is_active: true,
      priority: 0,
      date: job.created_at || new Date().toISOString(),
      description: job.description || "",
      requirements: Array.isArray(job.requirements)
        ? job.requirements.join("\n")
        : "",
      responsibilities: Array.isArray(job.responsibilities)
        ? job.responsibilities.join("\n")
        : "",
      company: job.company || "",
    }));
  } catch (err) {
    console.warn("getJobs error", err);
    return [];
  }
}

export async function getJobBySlug(slug: string): Promise<JobDetail> {
  try {
    // Try by ID first, then by slug query
    const id = Number(slug);
    let res: Response;

    if (!Number.isNaN(id)) {
      res = await fetch(buildUrl(`/properties/jobs/${id}/`));
    } else {
      // Try slug-based lookup
      res = await fetch(buildUrl(`/properties/jobs/?slug=${slug}`));
      if (res.ok) {
        const data = await res.json();
        const results = data.results || data;
        const job = Array.isArray(results) ? results[0] : results;
        if (!job) throw new Error("Job not found");
        res = new Response(JSON.stringify(job), { status: 200 });
      }
    }

    if (!res.ok) throw new Error("Job details not available");

    const job = await res.json();

    const requirementsArr = Array.isArray(job.requirements)
      ? job.requirements
      : typeof job.requirements === "string"
        ? job.requirements
            .split("\n")
            .map((item: string) => item.trim())
            .filter(Boolean)
        : [];

    const responsibilitiesArr = Array.isArray(job.responsibilities)
      ? job.responsibilities
      : typeof job.responsibilities === "string"
        ? job.responsibilities
            .split("\n")
            .map((item: string) => item.trim())
            .filter(Boolean)
        : [];

    const makeListHtml = (items: string[]) =>
      `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

    return {
      id: job.id,
      title: job.title,
      slug: String(job.id),
      location: job.location || "",
      job_type: job.job_type || "",
      salary_range: job.salary_range || null,
      image_url: job.image_url || "",
      deadline: job.deadline || null,
      is_active: true,
      priority: 0,
      date: job.created_at || new Date().toISOString(),
      description: job.description || "",
      requirements: requirementsArr.length ? makeListHtml(requirementsArr) : "",
      responsibilities: responsibilitiesArr.length
        ? makeListHtml(responsibilitiesArr)
        : "",
      company: job.company || "",
      benefits: "",
    };
  } catch (err) {
    console.warn("getJobBySlug error", err);
    throw new Error("Job not found");
  }
}

export async function getJobById(id: number): Promise<Job> {
  try {
    const res = await fetch(buildUrl(`/properties/jobs/${id}/`));
    if (!res.ok) throw new Error("Job not found");

    const job = await res.json();
    return {
      id: job.id,
      title: job.title,
      slug: String(job.id),
      company: job.company || "",
      location: job.location || "",
      job_type: job.job_type || "full_time",
      experience_level: job.experience_level || "entry",
      salary_range: job.salary_range || null,
      image_url: job.image_url || "",
      deadline: job.deadline || null,
      is_active: job.is_active ?? true,
      is_remote: job.is_remote || false,
      priority: 0,
      date: job.created_at || new Date().toISOString(),
      description: job.description || "",
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      responsibilities: Array.isArray(job.responsibilities)
        ? job.responsibilities
        : [],
      benefits: "",
      created_at: job.created_at,
    };
  } catch (err) {
    console.warn("getJobById error", err);
    throw err;
  }
}

export async function createJob(
  data: {
    title: string;
    company: string;
    description: string;
    location: string;
    is_remote?: boolean;
    job_type?: string;
    experience_level?: string;
    salary_range?: string | null;
    requirements?: string[];
    responsibilities?: string[];
  },
  accessToken: string,
): Promise<any> {
  if (!accessToken) throw new Error("Authentication token required");

  const res = await fetch(buildUrl(`/properties/jobs/`), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || "Unable to create job");
  }

  return res.json();
}

export async function updateJob(
  jobId: number,
  data: {
    title?: string;
    company?: string;
    description?: string;
    location?: string;
    is_remote?: boolean;
    job_type?: string;
    experience_level?: string;
    salary_range?: string | null;
    requirements?: string[];
    responsibilities?: string[];
  },
  accessToken: string,
): Promise<any> {
  if (!accessToken) throw new Error("Authentication token required");

  const res = await fetch(buildUrl(`/properties/jobs/${jobId}/`), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || "Unable to update job");
  }

  return res.json();
}

export async function deleteJob(
  jobId: number,
  accessToken: string,
): Promise<{ detail: string }> {
  if (!accessToken) throw new Error("Authentication token required");

  const res = await fetch(buildUrl(`/properties/jobs/${jobId}/`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || "Unable to delete job");
  }

  return res.json();
}

// ── Form submissions (still POST to backend) ──

export async function submitQuote(
  data: Record<string, unknown>,
): Promise<{ message: string }> {
  return fetchAPI("/properties/quote/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitContact(
  data: Record<string, unknown>,
): Promise<{ message: string }> {
  return fetchAPI("/properties/contact/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitBooking(
  data: Record<string, unknown>,
): Promise<{ message: string }> {
  return fetchAPI("/properties/booking/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function subscribeEmail(
  email: string,
): Promise<{ message: string }> {
  return fetchAPI("/properties/newsletter/subscribe/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function getNewsletterEmails(
  accessToken: string,
): Promise<string[]> {
  return fetchAPI("/properties/newsletter/subscribers/emails/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function submitJobApplication(
  formData: FormData,
): Promise<{ message: string }> {
  const res = await fetch(buildUrl(`/properties/job-application/`), {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || error.error || JSON.stringify(error));
  }

  return res.json();
}

// ── Products ──

export async function getProducts(): Promise<Product[]> {
  return staticProducts;
}

export async function getProductBySlug(
  slug: string,
): Promise<Product & { images: string[] }> {
  const product = staticProducts.find((p) => p.slug === slug);
  if (!product) throw new Error("Product not found");
  return { ...product, images: [product.image_url] };
}

// ── Property Creation ──

export async function getPropertyCategories(): Promise<string[]> {
  try {
    const res = await fetch(buildUrl(`/properties/categories/`));
    if (!res.ok) throw new Error("API unavailable");
    return res.json();
  } catch {
    return [];
  }
}

export async function uploadFile(
  file: File,
  accessToken: string,
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(buildUrl(`/properties/upload-file`), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(extractErrorMessage(error, "Upload failed"));
  }
  return res.json();
}

export async function uploadFilesAsync(
  files: File[],
  accessToken: string,
): Promise<FileUploadResponse[]> {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  const res = await fetch(buildUrl(`/properties/upload-files-async`), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(extractErrorMessage(error, "Upload failed"));
  }
  return res.json();
}

export async function submitProperty(
  data: {
    name: string;
    description?: string | null;
    category: string;
    sub_category: string;
    property_images?: string[];
    property_videos?: string[];
    landmarks?: string[];
    address: string;
    city: string;
    state: string;
    latitude?: number | null;
    longitude?: number | null;
    is_featured?: boolean;
  },
  accessToken: string,
): Promise<Property> {
  return fetchAPI("/properties/", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(data),
  });
}

export async function updateProperty(
  propertyId: number,
  data: Record<string, unknown>,
  accessToken: string,
): Promise<Property> {
  return fetchAPI(`/properties/${propertyId}/`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(data),
  });
}

export async function deleteProperty(
  propertyId: number,
  accessToken: string,
): Promise<{ detail: string }> {
  return fetchAPI(`/properties/${propertyId}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// ── Submissions (Quotes, Contacts, Bookings) ──

export interface QuoteRequest {
  id: number;
  name: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  sub_service: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  location: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface BookingRequest {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  property_name: string | null;
  is_read: boolean;
  is_confirmed: boolean;
  created_at: string;
}

export async function getQuoteRequests(
  accessToken: string,
): Promise<QuoteRequest[]> {
  if (!accessToken) throw new Error("Authentication token required");
  return fetchAPI("/properties/quote/", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function deleteQuoteRequest(
  quoteId: number,
  accessToken: string,
): Promise<{ message: string }> {
  if (!accessToken) throw new Error("Authentication token required");
  return fetchAPI(`/properties/quote/${quoteId}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function markQuoteAsRead(
  quoteId: number,
  accessToken: string,
): Promise<{ message: string }> {
  if (!accessToken) throw new Error("Authentication token required");
  return fetchAPI(`/properties/quote/${quoteId}/read/`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function getContactMessages(
  accessToken: string,
): Promise<ContactMessage[]> {
  if (!accessToken) throw new Error("Authentication token required");
  return fetchAPI("/properties/contact/messages/", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function deleteContactMessage(
  messageId: number,
  accessToken: string,
): Promise<{ message: string }> {
  if (!accessToken) throw new Error("Authentication token required");
  return fetchAPI(`/properties/contact/${messageId}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function markContactAsRead(
  messageId: number,
  accessToken: string,
): Promise<{ message: string }> {
  if (!accessToken) throw new Error("Authentication token required");
  return fetchAPI(`/properties/contact/${messageId}/read/`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function getBookingRequests(
  accessToken: string,
): Promise<BookingRequest[]> {
  if (!accessToken) throw new Error("Authentication token required");
  return fetchAPI("/properties/booking/requests/", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function deleteBookingRequest(
  bookingId: number,
  accessToken: string,
): Promise<{ message: string }> {
  if (!accessToken) throw new Error("Authentication token required");
  return fetchAPI(`/properties/booking/${bookingId}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function markBookingAsRead(
  bookingId: number,
  accessToken: string,
): Promise<{ message: string }> {
  if (!accessToken) throw new Error("Authentication token required");
  return fetchAPI(`/properties/booking/${bookingId}/read/`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function confirmBookingRequest(
  bookingId: number,
  accessToken: string,
): Promise<{ message: string }> {
  if (!accessToken) throw new Error("Authentication token required");
  return fetchAPI(`/properties/booking/${bookingId}/confirm/`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}


