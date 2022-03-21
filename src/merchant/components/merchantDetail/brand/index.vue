<template>
  <div>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button v-if="!onlyRead" id="addBrand" name="MerchantManageApplyBrand_applyBrand" code="MerchantManageApplyBrand" size="mini" type="primary" @click="applyBrand()">{{ $t('申请品牌') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="brands"
          :can-filter="false"
          :operates="brandTable.operates"
          :columns="brandTable.columns"
          name="brands071"/>
      </div>
    </ody-list-table-area>
    <brand-modal :visible.sync="applyBrandVisible" :brand.sync="selectedItem" :org-id.sync="orgId" @ok="saveBrand"/>
  </div>
</template>

<script>
import BrandModal from '@/components/merchantDetail/brand/modal'

export default {
  components: {
    BrandModal
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
      statusAttr: ['', this.$t('待审核'), this.$t('审核通过'), this.$t('审核拒绝')],
      applyBrandVisible: false,
      brands: [],
      language: this.$t('第二语言'),
      selectedItem: {},
      brandTable: {
        columns: [
          {
            show: true,
            prop: 'brandName',
            label: this.$t('品牌名称'),
            align: 'center',
            minWidth: 120
          },
          {
            show: () => {
              return !!self.language
            },
            prop: 'nameLan2',
            label: this.$t('品牌名称') + '(' + this.$t('第二语言') + ')',
            align: 'center',
            minWidth: 150
          },
          {
            show: true,
            prop: 'logUrl',
            label: this.$t('品牌LOGO'),
            align: 'center',
            minWidth: 150,
            render: (h, params) => {
              if (params.row.logUrl) {
                return (
                  <div>
                    <el-image
                      style='width: 35px; height: 35px'
                      src={params.row.logUrl}
                    ></el-image>
                  </div>
                )
              }
              return (<div />)
            }
          },
          {
            show: true,
            prop: 'seniorityName',
            label: this.$t('资质证书/证书有效期'),
            align: 'center',
            minWidth: 200,
            render: (h, params) => {
              const senior1 = <div>
                {params.row.seniorityName}:{params.row.validityStart + '-' + params.row.validityEnd}
              </div>
              let senior2
              if (params.row.seniorityName2) {
                senior2 = <div>
                  {params.row.seniorityName2}:{params.row.validityStart2 + '-' + params.row.validityEnd2}
                </div>
              }
              let senior3
              if (params.row.seniorityName3) {
                senior3 = <div>
                  {params.row.seniorityName3}:{params.row.validityStart3 + '-' + params.row.validityEnd3}
                </div>
              }
              return (<div>
                {senior1}{senior2}{senior3}
              </div>)
            }
          },
          {
            show: true,
            prop: 'status',
            label: this.$t('审核状态'),
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              if (params.row.status === 3) {
                var self = this
                return (
                  <span>
                    <sapn style='color:red'>{params.row.statusName}</sapn>
                    <el-tooltip effect='dark' placement='top'>
                      <div slot='content'>
                        <div>
                          <span>{self.$t('拒绝原因')}：</span>
                          <span>{params.row.remark}</span>
                        </div>
                      </div>
                      <i class='el-icon-question' />
                    </el-tooltip>
                  </span>
                )
              } else {
                return <sapn>{params.row.statusName}</sapn>
              }
            }
          },
          {
            show: true,
            prop: 'createTime',
            label: this.$t('添加时间'),
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
              label: this.$t('编辑'),
              method(index, row) {
                self.showBrandModal(row)
              },
              hidden(index, row) {
                return !!self.onlyRead || row.status === 2
              },
              code: 'MerchantManageApplyBrandEdit'
            },
            {
              label: this.$t('删除'),
              method(index, row) {
                self.deleteBrand(row)
              },
              hidden(index, row) {
                return !!self.onlyRead || row.status === 2
              },
              code: 'MerchantManageApplyBrandDelete'
            },
            {
              label: this.$t('重新申请'),
              method(index, row) {
                self.auditAgain(row)
              },
              hidden(index, row) {
                return !!self.onlyRead || row.status !== 3
              },
              code: 'MerchantManageApplyBrandAuditAgain'
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
      this.queryBrand()
    },
    queryBrand() {
      const self = this
      self.$merchant.$api.productService.listMerchantBrand({ currentPage: 1, itemsPerPage: 1000, merchantId: self.orgId }).then(res => {
        if (res && res.code === '0' && res.data) {
          self.brands = res.data.listObj
        }
      })
    },
    showBrandModal(row) {
      this.selectedItem = row
      this.applyBrandVisible = true
    },
    applyBrand() {
      this.selectedItem = {}
      this.applyBrandVisible = true
    },
    async deleteBrand(item) {
      const vue = this
      const confirm = await this.$confirm('确认删除？', this.$t('提示'))
      if (!confirm) {
        return
      }
      vue.$merchant.$api.productService.deleteMerchantBrandById({ id: item.id }).then(res => {
        vue.$message.success('删除成功')
        vue.queryBrand()
      })
    },
    saveBrand() {
      this.queryBrand()
    },
    async auditAgain(item) {
      // 去改变状态
      await this.$merchant.$api.productService.updateMerchantBrandStatusByIds({
        ids: [item.id],
        status: 1
      })
      this.$message.success('操作成功')
      this.queryBrand()
    }
  }
}
</script>

<style scoped>

</style>
