<template>
  <div>
    <v-app-bar absolute clipped-left app color="primary">
      <v-toolbar-title class="white--text text-h6">Quiz App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn small @click="logout">Logout</v-btn>
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
