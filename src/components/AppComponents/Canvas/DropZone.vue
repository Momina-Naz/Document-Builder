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
      :group="{ name: 'modules', put: true }"
      @add="onFieldAdded"
    >
      <template #item="{ element: field }">
        <div>
          <!-- Paragraph Module -->
          <div v-if="field.type === 'paragraph'">
            <TextEditor v-model="field.content" />
          </div>
          <!-- Page Break -->
          <div v-if="field.type === 'pagebreak'">
            <PageBreak />
          </div>
          <!-- Group -->

          <div v-if="field.type === 'group'">
            <draggable
              class="w-full min-h-[200px] border border-sky-500 border-dashed my-3 px-2"
              :list="field.children"
              :group="{ name: 'modules', put: true }"
              @add="(event) => onChildAdded(event, field)"
            >
              <template #item="{ element: child }">
                <div>
                  <div v-if="child.type === 'paragraph'">
                    <TextEditor v-model="child.content" />
                  </div>

                  <div v-if="child.type === 'pagebreak'">
                    <PageBreak />
                  </div>
                  <!-- DropDown -->
                  <div
                    v-if="child.type === 'dropdown'"
                    class="flex justify-between items-center bg-sky-500 border-2 border-sky-500 text-white rounded my-2 min-w-[318px] max-w-[600px]"
                  >
                    <select
                      class="w-full border-none focus:outline-none outline-none"
                    >
                      <option class="bg-sky-400 max-w-[300px]">
                        {{ child.label }}
                      </option>
                      <option
                        v-for="option in child.options"
                        :key="option.id"
                        :value="option"
                        class="bg-white text-sky-500 rounded max-w-[300px]"
                      >
                        {{ option }}
                      </option>
                    </select>

                    <!--pass parent group here -->
                    <div
                      @click.stop="handleOpen(child.type, child.id, field)"
                      class="bg-white p-1 pl-2"
                    >
                      <Edit class="text-gray-700" />
                    </div>
                  </div>

                  <div
                    v-if="
                      child.type !== 'dropdown' &&
                      child.type !== 'pagebreak' &&
                      child.type !== 'group' &&
                      child.type !== 'paragraph'
                    "
                    class="flex justify-between items-center bg-sky-500 border-2 border-sky-500 text-white rounded my-2 min-w-[318px] max-w-[600px]"
                  >
                    <p class="px-2">{{ child.label }}</p>

                    <!--  pass parent group  -->
                    <div
                      @click.stop="handleOpen(child.type, child.id, field)"
                      class="bg-white p-1 pl-2"
                    >
                      <Edit class="text-gray-700" />
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
          </div>

          <!-- Select -->
          <div
            v-if="field.type === 'dropdown'"
            class="flex justify-between items-center bg-sky-500 border-2 border-sky-500 text-white rounded my-2 min-w-[318px] max-w-[600px]"
          >
            <select class="w-full border-none focus:outline-none outline-none">
              <option class="bg-sky-400">{{ field.label }}</option>
              <option
                v-for="option in field.options"
                :key="option.id"
                :value="option"
                class="bg-white text-sky-500 rounded"
              >
                {{ option }}
              </option>
            </select>

            <div
              @click="handleOpen(field.type, field.id)"
              class="bg-white p-1 pl-2"
            >
              <Edit class="text-gray-700" />
            </div>
          </div>
          <!-- Other Modules -->
          <div
            v-if="
              field.type !== 'dropdown' &&
              field.type !== 'pagebreak' &&
              field.type !== 'group' &&
              field.type !== 'paragraph'
            "
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
</template><script setup>
import draggable from "vuedraggable";
import Plus from "vue-material-design-icons/Plus.vue";
import Edit from "vue-material-design-icons/PencilOutline.vue";
import { useFormStore } from "@/stores/Form";
import { useModalsStore } from "@/stores/Modals";
import TextEditor from "./TextEditor.vue";
import PageBreak from "@/components/Modals/PageBreak.vue";

const store = useFormStore();
const modalStore = useModalsStore();

const fields = store.fields;

// Handle when a new field is dragged from palette
const onFieldAdded = (event) => {
  // Remove placeholder
  fields.splice(event.newIndex, 1);

  const rawField = event.item.__draggable_context.element;
  const newField = {
    ...rawField,
    id: crypto.randomUUID(),
  };

  // Paragraph and pagebreak
  if (newField.type === "paragraph") {
    if (fields.some((f) => f.type === "paragraph")) {
      console.warn("Paragraph already exists.");
      return;
    }
    fields.splice(event.newIndex, 0, { ...newField, content: "" });
    return;
  }

  if (newField.type === "pagebreak") {
    fields.splice(event.newIndex, 0, newField);
    return;
  }

  if (newField.type === "group") {
    fields.splice(event.newIndex, 0, { ...newField, children: [] });
    return;
  }

  //  open modal
  modalStore.openModal(newField.type, newField.id, {
    type: "root",
    parentId: null,
    insertIndex: event.newIndex, // store exact drop index
  });
};

const onChildAdded = (event, parentField) => {
  const children = parentField.children;
  children.splice(event.newIndex, 1); // remove placeholder

  const rawField = event.item.__draggable_context.element;
  const newField = {
    ...rawField,
    id: crypto.randomUUID(),
  };

  //  Paragraph
  if (newField.type === "paragraph") {
    if (children.some((f) => f.type === "paragraph")) {
      console.warn("Paragraph already exists in group.");
      return;
    }
    children.splice(event.newIndex, 0, { ...newField, content: "" });
    return;
  }

  if (newField.type === "pagebreak") {
    children.splice(event.newIndex, 0, newField);
    return;
  }

  //  Open modal
  modalStore.openModal(newField.type, newField.id, {
    type: "group",
    parentId: parentField.id,
    insertIndex: event.newIndex,
  });
};

// open modal manually when editing
const handleOpen = (fieldType, fieldId, parentField = null) => {
  const parentContext = parentField
    ? { type: "group", parentId: parentField.id }
    : { type: "root", parentId: null };

  modalStore.openModal(fieldType, fieldId, parentContext);
};
</script>
