<template>
  <div>
    <el-form
      ref="promotionGroup"
      :model="promotionGroup"
      :rules="singlePromotionRules"
      label-width="240px"
      class="form"
    >
      <ody-title :title="$t('基本信息')" />
      <div class="presale-promotion-content">
        <el-form-item :label="$t('拼团名称')" prop="activityTitle" name="activityTitle" required>
          <el-input
            v-model="promotionGroup.activityTitle"
            :placeholder="$t('限制在64个字符以内')"
            name="promotionGroup_activityTitle"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('活动时间')" prop="createTime" name="createTime">
          <el-date-picker
            v-model="promotionGroup.createTime"
            name="promotionGroup_createTime"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
      </div>
      <ody-title :title="$t('活动规则')" />
      <div class="single-promotion-content">
        <el-form-item
          :label="$t('团单时长')"
          prop="togetherTimeType"
          name="togetherTimeType"
          required
        >
          <ody-radio2
            v-model="promotionGroup.togetherTimeType"
            name="promotionGroup_togetherTimeType"
            list-key="promotionTogetherTimeLimit"
          />
          <span v-if="promotionGroup.togetherTimeType==1" class="hourInput">
            <ody-input-number
              :empty-tip="false"
              :min="1"
              v-model="promotionGroup.togetherTimeLimit"
              name="promotionGroup_togetherTimeLimit"
          /> {{ $t('小时') }}</span>
        </el-form-item>
        <el-form-item
          :label="$t('自动成团设置')"
          prop="autoCompleteTime"
          name="autoCompleteTime"
        >
          <span>
            <span>{{ $t('距结束') }}</span>
            <ody-input-number
              :empty-tip="false"
              :min="1"
              v-model="promotionGroup.autoCompleteTime"
              name="promotionGroup_autoCompleteTime" />
            <span>{{ $t('小时未成团则自动成团') }}</span>
          </span>
        </el-form-item>
        <el-form-item
          :label="$t('单用户参团限制')"
          prop="individualJoinType"
          name="individualJoinType"
          required
        >
          <ody-radio2
            v-model="promotionGroup.individualJoinType"
            name="promotionGroup_individualJoinType"
            list-key="promotionGroupTime"
          />
          <span v-if="promotionGroup.individualJoinType==1" class="hourInput">
            <ody-input-number
              :empty-tip="false"
              :min="1"
              v-model="promotionGroup.individualJoinTime"
              name="promotionGroup_individualJoinTime"
            />
            {{ $t('次') }}
          </span>
        </el-form-item>
        <el-form-item
          :label="$t('是否包邮')"
          prop="freeShipping"
          name="freeShipping"
          required
        >
          <ody-radio2
            v-model="promotionGroup.freeShipping"
            name="promotionGroup_freeShipping"
            list-key="promotionFreeShippingList"
          />
        </el-form-item>
        <el-form-item
          :label="$t('拼团人数')"
          prop="groupMembers"
          name="groupMembers"
          required
        >
          <span>
            <ody-input-number
              :empty-tip="false"
              :min="1"
              :max="999999"
              v-model="promotionGroup.groupMembers"
              name="promotionGroup_groupMembers"
              type="text"/>
            {{ $t('人') }}</span>
        </el-form-item>
        <el-form-item
          :label="$t('拼团模式')"
          prop="type"
          name="type"
          required
        >
          <el-radio-group v-if="groupModes.length>0" v-model="promotionGroup.type" name="promotionGroup_type">
            <el-radio v-for="item in groupModes" :key="item.type" :label="item.type" :value="item.type">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('活动图片')"
        >
          <ody-upload-image
            v-model="fileUrl"
            :pic-type="picType"
            :limit="1"
            :show-tip="false"
            :url="url"
            :params="params"
            name="fileUrl"
          />
        </el-form-item>
      </div>
      <ody-title :title="$t('参与条件')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动渠道')" prop="channelCodes">
          <el-radio-group v-if="activityChannels.length>0" v-model="activityChannels[0].type" name="activityChannels[0]_type">
            <el-radio :label="activityChannels[0].type" :value="activityChannels[0].type">{{ activityChannels[0].label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('活动对象')"
          prop="customerLimit"
          name="customerLimit"
          required
        >
          <ody-radio2
            v-model="promotionGroup.customerLimit"
            name="promotionGroup_customerLimit"
            list-key="promotionCustomerLimit"
          />
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="description">
          <!-- <ody-tinymce :tip-limit="false" :show-upload-img="false" :height="300" v-model="promotionGroup.description" :limit="100" name="promotionGroup_description" /> -->
          <el-input
            :rows="3"
            v-model="promotionGroup.description"
            :placeholder="$t('100个字符以内')"
            name="promotionGroup_description5"
            type="textarea"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
// import util from '@/utils/util'

export default {
  components: {
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'text'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    promType: {
      type: String,
      default: ''
    },
    promotionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileUrl: null,
      url: '/back-promotion-web/file/uploadImg.do',
      picType: ['png', 'jpg'],
      params: {
        file: 'file',
        jsonParams: JSON.stringify({
          objectType: '3',
          objectCode: 'SH1911040000151475'
        })
      },
      paramsUrlList: [],
      promotionGroup: {
        id: this.promotionId, // presellContentType:1,预售类型   预售价模式：(presellContentType == 2 && e.id !=2) || presellContentType == 1
        activityTitle: '', // 拼团名称
        activityType: 1,
        autoCompleteTime: null, //  自动成团设置 距结束时间几个小时自动成团
        customerLimit: 0, // 活动对象 0：不限制 1：仅限新用户 2：仅限老用户
        channelCodes: ['110001'],
        freeShipping: 0, // 包邮方式 是：2，否：0 默认否
        canUseCoupon: 0, // 优惠券使用
        merchantType: 0,
        reachNumLimitSwitch: 0, // 不知道什么意思
        groupMembers: '', // 拼团人数
        togetherTimeLimit: null, // 团单时长限制时  限制几个小时
        togetherTimeType: 0, // 团单时长限制不限制  1：限制  0不限制
        individualJoinTime: '', // 单用户参团限制  限多少次
        individualJoinType: 0, // 单用户参团限制 0：不限制 1：限制
        individualLaunchType: 0,
        haveThemeNameList: [], // 不知道什么意思
        type: 0, // 拼团模式 0：单品团 2：任意团 3 两种都支持
        createTime: [],
        effStartDate: '', // 拼团开始时间
        effEndDate: '', // 拼团结束时间
        newThemeNameList: [],
        themeIdList: [],
        // memberLevels: [], // 会员等级
        channelCode: undefined, // 活动渠道 110001：欧电云自建BBC
        description: '' // 备注

      },
      groupModes: [], // 拼团
      activityChannels: [{ type: '110001', lable: this.$t('欧电云自建BBC') }], // 拼团模式
      singlePromotionRules: {
        activityTitle: [
          { required: true, message: this.$t('请输入促销活动名称'), trigger: ['change', 'blur'] }
        ],
        createTime: [
          { required: true, message: this.$t('请选择活动时间'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const [startTime, endTime] = value
              if (startTime && endTime && new Date(startTime) * 1 >= new Date(endTime) * 1) {
                callback(new Error(this.$t('活动结束时间必须大于开始时间')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        groupMembers: [
          { required: true, message: this.$t('请输入拼团人数'), trigger: ['change', 'blur'] }
        ]
      },
      promotionAPI: null
    }
  },

  watch: {
    fileUrl: {
      handler: function(val) {
        const newVal = []
        if (val && !Array.isArray(val)) {
          newVal.push(val)
        }
        newVal.map(item => {
          const index = this.paramsUrlList.findIndex(row => row.mpPicUrl === item)
          if (index === -1) {
            this.paramsUrlList.push({
              mpPicUrl: item,
              refTheme: '',
              refType: 3,
              isMainPic: 0,
              mpPicTitle: ''
            })
          }
        })
        if (!val) {
          // 删除的时候
          this.paramsUrlList.map((item, itemIndex) => {
            const index = newVal.findIndex(row => row === item.mpPicUrl)
            if (index === -1) {
              this.paramsUrlList.splice(itemIndex, 1)
            }
          })
        }
      },
      deep: true
    },
    'preSalePromotion.preSellEndTime': {
      handler: function(newVal) {
        var date = newVal
        this.aaa = date
        this.defaultValueTime = new Date(date.replace(/-/g, '/'))
      },
      deep: true
    },
    'preSalePromotion.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected.length > 0) {
            this.preSalePromotion.memberLevels = this.memberTypesSelected.reduce((rtv, item) => {
              rtv = [...rtv, ...item.memberLevelList.map(x => x.levelCode)]
              return rtv
            }, [])
          }

          if (val && val.length <= 0) {
            this.preSalePromotion.memberLevels = []
          }
        })
      },
      deep: true
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.loadOscConfigUrl()
    await this.queryChannelMap()
    await this.getLoadPageConfigCommonOscUrl()
    await this.getLoadPlatformSelectionConfigUrl()
    if (this.promotionId !== '') {
      this.queryPromotionActivityDetail()
      this.queryAttendImages()
    }
  },
  methods: {
    queryAttendImages() {
      this.promotionAPI.queryAttendImages({ refTheme: this.promotionId, refType: 3 }).then(res => {
        this.paramsUrlList = res.data || []
        const arr = []
        this.paramsUrlList.map(item => {
          arr.push(item.mpPicUrl)
        })
        this.fileUrl = arr
      })
    },
    getParamsUrlList() {
      return this.paramsUrlList
    },
    // 设置开始发货禁用时间
    disabledDate(time) {
      const times = new Date(this.aaa).getTime()
      return time.getTime() < times - 8.64e7
    },
    // loadOscConfigUrl
    async queryChannelMap() {
      const { data = {}, code } = await this.promotionAPI.queryChannelMap()
      if (code === '0' && data) {
        this.activityChannels = []
        const mapList = data
        const channels = this.channelMapList
        for (var i = 0; i < channels.length; i++) {
          const index = channels[i]
          if (mapList[index]) {
            console.log(mapList[index])
            const obj = {}
            obj.label = mapList[index].channelName
            obj.type = mapList[index].channelCode
            this.activityChannels.push(obj)
          }
        }
      }
    },
    async loadOscConfigUrl() {
      const { data = {}, code } = await this.promotionAPI.loadOscConfigUrl('PROMOTION_CHANNEL_CODES')
      if (code === '0' && data) {
        data.result.forEach(item => {
          if (item.promotionType === 2000) {
            this.channelMapList = item.channelCodes
          }
        })
      }
    },

    async getLoadPageConfigCommonOscUrl() {
      const { data = {}, code } = await this.promotionAPI.getLoadPageConfigCommonOscUrl('PAGE_CONFIG_NOT_SAME')
      if (+code !== 0) {
        return
      }
      this.groupModes = []
      if (data.patchGroupModel === '0') {
        this.groupModes.push({ type: 0, label: this.$t('单品团') })
      } else if (data.patchGroupModel === '2') {
        this.groupModes.push({ type: 2, label: this.$t('任意团') })
      } else {
        this.groupModes.push({ type: 0, label: this.$t('单品团') }, { type: 2, label: this.$t('任意团') })
      }
      if (data.merchantType) {
        this.promotionGroup.merchantType = data.merchantType
      }
    },
    handleMemberLevelsChange(type, isChecked) {
      const beforeIndex = this.preSalePromotion.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected.findIndex((item) => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.preSalePromotion.memberTypes.push(type)
          this.memberTypesSelected = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.preSalePromotion.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected.splice(beforeTypeIndex, 1)
        }
      }
    },
    async queryPromotionActivityDetail() {
      const { data = {}, data: { effStartDate = '', effEndDate = '' }, code } = await this.promotionAPI.queryPatchGrouponThemeDetail(this.promotionGroup)
      if (code === '0') {
        this.promotionGroup = data

        this.$set(this.promotionGroup, 'createTime', [effStartDate, effEndDate])
        // this.promotionGroup.createTime = [effStartDate, effEndDate]
      }
    },
    async getLoadPlatformSelectionConfigUrl() {
      const { data = {}, code } = await this.promotionAPI.getLoadPlatformSelectionConfigUrl({})
      if (code === '0') {
        console.log(data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .hourInput{
        margin-left: 0.8rem;
    }
</style>
