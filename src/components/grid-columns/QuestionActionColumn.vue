<template>
  <div class="d-flex align-center" style="height: 100%">
    <v-chip-group v-for="(tag, index) in tags" :key="index" column>
      <v-chip class="white--text" :color="tag.color" small>
        {{ tag.name }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script>
export default {
  name: "QuestionActionColumn",
  computed: {
    tags() {
      return this.params?.data?.meta?.tags;
    },
    color() {
      return this.params?.data?.meta?.tags;
    },
  },
};
</script>
