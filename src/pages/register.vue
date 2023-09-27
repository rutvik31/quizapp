<template>
  <v-container class="d-flex justify-center align-center registerContainer">
    <v-card width="400px" class="login-rgister-card">
      <v-card-title class="text-center">Register</v-card-title>
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="register" ref="form">
          <v-text-field
            v-model="user.firstName"
            label="First Name"
            outlined
            :rules="[requiredRule('First Name')]"
          ></v-text-field>
          <v-text-field
            v-model="user.lastName"
            label="Last Name"
            outlined
            :rules="[requiredRule('Last Name')]"
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            label="Email"
            outlined
            :rules="[requiredRule('Email'), emailRule]"
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            label="Password"
            outlined
            @click:append="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
            :rules="[requiredRule('Password')]"
          ></v-text-field>
          <v-btn :disabled="!valid" type="submit" color="primary" block>
            Register
          </v-btn>
        </v-form>
        <div class="text-center mt-3">
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import AuthMixin from "@/mixins/auth.mixin";
export default {
  mixins: [AuthMixin],
  name: "Register",
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
      errors: {},
      valid: false,
      showPassword: false,
    };
  },
  methods: {
    register() {
      const user = {
        ...this.user,
      };
      this.valid = false;
      this.$api.user
        .register(user)
        .then((res) => {
          this.$bus.$emit("showSnakeBar", res?.data?.message, "success");
          this.$router.push({ name: "login" });
          this.$refs.form.reset();
        })
        .catch((err) => {
          this.$bus.$emit(
            "showSnakeBar",
            err?.response?.data?.message,
            "error"
          );
          this.valid = true;
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
