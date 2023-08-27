<template>
  <div>
    <v-row class="ma-0">
      <v-col cols="12" class="px-0">
        <div class="d-flex align-center">
          <div class="header-title text-h5">Questions</div>
          <v-spacer></v-spacer>
          <v-menu offset-y left max-width="100%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon color="#0277BD" x-large class="icon-margin-right">
                  mdi-plus-circle
                </v-icon>
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
          <AgGridQuestions :grid-context="gridContext" />
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
import AgGridQuestions from "@/components/general/AgGridQuestions.vue";
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
    AgGridQuestions,
  },
  data() {
    return {
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
