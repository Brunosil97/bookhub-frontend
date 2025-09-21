<template>
  <v-app>
    <!-- Mobile App Bar -->
    <v-app-bar
      v-if="mobile"
      app
      color="primary"
      dark
      elevation="0"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title class="font-weight-bold">
        <v-icon class="mr-2" size="24">mdi-book-open-page-variant</v-icon>
        BookHub
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      class="app-sidebar"
      color="primary"
      :permanent="!mobile"
      :temporary="mobile"
      :width="mobile ? 280 : 280"
    >
      <div class="sidebar-header">
        <div class="d-flex align-center pa-4">
          <v-icon class="mr-3" color="white" size="32">mdi-book-open-page-variant</v-icon>
          <h2 class="text-white font-weight-bold">BookHub</h2>
        </div>
      </div>

      <v-list class="py-0" nav>
        <v-list-item
          v-for="item in navigationItems"
          :key="item.to"
          active-class="sidebar-item-active"
          class="sidebar-item"
          :to="item.to"
          :value="item.value"
        >
          <template #prepend>
            <v-icon color="white" :icon="item.icon" size="20" />
          </template>
          <v-list-item-title class="text-white font-weight-medium">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <template #append>
        <div class="sidebar-footer">
          <v-list-item class="sidebar-item">
            <template #prepend>
              <v-avatar color="white" size="32">
                <v-icon color="primary">mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="text-white font-weight-medium">
              Book Lover
            </v-list-item-title>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="app-main">
      <v-container :class="mobile ? 'pa-4' : 'pa-6'" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()
  const drawer = ref(!mobile.value)

  const navigationItems = ref([
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      to: '/',
      value: 'dashboard',
    },
    {
      title: 'My Books',
      icon: 'mdi-book-multiple',
      to: '/books',
      value: 'books',
    },
    {
      title: 'Analytics',
      icon: 'mdi-chart-line',
      to: '/analytics',
      value: 'analytics',
    },
    {
      title: 'Settings',
      icon: 'mdi-cog',
      to: '/settings',
      value: 'settings',
    },
  ])
</script>

<style scoped>
.app-sidebar {
  background: linear-gradient(180deg, #5e72e4 0%, #4c63d2 100%) !important;
}

.sidebar-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-item {
  margin: 4px 12px;
  border-radius: 8px !important;
  transition: all 0.2s ease;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.sidebar-item-active {
  background-color: rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.app-main {
  background-color: #f8f9fa;
}
</style>
