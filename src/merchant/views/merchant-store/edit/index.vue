<template>
  <ody-box class="pg-merchant-store-edit">
    <el-tabs v-model="editableTabsValue" name="editableTabsValue" tab-position="left">
      <el-tab-pane
        v-for="item in editableTabs"
        v-if="((item === '客服设置' && showCsSetting) || item !== '客服设置')"
        :key="editComponents[item]"
        :label="$t(item)"
        :name="editComponents[item]"
      >
        <div
          :is="'merchant-store-edit-' + editComponents[item]"
        />
      </el-tab-pane>
    </el-tabs>
  </ody-box>
</template>

<script>
import MerchantStoreEditInfo from '@/components/store-edit-info'
import MerchantStoreEditAddress from '@/components/store-edit-address'
import MerchantStoreEditTerminalSupplier from '@/components/store-edit-terminal-supplier'
import MerchantStoreEditBusinessCategory from '@/components/store-edit-business-category'
import MerchantStoreEditBrandManagement from '@/components/store-edit-brand-management'
import MerchantStoreEditOrderReturn from '@/components/store-edit-order-return'
import MerchantStoreEditCsSetting from '@/components/store-edit-cs-setting'
import MerchantStoreEditPosition from '@/components/store-edit-position'
import MerchantStoreEditBusinessTime from '@/components/store-edit-business-time'
import MerchantStoreEditDistributionTime from '@/components/store-edit-distribution-time'
import MerchantStoreEditDistributionRange from '@/components/store-edit-distribution-range'

// tabs 分类
const tabs = {
  'POS': ['基本信息', '地址标记', '营业时间', '地址信息', '供应商店铺映射', '店铺经营类目', '店铺经营品牌', '订单退货设置'],
  'O+O': ['基本信息', '地址标记', '配送范围', '营业时间', '配送时间', '地址信息', '供应商店铺映射', '店铺经营类目', '店铺经营品牌', '客服设置', '订单退货设置'],
  other: ['基本信息', '地址信息', '供应商店铺映射', '店铺经营类目', '店铺经营品牌', '客服设置', '订单退货设置']
}

export default {
  name: 'MerchantStoreEdit',
  components: {
    MerchantStoreEditInfo,
    MerchantStoreEditAddress,
    MerchantStoreEditTerminalSupplier,
    MerchantStoreEditBusinessCategory,
    MerchantStoreEditBrandManagement,
    MerchantStoreEditOrderReturn,
    MerchantStoreEditCsSetting,
    MerchantStoreEditPosition,
    MerchantStoreEditBusinessTime,
    MerchantStoreEditDistributionTime,
    MerchantStoreEditDistributionRange
  },
  data() {
    const { channelMode } = this.$route.params

    return {
      editableTabsValue: 'info',
      editableTabs: tabs[channelMode] || tabs.other,
      editComponents: {
        '基本信息': 'info',
        '地址标记': 'position',
        '营业时间': 'business-time',
        '地址信息': 'address',
        '供应商店铺映射': 'terminal-supplier',
        '配送范围': 'distribution-range',
        '配送时间': 'distribution-time',
        '店铺经营类目': 'business-category',
        '店铺经营品牌': 'brand-management',
        '客服设置': 'cs-setting',
        '订单退货设置': 'order-return'
      },
      showCsSetting: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const res = await this.$merchant.$api.commonService.getSwitcherBoolean({ key: 'sobot.cs.switch' })
      this.showCsSetting = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-merchant-store-edit {
  .inner-form {
    width: 960px;
  }
}
</style>
