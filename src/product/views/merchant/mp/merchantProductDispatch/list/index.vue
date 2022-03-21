<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('商品名称') + ':'" prop="chineseName">
            <el-input v-model="queryParam.chineseName" name="queryParam_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码') + ':'" prop="code">
            <el-input v-model="queryParam.code" name="queryParam_code" />
          </ody-search-item>
          <ody-search-item :label="$t('货号') + ':'" prop="artNo">
            <el-input v-model="queryParam.artNo" name="queryParam_artNo" />
          </ody-search-item>
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <ody-merchant-select v-model="queryParam.merchantId" name="queryParam_merchantId" value-key="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('店铺') + ':'" prop="storeId">
            <ody-store-select
              v-model="queryParam.storeId"
              :placeholder="$t('全部')"
              name="queryParam_storeId"
              value-key="storeId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('渠道') + ':'" prop="channelCode">
            <el-select v-model="queryParam.channelCode" :placeholder="$t('全部')" :popper-append-to-body="false" name="queryParam_channelCode" clearable>
              <el-option
                v-for="item in channelList"
                :key="item.channelName"
                :label="item.channelName"
                :value="item.channelCode"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('分发结果') + ':'" prop="lowerHairStatus">
            <el-select v-model="queryParam.lowerHairStatus" :placeholder="$t('全部')" name="queryParam_lowerHairStatus" clearable>
              <el-option
                v-for="item in lowerHairStatus"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('分发时间') + ':'" :space="2" class="register" prop="rangeTime">
            <ody-date-range-picker
              v-model="queryParam.rangeTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="queryParam_rangeTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button
          name="Product_20_03PageQuery_handleQuery"
          size="small"
          type="primary"
          code="Product_20_03PageQuery"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list603" />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.currentPage"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.itemsPerPage"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="queryList"
          @current-change="queryList"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog
      v-if="msgVisible"
      :visible.sync="msgVisible"
      :title="$t('提示')"
      width="400px"
      @hide-dialog="hideDialog"
      @confirm-dialog="confirmDialog"
    >
      <div slot="content">
        <p v-for="(mes, index) in messages" :key="index" style="padding:5px 10px;">
          {{ mes.title }}:
          <span>{{ mes.con }}</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="confirmDialog" size="mini" type="primary" @click="confirmDialog">{{ $t('确 定') }}</el-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'Product2003',
  data() {
    return {
      msgVisible: false,
      messages: [
        {
          title: '失败的原因',
          con: '店铺存在相同商品编码的商品/存在相同商品条码的商品/网络环境差'
        }
      ],
      updateTime: '',
      queryParam: getDefaultQueryParam(),
      loading: false,
      lowerHairStatus: [
        {
          label: this.$t('待处理'),
          value: 1
        },
        {
          label: this.$t('分发成功'),
          value: 2
        },
        {
          label: this.$t('分发失败'),
          value: 3
        }
      ],
      list: [],
      storeList: [],
      channelName: [],
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'chineseName',
          label: this.$t('商品名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('商品编码'),
          align: 'center'
        },
        {
          show: true,
          prop: 'artNo',
          label: this.$t('货号'),
          align: 'center'
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('商家'),
          align: 'center'
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('店铺'),
          align: 'center'
        },
        {
          show: true,
          prop: 'storeCode',
          label: this.$t('店铺编码'),
          align: 'center'
          // formatter: row => {
          //   // 入参是本行的对象
          //   const storeList = this.storeList
          //   for (var i = 0; i < storeList.length; i++) {
          //     if (row.storeId === storeList[i].storeId) {
          //       return storeList[i].storeCode
          //     }
          //   }
          // }
        },
        {
          show: true,
          prop: 'channelCode',
          label: this.$t('渠道'),
          align: 'center',
          formatter: row => {
            // 入参是本行的对象
            const channel = this.channelList[row.channelCode]
            return channel && channel.channelName
          }
        },
        {
          show: true,
          prop: 'dispatchTime',
          label: this.$t('分发时间'),
          align: 'center'
        },
        {
          show: true,
          prop: 'lowerHairStatus',
          label: this.$t('分发结果'),
          align: 'center',
          render: (h, param) => {
            const lowerHairStatus = param.row.lowerHairStatus
            // console.log(lowerHairStatus)
            switch (lowerHairStatus) {
              case 1:
                return <span>{this.$t('待处理')}</span>
              case 2:
                return <span>{this.$t('分发成功')}</span>
              case 3:
                return (
                  <span>
                    {this.$t('分发失败')}
                    <a
                      on-click={() => {
                        this.seeMore()
                      }}
                    >
                      <ody-svg-icon icon-class='question' />
                    </a>
                  </span>
                )
            }
          }
        }
      ]
    }
  },
  async mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      this.userApi = this.$product.$api.userApi
      this.merchantApi = this.$product.$api.merchantApi
      this.loading = true
      await this.queryForChannelNameList()
      await this.queryList()
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    // 查询所有渠道
    async queryForChannelNameList() {
      var param = {}
      return this.userApi.queryChannelMap(param).then(res => {
        this.channelList = res.data
      })
    },
    // 商品分发结果列表查询
    async queryList(obj = {}) {
      var param = Object.assign({}, this.queryParam, this.page, obj)
      this.loading = true
      try {
        const res = await this.mpApi.queryMerchantProductDispatchByPage(param)

        this.list = res.data.listObj
        this.page.total = res.data.total
      } finally {
        this.loading = false
      }
    },
    // 重置
    reset() {
      this.page.currentPage = 1
      this.queryParam = getDefaultQueryParam()
      this.queryList()
    },
    // 查看分发失败原因
    seeMore(par) {
      this.msgVisible = true
    },
    hideDialog() {
      this.msgVisible = false
    },
    confirmDialog() {
      this.msgVisible = false
    },
    // 商家选择事件
    selectMerchant() {
      var param = { merchantId: this.queryParam.merchantId }
      return this.userApi.queryStoreOrgChannelPage(param).then(res => {
        this.storeList = res.data.listObj
      })
    },
    async handleQuery() {
      this.page.currentPage = 1
      await this.queryList()
    }
  }
}
function getDefaultQueryParam() {
  return Object.assign(
    {},
    {
      chineseName: null,
      code: null,
      artNo: null,
      merchantId: null,
      rangeTime: [],
      storeId: null,
      channelCode: null,
      lowerHairStatus: null,
      dispatchType: 1
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
