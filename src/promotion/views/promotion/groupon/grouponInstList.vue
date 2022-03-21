<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('拼团单号:')" prop="grouponInstId">
            <el-input
              v-model="search.grouponInstId"
              :placeholder="$t('请输入拼团单号')"
              name="search_grouponInstId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('开团用户ID:')" prop="catptainId">
            <ody-input-number
              v-model="search.catptainId"
              :max="9999999999999999"
              :empty-tip="false"
              :placeholder="$t('请输入开团用户ID')"
              name="search_catptainId"
              maxlength="16"
              style="width:100%"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('拼团活动名称:')" prop="activityTitle">
            <el-input
              v-model="search.activityTitle"
              :placeholder="$t('请输入拼团活动名称')"
              name="search_activityTitle"
            />
          </ody-search-item>
          <ody-search-item :label="$t('拼团状态:')" prop="grouponInstStatus">
            <el-select
              v-model="search.grouponInstStatus"
              :placeholder="$t('全部')"
              name="search_grouponInstStatus"
            >
              <el-option
                v-for="item in platformList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('开团时间:')" :space="2" prop="createTime">
            <ody-date-range-picker
              v-model="search.createTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="search_createTime"
              type="datetimer"
            />
          </ody-search-item>
          <ody-search-item :label="$t('渠道:')" prop="channelCode">
            <promotion-channel-code-select
              v-model="search.channelCode"
              :prom-type="search.promType"
              :placeholder="$t('请选择')"
              name="search_channelCode"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="handleSearchSubmit"
          size="small"
          type="primary"
          code="button001"
          @click.prevent="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          request-url="/back-promotion-web/patchGrouponRead/queryGrouponInstList.do"
        >
          <template
            slot="grouponStatus"
            slot-scope="scope"
          >{{ scope.row.grouponStatus | keyVal(getPlatformMap) }}</template>
          <template slot="launchTime" slot-scope="scope">{{ scope.row.launchTime | parseTime }}</template>
          <template slot="grouponInstId" slot-scope="scope">
            <a
              v-if="$portal.hasPermission('button003')"
              name="seeNewTab"
              class="activity-id-link"
              @click="seeNewTab(scope.row)"
            >{{ scope.row.grouponInstId }}</a>
            <a
              v-if="!$portal.hasPermission('button003')"
              name="seeNewTab"
              class="activity-id-link"
            >{{ scope.row.grouponInstId }}</a>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import * as utilService from '@/services/utilService'
import PromotionChannelCodeSelect from '@/components/promotion-channel-code-select'
export default {
  name: 'PromGrouponInstList',
  components: {
    PromotionChannelCodeSelect
  },
  data() {
    return {
      platformList: [
        {
          value: '-1',
          label: this.$t('所有')
        },
        {
          value: '0',
          label: this.$t('开团中')
        },
        {
          value: '2',
          label: this.$t('组团中')
        },
        {
          value: '3',
          label: this.$t('组团成功')
        },
        {
          value: '6',
          label: this.$t('组团失败')
        }
      ],
      channelMap: null,
      search: {
        grouponInstId: undefined, // 拼团单号
        catptainId: undefined, // 开团用户ID
        activityTitle: undefined, // 拼团名称
        startGrouponTime: undefined, // 拼团开始时间
        endGrouponTime: undefined, // 拼团结束时间
        channelCode: undefined, // 渠道
        createTime: [],
        promType: 2000,
        grouponInstStatus: '-1' // 拼团状态
      },
      table: {
        columns: [
          {
            label: this.$t('拼团单号'),
            slot: 'grouponInstId',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('拼团状态'),
            slot: 'grouponStatus',
            show: true
          },
          {
            label: this.$t('拼团活动ID'),
            prop: 'grouponThemeId',
            show: true
          },
          {
            label: this.$t('拼团活动名称'),
            prop: 'activityTitle',
            show: true
          },
          {
            show: true,
            prop: 'channelCode',
            label: this.$t('渠道'),
            align: 'center',
            formatter: (row, column, cellValue) => {
              return `<span>${this.getChannelName([row.channelCode])}</span>`
            }
          },
          {
            label: this.$t('开团用户ID'),
            show: true,
            prop: 'catptainId'
          },
          {
            label: this.$t('开团时间'),
            slot: 'launchTime',
            minWidth: 200,
            show: true
          }
        ],
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: this.$t('see'),
              method: (index, row) => {
                this.seeNewTab(row)
              },
              code: 'button003'
            }
          ]
        }
      }
    }
  },
  computed: {
    getPlatformMap() {
      return this.platformList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    // await this.loadOscConfig()
    await this.queryChannelMap()
    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('search')
    },
    async query() {
      this.search.createTime = this.search.createTime || []

      const {
        createTime: [startGrouponTime, endGrouponTime],
        ...params
      } = JSON.parse(JSON.stringify(this.search))

      params.startGrouponTime = startGrouponTime
      params.endGrouponTime = endGrouponTime
      const param = {
        obj: this.formHasValue(params)
      }

      return this.$refs.table.getList(param)
    },
    getChannelName(channelCodes) {
      if (utilService.isEmpty(channelCodes)) {
        return ''
      } else {
        return channelCodes
          .filter(x => this.channelMap[x])
          .map(item => {
            return this.channelMap[item].channelName
          })
          .join('、')
      }
    },
    async handleSubmit() {
      await this.query()
    },
    async loadOscConfig() {
      this.promotionAPI
        .loadOscConfigUrl('PROMOTION_CHANNEL_CODES')
        .then(response => {
          // 活动类型
          // this.channelMap = response.data.result
        })
    },
    // 渠道
    async queryChannelMap() {
      this.promotionAPI.queryChannelMap().then(response => {
        // 活动类型
        this.channelMap = response.data
      })
    },
    seeNewTab(e) {
      const params = {
        grouponInstId: e.grouponInstId,
        status: e.grouponStatus
      }
      if (this.search.promType === 2000) {
        this.$router.push({ name: 'PromGrouponInstDetail', params: params })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-id-link {
  color: #409eff;
}
</style>
