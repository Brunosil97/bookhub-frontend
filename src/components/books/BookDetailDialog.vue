<template>
  <v-dialog
    :fullscreen="mobile"
    :max-width="mobile ? undefined : 700"
    :model-value="modelValue"
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card v-if="book">
      <v-card-title :class="mobile ? 'text-h5 pa-4 pb-2' : 'text-h5 pa-6 pb-4'">
        <v-icon class="mr-3" color="primary" left>mdi-eye</v-icon>
        Book Details
      </v-card-title>

      <v-card-text :class="mobile ? 'px-4 pb-0' : 'px-6 pb-0'">
        <v-row>
          <v-col cols="12" :md="mobile ? 12 : 4">
            <v-img
              :alt="book.title"
              aspect-ratio="2/3"
              class="rounded mx-auto"
              cover
              max-width="200"
              :src="book.coverImageUrl"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon color="grey-lighten-1" size="80">mdi-book</v-icon>
                </div>
              </template>
            </v-img>
          </v-col>

          <v-col cols="12" :md="mobile ? 12 : 8">
            <div class="book-info">
              <h2 class="text-h4 font-weight-bold text-grey-darken-3 mb-3">
                {{ book.title }}
              </h2>

              <div class="text-h6 text-grey-darken-1 mb-4">
                by {{ book.author }}
              </div>

              <v-chip-group class="mb-4">
                <v-chip color="primary" variant="outlined">
                  <v-icon left size="small">mdi-barcode</v-icon>
                  {{ book.isbn }}
                </v-chip>
                <v-chip
                  v-if="book.hasNotes"
                  color="info"
                  variant="outlined"
                >
                  <v-icon left size="small">mdi-note-text</v-icon>
                  Has Notes
                </v-chip>
              </v-chip-group>

              <div class="rating-section mb-4">
                <div class="text-subtitle-1 font-weight-medium mb-2">Your Rating</div>
                <div class="d-flex align-center">
                  <v-rating
                    class="mr-3"
                    color="amber"
                    :model-value="book.rating"
                    readonly
                    size="large"
                  />
                  <span class="text-h6 font-weight-bold">{{ book.rating }}</span>
                  <span class="text-body-1 text-grey-darken-1 ml-1">/5</span>
                </div>
              </div>

              <div class="dates-section mb-4">
                <v-row>
                  <v-col cols="6">
                    <div class="text-body-2 text-grey-darken-1">Added</div>
                    <div class="text-body-1 font-weight-medium">
                      {{ formatDate(book.createdAt) }}
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-body-2 text-grey-darken-1">Last Updated</div>
                    <div class="text-body-1 font-weight-medium">
                      {{ formatDate(book.updatedAt) }}
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div class="comments-section">
          <div class="text-h6 font-weight-medium mb-3">
            <v-icon color="grey-darken-1" left>mdi-comment-text</v-icon>
            Your Comments
          </div>

          <v-card class="mb-4" variant="outlined">
            <v-card-text class="pa-4">
              <div class="text-body-1" style="white-space: pre-wrap; line-height: 1.6;">
                {{ book.comments || 'No comments available.' }}
              </div>
            </v-card-text>
          </v-card>
        </div>

        <v-divider class="my-6" />

        <div class="metadata-section">
          <div class="text-h6 font-weight-medium mb-3">
            <v-icon color="grey-darken-1" left>mdi-information</v-icon>
            Book Information
          </div>

          <v-list density="compact">
            <v-list-item>
              <template #prepend>
                <v-icon color="grey-darken-1">mdi-identifier</v-icon>
              </template>
              <v-list-item-title>Book ID</v-list-item-title>
              <v-list-item-subtitle>{{ book.id }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon color="grey-darken-1">mdi-book</v-icon>
              </template>
              <v-list-item-title>Title</v-list-item-title>
              <v-list-item-subtitle>{{ book.title }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon color="grey-darken-1">mdi-account-edit</v-icon>
              </template>
              <v-list-item-title>Author</v-list-item-title>
              <v-list-item-subtitle>{{ book.author }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon color="grey-darken-1">mdi-barcode</v-icon>
              </template>
              <v-list-item-title>ISBN</v-list-item-title>
              <v-list-item-subtitle>{{ book.isbn }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="book.coverImageUrl">
              <template #prepend>
                <v-icon color="grey-darken-1">mdi-image</v-icon>
              </template>
              <v-list-item-title>Cover Image</v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                <a class="text-primary" :href="book.coverImageUrl" target="_blank">
                  {{ book.coverImageUrl }}
                </a>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <v-card-actions class="px-6 py-4">
        <v-spacer />
        <v-btn
          @click="$emit('update:modelValue', false)"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { Book } from '@/types/book'
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  interface Props {
    modelValue: boolean
    book: Book | null
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
  }

  defineProps<Props>()
  defineEmits<Emits>()

  function formatDate (dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>

<style scoped>
.book-info {
  height: 100%;
}

.rating-section {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.dates-section {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.comments-section {
  margin-bottom: 24px;
}

.metadata-section {
  margin-bottom: 24px;
}
</style>
