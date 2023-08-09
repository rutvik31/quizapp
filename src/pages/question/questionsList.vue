<template>
  <v-container>
    <v-row class="ma-0">
      <v-col cols="12" class="pa-0">
        <v-card outlined>
          <v-data-table :headers="headers" :items="questionList">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title> Questions List </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="openDialog" color="primary">Add Question</v-btn>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogVisible" persistent scrollable max-width="500px">
      <v-card>
        <v-card-title>
          Add question
          <v-spacer />
          <v-icon @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-text-field
            v-model="question"
            label="Question Name"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-for="(option, index) in options"
            :key="index"
            v-model="options[index]"
            :label="'Option ' + (index + 1)"
            outlined
            dense
          ></v-text-field>
          <v-select
            v-model="ansType"
            :items="items"
            label="Answer Type"
            outlined
            dense
          ></v-select>
          <v-select
            v-if="ansType"
            v-model="answer"
            :items="options"
            :multiple="ansType === 'multiple'"
            label="Correct Answer"
            outlined
            dense
          ></v-select>
          <v-select
            v-model="difficulty"
            :items="itemsForDifficulty"
            label="Select Difficulty"
            outlined
            dense
          ></v-select>
          <v-autocomplete
            v-model="tags"
            item-text="name"
            :items="tagsList"
            return-object
            outlined
            dense
            chips
            clearable
            label="Select tags"
            multiple
          ></v-autocomplete>
          <v-textarea
            v-model="notes"
            label="Write an appropriate note for this question if any."
            counter
            maxlength="120"
            single-line
            outlined
            dense
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="align-end justify-end pa-0">
          <v-btn
            @click="saveQuestion"
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
import { mapState, mapActions } from "vuex";
export default {
  name: "Question",
  data() {
    return {
      dialogVisible: false,
      question: "",
      options: ["", "", "", ""],
      answer: [],
      ansType: "",
      items: ["single", "multiple"],
      itemsForDifficulty: ["easy", "medium", "hard"],
      difficulty: "",
      tags: [],
      notes: "",
      headers: [
        { text: "Question", value: "question" },
        { text: "Answer", value: "answer" },
        { text: "AnsType", value: "ansType" },
        { text: "Difficulty", value: "difficulty" },
        { text: "Tags", value: "tags" },
        { text: "Notes", value: "notes" },
      ],
      questionList: [],
    };
  },
  computed: {
    tagsList() {
      return this.$store.state.tagsList;
    },
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async saveQuestion() {
      let answerIndex = null;

      if (this.ansType === "single") {
        answerIndex = this.options.indexOf(this.answer); // Single-choice answer index
      } else if (this.ansType === "multiple") {
        answerIndex = this.answer.map((option) => this.options.indexOf(option)); // Array of answer indices
      }
      const questionData = {
        question: this.question,
        options: this.options.filter((option) => option.trim() !== ""),
        answer: answerIndex,
        ansType: this.ansType,
        difficulty: this.difficulty,
        tags: this.tags.map((tag) => {
          return { name: tag.name, color: tag.color };
        }),
        notes: this.notes,
      };

      this.$api.question
        .createQuestionObject(questionData)
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
      this.question = "";
      this.options = ["", "", "", ""];
      this.answer = [];
      this.ansType = "";
      this.difficulty = "";
      this.tags = [];
      this.notes = "";
    },
    getQuestionsList() {
      this.$api.question.getQuestionsList().then((res) => {
        this.questionList = [...res.data];
      });
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
