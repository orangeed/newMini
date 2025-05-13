<!-- pdf2word -->
<template>
  <div id="" class="h-full flex flex-col items-center">
    <div class="mb-4 mt-4 flex justify-start">
      <a-upload
        :auto-upload="false"
        :show-file-list="false"
        @change="handleChange"
      />
    </div>
    <div class="w-4/5" style="height: 90vh">
      <vue-office-docx :src="url" v-if="type == 'docx'"></vue-office-docx>
      <vue-office-excel :src="url" v-if="type == 'xlsx'"></vue-office-excel>
      <vue-office-pptx
        :src="url"
        v-if="type == 'pptx'"
        style="height: 100%"
      ></vue-office-pptx>
      <vue-office-pdf
        :src="url"
        v-if="type == 'pdf'"
        style="height: 100%"
      ></vue-office-pdf>
    </div>
  </div>
</template>

<script setup name="pdf2word">
//引入VueOfficeDocx组件
import VueOfficeDocx from "@vue-office/docx";
import VueOfficeExcel from "@vue-office/excel";
import VueOfficePptx from "@vue-office/pptx";
import VueOfficePdf from "@vue-office/pdf";
//引入相关样式
import "@vue-office/docx/lib/index.css";
import "@vue-office/excel/lib/index.css";
import { nextTick, ref } from "vue";

const url = ref("");

const type = ref("docx");
// 绑定文件上传事件
const handleChange = (fileItem) => {
  type.value = "";
  url.value = "";
  const file = fileItem[fileItem.length - 1].file;
  const fileNameList = file.name.split(".");
  type.value = fileNameList[fileNameList.length - 1];
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = (loadEvent) => {
    const arrayBuffer = loadEvent.target.result;
    url.value = arrayBuffer;
  };
  return false;
};
</script>

<style lang="scss" scoped></style>
