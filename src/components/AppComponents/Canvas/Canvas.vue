<template>
  <main class="w-full">
    <div class="flex flex-col py-3 px-6">
      <Navbar />
      <DropZone />
    </div>
  </main>
</template>
<script setup>
import Navbar from "../Navbar.vue";
import DropZone from "./DropZone.vue";
</script>