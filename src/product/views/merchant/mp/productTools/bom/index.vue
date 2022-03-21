<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" class="form">
          <ody-search-item :label="$t('商家名称')" label-width="100px" prop="merchantId">
            <ody-merchant-select
              ref="selectMerchant"
              v-model="queryParam.merchantId"
              :item-disabled="checkItem"
              name="queryParam_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('BOM编码')" prop="bomCode">
            <el-input v-model="queryParam.bomCode" name="queryParam_bomCode" />
          </ody-search-item>
          <ody-search-item :label="$t('BOM名称')" prop="bomName">
            <el-input v-model="queryParam.bomName" name="queryParam_bomName" />
          </ody-search-item>
          <ody-search-item :label="$t('成品编码')" prop="mpCode">
            <el-input v-model="queryParam.mpCode" name="queryParam_mpCode" />
          </ody-search-item>
          <ody-search-item :label="$t('成品名称')" prop="mpName">
            <el-input v-model="queryParam.mpName" name="queryParam_mpName" />
          </ody-search-item>
          <ody-search-item :label="$t('原料编码')" prop="materialCode">
            <el-input v-model="queryParam.materialCode" name="queryParam_materialCode" />
          </ody-search-item>
          <ody-search-item :label="$t('原料名称')" prop="materialName">
            <el-input v-model="queryParam.materialName" name="queryParam_materialName" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button
          :loading="loading"
          name="BomManagementQuery_query"
          size="small"
          code="BomManagementQuery"
          type="primary"
          @click="query"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="BomManagementAdd_toDetail" type="primary" code="BomManagementAdd" size="small" @click="toDetail()">{{ $t('新增') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          ref="table"
          :can-filter="false"
          :multiple="false"
          :columns="columns"
          :operates="operates"
          :data="list"
          name="list060"
        >
          <template slot="bomCode" slot-scope="scope">
            <el-link type="primary">
              <router-link
                :to="{ name: 'BomManagementDetail', params: {id: scope.row.id, readonly: true}}"
              >
                <span>{{ scope.row.bomCode }}</span>
              </router-link>
            </el-link>
          </template>
          <template
            slot="merchantName"
            slot-scope="scope"
          >{{ scope.row.merchantId | keyVal(getMerchantName) }}</template>
        </ody-table>
      </div>
      <div slot="page">
        <div :style="`margin-top: 10px`" type="flex" justify="end">
          <ody-pagination
            :current-page.sync="page.page"
            :list="list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.limit"
            :total.sync="page.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="sizeChange"
            @current-change="query"
          />
        </div>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'BomManagement',
  components: {},
  data() {
    const vue = this
    return {
      mpApi: null,
      loading: false,
      list: [],
      page: {
        page: 1,
        limit: 10,
        total: 0
      },
      columns: [
        {
          show: true,
          label: vue.$t('BOM编码'),
          slot: 'bomCode',
          minWidth: 200
        },
        {
          show: true,
          label: vue.$t('BOM名称'),
          prop: 'bomName',
          minWidth: 200
        },
        {
          show: true,
          label: vue.$t('成品编码'),
          prop: 'mpCode',
          minWidth: 200
        },
        {
          show: true,
          label: vue.$t('成品名称'),
          prop: 'mpName',
          minWidth: 200
        },
        {
          show: true,
          label: vue.$t('商家名称'),
          slot: 'merchantName',
          minWidth: 200
        }
      ],
      operates: {
        width: 150,
        fixed: 'right',
        list: [
          {
            label: vue.$t('编辑'),
            method: (index, row) => {
              this.$router.push({
                name: 'BomManagementDetail',
                params: {
                  id: row.id,
                  readonly: false
                }
              })
            },
            code: 'BomManagementMod'
          }
        ]
      },
      queryParam: initQueryParam()
    }
  },
  computed: {
    getMerchantName() {
      return this.$refs.selectMerchant.$refs.select2.options.reduce(
        (rtv, item) => {
          rtv[item.merchantId] = item.merchantName
          return rtv
        },
        {}
      )
    }
  },
  watch: {},
  async mounted() {
    this.mpApi = this.$product.$api.mpApi
    this.query()
  },
  methods: {
    async query() {
      const queryArgs = Object.assign(
        {
          filters: Object.assign({}, this.queryParam)
        },
        this.page
      )
      this.loading = true
      return this.mpApi.bom_listPage(queryArgs).then(res => {
        this.loading = false
        this.list = res.data
        this.page.total = res.total
      })
    },
    reset() {
      this.queryParam = initQueryParam()
    },
    toDetail(row) {
      this.$router.push({
        name: 'BomManagementDetail',
        readonly: false
      })
    }
  }
}

function initQueryParam() {
  return {
    bomCode: null,
    bomName: null,
    merchantId: null,
    mpCode: null,
    mpName: null,
    materialCode: null,
    materialName: null
  }
}
</script>
