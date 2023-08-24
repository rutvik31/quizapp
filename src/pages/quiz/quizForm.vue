<template>
  <div>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          Create Quiz
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 2" step="2">
          Add Questions
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card flat>
            <v-card-text class="px-0">
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
                    <v-select
                      ref="answer"
                      :items="tagList"
                      item-text="name"
                      item-value="name"
                      label="Select tags to filter out questions type"
                      hide-details="auto"
                      multiple
                      outlined
                      dense
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
          <div class="d-flex align-end justify-end">
            <v-btn
              :disabled="!valid"
              @click="e1 = 2"
              color="primary"
              class="rounded-0 px-0"
            >
              Next
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card flat>
            <v-card-text class="px-0">
              <v-form v-model="valid" ref="form">
                <v-row class="ma-0">
                  <v-col cols="12" class="pa-0">
                    <div class="ag-theme-balham">
                      <ag-grid-vue
                        :gridOptions="gridOptions"
                        :columnDefs="columnDefs"
                        :defaultColDef="defaultColDef"
                        :rowData="rowData"
                        @selection-changed="onSelectionChanged"
                        @grid-size-changed="gridSizeChanged"
                      ></ag-grid-vue>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
          <div class="d-flex align-end justify-end">
            <v-btn @click="e1 = 1" color="primary" class="rounded-0">
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="rounded-0"
              @click="saveQuiz"
              :disabled="!valid"
            >
              Save
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>
<script>
import { AgGridVue } from "ag-grid-vue";
import QuestionActionColumn from "@/components/grid-columns/QuestionActionColumn.vue";

export default {
  name: "QuizForm",
  components: {
    AgGridVue,
    QuestionActionColumn,
  },
  data() {
    return {
      columnDefs: [
        {
          headerName: "Question",
          field: "question",
          sortable: true,
          checkboxSelection: true,
        },
        {
          headerName: "Answer",
          field: "answer",
          cellRenderer: (params) => {
            const answerIndex = params?.data?.answer;
            const ansType = params?.data?.ansType;
            const answerTypes = params?.data?.meta?.options;

            return ansType === "single" &&
              answerIndex !== undefined &&
              answerIndex < answerTypes.length
              ? answerTypes[answerIndex]
              : ansType === "multiple" && answerIndex instanceof Array
              ? answerIndex.map((index) => answerTypes[index]).join(", ")
              : "";
          },
        },
        { headerName: "AnsType", field: "ansType", sortable: true },
        { headerName: "Difficulty", field: "difficulty", sortable: true },
        { headerName: "Tags", cellRenderer: "QuestionActionColumn" },
        { headerName: "Notes", field: "notes" },
      ],
      defaultColDef: {
        resizable: true,
        cellStyle: {
          "font-size": "14px",
          "font-family": "'Roboto'",
        },
      },
      gridOptions: {
        domLayout: "autoHeight",
        rowSelection: "multiple",
      },
      quizObject: {
        title: "",
        description: "",
        questions: [],
      },
      valid: false,
      gridApi: null,
      fetchQuestionIds: "",
      e1: 1,
    };
  },
  computed: {
    tagList() {
      return this.$store?.state?.tags?.tagsList?.data;
    },
    rowData() {
      return this.$store?.state?.questions?.questionsList?.data;
    },
  },
  methods: {
    onSelectionChanged(grid) {
      const selectedRows = grid?.api?.getSelectedRows();
      this.fetchQuestionIds = selectedRows.map((id) => id._id);
    },
    gridSizeChanged(grid) {
      if (!this.gridApi) return;
      grid?.api?.sizeColumnsToFit();
    },
    resetForm() {
      this.$refs.form.resetValidation();
    },
    async generateQuizPayload() {
      const quizPayload = {
        ...this.quizObject,
        questions: this.fetchQuestionIds,
      };
      return quizPayload;
    },
    async saveQuiz() {
      const payload = await this.generateQuizPayload();
      this.$store
        .dispatch("quiz/createQuiz", payload)
        .then(() => {
          this.$bus.$emit(
            "showSnakeBar",
            "Quiz created successfully",
            "success"
          );
          this.resetForm();
          this.$router.push({ name: "admin-quiz" });
        })
        .catch(() => {
          this.$bus.$emit("showSnakeBar", "Error creating quiz", "error");
          this.resetForm();
        });
    },
    requiredRule(fieldName) {
      return (value) => !!value || `${fieldName} is required`;
    },
  },
  mounted() {
    this.$store.dispatch("questions/getQuestionsList");
    this.$store.dispatch("tags/getTagsList");
  },
};
</script>
