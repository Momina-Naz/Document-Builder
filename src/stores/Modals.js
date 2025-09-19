import { defineStore } from "pinia";

export const useModalsStore = defineStore("Modals", {
  state: () => ({
    isOpen: false,
    activeModule: "",
    activeType: "",
    preview: false,
    parentContext: null,
  }),
  actions: {
    // open module's modal
    openModal(moduleType, fieldId, parentContext) {
      this.activeType = moduleType;
      this.activeModule = fieldId;
      this.isOpen = true;
      this.parentContext = parentContext;

      console.log("parentContext", this.parentContext, this.activeModule);
    },
    // close module
    closeModule() {
      this.isOpen = false;
      this.activeModule = "";
      this.activeType = "";
      this.parentContext = null;
    },

    // preview modal methods (unchanged)
    openPreview() {
      this.preview = true;
    },
    closePreview() {
      this.preview = false;
    },
  },
});
