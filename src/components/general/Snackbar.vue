<template>
  <v-snackbar
    v-model="showSnackbar"
    :color="color"
    absolute
    top
    right
    text
    timeout="3000"
  >
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
