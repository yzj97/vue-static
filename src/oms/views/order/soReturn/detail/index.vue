<template>
  <section id="orderSalesList">
    <el-card class="box-card" style="margin-bottom: 20px">
      <!-- 步骤条 -->
      <el-steps
        v-show="details.type != 3 && details.type != 4"
        :space="400"
        :active="stepsActive"
        align-center
        finish-status="success"
      >
        <el-step :title="$t('买家申请售后')" :description="details.createTime" />
        <el-step :title="$t('商家处理售后')" :description="details.auditTime" />
        <el-step :title="$t('退款处理')" :description="details.completionTime" />
        <el-step :title="$t('售后完成')" :description="details.completionTime" />
      </el-steps>
      <el-steps
        v-show="details.type == 3"
        :space="400"
        :active="stepsActive"
        align-center
        finish-status="success"
      >
        <el-step :title="$t('买家申请售后')" :description="details.createTime" />
        <el-step :title="$t('商家处理售后')" :description="details.auditTime" />
        <el-step :title="$t('货物退回')" :description="details.inspectionDate" />
        <el-step :title="$t('退款处理')" :description="details.completionTime" />
        <el-step :title="$t('售后完成')" :description="details.completionTime" />
      </el-steps>
      <el-steps
        v-show="details.type == 4"
        :space="400"
        :active="stepsActive"
        align-center
        finish-status="success"
      >
        <el-step :title="$t('买家申请售后')" :description="details.createTime" />
        <el-step :title="$t('商家处理售后')" :description="details.auditTime" />
        <el-step :title="$t('货物退回')" :description="details.inspectionDate" />
        <el-step :title="$t('售后完成')" :description="details.completionTime" />
      </el-steps>
      <!-- 审核状态 -->
      <el-row style="margin-top: 30px;border-top: 1px solid #EEF5F9;">
        <el-col :span="24">
          <!-- 待审核 -->
          <el-card v-if="details.returnStatus == 4000" shadow="never">
            <div>
              <div class="inline_div bold_font">{{ enumMap.SO_RETURN_STATUS[details.returnStatus] }}</div>
              <el-link
                name="portal_openWindow"
                @click="$portal.openWindow('/oms-web/public/flow/chart?flow=SO_RETURN&flowCode=' + details.returnCode,'FlowChart-SO_RETURN-' + details.returnCode)"
              >&nbsp;</el-link>
              <div class="inline_div">
                {{ $t('剩余') }}&nbsp;
                <span style="color: red">{{ initAutoAuditTime() }}</span>
              </div>
              <div class="inline_div">{{ $t('逾期未处理系统将自动同意买家售后请求') }}</div>
            </div>
            <div style="margin-top: 20px">
              <ody-button
                v-if="!details.outReturnCode"
                name="OmsOrderSalesList_Audit_showDialog"
                code="OmsOrderSalesList_Audit"
                size="small"
                @click="showDialog('拒绝', 1, false)"
              >{{ $t('拒绝') }}</ody-button>
              <ody-button
                v-if="!details.outReturnCode"
                name="OmsOrderSalesList_Audit_showDialog7"
                code="OmsOrderSalesList_Audit"
                type="primary"
                size="small"
                @click="showDialog($t('同意'), 1, true)"
              >{{ $t('同意') }}</ody-button>
            </div>
          </el-card>
          <!-- 待验货 -->
          <el-card v-else-if="details.returnStatus == 4030" shadow="never">
            <div>
              <div class="inline_div bold_font">{{ enumMap.SO_RETURN_STATUS[details.returnStatus] }}</div>
              <el-link
                name="portal_openWindow8"
                @click="$portal.openWindow('/oms-web/public/flow/chart?flow=SO_RETURN&flowCode=' + details.returnCode,'FlowChart-SO_RETURN-' + details.returnCode)"
              >&nbsp;</el-link>
              <div class="inline_div">根据买家寄回货物情况，选择相应处理</div>
            </div>
            <div style="margin-top: 20px">
              <ody-button
                v-if="!details.outReturnCode"
                name="OmsOrderSalesList_Check_Goods_showDialog"
                code="OmsOrderSalesList_Check_Goods"
                type="primary"
                size="small"
                @click="showDialog((details.type == 4 ? '验货通过' : '验货通过并退款'), 2, true)"
              >{{ details.type == 4 ? '验货通过' : '验货通过并退款' }}</ody-button>
              <ody-button
                v-if="!details.outReturnCode"
                name="OmsOrderSalesList_Check_Goods_showDialog7"
                code="OmsOrderSalesList_Check_Goods"
                type="primary"
                size="small"
                @click="showDialog((details.type == 4 ? '验货不通过' : '拒绝退款'), 2, false)"
              >{{ details.type == 4 ? '验货不通过' : '拒绝退款' }}</ody-button>
            </div>
          </el-card>
          <!-- 其他状态 -->
          <el-card v-else shadow="never">
            <div>
              <div class="inline_div bold_font">{{ enumMap.SO_RETURN_STATUS[details.returnStatus] }}</div>
              <el-link
                name="portal_openWindow4"
                @click="$portal.openWindow('/oms-web/public/flow/chart?flow=SO_RETURN&flowCode=' + details.returnCode,'FlowChart-SO_RETURN-' + details.returnCode)"
              >&nbsp;</el-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-bottom: 20px" class="hzf">
      <!-- 详情 -->
      <el-row>
        <el-col :span="8">
          <el-card
            :body-style="{ height: rowHeight + 'px'}"
            shadow="never"
            class="f14"
            style="border: none; border-right: 1px solid #EEF5F9;"
          >
            <div class="title_div f14 oneColor bold">
              {{ $t('after_sale_details') }}
              <!--售后详情-->
            </div>
            <div class="details_div f14">
              <div>
                <span class="twoColor">
                  {{ $t('after_sale_single_number') }}
                  <!--售后单号-->
                  ：
                </span>
                {{ details.returnCode }}
                <i
                  v-clipboard:copy="details.returnCode"
                  v-clipboard:success="clipboardSuccess"
                  :title="$t('复制')"
                  class="el-icon-copy-document"
                  style="cursor: pointer;margin-left: 10px"
                />
              </div>
              <div>
                <span class="twoColor">
                  {{ $t('外部退款号') }}
                  <!--外部退款号-->
                  ：
                </span>
                {{ details.outReturnCode }}
              </div>
              <div>
                <span class="twoColor">
                  {{ $t('after-sale_type') }}
                  <!--售后类型-->
                  ：
                </span>
                {{ enumMap.RETURN_TYPE[details.type] }}
              </div>
              <div>
                <span class="twoColor">
                  {{ $t('aftersalesReasons') }}
                  <!--售后原因-->
                  ：
                </span>
                {{ details.returnReasonStr }}
              </div>
              <div>
                <span class="twoColor">
                  {{ $t('after_sale_application_time') }}
                  <!--申请时间-->
                  ：
                </span>
                {{ details.createTime }}
              </div>
              <div style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
                <span class="twoColor">
                  {{ $t('returnRemark') }}
                  <!--申请描述-->
                  :
                </span>
                <span :title="details.returnRemark">{{ details.returnRemark }}</span>
              </div>
              <div>
                <span class="twoColor">
                  {{ $t('备注') }}
                  ：
                </span>
                {{ details.serviceDesc }}
              </div>
              <div v-if="details.sysSource == 210001 || details.sysSource == 210009">
                <span class="twoColor">
                  <!--附件-->
                  {{ $t('common_attachment') }}：
                </span>
                <el-button
                  name="picShow"
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="picShow"
                >{{ $t('协商历史') }}</el-button>
              </div>
              <div v-if="details.sysSource != 210001 && details.sysSource != 210009">
                <span class="twoColor">
                  <!--附件-->
                  {{ $t('common_attachment') }}：
                </span>
                <a
                  v-for="(p, index) in details.returnPicVOList"
                  :key="p.id"
                  :href="p.picUrl"
                  target="_blank"
                  style="margin-right: 10px;color: #1287d6"
                >
                  {{ '附件' + (index + 1)
                  }}
                </a>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col v-if="details.type !== 4" :span="8">
          <el-card
            :body-style="{ height: rowHeight + 'px'}"
            shadow="never"
            style="border: none; border-right: 1px solid #EEF5F9;"
          >
            <div class="title_div f14 oneColor bold">
              <!--退款详情-->
              {{ $t('退款详情') }}
            </div>
            <div class="details_div f14">
              <div>
                <span class="twoColor">
                  <!--退款金额-->
                  {{ $t('refund_amount') }}：
                </span>
                {{ (totalCashReturnAmount + 0).toFixed(2) }}
              </div>
              <div>
                <span class="twoColor">
                  <!--退款状态-->
                  {{ $t('refundStatus') }}：
                </span>
                {{ enumMap.REFUND_STATUS[details.refundStatus + ''] }}
              </div>
              <div>
                <span class="twoColor">
                  <!--退款明细-->
                  {{ $t('refundDetails') }}：
                </span>
                <a
                  name="seeRefundDetails"
                  style="color: #1890FF"
                  @click="seeRefundDetails"
                >{{ $t('查看') }}</a>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            :body-style="{ height: rowHeight + 'px'}"
            shadow="never"
            style="border: none; border-right: 1px solid #EEF5F9;"
          >
            <div class="title_div f14 oneColor bold">
              <!--订单详情-->
              {{ $t('order_details') }}
            </div>
            <div class="details_div f14">
              <div>
                <span class="twoColor">
                  <!--店铺-->
                  {{ $t('order_shop') }}：
                </span>
                {{ details.storeName }}
              </div>
              <div>
                <span class="twoColor">
                  <!--订单号-->
                  {{ $t('orderNumber') }}：
                </span>
                <a name="seeOrder" style="color: #1890FF" @click="seeOrder(details.orderCode)">
                  {{ details.orderCode }}
                </a>
              </div>
              <div>
                <span class="twoColor">
                  <!--外部订单号-->
                  {{ $t('channelOrderCode') }}：
                </span>
                {{ details.outOrderCode }}
              </div>
              <div>
                <span class="twoColor">
                  <!--订单状态-->
                  {{ $t('order_status') }}：
                </span>
                {{ enumMap.ORDER_STATUS[details.orderStatus] }}
              </div>
              <div v-if="details.exchangeOrderCode">
                <span class="twoColor">
                  <!--换货订单号-->
                  {{ $t('换货订单号') }}：
                </span>
                <a name="seeOrder" style="color: #1890FF" @click="seeOrder(details.exchangeOrderCode)">
                  {{ details.exchangeOrderCode }}
                </a>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-card
      v-if="(details.type === 3 || details.type === 4) && details.returnStatus !== 4000 && details.returnStatus !== 4020 && details.returnStatus !== 9000 && details.isPickUp === 1"
    >
      <!-- 物流信息，用户退货寄回的物流信息 -->
      <el-card :body-style="{ height:'20px'}" shadow="never" style="margin-top: 20px">
        <div style="height: 100%;line-height: 50%;">物流信息</div>
      </el-card>
      <div>
        <el-row>
          <el-col :span="6">
            <el-card :body-style="{ height:'180px'}" shadow="never">
              <div class="details_div">
                <div>物流公司：{{ details.logisticsCompany }}</div>
                <div>
                  物流单号：{{ details.courierNumber }}
                  <ody-button
                    v-show="details.returnStatus === 4030"
                    name="OmsOrderSalesList_Modify_Express_editLogisticsCompany"
                    code="OmsOrderSalesList_Modify_Express"
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="editLogisticsCompany"
                  />
                </div>
                <div>收货地址：{{ details.goodReceiverProvince + details.goodReceiverCity + details.goodReceiverArea + details.goodReceiverAddress }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="18">
            <el-card
              v-if="packageCodeList != null && packageCodeList.length > 0"
              :body-style="{ height:'180px',overflowX:'auto'}"
              shadow="never"
            >
              <div class="details_div">
                {{ packageCodeList == null || packageCodeList.length == 0 ? '无物流信息' : '' }}
                <el-timeline>
                  <el-timeline-item v-for="(item, index) in packageCodeList" :key="index">
                    <div>{{ item.ftime }}&nbsp;&nbsp;&nbsp;{{ item.context }}</div>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <!-- 商品 -->
      <template shadow="never" style="margin-top: 15px;">
        <el-table :data="details.returnItemVOList" name="details_returnItemVOList853" style="width: 100%;">
          <el-table-column :label="$t('商品')" prop="productPicPath" align="center" min-width="180">
            <template slot-scope="scope">
              <div>
                <div class="inline_div" style="height: 50px;vertical-align: middle;">
                  <img :src="scope.row.productPicPath" alt style="width: 50px;height: 50px" >
                </div>
                <div class="inline_div" style="vertical-align: middle;">
                  <div style="color: #1287d6">{{ scope.row.productCname }}</div>
                  <div style="margin-top: 10px" v-html="scope.row.extInfoStr" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('manual_order_product_code')" prop="code" min-width="130" />
          <el-table-column :label="$t('bar_code')" prop="barCode" align="center" />
          <!--条形码-->
          <el-table-column
            :label="$t('after_sale_quantity')"
            prop="returnProductItemNum"
            align="center"
          />
          <!--售后数量-->
          <el-table-column :label="$t('common_unit_price')" prop="productPriceSale" align="center">
            <!--单价-->
            <template slot-scope="scope">
              <span>¥{{ scope.row.productPriceSale }}</span>
            </template>
          </el-table-column>
          <!--
          <el-table-column prop="" align="center" :label="$t('状态')">
            <template>
              {{ details.orderStatus > 1050 ? enumMap.ORDER_STATUS[details.orderStatus] : '待发货' }}
            </template>
          </el-table-column>
          -->
        </el-table>
      </template>
    </el-card>
    <!-- 退款明细 -->
    <ody-dialog-full-right :visible.sync="refundDetailsVisible" :title="$t('refundDetails')">
      <div style="margin-bottom: 15px" class="f14 oneColor bold">
        <!--退款信息-->
        {{ $t('refundInformation') }}
      </div>
      <el-card class="box-card" shadow="never">
        <div class="details_div f14">
          <div class="f14">
            <span class="twoColor">
              <!--退款状态-->
              {{ $t('refundStatus') }}：
            </span>
            {{ enumMap.REFUND_STATUS[details.refundStatus + ''] }}
          </div>
          <div class="f14">
            <span class="twoColor">
              <!--退款金额-->
              {{ $t('refund_amount') }}：
            </span>
            ¥{{ (totalCashReturnAmount + 0).toFixed(2) }}
          </div>
        </div>
      </el-card>
      <br >
      <el-card class="box-card" shadow="never">
        <el-table :data="refundment" name="refundment983" style="width: 100%;max-height: 680px;overflow-y: auto;">
          <el-table-column
            :label="$t('platformRefundNumber')"
            prop="refundmentCode"
            align="center"
            min-width="200"
          />
          <el-table-column :label="$t('refundRorm')" prop="channel" align="center" min-width="100" />
          <el-table-column
            :label="$t('refund_amount')"
            prop="amount"
            align="center"
            min-width="100"
          />
          <!--退款金额-->
          <el-table-column
            :label="$t('refundCertificateNumber')"
            prop="voucher"
            align="center"
            min-width="200"
          />
          <el-table-column
            :label="$t('refundStatus')"
            prop="refundmentStatus"
            align="center"
            min-width="100"
          />
          <el-table-column
            :label="$t('refunds_completion_time')"
            prop="refundmentTime"
            align="center"
            min-width="200"
          />
          <!--退款完成时间-->
        </el-table>
      </el-card>
      <div slot="footer">
        <el-button name="refundDetailsVisible" size="mini" @click="refundDetailsVisible = false">{{ $t('关闭') }}</el-button>
      </div>
    </ody-dialog-full-right>
    <!-- 弹出框，审核/验货 -->
    <ody-dialog
      v-if="dialogData.visible"
      :title="dialogData.title"
      :visible.sync="dialogData.visible"
      :width="(details.type == 3 || details.type == 4) && dialogData.isAgreed && dialogData.type == 1 ? '50%' : '500px'"
      lock-scroll="true"
      center
      @hide-dialog="dialogData.visible = false"
      @confirm-dialog="dialogData.visible = false"
    >
      <div slot="content">
        <el-row v-if="dialogData.isAgreed && dialogData.type == 1 && (details.type == 3 || details.type == 4)">
          <el-col :span="6" align="right">
            <ody-tip-star :content="$t('is_need_return_goods')" />
          </el-col>
          <el-radio-group v-model="dialogData.isPickUp" name="dialogData_isPickUp">
            <el-radio :label="1">{{ $t('yes') }}</el-radio>
            <el-radio :label="0">{{ $t('no') }}</el-radio>
          </el-radio-group>
        </el-row>
        <br>
        <!--- 仅退款已发货，收货地址 -->
        <el-row
          v-if="(details.type == 3 || details.type == 4) && dialogData.isAgreed && dialogData.type == 1 && dialogData.isPickUp == 1"
        >
          <el-card v-loading="dialogData.addreLoading" shadow="never" style="margin: auto">
            <el-row
              v-if="showWarehouse && (warehouseList != null && warehouseList.length > 0)"
              class="row_class"
            >
              <el-col :span="6" align="right">
                <ody-tip-star :content="$t('return_warehouse') + '：'" />
                <!--退货仓库-->
              </el-col>
              <el-col :span="14">
                <el-select
                  v-model="consigneeWarehouseId"
                  :placeholder="$t('请选择')"
                  name="consigneeWarehouseId"
                  @change="changeWarehouseAddress()"
                >
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.warehouseName"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
            </el-row>
            <el-row class="row_class">
              <el-col :span="6" align="right">
                <ody-tip-star :content="$t('收货人') + '：'" />
              </el-col>
              <el-col :span="14">
                <el-input v-model="dialogData.addreObj.consigneeName" name="dialogData_addreObj_consigneeName" maxlength="20" />
              </el-col>
            </el-row>
            <el-row class="row_class">
              <el-col :span="6" align="right">
                <ody-tip-star :content="$t('consignee_cell_phone') + '：'" />
                <!--收货人手机-->
              </el-col>
              <el-col :span="14">
                <el-input v-model="dialogData.addreObj.consigneeMobile" name="dialogData_addreObj_consigneeMobile" maxlength="20" />
              </el-col>
            </el-row>
            <el-row class="row_class">
              <el-col :span="6" align="right">
                <ody-tip-star :content="$t('Returnaddress') + '：'" />
                <!--退货地址-->
              </el-col>
              <el-col :span="14">
                <el-row>
                  <el-col :span="7">
                    <el-select
                      id="s_province"
                      v-model="dialogData.addreObj.provinceCode"
                      name="s_province"
                      @change="queryArea(dialogData.addreObj.provinceCode, 2)"
                    >
                      <el-option :label="$t('please_choose')" />
                      <el-option
                        v-for="item in provinces"
                        :label="item.name"
                        :key="item.code"
                        :value="item.code"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <el-select
                      id="s_city"
                      v-model="dialogData.addreObj.cityCode"
                      name="s_city"
                      @change="queryArea(dialogData.addreObj.cityCode, 3)"
                    >
                      <el-option :label="$t('please_choose')" />
                      <el-option
                        v-for="item in citys"
                        :label="item.name"
                        :key="item.code"
                        :value="item.code"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <el-select id="s_area" v-model="dialogData.addreObj.regionCode" name="s_area">
                      <el-option :label="$t('please_choose')" />
                      <el-option
                        v-for="item in regions"
                        :label="item.name"
                        :key="item.code"
                        :value="item.code"
                      />
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="row_class">
              <el-col :span="6" align="right">
                <ody-tip-star :content="$t('common_addressDetail') + '：'" />
                <!--详细地址-->
              </el-col>
              <el-col :span="14">
                <el-input v-model="dialogData.addreObj.detailAddress" name="dialogData_addreObj_detailAddress" />
              </el-col>
            </el-row>
          </el-card>
          <br>
        </el-row>
        <el-row
          v-if="dialogData.isAgreed && dialogData.type == 1 && (details.type == 3 || details.type == 2)"
        >
          <el-col :span="6" align="right">
            <ody-tip-star :content="$t('return_freight')" />
          </el-col>
          <el-radio-group v-model="dialogData.isReturnFreight" name="dialogData_isReturnFreight">
            <el-radio :label="1">{{ $t('yes') }}</el-radio>
            <el-radio :label="0">{{ $t('no') }}</el-radio>
          </el-radio-group>
        </el-row>
        <el-row
          v-if="dialogData.isAgreed && (dialogData.type == 1 || dialogData.type == 2) && details.type != 4"
          class="row_class"
        >
          <el-col :span="6" align="right">
            {{ $t('applyReturnAmount') }}:&nbsp;&nbsp;
            <!--申请退款金额-->
          </el-col>
          <el-col :span="14">
            <span>¥{{ (dialogData.sumApplyReturnAmount + 0).toFixed(2) }}</span>
          </el-col>
        </el-row>
        <!--- 仅退款已发货 / 退货退款 / 换货，补偿金额 -->
        <el-row
          v-if="(details.type == 2 || details.type == 3 || details.type == 4) && dialogData.isAgreed && dialogData.type == 1"
          class="row_class"
        >
          <el-col :span="6" align="right">
            {{ $t('compensationAmount') }}:&nbsp;&nbsp;
            <!--补偿金额-->
          </el-col>
          <el-col :span="14">
            <ody-input-number
              :decimal="2"
              v-model="dialogData.compensatoryAmount"
              :min="0"
              :empty-tip="false"
              name="dialogData_compensatoryAmount"
              @input="compensatoryAmountChange"
            />
          </el-col>
        </el-row>
        <el-row
          v-if="dialogData.isAgreed && (dialogData.type == 1 || dialogData.type == 2) && details.type !== 4"
          class="row_class"
        >
          <el-col :span="6" align="right">
            {{ $t('totalAmountAftersaleReceiptRefund') }}:&nbsp;&nbsp;
            <!--退款金额合计-->
          </el-col>
          <el-col :span="14">
            <span>¥{{ (Number(dialogData.sumApplyReturnAmount) + Number(dialogData.compensatoryAmount)).toFixed(2) }}</span>
          </el-col>
        </el-row>
        <!--<el-row v-if="!dialogData.isAgreed && dialogData.type == 2" class="row_class">
          <el-col :span="8" align="right">拒绝原因：</el-col>
          <el-col :span="16">
            <select>
              <option>验货不通过</option>
            </select>
          </el-col>
        </el-row>-->
        <el-row class="row_class">
          <el-col :span="6" align="right">
            <ody-tip-star :content="$t('contract_remark') + '：'" />
            <!--备注-->
          </el-col>
          <el-col :span="14">
            <el-input
              v-model="dialogData.remake"
              name="dialogData_remake"
              type="textarea"
              placeholder
              maxlength="200"
              rows="6"
            />
          </el-col>
        </el-row>
        <el-row class="row_class">
          <el-col :span="6" align="right">
            {{ $t('common_attachment') }}
            <!--附件-->
            ：
          </el-col>
          <el-col :span="14">
            <ody-upload-image
              :limit="3"
              :file-list.sync="dialogData.files"
              :pic-type="['png','jpg','gif']"
            />
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <ody-button
          name="OmsOrderSalesListConfirm_doConfirm"
          type="primary"
          size="small"
          timer="1500"
          code="OmsOrderSalesListConfirm"
          @click="doConfirm(true)"
        >{{ $t('确认') }}</ody-button>
        <el-button name="doConfirm" size="small" @click="doConfirm(false)">{{ $t('取消') }}</el-button>
      </span>
    </ody-dialog>
    <ody-dialog
      :visible.sync="companyDialogVisible"
      :before-close="handleClose"
      :title="$t('编辑配送信息')"
      width="600px"
    >
      <div class="details_div f14">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
          <el-form-item :label="$t('配送商:')" prop="companyName">
            <el-select v-model="ruleForm.companyName" :placeholder="$t('请选择')" name="ruleForm_companyName" popper-class="selectStyle">
              <el-option
                v-for="item in enumMap.EXPRESS_CONFIG"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('运单号:')" prop="logisticsNum">
            <el-input v-model="ruleForm.logisticsNum" name="ruleForm_logisticsNum" maxlength="18" style="width: 200px" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button name="submitForm" type="primary" size="small" @click="submitForm('ruleForm')">确认</el-button>
        <el-button name="resetForm" size="small" @click="resetForm('ruleForm')">取消</el-button>
      </span>
    </ody-dialog>
    <ody-dialog
      :visible.sync="msgDialogVisible"
      :before-close="msgClose"
      :title="$t('查询退款留言')"
      width="480px"
    >
      <el-card v-for="pic in msgList" :key="pic">
        <div>
          <span v-if="pic.ownerRole === '1'" class="twoColor">买家:</span>
          <span v-if="pic.ownerRole === '2'" class="twoColor">卖家:</span>
          <span v-if="pic.ownerRole === '3'" class="twoColor">小二:</span>
          <span class="twoColor">{{ pic.ownerNick }}</span>
          <span class="twoColor">留言时间：{{ pic.created | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <div v-if="pic.picUrls">
            <span class="twoColor">附件:</span>
            <a
              v-for="(p, index) in pic.picUrls"
              :key="index"
              :href="p.url"
              target="_blank"
              style="margin-right: 10px;color: #1287d6"
            >
              {{ '附件' + (index + 1)
              }}
            </a>
          </div>
          <span class="twoColor">留言信息:</span>
          <span>{{ pic.content.replace(/\\n/gm,"。") }}</span>
        </div>
      </el-card>
    </ody-dialog>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import soUtils from '@/utils/soUtils'
// returnStatus: 4000待审核,4010审核通过,4020审核不通过,4030待验货,4040验货通过,4041验货不通过,4099已完成,9000已关闭
// refundStatus: 1未退款,2已退款
// type: 1仅退款未发货, 2仅退款已发货, 3退款退货，4 换货
export default {
  name: 'OmsOrderSalesListManagementDetail',
  data() {
    var validatesNums = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('运单号不能为空'))
      }
      return callback()
    }
    return {
      ruleForm: {
        companyName: null,
        logisticsNum: null
      },
      rules: {
        companyName: [
          { required: true, message: '请选择配送商', trigger: 'change' }
        ],
        logisticsNum: [{ validator: validatesNums, trigger: 'blur' }]
      },
      msgDialogVisible: false,
      companyDialogVisible: false,
      rowHeight: 280,
      stepsActive: 1,
      refundDetailsVisible: false,
      details: {},
      soTypeList: {},
      dialogData: this.getDialogData(),
      storeAddressList: [],
      provinces: [],
      warehouseList: [],
      storeSettings: [],
      citys: [],
      regions: [],
      storeAddressData: [],
      showWarehouse: true,
      msgList: [],
      enumMap: {
        RETURN_TYPE: {},
        SO_RETURN_STATUS: {},
        ORDER_RETURN_SOURCE: {},
        CHANNELS: {},
        ORDER_STATUS: {},
        REFUNDMENT_TYPE: {},
        ORDER_PAYMENT_GATEWAY_DSC: {},
        REFUND_STATUS: {},
        GODDS_RETURN_TYPE: {},
        EXPRESS_CONFIG: {},
        EXPRESS_CONFIG_1: {}
      },
      consigneeWarehouseId: null,
      refundment: [],
      returnPayStatusStr: null,
      totalCashReturnAmount: 0, // 售后单退款金额
      totalPointReturnAmount: 0, // 售后单退款积分金额
      packageCodeList: [], // 物流信息，用户退货寄回的物流信息
      tempRoute: {}
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    language() {
      this.setTagsViewTitle()
    }
  },
  created() {
    this.init()
    this.tempRoute = Object.assign({}, this.$route)
    this.setTagsViewTitle()
  },
  methods: {
    picShow() {
      this.msgDialogVisible = true
    },
    msgClose() {
      this.msgDialogVisible = false
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$oms.$api.soReturn
            .soReturnUpdate({
              courierNumber: this.ruleForm.logisticsNum,
              id: this.details.id,
              logisticsCompany: this.enumMap.EXPRESS_CONFIG_1[
                this.ruleForm.companyName
              ],
              logisticsCompanyId: this.ruleForm.companyName,
              orderCode: this.details.orderCode,
              sendBackStatus: 1
            })
            .then(res => {
              if (res.code === '0') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.companyDialogVisible = false
                this.init()
              }
            })
        }
      })
    },
    handleClose() {
      this.$refs['ruleForm'].resetFields()
      this.companyDialogVisible = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.companyDialogVisible = false
    },
    editLogisticsCompany() {
      console.log(this.enumMap.EXPRESS_CONFIG_1)
      this.ruleForm.companyName = this.details.logisticsCompany
      this.ruleForm.logisticsNum =
        this.details.courierNumber === null ? null : this.details.courierNumber
      this.companyDialogVisible = true
    },
    setTagsViewTitle() {
      const title = this.$t('售后单详情')
      const route = Object.assign({}, this.tempRoute, {
        title: this.$route.params.id ? `${title}-${this.$route.params.id}` : `${title}-${this.$route.params.returnCode}`
      })
      this.$store.dispatch('updateVisitedView', route)
    },
    init() {
      const enumMap = this.$oms.$api.common.listByCategorysForOrder({
        categorys: [
          'RETURN_TYPE',
          'SO_RETURN_STATUS',
          'ORDER_STATUS',
          'GODDS_RETURN_TYPE',
          'RETURN_REASON_1',
          'RETURN_REASON_2',
          'RETURN_REASON_3',
          'SYS_SOURCE',
          'SEND_BACK_STATUS',
          'INSPECTION_RESULT',
          'PAY_TYPE',
          'REFUND_STATUS',
          'REFUNDMENT_TYPE',
          'EXPRESS_CONFIG',
          'ORDER_PAYMENT_GATEWAY_DSC',
          'ORDER_RETURN_SOURCE',
          'EXPRESS_CONFIG'
        ]
      })
      const channels = this.$oms.$api.common.listAllChannels()
      const soTypeList = this.$oms.$api.soType.soTypeList({})
      const details = this.$oms.$api.soReturn.soReturnDetailGet({
        id: this.$route.params.id,
        returnCode: this.$route.params.returnCode
      })
      Promise.all([enumMap, channels, soTypeList, details]).then(resp => {
        for (const i of resp[0].data.GODDS_RETURN_TYPE) {
          this.enumMap.GODDS_RETURN_TYPE[i.code] = i.name
        }
        for (const i of resp[0].data.REFUNDMENT_TYPE) {
          this.enumMap.REFUNDMENT_TYPE[i.code] = i.name
        }
        for (const i of resp[0].data.ORDER_PAYMENT_GATEWAY_DSC) {
          this.enumMap.ORDER_PAYMENT_GATEWAY_DSC[i.code] = i.name
        }
        for (const i of resp[0].data.REFUND_STATUS) {
          this.enumMap.REFUND_STATUS[i.code] = i.name
        }
        for (const i of resp[0].data.RETURN_TYPE) {
          this.enumMap.RETURN_TYPE[i.code] = i.name
        }
        for (const i of resp[0].data.SO_RETURN_STATUS) {
          this.enumMap.SO_RETURN_STATUS[i.code] = i.name
        }
        for (const i of resp[0].data.ORDER_RETURN_SOURCE) {
          this.enumMap.ORDER_RETURN_SOURCE[i.code] = i.name
        }
        for (const i of resp[0].data.ORDER_STATUS) {
          this.enumMap.ORDER_STATUS[i.code] = i.name
        }
        for (const i of resp[0].data.EXPRESS_CONFIG) {
          this.enumMap.EXPRESS_CONFIG_1[i.code] = i.name
        }
        this.enumMap.EXPRESS_CONFIG = resp[0].data.EXPRESS_CONFIG
        this.enumMap.CHANNELS = resp[1].data //  Cannot read property 'channelName' of undefined

        for (const i of resp[2].data) {
          this.soTypeList[i.code] = i.name
        }

        for (const item of resp[3].data.returnItemVOList) {
          if (item.extInfoStr) {
            item.extInfoStr = item.extInfoStr.replace(/\n/g, '<br/>')
          }
          if (item.productTotalAmount) {
            item.productTotalAmount = item.productTotalAmount.toFixed(2)
          }
          item.returnInventoryPurchaseAmount = (
            0 +
            item.returnProductItemNum *
              (item.productTotalAmount / item.productItemNum)
          ).toFixed(2)
          if (item.applyReturnAmount) {
            item.applyReturnAmount = item.applyReturnAmount.toFixed(2)
          }
        }
        this.details = resp[3].data
        this.initPayInfo()
        this.getPicUrls()
        this.initSteps()
        if (this.details.type === 3 || this.details.type === 4) {
          this.initStoreAddressList()
          // eslint-disable-next-line no-unused-vars
          const storeaddress = this.$oms.$api.common.queryStoreSetting({
            orgId: this.details.storeId
          })
          // eslint-disable-next-line no-unused-vars
          const stroeWarehouse = this.$oms.$api.common.listStoreWarehouse({
            merchantId: this.details.merchantId
          })
          Promise.all([storeaddress, stroeWarehouse]).then(resp => {
            this.storeSettings = resp[0].data
            this.warehouseList = resp[1].data
            if (resp[0].data != null) {
              const resultData = resp[0].data
              if (resultData.warehouseId && this.warehouseList) {
                const list = this.warehouseList.filter(
                  w => w.warehouseCode === resultData.warehouseId
                )
                this.consigneeWarehouseId =
                  list && list.length > 0 ? list[0].id : null
              }
              if (resultData.backFlag === 1) {
                // 按地址退回
                this.showWarehouse = false
                this.$oms.$api.common
                  .queryStoreAddressList({
                    storeId: resultData.orgId
                  })
                  .then(resp => {
                    if (resp.data != null && resp.data.length > 0) {
                      this.storeAddressData = resp.data
                      this.dialogData.addreObj.provinceCode = this.storeAddressData[0].provinceCode
                      this.dialogData.addreObj.cityCode = this.storeAddressData[0].cityCode
                      this.dialogData.addreObj.regionCode = this.storeAddressData[0].regionCode
                      this.dialogData.addreObj.consigneeName = this.storeAddressData[0].contactPerson
                      this.dialogData.addreObj.consigneeMobile = this.storeAddressData[0].contactTelephone
                      this.dialogData.addreObj.detailAddress = this.storeAddressData[0].detailAddress
                      this.getAddressData(
                        this.dialogData.addreObj.provinceCode,
                        this.dialogData.addreObj.cityCode,
                        this.dialogData.addreObj.regionCode
                      )
                    }
                  })
              } else {
                // 按仓库退回
                this.showWarehouse = true
                this.changeWarehouseAddress()
              }
            } else {
              this.queryArea('100000', 1)
            }
          })
          this.queryReturnExpressPackage()
        }
      })
    },
    initReturnAddress() {
      if (
        (this.dialogData.returnType === 3 || this.dialogData.returnType === 4) &&
        this.dialogData.isAgreed &&
        this.dialogData.type === 1 &&
        this.provinces.length === 0
      ) {
        this.queryArea(100000, 1)
      }
    },
    queryReturnExpressPackage() {
      if (this.details.logisticsCompanyId && this.details.courierNumber) {
        this.$oms.$api.soReturn
          .queryReturnExpressPackage({
            logisticsCompany: this.details.logisticsCompanyId,
            courierNumber: this.details.courierNumber
          })
          .then(resp => {
            if (resp.data) {
              this.packageCodeList = resp.data
            }
          })
      }
    },
    changeWarehouseAddress: function() {
      var warehouseCode = null
      if (this.warehouseList && this.consigneeWarehouseId) {
        var list = this.warehouseList.filter(
          item => item.id === this.consigneeWarehouseId
        )
        if (list != null && list.length > 0) {
          warehouseCode = list[0].warehouseCode
        }
      }
      this.$oms.$api.common
        .queryWarehouseAddress({
          currentPage: 1,
          itemsPerPage: 100,
          warehouseCodes: [warehouseCode]
        })
        .then(resp => {
          if (resp.data.listObj.length > 0) {
            var result = resp.data.listObj[0]
            this.dialogData.addreObj.provinceCode = result.provinceCode
            this.dialogData.addreObj.cityCode = result.cityCode
            this.dialogData.addreObj.regionCode = result.districtCode
            this.dialogData.addreObj.consigneeName = result.warehouseContacter
            this.dialogData.addreObj.consigneeMobile =
              result.warehouseContacterMobile
            this.dialogData.addreObj.detailAddress = result.address
            this.getAddressData(
              this.dialogData.addreObj.provinceCode,
              this.dialogData.addreObj.cityCode,
              this.dialogData.addreObj.regionCode
            )
          }
        })
    },
    getAddressData(provinceCode, cityCode, regionCode) {
      this.$oms.$api.common
        .getAreaListNoPaging({ filters: { code: provinceCode, level: 1 }})
        .then(data => {
          this.provinces = data.data
        })

      this.$oms.$api.common
        .getAreaListNoPaging({ filters: { code: cityCode, level: 2 }})
        .then(data => {
          this.citys = data.data
        })

      this.$oms.$api.common
        .getAreaListNoPaging({ filters: { code: regionCode, level: 3 }})
        .then(data => {
          this.regions = data.data
        })
    },
    initStoreAddressList() {
      if (this.details.storeId != null) {
        this.$oms.$api.common
          .queryStoreAddressList({
            storeId: this.details.storeId
          })
          .then(resp => {
            if (resp.data && resp.data.length > 0) {
              for (var i in resp.data) {
                if (resp.data[i].addressType === 1) {
                  this.storeAddressList.push(resp.data[i])
                }
              }
            }
          })
      }
    },
    initPayInfo() {
      var param = {
        page: 1,
        limit: 500,
        filters: {
          orderCode: this.details.orderCode,
          returnCode: this.details.returnCode
        }
      }
      // this.returnPayStatusStr = this.$t('return_pay_unfinished')

      // if (this.details.refundStatus === 2) {
      //   this.returnPayStatusStr = this.$t('return_pay_finished')
      // }
      if (this.details.freight == null) {
        this.details.freight = 0
      }
      this.totalCashReturnAmount =
        Number(this.details.actualReturnAmount) +
        Number(this.details.actualReturnAmount > 0 ? this.details.freight : 0)
      this.$oms.$api.refundment.refundmentList(param).then(resp => {
        for (const item of resp.data) {
          item.refundmentType = this.enumMap.REFUNDMENT_TYPE[
            item.refundmentType + ''
          ]
          item.amount = (item.channel !== '1002'
            ? item.amount
            : item.originalAmount
          ).toFixed(2)
          item.channel = this.enumMap.ORDER_PAYMENT_GATEWAY_DSC[
            item.channel + ''
          ]
          item.refundmentStatus = this.enumMap.REFUND_STATUS[
            item.refundmentStatus + ''
          ]
          if (item.channel === '1002' && item.originalAmount) {
            this.totalPointReturnAmount += item.originalAmount
          }
          // if (item.refundmentStatus === 2) {
          //   this.returnPayStatusStr = this.$t('return_pay_finished')
          // }
        }
        this.refundment = resp.data
      })
    },
    initSteps() {
      // refundStatus: 1未退款,2已退款
      // type: 1仅退款未发货, 2仅退款已发货, 3退款退货, 4换货
      // returnStatus: 4000待审核,4010审核通过,4020审核不通过,4030待验货,4040验货通过,4041验货不通过,4099已完成,9000已关闭
      const returnStatus = this.details.returnStatus
      const refundStatus = this.details.refundStatus
      var steps = 1
      if (returnStatus === 4099 || returnStatus === 4020 || returnStatus === 4041 || returnStatus === 9000) {
        steps = 5
      } else if (refundStatus === 2) {
        steps = 4
      } else if (returnStatus === 4000) {
        steps = 1
      } else if (returnStatus === 4010) {
        steps = 2
      } else if (returnStatus === 4040) {
        steps = 3
      }
      if (this.details.type !== 3 && steps > 3) {
        steps = steps - 1
      }
      this.stepsActive = steps
    },
    getPicUrls() {
      if (
        (this.details.sysSource === '210001' ||
          this.details.sysSource === '210009') &&
        this.details.outReturnCode != null
      ) {
        this.$oms.$api.soReturn
          .getTmallPicUrls({
            outRefundId: this.details.outReturnCode,
            storeId: this.details.storeId + '',
            sysSource: this.details.sysSource
          })
          .then(res => {
            if (res.data !== '') {
              this.msgList = res.data
            }
          })
      }
    },
    initAutoAuditTime() {
      let countDownStr = ''
      const endTime = new Date(this.details.deadlineTime)
      let runTime = parseInt((endTime - new Date().getTime()) / 1000)
      const day =
        Math.floor(runTime / 86400) > 0 ? Math.floor(runTime / 86400) : ''
      if (day !== '') {
        countDownStr = countDownStr + day + '天'
      }
      runTime = runTime % 86400
      const hour =
        Math.floor(runTime / 3600) > 0 ? Math.floor(runTime / 3600) : ''
      if (hour !== '') {
        countDownStr = countDownStr + hour + 'h'
      }
      runTime = runTime % 3600
      const minute =
        Math.floor(runTime / 60) > 0 ? Math.floor(runTime / 60) : ''
      if (minute !== '') {
        countDownStr = countDownStr + minute + 'm'
      }
      if (countDownStr === '') {
        countDownStr = '0分钟'
      }
      return countDownStr
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1000
      })
    },
    seeOrder(orderCode) {
      if (!orderCode) {
        orderCode = this.details.orderCode
      }
      soUtils.toOrderDetail(this, orderCode)
    },
    seeRefundDetails() {
      this.refundDetailsVisible = true
    },
    compensatoryAmountChange() {
      if (this.dialogData.compensatoryAmount < 0) {
        this.dialogData.compensatoryAmount = 0
      }
    },
    getSumApplyReturnAmount() {
      var sumApplyReturnAmount = this.details.applyReturnAmount
      return sumApplyReturnAmount
    },
    selectAddre(addre) {
      this.dialogData.consigneeName = addre.contactPerson
      this.dialogData.consigneeMobile = addre.contactTelephone
      this.dialogData.consigneeAddress = addre.addressAll
      this.dialogData.addreVisible = false
    },
    queryArea(code, level) {
      const filtersForAera = {
        parentCode: code,
        level: level
      }
      const vue = this
      if (!code) {
        if (level === 1) {
          vue.provinces = []
          vue.citys = []
          vue.regions = []
        } else if (level === 2) {
          vue.citys = []
          vue.regions = []
        } else {
          vue.regions = []
        }
        return
      }
      this.$oms.$api.common
        .getAreaListNoPaging({ filters: filtersForAera })
        .then(data => {
          if (level === 1) {
            vue.provinces = data.data
          }
          if (level === 2) {
            vue.dialogData.addreObj.cityCode = null
            vue.dialogData.addreObj.regionCode = null
            vue.citys = data.data
          }
          if (level === 3) {
            vue.dialogData.addreObj.regionCode = null
            vue.regions = data.data
          }
        })
    },
    async confirmEditAddre() {
      const addre = this.dialogData.addreObj
      if (!addre.consigneeName) {
        this.$message('收货人不能为空')
        return
      }
      if (!addre.consigneeMobile) {
        this.$message('收货人手机号')
        return
      } else if (
        !/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/.test(
          addre.consigneeMobile
        )
      ) {
        this.$message('请填写正确的手机号')
        return
      }
      if (!addre.regionCode) {
        this.$message('请选择完整的退货地址')
        return
      }
      if (!addre.detailAddress) {
        this.$message('详细地址不能为空')
        return
      }
      this.dialogData.consigneeName = addre.consigneeName
      this.dialogData.consigneeMobile = addre.consigneeMobile
      this.dialogData.consigneeAddress = this.getAddressAll()
      // this.dialogData.consigneeAddress = await this.getAddressInfo(addre.provinceCode, addre.cityCode, addre.regionCode, addre.detailAddress)
      // this.dialogData.addreObj = {}
      this.dialogData.editVisible = false
    },
    async showDialog(title, type, isAgreed) {
      this.dialogData.title = title
      this.dialogData.type = type
      this.dialogData.returnType = this.details.type
      this.dialogData.isAgreed = isAgreed
      this.dialogData.visible = true
      this.dialogData.sumApplyReturnAmount = this.getSumApplyReturnAmount()
      if (this.details.type === 3 || this.details.type === 4) {
        this.dialogData.isPickUp = 1 // 退货退款/换货默认寄回商品
      }
      // this.dialogData.consigneeName = this.details.consigneeName
      // this.dialogData.consigneeMobile = this.details.consigneeMobile
      // this.dialogData.consigneeAddress = this.details.consigneeAddress
      // if (!this.dialogData.consigneeAddress && this.storeAddressList && this.storeAddressList.length > 0) {
      //   this.dialogData.addreLoading = true
      //   var defaultAddre = this.storeAddressList[0]
      //   for (var i in this.storeAddressList) {
      //     const addre = this.storeAddressList[i]
      //     if (!addre.addressAll) {
      //       try {
      //         // this.storeAddressList[i].addressAll = await this.getAddressInfo(addre.provinceCode, addre.cityCode, addre.regionCode, addre.detailAddress)
      //       } catch (e) {
      //         console.error(e)
      //       }
      //     }
      //     if (addre.isDefault === 1) {
      //       defaultAddre = this.storeAddressList[i]
      //     }
      //   }
      //   this.dialogData.addreLoading = false
      //   this.dialogData.consigneeName = defaultAddre.contactPerson
      //   this.dialogData.consigneeMobile = defaultAddre.contactTelephone
      //   this.dialogData.consigneeAddress = defaultAddre.addressAll
      // }
      this.initReturnAddress()
    },
    async getAddressByCode(provinceCode, cityCode, regionCode) {
      var result = await this.$oms.$api.common.getAreaListNoPaging({
        filters: { parentCode: 0 }
      })
      const country = result.data[0]
      result = await this.$oms.$api.common.getAreaListNoPaging({
        filters: { parentCode: country.code }
      })
      const province = result.data.filter(item => item.code === provinceCode)[0]
      result = await this.$oms.$api.common.getAreaListNoPaging({
        filters: { parentCode: province.code }
      })
      const city = result.data.filter(item => item.code === cityCode)[0]
      result = await this.$oms.$api.common.getAreaListNoPaging({
        filters: { parentCode: city.code }
      })
      const region = result.data.filter(item => item.code === regionCode)[0]
      return {
        provinceName: province.name,
        cityName: city.name,
        regionName: region.name
      }
    },
    getAddressAll() {
      const provinceName = this.provinces.filter(
        item => item.code === this.dialogData.addreObj.provinceCode
      )[0].name
      const cityName = this.citys.filter(
        item => item.code === this.dialogData.addreObj.cityCode
      )[0].name
      const regionName = this.regions.filter(
        item => item.code === this.dialogData.addreObj.regionCode
      )[0].name
      return [
        provinceName,
        cityName,
        regionName,
        this.dialogData.addreObj.detailAddress
      ]
        .filter(item => item != null)
        .join(' ')
        .trim()
    },
    async getAddressInfo(provinceCode, cityCode, regionCode, detailAddress) {
      const obj = await this.getAddressByCode(
        provinceCode,
        cityCode,
        regionCode
      )
      return [obj.provinceName, obj.cityName, obj.regionName, detailAddress]
        .filter(item => item != null)
        .join(' ')
    },
    getDialogData() {
      return {
        title: '', // 标题
        type: 1, // 1 审核，2验收
        visible: false,
        addreVisible: false,
        editVisible: false,
        isAgreed: false, // 同意/拒绝
        files: [], // 附件
        compensatoryAmount: null, // 补偿金额
        sumApplyReturnAmount: null, // 退款金额
        remake: null, // 备注
        addreObj: {
          provinceCode: null,
          cityCode: null,
          regionCode: null,
          consigneeName: null,
          consigneeMobile: null,
          detailAddress: null
        },
        addreLoading: false,
        consigneeName: null, // 商家收件人
        consigneeMobile: null, // 联系人手机
        consigneeAddress: null, // 商家收件地址
        consigneeWarehouseId: null, // 仓库ID
        isPickUp: null,
        isReturnFreight: 0 // 默认不退运费
      }
    },
    async doConfirm(confirm) {
      if (confirm) {
        const addre = this.dialogData.addreObj
        if (
          this.dialogData.type === 1 &&
          (this.details.type === 3 || this.details.type === 4) &&
          this.dialogData.isAgreed &&
          this.dialogData.isPickUp === 1
        ) {
          if (!addre.consigneeName) {
            this.$message('收货人不能为空')
            return
          }
          if (!addre.consigneeMobile) {
            this.$message('收货人手机号')
            return
          } else if (
            !/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/.test(
              addre.consigneeMobile
            )
          ) {
            this.$message('请填写正确的手机号')
            return
          }
          if (!addre.regionCode) {
            this.$message('请选择完整的退货地址')
            return
          }
          if (!addre.detailAddress) {
            this.$message('详细地址不能为空')
            return
          }
          if (this.dialogData.isPickUp === null) {
            this.$message(this.$t('is_need_return_goods_required'))
            return
          }
          if (this.dialogData.isReturnFreight === null) {
            this.$message(this.$t('return_freight_required'))
            return
          }
          this.dialogData.consigneeName = addre.consigneeName
          this.dialogData.consigneeMobile = addre.consigneeMobile
          this.dialogData.consigneeAddress = await this.getAddressInfo(
            addre.provinceCode,
            addre.cityCode,
            addre.regionCode,
            addre.detailAddress
          )
        }

        const returnId = this.details.id
        var returnPicDTOList = null
        var returnAttachmentVOList = null
        if (this.dialogData.files && this.dialogData.files.length > 0) {
          returnPicDTOList = []
          returnAttachmentVOList = []
          for (let i = 0; i < this.dialogData.files.length; i++) {
            returnAttachmentVOList.push({
              name: this.dialogData.files[i].fileName,
              path: this.dialogData.files[i].url
            })
            returnPicDTOList.push({
              returnId: returnId,
              orderCode: this.details.orderCode,
              picUrl: this.dialogData.files[i].url,
              type: 2
            })
          }
        }
        if (!this.dialogData.remake) {
          this.$message('备注不能为空')
          return
        }
        if (this.dialogData.remake.length > 200) {
          this.$message('备注字符不能大于200')
          return
        }
        var result = null
        if (this.dialogData.isAgreed) {
          // 同意
          // if (this.compensatoryAmount == null && this.dialogData.type === 1 && (this.details.type === 2 || this.details.type === 3)) {
          //   this.$message('补偿金额不能为空')
          // }
          if (this.dialogData.type === 1) {
            // 审核通过
            const param = {
              returnId: returnId,
              auditReason: this.dialogData.remake, // 原因
              returnAttachmentVOList: returnAttachmentVOList, // 附件
              compensatoryAmount: this.dialogData.compensatoryAmount, // 补偿金额
              actualReturnAmount: this.dialogData.sumApplyReturnAmount, // 实际退款金额
              actualReturnItemAmount: this.dialogData.sumApplyReturnAmount, // 申请的商品实退金额，不含运费
              isPickUp: this.dialogData.isPickUp, // 是否取货：0 否  1 是
              isReturnFreight: this.dialogData.isReturnFreight // 是否退运费 0:否  1:是
              // serviceReturnReason: '' // 客服选择的退货原因
            }
            if ((this.details.type === 3 || this.details.type === 4) && this.dialogData.isPickUp === 1) {
              // 退货退款
              param.consigneeName = this.dialogData.consigneeName
              param.consigneeMobile = this.dialogData.consigneeMobile
              param.consigneeAddress = this.dialogData.consigneeAddress
              param.goodsReturnType = 0 // 寄回方式：0 快递寄回 1 上门取件
              param.consigneeWarehouseId = this.consigneeWarehouseId
              if (!param.consigneeAddress) {
                this.$message('收货地址不能为空')
                return
              }
            } else if (this.details.type === 2) {
              // 审核同意时仅退款已发货需要选择是否退运费
              if (this.dialogData.isReturnFreight === null) {
                this.$message(this.$t('return_freight_required'))
                return
              }
            }
            result = await this.$oms.$api.soReturn.soReturnAuditPass(param)
          } else {
            // 验货通过
            result = await this.$oms.$api.soReturn.soReturnCheckGoodsPassed({
              id: returnId,
              orderCode: this.details.orderCode,
              actualReturnAmount: this.dialogData.sumApplyReturnAmount,
              serviceReturnReason: this.dialogData.remake,
              inspectionDesc: this.dialogData.remake, // 验货描述
              inspectionDate: new Date(), // 验货日期
              inspectionResult: 1, // 验货结果，1 通过，0 不通过
              returnPicDTOList: returnPicDTOList // 收货图片
              // actualReturnAmount: actualReturnAmount, // 实际退款金额
              // compensatoryAmount: null, // 补偿金额
              // serviceReturnReason: '' // 客服选择的退货原因
            })
          }
        } else {
          // 拒绝
          if (this.dialogData.type === 1) {
            if (this.details.serviceDesc != null && this.details.serviceDesc === '京东仓出货单取消成功') {
              this.$message({ type: 'error', message: '京东仓出库单取消成功的售后单不允许审核拒绝' })
              return
            }
            // 审核不通过
            result = await this.$oms.$api.soReturn.soReturnAuditNotPass({
              returnId: returnId,
              auditReason: this.dialogData.remake,
              returnAttachmentVOList: returnAttachmentVOList
            })
          } else {
            // 验货不通过
            result = await this.$oms.$api.soReturn.soReturnCheckGoodsNotPassed({
              id: returnId,
              orderCode: this.details.orderCode,
              serviceReturnReason: this.dialogData.remake,
              inspectionDesc: this.dialogData.remake, // 验货描述
              inspectionDate: new Date(), // 验货日期
              inspectionResult: 0, // 验货结果，1 通过，0 不通过
              returnPicDTOList: returnPicDTOList // 收货图片
              // actualReturnAmount: null, // 实际退款金额
              // compensatoryAmount: null, // 补偿金额
              // serviceReturnReason: '' // 客服选择的退货原因
            })
          }
        }
        if (result) {
          this.$message(result.message)
          this.dialogData.visible = false
          this.dialogData = this.getDialogData()
          this.init()
        }
      } else {
        this.dialogData = this.getDialogData()
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.f14 {
  font-size: 14px !important;
}

.oneColor {
  color: #455a64 !important;
}

.twoColor {
  color: #99abb4 !important;
}

.el-card {
  // border: none;
}

.el-step__description.is-success {
  color: #99abb4;
}

.inline_div {
  font-size: 1em;
  display: inline-block;
  margin-right: 30px;
}

.bold_font {
  font-size: 1.4em;
  font-weight: bold;
}

.title_div {
  font-size: 1.1em;
  font-weight: 500;
}

.details_div {
  font-size: 0.95em;
  margin-top: 20px;
  margin-left: 30px;
  line-height: 1.6em;
}

.row_class {
  margin-top: 12px;
}

.hzf > .el-card__body {
  padding: 0;
}
.selectStyle ul {
  height: 200px;
}
</style>
