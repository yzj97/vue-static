<template>
  <div v-if="packageList.length > 0">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in packageList" :key="item.id" :label="$t('发货记录')+(index+1)" />
    </el-tabs>
    <div>
      <el-row >
        <el-col :span="6" style="border-right: 1px solid #EEF5F9;padding-left: 20px;padding-bottom: 20px;">
          <el-row v-if="selectPackage.deliveryMode == null || selectPackage.deliveryMode === 1" style="margin-top: 10px">
            <span class="detail">{{ $t('物流公司') }}：</span><span class="f14">{{ selectPackage.deliveryCompanyName }}</span>
          </el-row>
          <el-row v-if="selectPackage.deliveryMode == null || selectPackage.deliveryMode === 1" style="margin-top: 5px">
            <span class="detail">{{ $t('物流单号') }}：</span><span class="f14">{{ selectPackage.deliveryExpressNbr }}</span>
            <i v-clipboard:copy="selectPackage.deliveryExpressNbr" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" size="mini" type="primary" icon="document"/>
          </el-row>
          <el-row v-if="selectPackage.deliveryMode === 2" style="margin-top: 10px">
            <span class="detail">{{ $t('配送员') }}：</span><span class="f14">{{ selectPackage.deliverName }}</span>
          </el-row>
          <el-row v-if="selectPackage.deliveryMode === 2" style="margin-top: 10px">
            <span class="detail">{{ $t('配送员电话') }}：</span><span class="f14">{{ selectPackage.deliverMobile }}</span>
          </el-row>
          <el-row style="margin-top: 5px">
            <span class="detail">{{ $t('联系电话') }}：</span><span class="f14">{{ selectPackage.goodReceiverMobile }}</span>
          </el-row>
          <el-row style="margin-top: 5px">
            <span class="detail">{{ $t('发货仓库') }}：</span><span class="f14">{{ selectPackage.warehouseName }}</span>
          </el-row>
          <el-row style="margin-top: 5px">
            <span class="detail">{{ $t('发货记录明细') }}：</span><el-link name="showPackageDetail" type="primary" @click="showPackageDetail">{{ $t('查看') }}</el-link>
          </el-row>
        </el-col>
        <el-col v-if="selectPackage.deliveryList && selectPackage.deliveryList.length > 0" :span="18">
          <el-container>
            <el-main>
              <el-timeline :active="2" style="height: 100px">
                <el-timeline-item v-for="item in selectPackage.deliveryList" :key="item.id" :timestamp="item.logisticsTime" :color="item.color">
                  {{ item.remark }}
                </el-timeline-item>
              </el-timeline>
            </el-main>
          </el-container>
        </el-col>
      </el-row>
    </div>
    <ody-dialog-full-right
      :visible.sync="dialog.dialogVisible"
      :title="$t('发货记录明细')">
      <div>
        <span class="title">{{ $t('发货记录明细') }}</span>
        <el-container style="border: 1px solid #EEF5F9;margin-top: 10px;margin-bottom: 50px">
          <el-main>
            <el-row >
              <el-col :span="6">
                <el-row v-if="selectPackage.deliveryMode == null || selectPackage.deliveryMode === 1" style="margin-top: 10px">
                  <span class="detail">{{ $t('物流公司') }}：</span><span class="f14">{{ selectPackage.deliveryCompanyName }}</span>
                </el-row>
                <el-row v-if="selectPackage.deliveryMode == null || selectPackage.deliveryMode === 1" style="margin-top: 5px">
                  <span class="detail">{{ $t('物流单号') }}：</span><span class="f14">{{ selectPackage.deliveryExpressNbr }}</span>
                  <i v-clipboard:copy="selectPackage.deliveryExpressNbr" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" size="mini" type="primary" icon="document"/>
                </el-row>
                <el-row v-if="selectPackage.deliveryMode === 2" style="margin-top: 10px">
                  <span class="detail">{{ $t('配送员') }}：</span><span class="f14">{{ selectPackage.deliverName }}</span>
                </el-row>
                <el-row v-if="selectPackage.deliveryMode === 2" style="margin-top: 10px">
                  <span class="detail">{{ $t('配送员电话') }}：</span><span class="f14">{{ selectPackage.deliverMobile }}</span>
                </el-row>
                <el-row style="margin-top: 5px">
                  <span class="detail">{{ $t('联系电话') }}：</span><span class="f14">{{ selectPackage.goodReceiverMobile }}</span>
                </el-row>
                <el-row style="margin-top: 5px">
                  <span class="detail">{{ $t('发货仓库') }}：</span><span class="f14">{{ selectPackage.warehouseName }}</span>
                </el-row>
                <el-row style="margin-top: 5px">
                  <span class="detail">{{ $t('发货时间') }}：</span><span class="f14">{{ selectPackage.orderLogisticsTime }}</span>
                </el-row>
              </el-col>
              <el-col v-if="selectPackage.deliveryList && selectPackage.deliveryList.length > 0" :span="18">
                <el-container>
                  <el-main>
                    <el-timeline :active="2" style="height: 100px">
                      <el-timeline-item v-for="item in selectPackage.deliveryList" :key="item.id" :timestamp="item.logisticsTime" :color="item.color">
                        <el-row>
                          <span class="title"/>
                        </el-row>
                        <!--<el-row style="margin-top: 5px">
                          <span class="detail">{{ item.createTime }}</span>
                        </el-row>-->
                        <el-row style="margin-top: 5px">
                          <span class="detail">{{ item.remark }}</span>
                        </el-row>
                      </el-timeline-item>
                    </el-timeline>
                  </el-main>
                </el-container>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
        <span class="title package-detail" >{{ $t('发货记录商品明细') }}</span>
        <ody-table
          :data="selectPackage.itemList"
          :columns="dialog.columns"
          :can-filter="false"
          :multiple="false"
          name="selectPackage_itemList660"/>
      </div>
      <div slot="footer">
        <el-button name="handleCloseDialog" @click="handleCloseDialog">{{ $t('返回') }}</el-button>
      </div>
    </ody-dialog-full-right>
  </div>

</template>

<script>
export default {
  props: {
    orderCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      packageList: [],
      activeName: '0',
      selectPackage: {},
      dialog: {
        dialogVisible: false,
        columns: [
          {
            label: this.$t('商品主图'),
            prop: 'productCname',
            show: true,
            align: 'center',
            width: 85,
            render: (h, params) => {
              return (
                <div>
                  <el-image fit='cover' src={params.row.productPicPath}></el-image>
                </div>
              )
            }
          },
          {
            label: this.$t('商品名称'),
            prop: 'productCname',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('商品编码'),
            prop: 'code',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('规格属性'),
            prop: 'extInfoStr',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('货号'),
            prop: 'artNo',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('订购单位'),
            prop: 'unit',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('发货数量'),
            prop: 'productItemOutNum',
            show: true,
            align: 'center'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const self = this
      this.$oms.$api.soPackage.parcelListListPageWithItem({ limit: 100, page: 1, filters: { orderCode: this.orderCode }}).then(res => {
        self.packageList = res.data
        if (self.packageList.length > 0) {
          self.handleClick()
        }
      })
    },
    handleClick() {
      const self = this
      this.selectPackage = this.packageList[this.activeName]
      this.$oms.$api.soDelivery.soDeliveryGetInfoByPackageCode({ packageCode: this.selectPackage.packageCode }).then(res => {
        if (res && res.data && res.data.length > 0) {
          res.data[0].color = '#ff0000'
        }
        self.selectPackage.deliveryList = res.data
        self.$forceUpdate()
      })
    },
    showPackageDetail() {
      const self = this
      this.$oms.$api.soPackageItem.parcelItemListListPage({ limit: 100, page: 1, filters: { packageCode: this.selectPackage.packageCode }}).then(res => {
        self.selectPackage.itemList = res.data
        self.selectPackage.itemList.forEach(i => {
          i.extInfoStr = getAtt(i.extInfo)
          if (i.extInfoStr === '') {
            i.extInfoStr = this.$t('无')
          }
        })
        this.dialog.dialogVisible = true
      })
    },
    handleCloseDialog() {
      this.dialog.dialogVisible = false
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    }
  }
}
const getAtt = function(val) {
  var value = ''
  if (val == null || val === '' || val.length === 0) {
    return ''
  }
  var json = JSON.parse(val)
  json = json.attributeList || json
  for (var i = 0; i < json.length; i++) {
    value = value + json[i].name + ':' + json[i].value + ';'
  }
  return value
}
</script>

<style scoped lang="scss">
  .detail {
    font-size: 14px;
    font-weight:400;
    color:rgba(153,171,180,1);
  }
  .f14{
    font-size: 14px;
  }
  .title{
    font-size: 14px;
    font-weight:700;
    color:rgba(69,90,100,1)
  }
  .package-detail{
    display: inline-block;
    margin-bottom: 10px;
  }
  // /deep/ .el-tabs__item.is-top{
  //   padding-left: 20px;
  //   // margin-left: 20px;
  // }
  // /deep/ .el-tabs__item.is-top:last-child {
  //   padding-left: 0px;
  // }
  /deep/ .el-tabs__active-bar:after{
    min-width: 74px;
    // left: 0px !important;
  }
</style>
