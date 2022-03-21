<template>
  <div disabled="isView">
    <el-form ref="form" :disabled="isView" :rules="rules" :model="live" label-width="120px" class="form">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('直播名称') + ':'" :rules="rules['title']" prop="liveName">
                <el-input v-model="live.liveName" name="live_liveName" maxlength="20"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item ref="pictureList" :rules="rules['pictureList']" prop="pictureList">
              <div slot="label">
                <ody-tip-star :content="$t('直播封面图') + ':'" />
              </div>
              <el-row>
                <el-col :span="5">
                  <ody-upload-image :file-list.sync="livePictureList" :disabled="isView" :limit="1" :draggable="true" :pic-type="['png', 'jpg']" :pic-size="4096" :show-tip="false" />
                </el-col>
                <el-col :span="6"><div>{{ $t('建议上传900*720的图片') }}</div></el-col>
              </el-row>
            </el-form-item>
          </el-row>
          <el-row >
            <el-col :span="12">
              <el-form-item :label="$t('直播主页地址') + ':'" :rules="rules['liveUrl']" prop="liveUrl">
                <el-input v-model="live.liveUrl" name="live_liveUrl" maxlength="150"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-form-item :label="$t('直播描述') + ':'" :rules="rules['liveDesc']" prop="liveDesc">
              <el-input v-model="live.liveDesc" :rows="5" name="live_liveDesc" type="textarea" maxlength="100" show-word-limit />
            </el-form-item>
          </el-row>
          <el-row >
            <el-form-item :label="$t('直播开始时间') + ':'" :rules="rules['startTime']" prop="startTime">
              <el-date-picker
                v-model="live.startTime"
                :picker-options="pickerOptions"
                :placeholder="$t('选择开始时间')"
                name="live_startTime"
                type="datetime"/>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item ref="sharePictureList" :rules="rules['sharePictureList']" prop="sharePictureList">
              <div slot="label">
                <ody-tip-star :content="$t('分享封面图') + ':'" />
              </div>
              <el-row>
                <el-col :span="5">
                  <ody-upload-image :file-list.sync="shareLivePictureList" :disabled="isView" :limit="1" :draggable="true" :pic-type="['png', 'jpg']" :pic-size="4096" :show-tip="false" />
                </el-col>
                <el-col :span="6"><div>{{ $t('建议上传900*720的图片') }}</div></el-col>
              </el-row>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-form style="padding-left: 20px">
      <el-row type="flex" justify="center" style="margin-top: 20px">
        <ody-button v-if="isView===false" :loading="loading" name="LiveAddSubmit_handleSave" code="LiveAddSubmit" type="primary" size="small" @click="handleSave">{{ $t('保存') }}</ody-button>
        <el-button :disabled="false" :loading="loading" name="handleBack" size="small" @click="handleBack">{{ $t('返回') }}</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'LiveMangeConfig',
  data() {
    return {
      id: '',
      isView: false,
      tipsMsg: '',
      live: {
      },
      livePictureList: [],
      shareLivePictureList: [],
      rules: {
        pictureList: [
          { validator: this.validatePicture, trigger: 'change' }
        ],
        sharePictureList: [
          { validator: this.validateSharePicture, trigger: 'change' }
        ],
        liveName: [
          { required: true, message: '直播名称必填', trigger: 'change' }
        ],
        liveUrl: [
          { required: true, message: '直播主页地址必填', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择直播开始时间', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  watch: {
    'livePictureList': {
      handler(value, oldValue) {
        if (this.livePictureList.length > 0) {
          this.$refs['pictureList'].clearValidate()
        }
      },
      deep: true
    },
    'shareLivePictureList': {
      handler(value, oldValue) {
        if (this.shareLivePictureList.length > 0) {
          this.$refs['sharePictureList'].clearValidate()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.isView = this.$route.query.isView
    console.log(this.isView)
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      this.handleSearchQuery()
    },
    handleSearchQuery() {
      this.query()
    },
    query() {
      if (this.id) {
        this.loading = true
        try {
          this.$social.$api.socialApi.getLiveInfo({ id: this.id }).then(res => {
            if (res.code === '0') {
              this.live = res.data
              this.initPicture()
            }
          })
        } finally {
          this.loading = false
        }
      }
    },
    initPicture() {
      this.livePictureList = []
      this.shareLivePictureList = []
      if (this.live.liveCoverUrl) {
        const item = {
          url: this.live.liveCoverUrl
        }
        this.livePictureList.push(item)
      }
      if (this.live.shareCoverUrl) {
        const item = {
          url: this.live.shareCoverUrl
        }
        this.shareLivePictureList.push(item)
      }
    },
    validatePicture(rule, value, callback) {
      if (this.livePictureList && this.livePictureList.length > 0) {
        this.live.liveCoverUrl = this.livePictureList[0].url
        return callback()
      }
      return callback(new Error(this.$t('直播封面图必填')))
    },
    validateSharePicture(rule, value, callback) {
      if (this.shareLivePictureList && this.shareLivePictureList.length > 0) {
        this.live.shareCoverUrl = this.shareLivePictureList[0].url
        return callback()
      }
      return callback(new Error(this.$t('分享封面图必填')))
    },
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const startTime = this.$portal.parseTime(this.live.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
          const nowTime = this.$portal.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
          if (nowTime > startTime) {
            this.$message({
              type: 'error',
              message: this.$t('直播开始时间时间不能小于当前时间')
            })
            return
          }
          this.$confirm(this.$t('是否保存') + '?', this.$t('提示'), {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }).then(() => {
            const param = {
              liveName: this.live.liveName,
              liveCoverUrl: this.live.liveCoverUrl,
              shareCoverUrl: this.live.shareCoverUrl,
              liveUrl: this.live.liveUrl,
              liveDesc: this.live.liveDesc,
              startTime: this.live.startTime
            }
            var liveApi = null
            if (this.id) {
              this.tipsMsg = this.$t('编辑成功')
              liveApi = this.$social.$api.socialApi.updateLive
              param.id = this.id
            } else {
              this.tipsMsg = this.$t('新增成功')
              // 新增默认状态未开始
              param.status = 1
              liveApi = this.$social.$api.socialApi.createLive
            }
            liveApi(param).then(res => {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.tipsMsg + '!'
                })
                this.$portal.delActiveViewAndRefresh('LiveListManage')
              }
            })
          })
        }
      })
    },
    handleBack() {
      this.$portal.delActiveViewAndRefresh('LiveListManage')
    }
  }
}

</script>
<style scoped>
</style>
