<template>
  <v-app>
    <app-bar></app-bar>
    <heading></heading>
    <menu-bar :token="spotify_Token"></menu-bar>
    <v-container>
      <v-row v-if="this.loggingIn" class="mt-12" justify="center">
        <v-progress-circular
          indeterminate
          color=#1DB954
          :size="70"
          :width="5"
        >
        </v-progress-circular>
      </v-row>
    </v-container>
    <router-view></router-view>
  </v-app>
</template>

<script>
  import AppBar from './components/AppBar.vue'
  import Heading from './components/Heading.vue'
  import MenuBar from './components/MenuBar.vue'
  import champSongMap from '../static/ChampionSongMapping.json'

  export default {
    components: {
      MenuBar,
      AppBar,
      Heading
    },
  
    name: "App",

    methods: {
      async getSpotifyToken() {
        var redirect_uri = "http://localhost/callback"
        var spotifyURL = `https://accounts.spotify.com/authorize?client_id=1313a38061744d86a9537ef2bd563767&redirect_uri=${redirect_uri}&response_type=token&state=123&scope=user-read-private%20user-read-email%20user-top-read%20user-read-playback-state%20user-modify-playback-state`
        this.loggingIn = true
        window.ipcRenderer.send("LoginToSpotifyWindow", spotifyURL)
        window.ipcRenderer.on("CloseSpotifyLoginWindow", (event, arg) => {
          this.spotifyToken = arg
          this.loggingIn = false
        })
      },
  
      async getData() {
        window.ipcRenderer.send("GetLeagueClientData", "wmic PROCESS WHERE name='LeagueClientUx.exe' GET commandline")
        window.ipcRenderer.on("ReturnLeagueClientData", (event, arg) => {
          this.leagueData = arg
        })
      },

      async callLocalLeagueApi(port, password, endpoint) {
        var url = "https://127.0.0.1:" + port + endpoint
        var data = {
          password: password,
          Url: url
        }
        window.ipcRenderer.send("CallLeagueApi", data)
        window.ipcRenderer.on("ReturnCallLeagueApi", (event, arg) => {
          this.leagueAPIReturn = arg
        })
      },

      /* eslint-disable no-unused-vars */
      async playSpotify() {
        console.log(this.leagueAPIReturn)
        await this.getChampionSongs(this.leagueAPIReturn)
        .then(championSongs => {
          console.log(championSongs)
          if (championSongs.length > 1) {
            var endpoint = "https://api.spotify.com/v1/me/player/play"
            fetch(endpoint, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${this.spotifyToken}`,
              },
              body: JSON.stringify({
                //"uris": ["spotify:track:4bcMxSXijaZ9cGXynsRD3I"],
                "uris": championSongs.map(item => item.uri),
                "position_ms": 0
              }),
            }).then(async (result) => {
              console.log(result)
            })
          }
        })
      },

      /* eslint-disable no-unused-vars */
      async getChampionSongs(champID) {
        var output = []
        await fetch("http://ddragon.leagueoflegends.com/cdn/11.11.1/data/en_US/champion.json").then(async (result) => {
          await result.json().then((data) => {
            for (const [key, value] of Object.entries(data.data)) {
              if (value.key == champID.toString()) {
                console.log(value.name)
                console.log(this.champSongData[value.name].Songs)
                output = this.champSongData[value.name].Songs
                return this.champSongData[value.name].Songs
              }
            }
            return false
            // var championSongsBlank = {
            //   championName: "",
            //   songs: []
            // }
            // return championSongsBlank
          })
        })
        console.log(output)
        return output
      },

      async getSongs(champName) {
        var data = { 
          champion: champName
        }
        window.ipcRenderer.send("GetCurrentMapping", data)
        window.ipcRenderer.on("ReturnCurrentMapping", (event, arg) => {
          console.log(arg)
          return arg
        })
        
      }

    },

    mounted() {
      document.getElementById("loginBtn").addEventListener("click", async () => {
        console.log("logging in")
        this.spotifyToken = ""
        this.leagueData = []
        var token = await this.getSpotifyToken()
        var data = await this.getData()
        this.spotifyToken = token
        this.leagueData = data

        //"/lol-summoner/v1/current-summoner"))
        //"/lol-match-history/v1/recently-played-summoners"))
        //"/lol-lobby/v2/lobby/members"))
        //"/lol-champ-select/v1/current-champion"))
      })

      document.getElementById("listenBtn").addEventListener("click", async () => {
        if (this.leagueData != undefined) {
          console.log("started listener")
          setInterval(async () => {
            console.log('listening')
            await this.callLocalLeagueApi(this.leagueData[0], this.leagueData[1], "/lol-champ-select/v1/current-champion")            
            if (this.leagueAPIReturn != "" && this.leagueAPIReturn.httpStatus != 404) {
              //clearInterval(poll)
              console.log('valid return!')
              await this.playSpotify()    
            }
          }, 3000);
        }
        else {
          console.log("login first")
        }
      })

    },
    computed: {
      spotify_Token() {
        return this.spotifyToken
      }
    },

    data() {
      return {
        loggingIn: false,
        spotifyToken: "",
        leagueAPIReturn: "",
        champSongData:champSongMap
      }
    }

    
  };
</script>

<style scoped>
  
</style>
