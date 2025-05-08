<script setup lang="ts"></script>

<template>
  <div class="app-wrapper">
    <main class="h-screen">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-wrapper {
  min-height: 100vh;
  width: 100%;
}
.main {
  padding: 16px;
}

.tabs {
  display: flex;
  flex-direction: column;
}

.tab-content {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>
