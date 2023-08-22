<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "DefaultLayout",
  created() {
    if (this.$route.path != "/") return;
    const token = localStorage.getItem("token");
    if (token) {
      this.$router.push({ name: "admin-dashboard" });
    } else {
      this.$router.push({ name: "login" });
    }
  },
};
</script>
