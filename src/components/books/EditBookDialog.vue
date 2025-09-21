<template>
  <v-dialog
    :fullscreen="mobile"
    :max-width="mobile ? undefined : 600"
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card v-if="book">
      <v-card-title :class="mobile ? 'text-h5 pa-4 pb-2' : 'text-h5 pa-6 pb-4'">
        <v-icon class="mr-3" color="success" left>mdi-pencil</v-icon>
        Edit Book
      </v-card-title>

      <v-card-text :class="mobile ? 'px-4 pb-0' : 'px-6 pb-0'">
        <v-row class="mb-4">
          <v-col cols="auto">
            <v-img
              :alt="book.title"
              class="rounded"
              cover
              height="150"
              :src="book.coverImageUrl"
              width="100"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon color="grey-lighten-1" size="40">mdi-book</v-icon>
                </div>
              </template>
            </v-img>
          </v-col>

          <v-col>
            <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">
              {{ book.title }}
            </h3>
            <div class="text-body-1 text-grey-darken-1 mb-2">
              by {{ book.author }}
            </div>
            <div class="text-body-2 text-grey-darken-1">
              ISBN: {{ book.isbn }}
            </div>
          </v-col>
        </v-row>

        <v-divider class="mb-4" />

        <v-form ref="formRef" v-model="isFormValid">
          <v-row>
            <v-col cols="12">
              <div class="mb-2">
                <label class="text-body-1 font-weight-medium">Rating *</label>
              </div>
              <v-rating
                v-model="form.rating"
                class="mb-2"
                clearable
                color="amber"
                hover
                size="large"
              />
              <div v-if="ratingErrors.length > 0" class="text-error text-caption">
                {{ ratingErrors[0] }}
              </div>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.comments"
                counter="500"
                :error-messages="commentsErrors"
                label="Comments *"
                placeholder="Share your thoughts about this book..."
                required
                rows="4"
                :rules="commentsRules"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-form>

        <ErrorMessage
          :error="globalError"
          @close="globalError = ''"
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
          color="success"
          :disabled="!isFormValid || !form.rating"
          :loading="loading"
          @click="submitForm"
        >
          Update Book
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { Book, UpdateBookRequest } from '@/types/book'
  import { reactive, ref, watch } from 'vue'
  import { useDisplay } from 'vuetify'
  import ErrorMessage from '@/components/global/ErrorMessage.vue'
  import { useBooksStore } from '@/stores/books'

  interface Props {
    modelValue: boolean
    book: Book | null
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'book-updated'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const booksStore = useBooksStore()
  const { mobile } = useDisplay()
  const formRef = ref()
  const loading = ref(false)
  const isFormValid = ref(false)
  const globalError = ref('')

  const form = reactive<UpdateBookRequest>({
    rating: 0,
    comments: '',
  })

  const commentsErrors = ref<string[]>([])
  const ratingErrors = ref<string[]>([])

  const commentsRules = [
    (v: string) => !!v || 'Comments are required when providing a rating',
    (v: string) => v?.length <= 500 || 'Comments must be less than 500 characters',
    (v: string) => !v?.toLowerCase().includes('horrible') || 'Comments must not contain the word "horrible"',
  ]

  function clearErrors () {
    commentsErrors.value = []
    ratingErrors.value = []
    globalError.value = ''
  }

  function validateRating () {
    if (!form.rating || form.rating < 1 || form.rating > 5) {
      ratingErrors.value = ['Rating must be between 1 and 5']
      return false
    }
    ratingErrors.value = []
    return true
  }

  function resetForm () {
    if (props.book) {
      form.rating = props.book.rating
      form.comments = props.book.comments
    } else {
      form.rating = 0
      form.comments = ''
    }
    clearErrors()
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  }

  function closeDialog () {
    emit('update:modelValue', false)
  }

  async function submitForm () {
    if (!props.book) return

    clearErrors()

    if (!formRef.value.validate()) {
      return
    }

    if (!validateRating()) {
      return
    }

    loading.value = true

    try {
      const updateData: UpdateBookRequest = {
        rating: form.rating,
        comments: form.comments.trim(),
      }

      await booksStore.updateBook(props.book.id, updateData)
      closeDialog()
      emit('book-updated')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update book'

      if (errorMessage.toLowerCase().includes('rating')) {
        ratingErrors.value = [errorMessage]
      } else if (errorMessage.toLowerCase().includes('comment')) {
        commentsErrors.value = [errorMessage]
      } else {
        globalError.value = errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  watch(() => props.modelValue, newValue => {
    if (newValue && props.book) {
      resetForm()
    }
  })

  watch(() => props.book, newBook => {
    if (newBook && props.modelValue) {
      resetForm()
    }
  })
</script>
