<template>
  <v-card class="mb-6" elevation="1">
    <v-card-title class="text-h6">Profile Information</v-card-title>
    <v-card-text>
      <v-form>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="profileData.name"
              density="compact"
              label="Display Name"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="profileData.email"
              density="compact"
              label="Email"
              readonly
              type="email"
              variant="outlined"
            />
          </v-col>
        </v-row>
        <v-textarea
          v-model="profileData.bio"
          density="compact"
          label="Bio"
          placeholder="Tell us about your reading preferences..."
          rows="3"
          variant="outlined"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface ProfileData {
    name: string
    email: string
    bio: string
  }

  interface Props {
    profile: ProfileData
  }

  interface Emits {
    (e: 'update:profile', value: ProfileData): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const profileData = computed({
    get: () => props.profile,
    set: value => emit('update:profile', value),
  })
</script>
