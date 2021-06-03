<template>
  <div>
    <v-dialog v-model="dialog" width="90%" @click:outside="onBack()">
      <v-card min-height="400px">
        <v-card-title class="justify-center" id="card-title">Mapping Songs For {{ championData.name }}</v-card-title>
        <div v-if="currentMapping.length > 0">
          <h2 style="color:#1DB954">Current Songs</h2>
          <v-row>
            <template v-for="currentSong in currentMapping">
              <v-col cols=2 :key="currentSong.id">
                <v-card :id="`currentSongCard_${currentSong.name}`">
                  <v-card-title>{{ currentSong.name }}</v-card-title>
                  <v-img :src="currentSong.album.images[0].url"></v-img>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </div>
        <v-divider class="my-4" style="background-color:#1DB954"></v-divider>
        <v-col class="mx-auto mt-4" cols=4>
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
        </v-col>
        <v-col cols=4 class="mx-auto">
          <v-btn @click="onBack()" color=#1DB954>Back</v-btn>
          <v-btn v-if="selectedSongs.length > 0" x-large rounded @click="save()" color=#1DB954>Save</v-btn>
        </v-col>
        <div v-if="songResults">
          <h2 style="color:#1DB954">Search Results</h2>
          <v-row>
            <template v-for="item in songResults.items">
              <v-col cols=2 :key="item.id">
                <v-card :id="`songCard_${item.name}`" @click="selected(item)">
                  <v-card-title>{{ item.name }}</v-card-title>
                  <v-img :src="item.album.images[0].url"></v-img>
                </v-card>
              </v-col>
            </template>
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

      selected(item) {
        var card = document.getElementById("songCard_" + item.name)
        if (!getComputedStyle(card).border.includes("solid")) {
          card.style.border = "6px solid #1DB954"
          this.selectedSongs.push(item)
        } else {
          card.style.border = "0px none rgb(30, 30, 30)"
          var index = this.selectedSongs.indexOf(item)
          if (index > -1) {
            this.selectedSongs.splice(index, 1)
          }
        }
      },

      save() {
        if (this.selectedSongs.length > 0) {
          var data = {
            champion: this.championData.name,
            music: this.selectedSongs,
            method: "song"
          }
          window.ipcRenderer.send("SaveMusicToChampion", data)
          window.ipcRenderer.on("ReturnSaveMusicToChampion", (event, arg) => {
            if (arg == true) {
              //TODO success message
              this.onBack()
            }
            else {
              //TODO error message
              this.onBack()
            }
          })        
        }
      },

      async searchSpotify() {
        var url = "https://api.spotify.com/v1/search?query=" + this.searchStr.replace(' ', '%20') + "&type=track&limit=6"
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
      }

    },

    created() {
      var data = {
        champion: this.championData.name
        //TODO var method = "playlist / song"
      }
      window.ipcRenderer.send("GetCurrentMapping", data)
      window.ipcRenderer.on("ReturnCurrentMapping", (event, arg) => {
        this.currentMapping = arg
      })
    },

    props: ['championData', 'token'],

    data() {
      return {
        searchStr: "",
        dialog: true,
        songResults: "",
        selectedSongs: [],
        currentMapping: []
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

  #card-title {
    color:#1DB954;
    font-size: 36px;
  }

 .v-dialog > * {
    overflow-y: hidden;
    overflow-x: hidden;
  }

</style>