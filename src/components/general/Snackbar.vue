<template>
  <v-snackbar
    v-model="showSnackbar"
    :color="color"
    top
    right
    text
    timeout="3000"
  >
    <v-icon :color="color" v-if="type === 'success'">mdi-check-circle</v-icon>
    <v-icon :color="color" v-else-if="type === 'error'">
      mdi-alert-circle
    </v-icon>
    {{ message }}
  </v-snackbar>
</template>

<script>
export default {
  name: "Snackbar",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "success", // Can be 'success' or 'error'
    },
  },
  computed: {
    color() {
      return this.type === "success" ? "success" : "error";
    },
    showSnackbar: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
