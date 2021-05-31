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
            @keyup.enter.exact="searchSpotify"
            v-model="searchStr"
          ></v-textarea>
          <v-btn @click="onBack()" color=#1DB954>Back</v-btn>
        </v-col>
        <div>
          <v-row justify="center" v-for="item in songResults.items" :key="item.id">
            <v-card>
              <v-card-title>{{ item.name }}</v-card-title>
              
            </v-card>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  methods: {
    onBack() {
      this.$emit('back')
    },

    async searchSpotify() {
      var url = "https://api.spotify.com/v1/search?query=" + this.searchStr.replace(' ', '%20') + "&type=track"
      let config = {
        headers: {
          Authorization: `Bearer ${this.spotify_Token}`,
        },
        method: 'GET'
      }
      await fetch(url, config).then((data) => {
        data.json().then((results) => {
          console.log(results)
          this.songResults = results.tracks
        })
      })
      console.log(this.songResults)
    }

  },

  props: ['championData', 'token'],

  data() {
    return {
      searchStr: "",
      dialog: true,
      songResults: ""
    }
  },
  computed: {
    spotify_Token() {
      return this.token
    }
  }

}
</script>

<style scoped>
  .v-text-field--outlined >>> fieldset {
    border-color: #1DB954;
  }
</style>