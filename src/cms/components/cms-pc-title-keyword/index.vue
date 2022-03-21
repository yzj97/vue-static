<template>
  <div v-if="platForm === 1 && formData.model.titleType === 0" class="cms-pc-title-keyword">
    <div v-for="(item,index) in value" :key="index">
      <div class="pc-title-keyword-wrapper">
        <div class="title-keyword-opration-btn">
          <span v-if="index === 0" class="up-disable"/>
          <span v-else name="up" class="up" @click="up(index)"/>
          <span v-if="index === (value.length -1)" class="down-disable"/>
          <span v-else name="down" class="down" @click="down(index)"/>
          <span name="deleteItem" class="delete" @click="deleteItem(index)"/>
        </div>
        <div class="itle-keyword-right">
          <div class="keyword-label-wrapper">
            <label class="label">{{ $t('热搜词') }}{{ index + 1 }}:</label>
            <el-input v-model="item.text" :placeholder="$t('长度6个字以内')" name="item-text" clearable class="title-keyword-wrapper" maxlength="6"/>
          </div>
          <div class="channel-link-wrapper">
            <cms-link-url v-model="item.link" :page-model="pageModel" :page-type="pageType" :plat-form="platForm" name="item_link"/>
          </div>
        </div>
      </div>
    </div>
    <el-button v-if="value.length <12" name="addKeyWordItem" plain class="channel-btn" @click="addKeyWordItem">{{ $t('添加热搜词') }} <i class="el-icon-plus"/></el-button>
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
      default: () => [{ link: {}, text: '' }]
    },
    formData: {
      type: Object,
      default: () => ({ model: { titleType: 0 }})
    },
    platForm: { // 平台 1:PC ,2:H5
      type: Number,
      default: 1
    },
    pageModel: {
      type: Object,
      default: () => {}
    },
    pageType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      titleType: 1
    }
  },
  mounted() {
    if (this.value.length <= 0) {
      this.$nextTick(() => {
        this.init()
      })
    }
  },
  methods: {
    init() {
      this.value = this.value.push({ link: {}, text: '' })
    },
    addKeyWordItem() {
      this.value = this.value.push({ link: {}, text: '' })
    },
    deleteItem(index) {
      if (this.value.length <= 1) { return }
      this.value.splice(index, 1)
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
.cms-pc-title-keyword{
  .pc-title-keyword-wrapper{
    display: flex;
    padding: 0 0 0.15rem 0;
   .title-keyword-opration-btn{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 32px;
      margin: 0 0.15rem 0 -0.1rem;
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
  .keyword-label-wrapper{
    display: flex;
    padding: 0.1rem 0;
    .label{
      min-width: 0.7rem;
      font-size: 0.12rem;
      color: #666;
      font-weight: 400;
    }
  }
  .channel-btn{
    width: 100%;
    border: 0.01rem dashed #eee;
    margin-top: 0.1rem;
    color: #666;
  }
}
</style>
