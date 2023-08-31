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
export default {
  name: "AgGridList",
  components: {
    AgGridVue,
  },
  props: {
    gridContext: {
      type: Object,
    },
    columnDefs: {
      type: Array,
    },
    rowData: {
      type: Array,
    },
  },
  data() {
    return {
      defaultColDef: {
        resizable: true,
        cellStyle: {
          "font-size": "14px",
          "font-family": "'Roboto'",
        },
      },
      gridOptions: {
        domLayout: "autoHeight",
        rowSelection: "multiple",
      },
      gridApi: null,
    };
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
