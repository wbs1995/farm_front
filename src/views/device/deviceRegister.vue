<template>
  <div class="app-container">
    <el-row>
      <el-col :span="2">
        <div style="height: 500px;">
          <el-steps direction="vertical" :active="active" finish-status="success">
            <el-step title="注册"></el-step>
            <el-step title="定位"></el-step>
            <el-step title="激活"></el-step>
          </el-steps>
        </div>
      </el-col>
      <el-col :span="9" :push="6" v-show="active==0" class="step-item-0">
        <el-input placeholder="请输入注册码" v-model="did">
          <el-button slot="append" @click="handlerRegister">注册</el-button>
        </el-input>
      </el-col>
      <el-col :span="20" :push="1" v-show="active==1">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="设备名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="经度">
            <el-input v-model="form.lng"></el-input>
          </el-form-item>
          <el-form-item label="纬度">
            <el-input v-model="form.lat"></el-input>
          </el-form-item>
          <el-form-item>
            <amap-position :lat="form.lat" :lng="form.lng" @click="changePosition"></amap-position>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="update">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="9" :push="6" v-show="active==2" class="step-item-0">
        <span>激活成功</span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {deviceRegister, deviceUpdate} from '@/api/device'
  import amapPosition from '@/components/AmapPosition'

  export default {
    name: 'deviceRegister',
    components: {
      amapPosition
    },
    data() {
      return {
        active: 0,
        did: '',
        form: {
          id: undefined,
          name: undefined,
          lng: 0,
          lat: 0
        },
        plugin: ['ToolBar']
      }
    },
    methods: {
      handlerRegister() {
        deviceRegister(this.did).then(response => {
          if (response.status === 0) {
            this.form.id = response.data.id
            this.active = 1
          } else {
            this.$notify.error({
              title: '失败',
              message: response.msg
            })
          }
        })
      },
      changePosition(lng, lat) {
        this.form.lng = lng
        this.form.lat = lat
      },
      update() {
        deviceUpdate(this.form).then(res => {
          if (res.status === 0) {
            this.active = 2
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .step-item-0 {
    margin-top: 160px;
  }
</style>

