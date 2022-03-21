<template>
  <div class="">
    <merchant-title>{{ $t('店铺经营类目') }}</merchant-title>
    <el-form :disabled="isView || !loaded || all.length === 0">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="isCheckAll"
        name="isCheckAll"
        @change="handleCheckAllChange">{{ $t('全选') }}</el-checkbox>
      <div style="margin: 15px 0;"/>
      <el-checkbox-group v-model="checked" name="checked" @change="handleCheckedOneChange">
        <el-checkbox
          v-for="item in all"
          :label="item.value"
          :key="item.value">
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
      <div style="margin: 15px 25px">
        <ody-button name="MerchantStoreListBusinessCategory_handleSubmit" code="MerchantStoreListBusinessCategory" type="primary" @click="handleSubmit">{{ $t('保存') }}</ody-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import MerchantTitle from '@/components/title'

export default {
  components: {
    MerchantTitle
  },
  data() {
    const { status } = this.$route.params
    let isView = +status === 2
    let isEdit = +status === 1

    if (isEdit) {
      if (!this.$portal.hasPermission('MerchantStoreListEdit')) {
        isEdit = false
        isView = true
      }
    }

    return {
      isEdit,
      isView,
      isCheckAll: false,
      checked: [],
      all: [],
      isIndeterminate: false,
      merchantId: '',
      loaded: false
    }
  },
  async mounted() {
    this.merchantId = await this.getMerchantId()
    this.all = await this.getAll()
    this.checked = await this.getChecked()
    if (this.checked.length) {
      this.isCheckAll = this.checked.length === this.all.length
      this.isIndeterminate = !this.isCheckAll
    }
    this.loaded = true
  },
  methods: {
    async handleSubmit() {
      const { orgId } = this.$route.params

      await this.$merchant.$api.storeService.saveStoreCategory({
        orgId,
        storeId: orgId,
        categoryIds: this.checked,
        merchantId: this.merchantId
      })

      this.$message({
        type: 'success',
        message: this.$t('保存成功')
      })
    },
    async getMerchantId() {
      const { orgId, entityType, showTab, channelMode } = this.$route.params
      const { data = {}} = await this.$merchant.$api.storeService.queryStoreInfo({
        orgId,
        entityType,
        showTab,
        channelMode
      })

      return data.merchantId
    },
    async getChecked() {
      const { orgId } = this.$route.params

      const { data = [] } = await this.$merchant.$api.storeService.listStoreCategory({
        orgId,
        storeId: orgId,
        categoryIds: [],
        merchantId: this.merchantId
      })

      return [... new Set(data.map(x => x.categoryId))]
    },
    async getAll() {
      const { orgId } = this.$route.params

      const { data } = await this.$merchant.$api.storeService.getListGrantCategoryByParam({
        orgId,
        storeId: orgId,
        categoryIds: [],
        merchantId: this.merchantId
      })

      return data.map(x => {
        return {
          label: x.name,
          value: x.id
        }
      })
    },
    handleCheckAllChange(val) {
      this.checked = val ? this.all.map(x => x.value) : []
      this.isIndeterminate = false
    },
    handleCheckedOneChange(value) {
      const checkedCount = value.length
      this.isCheckAll = checkedCount === this.all.length
      this.isIndeterminate = checkedCount > 0 && !this.isCheckAll
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
