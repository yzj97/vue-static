<template>
  <div>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          v-if="isEdit"
          name="OpmsJxContractList28_createContact"
          size="mini"
          type="primary"
          code="OpmsJxContractList28"
          @click="createContact"
        >{{ $t('contract_addContacts') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :data="list" :columns="columns" :operates="operates" :can-filter="false" name="list332" />
      </div>
    </ody-list-table-area>
    <AddDialog
      :visible.sync="addVisible"
      :contract-id.sync="contractId"
      :form-data.sync="formData"
      @ok="updateList"
    />
  </div>
</template>

<script>
import AddDialog from '@/components/contract/contact/add'

export default {
  components: {
    AddDialog
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
      list: [],
      formData: {
        personName: '',
        positionName: '',
        fixedTelephone: '',
        mobile: '',
        email: '',
        addressDetail: '',
        remark: ''
      },
      columns: [
        {
          show: true,
          prop: 'personName',
          label: this.$t('contract_contacts'),
          align: 'center'
        },
        {
          show: true,
          prop: 'positionName',
          label: this.$t('contract_contactsPosition'),
          align: 'center'
        },
        {
          show: true,
          prop: 'fixedTelephone',
          label: this.$t('contract_contactsPhone'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mobile',
          label: this.$t('contract_contactsCellPhone'),
          align: 'center'
        },
        {
          show: true,
          prop: 'email',
          label: this.$t('contract_contactsEmail'),
          align: 'center'
        },
        {
          show: true,
          prop: 'addressDetail',
          label: this.$t('contract_addressDetail'),
          align: 'center'
        },
        {
          show: true,
          prop: 'isDefaultText',
          label: this.$t('contract_isDefault'),
          align: 'center'
        },
        {
          show: true,
          prop: 'remark',
          label: this.$t('common_remark'),
          align: 'center'
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('common_edit'),
            method(index, row) {
              vue.formData.id = row.id
              vue.formData.contractId = row.contractId
              vue.formData.positionName = row.positionName
              vue.formData.fixedTelephone = row.fixedTelephone
              vue.formData.mobile = row.mobile
              vue.formData.email = row.email
              vue.formData.addressDetail = row.addressDetail
              vue.formData.remark = row.remark
              vue.addVisible = true
            },
            hidden(index, row) {
              return !vue.isEdit
            },
            code: 'OpmsJxContractList29'
          },
          {
            label: this.$t('common_delete'),
            method(index, row) {
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
                  vue.$opms.$api.jxContract
                    .deleteContact({ id: row.id })
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
            },
            hidden(index, row) {
              return !vue.isEdit
            },
            code: 'OpmsJxContractList30'
          },
          {
            label: this.$t('contract_primaryContact'),
            method(index, row) {
              var defaultId
              console.log(vue.list)
              for (var i = 0; i < vue.list.length; i++) {
                if (vue.list[i].isDefault === 1) {
                  defaultId = vue.list[i].id
                }
              }
              vue.updateContact(defaultId)
              vue.$opms.$api.jxContract
                .modifyContact({ id: row.id, isDefault: '1' })
                .then(res => {
                  if (res && res.code === '0') {
                    vue.updateList()
                    vue.$message({
                      type: 'success',
                      message: vue.$t('save_success')
                    })
                  }
                })
            },
            hidden(index, row) {
              return !vue.isEdit || row.isDefault === 1
            },
            code: 'OpmsJxContractList31'
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
    updateContact(id) { // 更新为非主要
      console.log(id)
      if (!id) {
        return
      }
      var vue = this
      vue.$opms.$api.jxContract
        .modifyContact({ id: id, isDefault: '0' })
        .then(res => {
        })
    },
    updateList() {
      const vue = this
      const params = {
        contractId: vue.contractId
      }

      vue.$opms.$api.jxContract.queryContactList(params).then(res => {
        if (res && res.code === '0') {
          vue.list = res.data
        }
      })
    },
    createContact() {
      this.formData = {
        personName: '',
        positionName: '',
        fixedTelephone: '',
        mobile: '',
        email: '',
        addressDetail: '',
        remark: '',
        contractId: this.contractId
      }
      this.addVisible = true
    }
  }
}
</script>

<style scoped>
</style>
