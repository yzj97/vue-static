<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('会员更换等级')"
      width="600px"
      @open="init"
    >
      <el-form
        ref="memberSettingForm"
        :model="memberSettingForm"
        label-width="100px"
        label-position="left"
      >
        <el-form-item :label="$t('messageEdit.userSelected')" la>
          <span>{{ memberNum }} {{ $t('人') }}</span>
        </el-form-item>
        <el-form-item
          :label="$t('调整等级')"
          :rules="{
            required: true,
            message: this.$t('please_choose_the_type_of_membership'),
            trigger: 'change'
          }"
          prop="memberLevel"
        >
          <el-col :span="12">
            <span>{{ memberTypeName }}</span>
          </el-col>
          <el-col :span="12">
            <el-select v-model="memberSettingForm.memberLevel" name="memberSettingForm_memberLevel" style="width:120px;">
              <el-option
                v-for="i in memberLevelList"
                :label="i.levelName"
                :key="i.id"
                :value="i.id"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <div>
          <ody-title :title="$t('等级介绍')" />
          <el-table v-loading="loading" :data="memberLevelList" name="memberLevelList735" width="100%">
            <el-table-column :label="$t('等级编号')" prop="id" align="center" width="150" />
            <el-table-column :label="$t('rank_name')" prop="levelName" align="center" width="120" />
            <el-table-column
              :label="$t('rank_type')"
              prop="memberTypeStr"
              align="center"
              width="120"
            />
            <el-table-column
              :label="$t('required_growth_value')"
              prop="growthValue"
              align="center"
              width="120"
            />
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose()">{{ $t('common_back') }}</el-button>
        <ody-button
          name="OuserCenterMemberListMemberLevelSetting_submitForm"
          type="primary"
          code="OuserCenterMemberListMemberLevelSetting"
          @click="submitForm('memberSettingForm')"
        >{{ $t('submission_of_audit') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idList: {
      type: Array,
      default: null
    },
    memberTypeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      memberTypeName: null,
      memberLevelList: [],
      memberNum: null,
      memberSettingForm: {
        memberLevel: null,
        idList: null
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
    handleClose() {
      this.$refs['memberSettingForm'].resetFields()
      this.$emit('update:visible', !this.visible)
      this.memberLevelList = []
      this.memberTypeName = null
      this.memberNum = null
      this.$emit('ok', [])
    },
    submitForm(memberSettingForm) {
      this.$refs[memberSettingForm].validate(valid => {
        if (valid) {
          const memberSettinRequest = this.$ouserCenter.$api.crmService
          memberSettinRequest
            .adjustMemberLevel(this.memberSettingForm)
            .then(result => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$emit('ok', [])
                this.$refs[memberSettingForm].resetFields()
                this.$message({
                  type: 'success',
                  message: this.$t('common_update_success')
                })
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async init() {
      try {
        if (this.idList.length > 0) {
          this.memberNum = this.idList.length
          this.memberSettingForm.idList = this.idList
          if (this.memberTypeId) {
            const queryParam = {}
            queryParam.memberTypeId = this.memberTypeId
            this.$ouserCenter.$api.crmService
              .listMemberTypeInfo(queryParam)
              .then(resp => {
                if (resp.data) {
                  const memberLevelList = []
                  for (let i = 0; i < resp.data.length; i++) {
                    const data = resp.data[i]
                    this.memberTypeName = data.memberTypeName
                    for (let i = 0; i < data.memberLevelList.length; i++) {
                      const memberLevelObj = {}
                      memberLevelObj.id = data.memberLevelList[i].id
                      memberLevelObj.levelName =
                        data.memberLevelList[i].levelName
                      memberLevelObj.memberType =
                        data.memberLevelList[i].memberType
                      memberLevelObj.memberTypeStr =
                        data.memberLevelList[i].memberTypeStr
                      memberLevelObj.growthValue =
                        data.memberLevelList[i].growthValue
                      memberLevelList.push(memberLevelObj)
                    }
                  }
                  this.memberLevelList = memberLevelList
                  // this.memberSettingForm.memberLevel = this.memberLevelList[0].id
                }
              })
          }
        }
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
