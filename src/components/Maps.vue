<template>
  <div>
    <h2>{{ champion }}</h2>
  </div>
</template>

<script>
export default {
  mounted() {
    this.champion = this.$route.params.data
  },


  data() {
    return {
      champion: ""
    }
  }
}
</script>