<template>
  <div class="pg-crm-test-gift-card-detail">
    <ody-box>
      <crm-test-gift-card-edit-form ref="taskEditForm" :form="editForm" status="IS_DETAIL" />
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
        :disabled="true"
        code=""
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
        console.log('detail-id', id)
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
