<template>
  <div class="cp-promotion-choose">
    <template v-if="multiple">
      <ody-button v-bind="$attrs" code="ui" type="default" size="small" @click="handleChooseOpen">+ 选择促销</ody-button>
      <template v-if="view">
        已选 <span class="selected"> {{ value.length }} </span> 个
        <ody-button
          :disabled="value.length === 0"
          code="ui"
          size="small"
          type="text"
          class="width-auto"
          @click="handleViewOpen"
        >
          查看
        </ody-button>
      </template>
    </template>
    <template v-else>
      <el-input
        v-model="label"
        v-bind="$attrs"
        :clearable="true"
        class="is-readonly"
        @focus="handleChooseOpen"
        @clear="handleClear"
      />
    </template>

    <ody-choose
      v-if="status === 'choose'"
      :visible="status === 'choose'"
      :search-config="choose.searchConfig"
      :search-format="searchFormat"
      :search-value="choose.searchValue"
      :checked="innerChecked"
      :choose-key="valueKey"
      :request-url="choose.requestUrl"
      :columns="choose.columns"
      :multiple="multiple"
      :highlight-current-row="!multiple"
      :limit="limit"
      :title="$t('促销选择')"
      @close="handleChooseClose"
      @submit="handleChooseSubmit"
    >
      <template slot="channelCode" slot-scope="scope">
        <el-form-item prop="channelCode">
          <ody-channel-select ref="channel" v-model="scope.row.channelCode" />
        </el-form-item>
      </template>
      <template slot="merchantId" slot-scope="scope">
        <el-form-item prop="merchantId">
          <ody-merchant-select v-model="scope.row.merchantId" :placeholder="$t('全部')" value-key="merchantId" />
        </el-form-item>
      </template>
      <template slot="storeId" slot-scope="scope">
        <el-form-item prop="storeId">
          <ody-store-select v-model="scope.row.storeId" :placeholder="$t('全部')" value-key="storeId" />
        </el-form-item>
      </template>
      <template slot="promType" slot-scope="scope">
        <el-form-item prop="promType">
          <ody-promotion-type-select
            v-model="scope.row.promType"
            :placeholder="$t('全部')"
            :clearable="false"
            :item-filter="itemFilter"
          />
        </el-form-item>
      </template>
      <template slot="activityId" slot-scope="scope">
        <el-form-item prop="activityId">
          <el-input
            v-model="scope.row.activityId"
            maxlength="19"
            @input="scope.row.activityId=scope.row.activityId.replace(/[^\d]/g,'')"
          />
        </el-form-item>
      </template>
      <template slot="status" slot-scope="scope">
        <el-form-item prop="status">
          <ody-select2 v-model="scope.row.status" :placeholder="$t('全部')" list-key="promotionStatusList"/>
        </el-form-item>
      </template>
      <template slot="dataFrontPromotionType" slot-scope="scope">
        {{ scope.row.frontPromotionType | keyVal(getFrontProntPromotionTypeMap) }}
      </template>
      <template slot="dataChannelCodes" slot-scope="scope">
        {{ scope.row.channelCodes | getChannelName(channelMap) }}
      </template>
      <template slot="dataStartTime" slot-scope="scope">
        <template v-if="scope.row.startTime && scope.row.endTime">
          {{ scope.row.startTime | parseTime }} ~ {{ scope.row.endTime | parseTime }}
        </template>
      </template>
      <template slot="dataStatus" slot-scope="scope">
        {{ scope.row.status | keyVal(getPromotionStatusMap) }}
      </template>
    </ody-choose>
    <ody-dialog
      v-else-if="status === 'view'"
      :visible="status === 'view'"
      :append-to-body="true"
      title="促销查看"
      width="960px"
      @close="handleViewClose"
      @change-max-height="handleMaxHeight"
    >
      <ody-button
        :disabled="innerViewChecked.length === 0"
        code="ui"
        type="primary"
        size="small"
        style="margin-bottom: 10px;"
        @click="handleViewBatchDelete"
      >
        批量删除
      </ody-button>
      <ody-table
        v-if="innerChecked.length === 0"
        key="view-null"
        :max-height="tableMaxHeight"
        :columns="choose.columns"
        :checked.sync="innerViewChecked"
        :can-filter="false"
        :multiple="true"
        :show-pagination="false"
        :operates="viewOperates"
      />
      <ody-table
        v-else
        key="view-has"
        ref="tableView"
        :max-height="tableMaxHeight"
        :request-url="choose.requestUrl"
        :columns="choose.columns"
        :checked.sync="innerViewChecked"
        :can-filter="false"
        :multiple="true"
        :show-pagination="false"
        :operates="viewOperates"
      >
        <template slot="dataFrontPromotionType" slot-scope="scope">
          {{ scope.row.frontPromotionType | keyVal(getFrontProntPromotionTypeMap) }}
        </template>
        <template slot="dataChannelCodes" slot-scope="scope">
          {{ scope.row.channelCodes | getChannelName(channelMap) }}
        </template>
        <template slot="dataStartTime" slot-scope="scope">
          <template v-if="scope.row.startTime && scope.row.endTime">
            {{ scope.row.startTime | parseTime }} ~ {{ scope.row.endTime | parseTime }}
          </template>
        </template>
        <template slot="dataStatus" slot-scope="scope">
          {{ scope.row.status | keyVal(getPromotionStatusMap) }}
        </template>
      </ody-table>
      <span slot="footer">
        <ody-button code="ui" size="small" type="primary" @click="handleViewClose">知道了</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import constant from 'packages/utils/constant/'

export default {
  filters: {
    getChannelName(channelCodes, channelMap) {
      if (channelCodes) {
        return channelCodes.map((item) => {
          return channelMap[item].channelName
        }).join('、')
      }

      return ''
    }
  },
  props: {
    limit: {
      type: Number,
      default: Infinity
    },
    view: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    value: [String, Array],
    selected: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: String,
      default: 'activityId'
    },
    labelKey: {
      type: String,
      default: 'title'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableMaxHeight: 0,
      label: '',
      status: '',
      innerChecked: [],
      innerViewChecked: [],
      choose: {
        searchConfig: [
          {
            label: '所属渠道:',
            slot: 'channelCode'
          },
          {
            label: '所属商家:',
            slot: 'merchantId'
          },
          {
            label: '所属门店:',
            slot: 'storeId'
          },
          {
            label: '活动类型:',
            slot: 'promType'
          },
          {
            label: '活动名称:',
            prop: 'title',
            type: 'input'
          },
          {
            label: '活动ID:',
            slot: 'activityId'
          },
          {
            label: '活动状态:',
            slot: 'status'
          }
        ],
        searchValue: {
          channelCode: null,
          merchantId: null,
          storeId: null,
          promotionTypeId: null,
          title: null,
          activityId: null,
          status: null
        },
        requestUrl: '/back-promotion-web/promotionRead/queryPromotionList.do',
        columns: [
          {
            label: '活动ID',
            prop: 'activityId',
            show: true,
            minWidth: 180
          },
          {
            label: '活动名称',
            prop: 'title',
            show: true,
            minWidth: 180
          },
          {
            label: '活动类型',
            slot: 'dataFrontPromotionType',
            show: true,
            minWidth: 120
          },
          {
            label: '活动渠道',
            slot: 'dataChannelCodes',
            show: true,
            minWidth: 300
          },
          {
            label: '活动时间',
            slot: 'dataStartTime',
            show: true,
            minWidth: 300
          },
          {
            label: '活动状态',
            slot: 'dataStatus',
            show: true,
            minWidth: 100
          }
        ]
      },
      channelMap: {},
      viewOperates: {
        width: 80,
        fixed: 'right',
        list: [
          {
            label: '删除',
            method: async(index, row) => {
              await this.handleViewDelete(index, row)
            },
            code: 'ui'
          }
        ]
      },
      frontProntPromotionTypeList: [
        {
          id: 1,
          text: '单一促销',
          children: [
            { id: 1, text: '特价' },
            { id: 7, text: '折扣' },
            { id: 8, text: '直降' }
          ]
        },
        {
          id: 2,
          text: '满额促销',
          children: [
            { id: 1001, text: '满额折' },
            { id: 1002, text: '满额减' }
          ]
        },
        {
          id: 3,
          text: '满量促销',
          children: [
            { id: 1003, text: '满量折' },
            { id: 1004, text: '满量减' }
          ]
        },
        {
          id: 4,
          text: '赠送类促销',
          children: [
            { id: 1005, text: '满额赠' },
            { id: 1006, text: '满量赠' },
            { id: 1007, text: '买一赠一' }
          ]
        },
        { id: 7, text: '秒杀促销', children: [{ id: 1012, text: '秒杀' }] },
        { id: 8, text: '闪购', children: [{ id: 1013, text: '闪购' }] },
        {
          id: 9,
          text: '包邮促销',
          children: [
            { id: 1014, text: '满额包邮' },
            { id: 1015, text: '满量包邮' }
          ]
        },
        {
          id: 10,
          text: '组合促销',
          children: [
            { id: 1016, text: 'X元Y件' },
            { id: 1017, text: 'X件付Y件' }
          ]
        },
        {
          id: 11,
          text: '换购促销',
          children: [
            { id: 1018, text: '满额换购' },
            { id: 1019, text: '满量换购' }
          ]
        },
        {
          id: 12,
          text: '支付优惠',
          children: [
            { id: 1020, text: '满减优惠' },
            { id: 1021, text: '打折优惠' }
          ]
        },
        {
          id: 13,
          text: '预售',
          children: [
            { id: 1022, text: '定金预售' },
            { id: 1024, text: '全款预售' }
          ]
        },
        { id: 14, text: '来抢购', children: [{ id: 1023, text: '来抢购' }] },
        { id: 15, text: '套餐', children: [{ id: 1025, text: '优惠套餐' }] },
        { id: 16, text: '试用活动', children: [{ id: 1026, text: '试用活动' }] },
        { id: 17, text: '众筹', children: [{ id: 1031, text: '众筹' }] },
        {
          id: 18,
          text: '第X件优惠',
          children: [
            { id: 1032, text: '第X件Y折' },
            { id: 1033, text: '第X件Y元' }
          ]
        },
        {
          id: 2000,
          text: '拼团',
          children: [
            { id: 2001, text: '单拼' },
            { id: 2002, text: '多拼' }
          ]
        },
        { id: 3001, text: '砍价', children: [{ id: 3001, text: '砍价' }] },
        { id: 5001, text: '抽奖', children: [{ id: 5001, text: '抽奖' }] },
        {
          id: 6000,
          text: '优惠券',
          children: [
            { id: 6001, text: '电子券' },
            { id: 6002, text: '实体券' },
            { id: 6003, text: '红包' }
          ]
        },
        { id: 8000, text: '推荐码', children: [{ id: 8000, text: '推荐码' }] }
      ]
    }
  },
  computed: {
    getFrontProntPromotionTypeMap() {
      return this.frontProntPromotionTypeList.reduce((rtv, item) => {
        item.children.forEach(x => {
          rtv[x.id] = x.text
        })
        return rtv
      }, {})
    },
    getPromotionStatusMap() {
      return constant.promotionStatusList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  watch: {
    selected: {
      handler(newVal) {
        if (this.multiple) {
          const hasValue = this.value && this.value.length
          const hasSelected = this.selected && this.selected.length

          if (hasSelected) {
            if (!hasValue) {
              this.value = []
            }
            this.innerChecked = this.$portal.deepClone(this.selected)
          } else {
            this.innerChecked = []
          }
        } else {
          const hasValue = this.value != null && this.value !== ''
          const hasSelected = this.selected && Object.keys(this.selected).length

          if (hasSelected) {
            if (!hasValue) {
              this.value = {}
            }
            this.label = this.selected[this.labelKey] || ''
          } else {
            this.label = ''
          }
        }
      },
      immediate: true,
      deep: true // 可以深度检测到 person 对象的属性值的变化
    },
    value: {
      handler(newVal) {
        if (this.multiple) {
          const hasValue = this.value && this.value.length
          const hasSelected = this.selected && this.selected.length

          if (hasValue) {
            if (!hasSelected) {
              const createSelected = newVal.map(x => ({ [this.valueKey]: x }))

              this.selected = createSelected
              this.innerChecked = []
            }
          } else {
            this.innerChecked = []
          }
        } else {
          const hasValue = this.value != null && this.value !== ''
          const hasSelected = this.selected && Object.keys(this.selected).length

          if (hasValue) {
            if (!hasSelected) {
              this.selected = {}
            }
            this.label = this.selected[this.labelKey] || ''
          } else {
            this.label = ''
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  async mounted() {
    await this.getChannelMap()
  },
  methods: {
    itemFilter(x, index) {
      // 促销类型wiki: http://wiki.odianyun.local/pages/viewpage.action?pageId=10916803
      // 去除 优惠券 和 推荐码
      return ![6000, 8000].includes(x.id)
    },
    handleMaxHeight(maxHeight) {
      this.dialogMaxHeight = maxHeight

      if (maxHeight === 0) {
        this.tableMaxHeight = 1000
        return false
      }

      const dialogHeight = 48
      const dialogPaddingTop = 24
      const dialogPaddingBottom = 12
      const tableMaxHeight =
        maxHeight -
        dialogHeight -
        dialogPaddingTop -
        dialogPaddingBottom -
        100

      this.tableMaxHeight = tableMaxHeight
    },
    async handleViewBatchDelete() {
      const res = await this.$confirm('确定删除吗?', this.$t('提示'), {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      if (!res) {
        return
      }

      const checkMap = this.innerViewChecked
        .map(x => x[this.valueKey])
        .reduce((rtv, item) => {
          rtv[item] = true
          return rtv
        }, {})

      this.innerChecked = this.innerChecked.filter((item, index) => !checkMap[item[this.valueKey]])
      this.innerViewChecked = []

      this.$emit('input', this.innerChecked.map(x => x[this.valueKey]))
      this.$emit('delete')
      this.initView()
    },
    async handleViewDelete(index, row) {
      const res = await this.$confirm('确定删除吗?', this.$t('提示'), {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      if (!res) {
        return
      }

      this.innerChecked.splice(index, 1)
      this.$emit('input', this.innerChecked.map(x => x[this.valueKey]))
      this.$emit('delete')
      this.initView()
    },
    async getChannelMap() {
      const { data } = await this.$api.channel.queryChannelMap({})

      this.channelMap = data
    },
    handleViewOpen() {
      this.status = 'view'
      this.initView()
    },
    initView() {
      this.$nextTick(async() => {
        const activityIdList = this.innerChecked.map(x => x[this.valueKey])
        activityIdList && activityIdList.length && await this.$refs.tableView.getList({
          currentPage: 1,
          itemsPerPage: 100,
          obj: {
            activityIdList
          }
        })
      })
    },
    handleViewClose() {
      this.status = ''
    },
    searchFormat(params) {
      params.promTypeList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 2000, 3001, 4001, 5001, 7000, 10000]
      return {
        obj: params
      }
    },
    handleClear() {
      this.$emit('input', '')
      this.$emit('update:selected', {})
      this.$emit('clear')
    },
    handleChooseOpen() {
      if (this.$attrs.disabled) {
        return false
      }
      this.status = 'choose'
      this.$emit('open')
    },
    handleChooseClose() {
      this.status = ''
      this.$emit('cancel')
    },
    handleChooseSubmit(val) {
      let selected
      let value

      if (this.multiple) {
        selected = val
        value = selected.map(x => x[this.valueKey])
      } else {
        [selected = {}] = val
        this.label = selected[this.labelKey]
        value = selected[this.valueKey]
      }

      this.status = ''
      this.innerChecked = val
      this.value = value
      this.selected = selected
      this.$emit('input', value)
      this.$emit('update:selected', selected)
      this.$emit('ok', selected)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-promotion-choose {
  .selected {
    color: red;
  }
  .is-readonly {
    /deep/ {
      .el-input__inner {
        background: #eef5f9;
      }
    }
  }
}
</style>
