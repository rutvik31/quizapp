<template>
  <div>
    <v-dialog v-model="dialogVisible" scrollable persistent max-width="600px">
      <v-card>
        <v-card-title class="px-4">
          <span class="text-h5">
            {{ userData ? "Edit Question" : "Add Question" }}
          </span>
          <v-spacer />
          <v-icon @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="px-4">
          <v-form v-model="valid" ref="form">
            <v-row class="ma-0">
              <v-col cols="12">
                <v-text-field
                  v-model="questionObject.question"
                  label="Question Name"
                  outlined
                  dense
                  hide-details="auto"
                  :rules="[requiredRule('Question Name')]"
                />
              </v-col>
              <v-col cols="12">
                <v-radio-group
                  class="py-0 mt-0 text-h5"
                  v-model="questionObject.ansType"
                  label="Select Answer Type:"
                  hide-details="auto"
                  row
                  @change="answerValidation"
                >
                  <v-radio label="Single" value="single"></v-radio>
                  <v-radio label="Multiple" value="multiple"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col
                cols="6"
                v-for="(option, index) in questionObject.options"
                :key="index"
              >
                <v-text-field
                  v-model.trim="questionObject.options[index]"
                  :label="'Option ' + (index + 1)"
                  outlined
                  dense
                  hide-details="auto"
                  :rules="[requiredRule('Options are')]"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  ref="answer"
                  v-model="questionObject.answer"
                  :items="questionObject.options"
                  :multiple="questionObject.ansType === 'multiple'"
                  :disabled="!questionObject.ansType"
                  label="Correct Answer"
                  hide-details="auto"
                  outlined
                  dense
                  :rules="[requiredRule('Answer is')]"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="questionObject.difficulty"
                  :items="itemsForDifficulty"
                  label="Select Difficulty"
                  hide-details="auto"
                  outlined
                  dense
                  :rules="[requiredRule('Difficulty is')]"
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="questionObject.tags"
                  item-text="name"
                  :items="tagsList"
                  chips
                  deletable-chips
                  multiple
                  small-chips
                  return-object
                  outlined
                  dense
                  clearable
                  label="Select tags"
                  hide-details="auto"
                  :rules="[
                    (value) =>
                      !!(value && value.length) ||
                      'At least one tag is required.',
                  ]"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="questionObject.notes"
                  label="Write an appropriate note for this question if any."
                  hide-details="auto"
                  counter
                  maxlength="120"
                  single-line
                  outlined
                  dense
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="align-end justify-end pa-0">
          <v-btn
            @click="saveQuestion"
            :disabled="!valid"
            block
            depressed
            color="primary"
            class="rounded-0"
          >
            {{ userData ? "Update" : "Save" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "QuestionForm",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    userData: Object,
  },
  data() {
    return {
      questionObject: {
        question: "",
        options: ["", "", "", ""],
        answer: [],
        ansType: "",
        difficulty: "",
        tags: [],
        notes: "",
      },
      valid: false,
      itemsForDifficulty: ["easy", "medium", "hard"],
    };
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        if (this.userData) {
          this.populateQuestionObject(this.userData);
        }
      } else {
        this.resetForm();
      }
    },
  },
  computed: {
    tagsList() {
      return this.$store?.state?.tags?.tagsList?.data;
    },
    dialogVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    closeDialog() {
      this.resetForm();
      this.dialogVisible = false;
      this.$refs.form.resetValidation();
    },
    resetForm() {
      this.questionObject = {
        options: ["", "", "", ""],
      };
      this.$refs.form.resetValidation();
    },
    async generatePayload() {
      let answerIndex = null;

      if (this.questionObject.ansType === "single") {
        answerIndex = this.questionObject.options.indexOf(
          this.questionObject.answer
        );
      } else if (this.questionObject.ansType === "multiple") {
        answerIndex = this.questionObject.answer.map((option) =>
          this.questionObject.options.indexOf(option)
        );
      }
      const questionPayload = {
        ...this.questionObject,
        answer: answerIndex,
        tags: this.questionObject.tags.map(({ name, color }) => {
          return { name, color };
        }),
      };
      return questionPayload;
    },
    async saveQuestion() {
      const payload = await this.generatePayload();
      if (this.userData) {
        this.$store
          .dispatch("questions/updateQuestion", {
            questionId: this.userData._id,
            questionData: payload,
          })
          .then(() => {
            this.$bus.$emit(
              "showSnakeBar",
              "Question updated successfully",
              "success"
            );
            // Clear the form fields
            this.$emit("form-submitted");
            this.closeDialog();
          })
          .catch((err) => {
            this.$bus.$emit("showSnakeBar", "Error updating question", "error");
          });
      } else {
        this.$store
          .dispatch("questions/saveQuestion", payload)
          .then(() => {
            this.$bus.$emit(
              "showSnakeBar",
              "Question created successfully",
              "success"
            );
            // Clear the form fields
            this.$emit("form-submitted");
            this.closeDialog();
          })
          .catch((err) => {
            this.$bus.$emit("showSnakeBar", "Error creating question", "error");
            this.closeDialog();
          });
      }
    },
    populateQuestionObject(data) {
      this.questionObject = {
        ...data,
      };

      if (this.questionObject.ansType === "single") {
        this.questionObject.answer =
          this.questionObject.options[this.questionObject.answer];
      } else if (this.questionObject.ansType === "multiple") {
        this.questionObject.answer = this.questionObject.answer.map(
          (index) => this.questionObject.options[index]
        );
      }
    },
    answerValidation() {
      this.questionObject.answer =
        this.questionObject.ansType === "single" ? "" : [];
      this.$refs?.answer?.resetValidation();
    },
    requiredRule(fieldName) {
      return (value) => !!value || `${fieldName} is required`;
    },
  },
  mounted() {
    this.$store.dispatch("tags/getTagsList");
  },
};
</script>
