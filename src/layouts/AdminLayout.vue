<template>
  <div>
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
