<template>
  <div>
    <v-card elevation="2">
      <v-card-text :class="mobile ? 'pa-4' : 'pa-6'">
        <div :class="mobile ? 'd-flex flex-column gap-4 mb-6' : 'd-flex justify-space-between align-center mb-6'">
          <div>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">
              My Books
            </h1>
            <p class="text-body-1 text-grey-darken-1">
              Manage your book collection and discover new reads.
            </p>
          </div>
          <v-btn
            :block="mobile"
            color="primary"
            :size="mobile ? 'default' : 'large'"
            @click="showAddDialog = true"
          >
            <v-icon left>mdi-plus</v-icon>
            Add Book
          </v-btn>
        </div>

        <v-row align="center" class="mb-6">
          <v-col cols="12" :md="mobile ? 12 : 6">
            <v-text-field
              v-model="searchTerm"
              class="search-field"
              density="comfortable"
              flat
              hide-details
              placeholder="Search by title or author..."
              prepend-inner-icon="mdi-magnify"
              variant="solo"
              @input="onSearchChange"
            />
          </v-col>

          <v-col :class="mobile ? 'd-flex justify-space-between align-center gap-3' : 'd-flex justify-end align-center gap-3'" cols="12" :md="mobile ? 12 : 6">
            <v-select
              v-model="sortBy"
              density="comfortable"
              flat
              hide-details
              item-title="text"
              item-value="value"
              :items="sortOptions"
              prepend-inner-icon="mdi-sort"
              :style="mobile ? 'flex: 1; max-width: calc(100% - 120px)' : 'min-width: 180px; max-width: 200px'"
              variant="solo"
              @update:model-value="onSortChange"
            />

            <v-btn-toggle
              v-model="viewMode"
              class="view-toggle"
              density="comfortable"
              mandatory
              variant="outlined"
            >
              <v-btn
                :color="viewMode === 'list' ? 'primary' : 'grey-lighten-1'"
                size="small"
                value="list"
              >
                <v-icon size="20">mdi-view-list</v-icon>
              </v-btn>
              <v-btn
                :color="viewMode === 'grid' ? 'primary' : 'grey-lighten-1'"
                size="small"
                value="grid"
              >
                <v-icon size="20">mdi-view-grid</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <div v-if="booksStore.loading" class="text-center py-8">
          <v-progress-circular color="primary" indeterminate size="64" />
          <div class="text-body-1 text-grey-darken-1 mt-4">Loading books...</div>
        </div>

        <div v-else-if="booksStore.error" class="text-center py-8">
          <v-icon class="mb-4" color="error" size="64">mdi-alert-circle</v-icon>
          <div class="text-h6 text-error">{{ booksStore.error }}</div>
          <v-btn class="mt-4" color="primary" @click="booksStore.fetchBooks()">
            Try Again
          </v-btn>
        </div>

        <div v-else-if="booksStore.isEmpty" class="text-center py-8">
          <v-icon class="mb-4" color="grey-darken-1" size="64">mdi-book-outline</v-icon>
          <div class="text-h6 text-grey-darken-1">No books found</div>
          <div class="text-body-2 text-grey-darken-1 mb-4">
            Start building your collection by adding your first book
          </div>
          <v-btn color="primary" @click="showAddDialog = true">
            <v-icon left>mdi-plus</v-icon>
            Add Your First Book
          </v-btn>
        </div>

        <div v-else>
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-body-2 text-grey-darken-1">
              {{ booksStore.totalCount }} of {{ booksStore.totalCount }} books
            </div>
          </div>

          <BookList
            :books="booksStore.books"
            :view-mode="viewMode"
            @delete="onDeleteBook"
            @edit="onEditBook"
            @view="onViewBook"
          />

          <div v-if="booksStore.totalPages > 1" class="d-flex justify-center mt-6">
            <v-pagination
              v-model="currentPage"
              :length="booksStore.totalPages"
              :total-visible="7"
              @update:model-value="onPageChange"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <AddBookDialog
      v-model="showAddDialog"
      @book-added="onBookAdded"
    />

    <EditBookDialog
      v-model="showEditDialog"
      :book="selectedBook"
      @book-updated="onBookUpdated"
    />

    <DeleteBookDialog
      v-model="showDeleteDialog"
      :book="selectedBook"
      @book-deleted="onBookDeleted"
    />

    <BookDetailDialog
      v-model="showDetailDialog"
      :book="selectedBook"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { Book } from '@/types/book'
  import { onMounted, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import AddBookDialog from '@/components/books/AddBookDialog.vue'
  import BookDetailDialog from '@/components/books/BookDetailDialog.vue'
  // Components
  import BookList from '@/components/books/BookList.vue'
  import DeleteBookDialog from '@/components/books/DeleteBookDialog.vue'
  import EditBookDialog from '@/components/books/EditBookDialog.vue'
  import { useBooksStore } from '@/stores/books'

  const { mobile } = useDisplay()

  const booksStore = useBooksStore()

  const showAddDialog = ref(false)
  const showEditDialog = ref(false)
  const showDeleteDialog = ref(false)
  const showDetailDialog = ref(false)
  const selectedBook = ref<Book | null>(null)

  const searchTerm = ref('')
  const sortBy = ref('title')
  const viewMode = ref<'list' | 'grid'>('list')
  const currentPage = ref(1)

  const sortOptions = [
    { text: 'Title', value: 'title' },
    { text: 'Author', value: 'author' },
    { text: 'Rating', value: 'rating' },
    { text: 'Date Added', value: 'createdat' },
  ]

  function onSearchChange () {
    booksStore.setSearchTerm(searchTerm.value)
    currentPage.value = 1
    booksStore.setPage(1)
    booksStore.fetchBooks()
  }

  function onSortChange () {
    booksStore.setSortBy(sortBy.value as any)
    booksStore.fetchBooks()
  }

  function onPageChange (page: number) {
    booksStore.setPage(page)
    booksStore.fetchBooks()
  }

  function onEditBook (book: Book) {
    selectedBook.value = book
    showEditDialog.value = true
  }

  function onDeleteBook (book: Book) {
    selectedBook.value = book
    showDeleteDialog.value = true
  }

  function onViewBook (book: Book) {
    selectedBook.value = book
    showDetailDialog.value = true
  }

  function onBookAdded () {
    booksStore.fetchBooks({ page: 1 })
    currentPage.value = 1
  }

  function onBookUpdated () {
    booksStore.fetchBooks()
  }

  function onBookDeleted () {
    booksStore.fetchBooks()
  }

  onMounted(() => {
    booksStore.fetchBooks()
  })
</script>

<style scoped>
.search-field :deep(.v-field) {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.view-toggle {
  border-radius: 8px;
  overflow: hidden;
}

.view-toggle .v-btn {
  border-radius: 0;
  min-width: 44px;
}

.view-toggle .v-btn:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.view-toggle .v-btn:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
