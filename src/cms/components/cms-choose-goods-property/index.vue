<template>
  <div class="cms-choose-goods-property">
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('编辑cms属性')"
      append-to-body
      width="800px">
      <el-row :gutter="10" class="tip row-bg" type="flex" justify="center">
        <el-col :span="4" class="label">{{ $t('温馨提示') }}</el-col>
        <el-col :span="10">以下属性仅在该CMS栏目生效</el-col>
      </el-row>
      <el-row :gutter="10" class="row-bg" type="flex" justify="center">
        <el-col :span="4" class="label">{{ $t('商品编号') }}</el-col>
        <el-col :span="10">{{ itemInfo.mpCode }}</el-col>
      </el-row>
      <el-row :gutter="10" class="row-bg" type="flex" justify="center">
        <el-col :span="4" class="label">{{ $t('商品名称') }}</el-col>
        <el-col :span="10">{{ itemInfo.mpName }}</el-col>
      </el-row>
      <el-row :gutter="10" class="row-bg" type="flex" justify="center">
        <el-col :span="4" class="label">{{ $t('商品显示名称') }}</el-col>
        <el-col :span="10"><el-input
          v-model="customName"
          maxlength= "50"
          show-word-limit
          name="customName"/></el-col>
      </el-row>
      <el-row :gutter="10" class="row-bg" type="flex" justify="center">
        <el-col :span="4" class="label">{{ $t('商品显示图片') }}</el-col>
        <el-col :span="10">
          <ody-upload-image
            v-model="customPic"
            :show-tip="false"
            name="customPic"
          />
        </el-col>
      </el-row>

      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <el-button name="handleConfirm" size="small" type="primary" @click="handleConfirm">{{ $t('确定') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => {}
    },
    itemInfo: {
      type: Object,
      default: () => {}
    },
    moduleId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      goodsName: '',
      goodsUrl: '',
      customName: this.itemInfo.customName,
      customPic: this.itemInfo.customPic
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleConfirm() {
      const params = {
        id: this.itemInfo.moduleDataId,
        moduleId: this.moduleId,
        mpId: this.itemInfo.mpId,
        mpCode: this.itemInfo.mpCode,
        merchantId: this.itemInfo.merchantId,
        customName: this.customName,
        customPic: this.customPic
        // sortValue: this.itemInfo.sortVal
      }
      this.$cms.$api.cmsEdit.updateCmsModuleData(params).then(res => {
        this.handleClose()
        this.$emit('ok')
      })
    }
  }

}
</script>

<style lang="less" scoped>
.tip {
  color: #EF5351;
}
.label {
  text-align: right;
}
.row-bg {
  margin-top: 10px;
}
</style>
