<template>
  <main>
    <!-- Screen Overlay -->
    <div
      class="fixed inset-0 bg-black/50 z-40 flex justify-center items-center"
      @click.self="handleClose"
    >
      <!-- Modal Box -->
      <div class="relative z-50 max-w-4xl w-full shadow mx-5">
        <!-- Header -->
        <div
          class="flex justify-between items-center bg-sky-600 py-4 px-4 text-white"
        >
          <h1 class="font-serif text-lg font-bold">SIGNATURE</h1>
          <Close @click="handleClose" />
        </div>

        <!-- Body -->
        <div class="flex flex-col gap-6 p-8 bg-white">
          <!-- Field ID -->
          <div class="grid grid-cols-[120px_1fr] gap-2 mx-4">
            <p class="text-gray-900 font-semibold">Field ID:</p>
            <input
              v-model="formData.fieldId"
              type="text"
              class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 w-full sm:w-2xl rounded-sm"
            />
          </div>

          <!-- Label -->
          <div class="grid grid-cols-[120px_1fr] gap-2 mx-4">
            <p class="text-gray-900 font-semibold">Label:</p>
            <input
              v-model="formData.label"
              type="text"
              class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 w-full sm:w-2xl rounded-sm"
            />
          </div>

          <!-- Required -->
          <div class="flex gap-15 mx-4">
            <p class="text-gray-900 font-semibold">Required:</p>
            <input
              v-model="formData.checked"
              type="checkbox"
              class="bg-gray-100 py-0.5 px-2 rounded-sm w-5"
            />
          </div>

          <!-- Actions -->
          <div class="flex gap-4 justify-center items-center mt-7">
            <button
              @click="handleClose"
              class="border-2 border-red-300 bg-red-100 py-0.5 px-10 text-red-500 font-semibold rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="handleSubmit(formData)"
              class="border-2 border-sky-500 bg-sky-500 py-0.5 px-10 text-white font-semibold rounded cursor-pointer"
            >
              Save
            </button>
          </div>

          <!-- Warning -->
          <p class="text-gray-600 font-bold text-center">
            Please do not collect passwords, social security or credit card
            numbers in your waiver
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useModalsStore } from "@/stores/Modals";
import { useFormStore } from "@/stores/Form";

import { nextTick, reactive, ref } from "vue";
import Close from "vue-material-design-icons/Close.vue";
import { watch } from "vue";
const store = useModalsStore();
const formStore = useFormStore();
const formData = reactive({
  fieldId: null,
  label: "",
  checked: false,
});

// close modal
const handleClose = async () => {
  store.closeModule();
  await nextTick();
};
watch(
  () => store.activeModule, // activeModule has field's id
  (fieldId) => {
    if (!fieldId) {
      // reset for new field creation
      formData.label = "";
      formData.checked = false;
      formData.fieldId = "";
      return;
    }

    // access parent context from modal store
    const parentContext = store.parentContext;
    let existingField = null;

    if (parentContext?.type === "group") {
      // find the parent group in formStore.fields
      const parentGroup = formStore.fields.find(
        (f) => f.id === parentContext.parentId
      );
      if (parentGroup?.children) {
        existingField = parentGroup.children.find((f) => f.id === fieldId);
      }
    } else {
      // root level field
      existingField = formStore.fields.find((f) => f.id === fieldId);
    }

    if (existingField) {
      Object.assign(formData, existingField);
    } else {
      // if nothing found, reset (in case of new field)
      formData.label = "";
      formData.checked = false;
      formData.fieldId = "";
    }
  },
  { immediate: true }
);

// handle submit
const handleSubmit = (formData) => {
  const id = crypto.randomUUID();
  formStore.setData({ ...formData, id, type: store.activeType });
  store.closeModule();
};
</script>