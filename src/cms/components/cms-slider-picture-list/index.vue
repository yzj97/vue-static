<template>
  <div class="cms-slider">
    <div class="cms-slider-picture-list">
      <div v-for="(item,index) in value" :key="index" class="cms-slider-picture-item" >
        <div class="slider-picture-src-wrapper">
          <div class="slider-picture-opration-wrapper">
            <div class="opration-wrapper">
              <span v-if="index === 0" class="up-disable"/>
              <span v-else name="up" class="up" @click="up(index)"/>
              <span v-if="index === (value.length -1)" class="down-disable"/>
              <span v-else name="down" class="down" @click="down(index)"/>
              <span v-if="value.length>1" name="deleteItem" class="delete" @click="deleteItem(index)"/>
            </div>
            <ody-upload-image
              v-model="item.src"
              :pic-type="['png', 'jpg']"
              :pic-size="5120"
              :show-tip="false"
              name="image_src"
            />
          </div>
          <span class="picture-tip">{{ $t('备注:添加图片尺寸为710* (240~340px)') }}</span>
        </div>
        <cms-slider-height v-if="index === 0" v-model="item.height" name="item_height"/>
        <cms-link-url v-model="item.link" :page-model="pageModel" :page-type="pageType" name="item_link"/>
        <cms-slider-choose-background v-if="manner === 1" v-model="item.color" :endcolor.sync="item.endcolor" :color-style.sync="item.colorStyle" name="item_color"/>
      </div>
      <el-button name="addItem" plain class="slider-add-btn" @click="addItem"> 添加 <i class="el-icon-plus"/></el-button>
    </div>
  </div>
</template>
<script>
import CmsLinkUrl from '@/components/cms-link-url'
import CmsSliderHeight from '@/components/cms-slider-height'
import CmsSliderChooseBackground from '@/components/cms-slider-choose-background'
export default {
  components: {
    CmsLinkUrl,
    CmsSliderHeight,
    CmsSliderChooseBackground
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
      manner: this.formData.model.manner
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length > 0) {
          val.map(item => {
            item.height = val[0].height
          })
        }
        this.$emit('input', val)
      },
      deep: true
    },
    'formData.model.manner': {
      handler(val) {
        this.manner = val
      },
      deep: true
    }
  },
  mounted() {
    if (this.value.length <= 0) {
      const valueItem = { colorStyle: 1, color: '#1890FF', src: '', height: 290, link: {}, endcolor: '' }
      this.value.push(valueItem)
    }
  },
  methods: {
    addItem() {
      const valueItem = { colorStyle: 1, color: '#1890FF', src: '', height: 290, link: {}, endcolor: '' }
      this.value.push(valueItem)
    },
    deleteItem(index) {
      this.value.splice(index, 1)
      this.$emit('input', this.value)
    },
    // 下移
    down(index) {
      var arrs = this.$portal.deepClone(this.value)
        ;[arrs[index], arrs[index + 1]] = [arrs[index + 1], arrs[index]]
      this.value = arrs
      this.$emit('input', arrs)
    },
    // 上移
    up(index) {
      var arrs = this.$portal.deepClone(this.value)
        ;[arrs[index], arrs[index - 1]] = [arrs[index - 1], arrs[index]]
      this.value = arrs
      this.$emit('input', arrs)
    }
  }
}
</script>

<style lang="less" scoped>
.slider-picture-src-wrapper{
  .picture-tip{
    font-size: 0.14rem;
    color: #ef5351;
  }
}
.slider-picture-opration-wrapper {
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

.slider-height-wrapper{
  .height-wrapper{
    display: flex;
    align-items: center;
    .el-slider-wrapper{
      flex: 1;
    }
    .height{
      min-width: 0.58rem;
      height: 0.2rem;
      line-height: 0.2rem;
      border: 0.01rem solid #eee;
      text-align: center;
      margin-left: 0.15rem;
      color: #333;
      border-radius: 0.02rem;
    }
    .height::after{
      content: 'px';
      color: #ccc;
      padding-left: 0.03rem;
    }
  }
}
.slider-add-btn{
  width: 100%;
  border: 0.01rem dashed #eee;
  margin-top: 0.1rem;
  color: #666;
}
</style>
