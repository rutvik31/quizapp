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
                  @click="goToQuizForm"
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
      <v-col cols="12" class="px-0">
        <v-text-field
          dense
          outlined
          v-model="queryFilters.searchValue"
          :clearable="true"
          label="Search for a question"
          hide-details="auto"
        >
          <template v-slot:append>
            <v-icon>mdi-magnify</v-icon>
          </template>
        </v-text-field>
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
      <v-col cols="12">
        <v-pagination
          v-model="queryFilters.currentPage"
          :disabled="queryFilters.totalPages === 1"
          :length="queryFilters.totalPages"
          @input="getQuizList"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";

export default {
  name: "Quizlist",
  components: {
    AgGridVue,
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
      queryFilters: {
        searchValue: "",
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 0,
      },
      debounceTimer: null,
    };
  },
  watch: {
    queryFilters: {
      deep: true,
      handler(newQuery) {
        this.handleValueChange(newQuery);
      },
    },
  },
  computed: {
    rowData() {
      return this.$store?.state?.quiz?.quizList?.data;
    },
    queryParams() {
      return {
        search: this.queryFilters?.searchValue,
        page: this.queryFilters?.currentPage,
        perPage: this.queryFilters?.itemsPerPage,
      };
    },
  },
  methods: {
    goToQuizForm() {
      this.$router.push({ name: "admin-quizform" });
    },
    gridSizeChanged(grid) {
      grid?.api?.sizeColumnsToFit();
    },
    handleValueChange(newQuery) {
      if (this.queryFilters.searchValue !== newQuery) {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
          this.getQuizList();
        }, 1000);
      }
    },
    getQuizList() {
      this.$store.dispatch("quiz/getQuizList", this.queryParams).then(() => {
        this.queryFilters.totalPages =
          this.$store?.state?.quiz?.quizList?.pagination?.totalPages || 1;
      });
    },
  },
  mounted() {
    this.getQuizList();
  },
};
</script>
