import { apiClient } from './client';
import type { BlogPost } from '@/types/blog';

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const response = await apiClient.get<BlogPost[]>('/blogs');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function getBlogDetail(blogUrl: string): Promise<BlogPost | null> {
  try {
    const response = await apiClient.get<BlogPost>(`/blogs/${blogUrl}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    return null;
  }
}
