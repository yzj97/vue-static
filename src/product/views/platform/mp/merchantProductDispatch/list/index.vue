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
            <ody-merchant-select :item-filter="merchantItemFilter" v-model="queryParam.merchantId" name="queryParam_merchantId" value-key="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('商家编码') + ':'" prop="merchantCode">
            <el-input v-model="queryParam.merchantCode" name="queryParam_merchantCode" />
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
          name="Product1006PageQuery_handleQuery"
          size="small"
          type="primary"
          code="Product1006PageQuery"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
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
    <ody-list-table-area>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list655" />
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
  </section>
</template>

<script>
export default {
  name: 'Product1006',
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
      merchantList: [],
      merchantItemFilter: (x, index) => {
        this.merchantList.push(x)
        return true
      },
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
          // formatter: row => {
          //   // 入参是本行的对象
          //   const merchantList = this.merchantList
          //   for (var i = 0; i < merchantList.length; i++) {
          //     if (row.merchantId === merchantList[i].merchantId) {
          //       return merchantList[i].merchantName
          //     }
          //   }
          // }
        },
        {
          show: true,
          prop: 'merchantCode',
          label: this.$t('商家编码'),
          align: 'center'
          // formatter: row => {
          //   // 入参是本行的对象
          //   const merchantList = this.merchantList
          //   for (var i = 0; i < merchantList.length; i++) {
          //     if (row.merchantId === merchantList[i].merchantId) {
          //       return merchantList[i].merchantCode
          //     }
          //   }
          // }
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
      await this.queryList()
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    // 商分发结果列表查询
    async queryList(obj) {
      var param = Object.assign({}, this.queryParam, this.page, obj)
      if (this.queryParam.merchantCode) {
        var ms = this.merchantList.filter(
          m => m.merchantCode === this.queryParam.merchantCode
        )
        if (ms && ms.length > 0) {
          if (param['merchantId'] && param['merchantId'] !== ms[0].merchantId) {
            this.list = []
            this.page.total = 0
            return
          }
          param['merchantId'] = ms[0].merchantId
        } else {
          this.list = []
          this.page.total = 0
          return
        }
      }
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
      this.queryParam = getDefaultQueryParam()
      this.page.currentPage = 1
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
      merchantCode: null,
      rangeTime: [],
      merchantId: null,
      lowerHairStatus: null,
      dispatchType: 0
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
