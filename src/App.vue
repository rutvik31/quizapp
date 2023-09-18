<template>
  <v-app>
    <div class="background-container">
      <v-img class="background-image" src="./assets/Rectangle1.svg"></v-img>
      <router-view />
      <Snackbar
        v-model="showSnakbar"
        :message="snackbarMessage"
        :type="snackbarType"
      />
    </div>
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
<style scoped>
.background-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
</style>
