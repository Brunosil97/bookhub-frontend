import { setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { bookApi } from '@/services/bookApi'
import { createTestPinia, mockBook, mockPaginatedResponse } from '@/test-utils'
import { useBooksStore } from '../books'

vi.mock('@/services/bookApi')
const mockBookApi = vi.mocked(bookApi)

describe('Books Store', () => {
  beforeEach(() => {
    setActivePinia(createTestPinia())
    vi.clearAllMocks()
  })

  describe('state', () => {
    it('should initialize with default state', () => {
      const store = useBooksStore()

      expect(store.books).toEqual([])
      expect(store.totalCount).toBe(0)
      expect(store.currentPage).toBe(1)
      expect(store.pageSize).toBe(10)
      expect(store.totalPages).toBe(0)
      expect(store.searchTerm).toBe('')
      expect(store.sortBy).toBe('title')
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('getters', () => {
    it('should return isEmpty correctly', () => {
      const store = useBooksStore()

      expect(store.isEmpty).toBe(true)

      store.books = [mockBook]
      expect(store.isEmpty).toBe(false)
    })

    it('should return canLoadMore correctly', () => {
      const store = useBooksStore()

      expect(store.canLoadMore).toBe(false)

      store.hasNextPage = true
      expect(store.canLoadMore).toBe(true)
    })
  })

  describe('actions', () => {
    describe('fetchBooks', () => {
      it('should fetch books successfully', async () => {
        const store = useBooksStore()
        mockBookApi.getBooks.mockResolvedValue(mockPaginatedResponse)

        await store.fetchBooks()

        expect(mockBookApi.getBooks).toHaveBeenCalledWith({
          searchTerm: undefined,
          sortBy: 'title',
          page: 1,
          pageSize: 10,
        })
        expect(store.books).toEqual(mockPaginatedResponse.items)
        expect(store.totalCount).toBe(mockPaginatedResponse.totalCount)
        expect(store.totalPages).toBe(mockPaginatedResponse.totalPages)
        expect(store.hasNextPage).toBe(mockPaginatedResponse.hasNextPage)
        expect(store.hasPreviousPage).toBe(mockPaginatedResponse.hasPreviousPage)
      })

      it('should handle search parameters', async () => {
        const store = useBooksStore()
        store.searchTerm = 'test'
        store.sortBy = 'author'
        store.currentPage = 2
        mockBookApi.getBooks.mockResolvedValue(mockPaginatedResponse)

        await store.fetchBooks()

        expect(mockBookApi.getBooks).toHaveBeenCalledWith({
          searchTerm: 'test',
          sortBy: 'author',
          page: 2,
          pageSize: 10,
        })
      })
    })

    describe('createBook', () => {
      it('should create a book successfully', async () => {
        const store = useBooksStore()
        const newBook = {
          title: 'New Book',
          author: 'New Author',
          isbn: '1234567890',
          rating: 4,
          comments: 'Great book!',
        }
        mockBookApi.createBook.mockResolvedValue(mockBook)
        mockBookApi.getBooks.mockResolvedValue(mockPaginatedResponse)

        await store.createBook(newBook)

        expect(mockBookApi.createBook).toHaveBeenCalledWith(newBook)
        expect(mockBookApi.getBooks).toHaveBeenCalled()
      })
    })

    describe('updateBook', () => {
      it('should update a book successfully', async () => {
        const store = useBooksStore()
        const updateData = {
          rating: 5,
          comments: 'Excellent!',
        }
        const updatedBook = { ...mockBook, ...updateData }
        mockBookApi.updateBook.mockResolvedValue(updatedBook)
        store.books = [mockBook]

        await store.updateBook(1, updateData)

        expect(mockBookApi.updateBook).toHaveBeenCalledWith(1, updateData)
        expect(store.books[0]).toEqual(updatedBook)
      })
    })

    describe('deleteBook', () => {
      it('should delete a book successfully', async () => {
        const store = useBooksStore()
        mockBookApi.deleteBook.mockResolvedValue(undefined)
        mockBookApi.getBooks.mockResolvedValue(mockPaginatedResponse)

        await store.deleteBook(1)

        expect(mockBookApi.deleteBook).toHaveBeenCalledWith(1)
        expect(mockBookApi.getBooks).toHaveBeenCalled()
      })
    })

    describe('getBook', () => {
      it('should get a single book', async () => {
        const store = useBooksStore()
        mockBookApi.getBook.mockResolvedValue(mockBook)

        const result = await store.getBook(1)

        expect(mockBookApi.getBook).toHaveBeenCalledWith(1)
        expect(result).toEqual(mockBook)
      })
    })

    describe('setSearchTerm', () => {
      it('should set search term', () => {
        const store = useBooksStore()

        store.setSearchTerm('test search')

        expect(store.searchTerm).toBe('test search')
      })
    })

    describe('setSortBy', () => {
      it('should set sort by', () => {
        const store = useBooksStore()

        store.setSortBy('author')

        expect(store.sortBy).toBe('author')
      })
    })

    describe('setPage', () => {
      it('should set current page', () => {
        const store = useBooksStore()

        store.setPage(5)

        expect(store.currentPage).toBe(5)
      })
    })

    describe('clearError', () => {
      it('should clear error', () => {
        const store = useBooksStore()
        store.error = 'Some error'

        store.clearError()

        expect(store.error).toBe(null)
      })
    })
  })
})
