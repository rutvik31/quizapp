<template>
  <v-chip-group multiple>
    <v-chip
      v-for="(chip, index) in randomChips"
      :key="index"
      :color="chip.color"
      class="ma-1"
      label
      dark
      close
      @click:close="removeFilter"
      @input="removeFilter"
    >
      {{ filter }}
    </v-chip>
  </v-chip-group>
</template>

<script>
export default {
  name: "FilterChip",
  props: {
    filter: String,
  },
  data() {
    return {
      colors: ["red", "green", "blue", "purple", "orange"],
    };
  },
  computed: {
    randomChips() {
      return Array.from({ length: 1 }, () => ({
        color: this.getRandomColor(),
      }));
    },
  },
  methods: {
    removeFilter() {
      this.$emit("remove-filter", this.filter);
    },
    getRandomColor() {
      const randomIndex = Math.floor(Math.random() * this.colors.length);
      return this.colors[randomIndex];
    },
  },
};
</script>
