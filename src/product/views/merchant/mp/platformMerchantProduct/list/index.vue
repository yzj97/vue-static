<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" class="form">
          <ody-search-item :label="$t('筛选')+ ':'" prop="queryFlag">
            <el-select
              v-model="queryParam.queryFlag"
              :placeholder="$t('common_all')"
              name="queryParam_queryFlag"
              clearable
            >
              <el-option v-for="(v,k) in queryFlagList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')+ ':'" prop="chineseName">
            <el-input
              v-model="queryParam.chineseName"
              :placeholder="$t('请输入商品名称')"
              name="queryParam_chineseName"
              maxlength="100"
            />
          </ody-search-item>
          <ody-search-item :label="$t('SPU编码')+ ':'" prop="code">
            <el-input
              v-model="queryParam.code"
              :placeholder="$t('请输入SPU编码')"
              name="queryParam_code"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品类型')+ ':'" prop="type">
            <el-select
              v-model="queryParam.type"
              :placeholder="$t('common_all')"
              name="queryParam_type"
              clearable
            >
              <el-option v-for="(v,k) in productTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品品牌')+ ':'" prop="brandId">
            <ody-brand-choose
              v-model="queryParam.brandId"
              :placeholder="$t('common_choose_please')"
              name="queryParam_brandId"
            />
            <!-- <el-input
              v-model="queryParam.brandName"
              :placeholder="$t('common_choose_please')"
              name="queryParam_brandName"
              readonly="true"
              @click.native="openBrandModal"
            />-->
          </ody-search-item>
          <ody-search-item :label="$t('商品类目')+ ':'" prop="categoryIds">
            <ody-tree-select
              :normalizer="normalizer"
              :append-to-body="true"
              :z-index="10000"
              v-model="queryParam.categoryIds"
              :multiple="true"
              :async="isAsync"
              :options="categoryTreeData"
              :load-options="isAsync ? queryBackedRootCategory : null"
              :default-options="isAsync"
              :default-expand-level="9999"
              search-prompt-text="请搜索你想选择的商品类目"
              open-on-focus
              name="queryParam_categoryIds"
              value-consists-of="LEAF_PRIORITY"
              no-results-text="未查询出结果"
              no-options-text="没有可用的选项"
              @open="treeOpen"
              @search-change="searchChange"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品形式')+ ':'" prop="typeOfProduct">
            <el-select
              v-model="queryParam.typeOfProduct"
              :placeholder="$t('common_all')"
              name="queryParam_typeOfProduct"
              clearable
            >
              <el-option v-for="(v,k) in typeOfProductList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('供应商名称')+ ':'" prop="supplierName">
            <el-input
              v-model="queryParam.supplierName"
              :placeholder="$t('请输入供应商名称')"
              name="queryParam_supplierName"
              maxlength="100"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="PlatformMerchantProductListQuery_handleQuery"
          size="small"
          type="primary"
          code="PlatformMerchantProductListQuery"
          @click="handleQuery"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="PlatformMerchantProductBatchExport_batchExport"
          size="small"
          code="PlatformMerchantProductBatchExport"
          @click="batchExport"
        >{{ $t('common_batch_export') }}</ody-button>
        <ody-button
          name="PlatformMerchantProductBatchDispatch_batchSentDown"
          size="small"
          code="PlatformMerchantProductBatchDispatch"
          @click="batchSentDown"
        >{{ $t('批量分发') }}</ody-button>
        <ody-button
          name="PlatformMerchantProductBatchDispatch_priceImport"
          size="small"
          code="PlatformProductPriceImport"
          @click="toPriceImport"
        >{{ $t('批量改价') }}</ody-button>
        <ody-button
          size="small"
          code="ui"
          @click="batchNameImport"
        >{{ $t('商品名导入') }}</ody-button>
        <el-popover placement="bottom" with="160" trigger="hover">
          <div class="btn-popover">
            <ody-button
              size="small"
              code="ui"
              @click="viewTask"
            >{{ $t('查看导出任务') }}</ody-button>
            <ody-button
              size="small"
              code="ui"
              @click="viewImportTask"
            >{{ $t('查看商品名导入任务') }}</ody-button>
          </div>
          <el-button slot="reference" size="small" class="btn-left">
            {{ $t('seeTask') }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-popover>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="table.checked"
          :can-filter="false"
          :multiple="true"
          :columns="table.columns"
          :operates="table.operates"
          :selectable="checkedSelectable"
          request-url="/back-product-web/back/mp/product/listPlatformProductInfoByPage.do"
          request-page-type="page"
        >
          <template slot="combineLine" slot-scope="scope">
            <div>
              <div class="table-product-name">
                <ody-left-right effect="positionLeft">
                  <div slot="left">
                    <div class="image-container">
                      <el-image
                        :src="scope.row.pictureUrl"
                        :fit="cover"
                        style="width: 100px; height: 100px"
                      >
                        <div
                          slot="error"
                          style="font-size: 30px;display: flex;align-items: center; justify-content: center;width: 100%; height: 100%; background: #f5f7fa; color: #909399;"
                        >
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                    </div>
                    <div class="name-container">
                      <div class="link-name">
                        <el-link type="primary">
                          <router-link
                            :to=" $portal.hasPermission('PlatformMerchantProductViewDetail') ? { name: 'ProductDetail', query: { id: scope.row.id, isView: true } }:{}"
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
                  <div slot="right" style="left: 310px;">
                    <ody-svg-icon
                      name="PlatformMerchantProductUpdateName"
                      icon-class="edit"
                      code="PlatformMerchantProductUpdateName"
                      @click.native="editName(scope.row)"
                    />
                  </div>
                </ody-left-right>
              </div>
            </div>
          </template>
          <template slot="combinePrice" slot-scope="scope">
            <el-row>
              <el-col :span="16">
                <div>
                  <div v-if="scope.row.salePriceWithTax">
                    <span>{{ scope.row.salePriceWithTax }}</span>
                  </div>
                  <div v-if="scope.row.minSalePriceWithTax && scope.row.maxSalePriceWithTax">
                    <span>{{ scope.row.minSalePriceWithTax }}</span>
                    <span>-</span>
                    <span>{{ scope.row.maxSalePriceWithTax }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  <ody-svg-icon
                    name="PlatformMerchantProductUpdatePrice"
                    icon-class="edit"
                    code="PlatformMerchantProductUpdatePrice"
                    @click.native="editPrice(scope.row)"
                  />
                </div>
              </el-col>
            </el-row>
          </template>
          <template slot="combineCode" slot-scope="scope">
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
        </ody-table>
      </div>
    </ody-list-table-area>
    <!-- 品牌模态框组件 --->
    <brand-modal-component :visible.sync="brandVisible" @ok="closeBrandModal" />
    <download-task
      :task-type="'platformProductExport'"
      :is-data-task="true"
      :visible.sync="downloadTaskVisible"
    />
    <download-import-task
      :task-type="'shopNameImport'"
      :is-data-task="true"
      :platform-type="1"
      :visible.sync="downloadImportTaskVisible"
    />
    <PlatformProductSentView
      :visible.sync="platformProductSentVisible"
      :platform-mp-id.sync="platformMpId"
    />
    <PlatformProductBatchSentDown
      :visible.sync="platformProductBatchSentDownVisible"
      :ids="ids"
      @ok="handleQuery"
    />
    <MerchantProductEditName
      :visible.sync="platformProductEditNameVisible"
      :id.sync="platformMpId"
      :name.sync="name"
      :data-type.sync="dataType"
      @ok="handleQuery"
    />
    <MerchantProductEditPrice
      :visible.sync="platformProductEditPriceVisible"
      :merchant-product-id.sync="platformMpId"
      :type-of-product.sync="typeOfProduct"
      :data-type.sync="dataType"
      @ok="handleQuery"
    />
    <MultiplyMerchantProductEditPrice
      :visible.sync="multiplyPlatformProductEditPriceVisible"
      :merchant-product-id.sync="platformMpId"
      :type-of-product.sync="typeOfProduct"
      :data-type.sync="dataType"
      @ok="handleQuery"
    />
    <SentTip :visible.sync="bacthSentTip" :type.sync="source" />
    <UploadFile v-if="dialogVisible" :dialog-visible.sync="dialogVisible" :data-type="1" @uploadSuccess="uploadSuccess"/>
  </section>
</template>

<script>
import DownloadImportTask from '@/components/downloadTask/ImportTask'
import DownloadTask from '@/components/downloadTask/index'
import PlatformProductSentView from '@/components/platformProductSentView'
import PlatformProductBatchSentDown from '@/components/platformProductBatchSentDown'
import BrandModalComponent from '@/components/brandModal'
import MerchantProductEditName from '@/components/merchantProductEditName'
import MerchantProductEditPrice from '@/components/merchantProductEditPrice'
import MultiplyMerchantProductEditPrice from '@/components/multiplyMerchantProductEditPrice'
import SentTip from '@/components/sentTip'
import UploadFile from '@/components/uploadName'
export default {
  name: 'PlatformMerchantProduct',
  components: {
    DownloadTask,
    PlatformProductSentView,
    PlatformProductBatchSentDown,
    BrandModalComponent,
    MerchantProductEditName,
    MerchantProductEditPrice,
    MultiplyMerchantProductEditPrice,
    SentTip,
    UploadFile,
    DownloadImportTask
  },
  data() {
    const self = this
    return {
      queryParam: {
        queryFlag: null,
        chineseName: null,
        code: null,
        type: null,
        brandName: null,
        brandId: null,
        categoryIds: null,
        typeOfProduct: null,
        supplierName: null
      },
      isAsync: false,
      platformMpId: null,
      name: null,
      typeOfProduct: null,
      dataType: null,
      categoryNameList: [],
      categoryTreeData: [],
      queryFlagList: [],
      productTypeList: [],
      typeOfProductList: [],
      brandVisible: false,
      downloadTaskVisible: false,
      platformProductSentVisible: false,
      platformProductBatchSentDownVisible: false,
      platformProductEditNameVisible: false,
      platformProductEditPriceVisible: false,
      multiplyPlatformProductEditPriceVisible: false,
      bacthSentTip: false,
      source: null,
      ids: [],
      table: {
        columns: [
          {
            show: true,
            tooltip: false,
            slot: 'combineLine',
            label: this.$t('商品名称'),
            minWidth: 350
          },
          {
            show: true,
            slot: 'combinePrice',
            label: this.$t('零售价'),
            align: 'left'
          },
          {
            show: true,
            slot: 'combineCode',
            align: 'left',
            label: this.$t('SPU编码/货号'),
            minWidth: 200
          },
          {
            show: true,
            prop: 'brandName',
            align: 'left',
            label: this.$t('商品品牌')
          },
          {
            show: true,
            prop: 'categoryFullNamePath',
            label: this.$t('商品类目'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            prop: 'supplierName',
            label: this.$t('供应商名称'),
            align: 'left',
            minWidth: 200
          }
        ],
        operates: {
          width: 140,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              disabled: false,
              method: (index, row) => {
                self.edit(row)
              },
              code: 'PlatformMerchantProductEdit'
            },
            {
              label: this.$t('复制'),
              disabled: false,
              method: (index, row) => {
                self.copy(row)
              },
              code: 'PlatformMerchantProductCopy'
            },
            {
              label: this.$t('查看分发'),
              disabled: false,
              method: (index, row) => {
                self.viewSentDown(row)
              },
              code: 'PlatformMerchantProductViewSentDown'
            }
          ]
        },
        checked: []
      },
      categorySearchKey: '',
      dialogVisible: false,
      downloadImportTaskVisible: false
    }
  },
  async mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      this.merchantApi = this.$product.$api.merchantApi
      await this.getQueryBackedRootCategory()
      await this.initCodes()
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  async activated() {
    await this.queryList()
  },
  methods: {
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    async handleQuery() {
      await this.queryList()
    },
    // 运营商品列表查询
    async queryList() {
      this.table.checked = []
      return this.$refs.table.getList({
        filters: this.formHasValue(this.queryParam, true)
      })
    },
    // 查询后台类目树根节点
    async queryBackedRootCategory({ searchQuery: name, callback }) {
      return this.mpApi.listBackCategoryTree({ name }).then(async(res) => {
        let newData = []
        if (res.data !== null) {
          newData = await this.remoteChildrenNull([res.data])
        }
        callback(null, newData)
      })
    },
    // 查询后台类目树根节点
    async getQueryBackedRootCategory() {
      return this.mpApi.listBackCategoryTree({ name: this.categorySearchKey }).then(async(res) => {
        let newData = []
        if (res.data !== null) {
          newData = await this.remoteChildrenNull([res.data])
        }

        this.categoryTreeData = newData
      })
    },
    remoteChildrenNull(data = []) {
      data.forEach(item => {
        if (item.children === null) {
          delete item.children
        } else {
          if (item.children && item.children.length) {
            item.children = this.remoteChildrenNull(item.children)
          } else {
            delete item.children
          }
        }
      })

      return data
    },
    treeOpen() {
      this.isAsync = true
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
    edit(row) {
      const name = 'ProductDetail'
      this.$router.push({
        name: name,
        params: { id: row.id },
        query: { id: row.id }
      })
    },
    copy(row) {
      this.$router.push({
        name: 'ProductDetail',
        query: { id: row.id, clone: true }
      })
    },
    viewSentDown(row) {
      this.platformMpId = row.id
      this.platformProductSentVisible = true
    },
    editName(row) {
      this.platformMpId = row.id
      this.name = row.chineseName
      this.dataType = row.dataType
      this.platformProductEditNameVisible = true
    },
    editPrice(row) {
      this.platformMpId = row.id
      this.typeOfProduct = row.typeOfProduct
      this.dataType = row.dataType
      if (this.typeOfProduct === 0 || this.typeOfProduct === 4) {
        this.platformProductEditPriceVisible = true
      } else {
        this.multiplyPlatformProductEditPriceVisible = true
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
      exportInfoParam.useTypeList = [0]
      exportInfoParam.dataType = 1
      this.mpApi
        .asyncEvent({
          dataTask: true,
          templateCode: 'platformProductExport',
          jsonTxt: JSON.stringify(exportInfoParam)
        })
        .then(res => {
          if (res.code === '0') {
            this.$message({
              showClose: true,
              message: this.$t('创建导出任务成功！'),
              type: 'info'
            })
            this.handleQuery()
          } else {
            this.$message({
              showClose: true,
              message: this.$t('创建导出任务失败！'),
              type: 'error'
            })
          }
        })
    },
    async batchSentDown() {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }
      const result = await this.mpApi.listPlatformDispatchByUserId()
      if (result && result.code === '0') {
        if (result.data === 0) {
          const ids = []
          if (this.table.checked && this.table.checked.length > 0) {
            for (let i = 0; i < this.table.checked.length; i++) {
              const item = this.table.checked[i]
              ids.push(item.id)
            }
          }
          if (ids.length === 0) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择要下发的商品信息')
            })
            return
          }
          this.ids = ids
          this.platformProductBatchSentDownVisible = true
        } else {
          this.bacthSentTip = true
          this.source = 1
        }
      }
    },
    toPriceImport() {
      this.$router.push({
        name: 'ImportPrice',
        query: {
          dataType: 1,
          taskType: 'platformPriceImport',
          checkMerchant: false
        }
      })
    },
    viewTask() {
      this.downloadTaskVisible = true
    },
    async initCodes() {
      const vue = this
      vue.$product.$api.common
        .listMultiCode({
          categorys: ['PRODUCT_CONDITION', 'PRODUCT_TYPE', 'TYPE_OF_PRODUCT']
        })
        .then(data => {
          if (data.code === '0') {
            vue.queryFlagList = data.data.PRODUCT_CONDITION
            vue.productTypeList = data.data.PRODUCT_TYPE
            vue.typeOfProductList = data.data.TYPE_OF_PRODUCT
          }
        })
    },
    // 重置
    reset() {
      this.queryParam = {
        queryFlag: null,
        chineseName: null,
        code: null,
        type: null,
        brandName: null,
        brandId: null,
        categoryIds: null,
        typeOfProduct: null,
        supplierName: null
      }
      this.table.checked = []
      this.categoryNameList = []
    },
    searchChange(searchQuery) {
      this.categorySearchKey = searchQuery
      this.getQueryBackedRootCategory()
    },
    // 商品名导入
    batchNameImport() {
      this.dialogVisible = true
    },
    viewImportTask() {
      this.downloadImportTaskVisible = true
    },
    // 上传成功
    uploadSuccess() {
      this.queryList()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-product-label {
  display: inline-block;
  background: #ef5351;
  line-height: 18px;
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
  // white-space: pre-wrap;
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
    display: inline-block;
    background: #ef5351;
    color: #ffffff;
    font-size: 12px;
    line-height: 16px;
  }
  .table-code-good-span {
    display: inline-block;
    background: #fec104;
    color: #ffffff;
    font-size: 12px;
    line-height: 16px;
  }
}
.popover-container {
  .popover-input {
    margin-bottom: 10px;
  }
}
// .btn-popover {
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   .el-button {
//     margin-bottom: 4px;
//   }
// }
.product-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  width: 100px;
  display: block;
}
.btn-popover{
  display: flex;
}
.btn-left{
  margin-left: 14px;
}
</style>
