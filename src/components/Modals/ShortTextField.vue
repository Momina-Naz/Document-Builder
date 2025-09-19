<template>
  <main>
    <!-- screen Overlay -->
    <div
      class="fixed inset-0 bg-black/50 z-40 flex justify-center items-center"
      @click.self="handleClose"
    >
      <!-- Modal Box -->
      <div class="relative z-50 max-w-4xl w-full shadow mx-5">
        <!--Header -->
        <div
          class="flex justify-between items-center bg-sky-600 py-4 px-4 text-white"
        >
          <h1 class="font-serif text-lg font-bold">SHORT TEXT FIELD</h1>
          <Close @click="handleClose" />
        </div>
        <!-- Body -->
        <div class="flex flex-col gap-4 p-8 bg-white">
          <!-- Field Id -->
          <div class="grid grid-cols-[120px_1fr] gap-2 mx-4">
            <p class="text-gray-900 font-semibold">Field ID:</p>
            <input
              v-model="formData.fieldId"
              type="text"
              class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 w-1xl sm:w-2xl rounded-sm"
            />
          </div>
          <!-- Label -->
          <div class="grid grid-cols-[120px_1fr] gap-2 mx-4">
            <p class="text-gray-900 font-semibold">Label:</p>
            <input
              v-model="formData.label"
              type="text"
              class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 rounded-sm w-1xl sm:w-2xl right-0"
            />
          </div>
          <!-- Placeholder -->
          <div class="grid grid-cols-[120px_1fr] gap-2 mx-4">
            <p class="text-gray-900 font-semibold">Placeholder:</p>
            <input
              v-model="formData.placeholder"
              type="text"
              class="bg-gray-100 py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 rounded-sm w-1xl sm:w-2xl"
            />
          </div>
          <!-- Required -->
          <div class="flex gap-15 mx-4">
            <p class="text-gray-900 font-semibold">Required:</p>
            <input
              v-model="formData.checked"
              type="checkbox"
              class="bg-gray-100 py-0.5 px-2 rounded-sm right-0 w-5"
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
          <!-- Field Width -->
          <div class="grid grid-cols-[120px_1fr] gap-2 mx-4">
            <p class="text-gray-900 font-semibold">Field Width:</p>
            <div class="flex gap-4">
              <button
                @click="handlewidth"
                class="border-2 border-sky-500 py-1 px-6 bg-white text-gray-800 rounded cursor-pointer"
              >
                100%
              </button>
              <button
                @click="handleHalfwidth"
                class="border-2 border-sky-500 bg-sky-500 py-1 px-8 text-white rounded cursor-pointer"
              >
                50%
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
import { nextTick, reactive } from "vue";
import { watch } from "vue";
import Close from "vue-material-design-icons/Close.vue";
const store = useModalsStore();
const formStore = useFormStore();
const checkboxfields = formStore.checkboxFields;
const formData = reactive({
  fieldId: null,
  label: "",
  placeholder: "",
  checked: false,
  fieldWidth: "",
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

// close modal
const handleClose = async () => {
  store.closeModule();
  await nextTick();
};
// handlewidth
const handlewidth = () => {
  formData.fieldWidth = 80;

  console.log("fieldwidth", formData.fieldWidth);
};
const handleHalfwidth = () => {
  formData.fieldWidth = 40;
};
watch(
  () => store.activeModule, // activeModule has field's id
  (fieldId) => {
    if (!fieldId) {
      // reset for new field creation
      formData.label = "";
      formData.placeholder = "";
      formData.checked = false;
      formData.fieldWidth = "";
      formData.selected = "";
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
      formData.placeholder = "";
      formData.checked = false;
      formData.fieldWidth = "";
      formData.selected = "";
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

