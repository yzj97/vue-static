<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('页面ID:')" prop="id">
            <el-input v-model="search.id" :placeholder="$t('请输入页面ID')" name="search_id" />
          </ody-search-item>
          <ody-search-item :label="$t('页面名称:')" prop="name">
            <el-input v-model="search.name" :placeholder="$t('请输入页面名称')" name="search_name" />
          </ody-search-item>
          <ody-search-item :label="$t('支持终端:')" prop="platform">
            <el-select v-model="search.platform" :placeholder="$t('全部')" name="search_platform">
              <el-option v-for="item in platformList" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('页面类型:')" prop="type">
            <el-select v-model="search.type" :placeholder="$t('全部')" name="search_type">
              <el-option v-for="item in typeList" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('发布状态:')" prop="status">
            <el-select v-model="search.status" :placeholder="$t('全部')" name="search_status">
              <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('渠道:')" prop="channel">
            <el-select v-model="search.channel" :placeholder="$t('全部')" name="search_channel">
              <el-option v-for="item in channelList" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('最后修改时间:')" :space="2" prop="updateTime">
            <!-- <el-date-picker v-model="search.updateTime" :start-placeholder="$t('开始时间')" :end-placeholder="$t('结束时间')" type="datetimerange" name="search_updateTime" /> -->
            <ody-date-range-picker
              :range-separator="$t('至')"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              v-model="search.updateTime"
              name="search_updateTime"
              type="datetimer"
            />
          </ody-search-item>
          <ody-search-item :label="$t('是否定时发布:')" prop="isTimingRelease">
            <el-select v-model="search.isTimingRelease" :placeholder="$t('全部')" name="search_isTimingRelease">
              <el-option v-for="item in isTimingReleaseList" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('页面语言:')" prop="lang">
            <el-select v-model="search.lang" :placeholder="$t('全部')" name="search_lang">
              <el-option v-for="item in langList" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="CmsPageList01" code="CmsPageList01" size="small" type="primary" @click.prevent="handleSubmit">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="CmsPageList02_handleAdd" code="CmsPageList02" size="small" type="primary" @click="handleAdd">{{ $t('新增') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          :response="convertResponse"
          :default-expand-all="false"
          :expand="true"
          request-page-type="page"
          request-url="/cms-web/cmsPage/listPage"
        >
          <template slot="startDate" slot-scope="scope">
            {{ scope.row.startDate | parseTime }}
          </template>
          <template slot="isTimingRelease" slot-scope="scope">
            {{ scope.row.isTimingRelease | keyVal(getIsTimingReleaseMap) }}
          </template>
          <template slot="expand" slot-scope="scope">
            <ody-table
              v-if="scope.row.type === 11"
              :data="scope.row.channelList"
              :columns="channelTable.columns1"
              :operates="channelTable.operates"
              :can-filter="false"
              name="scope_row_channelList293"
            >
              <template slot="handleView" slot-scope="scope">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                >
                  <div>
                    <ody-qrcode :value="'http:'+scope.row.previewUrl" class="qrcode">
                      <ody-button v-clipboard:copy="'http:' + scope.row.previewUrl" v-clipboard:success="clipboardSuccess" code="ui" type="text">
                        {{ $t('复制链接') }}
                      </ody-button>
                    </ody-qrcode>
                  </div>
                  <el-button slot="reference" type="text">{{ $t('查看') }}</el-button>
                </el-popover>
              </template>
            </ody-table>
            <ody-table
              v-else
              :data="scope.row.channelList"
              :columns="channelTable.columns2"
              :operates="channelTable.operates"
              :can-filter="false"
              name="scope_row_channelList293"
            >
              <template slot="handleView" slot-scope="scope">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                >
                  <div>
                    <ody-qrcode :value="'http:'+scope.row.previewUrl+'&preview=1'" class="qrcode">
                      <ody-button v-clipboard:copy="'http:' + scope.row.previewUrl+'&preview=1'" v-clipboard:success="clipboardSuccess" code="ui" type="text">
                        {{ $t('复制链接') }}
                      </ody-button>
                    </ody-qrcode>
                  </div>
                  <el-button slot="reference" type="text">{{ $t('查看') }}</el-button>
                </el-popover>
              </template>
            </ody-table>
          </template>

        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import Cookies from 'js-cookie'

export default {
  name: 'CmsPageList',
  data() {
    return {
      platformList: [],
      queryTypeList: [],
      typeList: [],
      statusList: [],
      channelList: [],
      isTimingReleaseList: [
        { code: '1', name: this.$t('是') },
        { code: '0', name: this.$t('否') }
      ],
      langList: [],
      search: {
        id: '',
        name: '',
        platform: '',
        type: '',
        status: '',
        channel: '',
        isTimingRelease: '',
        lang: '',
        updateTime: []
      },
      table: {
        columns: [
          {
            label: this.$t('页面ID'),
            prop: 'id',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('页面名称'),
            prop: 'name',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('页面类型'),
            prop: 'typeStr',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('终端'),
            prop: 'platformStr',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('页面语言'),
            prop: 'langStr',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('渠道'),
            prop: 'channelStr',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('页面生效时间'),
            slot: 'startDate',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('是否定时发布'),
            slot: 'isTimingRelease',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('上一次操作时间'),
            prop: 'updateTimeStr',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('发布状态'),
            prop: 'statusStr',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('创建人'),
            prop: 'createUsername',
            show: true,
            align: 'center'
          }
        ],
        operates: {
          width: 250,
          fixed: 'right',
          align: 'center',
          list: [
            {
              label: this.$t('编辑'),
              code: 'CmsPageList06',
              method: (index, row) => {
                this.handleEdit(index, row)
              }
            },
            {
              label: this.$t('删除'),
              code: 'CmsPageList07',
              hidden: (index, row) => {
                if (row.statusList && row.statusList.length > 0) {
                  return contains(row.statusList, 1)
                }
                return false
              },
              method: (index, row) => {
                this.handleDelete(row.id)
              }
            },
            {
              label: this.$t('发布'),
              code: 'CmsPageList09',
              hidden: (index, row) => {
                if (row.statusList && row.statusList.length > 0) {
                  return contains(row.statusList, 1)
                }
                return true
              },
              method: (index, row) => {
                this.handleRelease(row.id)
              }
            },
            {
              label: this.$t('复制'),
              code: 'CmsPageList04',
              method: (index, row) => {
                this.handleCopy(row.id)
              }
            },
            {
              label: this.$t('下架'),
              code: 'CmsPageList08',
              hidden: (index, row) => {
                if (row.statusList && row.statusList.length > 0) {
                  return !contains(row.statusList, 1)
                }
                return true
              },
              method: (index, row) => {
                this.handleOffShelf(row.id)
              }
            }
          ]
        }
      },
      channelTable: {
        columns1: [
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('店铺名称'),
            prop: 'shopName',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('渠道'),
            prop: 'channelName',
            show: true,
            align: 'center',
            minWidth: 180
          },
          {
            label: this.$t('发布状态'),
            prop: 'statusStr',
            show: true,
            align: 'center',
            minWidth: 120
          }
        ],
        columns2: [
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: false,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('店铺名称'),
            prop: 'shopName',
            show: false,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('渠道'),
            prop: 'channelName',
            show: true,
            align: 'center',
            minWidth: 180
          },
          {
            label: this.$t('发布状态'),
            prop: 'statusStr',
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
              // label: this.$t('查看'),
              slot: 'handleView',
              code: 'CmsPageList05'
            },
            {
              label: this.$t('发布'),
              code: 'CmsPageList09',
              hidden: (index, row) => {
                return row.status === 1
              },
              method: (index, row) => {
                this.handleRelease(row.pageId, row.id)
              }
            },
            {
              label: this.$t('下架'),
              code: 'CmsPageList08',
              hidden: (index, row) => {
                return row.status !== 1
              },
              method: (index, row) => {
                this.handleOffShelf(row.pageId, row.id)
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    getIsTimingReleaseMap() {
      return this.isTimingReleaseList.reduce((rtv, item) => {
        rtv[item.code] = item.name
        return rtv
      }, {})
    }
  },
  async mounted() {
    await this.init()
    await this.query()
  },
  methods: {
    async init() {
      await this.initCode()
      await this.initChannel()
    },
    async initCode() {
      const vue = this
      const res = await vue.$cms.$api.common.listMultiCode({
        categories: [
          'CMS_PAGE_TYPE',
          'CMS_PAGE_PLATFORM',
          'CMS_PAGE_LANG',
          'CMS_PAGE_CHANNEL_STATUS'
        ],
        pool: 'cms'
      })

      vue.platformList = res.data.CMS_PAGE_PLATFORM
      vue.filterType(res.data.CMS_PAGE_TYPE)
      vue.statusList = res.data.CMS_PAGE_CHANNEL_STATUS
      vue.langList = res.data.CMS_PAGE_LANG
    },
    async initChannel() {
      const vue = this
      const res = await vue.$cms.$api.common.listChannel({
        filters: {
          onOrOffLine: '1',
          channelType: '1',
          channelMode: [
            'O+O',
            'B2B',
            'BBC'
          ]
        }
      })

      vue.channelList = res.data
    },
    handleEdit(index, row) {
      const nameMap = {
        2: 'CmsH5Edit',
        1: 'CmsPcEdit'
      }
      this.$router.push({
        name: nameMap[row.platform],
        params: {
          templateId: row.templateId,
          type: row.type
        }
      })
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
    query() {
      const {
        updateTime: [startUpdateTime, endUpdateTime],
        ...params
      } = this.search

      params.startUpdateTime = startUpdateTime
      params.endUpdateTime = endUpdateTime
      params.typeList = this.queryTypeList

      // 有值才传递
      return this.$refs.table.getList({ filters: this.formHasValue(params) })
    },
    convertResponse(res) {
      if (res.data && res.data.length > 0) {
        res.data.map(item => {
          if (item.updateTime) {
            item.updateTimeStr = this.$portal.parseTime(item.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }
          if (item.channelList && item.channelList.length > 0) {
            let channelStr = ''
            let sameStatus = true
            const channelSet = new Set()
            const firstStatusStr = item.channelList[0].statusStr
            item.statusList = []
            item.statusStr = this.$t('待发布')
            item.channelList.map(c => {
              channelSet.add(c.channelName)
              if (c.statusStr !== firstStatusStr) {
                sameStatus = false
              }
              item.statusList.push(c.status)
            })
            channelSet.forEach(i => {
              channelStr = channelStr + ',' + i
            })
            item.channelStr = channelStr.substring(1)
            if (sameStatus) {
              item.statusStr = firstStatusStr
            }
          }
        })
      }
      return res
    },
    filterType(typeList) {
      if (Cookies.get('platformId') === '1') {
        typeList.map(item => {
          if (item.code !== '8') {
            this.typeList.push(item)
            this.queryTypeList.push(item.code)
          }
        })
      } else if (Cookies.get('platformId') === '2') {
        typeList.map(item => {
          if (item.code !== '8' && item.code !== '1') {
            this.typeList.push(item)
            this.queryTypeList.push(item.code)
          }
        })
      }
    },
    handleAdd() {
      this.$router.push({ name: 'CmsTemplateList' })
    },
    handleDelete(id) {
      const vue = this
      vue.$confirm(vue.$t('确认要删除吗?'), vue.$t('提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$cms.$api.cmsPage.deletePage([id]).then(res => {
          vue.$message.success(vue.$t('删除成功'))
          vue.query()
        })
      })
    },
    handleCopy(id) {
      const vue = this
      vue.$confirm(vue.$t('确认要复制吗?'), vue.$t('提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'info'
      }).then(() => {
        vue.$cms.$api.cmsPage.copyPage({ id: id }).then(res => {
          vue.$message.success(vue.$t('复制成功'))
          vue.query()
        })
      })
    },
    handleRelease(pageId, pageChannelId) {
      const vue = this
      vue.$confirm(vue.$t('确认要发布吗?'), vue.$t('提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'info'
      }).then(() => {
        vue.$cms.$api.cmsPage.releasePage({ id: pageId, pageChannelId: pageChannelId }).then(res => {
          vue.$message.success(vue.$t('发布成功'))
          vue.query()
        })
      })
    },
    handleOffShelf(pageId, pageChannelId) {
      const vue = this
      vue.$confirm(vue.$t('确认要下架吗?'), vue.$t('提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'info'
      }).then(() => {
        vue.$cms.$api.cmsPage.offShelfPage({ id: pageId, pageChannelId: pageChannelId }).then(res => {
          vue.$message.success(vue.$t('下架成功'))
          vue.query()
        })
      })
    }
  }
}

function contains(list, o) {
  for (const item of list) {
    if (item === o) {
      return true
    }
  }
  return false
}
</script>
<style lang="less" scoped>
  .qrcode {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
  }
</style>
