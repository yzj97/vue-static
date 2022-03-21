<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('排序规则名称:')" prop="rankGroupName">
            <el-input v-model="searchForm.rankGroupName" name="searchForm_rankGroupName"/>
          </ody-search-item>
          <ody-search-item :label="$t('渠道:')" prop="channelCode">
            <el-select v-model="searchForm.channelCode" :placeholder="$t('全部')" name="searchForm_channelCode">
              <el-option
                v-for="item in channelList"
                :key="item.channelCode"
                :label="item.channelName"
                :value="item.channelCode" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('状态:')" prop="isAvailable">
            <el-select v-model="searchForm.isAvailable" :placeholder="$t('全部')" name="searchForm_isAvailable">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="SocialSortRule_01_handleSearchQuery" code="SocialSortRule_01" size="small" type="primary" @click="handleSearchQuery">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="SocialSortRule_02_handleAddRule" code="SocialSortRule_02" size="small" type="primary" @click="handleAddRule">{{ $t('新增规则') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :operates="operates"
          :can-filter="false"
          name="data504"/>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />

      </div>
    </ody-list-table-area>
  </div>
</template>

<script>

const searchForm = {
  rankGroupName: '',
  channelCode: '',
  isAvailable: ''
}
export default {
  name: 'SocialSortRule',
  data() {
    const self = this
    return {
      searchForm: {
        ...searchForm
      },
      channelList: [],
      statusList: [
        {
          value: 0,
          label: this.$t('停用')
        },
        {
          value: 1,
          label: this.$t('启用')
        }
      ],
      loading: false,
      data: [],
      columns: [
        {
          show: true,
          prop: 'rankGroupName',
          label: this.$t('排序规则名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'channelNameText',
          label: this.$t('渠道'),
          align: 'center'
        },
        {
          show: true,
          prop: 'isAvailable',
          label: this.$t('状态'),
          align: 'center',
          render: (h, params) => {
            const show = params.row.isAvailable === 1 ? this.$t('启用') : this.$t('停用')
            return (<span>{show}</span>)
          }
        }
      ],
      operates: {
        width: 140,
        align: 'center',
        list: [
          {
            label: this.$t('启用'),
            disabled: false,
            code: 'SocialSortRule_03',
            hidden(index, row) {
              return row.isAvailable === 1
            },
            method(index, row) {
              self.handleIsAvailable(row, 1)
            }
          },
          {
            label: this.$t('停用'),
            disabled: false,
            code: 'SocialSortRule_03',
            hidden(index, row) {
              return row.isAvailable === 0
            },
            method(index, row) {
              self.handleIsAvailable(row, 0)
            }
          },
          {
            label: this.$t('编辑'),
            disabled: false,
            code: 'SocialSortRule_04',
            method(index, row) {
              self.handleEdit(row)
            }
          }
        ]
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  mounted() {
    this.indexApi = this.$social.$api.indexApi
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      await this.initChannel()
      this.handleSearchQuery()
    },
    async initChannel() {
      const res = await this.indexApi.getChannelList({})
      if (res.code === '0') {
        this.channelList = res.data
      }
    },
    handleSearchQuery() {
      this.handleQuery()
    },
    async handleQuery() {
      const param = Object.assign({}, this.searchForm)
      param.pageSize = this.page.size
      param.pageNo = this.page.current
      this.loading = true
      try {
        const res = await this.indexApi.getRankGroupList(param)
        if (res && res.code === '0') {
          this.page.total = res.data.totalNum
          this.data = res.data.dataList
          this.data.forEach(item => {
            const channelList = item.channelList
            let channelNameText = ''
            channelList.forEach(channel => {
              channelNameText = channelNameText + ',' + channel.channelName
            })
            channelNameText = channelNameText.slice(1, channelNameText.length)
            item.channelNameText = channelNameText
          })
        }
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    handleReset() {
      this.searchForm = {
        ...searchForm
      }
    },
    handleIsAvailable(row, type) {
      const param = {
        id: row.id
      }
      let text = ''
      if (type === 1) {
        text = row.rankGroupName + ' ' + this.$t('启用成功') + '!'
      } else {
        text = row.rankGroupName + ' ' + this.$t('停用成功') + '!'
      }
      this.indexApi.changeGroupStatus(param).then(res => {
        if (res.code === '0') {
          this.$message.success(text)
        }
        this.handleQuery()
      }).catch(res => {
        this.$message.error(res.data)
      })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/social-back-web/sort-rule-config',
        query: {
          id: row.id
        }
      })
    },
    handleAddRule() {
      this.$router.push({
        path: '/social-back-web/sort-rule-config',
        query: {
          id: null
        }
      })
    },
    handlePageSizeChange() {
      this.handleQuery()
    },
    handlePageCurrentChange() {
      this.handleQuery()
    }
  }
}
</script>

<style scoped>

</style>
