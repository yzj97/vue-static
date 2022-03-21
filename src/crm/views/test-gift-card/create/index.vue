<template>
  <div class="pg-crm-test-gift-card-create">
    <ody-box>
      <crm-test-gift-card-edit-form ref="taskEditForm" :form="editForm" status="IS_CREATE" />
      {{ editForm }}
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
        name="TestGiftCard_add_handleeditFormSubmit"
        code="TestGiftCard_add"
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

        console.log('create-params', params)

        await this.$crm.$api.testGiftCard.add(params)

        this.$message({
          message: this.$t('创建成功'),
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
