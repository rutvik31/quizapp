<template>
  <div class="d-flex align-center" style="height: 100%">
    <v-icon small class="ml-1" color="red" @click="deleteTag">
      mdi-delete
    </v-icon>
  </div>
</template>

<script>
export default {
  methods: {
    deleteTag() {
      this.params?.context?.deleteTag(this.params?.data?._id);
    },
  },
};
</script>

<style></style>
