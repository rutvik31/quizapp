<template>
  <v-app>
    <router-view />
    <Snackbar
      v-model="showSnakbar"
      :message="snackbarMessage"
      :type="snackbarType"
    />
  </v-app>
</template>

<script>
import Snackbar from "@/components/general/Snackbar.vue";

export default {
  components: {
    Snackbar,
  },
  data() {
    return {
      showSnakbar: false,
      snackbarMessage: "",
      snackbarType: "", // Default type is 'success'
    };
  },
  methods: {
    showSnackbar(message, type = "success") {
      this.snackbarMessage = message;
      this.snackbarType = type;
      this.showSnakbar = true;
    },
  },
  mounted() {
    this.$bus.$on("showSnakeBar", this.showSnackbar);
  },
};
</script>
