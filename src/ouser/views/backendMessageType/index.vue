<template>
  <div>
    <section>
      <ody-list-table-area>
        <div slot="tabs">
          <el-button name="initAddMessageTypeDialog" size="small" type="primary" @click="initAddMessageTypeDialog">{{ $t('新增') }}</el-button>
        </div>
        <div slot="table">
          <ody-table
            :data="messageTypeData"
            :columns="columns"
            :operates="operRation"
            :multiple="true"
            name="messageTypeData597"/>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page="currentPage4"
              :list="messageTypeData"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="10"
              :total.sync="messageTypeTotal"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"/>
          </div>
        </div>
      </ody-list-table-area>
    </section>

    <!--编辑公告类型dialog-->
    <ody-dialog :visible.sync="messageTypeDialog.show" :title="messageTypeDialog.title">
      <div style="text-align: center;">
        <el-form label-width="200px">
          <el-form-item :label="$t('公告类型')">
            <el-input v-model="messageTypeDialog.obj.type" name="messageTypeDialog_obj_type" style="width: 300px; display: inline-block; float: left;"/>
          </el-form-item>
          <el-form-item :label="$t('公告子类型')">
            <el-input v-model="messageTypeDialog.obj.subType" name="messageTypeDialog_obj_subType" style="width: 300px; display: inline-block; float: left;"/>
          </el-form-item>
          <el-form-item :label="$t('发送范围')">
            <el-checkbox-group v-model="sendTypeList" name="sendTypeList">
              <el-checkbox :label="$t('员工')" style="float: left; margin-left: 20px;"/>
              <el-checkbox :label="$t('客户')" style="float: left;"/>
              <el-checkbox :label="$t('会员')" style="float: left;"/>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button name="messageTypeDialog_show" @click="messageTypeDialog.show = false">{{ $t('取消') }}</el-button>
          <el-button name="handleSaveMessageType" type="primary" @click="handleSaveMessageType">{{ $t('保存') }}</el-button>
        </el-row>
      </div>
    </ody-dialog>

    <!--删除提示dialog-->
    <ody-dialog :visible.sync="confirmDialog.show" :title="confirmDialog.title" width="600px">
      <label style="text-align: center;">{{ confirmDialog.message }}</label>
      <el-row style="text-align: center; margin-top: 20px;">
        <el-button name="confirmDialog_show" size="small" @click="confirmDialog.show = false">{{ $t('取消') }}</el-button>
        <el-button name="handleConfirm" size="small" type="primary" @click="handleConfirm">{{ $t('确定') }}</el-button>
      </el-row>
    </ody-dialog>

  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  name: 'OuserBackendMessageType',
  data() {
    const self = this
    return {
      messageTypeData: [],
      messageTypeTotal: 0,
      columns: [
        {
          show: true,
          prop: 'type',
          label: '公告类型',
          align: 'left',
          minWidth: 200
        },
        {
          show: true,
          prop: 'subType',
          label: '公告子类型',
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'createTimeStr',
          label: '创建时间',
          align: 'center'
        }
      ],
      operRation: {
        width: 200,
        fixed: 'right',
        list: [
          {
            label: '编辑',
            show: false,
            hidden: false,
            disabled: false,
            method(index, row) {
              self.initEditMessageTypeDialog(index, row)
            }
          },
          {
            label: '删除',
            show: false,
            hidden: false,
            disabled: false,
            method(index, row) {
              self.initConfirmDialog(index, row)
            }
          }]
      },
      messageTypeDialog: { show: false, title: '', isAdd: true, obj: {}},
      currentMessageType: {},
      sendTypeList: [],
      confirmDialog: { show: false, message: '', title: '' }
    }
  },
  mounted() {
    this.init(1)
  },
  methods: {
    async init(currentPage) {
      // 初始化
      const self = this
      const backendMessageService = this.$ouser.$api.backendMessageService

      self.sendTypeList = []
      // 1、初始化站内信类型列表
      backendMessageService.queryMessageTypePage({ currentPage: currentPage, itemsPerPage: 10 }).then(res => {
        util.formatDate(res.data.listObj, 'createTime')
        self.messageTypeData = res.data.listObj
        self.messageTypeTotal = res.data.total
      })
    },
    handleSaveMessageType() {
      const self = this
      const backendMessageService = this.$ouser.$api.backendMessageService

      // 构建发送范围
      var sendType = ''

      for (var i = 0; i < self.sendTypeList.length; i++) {
        if (self.sendTypeList[i] === '') {
          continue
        }
        sendType = sendType + self.sendTypeList[i]
        if (i < self.sendTypeList.length - 1) {
          sendType = sendType + ','
        }
      }
      self.messageTypeDialog.obj.sendType = sendType
      if (self.messageTypeDialog.isAdd) {
        backendMessageService.insertMessageType(self.messageTypeDialog.obj).then(res => {
          self.$message({
            message: '新增成功',
            type: 'success'
          })
          self.messageTypeDialog.show = false
          self.init(1)
        })
      } else {
        backendMessageService.updateMessageType(self.messageTypeDialog.obj).then(res => {
          self.$message({
            message: '修改成功',
            type: 'success'
          })
          self.messageTypeDialog.show = false
          self.init(1)
        })
      }
    },
    initAddMessageTypeDialog() {
      const self = this
      self.messageTypeDialog.show = true
      self.messageTypeDialog.title = '新增公告类型'
      self.messageTypeDialog.isAdd = true
    },
    initEditMessageTypeDialog(index, row) {
      const self = this
      self.sendTypeList = []
      self.messageTypeDialog.title = '编辑公告类型'
      self.currentMessageType = row
      self.messageTypeDialog.isAdd = false
      self.messageTypeDialog.obj = row
      self.messageTypeDialog.show = true
      // 初始化多选框列表
      if (row.sendType !== null && row.sendType !== '') {
        var sendType = row.sendType.split(',')
        for (var i = 0; i < sendType.length; i++) {
          self.sendTypeList.push(sendType[i])
        }
      }
    },
    initConfirmDialog(index, row) {
      const self = this
      self.currentMessageType = row
      self.confirmDialog.title = '删除'
      self.confirmDialog.message = '确认删除吗'
      self.confirmDialog.show = true
    },
    handleConfirm() {
      const self = this
      const backendMessageService = this.$ouser.$api.backendMessageService
      backendMessageService.deleteMessageType(self.currentMessageType).then(res => {
        self.$message({
          message: '删除成功',
          type: 'success'
        })
        self.confirmDialog.show = false
        self.init(1)
      })
    },
    handleCurrentChange(index) {
      const self = this
      self.init(index)
    }
  }
}
</script>
