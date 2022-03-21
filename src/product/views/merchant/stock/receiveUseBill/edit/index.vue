/* eslint-disable vue/valid-v-model */
<template>
  <section>
    <div>
      <el-form :label-width="formWidth" inline="true" label-position="right">
        <el-col span="8">
          <el-form-item>
            <span slot="label">
              <ody-tip-star :content="$t('商家') + ':'" />
            </span>
            <el-select
              v-model="bill.merchantId"
              :disabled="viewStatus !== 1"
              :placeholder="$t('请选择')"
              name="bill_merchantId"
              @change="changeMerchant"
            >
              <el-option
                v-for="item in merchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item>
            <span slot="label">
              <ody-tip-star :content="$t('领用仓库') + ':'" />
            </span>
            <el-select
              v-model="bill.warehouseId"
              :disabled="viewStatus !== 1"
              :placeholder="$t('请选择')"
              name="bill_warehouseId"
              @change="changeWarehouse"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.warehouseId"
                :label="item.warehouseName"
                :value="item.warehouseId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item>
            <span slot="label">
              <ody-tip-star :content="$t('单据类型') + ':'" />
            </span>
            <el-select
              v-model="bill.billType"
              :disabled="viewStatus !== 1"
              name="bill_billType"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="(value, key) in billTypeMap"
                :key="key"
                :label="$t(value)"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="viewStatus !== 1" span="8">
          <el-form-item :label="$t('单据编号') + ':'">
            <el-input v-model="bill.billCode" :disabled="viewStatus !== 1" name="bill_billCode" />
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item>
            <span slot="label">
              <ody-tip-star :content="$t('审核状态') + ':'" />
            </span>
            <el-input :value="$t(billAuditStatusMap[bill.billAuditStatus])" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item>
            <span slot="label">
              <ody-tip-star :content="$t('单据状态') + ':'" />
            </span>
            <el-input :value="$t(billStatusMap[bill.billStatus])" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item>
            <span slot="label">
              <ody-tip-star :content="$t('创建人') + ':'" />
            </span>
            <el-input v-model="bill.createUsername" :disabled="true" name="bill_createUsername" />
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item :label="$t('备注') + ':'">
            <el-input
              v-model="bill.remark"
              :disabled="viewStatus === 3"
              name="bill_remark"
              type="textarea"
              maxlength="32"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item :label="$t('创建日期') + ':'">
            <el-date-picker
              v-model="bill.createTime"
              name="bill_createTime"
              type="date"
              format="yyyy-MM-dd HH:mm:ss"
              disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item :label="$t('完成日期') + ':'">
            <el-date-picker
              v-model="bill.completeTime"
              name="bill_completeTime"
              type="date"
              format="yyyy-MM-dd HH:mm:ss"
              disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col span="24" style="margin-bottom: 10px">
          <ody-button
            v-if="viewStatus !== 3"
            name="Stock2001Delete_batchDelete"
            type="primary"
            size="small"
            code="Stock2001Delete"
            @click="batchDelete"
          >{{ $t('批量删除') }}</ody-button>
          <ody-button
            v-if="viewStatus !== 3"
            name="Stock2001AddProduct_openMpModal"
            type="primary"
            size="small"
            code="Stock2001AddProduct"
            @click="openMpModal"
          >{{ $t('添加商品') }}</ody-button>
        </el-col>
      </el-form>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="bill.billItemList"
        name="bill_billItemList675"
        tooltip-effect="dark"
        @select-all="selectAll"
        @select="selectRow"
      >
        <div v-if="viewStatus !== 3">
          <el-table-column :label="$t('操作')" width="120">
            <template slot-scope="scope">
              <ody-button
                name="Stock2001Delete_deleteRow"
                size="mini"
                code="Stock2001Delete"
                @click="deleteRow(scope.$index, scope.row)"
              >{{ $t('删除') }}</ody-button>
            </template>
          </el-table-column>
        </div>
        <div v-if="viewStatus !== 3">
          <el-table-column type="selection" width="55" />
        </div>
        <el-table-column :label="$t('商品编码')" prop="mpCode" />
        <el-table-column :label="$t('商品名称')" prop="chineseName" />
        <el-table-column :label="$t('商品条码')" prop="barCode" />
        <el-table-column :label="$t('主计量单位')" prop="mainUnitName" />
        <el-table-column :label="$t('当前库存')" prop="availableStockNum" />
        <el-table-column :label="$t('领用数量')" :prop="receiveUseNum">
          <template slot-scope="scope">
            <ody-input-number v-model="scope.row.receiveUseNum" :disabled="viewStatus === 3" :min="0.01" :max="999999.99" :decimal="2" name="scope_row_receiveUseNum" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row type="flex" justify="center" style="margin-top: 10px">
      <ody-button
        v-if="viewStatus !== 3"
        :loading="loading"
        name="Stock2001SaveOrUpdate_saveOrUpdate"
        type="primary"
        size="small"
        code="Stock2001SaveOrUpdate"
        @click="saveOrUpdate(0)"
      >{{ $t('保存') }}</ody-button>
      <ody-button
        v-if="viewStatus !== 3"
        :loading="loading"
        name="Stock2001Submit_saveOrUpdate"
        type="primary"
        size="small"
        code="Stock2001Submit"
        @click="saveOrUpdate(1)"
      >{{ $t('提交') }}</ody-button>
      <el-button :loading="loading" name="back" type="primary" size="small" @click="back">{{ $t('返回') }}</el-button>
    </el-row>
    <receiveUseBill-mp-modal
      v-if="modalVisible"
      :visible.sync="modalVisible"
      :ids="mpIds"
      :merchant-id="bill.merchantId"
      :warehouse-id="bill.warehouseId"
      @ok="closeMpModal"
    />
  </section>
</template>

<script>
const windowWidth = window.screen.availWidth
import stockConstant from '@/constant/stockConstant.js'
import receiveUseBillMpModal from '@/components/receiveUseBillMpModal/index'
export default {
  components: { receiveUseBillMpModal },
  data() {
    return {
      formWidth: windowWidth * 0.1 + 'px',
      viewStatus: null,
      merchantList: [],
      warehouseList: [],
      bill: { billItemList: [] },
      billTypeMap: stockConstant.IM_RECEIVE_USE_BILL_BILL_TYPE,
      billAuditStatusMap: stockConstant.IM_RECEIVE_USE_BILL_BILL_AUDIT_STATUS,
      billStatusMap: stockConstant.IM_RECEIVE_USE_BILL_BILL_STATUS,
      modalVisible: false,
      mpIds: [],
      deleteBillItemList: [],
      loading: false,
      temp: null,
      tipName: this.$t('保存成功')
    }
  },
  watch: {
    'bill.merchantId': function(newVal, oldVal) {
      this.temp = oldVal
    },
    'bill.warehouseId': function(newVal, oldVal) {
      this.temp = oldVal
    }
  },
  mounted() {
    this.merchantApi = this.$product.$api.merchantApi
    this.stockApi = this.$product.$api.stockApi
    this.userApi = this.$product.$api.userApi
    this.authApi = this.$product.$api.authApi
    this.bill.id = this.$route.query.id
    this.initData()
  },
  methods: {
    initData() {
      this.tipName = this.$t('保存成功')
      this.deleteBillItemList = []
      this.viewStatus = this.$route.query.viewStatus
      if (!this.bill.id) {
        // 新增
        this.bill.billType = 'JHLYO'
        this.bill.billAuditStatus = 0
        this.bill.billStatus = 0
        this.userApi.getUserInfo().then(res => {
          this.bill.createUsername = res.data.userName
        })
      } else {
        // 查看和编辑
        this.stockApi
          .getReceiveUseBillDetail({ id: this.bill.id })
          .then(res => {
            this.bill = res.data
            this.bill.billItemList = res.data.billDetailDTOList
            if (this.bill.billStatus === 2) {
              for (var billItem of this.bill.billItemList) {
                billItem.receiveUseNum = Math.abs(billItem.receiveUseNum)
              }
            }
            if (
              this.bill.billAuditStatus === 1 ||
              this.bill.billAuditStatus === 2
            ) {
              this.viewStatus = 3
            }
            this.getWarehouseByMerchantId(this.bill.merchantId)
          })
      }
      this.queryMerchantList()
    },
    changeMerchant() {
      if (this.bill.billItemList.length === 0) {
        this.getWarehouseByMerchantId(this.bill.merchantId)
      } else {
        this.$confirm(
          this.$t('切换商家会清空已经添加的商品，是否继续?'),
          this.$t('提示'),
          {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }
        )
          .then(() => {
            this.bill.billItemList = []
            this.$forceUpdate()
          })
          .catch(() => {
            this.bill.merchantId = this.temp
          })
      }
    },
    changeWarehouse() {
      if (this.bill.billItemList.length > 0) {
        this.$confirm(
          this.$t('切换仓库会清空已经添加的商品，是否继续?'),
          this.$t('提示'),
          {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }
        )
          .then(() => {
            this.bill.billItemList = []
            this.$forceUpdate()
          })
          .catch(() => {
            this.bill.warehouseId = this.temp
          })
      }
    },
    queryMerchantList() {
      return this.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.merchantList = []
          const merchantIds = []
          for (const warehouse of res.data.listObj) {
            if (merchantIds.indexOf(warehouse.merchantId) === -1) {
              merchantIds.push(warehouse.merchantId)
              this.merchantList.push({
                merchantId: warehouse.merchantId,
                merchantCode: warehouse.merchantCode,
                merchantName: warehouse.merchantName
              })
            }
          }
        })
    },
    getWarehouseByMerchantId(merchantId) {
      this.merchantApi
        .queryPlatformAuthWarehousePage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.warehouseList = res.data.listObj.filter(item => {
            return item.merchantId === merchantId
          })
        })
    },
    openMpModal() {
      // 1. 校验是否填写了商家id和仓库id
      if (!this.bill.merchantId) {
        this.$alert(this.$t('请选择商家'), this.$t('提示'), {
          confirmButtonText: this.$t('确定')
        })
        return
      }
      if (!this.bill.warehouseId) {
        this.$alert(this.$t('请选择仓库'), this.$t('提示'), {
          confirmButtonText: this.$t('确定')
        })
        return
      }
      // 2. 组装当前列表页存在的mpId集合
      this.mpIds = []
      this.bill.billItemList.forEach(item => {
        this.mpIds.push(item.merchantProductId)
      })
      // 3. 打开模态框
      this.modalVisible = true
    },
    closeMpModal(mpList) {
      mpList.forEach(item => {
        const billItem = {}
        billItem.id = null
        billItem.mpCode = item.code
        billItem.barCode = item.barCode
        billItem.chineseName = item.chineseName
        billItem.mainUnitName = item.mainUnitName
        billItem.availableStockNum = item.availableStockNum
        billItem.receiveUseNum = 1
        billItem.merchantProductId = item.id
        this.bill.billItemList.push(billItem)
      })
    },
    deleteRow(index, row) {
      this.$confirm(this.$t('是否确认删除') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        if (row.id) {
          // 数据库中存在记录的
          row.isDeleted = 1
          this.deleteBillItemList.push(row)
        }
        this.bill.billItemList.splice(index, 1)
      })
    },
    batchDelete() {
      const index = this.bill.billItemList.findIndex(item => {
        return item.checked
      })
      if (index === -1) {
        this.$alert(this.$t('请勾选删除'), this.$t('提示'), {
          confirmButtonText: this.$t('确定')
        })
        return
      }
      this.$confirm(this.$t('是否确认删除') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const newItemList = []
        for (const item of this.bill.billItemList) {
          if (item.checked) {
            // 删除
            if (item.id) {
              // 数据库中存在记录的
              item.isDeleted = 1
              this.deleteBillItemList.push(item)
            }
          } else {
            // 保留
            newItemList.push(item)
          }
        }
        this.bill.billItemList = newItemList
        this.$forceUpdate()
      })
    },
    validate() {
      if (!this.bill.merchantId) {
        this.$alert(this.$t('请选择商家'), this.$t('提示'), {
          confirmButtonText: this.$t('确定')
        })
        return false
      }
      if (!this.bill.warehouseId) {
        this.$alert(this.$t('请选择仓库'), this.$t('提示'), {
          confirmButtonText: this.$t('确定')
        })
        return false
      }
      if (this.bill.billItemList.length === 0) {
        this.$alert(this.$t('至少需要添加一个商品'), this.$t('提示'), {
          confirmButtonText: this.$t('确定')
        })
        return false
      }
      for (const item of this.bill.billItemList) {
        if (
          item.receiveUseNum == null ||
          typeof item.receiveUseNum === undefined ||
          item.receiveUseNum === ''
        ) {
          this.$alert(this.$t('领用数量不能为空'), this.$t('提示'), {
            confirmButtonText: this.$t('确定')
          })
          return false
        }
        const pattern1 = /^0\.[0-9]*[0-9]$/
        const pattern2 = /^[1-9][0-9]{0,7}(\.[0-9]*)?$/
        if (
          !pattern1.test(item.receiveUseNum.toString()) &&
          !pattern2.test(item.receiveUseNum.toString())
        ) {
          this.$alert(this.$t('领用数量必须大于0'), this.$t('提示'), {
            confirmButtonText: this.$t('确定')
          })
          return false
        }
        if (parseFloat(item.receiveUseNum) > item.availableStockNum) {
          this.$alert(
            this.$t('领用数量不能大于当前可用库存数量'),
            this.$t('提示'),
            {
              confirmButtonText: this.$t('确定')
            }
          )
          return false
        }
      }
      return true
    },
    saveOrUpdate(auditStatus) {
      if (!this.validate()) {
        return
      }
      if (auditStatus === 1) {
        // 提交按钮触发
        this.bill.billAuditStatus = 1
        this.tipName = this.$t('提交成功')
      }
      this.loading = true
      // 不能每次点保存按钮都认为是新增
      if (this.viewStatus === 1 && !this.bill.id) {
        // 新增
        this.bill.processType = 5
        this.bill.billDetailSaveVOList = this.bill.billItemList
        this.stockApi.saveReceiveUseBill(this.bill).then(res => {
          if (res.code === '0') {
            this.$alert(this.tipName, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
              callback: action => {
                this.bill.id = res.data
                this.initData()
                if (this.bill.billAuditStatus === 1) {
                  this.$portal.delActiveViewAndRefresh('Stock200101')
                }
              }
            })
          }
          this.loading = false
        })
      } else {
        // 更新
        this.bill.billItemList.forEach(item => {
          this.deleteBillItemList.push(item)
        })
        this.bill.updateVOList = this.deleteBillItemList
        this.stockApi.updateReceiveUseBill(this.bill).then(res => {
          if (res.code === '0') {
            this.$alert(this.tipName, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
              callback: action => {
                this.initData()
                if (this.bill.billAuditStatus === 1) {
                  this.$portal.delActiveViewAndRefresh('Stock200101')
                }
              }
            })
          }
          this.loading = false
        })
      }
    },
    back() {
      this.$router.push({ name: 'Stock2001' })
      this.$portal.delActiveView()
      // this.$portal.delActiveViewAndRefresh()
    },
    selectRow(selection, row) {
      row.checked = !row.checked
    },
    selectAll(selection) {
      if (selection.length === 0) {
        // 取消全选
        this.bill.billItemList.map(item => {
          item.checked = false
        })
      } else {
        // 全选
        selection.map(item => {
          item.checked = true
        })
      }
    }
  }
}
</script>
