<template>
  <main>
    <!-- Screen Overlay -->
    <div
      class="fixed inset-0 bg-black/50 z-40 flex justify-center items-center"
      @click.self="handleClose"
    >
      <!-- Modal Box -->
      <div class="fixed z-50 shadow max-w-4xl w-full">
        <!-- Header -->
        <div
          class="flex justify-between items-center bg-sky-600 py-4 px-4 text-white"
        >
          <h1 class="font-serif text-lg font-bold">PREVIEW WAIVER</h1>
          <Close @click="handleClose" />
        </div>

        <!-- Modal Content -->
        <div
          class="flex flex-col justify-between gap-6 p-8 bg-white min-h-[300px]"
        >
          <div class="flex flex-col gap-4">
            <!-- Empty message -->
            <div v-if="pages.length === 0" class="flex mx-auto">
              <p class="text-lg text-gray-800 font-semibold">
                There is no field to show
              </p>
            </div>

            <!-- Show Current Page -->
            <template v-if="pages.length > 0">
              <div v-for="field in pages[currentPageIndex]" :key="field.id">
                <div>
                  <!-- Paragraph -->
                  <div
                    v-if="
                      formStore.editorData !== '' && field.type === 'paragraph'
                    "
                    class="flex w-2xl md:w-3xl justify-center ml-2"
                  >
                    <div v-html="formStore.editorData"></div>
                  </div>

                  <!-- Short Text -->
                  <template
                    v-if="
                      field.type === 'shorttext' &&
                      (field.option === 'always' ||
                        (field.option === 'if' && evaluateCondition(field)))
                    "
                  >
                    <div class="grid grid-cols-[130px_1fr] gap-3">
                      <label
                        v-if="field.label !== ''"
                        :for="field.id"
                        class="text-lg font-semibold bg-sky-600 text-white py-1.5 px-3.5 rounded mr-2"
                        >{{ field.label }}
                      </label>
                      <input
                        class="bg-white py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-600 rounded-sm"
                        :id="field.id"
                        type="text"
                        :placeholder="field.placeholder"
                        :required="field.required"
                        :size="field.fieldWidth"
                      />
                    </div>
                  </template>

                  <!-- Large Text -->
                  <template v-if="field.type === 'largetext'">
                    <div class="grid grid-cols-[130px_1fr] gap-3">
                      <label
                        v-if="field.label !== ''"
                        :for="field.id"
                        class="text-lg font-semibold bg-sky-600 text-white py-1.5 px-3.5 rounded mr-2"
                        >{{ field.label }}
                      </label>
                      <textarea
                        class="bg-white py-0.5 px-auto outline-2 outline-gray-200 focus:outline-sky-500 w-full rounded"
                        :id="field.id"
                        :required="field.required"
                      >
                    Write your words here...
                    </textarea
                      >
                    </div>
                  </template>

                  <!-- Email -->
                  <template v-if="field.type === 'email'">
                    <div class="grid grid-cols-[130px_1fr] gap-3">
                      <label
                        v-if="field.label !== ''"
                        :for="field.id"
                        class="text-lg font-semibold bg-sky-600 text-white py-1.5 px-3.5 rounded mr-2"
                        >{{ field.label }}
                      </label>
                      <input
                        class="bg-white py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-600 rounded-sm"
                        :id="field.id"
                        type="text"
                        :placeholder="field.placeholder"
                        :pattern="field.pattern"
                        :required="field.required"
                        :size="field.fieldWidth"
                      />
                    </div>
                  </template>

                  <!-- Date -->
                  <template v-if="field.type === 'date'">
                    <div class="grid grid-cols-[130px_1fr] gap-3">
                      <label
                        v-if="field.label !== ''"
                        :for="field.id"
                        class="text-lg font-semibold bg-sky-600 text-white py-1 px-3.5 rounded mr-2"
                        >{{ field.label }}
                      </label>
                      <input
                        class="bg-white py-0.5 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-600 rounded-sm"
                        :id="field.id"
                        type="date"
                        max="field.maxDate"
                        :placeholder="field.placeholder"
                        :pattern="field.pattern"
                        :required="field.required"
                      />
                    </div>
                  </template>

                  <!-- Checkbox -->
                  <template v-if="field.type === 'checkbox'">
                    <div
                      class="flex items-center gap-2 bg-sky-600 rounded w-sm px-2 py-1"
                    >
                      <input
                        class="bg-white py-0.5 px-2 rounded-sm h-6 w-6"
                        v-model="checkboxStates[field.id]"
                        :id="field.id"
                        type="checkbox"
                        :required="field.required"
                      />
                      <span class="text-lg text-white font-semibold">
                        {{ field.label }}
                      </span>
                    </div>
                  </template>

                  <!-- Dropdown -->
                  <template
                    v-if="
                      field.type === 'dropdown' &&
                      (field.option === 'always' ||
                        (field.option === 'if' && evaluateCondition(field)))
                    "
                  >
                    <div class="grid grid-cols-[130px_1fr] gap-3">
                      <label
                        v-if="field.label !== ''"
                        :for="field.id"
                        class="text-lg font-semibold bg-sky-600 text-white py-1 px-3.5 rounded mr-2"
                        >{{ field.label }}
                      </label>
                      <select
                        class="bg-gray-100 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-500 w-full sm:w-2xl rounded-sm"
                      >
                        <option>Select one</option>
                        <option
                          v-for="option in field.options"
                          :key="option.id"
                          :value="option"
                          class="bg-gray-100 rounded"
                        >
                          {{ option }}
                        </option>
                      </select>
                    </div>
                  </template>

                  <!-- Signature -->
                  <template v-if="field.type === 'signature'">
                    <div>
                      <button
                        v-if="open === false"
                        @click="openSignature"
                        class="bg-[#0084D1] text-white font-semibold py-1.5 px-8 rounded cursor-pointer"
                      >
                        {{ field.label }}
                      </button>
                      <div
                        v-if="open"
                        class="border border-gray-400 border-dashed rounded-md bg-gray-50 w-[300px]"
                      >
                        <SignaturePad />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>

          <!-- Pagination Controls -->
          <div>
            <div
              v-if="pages.length > 1"
              class="flex justify-between items-center mb-0"
            >
              <button
                @click="prevPage"
                :disabled="currentPageIndex === 0"
                class="border-2 border-gray-300 bg-gray-100 px-6 py-1 rounded disabled:opacity-50"
              >
                Back
              </button>
              <p class="text-gray-600">
                Page {{ currentPageIndex + 1 }} of {{ pages.length }}
              </p>
              <button
                @click="nextPage"
                :disabled="currentPageIndex === pages.length - 1"
                class="border-2 border-sky-500 bg-sky-500 px-6 py-1 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <!-- Actions -->
            <div
              v-if="currentPageIndex === pages.length - 1"
              class="flex gap-4 justify-center items-center mt-7"
            >
              <button
                @click="handleClose"
                class="border-2 border-red-300 bg-red-100 py-0.5 px-10 text-red-500 font-semibold rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                @click="handleClose"
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
    </div>
  </main>
</template>
<script setup>
import { useModalsStore } from "@/stores/Modals";
import { useFormStore } from "@/stores/Form";
import { nextTick, ref, computed, reactive } from "vue";
import Close from "vue-material-design-icons/Close.vue";
import SignaturePad from "../AppComponents/SignaturePad.vue";

const store = useModalsStore();
const formStore = useFormStore();
const checkboxStates = reactive({});
const open = ref(false);
const currentPageIndex = ref(0);

// all fields
const allFields = computed(() => formStore.allFields);

// Split all fields into pages based on pagebreaks
const pages = computed(() => {
  const result = [];
  let currentPage = [];

  allFields.value.forEach((field) => {
    if (field.type === "pagebreak") {
      result.push(currentPage);
      currentPage = [];
    } else {
      currentPage.push(field);
    }
  });

  if (currentPage.length > 0) result.push(currentPage);
  return result;
});

// Navigation handlers
const nextPage = () => {
  if (currentPageIndex.value < pages.value.length - 1) {
    currentPageIndex.value++;
  }
};

const prevPage = () => {
  if (currentPageIndex.value > 0) {
    currentPageIndex.value--;
  }
};

const openSignature = () => {
  open.value = true;
};

const handleClose = async () => {
  store.closePreview();
  currentPageIndex.value = 0;
  await nextTick();
};
const evaluateCondition = (field) => {
  if (!field.source || !field.condition) return false;

  // find the source checkbox by label (
  const sourceField = allFields.value.find(
    (f) => f.label === field.source && f.type === "checkbox"
  );
  if (!sourceField) return false;

  const isChecked = checkboxStates[sourceField.id] ?? false;

  if (field.condition === "checked") return isChecked;
  if (field.condition === "unchecked") return !isChecked;

  return false;
};
</script>
