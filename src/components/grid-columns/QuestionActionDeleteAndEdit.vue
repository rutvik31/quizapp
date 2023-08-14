<template>
  <div class="d-flex align-center" style="height: 100%">
    <v-icon small class="ml-1" color="green" @click="editQuestion">
      mdi-pencil
    </v-icon>
  </div>
</template>

<script>
export default {
  name: "QuestionActionDeleteAndEdit",
  methods: {
    editQuestion() {
      this.params?.context?.editQuestion(this.params?.data?._id);
    },
  },
  mounted() {},
};
</script>
