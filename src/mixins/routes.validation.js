export default {
  beforeCreate() {
    let token = localStorage.getItem("token");
    if (token) {
      this.$router.push("quizlist");
    }
  },
}