<template>
  <div class="cms-h5multipic">
    <div v-for="(image,imageIndex) in images" ref="image" :key="imageIndex" class="cms-h5multipic-images">
      <ody-upload-image
        v-model="image.src"
        :on-success="setImgWidthHeight(image)"
        :pic-type="['png', 'jpg']"
        :pic-size="5120"
        :show-tip="false"
        name="image_src"
      />
      <div :class="image.src ? '' :'default-margin' " class="h5multipic-images-wrapper">
        <div class="h5multipic-ramark-tip">
          <span>{{ $t('备注: 添加图宽度100%,高度自适应') }}</span>
          <span class="h5multipic-opration-btn">
            <i v-if="imageIndex == 0" name="down" class="el-icon-bottom" @click="down(imageIndex)"/>
            <i v-if="imageIndex > 0" name="up" class="el-icon-top" @click="up(imageIndex)"/>
            <i name="deleteImageItem" class="el-icon-close" @click="deleteImageItem(imageIndex)"/>
          </span>
        </div>
        <el-input v-model="image.desc" :placeholder="$t('请输入图片名称')" name="image_desc" clearable />
        <div class="h5multipic-link-wrapper">
          <cms-link-url v-model="image.link" :page-model="pageModel" :page-type="pageType" name="image_link" />
        </div>
      </div>
    </div>
    <el-button name="addImageItem" plain class="h5multipic-btn" @click="addImageItem"> 添加 <i class="el-icon-plus"/></el-button>
  </div>
</template>
<script>
import CmsLinkUrl from '@/components/cms-link-url'
import getImgWidthHeight from '@/utils/getImgWidthHeight'
export default {
  components: {
    CmsLinkUrl
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    pageModel: {
      type: Object,
      default: () => ({ model: {}})
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      images: [{
        link: {},
        src: '',
        desc: '',
        oriWidth: 500,
        oriHeight: 500
      }]
    }
  },
  watch: {
    images: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  mounted() {
    if (this.value.length === 0) {
      this.$emit('input', this.images)
    } else {
      this.images = this.value
    }
  },
  methods: {
    setImgWidthHeight(item) {
      if (item.src) {
        getImgWidthHeight(item.src).then(res => {
          item.oriWidth = res.width
          item.oriHeight = res.height
        })
      }
    },
    addImageItem() {
      const imageItem = {
        link: {},
        src: '',
        desc: '',
        oriWidth: 500,
        oriHeight: 500
      }
      this.images.push(imageItem)
    },
    deleteImageItem(index) {
      this.images.splice(index, 1)
    },
    // 下移
    down(index) {
      var arrs = this.$portal.deepClone(this.images)
        ;[arrs[index], arrs[index + 1]] = [arrs[index + 1], arrs[index]]
      this.images = arrs
      this.$emit('input', arrs)
    },

    // 上移
    up(index) {
      var arrs = this.$portal.deepClone(this.images)
        ;[arrs[index], arrs[index - 1]] = [arrs[index - 1], arrs[index]]
      this.images = arrs
      this.$emit('input', arrs)
    }
  }
}
</script>

<style lang="scss" scoped>
.cms-h5multipic-images {
  display: flex;
  padding-bottom: 0.1rem;
}
.h5multipic-images-wrapper {
  flex: 1;
}
.default-margin{
  margin-left: 0.1rem;
}
.h5multipic-ramark-tip {
  display: flex;
  justify-content: space-between;
  font-size: 0.12rem;
  color: #666;
}
.h5multipic-opration-btn i {
  font-weight: 900;
}
.h5multipic-link-wrapper{
  min-height: 0.3rem;
  margin-top: 0.05rem;
}
.h5multipic-btn{
  width: 100%;
  border: 0.01rem dashed #eee;
  margin-top: 0.1rem;
  color: #666;
}
</style>
