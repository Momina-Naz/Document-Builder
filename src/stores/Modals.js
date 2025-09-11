import { defineStore } from "pinia";

export const useModalsStore = defineStore("Modals", {
  state: () => ({
    isOpen: false,
    activeModule: "",
    activeType: "",
    preview: false,
  }),
  actions: {
    // open module's modal
    openModal(moduleType, fieldId) {
      this.activeType = moduleType;
      this.activeModule = fieldId;
      this.isOpen = true;
    },
    // close module's modal
    closeModule() {
      this.activeModule = "";
      this.isOpen = false;

      console.log("close module function called");
    },
    // open preview modal
    openPreview() {
      this.preview = true;
    },
    // close preview modal
    closePreview() {
      this.preview = false;
    },
  },
});
