export default {
  methods: {
    getUserDetails() {
      this.$api.users.getUserDetails().then((res) => {
        const user = res?.data?.data;
        localStorage.setItem("userDeatils", JSON.stringify(user));
        // redirect conditionaly
        if (user?.role === "admin") {
          this.$router.push({ name: "admin-dashboard" });
        } else {
          this.$router.push({ name: "user-dashboard" });
        }
      });
    },
  },
};
