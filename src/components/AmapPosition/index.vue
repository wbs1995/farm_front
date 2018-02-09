<template>
  <el-card :body-style="mapCardStyle">
    <el-amap v-if="lng!=0" vid="amapDemo" :events="events" :center="center" :plugin="plugin">
      <el-amap-marker vid="component-marker" :position="position"></el-amap-marker>
    </el-amap>
    <el-amap v-else vid="amapDemo" :events="events" :plugin="plugin">
      <el-amap-marker vid="component-marker" :position="position"></el-amap-marker>
    </el-amap>
  </el-card>
</template>

<script>
  export default {
    name: 'AmapPosition',
    props: {
      lng: {
        type: Number,
        default: 0
      },
      lat: {
        type: Number,
        default: 0
      }
    },
    computed: {
      position() {
        return [this.lng, this.lat]
      },
      center() {
        return this.position
      }
    },
    data() {
      return {
        mapCardStyle: {
          padding: '0px',
          height: '400px'
        },
        plugin: ['ToolBar'],
        events: {
          'click': (e) => {
            this.$emit('click', e.lnglat.lng, e.lnglat.lat)
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
