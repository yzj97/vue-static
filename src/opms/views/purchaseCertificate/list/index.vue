<template>
  <section>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="OpmsPurchaseCertificateList01_showModal"
          size="small"
          type="primary"
          code="OpmsPurchaseCertificateList01"
          @click="showModal"
        >{{ $t('purchaseCertificate_add_type') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list373" />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
    <!--新增与编辑页面-->
    <EditCert
      :modal-type.sync="modalType"
      :visible.sync="visibleOfCert"
      :selected-item.sync="selectedItem"
      @ok="init"
    />
    <EditCate
      :modal-type.sync="modalType"
      :visible.sync="visibleOfCate"
      :selected-cate.sync="selectedCate"
      @ok="init"
    />
  </section>
</template>

<script>
import EditCert from '@/components/purchaseCertificate/editCert'
import EditCate from '@/components/purchaseCertificate/editCate'

export default {
  name: 'OpmsPurchaseCertificateList',
  components: {
    EditCert,
    EditCate
  },
  data() {
    return {
      loading: false,
      visibleOfCert: false,
      visibleOfCate: false,
      modalType: 'create',
      switchStatus: false,
      list: [],
      selectedItem: null,
      selectedCate: {
        id: null,
        data: null,
        checkedList: []
      },
      operates: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          label: this.$t('common_operation'),
          align: 'center',
          minWidth: 200,
          render: (idx, res) => {
            return (
              <div>
                <ody-button
                  size='small'
                  type='primary'
                  code='OpmsPurchaseCertificateList02'
                  on-click={() => {
                    this.showModal('edit', false, res.row)
                  }}
                >
                  {this.$t('common_edit')}
                </ody-button>
                <ody-button
                  size='small'
                  type='primary'
                  code='OpmsPurchaseCertificateList03'
                  on-click={() => {
                    this.switch(res.row)
                  }}
                >
                  {this.$t(
                    'common_' +
                      (res.row.isDisable === 0
                        ? 'status_disabled'
                        : 'status_enabled')
                  )}
                </ody-button>
                <ody-button
                  size='small'
                  type='primary'
                  code='OpmsPurchaseCertificateList04'
                  on-click={() => {
                    this.showModal('edit', true, res.row)
                  }}
                >
                  {this.$t('purchaseOrder_product_category')}
                </ody-button>
              </div>
            )
          }
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('purchaseCertificate_type'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'needCert',
          label: this.$t('purchaseCertificate_txt'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            return row.needCert == null
              ? '非必须'
              : row.needCert + '' === '0'
                ? '非必须'
                : '必须'
          }
        },
        {
          show: true,
          prop: 'needExpiryDate',
          label: this.$t('purchaseCertificate_valid_date'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return row.needExpiryDate == null
              ? '非必须'
              : row.needExpiryDate + '' === '0'
                ? '非必须'
                : '必须'
          }
        },
        {
          show: true,
          prop: 'descr',
          label: this.$t('common_explain'),
          align: 'center'
        }
      ]
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      const params = {
        limit: this.page.size,
        page: this.page.current
      }
      // 查询列表数据
      this.loading = true
      await this.$opms.$api.purchaseCert
        .certList(params)
        .then(res => {
          if (res) {
            this.list = res.data
            this.page.total = res.total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    async showModal(modalType, isCate, row) {
      if (modalType === 'edit') {
        this.modalType = 'edit'
        this.selectedItem = row
      } else {
        this.modalType = 'create'
        this.selectedItem = {}
      }
      if (isCate !== true) {
        this.visibleOfCert = true
      } else {
        // 将商品分类nodes放到selectedCate中传递给子组件
        await this.$opms.$api.purchaseCert
          .cateList()
          .then(async res => {
            console.log('父组件获取的cate数据：' + JSON.stringify(res.data))
            if (res.data.length > 0) {
              this.selectedCate.id = row.id
              this.selectedCate.data = res.data
            }
            // 查询当前当前certificateId是否存在商品分类关联关系
            // 若不存在，则为新增，modalType=create
            // 若存在，则未修改，modalType=edit(默认)
            const params = {
              filters: {
                certificateId: row.id
              }
            }
            await this.$opms.$api.purchaseCert.getCates(params).then(res => {
              console.log(
                '查询对应的certificateId是否有关联数据：' +
                  JSON.stringify(res.data)
              )
              if (res.data.length === 0) {
                this.modalType = 'create'
              } else {
                this.selectedCate.checkedList = []
                for (let i = 0; i < res.data.length; i++) {
                  this.selectedCate.checkedList.push(res.data[i].categoryId)
                }
              }
            })
          })
          .catch(err => {
            console.log(err)
          })
        this.visibleOfCate = true
      }
    },
    async switch(row) {
      // 更新可用状态
      if (row.isDisable === 0) {
        row.isDisable = 1
      } else {
        row.isDisable = 0
      }
      await this.$opms.$api.purchaseCert.updateCert(row)
    },
    async handlePageSizeChange() {
      try {
        this.$nextTick(function() {
          this.init()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.init()
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
