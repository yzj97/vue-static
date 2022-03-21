<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form" @submit.native.prevent>
          <ody-search-item :label="$t('关键词:')" prop="extendMainTerm">
            <el-input v-model="search.extendMainTerm" :placeholder="$t('Enter后即可搜索')" name="search_extendMainTerm" @keyup.enter.native="handleQuery" />
          </ody-search-item>
          <ody-search-item :label="$t('扩展词:')" prop="term">
            <el-input v-model="search.term" :placeholder="$t('Enter后即可搜索')" name="search_term" @keyup.enter.native="handleQuery" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="SocialExtensionDictionary_01" code="SocialExtensionDictionary_01" size="small" type="primary" @click.prevent="handleQuery">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="SocialExtensionDictionary_02_handleAdd" code="SocialExtensionDictionary_02" size="small" type="primary" @click="handleAdd">{{ $t('新增') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="table.data"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          name="table_data880">
          <template slot-scope="scope" slot="index">
            <div>{{ scope.$index + 1 }}</div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="table.data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"/>
      </div>
    </ody-list-table-area>
    <extension-dictionary-edit-dialog :visible.sync="showExtensionDictionaryEditDialogVisible" :dict="editInfo" @ok="handleQuery" />
  </section>
</template>

<script>
import ExtensionDictionaryEditDialog from '@/components/extension-dictionary-edit-dialog'
import { mapGetters } from 'vuex'
export default {
  name: 'SocialExtensionDictionary',
  components: {
    ExtensionDictionaryEditDialog
  },
  data() {
    return {
      showExtensionDictionaryEditDialogVisible: false,
      editInfo: {},
      loading: false,
      search: {
        extendMainTerm: '',
        term: ''
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      table: {
        data: [],
        columns: [
          {
            label: this.$t('No.'),
            slot: 'index',
            show: true,
            align: 'center',
            minWidth: 88
          },
          {
            label: this.$t('关键词'),
            prop: 'keyTerm',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('扩展词'),
            prop: 'valuesTerm',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('修改时间'),
            prop: 'updatedTimeStr',
            align: 'center',
            show: true
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              code: 'SocialExtensionDictionary_03',
              method: (index, row) => {
                this.editInfo = row
                this.showExtensionDictionaryEditDialogVisible = true
              }
            },
            {
              label: this.$t('删除'),
              code: 'SocialExtensionDictionary_04',
              method: (index, row) => {
                this.handleDelete(row)
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'functions'
    ])
  },
  async mounted() {
    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('search')
    },
    async handleQuery() {
      await this.query()
    },
    async query() {
      const vue = this
      const param = {
        term: vue.search.term,
        extendMainTerm: vue.search.extendMainTerm,
        currentPage: vue.page.current,
        itemPerPage: vue.page.size
      }
      vue.loading = true
      try {
        const res = await vue.$social.$api.indexApi.getExtendDictList(param)
        res.data.map(item => {
          if (item.updatedTime) {
            item.updatedTimeStr = resolvingDate(item.updatedTime)
          }
        })
        vue.table.data = res.data
        vue.page.total = res.total
      } catch (e) {
        console.log(e)
      } finally {
        vue.loading = false
      }
    },
    handlePageSizeChange(size) {
      this.page.size = size
      this.handleQuery()
    },
    handlePageCurrentChange() {
      this.handleQuery()
    },
    handleAdd() {
      this.editInfo = {}
      this.showExtensionDictionaryEditDialogVisible = true
    },
    handleDelete(row) {
      const vue = this
      vue.$confirm(vue.$t('确认要删除吗?'), vue.$t('删除提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.indexApi.deleteExtendDict(row.id).then(res => {
          vue.$message.success(vue.$t('删除成功'))
          vue.query()
        })
      })
    }
  }
}
function resolvingDate(date) {
  const d = new Date(date)
  const month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
  const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
  const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  const sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
  const times = d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec
  return times
}
</script>

<style scoped>

</style>
