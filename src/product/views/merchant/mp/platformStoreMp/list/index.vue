<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" class="form">
          <ody-search-item :label="this.$t('渠道')+ ':'" prop="channelCode">
            <ody-channel-select
              ref="channel"
              v-model="queryParam.channelCode"
              :placeholder="$t('全部')"
              name="queryParam_channelCode"
            />
          </ody-search-item>
          <ody-search-item :label="this.$t('店铺')+ ':'" prop="storeId">
            <ody-store-select
              v-model="queryParam.storeId"
              :placeholder="$t('全部')"
              name="queryParam_storeId"
              value-key="storeId"
            />
          </ody-search-item>
          <ody-search-item :label="this.$t('商品名称')+ ':'" prop="chineseName">
            <el-input v-model="queryParam.chineseName" :placeholder="$t('请输入商品名称')" name="queryParam_chineseName"/>
          </ody-search-item>
          <ody-search-item :label="this.$t('SPU编码')+ ':'" prop="code">
            <el-input v-model="queryParam.code" :placeholder="$t('请输入SPU编码')" name="queryParam_code"/>
          </ody-search-item>
          <ody-search-item :label="this.$t('商品类型')+ ':'" prop="type">
            <el-select
              v-model="queryParam.type"
              :placeholder="$t('common_choose_please')"
              name="queryParam_type"
              clearable
            > <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="(v,k) in productTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="this.$t('商品品牌')+ ':'" prop="brandName">
            <el-input
              v-model="queryParam.brandName"
              name="queryParam_brandName"
              readonly="true"
              @click.native="openBrandModal"
            />
          </ody-search-item>
          <ody-search-item :label="this.$t('商品类目')+ ':'" prop="categoryIds">
            <ody-tree-select
              :normalizer="normalizer"
              :append-to-body="true"
              :z-index="10000"
              v-model="queryParam.categoryIds"
              :multiple="true"
              :options="categoryTreeData"
              name="queryParam_categoryIds"
              value-consists-of="LEAF_PRIORITY"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品形式')+ ':'" prop="typeOfProduct">
            <el-select
              v-model="queryParam.typeOfProduct"
              :placeholder="$t('common_choose_please')"
              name="queryParam_typeOfProduct"
              clearable
            >  <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="(v,k) in typeOfProductList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('用途')+ ':'" prop="useType">
            <el-select
              v-model="queryParam.useType"
              :placeholder="$t('common_choose_please')"
              name="queryParam_useType"
              clearable
            > <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="(v,k) in useTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('价格层级')+ ':'" prop="priceLevel">
            <el-select
              v-model="queryParam.priceLevel"
              :placeholder="$t('common_choose_please')"
              name="queryParam_priceLevel"
              clearable
            > <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="(v,k) in priceLevelList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('是否入仓')+ ':'" prop="warehouseType">
            <el-select
              v-model="queryParam.warehouseType"
              :placeholder="$t('common_choose_please')"
              name="queryParam_warehouseType"
              clearable
            > <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="(v,k) in warehouseTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('店铺库存')+ ':'" prop="count">
            <ody-number-range v-model="count" name="count" range="[0, 9999999]" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="PlatformMpListQuery_handleQuery"
          size="small"
          type="primary"
          code="PlatformMpListQuery"
          @click="handleQuery"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="PlatformStoreMpDown_batchForceDown" size="small" code="PlatformStoreMpDown" @click="batchForceDown(0)">{{ $t('批量强制下架') }}</ody-button>
        <ody-button name="PlatformStoreMpShelf_batchCansale" size="small" code="PlatformStoreMpShelf" @click="batchCansale(1)">{{ $t('批量上架') }}</ody-button>
        <ody-button
          name="PlatformStoreMpBatchExport_batchExport"
          size="small"
          type="primary"
          code="PlatformStoreMpBatchExport"
          @click="batchExport"
        >{{ $t('common_batch_export') }}</ody-button>
        <ody-button name="PlatformStoreMpViewExportList_viewTask" size="small" code="PlatformStoreMpViewExportList" @click="viewTask">{{ $t('查看任务') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="tabChange">
          <el-tab-pane :label="$t('全部')" name="1" />
          <el-tab-pane :label="$t('销售中')" name="2" />
          <el-tab-pane :label="$t('不可售')" name="3" />
        </el-tabs>
      </div>
      <div slot="search-filter" >
        <el-select
          v-if="showSelect"
          v-model="queryFlag"
          :placeholder="$t('请选择')"
          name="queryFlag"
          collapse-tags
          multiple
          filterable
          allow-create
          default-first-option
          @change="canNotSaleChange"
        >
          <el-option
            v-for="item in canNotSaleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="table.checked"
          :multiple="true"
          :columns="table.columns"
          :operates="table.operates"
          :selectable="checkedSelectable"
          request-url="/back-product-web/back/mp/product/listStoreProductInfoByPage.do"
          request-page-type="page"
          @getTableList="getTableList"
        >
          <template slot="chineseName" slot-scope="scope">
            <div>
              <div class="table-product-name">
                <ody-left-right effect="positionLeft">
                  <div slot="left">
                    <div class="image-container">
                      <el-image
                        :src="scope.row.pictureUrl"
                        :fit="cover"
                        style="width: 100px; height: 100px">
                        <div
                          slot="error"
                          style="font-size: 30px;display: flex;align-items: center; justify-content: center;width: 100%; height: 100%; background: #f5f7fa; color: #909399;">
                          <i class="el-icon-picture-outline"/>
                        </div>
                      </el-image>
                    </div>
                    <div class="name-container">
                      <div class="link-name">
                        <el-link type="primary">
                          <router-link
                            :to="{ name: scope.row.useType === 0 ? 'ProductDetail' : 'ProductDetailMaterial', query: { id: scope.row.id ,isView: true} }"
                          >
                            <el-tooltip placement="top">
                              <template slot="content">
                                <div>{{ scope.row.chineseName }}</div>
                              </template>
                              <div class="name-text">{{ scope.row.chineseName }}</div>
                            </el-tooltip>
                          </router-link>
                        </el-link>
                      </div>
                      <div class="table-product-label">{{ scope.row.typeStr }}</div>
                    </div>
                  </div>
                </ody-left-right>
              </div>
            </div>
          </template>
          <template slot="combinePrice" slot-scope="scope">
            <ody-left-right effect="positionLeft">
              <div slot="left">
                <div v-if="scope.row.salePriceWithTax">
                  <span>{{ scope.row.salePriceWithTax }}</span>
                </div>
                <div v-if="scope.row.minSalePriceWithTax && scope.row.maxSalePriceWithTax">
                  <span>{{ scope.row.minSalePriceWithTax }}</span>
                  <span>-</span>
                  <span>{{ scope.row.maxSalePriceWithTax }}</span>
                </div>
              </div>
            </ody-left-right>
          </template>
          <template slot="code" slot-scope="scope">
            <div class="table-code">
              <div class="table-code-merchant">
                <span class="table-code-merchant-span">{{ $t('商') }}</span>
                <span>{{ scope.row.code }}</span>
              </div>
              <div v-if="scope.row.artNo" class="table-code-goods">
                <span class="table-code-good-span">{{ $t('货') }}</span>
                <span>{{ scope.row.artNo }}</span>
              </div>
            </div>
          </template>
          <template slot="stockNum" slot-scope="scope">
            <div class="table-code">
              <div class="table-code-merchant">
                <span
                  v-if="scope.row.warehouseType === 0"
                  class="table-code-good-span"
                >{{ scope.row.warehouseTypeStr }}</span>
                <span
                  v-if="scope.row.warehouseType === 1"
                  class="table-code-red-span"
                >{{ scope.row.warehouseTypeStr }}</span>
                <span>{{ scope.row.stockNum }}</span>
              </div>
            </div>
          </template>
          <template slot="labelStock" slot-scope="scope" :scope="scope">
            <span>{{ $t('common_mp_realStockNum') }}</span>
            <i :class="sortStockFlag === 1 ? 'el-icon-sort-down' : sortStockFlag === 2 ? 'el-icon-sort-up' : 'el-icon-sort'" name="sortStock" @click="sortStock" />
          </template>
          <template slot="canSale" slot-scope="scope">
            <div v-if="scope.row.canSale===0" class="table-code">
              <div v-if="scope.row.canSaleType === 2">
                <div>
                  <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="scope.row.canSale"
                    :active-text="scope.row.canSale === 1 ? '上架' : '下架'"
                    name="scope_row_canSale"
                    @change="changeCansale(scope.row,scope.row.canSale)"
                  />
                  <el-tooltip style="color:red" effect="dark" placement="top">
                    <div slot="content">
                      <div>
                        <span>{{ $t('下架时间') }} :</span>
                        <span>{{ scope.row.updateTimeStr }}</span>
                        <br >
                        <span>{{ $t('下架原因') }} ：</span>
                        <span>{{ $t('运营强制下架') }}</span>
                      </div>
                    </div>
                    <i class="el-icon-question" />
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div v-if="scope.row.canSale===0" class="table-code">
              <div v-if="scope.row.canSaleType !== 2">
                <el-switch
                  :active-value="1"
                  :inactive-value="0"
                  :active-text="scope.row.canSale === 1 ? '上架' : '下架'"
                  v-model="scope.row.canSale"
                  name="scope_row_canSale7"
                  @change="changeCansale(scope.row,scope.row.canSale)"
                />
              </div>
            </div>
            <div v-if="scope.row.canSale===1" class="table-code">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.canSale"
                :active-text="scope.row.canSale === 1 ? '上架' : '下架'"
                name="scope_row_canSale3"
                @change="changeDown(scope.row,scope.row.canSale)"
              />
            </div>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <!-- 品牌模态框组件 --->
    <brand-modal-component :visible.sync="brandVisible" @ok="closeBrandModal" />
    <download-task :is-data-task="true" :visible.sync="downloadTaskVisible" :task-type="'storeProductExport'" />
  </section>
</template>

<script>
import DownloadTask from '@/components/downloadTask/index'
import BrandModalComponent from '@/components/brandModal'

export default {
  components: {
    BrandModalComponent,
    DownloadTask
  },
  data() {
    return {
      canNotSaleList: [
        {
          value: '1',
          label: this.$t('运营强制下架')
        },
        {
          value: '2',
          label: this.$t('商家商品不可售')
        },
        {
          value: '3',
          label: this.$t('店铺商品下架')
        }
      ],
      queryFlag: [],
      showSelect: false,
      count: [],
      ids: [],
      categoryTreeData: [],
      categoryNameList: [],
      useTypeList: [],
      priceLevelList: [],
      warehouseTypeList: [],
      productTypeList: [],
      typeOfProductList: [],
      categoryIds: [],
      sourceList: [],
      batchVisible: false,
      batchType: 1,
      batchStatusVisible: false,
      batchStatusType: 1,
      activeState: '1',
      queryParam: getDefaultQueryParam(),
      brandVisible: false,
      typeOfProduct: null,
      dataType: null,
      storeMpId: null,
      storeProductEditPriceVisible: false,
      multiplyStoreProductEditPriceVisible: false,
      singlesizeModalVisible: false,
      multiSpecificationModalVisible: false,
      downloadTaskVisible: false,
      templateVisible: false,
      zoneVisible: false,
      merchantId: null,
      storeId: null,
      table: {
        columns: [
          {
            show: true,
            tooltip: false,
            slot: 'chineseName',
            label: this.$t('product_name'),
            align: 'left',
            width: '330px'
          },
          {
            show: true,
            slot: 'combinePrice',
            label: this.$t('retail_price'),
            align: 'left'
          },
          {
            show: true,
            slot: 'code',
            label: this.$t('SPU编码/货号'),
            align: 'left',
            minWidth: '160px'
          },
          {
            show: true,
            slot: 'stockNum',
            label: this.$t('common_mp_realStockNum'),
            align: 'left',
            minWidth: '160px',
            labelSlot: 'labelStock'
          },
          {
            show: true,
            prop: 'brandName',
            label: this.$t('common_product_brand'),
            align: 'left',
            minWidth: '100px'
          },
          {
            show: true,
            prop: 'categoryFullNamePath',
            label: this.$t('common_product_category'),
            align: 'left',
            minWidth: '150px'
          },

          {
            show: true,
            prop: 'storeName',
            label: this.$t('店铺'),
            align: 'left',
            minWidth: '100px'
          },
          {
            show: true,
            prop: 'merchantName',
            label: this.$t('merchant_name'),
            align: 'left',
            minWidth: '100px'
          },
          {
            show: true,
            prop: 'channelName',
            label: this.$t('渠道'),
            align: 'left',
            minWidth: '120px'
          },
          {
            show: true,
            slot: 'canSale',
            label: this.$t('common_mp_isSale'),
            align: 'left',
            minWidth: '100px'
          }
        ],
        checked: []
      }
    }
  },
  async mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      await this.initCodes()
      await this.queryBackedRootCategory()
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    sortStock() {
      const data = this.$refs['table'].$refs['odyTable'].tableData
      if (this.sortStockFlag === null) {
        data.sort((a, b) => (b.stockNum || 0) - (a.stockNum || 0))
        this.sortStockFlag = 1
      } else {
        if (this.sortStockFlag === 1) {
          this.sortStockFlag = 2
        } else {
          this.sortStockFlag = 1
        }
        data.reverse()
      }
    },
    async initCodes() {
      const vue = this
      vue.$product.$api.common
        .listMultiCode({
          categorys: [
            'PRICE_LEVEL',
            'PRODUCT_TYPE',
            'TYPE_OF_PRODUCT',
            'WAREHOUSE_TYPE',
            'USE_TYPE'
          ]
        })
        .then(data => {
          if (data.code === '0') {
            vue.priceLevelList = data.data.PRICE_LEVEL
            vue.productTypeList = data.data.PRODUCT_TYPE
            vue.typeOfProductList = data.data.TYPE_OF_PRODUCT
            vue.warehouseTypeList = data.data.WAREHOUSE_TYPE
            vue.useTypeList = data.data.USE_TYPE
          }
        })
    },
    async handleQuery() {
      await this.queryList()
    },
    getTableList(list) {
      this.sortStockFlag = null // 清空排序
    },
    // 商家商品列表查询
    async queryList() {
      this.table.checked = []
      if (this.count.length > 0) {
        this.queryParam.minStoreStockNum = this.count[0]
        this.queryParam.maxStoreStockNum = this.count[1]
      }
      return this.$refs.table.getList(
        this.formHasValue({
          filters: {
            ...this.queryParam
          }
        })
      )
    },
    tabChange() {
      if (this.activeState === '1') {
        this.queryParam.allCanNotSale = null
        this.queryParam.platformCanNotSale = null
        this.queryParam.merchantCanNotSale = null
        this.queryParam.storeCanNotSale = null
        this.queryParam.storeCanSale = null
        this.showSelect = false
      } else if (this.activeState === '2') {
        this.queryParam.allCanNotSale = null
        this.queryParam.platformCanNotSale = null
        this.queryParam.merchantCanNotSale = null
        this.queryParam.storeCanNotSale = null
        this.queryParam.storeCanSale = 1
        this.showSelect = false
      } else if (this.activeState === '3') {
        this.queryFlag = ['1', '2', '3']
        this.queryParam.platformCanNotSale = 2
        this.queryParam.merchantCanNotSale = 2
        this.queryParam.storeCanNotSale = 0
        this.queryParam.storeCanSale = null
        this.showSelect = true
      }
      this.queryList()
    },
    canNotSaleChange() {
      this.queryParam.allCanNotSale = null
      this.queryParam.storeCanSale = null
      this.queryParam.platformCanNotSale = null
      this.queryParam.merchantCanNotSale = null
      this.queryParam.storeCanNotSale = null
      if (this.queryFlag.length > 0) {
        for (var i = 0; i < this.queryFlag.length; i++) {
          if (this.queryFlag[i] === '1') {
            this.queryParam.platformCanNotSale = 2
          } else if (this.queryFlag[i] === '2') {
            this.queryParam.merchantCanNotSale = 2
          } else if (this.queryFlag[i] === '3') {
            this.queryParam.storeCanNotSale = 0
          }
        }
        this.queryList()
      }
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    // 查询后台类目树根节点
    async queryBackedRootCategory() {
      return this.mpApi.listBackCategoryTree({}).then(res => {
        this.categoryTreeData = [res.data]
      })
    },
    // 类目节点点击事件
    handleCategoryTreeSelect(treeNode) {
      this.mpApi
        .queryCategoryListByParent({ parentId: treeNode.id })
        .then(res => {
          if (res.data.length === 0) {
            return
          }
          this.$set(treeNode, 'children', [])
          for (var i = 0; i < res.data.length; i++) {
            treeNode.children.push({
              id: res.data[i].id,
              label: res.data[i].name
            })
          }
        })
    },
    // 打开品牌模态框
    openBrandModal() {
      this.brandVisible = !this.brandVisible
    },
    // 关闭品牌模态框
    closeBrandModal(selectVal) {
      // 返回模态框返回的对象
      this.queryParam.brandId = selectVal.id
      this.queryParam.brandName = selectVal.name
    },
    // 重置
    reset() {
      this.count = []
      this.table.checked = []
      this.categoryNameList = []
      this.queryParam = getDefaultQueryParam()
      if (this.categoryTreeData) {
        this.categoryTreeData.children = []
      }
    },
    viewTask() {
      this.downloadTaskVisible = true
    },
    async batchCansale(type) {
      if (this.table.checked.length === 0) {
        return this.$message('请至少选择一个商品')
      }
      const confirm = await this.$confirm('是否对选中的商品执行上架', '提示')
      if (confirm) {
        const ids = []
        if (this.table.checked && this.table.checked.length > 0) {
          for (let i = 0; i < this.table.checked.length; i++) {
            const item = this.table.checked[i]
            ids.push(item.id)
          }
          const submitParams = {}
          submitParams.mpIdList = ids
          submitParams.canSale = type
          const result = await this.mpApi.platformOperateStoreMpShelve(
            submitParams
          )
          if (result && result.code === '0') {
            this.queryList()
          }
        }
      }
    },
    async batchForceDown(type) {
      if (this.table.checked.length === 0) {
        return this.$message('请至少选择一个商品')
      }
      const confirm = await this.$confirm(
        '是否对选中的商品执行强制下架',
        this.$t('提示')
      )
      if (confirm) {
        const ids = []
        if (this.table.checked && this.table.checked.length > 0) {
          for (let i = 0; i < this.table.checked.length; i++) {
            const item = this.table.checked[i]
            ids.push(item.id)
          }
          const submitParams = {}
          submitParams.mpIdList = ids
          submitParams.canSale = type
          submitParams.canSaleType = 2
          const result = await this.mpApi.platformOperateStoreMpUnShelve(
            submitParams
          )
          if (result && result.code === '0') {
            this.queryList()
          }
        }
      }
    },
    async changeCansale(row, cansale) {
      const submitParams = {}
      submitParams.mpIdList = []
      submitParams.mpIdList.push(row.id)
      submitParams.canSale = cansale
      const result = await this.mpApi.platformOperateStoreMpShelve(submitParams)
      if (result && result.code === '0') {
        this.queryList()
      }
    },
    async changeDown(row, cansale) {
      const submitParams = {}
      submitParams.mpIdList = []
      submitParams.mpIdList.push(row.id)
      submitParams.canSale = cansale
      submitParams.canSaleType = 2
      const result = await this.mpApi.platformOperateStoreMpUnShelve(
        submitParams
      )
      if (result && result.code === '0') {
        this.queryList()
      }
    },
    batchExport() {
      const ids = []
      var exportInfoParam = {}
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          ids.push(item.id)
        }
      } else {
        exportInfoParam = this.queryParam
      }
      //  else {
      //   this.$message({
      //     type: 'warning',
      //     message: this.$t('back_web_please_choose_record')
      //   })
      //   return
      // }
      exportInfoParam.currentPage = 1
      exportInfoParam.itemsPerPage = 1000
      exportInfoParam.idList = ids
      exportInfoParam.useTypeList = [0, 1]
      exportInfoParam.dataType = 3
      this.mpApi
        .asyncEvent({
          dataTask: true,
          templateCode: 'storeProductExport',
          jsonTxt: JSON.stringify(exportInfoParam)
        })
        .then(res => {
          if (res.code === '0') {
            this.$message({
              showClose: true,
              message: this.$t('创建导出任务成功！'),
              type: 'info'
            })
          } else {
            this.$message({
              showClose: true,
              message: this.$t('创建导出任务失败！'),
              type: 'error'
            })
          }
        })
    }
  }
}

function getDefaultQueryParam() {
  return Object.assign(
    {},
    {
      channelCode: null,
      chineseName: null,
      brandName: null,
      code: null,
      type: null,
      typeOfProduct: null,
      categoryIds: [],
      storeId: null,
      canSale: null,
      minStoreStockNum: null,
      maxStoreStockNum: null,
      useType: null,
      priceLevel: null,
      warehouseType: null,
      allCanNotSale: null,
      platformCanNotSale: null,
      merchantCanNotSale: null,
      storeCanNotSale: null,
      storeCanSale: null
    }
  )
}
</script>
<style lang="scss" scoped>
.table-product-label {
  display: inline-block;
  background: #1890ff;
  font-size: 12px;
  padding: 0 2px;
  color: #ffffff;
}
.image-container {
  float: left;
}
.name-container {
  margin-left: 100px;
  position: relative;
  height: 100px;
  padding: 5px;
}
.link-name {
  word-wrap: break-word;
  width: 200px;
  height: 70px;
  overflow: hidden;
  word-break: break-all;
  white-space: pre-wrap;
}
.name-text {
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.table-code {
  .table-code-merchant-span {
    background: #12CE66;
    color: #ffffff;
    font-size: 12px;
  }
  .table-code-goods-span {
    background: #74b511;
    color: #ffffff;
    font-size: 12px;
  }
  .table-code-good-span {
    background: #1890ff;
    color: #ffffff;
    font-size: 12px;
  }
  .table-code-red-span {
    background: #ff0000;
    color: #ffffff;
    font-size: 12px;
  }
}
.popover-container {
  .popover-input {
    margin-bottom: 10px;
  }
}
.btn-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-button {
    margin-bottom: 4px;
  }
}
</style>
