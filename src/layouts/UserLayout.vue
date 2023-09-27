<template>
  <div>
    <nav id="navbar" class="navbar">
      <div class="d-flex align-center">
        <img src="../assets/Q.svg" alt="Logo" height="45" />
        <img
          src="../assets/dot.svg"
          alt="Logo"
          class="d-flex align-self-end pl-1"
          height="auto"
        />
      </div>
      <router-link
        v-for="(item, index) in items"
        :key="index"
        exact
        :to="item.path"
        :prev-icon="items.icon"
        class="v-tabs-fonts"
        :exact-active-class="'active-link'"
      >
        {{ item.name }}
      </router-link>
      <v-spacer></v-spacer>
      <v-menu bottom rounded offset-y>
        <template v-slot:activator="{ on }">
          <v-avatar v-on="on" color="primary" class="avatar">
            <span class="white--text text-h5 ma-0">{{ getUserInitial }}</span>
          </v-avatar>
        </template>
        <v-list class="py-0">
          <v-list-item @click="logout" link class="text-center">
            <v-list-item-title>Logout</v-list-item-title>
            <v-icon>mdi-logout</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </nav>
    <div>
      <v-main>
        <div class="app-content">
          <router-view class="full-height"></router-view>
        </div>
      </v-main>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserLayout",
  components: {},
  data() {
    return {
      items: [
        {
          name: "Dashboard",
          path: "/user",
        },
        {
          name: "Quiz",
          path: "/user/quiz",
        },
        {
          name: "Results",
          path: "/user/results",
        },
      ],
      activeTab: 0,
    };
  },
  computed: {
    getUserInitial() {
      const user = JSON.parse(localStorage.getItem("userDeatils"));
      const firstNameInitial = user.firstName.charAt(0).toUpperCase();
      const lastNameInitial = user.lastName.charAt(0).toUpperCase();
      return `${firstNameInitial}${lastNameInitial}`;
    },
    getUserName() {
      const user = JSON.parse(localStorage.getItem("userDeatils"));
      return (
        `${user.firstName}`.charAt(0).toUpperCase() +
        `${user.firstName}`.slice(1)
      );
    },
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>
