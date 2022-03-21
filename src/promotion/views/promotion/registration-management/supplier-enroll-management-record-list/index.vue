<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="queryContent" :model="queryContent" label-width="100px" class="form">
          <ody-search-item :label="$t('报名名称:')" prop="obj.activityTitle">
            <el-input
              v-model="queryContent.obj.activityTitle"
              name="queryContent_obj_activityTitle"
            />
          </ody-search-item>
          <ody-search-item :label="$t('报名ID:')" prop="obj.id">
            <el-input v-model="queryContent.obj.id" name="queryContent_obj_id" />
          </ody-search-item>
          <ody-search-item :label="$t('关联活动类型')" prop="obj.refType">
            <!-- <promotion-ref-type-select
              v-model="queryContent.obj.refType"
              :placeholder="$t('全部')"
              name="queryContent_obj_refType"
            /> -->
            <ody-select2
              v-model="queryContent.obj.refType"
              :clearable="false"
              list-key="applyActivityTypeList"
              name="queryContent_obj_refType"
            />
          </ody-search-item>

          <ody-search-item :label="$t('关联活动ID:')" prop="obj.refThemeId">
            <el-input v-model="queryContent.obj.refThemeId" name="queryContent_obj_refThemeId" />
          </ody-search-item>

          <ody-search-item :label="$t('申请报名时间:')" :space="2" prop="timeViewContent.dataPicker">
            <ody-date-range-picker
              v-model="queryContent.timeViewContent.dataPicker"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="queryContent_timeViewContent_dataPicker"
              value-format="yyyy-MM-dd"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('报名活动状态:')" prop="obj.status">
            <ody-select2
              ref="registrationType"
              v-model="queryContent.obj.status"
              :clearable="false"
              list-key="registrationTypeList"
              name="queryContent_obj_status"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="button015" size="small" type="primary" code="button015" @click.prevent="handleSubmit">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          ref="table"
          :data="applyActivityList"
          :columns="table.columns"
          :operates="table.operates"
          name="applyActivityList261"
          request-url="/back-promotion-web/supplierEnrollRead/querySupplierEnrollActivityList.do"
        >
          <template
            slot="promotionType"
            slot-scope="scope"
          >
            {{ scope.row.promotionType | keyVal(getRefTypeMap) }}
          </template>
          <!--<template slot="status" slot-scope="scope">{{ scope.row.status | keyVal(getStatusType) }}</template>-->
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import constants from '@/utils/constants'
import PromotionRefTypeSelect from '@/components/promotion-ref-type-select'
export default {
  name: 'PromotionSupplierEnrollManagementRecordList',
  components: {
    PromotionRefTypeSelect
  },
  data() {
    return {
      queryContent: {
        applyActivityType: undefined,
        registrationType: undefined,
        queryStatus: undefined,
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: undefined,
        obj: {
          status: -1,
          activityTitle: undefined,
          id: undefined,
          refThemeId: undefined,
          refType: -1,
          promotionType: 1,
          startTime: undefined,
          endTime: undefined
        },
        timeViewContent: {
          startTime: '',
          endTime: '',
          dataPicker: []
        }
      },
      applyActivityList: [],

      table: {
        columns: [
          {
            label: this.$t('报名活动ID'),
            prop: 'id',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('报名名称'),
            prop: 'activityTitle',
            align: 'center',
            show: true
          },
          {
            label: this.$t('申请报名时间'),
            prop: 'attendTime',
            align: 'center',
            minWidth: 200,
            show: true,
            formatter: (row, column) => {
              if (row.attendTime) {
                return this.$portal.parseTime(row.attendTime)
              }
            }
          },
          {
            show: true,
            // slot: 'status',
            label: this.$t('活动状态'),
            align: 'center',
            minWidth: 88,
            formatter: (row, column) => {
              var now = new Date()
              var m = constants.registrationTypeList.reduce((rtv, item) => {
                rtv[item.value] = this.$t(item.label)
                return rtv
              }, {})
              if (row.startTime > now) {
                row.status = 0
                return m[0]
              } else if (row.endTime < now) {
                row.status = 2
                return m[2]
              }
              row.status = 1
              return m[1]
            }
          },
          {
            label: this.$t('关联促销类型'),
            slot: 'promotionType',
            align: 'center',
            show: true
          },
          {
            label: this.$t('关联促销ID'),
            prop: 'refThemeId',
            align: 'center',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('促销活动名称'),
            prop: 'refThemeName',
            align: 'center',
            show: true
          },
          {
            show: true,
            align: 'center',
            label: this.$t('促销活动时间'),
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              return `<span>${this.$portal.parseTime(
                row.refThemeStartTime,
                '{y}-{m}-{d} {h}:{i}'
              )}-</span>
            <span>${this.$portal.parseTime(
    row.refThemeEndTime,
    '{y}-{m}-{d} {h}:{i}'
  )}</span>`
            }
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('查看'),
              method: (index, row) => {
                this.$router.push({
                  name: 'PromotionSupplierEnrollMerchantCtrl',
                  params: {
                    id: row.activityAttendId,
                    refThemeId: row.refThemeId,
                    viewFlag: 1,
                    refType: row.refType,
                    merchantId: row.merchantId
                  }
                })
              },
              code: 'button016'
            },
            {
              label: this.$t('追加商品'),
              method: (index, row) => {
                this.$router.push({
                  name: 'PromotionSupplierEnrollManagementApplyForSet',
                  params: {
                    id: row.activityAttendId,
                    refThemeId: row.refThemeId,
                    viewFlag: 0,
                    refType: row.refType,
                    merchantId: row.merchantId
                  }
                })
              },
              code: 'button017'
            }
          ]
        }
      },
      applyActivityTypeList: [],
      registrationTypeList: []
    }
  },
  computed: {
    getRefTypeMap() {
      return this.applyActivityTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getStatusType() {
      return this.registrationTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  async mounted() {
    await this.$promotion.$api.promotion.code_listMulti({ categorys: ['applyActivityTypeList', 'registrationTypeList'] }).then(res => {
      for (const i in res.data.applyActivityTypeList) {
        this.applyActivityTypeList.push({ value: i, label: res.data.applyActivityTypeList[i] })
      }
      for (const i in res.data.registrationTypeList) {
        this.registrationTypeList.push({ value: i, label: res.data.registrationTypeList[i] })
      }
    })
    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('queryContent')
      this.queryContent.obj.refType = ''
    },
    async handleSubmit() {
      const [validError] = await this.formValidate('queryContent')
      if (validError) {
        return
      }
      await this.query()
    },
    query() {
      if (this.queryContent.timeViewContent.dataPicker != null) {
        this.queryContent.obj.startTime = this.$portal.parseTime(this.queryContent.timeViewContent.dataPicker[0], '{y}-{m}-{d}')
        this.queryContent.obj.endTime = this.$portal.parseTime(this.queryContent.timeViewContent.dataPicker[1], '{y}-{m}-{d}')
      }
      const params = {
        currentPage: this.queryContent.currentPage,
        itemsPerPage: this.queryContent.itemsPerPage,
        obj: this.queryContent.obj
      }
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    handleFilterGroupon() {
      this.queryContent.currentPage = 1
      this.query()
    }
  }
}
</script>
