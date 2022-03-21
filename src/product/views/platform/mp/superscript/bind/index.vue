<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('商家')" prop="merchantId">
            <ody-merchant-select v-model="search.merchantId" name="search_merchantId" value-key="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')" prop="chineseName">
            <el-input v-model="search.chineseName" name="search_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码')" prop="code">
            <el-input v-model="search.code" name="search_code" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="SuperscriptPageAssociationMpQuery"
          size="small"
          type="primary"
          code="SuperscriptPageAssociationMpQuery"
          @click.prevent="query"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div v-if="id&&$portal.hasPermission('SuperscriptPageAssociationMp')" slot="btn">
        <ody-product-merchant-choose-subscript
          v-model="product.ids"
          :selected.sync="product.selected"
          :multiple="true"
          :placeholder="$t('添加商品')"
          name="product_ids"
          @ok="bindProducts"
        />
        <ody-button
          name="SuperscriptPageAssociationMpDelete_unbindProducts"
          size="small"
          code="SuperscriptPageAssociationMpDelete"
          @click="unbindProducts"
        >{{ $t('批量删除') }}</ody-button>
        <ody-button
          name="SuperscriptPageAssociationMpImport_toBatch"
          size="small"
          code="SuperscriptPageAssociationMpImport"
          @click="toBatch"
        >{{ $t('导入商品') }}</ody-button>
        <ody-button
          name="SuperscriptPageAssociationMpViewTask_taskVisible"
          size="small"
          code="SuperscriptPageAssociationMpViewTask"
          style="margin-left: 0;"
          @click="taskVisible=true"
        >{{ $t('查看任务') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :checked.sync="checkedList"
          multiple="true"
          request-url="/back-product-web/back/mp/superscript/getAggregationMpByParam.do"
        />
      </div>
    </ody-list-table-area>
    <importTask :import-type="20" :is-data-task="true" :visible.sync="taskVisible" task-type="superscriptMpImport" />
    <merchant-product-modal
      v-if="modalVisible"
      :visible.sync="modalVisible"
      :data-type="2"
      :use-type="0"
      :status="2"
      :type-of-products="[0, 3]"
      @ok="closeMpModal"
    />
  </section>
</template>
<script>
import importTask from '@/components/downloadTask/ImportTask.vue'
import merchantProductModal from '@/components/product-search-modal'
export default {
  name: 'SuperscriptBind',
  components: { importTask, merchantProductModal },
  data() {
    const self = this
    return {
      id: null,
      search: {},
      product: {
        ids: [],
        selected: []
      },
      checkedList: [],
      taskVisible: false,
      modalVisible: false,
      table: {
        columns: [
          {
            label: self.$t('商品名称'),
            prop: 'chineseName',
            show: true,
            align: 'center'
          },
          {
            label: self.$t('商品编码'),
            prop: 'code',
            show: true,
            align: 'center'
          },
          {
            label: self.$t('商家'),
            prop: 'merchantName',
            show: true,
            align: 'center'
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: self.$t('delete'),
              method: (index, row) => {
                this.unbindProduct([row.id])
              },
              code: 'SuperscriptPageAssociationMpDelete'
            }
          ]
        }
      }
    }
  },
  created() {
    this.mpApi = this.$product.$api.mpApi
    this.id = this.$route.query.id
    this.search.superscriptId = this.id
  },
  async mounted() {
    await this.query()
  },
  methods: {
    bindProducts() {
      const mps = this.product.selected.map(p => {
        return {
          superscriptId: this.id,
          merchantProductId: p.refId,
          merchantId: p.merchantId,
          merchantName: p.merchantName
        }
      })
      this.search.productIds = mps
      return this.mpApi.saveAggreationMpWithTx(mps).then(res => {
        this.$message({
          showClose: true,
          message: this.$t('保存成功'),
          type: 'success'
        })
        this.product.selected = []
        this.query()
      })
    },
    unbindProducts() {
      if (this.checkedList.length === 0) {
        this.$message({
          showClose: true,
          message: this.$t('未选中删除项'),
          type: 'error'
        })
      } else {
        this.unbindProduct(this.checkedList.map(p => p.id))
      }
    },
    unbindProduct(ids) {
      this.$confirm(this.$t('确定要移除商品吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.mpApi.batchDeleteAggregationMp(ids).then(res => {
          this.$message({
            showClose: true,
            message: this.$t('操作成功'),
            type: 'success'
          })
          this.query()
        })
      })
    },
    showMpModal() {
      this.modalVisible = true
    },
    closeMpModal(mpList) {
      console.log(mpList)
      this.product.selected = mpList
      this.bindProducts()
    },
    handleReset() {
      this.search = {}
      this.search.superscriptId = this.id
    },
    async handleSubmit() {
      await this.query()
    },
    toBatch() {
      this.$router.push({ name: 'SuperscriptBatch' })
    },
    query() {
      const { ...params } = this.search
      return this.$refs.table.getList(this.formHasValue(params))
    }
  }
}
</script>
