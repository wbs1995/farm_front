<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="ID / 设备号" size="mini" clearable
                @change="handlerSearch" v-model="listQuery.title">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <el-table :data="list" border @sort-change="sortChange" size="mini" style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        sortable="custom"
        width="80">
      </el-table-column>
      <el-table-column
        prop="name"
        label="设备名称">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input class="edit-input" size="mini" v-model="scope.row.name">
              <el-button class='cancel-btn' slot="append" size="mini" @click="cancelEdit(scope.row)">撤销
              </el-button>
            </el-input>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="did"
        label="设备ID"
        width="250">
        <template slot-scope="scope">
          <span>{{scope.row.did}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="model"
        label="型号"
        sortable="custom"
        width="100">
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
          <el-button v-if="scope.row.edit" icon="el-icon-circle-check" @click="confirmEdit(scope.row)"></el-button>
          <el-button v-else type="text" icon="el-icon-edit" @click='scope.row.edit=!scope.row.edit'></el-button>
          <el-button type="text" icon="el-icon-document" @click="handleUpdate(scope.row)"></el-button>
          <el-button type="text" icon="el-icon-view" @click='handleMap(scope.row)'></el-button>
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
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="device" label-position="left" label-width="70px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="设备ID">
          <el-input v-model="device.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备ID">
          <el-input v-model="device.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="username">
          <el-input v-model="device.model" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备号" prop="username">
          <el-input v-model="device.did" disabled></el-input>
        </el-form-item>
        <el-form-item label="认证码" prop="phone">
          <el-input v-model="device.token" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker v-model="device.createTime" type="datetime" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最新登录">
          <el-date-picker v-model="device.updateTime" type="datetime" disabled>
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogMapVisible" title="地图">
      <el-switch style="margin-bottom: 20px" v-model="lockPosition" active-text="锁定坐标"
                 inactive-color="#ff4949"></el-switch>
      <amap-position :lat="device.lat" :lng="device.lng" @click="changePosition"></amap-position>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelPosition">取 消</el-button>
       <el-button type="primary" @click="savePosition">保存坐标</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, deviceUpdate} from '@/api/device'
  import {parseTime} from '@/utils'
  import amapPosition from '@/components/AmapPosition'

  export default {
    name: 'deviceTable',
    components: {
      amapPosition
    },
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
        device: {
          id: undefined,
          name: '',
          lng: 0,
          lat: 0,
          originLng: 0,
          originLat: 0,
          createTime: '',
          updateTime: '',
          did: '',
          token: '',
          model: ''
        },
        total: 0,
        lockPosition: true,
        dialogFormVisible: false,
        dialogMapVisible: false,
        list: []
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = ['在线', '离线', '禁用']
        return statusMap[status]
      },
      statusTypeFilter(status) {
        const statusArray = ['success', 'info', 'danger']
        return statusArray[status]
      },
      roleFilter(status) {
        const statusMap = ['管理', '用户']
        return statusMap[status]
      },
      parseTime
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          const items = response.data.list
          this.list = items.map(v => {
            this.$set(v, 'edit', false)
            v.originalName = v.name
            return v
          })
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
      cancelEdit(row) {
        row.name = row.originalName
        row.edit = false
      },
      confirmEdit(row) {
        var device = Object.assign({}, row)
        device.updateTime = undefined
        device.createTime = undefined
        deviceUpdate(device).then(res => {
          row.edit = false
          this.$message({
            message: res.msg,
            type: 'success'
          })
        })
      },
      handlerSearch() {
        this.getList()
      },
      handleUpdate(row) {
        this.device = Object.assign({}, row)
        this.dialogFormVisible = true
      },
      handleMap(row) {
        this.device = row
        this.device.originLng = row.lng
        this.device.originLat = row.lat
        this.lockPosition = true
        this.dialogMapVisible = true
        console.log(row)
      },
      changePosition(lng, lat) {
        if (!this.lockPosition) {
          this.device.lng = lng
          this.device.lat = lat
          console.log(lng, lat)
        }
      },
      savePosition() {
        this.dialogMapVisible = false
        this.confirmEdit(this.device)
      },
      cancelPosition() {
        this.dialogMapVisible = false
        this.device.lng = this.device.originLng
        this.device.lat = this.device.originLat
      },
      sortChange(val) {
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
