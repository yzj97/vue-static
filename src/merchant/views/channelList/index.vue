<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('渠道编码：')" prop="channelCode">
              <el-input id="searchChannelCode" v-model="searchForm.channelCode" :placeholder="$t('请输入渠道编码')" name="searchForm_channelCode"/>
            </ody-search-item>
            <ody-search-item :label="$t('渠道名称：')" prop="channelName">
              <el-input id="searchChannelName" v-model="searchForm.channelName" :placeholder="$t('请输入渠道名称')" name="searchForm_channelName"/>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button
            id="resetChannelSearch"
            name="initForm"
            size="small"
            @click="initForm"
          >{{ $t("重置") }}</el-button
          >
          <ody-button
            id="merchantChannelListQuery"
            name="MerchantChannelListQuery_search"
            code="MerchantChannelListQuery"
            size="small"
            type="primary"
            @click="search"
          >{{ $t("查询") }}</ody-button
          >
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            name="listTable_list397"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="search"
            @current-change="queryChannel"
          />
        </div>
      </ody-list-table-area>
    </section>
  </div>
</template>
<script>
import util from '@/utils/util'
import constants from '@/utils/constants'

export default {
  name: 'MerchantChannelList',
  data() {
    return {
      // 搜索框对象
      loading: false,
      searchForm: {},
      channelType: [],
      onOrOffLine: [],
      isAvailable: [],
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'channelCode',
            label: this.$t('渠道编码'),
            align: 'center'
          },
          {
            show: true,
            prop: 'channelName',
            label: this.$t('渠道名称'),
            align: 'center'
          },
          {
            show: true,
            prop: 'channelTypeStr',
            label: this.$t('渠道类型'),
            align: 'center'
          },
          {
            show: true,
            prop: 'channelMode',
            label: this.$t('渠道模式'),
            align: 'center'
          },
          {
            show: true,
            prop: 'onOrOffLineStr',
            label: this.$t('线上线下'),
            align: 'center'
          },
          {
            show: true,
            prop: 'channelStatusStr',
            label: this.$t('状态'),
            align: 'center'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initForm()
      this.channelType = constants.channelType
      this.onOrOffLine = constants.onOrOffLine
      this.channelStatus = constants.channelStatus
      try {
        await this.queryChannel()
      } catch (e) {
        console.log(e)
      }
    },
    async search() {
      this.searchForm.currentPage = 1
      await this.queryChannel()
    },
    async queryChannel() {
      const self = this
      const channelService = this.$merchant.$api.channelService
      try {
        this.loading = true
        const res = await channelService.queryChannelPage(this.searchForm)
        self.listTable.list = res.data.listObj
        self.listTable.total = res.data.total
        self.listTable.list.forEach(one => {
          one.channelTypeStr = util.getOnePropByKeyFromArr(
            self.channelType,
            parseInt(one.channelType)
          )
          one.onOrOffLineStr = util.getOnePropByKeyFromArr(
            self.onOrOffLine,
            parseInt(one.onOrOffLine)
          )
          one.channelStatusStr = util.getOnePropByKeyFromArr(
            self.channelStatus,
            parseInt(one.channelStatus)
          )
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 初始化搜索对象
    initForm() {
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10
      }
    }
  }
}
</script>
