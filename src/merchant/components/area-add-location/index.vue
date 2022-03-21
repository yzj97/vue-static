<template>
  <ody-dialog
    :visible.sync="innerVisible"
    :title="ruleForm.id ? $t('修改位置') : $t('增加位置')"
    width="960px"
    append-to-body
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item :label="$t('区域') + ':'">
        <div>{{ checkDetail.parentName }}</div>
      </el-form-item>
      <el-form-item :label="$t('子区域') + ':'">
        <div>{{ checkDetail.newLocationName }}</div>
      </el-form-item>
      <el-form-item :label="$t('位置名称') + ':'" prop="locationName">
        <el-input v-model="ruleForm.locationName" :placeholder="$t('请输入位置名称')" name="ruleForm_locationName" maxlength="5"/>
      </el-form-item>
      <el-form-item :label="$t('容纳人数') + ':'" prop="maxUser">
        <ody-input-number :empty-tip="false" v-model="ruleForm.maxUser" :placeholder="$t('请输入容纳人数')" :max="99" name="ruleForm_maxUser"/>
      </el-form-item>
      <el-form-item :label="$t('状态') + ':'" prop="status" required>
        <el-switch
          v-model="ruleForm.status"
          :active-value="0"
          :inactive-value="-1"
          name="ruleForm_status"
        />
      </el-form-item>
      <el-form-item :label="$t('设备管理') + ':'">
        <el-button name="addTerminnal" type="primary" size="mini" @click="addTerminnal">{{ $t('添加设备') }}</el-button>
      </el-form-item>
      <el-form-item>
        <ody-table
          :data="table.list"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          name="table_list161">
          <template slot="terminalCodeLabel" slot-scope="scope">
            <ody-tip-star :content="$t('设备编码')" />
          </template>
          <template slot="terminalCode" slot-scope="scope">
            <el-input v-model="scope.row.terminalCode" :placeholder="$t('请输入设备编码')" name="scope_row_terminalCode" maxlength="20" @blur="checkRepeatEquipment(scope.row)"/>
          </template>
          <template slot="terminalNameLabel" slot-scope="scope">
            <ody-tip-star :content="$t('设备名称')" />
          </template>
          <template slot="terminalName" slot-scope="scope">
            <el-input v-model="scope.row.terminalName" :placeholder="$t('请输入设备名称')" maxlength="20" name="scope_row_terminalName"/>
          </template>
          <template slot="terminalTypeLabel" slot-scope="scope">
            <ody-tip-star :content="$t('设备类型')" />
          </template>
          <template slot="terminalType" slot-scope="scope">
            <el-select v-model="scope.row.terminalType" :placeholder="$t('请选择设备编号')" :clearable="false" name="scope_row_terminalType">
              <el-option v-for="item in terminalTypeMap" :label="item.label" :value="item.value" :key="item.value"/>
            </el-select>
          </template>
          <template slot="terminalSupplierCodeLabel" slot-scope="scope">
            <ody-tip-star :content="$t('供应商')" />
          </template>
          <template slot="terminalSupplierCode" slot-scope="scope">
            <el-select v-model="scope.row.terminalSupplierCode" :placeholder="$t('供应商')" :clearable="false" name="scope_row_terminalSupplierCode">
              <el-option label="insight" value="insight" />
            </el-select>
          </template>
          <template slot="isAvailable" slot-scope="scope">
            <el-switch
              v-model="scope.row.isAvailable"
              :active-value="true"
              :inactive-value="false"
              name="scope_row_isAvailable"
            />
          </template>

        </ody-table>
      </el-form-item>

    </el-form>
    <span slot="footer">
      <div class="line-top"/>
      <el-button name="hideDialog" size="small" @click="hideDialog">{{ $t('取消') }}</el-button>
      <ody-button code="MerchantShopArea06" name="confirm" size="small" type="primary" @click="confirm">{{ $t('确定') }}</ody-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Object,
      default: () => ([])
    },
    checkIndex: {
      type: Number,
      default: 0
    },
    checkDetail: {
      type: Object,
      default: () => {}
    },
    chooseLocation: {
      type: Object,
      default: () => {}
    },
    clickDatail: {
      type: Function,
      default: null
    },
    queryStoreLocation: {
      type: Function,
      default: null
    }
  },
  data() {
    return {

      terminalTypeMap: [{
        value: 1,
        label: this.$t('POS机')
      }, {
        value: 2,
        label: this.$t('摄像头')
      }, {
        value: 3,
        label: this.$t('厨打机')
      }],
      innerVisible: this.visible,
      ruleForm: {
        locationName: '',
        locationType: 1,
        status: 0
      },
      rules: {
        locationName: [{ required: true, message: this.$t('请输入位置名称'), trigger: 'change' }]

      },
      postApi: this.$merchant.$api.areaService,
      table: {
        list: [],
        columns: [
          {
            labelSlot: 'terminalCodeLabel',
            slot: 'terminalCode',
            show: true
          },
          {
            labelSlot: 'terminalNameLabel',
            slot: 'terminalName',
            show: true
          },
          {
            labelSlot: 'terminalTypeLabel',
            slot: 'terminalType',
            show: true
          },
          {
            labelSlot: 'terminalSupplierCodeLabel',
            slot: 'terminalSupplierCode',
            show: true
          },
          {
            label: '状态',
            slot: 'isAvailable',
            show: true
          }
        ],
        operates: {
          width: 50,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              code: 'ui',
              method: (index, row, event) => {
                this.delRow(index, row)
              }
            }
          ]
        }
      }
    }
  },

  watch: {
    visible() {
      this.innerVisible = this.visible
    },
    innerVisible(val) {
      this.$emit('update:visible', val)
    }

  },
  created() {
    if (this.chooseLocation.id) {
      this.ruleForm = this.chooseLocation
      this.queryEquipments(this.chooseLocation.id)
    }
  },
  methods: {
    async queryEquipments(id) {
      const params = {
        storeLocationId: id
      }
      const res = await this.postApi.queryEquipments(params)
      this.table.list = res.data
      for (var i = 0; i < this.table.list.length; i++) {
        if (this.table.list[i].isAvailable === 1 || this.table.list[i].isAvailable === '1') {
          this.table.list[i].isAvailable = true
        } else {
          this.table.list[i].isAvailable = false
        }

        this.table.list[i].terminalType = parseInt(this.table.list[i].terminalType)
      }
    },
    checkRepeatEquipment(item) {
      if (item.terminalCode === '') return
      this.postApi.checkRepeatEquipment(item)
    },
    addTerminnal() {
      this.table.list.push({
        terminalCode: '',
        terminalName: '',
        terminalType: 1,
        terminalSupplierCode: 'insight',
        isAvailable: true,
        status: true
      })
    },
    delRow(index, row) {
      this.$confirm(
        this.$t('确定要删除该数据?该数据下的相关信息会同步删除!'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(async() => {
        if (row.id) {
          await this.postApi.delEquipment(row)
          this.queryEquipments(this.chooseLocation.id)
        } else {
          this.table.list.splice(index, 1)
        }
      })
    },
    hideDialog() {
      this.innerVisible = false
      this.$emit('update:visible', false)
    },
    checkList() {
      let flag = true
      this.table.list.map(item => {
        if (item.terminalCode === '' || item.terminalName === '') {
          flag = false
          return
        }
      })
      return flag
    },
    async confirm() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          var params = {
            storeId: this.checkDetail.storeId,
            parentId: this.checkDetail.id
          }
          params = { ...params, ...this.ruleForm }
          if (!this.checkList()) {
            this.$message(this.$t('存在必填项为空'))
            return
          }
          var storeLocationId = this.chooseLocation.id
          if (params.id) {
            await this.postApi.updateStoreLocation(params)
          } else {
            const res = await this.postApi.addStoreLocation(params)
            storeLocationId = res.data
          }
          if (this.table.list.length > 0) {
            const saveEquipmentList = this.table.list.map(item => {
              item.storeId = this.checkDetail.storeId
              item.storeLocationId = storeLocationId
              return item
            })
            await this.postApi.saveEquipment(saveEquipmentList)
          }
          const oldIndex = this.checkIndex
          await this.queryStoreLocation()
          const newDetail = this.checked[0].children[oldIndex]
          // 跳转回去
          this.clickDatail(oldIndex, newDetail)
          this.hideDialog()
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>

</style>
