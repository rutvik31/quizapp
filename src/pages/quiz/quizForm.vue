<template>
  <div>
    <v-stepper :elevation="2" v-model="e1" vertical>
      <v-stepper-step step="1" :complete="e1 > 1"> Create Quiz </v-stepper-step>
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
      <v-stepper-step step="2" :complete="e1 > 2">
        Add Questions
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card flat>
          <v-card-text class="px-0">
            <v-form v-model="valid" ref="form">
              <v-row class="ma-0">
                <v-col cols="12" class="pa-0">
                  <AgGridList
                    @rows-clicked="handleSelectionChanged"
                    :gridOptions="gridOptions"
                    :columnDefs="columnDefs"
                    :rowData="rowData"
                  />
                </v-col>
                <v-col cols="12">
                  <v-pagination
                    v-model="pagination.page"
                    :disabled="totalPages === 1"
                    :length="totalPages"
                    @input="getQuestionsList"
                  ></v-pagination>
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
            :disabled="!fetchQuestionIds.length"
            color="primary"
            class="rounded-0"
            @click="saveQuiz"
          >
            Save
          </v-btn>
        </div>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>
<script>
import QuestionActionColumn from "@/components/grid-columns/QuestionActionColumn.vue";
import AgGridList from "@/components/general/AgGridList.vue";
// Mixins
import listMixin from "@/mixins/list.mixin";
export default {
  mixins: [listMixin],
  name: "QuizForm",
  components: {
    QuestionActionColumn,
    AgGridList,
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
        {
          headerName: "Actions",
          cellRenderer: "QuestionActionDeleteAndEdit",
          width: 100,
          hide: true,
        },
      ],
      gridOptions: {
        domLayout: "autoHeight",
        rowSelection: "multiple",
        rowMultiSelectWithClick: true,
      },
      quizObject: {
        title: "",
        description: "",
        questions: [],
      },
      valid: false,
      fetchQuestionIds: [],
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
    handleSelectionChanged(value) {
      this.fetchQuestionIds = value;
    },
    resetForm() {
      this.$refs.form.resetValidation();
    },
    async generatePayload() {
      const quizPayload = {
        ...this.quizObject,
        questions: this.fetchQuestionIds,
      };
      return quizPayload;
    },
    async saveQuiz() {
      const payload = await this.generatePayload();
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
    async getQuestionsList(params = {}) {
      params = {
        ...this.pagination,
      };
      this.$store.dispatch("questions/getQuestionsList", params).then(() => {
        this.totalPages =
          this.$store?.state?.questions?.questionsList?.pagination
            ?.totalPages || 1;
      });
    },
    requiredRule(fieldName) {
      return (value) => !!value || `${fieldName} is required`;
    },
  },
  mounted() {
    this.getQuestionsList();
    this.$store.dispatch("tags/getTagsList");
  },
};
</script>
