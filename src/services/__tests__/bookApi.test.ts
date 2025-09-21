import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockBook, mockFetch, mockPaginatedResponse } from '@/test-utils'
import { ApiValidationError } from '@/types/book'
import { bookApi } from '../bookApi'

describe('BookApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getBooks', () => {
    it('should fetch books with default parameters', async () => {
      mockFetch(mockPaginatedResponse)

      const result = await bookApi.getBooks()

      expect(fetch).toHaveBeenCalledWith('http://localhost:5120/api/books')
      expect(result).toEqual(mockPaginatedResponse)
    })

    it('should fetch books with search parameters', async () => {
      mockFetch(mockPaginatedResponse)

      await bookApi.getBooks({
        searchTerm: 'test',
        sortBy: 'title',
        page: 2,
        pageSize: 20,
      })

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5120/api/books?searchTerm=test&sortBy=title&page=2&pageSize=20',
      )
    })
  })

  describe('getBook', () => {
    it('should fetch a single book by id', async () => {
      mockFetch(mockBook)

      const result = await bookApi.getBook(1)

      expect(fetch).toHaveBeenCalledWith('http://localhost:5120/api/books/1')
      expect(result).toEqual(mockBook)
    })
  })

  describe('createBook', () => {
    it('should create a new book', async () => {
      const newBook = {
        title: 'New Book',
        author: 'New Author',
        isbn: '9876543210',
        coverImageUrl: 'https://example.com/new-cover.jpg',
        rating: 5,
        comments: 'Excellent!',
      }
      mockFetch(mockBook)

      const result = await bookApi.createBook(newBook)

      expect(fetch).toHaveBeenCalledWith('http://localhost:5120/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      })
      expect(result).toEqual(mockBook)
    })
  })

  describe('updateBook', () => {
    it('should update an existing book', async () => {
      const updateData = {
        rating: 3,
        comments: 'Updated comment',
      }
      mockFetch(mockBook)

      const result = await bookApi.updateBook(1, updateData)

      expect(fetch).toHaveBeenCalledWith('http://localhost:5120/api/books/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      expect(result).toEqual(mockBook)
    })
  })

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
      })

      await bookApi.deleteBook(1)

      expect(fetch).toHaveBeenCalledWith('http://localhost:5120/api/books/1', {
        method: 'DELETE',
      })
    })

    it('should throw ApiValidationError on delete failure', async () => {
      const errorResponse = {
        title: 'Not Found',
        status: 404,
        detail: 'Book not found',
        instance: '/api/books/1',
        timestamp: '2023-01-01T00:00:00Z',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse),
      })

      await expect(bookApi.deleteBook(1)).rejects.toThrow(ApiValidationError)
    })
  })

  describe('checkBookExists', () => {
    it('should check if book exists by ISBN', async () => {
      mockFetch(true)

      const result = await bookApi.checkBookExists('1234567890')

      expect(fetch).toHaveBeenCalledWith('http://localhost:5120/api/books/exists/1234567890')
      expect(result).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should throw ApiValidationError with JSON error response', async () => {
      const errorResponse = {
        title: 'Validation Error',
        status: 400,
        detail: 'Invalid input',
        instance: '/api/books',
        timestamp: '2023-01-01T00:00:00Z',
        errors: {
          title: ['Title is required'],
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        url: 'http://localhost:5120/api/books',
        headers: {
          get: () => 'application/json',
        },
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
      })

      await expect(bookApi.getBooks()).rejects.toThrow(ApiValidationError)
    })

    it('should handle non-JSON error responses', async () => {
      const errorText = 'Internal Server Error'

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        url: 'http://localhost:5120/api/books',
        headers: {
          get: () => 'text/plain',
        },
        text: () => Promise.resolve(errorText),
      })

      await expect(bookApi.getBooks()).rejects.toThrow(ApiValidationError)
    })
  })
})
