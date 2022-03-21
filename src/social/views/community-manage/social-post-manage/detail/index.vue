<template>
  <div>
    <el-form ref="form" :rules="rules" :model="post" label-width="100px" class="form">
      <el-row>
        <el-col :span="20">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('帖子标题') + ':'" :rules="rules['title']" prop="title">
                <el-input :disabled="isEdit == 0" v-model="post.title" name="post_title" maxlength="20"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item ref="pictureList" :label="$t('帖子轮播图') + ':'" required>
              <el-row>
                <el-col :span="20">
                  <ody-upload-image :disabled="isEdit == 0" :file-list.sync="postPictureList" :limit="9" :draggable="true" :pic-type="['png', 'jpg']" :pic-size="4096" :show-tip="false" />
                </el-col>
                <el-col :span="4">
                  <ody-button :disabled="isEdit == 0" name="SocialPostClearAllPicture_confirmClearAllPicture" code="SocialPostClearAllPicture" type="text" @click="confirmClearAllPicture">{{ $t('清空全部图片') }}</ody-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-row>
                <div>{{ $t('提示：') }}</div>
                <div>{{ $t('1. 至少上传一张，最多九张图片，支持JPG、JPEG、PNG格式。') }}</div>
                <div>{{ $t('2. 建议使用700*700px，单张大小不超过4M。') }}</div>
                <div>{{ $t('3. 拖动图片可调整图片的位置。') }}</div>
              </el-row>
            </el-form-item>
          </el-row>
          <el-row >
            <el-form-item :label="$t('帖子视频') + ':'" >
              <div style="display:flex">
                <ody-upload-video :disabled="isEdit == 0" v-model="postVideo" name="postVideo" />
                <ody-upload-image :disabled="isEdit == 0" v-model="postVideo.imagsrc" :label="$t('更换视频封面')" name="postVideo_imagsrc" />
              </div>
              <div>{{ $t('提示： 支持MP4、AVI格式，不超过50M。') }}</div>
            </el-form-item>
          </el-row>
          <el-row >
            <el-form-item :label="$t('帖子详情') + ':'" :rules="rules['content']" prop="content">
              <div v-if="isEdit == 0" class="editor-content" v-html="post.content"/>
              <ody-tinymce v-if="isEdit != 0" :height="300" v-model="post.content" :limit="10000" name="post_content" show-word-limit/>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('展示样子') + ':'" :rules="rules['showStyle']" prop="showStyle">
              <el-row>
                <el-col :span="6">
                  <img src="./images/onePicType.png" alt >
                </el-col>
                <el-col :span="6">
                  <img src="./images/twoPicType.png" alt >
                </el-col>
                <el-col :span="6">
                  <img src="./images/videoType.png" alt >
                </el-col>
                <el-col :span="6">
                  <img src="./images/contentType.png" alt >
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" align="center">
                  <el-radio :disabled="isEdit == 0" v-model="post.showStyle" :label="1" name="post_showStyle">{{ $t('选择') }}</el-radio>
                </el-col>
                <el-col :span="6" align="center">
                  <el-radio :disabled="isEdit == 0" v-model="post.showStyle" :label="2" name="post_showStyle9">{{ $t('选择') }}</el-radio>
                </el-col>
                <el-col :span="6" align="center">
                  <el-radio :disabled="isEdit == 0" v-model="post.showStyle" :label="3" name="post_showStyle0">{{ $t('选择') }}</el-radio>
                </el-col>
                <el-col :span="6" align="center">
                  <el-radio :disabled="isEdit == 0" v-model="post.showStyle" :label="4" name="post_showStyle6">{{ $t('选择') }}</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('发布渠道') + ':'" required>
                <!--<el-select :disabled="isEdit == 0" v-model="post.channelCode" :placeholder="$t('请选择')" name="post_channelCode">
                  <el-option
                    v-for="item in channelMap"
                    :key="item.channelCode"
                    :label="item.channelName"
                    :value="item.channelCode" />
                </el-select>-->
                <el-checkbox :disabled="isEdit == 0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group :disabled="isEdit == 0" v-model="checkedChannel" @change="handleCheckedChannelChange">
                  <el-checkbox v-for="channel in channelMap" :label="channel.channelCode" :key="channel.channelCode">{{ channel.channelName }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 30px">
        <ody-button :disabled="isEdit == 0" :loading="loading" name="SocialPostSave_handleSave" code="SocialPostSave" type="primary" size="small" @click="handleSave">{{ $t('保存') }}</ody-button>
        <el-button :loading="loading" name="handleBack" size="small" @click="handleBack">{{ $t('返回') }}</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SocialPostManageConfig',
  data() {
    return {
      id: '',
      isEdit: 1,
      post: {
        channelCode: null
      },
      postVideo: {
        url: null, // 视频url
        imagsrc: null //  视频封面url
      }, // 视频对象
      postPictureList: [],
      channelMap: {},
      channelArray: [],
      checkAll: false,
      isIndeterminate: true,
      checkedChannel: [],
      rules: {
        title: [
          { required: true, message: '请输入帖子标题', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '请选择组织架构', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入帖子详情', trigger: 'change' }
        ],
        showStyle: [
          { required: true, message: '请输入展示样子', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'postPictureList': {
      handler(value, oldValue) {
        if (this.postPictureList.length > 0) {
          this.$refs['pictureList'].clearValidate()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.isEdit = this.$route.query.isEdit
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      await this.initChannel()
      this.handleSearchQuery()
    },
    async initChannel() {
      const res = await this.$social.$api.common.listAllChannels({})
      if (res.code === '0') {
        this.channelMap = res.data

        for (var key in res.data) {
          this.channelArray.push(key)
        }
      }
    },
    handleSearchQuery() {
      this.query()
    },
    query() {
      if (this.id) {
        this.loading = true
        try {
          this.$social.$api.socialApi.getPostInfo({ id: this.id }).then(res => {
            if (res.code === '0') {
              this.post = res.data
              // 转换渠道信息
              var channels = JSON.parse(this.post.channelCode)
              for (var index in channels) {
                var channel = channels[index]
                this.checkedChannel.push(channel)
              }
              this.initMedia()
            }
          })
        } finally {
          this.loading = false
        }
      }
    },
    initMedia() {
      this.postPictureList = []
      this.postVideo = {}
      if (this.post.attachDTOList) {
        for (var i = 0; i < this.post.attachDTOList.length; i++) {
          const temp = this.post.attachDTOList[i]
          if (temp.type === 1) {
            this.postPictureList.push(temp)
          } else {
            this.postVideo = temp
            this.postVideo.imagsrc = this.postVideo.imageUrl
          }
        }
      }
    },
    confirmClearAllPicture() {
      this.$confirm(this.$t('确认清空所有的图片吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'info'
      }).then(() => {
        this.postPictureList = []
      })
    },
    validatePicture(rule, value, callback) {
      if (this.postPictureList && this.postPictureList.length > 0) {
        return callback()
      }
      return callback(new Error(this.$t('帖子轮播图必填')))
    },
    submitMedia() {
      // 处理图片和视频
      const mediaList = []
      // 重新设置主图和排序
      if (this.postPictureList) {
        var picArray = []
        for (var index = 0; index < this.postPictureList.length; index++) {
          const itemTemp = this.postPictureList[index]
          var item = {}
          item.postId = this.id
          item.url = itemTemp.url
          item.type = 1
          item.sortValue = index + 1
          item.id = itemTemp.id
          picArray.push(item)
        }
        mediaList.push(...picArray)
      }
      // 添加视频提交
      var postVideoObj = {}
      if (this.postVideo && (this.postVideo.url || this.postVideo.imagsrc)) {
        postVideoObj.type = 2
        postVideoObj.url = this.postVideo.url
        postVideoObj.postId = this.id
        postVideoObj.imageUrl = this.postVideo.imagsrc
        postVideoObj.sortValue = 99
        postVideoObj.id = this.postVideo.id
        mediaList.push(postVideoObj)
      }
      this.$set(this.post, 'attachs', mediaList)
    },
    checkImg() {
      const vue = this
      if (!vue.postPictureList || vue.postPictureList.length === 0) {
        vue.$message({
          message: vue.$t('请上传轮播图！'),
          type: 'warning'
        })
        return false
      }
      return true
    },
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid && this.checkChannel() && this.checkImg()) {
          this.submitMedia()

          this.$confirm(this.$t('是否保存') + '?', this.$t('提示'), {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }).then(() => {
            const postChannel = []
            for (var citem = 0; citem < this.checkedChannel.length; citem++) {
              postChannel.push(this.checkedChannel[citem])
            }
            const param = {
              title: this.post.title,
              content: this.post.content,
              channelCode: JSON.stringify(postChannel),
              attachs: this.post.attachs,
              showStyle: this.post.showStyle
            }
            var postApi = null
            if (this.id) {
              postApi = this.$social.$api.socialApi.updatePost
              param.id = this.id
            } else {
              postApi = this.$social.$api.socialApi.createPost
            }
            postApi(param).then(res => {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.$t('编辑成功') + '!'
                })
                this.$portal.delActiveViewAndRefresh('SocialPostManage')
              }
            })
          })
        }
      })
    },
    checkChannel() {
      const vue = this
      if (vue.checkedChannel.length === 0) {
        vue.$message({
          message: vue.$t('请选择渠道'),
          type: 'warning'
        })
        return false
      }
      return true
    },
    handleBack() {
      this.$portal.delActiveViewAndRefresh('SocialPostManage')
    },
    handleCheckAllChange(val) {
      this.checkedChannel = val ? this.channelArray : []
      this.isIndeterminate = false
    },
    handleCheckedChannelChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.channelArray.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.channelArray.length
    }
  }
}

</script>
<style scoped>
</style>
