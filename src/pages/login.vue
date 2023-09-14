<template>
  <v-container class="d-flex justify-center align-center loginContainer">
    <v-card width="400px">
      <v-card-title class="text-center">Login</v-card-title>
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="login">
          <v-text-field
            v-model="user.email"
            label="Email"
            outlined
            :rules="[requiredRule('Email'), emailRule]"
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            label="Password"
            outlined
            @click:append="show1 = !show1"
            :type="show1 ? 'text' : 'password'"
            :rules="[requiredRule('Password')]"
          ></v-text-field>
          <v-btn type="submit" :disabled="!valid" color="primary" block>
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
import AuthMixin from "@/mixins/auth.mixin";
export default {
  mixins: [AuthMixin],
  name: "Login",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      valid: false,
      show1: false,
    };
  },
  methods: {
    async login() {
      this.$api.user
        .login(this.user)
        .then((res) => {
          const token = res?.data?.token;
          localStorage.setItem("token", token);
          this.getUserDetails();
        })
        .catch((err) => {
          this.$bus.$emit(
            "showSnakeBar",
            err?.response?.data?.message,
            "error"
          );
        });
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  },
  beforeMount() {
    let token = localStorage.getItem("token");
    if (token) {
      this.getUserDetails();
    }
  },
};
</script>
