<template>
  <div class="dashboard-editor-container">
    <panel-group
      @handleSetLineChartData="handleSetLineChartData"
      :newUserCount="panelGroupData.newUserCount"
      :newDeviceCount="panelGroupData.newUserCount"
      :networkTrafficCount="panelGroupData.networkTrafficCount"
      :deviceFailureCount="panelGroupData.deviceFailureCount">
    </panel-group>
    <el-row style="background:#fff;padding:32px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData">
      </line-chart>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  import RaddarChart from './components/RaddarChart'
  import PieChart from './components/PieChart'
  import BarChart from './components/BarChart'
  import {newUserCount} from '@/api/user'

  const lineChartData = {
    newUser: {
      expectedData: [],
      actualData: []
    },
    newDevices: {
      expectedData: [200, 192, 120, 144, 160, 130, 140],
      actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    networkTraffic: {
      expectedData: [80, 100, 121, 104, 105, 90, 100],
      actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    deviceFailure: {
      expectedData: [130, 140, 141, 142, 145, 150, 160],
      actualData: [120, 82, 91, 154, 162, 140, 130]
    }
  }
  export default {
    name: 'dashboard-admin',
    components: {
      PanelGroup,
      RaddarChart,
      PieChart,
      BarChart,
      LineChart
    },
    data() {
      return {
        lineChartData: lineChartData.newUser,
        panelGroupData: {
          newUserCount: 20,
          newDeviceCount: 0,
          networkTrafficCount: 0,
          deviceFailureCount: 0
        }
      }
    },
    methods: {
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
        if (type === 'newUser') {
          this.getUserCount()
        }
      },
      getUserCount() {
        newUserCount(1).then(response => {
          this.lineChartData.expectedData = response.data.count
        })
        newUserCount(0).then(response => {
          this.panelGroupData.newUserCount = response.data.total
          this.lineChartData.actualData = response.data.count
        })
      }
    },
    mounted() {
      this.getUserCount()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
