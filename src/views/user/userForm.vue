<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{name}}</div>
  </div>
</template>

<script>
  export default {
    name: 'userForm',
    data() {
      return {
        name: '用户表单'
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
