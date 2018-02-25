<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newUser')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">新增用户</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="newUserCount" :duration="2000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newDevices')">
        <div class="card-panel-description">
          <div class="card-panel-text">新增设备</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="newDeviceCount" :duration="3000"></count-to>
        </div>
        <div class="card-panel-icon-wrapper icon-deviceCard">
          <svg-icon icon-class="device2" class-name="card-panel-icon"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('networkTraffic')">
        <div class="card-panel-icon-wrapper icon-download">
          <svg-icon icon-class="networkTraffic" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">数据流量</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="networkTrafficCount" :duration="3200"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('deviceFailure')">
        <div class="card-panel-icon-wrapper icon-errorCard">
          <svg-icon icon-class="error2" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">新增故障</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="deviceFailureCount" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import CountTo from 'vue-count-to'

  export default {
    props: {
      newUserCount: {
        type: Number,
        default: 0
      },
      newDeviceCount: {
        type: Number,
        default: 0
      },
      networkTrafficCount: {
        type: Number,
        default: 0
      },
      deviceFailureCount: {
        type: Number,
        default: 0
      }
    },
    components: {
      CountTo
    },
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-deviceCard {
          background: #36a3f7;
        }
        .icon-download {
          background: #34bfa3;
        }
        .icon-errorCard {
          background: #f4516c
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-deviceCard {
        color: #36a3f7;
      }
      .icon-download {
        color: #34bfa3;
      }
      .icon-errorCard {
        color: #f4516c
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
