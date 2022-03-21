<template>
  <ody-dialog
    :title="$t('选择群组')"
    :visible.sync="visible"
    :before-close="handleBack"
    width="60%"
    @open="init">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="150px" class="form">
          <ody-search-item :label="$t('群名')" prop="groupName">
            <el-input v-model="search.groupName" :placeholder="$t('请输入群名')" name="search_groupName" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="GroupSendMessageListPage02_handleSubmit" code="GroupSendMessageListPage02" size="small" type="primary" @click="handleSubmit">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :multiple="true"
          :checked.sync="checked"
          :can-filter="false"
          request-url="/crm-web/wechatGroup/listPage"
          request-page-type="page"/>
      </div>
    </ody-list-table-area>
    <span slot="footer">
      <el-button name="handleBack" size="small" @click="handleBack">{{ $t('关闭') }}</el-button>
      <ody-button name="GroupSendMessageListPage01_handleSave" code="GroupSendMessageListPage01" size="small" type="primary" @click="handleSave">{{ $t('确定') }}</ody-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    wechatId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      search: {
        groupName: '',
        wechatId: ''
      },
      checked: [],
      table: {
        columns: [
          {
            show: true,
            prop: 'groupName',
            label: this.$t('群名'),
            align: 'center',
            minWidth: 140
          }
        ],
        operates: []
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // this.checked = []
      this.search.wechatId = this.wechatId
      setTimeout(() => {
        this.handleSubmit()
      }, 100)
    },
    handleReset() {
      this.formReset('search')
      this.search.wechatId = this.wechatId
    },
    async handleSubmit() {
      if (!this.$refs['search']) {
        return
      }
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    query() {
      // 有值才传递
      return this.$refs.table.getList({ filters: this.formHasValue(this.search) })
    },
    handleBack() {
      this.$emit('update:visible', !this.visible)
    },
    handleSave() {
      if (this.checked && this.checked.length > 0) {
        const res = this.$portal.deepClone(this.checked)
        this.$emit('ok', res)
        this.$emit('update:visible', !this.visible)
      } else {
        this.$message.info(this.$t('请选择群组'))
      }
    }
  }
}
</script>

<style scoped>

</style>
