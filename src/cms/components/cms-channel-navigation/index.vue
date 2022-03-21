<template>
  <div class="cms-channel">
    <div v-for="(image,imageIndex) in images" ref="image" :key="imageIndex" class="cms-channel-images">
      <div class="cms-channel-opration-wrapper">
        <div class="opration-wrapper">
          <span v-if="imageIndex === 0" class="up-disable"/>
          <span v-else name="up" class="up" @click="up(imageIndex)"/>
          <span v-if="imageIndex === (images.length -1)" class="down-disable"/>
          <span v-else name="down" class="down" @click="down(imageIndex)"/>
          <span v-if="((images.length>6 && selected === 3 && selectedStyle == 1) || (images.length>12 && selected === 3 && selectedStyle == 2))" name="deleteItem" class="delete" @click="deleteItem(imageIndex)"/>
        </div>
        <ody-upload-image
          v-model="image.src"
          :pic-type="['png', 'jpg']"
          :pic-size="5120"
          :show-tip="false"
          name="image_src"
        />
      </div>
      <div :class="image.src ? '' :'default-margin' " class="channel-images-wrapper">
        <div class="channel-ramark-tip">
          <span>{{ $t('备注: 添加图片尺寸为80*80px') }}</span>
        </div>
        <el-input
          v-model="image.text"
          :placeholder="$t('请输入导航名称')"
          maxlength= "8"
          show-word-limit
          name="image_desc"
          clearable />
        <div class="channel-link-wrapper">
          <cms-link-url :key="image.link" v-model="image.link" :page-model="pageModel" :page-type="pageType" name="image_link"/>
        </div>
      </div>
    </div>
    <el-button v-if="selected === 3" name="addImageItem" plain class="channel-btn" @click="addImageItem"> 添加 <i class="el-icon-plus"/></el-button>
  </div>
</template>
<script>
import CmsLinkUrl from '@/components/cms-link-url'
export default {
  components: {
    CmsLinkUrl
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
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
      images: [],
      selected: 1,
      selectedStyle: 1
    }
  },
  watch: {
    'formData.model.selected': {
      handler(val) {
        this.selected = this.formData.model.selected
        this.images = []
        this.$emit('input', [])
        this.init()
      }
    },
    'formData.model.selectedStyle': {
      handler(val) {
        this.selectedStyle = this.formData.model.selectedStyle
        this.images = []
        this.$emit('input', [])
        this.init()
      }
    },
    images: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  mounted() {
    this.selected = this.formData.model.selected
    this.selectedStyle = this.formData.model.selectedStyle
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      const imagesTemp = []
      const length = (this.selected === 1 ? 4 : this.selected === 2 ? 5 : 6) * this.selectedStyle
      for (let i = 0; i < length; i++) {
        const imageItem = { link: {}, src: '', text: '' }
        imageItem.text = this.$t('导航') + (i + 1)
        imagesTemp.push(imageItem)
      }
      this.images = this.formData.model.navigation.length > 0 ? this.formData.model.navigation : imagesTemp
    },
    addImageItem() {
      const imageItem = { link: {}, src: '', text: '' }
      imageItem.text = this.$t('导航') + (this.images.length + 1)
      this.images.push(imageItem)
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
    },
    // 删除
    deleteItem(index) {
      this.images.splice(index, 1)
      this.$emit('input', this.images)
    }
  }
}
</script>

<style lang="less" scoped>
.cms-channel-images {
  display: flex;
  padding-bottom: 0.1rem;
}
.channel-images-wrapper {
  flex: 1;
}
.default-margin{
  margin-left: 0.1rem;
}
.channel-ramark-tip {
  display: flex;
  justify-content: space-between;
  font-size: 0.14rem;
  color: #EF5351;
}
.channel-opration-btn i {
  font-weight: 900;
}
.channel-link-wrapper{
  min-height: 0.3rem;
  margin-top: 0.05rem;
}
.channel-btn{
  width: 100%;
  border: 0.01rem dashed #eee;
  margin-top: 0.1rem;
  color: #666;
}
.cms-channel-opration-wrapper {
  display: flex;
  .opration-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 32px;
    margin-left: -0.3rem;
    .span {
      height: 18px;
      width: 18px;
      flex: 1;
      cursor: pointer;
    }
    .up-disable {
      .span;
      background: url('../../img/up-disable.png') no-repeat center center;
      background-size: 100%;
    }
    .up {
      .span;
      background: url('../../img/up.png') no-repeat center center;
      background-size: 100%;
    }
    .down-disable {
      .span;
      background: url('../../img/down-disable.png') no-repeat center center;
      background-size: 100%;
    }
    .down {
      .span;
      background: url('../../img/down.png') no-repeat center center;
      background-size: 100%;
    }
    .delete {
      .span;
      background: url('../../img/delete.png') no-repeat center center;
      background-size: 100%;
    }
  }
}
</style>
