<template>
  <div v-show="h5Iphone.list.length > 0 && showForm" class="cp-edit-list">
    <div class="title-name">
      {{ getTitleName }}
      <div name="closeFrom" class="close" @click="closeFrom">
        <i class="el-icon-close"/>
      </div>
    </div>

    <!-- this is edit -->
    <el-form
      v-for="(form, formIndex) in h5Iphone.list"
      v-show="formIndex === h5Iphone.index"
      ref="editForm"
      :key="formIndex"
      :model="form.model"
      :rules="form.rules"
      :name="form.name"
      :code="form.code"
      v-bind="form"
      class="form"
      label-width="100px"
      @validate="validate"
    >
      <el-form-item
        v-for="(field, fieldIndex) in form.fields"
        :label="$t(field.label)"
        :key="fieldIndex"
        :prop="field.prop">
        <component
          :is="field.tag"
          :key="form.id + field.tag + fieldIndex"
          v-bind="field"
          :h5-iphone="h5Iphone"
          :form-data="form"
          :update-module="updateModule"
          :page-id="pageId"
          :page-type="pageType"
          v-model="form.model[field.prop]"
          :plat-form="platForm"
          :page-model="pageModel"
          name="form_model[field_prop]">
          <component
            v-for="(fieldChildren, fieldChildrenIndex) in field.children"
            :is="fieldChildren.tag"
            v-bind="fieldChildren"
            :key="fieldChildrenIndex">
            {{ fieldChildren.html ? fieldChildren.html : fieldChildren.label }}
          </component>
        </component>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CmsBulletinIcon from '@/components/cms-bulletin-icon'
import CmsTitleUrl from '@/components/cms-title-url'
import CmsTitleUrlDisable from '@/components/cms-title-url-disable'
import CmsLinkUrl from '@/components/cms-link-url'
import CmsH5multipicSpace from '@/components/cms-h5multipic-space'
import CmsH5multipicImages from '@/components/cms-h5multipic-images'
import CmsChooseGoods from '@/components/cms-choose-goods'
import CmsChooseGoodsType from '@/components/cms-choose-goods-type'
import CmsSlideShowImgwidth from '@/components/cms-slide-show-imgwidth'
import CmsCubeRadio from '@/components/cms-cube-radio'
import CmsChannelChooseTemplate from '@/components/cms-channel-choose-template'
import CmsChannelChooseStyle from '@/components/cms-channel-choose-style'
import CmsChannelBackgroundImg from '@/components/cms-channel-background-img'
import CmsChannelNavigation from '@/components/cms-channel-navigation'
import CmsCountDownStyle from '@/components/cms-count-down-style'
import CmsCountDownBackgroundimg from '@/components/cms-count-down-backgroundimg'
import CmsImageHotmap from '@/components/cms-image-hotmap'
import CmsChooseCoupon from '@/components/cms-choose-coupon'
import CmsCountDownLink from '@/components/cms-count-down-link'
import CmsCountDownUse from '@/components/cms-count-down-use'
import CmsSliderPictureList from '@/components/cms-slider-picture-list'
import CmsSliderManner from '@/components/cms-slider-manner'
import CmsSliderStyle from '@/components/cms-slider-style'
import CmsHeaderBtn from '@/components/cms-header-btn'
import CmsHeaderBackground from '@/components/cms-header-background'
import CmsHeaderUrl from '@/components/cms-header-url'
import CmsHeaderStyle from '@/components/cms-header-style'
import CmsTabsChooseDefaultColor from '@/components/cms-tabs-choose-default-color'
import CmsTabsChooseActiveColor from '@/components/cms-tabs-choose-active-color'
import CmsTabsContentShow from '@/components/cms-tabs-content-show'
import CmsTabsChangePages from '@/components/cms-tabs-change-pages'
import CmsUrl from '@/components/cms-url'
import CmsElSlider from '@/components/cms-el-slider'
import CmsUploadVideo from '@/components/cms-upload-video'
import CmsSliderShowImage from '@/components/cms-slider-show-image'
import CmsWarnText from '@/components/cms-warn-text'
import CmsPcTitleKeyword from '@/components/cms-pc-title-keyword'
import CmsPcTitleMore from '@/components/cms-pc-title-more'
import CmsPcMultipicImages from '@/components/cms-pc-multipic-images'
import CmsPcCubeLayout from '@/components/cms-pc-cube-layout'
import CmsChooseShops from '@/components/cms-choose-shops'

export default {
  components: {
    CmsBulletinIcon,
    CmsLinkUrl,
    CmsTitleUrl,
    CmsTitleUrlDisable,
    CmsH5multipicSpace,
    CmsH5multipicImages,
    CmsChooseGoods,
    CmsChooseGoodsType,
    CmsSlideShowImgwidth,
    CmsCubeRadio,
    CmsChannelChooseTemplate,
    CmsChannelChooseStyle,
    CmsChannelBackgroundImg,
    CmsChannelNavigation,
    CmsCountDownStyle,
    CmsCountDownBackgroundimg,
    CmsImageHotmap,
    CmsChooseCoupon,
    CmsCountDownLink,
    CmsCountDownUse,
    CmsSliderPictureList,
    CmsSliderManner,
    CmsSliderStyle,
    CmsHeaderBtn,
    CmsHeaderBackground,
    CmsHeaderUrl,
    CmsHeaderStyle,
    CmsTabsChooseDefaultColor,
    CmsTabsChooseActiveColor,
    CmsTabsContentShow,
    CmsTabsChangePages,
    CmsUrl,
    CmsElSlider,
    CmsUploadVideo,
    CmsSliderShowImage,
    CmsWarnText,
    CmsPcCubeLayout,
    CmsPcTitleKeyword,
    CmsPcTitleMore,
    CmsPcMultipicImages,
    CmsChooseShops
  },
  props: {
    h5Iphone: {
      type: Object,
      default: () => ({ list: [], index: 0 })
    },
    updateModule: {
      type: Function,
      default: () => {}
    },
    pageId: {
      type: String,
      default: ''
    },
    showForm: {
      type: Boolean,
      default: true
    },
    pageModel: {
      type: Object,
      default: () => {}
    },
    pageType: {
      type: String,
      default: ''
    },
    platForm: {
      type: Number,
      default: 2
    }
  },
  computed: {
    getTitleName() {
      if (this.h5Iphone.list.length > 0) {
        return this.h5Iphone.list[this.h5Iphone.index].name
      } else {
        return ''
      }
    }
  },
  methods: {
    validate(...args) {
      // console.log(this, args)
      // debugger
      // this.$set(this.h5Iphone.list[index], 'hasError', valid)
    },
    closeFrom() {
      this.$emit('update:showForm', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-edit-list {
  min-width: 480px;
}
.form {
  padding: 20px 10px 0 0;
}
.title-name {
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  font-size: 14px;
  color: #333333;
  font-weight: 450;
  letter-spacing: 0;
  background: #f8f9fa;
  position: relative;
  .close {
    position: absolute;
    right: 10px;
    top: 0px;
    cursor: pointer;
  }
}

</style>
