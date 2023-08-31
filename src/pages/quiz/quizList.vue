<template>
  <div>
    <v-row class="ma-0">
      <v-col cols="12" class="px-0">
        <div class="d-flex align-center">
          <div class="header-title text-h5">Quiz</div>
          <v-spacer></v-spacer>
          <v-menu offset-y left max-width="100%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                outlined
                v-bind="attrs"
                v-on="on"
                @click="goToQuizForm"
              >
                Add
                <v-icon right dark>mdi-plus-circle-outline</v-icon>
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
          <AgGridList :columnDefs="columnDefs" :rowData="rowData"></AgGridList>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-pagination
          v-model="pagination.page"
          :disabled="totalPages === 1"
          :length="totalPages"
          @input="getQuizList"
        ></v-pagination>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AgGridList from "@/components/general/AgGridList.vue";
// mixins
import listMixin from "@/mixins/list.mixin";
export default {
  name: "Quizlist",
  mixins: [listMixin],
  components: {
    AgGridList,
  },
  data() {
    return {
      columnDefs: [
        { headerName: "Title", field: "title" },
        { headerName: "Description", field: "description" },
      ],
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
      return this.$store?.state?.quiz?.quizList?.data;
    },
  },
  methods: {
    goToQuizForm() {
      this.$router.push({ name: "admin-quizform" });
    },
    handleValueChange() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.getQuizList();
      }, 800);
    },
    getQuizList() {
      const params = {
        ...this.filters,
        ...this.pagination,
      };
      this.$store.dispatch("quiz/getQuizList", params).then(() => {
        this.totalPages =
          this.$store?.state?.quiz?.quizList?.pagination?.totalPages || 1;
      });
    },
  },
  mounted() {
    this.getQuizList();
  },
};
</script>
