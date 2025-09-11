modify event obj to solve the problem of duplication in canvas
import { watch } from "vue";

watch(
() => store.activeModule, // activeModule holds the field's internal id
(fieldId) => {
if (!fieldId) {
// Reset for new field creation
formData.label = "";
formData.placeholder = "";
formData.checked = false;
formData.fieldWidth = "";
formData.selected = "";
formData.fieldId = ""; // user-entered value, reset as well
return;
}

    // Prefill formData for editing
    const existingField = formStore.fields.find((f) => f.id === fieldId);
    if (existingField) {
      Object.assign(formData, existingField); // this copies fieldId (user input) correctly
      //  Do NOT overwrite formData.fieldId with existingField.id
      // internal id is kept only for setData
    }

},
{ immediate: true }
);
