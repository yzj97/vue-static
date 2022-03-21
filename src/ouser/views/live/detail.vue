<template>
  <section>
    <el-form ref="form" :model="edit" :rules="rules" label-width="150px" class="form">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('直播名称')" prop="liveName">
            <el-input
              ref="liveName"
              v-model="edit.liveName"
              :disabled="readonly"
              name="liveName"
              maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('直播封面图片URL')" :required="true" prop="liveCoverUrl">
            <el-input
              ref="liveCoverUrl"
              v-model="edit.liveCoverUrl"
              :disabled="readonly"
              name="liveCoverUrl"
              maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('分享封面图片URL')" :required="true" prop="shareCoverUrl">
            <el-input
              ref="shareCoverUrl"
              v-model="edit.shareCoverUrl"
              :disabled="readonly"
              name="shareCoverUrl"
              maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('直播主页地址')" prop="liveUrl">
            <el-input
              ref="liveUrl"
              v-model="edit.liveUrl"
              :disabled="readonly"
              name="liveUrl"
              maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('直播描述')" prop="liveDesc">
            <el-input
              ref="liveDesc"
              v-model="edit.liveDesc"
              :disabled="readonly"
              name="liveDesc"
              maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('直播状态')" prop="status">
            <ody-dict-select ref="status" v-model="edit.status" :disabled="readonly" :placeholder="$t('请选择')" :is-number="true" pool="social" category="LIVE_STATUS" name="status" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('订阅数')" prop="subscribeCount">
            <el-input-number
              ref="subscribeCount"
              v-model="edit.subscribeCount"
              :controls="false"
              :disabled="readonly"
              :precision="0"
              :min="0.01"
              :max="99999999"
              name="subscribeCount"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('分享数')" prop="shareCount">
            <el-input-number
              ref="shareCount"
              v-model="edit.shareCount"
              :controls="false"
              :disabled="readonly"
              :precision="0"
              :min="0.01"
              :max="99999999"
              name="shareCount"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('置顶设置')" prop="isTop">
            <el-input-number
              ref="isTop"
              v-model="edit.isTop"
              :controls="false"
              :disabled="readonly"
              :precision="0"
              :min="0.01"
              :max="99999999"
              name="isTop"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('直播开始时间')" prop="startTime">
            <el-date-picker
              ref="startTime"
              v-model="edit.startTime"
              :disabled="readonly"
              format="yyyy-MM-dd HH:mm:ss"
              type="date"
              name="startTime"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 10px">
        <el-button name="back" size="small" @click="back">{{ $t('关闭') }}</el-button>
        <ody-button v-loading="saving" v-permission="['Live_add', 'Live_update']" v-show="!readonly" name="Live_save" code="ui" size="small" type="primary" @click="save">{{ $t('保存') }}</ody-button>
      </el-row>
    </el-form>
  </section>
</template>

<script>
export default {
  name: 'LiveDetail',
  data() {
    return {
      saving: false,
      readonly: false,
      update: false,
      edit: this.initData(),
      statusDict: {},
      rules: {
        liveCoverUrl: [{ required: true, message: this.$t('请输入') + this.$t('直播封面图片URL') }],
        shareCoverUrl: [{ required: true, message: this.$t('请输入') + this.$t('分享封面图片URL') }]
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
        const res = await this.$ouser.$api.live.getById({ id: this.$route.query.id })
        this.saving = false
        this.edit = res.data
      } else {
        this.edit = this.initData()
      }
      const categories = []
      categories.push('LIVE_STATUS')
      const res = await this.$ouser.$api.common.codeListMulti({ 'categories': categories })
      this.statusDict = res.data['LIVE_STATUS']
    },
    initData() {
      return {
        liveName: null,
        liveCoverUrl: null,
        shareCoverUrl: null,
        liveUrl: null,
        liveDesc: null,
        status: 0,
        subscribeCount: 0,
        shareCount: 0,
        isTop: 0,
        startTime: null,
        id: null
      }
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saving = true
          const api = this.edit.id ? this.$ouser.$api.live.update : this.$ouser.$api.live.add
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
    back() {
      this.$portal.delActiveViewAndRefresh()
    }
  }
}
</script>

