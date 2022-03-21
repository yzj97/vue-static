<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('直播名称')+ ':'" prop="liveName">
            <el-input v-model="queryParam.liveName" :placeholder="$t('请输入直播名称')" name="queryParam_liveName"/>
          </ody-search-item>
          <ody-search-item :label="$t('状态')+ ':'" prop="status">
            <el-select
              v-model="queryParam.status"
              :placeholder="$t('common_all')"
              name="queryParam_status"
            >
              <el-option
                v-for="item in liveStatusList"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('直播开始时间')" prop="startTime">
            <ody-date-range-picker
              v-model="startTime"
              :range-separator="$t('至')"
              :start-placeholder="$t('开始时间')"
              :end-placeholder="$t('结束时间')"
              name="startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimer"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button
          name="LiveListQuery_handleQuery"
          code="LiveListQuery"
          size="small"
          type="primary"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="LiveAdd_addLive"
          code="LiveAdd"
          size="small"
          type="primary"
          @click="addLive"
        >{{ $t('新增') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="onTabClick">
          <el-tab-pane v-for="(tab, index) in tabs" :label="tab.label" :key="index"/>
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :selectable="checkedSelectable"
          :can-filter="false"
          request-url="/social-back-web/live/listPage.do"
          request-page-type="page"
        >
          <template slot="liveUrl" slot-scope="scope">
            <div>
              <span>{{ scope.row.liveUrl }}</span>
            </div>
            <el-button v-clipboard:copy="scope.row.liveUrl" v-clipboard:success="clipboardSuccess" type="text">
              {{ $t('复制链接') }}
            </el-button>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'LiveListManage',
  components: {
  },
  data() {
    const self = this
    return {
      queryFlagList: [],
      startTime: [],
      liveStatusList: [],
      tabs: [],
      typeOfProductList: [],
      activeState: '0',
      queryParam: getDefaultQueryParam(),
      type: null,
      table: {
        columns: [
          {
            label: this.$t('直播封面图'),
            prop: 'productPicPath',
            show: true,
            align: 'left',
            render: (h, params) => {
              if (params.row.liveCoverUrl) {
                return (
                  <el-image fit='contain' style='height:50px' src={params.row.liveCoverUrl}></el-image>
                )
              } else {
                return
              }
            }
          },
          {
            show: true,
            prop: 'liveName',
            label: this.$t('直播名称'),
            align: 'left',
            minWidth: '150px'
          },
          {
            show: true,
            prop: 'statusName',
            label: this.$t('状态'),
            align: 'left',
            minWidth: '100px',
            formatter: (row, column) => {
              if (row.status) {
                return this.tabs[row.status].label
              }
              return ''
            }
          },
          {
            show: true,
            prop: 'subscribeCount',
            label: this.$t('订阅人数'),
            align: 'left',
            minWidth: '100px'
          },
          {
            show: true,
            slot: 'liveUrl',
            label: this.$t('直播详情页地址'),
            align: 'left'
          },
          {
            show: true,
            label: this.$t('直播开始时间'),
            align: 'center',
            minWidth: 140,
            formatter: (row, column) => {
              if (row.startTime) {
                return this.$portal.parseTime(row.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
              }
              return ''
            }
          }
        ],
        operates: {
          width: '300px',
          fixed: 'right',
          list: [
            {
              label: this.$t('查看'),
              code: 'LiveManageSee',
              disabled: false,
              method: (index, row) => {
                self.handleViewLive(row)
              }
            },
            {
              label: this.$t('编辑'),
              code: 'LiveEdit',
              disabled: false,
              hidden: (index, row) => {
                if (row.status === 1) {
                  return false
                } else {
                  return true
                }
              },
              method: (index, row) => {
                self.handleEditLive(row)
              }
            },
            {
              label: this.$t('置顶'),
              code: 'LiveTop',
              disabled: false,
              hidden: (index, row) => {
                return row.status === 4 || row.isTop === 1
              },
              method: (index, row) => {
                self.handleTop(row)
              }
            },
            {
              label: this.$t('取消置顶'),
              code: 'LiveTopCancel',
              disabled: false,
              hidden: (index, row) => {
                return row.isTop !== 1
              },
              method: (index, row) => {
                self.handleNotTop(row)
              }
            },
            {
              label: this.$t('删除'),
              code: 'LiveManageDelete',
              disabled: false,
              hidden: (index, row) => {
                if (row.status !== 2) {
                  return false
                } else {
                  return true
                }
              },
              method: (index, row) => {
                self.deleteLive(row)
              }
            },
            {
              label: this.$t('继续直播'),
              code: 'LiveContinue',
              disabled: false,
              hidden: (index, row) => {
                if (row.status === 3) {
                  return false
                } else {
                  return true
                }
              },
              method: (index, row) => {
                self.updateStatus(row, 2)
              }
            },
            {
              label: this.$t('直播取消'),
              code: 'LiveCancel',
              disabled: false,
              hidden: (index, row) => {
                if (row.status === 3) {
                  return false
                } else {
                  return true
                }
              },
              method: (index, row) => {
                self.updateStatus(row, 4)
              }
            },
            {
              label: this.$t('直播结束'),
              code: 'LiveEnd',
              disabled: false,
              hidden: (index, row) => {
                if (row.status === 2) {
                  return false
                } else {
                  return true
                }
              },
              method: (index, row) => {
                self.updateStatus(row, 3)
              }
            }
          ]
        }
      }
    }
  },
  async mounted() {
    try {
      this.tabs = [
        {
          label: this.$t('全部')
        }
      ]
      this.currentTab = this.tabs[0]
      await this.initCodes()
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    initCodes() {
      const vue = this
      vue.$social.$api.common
        .listMultiCode({
          categories: [
            'LIVE_STATUS'
          ]
        })
        .then(data => {
          if (data.code === '0') {
            vue.liveStatusList = data.data.LIVE_STATUS
            console.log(JSON.stringify(vue.liveStatusList))
            for (var i in vue.liveStatusList) {
              if (typeof vue.liveStatusList[i].name === 'string') {
                vue.tabs.push({
                  status: vue.liveStatusList[i].code,
                  label: vue.liveStatusList[i].name
                })
              }
            }
          }
        })
    },
    async handleQuery() {
      await this.queryList(2)
    },
    // 列表查询
    async queryList(flag) {
      if (this.queryParam.status && this.queryParam.status !== this.currentTab.status && flag === 2) {
        this.activeState = this.queryParam.status.toString()
        this.currentTab = this.tabs[this.queryParam.status]
      }
      if (this.queryParam.status === '' || this.queryParam.status === null) {
        this.activeState = '0'
        this.currentTab = this.tabs[0]
      }
      this.queryParam.status = this.currentTab.status
      if (this.startTime) {
        this.queryParam.startStartTime = this.startTime[0]
        this.queryParam.endStartTime = this.startTime[1]
      }
      return this.$refs.table.getList(
        {
          filters: this.formHasValue(this.queryParam, false)
        }
      )
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    },
    onTabClick() {
      for (var i = 0; i < this.tabs.length; i++) {
        if (i.toString() === this.activeState) {
          this.currentTab = this.tabs[i]
          break
        }
      }
      // debugger
      if (this.queryParam.status && this.queryParam.status !== this.currentTab.status) {
        // this.currentTab.status = this.queryParam.status
      }
      this.queryList()
    },
    // 重置
    reset() {
      this.queryParam = getDefaultQueryParam()
      this.startTime = []
    },
    updateStatus(row, status) {
      const vue = this
      var tipsMsg = ''
      if (status === 2) {
        tipsMsg = vue.$t('是否继续直播？')
      } else if (status === 3) {
        tipsMsg = vue.$t('是否结束直播？')
      } else {
        tipsMsg = vue.$t('是否取消直播？')
      }
      vue.$confirm(tipsMsg, vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.socialApi.changeLiveStatus({ id: row.id, status: status }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
      })
    },
    handleTop(val) {
      const vue = this
      vue.$confirm(vue.$t('确定置顶？'), vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.socialApi.changeLiveTop({ id: val.id, isTop: 1 }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
      })
    },
    handleNotTop(val) {
      const vue = this
      vue.$confirm(vue.$t('确定取消置顶？'), vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.socialApi.changeLiveTop({ id: val.id, isTop: 0 }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
      })
    },
    deleteLive(val) {
      const vue = this
      vue.$confirm(vue.$t('确定删除？'), vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.socialApi.deleteLive({ id: val.id }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
      })
    },
    addLive() {
      this.$router.push({
        path: '/social-back-web/live-manage/live-mange-config',
        query: {
          id: null,
          isView: false
        }
      })
    },
    handleEditLive(row) {
      this.$router.push({
        path: '/social-back-web/live-manage/live-mange-config-edit',
        query: {
          id: row.id,
          isView: false
        }
      })
    },
    handleViewLive(row) {
      this.$router.push({
        path: '/social-back-web/live-manage/live-mange-config-see',
        query: {
          id: row.id,
          isView: true
        }
      })
    }
  }
}

function getDefaultQueryParam() {
  return Object.assign(
    {},
    {
      liveName: null,
      status: null
    }
  )
}
</script>

<style lang="scss" scoped>
.table-product-label {
  display: inline-block;
  background: #ef5351;
  line-height: 18px;
  font-size: 12px;
  padding: 0 2px;
  color: #ffffff;
}
.image-container {
  float: left;
}
.name-container {
  margin-left: 100px;
  position: relative;
  height: 100px;
  padding: 5px;
}
.link-name {
  word-wrap: break-word;
  width: 200px;
  height: 70px;
  overflow: hidden;
  word-break: break-all;
  white-space: pre-wrap;
}
.name-text {
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.table-code {
  .table-code-merchant-span {
    display: inline-block;
    background: #ef5351;
    line-height: 16px;
    color: #ffffff;
    font-size: 12px;
  }
  .table-code-good-span {
    display: inline-block;
    background: #fec104;
    line-height: 16px;
    color: #ffffff;
    font-size: 12px;
  }
  .table-code-red-span {
    background: #ff0000;
    color: #ffffff;
    font-size: 12px;
  }
  .table-warehouse-good-span {
  display: inline-block;
  background: #02C292;
  color: #ffffff;
  font-size: 12px;
  line-height: 16px;
 }
 .table-nowarehouse-good-span {
  display: inline-block;
  background: #1890ff;
  color: #ffffff;
  font-size: 12px;
  line-height: 16px;
 }
}
.popover-container {
  .popover-input {
    margin-bottom: 10px;
  }
}
.btn-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-button {
    margin-bottom: 4px;
  }
}
</style>
