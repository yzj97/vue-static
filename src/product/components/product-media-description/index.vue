<template>
  <section class="section">
    <el-card>
      <div slot="header" class="clearfix">
        <strong>{{ $t('图文信息') }}</strong>
        <a name="setDefaultImg" class="setDefaultImgClass" href="#" @click="testCaseSetImage">.</a>
      </div>
      <el-row>
        <el-form-item ref="pictureList" :rules="rules['pictureList']" prop="pictureList" name="pictureList">
          <div slot="label">
            <ody-tip-star :content="$t('商品图片') + ':'" />
          </div>
          <el-row>
            <el-col :span="20">
              <ody-upload-image-sort
                :disabled="isView"
                :file-list.sync="merchantPictureList"
                :limit="10"
                :draggable="true"
                :pic-type="['png', 'jpg']"
                :pic-size="4096"
                :show-tip="false"
              />
            </el-col>
            <el-col :span="4">
              <el-button name="confirmClearAllPicture" type="text" @click="confirmClearAllPicture">{{ $t('清空全部图片') }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <div>{{ $t('提示：') }}</div>
            <div>{{ $t('1. 至少上传一张，最多十张图片，支持JPG、JPEG、PNG格式。') }}</div>
            <div>{{ $t('2. 推荐使用正方形图片，建议使用800*800px，单张大小不超过4M。') }}</div>
            <div>{{ $t('3. 拖动图片可调整图片的位置。') }}</div>
          </el-row>
        </el-form-item>
      </el-row>
      <el-row v-if="mp.productInfoVO.type !== 31">
        <el-divider />
        <el-form-item :label="$t('商品视频') + ':'">
          <div style="display:flex">
            <ody-upload-video :disabled="isView" v-model="merchantVideo" :name-limit="90" name="merchantVideo" />
            <ody-upload-image
              :disabled="isView"
              v-model="merchantVideo.imagsrc"
              :label="$t('更换视频封面')"
              name="merchantVideo_imagsrc"
            />
          </div>
          <div>{{ $t('提示： 支持MP4、AVI格式，不超过50M。') }}</div>
        </el-form-item>
      </el-row>
      <el-row v-if="mp.productInfoVO.type !== '31' && mp.productInfoVO.type !== '32'">
        <el-divider />
        <el-form-item :label="$t('商品详情（PC端）') + ':'">
          <el-tabs v-model="pcActiveName" name="pcActiveName" type="card">
            <el-tab-pane :label="$t('PC端')" name="pc">
              <ody-tinymce
                :class="{disabled: isView}"
                :height="300"
                v-model="merchantProdDescribe.content"
                :limit="10000"
                name="merchantProdDescribe_content"
              />
            </el-tab-pane>
            <el-tab-pane :label="$t('PC端(第二语言)')" name="pcLan2">
              <ody-tinymce
                :class="{disabled: isView}"
                :height="300"
                v-model="merchantProdDescribe.contentLan2"
                :limit="10000"
                name="merchantProdDescribe_contentLan2"
              />
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item :label="$t('商品详情（移动端）') + ':'">
          <el-checkbox v-model="sameWithPC" :true-label="1" :false-label="0" name="sameWithPC">
            {{ $t('和PC端一致') }}
            <span style="color: #AAAAAA">{{ $t('（勾选‘和PC端一致’按钮，自动将商品详情设置和PC端一致）') }}</span>
          </el-checkbox>
          <el-tabs v-if="sameWithPC === 0" v-model="h5ActiveName" name="h5ActiveName" type="card">
            <el-tab-pane :label="$t('移动端')" name="h5">
              <ody-tinymce
                :class="{disabled: isView}"
                :height="300"
                v-model="h5MerchantProdDescribe.content"
                :limit="10000"
                name="h5MerchantProdDescribe_content"
              />
            </el-tab-pane>
            <el-tab-pane :label="$t('移动端(第二语言)')" name="h5Lan2">
              <ody-tinymce
                :class="{disabled: isView}"
                :height="300"
                v-model="h5MerchantProdDescribe.contentLan2"
                :limit="10000"
                name="h5MerchantProdDescribe_contentLan2"
              />
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-row>
    </el-card>
  </section>
</template>

<script>
export default {
  components: {},
  props: {
    isView: {
      type: Boolean,
      default: false
    },
    mp: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      sameWithPC: 1,
      pcActiveName: 'pc',
      h5ActiveName: 'h5',
      merchantProdDescribe: {
        type: 1,
        content: null,
        contentLan2: null
      },
      h5MerchantProdDescribe: {
        type: 0,
        content: null,
        contentLan2: null
      },
      merchantVideo: {
        url: null, // 视频url
        imagsrc: null //  视频封面url
      }, // 视频对象
      merchantPictureList: [],
      rules: {
        pictureList: [{ validator: this.validatePicture, trigger: 'change' }]
      }
    }
  },
  watch: {
    merchantPictureList: {
      handler(value, oldValue) {
        if (this.merchantPictureList.length > 0) {
          this.$refs['pictureList'].clearValidate()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initContent()
      this.initMedia()
    },
    initMedia() {
      const video = this.mp.mediaList
        ? this.mp.mediaList.filter(i => i.type === 1)
        : []
      // 初始化视频
      if (video && video.length > 0) {
        const merchantVideo = Object.assign(this.merchantVideo, video[0])
        merchantVideo.url = merchantVideo.videoUrl
        this.merchantVideo.imagsrc = merchantVideo.pictureUrl
        this.merchantVideo = merchantVideo
      }
      // 主图排第一
      this.merchantPictureList = this.mp.mediaList
        ? this.mp.mediaList.filter(i => i.type === 0)
        : []
      this.merchantPictureList
        .sort((a, b) => {
          const mainSort =
            (b.isMainPicture ? b.isMainPicture : 0) -
            (a.isMainPicture ? a.isMainPicture : 0)
          const otherSort =
            (a.sortValue ? a.sortValue : 0) - (b.sortValue ? b.sortValue : 0)
          return mainSort === 0 ? otherSort : mainSort
        })
        .forEach(element => {
          element.url = element.pictureUrl
        })
    },
    initContent() {
      const contentList = this.mp.describePOS
      if (contentList) {
        const pc = contentList.filter(
          i => i.type !== undefined && i.type.toString() === '1'
        )
        if (pc.length > 0) {
          this.merchantProdDescribe = Object.assign(
            this.merchantProdDescribe,
            pc[0]
          )
        }
        const h5 = contentList.filter(
          i => i.type !== undefined && i.type.toString() === '0'
        )
        if (h5.length > 0) {
          this.h5MerchantProdDescribe = Object.assign(
            this.h5MerchantProdDescribe,
            h5[0]
          )
          this.sameWithPC = 0
        }
      }
    },
    confirmClearAllPicture() {
      this.$confirm(this.$t('确认清空所有的图片吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'info'
      }).then(() => {
        this.merchantPictureList = []
      })
    },
    validatePicture(rule, value, callback) {
      if (this.merchantPictureList && this.merchantPictureList.length > 0) {
        return callback()
      }
      return callback(new Error(this.$t('商品图片必填')))
    },
    submitDesc() {
      var describePOS = [this.merchantProdDescribe]
      if (!this.sameWithPC) {
        describePOS.push(this.h5MerchantProdDescribe)
      }
      this.$set(this.mp, 'describePOS', describePOS)
    },
    submitMedia() {
      // 处理图片和视频
      const mediaList = []
      // 重新设置主图和排序
      if (this.merchantPictureList) {
        for (var index = 0; index < this.merchantPictureList.length; index++) {
          const item = this.merchantPictureList[index]
          if (index === 0) {
            item.isMainPicture = 1
          } else {
            item.isMainPicture = 0
          }
          item.merchantProdId = this.mp.id
          item.pictureUrl = item.url
          item.type = 0
          item.sortValue = index
          item.clientType = 1
        }
        mediaList.push(...this.merchantPictureList)
      }
      // 添加视频提交
      if (
        this.merchantVideo &&
        (this.merchantVideo.url || this.merchantVideo.imagsrc)
      ) {
        this.merchantVideo.type = 1
        this.merchantVideo.videoUrl = this.merchantVideo.url
        this.merchantVideo.videoUploadType = 0
        this.merchantVideo.merchantProdId = this.mp.id
        this.merchantVideo.sortValue = mediaList.length
        console.log('this.merchantVideo.imagsrc', typeof this.merchantVideo.imagsrc, this.merchantVideo, typeof (this.merchantVideo.imagsrc))
        if (this.merchantVideo.imagsrc && typeof (this.merchantVideo.imagsrc) === 'string') {
          this.merchantVideo.pictureUrl = this.merchantVideo.imagsrc
        } else {
          this.merchantVideo.pictureUrl = typeof (this.merchantVideo.imagsrc) === 'string' ? this.merchantVideo.imagsrc : this.merchantVideo.imagsrc.join(',')
        }
        this.merchantVideo.clientType = 1
        mediaList.push(this.merchantVideo)
      }
      this.$set(this.mp, 'mediaList', mediaList)
    },
    preSubmit() {
      this.submitMedia()
      this.submitDesc()
    },
    testCaseSetImage() {
      // 适应多场景自动化测试设置主图
      if (this.merchantPictureList.length <= 0) {
        this.merchantPictureList = [{
          'url': 'default'
        }]
      }
    }
  }
}
</script>
<style lang="less" scoped>
.disabled {
  cursor: not-allowed;
  pointer-events: none;
}

.setDefaultImgClass {
  color:#ffffff;
  font-size:1px;
}
</style>
