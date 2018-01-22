<template>
  <div class="login-register-container">
    <div class="login-container">
      <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
               label-width="0px"
               class="card-box login-form">
        <h3 class="title">智慧农业物联网平台</h3>
        <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户"/>
        </el-form-item>
        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                    autoComplete="on"
                    placeholder="密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <div class="tips">
          <span>没有账号?</span>
        </div>
        <div class="tips">
          <span>初次使用请点击注册按钮</span>
        </div>
        <el-button class="thirdparty-button" type="success" @click="dialogFormVisible=true">注册</el-button>
      </el-form>
    </div>
    <div class="register-container">
      <el-dialog title="用户注册" :visible.sync="dialogFormVisible" :show-close="false" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <el-form :rules="registerRules" ref="dataForm" :model="temp" label-position="left" label-width="80px"
                 style='width: 400px; margin-left:50px;'>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="temp.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="temp.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="temp.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="temp.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="againPassword">
            <el-input v-model="temp.againPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="temp.address"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRegister">注册</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {validation} from '@/api/login'
  import {userRegister} from '@/api/user'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('用户名不能小于5位'))
        } else {
          validation(value, 'username').then(response => {
            if (response.status !== 0) {
              callback(new Error('用户名已被占用'))
            } else {
              callback()
            }
          })
        }
      }
      const validateEmail = (rule, value, callback) => {
        validation(value, 'email').then(response => {
          if (response.status !== 0) {
            callback(new Error('邮箱已被占用'))
          } else {
            callback()
          }
        })
      }
      const confirmPassword = (rule, value, callback) => {
        if (this.temp.password !== value) {
          callback(new Error('两次密码不一样, value: ', value))
        } else {
          callback()
        }
      }
      const validateLoginName = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('用户名不能小于5位'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          console.log('123')
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateLoginName}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
        pwdType: 'password',
        temp: {
          phone: '',
          password: '',
          againPassword: '',
          address: ''
        },
        registerRules: {
          username: [{required: true, validator: validateUsername}],
          email: [{required: true, validator: validateEmail}],
          password: [{required: true, trigger: 'blur', validator: validatePass}],
          againPassword: [{required: true, trigger: 'blur', validator: confirmPassword}],
          address: [{required: true, trigger: 'blur'}]
        },
        dialogFormVisible: false
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleRegister() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            userRegister(this.temp).then(response => {
              if (response.status === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.msg,
                  type: 'success'
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: response.msg
                })
              }
            })
          }
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";

  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    @include relative;
    height: 100vh;
    background-color: $bg;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 10px;
        }
      }
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
</style>
