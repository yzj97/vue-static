<template>
  <div>
    <ody-list-table-area class="mp-info">
      <div slot="btn" >
        <div style="display: inline-block"/>
        <div style="width: 350px;float: right">
          <el-input v-model="search.searchValue" :placeholder="$t('请输入商品编码/名称/条码/SPU编码/货号')" suffix-icon="el-icon-search"/>
        </div>
      </div>
      <div slot="table">
        <ody-table
          :data="filterList"
          :columns="listTable.columns"
          :operates="listTable.operates"
          :multiple="false"
          :can-filter="false"
          name="listTable_list671">
          <template slot="receiveBatchDrawer" slot-scope="scope">
            <div v-if="scope.row.batchStrategyId != null" class="batch_but_div">
              <ody-product-batch-receive-drawer :product="scope.row" />
            </div>
            <div v-else>
              {{ scope.row.receiveNum }}
            </div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="searchForm.page"
          :list="filterList"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="searchForm.limit"
          :total.sync="listTable.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="query"
          @current-change="query"/>

      </div>
    </ody-list-table-area>
    <div class="clearfix cp-box enclosure">
      <el-col type="flex" justify="space-between">
        <el-col :span="2">
          <span style="padding-right: 50px"><!--合计-->{{ $t('order_aggregate')+'：' }}</span>
        </el-col>
        <el-col :span="3" :offset="14">
          <el-row>
            <span class="label">{{ $t('商品个数') }}：</span>
            <span class="f14">{{ filterList.length }}</span>
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-row>
            <span class="label">{{ $t('收货任务数量') }}：</span>
            <span class="f14">{{ Number(sumReceiveNum).toFixed(2) }}</span>
          </el-row>
          <el-row style="margin-top: 5px">
            <span class="label">{{ $t('已收数量') }}：</span>
            <span class="f14">{{ Number(sumReceivedNum).toFixed(2) }}</span>
          </el-row>
          <el-row style="margin-top: 5px">
            <span class="label">{{ $t('未收数量') }}：</span>
            <span class="f14">{{ Number(sumUnReceiveNum).toFixed() }}</span>
          </el-row>
          <el-row style="margin-top: 5px">
            <span class="label" style="font-size: 14px;font-weight:700">{{ $t('总计金额') }}：</span>
            <span class="f16">{{ Number(sumAmount) | currency('¥', 2) }}</span>
          </el-row>
        </el-col>
      </el-col>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    receiveCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      itemNum: 0,
      totalFreeAmount: 0,
      changePriceFreeAmount: 0,
      freeDeliveryFee: 0,
      search: {
        searchValue: null
      },
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
            label: this.$t('商品编码'),
            prop: 'productCode',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('商品名称'),
            prop: 'productCname',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('条码'),
            prop: 'productBarCode',
            show: true,
            align: 'center',
            minWidth: 150
          },
          {
            label: this.$t('spu编码'),
            prop: 'productSpuCode',
            show: true,
            align: 'center',
            minWidth: 150
          },
          {
            label: this.$t('do_art_no'),
            prop: 'productArtNo',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('规格属性'),
            prop: 'productAttribute',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('计量单位'), // 订购单位
            prop: 'productUnit',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('收货任务数量'),
            prop: 'productItemNum',
            show: true,
            align: 'center',
            minWidth: 150
          },
          {
            label: this.$t('含税采购单价'),
            prop: 'productPrice',
            show: true,
            align: 'center',
            minWidth: 150
          },
          {
            label: this.$t('小计'),
            prop: 'countAmount',
            show: true,
            align: 'center',
            minWidth: 150
          },
          {
            label: this.$t('未收货数量'),
            prop: 'unReceiveNum',
            show: true,
            align: 'center',
            minWidth: 150
          },
          {
            label: this.$t('已收货数量'),
            slot: 'receiveBatchDrawer',
            prop: 'receiveNum',
            show: true,
            align: 'center',
            minWidth: 150
          },
          {
            label: this.$t('备注'),
            prop: 'remark',
            show: true,
            align: 'center',
            minWidth: 150
          }
        ]
      },
      stockOutCodeList: []
    }
  },
  computed: {
    sumReceiveNum: function() {
      return this.filterList.reduce((result, item) => { const amount = Number(item.productItemNum ? item.productItemNum : 0); return result + amount }, Number(0))
    },
    sumReceivedNum: function() {
      return this.filterList.reduce((result, item) => { const amount = Number(item.receiveNum ? item.receiveNum : 0); return result + amount }, Number(0))
    },
    sumAmount: function() {
      return this.filterList.reduce((result, item) => { const amount = Number(item.countAmount ? item.countAmount : 0); return result + amount }, Number(0))
    },
    sumUnReceiveNum: function() {
      return this.sumReceiveNum - this.sumReceivedNum
    },
    filterList: function() {
      if (this.search.searchValue) {
        return this.listTable.list.filter(item => {
          return item.productCode.indexOf(this.search.searchValue) >= 0 || (item.productCname && item.productCname.indexOf(this.search.searchValue) >= 0) || (item.productBarCode && item.productBarCode.indexOf(this.search.searchValue) >= 0) || (item.productSpuCode && item.productSpuCode.indexOf(this.search.searchValue) >= 0) || (item.productArtNo && item.productArtNo.indexOf(this.search.searchValue) >= 0)
        })
      }
      return this.listTable.list
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.query()
    },
    async query() {
      const self = this
      this.searchForm.filters = { receiveCode: this.receiveCode, searchValue: this.searchForm.searchValue }
      this.$pms.$api.receiveTask.receiveItemListPage(this.searchForm).then(res => {
        self.listTable.total = res.total
        self.listTable.list = res.data
        self.itemNum = res.data.length
        self.listTable.list.forEach(l => {
          if (l.receiveNum === null) {
            l.receiveNum = 0
          }
          l.isRecord = true
          l.isTask = true
          l.unReceiveNum = l.productItemNum - l.receiveNum
          l.countAmount = (l.productItemNum * l.productPrice).toFixed(2)
          self.totalFreeAmount = 0
          self.sumReceiveNum += l.productItemNum
          self.sumReceivedNum += l.receiveNum
          self.sumAmount += parseFloat(l.countAmount)
          self.sumUnReceiveNum = self.sumReceiveNum - self.sumReceivedNum
        })
      })
    },
    onSuccess() {
      this.$emit('onSuccess')
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
    padding: 20px;
    font-size: 14px;
  }
  .label {
    font-size: 14px;
    width: 120px;
    display: inline-block;
    text-align: right;
  }
</style>
