<template>
  <v-container>
    <v-row class="ma-0">
      <v-col cols="12" class="px-0">
        <div class="d-flex align-center">
          <div class="header-title text-h5">Add Question</div>
          <v-spacer></v-spacer>
          <v-menu offset-y left max-width="100%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon color="#0277BD" x-large class="icon-margin-right">
                  mdi-plus-circle
                </v-icon>
              </v-btn>
            </template>
            <v-list class="py-0">
              <v-list-item @click="openDialog">
                <v-list-item-title>Add Single</v-list-item-title>
              </v-list-item>
              <v-list-item @click="openUploadDialog">
                <v-list-item-title>Bulk Upload</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-col>
      <v-col cols="4" class="px-0">
        <v-text-field
          dense
          outlined
          v-model="searchValue"
          label="Search for a question"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="4" class="pr-0">
        <v-select
          ref="answer"
          v-model="tagValue"
          :items="tagList"
          item-text="name"
          item-value="name"
          label="Filter by tags"
          hide-details="auto"
          multiple
          outlined
          dense
        />
      </v-col>
      <v-col cols="4" class="pr-0">
        <v-select
          ref="answer"
          v-model="diffValue"
          :items="diffArray"
          label="Filter by difficulty"
          hide-details="auto"
          multiple
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-card outlined>
          <div class="ag-theme-balham">
            <ag-grid-vue
              style="width: 100%; height: 100%"
              :gridOptions="gridOptions"
              :columnDefs="columnDefs"
              :rowData="rowData"
              :context="gridContext"
              @grid-size-changed="gridSizeChanged"
            ></ag-grid-vue>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="itemsPerPage > 10">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @input="getQuestionsList"
        ></v-pagination>
      </v-col>
    </v-row>
    <QuestionForm
      v-model="dialogVisible"
      :user-data="userData"
      @form-submitted="getQuestionsList"
    />
    <BulkUpload
      v-model="uploadDialogVisible"
      @upload-success="getQuestionsList"
    />
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import QuestionActionColumn from "@/components/grid-columns/QuestionActionColumn.vue";
import QuestionActionDeleteAndEdit from "@/components/grid-columns/QuestionActionDeleteAndEdit.vue";
import QuestionForm from "@/pages/question/questionForm.vue";
import BulkUpload from "./bulkUpload.vue";

export default {
  name: "Question",
  components: {
    AgGridVue,
    QuestionActionColumn,
    QuestionActionDeleteAndEdit,
    QuestionForm,
    BulkUpload,
  },
  data() {
    return {
      columnDefs: [
        { headerName: "Question", field: "question", resizable: true },
        {
          headerName: "Answer",
          field: "answer",
          cellRenderer: (params) => {
            const answerIndex = params?.data?.answer;
            const ansType = params?.data?.ansType;
            const answerTypes = params?.data?.meta?.options;

            return ansType === "single" &&
              answerIndex !== undefined &&
              answerIndex < answerTypes.length
              ? answerTypes[answerIndex]
              : ansType === "multiple" && answerIndex instanceof Array
              ? answerIndex.map((index) => answerTypes[index]).join(", ")
              : "";
          },
        },
        { headerName: "AnsType", field: "ansType" },
        { headerName: "Difficulty", field: "difficulty" },
        {
          headerName: "Tags",
          cellRenderer: "QuestionActionColumn",
          resizable: true,
        },
        { headerName: "Notes", field: "notes", resizable: true },
        {
          headerName: "Actions",
          cellRenderer: "QuestionActionDeleteAndEdit",
          width: 100,
          sortable: false,
        },
      ],
      dialogVisible: false,
      uploadDialogVisible: false,
      gridApi: null,
      gridOptions: {
        domLayout: "autoHeight",
      },
      userData: null,
      searchValue: "",
      tagValue: "",
      diffValue: "",
      diffArray: ["easy", "medium", "hard"],
      debounceTimer: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 0,
    };
  },
  watch: {
    searchValue(newQuery) {
      this.handleValueChange(newQuery);
    },
    tagValue(newQuery) {
      this.handleValueChange(newQuery);
    },
    diffValue(newQuery) {
      this.handleValueChange(newQuery);
    },
  },
  computed: {
    gridContext() {
      return {
        editQuestion: this.editQuestion,
      };
    },
    rowData() {
      return this.$store?.state?.questions?.questionsList?.data;
    },
    tagList() {
      return this.$store?.state?.tags?.tagsList?.data;
    },
  },
  methods: {
    openDialog() {
      this.userData = null;
      this.dialogVisible = true;
    },
    openUploadDialog() {
      this.uploadDialogVisible = true;
    },
    gridSizeChanged(grid) {
      grid?.api?.sizeColumnsToFit();
    },
    handleValueChange(newQuery) {
      if (this.searchValue || this.tagValue || this.diffValue === newQuery) {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
          this.getQuestionsList();
        }, 1000);
      }
    },
    getQuestionsList() {
      const queryParams = {
        search: this.searchValue,
        tags: Array.isArray(this.tagValue)
          ? this.tagValue.join(",")
          : this.tagValue,
        difficulty: Array.isArray(this.diffValue)
          ? this.diffValue.join(",")
          : this.diffValue,
        page: this.currentPage,
        perPage: this.itemsPerPage,
      };

      this.$store
        .dispatch("questions/getQuestionsList", queryParams)
        .then(() => {
          this.totalPages =
            this.$store?.state?.questions?.questionsList?.pagination
              ?.totalPages || 1;
        });
    },
    editQuestion(id) {
      this.$api.question.getQuestionById(id).then((res) => {
        const { options, tags } = res?.data?.data?.meta;
        delete res?.data?.data?.meta;
        this.userData = { options, tags, ...res?.data?.data };
        this.dialogVisible = true;
      });
    },
  },
  mounted() {
    this.getQuestionsList();
  },
};
</script>

<style scoped>
.max-width {
  max-width: none !important;
}
.icon-margin-right {
  margin-right: 3px;
}
</style>
