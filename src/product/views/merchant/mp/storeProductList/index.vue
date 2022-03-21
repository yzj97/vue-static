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
          <ody-search-item :label="$t('merchant_name')+ ':'" prop="merchantId">
            <ody-merchant-select
              v-model="queryParam.merchantId"
              name="queryParam_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <ody-search-item :label="this.$t('店铺')+ ':'" prop="storeId">
            <ody-store-select
              :key="queryParam.merchantId"
              v-model="queryParam.storeId"
              :placeholder="$t('全部')"
              :item-filter="itemFilter"
              name="queryParam_storeId"
              value-key="storeId"
            />
          </ody-search-item>
          <ody-search-item :label="this.$t('商品名称')+ ':'" prop="chineseName">
            <el-input
              v-model="queryParam.chineseName"
              :placeholder="$t('请输入商品名称')"
              name="queryParam_chineseName"
            />
          </ody-search-item>
          <ody-search-item :label="$t('SPU编码') + ':'" prop="code">
            <el-input
              v-model="queryParam.code"
              :placeholder="$t('请输入SPU编码')"
              name="queryParam_code"
            />
          </ody-search-item>
          <ody-search-item :label="this.$t('商品类型')+ ':'" prop="type">
            <el-select
              v-model="queryParam.type"
              :placeholder="$t('common_all')"
              name="queryParam_type"
              clearable
            >
              <el-option v-for="(v,k) in productTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="this.$t('商品品牌')+ ':'" prop="brandId">
            <ody-brand-choose
              v-model="queryParam.brandId"
              :placeholder="$t('common_choose_please')"
              name="queryParam_brandId"
            />
            <!-- <el-input
              v-model="queryParam.brandName"
              name="queryParam_brandName"
              readonly="true"
              @click.native="openBrandModal"
            /> -->
          </ody-search-item>
          <ody-search-item :label="this.$t('商品类目')+ ':'" prop="categoryIds">
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
          <ody-search-item :label="$t('用途')+ ':'" prop="useType">
            <el-select
              v-model="queryParam.useType"
              :placeholder="$t('common_all')"
              name="queryParam_useType"
              clearable
            >
              <el-option v-for="(v,k) in useTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('价格层级')+ ':'" prop="priceLevel">
            <el-select
              v-model="queryParam.priceLevel"
              :placeholder="$t('common_all')"
              name="queryParam_priceLevel"
              clearable
            >
              <el-option v-for="(v,k) in priceLevelList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品履约方式')+ ':'" prop="warehouseType">
            <el-select
              v-model="queryParam.warehouseType"
              :placeholder="$t('common_all')"
              name="queryParam_warehouseType"
              clearable
            >
              <el-option v-for="(v,k) in warehouseTypeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('店铺库存')+ ':'" prop="count">
            <ody-number-range v-model="count" name="count" range="[0, 9999999]" />
          </ody-search-item>
          <ody-search-item :label="$t('定价方式')+ ':'" prop="supplierName">
            <el-select
              v-model="queryParam.priceingMethod "
              :placeholder="$t('common_all')"
              name="queryParam_priceingMethod"
              clearable
            >
              <el-option v-for="(v,k) in priceingMethodList" :label="v" :key="k" :value="k" />
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
          <ody-search-item :label="$t('是否内部供应商')+ ':'" prop="isInnerSupplier">
            <el-select
              v-model="queryParam.isInnerSupplier"
              :placeholder="$t('common_all')"
              name="queryParam_isInnerSupplier"
              clearable
            >
              <el-option v-for="(v,k) in isInnerSupplierList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="StoreProductListListQuery_handleQuery"
          size="small"
          type="primary"
          code="StoreProductListListQuery"
          @click="handleQuery"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-dialog
      :visible.sync="showStoreStockConfig"
      :append-to-body="true"
      :title="$t('锁定库存')"
      width="900px">
      <div slot="content">
        <el-form label-position="right" label-width="80px">
          <el-table
            :data="storeStockList"
            :span-method="spanMethod"
            name="storeStockList"
            max-height="550"
            border
            style="width: 100%; margin-top: 10px">
            <el-table-column prop="warehouseName" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('仓库名称') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['warehouseName'] }}
              </template>
            </el-table-column>
            <!--SKU编码-->
            <el-table-column prop="warehouseName" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('SKU编码') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['skuCode'] }}
              </template>
            </el-table-column>
            <!--销售属性-->
            <el-table-column prop="warehouseName" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('销售属性') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['saleAttr'] }}
              </template>
            </el-table-column>
            <el-table-column prop="virtualStockNum" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺总库存') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['virtualStockNum'] }}
              </template>
            </el-table-column>
            <el-table-column prop="virtualAvailableStockNum" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺可用库存') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['virtualAvailableStockNum'] }}
              </template>
            </el-table-column>
            <el-table-column prop="freezeStockNum" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺冻结库存') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['freezeStockNum'] }}
              </template>
            </el-table-column>
            <!--店铺锁定库存-->
            <el-table-column prop="lockingStockNum" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺锁定库存') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['lockingStockNum'] }}
              </template>
            </el-table-column>
            <!--设置锁定库存-->
            <el-table-column prop="lockingStockNum" align="center" width="140">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('设置锁定库存') }}</span>
              </template>
              <template slot-scope="scope">
                <ody-input-number v-model="scope.row['tempLockingStockNum']" :min="0" :max="parseInt(scope.row['virtualStockNum'])-parseInt(scope.row['freezeStockNum'])" name="row_groundingStockNum" />
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <ody-button
          :disabled="lockStockButton || storeStockList.length === 0"
          name="showConfigOk"
          size="small"
          type="primary"
          code="ui"
          @click="saveStoreStockGrounding()"
        >{{ $t('common.save') }}</ody-button>
        <ody-button
          name="showConfigCancel"
          size="small"
          type="danger"
          code="ui"
          @click="closeStoreStockDialog()"
        >{{ $t('common.cancel') }}</ody-button>
      </span>
    </ody-dialog>

    <ody-dialog
      :visible.sync="showStoreStockDownConfig"
      :append-to-body="true"
      :title="$t('库存下架')"
      width="700px">
      <div slot="content">
        <el-form label-position="right" label-width="80px">
          <el-table
            :data="storeStockList"
            :span-method="spanMethod"
            name="storeStockList"
            max-height="550"
            border
            style="width: 100%; margin-top: 10px">
            <el-table-column prop="warehouseName" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('仓库名称') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['warehouseName'] == null? '无仓' : scope.row['warehouseName'] }}
              </template>
            </el-table-column>
            <el-table-column prop="virtualStockNum" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺总库存') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['virtualStockNum'] }}
              </template>
            </el-table-column>
            <el-table-column prop="virtualAvailableStockNum" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺可用库存') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['virtualAvailableStockNum'] }}
              </template>
            </el-table-column>
            <el-table-column prop="freezeStockNum" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺冻结库存') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['freezeStockNum'] }}
              </template>
            </el-table-column>
            <el-table-column prop="groundingStockNum" align="center" width="200">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺上架库存') }}</span>
              </template>
              <template slot-scope="scope">
                <ody-input-number :readonly="true" v-model="scope.row['groundingStockNum']" name="row_groundingStockNum" />
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <ody-button
          name="showConfigOk"
          size="small"
          type="primary"
          code="ui"
          @click="saveStoreStockDown()"
        >{{ $t('库存下架') }}</ody-button>
        <ody-button
          name="showConfigCancel"
          size="small"
          type="danger"
          code="ui"
          @click="closeStoreStockDownDialog()"
        >{{ $t('common.cancel') }}</ody-button>
      </span>
    </ody-dialog>

    <ody-dialog
      :visible.sync="showStoreStockWarnConfig"
      :append-to-body="true"
      :title="$t('设置库存预警')"
      width="700px">
      <div slot="content">
        <el-form label-position="right" label-width="80px">
          <el-table
            :data="storeStockList"
            :span-method="spanMethod"
            name="storeStockList"
            max-height="550"
            border
            style="width: 100%; margin-top: 10px">
            <el-table-column prop="warehouseName" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('仓库名称') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['warehouseName'] }}
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('SKU编码') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['skuCode'] }}
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('销售属性') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['saleAttr'] }}
              </template>
            </el-table-column>
            <el-table-column prop="virtualStockNum" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺总库存') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['virtualStockNum'] }}
              </template>
            </el-table-column>
            <el-table-column prop="virtualAvailableStockNum" align="center">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺可用库存') }}</span>
              </template>
              <template slot-scope="scope">
                {{ scope.row['virtualAvailableStockNum'] }}
              </template>
            </el-table-column>
            <el-table-column prop="earlyWarningStockNum" align="center" width="200">
              <template slot="header" slot-scope="scope">
                <span>{{ $t('店铺库存预警值') }}</span>
              </template>
              <template slot-scope="scope">
                <ody-input-number v-model="scope.row['earlyWarningStockNum']" :min="1" :max="99999" name="row_earlyWarningStockNum" />
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <ody-button
          name="showConfigOk"
          size="small"
          type="primary"
          code="ui"
          @click="saveStoreStockWarn()"
        >{{ $t('common.save') }}</ody-button>
        <ody-button
          name="showConfigCancel"
          size="small"
          type="danger"
          code="ui"
          @click="closeStoreStockWarnDialog()"
        >{{ $t('common.cancel') }}</ody-button>
      </span>
    </ody-dialog>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="StoreProductListBatchExport_batchExport"
          size="small"
          type="primary"
          code="StoreProductListBatchExport"
          @click="batchExport"
        >{{ $t('common_batch_export') }}</ody-button>
        <ody-button
          name="StoreProductListForceDown_batchForceDown"
          size="small"
          code="StoreProductListForceDown"
          @click="batchForceDown(0)"
        >{{ $t('批量强制下架') }}</ody-button>
        <ody-button
          name="StoreProductListForceShelf_batchCansale"
          size="small"
          code="StoreProductListForceShelf"
          @click="batchCansale(1)"
        >{{ $t('批量强制上架') }}</ody-button>
        <ody-button
          name="StoreProductListShelf_batchStatus"
          size="small"
          code="StoreProductListShelf"
          @click="batchStatus(1)"
        >{{ $t('批量上架') }}</ody-button>
        <ody-button
          name="StoreProductListDown_batchStatus"
          size="small"
          code="StoreProductListDown"
          @click="batchStatus(0)"
        >{{ $t('批量下架') }}</ody-button>
        <el-popover placement="bottom" width="160" trigger="hover">
          <div class="btn-popover">
            <el-button v-show="false" size="small" />
            <ody-button
              name="StoreProductListBatchTemplate_batchUpdateFreightTemplate"
              size="small"
              code="StoreProductListBatchTemplate"
              @click="batchUpdateFreightTemplate()"
            >{{ $t('运费模板') }}</ody-button>
            <ody-button
              name="StoreProductListBatchZone_batchUpdateOperateZone"
              size="small"
              code="StoreProductListBatchZone"
              @click="batchUpdateOperateZone()"
            >{{ $t('餐饮作业区域') }}</ody-button>
            <ody-button
              name="StoreProductManage_priceImport"
              size="small"
              code="StoreProductPriceImport"
              @click="toPriceImport"
            >{{ $t('批量改价') }}</ody-button>
            <ody-button
              name="StoreProductManage_stockImport"
              size="small"
              code="StoreProductListUpdateStock"
              @click="handleImportStock"
            >{{ $t('批量改库存') }}</ody-button>
            <ody-button
              name="StoreProductManage_stockImportWarning"
              size="small"
              code="StoreProductListUpdateStockWarning"
              @click=" handleImportStockWarning"
            >{{ $t('批量改库存预警') }}</ody-button>
            <!--批量改锁定库存-->
            <ody-button
              name="StoreProductManage_stockImportWarning"
              size="small"
              code="StoreProductListUpdateStockWarning"
              @click=" handleImportLockInventory"
            >{{ $t('批量改锁定库存') }}</ody-button>
          </div>
          <el-button slot="reference" size="small" class="btn-lr">
            {{ $t('批量修改') }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-popover>

        <ody-button
          name="StoreProductListViewExportList_viewTask"
          size="small"
          code="StoreProductListViewExportList"
          @click="viewTask"
        >{{ $t('查看任务') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="tabChange">
          <el-tab-pane :label="$t('全部')" name="1" />
          <el-tab-pane :label="$t('销售中')" name="2" />
          <el-tab-pane :label="$t('不可售')" name="3" />
        </el-tabs>
      </div>
      <div slot="search-filter" style="width:14%">
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
          style="width:100%"
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
          :can-filter="false"
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
                            :to=" $portal.hasPermission('StoreProductListViewDetail') ? { name: scope.row.useType === 0 ? 'ProductDetail' : 'ProductDetailMaterial', query: { id: scope.row.id ,isView: true} }:{}"
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
            <el-row>
              <el-col v-if="!isPddChannel(scope.row.channelCode)" :span="16">
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
                <div>{{ scope.row.priceLevelStr }}</div>
              </el-col>
              <!-- 拼多多渠道商品 -->
              <el-col v-if="isPddChannel(scope.row.channelCode)" :span="16">
                <div>
                  <div v-if="scope.row.salePriceWithTax">
                    <span>{{ $t('retail_price') }}: </span>
                    <span>{{ scope.row.salePriceWithTax }}</span>
                  </div>
                  <div v-if="scope.row.minSalePriceWithTax && scope.row.maxSalePriceWithTax">
                    <span>{{ $t('retail_price') }}: </span>
                    <span>{{ scope.row.minSalePriceWithTax }}</span>
                    <span>-</span>
                    <span>{{ scope.row.maxSalePriceWithTax }}</span>
                  </div>
                  <div v-if="scope.row.minGroupPrice && scope.row.maxGroupPrice">
                    <span>{{ $t('group_price') }}: </span>
                    <span>{{ scope.row.minGroupPrice }}</span>
                    <span>-</span>
                    <span>{{ scope.row.maxGroupPrice }}</span>
                  </div>
                  <div v-else>
                    <span>{{ $t('group_price') }}: </span>
                    <span>{{ scope.row.groupPrice }}</span>
                  </div>
                </div>
                <div>{{ scope.row.priceLevelStr }}</div>
              </el-col>
              <el-col :span="8">
                <div>
                  &nbsp;
                  <ody-svg-icon
                    v-if="scope.row.priceLevel===2&&scope.row.useType===0"
                    name="StoreProductListUpdatePrice"
                    icon-class="edit"
                    code="StoreProductListUpdatePrice"
                    @click.native="editPrice(scope.row)"
                  />
                </div>
                <div v-if="isPddChannel(scope.row.channelCode)">
                  <ody-svg-icon
                    name="StoreProductListUpdatePrice"
                    icon-class="edit"
                    code="StoreProductListUpdatePrice"
                    @click.native="editGroupPrice(scope.row)"
                  />
                </div>
              </el-col>
            </el-row>
          </template>
          <template slot="pointPrice" slot-scope="scope">
            <el-row>
              <el-col :span="18">
                <div>
                  <div v-if="scope.row.point">
                    <span>{{ scope.row.point }}</span>
                    <span>{{ $t('积分') }}</span>
                    <span v-if="scope.row.amount">+{{ scope.row.amount }}</span>
                    <span v-if="scope.row.amount">{{ $t('元') }}</span>
                  </div>
                  <div v-if="scope.row.minPoint && scope.row.maxPoint">
                    <span>{{ scope.row.minPoint }}</span>
                    <span>-</span>
                    <span>{{ scope.row.maxPoint }}</span>
                    <span>{{ $t('积分') }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="3">
                <div>
                  <ody-svg-icon
                    v-if="scope.row.useType===0 && scope.row.typeOfProduct !== 4 && scope.row.pricingMode===1"
                    name="StoreProductListUpdatePoint"
                    icon-class="edit"
                    code="StoreProductListUpdatePint"
                    @click.native="editPoint(scope.row)"
                  />
                </div>
              </el-col>
              <el-col :span="2">
                <div>
                  <i
                    v-if="scope.row.hasPoint===true&&$portal.hasPermission('StoreProductListDeletePoint')"
                    name="StoreProductListDeletePoint"
                    class="el-icon-delete"
                    @click="deletePoint(scope.row)"
                  />
                </div>
              </el-col>
            </el-row>
          </template>
          <template slot="code" slot-scope="scope">
            <div class="table-code">
              <div class="table-code-merchant">
                <span class="table-code-merchant-span">{{ $t('商') }}</span>
                <span style="mso-number-format:'\@';">{{ scope.row.code }}</span>
              </div>
              <div v-if="scope.row.artNo" class="table-code-goods">
                <span class="table-code-good-span">{{ $t('货') }}</span>
                <span>{{ scope.row.artNo }}</span>
              </div>
            </div>
          </template>
          <template slot="stockNum" slot-scope="scope">
            <div class="table-product-name">
              <ody-left-right effect="positionLeft">
                <div slot="left">
                  <div class="table-product-desc">
                    <span
                      v-if="scope.row.warehouseType === 0"
                      class="table-warehouse-good-span"
                    >{{ scope.row.warehouseTypeStr }}</span>
                    <span
                      v-if="scope.row.warehouseType === 1"
                      class="table-nowarehouse-good-span"
                    >{{ scope.row.warehouseTypeStr }}</span>
                    <span>{{ scope.row.stockNum }}</span>
                  </div>
                </div>
                <div slot="right" style="left: 80px;">
                  <ody-svg-icon
                    v-if="scope.row.warehouseType===1 && scope.row.typeOfProduct !== 4"
                    name="StoreProductListUpdateStock"
                    icon-class="edit"
                    code="StoreProductListUpdateStock"
                    @click.native="editStock(scope.row)"
                  />
                </div>
              </ody-left-right>
            </div>
          </template>
          <template slot="labelStock" slot-scope="scope" :scope="scope">
            <span>{{ $t('common_mp_realStockNum') }}</span>
            <i
              :class="sortStockFlag === 1 ? 'el-icon-sort-down' : sortStockFlag === 2 ? 'el-icon-sort-up' : 'el-icon-sort'"
              name="sortStock"
              @click="sortStock"
            />
          </template>
          <template slot="categoryFullNamePath" slot-scope="scope">
            <el-tooltip placement="top">
              <template slot="content">
                <div>{{ scope.row.categoryFullNamePath }}</div>
              </template>
              <div class="name-text">{{ scope.row.categoryFullNamePath }}</div>
            </el-tooltip>
          </template>
          <template slot="merchantName" slot-scope="scope">
            <el-tooltip placement="top">
              <template slot="content">
                <div>{{ scope.row.merchantName }}</div>
              </template>
              <div class="name-text">{{ scope.row.merchantName }}</div>
            </el-tooltip>
          </template>
          <template slot="storeName" slot-scope="scope">
            <el-tooltip placement="top">
              <template slot="content">
                <div>{{ scope.row.storeName }}</div>
              </template>
              <div class="name-text">{{ scope.row.storeName }}</div>
            </el-tooltip>
          </template>
          <template slot="canSale" slot-scope="scope">
            <div v-if="scope.row.canSale===0" class="table-code">
              <div v-if="scope.row.canSaleType === 2">
                <div>
                  <el-switch
                    :disabled="true"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="scope.row.canSale"
                    :active-text="scope.row.canSale === 1 ? $t('上架') : $t('下架')"
                    name="scope_row_canSale"
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
                  :disabled="!$portal.hasPermission('StoreProductListColumnCanSale')"
                  :active-value="1"
                  :inactive-value="0"
                  :active-text="scope.row.canSale === 1 ? $t('上架') : $t('下架')"
                  v-model="scope.row.canSale"
                  name="scope_row_canSale7"
                  @change="changeCansale($event,scope.row)"
                />
              </div>
            </div>
            <div v-if="scope.row.canSale===1" class="table-code">
              <el-switch
                :disabled="!$portal.hasPermission('StoreProductListColumnCanSale')"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.canSale"
                :active-text="scope.row.canSale === 1 ? $t('上架') : $t('下架')"
                name="scope_row_canSale6"
                @change="changeCansale($event,scope.row)"
              />
            </div>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <!-- 品牌模态框组件 --->
    <brand-modal-component :visible.sync="brandVisible" @ok="closeBrandModal" />
    <download-task
      :is-data-task="true"
      :task-type="'storeProductExport'"
      :visible.sync="downloadTaskVisible"
    />
    <ProductStoreListDialog
      :visible.sync="templateVisible"
      :merchant-id.sync="merchantId"
      :ids.sync="ids"
      @ok="handleQuery"
    />
    <ProductStoreOperateZone
      :visible.sync="zoneVisible"
      :store-id.sync="storeId"
      :ids.sync="ids"
      @ok="handleQuery"
    />
    <ProductStoreSaleDialog
      :visible.sync="batchStatusVisible"
      :type.sync="batchStatusType"
      :ids.sync="ids"
      :storeidlist.sync="storeIdList"
      :merchantproductidlist.sync="merchantProductIdList"
      :merchantidlist.sync="merchantIdList"
      :mpnamelist.sync="mpNameList"
      @ok="handleQuery"
    />
    <MerchantProductEditPrice
      :visible.sync="storeProductEditPriceVisible"
      :merchant-product-id.sync="storeMpId"
      :type-of-product.sync="typeOfProduct"
      :data-type.sync="dataType"
      @ok="handleQuery"
    />
    <MultiplyMerchantProductEditPrice
      :visible.sync="multiplyStoreProductEditPriceVisible"
      :merchant-product-id.sync="storeMpId"
      :type-of-product.sync="typeOfProduct"
      :data-type.sync="dataType"
      @ok="handleQuery"
    />
    <MerchantProductEditGroupPrice
      :visible.sync="storeProductEditGroupPriceVisible"
      :merchant-product-id.sync="storeMpId"
      :type-of-product.sync="typeOfProduct"
      :data-type.sync="dataType"
      :sale-price-with-tax="salePriceWithTax"
      @ok="handleQuery"
    />
    <MultiplyMerchantProductEditGroupPrice
      :visible.sync="multiplyStoreProductEditGroupPriceVisible"
      :merchant-product-id.sync="storeMpId"
      :type-of-product.sync="typeOfProduct"
      :data-type.sync="dataType"
      :sale-price-with-tax="salePriceWithTax"
      :parent-merchant-product-id="parentMerchantProductId"
      @ok="handleQuery"
    />
    <SinglesizeModal
      :visible.sync="singlesizeModalVisible"
      :store-mp-id.sync="storeMpId"
      @ok="handleQuery"
    />
    <MultiSpecificationModal
      :visible.sync="multiSpecificationModalVisible"
      :store-mp-id.sync="storeMpId"
      @ok="handleQuery"
    />
    <!--店铺库存设置-->
    <StoreInventorySettingModal
      :visible.sync="storeInventorySettingVisible"
      :store-mp-id.sync="storeMpId"
      @ok="handleQuery"
    />
    <ExchangeIntegralSetting
      v-if="storeProductEditPointVisible"
      :visible.sync="storeProductEditPointVisible"
      :store-mp-id.sync="storeMpId"
      :type-of-product.sync="typeOfProduct"
      @ok="handleQuery"
    />
    <MultiplyExchangeIntegralSetting
      v-if="multiplyStoreProductEditPointVisible"
      :visible.sync="multiplyStoreProductEditPointVisible"
      :store-mp-id.sync="storeMpId"
      :type-of-product.sync="typeOfProduct"
      @ok="handleQuery"
    />
  </section>
</template>

<script>
import MerchantProductEditPrice from '@/components/merchantProductEditPrice'
import MultiplyMerchantProductEditPrice from '@/components/multiplyMerchantProductEditPrice'
import MerchantProductEditGroupPrice from '@/components/merchantProductEditGroupPrice'
import MultiplyMerchantProductEditGroupPrice from '@/components/multiplyMerchantProductEditGroupPrice'
import DownloadTask from '@/components/downloadTask/index'
import BrandModalComponent from '@/components/brandModal'
import ProductStoreListDialog from '@/components/product-store-list-dialog'
import ProductStoreSaleDialog from '@/components/product-store-sale-dialog'
import SinglesizeModal from '@/components/warehousingModal/singlesizeModal'
import MultiSpecificationModal from '@/components/warehousingModal/multiSpecificationModal'
import StoreInventorySettingModal from '@/components/warehousingModal/storeInventorySettings'
import ProductStoreOperateZone from '@/components/product-store-operateZone'
import ExchangeIntegralSetting from '@/components/exchange-integral-setting'
import MultiplyExchangeIntegralSetting from '@/components/multiply-exchange-integral-setting'
export default {
  name: 'StoreProductList',
  components: {
    BrandModalComponent,
    ProductStoreListDialog,
    ProductStoreSaleDialog,
    DownloadTask,
    MerchantProductEditPrice,
    MultiplyMerchantProductEditPrice,
    MerchantProductEditGroupPrice,
    MultiplyMerchantProductEditGroupPrice,
    SinglesizeModal,
    MultiSpecificationModal,
    StoreInventorySettingModal,
    ProductStoreOperateZone,
    ExchangeIntegralSetting,
    MultiplyExchangeIntegralSetting
  },
  data() {
    const self = this
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
      lockStockButton: false,
      storeStockList: [],
      isAsync: false,
      queryFlag: [],
      count: [],
      ids: [],
      storeIdList: [],
      merchantIdList: [],
      merchantProductIdList: [],
      mpNameList: [],
      categoryTreeData: [],
      categoryNameList: [],
      useTypeList: [],
      priceLevelList: [],
      warehouseTypeList: [],
      productTypeList: [],
      typeOfProductList: [],
      priceingMethodList: [],
      categoryIds: [],
      sourceList: [],
      isInnerSupplierList: [],
      batchVisible: false,
      batchType: 1,
      batchStatusVisible: false,
      batchStatusType: 1,
      activeState: '1',
      queryParam: getDefaultQueryParam(),
      brandVisible: false,
      typeOfProduct: null,
      salePriceWithTax: null,
      dataType: null,
      storeMpId: null,
      parentMerchantProductId: null,
      storeProductEditPriceVisible: false,
      multiplyStoreProductEditPriceVisible: false,
      storeProductEditGroupPriceVisible: false,
      multiplyStoreProductEditGroupPriceVisible: false,
      singlesizeModalVisible: false,
      storeInventorySettingVisible: false,
      multiSpecificationModalVisible: false,
      downloadTaskVisible: false,
      templateVisible: false,
      zoneVisible: false,
      merchantId: null,
      storeId: null,
      showSelect: false,
      storeProductEditPointVisible: false,
      multiplyStoreProductEditPointVisible: false,
      table: {
        columns: [
          {
            show: true,
            slot: 'chineseName',
            tooltip: false,
            label: this.$t('product_name'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            slot: 'combinePrice',
            label: this.$t('retail_price'),
            // label: this.$t('retail_price') + '/' + this.$t('group_price'),
            align: 'left',
            minWidth: 100
          },
          {
            show: this.$portal.hasPermission('StoreProductListShowPoint'),
            slot: 'pointPrice',
            label: this.$t('积分定价'),
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
            slot: 'categoryFullNamePath',
            prop: 'categoryFullNamePath',
            label: this.$t('商品类目'),
            align: 'left',
            minWidth: 350
          },

          {
            show: true,
            slot: 'storeName',
            prop: 'storeName',
            label: this.$t('店铺'),
            align: 'left'
          },
          {
            show: true,
            slot: 'merchantName',
            prop: 'merchantName',
            label: this.$t('商家名称'),
            align: 'left'
          },
          {
            show: true,
            prop: 'channelName',
            label: this.$t('渠道'),
            align: 'left'
          },
          {
            show: true,
            slot: 'canSale',
            label: this.$t('上下架状态'),
            align: 'left'
          },
          {
            show: true,
            prop: 'supplierName',
            label: this.$t('供应商名称'),
            align: 'left',
            minWidth: 350
          }
        ],
        operates: {
          'width': 180,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              disabled: false,
              method: (index, row) => {
                self.edit(row)
              },
              code: 'StoreProductListEdit'
            },
            {
              label: this.$t('锁定库存'),
              code: 'StoreProductStockUp',
              disabled: false,
              // hidden: (index, row) => {
              //  return row.warehouseType === 1
              // },
              method: (index, row) => {
                this.showStoreStockDialog(row)
              }
            },
            {
              label: this.$t('库存预警'),
              code: 'StoreProductStockWarn',
              disabled: false,
              // hidden: (index, row) => {
              //  return row.warehouseType === 1
              // },
              method: (index, row) => {
                this.showStoreStockWarnDialog(row)
              }
            }
          ]
        },
        checked: []
      },
      categorySearchKey: ''
    }
  },
  watch: {
    'queryParam.merchantId': function(val, oldVal) {
      if (!val) {
        this.queryParam.storeId = null
      } else {
        this.queryParam.storeId = null
      }
    },
    deep: true
  },
  async mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      await this.initCodes()
      await this.getQueryBackedRootCategory()
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    itemFilter(row, index) {
      if (this.queryParam.merchantId) {
        if (row.merchantId === this.queryParam.merchantId) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
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
            'USE_TYPE',
            'PRICING_METHOD',
            'IS_AVAILABLE'
          ]
        })
        .then(data => {
          if (data.code === '0') {
            vue.priceLevelList = data.data.PRICE_LEVEL
            vue.productTypeList = data.data.PRODUCT_TYPE
            vue.typeOfProductList = data.data.TYPE_OF_PRODUCT
            vue.warehouseTypeList = data.data.WAREHOUSE_TYPE
            vue.useTypeList = data.data.USE_TYPE
            vue.priceingMethodList = data.data.PRICING_METHOD
            vue.isInnerSupplierList = data.data.IS_AVAILABLE
          }
        })
    },
    async handleQuery() {
      await this.queryList()
    },
    // 打开库存上下架弹框
    async showStoreStockDialog(row) {
      if (row.typeOfProduct === 4) {
        this.lockStockButton = true
      } else {
        this.lockStockButton = false
      }
      this.storeStockList = []
      const storeStockService = this.$product.$api.storeStockGroundingService
      const res = await storeStockService.queryStoreStockInfo({ 'itemId': row.id, 'storeId': row.storeId, 'merchantId': row.merchantId, 'merchantProductId': row.merchantProductId })
      const _storeStockList = res.data
      _storeStockList.forEach(item => {
        item.tempLockingStockNum = item.lockingStockNum ? item.lockingStockNum : 0
      })
      this.storeStockList = _storeStockList

      this.showStoreStockConfig = true
    },
    async saveStoreStockGrounding() {
      const vm = this
      const storeStockList = JSON.parse(JSON.stringify(vm.storeStockList))
      let isCheck = true
      for (let i = 0; i < storeStockList.length; i++) {
        storeStockList[i].lockingStockNum = storeStockList[i].tempLockingStockNum ? storeStockList[i].tempLockingStockNum : 0
        const { virtualStockNum, freezeStockNum, lockingStockNum } = storeStockList[i]
        if (lockingStockNum < 0 || lockingStockNum > (virtualStockNum - freezeStockNum)) {
          isCheck = false
          break
        }
        delete storeStockList[i].tempLockingStockNum
      }
      if (isCheck === true) {
        const storeStockService = this.$product.$api.storeStockGroundingService
        const { code, message } = await storeStockService.lockStoreStock(storeStockList)
        if (code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('设置成功！')
          })
        } else {
          this.$message({
            type: 'error',
            message: message
          })
        }
        this.storeStockList = []
        this.showStoreStockConfig = false
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('锁定库存值应不大于总库存减去冻结库存')
        })
      }
    },
    closeStoreStockDialog() {
      this.storeStockList = []
      this.showStoreStockConfig = false
    },
    // 打开库存下架弹框
    async showStoreStockDownDialog(row) {
      this.storeStockList = []
      const storeStockService = this.$product.$api.storeStockGroundingService
      const res = await storeStockService.queryStoreStockInfo({ 'itemId': row.id, 'storeId': row.storeId, 'merchantId': row.merchantId, 'merchantProductId': row.merchantProductId })
      this.storeStockList = res.data
      this.showStoreStockDownConfig = true
    },
    async saveStoreStockDown() {
      const storeStockService = this.$product.$api.storeStockGroundingService
      await storeStockService.storeStockUndercarriage(this.storeStockList)
      this.storeStockList = []
      this.showStoreStockDownConfig = false
    },
    closeStoreStockDownDialog() {
      this.storeStockList = []
      this.showStoreStockDownConfig = false
    },
    // 打开库存预警弹框
    async showStoreStockWarnDialog(row) {
      this.storeStockList = []
      const storeStockService = this.$product.$api.storeStockGroundingService
      const res = await storeStockService.queryStoreStockInfo({ 'itemId': row.id, 'storeId': row.storeId, 'merchantId': row.merchantId, 'merchantProductId': row.merchantProductId })
      this.storeStockList = res.data
      this.showStoreStockWarnConfig = true
    },
    saveStoreStockWarn() {
      const storeStockService = this.$product.$api.storeStockGroundingService
      storeStockService.storeStockWarn(this.storeStockList).then(res => {
        const { code, message } = res
        if (code === '0') {
          this.$message.success('操作成功')
          this.storeStockList = []
          this.showStoreStockWarnConfig = false
        } else {
          this.$message.error(message)
        }
      })
    },
    closeStoreStockWarnDialog() {
      this.storeStockList = []
      this.showStoreStockWarnConfig = false
    },
    getTableList(list) {
      this.sortStockFlag = null
    },
    // 商家商品列表查询
    async queryList() {
      this.table.checked = []
      if (this.count.length > 0) {
        this.queryParam.minStoreStockNum = this.count[0]
        this.queryParam.maxStoreStockNum = this.count[1]
      }
      return this.$refs.table.getList({
        filters: this.formHasValue(this.queryParam, false)
      })
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
    // 编辑
    edit(row) {
      const name = row.useType === 0 ? 'ProductDetail' : 'ProductDetailMaterial'
      this.$router.push({
        name: name,
        query: { id: row.id, isView: true }
      })
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
    editPrice(row) {
      if (row.priceLevel === 2) {
        this.storeMpId = row.id
        this.typeOfProduct = row.typeOfProduct
        this.dataType = row.dataType
        if (this.typeOfProduct === 0 || this.typeOfProduct === 4) {
          this.storeProductEditPriceVisible = true
        } else {
          this.multiplyStoreProductEditPriceVisible = true
        }
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('请选择价格策略是店铺管控的商品')
        })
      }
    },
    editGroupPrice(row) {
      this.storeMpId = row.id
      this.parentMerchantProductId = row.merchantProductId
      this.typeOfProduct = row.typeOfProduct
      this.dataType = row.dataType
      this.salePriceWithTax = row.salePriceWithTax || row.minSalePriceWithTax
      if (this.typeOfProduct === 0 || this.typeOfProduct === 4) {
        this.storeProductEditGroupPriceVisible = true
      } else {
        this.multiplyStoreProductEditGroupPriceVisible = true
      }
    },
    editPoint(row) {
      this.storeMpId = row.id
      this.typeOfProduct = row.typeOfProduct
      if (this.typeOfProduct === 0) {
        this.storeProductEditPointVisible = true
      } else if (this.typeOfProduct === 3) {
        this.multiplyStoreProductEditPointVisible = true
      }
    },
    async deletePoint(row) {
      const confirm = await this.$confirm(
        this.$t('是否删除当前商品的积分设置'),
        this.$t('提示')
      )
      if (confirm) {
        const submitParams = {}
        submitParams.merchantProductId = row.id
        submitParams.typeOfProduct = row.typeOfProduct
        const result = await this.$product.$api.pointApi.deleteProductPoint(
          submitParams
        )
        if (result && result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('common_operate_success')
          })
          this.queryList()
        }
      }
    },
    editStock(row) {
      this.storeMpId = row.id
      this.storeInventorySettingVisible = true
      /* if (row.warehouseType === 1 && row.typeOfProduct !== 4) {
        this.storeMpId = row.id
        this.typeOfProduct = row.typeOfProduct
        if (this.typeOfProduct === 0) {
          this.singlesizeModalVisible = true
        } else if (this.typeOfProduct === 3) {
          this.multiSpecificationModalVisible = true
        }
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('请选择无仓的商品并且商品类型不是组合类型的商品')
        })
      }*/
    },
    batchUpdateFreightTemplate() {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }
      const ids = []
      let merchantId = null
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          if (i === 0) {
            merchantId = item.merchantId
            ids.push(item.id)
          } else {
            if (merchantId !== item.merchantId) {
              return this.$message('请选择相同商家的商品')
            } else {
              ids.push(item.id)
            }
          }
        }
      }
      this.ids = ids
      this.merchantId = merchantId
      this.templateVisible = true
    },
    batchUpdateOperateZone() {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }
      const ids = []
      let storeId = null
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          if (item.type !== 32) {
            return this.$message('请选择餐饮商品')
          }
          if (i === 0) {
            storeId = item.storeId
            ids.push(item.id)
          } else {
            if (storeId !== item.storeId) {
              return this.$message('请选择相同店铺的商品')
            } else {
              ids.push(item.id)
            }
          }
        }
      }
      this.ids = ids
      this.storeId = storeId
      this.zoneVisible = true
    },
    async batchCansale(type) {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }
      const confirm = await this.$confirm(
        this.$t('是否对选中的商品执行上架'),
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
          const result = await this.mpApi.platformOperateStoreMpShelve(
            submitParams
          )
          if (result && result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_operate_success')
            })
            this.queryList()
          }
        }
      }
    },
    async batchForceDown(type) {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }
      const confirm = await this.$confirm(
        this.$t('是否对选中的商品执行强制下架'),
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
            this.$message({
              type: 'success',
              message: this.$t('common_operate_success')
            })
            this.queryList()
          }
        }
      }
    },
    batchStatus(type) {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }
      const ids = []
      const storeIdLists = []
      const merchantIdLists = []
      const merchantProductIdLists = []
      const mpNameLists = []
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          if (item.canSaleType !== 1) {
            ids.push(item.id)
            storeIdLists.push(item.storeId)
            merchantIdLists.push(item.merchantId)
            merchantProductIdLists.push(item.merchantProductId)
            mpNameLists.push(item.chineseName)
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('运营下架的商品不能上下架')
            })
            return
          }
        }
      }
      this.ids = ids
      this.storeIdList = storeIdLists
      this.merchantIdList = merchantIdLists
      this.merchantProductIdList = merchantProductIdLists
      this.mpNameList = mpNameLists
      this.batchStatusVisible = true
      this.batchStatusType = type
    },
    async changeCansale(callback, row) {
      const submitParams = {}
      submitParams.mpIdList = []
      submitParams.mpIdList.push(row.id)
      if (row.canSale === 1) {
        submitParams.storeIdList = []
        submitParams.storeIdList.push(row.storeId)
        submitParams.merchantProductIdList = []
        submitParams.merchantProductIdList.push(row.merchantProductId)
        submitParams.merchantIdList = []
        submitParams.merchantIdList.push(row.merchantId)
        submitParams.mpNameList = []
        submitParams.mpNameList.push(row.chineseName)
      }
      submitParams.canSale = row.canSale
      const result = await this.mpApi.redevStoreMpCanSale(submitParams)
      if (result && result.code === '0' && result.data === '0') {
        this.$message({
          type: 'success',
          message: this.$t('common_operate_success')
        })
      } else {
        if (row.canSale === 1) {
          row.canSale = 0
        } else {
          row.canSale = 1
        }
        this.$message({
          type: 'error',
          message: result.data
        })
      }
    },
    toPriceImport() {
      this.$router.push({
        name: 'StoreImportData'
      })
    },
    handleImportStock() {
      this.$router.push({ name: 'ImportNoWarehouseProductStock' })
    },
    handleImportStockWarning() {
      this.$router.push({ name: 'ImportstockWarning' })
    },
    handleImportLockInventory() {
      this.$router.push({ name: 'ImportLockInventory' })
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
          jsonTxt: JSON.stringify(
            exportInfoParam
            // {
            //   currentPage: 1,
            //   itemsPerPage: 1000,
            //   idList: ids,
            //   useTypeList: [0, 1],
            //   dataType: 3
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
            this.queryList()
          } else {
            this.$message({
              showClose: true,
              message: this.$t('创建导出任务失败！'),
              type: 'error'
            })
          }
        })
    },
    isPddChannel(channelCode) {
      return channelCode + '' === '210010'
    },
    searchChange(searchQuery) {
      this.categorySearchKey = searchQuery
      this.getQueryBackedRootCategory()
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
      brandId: null,
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
      storeCanSale: null,
      merchantId: null,
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
.table-code-red-span {
  background: #ff0000;
  color: #ffffff;
  font-size: 12px;
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
.btn-lr{
  margin-left: 16px;
  margin-right: 16px;
}
</style>
