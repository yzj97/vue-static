<template>
  <ody-choose
    v-if="visible"
    :visible="visible"
    :search-config="choose.searchConfig"
    :checked="selected"
    :choose-key="chooseKey"
    :search-value="choose.searchValue"
    :request-url="choose.requestUrl"
    :columns="choose.columns"
    :multiple="multiple"
    :highlight-current-row="!multiple"
    :disabled-id-list="disabledIdList"
    :title="$t('新增属性项目')"
    @close="handleClose"
    @submit="handleSubmit"
  />
</template>
<script>
export default {
  props: {
    disabledIdList: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    chooseKey: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    },
    attType: {
      type: 'string',
      default: ''
    }
  },
  data() {
    return {
      name: '',
      choose: {
        searchConfig: [
          {
            label: this.$t('属性项名称'),
            prop: 'name',
            type: 'input'
          }
        ],
        searchValue: {
          name: this.name,
          attType: this.attType,
          level: 0
        },
        requestUrl: '/back-product-web/back/mp/attribute/queryAttributeByPage.do',
        columns: [
          {
            label: this.$t('属性项名称'),
            prop: 'name',
            show: true
          },
          {
            label: this.$t('备注'),
            prop: 'remark',
            show: true
          },
          {
            label: this.$t('属性值'),
            prop: 'attributeValuesStr',
            show: true
          }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel')
    },
    handleSubmit(val) {
      this.$emit('update:selected', val)
      this.$emit('ok', val)
    }
  }
}
</script>
