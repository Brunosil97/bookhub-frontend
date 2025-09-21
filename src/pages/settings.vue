<template>
  <div>
    <v-card elevation="2">
      <v-card-text class="pa-6">
        <h1 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">
          Settings
        </h1>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          Customize your BookHub experience and manage your preferences.
        </p>

        <v-row>
          <v-col cols="12" lg="8">
            <ProfileSettings
              v-model:profile="profile"
            />

            <ReadingPreferences
              v-model:preferences="preferences"
            />

            <NotificationSettings
              v-model:notifications="notifications"
            />

            <DataManagement
              @clear-data="showClearDialog = true"
              @export-data="exportData"
            />

            <div class="text-center">
              <v-btn
                block
                class="mb-4"
                color="primary"
                :loading="saving"
                :size="mobile ? 'default' : 'large'"
                @click="saveSettings"
              >
                <v-icon left>mdi-content-save</v-icon>
                Save Settings
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" lg="4">
            <AboutSection />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showClearDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Clear All Data</v-card-title>
        <v-card-text>
          Are you sure you want to clear all your book data? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showClearDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="clearAllData">Clear Data</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      timeout="3000"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import AboutSection from '@/components/settings/AboutSection.vue'
  import DataManagement from '@/components/settings/DataManagement.vue'
  import NotificationSettings from '@/components/settings/NotificationSettings.vue'
  import ProfileSettings from '@/components/settings/ProfileSettings.vue'
  import ReadingPreferences from '@/components/settings/ReadingPreferences.vue'
  import { useBooksStore } from '@/stores/books'

  const booksStore = useBooksStore()
  const { mobile } = useDisplay()

  const saving = ref(false)
  const showClearDialog = ref(false)
  const showSnackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('success')

  const profile = reactive({
    name: 'Book Lover',
    email: 'book.lover@example.com',
    bio: 'Passionate reader with a love for fiction and non-fiction alike.',
  })

  const preferences = reactive({
    defaultSort: 'title',
    defaultView: 'list',
    pageSize: 10,
    autoSort: true,
  })

  const notifications = reactive({
    emailUpdates: true,
    weeklyDigest: false,
    readingReminders: true,
  })

  async function saveSettings () {
    saving.value = true
    try {
      localStorage.setItem('bookhub-settings', JSON.stringify({
        profile,
        preferences,
        notifications,
      }))

      showSnackbar.value = true
      snackbarMessage.value = 'Settings saved successfully!'
      snackbarColor.value = 'success'
    } catch {
      showSnackbar.value = true
      snackbarMessage.value = 'Failed to save settings'
      snackbarColor.value = 'error'
    } finally {
      saving.value = false
    }
  }

  function exportData () {
    try {
      const data = {
        books: booksStore.books,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `bookhub-export-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      showSnackbar.value = true
      snackbarMessage.value = 'Book data exported successfully!'
      snackbarColor.value = 'success'
    } catch {
      showSnackbar.value = true
      snackbarMessage.value = 'Failed to export data'
      snackbarColor.value = 'error'
    }
  }

  function clearAllData () {
    showClearDialog.value = false
    showSnackbar.value = true
    snackbarMessage.value = 'This feature is not available in the demo version'
    snackbarColor.value = 'info'
  }

  function loadSettings () {
    try {
      const saved = localStorage.getItem('bookhub-settings')
      if (saved) {
        const settings = JSON.parse(saved)
        Object.assign(profile, settings.profile || {})
        Object.assign(preferences, settings.preferences || {})
        Object.assign(notifications, settings.notifications || {})
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  onMounted(() => {
    loadSettings()
  })
</script>
