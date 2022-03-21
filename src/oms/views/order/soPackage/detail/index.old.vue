<template>
  <section class="pg-soPackage-list">
    <el-form ref="soPackageDetailForm" label-width="240px">
      <el-card shadow="never">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('orderCode') + ':'">
              <div>
                {{ packageDetail.orderCode }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('do_do_code') + ':'">
              <div>
                {{ packageDetail.doCode }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('do_merchant_name') + ':'">
              <div>
                {{ packageDetail.merchantName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('product_warehouse_name') + ':'">
              <div>
                {{ packageDetail.warehouseName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('do_store_name') + ':'">
              <div>
                {{ packageDetail.storeName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('do_delivery_method') + ':'">
              <div>
                {{ packageDetail.orderDeliveryMethodIdStr }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('so_pick_delivery_merchant') + ':'">
              <div>
                {{ packageDetail.deliveryCompanyName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('packageCode') + ':'">
              <div>
                {{ packageDetail.packageCode }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('do_good_receiver_name') + ':'">
              <div>
                {{ packageDetail.goodReceiverName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('do_good_receiver_mobile') + ':'">
              <div>
                {{ packageDetail.goodReceiverMobile }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('common_zipcode') + ':'">
              <div>
                {{ packageDetail.goodReceiverPostcode }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('order_ports_delivery_all_address') + ':'">
              <div>
                {{ packageDetail.goodReceiverProvince }}-{{ packageDetail.goodReceiverCity }}-{{ packageDetail.goodReceiverArea }}-{{ packageDetail.goodReceiverAddress }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="packageItemList"
            :columns="columns"
            name="packageItemList082"
          />
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="page.current"
              :list="packageItemList"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="page.size"
              :total.sync="page.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handlePageSizeChange"
              @current-change="handlePageCurrentChange"/>
          </div>
        </div>
      </ody-list-table-area>
      <el-card shadow="never">
        <el-row>
          <el-col>
            <el-form-item :label="$t('so_pick_delivery_merchant') + ':'">
              <div>
                {{ packageDetail.deliveryCompanyName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('deliveryExpressNo') + ':'">
              <div>
                {{ packageDetail.deliveryExpressNbr }}
              </div>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('deliveryTime') + ':'">
              <div>
                {{ packageDetail.createTime }}
              </div>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('orderInvoiceInfo_logistics_detail') + ':'">
              <el-timeline>
                <el-timeline-item
                  v-for="item in packageCodeList"
                  :key="item.id">
                  <el-card>
                    {{ item.remark }}
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <ody-fixed>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_back') }}</el-button>
    </ody-fixed>
  </section>
</template>

<script>

export default {
  data() {
    return {
      packageDetail: {},
      packageItemList: [],
      packageCodeList: [], // 配送信息
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'index',
          label: this.$t('common_serial_number'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'productPicPath',
          label: this.$t('manual_order_product_pic'),
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.productPicPath
              },
              style: {
                width: '30px',
                height: '30px'
              }
            })
          }
        }, {
          show: true,
          prop: 'productCname',
          label: this.$t('do_product_name'),
          align: 'center',
          minWidth: 400
        }, {
          show: true,
          prop: 'code',
          label: this.$t('do_product_code'),
          align: 'center',
          minWidth: 50
        }, {
          show: true,
          prop: 'productItemAmount',
          label: this.$t('manual_order_purchase_amount'),
          align: 'center',
          minWidth: 50
        }, {
          show: true,
          prop: 'productItemOutNum',
          label: this.$t('deliveredNum'),
          align: 'center',
          minWidth: 50
        }
      ]
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    init() {
      const id = this.$route.params.id
      const packageCode = this.$route.params.packageCode
      this._initData(id, packageCode)
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async _initData(id, packageCode) {
      const res = await this.$oms.$api.soPackage.parcelListGetDetail({ 'id': id })
      if (res) {
        this.packageDetail = res.data
      }
      this.$oms.$api.soPackageItem.parcelItemListListPage({ page: 1, limit: 10,
        filters: {
          packageCode: packageCode
        }}).then((data) => {
        this.packageItemList = data.data
        this.page.total = data.total
        if (this.packageItemList) {
          let index = 0
          this.packageItemList.forEach((item) => {
            index = index + 1
            item.index = index
          })
        }
      })
      const result = await this.$oms.$api.soDelivery.soDeliveryGetInfoByPackageCode({ 'packageCode': packageCode })
      if (result) {
        this.packageCodeList = result.data
      }
    },
    returnBack() {
      this.$portal.delActiveView()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
