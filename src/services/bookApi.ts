import type { ApiError, Book, BookSearchParams, CreateBookRequest, PaginatedResponse, UpdateBookRequest } from '@/types/book'
import { ApiValidationError } from '@/types/book'

class BookApiService {
  private readonly baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5120/api'
  async getBooks (params: BookSearchParams = {}): Promise<PaginatedResponse<Book>> {
    const searchParams = new URLSearchParams()

    if (params.searchTerm) {
      searchParams.append('searchTerm', params.searchTerm)
    }
    if (params.sortBy) {
      searchParams.append('sortBy', params.sortBy)
    }
    if (params.page) {
      searchParams.append('page', params.page.toString())
    }
    if (params.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString())
    }

    const url = `${this.baseUrl}/books${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const response = await fetch(url)
    return this.handleResponse<PaginatedResponse<Book>>(response)
  }

  async getBook (id: number): Promise<Book> {
    const response = await fetch(`${this.baseUrl}/books/${id}`)
    return this.handleResponse<Book>(response)
  }

  async createBook (book: CreateBookRequest): Promise<Book> {
    const response = await fetch(`${this.baseUrl}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    })
    return this.handleResponse<Book>(response)
  }

  async updateBook (id: number, book: UpdateBookRequest): Promise<Book> {
    const response = await fetch(`${this.baseUrl}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    })
    return this.handleResponse<Book>(response)
  }

  async deleteBook (id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/books/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json()
      throw new ApiValidationError(errorData)
    }
  }

  async checkBookExists (isbn: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/books/exists/${isbn}`)
    return this.handleResponse<boolean>(response)
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      console.log('Error response status:', response.status)
      console.log('Error response headers:', response.headers.get('content-type'))
      console.log('Error response URL:', response.url)

      const responseText = await response.text()
      console.log('Error response body:', responseText)

      // Try to parse as JSON, fallback to text
      let errorData: ApiError
      try {
        errorData = JSON.parse(responseText)
      } catch {
        errorData = {
          title: 'Server Error',
          status: response.status,
          detail: responseText,
          instance: response.url,
          timestamp: new Date().toISOString(),
        }
      }
      throw new ApiValidationError(errorData)
    }
    return response.json()
  }
}

export const bookApi = new BookApiService()
