<template>
  <section>
    <ody-box>
      <el-form ref="form" label-width="200px">
        <ody-title :title="$t('仓库信息')" />
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <span slot="label">
                <ody-tip-star :content="$t('商家') + ':'" />
              </span>
              <el-select
                v-model="queryParam.merchantId"
                :placeholder="$t('请选择')"
                :popper-append-to-body="false"
                name="queryParam_merchantId"
                clearable
                @change="changeMerchant(queryParam.merchantId)"
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
          <el-col :span="8">
            <el-form-item>
              <span slot="label">
                <ody-tip-star :content="$t('拟合仓编码') + ':'" />
              </span>
              <el-select
                v-model="queryParam.virtualWarehouseId"
                :placeholder="$t('请选择')"
                name="queryParam_virtualWarehouseId"
                clearable
                @change="getWarehouseName()"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.warehouseCode"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('拟合仓名称')">
              <el-input
                v-model="queryParam.warehouseName"
                :disabled="true"
                name="queryParam_warehouseName"
                style="width:200px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <ody-title :title="$t('商品信息')" />
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <span slot="label">
                <ody-tip-star :content="$t('商品编码') + ':'" />
              </span>
              <el-input
                v-model="queryParam.mpCode"
                name="queryParam_mpCode"
                style="width:200px"
                @focus="addProduct"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('商品名称')">
              <el-input
                v-model="queryParam.mpName"
                :disabled="true"
                name="queryParam_mpName"
                style="width:200px"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <ody-title :title="$t('渠道店铺可售数量')" />
      <div>
        <el-button name="addRule" size="small" type="primary" @click="addRule">{{ $t('新增') }}</el-button>
        <el-table :data="list" name="list087" style="width: 100%">
          <el-table-column :label="$t('启用')" width="80">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isAvailable" name="scope_row_isAvailable" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('店铺')" width="200">
            <template slot-scope="scope">{{ scope.row.storeId | keyVal(storeMap,'storeName') }}</template>
          </el-table-column>
          <el-table-column :label="$t('分配模式')" width="200">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.assignType"
                :placeholder="$t('请选择')"
                name="scope_row_assignType"
                clearable
                style="width:120px"
                @change="changeAssignType(scope.row)"
              >
                <el-option
                  v-for="item in assignTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('分配值')" width="120">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.assignValue"
                :disabled="scope.row.assignType==3"
                name="scope_row_assignValue"
                style="width:70px"
              />%
            </template>
          </el-table-column>
          <el-table-column :label="$t('置零阈值')" width="200">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.alarmValue"
                name="scope_row_alarmValue"
                style="width:70px"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('渠道独享')" width="120">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.isNeedHold"
                name="scope_row_isNeedHold"
                @change="changeIsNeedHold(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('独占优先级')" width="120">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.holdLevel"
                :disabled="!scope.row.isNeedHold"
                name="scope_row_holdLevel"
                style="width:70px"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 选择商品模态框 -->
      <ProductModal
        :visible.sync="showProductModal"
        :merchant-id="queryParam.merchantId"
        @ok="saveProduct"
      />
      <VirWhMpSyncRuleModal
        :selected="list"
        :visible.sync="showRuleModal"
        :merchant-id="queryParam.merchantId"
        :store-list.sync="storeList"
        @ok="saveRule"
      />
    </ody-box>
    <ody-fixed>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('返回') }}</el-button>
      <ody-button
        name="Stock2003Save_save"
        size="small"
        type="primary"
        code="Stock2003Save"
        @click="save"
      >{{ $t('保存') }}</ody-button>
    </ody-fixed>
  </section>
</template>

<script>
import ProductModal from '@/components/productModal'
import VirWhMpSyncRuleModal from '@/components/virWhMpSyncRuleModal'
import numberUtil from '@/utils/numberUtil.js'
export default {
  name: 'VirWhMpSyncRuleEdit',
  components: {
    ProductModal,
    VirWhMpSyncRuleModal
  },
  data() {
    return {
      showProductModal: false,
      showRuleModal: false,
      warehouseList: [],
      queryParam: {},
      list: [],
      merchantList: [],
      assignTypeList: [
        { id: 1, name: '按比例' },
        { id: 3, name: '共享' }
      ],
      bill: {},
      merchantId: null,
      storeList: [],
      storeMap: {}
    }
  },
  async mounted() {
    try {
      this.stockApi = this.$product.$api.stockApi
      this.merchantApi = this.$product.$api.merchantApi
      this.merchantId = this.$route.params.merchantId
      if (this.$route.params.edit) {
        await this.queryWarehouseAndStore(this.merchantId)
        await this.getDetail()
      }
      this.loading = true
      await this.queryMerchantList()
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async getDetail() {
      // 获取明细
      var param = {
        merchantId: this.merchantId,
        virtualWarehouseId: this.$route.params.virtualWarehouseId,
        mpId: this.$route.params.mpId
      }
      return this.stockApi.getImVirtualWarehouseMpSyncRule(param).then(res => {
        var d = res.data[0]
        this.queryParam = {
          merchantId: d.merchantId,
          virtualWarehouseId: d.virtualWarehouseId,
          warehouseName: d.warehouseName,
          mpId: d.mpId,
          mpCode: d.mpCode,
          mpName: d.mpName
        }
        this.list = res.data
        for (const l of this.list) {
          if (l.isAvailable === 1) {
            l.isAvailable = true
          } else {
            l.isAvailable = false
          }
          if (l.isNeedHold === 1) {
            l.isNeedHold = true
          } else {
            l.isNeedHold = false
          }
        }
      })
    },
    changeMerchant(merchantId) {
      this.queryParam.mpCode = null
      this.queryParam.mpName = null
      this.queryParam.virtualWarehouseId = null
      this.queryParam.warehouseName = null
      this.queryWarehouseAndStore(merchantId)
    },
    async queryWarehouseAndStore(merchantId) {
      await this.getWarehouseByMerchantId(merchantId)
      await this.getStoreByMerchantId(merchantId)
    },
    changeAssignType(row) {
      if (row.assignType === 3) {
        row.assignValue = 100
      }
    },
    changeIsNeedHold(row) {
      if (!row.isNeedHold) {
        row.holdLevel = null
      }
    },
    hideDialog() {
      this.dialogVisible = false
    },
    confirmDialog() {
      this.dialogVisible = false
    },
    handleTableEdit(index, row) {
      this.$router.push({
        name: 'virWhMpSyncRuleEdit',
        params: {
          id: row.id
        }
      })
    },
    handleAdd() {
      this.$router.push({
        name: 'virWhMpSyncRuleEdit'
      })
    },
    saveProduct(mp) {
      // 获取选中的那行数据
      console.log(mp)
      this.queryParam.mpId = mp.id
      this.queryParam.mpCode = mp.code
      this.queryParam.mpName = mp.chineseName
    },
    saveRule(rule) {
      const errorCode = this.validateData([rule])
      if (errorCode) {
        this.$message({
          type: 'error',
          message: this.$t(errorCode)
        })
        return
      }
      // 存在相同店铺信息时，提示存在相同配置了
      rule.isAvailable = true
      for (const store of this.storeList) {
        if (rule.storeId === store.storeId) {
          rule.storeName = store.storeName
        }
      }
      for (const existL of this.list) {
        if (existL.storeId === rule.storeId) {
          this.$message({
            type: 'error',
            message: this.$t('已存在相同配置')
          })
          return
        }
      }

      this.list.push(Object.assign({}, rule))
    },
    validateData(list) {
      var holdLevels = []
      for (const rule of list) {
        if (!rule.storeId) {
          return '店铺必选'
        }
        if (!rule.assignType) {
          return '分配模式必选'
        }
        if (!rule.assignValue) {
          return '分配值必输'
        }
        // 校验数据格式和大小
        if (
          numberUtil.isNumberEmpty(rule.assignValue, 0) ||
          rule.assignValue <= 0 ||
          rule.assignValue > 999
        ) {
          return '分配值必须是1-999的正整数'
        }
        if (
          rule.alarmValue &&
          (numberUtil.isNumberEmpty(rule.alarmValue, 0) ||
            rule.alarmValue <= 0 ||
            rule.alarmValue > 999)
        ) {
          return '置零阈值必须是1-999的正整数'
        }
        if (rule.isNeedHold) {
          if (
            numberUtil.isNumberEmpty(rule.holdLevel, 0) ||
            rule.holdLevel <= 0 ||
            rule.holdLevel > 99
          ) {
            return '独占优先级必须是1-99的正整数'
          }
          var flag = false
          for (const level of holdLevels) {
            if (level === rule.holdLevel) {
              flag = true
              break
            }
          }
          if (flag) {
            return '独占优先级必须是1-99的正整数，并且不能重复'
          }
        }
      }
    },
    save() {
      // 最终的save操作
      const errorCode = this.validateData(this.list)
      if (errorCode) {
        this.$message({
          type: 'error',
          message: this.$t(errorCode)
        })
        return
      }
      // 校验详情页的数据
      if (!this.queryParam.merchantId) {
        this.$message({ type: 'error', message: this.$t('请选择商家') })
        return
      }
      if (!this.queryParam.virtualWarehouseId) {
        this.$message({ type: 'error', message: this.$t('请选择拟合仓') })
        return
      }
      if (!this.queryParam.mpId) {
        this.$message({ type: 'error', message: this.$t('请选择商品') })
        return
      }
      if (!this.list || this.list.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请至少新增一个规则')
        })
        return
      }
      var paramArray = []
      for (const l of this.list) {
        var d = Object.assign({}, l, this.queryParam)
        if (d.isAvailable) {
          d.isAvailable = 1
        } else {
          d.isAvailable = 0
        }
        if (d.isNeedHold) {
          d.isNeedHold = 1
        } else {
          d.isNeedHold = 0
        }
        paramArray.push(d)
      }
      console.log(JSON.stringify(paramArray))
      return this.stockApi
        .saveImVirtualWarehouseMpSyncRule(JSON.stringify(paramArray))
        .then(res => {
          this.$router.push({
            name: 'Stock2003'
          })
          this.$portal.delActiveViewAndRefresh()
        })
    },
    returnBack() {
      this.$router.push({
        name: 'Stock2003'
      })
      this.$portal.delActiveViewAndRefresh()
    },
    handleTableDelete(index, row) {
      this.$confirm(this.$t('确认删除选中的数据?'), this.$t('删除'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        var param = Object.assign({}, row)
        return this.stockApi
          .deleteImVirtualWarehouseMpSyncRule(param)
          .then(res => {
            this.queryList()
            this.$message({
              type: 'success',
              message: this.$t('删除完成')
            })
          })
      })
    },
    addRule() {
      if (!this.queryParam.merchantId) {
        this.$message({
          type: 'warn',
          message: this.$t('请先选中商家')
        })
        return
      }
      this.showRuleModal = true
    },
    addProduct() {
      // 显示商品模态框
      const messageCode = this.preAddProduct()
      if (messageCode) {
        this.$message({
          type: 'warn',
          message: this.$t(messageCode)
        })
        return
      }
      this.showProductModal = true
    },
    preAddProduct() {
      // 添加商品前，校验必填项
      // check value
      if (!this.queryParam.merchantId) {
        return '请先选择商家后再选择商品编码'
      }
    },
    async queryList(obj) {
      var param = Object.assign({}, this.queryParam)
      return this.stockApi.getImVirtualWarehouseMpSyncRule(param).then(res => {
        this.list = res.data
      })
    },
    // 查询当前登录用户有权限的商家
    async queryMerchantList() {
      return this.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.merchantList = res.data.listObj
        })
    },
    async getWarehouseByMerchantId(merchantId) {
      if (!merchantId) {
        this.warehouseList = []
        this.queryParam.warehouseId = null
        return
      }
      // 只查询拟合仓的数据
      this.stockApi
        .listStoreWarehouseWithPage({
          itemsPerPage: 500,
          merchantId: merchantId,
          isVirtualWarehouse: 1,
          warehouseType: 1
        })
        .then(res => {
          this.warehouseList = res.data.listObj
        })
    },
    async getStoreByMerchantId(merchantId) {
      if (!merchantId) {
        this.storeList = []
        return
      }
      // 只查询拟合仓的数据
      const res = await this.merchantApi.queryPlatformAuthStorePage({
        currentPage: 1,
        itemsPerPage: 500,
        merchantIds: [merchantId]
      })
      this.storeList = res.data.listObj
      this.storeMap = res.data.listObj.reduce((rtv, item) => {
        rtv[item.storeId] = item
        return rtv
      }, {})
    },

    getWarehouseName() {
      if (this.queryParam && this.queryParam.virtualWarehouseId) {
        var warehouseId = this.queryParam.virtualWarehouseId
        for (const warehouse of this.warehouseList) {
          if (warehouseId === warehouse.id) {
            this.queryParam.warehouseName = warehouse.warehouseName
          }
        }
      } else {
        this.queryParam.warehouseName = null
      }
      this.$forceUpdate()
    },
    // 重置
    reset() {
      this.queryParam = {}
      this.warehouseList = []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
