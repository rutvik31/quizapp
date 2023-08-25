<template>
  <v-row class="ma-0">
    <v-col cols="3" class="px-0">
      <v-text-field
        dense
        outlined
        v-model="filters.search"
        :clearable="true"
        label="Search for a question"
        hide-details="auto"
      >
        <template v-slot:append>
          <v-icon>mdi-magnify</v-icon>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="3" class="pr-0">
      <v-select
        ref="answer"
        v-model="filters.tags"
        :items="tagList"
        item-text="name"
        item-value="name"
        label="Filter by tags"
        hide-details="auto"
        multiple
        outlined
        dense
      >
        <template v-slot:append>
          <v-icon>
            {{ filters?.tags?.length ? "mdi-filter" : "mdi-filter-outline" }}
          </v-icon>
        </template>
      </v-select>
    </v-col>
    <v-col cols="3" class="pr-0">
      <v-select
        ref="answer"
        v-model="filters.difficulty"
        :items="diffArray"
        label="Filter by difficulty"
        hide-details="auto"
        multiple
        outlined
        dense
      >
        <template v-slot:append>
          <v-icon>
            {{
              filters?.difficulty?.length ? "mdi-filter" : "mdi-filter-outline"
            }}
          </v-icon>
        </template>
      </v-select>
    </v-col>
    <v-col cols="3" class="pr-0">
      <v-select
        ref="answer"
        v-model="filters.ansType"
        :items="ansTypeArray"
        label="Filter by ans type"
        hide-details="auto"
        multiple
        outlined
        dense
      >
        <template v-slot:append>
          <v-icon>
            {{ filters?.ansType?.length ? "mdi-filter" : "mdi-filter-outline" }}
          </v-icon>
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Question",
  data() {
    return {
      filters: {
        search: "",
        tags: [],
        difficulty: [],
        ansType: [],
      },
      ansTypeArray: ["single", "multiple"],
      diffArray: ["easy", "medium", "hard"],
      debounceTimer: null,
    };
  },
  watch: {
    filters: {
      deep: true,
      handler(filter) {
        this.handleChange({ ...filter });
      },
    },
  },
  computed: {
    tagList() {
      return this.$store?.state?.tags?.tagsList?.data;
    },
  },
  methods: {
    handleChange(filter) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.$emit("filter-changed", filter);
      }, 800);
    },
  },
};
</script>
