<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" :model="searchForm" label-width="100px" class="form">
            <ody-search-item :label="$t('rank_type')" prop="memberType">
              <el-select v-model="searchForm.memberType" :placeholder="$t('全部')" name="searchForm_memberType">
                <el-option v-for="item in memberTypeList" :key="item.memberType" :value="item.memberType" :label="item.memberTypeName" />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('会员等级')" prop="levelName">
              <el-input v-model="searchForm.levelName" :placeholder="$t('请输入')" name="searchForm_levelName" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('reset') }}</el-button>
          <ody-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('query') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn">
          <el-button name="createGrade" size="small" type="primary" @click="createGrade">{{ $t('newly_added') }}</el-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :can-filter="false"
            :data="listTable.data"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_data409"
          >
            <template slot="levelName" slot-scope="scope">
              <el-button
                name="handleShowMember"
                type="text"
                @click="handleShowMember(scope.row)"
              >
                {{ scope.row.levelName }}
              </el-button>
            </template>
            <template slot="memberType" slot-scope="scope">
              {{ scope.row.memberType | keyVal(memberTypeMap) }}
            </template>
            <template slot="createTime" slot-scope="scope">
              {{ scope.row.createTime | parseTime }}
            </template>
          </ody-table>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.data"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"/>

        </div>
      </ody-list-table-area>
    </section>
    <ouser-center-grade-edit
      :member-ship-info="drawer.memberShipInfo"
      :status="drawer.statue"
      :visible.sync="drawer.visible"
      :callback="init"/>
  </div>
</template>
<script>
import OuserCenterGradeEdit from '@/components/grade-edit'

export default {
  name: 'OuserCenterMemberGrade',
  components: {
    OuserCenterGradeEdit
  },
  data() {
    const self = this
    return {
      loading: false,
      memberTypeList: [],
      memberTypeMap: {},
      listTable: {
        total: 0,
        data: [],
        columns: [
          // 操作	会员等级	会员类型	所需成长值	创建时间
          {
            show: true,
            slot: 'levelName',
            label: self.$t('membership_grade'),
            align: 'center',
            minWidth: 100
          },
          {
            show: true,
            slot: 'memberType',
            label: self.$t('member_type'),
            align: 'center',
            minWidth: 100
          },
          {
            show: true,
            prop: 'balence',
            label: self.$t('required_growth_value'),
            align: 'center',
            minWidth: 100
          },
          {
            show: true,
            slot: 'createTime',
            label: self.$t('create_time'),
            align: 'center',
            minWidth: '160'
          }
        ], // 需要展示的列
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: self.$t('edit'),
              disabled: false,
              method(index, row) {
                self.handleEdit(index, row)
              }
            }
          ]
        }
      },
      searchForm: {
        currentPage: 1,
        itemsPerPage: 10,
        memberType: null,
        levelName: null
      },
      drawer: {
        statue: 0,
        visible: false,
        memberShipInfo: {}
      }
    }
  },
  async mounted() {
    try {
      this.loading = true
      await this.init()
    } finally {
      this.loading = false
    }
  },
  methods: {
    handleShowMember(row) {
      // 跳转到查看页
      this.drawer.memberShipInfo = row
      this.drawer.statue = 2
      this.drawer.visible = true
    },
    // 编辑
    handleEdit(index, row) {
      // 跳转到编辑页
      this.drawer.memberShipInfo = row
      this.drawer.statue = 1
      this.drawer.visible = true
    },
    createGrade() {
      // 跳转到新增页
      this.drawer.memberShipInfo = {}
      this.drawer.statue = 0
      this.drawer.visible = true
    },

    async handleSearchSubmit() {
      this.searchForm.currentPage = 1
      await getList(this)
    },
    handleSearchReset() {
      this.formReset('form')
    },
    async handlePageSizeChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        this.loading = true
        await getList(this)
        this.loading = false
      } catch (ex) {
        console.log(ex)
      }
    },
    async initMemberTypeList() {
      const vue = this
      const memberService = this.$ouserCenter.$api.memberService
      const res = await memberService.queryMemberTypeList({})
      const data = res.data.listObj

      vue.memberTypeList = data
      vue.memberTypeMap = vue.memberTypeList.reduce((r, i) => {
        r[i.memberType] = i.memberTypeName
        return r
      }, {})
    },
    async init() {
      await this.initMemberTypeList()
      await getList(this)
    }
  }
}

async function getList(vue) {
  const memberService = vue.$ouserCenter.$api.memberService

  vue.loading = true
  try {
    const res = await memberService.queryMemberGradeList(vue.searchForm)
    const data = res.data.listObj
    vue.listTable.data = data
    vue.listTable.total = res.data.total
  } finally {
    vue.loading = false
  }
}

</script>

<style lang="scss" scoped>

</style>
