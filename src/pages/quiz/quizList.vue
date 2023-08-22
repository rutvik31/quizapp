<template>
  <v-container>
    <v-row class="ma-0">
      <v-col cols="12" class="px-0">
        <div class="d-flex align-center">
          <div class="header-title text-h5">Add Quiz</div>
          <v-spacer></v-spacer>
          <v-menu offset-y left max-width="100%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon
                  @click="openDialog"
                  color="#0277BD"
                  x-large
                  class="icon-margin-right"
                >
                  mdi-plus-circle
                </v-icon>
              </v-btn>
            </template>
          </v-menu>
        </div>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-card outlined>
          <div class="ag-theme-balham">
            <ag-grid-vue
              style="width: 100%; height: 100%"
              :columnDefs="columnDefs"
              :defaultColDef="defaultColDef"
              :gridOptions="gridOptions"
              :rowData="rowData"
              @grid-size-changed="gridSizeChanged"
            ></ag-grid-vue>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <QuizForm v-model="dialogVisible" />
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import QuizForm from "@/pages/quiz/quizForm.vue";

export default {
  name: "Quizlist",
  components: {
    AgGridVue,
    QuizForm,
  },
  data() {
    return {
      columnDefs: [
        { headerName: "Title", field: "title" },
        { headerName: "Description", field: "description" },
      ],
      gridApi: null,
      gridOptions: {
        domLayout: "autoHeight",
      },
      defaultColDef: {
        resizable: true,
        cellStyle: {
          "font-size": "14px",
          "font-family": "'Roboto'",
        },
      },
      rowData: [],
      dialogVisible: false,
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    gridSizeChanged(grid) {
      grid?.api?.sizeColumnsToFit();
    },
    getQuizList() {
      this.$api.quiz.getQuizList().then((res) => {
        this.rowData = [...res?.data?.data];
      });
    },
  },
  mounted() {
    this.getQuizList();
  },
};
</script>
