<template>
  <div>
    <v-dialog v-model="dialog" width="1600">
      <v-card>
        <v-card-title>Mapping Songs For {{ championData.name }}</v-card-title>
        <v-col class="mx-auto" cols=4>
          <v-textarea
            color=#1DB954
            label="Search Songs"
            auto-grow
            outlined
            rows="1"
            @keydown.enter.exact.prevent
            @keyup.enter.exact="search"
            v-model="searchStr"
          ></v-textarea>
          <v-btn @click="onBack()" color=#1DB954>Back</v-btn>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  methods: {
    onBack() {
      this.$emit('back')
    }
  },

  mounted() {
  },

  created() {

  },

  props: ['championData'],

  data() {
    return {
      searchStr: "",
      dialog: true
    }
  }

}
</script>

<style scoped>
  .v-text-field--outlined >>> fieldset {
    border-color: #1DB954;
  }
</style>