<template>
  <div>
    <ody-list-table-area class="mp-info">
      <div slot="btn">
        <el-row>
          <el-col v-if="$portal.hasPermission('OmsOrderList_Batch_Return') && (soDetail.orderPaymentStatus === 3 || soDetail.orderStatus >= 1050)" :span="1.9" style="margin-right: 15px"><el-button :disabled="soDetail.orderStatus==1999 || soDetail.orderStatus==9000 || noSupportsReturn || soDetail.sysSource === '210001' || soDetail.sysSource === '210008' || soDetail.sysSource === '210008' || soDetail.sysSource === '210009' " name="launchAfterSale" size="mini" type="primary" @click="launchAfterSale">{{ $t('批量售后') }}</el-button></el-col>
          <el-col v-if="$portal.hasPermission('OmsOrderList_Edit_Given') && soDetail.orderStatus < 1050 && soDetail.orderType !== 105" :span="1.9" style="margin-right: 15px"><edit-give-product :so-info="soDetail" :warehouse-type="warehouseType" @ok="init"/></el-col>
          <el-col v-if="$portal.hasPermission('OmsOrderList_Stock_Out') && stockOutCodeList.length>0" :span="1.9" style="margin-right: 15px"><so-stock-out :order-code="soDetail.orderCode"/></el-col>
          <el-col v-if="$portal.hasPermission('OmsOrderList_Batch_Return') && (soDetail.orderPaymentStatus === 3 || soDetail.orderStatus >= 1050)" :span="1.9" style="margin-right: 15px"><el-link name="showSoReturnDialog" style="height: 28px" type="primary" @click="showSoReturnDialog">{{ $t('查看售后记录') }}</el-link></el-col>
        </el-row>
      </div>
      <div slot="table">
        <ody-table
          :data="listTable.list"
          :columns="listTable.columns"
          :operates="listTable.operates"
          :multiple="false"
          name="listTable_list671">
          <template slot-scope="scope" slot="productPriceSale" >
            <div v-if="soDetail.orderPaymentStatus === 0 && soDetail.orderStatus < 1020 && scope.row.productSaleType !== 4 && $portal.hasPermission('OmsOrderList_Modify_Price')" name="showChangePriceDialog" @click="showChangePriceDialog(scope.row)">
              <i class="el-icon-edit-outline"/>&nbsp;&nbsp;{{ scope.row.productPriceSale }}
            </div>
            <div v-else>
              {{ scope.row.productPriceSale }}
            </div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="searchForm.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="searchForm.limit"
          :total.sync="listTable.total"
          :list="listTable.list"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="query"
          @current-change="query"/>

      </div>
    </ody-list-table-area>
    <div class="clearfix cp-box enclosure">
      <el-col :span="2">
        <el-container>
          <el-main>
            <span class="f14"><!--附件-->{{ $t('common_attachment') }}</span>
          </el-main>
        </el-container>
      </el-col>
      <el-col :span="4">
        <el-container>
          <el-main >
            <el-upload
              :on-preview="handlePreview"
              :before-remove="beforeRemove"
              :limit="3"
              :file-list="fileList"
              :on-success="handleSuccess"
              class="upload-demo"
              action="/oms-web/public/upload/uploadFile"
              multiple>
              <ody-button name="OmsOrderList_Attachment" code="OmsOrderList_Attachment" size="small"><!--点击上传-->{{ $t('click_upload') }}</ody-button>
            </el-upload>
            <div slot="tip" class="el-upload__tip">{{ $t("uploadPictureTip") }}</div>
          </el-main>
        </el-container>
      </el-col>
      <el-col :span="18">
        <el-container>
          <el-main>
            <el-col :span="2" :offset="17">
              <span class="detail"><!--合计-->{{ $t('order_aggregate')+'：' }}</span>
            </el-col>
            <el-col :span="5">
              <el-row>
                <span class="detail"><!--商品总额-->{{ $t('total_commodity') }}：</span>
                <span class="f14">{{ parseFloat(soDetail.productAmount).toFixed(2) }}</span>
              </el-row>
              <el-row style="margin-top: 5px">
                <span class="detail">{{ $t('券卡') }}/{{ $t('优惠') }}：</span>
                <!--优惠总金额=商品总额-订单总额-->
                <span class="f14">{{ (parseFloat(soDetail.orderPaidByCoupon == null ? 0 : soDetail.orderPaidByCoupon) + parseFloat(soDetail.orderPromotionDiscount == null ? 0 :soDetail.orderPromotionDiscount) + parseFloat((soDetail.soShareAmountVO == null || soDetail.soShareAmountVO.orderReferralAmount == null) ? 0 :soDetail.soShareAmountVO.orderReferralAmount)).toFixed(2) }}</span>
              </el-row>
              <el-row style="margin-top: 5px">
                <span class="detail"><!--运费金额-->{{ $t('freight_amount') }}：</span>
                <span v-if="!changeDelivery.show" class="f14">{{ parseFloat(soDetail.orderDeliveryFee).toFixed(2) }}</span>
                <el-input-number
                  v-show="changeDelivery.show"
                  ref="deliveryInput"
                  v-model="changeDelivery.orderDeliveryFee"
                  :step="1"
                  :precision="2"
                  :min="0"
                  :max="999999999999999"
                  :controls="false"
                  name="changeDelivery_orderDeliveryFee"
                  size="mini"
                  @blur="commitChangeDelivery"
                />
                &nbsp;&nbsp;
                <i
                  v-if="$portal.hasPermission('OmsOrderList_Modify_Freight') && !changeDelivery.show && soDetail.orderPaymentStatus === 0 && soDetail.orderStatus < 1020"
                  name="showChangeDelivery"
                  class="el-icon-edit-outline"
                  @click="showChangeDelivery"/>
              </el-row>
              <el-row style="margin-top: 5px">
                <span style="font-size: 14px;font-weight:700;color:#EF5351"><!--实付金额-->{{ $t('user_payment') }}：</span>
                <!--总金额=订单总额+运费-->
                <span class="f16" style="color: #EF5351;">{{ (parseFloat(soDetail.orderAmount) + parseFloat(soDetail.orderDeliveryFee) ).toFixed(2) }}</span>
                &nbsp;&nbsp;
                <el-link name="showAmountDetail" type="primary" class="f14" @click="showAmountDetail"><!--明细-->{{ $t('detailed') }}</el-link>
              </el-row>
            </el-col>
          </el-main>
        </el-container>
      </el-col>
    </div>
    <ody-dialog-full-right
      :visible.sync="soReturnDialog.show"
      :title="$t('查看售后记录')">
      <so-return v-if="soDetail" ref="soReturnModel" :so-info="soDetail" :order-code="soDetail.orderCode"/>
      <div slot="footer">
        <el-button name="hideSoReturnDialog" @click="hideSoReturnDialog">{{ $t('返回') }}</el-button>
      </div>
    </ody-dialog-full-right>
    <!--发起售后模态框-->
    <AfterSaleModal ref="afterSaleModal" :visible.sync="showApplyReturnModal" :form-data.sync="formData" :collect.sync="collect" :so-info.sync="soDetail" :support-return-types="supportReturnTypes" :is-edit="isEdit" class="hzf11" @ok="saveAfterSale" @soReturnChange="initSoReturns" />
    <ody-dialog-full-right
      :visible.sync="amountDiaglog.show"
      :title="$t('金额明细')">
      <div>
        <el-row>
          <el-col :span="6" class="f14 bold">
            <span class="title themeColor"><!--订单号-->{{ $t('orderNumber') }}：</span>
            <span>{{ soDetail.orderCode }}</span>
          </el-col>
          <el-col :span="6" :offset="2" class="f14 bold">
            <span class="title themeColor"><!--订单状态-->{{ $t('orderStatus') }}：</span>
            <span>{{ soDetail.orderStatusStr }}</span>
          </el-col>
        </el-row>
        <el-row v-show="promote.list.length>0">
          <el-container style="margin-top: 20px;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
            <el-header>
              <br>
              <span class="title"><!--商品促销活动-->{{ $t('so_promotion') }}</span>
            </el-header>
            <el-main v-if="promote.list.length>0">
              <ody-table
                :data="promote.list"
                :columns="promote.columns"
                :multiple="false"
                name="promote_list924"/>
            </el-main>
          </el-container>
        </el-row>
        <el-row v-show="coupon.list.length>0">
          <el-container style="margin-top: 20px;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
            <el-header>
              <br>
              <span class="title"><!--优惠券-->{{ $t('so_coupon') }}</span>
            </el-header>
            <el-main v-if="coupon.list.length>0">
              <ody-table
                :data="coupon.list"
                :columns="coupon.columns"
                :multiple="false"
                name="coupon_list358"/>
            </el-main>
          </el-container>
        </el-row>
        <el-row>
          <div style="margin-top: 20px;margin-bottom: 12px">
            <span class="title bold f14">{{ $t('订单明细') }}</span>
          </div>
          <el-container>
            <el-main style="border:1px solid #EEF5F9;">
              <div style="padding-bottom: 32px;border-bottom: 1px solid  #EEF5F9;">
                <el-row type="flex" >
                  <el-col :span="6">
                    <div class="mgB14">
                      <span style="color: #455A64;" class="bold f14">{{ $t('促销优惠相关') }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor"><!--商品原始金额合计-->{{ $t('so_total_item_original_amount') }}：</span><span>{{ parseFloat(soDetail.productAmount).toFixed(2) }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor"><!--商品促销优惠金额-->{{ $t('so_promotion_total_amount') }}：</span><span>-{{ parseFloat(promote.total).toFixed(2) }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor"><!--优惠券优惠金额-->{{ $t('coupon_concession') }}：</span><span>-{{ parseFloat(coupon.total).toFixed(2) }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor mgB8"><!--优惠码抵扣金额-->{{ $t('sum_of_referral_code_amount') }}：</span>
                      <span>-{{ (soDetail.soShareAmountVO == null || soDetail.soShareAmountVO.orderReferralAmount === null) ? '0.00': parseFloat(soDetail.soShareAmountVO.orderReferralAmount).toFixed(2) }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor"><!--商品改价优惠金额-->{{ $t('so_item_adjust_discount_amount') }}：</span>
                      <!--商品改价优惠总额=商品优惠总额-促销优惠总额-优惠券优惠总额-->
                      <span>{{ changePriceFreeAmount > 0 ? '-' : (changePriceFreeAmount + '' === '0.00' ? '' : '+') }}{{ Math.abs(changePriceFreeAmount = (parseFloat(soDetail.orderAmount)-parseFloat(soDetail.orderBeforeAmount)).toFixed(2)) }}</span>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="mgB14">
                      <span style="color: #455A64;" class="bold f14 mgB14"><!--账户抵扣相关-->{{ $t('账户抵扣相关') }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor mgB8"><!--积分抵扣金额-->{{ $t('sum_of_deductible_amount') }}：</span>
                      <span>-{{ soDetail.soShareAmountVO.pmUsedMoney === null ? '0.00': parseFloat(soDetail.soShareAmountVO.pmUsedMoney).toFixed(2) }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor mgB8"><!--积分使用数量-->{{ $t('积分使用数量') }}：</span>
                      <span>{{ soDetail.soShareAmountVO.pmUsedPoints === null ? '0': soDetail.soShareAmountVO.pmUsedPoints }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor mgB8"><!--佣金抵扣金额-->{{ $t('sum_of_commission_amount') }}：</span>
                      <span>-{{ soDetail.soShareAmountVO.pmPaidByAccount === null ? '0.00': parseFloat(soDetail.soShareAmountVO.pmPaidByAccount).toFixed(2) }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor mgB8"><!--礼品卡抵扣金额-->{{ $t('sum_of_gift_card_amount') }}：</span>
                      <span>-{{ soDetail.soShareAmountVO.pmGiftCardAmount === null ? '0.00': parseFloat(soDetail.soShareAmountVO.pmGiftCardAmount).toFixed(2) }}</span>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="mgB14">
                      <span style="color: #455A64;" class="bold f14"><!--运费相关-->{{ $t('运费相关') }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor"><!--运费原始金额-->{{ $t('so_original_freight_amount') }}：</span><span>{{ parseFloat(soDetail.orderBeforeDeliveryFee).toFixed(2) }}</span>
                    </div>
                    <div class="f14 mgB8">
                      <span class="detail themeColor"><!--运费优惠金额-->{{ $t('so_freight_discount_amount') }}：</span>
                      <!--运费优惠总额=改运费之前的运费-改运费之后的运费-->
                      <span>{{ freeDeliveryFee > 0 ? '-' : (freeDeliveryFee + '' == '0.00' ? '' : '+' ) }}{{ Math.abs(freeDeliveryFee = (parseFloat(soDetail.orderBeforeDeliveryFee) - parseFloat(soDetail.orderDeliveryFee)).toFixed(2)) }}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="clearfix" style="margin-top: 20px">
                <el-col :span="2" :offset="19">
                  <span class="detail"><!--合计-->{{ $t('common_total') +'：' }}</span>
                </el-col>
                <el-col :span="3">
                  <el-row class="mgB8">
                    <span class="detail"><!--商品总额-->{{ $t('total_commodity') }}：</span>
                    <span class="f14">{{ parseFloat(soDetail.productAmount).toFixed(2) }}</span>
                  </el-row>
                  <el-row class="mgB8">
                    <span class="detail">{{ $t('券卡') }}/{{ $t('优惠') }}：</span>
                    <!--优惠总金额=so.order_paid_by_coupon+so.order_promotion_discount-->
                    <span class="f14">{{ (parseFloat(soDetail.orderPaidByCoupon == null ? 0 : soDetail.orderPaidByCoupon) + parseFloat(soDetail.orderPromotionDiscount == null ? 0 :soDetail.orderPromotionDiscount) + parseFloat((soDetail.soShareAmountVO == null || soDetail.soShareAmountVO.orderReferralAmount == null) ? 0 :soDetail.soShareAmountVO.orderReferralAmount)).toFixed(2) }}</span>
                  </el-row>
                  <el-row class="mgB8">
                    <span class="detail"><!--运费金额-->{{ $t('freight_amount') }}：</span>
                    <span v-if="!changeDelivery.show" class="f14">{{ parseFloat(soDetail.orderDeliveryFee).toFixed(2) }}</span>
                    <el-input-number
                      v-show="changeDelivery.show"
                      ref="modelDeliveryInput"
                      v-model="changeDelivery.orderDeliveryFee"
                      :step="1"
                      :precision="2"
                      :min="0"
                      :max="999999999999999"
                      :controls="false"
                      name="changeDelivery_orderDeliveryFee4"
                      size="mini"
                      @blur="commitChangeDelivery"
                    />
                    &nbsp;&nbsp;
                    <i
                      v-if="$portal.hasPermission('OmsOrderList_Modify_Freight') && !changeDelivery.show && soDetail.orderPaymentStatus === 0 && soDetail.orderStatus < 1020"
                      name="showChangeDelivery7"
                      class="el-icon-edit-outline"
                      @click="showChangeDelivery"/>
                  </el-row>
                  <el-row class="mgB8">
                    <span style="font-size: 14px;color:#EF5351"><!--实付金额-->{{ $t('user_payment') }}：</span>
                    <!--总金额=订单总额+运费-->
                    <span style="font-size: 16px;color: #EF5351;" class="bold">{{ (parseFloat(soDetail.orderAmount) + parseFloat(soDetail.orderDeliveryFee) ).toFixed(2) }}</span>
                  </el-row>
                </el-col>
              </div>
            </el-main>
          </el-container>
        </el-row>
      </div>
      <div slot="footer">
        <el-button name="closeAmountDialog" @click="closeAmountDialog">{{ $t('返回') }}</el-button>
      </div>
    </ody-dialog-full-right>
    <ody-dialog
      :visible.sync="changePriceDialog.show"
      :before-close="cancelChangePriceDialog"
      :title="$t('修改购买单价')"
      width="420px">
      <el-form ref="changePrice" :rules="changePriceDialog.rules" :label-position="right" :model="changePriceDialog.new" label-width="100px">
        <el-form-item :label="$t('原购买单价')+'：'">
          <span>{{ changePriceDialog.row.productPriceOriginal }}</span>
        </el-form-item>
        <el-form-item :label="$t('折扣')+'：'" prop="discount">
          <el-input
            v-model="changePriceDialog.new.discount"
            :placeholder="$t('折扣')"
            name="changePriceDialog_new_discount"
            style="width: 200px"
            @change="changePriceDiscount"/>&nbsp;&nbsp;<span>%</span>
        </el-form-item>
        <el-form-item :label="$t('新购买单价')+'：'" prop="productPriceSale">
          <el-input-number
            v-model="changePriceDialog.new.productPriceSale"
            :step="1"
            :min="0"
            :max="999999999999999"
            :placeholder="$t('新购买单价')"
            name="changePriceDialog_new_productPriceSale"
            size="mini"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="commitChangePriceDialog" size="small" type="primary" @click="commitChangePriceDialog">{{ $t('保存') }}</el-button>
        <el-button name="cancelChangePriceDialog" size="small" @click="cancelChangePriceDialog">{{ $t('取消') }}</el-button>
      </div>
    </ody-dialog>
  </div>
</template>

<script>
import EditGiveProduct from '@/components/so/editGiveProduct'
import SoReturn from '@/components/soReturn'
import AfterSaleModal from '@/components/soReturn/afterSaleModal'
import SoStockOut from '@/components/soStockOut'

export default {
  components: {
    EditGiveProduct,
    SoReturn,
    AfterSaleModal,
    SoStockOut
  },
  props: {
    promotions: {
      type: Object,
      default: function() {
        return []
      }
    },
    coupons: {
      type: Object,
      default: function() {
        return []
      }
    },
    soDetail: {
      type: Object,
      default: function() {
        return {}
      }
    },
    warehouseType: {
      type: Object,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      showApplyReturnModal: false,
      noSupportsReturn: true,
      supportReturnTypes: {},
      isEdit: false,
      fileList: [],
      changeDelivery: { show: false, orderDeliveryFee: null },
      promote: { total: 0, list: [], columns: [
        {
          label: this.$t('商品名称'),
          prop: 'productCname',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('参加的促销活动'),
          prop: 'promotionName',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('参与数量'),
          prop: 'productItemNum',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('优惠金额'),
          prop: 'amountSharePromotion',
          show: true,
          align: 'center'
        }
      ] },
      coupon: { total: 0, list: [], columns: [
        {
          label: this.$t('商品名称'),
          prop: 'productCname',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('优惠券名称'),
          prop: 'couponName',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('券码'),
          prop: 'couponCode',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('参与数量'),
          prop: 'productItemNum',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('优惠金额'),
          prop: 'couponAmount',
          show: true,
          align: 'center'
        }
      ] },
      amountDiaglog: { show: false },
      soReturnDialog: { show: false },
      totalFreeAmount: 0,
      changePriceFreeAmount: 0,
      freeDeliveryFee: 0,
      changePriceDialog: {
        show: false,
        row: {},
        new: {
          productPriceSale: null,
          discount: null
        },
        rules:
          {
            discount: [
              { pattern: /^\d+(\.\d{1,2})?$/, message: this.$t('请输入有效的数字') + ',' + this.$t('最多两位小数'), trigger: 'change' }
            ],
            productPriceSale: [
              { required: true, message: this.$t('请输入新购买单价'), trigger: 'change' },
              { pattern: /^\d+(\.\d{1,2})?$/, message: this.$t('请输入有效的数字') + ',' + this.$t('最多两位小数'), trigger: 'change' }
            ]
          }},
      searchForm: { page: 1, limit: 10 },
      listTable: {
        list: [],
        total: 0,
        columns: [
          {
            label: this.$t('商品主图'),
            prop: 'productPicPath',
            show: true,
            align: 'center',
            render: (h, params) => {
              if (params.row.productPicPath) {
                return (
                  <el-image fit='contain' style='height:50px' src={params.row.productPicPath}></el-image>
                )
              } else {
                return
              }
            }
          },
          {
            label: this.$t('商品名称'),
            prop: 'productCname',
            show: true,
            align: 'center',
            minWidth: 300,
            render: (h, params) => {
              const self = this
              if (params.row.productSaleType === 4) {
                return (
                  <div>
                    <el-tag type='warning'>{self.$t('赠')}</el-tag>&nbsp;&nbsp;{params.row.productCname}
                  </div>
                )
              } else {
                return (
                  <div>
                    {params.row.productCname}
                  </div>
                )
              }
            }
          },
          {
            label: this.$t('商品编码'),
            prop: 'code',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('do_bar_code'),
            prop: 'barCode',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('do_art_no'),
            prop: 'artNo',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('套餐编码'),
            prop: 'setmealCode',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('套餐名称'),
            prop: 'setmealName',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('so_promotion_unit'), // 订购单位
            prop: 'unit',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('订购数量'),
            prop: 'productItemNum',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('un_to_do_num'), // 待转交货单数量
            prop: 'unDoNum',
            show: true,
            align: 'center',
            minWidth: 150
          },
          {
            label: this.$t('to_do_num'), // 已转交货单数量
            show: true,
            align: 'center',
            minWidth: 150,
            formatter: (row, column) => {
              return row.alreadyDeliveryNum
            }
          },
          {
            label: this.$t('purchaseOrder_product_delivedQuantity'), // 已发货数量
            prop: 'productItemOutNum',
            show: true,
            align: 'center',
            formatter(row, column) {
              return row.productItemOutNum ? row.productItemOutNum : 0
            },
            minWidth: 150
          },
          {
            label: this.$t('manual_order_sales_unit_price'), // 销售单价
            prop: 'productPriceOriginal',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('purchase_price'), // 购买单价
            prop: 'productPriceSale',
            show: true,
            align: 'center',
            slot: 'productPriceSale'
          },
          {
            label: this.$t('supplier_purchase_price'), // 采购单价
            prop: 'purchasePrice',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('purchase_amount'), // 购买金额
            prop: 'productItemAmount',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('supplier_name'), // 供应商名称
            prop: 'supplierName',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('状态'),
            prop: 'itemStatusStr',
            show: true,
            align: 'center',
            render: (h, params) => {
              const self = this
              console.log(params.row.itemStatusStr)
              if (params.row.isStockOut === true) {
                return (
                  <div>
                    {params.row.itemStatusStr}
                  &nbsp;&nbsp;<el-tag type='danger'>{self.$t('缺货')}</el-tag>
                  </div>
                )
              } else {
                return (
                  <div>
                    {params.row.itemStatusStr}
                  </div>
                )
              }
            }
          }
        ],
        operates: {
          fixed: 'right',
          align: 'center',
          minWidth: 100,
          list: [{}]
        }
      },
      stockOutCodeList: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    launchAfterSale() { // 显示发起售后模态框
      // this.initSoReturns()
      this.showApplyReturnModal = true
      this.isEdit = false
    },
    initSoReturns() {
      const vue = this
      this.$oms.$api.soReturn.soReturnList({
        filters: { orderCode: this.soDetail.orderCode },
        sorts: [{ field: 'createTime', asc: false }]
      }).then((data) => {
        this.noSupportsReturn = true
        // 发起售后按钮判断条件
        if (data.extraData) {
          vue.supportReturnTypes = {}
          vue.noSupportsReturn = data.extraData.length === 0
          data.extraData.forEach(function(item) {
            vue.supportReturnTypes[item.type] = true
          })
        }
      })
    },
    async init() {
      const self = this
      this.promote.list = this.promotions
      this.promote.list.forEach(i => {
        if (i.amountSharePromotion && !isNaN(Number(i.amountSharePromotion))) {
          this.promote.total += Number(i.amountSharePromotion)
          i.amountSharePromotion = Number(i.amountSharePromotion).toFixed(2)
        }
      })
      this.coupon.list = this.coupons
      this.coupon.list.forEach(i => {
        if (i.couponAmount && !isNaN(Number(i.couponAmount))) {
          this.coupon.total += Number(i.couponAmount)
          i.couponAmount = Number(i.couponAmount).toFixed(2)
        }
      })
      await this.$oms.$api.common.listByCategorysForOrder({ categorys: ['ITEM_STATUS'] }).then(res => {
        self.itemStatus = res.data.ITEM_STATUS
      })
      await self.$oms.$api.soStockOut.soStockOutList({ limit: 1000, page: 1, orderCode: self.soDetail.orderCode }).then(res1 => {
        res1.data.forEach(l => {
          self.stockOutCodeList.push(l.code)
        })
      })
      await this.initSoReturns()
      await this.query()
    },
    query() {
      const self = this
      this.searchForm.filters = { orderCode: this.soDetail.orderCode }
      this.searchForm.joinFields = ['productItemOutNum']
      this.$oms.$api.soItem.orderSoItemListPage(this.searchForm).then(res => {
        res.data.forEach(i => {
          i.isStockOut = self.stockOutCodeList.indexOf(i.code) >= 0
        })
        self.listTable.total = res.total
        self.listTable.list = res.data
        self.listTable.list.forEach(l => {
          self.totalFreeAmount = 0
          self.totalFreeAmount += (parseFloat(l.productPriceOriginal) - parseFloat(l.productPriceSale)) * parseInt(l.productItemNum)
          l.productPriceOriginal = l.productPriceOriginal.toFixed(2)
          l.productItemAmount = l.productItemAmount.toFixed(2)
          l.productPriceSale = l.productPriceSale.toFixed(2)
        })
      })
      this.$oms.$api.so.soAnnexAndRemarksGet({ orderCode: this.soDetail.orderCode }).then(res => {
        self.fileList = []
        if (res.data && res.data.soAttachmentVOS) {
          res.data.soAttachmentVOS.forEach(i => {
            self.fileList.push({
              name: i.name,
              url: i.path,
              id: i.id
            })
          })
        }
      })
    },
    showChangePriceDialog(row) {
      this.changePriceDialog.show = true
      this.changePriceDialog.row = row
      this.changePriceDialog.new.productPriceSale = row.productPriceSale
      this.changePriceDialog.new.discount = (this.changePriceDialog.new.productPriceSale / this.changePriceDialog.row.productPriceOriginal * 100).toFixed(0)
    },
    commitChangePriceDialog() {
      const self = this
      this.$refs['changePrice'].validate((valid) => {
        if (valid) {
          self.$oms.$api.soItem.modifyPriceItem({
            id: self.changePriceDialog.row.id,
            orderCode: self.soDetail.orderCode,
            productItemAmount: parseFloat(self.changePriceDialog.new.productPriceSale) * parseInt(self.changePriceDialog.row.productItemNum),
            productPriceSale: self.changePriceDialog.new.productPriceSale
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('修改成功')
            })
            self.onSuccess()
            self.cancelChangePriceDialog()
            self.query()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelChangePriceDialog() {
      this.$refs['changePrice'].resetFields()
      this.changePriceDialog.show = false
      this.changePriceDialog.row = {}
      this.changePriceDialog.new = { productPriceSale: null, discount: null }
    },
    changePriceDiscount() {
      let n
      if (this.changePriceDialog.new.discount) {
        const discount = parseFloat(this.changePriceDialog.new.discount)
        const old = parseFloat(this.changePriceDialog.row.productPriceOriginal)
        n = discount * old / 100
      } else {
        n = 0
      }
      this.changePriceDialog.new.productPriceSale = n.toFixed(2)
    },
    beforeRemove(file, fileList) {
      this.$confirm(this.$t('此操作将永久删除该文件') + ',' + this.$t('是否继续') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('删除成功') + '!'
        })
        const self = this
        this.$oms.$api.soAttachment.deleteSoAttachment({ id: file.id }).then(res => {
          self.query()
        })
      })
      return false
    },
    showChangeDelivery() {
      this.changeDelivery.show = true
      this.changeDelivery.orderDeliveryFee = this.soDetail.orderDeliveryFee
    },
    commitChangeDelivery() {
      if (!/^\d+(\.\d{0,2})?$/.test(this.changeDelivery.orderDeliveryFee)) {
        this.$message({
          type: 'error',
          message: this.$t('请输入有效的数字') + ',' + this.$t('最多两位小数')
        })
        return
      }
      const self = this
      this.$oms.$api.so.modifyFreightPrice({ id: this.soDetail.id, orderDeliveryFee: this.changeDelivery.orderDeliveryFee }).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('修改成功') + '!'
        })
        self.soDetail.orderDeliveryFee = parseFloat(self.changeDelivery.orderDeliveryFee)
        self.query()
        self.changeDelivery.show = false
        self.onSuccess()
      }).catch(() => {
        self.changeDelivery.show = false
      })
    },
    showAmountDetail() {
      this.amountDiaglog.show = true
    },
    closeAmountDialog() {
      this.amountDiaglog.show = false
    },
    handleSuccess(response, file, fileList) {
      const url = file.response.data[0].url
      const name = file.name
      const self = this
      this.$oms.$api.soAttachment.addSoAttachment({ name: name, orderCode: this.soDetail.orderCode, path: url }).then(res => {
        self.$message({
          type: 'success',
          message: this.$t('新增成功') + '!'
        })
        self.query()
      })
    },
    onSuccess() {
      this.$emit('onSuccess')
    },
    hideSoReturnDialog() {
      this.soReturnDialog.show = false
    },
    showSoReturnDialog() {
      this.soReturnDialog.show = true
      // 每次显示售后列表，都查询售后信息
      if (this.$refs['soReturnModel']) {
        this.$refs['soReturnModel'].init()
      }
    },
    handlePreview(file) {
      this.$portal.downloadFileByGet(file.url, {}, file.name)
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/ .dialog-inner-content{
    padding: 20px 40px 100px!important;
  }
  .themeColor{
    color:  #99ABB4;
  }
  .mgB14{
    margin-bottom: 14px;
  }
  .mgB8{
    margin-bottom: 8px;
  }
  .bold{
    font-weight: bold;
  }
  .f14{
    font-size: 14px;
  }
  .detail {
    font-size: 14px;
    font-weight:400;
    color:rgba(153,171,180,1);
  }
  .mp-info{
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .enclosure{
    background: white;
    border-top: 1px solid #EEF5F9;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    box-shadow: none;
  }
</style>
