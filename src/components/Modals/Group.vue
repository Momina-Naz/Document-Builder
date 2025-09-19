<template>
  <draggable
    v-model="localFields"
    :group="{ name: 'modules', pull: 'clone', put: true }"
    @add="onFieldAdded"
    class="w-full min-h-[200px] border border-sky-500 border-dashed p-4 rounded bg-amber-500"
  >
    <template #item="{ element: field }">
      <div
        class="flex justify-between items-center bg-sky-100 border border-sky-300 rounded p-2 mb-2 w-full"
      >
        <p class="text-sky-700">{{ field.label || "New Field" }}</p>
        <button
          @click="editField(field)"
          class="bg-white text-sky-700 px-2 py-1 rounded"
        >
          Edit
        </button>
      </div>
    </template>
  </draggable>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  groupData: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["updateGroup"]);

const localFields = ref([...props.groupData]);

// Sync local fields back to parent whenever changed
watch(localFields, (newVal) => emit("updateGroup", newVal), { deep: true });

// Add field when dragged in
const onFieldAdded = (event) => {
  localFields.value.splice(event.newIndex, 1);

  const rawField = event.item.__draggable_context.element;
  const newField = {
    ...rawField,
    id: crypto.randomUUID(),
    label: rawField.label || "",
    placeholder: rawField.placeholder || "",
    content: rawField.content || "",
  };

  localFields.value.splice(event.newIndex, 0, newField);
};

const editField = (field) => {
  console.log("Edit field inside group", field);
};
</script>

