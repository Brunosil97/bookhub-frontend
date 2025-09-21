<template>
  <v-card elevation="1">
    <v-card-title>Top Authors</v-card-title>
    <v-card-text>
      <div v-for="author in topAuthors" :key="author.name" class="d-flex justify-space-between align-center mb-3">
        <div>
          <div class="font-weight-medium">{{ author.name }}</div>
          <div class="text-caption text-grey-darken-1">{{ author.count }} book{{ author.count > 1 ? 's' : '' }}</div>
        </div>
        <v-chip color="primary" size="small">{{ author.avgRating.toFixed(1) }} ⭐</v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  interface AuthorData {
    name: string
    count: number
    avgRating: number
  }

  interface Props {
    topAuthors: AuthorData[]
  }

  defineProps<Props>()
</script>
