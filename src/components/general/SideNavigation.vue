<template>
  <v-navigation-drawer clipped v-model="drawer" app>
    <v-list>
      <v-list-item-group>
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
          {{ items.name }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <template v-slot:append>
      <v-list-item @click="logout">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        Logout
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "SideNavigation",
  props: {
    value: Boolean,
  },
  data() {
    return {
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
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
