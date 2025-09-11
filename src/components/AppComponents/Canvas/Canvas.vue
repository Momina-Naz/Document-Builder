<template>
  <main class="w-full">
    <div class="flex flex-col py-3 px-6">
      <Navbar />
      <DropSection />
    </div>
  </main>
</template>
<script setup>
import Navbar from "../Navbar.vue";
import DropSection from "./DropZone.vue";
</script>