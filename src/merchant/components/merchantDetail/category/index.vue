<template>
  <div>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button v-if="!onlyRead" id="applyCategory" name="MerchantManageCategoryAdd_applyCategory" code="MerchantManageCategoryAdd" size="mini" type="primary" @click="applyCategory">{{ $t('添加类目') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="categories"
          :can-filter="false"
          :operates="categoryTable.operates"
          :columns="categoryTable.columns"
          name="categories112"/>
      </div>
    </ody-list-table-area>
    <category-modal :visible.sync="applyCategoryVisible" :category-ids.sync="categoryIds" :org-id.sync="orgId" @ok="saveCategory"/>
  </div>
</template>

<script>
import CategoryModal from '@/components/merchantDetail/category/modal'

export default {
  components: {
    CategoryModal
  },
  props: {
    orgId: {
      type: Number,
      default: null
    },
    onlyRead: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const self = this
    return {
      statusAttr: {
        1: '待审核',
        2: '审核通过',
        3: '审核拒绝'
      },
      applyCategoryVisible: false,
      categories: [],
      categoryIds: [],
      language: '',
      selectedItem: {},
      categoryTable: {
        columns: [
          {
            show: true,
            prop: 'categoryCode',
            label: '类目编码',
            align: 'center',
            minWidth: 120
          },
          {
            show: true,
            prop: 'categoryName',
            label: '类目名称',
            align: 'center',
            minWidth: 120
          },
          {
            show: true,
            prop: 'status',
            label: '审核状态',
            align: 'center',
            minWidth: 100,
            formatter: (row, column) => {
              return self.statusAttr[row.status]
            }
          },
          {
            show: true,
            prop: 'createTime',
            label: '添加时间',
            align: 'center',
            minWidth: 150,
            render: (h, params) => {
              return (<div>
                {self.$portal.parseTime(params.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')}
              </div>)
            }
          }
        ],
        operates: {
          fixed: 'right',
          align: 'center',
          minWidth: 150,
          list: [
            {
              label: this.$t('移除'),
              method(index, row) {
                self.deleteCategory(row)
              },
              hidden(index, row) {
                return !!self.onlyRead || (row.status !== 1 && row.status !== 3)
              },
              code: 'MerchantManageCategoryRemove'
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.queryCategory()
      if (this.onlyRead) {
        this.operates = null
      }
    },
    queryCategory() {
      const self = this
      self.$merchant.$api.productService.listCategoryApply({ merchantId: self.orgId }).then(res => {
        if (res && res.code === '0' && res.data) {
          self.categories = res.data
          self.categoryIds = self.categories.map(value => value.categoryId)

          // self.categories.map((value, index, arr) => {
          //   self.categoryIds.push(value.id)
          // })
        }
      })
    },
    applyCategory() {
      this.applyCategoryVisible = true
    },
    async deleteCategory(item) {
      const vue = this
      const confirm = await this.$confirm('确认删除？', this.$t('提示'))
      if (!confirm) {
        return
      }
      vue.$merchant.$api.productService.deleteCategoryApply({ id: item.id }).then(res => {
        vue.$message.success('删除成功')
        vue.queryCategory()
      })
    },
    saveCategory() {
      this.queryCategory()
    }
  }
}
</script>

<style scoped>

</style>
