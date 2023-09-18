<template>
  <v-row class="ma-0">
    <v-col cols="12">
      <v-text-field
        solo
        rounded
        v-model="filters.search"
        :clearable="true"
        clear-icon="mdi-close-circle"
        label="Search for a quiz"
        hide-details="auto"
        class="search-bar"
      >
        <template v-slot:append>
          <v-icon>mdi-magnify</v-icon>
        </template>
      </v-text-field>
    </v-col>
    <v-col
      cols="12"
      v-if="!quizList.length"
      class="d-flex align-center justify-center"
    >
      <p class="text-h5">No records found.</p>
    </v-col>
    <v-col
      cols="12"
      xs="12"
      sm="6"
      md="4"
      lg="3"
      xl="3"
      v-for="(items, index) in quizList"
      :key="index"
    >
      <v-card class="card-style">
        <v-card-text>
          <p class="text-h5 text--primary">{{ items.title }}</p>
          <div>
            {{ items.description }}
          </div>
        </v-card-text>
        <v-card-actions class="d-flex align-center">
          <v-chip class="px-4">
            <v-icon left small> mdi-calendar-range </v-icon>
            {{ formatDate(items.createdAt) }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-btn
            elevation="0"
            class="rounded-xl px-3 card-button white--text"
            @click="getSingleQuiz(items._id)"
          >
            Take a quiz
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import listMixin from "@/mixins/list.mixin";
export default {
  name: "UserQuizList",
  mixins: [listMixin],
  data() {
    return {
      search: "",
    };
  },
  watch: {
    filters: {
      deep: true,
      handler(filter) {
        this.handleValueChange(filter);
      },
    },
  },
  computed: {
    quizList() {
      return this.$store?.state?.quiz?.quizList?.data;
    },
  },
  methods: {
    getSingleQuiz(id) {
      this.$router.push({ name: "user-quiz-detail", params: { id } });
    },
    handleValueChange() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.getQuizList();
      }, 800);
    },
    getQuizList() {
      const params = {
        ...this.filters,
        ...this.pagination,
      };
      this.$store.dispatch("quiz/getQuizList", params).then(() => {
        this.totalPages =
          this.$store?.state?.quiz?.quizList?.pagination?.totalPages || 1;
      });
    },
    formatDate(dateTime) {
      const date = new Date(dateTime);
      const options = { month: "short", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.getQuizList();
  },
};
</script>
