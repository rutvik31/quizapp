<template>
  <v-row class="ma-0">
    <v-col cols="9">
      <div class="header-title text-h5">Results</div>
    </v-col>
    <v-col cols="12" class="py-0">
      <AgGridList
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
        :rowData="rowData"
      >
      </AgGridList>
    </v-col>
  </v-row>
</template>
<script>
import AgGridList from "@/components/general/AgGridList.vue";
import moment from "moment";
export default {
  name: "QuizScore",
  components: {
    AgGridList,
  },
  data() {
    return {
      columnDefs: [
        {
          headerName: "Quiz Name",
          field: "quizName",
          sortable: true,
        },
        { headerName: "Score", field: "score", sortable: true },
        {
          headerName: "Time Ago",
          field: "createdAt",
          sortable: true,
          valueFormatter: (params) => {
            const createdAt = moment(params.value);
            return createdAt.fromNow();
          },
        },
      ],
      gridOptions: {
        domLayout: "autoHeight",
        pagination: true,
        paginationPageSize: 10,
      },
    };
  },
  computed: {
    rowData() {
      return this.$store?.state?.result?.resultsList?.data;
    },
    userId() {
      const id = JSON.parse(localStorage.getItem("userDeatils"));
      return id._id;
    },
  },
  methods: {
    getuserScore() {
      this.$store.dispatch("result/getResultsList", this.userId);
    },
  },
  mounted() {
    this.getuserScore();
  },
};
</script>
