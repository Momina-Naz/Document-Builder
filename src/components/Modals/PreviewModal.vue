<template>
  <main>
    <!-- screen Overlay -->
    <div
      class="fixed inset-0 bg-black/50 z-40 flex justify-center items-center"
      @click.self="handleClose"
    >
      <!-- Modal Box -->
      <div class="fixed z-50 shadow max-w-4xl w-full">
        <div
          class="flex justify-between items-center bg-sky-600 py-4 px-4 text-white"
        >
          <h1 class="font-serif text-lg font-bold">PREVIEW WAIVER</h1>
          <Close @click="handleClose" />
        </div>
        <div class="flex flex-col gap-6 p-8 bg-white">
          <div class="flex flex-col gap-4">
            <!-- alternative text -->
            <div
              v-if="fields.length === 0 && formStore.editorData === ''"
              class="flex mx-auto"
            >
              <p class="text-lg text-gray-800 font-semibold">
                There is no field to show
              </p>
            </div>
            <!-- Editor data -->
            <div v-if="formStore.editorData !== ''" class="flex mx-auto">
              <div v-html="formStore.editorData"></div>
            </div>
            <div v-for="field in fields" :key="field.id">
              <div
                v-if="field.selected !== 'never'"
                class="grid grid-cols-[120px_1fr] gap-3"
              >
                <!-- label -->
                <label
                  v-if="field.label !== '' && field.type !== 'checkbox'"
                  :for="field.id"
                  class="text-lg font-semibold bg-sky-600 text-white py-1 px-3.5 rounded mr-2"
                  >{{ field.label }}
                </label>
                <!-- 1: Short Text -->
                <template v-if="field.type === 'shorttext'">
                  <input
                    class="bg-white py-1 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-600 rounded-sm"
                    :id="field.id"
                    type="text"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    :size="field.fieldWidth"
                  />
                </template>
                <!--2: Large Text -->
                <template v-if="field.type === 'largetext'">
                  <textarea
                    class="bg-white py-1 px-auto outline-2 outline-gray-200 focus:outline-sky-500 w-full rounded"
                    :id="field.id"
                    rows="0"
                    :required="field.required"
                  >
                   Write your words here...
                  </textarea>
                </template>
                <!-- 3: Email Field -->
                <template v-if="field.type === 'email'">
                  <input
                    class="bg-white py-1 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-600 rounded-sm"
                    :id="field.id"
                    type="text"
                    :placeholder="field.placeholder"
                    :pattern="field.pattern"
                    :required="field.required"
                    :size="field.fieldWidth"
                  />
                </template>
                <!-- 4: Date Field -->
                <template v-if="field.type === 'date'">
                  <input
                    class="bg-white py-1 px-2 outline-2 outline-gray-200 focus:outline-2 focus:outline-sky-600 rounded-sm"
                    :id="field.id"
                    type="date"
                    max="field.maxDate"
                    :placeholder="field.placeholder"
                    :pattern="field.pattern"
                    :required="field.required"
                  />
                </template>
                <!--5: Checkbox Field -->

                <template v-if="field.type === 'checkbox'">
                  <div
                    class="flex items-center gap-2 bg-sky-600 rounded min-w-[320px] px-2 py-1"
                  >
                    <input
                      class="bg-white py-1 px-2 rounded-sm h-6 w-6"
                      :id="field.id"
                      type="checkbox"
                      :required="field.required"
                    />
                    <span class="text-lg text-white font-semibold">{{
                      field.label
                    }}</span>
                  </div>
                </template>
              </div>
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
import { nextTick } from "vue";
import Close from "vue-material-design-icons/Close.vue";
const store = useModalsStore();
const formStore = useFormStore();
const fields = formStore.fields;
// close preview modal
const handleClose = async () => {
  store.closePreview();
  await nextTick();
};
</script>