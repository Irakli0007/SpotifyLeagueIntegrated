<template>
  <div>
    <v-container>
      <v-row justify="center">
        <router-link to="/">
          <v-btn id="homeBtn" color=#1DB954 class="mx-4">Home</v-btn>
        </router-link>
        <v-btn id="loginBtn" color=#1DB954 class="mx-4">Login</v-btn>
        <v-btn id="listenBtn" color=#1DB954 class="mx-4">Start Listening</v-btn>
        <router-link to="/mapping">
          <v-btn id="mappingBtn" color=#1DB954 class="mx-4">Mapping</v-btn>
        </router-link>
      </v-row>
    </v-container>
  </div>
</template>


<script>
export default {
    
}
</script>