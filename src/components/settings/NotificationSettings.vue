<template>
  <v-card class="mb-6" elevation="1">
    <v-card-title class="text-h6">Notifications</v-card-title>
    <v-card-text>
      <v-switch
        v-model="notificationsData.emailUpdates"
        class="mb-2"
        color="primary"
        density="compact"
        label="Email updates about new features"
      />
      <v-switch
        v-model="notificationsData.weeklyDigest"
        class="mb-2"
        color="primary"
        density="compact"
        label="Weekly reading digest"
      />
      <v-switch
        v-model="notificationsData.readingReminders"
        color="primary"
        density="compact"
        label="Reading reminders"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface NotificationsData {
    emailUpdates: boolean
    weeklyDigest: boolean
    readingReminders: boolean
  }

  interface Props {
    notifications: NotificationsData
  }

  interface Emits {
    (e: 'update:notifications', value: NotificationsData): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const notificationsData = computed({
    get: () => props.notifications,
    set: value => emit('update:notifications', value),
  })
</script>
