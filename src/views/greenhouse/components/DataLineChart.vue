<template>
  <el-card class="card-container">
    <div :style="{height:height,width:width}"></div>
  </el-card>
</template>

<script>
  require('echarts/theme/dark')
  import echarts from 'echarts'
  import {debounce} from '@/utils'
  import {getData} from '@/api/data'

  export default {
    props: {
      chartData: {
        type: Object
      },
      chartType: {
        type: String,
        default: ''
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      },
      autoResize: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        options: {
          humidity: {
            title: '空气相对湿度',
            unit: '%',
            max: 99,
            min: 1
          },
          temperature: {
            title: '空气温度',
            unit: '°C',
            max: 30,
            min: -20
          }
        },
        chart: null,
        interval: null,
        size: 100,
        data: []
      }
    },
    mounted() {
      this.initData(100)
      this.initChart()
      if (this.autoResize) {
        this.__resizeHanlder = debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder)
      }

      // 监听侧边栏的变化
      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
      this.interval = setInterval(() => {
        const params = {
          id: this.chartData.id,
          type: this.chartType,
          size: 1
        }
        getData(params).then(res => {
          res.data.forEach(ele => {
            if (!this.inScope(ele.data)) {
              return
            }
            if (this.data.length <= this.size) {
              this.data.push({
                value: [ele.createTime, ele.data]
              })
              return
            }
            if (ele.createTime !== this.data[this.data.length - 1].value[0]) {
              this.data.shift()
              this.data.push({
                value: [ele.createTime, ele.data]
              })
            }
          })
        })
      }, 5000)
    },
    beforeDestroy() {
      if (this.interval) {
        this.integer.clearInterval()
      }
      if (!this.chart) {
        return
      }
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHanlder)
      }

      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

      this.chart.dispose()
      this.chart = null
    },
    watch: {
      data: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      },
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    methods: {
      setOptions() {
        this.chart.setOption({
          title: {
            text: this.options[this.chartType].title + ': ' + this.chartData.name,
            x: 'left'
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 50,
            right: 30,
            bottom: 30,
            top: 50,
            tainLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          yAxis: {
            type: 'value',
            max: this.options[this.chartType].max,
            min: this.options[this.chartType].min,
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: '{value} ' + this.options[this.chartType].unit
            }
          },
          series: [
            {
              type: 'line',
              symbol: 'none',
              itemStyle: {
                normal: {
                  color: '#3888fa',
                  lineStyle: {
                    color: '#3888fa',
                    width: 2
                  },
                  areaStyle: {
                    color: '#f3f8ff'
                  }
                }
              },
              data: this.data
            }]
        })
      },
      initData() {
        const params = {
          id: this.chartData.id,
          type: this.chartType,
          size: this.size
        }
        getData(params).then(res => {
          res.data.forEach(ele => {
            if (this.inScope(ele.data)) {
              this.data.push({
                value: [ele.createTime, ele.data]
              })
            }
          })
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.data)
      },
      inScope(val) {
        if (this.options[this.chartType].max < val) {
          return false
        }
        if (this.options[this.chartType].min > val) {
          return false
        }
        return true
      }
    }
  }
</script>

<style>
  .card-container {
    height: 200px;
    margin-top: 10px;
    margin-right: 20px;
  }
</style>
