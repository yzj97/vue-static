<template>
  <div>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          v-if="isEdit"
          name="OpmsJxContractList16_deleteFee"
          size="mini"
          type="primary"
          code="OpmsJxContractList16"
          @click="deleteFee"
        >{{ $t('contract_deleteSelectFeeType') }}</ody-button>
        <ody-button
          v-if="isEdit"
          name="OpmsJxContractList17_createFee"
          size="mini"
          type="primary"
          code="OpmsJxContractList17"
          @click="createFee"
        >{{ $t('contract_addFeeBill') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="list"
          :columns="columns"
          :can-filter="false"
          :checked.sync="checked"
          :multiple="isEdit"
          name="list755"
        />
      </div>
      <div slot="page">
        <div class="block">
          <ody-pagination
            :current-page.sync="page.current"
            :list="list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.size"
            :total.sync="page.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"
          />
        </div>
      </div>
    </ody-list-table-area>
    <AddDialog :visible.sync="addVisible" :contract-id.sync="contractId" @ok="updateList" />
    <LadderDialog
      :visible.sync="ladderVisible"
      :id.sync="feeId"
      :contract-id.sync="contractId"
      :is-edit.sync="isEdit"
      :fee-rule-data.sync="feeRuleData"
      @ok="updateList"
    />
  </div>
</template>

<script>
import AddDialog from '@/components/contract/fee/add'
import LadderDialog from '@/components/contract/fee/ladder'

export default {
  components: {
    AddDialog,
    LadderDialog
  },
  props: {
    contractId: {
      type: Number,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vue = this
    return {
      addVisible: false,
      ladderVisible: false,
      feeId: null,
      list: [],
      checked: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'feeTypeCode',
          label: this.$t('contract_feeTypeCode'),
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'feeTypeName',
          label: this.$t('contract_feeTypeName'),
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'countPeriodText',
          label: this.$t('contract_countPeriodText'),
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'countStandardText',
          label: this.$t('contract_countStandardText'),
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'countTypeText',
          label: this.$t('contract_countTypeText'),
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'createFeeBillTypeText',
          label: this.$t('contract_createFeeBillType'),
          align: 'left',
          minWidth: 100
        },
        {
          show: true,
          prop: 'auditTypeText',
          label: this.$t('contract_auditType'),
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'isGuaranteeText',
          label: this.$t('contract_isGuaranteeText'),
          align: 'left',
          minWidth: 100
        },
        {
          show: true,
          prop: 'guaranteeAmount',
          label: this.$t('contract_guaranteeAmount'),
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'feeAmount',
          label: this.$t('contract_feeAmount'),
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'deductionRate',
          label: this.$t('contract_deductionRate'),
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'remark',
          label: this.$t('common_remark'),
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'id',
          label: this.$t('contract_FeeTermLadder'),
          align: 'left',
          render: (h, params) => {
            const isEdit = vue.isEdit
            console.log(isEdit)
            if (params.row.countType !== 3) {
              return <span>{vue.$t('contract_no')}</span>
            } else {
              if (isEdit) {
                return (
                  <div>
                    <ody-button
                      size='small'
                      type='primary'
                      code='OpmsJxContractList18'
                      on-click={() => {
                        vue.openFeeTermLadderModel(params.row)
                      }}
                    >
                      {vue.$t('common_edit')}
                      {vue.$t('contract_FeeTermLadder')}
                    </ody-button>
                  </div>
                )
              } else {
                return (
                  <div>
                    <ody-button
                      size='small'
                      type='primary'
                      code='OpmsJxContractList19'
                      on-click={() => {
                        vue.openFeeTermLadderModel(params.row)
                      }}
                    >
                      {vue.$t('common_watch')}
                      {vue.$t('contract_FeeTermLadder')}
                    </ody-button>
                  </div>
                )
              }
            }
          }
        }
      ],
      feeRuleData: {
        ruleList: [
          {
            beginAmount: 0,
            endAmount: 0,
            royaltyRate: 0
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.updateList()
    },
    updateList() {
      const vue = this
      const params = {
        contractId: vue.contractId,
        currentPage: vue.page.current,
        itemsPerPage: vue.page.size
      }

      vue.$opms.$api.jxContract.queryFeePage(params).then(res => {
        if (res && res.code === '0') {
          vue.list = res.data.listObj === null ? [] : res.data.listObj
          vue.page.total = res.data.total
        }
      })
    },
    createFee() {
      this.addVisible = true
    },
    deleteFee() {
      const vue = this

      if (vue.checked && vue.checked.length > 0) {
        vue
          .$confirm(
            vue.$t('common_msg_confirm_delete'),
            vue.$t('common_msg_delete'),
            {
              confirmButtonText: vue.$t('common_confirm'),
              cancelButtonText: vue.$t('common_cancel'),
              type: 'warning'
            }
          )
          .then(() => {
            const ids = []
            vue.checked.forEach(function(item) {
              ids.push(item.id)
            })

            vue.$opms.$api.jxContract
              .deleteFee({ contractId: vue.contractId, ids: ids })
              .then(res => {
                if (res && res.code === '0') {
                  vue.updateList()
                  vue.$message({
                    type: 'success',
                    message: vue.$t('delete_success')
                  })
                }
              })
          })
      } else {
        vue.$message({
          type: 'warning',
          message: vue.$t('please_choose_at_least_one_item')
        })
      }
    },
    openFeeTermLadderModel(row) {
      const vue = this
      vue.feeId = row.id
      vue.feeRuleData.ruleList = [
        {
          beginAmount: 0,
          endAmount: 0,
          royaltyRate: 0
        }
      ]

      if (row.feeCalculateRuleList && row.feeCalculateRuleList.length > 0) {
        vue.feeRuleData.ruleList = []
        row.feeCalculateRuleList.forEach(function(item) {
          vue.feeRuleData.ruleList.push(Object.assign({}, item))
        })
      }
      vue.ladderVisible = true
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
</script>

<style scoped>
</style>
