<template>
  <div>
    <v-dialog v-model="dialogVisible" scrollable persistent max-width="600px">
      <v-card>
        <v-card-title class="px-4">
          <span class="text-h5">Add Quiz</span>
          <v-spacer />
          <v-icon @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="px-4">
          <v-form v-model="valid" ref="form">
            <v-row class="ma-0">
              <v-col cols="12">
                <v-text-field
                  v-model="quizObject.title"
                  label="Quiz Title"
                  outlined
                  dense
                  hide-details="auto"
                  :rules="[requiredRule('Quiz name')]"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="quizObject.description"
                  label="Write an appropriate description for this quiz."
                  hide-details="auto"
                  counter
                  maxlength="250"
                  single-line
                  outlined
                  dense
                  :rules="[requiredRule('Quiz description')]"
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="quizObject.questions"
                  :items="questionList"
                  item-text="_id"
                  item-value="_id"
                  chips
                  deletable-chips
                  multiple
                  small-chips
                  return-object
                  outlined
                  dense
                  clearable
                  label="Select Questions"
                  hide-details="auto"
                  :rules="[
                    (value) =>
                      !!(value && value.length) ||
                      'At least one question is required for a quiz to be created.',
                  ]"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="align-end justify-end pa-0">
          <v-btn
            :disabled="!valid"
            block
            depressed
            color="primary"
            class="rounded-0"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "QuizForm",
  props: {
    value: Boolean,
  },
  data() {
    return {
      quizObject: {
        title: "",
        description: "",
        questions: [],
      },
      valid: false,
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    questionList() {
      return this.$store?.state?.questions?.questionsList?.data;
    },
  },
  methods: {
    closeDialog() {
      this.resetForm();
      this.dialogVisible = false;
    },
    resetForm() {
      this.$refs.form.resetValidation();
    },
    requiredRule(fieldName) {
      return (value) => !!value || `${fieldName} is required`;
    },
  },
  mounted() {
    this.$store.dispatch("questions/getQuestionsList");
  },
};
</script>
