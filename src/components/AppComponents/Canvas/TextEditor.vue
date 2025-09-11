<template>
  <main>
    <Editor
      api-key="7dfpezqxp88yji7bgq2rq0mtz6nwyfxks6f7eim9xd5v3vkn"
      v-model="editorContent"
      :init="{
        toolbar_mode: 'sliding',
        height: '350px',
        plugins: [
          // Core editing features
          'anchor',
          'autolink',
          'charmap',
          'codesample',
          'emoticons',
          'link',
          'lists',
          'media',
          'searchreplace',
          'table',
          'visualblocks',
          'wordcount',
          'mediaembed',
          'casechange',
          'formatpainter',
          'pageembed',
          'a11ychecker',
          'tinymcespellchecker',
          'permanentpen',
          'powerpaste',
          'advtable',
          'advcode',
          'advtemplate',
          'ai',
          'uploadcare',
          'mentions',
          'tinycomments',
          'tableofcontents',
          'footnotes',
          'mergetags',
          'autocorrect',
          'typography',
          'inlinecss',
          'markdown',
          'importword',
          'exportword',
          'exportpdf',
        ],
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) =>
          respondWith.string(() =>
            Promise.reject('See docs to implement AI Assistant')
          ),
        uploadcare_public_key: '495181e4800295e8e6d6',
      }"
      initial-value="Use this module to create the content for your wavier. Enter clear, concise text,
       including all necessary legal terms, conditions and instructions for your clients. Use the formatting tools to structure the content effectively.
        If pasting from <b>PDF</b>, please check your layout as a  structure often creates a new line instead of complete sentence."
    />
    <button
      @click="handleSave"
      class="mt-1 ml-1 bg-sky-500 text-white px-4 py-1 text-sm font-semibold rounded cursor-pointer"
    >
      Save Content
    </button>
  </main>
</template>
<script setup>
import { ref } from "vue";
import Editor from "@tinymce/tinymce-vue";
import { useFormStore } from "@/stores/Form";
const editorContent = ref(
  "Use this module to create the content for your wavier.Enter clear, concise text including all necessary legal terms, conditions and instructions for your clients. Use the formatting tools to structure the content effectively. If pasting from <b>PDF</b>, please check your layout as a <b>PDF's</b>  structure often creates a new line instead of complete sentence."
);
const store = useFormStore();
const handleSave = () => {
  store.editorData = editorContent.value;
  console.log(store.editorData);
};
</script>