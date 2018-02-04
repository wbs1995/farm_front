<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="formData" label-position="left" label-width="70px"
             style='width: 400px; margin-left:50px;'>
      <el-form-item label="设备ID">
        <el-input v-model="formData.id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handlerRegister">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {deviceRegister} from '@/api/device'

  export default {
    name: 'deviceTable',
    data() {
      return {
        formData: {
          id: undefined
        }
      }
    },
    methods: {
      handlerRegister() {
        deviceRegister(this.formData).then(response => {
          if (response.status === 0) {
            this.$notify({
              title: '成功',
              message: response.msg,
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: response.msg
            })
          }
        })
      }
    }
  }
</script>

