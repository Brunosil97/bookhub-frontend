export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  rating: number
  comments: string
  hasNotes: boolean
  coverImageUrl: string
  createdAt: string
  updatedAt: string
}

export interface CreateBookRequest {
  title: string
  author: string
  isbn: string
  rating: number
  comments: string
  coverImageUrl?: string
}

export interface UpdateBookRequest {
  rating: number
  comments: string
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface BookSearchParams {
  searchTerm?: string
  sortBy?: 'title' | 'author' | 'rating' | 'createdat'
  page?: number
  pageSize?: number
}

export interface ApiError {
  title: string
  status: number
  detail: string
  instance: string
  timestamp: string
  errors?: Record<string, string[]>
}

export class ApiValidationError extends Error {
  constructor (
    public apiError: ApiError,
    message?: string,
  ) {
    super(message || apiError.detail || apiError.title)
    this.name = 'ApiValidationError'
  }
}
