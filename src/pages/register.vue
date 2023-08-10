<template>
  <v-container class="d-flex justify-center align-center registerContainer">
    <v-card width="400px">
      <v-card-title class="text-center">Register</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="register">
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
            label="Password"
            outlined
            type="password"
            :rules="[requiredRule('Password')]"
          ></v-text-field>
          <v-btn :disabled="!isFormValid" type="submit" color="primary" block>
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
import RoutesValidation from "@/mixins/routes.validation";
export default {
  name: "Register",
  mixins: [RoutesValidation],
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
      errors: {},
    };
  },
  computed: {
    isFormValid() {
      return (
        this.user.firstName &&
        this.user.lastName &&
        this.user.email &&
        this.user.password &&
        this.isValidEmail(this.user.email)
      );
    },
  },
  methods: {
    register() {
      const user = {
        ...this.user,
      };
      this.$api.users
        .createUserObject(user)
        .then((res) => {
          this.$bus.$emit("showSnakeBar", res.data.message, "success");
        })
        .catch((err) => {
          this.$bus.$emit(
            "showSnakeBar",
            err?.response?.data?.message,
            "error"
          );
        });
      this.user = {};
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
<style scoped>
.registerContainer {
  height: 100vh;
}
</style>
