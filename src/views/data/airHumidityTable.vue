<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :lg="6">
      <el-table :data="list" size="mini" height="500" @row-click="handleRowClick">
        <el-table-column prop="did" label="设备列表">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.did}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :lg="18">
      <data-line-chart :chart-data="tempLineChartData" :chart-title="dataLineChart.title"
                       :chart-unit="dataLineChart.unit" :chart-max="dataLineChart.max"
                       :chart-min="dataLineChart.min"></data-line-chart>
    </el-col>
  </el-row>
</template>

<script>
  import dataLineChart from './components/DataLineChart'
  import {getData} from '@/api/data'
  import {fetchListNoPage} from '@/api/device'
  import {parseTime} from '@/utils'

  export default {
    data() {
      return {
        dataLineChart: {
          title: '空气相对湿度数据表',
          unit: '%',
          max: 99,
          min: 1
        },
        dataQuery: {
          id: -1,
          type: 'humidity'
        },
        dataLoading: false,
        tempLineChartData: {
          actualData: [],
          actualTime: []
        },
        list: [],
        listLoading: false
      }
    },
    components: {
      dataLineChart
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchListNoPage().then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      getData() {
        this.dataLoading = true
        getData(this.dataQuery).then(response => {
          const list = response.data
          if (list) {
            list.forEach(ele => {
              if (ele.data > 0) {
                this.tempLineChartData.actualData.push(ele.data)
                this.tempLineChartData.actualTime.push(parseTime(ele.createTime, '{m}-{d} {h}:{i}'))
              }
            })
          }
          this.dataLoading = false
        })
      },
      handleRowClick(row) {
        this.dataQuery.id = row.id
      }
    },
    watch: {
      dataQuery: {
        deep: true,
        handler() {
          this.getData()
        }
      },
      list(val) {
        if (this.dataQuery.id === -1) {
          if (val.length > 0) {
            this.dataQuery.id = val[0].id
          }
        }
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
  }
</style>

