<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" class="form">
          <ody-search-item :label="$t('筛选') + ':'" prop="queryFlag">
            <el-select
              v-model="queryParam.queryFlag"
              :placeholder="$t('common_all')"
              name="queryParam_queryFlag "
            >
              <el-option
                v-for="(v, k) in queryFlagList"
                :label="v"
                :key="k"
                :value="k"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品名称') + ':'" prop="chineseName">
            <el-input
              v-model="queryParam.chineseName"
              :placeholder="$t('请输入商品名称')"
              name="queryParam_chineseName"
              maxlength="100"
            />
          </ody-search-item>
          <ody-search-item :label="$t('SPU编码') + ':'" prop="code">
            <el-input
              v-model="queryParam.code"
              :placeholder="$t('请输入SPU编码')"
              name="queryParam_code"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品类型') + ':'" prop="type">
            <el-select
              v-model="queryParam.type"
              :placeholder="$t('common_all')"
              name="queryParam_type"
            >
              <el-option
                v-for="(v, k) in productTypeList"
                :label="v"
                :key="k"
                :value="k"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品品牌') + ':'" prop="brandId">
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
            /> -->
          </ody-search-item>
          <ody-search-item :label="$t('商品类目') + ':'" prop="categoryIds">
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
              no-results-text="未查询出结果"
              no-options-text="没有可用的选项"
              search-prompt-text="请搜索你想选择的商品类目"
              open-on-focus
              name="queryParam_categoryIds"
              value-consists-of="LEAF_PRIORITY"
              @open="treeOpen"
              @search-change="searchChange"
            />
          </ody-search-item>
          <ody-search-item :label="$t('销售状态') + ':'" prop="canSale">
            <el-select
              v-model="queryParam.canSale"
              :placeholder="$t('common_all')"
              name="queryParam_canSale"
            >
              <el-option
                v-for="(value, key) in canSaleList"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品形式') + ':'" prop="typeOfProduct">
            <el-select
              v-model="queryParam.typeOfProduct"
              :placeholder="$t('common_all')"
              name="queryParam_typeOfProduct"
            >
              <el-option
                v-for="(v, k) in typeOfProductList"
                :label="v"
                :key="k"
                :value="k"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('merchant_name') + ':'" prop="merchantId">
            <ody-merchant-select
              v-model="queryParam.merchantId"
              name="queryParam_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品来源') + ':'" prop="sourceType">
            <el-select
              v-model="queryParam.sourceType"
              :placeholder="$t('common_all')"
              name="queryParam_sourceType"
            >
              <el-option
                v-for="(v, k) in sourceTypeList"
                :label="v"
                :key="k"
                :value="k"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品履约方式') + ':'" prop="warehouseType">
            <el-select
              v-model="queryParam.warehouseType"
              :placeholder="$t('common_all')"
              name="queryParam_warehouseType"
              clearable
            >
              <el-option
                v-for="(v, k) in warehouseTypeList"
                :label="v"
                :key="k"
                :value="k"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item
            :label="$t('第三方商品编码') + ':'"
            prop="thirdMerchantProductCode"
          >
            <el-input
              v-model="queryParam.thirdMerchantProductCode"
              :placeholder="$t('请输入第三方商品编码')"
              name="queryParam_thirdMerchantProductCode"
              maxlength="50"
            />
          </ody-search-item>
          <ody-search-item :label="$t('供应商名称') + ':'" prop="supplierName">
            <el-input
              v-model="queryParam.supplierName"
              :placeholder="$t('请输入供应商名称')"
              name="queryParam_supplierName"
              maxlength="100"
            />
          </ody-search-item>
          <ody-search-item
            :label="$t('是否内部供应商') + ':'"
            prop="isInnerSupplier"
          >
            <el-select
              v-model="queryParam.isInnerSupplier"
              :placeholder="$t('common_all')"
              name="queryParam_isInnerSupplier"
              clearable
            >
              <el-option
                v-for="(v, k) in isInnerSupplierList"
                :label="v"
                :key="k"
                :value="k"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{
          $t('重置')
        }}</el-button>
        <ody-button
          name="MerchantProductManageListQuery_handleQuery"
          size="small"
          type="primary"
          code="MerchantProductManageListQuery"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="MerchantProductManageBatchExport_batchExport"
          size="small"
          type="primary"
          code="MerchantProductManageBatchExport"
          @click="batchExport"
        >{{ $t('批量导出') }}</ody-button
        >
        <el-popover placement="bottom" width="160" trigger="hover">
          <div class="btn-popover">
            <el-button v-show="false" size="small" />
            <ody-button
              name="MerchantProductManageSubmit_batchSubmit"
              size="small"
              code="MerchantProductManageSubmit"
              class="btn-left"
              @click="batchSubmit()"
            >{{ $t('批量提交') }}</ody-button
            >
            <ody-button
              name="MerchantProductManageAudit_batchAudit"
              size="small"
              code="MerchantProductManageAudit"
              class="btn-left"
              @click="batchAudit()"
            >{{ $t('批量审核') }}</ody-button
            >
            <ody-button
              name="MerchantProductManageCanSale_batchCansale"
              size="small"
              code="MerchantProductManageCanSale"
              class="btn-left"
              @click="batchCansale(0)"
            >{{ $t('批量允许销售') }}</ody-button
            >
            <ody-button
              name="MerchantProductManageCanNotSale_batchNotCansale"
              size="small"
              code="MerchantProductManageCanNotSale"
              class="btn-left"
              @click="batchNotCansale(1)"
            >{{ $t('批量不可销售') }}</ody-button
            >
            <ody-button
              name="MerchantProductManageBatchDispatch_batchSent"
              size="small"
              code="MerchantProductManageBatchDispatch"
              class="btn-left"
              @click="batchSent()"
            >{{ $t('批量分发店铺商品') }}</ody-button
            >
            <ody-button
              name="MerchantProductManageStoreMpShelf_batchStatus"
              size="small"
              code="MerchantProductManageStoreMpShelf"
              class="btn-left"
              @click="batchStatus(1)"
            >{{ $t('批量上架店铺商品') }}</ody-button
            >
            <ody-button
              name="MerchantProductManageStoreMpDown_batchStatus"
              size="small"
              code="MerchantProductManageStoreMpDown"
              class="btn-left"
              @click="batchStatus(0)"
            >{{ $t('批量下架店铺商品') }}</ody-button
            >
            <ody-button
              name="MerchantProductManage_priceImport"
              size="small"
              code="MerchantProductPriceImport"
              class="btn-left"
              @click="toPriceImport"
            >{{ $t('批量改价') }}</ody-button
            >
          </div>
          <el-button slot="reference" size="small" class="btn-left">
            {{ $t('批量操作') }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-popover>
        <ody-button
          size="small"
          code="ui"
          class="btn-left"
          @click="batchNameImport"
        >{{ $t('商品名导入') }}</ody-button>
        <el-popover placement="bottom" with="160" trigger="hover">
          <div class="btn-popover">
            <el-button
              name="MerchantProductManageViewExportList_viewTask"
              size="small"
              code="MerchantProductManageViewExportList"
              class="btn-left"
              @click="viewTask"
            >{{ $t('查看导出任务') }}</el-button>
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
      <div slot="tabs">
        <el-tabs
          v-model="activeState"
          name="activeState"
          @tab-click="onTabClick"
        >
          <el-tab-pane
            v-for="(tab, index) in tabs"
            :label="tab.label"
            :key="index"
          >
            <div slot="label">
              {{ tab.label }}
              {{ tab.count !== undefined ? '(' + (tab.count || 0) + ')' : '' }}
            </div>
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
          :can-filter="false"
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
                            :to="
                              $portal.hasPermission(
                                'MerchantProductManageViewDetail'
                              )
                                ? {
                                  name: 'ProductDetail',
                                  query: { id: scope.row.id, isView: true }
                                }
                                : {}
                            "
                          >
                            <el-tooltip placement="top">
                              <template slot="content">
                                <div>{{ scope.row.chineseName }}</div>
                              </template>
                              <div class="name-text">
                                {{ scope.row.chineseName }}
                              </div>
                            </el-tooltip>
                          </router-link>
                        </el-link>
                      </div>
                      <div class="table-product-label">
                        {{ scope.row.typeStr }}
                      </div>
                    </div>
                  </div>
                  <div slot="right" style="left: 310px;">
                    <ody-svg-icon
                      v-if="scope.row.sourceType === 2"
                      name="MerchantProductManageUpdateName"
                      icon-class="edit"
                      code="MerchantProductManageUpdateName"
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
                  <div
                    v-if="
                      scope.row.minSalePriceWithTax &&
                        scope.row.maxSalePriceWithTax
                    "
                  >
                    <span>{{ scope.row.minSalePriceWithTax }}</span>
                    <span>-</span>
                    <span>{{ scope.row.maxSalePriceWithTax }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  <ody-svg-icon
                    v-if="scope.row.sourceType === 2"
                    name="MerchantProductManageUpdatePrice"
                    icon-class="edit"
                    code="MerchantProductManageUpdatePrice"
                    @click.native="editPrice(scope.row)"
                  />
                </div>
              </el-col>
            </el-row>
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
                  class="table-warehouse-good-span"
                >{{ scope.row.warehouseTypeStr }}</span
                >
                <span
                  v-if="scope.row.warehouseType === 1"
                  class="table-nowarehouse-good-span"
                >{{ scope.row.warehouseTypeStr }}</span
                >
                <span>{{ scope.row.stockNum }}</span>
              </div>
            </div>
          </template>
          <template slot="labelStock" slot-scope="scope" :scope="scope">
            <span>{{ $t('总库存') }}</span>
            <i
              :class="
                sortStockFlag === 1
                  ? 'el-icon-sort-down'
                  : sortStockFlag === 2
                    ? 'el-icon-sort-up'
                    : 'el-icon-sort'
              "
              name="sortStock"
              @click="sortStock"
            />
          </template>
          <template slot="canSale" slot-scope="scope">
            <div>
              <el-switch
                :disabled="
                  !$portal.hasPermission('MerchantProductManageColumnCanSale')
                "
                :value="scope.row.canSale === 1"
                :active-text="scope.row.canSale === 1 ? $t('是') : $t('否')"
                @change="changeCanSale($event, scope.row)"
              />
            </div>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <download-task
      :task-type="'merchantProductExport'"
      :is-data-task="true"
      :visible.sync="downloadTaskVisible"
    />
    <download-import-task
      :task-type="'shopNameImport'"
      :is-data-task="true"
      :platform-type="2"
      :visible.sync="downloadImportTaskVisible"
    />
    <!-- 品牌模态框组件 --->
    <brand-modal-component :visible.sync="brandVisible" @ok="closeBrandModal" />
    <ProductListDialog
      :visible.sync="batchVisible"
      :ids.sync="ids"
      @ok="handleQuery"
    />
    <ProductListDialogStatus
      :visible.sync="batchStatusVisible"
      :type.sync="batchStatusType"
      :ids.sync="ids"
      @ok="handleQuery"
    />
    <ProductListDialogSent
      :visible.sync="batchSentDownVisible"
      :ids.sync="ids"
      :merchant-id.sync="merchantId"
      @ok="handleQuery"
    />
    <MerchantProductEditName
      :visible.sync="merchantProductEditNameVisible"
      :id.sync="mpId"
      :name.sync="name"
      :data-type.sync="dataType"
      @ok="handleQuery"
    />
    <MerchantProductEditPrice
      :visible.sync="merchantProductEditPriceVisible"
      :merchant-product-id.sync="mpId"
      :type-of-product.sync="typeOfProduct"
      :data-type.sync="dataType"
      @ok="handleQuery"
    />
    <MultiplyMerchantProductEditPrice
      :visible.sync="multiplyMerchantProductEditPriceVisible"
      :merchant-product-id.sync="mpId"
      :type-of-product.sync="typeOfProduct"
      :data-type.sync="dataType"
      @ok="handleQuery"
    />
    <MerchantProductSentView
      :visible.sync="merchantProductSentVisible"
      :mp-id.sync="mpId"
    />
    <SentTip :visible.sync="bacthSentTip" :type.sync="type" />
    <UploadFile v-if="dialogVisible" :dialog-visible.sync="dialogVisible" :data-type="2" @uploadSuccess="uploadSuccess"/>
  </section>
</template>

<script>
import DownloadImportTask from '@/components/downloadTask/ImportTask'
import DownloadTask from '@/components/downloadTask/index'
import BrandModalComponent from '@/components/brandModal'
import ProductListDialog from '@/components/product-list-dialog'
import ProductListDialogStatus from '@/components/product-list-dialog-status'
import ProductListDialogSent from '@/components/product-list-dialog-sent'
import MerchantProductEditName from '@/components/merchantProductEditName'
import MerchantProductEditPrice from '@/components/merchantProductEditPrice'
import MultiplyMerchantProductEditPrice from '@/components/multiplyMerchantProductEditPrice'
import MerchantProductSentView from '@/components/merchantProductSentView'
import SentTip from '@/components/sentTip'
import UploadFile from '@/components/uploadName'
export default {
  name: 'MerchantProductManage',
  components: {
    DownloadTask,
    BrandModalComponent,
    ProductListDialog,
    ProductListDialogStatus,
    ProductListDialogSent,
    MerchantProductEditName,
    MerchantProductEditPrice,
    MultiplyMerchantProductEditPrice,
    MerchantProductSentView,
    SentTip,
    UploadFile,
    DownloadImportTask
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
      warehouseTypeList: [],
      ids: [],
      isInnerSupplierList: [],
      batchVisible: false,
      isAsync: false,
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
      bacthSentTip: false,
      type: null,
      table: {
        columns: [
          {
            show: true,
            slot: 'chineseName',
            tooltip: false,
            label: this.$t('商品名称'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            slot: 'combinePrice',
            label: this.$t('零售价'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            slot: 'code',
            label: this.$t('SPU编码/货号'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            slot: 'stockNum',
            label: this.$t('总库存'),
            align: 'left',
            labelSlot: 'labelStock'
          },
          {
            show: true,
            prop: 'brandName',
            label: this.$t('商品品牌'),
            align: 'left'
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
            prop: 'statusStr',
            label: this.$t('审核状态'),
            align: 'center',
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
            slot: 'canSale',
            label: this.$t('是否允许销售'),
            align: 'center',
            minWidth: 200
          },
          {
            show: true,
            prop: 'merchantName',
            label: this.$t('商家名称'),
            align: 'center',
            minWidth: 200
          },
          {
            show: true,
            prop: 'sourceTypeStr',
            label: this.$t('商品来源'),
            align: 'center'
          },
          {
            show: true,
            prop: 'thirdMerchantProductCode',
            label: this.$t('第三方商品编码'),
            align: 'center',
            minWidth: 200
          },
          {
            show: true,
            prop: 'supplierName',
            label: this.$t('供应商名称'),
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
              hidden: (index, row) => {
                return row.sourceType === 1
              },
              method: (index, row) => {
                self.edit(row)
              },
              code: 'MerchantProductManageEdit'
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
              code: 'MerchantProductManageSubmit'
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
              code: 'MerchantProductManageCancelSubmit'
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
              code: 'MerchantProductManageAudit'
            },
            {
              label: this.$t('查看分发'),
              disabled: false,
              hidden: (index, row) => {
                if (row.status === 2) {
                  return false
                } else {
                  return true
                }
              },
              method: (index, row) => {
                self.viewSentDown(row)
              },
              code: 'MerchantProductManageViewSentDown'
            },
            {
              label: this.$t('复制'),
              disabled: false,
              method: (index, row) => {
                self.copy(row)
              },
              code: 'MerchantProductManageCopy'
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
      this.tabs = [
        {
          label: this.$t('全部')
        }
      ]
      this.currentTab = this.tabs[0]
      await this.getQueryBackedRootCategory()
      await this.initCodes()
      await this.queryList()
      this.queryCount()
    } catch (e) {
      console.log(e)
    }
  },
  async activated() {
    await this.queryList()
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
            'APPROVAL_STATUS',
            'WAREHOUSE_TYPE',
            'IS_AVAILABLE'
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
            vue.warehouseTypeList = data.data.WAREHOUSE_TYPE
            vue.isInnerSupplierList = data.data.IS_AVAILABLE
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
      return this.$refs.table.getList({
        filters: this.formHasValue(this.queryParam, false)
      })
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    // // 查询后台类目树根节点
    // async queryBackedRootCategory() {
    //   return this.mpApi.listBackCategoryTree({}).then(res => {
    //     this.categoryTreeData = [res.data]
    //   })
    // },
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
    onTabClick() {
      for (var i = 0; i < this.tabs.length; i++) {
        if (i.toString() === this.activeState) {
          this.currentTab = this.tabs[i]
          break
        }
      }
      this.queryList()
    },
    async queryCount() {
      const params = this.formHasValue(this.queryParam, false)

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
    async submit(row) {
      if (!(row.status === 0 || row.status === 3)) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择待提交或审核拒绝的商品')
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
    viewTask() {
      this.downloadTaskVisible = true
    },
    viewSentDown(row) {
      this.mpId = row.id
      this.merchantProductSentVisible = true
    },
    editName(row) {
      if (row.sourceType === 2) {
        this.mpId = row.id
        this.name = row.chineseName
        this.dataType = row.dataType
        this.merchantProductEditNameVisible = true
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('请选择商家创建的商品')
        })
      }
    },
    editPrice(row) {
      if (row.sourceType === 2) {
        this.mpId = row.id
        this.typeOfProduct = row.typeOfProduct
        this.dataType = row.dataType
        console.info(this.typeOfProduct)
        if (this.typeOfProduct === 0 || this.typeOfProduct === 4) {
          this.merchantProductEditPriceVisible = true
        } else {
          this.multiplyMerchantProductEditPriceVisible = true
        }
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('请选择商家创建的商品')
        })
      }
    },
    async batchSubmit() {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
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
              message: this.$t('请选择待提交或审核拒绝的商品')
            })
            return
          }
        }
      }
      const confirm = await this.$confirm(
        this.$t('确认提交商品？'),
        this.$t('提示')
      )
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
    async changeCanSale(e, row) {
      const submitParams = {}
      submitParams.mpIdList = []
      submitParams.mpIdList.push(row.id)
      submitParams.canSale = row.canSale === 0 ? 1 : 0
      const result = await this.mpApi.merchantProductCanSale(submitParams)
      if (result && result.code === '0') {
        this.handleQuery()
      }
    },
    async batchCansale(status) {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }

      const ids = []
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          ids.push(item.id)
        }
      }
      const confirm = await this.$confirm(
        this.$t('确认允许商品可售？'),
        this.$t('提示')
      )
      if (confirm) {
        const submitParams = {}
        submitParams.mpIdList = ids
        submitParams.canSale = 1
        const result = await this.mpApi.merchantProductCanSale(submitParams)
        if (result && result.code === '0') {
          this.handleQuery()
        }
      }
    },
    async batchNotCansale() {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }

      const ids = []
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          ids.push(item.id)
        }
      }
      const confirm = await this.$confirm(
        this.$t('确认允许商品不可售？'),
        this.$t('提示')
      )
      if (confirm) {
        const submitParams = {}
        submitParams.mpIdList = ids
        submitParams.canSale = 0
        const result = await this.mpApi.merchantProductCanSale(submitParams)
        if (result && result.code === '0') {
          this.handleQuery()
        }
      }
    },
    batchAudit() {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
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
    batchStatus(type) {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }
      const ids = []
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          ids.push(item.id)
        }
      }
      this.ids = ids
      this.batchStatusVisible = true
      this.batchStatusType = type
    },
    async batchSent() {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }
      try {
        const result = await this.mpApi.listMerchantDispatchByUserId()
        if (result) {
          if (result.data === 0) {
            const ids = []
            let merchantId = null
            if (this.table.checked && this.table.checked.length > 0) {
              for (let i = 0; i < this.table.checked.length; i++) {
                const item = this.table.checked[i]
                if (item.status !== 2) {
                  return this.$message(this.$t('请选择审核通过的商品'))
                }
                if (i === 0) {
                  merchantId = item.merchantId
                  ids.push(item.id)
                } else {
                  if (merchantId !== item.merchantId) {
                    return this.$message(this.$t('请选择相同商家的商品'))
                  } else {
                    ids.push(item.id)
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
      } catch (e) {
        console.info(e)
      }
    },
    toPriceImport() {
      this.$router.push({
        name: 'ImportPrice',
        query: {
          dataType: 2,
          taskType: 'merchantPriceImport',
          checkMerchant: true
        }
      })
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
          jsonTxt: JSON.stringify(
            exportInfoParam
            //   {
            //   currentPage: 1,
            //   itemsPerPage: 1000,
            //   idList: ids,
            //   useTypeList: [0],
            //   dataType: 2
            // }
          )
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

function getDefaultQueryParam() {
  return Object.assign(
    {},
    {
      queryFlag: null,
      chineseName: null,
      code: null,
      type: null,
      brandName: null,
      brandId: null,
      typeOfProduct: null,
      categoryIds: [],
      merchantId: null,
      canSale: null,
      sourceType: null,
      status: null,
      warehouseType: null,
      thirdMerchantProductCode: null,
      supplierName: null,
      isInnerSupplier: null
    }
  )
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
    line-height: 16px;
    color: #ffffff;
    font-size: 12px;
  }
  .table-code-good-span {
    display: inline-block;
    background: #fec104;
    line-height: 16px;
    color: #ffffff;
    font-size: 12px;
  }
  .table-code-red-span {
    background: #ff0000;
    color: #ffffff;
    font-size: 12px;
  }
  .table-warehouse-good-span {
    display: inline-block;
    background: #02c292;
    color: #ffffff;
    font-size: 12px;
    line-height: 16px;
  }
  .table-nowarehouse-good-span {
    display: inline-block;
    background: #1890ff;
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
