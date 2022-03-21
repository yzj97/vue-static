<template>
  <div>
    <ody-dialog-full-right
      :visible.sync="visible"
      :title="$t('会员等级详情')"
      @close="handleCloseDialog"
      @open="handleOpen">
      <el-form ref="form" :model="info" :rules="rules" :disabled="isView" label-width="240px">
        <ody-title :title="$t('rank_information')" />
        <el-form-item :label="$t('rank_type')" prop="memberType" style="width: 640px">
          <el-select v-model="info.memberType" :placeholder="$t('请选择')" name="info_memberType">
            <el-option v-for="item in memberTypeList" :key="item.memberType" :value="item.memberType" :label="item.memberTypeName" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('membership_grade')" prop="levelName" style="width: 640px">
          <el-input
            v-model="info.levelName"
            :placeholder="$t('请输入')"
            name="info_levelName"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('grade_logo')" prop="iconUrl">
          <ody-upload-image
            v-model="info.iconUrl"
            :pic-size="fileSize"
            :pic-type="fileType"
            :show-tip="true"
            name="info_iconUrl"
          />
        </el-form-item>
        <ody-title :title="$t('rank_condition')" />
        <el-form-item :label="$t('reach_the_conditions')" prop="gradeStatus">
          <el-radio v-model="info.gradeStatus" name="info_gradeStatus" label="2">{{ $t('automatic_reach') }}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('growth_value')" prop="balence">
          <ody-input-number v-model="info.balence" :min="0" :max="9999999999" name="info_balence"/>
          <!-- <el-input-number v-model="info.balence" :max="9999999999" :min="0" name="info_balence2" step="1" step-strictly="true" /> -->
        </el-form-item>
        <ody-title :title="$t('the_grade_validity_period')" />
        <el-form-item :label="$t('time_frame')" prop="endTimeStatus">
          <el-radio v-model="info.endTimeStatus" name="info_endTimeStatus" label="1">{{ $t('permanent_validity') }}</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <template v-if="isAdd || isEdit">
          <el-button name="handleCloseDialog" @click="handleCloseDialog">
            {{ $t('return') }}
          </el-button>
          <ody-button name="handleSubmit" type="primary" @click="handleSubmit">
            {{ $t('preservation') }}
          </ody-button>
        </template>
        <template v-else>
          <el-button name="handleCloseDialog5" type="primary" @click="handleCloseDialog">
            {{ $t('确定') }}
          </el-button>
        </template>

      </div>
    </ody-dialog-full-right>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    memberShipInfo: {
      type: Object,
      default: () => {}
    },
    status: {
      type: Number,
      default: null
    },
    callback: {
      type: Function,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      info: {
        memberType: null,
        levelName: null,
        iconUrl: null,
        balence: 0,
        gradeStatus: '2',
        endTimeStatus: '1'
      },
      memberTypeList: [],
      rules: {
        memberType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        levelName: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        iconUrl: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        gradeStatus: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        balence: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        endTimeStatus: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    isView() {
      return this.status === 2
    },
    isEdit() {
      return this.status === 1
    },
    isAdd() {
      return this.status === 0
    }
  },
  methods: {
    handleOpen() {
      this.init()
    },
    initMemberTypeList() {
      const vue = this
      const memberService = this.$ouserCenter.$api.memberService
      memberService.queryMemberTypeList({}).then((res) => {
        vue.memberTypeList = res.data.listObj
      })
    },
    init() {
      this.initMemberTypeList()
      this.info = Object.assign(this.info, this.memberShipInfo)
    },
    async handleSubmit() {
      const [err] = await this.formValidate('form')
      if (err) {
        return
      }

      let promise = this.$ouserCenter.$api.memberService.addMemberShipInfo
      if (this.info.id) {
        promise = this.$ouserCenter.$api.memberService.updateMemberShipInfo
      }

      const result = await promise(this.info)

      if (result.code === '0') {
        this.$message({
          type: 'success',
          message: this.$t('save_success')
        })
        this.handleCloseDialog()
        if (this.callback) {
          this.callback()
        }
      }
    },
    handleCloseDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
