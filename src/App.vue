<template>
  <main class="min-h-screen">
    <!-- body -->
    <div class="flex flex-col md:flex-row">
      <DragModules />
      <Canvas />
    </div>
  </main>
  <Teleport to="body">
    <div v-if="isOpen">
      <ShortTextField v-if="activeModule === 'shorttext'" />
      <LargeTextField v-if="activeModule === 'largetext'" />
      <BirthdayField v-if="activeModule === 'date'" />
      <EmailField v-if="activeModule === 'email'" />
      <CheckboxField v-if="activeModule === 'checkbox'" />
      <DropDown v-if="activeModule === 'dropdown'" />
      <Signature v-if="activeModule === 'signature'" />
    </div>
  </Teleport>
</template>
<script setup>
import { computed } from "vue";

import DragModules from "./components/AppComponents/Modules/DragModules.vue";
import { useModalsStore } from "./stores/Modals";
import ShortTextField from "./components/Modals/ShortTextField.vue";
import LargeTextField from "./components/Modals/LargeTextField.vue";
import EmailField from "./components/Modals/EmailField.vue";
import CheckboxField from "./components/Modals/CheckboxField.vue";
import BirthdayField from "./components/Modals/BirthdayField.vue";
import Canvas from "./components/AppComponents/Canvas/Canvas.vue";
import DropDown from "./components/Modals/DropDown.vue";
import Signature from "./components/Modals/Signature.vue";
const store = useModalsStore();
const isOpen = computed(() => store.isOpen);
const activeModule = computed(() => store.activeType);
</script>
