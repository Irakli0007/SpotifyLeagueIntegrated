<template>
  <v-app>
    <template>
      <div class="mb-4">
        <v-app-bar color=#1DB954 dense>
          <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        </v-app-bar>
      </div>
    </template>

    <v-container>
      <v-row justify="center" align="center" class="mx-4 my-4">
        <v-img :src="leagueLogo" max-height="288" max-width="512" class="mx-4"></v-img>
        <div class="plus"></div>
        <v-img :src="spotifyLogo" max-height="288" max-width="512" class="mx-4"></v-img>
      </v-row>
    </v-container>

    <v-container>
      <v-row justify="center">
        <v-btn id="loginBtn" color=#1DB954 class="mx-4">Login</v-btn>
        <v-btn id="listenBtn" color=#1DB954 class="mx-4">Start Listening</v-btn>
        <v-btn id="mappingsBtn" color=#1DB954 class="mx-4">Mappings</v-btn>
      </v-row>
    </v-container>
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
    
  </v-app>
</template>

<script>

  export default {
    name: "App",

    loggingIn: false,
    leagueLogo: "",
    spotifyLogo: "",
    leagueAPIReturn: "",
    leagueData: [],
    spotifyToken: "",

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

      async playSpotify() {
        var endpoint = "https://api.spotify.com/v1/me/player/play"
        await fetch(endpoint, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.spotifyToken}`,
          },
          body: JSON.stringify({
            "uris": ["spotify:track:4bcMxSXijaZ9cGXynsRD3I"],
            "position_ms": 125000
          }),
        }).then(async (result) => {
          console.log(result)
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
      }),

      document.getElementById("listenBtn").addEventListener("click", async () => {
        if (this.leagueData != undefined) {
          console.log("listening")
          var poll = setInterval(async () => {
            await this.callLocalLeagueApi(this.leagueData[0], this.leagueData[1], "/lol-champ-select/v1/current-champion")
            //leagueAPIReturn = 105 //remove this later
            if (this.leagueAPIReturn == 105) {
              clearInterval(poll)
              await this.playSpotify()
            }
          }, 1000);
        }
        else {
            console.log("login first")
        }
      }),

      document.getElementById("mappingsBtn").addEventListener("click", async () => {
        window.location.pathname = "D:\\Github\\SpotifyLeagueIntegration\\src\\mappings.html"
      })


    },

    data() {
      return {
        leagueLogo: require(`@/assets/league_logo.jpg`),
        spotifyLogo: require(`@/assets/spotify_logo.jpg`),
        loggingIn: false
      }
    }

    
  };
</script>

<style scoped>
  .plus {
    display:inline-block;
    width:100px;
    height:100px;
    
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
