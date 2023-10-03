<template>
  <div>
    <v-row class="ma-0">
      <v-col cols="12" class="px-0">
        <div class="d-flex align-center">
          <div class="text-h5">Questions</div>
          <v-spacer></v-spacer>
          <v-menu offset-y left max-width="100%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" outlined v-bind="attrs" v-on="on">
                Add
                <v-icon right dark>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </template>
            <v-list class="py-0">
              <v-list-item @click="openDialog">
                <v-list-item-title>Add Single</v-list-item-title>
              </v-list-item>
              <v-list-item @click="openUploadDialog">
                <v-list-item-title>Bulk Upload</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-col>
      <QuestionsListFilter @filter-changed="handleFilterChanged" />
      <v-col cols="12" class="pa-0">
        <v-card outlined>
          <AgGridList
            :grid-context="gridContext"
            :columnDefs="columnDefs"
            :gridOptions="gridOptions"
            :rowData="rowData"
          />
        </v-card>
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
    <QuestionForm
      v-model="dialogVisible"
      :user-data="userData"
      @form-submitted="getQuestionsList"
    />
    <BulkUpload
      v-model="uploadDialogVisible"
      @upload-success="getQuestionsList"
    />
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
//Components
import QuestionForm from "@/pages/question/questionForm.vue";
import BulkUpload from "./bulkUpload.vue";
import QuestionsListFilter from "@/components/filters/QuestionsListFilter.vue";
import AgGridList from "@/components/general/AgGridList.vue";
import QuestionActionColumn from "@/components/grid-columns/QuestionActionColumn.vue";
import QuestionActionDeleteAndEdit from "@/components/grid-columns/QuestionActionDeleteAndEdit.vue";
//Mixins
import listMixin from "@/mixins/list.mixin";
export default {
  name: "QuestionList",
  mixins: [listMixin],
  components: {
    AgGridVue,
    QuestionForm,
    QuestionsListFilter,
    BulkUpload,
    AgGridList,
    QuestionActionColumn,
    QuestionActionDeleteAndEdit,
  },
  data() {
    return {
      columnDefs: [
        {
          headerName: "Question",
          field: "question",
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
        },
      ],
      gridOptions: {
        domLayout: "autoHeight",
      },
      dialogVisible: false,
      uploadDialogVisible: false,
      userData: null,
      ansTypeArray: ["single", "multiple"],
      diffArray: ["easy", "medium", "hard"],
    };
  },
  computed: {
    gridContext() {
      return {
        editQuestion: this.editQuestion,
      };
    },
    rowData() {
      return this.$store?.state?.questions?.questionsList?.data;
    },
    tagList() {
      return this.$store?.state?.tags?.tagsList?.data;
    },
  },
  methods: {
    openDialog() {
      this.userData = null;
      this.dialogVisible = true;
    },
    openUploadDialog() {
      this.uploadDialogVisible = true;
    },
    handleFilterChanged(filters) {
      const keys = Object.keys(filters);
      while (keys.length) {
        const key = keys.pop();
        if (!filters[key] || !filters[key]?.length) delete filters[key];
        if (Array.isArray(filters[key])) filters[key] = filters[key].join(",");
      }
      this.getQuestionsList(filters);
    },
    async getQuestionsList(params = {}) {
      params = {
        ...params,
        ...this.pagination,
      };

      this.$store.dispatch("questions/getQuestionsList", params).then(() => {
        this.totalPages =
          this.$store?.state?.questions?.questionsList?.pagination
            ?.totalPages || 1;
      });
    },
    editQuestion(id) {
      this.$api.question.getQuestionById(id).then((res) => {
        const { options, tags } = res?.data?.data?.meta;
        delete res?.data?.data?.meta;
        this.userData = { options, tags, ...res?.data?.data };
        this.dialogVisible = true;
      });
    },
  },
  mounted() {
    this.getQuestionsList();
  },
};
</script>
