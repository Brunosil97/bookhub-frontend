<template>
  <v-card class="mb-6" elevation="1">
    <v-card-title class="text-h6">Reading Preferences</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="preferencesData.defaultSort"
            density="compact"
            :items="sortOptions"
            label="Default Sort Order"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="preferencesData.defaultView"
            density="compact"
            :items="viewOptions"
            label="Default View"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="preferencesData.pageSize"
            density="compact"
            :items="pageSizeOptions"
            label="Books Per Page"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-switch
            v-model="preferencesData.autoSort"
            color="primary"
            density="compact"
            label="Auto-sort new books"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface PreferencesData {
    defaultSort: string
    defaultView: string
    pageSize: number
    autoSort: boolean
  }

  interface Props {
    preferences: PreferencesData
  }

  interface Emits {
    (e: 'update:preferences', value: PreferencesData): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const preferencesData = computed({
    get: () => props.preferences,
    set: value => emit('update:preferences', value),
  })

  const sortOptions = [
    { title: 'Title', value: 'title' },
    { title: 'Author', value: 'author' },
    { title: 'Rating', value: 'rating' },
    { title: 'Date Added', value: 'createdat' },
  ]

  const viewOptions = [
    { title: 'List View', value: 'list' },
    { title: 'Grid View', value: 'grid' },
  ]

  const pageSizeOptions = [
    { title: '5 books', value: 5 },
    { title: '10 books', value: 10 },
    { title: '20 books', value: 20 },
    { title: '50 books', value: 50 },
  ]
</script>
