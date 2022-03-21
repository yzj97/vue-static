<template>
  <section>
    <ody-box>
      <el-form ref="form" :model="detail" :rules="rules" label-width="120px" class="form">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('直播预告标题')" prop="title">
              <el-input
                ref="title"
                :disabled="view"
                :placeholder="$t('请输入直播预告标题')"
                v-model="detail.title"
                maxlength="50"
                name="title"
                show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('封面图')" prop="coverImg">
              <ody-upload-image
                ref="coverImg"
                :disabled="view"
                v-model="detail.coverImg"
                :multiple="false"
                :pic-size="4096"
                :pic-type="['jpg', 'png']"
                :show-tip="true"
                name="coverImg"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('直播类型')" prop="type">
              <el-select ref="type" v-model="detail.type" :disabled="view || edit || false" :placeholder="$t('请选择直播类型')" name="type">
                <el-option v-for="(value, key) in liveTypeMap" :key="key" :label="value" :value="key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="detail.type === '0'" :label="$t('面向渠道')" prop="channelCode">
              <el-select ref="channelCode" v-model="detail.channelCode" :disabled="view || edit || false" :placeholder="$t('请选择面向渠道')" name="channelCode">
                <el-option v-for="item in channelList" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="detail.type === '1'" :label="$t('选择店铺')" prop="storeId">
              <ody-store-choose
                ref="storeId"
                :disabled="view || edit || false"
                :placeholder="$t('请选择店铺')"
                :selected.sync="selectedStore"
                :params="storeParams"
                v-model="detail.storeId"
                value-key="storeId"
                name="storeId"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('主播手机号')" prop="mobile">
              <el-input
                ref="mobile"
                :disabled="view"
                :placeholder="$t('请输入主播手机号')"
                v-model="detail.mobile"
                maxlength="11"
                name="mobile"
                show-word-limit
                @change="checkMobile()"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('主播姓名')" prop="title">
              <el-col>{{ detail.nickname }}</el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('预计开始时间')" prop="expectStartTime">
              <el-date-picker
                ref="expectStartTime"
                :disabled="view"
                :picker-options="pickerOptions"
                :placeholder="$t('请选择预计开始时间')"
                v-model="detail.expectStartTime"
                type="datetime"
                name="expectStartTime"
                default-time="12:00:00"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('贴纸')" prop="pasterImg">
              <ody-upload-image
                ref="pasterImg"
                v-model="detail.pasterImg"
                :disabled="view"
                :multiple="false"
                :pic-size="4096"
                :pic-type="['jpg', 'png']"
                :show-tip="true"
                name="pasterImg"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('分享封面图')" prop="shareImg">
              <ody-upload-image
                ref="shareImg"
                v-model="detail.shareImg"
                :disabled="view"
                :multiple="false"
                :pic-size="4096"
                :pic-type="['jpg', 'png']"
                :show-tip="true"
                name="shareImg"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('分享文案')" prop="shareContent">
              <el-input v-model="detail.shareContent" :disabled="view" :autosize="{ minRows: 2, maxRows: 4}" name="detail_shareContent" type="textarea" maxlength="20" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 10px">
          <el-button name="back" size="small" @click="back">{{ $t('关闭') }}</el-button>
          <ody-button v-loading="saving" v-show="!view" name="live_save" code="ui" size="small" type="primary" @click="save(0)">{{ $t('保存') }}</ody-button>
          <ody-button v-loading="saving" v-show="!view" name="live_submit" code="ui" size="small" type="primary" @click="save(1)">{{ $t('直接提交') }}</ody-button>
        </el-row>
      </el-form>
    </ody-box>
  </section>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default: function() {
        return {
          title: null,
          coverImg: null,
          channelCode: null,
          type: '0',
          storeId: null,
          userId: null,
          nickname: null,
          expectStartTime: null,
          pasterImg: null,
          shareImg: null,
          shareContent: null
        }
      }
    },
    edit: {
      type: Boolean,
      default: false
    },
    view: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      saving: false,
      update: false,
      channelList: [],
      liveTypeMap: {},
      selectedStore: {},
      storeParams: {
        channelCodes: [110001, 110003]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      rules: {
        title: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        coverImg: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        channelCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        type: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        storeId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        mobile: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { pattern: /^1[0-9]{10}$/, message: this.$t('请输入正确的手机号'), trigger: 'change' }
        ],
        expectStartTime: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        pasterImg: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        shareImg: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        shareContent: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initChannel()
      this.initCode()
      if (this.$route.query.id) {
        this.update = !this.edit
        this.saving = true
        const res = await this.$live.$api.live.getById({ id: this.$route.query.id })
        this.saving = false
        res.data.type = res.data.type.toString()
        if (res.data.type === '1') {
          this.selectedStore.storeId = res.data.storeId
          this.selectedStore.storeName = res.data.name
          this.selectedStore.logoUrl = res.data.headerImg
          this.selectedStore.channelCode = res.data.channelCode
        }
        this.detail = res.data
      }
    },
    async initChannel() {
      const vue = this
      const res = await vue.$live.$api.commonApi.listChannel({
        filters: {
          onOrOffLine: '1',
          channelType: '1',
          channelMode: [
            'O+O',
            'BBC'
          ]
        }
      })

      vue.channelList = res.data
    },
    async initCode() {
      const data = await this.$live.$api.commonApi.code_listMulti({ categorys: ['LIVE_TYPE'] })
      this.liveTypeMap = data.data.LIVE_TYPE
    },
    save(status) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.detail.userId) {
            this.$message.warning(this.$t('会员不存在，请确认'))
            return
          }
          this.saving = true
          this.detail.auditStatus = status
          this.detail.status = 0
          if (this.detail.type === '1') {
            this.detail.name = this.selectedStore.storeName
            this.detail.headerImg = this.selectedStore.logoUrl
            this.selectedStore.channelCode = this.selectedStore.channelCodes !== undefined ? this.selectedStore.channelCodes[0] : this.selectedStore.channelCode
            this.detail.storeName = this.selectedStore.storeName
            this.detail.channelCode = this.selectedStore.channelCode
          }
          this.detail.channelName = this.getChannelName(this.detail.channelCode)
          const api = this.detail.id ? this.$live.$api.live.update : this.$live.$api.live.add
          api(this.detail).then((res) => {
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
    back() {
      this.$portal.delActiveViewAndRefresh('LiveList')
    },
    async checkMobile() {
      // 验证手机号
      const reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8|9][0-9]))\d{8}$/
      if (reg.test(this.detail.mobile)) {
        const result = await this.$live.$api.user.getUserOnlyByConditionsWithPage({
          currentPage: 1,
          itemsPerPage: 10,
          mobile: this.detail.mobile
        })
        if (result && result.code === '0' && result.data && result.data.listObj) {
          const user = result.data.listObj[0]
          this.detail.nickname = user.nickname
          this.detail.name = user.nickname
          this.detail.headerImg = user.headPicUrl
          this.detail.userId = user.id
        } else {
          this.detail.nickname = null
          this.detail.userId = null
          this.$message.warning(this.$t('会员不存在，请确认'))
        }
      } else {
        this.detail.nickname = null
        this.detail.userId = null
      }
    },
    getChannelName(channelCode) {
      let channelName = ''
      this.channelList.map(item => {
        if (item.channelCode === channelCode) {
          channelName = item.channelName
        }
      })
      return channelName
    }
  }
}
</script>

<style scoped>

</style>
