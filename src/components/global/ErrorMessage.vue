<template>
  <v-alert
    v-if="error"
    class="mb-4"
    closable
    type="error"
    @click:close="handleClose"
  >
    {{ error }}
  </v-alert>
</template>

<script setup lang="ts">
  interface Props {
    error: string | null
    closable?: boolean
  }

  interface Emits {
    (e: 'close'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    closable: true,
  })

  const emit = defineEmits<Emits>()

  function handleClose () {
    emit('close')
  }
</script>
