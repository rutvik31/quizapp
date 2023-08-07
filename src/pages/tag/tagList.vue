<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn @click="openDialog" color="primary">Add Tag</v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title>Add Tag</v-card-title>
        <v-card-text>
          <v-text-field v-model="name" label="Tag Name"></v-text-field>
          <v-color-picker v-model="color" label="Tag Color"></v-color-picker>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog" color="primary">Cancel</v-btn>
          <v-btn @click="saveTag" color="success">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "Tag",
  data() {
    return {
      dialogVisible: false,
      name: "",
      color: "#1976D2",
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.name = "";
      this.color = "#1976D2";
    },
    saveTag() {
      const tagData = {
        name: this.name,
        color: this.color,
      };
      this.$api.tag
        .createTagObject(tagData)
        .then((res) => {
          this.$bus.$emit("showSnakeBar", "Tag created succesfully", "success");
        })
        .catch((err) => {
          this.$bus.$emit(
            "showSnakeBar",
            err?.response?.data?.message,
            "error"
          );
        });
      this.closeDialog();
    },
  },
};
</script>

<style>
/* Add any custom styles here */
</style>
