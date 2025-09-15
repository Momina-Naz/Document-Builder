<template>
  <main class="flex flex-col justify-center items-center mx-auto w-full">
    <div
      v-if="fields.length === 0"
      class="flex items-center gap-1 text-sky-500 text-lg italic"
    >
      Add Modules <plus />
    </div>

    <draggable
      class="w-full min-h-[649px]"
      :list="fields"
      :group="{ name: 'modules', pull: 'clone', put: true }"
      @add="onFieldAdded"
    >
      <template #item="{ element: field }">
        <div>
          <!-- Paragraph Module -->
          <div v-if="field.type === 'paragraph'">
            <TextEditor v-model="field.content" />
          </div>

          <!-- Other Modules -->
          <div
            v-else
            class="flex justify-between items-center bg-sky-500 border-2 border-sky-500 text-white rounded my-2 min-w-[318px] max-w-[600px]"
          >
            <p class="px-2">
              {{ field.label }}
            </p>

            <div
              @click="handleOpen(field.type, field.id)"
              class="bg-white p-1 pl-2"
            >
              <Edit class="text-gray-700" />
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </main>
</template>

<script setup>
import draggable from "vuedraggable";
import Plus from "vue-material-design-icons/Plus.vue";
import Edit from "vue-material-design-icons/PencilOutline.vue";
import { useFormStore } from "@/stores/Form";
import { useModalsStore } from "@/stores/Modals";
import TextEditor from "./TextEditor.vue";

const store = useFormStore();
const modalStore = useModalsStore();

const fields = store.fields;

// Handle when a new field is dragged from palette
const onFieldAdded = (event) => {
  // Remove auto-added item
  fields.splice(event.newIndex, 1);

  const rawField = event.item.__draggable_context.element;
  const newField = {
    ...rawField,
    id: crypto.randomUUID(),
    label: "",
    placeholder: "",
    content: "",
  };

  if (newField.type === "paragraph") {
    // Prevent duplicate paragraphs
    if (fields.some((f) => f.type === "paragraph")) {
      console.warn("Paragraph already exists.");
      return;
    }

    // Immediately add paragraph so <TextEditor /> renders
    fields.splice(event.newIndex, 0, newField);
    return;
  }

  // For other field types, open modal and wait for attributes
  modalStore.openModal(newField.type, newField.id, {
    onSave: (attributes) => {
      fields.splice(event.newIndex, 0, { ...newField, ...attributes });
    },
  });
};

// open modal manually when editing
const handleOpen = (fieldType, fieldId) => {
  modalStore.openModal(fieldType, fieldId);
};
</script>

