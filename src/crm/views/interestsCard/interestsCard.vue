<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <!-- 卡编号 -->
          <ody-search-item :label="$t('卡编号:')" prop="filters.no">
            <el-input v-model="searchForm.filters.no" :placeholder="$t('请输入卡编号')" name="searchForm_filters_no" />
          </ody-search-item>
          <!-- 卡名称 -->
          <ody-search-item :label="$t('卡名称:')" prop="filters.name">
            <el-input v-model="searchForm.filters.name" :placeholder="$t('请输入卡名称')" name="searchForm_filters_name" />
          </ody-search-item>
          <!-- 编辑人 -->
          <ody-search-item :label="$t('编辑人:')" prop="filters.createUsername">
            <el-input v-model="searchForm.filters.createUsername" :placeholder="$t('请输入编辑人')" name="searchForm_filters_createUsername" />
          </ody-search-item>
          <!-- 渠道 -->
          <ody-search-item :label="$t('渠道:')" prop="filters.channelCodes">
            <el-select v-model="searchForm.filters.channelCodes" :placeholder="$t('全部')" name="searchForm_filters_channelCodes">
              <el-option
                v-for="item in channelOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <!-- 达成条件 -->
          <ody-search-item :label="$t('达成条件:')" prop="filters.receiveType">
            <el-select v-model="searchForm.filters.receiveType" :placeholder="$t('全部')" name="searchForm_filters_receiveType">
              <el-option
                v-for="item in receiveTypeOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="CrmInterestsCardList_handlePageCurrentChange"
          code="CrmInterestsCardList"
          size="small"
          type="primary"
          @click="handlePageCurrentChange"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!--新增-->
        <ody-button
          name="CrmInterestsCardAdd_add"
          code="CrmInterestsCardAdd"
          size="small"
          type="primary"
          @click="add"
        >{{ $t('newly_added') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          name="list653"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
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

    <!--卡成员-->
    <ody-dialog :visible.sync="dialogTableVisible" :title="$t('卡成员')" width="700px">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="info" :model="info" label-width="130px" style="width:350px;">
            <ody-search-item :label="$t('手机号:')" style="width:350px;" prop="filters.mobile">
              <el-input
                v-model="searchRelForm.filters.mobile"
                :placeholder="$t('请输入手机号')"
                name="searchRelForm_filters_mobile"
                style="350px"
              />
            </ody-search-item>
          </el-form>
          <el-form ref="info" :model="info" label-width="130px" style="width:500px;">
            <ody-search-item :label="$t('绑卡时间:')" style="width:500px;" prop="relDates">
              <ody-date-range-picker
                v-model="relDates"
                :start-placeholder="$t('startDate')"
                :end-placeholder="$t('endDate')"
                :show-button="false"
                name="relDates"
                type="date"/>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="handleRelSearchReset" size="small" @click="handleRelSearchReset">{{ $t('common_reset') }}</el-button>
          <ody-button
            name="CrmInterestsCardMemberList_handleRelSearchSubmit"
            code="CrmInterestsCardMemberList"
            size="small"
            type="primary"
            @click="handleRelSearchSubmit"
          >{{ $t('common_select') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="relList"
            :columns="relationColumns"
            :can-filter="false"
            name="relList716"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="relPage.current"
            :list="relList"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="relPage.size"
            :total.sync="relPage.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleRelSearchSubmit"
            @current-change="handleRelPageCurrentChange"
          />
        </div>
      </ody-list-table-area>
    </ody-dialog>

    <!--发卡-->
    <ody-dialog :visible.sync="dialogReceiveVisible" :title="$t('发卡')" width="50%">
      <ody-dialog :visible.sync="innerVisible" :title="$t('二维码')" width="30%" append-to-body>
        <el-row type="flex" justify="center">
          <ody-qrcode
            :value="inputb2b"
            :text="$t('点击右键另存为图片')"
            style="margin-top:20px;"
            name="qrcode4"
          />
        </el-row>
      </ody-dialog>
      <ody-dialog :visible.sync="innerVisible2" :title="$t('二维码')" width="30%" append-to-body>
        <el-row type="flex" justify="center">
          <ody-qrcode
            :value="inputb2c"
            :text="$t('点击右键另存为图片')"
            style="margin-top:20px;"
            name="qrcode3"
          />
        </el-row>
      </ody-dialog>
      <ody-dialog :visible.sync="innerVisible3" :title="$t('二维码')" width="30%" append-to-body>
        <el-row type="flex" justify="center">
          <ody-qrcode
            :value="inputo2o"
            :text="$t('点击右键另存为图片')"
            style="margin-top:20px;"
            name="qrcode2"
          />
        </el-row>
      </ody-dialog>
      <el-row v-show="inputb2b" type="flex" justify="center">
        <el-col :span="12">
          <el-input id="ci1" :disabled="true" v-model="inputb2b" :placeholder="$t('请输入内容')" name="inputb2b">
            <template slot="prepend">B2B{{ $t('渠道') }}：</template>
          </el-input>
        </el-col>
        <el-col :span="6" style="padding-left:15px;">
          <ody-button
            v-clipboard:copy="inputb2b"
            v-clipboard:success="clipboardSuccess"
            code="CrmInterestsCardCopy"
            size="small"
            type="primary"
            class="width-auto"
          >{{ $t('复制') }}</ody-button>
          <ody-button
            name="CrmInterestsCardGetCode_showCourage"
            code="CrmInterestsCardGetCode"
            size="small"
            type="primary"
            class="width-auto"
            @click="showCourage(inputb2b,1)"
          >{{ this.$t('查看二维码') }}</ody-button>
        </el-col>
      </el-row>
      <br >
      <el-row v-show="inputb2c" type="flex" justify="center">
        <el-col :span="12">
          <el-input :disabled="true" v-model="inputb2c" :placeholder="$t('请输入内容')" name="inputb2c">
            <template slot="prepend">B2C{{ $t('渠道') }}：</template>
          </el-input>
        </el-col>
        <el-col :span="6" style="padding-left:15px;">
          <ody-button
            v-clipboard:copy="inputb2c"
            v-clipboard:success="clipboardSuccess"
            code="CrmInterestsCardCopy"
            size="small"
            type="primary"
            class="width-auto"
          >{{ $t('复制') }}</ody-button>
          <ody-button
            name="CrmInterestsCardGetCode_showCourage4"
            code="CrmInterestsCardGetCode"
            size="small"
            type="primary"
            class="width-auto"
            @click="showCourage(inputb2c,2)"
          >{{ this.$t('查看二维码') }}</ody-button>
        </el-col>
      </el-row>
      <br >
      <el-row v-show="inputo2o" type="flex" justify="center">
        <el-col :span="12">
          <el-input :disabled="true" v-model="inputo2o" :placeholder="$t('请输入内容')" name="inputo2o">
            <template slot="prepend">O2O{{ $t('渠道') }}：</template>
          </el-input>
        </el-col>
        <el-col :span="6" style="padding-left:15px;">
          <ody-button
            v-clipboard:copy="inputo2o"
            v-clipboard:success="clipboardSuccess"
            code="CrmInterestsCardCopy"
            size="small"
            type="primary"
            class="width-auto"
          >{{ $t('复制') }}</ody-button>
          <ody-button
            name="CrmInterestsCardGetCode_showCourage6"
            code="CrmInterestsCardGetCode"
            size="small"
            type="primary"
            class="width-auto"
            @click="showCourage(inputo2o,3)"
          >{{ this.$t('查看二维码') }}</ody-button>
        </el-col>
      </el-row>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'CrmInterestsCard',
  list: [],
  relList: [],
  components: {},
  data() {
    // const vue = this
    return {
      innerVisible: false,
      innerVisible2: false,
      innerVisible3: false,
      inputb2c: '',
      inputb2b: '',
      inputo2o: '',
      relDates: [],
      dialogTableVisible: false,
      dialogReceiveVisible: false,
      relationGroupId: null,
      searchRelForm: getDefaultSearchForm(),
      receiveTypeOptions: [
        { code: 1, name: '直接领取' },
        { code: 2, name: '付费购买' },
        { code: 3, name: '累计消费金额' },
        { code: 4, name: '累计总积分' }
      ],
      // { code: '110001', name: '欧电云自建BBC' }, { code: '110003', name: '欧电云自建O2O' }, { code: '110002', name: '欧电云自建B2B' }, { code: '120001', name: '欧电云自建POS' }
      channelOptions: [],
      relPage: {
        size: 10,
        current: 1,
        total: 0
      },
      relationColumns: [
        {
          show: true,
          prop: 'mobile',
          label: this.$t('手机号'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'memberTypeStr',
          label: this.$t('会员类型'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'bindTimeStr',
          label: this.$t('绑卡时间'),
          align: 'center',
          minWidth: 80
        }
      ],
      searchForm: getDefaultSearchForm(),
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'no',
          label: this.$t('卡编号'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('卡名称'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'receiveTypeStr',
          label: this.$t('达成条件'),
          align: 'center',
          minWidth: 124
          // formatter: (row, column, cellValue) => {
          //   var nameMap = this.receiveTypeOptions.reduce((m, i) => { m[i.code] = i.name; return m }, {})
          //   return nameMap[row.receiveType]
          // }
        },
        {
          show: true,
          prop: 'expirationTime',
          label: this.$t('有效期'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (!row.expirationTime) {
              return this.$t('永久有效')
            } else {
              var endDate = row.expirationTime // 得到毫秒数
              return endDate / 1000 / 60 / 60 / 24 + ' ' + this.$t('天')
            }
          }
        },
        {
          show: true,
          prop: 'channelCodesStr',
          label: this.$t('渠道'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'createTimeStr',
          label: this.$t('编辑时间'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.updateTime) {
              return this.$portal.parseTime(
                row.updateTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            } else {
              return row.createTimeStr
            }
          }
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('编辑人'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.updateUsername) {
              return row.updateUsername
            } else {
              return row.createUsername
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 300,
        align: 'center',
        list: [
          {
            label: this.$t('设置'),
            code: 'CrmInterestsCardSet',
            method: (index, row) => {
              this.$router.push({
                name: 'CrmInterestsCardDetail',
                params: {
                  id: row.id,
                  isEdit: 1
                }
              })
            }
          },
          {
            label: this.$t('查看'),
            code: 'CrmInterestsCardGet',
            method: (index, row) => {
              this.$router.push({
                name: 'CrmInterestsCardDetail',
                params: {
                  id: row.id,
                  isEdit: 0
                }
              })
            }
          },
          {
            label: this.$t('卡成员'),
            code: 'CrmInterestsCardMember',
            method: (index, row) => {
              this.relList = []
              this.dialogTableVisible = true
              this.relationGroupId = row.id
              this.handleRelSearchReset()
              this.listRel()
            }
          },
          {
            label: this.$t('发卡'),
            code: 'CrmInterestsCardSend',
            method: (index, row) => {
              this.showReceiverCard()
            }
          },
          {
            label: this.$t('删除'),
            code: 'CrmInterestsCardDelete',
            method: (index, row) => {
              this.$confirm(this.$t('确认删除吗'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.deleted(row)
              })
            }
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async showCourage(text, range) {
      await this.getSendCardUrl()
      if (range === 1) {
        this.innerVisible = true
      } else if (range === 2) {
        this.innerVisible2 = true
      } else if (range === 3) {
        this.innerVisible3 = true
      }
    },
    showReceiverCard() {
      this.dialogReceiveVisible = true
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleRelSearchSubmit() {
      try {
        this.relPage.current = 1
        await this.listRel()
      } catch (ex) {
        console.log(ex)
      }
    },
    add() {
      this.$router.push({
        name: 'CrmInterestsCardDetail',
        params: {
          id: 'x',
          isEdit: -1
        }
      })
    },
    async deleted(row) {
      await delObj(this, row.id)
      await this.updateList()
    },
    async listRel() {
      await queryRel(this)
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.handleSearchSubmit()
    },
    handleRelSearchReset() {
      this.relDates = []
      this.searchRelForm = getDefaultSearchForm()
      this.handleRelSearchSubmit()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    handleRelPageSizeChange() {
      this.handleRelSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleRelPageCurrentChange() {
      try {
        await this.queryRel()
        this.$forceUpdate()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        await loadList(this)
        this.$forceUpdate()
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    init() {
      this.loadCodes()
      this.updateList()
      this.getSendCardUrl()
    },
    loadCodes() {
      const common = this.$crm.$api.common
      var cateArr = ['SYS_CHANNEL']
      var param = { categorys: cateArr, pool: 'crm' }
      var vue = this
      common.codeListMulti(param).then(res => {
        for (const i in res.data['SYS_CHANNEL']) {
          vue.channelOptions.push({
            code: +i,
            name: res.data['SYS_CHANNEL'][i]
          })
        }
      })
    },
    async getSendCardUrl() {
      var interestsCard = this.$crm.$api.interestsCard
      var res = await interestsCard.getSendCardUrl()
      if (res) {
        const data = res.data
        var jsonobj = JSON.parse(data)
        if (jsonobj) {
          for (var i = 0; i < jsonobj.length; i++) {
            if (jsonobj[i].type === 'b2c') {
              this.inputb2c = jsonobj[i].url
            }
            if (jsonobj[i].type === 'b2b') {
              this.inputb2b = jsonobj[i].url
            }
            if (jsonobj[i].type === 'o2o') {
              this.inputo2o = jsonobj[i].url
            }
          }
          this.$forceUpdate()
        }
      }
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({
    page: 1,
    limit: 10,
    filters: { channelCodes: null, receiveType: null }
  })
}

// async function getSendCardUrl(vue) {
//   var interestsCard = vue.$crm.$api.interestsCard
//   var res = await interestsCard.getSendCardUrl()
//   if (res) {
//     const data = res.data
//     var jsonobj = JSON.parse(data)
//     if (jsonobj) {
//       for (var i = 0; i < jsonobj.length; i++) {
//         if (jsonobj[i].type === 'b2c') {
//           vue.inputb2c = jsonobj[i].url
//         }
//         if (jsonobj[i].type === 'b2b') {
//           vue.inputb2b = jsonobj[i].url
//         }
//         if (jsonobj[i].type === 'o2o') {
//           vue.inputo2o = jsonobj[i].url
//         }
//       }
//       vue.$forceUpdate()
//     }
//   }
// }

async function loadList(vue) {
  const interestsCard = vue.$crm.$api.interestsCard
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  vue.searchForm.filters.createTimeSort = 1
  if (vue.searchForm.filters.receiveType === '') {
    vue.searchForm.filters.receiveType = null
  }
  if (vue.searchForm.filters.channelCodes === '') {
    vue.searchForm.filters.channelCodes = null
  }
  const res = await interestsCard.getInterestsCardList(vue.searchForm)
  if (res) {
    const data = res.data
    vue.list = data
    vue.page.total = res.total
  }
}

async function queryRel(vue) {
  const userInterestsCard = vue.$crm.$api.userInterestsCard
  vue.searchRelForm.page = vue.relPage.current
  vue.searchRelForm.limit = vue.relPage.size
  vue.searchRelForm.filters.cardId = vue.relationGroupId
  if (vue.relDates && vue.relDates[0]) {
    vue.searchRelForm.filters.bindTimeStart = vue.relDates[0] + ' ' + '00:00:00'
  }
  if (vue.relDates && vue.relDates[1]) {
    vue.searchRelForm.filters.bindTimeEnd = vue.relDates[1] + ' ' + '23:59:59'
  }

  const res = await userInterestsCard.getUserInterestsCardList(
    vue.searchRelForm
  )
  if (res) {
    const data = res.data
    vue.relList = data
    vue.relPage.total = res.total
  }
}

async function delObj(vue, id) {
  const interestsCard = vue.$crm.$api.interestsCard
  const res = await interestsCard.deleteInterestsCard({ id: id })
  if (res) {
    return
  }
}
</script>

<style lang="less" scoped>
.cp-date-range-picker .data-time-name .el-button {
  line-height: 32px !important;
  height: 32px !important;
}
.info_class {
  font-size: 14px;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  color: #109fff;
  border: 1px solid #19a3ff;
  border-radius: 12px;
  margin-left: 10px;
  cursor: default;
}
</style>
