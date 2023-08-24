<template>
  <div>
    <v-app-bar absolute clipped-left app color="primary">
      <v-app-bar-nav-icon
        color="white"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="white--text">Quiz App </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <SideNavigation v-model="drawer" />
      <div class="app-content">
        <!-- <Breadcrumb :breadcrumbs="$route.meta.breadcrumbs" /> -->
        <router-view></router-view>
      </div>
    </v-main>
  </div>
</template>

<script>
import SideNavigation from "@/components/general/SideNavigation.vue";
import Breadcrumb from "@/components/general/Breadcrumb.vue";

export default {
  name: "AdminLayout",
  components: {
    SideNavigation,
    Breadcrumb,
  },
  data() {
    return {
      drawer: null,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
