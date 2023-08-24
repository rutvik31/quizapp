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
      <QuestionsListFilter @filter-changed="handleFilterChanged" />
      <v-col cols="12" class="pa-0">
        <v-card outlined>
          <div class="ag-theme-balham">
            <ag-grid-vue
              :gridOptions="gridOptions"
              :columnDefs="columnDefs"
              :defaultColDef="defaultColDef"
              :rowData="rowData"
              :context="gridContext"
              @grid-size-changed="gridSizeChanged"
            ></ag-grid-vue>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-pagination
          v-model="pagination.currentPage"
          :disabled="pagination.totalPages === 1"
          :length="pagination.totalPages"
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
import QuestionsListFilter from "@/components/filters/QuestionsListFilter.vue";
export default {
  name: "Question",
  components: {
    AgGridVue,
    QuestionActionColumn,
    QuestionActionDeleteAndEdit,
    QuestionForm,
    QuestionsListFilter,
    BulkUpload,
  },
  data() {
    return {
      columnDefs: [
        {
          headerName: "Question",
          field: "question",
          sortable: true,
        },
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
        { headerName: "AnsType", field: "ansType", sortable: true },
        { headerName: "Difficulty", field: "difficulty", sortable: true },
        { headerName: "Tags", cellRenderer: "QuestionActionColumn" },
        { headerName: "Notes", field: "notes" },
        {
          headerName: "Actions",
          cellRenderer: "QuestionActionDeleteAndEdit",
          width: 100,
        },
      ],
      defaultColDef: {
        resizable: true,
        cellStyle: {
          "font-size": "14px",
          "font-family": "'Roboto'",
        },
      },
      gridOptions: {
        domLayout: "autoHeight",
      },
      dialogVisible: false,
      uploadDialogVisible: false,
      gridApi: null,
      userData: null,
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 0,
      },
      ansTypeArray: ["single", "multiple"],
      diffArray: ["easy", "medium", "hard"],
      debounceTimer: null,
    };
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
    handleFilterChanged(filters) {
      const keys = Object.keys(filters);
      while (keys.length) {
        const key = keys.pop();
        if (!filters[key] || !filters[key]?.length) delete filters[key];
        if (Array.isArray(filters[key])) filters[key] = filters[key].join(",");
      }
      this.getQuestionsList(filters);
    },
    async getQuestionsList(params = {}) {
      params = {
        ...params,
        ...this.pagination,
      };

      this.$store.dispatch("questions/getQuestionsList", params).then(() => {
        this.pagination.totalPages =
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
