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
          <h1 class="font-serif text-lg font-bold">CUSTOM DROPDOWN LIST</h1>
          <Close @click="handleClose" />
        </div>

        <!-- Body -->
        <div class="flex flex-col gap-2.5 p-8 bg-white">
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
          <!-- Show Field -->
          <div class="grid grid-cols-[120px_1fr] gap-2 mx-4">
            <p class="text-gray-900 font-semibold">Show Field:</p>
            <select
              v-model="formData.option"
              class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 w-1xl sm:w-2xl rounded-sm"
            >
              <option
                class="bg-gray-100 rounded"
                v-for="option in options"
                :value="option.value"
                :key="option.id"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
          <!-- Source (all checkbox fields) -->
          <div class="grid grid-cols-[120px_1fr] gap-2 mx-4">
            <p class="text-gray-900 font-semibold">Select Source:</p>
            <select
              v-model="formData.source"
              class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 w-1xl sm:w-2xl rounded-sm"
            >
              <option
                class="bg-gray-100 rounded"
                v-for="field in checkboxfields"
                :value="field.label"
                :key="field.id"
              >
                {{ field.label }}
              </option>
            </select>
          </div>
          <!-- Operator -->
          <div class="grid grid-cols-[120px_1fr] gap-2 mx-4">
            <p class="text-gray-900 font-semibold">Operator:</p>
            <select
              v-model="formData.operator"
              class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 w-1xl sm:w-2xl rounded-sm"
            >
              <option
                class="bg-gray-100 rounded"
                v-for="operator in operators"
                :value="operator.value"
                :key="operator.id"
              >
                {{ operator.text }}
              </option>
            </select>
          </div>
          <!-- Condition -->
          <div class="grid grid-cols-[120px_1fr] gap-2 mx-4">
            <p class="text-gray-900 font-semibold">Condition:</p>
            <select
              v-model="formData.condition"
              class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 w-1xl sm:w-2xl rounded-sm"
            >
              <option
                class="bg-gray-100 rounded"
                v-for="condition in conditions"
                :value="condition.value"
                :key="condition.id"
              >
                {{ condition.text }}
              </option>
            </select>
          </div>
          <!-- list items -->
          <div class="ml-4">
            <p class="text-gray-900 font-semibold mb-2">List Items:</p>
            <p
              v-if="formData.options.length === 0"
              class="font-semibold text-red-600 mt-1"
            >
              Please enter at least one dropdown item
            </p>

            <!-- Render existing options -->

            <div
              v-for="(option, index) in formData.options"
              :key="index"
              class="flex gap-3 mb-2 ml-3 mt-4"
            >
              <input
                type="text"
                v-model="formData.options[index]"
                class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 w-full sm:w-2xl rounded-sm"
              /><span
                v-if="index !== 0"
                @click="deleteOption(index)"
                class="text-red-600"
                ><Delete
              /></span>
            </div>

            <!-- New option input -->
            <div class="flex flex-col gap-2 mt-4 ml-3">
              <input
                type="text"
                v-model="newOption"
                placeholder="Enter new option"
                class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 w-full sm:w-2xl rounded-sm"
              />
              <button
                class="text-sky-500 text-sm font-semibold cursor-pointer text-start"
                @click="addOption"
              >
                Add New
              </button>
            </div>
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
import Delete from "vue-material-design-icons/TrashCanOutline.vue";
import { watch } from "vue";
const store = useModalsStore();
const formStore = useFormStore();
const checkboxfields = formStore.checkboxFields;
const formData = reactive({
  fieldId: null,
  label: "",
  checked: false,
  options: [],
  option: "",
  condition: "",
  operator: "",
  source: "",
});
const options = reactive([
  {
    id: "1",
    text: "Always",
    value: "always",
  },
  { id: "2", text: "If", value: "if" },
]);
const conditions = reactive([
  {
    id: "1",
    text: "Checked",
    value: "checked",
  },
  { id: "2", text: "UnChecked", value: "unchecked" },
]);
const operators = reactive([
  {
    id: "1",
    text: "Is",
    value: "is",
  },
  { id: "2", text: "Is Not", value: "isnot" },
]);

// new option
const newOption = ref("");
// add option
const addOption = () => {
  if (newOption.value.trim() !== "") {
    formData.options.push(newOption.value.trim());
    newOption.value = "";
  }
};
const deleteOption = (index) => {
  console.log("delete function called", index);
  formData.options.splice(index, 1);
};
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
      formData.options = [];
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
      formData.options = [];
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