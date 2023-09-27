<template>
  <v-row class="ma-0">
    <v-col cols="6">
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
    <v-col cols="6" class="d-flex align-center justify-end">
      <span class="px-2">Sort by latest date :</span>
      <v-checkbox
        class="ma-0 pa-0"
        v-model="sortBy"
        value="latest"
        hide-details="auto"
      />
    </v-col>
    <v-col v-if="sortBy" cols="12" class="py-0">
      <FilterChip :filter="sortBy" @remove-filter="removeFilter" />
    </v-col>
    <v-col
      cols="12"
      v-if="!quizList.length"
      class="d-flex align-center justify-center"
    >
      <p class="text-h5">No results found.</p>
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
          <v-card-title class="px-0 pt-0 poppins">
            {{ items.title }}
          </v-card-title>
          <div>
            Its not a competition, its just a simple way to see how much you
            know.
          </div>
        </v-card-text>
        <v-card-actions class="d-flex align-center">
          <v-chip class="px-4 poppins">
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
import moment from "moment";
import FilterChip from "@/components/filters/FilterChip.vue";
// Mixins
import listMixin from "@/mixins/list.mixin";
export default {
  name: "UserQuizList",
  mixins: [listMixin],
  components: {
    FilterChip,
  },
  data() {
    return {
      sortBy: "",
    };
  },
  watch: {
    filters: {
      deep: true,
      handler(filter) {
        this.handleValueChange(filter);
      },
    },
    sortBy: {
      handler() {
        this.getQuizList();
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
        sortby: this.sortBy,
      };
      this.$store.dispatch("quiz/getQuizList", params).then(() => {
        this.totalPages =
          this.$store?.state?.quiz?.quizList?.pagination?.totalPages || 1;
      });
    },
    formatDate(dateTime) {
      const pastDate = moment(dateTime);
      const relativeTime = pastDate.fromNow();
      return relativeTime.charAt(0).toUpperCase() + relativeTime.slice(1);
    },
    removeFilter() {
      this.sortBy = "";
    },
  },
  mounted() {
    this.getQuizList();
  },
};
</script>
