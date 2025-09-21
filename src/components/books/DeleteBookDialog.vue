<template>
  <v-dialog
    :fullscreen="mobile"
    :max-width="mobile ? undefined : 500"
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card v-if="book">
      <v-card-title :class="mobile ? 'text-h5 pa-4 pb-2' : 'text-h5 pa-6 pb-4'">
        <v-icon class="mr-3" color="error" left>mdi-delete</v-icon>
        Delete Book
      </v-card-title>

      <v-card-text :class="mobile ? 'px-4 pb-0' : 'px-6 pb-0'">
        <div class="text-body-1 mb-4">
          Are you sure you want to delete this book/review?
        </div>

        <v-card class="mb-4" variant="outlined">
          <v-card-text class="pa-4">
            <v-row align="center">
              <v-col cols="auto">
                <v-img
                  :alt="book.title"
                  class="rounded"
                  cover
                  height="90"
                  :src="book.coverImageUrl"
                  width="60"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon color="grey-lighten-1" size="24">mdi-book</v-icon>
                    </div>
                  </template>
                </v-img>
              </v-col>

              <v-col>
                <h4 class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-1">
                  {{ book.title }}
                </h4>
                <div class="text-body-2 text-grey-darken-1 mb-2">
                  by {{ book.author }}
                </div>
                <div class="d-flex align-center">
                  <v-rating
                    color="amber"
                    density="compact"
                    :model-value="book.rating"
                    readonly
                    size="small"
                  />
                  <span class="text-body-2 text-grey-darken-1 ml-2">
                    {{ book.rating }}/5
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-alert class="mb-4" type="warning" variant="tonal">
          <div class="text-body-2">
            <strong>This action cannot be undone.</strong><br>
            The book and all associated data (rating, comments, etc.) will be permanently removed from your collection.
          </div>
        </v-alert>

        <ErrorMessage
          :error="error"
          @close="error = ''"
        />
      </v-card-text>

      <v-card-actions :class="mobile ? 'px-4 py-4' : 'px-6 py-4'">
        <v-spacer />
        <v-btn
          :disabled="loading"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          :loading="loading"
          @click="confirmDelete"
        >
          Delete Book
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { Book } from '@/types/book'
  import { ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import ErrorMessage from '@/components/global/ErrorMessage.vue'
  import { useBooksStore } from '@/stores/books'

  interface Props {
    modelValue: boolean
    book: Book | null
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'book-deleted'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const booksStore = useBooksStore()
  const { mobile } = useDisplay()
  const loading = ref(false)
  const error = ref('')

  function closeDialog () {
    error.value = ''
    emit('update:modelValue', false)
  }

  async function confirmDelete () {
    if (!props.book) return

    loading.value = true
    error.value = ''

    try {
      await booksStore.deleteBook(props.book.id)
      closeDialog()
      emit('book-deleted')
    } catch (error_) {
      error.value = error_ instanceof Error ? error_.message : 'Failed to delete book'
    } finally {
      loading.value = false
    }
  }
</script>
