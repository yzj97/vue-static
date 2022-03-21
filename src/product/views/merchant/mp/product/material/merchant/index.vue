<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('筛选') + ':'" prop="queryFlag">
            <el-select v-model="queryParam.queryFlag" name="queryParam_queryFlag" clearable>
              <el-option :label="$t('全部原料')" :value="1" />
              <el-option :label="$t('未分发')" :value="2" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('原料名称') + ':'" prop="chineseName">
            <el-input v-model="queryParam.chineseName" name="queryParam_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('原料编码') + ':'" prop="code">
            <el-input v-model="queryParam.code" name="queryParam_code" />
          </ody-search-item>
          <ody-search-item :label="$t('商品类型') + ':'" prop="type">
            <el-select
              v-model="queryParam.type"
              :placeholder="$t('common_choose_please')"
              name="queryParam_type"
              clearable
            >
              <el-option v-for="(v,k) in productTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('原料品牌') + ':'" prop="brandName">
            <el-input
              v-model="queryParam.brandName"
              :placeholder="$t('common_choose_please')"
              name="queryParam_brandName"
              readonly="true"
              @click.native="brandVisible = !brandVisible"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商家名称') + ':'" prop="merchantId">
            <ody-merchant-select v-model="queryParam.merchantId" name="queryParam_merchantId" value-key="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('商品来源') + ':'" prop="sourceType">
            <el-select
              v-model="queryParam.sourceType"
              :placeholder="$t('common_choose_please')"
              name="queryParam_sourceType"
              clearable
            >
              <el-option v-for="(v,k) in sourceTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button
          name="MerchantMaterialProductListQuery_handleQuery"
          size="small"
          type="primary"
          code="MerchantMaterialProductListQuery"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="MerchantMaterialProductBatchExport_batchExport"
          size="small"
          type="primary"
          code="MerchantMaterialProductBatchExport"
          @click="batchExport"
        >{{ $t('批量导出') }}</ody-button>
        <el-popover placement="bottom" width="160" trigger="hover">
          <div class="btn-popover">
            <el-button v-show="false" size="small" />
            <ody-button
              name="MerchantMaterialProductSubmit_batchSubmit"
              size="small"
              code="MerchantMaterialProductSubmit"
              class="btn-left"
              @click="batchSubmit()"
            >{{ $t('批量提交') }}</ody-button>
            <ody-button
              name="MerchantMaterialProductAudit_batchAudit"
              size="small"
              code="MerchantMaterialProductAudit"
              class="btn-left"
              @click="batchAudit()"
            >{{ $t('批量审核') }}</ody-button>
            <ody-button
              name="MerchantMaterialProductBatchDispatch_batchSent"
              size="small"
              code="MerchantMaterialProductBatchDispatch"
              class="btn-left"
              @click="batchSent"
            >{{ $t('快速分发到店铺') }}</ody-button>
          </div>
          <el-button slot="reference" :disabled="table.checked.length == 0" size="small" class="btn-left">
            {{ $t('批量操作') }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-popover>
        <ody-button
          name="MerchantMaterialProductViewExportList_viewTask"
          size="small"
          code="MerchantMaterialProductViewExportList"
          class="btn-left"
          @click="viewTask"
        >{{ $t('查看任务') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="onTabClick">
          <el-tab-pane v-for="(tab, index) in tabs" :label="tab.label" :key="index">
            <div
              slot="label"
            >{{ tab.label }} {{ tab.count !== undefined ? '(' + (tab.count || 0) + ')' : '' }}</div>
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
          request-url="/back-product-web/back/mp/product/listMaterialProductByPage.do"
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
                            :to="$portal.hasPermission('MerchantMaterialProductViewDetail') ? { name: 'ProductDetailMaterial', query: { id: scope.row.id, isView: true } }:{}"
                          >
                            <div class="name-text">{{ scope.row.chineseName }}</div>
                          </router-link>
                        </el-link>
                      </div>
                      <div class="table-product-label">{{ productTypeList[scope.row.type] }}</div>
                    </div>
                  </div>
                  <div slot="right" style="left: 310px;">
                    <span>
                      <el-popover placement="bottom" trigger="click">
                        <div class="popover-container">
                          <div class="popover-input">
                            <el-input v-model="chineseNameVal" name="chineseNameVal" maxlength="60" />
                          </div>
                          <div class="popover-button">
                            <el-button name="canclePopover" size="small" @click="canclePopover()">{{ $t('取消') }}</el-button>
                            <ody-button
                              name="MerchantMaterialProductUpdateName_savaChineseName"
                              size="small"
                              type="primary"
                              code="MerchantMaterialProductUpdateName"
                              @click="savaChineseName(scope.row)"
                            >{{ $t('确认') }}</ody-button>
                          </div>
                        </div>
                        <i
                          slot="reference"
                          name="changeChineseName"
                          class="el-icon-edit el-icon"
                          @click="changeChineseName(scope.row)"
                        />
                      </el-popover>
                    </span>
                  </div>
                </ody-left-right>
              </div>
            </div>
          </template>
          <template slot="combineCode" slot-scope="scope">
            <div class="table-code">
              <div class="table-code-merchant">
                <span class="table-code-merchant-span">{{ $t('编') }}</span>
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
                  class="table-code-green-span"
                >{{ scope.row.warehouseTypeStr }}</span>
                <span
                  v-if="scope.row.warehouseType === 1"
                  class="table-code-blue-span"
                >{{ scope.row.warehouseTypeStr }}</span>
                <span>{{ scope.row.stockNum }}</span>
              </div>
            </div>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <download-task :is-data-task="true" :task-type="'materialProductExport'" :visible.sync="downloadTaskVisible" />
    <ProductListDialog :visible.sync="batchVisible" :ids.sync="ids" @ok="handleQuery" />
    <MerchantProductSentView :mp-id.sync="mpId" :visible.sync="merchantMaterialProductSentVisible" />
    <ProductListDialogSent
      :visible.sync="batchSentDownVisible"
      :ids.sync="ids"
      :sent-type="1"
      :merchant-id.sync="merchantId"
      @ok="handleQuery"
    />
    <SentTip :visible.sync="bacthSentTip" :type.sync="type" />
    <brand-modal-component :visible.sync="brandVisible" @ok="closeBrandModal" />
  </section>
</template>

<script>
import DownloadTask from '@/components/downloadTask/index'
import ProductListDialog from '@/components/product-list-dialog'
import ProductListDialogSent from '@/components/product-list-dialog-sent'
import commonConstant from '@/constant/comConstant.js'
import MerchantProductSentView from '@/components/merchantProductSentView'
import SentTip from '@/components/sentTip'
import BrandModalComponent from '@/components/brandModal'
export default {
  components: {
    DownloadTask,
    ProductListDialog,
    ProductListDialogSent,
    MerchantProductSentView,
    SentTip,
    BrandModalComponent
  },
  data() {
    const self = this
    return {
      brandVisible: false,
      checked: [],
      productTypeList: [],
      sourceTypeList: [],
      brandList: [],
      batchType: 1,
      batchStatusType: 1,
      activeState: '0',
      batchVisible: false,
      platformMpId: null,
      downloadTaskVisible: false,
      merchantMaterialProductSentVisible: false,
      batchSentDownVisible: false,
      queryParam: getDefaultQueryParam(),
      loading: false,
      chineseNameVal: '',
      salePriceVal: '',
      list: [],
      tabs: [],
      currentTab: {},
      editNameForm: {
        id: null,
        chineseName: null
      },
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 10
      },
      bacthSentTip: false,
      type: null,
      table: {
        columns: [
          {
            show: true,
            slot: 'combineLine',
            label: this.$t('原料名称'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            slot: 'combineCode',
            label: this.$t('原料编码/货号'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            slot: 'stockNum',
            label: this.$t('总库存'),
            align: 'left'
          },
          {
            show: true,
            prop: 'brandName',
            label: this.$t('原料品牌'),
            align: 'left'
          },
          {
            show: true,
            prop: 'statusStr',
            label: this.$t('审核状态'),
            align: 'left',
            render: (h, params) => {
              if (params.row.status === 3) {
                var self = this
                return (
                  <span>
                    <sapn style={'color:red'}>{params.row.statusStr}</sapn>
                    <el-tooltip effect={'dark'} placement={'top'}>
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
            prop: 'merchantName',
            label: this.$t('merchant_name'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            prop: 'sourceTypeStr',
            label: this.$t('商品来源'),
            align: 'left'
          }
        ],
        operates: {
          width: 200,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              disabled: false,
              method: (index, row) => {
                self.edit(row)
              },
              code: 'MerchantMaterialProductEdit'
            },
            {
              label: this.$t('复制'),
              disabled: false,
              method: (index, row) => {
                self.copy(row)
              },
              code: 'MerchantMaterialProductCopy'
            },
            {
              label: this.$t('提交'),
              disabled: false,
              hidden: (index, row) => {
                if (row.status === 0 || row.status === 3) {
                  return false
                } else {
                  return true
                }
              },
              method: (index, row) => {
                self.submit(row)
              },
              code: 'MerchantMaterialProductSubmit'
            },
            {
              label: this.$t('撤销提交'),
              disabled: false,
              hidden: (index, row) => {
                return row.status !== 1
              },
              method: (index, row) => {
                self.cancelSubmit(row)
              },
              code: 'MerchantMaterialProductCancelSubmit'
            },
            {
              label: this.$t('审核'),
              disabled: false,
              hidden: (index, row) => {
                return row.status !== 1
              },
              method: (index, row) => {
                self.audit(row)
              },
              code: 'MerchantMaterialProductAudit'
            },
            {
              label: this.$t('查看分发'),
              disabled: false,
              method: (index, row) => {
                self.viewSentDown(row)
              },
              code: 'MerchantMaterialProductViewSentDown'
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
      this.loading = true
      this.initCodes()
      await this.queryList()
      this.queryCount()
      // this.initBrand()
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    initCodes() {
      const vue = this
      vue.$product.$api.common
        .listMultiCode({
          categorys: ['PRODUCT_TYPE', 'SOURCE_TYPE', 'APPROVAL_STATUS']
        })
        .then(data => {
          if (data.code === '0') {
            vue.productTypeList = data.data.PRODUCT_TYPE
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
    initBrand() {
      this.$api.brand
        .listBrand({ currentPage: 1, itemsPerPage: 2000 })
        .then(res => {
          this.brandList = res.data.listObj
        })
    },
    closeBrandModal(selectVal) {
      this.queryParam.brandId = selectVal.id
      this.queryParam.brandName = selectVal.name
    },
    async handleQuery() {
      this.page.currentPage = 1
      await this.queryList()
      this.queryCount()
    },
    // 运营原料商品列表查询
    async queryList(obj) {
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
      params.status = null
      const filters = {
        filters: params
      }
      const {
        data
      } = await this.$product.$api.mpApi.countMaterialProductStatus(filters)
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
    // 查看
    check(e) {
      this.$router.push({
        path:
          commonConstant.BASE_REQUEST_URL +
          '/merchant/mp/merchantProductManage/edit',
        query: {
          id: e.id,
          check: false
        }
      })
    },
    // 编辑
    edit(row) {
      const name = 'ProductDetailMaterial'
      this.$router.push({
        name: name,
        params: { id: row.id },
        query: { id: row.id }
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
    // 复制
    copy(row) {
      this.$router.push({
        name: 'ProductDetailMaterial',
        query: { id: row.id, clone: true }
      })
    },
    // 查看分发
    viewSentDown(row) {
      this.mpId = row.id
      this.merchantMaterialProductSentVisible = true
    },
    // 重置
    reset() {
      this.queryParam = getDefaultQueryParam()
    },
    // 对名称赋值
    changeChineseName(row) {
      this.chineseNameVal = row.chineseName
    },
    canclePopover() {
      document.body.click()
    },
    savaChineseName(row) {
      row.chineseName = this.chineseNameVal
      this.editNameForm.id = row.id
      this.editNameForm.chineseName = this.chineseNameVal
      this.$product.$api.mpApi
        .updatePlatformMpNameById(this.editNameForm)
        .then(result => {
          if (result && result.code === '0') {
            this.editNameForm.id = null
            this.editNameForm.chineseName = null
          }
        })
      document.body.click()
    },
    async submit(row) {
      if (!(row.status === 0 || row.status === 3)) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择待提交的商品')
        })
        return
      }
      const mpIdList = []
      mpIdList.push(row.id)
      const confirm = await this.$confirm(
        this.$t('确认提交商品？'),
        this.$t('提示')
      )
      if (confirm) {
        const submitParams = {}
        submitParams.mpIdList = mpIdList
        submitParams.status = 1
        submitParams.useType = 1
        const result = await this.mpApi.submitMerchantProduct(submitParams)
        if (result && result.code === '0') {
          this.handleQuery()
        }
      }
    },
    async cancelSubmit(row) {
      if (row.status !== 1) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择待审核的商品')
        })
        return
      }
      const mpIdList = []
      mpIdList.push(row.id)
      const confirm = await this.$confirm(
        this.$t('确认撤销提交商品？'),
        this.$t('提示')
      )
      if (confirm) {
        const submitParams = {}
        submitParams.mpIdList = mpIdList
        submitParams.status = 0
        const result = await this.mpApi.cancelSubmitMerchantProduct(
          submitParams
        )
        if (result && result.code === '0') {
          this.handleQuery()
        }
      }
    },
    audit(row) {
      if (row.status !== 1) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择待审核的商品')
        })
        return
      }
      const mpIdList = []
      mpIdList.push(row.id)
      this.ids = mpIdList
      this.batchVisible = true
    },
    // 批量提交
    async batchSubmit() {
      if (this.table.checked.length === 0) {
        return this.$message('请至少选择一个商品')
      }
      const ids = []
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          if (item.status === 0 || item.status === 3) {
            ids.push(item.id)
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('请选择待提交的商品')
            })
            return
          }
        }
      }
      const confirm = await this.$confirm('确认提交商品？', '提示')
      if (confirm) {
        const submitParams = {}
        submitParams.mpIdList = ids
        submitParams.status = 1
        const result = await this.mpApi.submitMerchantProduct(submitParams)
        if (result && result.code === '0') {
          this.handleQuery()
        }
      }
    },
    // 批量审核
    batchAudit() {
      if (this.table.checked.length === 0) {
        return this.$message('请至少选择一个商品')
      }
      const ids = []
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          if (item.status === 1) {
            ids.push(item.id)
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('请选择审核中的商品')
            })
            return
          }
        }
      }
      this.ids = ids
      this.batchVisible = true
    },
    async batchSent() {
      if (this.table.checked.length === 0) {
        return this.$message('请至少选择一个商品')
      }

      const result = await this.mpApi.listMerchantDispatchByUserId()
      if (result && result.code === '0') {
        if (result.data === 0) {
          if (this.table.checked === 0) {
            return this.$message('请至少选择一个商品')
          }
          const ids = []
          const merchantIds = []
          let merchantId = null
          if (this.table.checked && this.table.checked.length > 0) {
            for (let i = 0; i < this.table.checked.length; i++) {
              const item = this.table.checked[i]
              if (i === 0) {
                merchantId = item.merchantId
                merchantIds.push(item.merchantId)
                ids.push(item.id)
              } else {
                if (merchantId !== item.merchantId) {
                  return this.$message(this.$t('请选择相同商家的商品'))
                }
              }
            }
          }
          this.merchantId = merchantId
          this.ids = ids
          this.batchSentDownVisible = true
        } else {
          this.bacthSentTip = true
          this.type = 2
        }
      }
    },
    viewTask() {
      this.downloadTaskVisible = true
    },
    // 批量导出
    batchExport() {
      const ids = []
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          ids.push(item.id)
        }
      }
      const params = this.$portal.deepClone(this.queryParam)
      params.idList = ids
      this.mpApi
        .asyncEvent({
          templateCode: 'materialProductExport',
          jsonTxt: JSON.stringify(params),
          dataTask: true,
          fileName: '商家原料管理导出.xlsx'
        })
        .then(res => {
          this.$confirm(
            this.$t('导出任务创建成功') + this.$t('，点击确认跳转到任务列表'),
            this.$t('导出提示'),
            {
              confirmButtonText: this.$t('确认'),
              cancelButtonText: this.$t('取消'),
              type: 'info'
            }
          ).then(() => {
            this.downloadTaskVisible = true
          })
        })
    }
  }
}

function getDefaultQueryParam() {
  return Object.assign(
    {},
    {
      queryFlag: '',
      chineseName: '',
      code: '',
      type: '',
      dataType: 2,
      merchantId: '',
      sourceType: '',
      status: ''
    }
  )
}
</script>

<style lang="scss" scoped>
.table-product-label {
  display: inline-block;
  background: #ff1818;
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
    background: #f56c6c;
    color: white;
    font-size: 12px;
  }
  .table-code-goods-span {
    background: #586348;
    color: #eef5f9;
    font-size: 12px;
  }
  .table-code-good-span {
    background: #ee9900;
    color: #ffffff;
    font-size: 12px;
  }
  .table-code-blue-span {
    background: dodgerblue;
    color: #ffffff;
    font-size: 12px;
  }
  .table-code-green-span {
    background: limegreen;
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
.btn-left{
  margin-left: 16px;
}
</style>
