<template>
  <div class="cms-choose-shops">
    <div class="goods-content">
      <div name="goodsLookVisible" class="choose-btn" @click="goodsLookVisible=true">+选择店铺</div>
      <div class="choose-info">
        <span>已选</span>
        <span class="choose-num">{{ chooseShopsCount }}</span>
        <span>件</span>
      </div>
    </div>
    <cms-choose-shops-look
      v-if="goodsLookVisible"
      :goods-type="goodsType"
      :page-model="pageModel"
      :visible.sync="goodsLookVisible"
      :module-id="moduleId"
      :page-id="pageId"
      :page-type="pageType"
      :form-data="formData"
      @setCount="getGoodsCount"/>
  </div>
</template>

<script>
import CmsChooseShopsLook from '@/components/cms-choose-shops-look'
export default {
  components: {
    CmsChooseShopsLook
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    pageId: {
      type: String,
      default: ''
    },
    pageType: {
      type: String,
      default: ''
    },
    pageModel: {
      type: Object,
      default: () => {}
    }

  },
  data() {
    return {
      moduleId: this.formData.id,
      goodsType: this.formData.model.goodsType,
      goodsLookVisible: false,
      chooseShopsCount: 0
    }
  },
  watch: {
    'formData.model.goodsType': {
      handler(val) {
        this.goodsType = val
        this.clearProducts()
      }
    }
  },
  mounted() {
    if (this.moduleId) {
      // console.log(this.formData, 1111)
      this.getGoodsCount()
    }
  },
  methods: {
    clearProducts() {
      this.$cms.$api.cmsEdit.clearProducts({ moduleId: this.moduleId }).then(res => {
        this.formData.model.dataChange += 1
        this.getGoodsCount()
      })
    },
    getGoodsCount() {
      this.$cms.$api.cmsEdit.cmsModuleStoreCount({ moduleId: this.moduleId }).then(res => {
        this.chooseShopsCount = res.data
      })
    }

  }
}
</script>

<style lang="less" scoped>
.cms-choose-shops {
  .choose-btn {
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    background: #F9F9F9;
    color: #333;
    font-size: 12px;
    cursor: pointer;
  }
  .goods-content {
    display: flex;
    .choose-info {
      font-size: 12px;
      margin-left: 10px;
      display: flex;
      align-items: center;
      .choose-num {
        color: rgb(24, 144, 255);
        font-weight: bold;
        font-size: 14px;
        margin: 0 2px;
      }
    }
  }
}
</style>
