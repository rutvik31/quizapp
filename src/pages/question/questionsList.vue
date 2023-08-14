<template>
  <v-container>
    <v-row class="ma-0">
      <v-col cols="12" class="pa-0">
        <v-btn @click="openDialog" color="primary">Add Question</v-btn>
        <v-card outlined>
          <div class="ag-theme-balham">
            <ag-grid-vue
              style="width: 100%; height: 100%"
              :gridOptions="gridOptions"
              :columnDefs="columnDefs"
              :rowData="rowData"
              :context="gridContext"
              @grid-size-changed="onGridReady"
            ></ag-grid-vue>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <CreateQuestionForm
      v-model="dialogVisible"
      :user-data="userData"
      @form-submitted="getQuestionsList"
    />
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import QuestionActionColumn from "@/components/grid-columns/QuestionActionColumn.vue";
import QuestionActionDeleteAndEdit from "@/components/grid-columns/QuestionActionDeleteAndEdit.vue";
import CreateQuestionForm from "./createQuestionForm.vue";

export default {
  name: "Question",
  components: {
    AgGridVue,
    QuestionActionColumn,
    QuestionActionDeleteAndEdit,
    CreateQuestionForm,
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
      valid: false,
      gridApi: null,
      gridOptions: {
        domLayout: "autoHeight",
      },
      rowData: [],
      userData: null,
    };
  },
  computed: {
    gridContext() {
      return {
        editQuestion: this.editQuestion,
      };
    },
  },
  methods: {
    openDialog() {
      this.userData = null;
      this.dialogVisible = true;
    },
    onGridReady(grid) {
      const columnCount = grid.columnApi.columnModel.gridColumns.length;
      grid.clientWidth / columnCount;
      grid?.api?.sizeColumnsToFit();
    },
    getQuestionsList() {
      this.$api.question.getQuestionsList().then((res) => {
        this.rowData = [...res?.data?.data];
      });
    },
    editQuestion(id) {
      this.$api.question.getQuestionById(id).then((res) => {
        this.userData = res?.data?.data;
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
