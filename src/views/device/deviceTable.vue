<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="ID / 设备号" size="mini" clearable
                @change="handlerSearch" v-model="listQuery.title">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <el-table :data="list"
      border
      @sort-change="sortChange"
      size="mini"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        sortable="custom"
        width="80">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="did"
        label="设备号"
        width="250">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.did}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="model"
        label="型号"
        sortable="custom"
        width="100">
      </el-table-column>
      <el-table-column
        prop="token"
        label="认证码">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="150">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="最后登录日期"
        width="150">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"/>
          <el-button type="text" icon="el-icon-view"/>
          <el-button type="text" icon="el-icon-download"/>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNum"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="设备ID" v-if="dialogStatus=='update'">
          <el-input v-model="temp.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="username">
          <el-input v-model="temp.model" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备号" prop="username">
          <el-input v-model="temp.did" disabled></el-input>
        </el-form-item>
        <el-form-item label="认证码" prop="phone">
          <el-input v-model="temp.token" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建日期" v-if="dialogStatus=='update'">
          <el-date-picker v-model="temp.createTime" type="datetime" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最新登录" v-if="dialogStatus=='update'">
          <el-date-picker v-model="temp.updateTime" type="datetime" disabled>
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-else type="primary">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {fetchList} from '@/api/device'
  import {parseTime} from '@/utils'

  export default {
    name: 'deviceTable',
    data() {
      return {
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          importance: undefined,
          title: '',
          type: undefined,
          orderBy: 'id desc',
          sort: 'createTime'
        },
        temp: {
          id: undefined,
          createTime: '',
          updateTime: '',
          did: '',
          token: '',
          model: ''
        },
        sortOptions: [],
        checkboxVal: [],
        formThead: [], // 默认表头 Default header
        total: 0,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        key: '',
        rules: {
          name: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
          phone: [{required: true, message: '手机号码不能为空', trigger: 'blur'}]
        },
        list: []
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = [
          '在线',
          '离线',
          '禁用'
        ]
        return statusMap[status]
      },
      statusTypeFilter(status) {
        const statusArray = [
          'success',
          'info',
          'danger'
        ]
        return statusArray[status]
      },
      roleFilter(status) {
        const statusMap = [
          '管理',
          '用户'
        ]
        return statusMap[status]
      },
      parseTime
    },
    watch: {
      checkboxVal(valArr) {
        this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
        this.key = this.key + 1
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleRefresh() {
        this.listQuery.title = undefined
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handlerSearch() {
        this.getList()
      },
      sortChange(val) {
        console.log('column', val)
        const statusMap = {
          'descending': 'desc',
          'ascending': 'asc'
        }
        if (val.order) {
          this.listQuery.orderBy = val.prop + ' ' + statusMap[val.order]
        } else {
          this.listQuery.orderBy = undefined
        }
        this.getList()
      }
    }
  }
</script>
