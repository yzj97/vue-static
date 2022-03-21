<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" class="form">
          <ody-search-item :label="$t('筛选')+ ':'" prop="chineseName">
            <el-select
              v-model="queryParam.queryFlag "
              :placeholder="$t('common_choose_please')"
              name="queryParam_queryFlag "
              clearable
            >
              <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="(v,k) in queryFlagList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')+ ':'" prop="chineseName">
            <el-input v-model="queryParam.chineseName" :placeholder="$t('请输入商品名称')" name="queryParam_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('SPU编码')+ ':'" prop="code">
            <el-input v-model="queryParam.code" :placeholder="$t('请输入SPU编码')" name="queryParam_code" />
          </ody-search-item>
          <ody-search-item :label="$t('商品类型')+ ':'" prop="type">
            <el-select
              v-model="queryParam.type"
              :placeholder="$t('common_choose_please')"
              name="queryParam_type"
              clearable
            > <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="(v,k) in productTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品品牌')+ ':'" prop="brandName">
            <el-input
              v-model="queryParam.brandName"
              :placeholder="$t('common_choose_please')"
              name="queryParam_brandName"
              readonly="true"
              @click.native="openBrandModal"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品类目')+ ':'" prop="categoryIds">
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
          <ody-search-item :label="$t('销售状态')+ ':'" prop="canSale">
            <el-select v-model="queryParam.canSale" :placeholder="$t('common_choose_please')" name="queryParam_canSale" clearable>
              <el-option :value="null" :label="$t('common_all')"/>
              <el-option
                v-for="(value, key) in canSaleList"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品形式')+ ':'" prop="typeOfProduct">
            <el-select
              v-model="queryParam.typeOfProduct"
              :placeholder="$t('common_choose_please')"
              name="queryParam_typeOfProduct"
              clearable
            > <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="(v,k) in typeOfProductList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('merchant_name')+ ':'" prop="merchantId">
            <ody-merchant-select v-model="queryParam.merchantId" name="queryParam_merchantId" value-key="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('商品来源')+ ':'" prop="sourceType">
            <el-select
              v-model="queryParam.sourceType"
              :placeholder="$t('common_choose_please')"
              name="queryParam_sourceType"
              clearable
            > <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="(v,k) in sourceTypeList" :label="v" :key="k" :value="k" />
            </el-select>
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
        <!--:disabled="table.checked.length == 0"-->
        <ody-button
          name="PlatformMpBatchExport_batchExport"
          size="small"
          type="primary"
          code="PlatformMpBatchExport"
          @click="batchExport"
        >{{ $t('common_batch_export') }}</ody-button>
        <ody-button
          name="PlatformMpViewExportList_viewTask"
          size="small"
          type="primary"
          code="PlatformMpViewExportList"
          @click="viewTask"
        >{{ $t('common_see_task') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="onTabClick">
          <el-tab-pane v-for="(tab, index) in tabs" :label="tab.label" :key="index">
            <div slot="label">{{ tab.label }} {{ tab.count !== undefined ? '(' + (tab.count || 0) + ')' : '' }}</div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="table.checked"
          :multiple="true"
          :columns="table.columns"
          :operates="table.operates"
          :selectable="checkedSelectable"
          request-url="/back-product-web/back/mp/product/listMerchantProductInfoByPage.do"
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
                            :to="{ name: 'ProductDetail', query: { id: scope.row.id ,isView: true} }"
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
        </ody-table>
      </div>
    </ody-list-table-area>
    <download-task :is-data-task="true" :task-type="'merchantProductExport'" :visible.sync="downloadTaskVisible" />
    <!-- 品牌模态框组件 --->
    <brand-modal-component :visible.sync="brandVisible" @ok="closeBrandModal" />
    <MerchantProductSentView :visible.sync="merchantProductSentVisible" :mp-id.sync="mpId" />
  </section>
</template>

<script>
import DownloadTask from '@/components/downloadTask/index'
import BrandModalComponent from '@/components/brandModal'
import MerchantProductSentView from '@/components/merchantProductSentView'
export default {
  name: 'MerchantProductManage',
  components: {
    DownloadTask,
    BrandModalComponent,
    MerchantProductSentView
  },
  data() {
    const self = this
    return {
      sortStockFlag: null,
      queryFlagList: [],
      productTypeList: [],
      typeOfProductList: [],
      categoryIds: [],
      sourceTypeList: [],
      auditStatusList: [],
      canSaleList: [],
      ids: [],
      batchVisible: false,
      batchType: 1,
      merchantProductSentVisible: false,
      batchStatusVisible: false,
      batchSentDownVisible: false,
      downloadTaskVisible: false,
      merchantProductEditNameVisible: false,
      merchantProductEditPriceVisible: false,
      multiplyMerchantProductEditPriceVisible: false,
      batchStatusType: 1,
      activeState: '0',
      queryParam: getDefaultQueryParam(),
      platformMpId: null,
      name: null,
      typeOfProduct: null,
      dataType: null,
      categoryNameList: [],
      categoryTreeData: [],
      brandVisible: false,
      mpId: null,
      tabs: [],
      currentTab: {},
      merchantId: null,
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
            align: 'center',
            labelSlot: 'labelStock'
          },
          {
            show: true,
            prop: 'brandName',
            label: this.$t('common_product_brand'),
            align: 'center'
          },
          {
            show: true,
            prop: 'categoryFullNamePath',
            label: this.$t('common_product_category'),
            align: 'center'
          },
          {
            show: true,
            prop: 'statusStr',
            label: this.$t('common_audit_status'),
            align: 'center',
            minWidth: '120px',
            render: (h, params) => {
              if (params.row.status === 3) {
                var self = this
                return (
                  <span>
                    <sapn style={'color:red'}>{params.row.statusStr}</sapn>
                    <el-tooltip
                      style={'color:red'}
                      effect={'dark'}
                      placement={'top'}
                    >
                      <div slot={'content'}>
                        <div>
                          <span>{self.$t('拒绝原因')}：</span>
                          <span>{params.row.auditMessage}</span>
                        </div>
                      </div>
                      <i class={'el-icon-question'} />
                    </el-tooltip>
                  </span>
                )
              } else {
                return <sapn>{params.row.statusStr}</sapn>
              }
            }
          },
          {
            show: true,
            prop: 'canSale',
            label: this.$t('common_mp_isSale'),
            align: 'center',
            minWidth: '120px',
            render: function(h, params) {
              return (
                <div>
                  <el-switch
                    value={params.row.canSale === 1}
                    active-text={params.row.canSale === 1 ? '是' : '否'}
                  ></el-switch>
                </div>
              )
            }
          },
          {
            show: true,
            prop: 'merchantName',
            label: this.$t('merchant_name'),
            align: 'center'
          },
          {
            show: true,
            prop: 'sourceTypeStr',
            label: this.$t('商品来源'),
            align: 'center'
          }
        ],
        operates: {
          width: '100px',
          fixed: 'right',
          list: [
            {
              label: '查看分发',
              disabled: false,
              method: (index, row) => {
                self.viewSentDown(row)
              },
              code: 'PlatformMpViewSentDown'
            }
          ]
        },
        checked: []
      }
    }
  },
  async mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      this.tabs = [
        {
          label: this.$t('全部')
        }
      ]
      this.currentTab = this.tabs[0]
      await this.queryBackedRootCategory()
      await this.initCodes()
      await this.queryList()
      this.queryCount()
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
      console.info(data)
    },
    initCodes() {
      const vue = this
      vue.$product.$api.common
        .listMultiCode({
          categorys: [
            'PRODUCT_CONDITION',
            'PRODUCT_TYPE',
            'TYPE_OF_PRODUCT',
            'SALE_STATUS',
            'SOURCE_TYPE',
            'APPROVAL_STATUS'
          ]
        })
        .then(data => {
          if (data.code === '0') {
            vue.queryFlagList = data.data.PRODUCT_CONDITION
            vue.productTypeList = data.data.PRODUCT_TYPE
            vue.typeOfProductList = data.data.TYPE_OF_PRODUCT
            vue.canSaleList = data.data.SALE_STATUS
            vue.sourceTypeList = data.data.SOURCE_TYPE
            vue.auditStatusList = data.data.APPROVAL_STATUS
            for (var i in vue.auditStatusList) {
              if (typeof vue.auditStatusList[i] === 'string') {
                vue.tabs.push({
                  status: i,
                  label: vue.auditStatusList[i],
                  count: null
                })
              }
            }
          }
        })
    },
    async handleQuery() {
      await this.queryList()
      this.queryCount()
    },
    getTableList(list) {
      this.sortStockFlag = null // 清空排序
    },
    // 商家商品列表查询
    async queryList() {
      this.table.checked = []
      this.queryParam.status = this.currentTab.status
      return this.$refs.table.getList(
        this.formHasValue({
          filters: {
            ...this.queryParam
          }
        })
      )
    },
    async queryCount() {
      const { ...params } = this.queryParam
      if (this.categoryNameList.length > 0) {
        params.categoryIds = this.categoryNameList
      }
      params.status = null
      const filters = {
        filters: params
      }
      const {
        data
      } = await this.$product.$api.mpApi.countMerchantProductStatus(filters)
      const counts = data.reduce((r, i) => {
        r[i.status] = i.count
        return r
      }, {})
      this.tabs.forEach(element => {
        if (element.status !== undefined) {
          element.count = counts[element.status] || 0
        }
      })
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
    onTabClick() {
      for (var i = 0; i < this.tabs.length; i++) {
        if (i.toString() === this.activeState) {
          this.currentTab = this.tabs[i]
          break
        }
      }
      this.queryList()
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
    viewSentDown(row) {
      this.mpId = row.id
      this.merchantProductSentVisible = true
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
      exportInfoParam.useTypeList = [0]
      exportInfoParam.dataType = 2
      this.mpApi
        .asyncEvent({
          dataTask: true,
          templateCode: 'merchantProductExport',
          // jsonTxt: JSON.stringify({
          //   currentPage: 1,
          //   itemsPerPage: 1000,
          //   idList: ids,
          //   useTypeList: [0],
          //   dataType: 2
          // })
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
      queryFlag: null,
      chineseName: null,
      code: null,
      type: null,
      typeOfProduct: null,
      categoryIds: [],
      merchantId: null,
      canSale: null,
      sourceType: null,
      status: null
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
