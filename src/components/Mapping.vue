<template>
  <div>
    <v-row justify="center" class="mx-4">
      <v-btn id="backBtn" color=#1DB954 class="mx-4" @click="onHome()">Home</v-btn>
    </v-row>
    <v-btn v-for="item in champions" :key="item.name">
      {{ item }}
    </v-btn>
  </div>
</template>


<script>


export default {
  name: "Mapping",

  methods: {
    onHome() {
      this.$emit('home')
    },


  },

  created() {
    
  },

  mounted() {

  },

  data() {
    return {
      champions: ""
    }
  }

}
</script>