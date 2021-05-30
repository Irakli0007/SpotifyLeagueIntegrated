<template>
  <v-container>
    <v-row justify="center" align="center" class="mx-4 my-4">
      <v-img :src="leagueLogo" max-height="144" max-width="256" class="mx-4"></v-img>
      <div class="plus"></div>
      <v-img :src="spotifyLogo" max-height="144" max-width="256" class="mx-4"></v-img>
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

<style scoped>
  .plus {
    display:inline-block;
    width:75px;
    height:75px;
    
    background:
      linear-gradient(#fff,#fff),
      linear-gradient(#fff,#fff),
      #000;
    background-position:center;
    background-size: 50% 2px,2px 50%; /*thickness = 2px, length = 50% (25px)*/
    background-repeat:no-repeat;
    border-radius:50%;
  }
</style>