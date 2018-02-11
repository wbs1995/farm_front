<template>
  <el-row>
    <el-col :span="4">
      <el-table :data="tableList" style="width: 180px" border @row-click="clickRow">
        <el-table-column prop="name" label="大棚列表">
          <template>

          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="10" v-for="humidity in humidityData" :key="'h' + humidity.id">
      <data-line-chart :chart-data="humidity" chart-type="humidity">
      </data-line-chart>
    </el-col>
    <el-col :span="10" v-for="temperature in temperatureData" :key="'t' + temperature.id">
      <data-line-chart :chart-data="temperature" chart-type="temperature">
      </data-line-chart>
    </el-col>
  </el-row>
</template>
<script>
  import dataLineChart from './components/DataLineChart'
  import {greenhouseListNoPage} from '@/api/greenhouse'

  export default {
    components: {
      dataLineChart
    },
    data() {
      return {
        tableList: [],
        humidityData: [],
        temperatureData: []
      }
    },
    methods: {
      getList() {
        greenhouseListNoPage().then(res => {
          this.tableList = res.data
        })
      },
      clickRow(row) {
        this.humidityData = row.devices
        this.temperatureData = row.devices
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>
