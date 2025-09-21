<template>
  <div>
    <div v-if="viewMode === 'list'">
      <v-card
        v-for="book in books"
        :key="book.id"
        border
        class="mb-3 book-list-item"
        elevation="0"
        hover
      >
        <v-card-text :class="mobile ? 'pa-3' : 'pa-4'">
          <v-row align="center" no-gutters>
            <v-col :class="mobile ? 'mr-2' : 'mr-4'" cols="auto">
              <div class="book-cover-wrapper">
                <v-img
                  :alt="book.title"
                  class="rounded-lg book-cover"
                  cover
                  :height="mobile ? 80 : 96"
                  :src="book.coverImageUrl"
                  :width="mobile ? 53 : 64"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
                      <v-icon color="grey-lighten-1" size="32">mdi-book</v-icon>
                    </div>
                  </template>
                </v-img>
              </div>
            </v-col>

            <v-col class="flex-grow-1">
              <div class="d-flex justify-space-between align-start">
                <div class="flex-grow-1 mr-4">
                  <h3 :class="mobile ? 'text-subtitle-1 font-weight-bold text-grey-darken-4 mb-1 line-height-1' : 'text-h6 font-weight-bold text-grey-darken-4 mb-1 line-height-1'">
                    {{ book.title }}
                  </h3>
                  <div class="text-body-1 text-grey-darken-2 mb-2">
                    {{ book.author }}
                  </div>
                  <div class="text-body-2 text-grey-darken-1 mb-3">
                    ISBN: {{ book.isbn }}
                  </div>

                  <div class="d-flex align-center gap-4">
                    <div class="d-flex align-center">
                      <v-rating
                        class="mr-2"
                        color="warning"
                        density="compact"
                        :model-value="book.rating"
                        readonly
                        size="small"
                      />
                      <span class="text-body-2 font-weight-medium text-grey-darken-2">
                        {{ book.rating }}/5
                      </span>
                    </div>

                    <v-chip
                      v-if="book.hasNotes"
                      class="has-notes-chip"
                      color="info"
                      size="small"
                      variant="tonal"
                    >
                      Has notes
                    </v-chip>
                  </div>
                </div>

                <div :class="mobile ? 'd-flex flex-column gap-1' : 'd-flex align-center gap-1'">
                  <v-btn
                    color="grey-darken-1"
                    icon
                    size="small"
                    variant="text"
                    @click="$emit('view', book)"
                  >
                    <v-icon size="18">mdi-eye</v-icon>
                  </v-btn>
                  <v-btn
                    color="grey-darken-1"
                    icon
                    size="small"
                    variant="text"
                    @click="$emit('edit', book)"
                  >
                    <v-icon size="18">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    color="error"
                    icon
                    size="small"
                    variant="text"
                    @click="$emit('delete', book)"
                  >
                    <v-icon size="18">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <div v-else-if="viewMode === 'grid'">
      <v-row>
        <v-col
          v-for="book in books"
          :key="book.id"
          cols="12"
          :lg="mobile ? 6 : 3"
          :md="mobile ? 6 : 4"
          :sm="mobile ? 12 : 6"
        >
          <v-card class="book-card h-100" elevation="2" hover>
            <div class="book-cover-container">
              <v-img
                :alt="book.title"
                class="book-cover"
                cover
                height="240"
                :src="book.coverImageUrl"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-icon color="grey-lighten-1" size="60">mdi-book</v-icon>
                  </div>
                </template>
              </v-img>

              <div class="book-actions">
                <v-btn
                  class="ma-1"
                  color="white"
                  icon
                  size="small"
                  @click="$emit('view', book)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  class="ma-1"
                  color="white"
                  icon
                  size="small"
                  @click="$emit('edit', book)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  class="ma-1"
                  color="white"
                  icon
                  size="small"
                  @click="$emit('delete', book)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>

            <v-card-text class="pa-3">
              <h4 class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-1 text-truncate">
                {{ book.title }}
              </h4>
              <div class="text-body-2 text-grey-darken-1 mb-2 text-truncate">
                by {{ book.author }}
              </div>

              <div class="d-flex align-center justify-space-between">
                <v-rating
                  color="amber"
                  density="compact"
                  :model-value="book.rating"
                  readonly
                  size="x-small"
                />

                <v-icon
                  v-if="book.hasNotes"
                  color="info"
                  size="small"
                  title="Has notes"
                >
                  mdi-note-text
                </v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Book } from '@/types/book'
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  interface Props {
    books: Book[]
    viewMode: 'list' | 'grid'
  }

  interface Emits {
    (e: 'edit' | 'delete' | 'view', book: Book): void
  }

  defineProps<Props>()
  defineEmits<Emits>()
</script>

<style scoped>
.book-list-item {
  transition: all 0.2s ease-in-out;
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.book-list-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(94, 114, 228, 0.2) !important;
}

.book-cover-wrapper {
  position: relative;
}

.book-cover {
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.line-height-1 {
  line-height: 1.2;
}

.has-notes-chip {
  font-size: 11px;
  height: 22px;
}

.book-card {
  transition: transform 0.2s ease-in-out;
}

.book-card:hover {
  transform: translateY(-2px);
}

.book-cover-container {
  position: relative;
  overflow: hidden;
}

.book-card:hover .book-cover {
  transform: scale(1.05);
}

.book-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.book-card:hover .book-actions {
  opacity: 1;
}
</style>
