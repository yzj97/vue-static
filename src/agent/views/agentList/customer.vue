<template>
  <ody-dialog
    :visible="visible"
    :before-close="handleClose"
    :title="$t(customerType === 0 ? 'allCustomer' : 'agent2')"
    width="900px"
    @open="init">
    <section class="customer-list">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="50px" class="form">
            <ody-search-item v-if="customerType==0" :label="$t('invoice_customer_type') + ':'" prop="customerLevel">
              <el-select v-model="searchForm.customerLevel" :placeholder="$t('All')" name="searchForm_customerLevel">
                <el-option
                  v-for="(item, index) in levelList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('cell-phone_number') + ':'" prop="userMobile">
              <el-input v-model="searchForm.userMobile" :placeholder="$t('please_enter_the_cell_phone_number')" name="searchForm_userMobile"/>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('reset') }}</el-button>
          <ody-button name="query" code="agentQuery" size="small" type="primary" @click="query">{{ $t('common_select') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :can-filter="false"
            :data-key="'id'"
            name="listTable_list893"/>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="query"
            @current-change="query"/>
        </div>
      </ody-list-table-area>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button name="handleClose" size="small" type="primary" @click="handleClose">{{ $t('close') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  name: 'Customer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Object,
      required: true
    },
    customerType: {
      type: 0,
      required: true
    }
  },
  data() {
    const self = this
    return {
      searchForm: {
        customerLevel: null,
        userMobile: null,
        currentPage: 1,
        itemsPerPage: 10,
        total: 0
      },
      levelList: [
        { label: self.$t('customer.level.I'), value: 1 },
        { label: self.$t('customer.level.II'), value: 2 }
      ],
      loading: false,
      listTable: {
        list: [],
        columns: [
          {
            show: () => self.customerType === 0,
            prop: 'customerLevel',
            label: self.$t('invoice_customer_type'),
            align: 'center',
            formatter: (row, column) => {
              for (let i = 0; i < this.levelList.length; ++i) {
                if (this.levelList[i].value === row.customerLevel) {
                  return this.levelList[i].label
                }
              }
            }
          },
          {
            show: true,
            prop: 'userMobile',
            label: self.$t('userPhoneNumber'),
            align: 'center'
          },
          {
            show: () => self.customerType !== 0,
            prop: 'level',
            label: self.$t('member_type'),
            align: 'center',
            formatter: (row, column) => {
              return row.type === 9 ? '内部会员' : '外部会员'
            }
          }
        ]
      }
    }
  },
  methods: {
    init() {
      this.initForm()
      this.query()
    },
    initForm() {
      this.searchForm = {
        customerLevel: null,
        userMobile: null,
        currentPage: 1,
        itemsPerPage: 10,
        total: 0
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async query() {
      const params = {
        filters: {
          userId: this.userId,
          userMobile: this.searchForm.userMobile,
          customerLevel: this.searchForm.customerLevel
        },
        page: this.searchForm.currentPage,
        limit: this.searchForm.itemsPerPage
      }
      if (this.customerType !== 0) {
        params.filters.type = [8, 9]
      }
      const result = await this.$agent.$api.agent.listCustomerPage(params)
      this.listTable.list = result.data
      this.listTable.total = result.total
    }
  }
}
</script>

<style lang="less" scoped>
  .customer-list {
    .cp-search-item {
      width: 50% !important;
    }
  }
</style>
