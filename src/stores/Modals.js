import { defineStore } from "pinia";

export const useModalsStore = defineStore("Modals", {
  state: () => ({
    isOpen: false,
    activeModule: "",
    activeType: "",
    preview: false,

    // NEW: callbacks for add/edit flow
    onSaveCallback: null,
    onCancelCallback: null,
  }),
  actions: {
    // open module's modal
    openModal(moduleType, fieldId, callbacks = {}) {
      this.activeType = moduleType;
      this.activeModule = fieldId;
      this.isOpen = true;

      // store optional callbacks (used when creating a field)
      this.onSaveCallback = callbacks.onSave || null;
      this.onCancelCallback = callbacks.onCancel || null;
    },

    // called by modal when user clicks "Save"
    saveAndClose(attributes) {
      if (this.onSaveCallback) {
        this.onSaveCallback(attributes);
      }
      this.resetModalState();
    },

    // called by modal when user clicks "Cancel"
    cancelAndClose() {
      if (this.onCancelCallback) {
        this.onCancelCallback();
      }
      this.resetModalState();
    },

    // close module's modal manually (no callbacks)
    closeModule() {
      this.resetModalState();
      console.log("close module function called");
    },

    // reset modal state completely
    resetModalState() {
      this.isOpen = false;
      this.activeModule = "";
      this.activeType = "";
      this.onSaveCallback = null;
      this.onCancelCallback = null;
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
