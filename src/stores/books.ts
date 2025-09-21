import type { Book, BookSearchParams, CreateBookRequest, PaginatedResponse, UpdateBookRequest } from '@/types/book'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { bookApi } from '@/services/bookApi'

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(0)
  const hasNextPage = ref(false)
  const hasPreviousPage = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const searchTerm = ref('')
  const sortBy = ref<'title' | 'author' | 'rating' | 'createdat'>('title')

  const isEmpty = computed(() => books.value.length === 0)
  const canLoadMore = computed(() => hasNextPage.value)

  async function fetchBooks (params: BookSearchParams = {}) {
    loading.value = true
    error.value = null

    try {
      const searchParams = {
        searchTerm: params.searchTerm || searchTerm.value || undefined,
        sortBy: params.sortBy || sortBy.value,
        page: params.page || currentPage.value,
        pageSize: params.pageSize || pageSize.value,
      }

      const response: PaginatedResponse<Book> = await bookApi.getBooks(searchParams)

      books.value = response.items
      totalCount.value = response.totalCount
      currentPage.value = response.page
      pageSize.value = response.pageSize
      totalPages.value = response.totalPages
      hasNextPage.value = response.hasNextPage
      hasPreviousPage.value = response.hasPreviousPage

      if (params.searchTerm !== undefined) {
        searchTerm.value = params.searchTerm
      }
      if (params.sortBy) {
        sortBy.value = params.sortBy
      }
    } catch (error_) {
      error.value = error_ instanceof Error ? error_.message : 'Failed to fetch books'
      console.error('Error fetching books:', error_)
    } finally {
      loading.value = false
    }
  }

  async function createBook (bookData: CreateBookRequest) {
    const newBook = await bookApi.createBook(bookData)
    await fetchBooks({ page: 1 })
    return newBook
  }

  async function updateBook (id: number, bookData: UpdateBookRequest) {
    const updatedBook = await bookApi.updateBook(id, bookData)

    const index = books.value.findIndex(book => book.id === id)
    if (index !== -1) {
      books.value[index] = updatedBook
    }

    return updatedBook
  }

  async function deleteBook (id: number) {
    await bookApi.deleteBook(id)
    await fetchBooks()
  }

  async function getBook (id: number): Promise<Book | null> {
    return await bookApi.getBook(id)
  }

  function setSearchTerm (term: string) {
    searchTerm.value = term
  }

  function setSortBy (sort: 'title' | 'author' | 'rating' | 'createdat') {
    sortBy.value = sort
  }

  function setPage (page: number) {
    currentPage.value = page
  }

  function clearError () {
    error.value = null
  }

  return {
    books,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    loading,
    error,
    searchTerm,
    sortBy,
    isEmpty,
    canLoadMore,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    getBook,
    setSearchTerm,
    setSortBy,
    setPage,
    clearError,
  }
})
