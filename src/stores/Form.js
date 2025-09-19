import { defineStore } from "pinia";
import { useModalsStore } from "./Modals";

export const useFormStore = defineStore("Form", {
  state: () => ({
    fields: [],
    currentField: null,
    parentContext: null,
  }),

  getters: {
    //  Getter to flatten all fields (including children of groups)
    allFields: (state) => {
      function flatten(fieldsArray) {
        const result = [];
        fieldsArray.forEach((field) => {
          result.push(field);
          if (field.type === "group" && Array.isArray(field.children)) {
            result.push(...flatten(field.children));
          }
        });
        return result;
      }
      return flatten(state.fields);
    },
    checkboxFields: (state) => {
      function flatten(fieldsArray) {
        const result = [];
        fieldsArray.forEach((field) => {
          if (field.type === "checkbox") result.push(field);
          if (field.type === "group" && Array.isArray(field.children)) {
            result.push(...flatten(field.children));
          }
        });
        return result;
      }
      return flatten(state.fields);
    },
  },

  actions: {
    setData(field) {
      const modalStore = useModalsStore();
      const fieldId = modalStore.activeModule;
      const parentContext = modalStore.parentContext;

      const insertIndex =
        parentContext?.insertIndex ??
        (parentContext?.type === "root" ? this.fields.length : 0);

      console.log("Parent Context:", parentContext?.value);

      if (parentContext?.type === "root") {
        const existingIndex = this.fields.findIndex((f) => f.id === fieldId);

        if (existingIndex !== -1) {
          this.fields[existingIndex] = {
            ...this.fields[existingIndex],
            ...field,
          };
        } else {
          const newField = { ...field, id: fieldId };
          this.fields.splice(insertIndex, 0, newField);
        }
      }

      if (parentContext?.type === "group") {
        const parentIndex = this.fields.findIndex(
          (f) => f.id === parentContext.parentId
        );

        if (parentIndex !== -1) {
          const parentGroup = this.fields[parentIndex];
          if (!parentGroup.children) parentGroup.children = [];

          const existingIndex = parentGroup.children.findIndex(
            (f) => f.id === fieldId
          );

          if (existingIndex !== -1) {
            parentGroup.children[existingIndex] = {
              ...parentGroup.children[existingIndex],
              ...field,
            };
          } else {
            const newChildField = { ...field, id: fieldId };
            parentGroup.children.splice(insertIndex, 0, newChildField);
          }

          // reactivity
          this.fields[parentIndex] = { ...parentGroup };
        }
      }

      console.log("Updated fields:", this.fields);
    },
  },
});
