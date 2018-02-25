<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :lg="16">
        <el-card :body-style="mapCardStyle">
          <el-amap vid="amapDemo" :features="features" class="amap-box">
            <el-amap-marker vid="component-marker" :position="componentMarker.position"
                            :content-render="componentMarker.contentRender" ></el-amap-marker>
          </el-amap>
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>实时报警</span>
            <el-button style="float: right; padding: 3px 0" type="text">刷新</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  const exampleComponents = {
    props: ['did'],
    template: `<div>报警: {{did}}</div>`
  }
  export default {
    name: 'amap-page',
    data() {
      return {
        mapCardStyle: {
          padding: '0px'
        },
        features: ['road', 'point'],
        componentMarker: {
          position: [119.738956, 29.114425],
          contentRender: (h, instance) => h(exampleComponents, {
            style: {backgroundColor: '#fff'},
            props: {did: 't531w935952'}
          })
        }
      }
    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .amap-box {
    width: 100%;
    height: 550px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    height: 350px;
  }
</style>
