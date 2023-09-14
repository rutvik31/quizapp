<template>
  <div>
    <v-app-bar elevate-on-scroll clipped-left app color="primary">
      <v-app-bar-nav-icon
        color="white"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="white--text">Quiz App </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <NavigationAdmin v-model="drawer" />
      <div class="app-content">
        <router-view></router-view>
      </div>
    </v-main>
  </div>
</template>

<script>
import NavigationAdmin from "@/components/general/NavigationAdmin.vue";

export default {
  name: "AdminLayout",
  components: {
    NavigationAdmin,
  },
  data() {
    return {
      drawer: null,
    };
  },
};
</script>
