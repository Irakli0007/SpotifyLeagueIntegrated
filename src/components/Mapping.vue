<template>
  <div>
    <v-row>
      <template v-for="item in champions">
        <v-col cols="2" :key="item.id">
          <v-card class="mx-6 my-6" >
            <v-card-title>{{ item.id }}</v-card-title>
            <v-img max-width="120" max-height="120" :src="require(`@/assets/champion_images/11.11.1/img/champion/${item.id}.png`)"></v-img>
            <v-list-item @click="map(item)">
              <v-list-item-icon>
                <!-- <v-icon color="#1DB954"></v-icon> -->
              </v-list-item-icon>
              <v-list-item-title>Map {{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </div>
</template>


<script>


export default {
  name: "Mapping",

  methods: {

     map(item) {
       this.$router.push({name: "Map", props: item})
     },

  },

  created() {

  },

  mounted() {
    fetch("http://ddragon.leagueoflegends.com/cdn/11.11.1/data/en_US/champion.json").then((result) => {
      result.json().then((data) => {
        this.champions = data.data
      })
    })
  },

  data() {
    return {
      champions: ""
    }
  }

}
</script>