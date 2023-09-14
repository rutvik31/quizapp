<template>
  <v-row class="ma-0">
    <v-col cols="12">
      <div class="header-title text-h5">Scores</div>
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
        },
        { headerName: "Score", field: "score" },
      ],
      gridOptions: {
        domLayout: "autoHeight",
      },
      rowData: [],
    };
  },
  computed: {
    userId() {
      const id = JSON.parse(localStorage.getItem("userDeatils"));
      return id._id;
    },
  },
  methods: {
    getuserScore() {
      this.$api.user.getUserQuizScore(this.userId).then((res) => {
        this.rowData = res?.data?.data;
      });
    },
  },
  mounted() {
    this.getuserScore();
  },
};
</script>
