<template>
  <v-row class="ma-0">
    <v-col cols="4" v-for="(items, index) in quizList" :key="index">
      <v-card outlined color="#F4F6F6">
        <v-card-title class="text-h5">{{ items.title }} Test </v-card-title>
        <v-card-subtitle class="py-2">
          This test is not official, it's just a nice way to see how much you
          know.
        </v-card-subtitle>
        <v-card-actions class="pa-0 d-flex justify-end">
          <v-btn color="primary" small block @click="getSingleQuiz(items._id)">
            Take a test now
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "UserQuizList",
  computed: {
    quizList() {
      return this.$store?.state?.quiz?.quizList?.data;
    },
  },
  methods: {
    getSingleQuiz(id) {
      this.$router.push({ name: "quizDetail", params: { id } });
    },
  },
  mounted() {
    this.$store.dispatch("quiz/getQuizList");
  },
};
</script>
