<template>
  <div class="ag-theme-balham">
    <ag-grid-vue
      :gridOptions="gridOptions"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :context="gridContext"
      @grid-size-changed="gridSizeChanged"
      @selection-changed="onSelectionChanged"
    ></ag-grid-vue>
  </div>
</template>
<script>
import { AgGridVue } from "ag-grid-vue";
//Components
import QuestionActionColumn from "@/components/grid-columns/QuestionActionColumn.vue";
import QuestionActionDeleteAndEdit from "@/components/grid-columns/QuestionActionDeleteAndEdit.vue";

export default {
  name: "AgGridList",
  components: {
    AgGridVue,
    QuestionActionColumn,
    QuestionActionDeleteAndEdit,
  },
  props: {
    gridContext: {
      type: Object,
    },
  },
  data() {
    return {
      columnDefs: [
        {
          headerName: "Question",
          field: "question",
          sortable: true,
          checkboxSelection: this.$route.fullPath === "/admin/quizform",
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
          hide: this.$route.fullPath === "/admin/quizform",
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
        rowSelection:
          this.$route.fullPath !== "/admin/quizform" ? "none" : "multiple",
      },
      gridApi: null,
    };
  },
  computed: {
    rowData() {
      return this.$store?.state?.questions?.questionsList?.data;
    },
  },
  methods: {
    gridSizeChanged(grid) {
      grid?.api?.sizeColumnsToFit();
    },
    onSelectionChanged(grid) {
      const selectedRows = grid?.api?.getSelectedRows();
      const dataId = selectedRows.map((id) => id._id);
      this.$emit("rows-clicked", [...dataId]);
    },
  },
};
</script>
