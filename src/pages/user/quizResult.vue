<template>
  <v-dialog
    v-model="resultDialogVisible"
    max-width="650px"
    scrollable
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>
        Result
        <v-spacer></v-spacer>
        <v-icon
          @click="
            closeResultDialog();
            $router.back();
          "
        >
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text>
        <div class="d-flex align-center justify-center">
          <v-icon size="100" color="#f4511e">mdi-fire</v-icon>
          <span class="text-h5"
            >Your Score is: {{ countScore }} out of
            {{ questionList.questions.length }}</span
          >
        </div>
        <div
          class="py-2"
          v-for="(question, index) in questionList?.questions"
          :key="question._id"
        >
          <v-card outlined>
            <v-card-text>
              <span class="text-body-1">
                <h4>Q.{{ index + 1 }}</h4>
                {{ question.question }}
              </span>
              <div
                v-for="(option, optIndex) in question.meta.options"
                :key="optIndex"
                :class="getClass(question, selectedAnswers[index], optIndex)"
                class="options-quiz"
              >
                {{ option }}
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "QuizResult",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    questionList: {
      required: true,
    },
    selectedAnswers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    resultDialogVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    countScore() {
      return this.questionList?.results.filter((a) => a).length;
    },
  },
  methods: {
    closeResultDialog() {
      this.resultDialogVisible = false;
    },
    getClass(question, selectedAnswer, optIndex) {
      if (selectedAnswer === undefined) return;
      if (question.answer !== selectedAnswer && selectedAnswer === optIndex) {
        return "wrong";
      } else if (question.answer === optIndex) {
        return "right";
      } else if (Array.isArray(question.answer)) {
        if (question.answer.includes(optIndex)) {
          return "right";
        } else if (selectedAnswer.includes(optIndex)) {
          return "wrong";
        }
      }
    },
  },
};
</script>
