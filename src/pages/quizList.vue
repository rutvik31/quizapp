<template>
  <div>
    <p>Hello, User</p>
    <v-btn color="primary" @click="logout">Logout</v-btn>
  </div>
</template>

<script>
export default {
  name: "Quizlist",
  methods: {
    logout() {
      // Clear the token from localStorage
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
