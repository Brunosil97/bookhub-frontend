<template>
  <v-card class="text-center" :color="color" dark>
    <v-card-text class="pa-4">
      <v-icon class="mb-2" size="40">{{ icon }}</v-icon>
      <div class="text-h4 font-weight-bold">{{ value }}</div>
      <div class="text-body-2">{{ label }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  interface Props {
    icon: string
    value: string | number
    label: string
    color: string
  }

  defineProps<Props>()
</script>
