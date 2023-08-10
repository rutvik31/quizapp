<template>
  <v-container>
    <v-row class="ma-0">
      <v-col cols="12" class="pa-0">
        <v-btn @click="openDialog" color="primary">Add Tag</v-btn>
        <v-card outlined>
          <div class="ag-theme-balham" style="height: 400px">
            <!-- sizeColumnsToFit -->
            <ag-grid-vue
              style="height: 100%"
              :gridOptions="gridOptions"
              :columnDefs="columnDefs"
              @grid-ready="onGridReady"
              :context="gridContext"
              :rowData="rowData"
              class="ag-theme-balham"
            ></ag-grid-vue>
          </div>
          <!-- <v-data-table :headers="headers" :items="tagsList">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title> Tags List </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="openDialog" color="primary">Add Tag</v-btn>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon color="red" @click="deleteTag(item._id)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table> -->
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogVisible" class="" max-width="500px">
      <v-card>
        <v-card-title>
          Add tag name and select color
          <v-spacer />
          <v-icon @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-text-field
            ref="tagNameField"
            outlined
            dense
            v-model="name"
            label="Tag Name"
            :rules="[requiredRule('Tag Name')]"
          ></v-text-field>
          <v-color-picker
            v-model="color"
            hide-canvas
            mode="hexa"
            class="pa-0 py-4 max-width"
            label="Tag Color"
          >
          </v-color-picker>
        </v-card-text>
        <v-card-actions class="align-end justify-end pa-0">
          <v-btn
            @click="saveTag"
            block
            depressed
            color="primary"
            class="rounded-0"
            :disabled="!name"
          >
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import TagColumn from "@/components/grid-columns/TagActionColumn.vue";

export default {
  components: {
    AgGridVue,
    TagColumn,
  },
  name: "Tag",
  data() {
    return {
      dialogVisible: false,
      name: "",
      color: "#0277BD",
      gridApi: null,
      gridOptions: {},
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
      grid?.api?.sizeColumnsToFit();
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.name = "";
      this.color = "#1976D2";
      this.$refs.tagNameField.resetValidation();
    },
    async generateTagPayload() {
      return {
        name: this.name,
        color: this.color,
      };
    },
    async saveTag() {
      const payload = await this.generateTagPayload();
      this.$store
        .dispatch("createTag", payload)
        .then(() => {
          this.$bus.$emit(
            "showSnakeBar",
            "Tag created successfully",
            "success"
          );
        })
        .catch((err) => {
          this.$bus.$emit(
            "showSnakeBar",
            err?.response?.data?.message,
            "error"
          );
        });
      this.closeDialog();
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
    requiredRule(fieldName) {
      return (value) => !!value || `${fieldName} is required`;
    },
  },
  mounted() {
    this.getTag();
  },
};
</script>

<style scoped>
.max-width {
  max-width: none !important;
}
</style>
