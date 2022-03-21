<template>
  <section class="pg-userSummary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('manual_order_user_info') }}</span> <!-- 下单账户信息 -->
      </div>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_user_id')" :rules="rules.userId" prop="userId"> <!-- 会员号 -->
            <el-input v-model="formData.userId" name="formData_userId" readonly="readonly" @focus="userSelectModal"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_user_name')"> <!-- 会员姓名 -->
            <el-input v-model="formData.userName" name="formData_userName"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_user_mobile')"> <!-- 会员手机 -->
            <el-input v-model="formData.mobile" name="formData_mobile" readonly="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_user_mail')"> <!-- 会员邮箱 -->
            <el-input v-model="formData.email" name="formData_email" readonly="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <UserModal :visible.sync="showModal" @ok="selectUser" />
  </section>
</template>
<script>
import UserModal from '@/components/userModal'

export default {
  components: {
    UserModal
  },
  props: {
    collect: {
      type: Object,
      default: null
    },
    formData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showModal: false,
      rules: {
        userId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
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
    userSelectModal() { // 打开选择用户弹出框
      this.showModal = true
    },
    selectUser(value) {
      this.formData.userId = value.id
      this.formData.userName = value.username
      this.formData.email = value.email
      this.formData.mobile = value.mobile

      this.$emit('changeUser', value)
    },
    init() {
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
