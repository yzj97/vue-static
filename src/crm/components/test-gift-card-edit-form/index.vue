<template>
  <div class="">
    <el-form
      ref="form"
      :model="form"
      :disabled="status === 'IS_DETAIL'"
      :rules="rules"
      label-width="240px"
      style="width: 740px;"
      class="form"
    >

      <el-form-item :label="$t('实体卡制卡批次id')" prop="makeId">
        <el-input-number
          v-model="form.makeId"
          :placeholder="$t('请输入实体卡制卡批次id')"
          name="form_makeId"
        />
      </el-form-item>

      <el-form-item :label="$t('卡对应的商品id，不是提货卡可提货的商品id')" prop="cardMpId">
        <el-input-number
          v-model="form.cardMpId"
          :placeholder="$t('请输入卡对应的商品id，不是提货卡可提货的商品id')"
          name="form_cardMpId"
        />
      </el-form-item>

      <el-form-item :label="$t('卡对应的商品code，不是提货卡可提货的商品code')" prop="cardMpCode">
        <el-input
          v-model="form.cardMpCode"
          :placeholder="$t('请输入卡对应的商品code，不是提货卡可提货的商品code')"
          name="form_cardMpCode"

          type="text"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="$t('卡号')" prop="cardCode">
        <el-input
          v-model="form.cardCode"
          :placeholder="$t('请输入卡号')"
          name="form_cardCode"

          type="text"
          maxlength="18"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="$t('实体卡卡密')" prop="cardPwd">
        <el-input
          v-model="form.cardPwd"
          :placeholder="$t('请输入实体卡卡密')"
          name="form_cardPwd"

          type="text"
          maxlength="44"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="$t('礼品卡类型:33电子礼品卡，34实体礼品卡，35电子提货卡，36实体提货卡')" prop="type">
        <el-input-number
          v-model="form.type"
          :placeholder="$t('请输入礼品卡类型:33电子礼品卡，34实体礼品卡，35电子提货卡，36实体提货卡')"
          name="form_type"
        />
      </el-form-item>

      <el-form-item :label="$t('状态，0未绑定，1已绑定，2已使用，3已过期，4已回收')" prop="status">
        <el-input-number
          v-model="form.status"
          :placeholder="$t('请输入状态，0未绑定，1已绑定，2已使用，3已过期，4已回收')"
          name="form_status"
        />
      </el-form-item>

      <el-form-item :label="$t('电子/实体礼品卡的面值，保留两位小数')" prop="faceValue">
        <el-input-number
          v-model="form.faceValue"
          :placeholder="$t('请输入电子/实体礼品卡的面值，保留两位小数')"
          name="form_faceValue"
        />
      </el-form-item>

      <el-form-item :label="$t('礼品卡时的余额')" prop="balanceAmount">
        <el-input-number
          v-model="form.balanceAmount"
          :placeholder="$t('请输入礼品卡时的余额')"
          name="form_balanceAmount"
        />
      </el-form-item>

      <el-form-item :label="$t('卡购买实付金额')" prop="cardPayAmount">
        <el-input-number
          v-model="form.cardPayAmount"
          :placeholder="$t('请输入卡购买实付金额')"
          name="form_cardPayAmount"
        />
      </el-form-item>

      <el-form-item :label="$t('电子/实体提货卡提货商品ID')" prop="giftMpId">
        <el-input-number
          v-model="form.giftMpId"
          :placeholder="$t('请输入电子/实体提货卡提货商品ID')"
          name="form_giftMpId"
        />
      </el-form-item>

      <el-form-item :label="$t('电子/实体提货卡提货商品编码')" prop="giftMpCode">
        <el-input
          v-model="form.giftMpCode"
          :placeholder="$t('请输入电子/实体提货卡提货商品编码')"
          name="form_giftMpCode"

          type="text"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="$t('电子提货卡提货商品店铺id')" prop="giftStoreId">
        <el-input-number
          v-model="form.giftStoreId"
          :placeholder="$t('请输入电子提货卡提货商品店铺id')"
          name="form_giftStoreId"
        />
      </el-form-item>

      <el-form-item :label="$t('礼品卡有效期，为null表示永久有效')" prop="expiredTime">
        <ody-date-range-picker
          v-model="form.expiredTime"
          :placeholder="$t('请选择礼品卡有效期，为null表示永久有效')"
          name="form_expiredTime"
        />
      </el-form-item>

      <el-form-item :label="$t('绑卡时间,转赠后会更新此时间。未绑定时为null')" prop="bindTime">
        <ody-date-range-picker
          v-model="form.bindTime"
          :placeholder="$t('请选择绑卡时间,转赠后会更新此时间。未绑定时为null')"
          name="form_bindTime"
        />
      </el-form-item>

      <el-form-item :label="$t('绑卡方式，1后台发放，2购卡绑定，3转赠领取,未绑定时为null')" prop="bindType">
        <el-input-number
          v-model="form.bindType"
          :placeholder="$t('请输入绑卡方式，1后台发放，2购卡绑定，3转赠领取,未绑定时为null')"
          name="form_bindType"
        />
      </el-form-item>

      <el-form-item :label="$t('持卡人id')" prop="bindUserId">
        <el-input-number
          v-model="form.bindUserId"
          :placeholder="$t('请输入持卡人id')"
          name="form_bindUserId"
        />
      </el-form-item>

      <el-form-item :label="$t('持卡人手机')" prop="bindUserMobile">
        <el-input
          v-model="form.bindUserMobile"
          :placeholder="$t('请输入持卡人手机')"
          name="form_bindUserMobile"

          type="text"
          maxlength="60"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="$t('创建时间')" prop="createTime">
        <el-date-picker
          v-model="form.createTime"
          :placeholder="$t('请选择创建时间')"
          name="form_createTime"
        />
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    status: {
      type: String,
      default: 'IS_CREATE' // IS_EDIT, IS_DETAIL
    }
  },
  data() {
    return {
      // 验证规则自己添加
      rules: { 'makeId': [], 'cardMpId': [{ 'required': true, 'message': '请输入卡对应的商品id，不是提货卡可提货的商品id', 'trigger': 'blur' }], 'cardMpCode': [{ 'min': 0, 'max': 50, 'message': '长度在 0 到 50 个字符', 'trigger': 'blur' }], 'cardCode': [{ 'required': true, 'message': '请输入卡号', 'trigger': 'blur' }, { 'min': 1, 'max': 18, 'message': '长度在 1 到 18 个字符', 'trigger': 'blur' }], 'cardPwd': [{ 'min': 0, 'max': 44, 'message': '长度在 0 到 44 个字符', 'trigger': 'blur' }], 'type': [{ 'required': true, 'message': '请输入礼品卡类型:33电子礼品卡，34实体礼品卡，35电子提货卡，36实体提货卡', 'trigger': 'blur' }], 'status': [{ 'required': true, 'message': '请输入状态，0未绑定，1已绑定，2已使用，3已过期，4已回收', 'trigger': 'blur' }], 'faceValue': [], 'balanceAmount': [], 'cardPayAmount': [], 'giftMpId': [], 'giftMpCode': [{ 'min': 0, 'max': 50, 'message': '长度在 0 到 50 个字符', 'trigger': 'blur' }], 'giftStoreId': [], 'expiredTime': [], 'bindTime': [], 'bindType': [], 'bindUserId': [], 'bindUserMobile': [{ 'min': 0, 'max': 60, 'message': '长度在 0 到 60 个字符', 'trigger': 'blur' }], 'createTime': [{ 'required': true, 'message': '请选择日期', 'trigger': 'change' }] }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
