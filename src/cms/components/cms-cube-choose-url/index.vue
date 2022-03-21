<template>
  <div class="cp-page-cube-choose">
    <div class="more-list">
      <div v-for="(item,index) in cubeList.children" :key="index">
        <template v-if="!item.children">
          <div class="line line-lg"/>
          <div class="form-group">
            <div class="col-sm-3">
              <ody-upload-image
                v-model="item.imgUrl"
                :pic-type="['png', 'jpg', 'jpeg']"
                :pic-size="1024"
                :show-tip="false"
                name="value"
              />
            </div>
            <div class="col-sm-8">
              <span class="control-label">{{ $t('备注：添加图片尺寸为') }} {{ item.sug }}</span>
              <div class="lin-wrapper">
                <cms-link-url v-model="item.link" :page-model="pageModel" :page-type="pageType" name="image_link" />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-for="(items,k) in item.children" :key="k">
            <div class="line line-lg"/>
            <div class="form-group">
              <div class="col-sm-3">
                <ody-upload-image
                  v-model="items.imgUrl"
                  :pic-type="['png', 'jpg', 'jpeg']"
                  :pic-size="5120"
                  :show-tip="false"
                  name="value"
                />
              </div>
              <div class="col-sm-8">
                <span class="control-label">{{ $t('备注：添加图片尺寸为') }} {{ items.sug }}</span>
                <div class="lin-wrapper">
                  <cms-link-url v-model="items.link" :page-model="pageModel" :page-type="pageType" name="image_link" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import cmsLinkUrl from '@/components/cms-link-url'
export default {
  components: {
    cmsLinkUrl
  },
  props: {
    cubeList: {
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

    }
  }
}
</script>
<style lang="scss" scope>
.cp-page-cube-choose {
  position: relative;
  width: 100%;
  height: auto;
  margin-bottom: 0.15rem;
  .more-list{
    width: 100%;
    height: auto;
  }
  .line {
    width: 100%;
    height: 0.02rem;
    margin: 0.1rem 0;
    font-size: 0;
    overflow: hidden;
    border: 0.01rem dashed #dee5e7;
  }
  .form-group {
    width: 100%;
    margin-bottom: 0.05rem !important;
    margin-right: -0rem !important;
    margin-left: -0rem !important;
    display: flex;
    .col-sm-3{
      padding-left: 0.06rem !important;
      padding-right: 0.06rem !important;
      width: 25%;
    }
    .col-sm-8{
      padding-left: 0.06rem !important;
      padding-right: 0.06rem !important;
      width: 66.6667%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .control-label{
        margin-top: -.2rem;
        color: #EF5351;
        font-size: 0.12rem;
      }
    }
  }
}
</style>
