<template>
  <div>
    <v-row class="ma-0">
      <v-col cols="12" class="px-0">
        <div class="d-flex align-center">
          <div class="header-title text-h5">Tags</div>
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
          v-model="filters.search"
          :clearable="true"
          label="Search for tag"
          hide-details="auto"
        >
          <template v-slot:append>
            <v-icon>mdi-magnify</v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" class="px-0">
        <ag-grid-vue
          class="ag-theme-balham"
          style="width: 100%; height: 100%"
          :gridOptions="gridOptions"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :context="gridContext"
          :rowData="rowData"
          @grid-size-changed="gridSizeChanged"
        ></ag-grid-vue>
      </v-col>
      <v-col cols="12">
        <v-pagination
          v-model="pagination.page"
          :disabled="totalPages === 1"
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
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import TagColumn from "@/components/grid-columns/TagActionColumn.vue";
import TagForm from "@/pages/tag/tagForm.vue";
// mixins
import listMixin from "@/mixins/list.mixin";
export default {
  name: "TagList",
  mixins: [listMixin],
  components: {
    AgGridVue,
    TagColumn,
    TagForm,
  },
  name: "Tag",
  data() {
    return {
      dialogVisible: false,
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
    };
  },
  watch: {
    filters: {
      deep: true,
      handler(filter) {
        this.handleValueChange(filter);
      },
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
    handleValueChange() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.getTag();
      }, 800);
    },
    getTag() {
      const params = {
        ...this.filters,
        ...this.pagination,
      };
      this.$store.dispatch("tags/getTagsList", params).then(() => {
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
