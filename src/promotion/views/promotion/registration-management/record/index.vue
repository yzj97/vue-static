<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="queryContent" :model="queryContent" label-width="100px" class="form">
          <ody-search-item
            v-if="queryList.startTime && queryList.endTime"
            :label="$t('报名活动时间:')"
            prop="obj.merchantId">
            <span>{{ queryList.startTime | parseTime }} - {{ queryList.endTime | parseTime }}</span>
          </ody-search-item>
          <ody-search-item :label="$t('活动描述:')" prop="activityTitle">
            <span>{{ queryList.activityTitle }}</span>
          </ody-search-item>
          <ody-search-item :label="$t('商家ID')" prop="obj.merchantId">
            <ody-input-number
              v-model="queryContent.obj.merchantId"
              :max="9999999999999999"
              :empty-tip="false"
              :placeholder="$t('请输入商家ID')"
              name="queryContent_obj_merchantId"
              maxlength="16"
              style="width:100%"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('商家名称')" prop="obj.merchantName">
            <el-input v-model="queryContent.obj.merchantName" name="queryContent_obj_merchantName" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="button006" size="small" type="primary" code="button006" @click.prevent="handleSubmit">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="viewActivityRecordMp"
          size="mini"
          type="default"
          code="button007"
          @click="viewActivityRecordMp()"
        >{{ $t('操作') }}</ody-button>
        <ody-button
          name="handleDownloadFileByGet"
          size="mini"
          type="primary"
          code="button008"
          @click="handleDownloadFileByGet()"
        >{{ $t('导出全部商品') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :data="queryAttendRecordList"
          :checked.sync="checked"
          :multiple="true"
          :columns="table.columns"
          :operates="table.operates"
          name="queryAttendRecordList233"
          request-url="/back-promotion-web/applyActivityRead/queryAttendRecordList.do"
        >
          <template
            slot="platformId"
            slot-scope="scope"
          >{{ scope.row.platformId | keyVal(getPlatformMap) }}</template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import constants from '@/utils/constants'
export default {
  name: 'PromotionRegistrationRecord',
  data() {
    return {
      row: null,
      checked: [],
      queryAttendRecordList: [],
      queryList: {
        activityTitle: undefined,
        id: undefined,
        queryStatus: undefined,
        startTime: undefined,
        endTime: undefined
      },
      queryContent: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          merchantName: undefined,
          merchantId: undefined,
          id: '',
          mpName: undefined,
          mpCode: undefined
        }
      },
      table: {
        columns: [
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            align: 'center',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商家ID'),
            show: true,
            align: 'center',
            minWidth: 120,
            prop: 'merchantId'
          },
          {
            label: this.$t('报名商品总数'),
            prop: 'allMpCount',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('待平台审核编号'),
            prop: 'waitFinAuditCount',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('联系方式'),
            prop: 'mobile',
            align: 'center',
            minWidth: 120, show: true
          },
          {
            label: this.$t('报名时间'),
            prop: 'attendTime',
            align: 'center',
            minWidth: 220, show: true,
            formatter: (row, column) => {
              if (row.attendTime) {
                return this.$portal.parseTime(row.attendTime)
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    getApplyActivityType() {
      return constants.applyActivityTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getPlatformMap() {
      return this.platformList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  watch: {
    checked(newVal) {
      console.log('watch table-checked', newVal)
    }
  },
  async mounted() {
    this.queryList.activityTitle = this.$route.params.activityTitle
    this.queryList.id = this.$route.params.id
    this.queryList.queryStatus = this.$route.params.queryStatus
    this.queryList.startTime = this.$route.params.startTime
    this.queryList.endTime = this.$route.params.endTime

    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('queryContent')
    },
    async handleSubmit() {
      const [validError] = await this.formValidate('queryContent')

      if (validError) {
        return
      }
      await this.query()
    },
    async query() {
      this.queryContent.obj.id = this.queryList.id
      const params = {
        currentPage: this.queryContent.currentPage,
        itemsPerPage: this.queryContent.itemsPerPage,
        obj: this.queryContent.obj
      }
      await this.$promotion.$api.promotion
        .queryAttendRecordList(params, {})
        .then(res => {
          if (res.code === '0' && res.data && res.data.listObj) {
            this.queryAttendRecordList = res.data.listObj
            this.total = res.data.total
          }
        })
    },
    handleFilterGroupon() {
      this.queryContent.currentPage = 1
      this.query()
    },
    viewActivityRecordMp() {
      const { id: activityAttendId, refThemeId } = this.$route.params
      this.$router.push({
        name: 'PromRegistrationRecordDetails',
        params: {
          activityAttendId,
          refThemeId
        }
      })
      // if (this.checked === [] || this.checked === '' || this.checked.length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: this.$t('please_choose')
      //   })
      //   return
      // } else {
      //   for (let i = 0; i < this.checked.length; i++) {
      //     if (this.queryList.queryStatus === 1) {
      //       this.$router.push({
      //         name: 'PromRegistrationRecordDetails',
      //         params: {
      //           id: this.checked[i].id,
      //           queryStatus: this.checked[i].queryStatus,
      //           activityTitle: this.queryList.activityTitle,
      //           merchantId: this.checked[i].merchantId
      //         }
      //       })
      //     } else {
      //       this.$router.push({
      //         name: 'PromRegistrationRecordDetails',
      //         params: {
      //           id: this.checked[i].id,
      //           activityTitle: this.queryList.activityTitle,
      //           merchantId: this.checked[i].merchantId
      //         }
      //       })
      //     }
      //   }
      // }
    },
    handleDownloadFileByGet() {
      if (
        this.checked === [] ||
        this.checked === '' ||
        this.checked.length === 0
      ) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择要导出的商品')
        })
        return
      } else {
        for (let i = 0; i < this.checked.length; i++) {
          this.$portal.downloadFileByGet(
            '/api/back-promotion-web/applyActivityRead/exportApplyMp.do',
            {
              params: this.checked[i].id,
              activityAttendId: this.checked[i].activityAttendId,
              refType: 1,
              promotionType: 1,
              promotionMethod: 1
            }
          )
        }
      }
    }
  }
}
</script>
