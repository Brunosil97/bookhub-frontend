import { mount, type MountingOptions } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { vi } from 'vitest'

export const createTestPinia = () => createPinia()

export function mountComponent<T> (component: T, options: MountingOptions<any> = {}) {
  const pinia = createTestPinia()

  return mount(component as any, {
    global: {
      plugins: [pinia],
      ...options.global,
    },
    ...options,
  })
}

export function mockFetch (mockResponse: any, ok = true, status = 200) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(mockResponse),
    text: () => Promise.resolve(JSON.stringify(mockResponse)),
  })
}

export const mockBook = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  isbn: '1234567890',
  coverImageUrl: 'https://example.com/cover.jpg',
  rating: 4,
  comments: 'Great book!',
  hasNotes: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

export const mockPaginatedResponse = {
  items: [mockBook],
  totalCount: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
}
