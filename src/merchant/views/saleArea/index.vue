<template>
  <ody-box :title="$t('销售区域')">
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="MerchantSaleArea01_showAddDialog"
          size="mini"
          type="primary"
          code="MerchantSaleArea01"
          @click="showAddDialog"
        >{{ $t('新增销售区域') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-url="/ouser-web/salesAreaAction/querySalesAreaList.do"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog
      v-if="dialog.show"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="600px"
      @close="initDialog"
    >
      <el-form ref="form" :model="dialog.obj" label-width="110px">
        <el-form-item
          :label="$t('区域编码')+':'"
          :rules="[ { required: true, message: this.$t('请输入区域编码'), trigger: 'change' },
                    { min: 1, max: 20, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 20 ' + this.$t('个字符'), trigger: 'change' },
                    { pattern: /^[0-9a-zA-Z_]*$/, message: this.$t('仅支持字母数字下划线'), trigger: 'change' }]"
          prop="areaCode"
        >
          <el-input
            :disabled="dialog.obj.id"
            v-model="dialog.obj.areaCode"
            :maxlength="20"
            :placeholder="'1-20'+$t('个字符')+','+$t('支持字母')+'、'+$t('数字')+'、'+$t('下划线')"
            name="dialog_obj_areaCode"
            size="mini"
            type="text"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          :label="$t('区域名称')+':'"
          :rules="[ { required: true, message: this.$t('请输入区域名称'), trigger: 'change' },{ min: 1, max: 20, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 20 ' + this.$t('个字符'), trigger: 'change' }]"
          prop="areaName"
        >
          <el-input
            v-model="dialog.obj.areaName"
            :maxlength="20"
            :placeholder="'1-20'+$t('个字符')"
            name="dialog_obj_areaName"
            size="mini"
            type="text"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          :label="$t('所属商家')+':'"
          :rules="[ { required: true, message: this.$t('请选择所属商家'), trigger: 'change' }]"
          prop="orgId"
        >
          <el-select v-if="dialog.obj.id" :value="dialog.obj.orgId" disabled>
            <el-option
              :label="dialog.obj.orgName"
              :value="dialog.obj.orgId"/>
          </el-select>
          <ody-merchant-select
            v-else
            v-model="dialog.obj.orgId"
            name="dialog_obj_orgId"
            value-key="merchantId"
          />
        </el-form-item>
        <el-form-item :label="$t('覆盖区域')+':'" prop="saveAreaList">
          <ody-button name="MerchantSaleArea05_showAreaList" size="mini" code="MerchantSaleArea05" @click="showAreaList">{{ $t('选择覆盖区域') }}</ody-button>
          已选择 {{ dialog.obj && dialog.obj.saveAreaList && dialog.obj.saveAreaList.length || 0 }} 个
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button name="closeDialog" size="small" @click="closeDialog">{{ $t('取消') }}</el-button>
        <ody-button
          name="MerchantSaleArea02_commit"
          size="small"
          type="primary"
          code="MerchantSaleArea02"
          @click="commit"
        >{{ $t('确定') }}</ody-button>
      </span>
    </ody-dialog>
    <ody-area-choose
      v-if="dialog.obj.areaListShow"
      :visible="dialog.obj.areaListShow"
      :set-data="dialog.obj.saveAreaList"
      @cancel="closeAreaChoose"
      @ok="confirmAreaChoose"
    />
  </ody-box>
</template>
<script>
export default {
  name: 'MerchantSaleArea',
  data() {
    return {
      dialog: {
        show: false,
        title: '',
        obj: {}
      },
      search: {},
      table: {
        columns: [
          {
            label: this.$t('区域编码'),
            prop: 'areaCode',
            show: true
          },
          {
            label: this.$t('区域名称'),
            show: true,
            prop: 'areaName'
          },
          {
            label: this.$t('所属商家'),
            prop: 'orgName',
            show: true
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: '编辑',
              method: (index, row) => {
                this.showEditDialog(row)
              },
              code: 'MerchantSaleArea03'
            },
            {
              label: '删除',
              method: (index, row) => {
                this.deleteArea(row.id)
              },
              code: 'MerchantSaleArea04'
            }
          ]
        }
      }
    }
  },
  async mounted() {
    await this.initDialog()
    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('search')
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    async query() {
      const { ...params } = this.search

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    showAddDialog() {
      this.dialog.show = true
      this.dialog.title = this.$t('新增销售区域')
    },
    showEditDialog(row) {
      row && row.saveAreaList && row.saveAreaList.forEach(x => {
        // 接口countyCode 是区
        x.districtCode = x.countyCode
      })
      // console.log('row', row)
      this.$set(row, 'areaListShow', false)
      this.dialog.show = true
      this.dialog.title = this.$t('编辑销售区域')
      this.dialog.obj = this.$portal.deepClone(row)
    },
    async initDialog() {
      this.dialog.obj = {
        areaCode: null,
        areaName: null,
        areaListShow: false,
        saveAreaList: []
      }
    },
    showAreaList() {
      this.dialog.obj.areaListShow = true
    },
    closeAreaChoose() {
      this.dialog.obj.areaListShow = false
    },
    confirmAreaChoose(data) {
      var newArray = data.map(item => {
        return {
          provinceCode: item.provinceCode,
          cityCode: item.cityCode,
          countyCode: item.districtCode
        }
      })
      this.dialog.obj.saveAreaList = newArray
      this.closeAreaChoose()
    },
    closeDialog() {
      this.dialog.show = false
      this.initDialog()
    },
    async commit() {
      const [err] = await this.formValidate('form')

      if (err) {
        return
      }
      if (this.dialog.obj.id) {
        await this.$merchant.$api.areaService
          .updateSalesAreaInfo(this.dialog.obj)
          .then(res => {
            this.$message({
              type: 'success',
              message: this.$t('编辑成功')
            })
            this.closeDialog()
            this.query()
          })
      } else {
        await this.$merchant.$api.areaService
          .addSalesAreaInfo(this.dialog.obj)
          .then(res => {
            this.$message({
              type: 'success',
              message: this.$t('新增成功')
            })
            this.closeDialog()
            this.query()
          })
      }
    },
    deleteArea(id) {
      this.$confirm(this.$t('是否确认删除') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          this.$merchant.$api.areaService
            .delSalesAreaInfo({ id: id })
            .then(res => {
              this.$message({
                type: 'success',
                message: this.$t('删除成功')
              })
              this.query()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消删除')
          })
        })
    }
  }
}
</script>
