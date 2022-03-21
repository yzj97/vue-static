<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('话术类型')" prop="category">
            <el-select v-model="queryParam.category" :placeholder="$t('全部')" name="queryParam_category">
              <el-option
                v-for="(value, key) in categories"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button name="GuideTalkSkill_Query_search" code="GuideTalkSkill_Query" size="small" type="primary" @click="search">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="GuideTalkSkill_Add_toDetail" type="primary" code="GuideTalkSkill_Add" size="small" @click="toDetail(null, false)">{{ $t('新增') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="listTable.list"
          :columns="listTable.columns"
          :operates="listTable.operates"
          :can-filter="false"
          name="listTable_list111">
          <template slot="content" slot-scope="scope">
            <div v-html="scope.row.content"/>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <div class="block">
          <ody-pagination
            :current-page.sync="page.page"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.limit"
            :total.sync="page.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="search"
            @current-change="search"/>
        </div>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
import util from '@/utils/util'

export default {
  name: 'GuideTalkSkill',
  data() {
    return {
      loading: false,
      categories: {},
      page: {
        page: 1,
        limit: 10,
        total: 0
      },
      queryParam: this.initForm(),
      // 列表框对象
      listTable: {
        list: [],
        columns: [
          {
            'show': true,
            'prop': 'categoryName',
            'label': this.$t('话术类型'),
            'align': 'center',
            'minWidth': 70
          },
          {
            'show': true,
            'slot': 'content',
            'label': this.$t('话术内容'),
            'align': 'center',
            'minWidth': 60
          }
        ],
        operates: {
          'width': 200,
          'fixed': 'right',
          'list': [
            {
              label: this.$t('编辑'),
              show: true,
              method: (index, row) => {
                this.toDetail(row.id, false)
              },
              code: 'GuideTalkSkill_Edit'
            }, {
              label: this.$t('删除'),
              show: true,
              method: (index, row) => {
                util.confirm(this, this.$t('是否删除'), () => {
                  this.del(row)
                })
              },
              code: 'GuideTalkSkill_Delete'
            }
          ]
        }
      }

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    initForm() {
      return {
        type: 0,
        category: null
      }
    },
    async init() {
      const res = await this.$crm.$api.common.codeListMulti({ 'categories': ['GUIDE_TALK_SKILL'] })
      this.categories = res.data['GUIDE_TALK_SKILL']
      this.search()
    },
    search() {
      const queryArgs = Object.assign({
        filters: Object.assign({}, this.queryParam)
      }, this.page)
      this.loading = true
      return this.$crm.$api.guide.guideTalkSkill_listPage(queryArgs).then(res => {
        this.loading = false
        this.listTable.list = res.data
        this.page.total = res.total
      })
    },
    reset() {
      this.queryParam = this.initForm()
    },
    toDetail(id, readonly) {
      this.$router.push({
        name: id ? 'GuideTalkSkillEdit' : 'GuideTalkSkillAdd',
        meta: { title: '系统话术管理编辑' },
        params: {
          id: id,
          readonly: readonly
        }
      })
    },
    del(row) {
      this.$crm.$api.guide.guideTalkSkill_delete([row.id]).then(res => {
        this.$message.success(this.$t('操作成功'))
        this.search()
      })
    }
  }
}
</script>

