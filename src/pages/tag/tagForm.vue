<template>
  <v-dialog v-model="dialogVisible" scrollable persistent max-width="500px">
    <v-card>
      <v-card-title class="px-4">
        Add tag name and select color
        <v-spacer />
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="px-4 py-0">
        <v-form v-model="valid" ref="form">
          <v-row class="ma-0">
            <v-col cols="12">
              <v-text-field
                outlined
                dense
                v-model="name"
                label="Tag Name"
                hide-details="auto"
                :rules="[requiredRule('Tag Name')]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <label>Select Color for your tag: </label>
              <v-color-picker
                v-model="color"
                mode="hexa"
                class="pa-0 py-4 max-width-tags"
                label="Tag Color"
                hide-details="auto"
              >
              </v-color-picker>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="align-end justify-end pa-0">
        <v-btn
          @click="saveTag"
          block
          depressed
          color="primary"
          class="rounded-0"
          :disabled="!valid"
        >
          save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "TagForm",
  props: {
    value: {
      type: Boolean,
    },
  },
  data() {
    return {
      name: "",
      color: "#0277BD",
      valid: false,
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
    },
    resetForm() {
      this.$refs.form.reset();
    },
    async generateTagPayload() {
      return {
        name: this.name,
        color: this.color,
      };
    },
    async saveTag() {
      const payload = await this.generateTagPayload();
      this.$store
        .dispatch("tags/createTag", payload)
        .then(() => {
          this.$bus.$emit(
            "showSnakeBar",
            "Tag created successfully",
            "success"
          );
          // Clear the form fields
          this.$emit("form-submitted");
          this.resetForm();
          this.closeDialog();
        })
        .catch((err) => {
          this.$bus.$emit(
            "showSnakeBar",
            err?.response?.data?.message || "Some error occured",
            "error"
          );
          this.resetForm();
          this.closeDialog();
        });
    },
    requiredRule(fieldName) {
      return (value) => !!value || `${fieldName} is required`;
    },
  },
};
</script>
