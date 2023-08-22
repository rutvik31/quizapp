<template>
  <div>
    <v-dialog
      v-model="dialogVisible"
      scrollable
      persistent
      fullscreen
      transition="dialog-bottom-transition"
    >
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
              <v-col cols="12" class="py-0">
                <div class="ag-theme-balham">
                  <ag-grid-vue
                    :gridOptions="gridOptions"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :rowData="rowData"
                  ></ag-grid-vue>
                </div>
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
import { AgGridVue } from "ag-grid-vue";
import QuestionActionColumn from "@/components/grid-columns/QuestionActionColumn.vue";

export default {
  name: "QuizForm",
  components: {
    AgGridVue,
    QuestionActionColumn,
  },
  props: {
    value: Boolean,
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
    rowData() {
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
