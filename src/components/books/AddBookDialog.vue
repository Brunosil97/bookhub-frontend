<template>
  <v-dialog
    :fullscreen="mobile"
    :max-width="mobile ? undefined : 600"
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title :class="mobile ? 'text-h5 pa-4 pb-2' : 'text-h5 pa-6 pb-4'">
        <v-icon class="mr-3" color="primary" left>mdi-book-plus</v-icon>
        Add New Book
      </v-card-title>

      <v-card-text :class="mobile ? 'px-4 pb-0' : 'px-6 pb-0'">
        <v-form ref="formRef" v-model="isFormValid">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.title"
                counter="200"
                density="compact"
                :error-messages="titleErrors"
                label="Title *"
                required
                :rules="titleRules"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.author"
                counter="100"
                density="compact"
                :error-messages="authorErrors"
                label="Author *"
                required
                :rules="authorRules"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.isbn"
                density="compact"
                :error-messages="isbnErrors"
                label="ISBN *"
                placeholder="978-0-123456-78-9"
                required
                :rules="isbnRules"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.coverImageUrl"
                density="compact"
                label="Cover Image URL"
                placeholder="https://example.com/cover.jpg"
                :rules="urlRules"
                variant="outlined"
              />
            </v-col>

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
          color="primary"
          :disabled="!isFormValid || !form.rating"
          :loading="loading"
          @click="submitForm"
        >
          Add Book
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { CreateBookRequest } from '@/types/book'
  import { reactive, ref, watch } from 'vue'
  import { useDisplay } from 'vuetify'
  import ErrorMessage from '@/components/global/ErrorMessage.vue'
  import { useBooksStore } from '@/stores/books'

  interface Props {
    modelValue: boolean
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'book-added'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const booksStore = useBooksStore()
  const { mobile } = useDisplay()
  const formRef = ref()
  const loading = ref(false)
  const isFormValid = ref(false)
  const globalError = ref('')

  const form = reactive<CreateBookRequest>({
    title: '',
    author: '',
    isbn: '',
    rating: 0,
    comments: '',
    coverImageUrl: '',
  })

  const titleErrors = ref<string[]>([])
  const authorErrors = ref<string[]>([])
  const isbnErrors = ref<string[]>([])
  const commentsErrors = ref<string[]>([])
  const ratingErrors = ref<string[]>([])

  const titleRules = [
    (v: string) => !!v || 'Title is required',
    (v: string) => v?.length <= 200 || 'Title must be less than 200 characters',
  ]

  const authorRules = [
    (v: string) => !!v || 'Author is required',
    (v: string) => v?.length <= 100 || 'Author must be less than 100 characters',
  ]

  const isbnRules = [
    (v: string) => !!v || 'ISBN is required',
    (v: string) => /^[0-9\-X]+$/.test(v) || 'ISBN must contain only numbers, dashes, and X',
  ]

  const urlRules = [
    (v: string) => !v || /^https?:\/\/.+/.test(v) || 'Please enter a valid URL starting with http:// or https://',
  ]

  const commentsRules = [
    (v: string) => !!v || 'Comments are required when providing a rating',
    (v: string) => v?.length <= 500 || 'Comments must be less than 500 characters',
    (v: string) => !v?.toLowerCase().includes('horrible') || 'Comments must not contain the word "horrible"',
  ]

  function clearErrors () {
    titleErrors.value = []
    authorErrors.value = []
    isbnErrors.value = []
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
    form.title = ''
    form.author = ''
    form.isbn = ''
    form.rating = 0
    form.comments = ''
    form.coverImageUrl = ''
    clearErrors()
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  }

  function closeDialog () {
    resetForm()
    emit('update:modelValue', false)
  }

  async function submitForm () {
    clearErrors()

    if (!formRef.value.validate()) {
      return
    }

    if (!validateRating()) {
      return
    }

    if (booksStore.totalCount >= 25) {
      globalError.value = 'Maximum 25 books allowed in collection'
      return
    }

    loading.value = true

    try {
      const bookData: CreateBookRequest = {
        title: form.title.trim(),
        author: form.author.trim(),
        isbn: form.isbn.trim(),
        rating: form.rating,
        comments: form.comments.trim(),
        coverImageUrl: form.coverImageUrl?.trim() || undefined,
      }

      await booksStore.createBook(bookData)
      closeDialog()
      emit('book-added')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add book'

      if (errorMessage.toLowerCase().includes('isbn')) {
        isbnErrors.value = [errorMessage]
      } else if (errorMessage.toLowerCase().includes('rating')) {
        ratingErrors.value = [errorMessage]
      } else if (errorMessage.toLowerCase().includes('comment')) {
        commentsErrors.value = [errorMessage]
      } else if (errorMessage.toLowerCase().includes('title')) {
        titleErrors.value = [errorMessage]
      } else if (errorMessage.toLowerCase().includes('author')) {
        authorErrors.value = [errorMessage]
      } else {
        globalError.value = errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  watch(() => props.modelValue, newValue => {
    if (newValue) {
      clearErrors()
    } else {
      resetForm()
    }
  })
</script>
