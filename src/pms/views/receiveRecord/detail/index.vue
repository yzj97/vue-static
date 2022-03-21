<template>
  <div>
    <el-form style="line-height: 28px;">
      <el-row type="flex" style="margin-top: 1px;background-color: white;" class="cp-box">
        <el-col :span="8" style="padding: 20px;border-right: 0px solid #EEF5F9">
          <span class="title">{{ $t('收货记录单号') }}：</span><span class="f14">{{ receiveRecord.receiveRecordCode }}</span>
          <i v-clipboard:copy="receiveRecord.receiveRecordCode" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" size="mini" type="primary" icon="document"/>
          <br>
          <span class="detail" >{{ $t('采购单号') }}：</span><span class="f14">{{ receiveRecord.receiveTask.purchaseOrderCode }}</span>
          <br>
          <span class="detail">{{ $t('收货任务单号') }}：</span><span class="f14"><a style="color:#1890FF" @click="sendToReceiveTaskDetail(receiveRecord.receiveCode)">{{ receiveRecord.receiveCode }}</a></span>
          <br>
          <span class="detail" >{{ $t('备注') }}：</span><span class="f14">{{ receiveRecord.remark }}</span>
        </el-col>
        <el-col :span="8" style="padding: 20px;border-right: 0px solid #EEF5F9;">
          <br>
          <span class="detail" >{{ $t('商家') }}：</span><span class="f14">{{ receiveRecord.receiveTask.merchantName }}</span>
          <br>
          <span class="detail" >{{ $t('结算币种') }}：</span><span class="f14">{{ receiveRecord.receiveTask.currency }}</span>
        </el-col>
        <el-col :span="8" style="padding: 20px;border-right: 0px solid #EEF5F9;">
          <br>
          <span class="detail" >{{ $t('创建人') }}：</span><span class="f14">{{ receiveRecord.createUsername }}</span>
          <br>
          <span class="detail" >{{ $t('创建时间') }}：</span><span class="f14">{{ receiveRecord.createTime | parseTime }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" style="margin-top: 20px;background-color: white;" class="cp-box">
        <slot>
          <el-col :span="8" style="padding: 20px;border-right: 1px solid #EEF5F9;">
            <span class="title" >{{ $t('收货信息') }}</span>
            <br>
            <span class="detail" >{{ $t('收货仓库') }}：</span><span class="f14">{{ receiveRecord.receiveTask.warehouseName }}</span>
            <br>
            <span class="detail" >{{ $t('收货人姓名') }}：</span><span class="f14">{{ receiveRecord.receiveTask.receiver }}</span>
            <br>
            <span class="detail" >{{ $t('收货人手机') }}：</span><span class="f14">{{ receiveRecord.receiveTask.receiverMobile }}</span>
            <br>
            <span class="detail" >{{ $t('收货地址') }}：</span><span class="f14">{{ receiveRecord.receiveTask.receiverAddress }}</span>
          </el-col>
          <el-col :span="8" style="padding: 20px;border-right: 1px solid #EEF5F9;">
            <span class="title" >{{ $t('供应商信息') }}</span>
            <br>
            <span class="detail" >{{ $t('供应商编码') }}：</span><span class="f14">{{ receiveRecord.receiveTask.supplierCode }}</span>
            <br>
            <span class="detail" >{{ $t('供应商') }}：</span><span class="f14">{{ receiveRecord.receiveTask.supplierName }}</span>
            <br>
            <span class="detail" >{{ $t('联系电话') }}：</span><span class="f14">{{ receiveRecord.receiveTask.supplierMobile }}</span>
            <br>
            <span class="detail" >{{ $t('联系地址') }}：</span><span class="f14">{{ receiveRecord.receiveTask.supplierAddress }}</span>
          </el-col>
          <el-col :span="8" style="padding: 20px;border-right: 1px solid #EEF5F9;">
            <span class="title" >{{ $t('其他信息') }}</span>
            <br>
            <span class="detail" >{{ $t('附件') }}：</span>
            <span class="f14">
              <a
                v-for="p in receiveRecord.receiveAttachmentList"
                :key="p.id"
                :href="p.path"
                target="_blank"
                style="margin-right: 10px;color: #1287d6">
                {{ p.name }}
              </a>
            </span>
          </el-col>
        </slot>
      </el-row>
      <el-row style="background-color: white;" class="cp-box mt20">
        <ody-list-table-area>
          <div slot="btn">
            <div style="display: inline-block"/>
            <div style="width: 350px;float: right">
              <el-input v-model="filters.productCode" :placeholder="$t('请输入商品编码/名称/条码/SPU编码/货号')" suffix-icon="el-icon-search" @keyup.enter.native="searchReceiveItem"/>
            </div>
          </div>
          <div slot="table">
            <ody-table
              v-loading="loading"
              :data="list"
              :columns="columns"
              :can-filter="true"
              name="receiveRecordTable">
              <template slot="productPicPath" slot-scope="scope">
                <div>
                  <el-image :src="scope.row.productPicPath" :preview-src-list="[scope.row.productPicPath]" style="width: 120px; height: 120px"/>
                </div>
              </template>
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
              :current-page.sync="page.page"
              :list="list"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="page.limit"
              :total.sync="total"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="search"
              @current-change="search"
            />
          </div>
        </ody-list-table-area>
        <div style="margin-top: 10px;border-top: 1px solid #ccc;padding-top: 15px">
          <div>
            <span>{{ $t('order_aggregate') }}：</span>
            <span style="float: right;margin-right: 30px">{{ $t('商品个数') }}：{{ total }}</span>
            <span style="float: right;margin-right: 30px">{{ $t('收货数量') }}：{{ totalReceiveNum }}</span>
          </div>
          <div style="margin-top: 10px;padding-bottom: 10px">
            <span style="float: right;margin-right: 30px">{{ $t('总计金额') }}：{{ totalReceiveAmount }}</span>
          </div>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ReceiveRecordDetail',
  data() {
    return {
      loading: false,
      list: [],
      columns: [
        {
          label: this.$t('商品主图'),
          slot: 'productPicPath',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('商品编码'),
          prop: 'productCode',
          show: true,
          align: 'center',
          minWidth: 160
        },
        {
          label: this.$t('商品名称'),
          prop: 'productCname',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('条码'),
          prop: 'productBarCode',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('SPU编码'),
          prop: 'productSpuCode',
          show: true,
          align: 'center',
          minWidth: 160
        },
        {
          label: this.$t('货号'),
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
          label: this.$t('计量单位'),
          prop: 'productUnit',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('收货数量'),
          prop: 'receiveNum',
          slot: 'receiveBatchDrawer',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('含税采购单价'),
          prop: 'productPrice',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('小计'),
          prop: 'subtotal',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('备注'),
          prop: 'remark',
          show: true,
          align: 'center',
          minWidth: 120
        }
      ],
      page: {
        page: 1,
        limit: 10
      },
      total: 0,
      filters: {},
      receiveRecord: {},
      totalReceiveNum: 0,
      totalReceiveAmount: 0.00
    }
  },
  mounted() {
    this.filters.receiveRecordCode = this.$route.query.receiveRecordCode
    this.init()
  },
  methods: {
    async init() {
      this.searchReceiveRecord()
      this.search()
    },
    searchReceiveRecord() {
      this.$pms.$api.receiveRecord.getById({ id: this.$route.query.id }).then(
        res => {
          this.receiveRecord = res.data
          this.receiveRecord.receiveAttachmentList.forEach(i => {
            if (i.name.length > 8) {
              i.name = i.name.substring(0, 3) + '...' + i.name.substring(i.name.length - 4)
            }
          })
        }
      )
    },
    search() {
      this.loading = true
      const args = { filters: this.filters, ...this.page }
      this.$pms.$api.receiveRecordItem.listPage(args).then(
        res => {
          this.loading = false
          this.list = res.data.map(x => {
            x.isRecord = true
            return x
          })
          this.total = res.total
          this.totalReceiveNum = 0
          this.totalReceiveAmount = 0.00
          this.list.forEach(i => {
            this.totalReceiveNum += i.receiveNum
            this.totalReceiveAmount += parseFloat((i.receiveNum * i.productPrice).toFixed(2))
          })
        },
        () => {
          this.loading = false
        }
      )
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    },
    async searchReceiveItem(event) {
      this.search()
    },
    sendToReceiveTaskDetail(receiveCode) {
      this.$router.push({
        name: 'ReceiveTaskDetail',
        params: {
          receiveCode: receiveCode
        }
      })
    }
  }
}
</script>
<style scoped>

  /deep/ .detail-header-box{
    padding: 32px 20px 0 20px;
    background: white;
  }
  /deep/ .detail-header-small-box{
    height:110px;
    border-bottom: 1px solid #EEF5F9 ;
  }
  .mt20{
    margin-top: 20px;
  }
  .f14{
    font-size: 14px;
  }
  .detail {
    font-size: 14px;
    font-weight:400;
    color:#99ABB4;
    text-align: right;
  }
  .left {
    font-size: 14px;
    text-align: left;
  }
  .flex-center{
    display: flex;
    justify-content: center;
  }
</style>
