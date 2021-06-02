<template>
  <div>
    <v-col class="mx-auto" cols=4>
      <v-textarea
        color=#1DB954
        label="Search Champions"
        auto-grow
        outlined
        rows="1"
        @keydown.enter.exact.prevent
        @keyup.enter.exact="search"
        v-model="searchStr"
      ></v-textarea>
    </v-col>
    <v-row>
      <template v-for="item in results">
        <v-col cols="2" :key="item.id">
          <v-card class="mx-6 my-6" :id="`${item.id}`">
            <v-card-title>{{ item.name }}</v-card-title>
            <!--<v-img max-width="120" max-height="120" :src="require(`@/assets/champion_images/11.11.1/img/champion/${item.id}.png`)"></v-img> -->
            <v-img max-width="120" max-height="120" :src="`http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${item.id}.png`"></v-img>
            <v-list-item @click="map(item)">
              <v-list-item-icon>
              <v-icon color="#1DB954">mdi-music</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Map {{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <maps 
      v-if="mapping" 
      @back="onBack()"
      :championData="currentChampion"
      :token="spotify_token"
    >
    </maps>
  </div>
</template>


<script>
  import Maps from '../components/Maps.vue'

  export default {
    components: {
      Maps
    },

    name: "Mapping",

    methods: {

      /* eslint-disable no-unused-vars */
      map(item) {
        this.currentChampion = item
        this.mapping = true
      },

      onBack() {
        this.mapping = false
        this.currentChampion = ""
      },

      search() {
        location.href = "#"
        location.href = "#" + this.searchStr
      },

      /* eslint-disable no-unused-vars */
      myFilter(str) {
        const arr = []
        for (const [key, value] of Object.entries(this.champions)) {
          arr.push(value)
        }
        return arr.filter(name => name.id.toLowerCase().includes(str.toLowerCase()))
      },
    },

    computed: {
      results() {
        if (this.searchStr) {
          return this.myFilter(this.searchStr)
        }
        else {
          return this.champions
        }
      },
      spotify_token() {
        return this.$route.params.spotify_Token
      }

    },

    mounted() {
      fetch("http://ddragon.leagueoflegends.com/cdn/11.11.1/data/en_US/champion.json").then((result) => {
        result.json().then((data) => {
          this.champions = data.data
        })
      })
      fetch("https://ddragon.leagueoflegends.com/api/versions.json").then((result) => {
        result.json().then((data) => {
          this.version = data[0]
        })
      })
    },
    
    created() {
      
    },

    data() {
      return {
        champions: "",
        version: "",
        searchStr: "",
        mapping: false,
        currentChampion: "",
      }
    }

  }
</script>


<style scoped>

  .v-text-field--outlined >>> fieldset {
    border-color: #1DB954;
  }


</style>