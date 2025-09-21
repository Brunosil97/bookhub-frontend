<template>
  <div>
    <v-card class="mb-6" elevation="2">
      <v-card-text class="pa-6">
        <h1 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">
          Welcome to BookHub
        </h1>
        <p class="text-body-1 text-grey-darken-1 mb-4">
          Track your reading journey and discover your next favorite book
        </p>

        <v-row class="mt-6">
          <v-col cols="12" md="4">
            <v-card color="primary" dark>
              <v-card-text class="text-center pa-6">
                <v-icon class="mb-4" size="48">mdi-book-multiple</v-icon>
                <div class="text-h3 font-weight-bold">{{ totalBooks }}</div>
                <div class="text-body-2 text-primary-lighten-3">Total Books</div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card color="success" dark>
              <v-card-text class="text-center pa-6">
                <v-icon class="mb-4" size="48">mdi-star</v-icon>
                <div class="text-h3 font-weight-bold">{{ averageRating.toFixed(1) }}</div>
                <div class="text-body-2 text-success-lighten-3">Average Rating</div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card color="info" dark>
              <v-card-text class="text-center pa-6">
                <v-icon class="mb-4" size="48">mdi-note-text</v-icon>
                <div class="text-h3 font-weight-bold">{{ booksWithNotes }}</div>
                <div class="text-body-2 text-info-lighten-3">Books with Notes</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col cols="12">
            <v-btn
              class="mr-4"
              color="primary"
              size="large"
              to="/books"
            >
              <v-icon left>mdi-book-plus</v-icon>
              View My Books
            </v-btn>
            <v-btn
              color="success"
              size="large"
              to="/analytics"
              variant="outlined"
            >
              <v-icon left>mdi-chart-line</v-icon>
              View Analytics
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { useBooksStore } from '@/stores/books'

  const booksStore = useBooksStore()

  const totalBooks = computed(() => booksStore.totalCount)
  const averageRating = computed(() => {
    if (booksStore.books.length === 0) return 0
    const sum = booksStore.books.reduce((acc, book) => acc + book.rating, 0)
    return sum / booksStore.books.length
  })
  const booksWithNotes = computed(() =>
    booksStore.books.filter(book => book.hasNotes).length,
  )

  onMounted(() => {
    booksStore.fetchBooks()
  })
</script>
