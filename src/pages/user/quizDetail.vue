<template>
  <div>
    <v-container class="px-0 py-4">
      <v-progress-linear :value="progress" height="25" color="primary">
        <span class="white--text">
          <b>{{ progress }}% Completed</b>
        </span>
      </v-progress-linear>
      <form @submit.prevent="submitQuiz" ref="form">
        <div v-if="quiz?.timer" class="text-h6 d-flex justify-end pt-4">
          {{ formatTime(timer) }} Minutes left
        </div>
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
              <span class="questions-text">
                {{ quiz?.questions[currentQuestionIndex]?.question }}
              </span>
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
                  <span>{{ option }}</span>
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
                  <span>{{ option }}</span>
                </template>
              </v-checkbox>
            </div>
          </v-card-text>
          <v-divider />
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
              :disabled="isSubmitButtonDisabled"
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
    </v-container>
    <QuizResult
      v-model="showResultDialog"
      :questionList="questionList"
      :selectedAnswers="selectedAnswers"
    />
  </div>
</template>

<script>
import QuizResult from "@/pages/user/quizResult.vue";
import moment from "moment";

export default {
  name: "QuizDetail",
  components: {
    QuizResult,
  },
  data() {
    return {
      quiz: null,
      questionList: null,
      selectedAnswers: [],
      currentQuestionIndex: 0,
      progress: 0,
      showResultDialog: false,
      isSubmitButtonDisabled: false,
      timer: 0,
      timerInterval: null,
    };
  },
  created() {
    this.fetchQuiz(this.$route.params.id);
  },
  watch: {
    quiz: {
      handler() {
        if (this.quiz) {
          this.startTimer();
        }
      },
      deep: true,
    },
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
        this.isSubmitButtonDisabled = true;
        const payload = await this.generatePayload();
        this.$api.user
          .submitQuiz(payload)
          .then((res) => {
            this.$bus.$emit(
              "showSnakeBar",
              "Quiz submitted successfully",
              "success"
            );
            this.questionList = res.data?.data;
            this.showResultDialog = true;
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
    startTimer() {
      if (this.quiz && this.quiz.timer > 0) {
        const quizTimeInMinutes = this.quiz?.timer || 0;
        this.timer = quizTimeInMinutes * 60;

        this.timerInterval = setInterval(() => {
          if (this.timer > 0) {
            this.timer--;
          } else {
            clearInterval(this.timerInterval);
            this.submitQuiz();
          }
        }, 1000);
      }
    },
    formatTime(seconds) {
      const duration = moment.duration(seconds, "seconds");
      const minutes = String(duration.minutes()).padStart(2, "0");
      const remainingSeconds = String(duration.seconds()).padStart(2, "0");
      return `${minutes}:${remainingSeconds}`;
    },
  },
  beforeDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },
};
</script>
