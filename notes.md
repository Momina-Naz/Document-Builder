modify event obj to solve the problem of duplication in canvas
import { watch } from "vue";

<template>
  <main class="flex flex-col justify-center items-center mx-auto w-full">
    <div
      v-if="draggedModule.length === 0"
      class="flex items-center gap-1 text-sky-500 text-lg italic"
    >
      Add Modules <plus />
    </div>
    <draggable
      class="w-full min-h-[100px]"
      v-model="draggedModule"
      :group="{ name: 'modules', pull: 'clone', put: true }"
      @add="handleAdd"
    >
      <template #item="{ element: module }">
        <component :is="getComponent(module.type)" />
      </template>
    </draggable>

    <!-- Fields created by user -->
    <div
      v-if="store.currentField !== null"
      class="grid grid-cols-1 mt-8 mx-0 md:mx-4 md:grid-cols-2 gap-x-5 gap-y-4 w-full bg-gray-100 p-4 border border-sky-500 border-dashed rounded-lg"
    >
      <div v-for="field in fields" :key="field.id">
        <div
          class="flex justify-between items-center bg-sky-500 border-2 border-sky-500 text-white rounded"
        >
          <p class="px-2">
            {{ field.label || "Participant Settings" }}
          </p>
          <div
            @click="handleOpen(field.type, field.id)"
            class="bg-white p-1 pl-2"
          >
            <Edit class="text-gray-700" />
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup>
import Plus from "vue-material-design-icons/Plus.vue";
import Edit from "vue-material-design-icons/PencilOutline.vue";
import draggable from "vuedraggable";
import { useFormStore } from "@/stores/Form";
import { useModalsStore } from "@/stores/Modals";
import { ref } from "vue";
import TextEditor from "./TextEditor.vue";

const store = useFormStore();
const modalStore = useModalsStore();
const fields = store.fields;
const draggedModule = ref([]);

//  Prevent duplicates when field is dropped
const handleAdd = (event) => {
  const newItem = event.item.__draggable_context.element;

  // Exclude the last pushed item when checking for duplicates
  const existingWithoutNew = draggedModule.value.slice(0, -1);
  const alreadyExists = existingWithoutNew.some((m) => m.type === newItem.type);

  if (alreadyExists) {
    // Remove only the just-added duplicate
    draggedModule.value.pop();
    console.log(`Duplicate "${newItem.type}" ignored`);
  }
};

//   render component if it's present
const getComponent = (type) => {
  switch (type) {
    case "paraghraph":
      return TextEditor;
    default:
      return null;
  }
};

const handleOpen = (fieldType, fieldId) => {
  console.log("open module function called");
  console.log(fieldType, fieldId);
  modalStore.openModal(fieldType, fieldId);
};
</script>
<template>
  <main class="flex flex-col justify-center items-center mx-auto w-full">
    <draggable
      class="w-full bg-amber-100 min-h-screen"
      v-model="canvasItems"
      :group="{ name: 'modules', pull: 'clone', put: true }"
    >
      <template #item="{ element: item }">
        <div>
          <!-- Paragraph Text Module -->
          <div v-if="item.name === 'Paragraph Text'">
            <TextEditor />
          </div>

          <!-- User Created Field -->
          <div v-else-if="item.type === 'field'">
            <div
              class="flex justify-between items-center bg-sky-500 border-2 border-sky-500 text-white rounded"
            >
              <p class="px-2">
                {{ item.label || "Participant Settings" }}
              </p>
              <div
                @click="handleOpen(item.type, item.id)"
                class="bg-white p-1 pl-2"
              >
                <Edit class="text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>

  </main>
</template>

<script setup>
import draggable from "vuedraggable";
import Edit from "vue-material-design-icons/PencilOutline.vue";
import { useFormStore } from "@/stores/Form";
import { ref, watch } from "vue";
import TextEditor from "./TextEditor.vue";

const store = useFormStore();

// this array will hold everything that appears in the drop zone
const canvasItems = ref([]);

// keep canvas items in sync with store.fields
watch(
  () => store.fields,
  (newFields) => {
    // remove old fields and add new ones so we don't duplicate
    canvasItems.value = [
      ...canvasItems.value.filter((item) => item.type !== "field"),
      ...newFields.map((field) => ({
        type: "field",
        id: field.id,
        label: field.label,
      })),
    ];
  },
  { immediate: true, deep: true }
);
</script>
