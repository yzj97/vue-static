<template>
  <div>
    <el-button name="visible" size="small" type="primary" @click="visible = true">+添加品牌</el-button>
    <ody-choose
      v-if="visible"
      :checked="checked"
      :search-config="searchConfig"
      :search-value="searchValue"
      :request-url="requestUrl"
      :columns="columns"
      :multiple="true"
      :title="$t('添加品牌限制')"
      choose-key="userId"
      @close="handleClose"
      @submit="handleQueryBrandList"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    promType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checked: [],
      visible: false,
      requestUrl: '/back-promotion-web/couponSelectionRead/queryBrandList.do',
      searchConfig: [
        {
          label: this.$t('品牌名称'),
          prop: 'name',
          type: 'input'
        }
      ],
      searchValue: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: { promType: 6000 }
      },
      columns: [
        {
          label: this.$t('全选'),
          show: true
        },
        {
          label: this.$t('品牌名称'),
          prop: 'name',
          show: true
        }
      ],
      checkBrandList: [],
      querySelectBrandList: [],
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  methods: {
    handleClose() {
      this.visible = false
    },
    // 保存选中的品牌
    async saveBrand() {
      this.visible = false
      const params = {
        merchantType: 1,
        refType: 0,
        ruleType: 3,
        selectionList: this.checkBrandList,
        themeRef: '1911250006442375'
      }
      await this.$promotion.$api.promotion.saveSelectionLimit(params, {}).then(res => {
        if (res.code === '0') {
          this.getQuerySelectBrandList()
        }
      })
    },
    // 返回选中的品牌
    async getQuerySelectBrandList() {
      const params = {
        currentPage: this.currentPage,
        itemsPerPage: this.itemsPerPage,
        refType: 0,
        ruleType: 3,
        themeRef: '1911250006442375'
      }
      this.$promotion.$api.promotion.queryBrandList(params, {}).then(res => {
        if (res.code === '0' && res.data && res.data.listObj) {
          this.querySelectBrandList = res.data.listObj
          this.$emit('slectBrand', this.querySelectBrandList)
        }
      })
    },
    // 选择品牌
    async handleQueryBrandList(val) {
      this.checkBrandList = []
      val.map(item => {
        this.checkBrandList.push({ limitRef: item.id, refDescription: item.name })
      })
      await this.saveBrand()
    }
  }
}
</script>
