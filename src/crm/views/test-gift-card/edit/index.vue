<template>
  <div class="pg-crm-test-gift-card-edit">
    <ody-box>
      <crm-test-gift-card-edit-form ref="taskEditForm" :form="editForm" status="IS_EDIT" />
    </ody-box>
    <ody-fixed>
      <ody-button
        name="ui_handleeditFormBack"
        code="ui"
        size="medium"
        type="default"
        @click="handleeditFormBack"
      >
        {{ $t('返回') }}
      </ody-button>
      <ody-button
        name="TestGiftCard_update_handleeditFormSubmit"
        code="TestGiftCard_update"
        size="medium"
        type="primary"
        @click="handleeditFormSubmit"
      >
        {{ $t('保存') }}
      </ody-button>
    </ody-fixed>
  </div>
</template>

<script>
import CrmTestGiftCardEditForm from '@/components/test-gift-card-edit-form'

export default {
  components: {
    CrmTestGiftCardEditForm
  },
  data() {
    return {
      editForm: {

        makeId: null,

        cardMpId: 1,

        cardMpCode: null,

        cardCode: null,

        cardPwd: null,

        type: 1,

        status: 1,

        faceValue: null,

        balanceAmount: null,

        cardPayAmount: null,

        giftMpId: null,

        giftMpCode: null,

        giftStoreId: null,

        expiredTime: [],

        bindTime: [],

        bindType: null,

        bindUserId: null,

        bindUserMobile: null,

        createTime: null

      }
    }
  },
  async mounted() {
    await this.init()
  },
  methods: {
    // 初始化
    async init() {
      await this.loadData()
    },
    async loadData() {
      try {
        const { id } = this.$route.params
        console.log('edit-id', id)
        const { data: editForm } = await this.$crm.$api.testGiftCard.getById({
          id
        })

        editForm['expiredTime'] = [editForm['startExpiredTime'], editForm['endExpiredTime'], editForm['']]

        editForm['bindTime'] = [editForm['startBindTime'], editForm['endBindTime'], editForm['']]

        this.editForm = editForm
      } catch (ex) {
        console.error(ex)
      }
    },
    // 关闭当前页面，返回
    handleeditFormBack() {
      this.$portal.delActiveView()
    },
    validate() {
      return new Promise((resolve) => {
        this.$refs.taskEditForm.$refs.form.validate((valid) => {
          if (valid) {
            resolve([false])
          } else {
            resolve([true])
          }
        })
      })
    },
    async handleeditFormSubmit() {
      const { id } = this.$route.params
      try {
        const [err] = await this.validate()

        if (err) {
          return
        }

        const params = this.$portal.deepClone(this.editForm)

        params.startExpiredTime = params.expiredTime[0]

        params.endExpiredTime = params.expiredTime[1]

        delete params.expiredTime

        params.startBindTime = params.bindTime[0]

        params.endBindTime = params.bindTime[1]

        delete params.bindTime

        console.log('edit-params', {
          ...params,
          id
        })

        await this.$crm.$api.testGiftCard.update({
          ...params,
          id
        })

        this.$message({
          message: this.$t('编辑成功'),
          type: 'success'
        })
        this.handleeditFormBack()
      } catch (ex) {
        console.error(ex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
