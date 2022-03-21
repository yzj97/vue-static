<template>
  <section>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('基础信息') }}</span>
      </div>
      <div>
        <el-form ref="inventoryPlanForm" :rules="rules" :model="inventoryPlan" label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('商家') + '：'" prop="merchantId">
                <el-select
                  v-model="inventoryPlan.merchantId"
                  :disabled="inventoryPlan.id > 0"
                  :placeholder="$t('请选择')"
                  name="merchantId"
                  clearable
                  @change="getWarehouseByMerchantId(inventoryPlan.merchantId)">
                  <el-option
                    v-for="item in merchantList"
                    :key="item.merchantId"
                    :label="item.merchantName"
                    :value="item.merchantId"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('仓库') + '：'" prop="warehouseId">
                <el-select
                  :disabled="inventoryPlan.id > 0 || !inventoryPlan.merchantId || inventoryPlan.merchantId === ''"
                  v-model="inventoryPlan.warehouseId"
                  :placeholder="$t('请选择')"
                  clearable
                  name="warehouseId"
                  @change="changeClearAll">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('盘点类型') + '：'" prop="inventoryType">
                <el-select v-model="inventoryPlan.inventoryType" :disabled="inventoryPlan.id > 0" :placeholder="$t('请选择')" name="inventoryType" clearable @change="changeClearAll">
                  <el-option
                    v-for="item in inventoryTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item :label="$t('备注') + '：'" prop="remark">
                <el-input v-model="inventoryPlan.remark" name="remark" type="textarea" maxlength="100"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card v-show="inventoryPlan.inventoryType === 1" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('盘点商品') }}</span>
      </div>
      <ody-list-table-area>
        <div slot="btn">
          <el-button :disabled="!canOperate" name="addProduct" type="primary" size="small" @click="doAddProduct">{{ $t('添加商品') }}</el-button>
          <el-button :disabled="!canOperate" name="fastInput" size="small" @click="toFastInput">{{ $t('快速录入') }}</el-button>
          <el-button :disabled="!canOperate" name="batchDelete" size="small" @click="batchDelete">{{ $t('批量删除') }}</el-button>
        </div>
        <div slot="table">
          <ody-table
            v-loading="!canOperate"
            :data="itemList"
            :columns="columns"
            :operates="operates"
            :multiple="true"
            :checked.sync="checked"
            :can-filter="false" />
        </div>
      </ody-list-table-area>
      <div style="margin-top: 10px;border-top: 1px solid #ccc;padding-top: 15px;padding-bottom: 10px">
        <span>{{ $t('合计') }}：</span> <span style="float: right;margin-right: 30px">{{ $t('商品个数') }}：{{ itemList.length }}</span>
      </div>
    </el-card>
    <el-card class="box-card">
      <div style="text-align: center">
        <ody-button :disabled="!canOperate" name="submit" type="primary" size="small" code="ImInventoryPlanSubmit" @click="save(1)">{{ $t('提交盘点') }}</ody-button>
        <ody-button :disabled="!canOperate" name="save" type="primary" size="small" code="ImInventoryPlanSave" @click="save(0)">{{ $t('保存草稿') }}</ody-button>
        <ody-button :disabled="!canOperate" name="cancel" size="small" code="ui" @click="back">{{ $t('取消') }}</ody-button>
      </div>
    </el-card>
    <!-- 添加商品弹框 -->
    <ody-dialog :visible.sync="showProductModal" :title="$t('添加盘点商品')" width="60%">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="mpForm">
            <ody-search-item :label="$t('商品名称') + ':'" prop="merchantProductName">
              <el-input v-model="mpObj.merchantProductName" name="mpObj_merchantProductName" />
            </ody-search-item>
            <ody-search-item :label="$t('商品编码') + ':'" prop="merchantProductCode">
              <el-input v-model="mpObj.merchantProductCode" name="mpObj_merchantProductCode" />
            </ody-search-item>
            <ody-search-item :label="$t('商品条码') + ':'" prop="merchantProductBarcode">
              <el-input v-model="mpObj.merchantProductBarcode" name="mpObj_merchantProductBarcode" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button size="small" type="primary" @click="queryImInventoryMPList">{{ $t('查询') }}</el-button>
          <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <el-table
            ref="mpMultipleTable"
            :data="addMpList"
            tooltip-effect="dark"
            @select-all="mpSelectAll"
            @select="mpSelectRow">
            <el-table-column :selectable="canSelect" type="selection" width="55" />
            <el-table-column :label="$t('商品名称')" prop="merchantProductName" align="center" />
            <el-table-column :label="$t('商品编码')" prop="merchantProductCode" align="center" />
            <el-table-column :label="$t('商品条码')" prop="merchantProductBarcode" align="center" />
          </el-table>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="mpObj.currentPage"
              :list="itemList"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="mpObj.itemsPerPage"
              :total.sync="mpObj.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="mpChange"
              @current-change="queryImInventoryMPList"
            />
          </div>
        </div>
      </ody-list-table-area>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button size="small" @click="showProductModal = false">{{ $t('取消') }}</el-button>
          <el-button size="small" type="primary" @click="confirmAddProduct">{{ $t('确认') }}</el-button>
        </el-row>
      </span>
    </ody-dialog>
    <!-- 快速录入弹框 -->
    <ody-dialog :visible.sync="fastInput.showFastInput" :title="$t('快速录入')" width="60%">
      <div>
        <el-radio-group v-model="fastInput.type">
          <el-radio :label="1">{{ $t('商品编码') }}</el-radio>
          <el-radio :label="2">{{ $t('条码') }}</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 10px">
        <el-input v-model="fastInput.context" :rows="10" name="context" type="textarea" maxlength="500"/>
        <p>{{ $t('请在下面文本框中输入') }}{{ fastInput.type === 2 ? $t('条码') : $t('商品编码') }},{{ $t('每行一个') }}{{ fastInput.type === 2 ? $t('条码') : $t('商品编码') }}，{{ $t('最多500行') }}。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button size="small" @click="fastInput.context = '';fastInput.showFastInput = false">{{ $t('取消') }}</el-button>
          <el-button size="small" type="primary" @click="doFastInput">{{ $t('确认') }}</el-button>
        </el-row>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'ImInventoryPlanAdd',
  data() {
    return {
      id: null,
      fastInput: {
        type: 1, // 1 商品编码，2 条码
        context: '',
        showFastInput: false
      },
      itemList: [],
      checked: [],
      canOperate: true,
      showProductModal: false,
      mpObj: {
        merchantId: null,
        warehouseId: null,
        currentPage: 1,
        itemsPerPage: 10,
        total: 0
      },
      addMpList: [],
      inventoryPlan: {
        merchantId: null,
        warehouseId: null,
        inventoryType: null,
        remark: null
      },
      warehouseList: [],
      merchantList: [],
      merchantNameMap: {},
      warehouseNameMap: {},
      inventoryTypeList: [
        { label: this.$t('日常盘点'), value: 0 },
        { label: this.$t('任务盘点'), value: 1 }
      ],
      columns: [
        {
          label: '商品编码',
          prop: 'productCode',
          align: 'center',
          show: true,
          minWidth: 150
        },
        {
          label: '商品名称',
          prop: 'productCname',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: '条码',
          prop: 'productBarCode',
          align: 'center',
          show: true,
          minWidth: 150
        },
        {
          label: 'SPU编码',
          prop: 'productSpuCode',
          align: 'center',
          show: true,
          minWidth: 150
        },
        {
          label: '货号',
          prop: 'productArtNo',
          align: 'center',
          show: true,
          minWidth: 100
        },
        {
          label: '规格属性',
          prop: 'productAttribute',
          align: 'center',
          show: true,
          minWidth: 100
        },
        {
          label: '计量单位',
          prop: 'productUnit',
          align: 'center',
          show: true,
          minWidth: 100
        },
        {
          label: '库存数量',
          prop: 'stockNum',
          align: 'center',
          show: true,
          minWidth: 100
        }
      ],
      operates: {
        width: 100,
        fixed: 'right',
        list: [
          {
            label: this.$t('删除'),
            method: (index, row) => {
              this.doDelete([row])
            },
            code: 'ui'
          }
        ]
      },
      rules: {
        merchantId: [
          { required: true, message: this.$t('请选择商家'), trigger: 'blur' }
        ],
        warehouseId: [
          { required: true, message: this.$t('请选择仓库'), trigger: 'blur' }
        ],
        inventoryType: [
          { required: true, message: this.$t('请选择盘点类型'), trigger: 'blur' }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.id = this.$route.params.id ? parseInt(this.$route.params.id) : null
      this.stockApi = this.$product.$api.stockApi
      this.merchantApi = this.$product.$api.merchantApi
      this.authApi = this.$product.$api.authApi
      await this.init()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async init() {
      await this.queryMerchantList()
      if (this.id) {
        await this.getById(this.id)
        this.merchantApi
          .queryPlatformAuthWarehousePage({ currentPage: 1, itemsPerPage: 500 })
          .then(res => {
            this.warehouseList = res.data.listObj.filter(item => {
              return item.merchantId === this.inventoryPlan.merchantId
            })
            this.warehouseNameMap = {}
            for (const obj of this.warehouseList) {
              this.warehouseNameMap[obj.warehouseId] = obj.warehouseName
            }
          })
      }
    },
    async getById(id) {
      // 根据ID查询详情
      const res = await this.stockApi.queryInventoryPlanById({ id: id })
      this.inventoryPlan = res.data
      // 查询商品数据
      this.stockApi.queryInventoryPlanDetailList({ inventoryCode: this.inventoryPlan.inventoryCode }).then((res) => {
        this.itemList = res.data
        this.checked = []
      })
    },
    save(inventoryStatus) {
      const vue = this
      this.$refs['inventoryPlanForm'].validate(async(valid) => {
        if (valid) {
          if (vue.inventoryPlan.inventoryType === 1 && !(vue.itemList && vue.itemList.length > 0)) {
            vue.$message(this.$t('商品不能为空'))
            return false
          }
          try {
            vue.canOperate = false
            vue.inventoryPlan.merchantName = vue.merchantNameMap[vue.inventoryPlan.merchantId]
            vue.inventoryPlan.warehouseName = vue.warehouseNameMap[vue.inventoryPlan.warehouseId]
            if (inventoryStatus === 0) {
              this.$confirm(this.$t('保存草稿后需要提交盘点后才能开始盘点，确认保存草稿吗') + '?', this.$t('提示')).then(() => {
                vue.update(() => {
                  vue.$message.success(vue.$t('保存成功'))
                  vue.back()
                }, true, inventoryStatus)
              })
            } else {
              this.$confirm(this.$t('提交盘点后开始直接开始盘点,确认提交开始盘点吗') + '?', this.$t('提示')).then(() => {
                vue.update(() => {
                  vue.$message.success(vue.$t('操作成功'))
                  vue.back()
                }, true, inventoryStatus)
              })
            }
          } finally {
            vue.canOperate = true
          }
        } else {
          return false
        }
      })
    },
    async update(fun, boo, inventoryStatus) {
      try {
        this.canOperate = false
        const res = await this.stockApi.saveOrUpdateInventoryPlan({
          ...this.inventoryPlan,
          itemList: this.itemList,
          inventoryStatus: inventoryStatus
        })
        if (res && res.data) {
          fun()
        }
      } finally {
        this.canOperate = boo
      }
    },
    async doFastInput() {
      // 快速录入
      if (!this.fastInput.context) {
        this.$message(this.$t('数据不能为空'))
        return
      }
      const fastInputText = this.fastInput.context.replace(/\n/g, '|').replace(/\s+/g, '').replace(/\|+/g, '|')
      if (fastInputText === '' || fastInputText === '|') {
        this.$message(this.$t('数据不能为空'))
        return
      }
      const codes = fastInputText.split('|')
      const params = {
        currentPage: 1,
        itemsPerPage: 500,
        merchantId: this.inventoryPlan.merchantId,
        warehouseId: this.inventoryPlan.warehouseId
      }
      if (this.fastInput.type === 1) {
        // 商品编码
        params.merchantProductCodeList = codes
      } else if (this.fastInput.type === 2) {
        // 条码
        params.merchantProductBarcodeList = codes
      } else {
        this.$message('this.fastInput.type error => ' + this.fastInput.type)
        return
      }
      const res = await this.stockApi.listInventoryMerchantProductPage(params)
      if (res && res.data && res.data.listObj) {
        const count = this.addProductList(res.data.listObj)
        this.$alert('本次录入：' + codes.length + '条<br>成功录入：' + count + '条', this.$t('提示'), { confirmButtonText: this.$t('确定'), dangerouslyUseHTMLString: true })
      } else {
        this.$message.error('录入失败')
      }
      this.fastInput.context = ''
      this.fastInput.showFastInput = false
    },
    doAddProduct() {
      const vue = this
      this.$refs['inventoryPlanForm'].validate((valid) => {
        if (valid) {
          vue.showProductModal = true
          vue.queryImInventoryMPList()
        } else {
          vue.showProductModal = false
          return false
        }
      })
    },
    toFastInput() {
      const vue = this
      this.$refs['inventoryPlanForm'].validate((valid) => {
        if (valid) {
          vue.fastInput.showFastInput = true
        } else {
          vue.fastInput.showFastInput = false
          return false
        }
      })
    },
    back(tip) {
      const vue = this
      if (tip) {
        this.$confirm(this.$t('取消会导致录入页面信息丢失,确认取消盘点单吗') + '?', this.$t('提示')).then(() => {
          vue.$portal.delActiveView()
          setTimeout(function() {
            vue.$router.push({ name: 'ImInventoryPlan' })
          }, 500)
        })
      } else {
        vue.$portal.delActiveView()
        setTimeout(function() {
          vue.$router.push({ name: 'ImInventoryPlan' })
        }, 500)
      }
    },
    doDelete(list) {
      const vue = this
      this.$confirm(this.$t('确认删除选择的数据吗') + '?', this.$t('提示')).then(() => {
        for (const obj of list) {
          vue.itemList = vue.arrDelete(vue.itemList, obj, ['id', 'merchantProductId'])
          vue.checked = vue.arrDelete(vue.checked, obj, ['id', 'merchantProductId'])
        }
      })
    },
    batchDelete() {
      const isChecked = this.checked && this.checked.length
      if (!isChecked) {
        this.$message(this.$t('请勾选数据'))
        return
      }
      this.doDelete(this.checked)
    },
    arrDelete(list, obj, keys) {
      const newList = []
      for (const o of list) {
        if (o === obj) {
          continue
        }
        let del = false
        for (const k of keys) {
          if (o[k] && o[k] === obj[k]) {
            del = true
            break
          }
        }
        if (!del) {
          newList.push(o)
        }
      }
      return newList
    },
    changeClearAll() {
      const vue = this
      if (vue.itemList && vue.itemList.length > 0) {
        vue.itemList = []
        vue.checked = []
        // this.$confirm(this.$t('切换商家/仓库，会导致已选择的商品数据清空，确认切换' + '？'), this.$t('提示')).then(() => {
        //   vue.itemList = []
        //   vue.checked = []
        // })
      }
    },
    async queryMerchantList() {
      return this.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.merchantList = []
          this.merchantNameMap = {}
          const merchantIds = []
          for (const obj of res.data.listObj) {
            if (merchantIds.indexOf(obj.merchantId) === -1) {
              merchantIds.push(obj.merchantId)
              this.merchantList.push({
                merchantId: obj.merchantId,
                merchantCode: obj.merchantCode,
                merchantName: obj.merchantName
              })
              this.merchantNameMap[obj.merchantId] = obj.merchantName
            }
          }
        })
    },
    getWarehouseByMerchantId(merchantId) {
      const vue = this
      const change = () => {
        this.inventoryPlan.warehouseId = null
        if (!merchantId) {
          this.warehouseList = []
          this.warehouseNameMap = {}
          return
        }
        this.merchantApi
          .queryPlatformAuthWarehousePage({ currentPage: 1, itemsPerPage: 500 })
          .then(res => {
            this.warehouseList = res.data.listObj.filter(item => {
              return item.merchantId === merchantId
            })
            this.warehouseNameMap = {}
            for (const obj of this.warehouseList) {
              this.warehouseNameMap[obj.warehouseId] = obj.warehouseName
            }
          })
      }
      if (vue.itemList && vue.itemList.length > 0) {
        vue.itemList = []
        vue.checked = []
      }
      change()
    },
    mpSelectRow(selection, row) {
      row.checked = !row.checked
    },
    mpSelectAll(selection) {
      if (selection.length === 0) {
        this.addMpList.map(item => {
          item.checked = false
        })
      } else {
        selection.map(item => {
          item.checked = true
        })
      }
    },
    canSelect(row) {
      return !row.selected
    },
    reset() {
      this.mpObj.merchantProductName = null
      this.mpObj.merchantProductCode = null
      this.mpObj.merchantProductBarcode = null
    },
    mpChange(val) {
      this.mpObj.itemsPerPage = val
      this.queryImInventoryMPList()
    },
    confirmAddProduct() {
      const products = this.addMpList.filter(item => item.checked)
      const flag = this.addProductList(products)
      if (flag === false) {
        return
      }
      this.showProductModal = false
    },
    addProductList(products) {
      let count = 0
      const merchantProductIds = {}
      this.itemList.forEach(item => { merchantProductIds[item.merchantProductId] = true })
      for (const obj of products) {
        if (merchantProductIds[obj.merchantProductId]) {
          continue
        }
        if (obj.inPlan === 1) {
          this.$message.warning(this.$t('商品') + obj.merchantProductCode + this.$t('存在盘点中的盘点单不能添加'))
          return false
        }
        count++
        this.itemList.push({
          stockNum: obj.stockNum,
          merchantProductId: obj.merchantProductId,
          productCode: obj.merchantProductCode,
          productCname: obj.merchantProductName,
          productBarCode: obj.merchantProductBarcode,
          productUnit: obj.measurementUnit,
          productSpuCode: obj.spuCode,
          productArtNo: obj.artNo,
          productAttribute: obj.extInfoStr,
          pictureUrl: obj.pictureUrl,
          batchStrategyId: obj.batchStrategyId
        })
      }
      return count
    },
    async queryImInventoryMPList() {
      if (!this.mpObj.merchantProductName) {
        delete this.mpObj.merchantProductName
      }
      if (!this.mpObj.merchantProductCode) {
        delete this.mpObj.merchantProductCode
      }
      if (!this.mpObj.merchantProductBarcode) {
        delete this.mpObj.merchantProductBarcode
      }
      this.mpObj.merchantId = this.inventoryPlan.merchantId
      this.mpObj.warehouseId = this.inventoryPlan.warehouseId
      this.stockApi.listInventoryMerchantProductPage(this.mpObj).then(res => {
        this.addMpList = res.data.listObj
        this.mpObj.total = res.data.total
        if (this.itemList && this.itemList.length > 0) {
          const productSelectedMap = {}
          for (const obj of this.itemList) {
            productSelectedMap[obj.merchantProductId] = true
          }
          for (const obj of this.addMpList) {
            if (productSelectedMap[obj.merchantProductId]) {
              obj.selected = true
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin-bottom: 8px;
  }
</style>
