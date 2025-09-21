<template>
  <div>
    <v-card class="mb-6" elevation="2">
      <v-card-text class="pa-6">
        <h1 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">
          Analytics
        </h1>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          Insights and statistics about your reading habits and collection.
        </p>

        <v-row class="mb-6">
          <v-col cols="12" md="3" sm="6">
            <StatsCard
              color="primary"
              icon="mdi-book-multiple"
              label="Total Books"
              :value="totalBooks"
            />
          </v-col>

          <v-col cols="12" md="3" sm="6">
            <StatsCard
              color="success"
              icon="mdi-star"
              label="Avg Rating"
              :value="averageRating.toFixed(1)"
            />
          </v-col>

          <v-col cols="12" md="3" sm="6">
            <StatsCard
              color="info"
              icon="mdi-account-edit"
              label="Authors"
              :value="uniqueAuthors"
            />
          </v-col>

          <v-col cols="12" md="3" sm="6">
            <StatsCard
              color="warning"
              icon="mdi-note-text"
              label="With Notes"
              :value="booksWithNotes"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="6">
            <RatingDistribution :rating-distribution="ratingDistribution" />
          </v-col>

          <v-col cols="12" lg="6">
            <TopAuthors :top-authors="topAuthors" />
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12">
            <ReadingTimeline />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import RatingDistribution from '@/components/analytics/RatingDistribution.vue'
  import ReadingTimeline from '@/components/analytics/ReadingTimeline.vue'
  import StatsCard from '@/components/analytics/StatsCard.vue'
  import TopAuthors from '@/components/analytics/TopAuthors.vue'
  import { useBooksStore } from '@/stores/books'

  const booksStore = useBooksStore()

  const totalBooks = computed(() => booksStore.totalCount)

  const averageRating = computed(() => {
    if (booksStore.books.length === 0) return 0
    const sum = booksStore.books.reduce((acc, book) => acc + book.rating, 0)
    return sum / booksStore.books.length
  })

  const uniqueAuthors = computed(() => {
    const authors = new Set(booksStore.books.map(book => book.author))
    return authors.size
  })

  const booksWithNotes = computed(() =>
    booksStore.books.filter(book => book.hasNotes).length,
  )

  const ratingDistribution = computed(() => {
    const distribution = [1, 2, 3, 4, 5].map(stars => {
      const count = booksStore.books.filter(book => book.rating === stars).length
      const percentage = totalBooks.value > 0 ? (count / totalBooks.value) * 100 : 0
      return { stars, count, percentage }
    })
    return distribution
  })

  const topAuthors = computed(() => {
    const authorStats = new Map<string, { count: number, totalRating: number }>()

    for (const book of booksStore.books) {
      const existing = authorStats.get(book.author) || { count: 0, totalRating: 0 }
      authorStats.set(book.author, {
        count: existing.count + 1,
        totalRating: existing.totalRating + book.rating,
      })
    }

    return Array.from(authorStats.entries())
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        avgRating: stats.totalRating / stats.count,
      }))
      .toSorted((a, b) => b.count - a.count)
      .slice(0, 5)
  })

  onMounted(() => {
    if (booksStore.books.length === 0) {
      booksStore.fetchBooks()
    }
  })
</script>
