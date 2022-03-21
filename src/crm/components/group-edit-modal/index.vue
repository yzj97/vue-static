<template>
  <div class="cp-group-edit">
    <ody-dialog-full-right
      :visible.sync="visible"
      :title="getTitle"
      @open="handleOpen"
      @opened="handleOpened"
      @close="handleCloseDialog"
    >
      <el-form ref="fromInline" :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
        <el-form-item :label="$t('分组名称')" prop="groupName">
          <el-input v-model="formInline.groupName" :placeholder="$t('请输入分组名称')" name="formInline_groupName" maxlength="20"/>
        </el-form-item>
        <el-form-item :label="$t('所属分类')" prop="userClassifyId">
          <crm-user-classify-select v-model="formInline.userClassifyId" :placeholder="$t('请选择分类')" name="formInline_userClassifyId" />
        </el-form-item>
      </el-form>
      <crm-group-condition v-if="isAnimated" ref="groupCondition" v-model="formInline.conditionValue" name="formInline_conditionValue"/>
      <div slot="footer">
        <el-button name="handleCloseDialog" @click="handleCloseDialog">{{ $t('取消') }}</el-button>
        <ody-button v-if="statusType === 'add'" name="userGroupAdd_handleSubmit" code="userGroupAdd" type="primary" @click="handleSubmit">{{ $t('确定') }}</ody-button>
        <ody-button v-if="statusType === 'edit'" name="userGroupUpdate_handleSubmit" code="userGroupUpdate" type="primary" @click="handleSubmit">{{ $t('确定') }}</ody-button>
      </div>
    </ody-dialog-full-right>
  </div>
</template>

<script>
import CrmGroupCondition from '@/components/group-condition'
import CrmUserClassifySelect from '@/components/user-classify-select'

export default {
  components: {
    CrmGroupCondition,
    CrmUserClassifySelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    statusType: {
      type: String,
      default: 'add' // edit view
    },
    id: {
      type: Number,
      default: -1 // edit view
    }
  },
  data() {
    return {
      isAnimated: false,
      isLoaded: false,
      rules: {
        groupName: [
          { required: true, message: this.$t('请输入分组名称'), trigger: 'blur' }
        ],
        userClassifyId: [
          { required: true, message: this.$t('请选择所属分类'), trigger: 'blur' }
        ]
      },
      defaultFormInline: {
        groupName: null,
        userClassifyId: null,
        conditionValue: {
          action: 'must', // 子的length >1 显示线条 + 文字, 其他不显示
          children: [
            {
              action: 'must', // 子的length == 1 && parentChidren.length > 1 显示 线条， 子的length > 1 显示线条 + 文字
              children: [
                {
                  action: 'must', // 子的length == 1 显示线条， >1 显示 线条 + 文字
                  children: [

                  ]
                }
              ]
            }
          ]
        }
      },
      formInline: {}
    }
  },
  computed: {
    getTitle() {
      if (this.statusType === 'add') {
        return this.$t('新建分组')
      }
      if (this.statusType === 'edit') {
        return this.$t('编辑分组')
      } else {
        return this.$t('查看分组')
      }
    }
  },
  async mounted() {
  },
  methods: {
    initGroupCondition() {
      if (this.isAnimated && this.isLoaded) {
        this.$nextTick(() => {
          this.$refs.groupCondition.init()
        })
      }
    },
    handleOpened() {
      // console.log('handleOpened', new Date() * 1)
      this.isAnimated = true
      this.initGroupCondition()
    },
    async handleOpen() {
      // console.log('hanleOpen', new Date() * 1)
      if (['edit', 'view'].includes(this.statusType)) {
        const { data: { conditionValue, ...formInline }} = await this.$portal.get(`/crm-web/userGroup/get/${this.id}`)

        formInline.conditionValue = JSON.parse(conditionValue)

        this.formInline = formInline
      } else {
        this.formInline = this.$portal.deepClone(this.defaultFormInline)
      }
      this.isLoaded = true
      this.initGroupCondition()
    },
    conditionFormValidate() {
      return new Promise((resolve) => {
        this.$refs.groupCondition.$refs.conditionForm.validate(valid => {
          if (valid) {
            resolve([null, valid])
          } else {
            resolve([true])
          }
        })
      })
    },
    async handleSubmit() {
      const [err] = await this.formValidate('fromInline')
      const [innerError] = await this.conditionFormValidate()

      if (err || innerError) {
        return
      }

      const params = JSON.parse(JSON.stringify(this.formInline))

      // 检测条件至少有一个

      const hasChildren = params.conditionValue.children.some(p2 => {
        return p2.children.every(p3 => {
          return p3.children.length > 0
        })
      })

      if (!hasChildren) {
        this.$message.error(this.$t('条件框必须设置条件'))
        return false
      }

      params.conditionValue.children.forEach(p2 => {
        p2.children.forEach(p3 => {
          p3.children.forEach(p4 => {
            if (p4.selected) {
              if (p4.type === 'province-city-region-select') {
                p4.names = p4.selected.filter(x => x).map(x => x.name)
              }
              delete p4.selected
            }
          })
        })
      })

      params.conditionValue = JSON.stringify(params.conditionValue)

      try {
        if (this.statusType === 'add') {
          await this.$crm.$api.userGroup.add(params)
          this.$message({
            message: this.$t('添加成功'),
            type: 'success'
          })
        } else if (this.statusType === 'edit') {
          await this.$crm.$api.userGroup.update(params)
          this.$message({
            message: this.$t('编辑成功'),
            type: 'success'
          })
        }
        // 关闭弹窗
        this.$emit('ok')
        this.handleCloseDialog()
      } catch (ex) {
        console.error(ex)
      }

      // console.log(this.formInline)
    },
    handleCloseDialog() {
      this.isAnimated = false
      this.isLoaded = false
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-group-edit {
  position: relative;
  .demo-form-inline {
    padding: 0 18px;
  }
}
</style>
