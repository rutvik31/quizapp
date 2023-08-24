<template>
  <div class="breadcrumbs">
    <div
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="index"
      class="breadcrumb-item"
    >
      <span class="breadcrumb-separator" v-if="index > 0">/</span>
      <router-link :to="breadcrumb.route">
        <span class="breadcrumb-label">{{ breadcrumb.label }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Breadcrumbs",
  props: {
    breadcrumbs: {
      type: Array,
    },
  },
};
</script>
