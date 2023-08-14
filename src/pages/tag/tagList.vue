<template>
  <v-container>
    <v-row class="ma-0">
      <v-col cols="12" class="pa-0">
        <v-btn @click="openDialog" color="primary">Add Tag</v-btn>
        <v-card outlined>
          <div class="ag-theme-balham">
            <ag-grid-vue
              style="width: 100%; height: 100%"
              :gridOptions="gridOptions"
              :columnDefs="columnDefs"
              :context="gridContext"
              :rowData="rowData"
              @grid-size-changed="onGridReady"
            ></ag-grid-vue>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <createTagForm
      ref="tagNameField"
      v-model="dialogVisible"
      @form-submitted="getTag"
    />
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import TagColumn from "@/components/grid-columns/TagActionColumn.vue";
import createTagForm from "./createTagForm.vue";

export default {
  components: {
    AgGridVue,
    TagColumn,
    createTagForm,
  },
  name: "Tag",
  data() {
    return {
      dialogVisible: false,
      gridApi: null,
      gridOptions: {
        domLayout: "autoHeight",
      },
      columnDefs: [
        { headerName: "Name", field: "name" },
        { headerName: "Color", field: "color" },
        {
          headerName: "Actions",
          width: 100,
          sortable: false,
          cellRenderer: "TagColumn",
        },
      ],
    };
  },
  computed: {
    rowData() {
      return this.$store.state.tagsList;
    },
    gridContext() {
      return {
        deleteTag: this.deleteTag,
      };
    },
  },
  methods: {
    onGridReady(grid) {
      const columnCount = grid.columnApi.columnModel.gridColumns.length;
      grid.clientWidth / columnCount;
      grid?.api?.sizeColumnsToFit();
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.name = "";
      this.color = "#1976D2";
    },
    getTag() {
      this.$store.dispatch("getTagsList");
    },
    async deleteTag(tagId) {
      try {
        await this.$store.dispatch("deleteTag", tagId);
        this.$bus.$emit("showSnakeBar", "Tag deleted successfully", "success");
      } catch (err) {
        this.$bus.$emit("showSnakeBar", "Failed to delete tag.", "error");
      }
    },
  },
  mounted() {
    this.getTag();
  },
};
</script>
