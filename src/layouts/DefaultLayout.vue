<template>
  <router-view></router-view>
</template>

<script>
//Mixins
import AuthMixin from "@/mixins/auth.mixin";
export default {
  mixins: [AuthMixin],
  name: "DefaultLayout",
  created() {
    if (this.$route.path != "/") return;
    const token = localStorage.getItem("token");
    if (token) {
      this.getUserDetails();
    } else {
      this.$router.push({ name: "login" });
    }
  },
};
</script>
