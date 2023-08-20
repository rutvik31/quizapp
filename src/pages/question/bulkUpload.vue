<template>
  <v-dialog v-model="uploadDialogVisible" max-width="400px">
    <v-card>
      <v-card-title>
        Upload Questions
        <v-spacer></v-spacer>
        <v-icon @click="closeUploadDialog">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-file-input
            v-model="file"
            accept=".xlsx"
            label="Select Excel File"
            @change="readFromFile"
          ></v-file-input>
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-btn
          :disabled="!file"
          block
          depressed
          class="rounded-0"
          @click="uploadData"
          color="primary"
        >
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import * as XLSX from "xlsx";
export default {
  name: "bulkUpload",
  props: {
    value: Boolean,
  },
  data() {
    return {
      questions: [],
      file: null,
    };
  },
  computed: {
    uploadDialogVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    closeUploadDialog() {
      this.uploadDialogVisible = false;
      this.$refs.form.reset();
    },
    readFromFile(file) {
      if (!file) {
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        this.questions = XLSX.utils.sheet_to_json(worksheet);
      };
      fileReader.readAsArrayBuffer(file);
    },
    async generatePayload() {
      const questions = [];
      while (this.questions.length) {
        const question = this.questions.pop();
        const items = question?.tags?.split(",");
        const resultObjects = items.map((item) => {
          const matches = item.trim().match(/^(.*?)\s+\((.*?)\)$/);
          if (matches) {
            return {
              name: matches[1],
              color: matches[2],
            };
          } else {
            return null;
          }
        });
        question.tags = resultObjects;
        question.options = question.options ? question.options.split(", ") : [];
        questions.push(question);
      }
      return [...questions];
    },
    async uploadData() {
      const payload = await this.generatePayload();
      this.$api.question
        .bulkUploadQuestions(payload)
        .then(() => {
          this.$bus.$emit(
            "showSnakeBar",
            "Question created successfully",
            "success"
          );
          this.$emit("upload-success");
          this.closeUploadDialog();
        })
        .catch(() => {
          this.$bus.$emit("showSnakeBar", "Error creating question", "error");
        });
    },
  },
};
</script>
