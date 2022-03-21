<template>
  <div class="pg-crm-test-gift-card-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">

          <ody-search-item :space="1" :label="$t('卡对应的商品code，不是提货卡可提货的商品code')" prop="cardMpCode">
            <el-input
              v-model="search.cardMpCode"
              :placeholder="$t('请输入卡对应的商品code，不是提货卡可提货的商品code')"
              name="search_cardMpCode"

              type="text"
            />
          </ody-search-item>

          <ody-search-item :space="1" :label="$t('卡号')" prop="cardCode">
            <el-input
              v-model="search.cardCode"
              :placeholder="$t('请输入卡号')"
              name="search_cardCode"

              type="text"
            />
          </ody-search-item>

          <ody-search-item :space="1" :label="$t('实体卡卡密')" prop="cardPwd">
            <el-input
              v-model="search.cardPwd"
              :placeholder="$t('请输入实体卡卡密')"
              name="search_cardPwd"

              type="text"
            />
          </ody-search-item>

          <ody-search-item :space="1" :label="$t('电子/实体提货卡提货商品编码')" prop="giftMpCode">
            <el-input
              v-model="search.giftMpCode"
              :placeholder="$t('请输入电子/实体提货卡提货商品编码')"
              name="search_giftMpCode"

              type="text"
            />
          </ody-search-item>

          <ody-search-item :space="2" :label="$t('礼品卡有效期，为null表示永久有效')" prop="expiredTime">
            <ody-date-range-picker
              v-model="search.expiredTime"
              :placeholder="$t('请选择礼品卡有效期，为null表示永久有效')"
              name="search_expiredTime"
            />
          </ody-search-item>

          <ody-search-item :space="2" :label="$t('绑卡时间,转赠后会更新此时间。未绑定时为null')" prop="bindTime">
            <ody-date-range-picker
              v-model="search.bindTime"
              :placeholder="$t('请选择绑卡时间,转赠后会更新此时间。未绑定时为null')"
              name="search_bindTime"
            />
          </ody-search-item>

          <ody-search-item :space="1" :label="$t('持卡人手机')" prop="bindUserMobile">
            <el-input
              v-model="search.bindUserMobile"
              :placeholder="$t('请输入持卡人手机')"
              name="search_bindUserMobile"

              type="text"
            />
          </ody-search-item>

          <ody-search-item :space="2" :label="$t('创建时间')" prop="createTime">
            <ody-date-range-picker
              v-model="search.createTime"
              :placeholder="$t('请选择创建时间')"
              name="search_createTime"
            />
          </ody-search-item>

        </el-form>
      </div>
      <div slot="btn">
        <ody-button
          name="ui_handleSearchReset"
          code="ui"
          size="small"
          @click="handleSearchReset"
        >
          {{ $t('重置') }}
        </ody-button>
        <ody-button
          name="TestGiftCard_listPage"
          code="TestGiftCard_listPage"
          size="small"
          type="primary"
          @click.prevent="handleSearchSubmit"
        >
          {{ $t('查询') }}
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">

        <ody-button
          name="TestGiftCard_add_handleCreate"
          code="TestGiftCard_add"
          size="small"
          type="primary"
          @click="handleCreate"
        >
          新建
        </ody-button>

        <ody-batch-import-button
          :download-api="importModel.downloadApi"
          :import-api="importModel.importApi"
          :import-label="importModel.importLabel"
          name="TestGiftCard_importData_handleImport"
          code="TestGiftCard_importData"
          size="small"
          type="default"
          @click="handleImport"
        >
          批量导入
        </ody-batch-import-button>

        <ody-button
          name="TestGiftCard_exportData_handleExport"
          code="TestGiftCard_exportData"
          size="small"
          type="default"
          @click="handleExport"
        >
          导出
        </ody-button>

        <ody-button
          name="TestGiftCard_delete_handleDelete"
          code="TestGiftCard_delete"
          size="small"
          type="danger"
          @click="handleDelete"
        >
          批量删除
        </ody-button>

      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :checked.sync="table.checked"
          :multiple="true"
          request-url="/crm-web/testGiftCard/listPage"
          request-page-type="page"
        >

          <template slot="cardMpCode" slot-scope="scope">

            <el-link name="handleRowDetail" type="primary" disabled="!$portal.hasPermission('')" @click="handleRowDetail(scope.row)">
              {{ scope.row.cardMpCode }}
            </el-link>

          </template>

          <template slot="cardCode" slot-scope="scope">

            {{ scope.row.cardCode }}

          </template>

          <template slot="cardPwd" slot-scope="scope">

            {{ scope.row.cardPwd }}

          </template>

          <template slot="giftMpCode" slot-scope="scope">

            {{ scope.row.giftMpCode }}

          </template>

          <template slot="expiredTime" slot-scope="scope">

            {{ scope.row.expiredTime | parseTime }}

          </template>

          <template slot="bindTime" slot-scope="scope">

            {{ scope.row.bindTime | parseTime }}

          </template>

          <template slot="bindUserMobile" slot-scope="scope">

            {{ scope.row.bindUserMobile }}

          </template>

          <template slot="createTime" slot-scope="scope">

            {{ scope.row.createTime | parseTime }}

          </template>

        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: {

        cardMpCode: null,

        cardCode: null,

        cardPwd: null,

        giftMpCode: null,

        expiredTime: [],

        bindTime: [],

        bindUserMobile: null,

        createTime: []

      },
      table: {
        columns: [

          {
            label: '卡对应的商品code，不是提货卡可提货的商品code',
            slot: 'cardMpCode',
            show: true,
            minWidth: 120
          },

          {
            label: '卡号',
            slot: 'cardCode',
            show: true,
            minWidth: 120
          },

          {
            label: '实体卡卡密',
            slot: 'cardPwd',
            show: true,
            minWidth: 120
          },

          {
            label: '电子/实体提货卡提货商品编码',
            slot: 'giftMpCode',
            show: true,
            minWidth: 120
          },

          {
            label: '礼品卡有效期，为null表示永久有效',
            slot: 'expiredTime',
            show: true,
            minWidth: 120
          },

          {
            label: '绑卡时间,转赠后会更新此时间。未绑定时为null',
            slot: 'bindTime',
            show: true,
            minWidth: 120
          },

          {
            label: '持卡人手机',
            slot: 'bindUserMobile',
            show: true,
            minWidth: 120
          },

          {
            label: '创建时间',
            slot: 'createTime',
            show: true,
            minWidth: 120
          }

        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              code: 'TestGiftCard_update',
              method: (index, row) => {
                this.handleRowEdit(row)
              }
            },
            {
              label: this.$t('删除'),
              code: 'TestGiftCard_delete',
              method: (index, row) => {
                this.handleRowDelete(row)
              }
            }
          ]
        },
        checked: []
      },
      importModel: {
        visible: false,
        downloadApi: ['crm', 'testGiftCard', 'download', {}],
        importApi: ['crm', 'testGiftCard', 'importData', {}],
        importLabel: this.$t('导入')
      }
    }
  },
  computed: {
  },
  async mounted() {
    await this.init()
  },
  methods: {
    // 初始化
    init() {
      const params = this.$portal.deepClone(this.search)

      params.startExpiredTime = params.expiredTime[0]

      params.endExpiredTime = params.expiredTime[1]

      delete params.expiredTime

      params.startBindTime = params.bindTime[0]

      params.endBindTime = params.bindTime[1]

      delete params.bindTime

      params.startCreateTime = params.createTime[0]

      params.endCreateTime = params.createTime[1]

      delete params.createTime

      console.log('search-params', this.formHasValue(params))
      // 有值才传递
      return this.$refs.table.getList({
        filters: this.formHasValue(params)
      })
    },
    // search重置
    handleSearchReset() {
      this.formReset('search')
    },
    // 查询
    async handleSearchSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.init()
    },
    // 创建
    handleCreate(row) {
      this.$router.push({
        name: 'CrmTestGiftCardCreate'
      })
    },
    // 查看
    handleRowDetail(row) {
      this.$router.push({
        name: 'CrmTestGiftCardDetail',
        params: {
          id: row['id']
        }
      })
    },
    // 编辑
    handleRowEdit(row) {
      this.$router.push({
        name: 'CrmTestGiftCardEdit',
        params: {
          id: row['id']
        }
      })
    },
    async deleteByIdList(idList) {
      if (!(idList && idList.length)) {
        this.$message({
          message: this.$t('请选择内容'),
          type: 'error'
        })
        return false
      }

      const res = await this.$confirm(this.$t('确定删除吗?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })

      if (!res) {
        return
      }
      try {
        await this.$crm.$api.testGiftCard.delete(idList)
        this.$message({
          message: this.$t('删除成功'),
          type: 'success'
        })
        await this.init()
      } catch (ex) {
        console.error(ex)
      }
    },
    // 删除
    async handleRowDelete(row) {
      await this.deleteByIdList([row['id']])
    },
    // 导出
    async handleExport() {
      const params = this.$portal.deepClone(this.search)

      params.startExpiredTime = params.expiredTime[0]

      params.endExpiredTime = params.expiredTime[1]

      delete params.expiredTime

      params.startBindTime = params.bindTime[0]

      params.endBindTime = params.bindTime[1]

      delete params.bindTime

      console.log('export-params', params)

      try {
        await this.$portal.downloadFileByPost(
          '/api//crm-web/testGiftCard/exportData',
          params,
          null,
          'ajax'
        )
        this.$message({
          message: this.$t('导出成功'),
          type: 'success'
        })
      } catch (ex) {
        console.error(ex)
      }
    },
    async handleDelete() {
      const idList = this.table.checked.map(x => x['id'])
      await this.deleteByIdList(idList)
    }
  }
}
</script>
