<template>
  <v-container class="d-flex justify-center align-center loginContainer">
    <v-card width="400px">
      <v-card-title class="text-center">Login</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form" @submit.prevent="login">
          <v-text-field
            v-model="user.email"
            label="Email"
            outlined
            :rules="[requiredRule('Email'), emailRule]"
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            label="Password"
            outlined
            type="password"
            :rules="[requiredRule('Password')]"
          ></v-text-field>
          <v-btn :disabled="!valid" type="submit" color="primary" block>
            Login
          </v-btn>
        </v-form>
        <div class="text-center mt-3">
          Do Not have an account?
          <router-link to="/register">Register here</router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import RoutesValidation from "@/mixins/routes.validation";
export default {
  name: "Login",
  mixins: [RoutesValidation],
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      valid: false,
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch("auth/login", this.user);
        this.$router.push({ name: "admin-dashboard" });
        this.$refs.form.reset();
      } catch (err) {
        this.$bus.$emit("showSnakeBar", err?.response?.data?.message, "error");
      }
    },
    requiredRule(fieldName) {
      return (value) => !!value || `${fieldName} is required`;
    },
    emailRule(value) {
      if (!value) {
        return "Email is required";
      } else if (!this.isValidEmail(value)) {
        return "Invalid email format";
      }
      return true;
    },
    isValidEmail(email) {
      // Simple email validation using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  },
};
</script>
