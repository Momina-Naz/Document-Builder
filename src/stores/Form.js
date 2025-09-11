import { defineStore } from "pinia";
import { useModalsStore } from "./Modals";
export const useFormStore = defineStore("Form", {
  state: () => ({ fields: [], currentField: null, type: "", editorData: "" }),
  actions: {
    setData(field) {
      const store = useModalsStore();
      const fieldId = store.activeModule;
      this.currentField = field;
      const existingIndex = this.fields.findIndex((f) => f.id === fieldId);
      console.log("existing field", existingIndex);
      if (existingIndex !== -1) {
        // update existing field
        this.fields[existingIndex] = {
          ...this.fields[existingIndex],
          ...field,
        };
      } else {
        // create a new field
        this.currentField = { ...field };
        this.fields.push(this.currentField);
      }

      console.log(this.fields);

      console.log(this.currentField);
    },
  },
});
