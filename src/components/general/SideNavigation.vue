<template>
  <v-navigation-drawer
    elevate-on-scroll
    clipped
    v-model="drawer"
    app
    :mini-variant.sync="mini"
  >
    <v-list-item class="px-2">
      <v-list-item-avatar size="38" color="indigo">
        <v-icon dark> mdi-account-circle </v-icon>
      </v-list-item-avatar>
      <v-list-item-title>Admin</v-list-item-title>
      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>
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
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>
