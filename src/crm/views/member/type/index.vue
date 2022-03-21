<template>
  <div>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-page-type="page"
          request-url="/crm-web/api/memberType/listMemberTypePage.do"
        >
          <template slot="name" slot-scope="scope">
            <ody-button
              name="OuserCenterMemberTypeSee_handleShowMemberType"
              code="OuserCenterMemberTypeSee"
              type="text"
              @click="handleShowMemberType(scope.row)"
            >{{ scope.row.name }}</ody-button>
          </template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <ody-dialog
      :title="$t('modifying_the_type_of_member')"
      :visible.sync="editDialog.show"
      width="600px"
      @open="initDialog"
    >
      <el-form
        ref="form"
        :model="editDialog.obj"
        :disabled="editDialog.obj.memberTypeId && !editDialog.edit"
        label-width="100px"
        class="form"
      >
        <el-form-item :label="$t('type_name')+':'" prop="name" required>
          <el-input
            v-model="editDialog.obj.name"
            :disabled="!!editDialog.obj.memberTypeId || !editDialog.edit"
            name="editDialog_obj_name"
            maxlength="9"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          :label="$t('type_description')+':'"
          :rules="[{ required: true, message: this.$t('请输入类型描述'), trigger: 'change' },{ min: 1, max: 100, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 100 ' + this.$t('个字符'), trigger: 'change' }]"
        >
          <el-input
            v-model="editDialog.obj.description"
            :placeholder="$t('textareaLimit', { min: 0, max: 100})"
            :rows="3"
            name="editDialog_obj_description"
            type="textarea"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <div v-if="syncWechatCard === true">
          <el-form-item :label="$t('同步微信')+':'">
            <el-checkbox v-model="editDialog.obj.asyncWechat" :disabled="editDialog.obj.hasWechat" name="editDialog_obj_asyncWechat" />
          </el-form-item>
          <div v-if="editDialog.obj.asyncWechat === true">
            <el-form-item
              :label="$t('会员卡标题')+':'"
              :rules="[{ required: true, message: this.$t('请输入会员卡标题'), trigger: 'change' },{ min: 1, max: 100, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 100 ' + this.$t('个字符'), trigger: 'change' }]"
              prop="wechatCardTitle"
            >
              <el-input v-model="editDialog.obj.wechatCardTitle" name="editDialog_obj_wechatCardTitle" maxlength="9" show-word-limit />
            </el-form-item>
            <el-form-item
              :label="$t('会员卡背景')+':'"
              :rules="[{ required: true, message: this.$t('请输入会员卡背景'), trigger: 'change' }]"
              prop="backgroundPicUrl"
            >
              <ody-upload-image
                v-model="editDialog.obj.backgroundPicUrl"
                :limit="1"
                :pic-type="['jpg','png']"
                :show-tip="true"
                name="editDialog_obj_backgroundPicUrl"
              />
            </el-form-item>
            <el-form-item
              :label="$t('特权说明')+':'"
              :rules="[{ required: true, message: this.$t('请输入特权说明'), trigger: 'change' },{ min: 1, max: 1024, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 100 ' + this.$t('个字符'), trigger: 'change' }]"
              prop="wechatPrerogative"
            >
              <el-input
                v-model="editDialog.obj.wechatPrerogative"
                :placeholder="$t('textareaLimit', { min: 0, max: 1024})"
                :rows="3"
                :disabled="!editDialog.edit"
                name="editDialog_obj_wechatPrerogative"
                type="textarea"
                maxlength="1024"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              :label="$t('使用须知')+':'"
              :rules="[{ required: true, message: this.$t('请输入使用须知'), trigger: 'change' },{ min: 1, max: 1024, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 100 ' + this.$t('个字符'), trigger: 'change' }]"
              prop="wechatDescription"
            >
              <el-input
                v-model="editDialog.obj.wechatDescription"
                :placeholder="$t('textareaLimit', { min: 0, max: 1024})"
                :rows="3"
                :disabled="!editDialog.edit"
                name="editDialog_obj_wechatDescription"
                type="textarea"
                maxlength="1024"
                show-word-limit
              />
            </el-form-item>
          </div>
          <el-form-item :label="$t('选择入口')+':'" required>
            <el-checkbox
              v-model="editDialog.obj.enabledShoppingMall"
              :disabled="editDialog.obj.hasWechat"
              name="editDialog_obj_enabledShoppingMall"
            >{{ $t('商城入口') }}</el-checkbox>
            <el-checkbox
              v-model="editDialog.obj.enabledUserCenter"
              :disabled="editDialog.obj.hasWechat"
              name="editDialog_obj_enabledUserCenter"
            >{{ $t('会员中心') }}</el-checkbox>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="line-top" />
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button
          v-if="editDialog.edit"
          :loading="editLoading"
          name="OuserCenterMemberTypeEdit_commitEditDialog"
          size="small"
          type="primary"
          code="OuserCenterMemberTypeEdit"
          @click="commitEditDialog"
        >{{ $t('确定') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  name: 'OuserCenterMemberType',
  data() {
    const self = this
    return {
      syncWechatCard: false,
      editLoading: false,
      editDialog: this.$portal.deepClone(editDialog),
      table: {
        columns: [
          {
            show: true,
            slot: 'name',
            label: self.$t('member_type'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'description',
            label: self.$t('describe'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'countLevel',
            label: self.$t('inclusion_level'),
            align: 'center',
            minWidth: 88
          },
          {
            show: true,
            prop: 'countUser',
            label: self.$t('number_of_members'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            slot: 'createTime',
            label: self.$t('creation_time'),
            align: 'center',
            minWidth: 200
          }
        ],
        operates: {
          width: 124,
          fixed: 'right',
          list: [
            {
              label: '编辑',
              method: (index, row) => {
                this.handleEdit(row)
              },
              code: 'OuserCenterMemberTypeEdit'
            }
          ]
        }
      }
    }
  },
  computed: {
    getPlatformMap() {
      return this.platformList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  async mounted() {
    await this.$crm.$api.switcherService
      .switcherBoolean({ key: 'syncWechatCard' })
      .then(res => {
        this.syncWechatCard = res.data
      })

    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('search')
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    query() {
      const { ...params } = this.search
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    handleShowMemberType(row) {
      this.editDialog.show = true
      this.handleWechatInfo(row)
      this.editDialog.edit = false
    },
    handleClose() {
      this.editDialog.show = false
    },
    initDialog() {},
    async commitEditDialog() {
      const [err] = await this.formValidate('form')

      if (err) {
        return
      }
      this.editLoading = true
      this.$crm.$api.crmService
        .updateMemberType(this.editDialog.obj)
        .then(res => {
          this.$message({
            type: 'success',
            message: this.$t('更新成功')
          })
          this.query()
          this.handleClose()
          setTimeout(() => {
            this.editLoading = false
          }, 500)
        })
    },
    handleEdit(row) {
      this.editDialog.show = true
      this.handleWechatInfo(row)
      this.editDialog.edit = true
    },
    handleWechatInfo(row) {
      const asyncWechat = row.wechatCardId !== undefined
      this.editDialog.obj = {
        memberTypeId: row.id,
        name: row.name,
        description: row.description,
        asyncWechat: asyncWechat,
        hasWechat: asyncWechat,
        enabledShoppingMall: false,
        enabledUserCenter: false,
        wechatCardTitle: null,
        wechatPrerogative: null,
        wechatDescription: null,
        backgroundPicUrl: null
      }
      if (asyncWechat) {
        this.editDialog.obj.wechatCardTitle =
          row.wechatCardJson.member_card.base_info.title
        this.editDialog.obj.wechatPrerogative =
          row.wechatCardJson.member_card.prerogative
        this.editDialog.obj.wechatDescription =
          row.wechatCardJson.member_card.base_info.description
        this.editDialog.obj.backgroundPicUrl = row.wechatCardBackgroundPicUrl
        this.editDialog.obj.enabledShoppingMall =
          row.wechatCardJson.member_card.custom_cell1 !== undefined
        this.editDialog.obj.enabledUserCenter =
          row.wechatCardJson.member_card.custom_cell2 !== undefined
      }
    }
  }
}
const obj = {
  memberTypeId: null,
  name: null,
  description: null,
  asyncWechat: null,
  hasWechat: null,
  wechatCardTitle: null,
  wechatPrerogative: null,
  wechatDescription: null,
  backgroundPicUrl: null,
  enabledShoppingMall: null,
  enabledUserCenter: null
}

const editDialog = {
  show: false,
  obj: obj,
  edit: false
}
</script>
