<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent
    expand-on-hover
    app
    :mini-variant.sync="mini"
  >
    <div class="d-flex align-center pa-2">
      <img src="../../assets/Q.svg" alt="Logo" height="37 " />
    </div>
    <v-divider></v-divider>
    <v-list>
      <v-list-item
        v-for="items in item"
        :ripple="false"
        exact-path
        :key="items.name"
        :to="items.path"
      >
        <v-list-item-icon>
          <v-icon>{{ items.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          {{ items.name }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-list-item :ripple="false" v-bind="attrs" v-on="on" @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content> Logout </v-list-item-content>
          </v-list-item>
        </template>
        <span>Logout</span>
      </v-tooltip>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "SideNavigation",
  props: {
    value: {
      type: Boolean,
    },
  },
  data() {
    return {
      mini: true,
      item: [
        {
          name: "Dashboard",
          path: "/admin",
          icon: "mdi-view-dashboard-outline",
        },
        {
          name: "Quiz",
          path: "/admin/quiz",
          icon: "mdi-help-box-multiple-outline",
        },
        {
          name: "Tags",
          path: "/admin/tags",
          icon: "mdi-tag-outline",
        },
        {
          name: "Questions",
          path: "/admin/questions",
          icon: "mdi-tooltip-question-outline",
        },
      ],
    };
  },
  computed: {
    drawer: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    getUser() {
      const user = JSON.parse(localStorage.getItem("userDeatils"));
      return `${user.firstName} ${user.lastName}`;
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
