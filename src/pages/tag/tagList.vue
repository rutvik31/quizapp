<template>
  <v-container>
    <v-row class="ma-0">
      <v-col cols="12" class="px-0">
        <div class="d-flex align-center">
          <div class="header-title text-h5">Add Tag</div>
          <v-spacer></v-spacer>
          <v-menu offset-y left max-width="100%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon
                  color="#0277BD"
                  x-large
                  class="icon-margin-right"
                  @click="openDialog"
                >
                  mdi-plus-circle
                </v-icon>
              </v-btn>
            </template>
          </v-menu>
        </div>
      </v-col>
      <v-col cols="12" class="px-0">
        <v-text-field
          dense
          outlined
          v-model="searchValue"
          label="Search for tag"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-card outlined>
          <div class="ag-theme-balham">
            <ag-grid-vue
              style="width: 100%; height: 100%"
              :gridOptions="gridOptions"
              :columnDefs="columnDefs"
              :context="gridContext"
              :rowData="rowData"
              @grid-size-changed="gridSizeChanged"
            ></ag-grid-vue>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="itemsPerPage > 10">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @input="getTag"
        ></v-pagination>
      </v-col>
    </v-row>
    <TagForm
      ref="tagNameField"
      v-model="dialogVisible"
      @form-submitted="getTag"
    />
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import TagColumn from "@/components/grid-columns/TagActionColumn.vue";
import TagForm from "@/pages/tag/tagForm.vue";

export default {
  components: {
    AgGridVue,
    TagColumn,
    TagForm,
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
      searchValue: "",
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
  },
  computed: {
    rowData() {
      return this.$store?.state?.tags?.tagsList?.data;
    },
    gridContext() {
      return {
        deleteTag: this.deleteTag,
      };
    },
  },
  methods: {
    gridSizeChanged(grid) {
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
    handleValueChange(newQuery) {
      if (this.searchValue === newQuery) {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
          this.getTag();
        }, 1000);
      }
    },
    getTag() {
      const queryParams = {
        search: this.searchValue,
        page: this.currentPage,
        perPage: this.itemsPerPage,
      };
      this.$store.dispatch("tags/getTagsList", queryParams).then(() => {
        this.totalPages =
          this.$store?.state?.tags?.tagsList?.pagination?.totalPages || 1;
      });
    },
    async deleteTag(tagId) {
      try {
        await this.$store.dispatch("tags/deleteTag", tagId);
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
