<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="chooseForm" :model="search" class="form">
          <ody-search-item :label="$t('手机号')" prop="mobile">
            <el-input v-model="search.mobile" name="search_mobile" />
          </ody-search-item>
          <ody-search-item :label="$t('账号')" prop="userName">
            <el-input v-model="search.userName" name="search_userName" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="ui_handleReset" code="ui" size="small" @click="handleReset">{{ $t('重置') }}</ody-button>
        <ody-button name="ui" code="ui" size="small" type="primary" @click.prevent="handleSubmit">
          {{ $t('查询') }}
        </ody-button>
        <ody-button name="ui2" code="ui" size="small" type="primary" @click.prevent="commit">
          {{ $t('确认') }}
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="table.checkedList"
          :multiple="true"
          :columns="table.columns"
          :selectable="checkedSelectable"
          :operates="table.operates"
          request-url="/ouser-web/employee/queryEmployeeForDepartment.do"
        />
      </div>
    </ody-list-table-area>
  </div>
</template>

<script>
export default {
  props: {
    nodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      search: {
        mobile: null,
        userName: null,
        name: '',
        platformId: '',
        createTime: []
      },
      table: {
        checkedList: [],
        columns: [
          {
            label: this.$t('姓名'),
            prop: 'identityCardName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('账号'),
            prop: 'userName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('手机号'),
            prop: 'mobile',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('邮箱'),
            prop: 'email',
            show: true,
            minWidth: 120
          }
        ]
      }
    }
  },
  async mounted() {
    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('chooseForm')
    },
    async handleSubmit() {
      const [err] = await this.formValidate('chooseForm')

      if (err) {
        return
      }
      await this.query()
    },
    query() {
      const {
        ...params
      } = this.search

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    commit() {
      if (this.table.checkedList.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请至少选择一个员工')
        })
        return
      }

      this.$emit('onChoose', this.table.checkedList)
    },
    checkedSelectable(row, index) {
      return !row.departmentIdStr
        .split(',')
        .some(x => x.toString() === this.nodeId.toString())
    }
  }
}
</script>

<style scoped>

</style>
