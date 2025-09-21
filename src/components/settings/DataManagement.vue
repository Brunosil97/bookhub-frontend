<template>
  <v-card class="mb-6" elevation="1">
    <v-card-title class="text-h6">Data Management</v-card-title>
    <v-card-text>
      <div class="d-flex flex-column gap-4">
        <div>
          <v-btn
            color="primary"
            variant="outlined"
            @click="$emit('export-data')"
          >
            <v-icon left>mdi-download</v-icon>
            Export Book Data
          </v-btn>
          <div class="text-caption text-grey-darken-1 mt-1">
            Download your book collection as JSON
          </div>
        </div>

        <div>
          <v-btn
            color="warning"
            variant="outlined"
            @click="$emit('clear-data')"
          >
            <v-icon left>mdi-delete-sweep</v-icon>
            Clear All Data
          </v-btn>
          <div class="text-caption text-grey-darken-1 mt-1">
            Remove all books from your collection
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  interface Emits {
    (e: 'export-data' | 'clear-data'): void
  }

  defineEmits<Emits>()
</script>
