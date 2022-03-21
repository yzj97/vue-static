<template>
  <div ref="printBox">
    <div class="printing-box">
      <div class="printing-container bold">
        <div style="margin-bottom: 10px;font-size: 14px;font-weight: bold">{{ $t('发货记录详情') }}</div>
        <div class="f0 mgB20 pdb20">
          <div class="printLine2">
            <div class="disT mgR25">
              <span class="f14">{{ $t('订单编号') }}</span>
            </div>
            <div class="disT">
              <span class="f14">{{ packageDetail.orderCode }}</span>
            </div>
          </div>
          <div class="printLine2">
            <div class="disT mgR25">
              <span class="f14">{{ $t('销售店铺') }}</span>
            </div>
            <div class="disT">
              <span class="f14">{{ packageDetail.storeName }}</span>
            </div>
          </div>
        </div>
        <div class="f0 mgB20 pdb20">
          <div class="printLine2">
            <div class="disT mgR25">
              <span class="f14">{{ $t('收货人') }}</span>
            </div>
            <div class="disT">
              <span class="f14">{{ packageDetail.goodReceiverName }}</span>
            </div>
          </div>
          <div class="printLine2">
            <div class="disT mgR25">
              <span class="f14">{{ $t('手机号码') }}</span>
            </div>
            <div class="disT">
              <span class="f14">{{ packageDetail.goodReceiverMobile }}</span>
            </div>
          </div>
        </div>
        <div class="f0 mgB20 pdb20">
          <div class="printLine1">
            <div class="disT mgR25">
              <span class="f14">{{ $t('收货地址') }}</span>
            </div>
            <div class="disT">
              <span
                class="f14"
              >{{ packageDetail.goodReceiverProvince }}{{ packageDetail.goodReceiverCity }}{{ packageDetail.goodReceiverArea }}{{ packageDetail.goodReceiverAddress }}</span>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 10px;font-size: 14px;font-weight: bold">{{ $t('发货记录明细') }}</div>
        <div class="f0 mgB20 pdb20">
          <div v-if="packageDetail.deliveryMode == null || packageDetail.deliveryMode === 1" class="printLine">
            <div class="disT mgR25">
              <span class="f14">{{ $t('物流公司') }}</span>
            </div>
            <div class="disT">
              <span class="f14">{{ packageDetail.deliveryCompanyName }}</span>
            </div>
          </div>
          <div v-if="packageDetail.deliveryMode == null || packageDetail.deliveryMode === 1" class="printLine">
            <div class="disT mgR25">
              <span class="f14">{{ $t('物流单号') }}</span>
            </div>
            <div class="disT">
              <span class="f14">{{ packageDetail.deliveryExpressNbr }}</span>
            </div>
          </div>
          <div v-if="packageDetail.deliveryMode === 2" class="printLine">
            <div class="disT mgR25">
              <span class="f14">配送员</span>
            </div>
            <div class="disT">
              <span class="f14">{{ packageDetail.deliverName }}</span>
            </div>
          </div>
          <div v-if="packageDetail.deliveryMode === 2" class="printLine">
            <div class="disT mgR25">
              <span class="f14">配送员电话</span>
            </div>
            <div class="disT">
              <span class="f14">{{ packageDetail.deliverMobile }}</span>
            </div>
          </div>
          <div class="printLine">
            <div class="disT mgR25">
              <span class="f14">{{ $t('发货时间') }}</span>
            </div>
            <div class="disT">
              <span class="f14">{{ getDeliveryTime(packageDetail.createTime) }}</span>
            </div>
          </div>
        </div>
        <div class="f0 mgB20 pdb20">
          <div class="printLine">
            <div class="disT mgR25">
              <span class="f14">{{ $t('发货仓库') }}</span>
            </div>
            <div class="disT">
              <span class="f14">{{ packageDetail.warehouseName }}</span>
            </div>
          </div>
          <div class="printLine">
            <div class="disT mgR25">
              <span class="f14">{{ $t('联系电话') }}</span>
            </div>
            <div class="disT">
              <span class="f14">{{ packageDetail.goodReceiverMobile }}</span>
            </div>
          </div>
        </div>
        <div class="f0 mgB20 pdb20">
          <div v-if="!packageCodeList" class="printLine1">
            <div class="disT mgR30">
              <span
                class="f14"
              >{{ packageCodeList == null || packageCodeList.length == 0 ? '无物流信息' : '' }}</span>
            </div>
          </div>
          <div v-if="packageCodeList" class="printLine1">
            <div v-if="packageCodeList" class="disT">
              <el-timeline>
                <el-timeline-item v-for="item in packageCodeList" :key="item.id">
                  <span class="f14">{{ item.logisticsTime }}&nbsp;&nbsp;&nbsp;{{ item.remark }}</span>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </div>
      </div>
      <div style="font-size: 14px;font-weight: bold;margin-bottom: 10px">{{ $t('发货记录商品详情') }}</div>
      <div id="printing" class="printing-table">
        <table
          class="text-center table-yt"
          width="100%"
          bplanInfo="0"
          cellpadding="0"
          cellspacing="0"
          border="1"
        >
          <thead>
            <tr>
              <td style="width: 5%;">{{ $t('序号') }}</td>
              <td style="width: 9%;">{{ $t('商品主图') }}</td>
              <td style="width: 40%;">{{ $t('商品名称') }}</td>
              <td style="width: 15%;">{{ $t('商品编码') }}</td>
              <td style="width: 15%;">{{ $t('条形码') }}</td>
              <td style="width: 7%;">{{ $t('小计') }}</td>
              <td style="width: 9%;">{{ $t('发货数量') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in packageItemList" :key="detail.packageCode">
              <td>{{ detail.index }}</td>
              <td>
                <el-image
                  :src="detail.productPicPath"
                  :fit="cover"
                  style="width: 50px; height: 50px"
                />
              </td>
              <td>{{ detail.productCname }}</td>
              <td>{{ detail.code }}</td>
              <td>{{ detail.barCode }}</td>
              <td>{{ detail.productItemAmount }}</td>
              <td>{{ detail.productItemOutNum }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
<style lang="scss" scoped>
  .printing-box {
  background-color: #fff;
  padding: 0px 10px;
  }
  .printing-table {
  margin-bottom: 20px;
  padding-top: 10px;
  }
  .printLine {
  width: 33%;
  float: left;
  }
  .printLine2 {
  width: 50%;
  float: left;
  }
  .printLine1 {
  width: 100%;
  float: left;
  }
  .width99 {
  width: 99px;
  }
  .width120 {
  width: 120px;
  }
  .width80 {
  width: 80px;
  }
  .width50 {
  width: 50px;
  }
  .width30 {
  width: 30px;
  }
  .mgT20 {
  margin-top: 20px;
  }
  .f16 {
  font-size: 16px;
  }
  .table-yt thead {
  height: 15px;
  line-height: 15px;
  background: #f8f9fa;
  bplaninfo: 1px solid #dee7eb;
  }
  .table-yt tbody {
  bplaninfo: 1px solid #dee7eb;
  }
  .table-yt td {
  bplaninfo: 1px solid #dee7eb;
  padding: 2px;
  font-size: 12px;
  }

  .width388 {
  width: 388px;
  }
  .width532 {
  width: 532px;
  }
  .width236 {
  width: 236px;
  }
  .width126 {
  width: 126px;
  }
  .width166 {
  width: 166px;
  }
  .width152 {
  width: 152px;
  }
  .width220 {
  width: 220px;
  }
  .text-center {
  text-align: center;
  }
  .time-box {
  width: 200px;
  text-align: center;
  bplaninfo-bottom: 2px solid #dee7eb;
  padding-bottom: 10px;
  vertical-align: bottom;
  display: inline-block;
  }
  .width650 {
  width: 650px;
  }
  .peisong-mes {
  background: #fbfcfc;
  bplaninfo: 1px solid #dee7eb;
  padding-left: 32px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-top: 30px;
  margin-bottom: 30px;
  }
  p {
  margin: 0;
  }
  .mgR20 {
  margin-right: 20px;
  }
  .mgR30 {
  margin-right: 30px;
  }
  .mgR25 {
  margin-right: 25px;
  }
  .mgR45 {
  margin-right: 45px;
  }
  .mgT50 {
  margin-top: 50px;
  }
  .mgT65 {
  margin-top: 65px;
  }
  .w750 {
  width: 75%;
  }
  .mgT24 {
  margin-top: 24px;
  }
  .text-right {
  text-align: right;
  }
  .mgL160 {
  margin-left: 160px;
  }
  .mgR33 {
  margin-right: 33px;
  }
  .mgB20 {
  margin-bottom: 20px;
  }
  .pdb20 {
  padding-bottom: 20px;
  }
  .mgB23 {
  margin-bottom: 23px;
  }
  .mgR58 {
  margin-right: 58px;
  }
  .mgR32 {
  margin-right: 32px;
  }
  .mgT30 {
  margin-top: 30px;
  }
  .printing-header {
  height: 200px;
  bplaninfo-bottom: 2px solid #eee;
  position: relative;
  margin-bottom: 10px;
  }
  .header-logo {
  position: absolute;
  width: 140px;
  height: 53px;
  /*// background: url('../../images/printing-logo.png') no-repeat;*/
  top: 65px;
  left: 100px;
  }
  .header-bottom-text {
  position: absolute;
  bottom: 20px;
  right: 0px;
  }
  .header-text {
  text-align: center;
  padding-top: 90px;
  }
  .disT {
  display: inline-block;
  vertical-align: top;
  margin: 10px;
  }
  .disB {
  display: inline-block;
  vertical-align: middle;
  }
  .f14 {
  font-size: 14px;
  }
  .f40 {
  font-size: 40px;
  }
  .f24 {
  font-size: 24px;
  }
  .fr {
  float: right;
  }
  .fl {
  float: left;
  }
  @media print {
  @page {
  margin: 0;
  }
  }
</style>
<script>
import Print from '@/components/jquery/print'
window.Vue.use(Print)
export default {
  data() {
    return {
      id: this.$route.params.id,
      packageCode: this.$route.params.packageCode,
      packageDetail: {},
      packageItemList: [],
      packageCodeList: [] // 配送信息
    }
  },
  mounted() {
    this.mergePrinting()
  },
  methods: {
    getDeliveryTime(deliveryTime) {
      if (deliveryTime == null) {
        deliveryTime = this.packageDetail.orderLogisticsTime
      }
      if (deliveryTime != null) {
        try {
          return this.$portal.parseTime(deliveryTime, '{y}-{m}-{d} {h}:{i}:{s}')
        } catch (e) {
          console.error(e)
          return deliveryTime
        }
      }
    },
    async mergePrinting() {
      const self = this
      if (this.packageCode) {
        const res = await this.$oms.$api.soPackage.parcelListGetDetail({
          id: this.id
        })
        if (res) {
          this.packageDetail = res.data
        }
        this.$oms.$api.soPackageItem
          .parcelItemListListPage({
            page: 1,
            limit: 1000,
            filters: {
              packageCode: this.packageCode
            }
          })
          .then(data => {
            this.packageItemList = data.data
            // this.page.total = data.total
            if (this.packageItemList) {
              let index = 0
              this.packageItemList.forEach(item => {
                index = index + 1
                item.index = index
              })
            }
          })
        const result = await this.$oms.$api.soDelivery.soDeliveryGetInfoByPackageCode(
          { packageCode: this.packageCode }
        )
        if (result) {
          this.packageCodeList = result.data
        }
        if (result.code === '0') {
          setTimeout(function() {
            self.$print(self.$refs.printBox)
          }, 2000)
        }
      }
    }
  }
}
</script>
