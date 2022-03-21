<template>
  <section class="section">
    <el-card>
      <div slot="header" class="clearfix">
        <strong>{{ $t('原料图片') }}</strong>
      </div>
      <el-row>
        <el-form-item ref="pictureList" :rules="rules['pictureList']" prop="pictureList" name="pictureList">
          <div slot="label">
            <ody-tip-star :content="$t('原料图片') + ':'" />
          </div>
          <el-row>
            <el-col :span="20">
              <ody-upload-image :file-list.sync="merchantPictureList" :limit="10" :draggable="true" :pic-type="['png', 'jpg']" :pic-size="4096" :show-tip="false" />
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
    </el-card>
  </section>
</template>

<script>
export default {
  components: {

  },
  props: {
    mp: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      merchantPictureList: [],
      rules: {
        pictureList: [{ validator: this.validatePicture, trigger: 'change' }]
      }
    }
  },
  watch: {
    'merchantPictureList': {
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
      this.initMedia()
    },
    initMedia() {
      // 主图排第一
      this.merchantPictureList = this.mp.mediaList ? this.mp.mediaList.filter(i => i.type === 0) : []
      this.merchantPictureList.sort((a, b) => {
        const mainSort = (b.isMainPicture ? b.isMainPicture : 0) - (a.isMainPicture ? a.isMainPicture : 0)
        const otherSort = (a.sortValue ? a.sortValue : 0) - (b.sortValue ? b.sortValue : 0)
        return mainSort === 0 ? otherSort : mainSort
      }).forEach(element => {
        element.url = element.pictureUrl
      })
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
      this.$set(this.mp, 'mediaList', mediaList)
    },
    preSubmit() {
      this.submitMedia()
    }
  }
}

</script>
<style scoped>
</style>
