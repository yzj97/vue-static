<template>
  <div class="cms-choose-goods-set">
    <ody-choose
      v-if="visible"
      :checked="checked"
      :search-config="searchConfig"
      :search-value="searchValue"
      :request-url="requestUrl"
      :columns="columns"
      :search-format="changeParam"
      :highlight-current-row="true"
      :title="$t('添加促销')"
      choose-key="activityId"
      @close="handleClose"
      @submit="handleSubmit"
    >
      <template slot="activityId" slot-scope="scope">
        <el-input v-model="scope.row.activityId" :placeholder="$t('请输入活动ID')" name="scope_row_activityId" type="number" maxlength="18"/>
      </template>
      <template slot="channels" slot-scope="scope">
        <el-select v-model="scope.row.channels" :placeholder="$t('全部')" name="scope_row_channels" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </template>
      <template slot="promTypeList" slot-scope="scope">
        <el-select v-model="scope.row.promTypeList" :placeholder="$t('全部')" name="scope_row_promTypeList" >
          <el-option
            v-for="item in promotionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </template>
      <template slot="time" slot-scope="scope">
        <div>{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} - {{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
      </template>
      <template slot="promType" slot-scope="scope">
        <div>{{ promotionOptionsMap[scope.row.promType] }} </div>
      </template>
    </ody-choose>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    moduleId: {
      type: String,
      default: ''
    },
    promotionInfo: {
      type: Object,
      default: () => {}
    },
    channelsOption: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      checked: [],
      requestUrl: '/cms-web/cmsModule/promotionList',
      searchConfig: [
        {
          label: this.$t('活动ID'),
          prop: 'activityId',
          // type: 'input'
          slot: 'activityId'
        },
        {
          label: this.$t('活动名称'),
          prop: 'title',
          type: 'input',
          placeholder: this.$t('请输入活动名称')
        },
        {
          label: this.$t('活动类型'),
          slot: 'promTypeList'
        },
        {
          label: this.$t('渠道'),
          slot: 'channels'
        }
      ],
      options: this.channelsOption,
      promotionOptions: [
        {
          label: this.$t('单一促销'),
          value: '1'
        },
        {
          label: this.$t('满额促销'),
          value: '2'
        },
        {
          label: this.$t('满量促销'),
          value: '3'
        },
        {
          label: this.$t('赠送类促销'),
          value: '4'
        },
        {
          label: this.$t('包邮促销'),
          value: '9'
        },
        {
          label: this.$t('组合促销'),
          value: '10'
        },
        {
          label: this.$t('换购'),
          value: '11'
        }
      ],
      promotionOptionsMap: {},
      searchValue: {
        channels: '',
        activityId: '',
        title: '',
        promTypeList: '',
        moduleId: this.moduleId
      },
      columns: [
        {
          label: this.$t('活动ID'),
          prop: 'activityId',
          show: true
        },
        {
          label: this.$t('活动名称'),
          prop: 'title',
          show: true
        },
        {
          label: this.$t('活动类型'),
          slot: 'promType',
          show: true
        },
        {
          label: this.$t('活动时间'),
          slot: 'time',
          show: true
        },
        {
          label: this.$t('渠道'),
          prop: 'channel',
          show: true
        }
      ]
    }
  },
  mounted() {
    this.initChecked()
    this.getPromotionName()
  },
  methods: {
    initChecked() {
      if (this.promotionInfo.promotionId) {
        this.checked = [{ activityId: this.promotionInfo.promotionId }]
      }
    },
    getPromotionName() {
      this.promotionOptionsMap = this.promotionOptions.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    changeParam(val) {
      const obj = { ...val }
      if (val.channels) {
        obj.channels = [val.channels]
      } else {
        obj.channels = this.options.map(item => { return item.value })
      }
      if (val.promTypeList) {
        obj.promTypeList = [val.promTypeList]
      }
      return obj
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSubmit(val) {
      if (val.length === 0) {
        return
      }
      const arr = val.map(item => item.activityId)
      const params = {
        moduleId: this.moduleId,
        promoIds: arr
      }
      await this.$cms.$api.cmsEdit.savePromotion(params)
      this.$emit('update:visible', false)
      this.$emit('ok')
    }
  }

}
</script>

<style lang="scss" scoped>
input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
</style>
