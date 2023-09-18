<template>
  <v-row class="ma-0" justify="center">
    <v-col cols="12">
      <v-col cols="12" class="px-0">
        <v-progress-linear :value="progress" height="25" color="primary">
          <span class="white--text">
            <b>{{ progress }}%</b>
          </span>
        </v-progress-linear>
      </v-col>
      <form @submit.prevent="submitQuiz" ref="form">
        <v-card
          :key="quiz?.questions[currentQuestionIndex]._id"
          class="my-4 pa-0"
        >
          <v-card-text
            :class="{
              'pb-0':
                quiz?.questions[currentQuestionIndex].ansType === 'single',
            }"
          >
            <div class="d-flex align-center">
              <h3 class="px-2">Q.{{ currentQuestionIndex + 1 }}</h3>
              <span class="questions-text">{{
                quiz?.questions[currentQuestionIndex]?.question
              }}</span>
            </div>
            <v-radio-group
              v-if="quiz?.questions[currentQuestionIndex].ansType === 'single'"
              v-model="selectedAnswers[currentQuestionIndex]"
            >
              <v-radio
                v-for="(option, optIndex) in quiz?.questions[
                  currentQuestionIndex
                ]?.meta?.options"
                :key="optIndex"
                :label="option"
                :value="optIndex"
                hide-details="true"
                class="options-style"
              >
                <template v-slot:label>
                  <h4>{{ option }}</h4>
                </template>
              </v-radio>
            </v-radio-group>
            <div
              v-if="
                quiz?.questions[currentQuestionIndex].ansType === 'multiple'
              "
            >
              <v-checkbox
                v-model="selectedAnswers[currentQuestionIndex]"
                v-for="(option, optIndex) in quiz?.questions[
                  currentQuestionIndex
                ]?.meta?.options"
                :key="optIndex"
                :label="option"
                :value="optIndex"
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
          <v-divider />
          {{ selectedAnswers }}
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="showNextButton"
              @click="
                nextQuestion();
                calulateProgress();
              "
              color="primary"
              rounded
              large
            >
              Next
            </v-btn>
            <v-btn
              v-if="isLastQuestion"
              @click="calulateProgress"
              type="submit"
              color="primary"
              large
              rounded
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
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
      currentQuestionIndex: 0,
      progress: 0,
    };
  },
  created() {
    this.fetchQuiz(this.$route.params.id);
  },
  computed: {
    isLastQuestion() {
      return this.currentQuestionIndex === this.quiz?.questions.length - 1;
    },
    showNextButton() {
      return this.currentQuestionIndex < this.quiz?.questions.length - 1;
    },
  },
  methods: {
    fetchQuiz(id) {
      this.$api.quiz.getQuizById(id).then((res) => {
        this.quiz = res?.data?.data;
      });
    },
    async generatePayload() {
      const user = JSON.parse(localStorage.getItem("userDeatils"));
      const payload = {
        userId: user?._id,
        quizId: this.$route?.params?.id,
        answers: this.selectedAnswers,
      };
      return { ...payload };
    },
    async submitQuiz() {
      if (this.currentQuestionIndex === this.quiz?.questions.length - 1) {
        const payload = await this.generatePayload();
        this.$api.user
          .createUserQuizScore(payload)
          .then(() => {
            this.$bus.$emit(
              "showSnakeBar",
              "Quiz submitted successfully",
              "success"
            );
          })
          .catch(() => {
            this.$bus.$emit("showSnakeBar", "Error submitting quiz", "error");
          });
      }
    },
    calulateProgress() {
      if (this.quiz) {
        let answeredQuestions = this.selectedAnswers.filter((a) =>
          Array.isArray(a) ? a.length : true
        ).length;
        this.progress = Math.floor(
          (answeredQuestions / this.quiz.questions.length) * 100
        );
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.quiz?.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },
  },
};
</script>
