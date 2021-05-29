<template>
  <v-container>
    <v-row justify="center" align="center" class="mx-4 my-4">
      <v-img :src="leagueLogo" max-height="288" max-width="512" class="mx-4"></v-img>
      <div class="plus"></div>
      <v-img :src="spotifyLogo" max-height="288" max-width="512" class="mx-4"></v-img>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      leagueLogo: require(`@/assets/league_logo.jpg`),
      spotifyLogo: require(`@/assets/spotify_logo.jpg`),
    }
  }
}
</script>