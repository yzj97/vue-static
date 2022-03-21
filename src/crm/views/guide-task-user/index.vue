<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('账号')" prop="username">
            <el-input v-model="search.username" :placeholder="$t('请输入账号')" name="search_username"/>
          </ody-search-item>
          <ody-search-item :label="$t('姓名')" prop="identityCardName">
            <el-input v-model="search.identityCardName" :placeholder="$t('请输入姓名')" name="search_identityCardName"/>
          </ody-search-item>
          <ody-search-item :label="$t('任务类型')" prop="type">
            <el-select v-model="search.type" :placeholder="$t('全部')" name="search_type">
              <el-option
                v-for="(k,v) in typeList"
                :key="v"
                :label="k"
                :value="v"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="CrmGuideTaskUser01" code="CrmGuideTaskUser01" size="small" type="primary" @click.prevent="handleSubmit">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="CrmGuideTaskUser02_handleAdd" code="CrmGuideTaskUser02" size="small" type="primary" @click="handleAdd">{{ $t('新建任务') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          request-url="/crm-web/guideTaskUser/listPage"
          request-page-type="page">
          <template slot="completionRate" slot-scope="scope">
            {{ ((scope.row.finishNumber / scope.row.targetNumber) * 100).toFixed(2) + '%' }}
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <guide-task-user-assess-dialog :visible.sync="guideTaskUserAssessDialogVisible" :item="assessItem" @ok="query"/>
  </div>
</template>

<script>
import GuideTaskUserAssessDialog from '@/components/guide-task-user-assess-dialog'

export default {
  name: 'CrmGuideTaskUser',
  components: {
    GuideTaskUserAssessDialog
  },
  data() {
    return {
      typeList: [],
      guideTaskUserAssessDialogVisible: false,
      assessItem: { id: '', finishNumber: '' },
      search: {
        username: '',
        identityCardName: '',
        type: ''
      },
      table: {
        columns: [
          {
            label: this.$t('任务名称'),
            prop: 'name',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('任务类型'),
            prop: 'typeStr',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('姓名'),
            prop: 'identityCardName',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('任务指标'),
            prop: 'targetNumber',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('已完成指标'),
            prop: 'finishNumber',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('完成率'),
            slot: 'completionRate',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('任务内容'),
            prop: 'content',
            show: true,
            align: 'center',
            minWidth: 120
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          align: 'center',
          list: [
            {
              label: '考核',
              code: 'CrmGuideTaskUser03',
              method: (index, row) => {
                this.handleAssess(row)
              }
            }
          ]
        }
      }
    }
  },
  async mounted() {
    await this.initCode()
    await this.query()
  },
  methods: {
    async initCode() {
      const res = await this.$crm.$api.common.codeListMulti({ categories: ['GUIDE_TASK_TYPE'], pool: 'crm' })
      this.typeList = res.data.GUIDE_TASK_TYPE
    },
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
    handleTabsClick() {
      this.query()
    },
    query() {
      // 有值才传递
      return this.$refs.table.getList({ filters: this.formHasValue(this.search) })
    },
    handleAdd() {
      this.$router.push({ name: 'CrmGuideTaskUserAdd' })
    },
    handleAssess(item) {
      this.assessItem.id = item.id
      this.assessItem.finishNumber = item.finishNumber
      this.guideTaskUserAssessDialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
