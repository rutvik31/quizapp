<template>
  <v-container>
    <v-row class="ma-0">
      <v-col cols="12" class="pa-0">
        <v-card outlined>
          <v-data-table
            :headers="headers"
            :items="questionList"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title> Questions List </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="openDialog" color="primary">Add Question</v-btn>
              </v-toolbar>
            </template>
            <template v-slot:[`item.tags`]="{ item }">
              <v-chip
                small
                class="white--text"
                v-for="tag in item.meta.tags"
                :key="tag._id"
                :color="tag.color"
                >{{ tag.name }}</v-chip
              >
            </template>
            <template v-slot:[`item.answer`]="{ item }">
              {{ answerString(item) }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogVisible" scrollable persistent max-width="600px">
      <v-card>
        <v-card-title class="px-4">
          <span class="text-h5">Add question </span>
          <v-spacer />
          <v-icon @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="px-4">
          <v-form v-model="valid">
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
                  return-object
                  outlined
                  dense
                  small-chips
                  clearable
                  label="Select tags"
                  hide-details="auto"
                  multiple
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
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "Question",
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

      headers: [
        { text: "Question", value: "question" },
        {
          text: "Answer",
          value: "answer",
          sortable: false,
          valueGetter: this.answerString,
        },
        { text: "AnsType", value: "ansType" },
        { text: "Difficulty", value: "difficulty" },
        { text: "Tags", value: "tags" },
        { text: "Notes", value: "notes" },
      ],
      dialogVisible: false,
      valid: false,
      itemsForDifficulty: ["easy", "medium", "hard"],
      questionList: [],
    };
  },
  computed: {
    tagsList() {
      return this.$store.state.tagsList;
    },
    answerString() {
      return (item) => {
        if (item.ansType === "single") {
          return item.meta.options[item.answer];
        } else if (item.ansType === "multiple") {
          return item.answer
            .map((index) => item.meta.options[index])
            .join(", ");
        }
        return "";
      };
    },
  },
  methods: {
    answerValidation() {
      this.questionObject.answer =
        this.questionObject.ansType === "single" ? "" : [];
      this.$refs?.answer?.resetValidation();
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async generateQuestionPayload() {
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
      const payload = await this.generateQuestionPayload();
      this.$api.question
        .createQuestionObject(payload)
        .then(() => {
          this.$bus.$emit(
            "showSnakeBar",
            "Question created successfully",
            "success"
          );
        })
        .catch((err) => {
          this.$bus.$emit("showSnakeBar", "Error creating question", "error");
        });

      // Clear the form fields
      this.dialogVisible = false;
      this.getQuestionsList();
      this.questionObject = {};
    },
    getQuestionsList() {
      this.$api.question.getQuestionsList().then((res) => {
        this.questionList = [...res.data.data];
      });
    },
    requiredRule(fieldName) {
      return (value) => !!value || `${fieldName} is required`;
    },
  },
  mounted() {
    this.$store.dispatch("getTagsList");
    this.getQuestionsList();
  },
};
</script>

<style scoped>
.max-width {
  max-width: none !important;
}
.icon-margin-right {
  margin-right: 3px;
}
</style>
