<template>
  <div>
    <v-app-bar elevate-on-scroll clipped app color="primary">
      <v-toolbar-title class="white--text text-h6">Quiz App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout">
        Logout
        <v-icon right dark @click="logout">mdi-logout </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <div class="app-content">
        <router-view></router-view>
      </div>
    </v-main>
  </div>
</template>
<script>
export default {
  name: "UserLayout",
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>
