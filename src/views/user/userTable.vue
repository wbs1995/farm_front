<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="姓名/手机号码/地址" size="medium"
                v-model="listQuery.title">
      </el-input>
      <!--<el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="getList">搜索</el-button>-->
      <!--<el-button class="filter-item" style="margin-left: 10px;" size="medium" type="primary" icon="el-icon-edit"-->
      <!--@click="handleCreate">创建-->
      <!--</el-button>-->
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-download">下载</el-button>
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-refresh" @click="getList">刷新</el-button>
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="lastDate">最后登录日期</el-checkbox>
        <el-checkbox label="createTime">创建日期</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-table
      :data="list"
      border
      @sort-change="sortChange"
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
        prop="username"
        label="姓名"
        width="180">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
      <el-table-column
        prop="role"
        label="身份"
        sortable="custom"
        width="80">
        <template slot-scope="scope">
          <el-tag>{{scope.row.role | roleFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        sortable="custom"
        width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="createTime"-->
        <!--label="创建日期"-->
        <!--width="180">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="updateTime"
        label="最后登录日期"
        width="180">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="230" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">查看</el-button>
          <!--<el-button type="success" size="mini">授权</el-button>-->
          <el-button v-if="scope.row.status != 2" type="danger" size="mini" @click="handleStatus(scope.row)">禁用</el-button>
          <el-button v-else type="primary" size="mini" @click="handleStatus(scope.row)">激活</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNum"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="用户ID" v-if="dialogStatus=='update'">
          <el-input v-model="temp.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address"></el-input>
        </el-form-item>
        <el-form-item label="创建日期" v-if="dialogStatus=='update'">
          <el-date-picker v-model="temp.createTime" type="datetime" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最新登录" v-if="dialogStatus=='update'">
          <el-date-picker v-model="temp.updateTime" type="datetime" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-else type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {fetchList, userUpdate} from '@/api/user'
  import {parseTime} from '@/utils'

  export default {
    name: 'userTable',
    data() {
      return {
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          orderBy: 'status desc',
          sort: 'createTime'
        },
        temp: {
          id: undefined,
          createTime: '',
          updateTime: '',
          phone: '',
          role: [],
          name: '',
          deleteStatus: 0,
          address: '',
          remark: ''
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
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleStatus(row) {
        this.temp = Object.assign({}, row)
        // 更改用户状态
        this.temp.status = this.temp.status === 2 ? 1 : 2
        this.temp.updateTime = undefined
        this.temp.createTime = undefined
        userUpdate(this.temp).then(response => {
          this.$notify({
            title: '状态',
            message: response.msg,
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      },
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.updateTime = undefined
            this.temp.createTime = undefined
            userUpdate(this.temp).then(response => {
              this.dialogFormVisible = false
              this.$notify({
                title: '更新结果',
                message: response.msg,
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
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
