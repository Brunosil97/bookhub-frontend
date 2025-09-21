<template>
  <v-card elevation="1">
    <v-card-title>Rating Distribution</v-card-title>
    <v-card-text>
      <div v-for="rating in ratingDistribution" :key="rating.stars" class="d-flex align-center mb-2">
        <div class="d-flex align-center" style="min-width: 100px">
          <v-rating
            color="amber"
            density="compact"
            :model-value="rating.stars"
            readonly
            size="small"
          />
        </div>
        <v-progress-linear
          class="flex-grow-1 mx-3"
          color="primary"
          height="20"
          :model-value="rating.percentage"
        >
          <template #default>
            <strong class="text-caption">{{ rating.count }}</strong>
          </template>
        </v-progress-linear>
        <div class="text-caption" style="min-width: 50px">
          {{ rating.percentage.toFixed(0) }}%
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  interface RatingData {
    stars: number
    count: number
    percentage: number
  }

  interface Props {
    ratingDistribution: RatingData[]
  }

  defineProps<Props>()
</script>
