<template>
  <section>
    <el-form ref="form" :model="edit" :rules="rules" label-width="120px" class="form" style="width: 80%;">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('活动名称')" :required="true" prop="name">
            <el-input
              ref="name"
              v-model="edit.name"
              :disabled="readonly"
              name="name"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('活动类型')" :required="true" prop="type">
            <ody-dict-select ref="type" v-model="edit.type" :disabled="readonly" :placeholder="$t('请选择')" :is-number="false" pool="social" category="apply_activity_type" name="type" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('活动轮播图')" prop="banner">
            <el-row>
              <el-col :span="20">
                <ody-upload-image
                  ref="banner"
                  v-model="edit.banner"
                  :limit="5"
                  :pic-type="['png', 'jpg', 'jpeg']"
                  :pic-size="4096"
                  :show-tip="false"
                  :disabled="readonly"
                  :draggable="true"
                  :show-mian-mark="true"
                  name="banner"
                />
                <div>
                  <span>{{ $t('提示：') }}<br></span>
                  <span>{{ $t('1. 至少上传一张，最多五张图片，支持JPG、JPEG、PNG格式。') }}<br></span>
                  <span>{{ $t('2. 建议使用700*700px，单张大小不超过4M。') }}<br></span>
                  <span>{{ $t('3. 拖动图片可调整图片的位置') }}<br></span>
                </div>
              </el-col>
              <el-col :span="4">
                <ody-button v-if="!readonly" name="SocialPostClearAllPicture_confirmClearAllPicture" code="SocialPostClearAllPicture" type="text" @click="confirmClearAllPicture">{{ $t('清空全部图片') }}</ody-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('活动视频')" prop="video">
            <div style="display:flex">
              <ody-upload-video v-model="edit.video" name="video" />
              <ody-upload-image v-model="edit.video.imagsrc" :label="$t('更换视频封面')" name="imagsrc" />
            </div>
            <div>{{ $t('提示： 支持MP4、AVI格式，不超过50M。') }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('报名时间')" prop="applyTimeRange">
            <el-date-picker
              ref="applyTimeRange"
              v-model="edit.applyTimeRange"
              :picker-options="pickerOptions"
              :disabled="readonly"
              :range-separator="$t('~')"
              :start-placeholder="$t('开始时间')"
              :end-placeholder="$t('结束时间')"
              type="datetimerange"
              name="applyTimeRange"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('活动时间')" prop="activityTimeRange">
            <el-date-picker
              ref="activityTimeRange"
              v-model="edit.activityTimeRange"
              :picker-options="pickerOptions"
              :disabled="readonly"
              :range-separator="$t('~')"
              :start-placeholder="$t('开始时间')"
              :end-placeholder="$t('结束时间')"
              type="datetimerange"
              name="activityTimeRange"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('活动说明')" prop="description">
            <el-input
              ref="description"
              v-model="edit.description"
              :autosize="{ minRows: 2, maxRows: 4}"
              :disabled="readonly"
              type="textarea"
              name="description"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('联系人')" prop="contactName">
            <el-input
              ref="contactName"
              v-model="edit.contactName"
              :disabled="readonly"
              name="contactName"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('联系电话')" prop="contactMobile">
            <el-input
              ref="contactMobile"
              v-model="edit.contactMobile"
              :disabled="readonly"
              name="contactMobile"
              maxlength="11"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('人数限制')" prop="limitType">
            <div>
              <el-radio v-model="edit.limitType" :disabled="readonly" name="limitType1" label="1">{{ $t('不限') }}</el-radio>
            </div>
            <div>
              <el-radio v-model="edit.limitType" :disabled="readonly" name="limitType2" label="2">{{ $t('上限') }}</el-radio>
              <ody-input-number
                ref="limitNum"
                v-model="edit.limitNum"
                :disabled="readonly"
                :min="1"
                :max="9999999999"
                name="limitNum"
              />
              {{ $t('人') }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('付费类型')" prop="payType">
            <div>
              <el-radio v-model="edit.payType" :disabled="readonly" name="payType1" label="1">{{ $t('免费') }}</el-radio>
            </div>
            <div>
              <el-radio v-model="edit.payType" :disabled="readonly" name="payType2" label="2">{{ $t('售价') }}</el-radio>
              <ody-input-number
                ref="payType"
                v-model="edit.payAmount"
                :disabled="readonly"
                :decimal="2"
                :min="0.01"
                :max="9999999999.99"
                name="payAmount"
              />
              {{ $t('元') }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('发布渠道')" prop="channelCodes">
            <el-checkbox :indeterminate="isIndeterminate" :disabled="readonly" v-model="checkAll" @change="handleCheckAllChange">{{ $t('全选') }}</el-checkbox>
            <el-checkbox-group ref="channelCodes" v-model="edit.channelCodes" :disabled="readonly" name="channelCodes" @change="handleCheckedChannelChange">
              <el-checkbox v-for="item in channelList" :label="item.channelCode" :key="item.channelCode">{{ item.channelName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <ody-fixed>
        <el-button name="back" size="small" @click="back">{{ $t('关闭') }}</el-button>
        <ody-button v-loading="saving" v-permission="['ApplyActivity_add', 'ApplyActivity_update']" v-show="!readonly" name="ApplyActivity_save" code="ui" size="small" type="primary" @click="save">{{ $t('保存') }}</ody-button>
      </ody-fixed>
    </el-form>
  </section>
</template>

<script>
export default {
  name: 'ApplyActivityDetail',
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          const curDate = new Date()
          curDate.setHours(0)
          curDate.setMinutes(0)
          curDate.setSeconds(0)
          curDate.setUTCMilliseconds(0)
          return time.getTime() < curDate.getTime()
        }
      },
      checkAll: false,
      isIndeterminate: true,
      saving: false,
      readonly: false,
      update: false,
      edit: this.initData(),
      typeDict: {},
      channelList: [],
      channelCodeList: [],
      rules: {
        name: [{ required: true, message: this.$t('请输入') + this.$t('活动名称') }],
        type: [{ required: true, message: this.$t('请输入') + this.$t('活动类型') }],
        banner: [{ required: true, message: this.$t('请选择') + this.$t('活动轮播图') }],
        applyTimeRange: [{ required: true, message: this.$t('请选择') + this.$t('报名时间') }],
        activityTimeRange: [{ required: true, message: this.$t('请选择') + this.$t('活动时间') }],
        description: [{ required: true, message: this.$t('请输入') + this.$t('活动说明') }],
        contactName: [{ required: true, message: this.$t('请输入') + this.$t('联系人') }],
        contactMobile: [
          { required: true, message: this.$t('请输入') + this.$t('联系电话') },
          { pattern: /^1[0-9]{10}$/, message: this.$t('the_cell_phone_number_is_not_in_accordance_with_the_rules'), trigger: 'change' }
        ],
        limitType: [{ required: true, message: this.$t('请选择') + this.$t('人数限制') }],
        payType: [{ required: true, message: this.$t('请选择') + this.$t('付费类型') }],
        channelCodes: [{ required: true, message: this.$t('请选择') + this.$t('发布渠道') }]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.readonly = (typeof this.$route.query.readonly === 'boolean') ? this.$route.query.readonly : (this.$route.query.readonly !== 'false')
      if (this.$route.query.id) {
        this.update = !this.readonly
        this.saving = true
        const res = await this.$social.$api.applyActivity.getById({ id: this.$route.query.id })
        this.saving = false
        if (res.data.video) {
          res.data.video.imagsrc = res.data.video.img
        }
        res.data.limitType = res.data.limitType.toString()
        res.data.payType = res.data.payType.toString()
        res.data.type = res.data.type.toString()
        res.data.applyTimeRange = [res.data.startApplyTime, res.data.endApplyTime]
        res.data.activityTimeRange = [res.data.startActivityTime, res.data.endActivityTime]
        this.edit = res.data
      } else {
        this.edit = this.initData()
      }
      const categories = []
      categories.push('apply_activity_type')
      const res = await this.$social.$api.common.listMultiCode({ 'categories': categories })
      this.typeDict = res.data['apply_activity_type']
      await this.initChannel()
    },
    async initChannel() {
      const res = await this.$social.$api.common.listAllChannels({})
      this.channelList = []
      this.channelCodeList = []
      for (var key in res.data) {
        const item = res.data[key]
        this.channelCodeList.push(item.channelCode)
        this.channelList.push({
          channelCode: item.channelCode,
          channelName: item.channelName
        })
      }
    },
    handleCheckAllChange(val) {
      this.edit.channelCodes = val ? this.channelCodeList : []
      this.isIndeterminate = false
    },
    handleCheckedChannelChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.channelList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.channelList.length
    },
    initData() {
      return {
        name: '',
        type: '',
        banner: [],
        video: {
          url: '',
          imagsrc: ''
        },
        applyTimeRange: [],
        startApplyTime: null,
        endApplyTime: null,
        activityTimeRange: [],
        startActivityTime: null,
        endActivityTime: null,
        description: null,
        contactName: null,
        contactMobile: null,
        limitType: '1',
        limitNum: null,
        payType: '1',
        payAmount: null,
        channelCodes: [],
        id: null
      }
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.edit.limitType === '1') {
            this.edit.limitNum = null
          } else {
            if (!this.edit.limitNum) {
              this.$message.warning(this.$t('请输入上限人数'))
              return
            }
          }
          if (this.edit.payType === '1') {
            this.edit.payAmount = null
          } else {
            if (!this.edit.payAmount) {
              this.$message.warning(this.$t('请输入售价'))
              return
            }
          }
          this.saving = true
          this.edit.video.img = this.edit.video.imagsrc
          if (this.edit.applyTimeRange && this.edit.applyTimeRange.length > 1) {
            this.edit.startApplyTime = this.edit.applyTimeRange[0]
            this.edit.endApplyTime = this.edit.applyTimeRange[1]
          }
          if (this.edit.activityTimeRange && this.edit.activityTimeRange.length > 1) {
            this.edit.startActivityTime = this.edit.activityTimeRange[0]
            this.edit.endActivityTime = this.edit.activityTimeRange[1]
          }
          const api = this.edit.id ? this.$social.$api.applyActivity.update : this.$social.$api.applyActivity.add
          api(this.edit).then((res) => {
            this.saving = false
            this.$alert(this.$t('保存成功'), this.$t('系统信息'), {
              confirmButtonText: this.$t('确定'),
              callback: action => {
                this.back()
              }
            })
          }, (res) => {
            this.saving = false
          })
        }
      })
    },
    confirmClearAllPicture() {
      this.edit.banner = []
    },
    back() {
      this.$portal.delActiveViewAndRefresh('ApplyActivityManage')
    }
  }
}
</script>

