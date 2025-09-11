<template>
  <main>
    <div class="flex items-center justify-between py-4">
      <h1 class="font-bold text-gray-800">Template Editor</h1>
      <div class="flex gap-2">
        <button
          @click="handleOpen"
          class="bg-sky-500 py-1 px-3 text-white font-semibold text-center rounded"
        >
          Preview
        </button>
        <button
          class="bg-gray-800 py-1 px-3 text-white font-semibold text-center rounded"
        >
          Save
        </button>
      </div>
    </div>
  </main>
  <Teleport to="body">
    <div v-if="isOpen">
      <PreviewModal />
    </div>
  </Teleport>
</template>
<script setup>
import { useModalsStore } from "@/stores/Modals";
import { nextTick, computed } from "vue";
import PreviewModal from "../Modals/PreviewModal.vue";
const store = useModalsStore();
const isOpen = computed(() => store.preview);
// close preview modal
const handleOpen = async () => {
  console.log("handle open funtion called");
  store.openPreview();
  await nextTick();
};
</script>