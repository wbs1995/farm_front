<template>
  <div>
    <img :src="loadUrl">
  </div>
</template>

<script>
  export default {
    props: {
      imgUrl: {
        type: String,
        default: ''
      },
      pause: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        imageNr: 0,
        loadUrl: ''
      }
    },
    methods: {
      createImageLayer() {
        this.loadUrl = this.imgUrl + '=' + ++this.imageNr
        const img = new Image()
        img.src = this.loadUrl
        if (this.pause) {
          img.onload = this.createImageLayer()
        }
      }
    },
    mounted() {
      this.createImageLayer()
    }
  }
</script>
