<template>
  <div>
    <v-container>
      <v-row justify="center">
        <router-link to="/">
          <v-btn id="homeBtn" color=#1DB954 class="mx-4">Home</v-btn>
        </router-link>
        <v-btn id="loginBtn" color=#1DB954 class="mx-4">Login</v-btn>
        <v-btn id="listenBtn" color=#1DB954 class="mx-4">Start Listening</v-btn>
        <router-link v-if="spotify_Token" :to="{ name: 'Mapping', params: { spotify_Token: spotify_Token } }">
          <v-btn id="mappingBtn" color=#1DB954 class="mx-4">Mapping</v-btn>
        </router-link>
      </v-row>
    </v-container>
  </div>
</template>


<script>
  export default {
    props: ['token'],

    mounted() {

    },

    created() {

    },

    data() {
      return {
        
      }

    },

    computed: {
      spotify_Token() {
        return this.token
      }
    }

  }
</script>