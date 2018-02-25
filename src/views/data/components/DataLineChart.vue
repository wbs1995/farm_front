<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  require('echarts/theme/dark')
  import echarts from 'echarts'
  import {debounce} from '@/utils'

  export default {
    props: {
      className: {
        type: String,
        default: 'data-line-chart'
      },
      chartTitle: {
        type: String,
        default: '单直线数据图'
      },
      chartUnit: {
        type: String,
        default: ''
      },
      chartMax: {
        type: Number,
        default: undefined
      },
      chartMin: {
        type: Number,
        default: undefined
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
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
    },
    beforeDestroy() {
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
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    methods: {
      setOptions({actualData, actualTime} = {}) {
        this.chart.setOption({
          title: {
            text: this.chartTitle,
            x: 'center'
          },
          xAxis: {
            data: actualTime,
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 50,
            right: 40,
            bottom: 40,
            top: 50,
            tainLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          yAxis: {
            type: 'value',
            max: this.chartMax,
            min: this.chartMin,
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: '{value} ' + this.chartUnit
            }
          },
          dataZoom: [
            {
              show: true,
              start: 1,
              end: 100
            },
            {
              type: 'inside'
            }
          ],
          series: [
            {
              type: 'line',
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
              data: actualData
            }]
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'infographic')
        this.setOptions(this.chartData)
      }
    }
  }
</script>
