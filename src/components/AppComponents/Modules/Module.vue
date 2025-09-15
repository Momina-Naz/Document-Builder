<template>
  <main class="container">
    <draggable
      class="flex flex-row gap-2 md:gap-0 md:flex-col overflow-auto scroll-smooth min-w-[220px]"
      v-model="modules"
      :item-key="'id'"
      :group="{ name: 'modules', pull: 'clone', put: false }"
      @end="handleDrop"
    >
      <template #item="{ element: module }">
        <div
          class="flex items-center gap-0.5 border-2 border-sky-500 mb-4 py-1.5 md:py-1.5 pl-2 pr-12 md:pr-8 rounded-lg text-sm text-sky-500 cursor-pointer"
        >
          <component :is="module.icon" />
          <div><Plus /></div>

          <p class="font-semibold w-[100px]">{{ module.name }}</p>
        </div>
      </template>
    </draggable>
  </main>
</template>

<script setup>
import { shallowRef } from "vue";
import draggable from "vuedraggable";
import MenuIcon from "vue-material-design-icons/Menu.vue";
import Calender from "vue-material-design-icons/Calendar.vue";
import Mail from "vue-material-design-icons/EmailOutline.vue";
import Checkbox from "vue-material-design-icons/CheckboxMarkedOutline.vue";
import Rectangel from "vue-material-design-icons/RectangleOutline.vue";
import Square from "vue-material-design-icons/SquareOutline.vue";
import Plus from "vue-material-design-icons/Plus.vue";
import { useModalsStore } from "@/stores/Modals";
const store = useModalsStore();
const modules = shallowRef([
  { id: "1", type: "paragraph", name: "Paragraph Text", icon: MenuIcon },
  { id: "2", type: "shorttext", name: "Short Text Field", icon: Rectangel },
  { id: "3", type: "largetext", name: "Large Text Field", icon: Square },
  { id: "4", type: "date", name: "Date of Birth", icon: Calender },
  { id: "5", type: "email", name: "Email", icon: Mail },
  { id: "6", type: "checkbox", name: "Checkbox", icon: Checkbox },
]);
// handle drop

const handleDrop = (event) => {
  const draggedModule = modules.value[event.oldIndex];
  console.log(modules.value);
  store.openModal(draggedModule.type, draggedModule.id);
};
</script>
