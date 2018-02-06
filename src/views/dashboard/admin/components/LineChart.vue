<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'

//  require('echarts/theme/infographic')
  import {debounce} from '@/utils'

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
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
      setOptions({expectedData, actualData} = {}) {
        this.chart.setOption({
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            data: ['上周', '本周']
          },
          series: [
            {
              name: '上周',
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#FF005A',
                  lineStyle: {
                    color: '#FF005A',
                    width: 2
                  }
                }
              },
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              data: expectedData,
              animationDuration: 200,
              animationEasing: 'cubicInOut'
            },
            {
              name: '本周',
              type: 'line',
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              label: {
                normal: {
                  show: true,
                  position: 'bottom'
                }
              },
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
              data: actualData,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
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
