<template>
  <v-row class="ma-0" justify="center">
    <v-col cols="12">
      <h1 class="text-center">{{ quiz?.title }} Test</h1>
      <p class="text-center">
        This test contains {{ quiz?.questions.length }} questions.
      </p>
      <v-btn color="primary" outlined @click="$router.go(-1)"> Go back </v-btn>
      <form @submit.prevent="submitQuiz" ref="form">
        <v-card
          outlined
          v-for="(question, index) in quiz?.questions"
          :key="question._id"
          class="my-4 pa-0"
        >
          <v-card-title>
            <h3>
              Question {{ index + 1 }} out of {{ quiz?.questions?.length }}
            </h3>
          </v-card-title>
          <v-card-text :class="{ 'pb-0': question.ansType === 'single' }">
            <span class="questions-text">{{ question?.question }}</span>
            <v-radio-group
              v-if="question.ansType === 'single'"
              v-model="selectedAnswers[index]"
            >
              <v-radio
                v-for="(option, optIndex) in question?.meta?.options"
                :key="optIndex"
                :label="option"
                :value="option"
                hide-details="true"
                class="options-style"
              >
                <template v-slot:label>
                  <h4>{{ option }}</h4>
                </template>
              </v-radio>
            </v-radio-group>
            <div v-if="question.ansType === 'multiple'">
              <v-checkbox
                v-model="selectedAnswers[index]"
                v-for="(option, optIndex) in question?.meta?.options"
                :key="optIndex"
                :label="option"
                :value="option"
                multiple
                hide-details="true"
                class="options-style"
                :class="{ 'mt-0': optIndex !== 0 }"
              >
                <template v-slot:label>
                  <h4>{{ option }}</h4>
                </template>
              </v-checkbox>
            </div>
          </v-card-text>
        </v-card>
        <v-btn class="float-right" outlined type="submit" color="primary">
          Submit Quiz
        </v-btn>
      </form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "QuizDetail",
  data() {
    return {
      quiz: null,
      selectedAnswers: [],
    };
  },
  created() {
    this.fetchQuiz(this.$route.params.id);
  },
  methods: {
    fetchQuiz(id) {
      this.$api.quiz.getQuizById(id).then((res) => {
        this.quiz = res?.data?.data;
      });
    },
    submitQuiz() {
      // Handle quiz submission logic here
    },
  },
};
</script>
