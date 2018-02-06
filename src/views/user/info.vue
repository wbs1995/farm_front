<template>
  <div class="app-container">
    <el-tabs type="border-card" @tab-click="handlerTabClick">
      <el-tab-pane label="Info">
        <span slot="label">基本信息</span>
        <el-form ref="dataForm" :model="user" label-position="left" label-width="70px"
                 style='width: 400px; margin-left:50px;'>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="user.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="address">
            <el-input v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item label="创建日期">
            <el-date-picker v-model="user.createTime" type="datetime" disabled></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button>更新信息</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="头像修改">
        <pan-thumb :image="avatar"></pan-thumb>
        <el-button plain @click="toggleShow">设置头像</el-button>
        <my-upload field="upload_file" @crop-upload-success="cropUploadSuccess" v-model="show" :url="url"
                   :headers="headers"></my-upload>
      </el-tab-pane>

      <el-tab-pane label="密码修改">
        <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px"
                 style='width: 400px; margin-left:50px;'>
          <el-form-item label="原始密码" prop="username">
            <el-input v-model="temp.password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="temp.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="secondPassword">
            <el-input type="password" v-model="temp.secondPassword"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import myUpload from 'vue-image-crop-upload'
  import {getToken} from '@/utils/auth'
  import PanThumb from '@/components/PanThumb'
  import {getInfo} from '@/api/login'

  export default {

    data() {
      return {
        temp: {
          password: '',
          newPassword: '',
          secondPassword: ''
        },
        user: {
          username: '',
          phone: '',
          email: '',
          createTime: '',
          updateTime: '',
          address: ''
        },
        show: false,
        headers: {
          Authorization: getToken()
        },
        url: process.env.BASE_API + '/user/upload.do'
      }
    },
    computed: {
      ...mapGetters([
        'avatar'
      ])
    },
    components: {
      myUpload,
      PanThumb
    },
    methods: {
      toggleShow() {
        this.show = !this.show
      },
      cropUploadSuccess(jsonData, field) {
        this.imgDataUrl = jsonData.data.url
      },
      handlerTabClick(val) {
        switch (val.label) {
          case 'Info':
            this.handlerInfo()
            break
        }
      },
      handlerInfo() {
        getInfo(getToken()).then(response => {
          this.user = response.data
        })
      }
    },
    mounted() {
      this.handlerInfo()
    }
  }
</script>
