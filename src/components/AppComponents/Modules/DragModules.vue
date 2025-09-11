<template>
  <main class="md:w-[320px] md:min-h-screens bg-gray-100">
    <div class="flex flex-col gap-6 px-4 md:px-7 pt-6 md:min-h-screen">
      <h1 class="text-gray-800 font-bold text-sm mt-0 md:mt-3 tracking-wide">
        DRAG MODULES TO CANVAS
      </h1>
      <Module />
    </div>
  </main>
</template>
<script setup>
import Module from "./Module.vue";
</script>