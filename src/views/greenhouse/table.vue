<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-switch v-model="expandVisible" active-color="#13ce66" inactive-color="#ff4949"
                 style="margin-left:5px;">
      </el-switch>
      <el-button type="success" size="mini" icon="el-icon-circle-check-outline" v-if="addVisible && this.name"
                 @click='addGreenhouse'>确认
      </el-button>
      <el-button size="mini" icon="el-icon-plus" v-else @click='addVisible=true'>添加</el-button>
      <template v-if="addVisible">
        <el-input size="mini" placeholder="请输入新大棚名称" v-model="name" style="width: 400px">
          <el-button slot="append" icon="el-icon-close" size="mini" @click="cancelAdd"></el-button>
        </el-input>
      </template>
    </div>
    <el-table :data="list" style="width: 100%" size="mini" border v-if="showTable" :default-expand-all="expandVisible">
      <el-table-column type="expand">
        <template slot-scope="props">
          <template class="demo-table-expand">
            <el-table :data="props.row.devices" style="width: 100%" border>
              <el-table-column label="设备ID" prop="id"></el-table-column>
              <el-table-column label="设备名称" prop="name"></el-table-column>
            </el-table>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="大棚ID" prop="id"></el-table-column>
      <el-table-column label="大棚名称" prop="name"></el-table-column>
      <el-table-column label="操作" prop="desc">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-close" @click="deleteDialogVisible=true">删除</el-button>
          <el-button type="text" icon="el-icon-plus" @click="handleDevice(scope.row)">设备管理</el-button>

          <el-dialog title="删除大棚, 一旦删除, 将无法恢复记录!" :visible.sync="deleteDialogVisible" width="30%" center>
            <h2>id: "{{scope.row.id}}"</h2>
            <h2>大棚名称: "{{scope.row.name}}"</h2>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deleteDialogVisible = false">取 消</el-button>
              <el-button type="danger" @click="removeGreenhouse">删 除</el-button>
            </span>
          </el-dialog>

          <el-dialog title="添加设备" :visible.sync="deviceDialogVisible" width="50%" center>
            <el-row>
              <el-col :span="20" :push="2">
                <el-transfer filterable v-model="binDevices" :data="devices" :props="tranProps" :titles="addTransfer">
                </el-transfer>
              </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deviceDialogVisible = false">取 消</el-button>
              <el-button type="danger" @click="updateDevice">确 认</el-button>
            </span>
          </el-dialog>

        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNum"
                     :page-sizes="[5,10,20,30,50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {add, remove, getList} from '@/api/greenhouse'
  import {bindGreenhouse, fetchListNoPage} from '@/api/device'

  export default {
    data() {
      return {
        list: [],
        name: undefined,
        addVisible: false,
        showTable: true,
        expandVisible: false,
        dialogAddVisible: false,
        deleteDialogVisible: false,
        deviceDialogVisible: false,
        addTransfer: ['新设备', '已绑定设备'],
        tranProps: {key: 'id', label: 'name'},
        greenhouse: {
          id: undefined
        },
        devices: [],
        binDevices: [],
        listQuery: {
          pageNum: 1,
          pageSize: 5,
          importance: undefined,
          title: '',
          type: undefined,
          orderBy: 'id desc'
        },
        total: 0
      }
    },
    methods: {
      getList() {
        getList(this.listQuery).then(res => {
          this.list = res.data.list
          this.total = res.data.total
        })
      },
      addGreenhouse() {
        if (!this.name) {
          return
        }
        add(this.name).then(res => {
          if (res.status === 0) {
            this.getList()
            this.cancelAdd()
          }
        })
      },
      removeGreenhouse(row) {
        remove().then(res => {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
        })
      },
      cancelAdd() {
        this.addVisible = false
        this.name = undefined
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleDevice(row) {
        this.greenhouse = Object.assign({}, row)
        fetchListNoPage().then(res => {
          this.devices = res.data
        })
        this.binDevices = []
        row.devices.forEach(ele => {
          this.binDevices.push(ele.id)
        })
        this.deviceDialogVisible = true
      },
      updateDevice() {
        bindGreenhouse(this.binDevices, this.greenhouse.id).then(res => {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.deviceDialogVisible = false
        })
      }
    },
    watch: {
      expandVisible() {
        this.showTable = false
        this.$nextTick(() => {
          this.showTable = true
        })
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>


<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 100%;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  .el-table .el-table__expanded-cell {
    background: #82848a;
  }
</style>
