<template>
  <div>
    <ody-box>
      <el-form label-width="240px" class="form">
        <el-form-item :label="$t('报名活动名称:')" prop="activityTitle">
          <span>{{ activityApplyDetail.activityTitle }}</span>
        </el-form-item>
        <el-form-item :label="$t('报名活动ID:')" prop="id">
          <span>{{ activityAttendId }}</span>
        </el-form-item>
        <el-form-item :label="$t('报名活动类型:')" prop="queryStatus">
          <span>{{ getActivityTypeValue(activityApplyDetail) }}</span>
        </el-form-item>
      </el-form>
    </ody-box>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="queryContent" :model="queryContent" label-width="100px" class="form">
          <ody-search-item :label="$t('商品名称')" prop="obj.mpName">
            <el-input v-model="queryContent.obj.mpName" name="queryContent_obj_mpName"/>
          </ody-search-item>
          <ody-search-item :label="$t('商品编码')" prop="obj.mpCode">
            <el-input v-model="queryContent.obj.mpCode" name="queryContent_obj_mpCode"/>
          </ody-search-item>
          <ody-search-item :label="$t('商家名称')" prop="obj.merchantName">
            <el-input v-model="queryContent.obj.merchantName" name="queryContent_obj_merchantName"/>
          </ody-search-item>
          <ody-search-item :label="$t('商家ID')" prop="obj.merchantId">
            <el-input-number
              v-model="queryContent.obj.merchantId"
              :precision="0"
              name="queryContent_obj_merchantId"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="handleSubmit"
          size="small"
          type="primary"
          code="button009"
          @click="handleSubmit"
        >查询
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!-- -1 -->
        <ody-button
          v-if="queryContent.obj.status === '-1' && isNeedSetParams === '1'"
          :disabled="tableListTotal === 0"
          name="exportAllMps"
          type="primary"
          size="small"
          code="button010"
          @click="exportAllMps(-1)"
        >{{ $t('导出全部商品') }}
        </ody-button>
        <!-- 1 -->
        <ody-button
          v-if="queryContent.obj.status === '1' && isNeedSetParams === '1'"
          name="queryPromotionMutexList"
          type="primary"
          size="small"
          @click="queryPromotionMutexList()"
        >{{ $t('审核通过') }}
        </ody-button>
        <ody-button
          v-if="queryContent.obj.status === '1' && isNeedSetParams === '0'"
          name="queryPromotionMutexList8"
          type="primary"
          size="small"
          code="button011"
          @click="queryPromotionMutexList()"
        >{{ $t('保存促销参数') }}
        </ody-button>
        <ody-button
          v-if="queryContent.obj.status === '1'"
          name="batchFirstAuditNotPass"
          type="primary"
          size="small"
          @click="batchFirstAuditNotPass()"
        >{{ $t('审核不通过') }}
        </ody-button>
        <ody-button
          v-if="queryContent.obj.status === '1' && isNeedSetParams === '0'"
          :disabled="tableListTotal === 0"
          name="exportAllMps0"
          type="primary"
          size="small"
          code="button012"
          @click="exportAllMps(1)"
        >{{ $t('导出待设置参数商品') }}
        </ody-button>
        <a
          v-if="queryContent.obj.status === '1' && isNeedSetParams === '0'"
          :disabled="!showImportBtn() || tableListTotal === 0"
          href="javascript:void 0;"
          onclick="file.value='';file.click()"
        >{{ $t('导入促销参数文件') }}</a>
        <!-- 2 -->
        <ody-button
          v-if="queryContent.obj.status === '2' && type != 1"
          name="batchSecondAuditPass"
          type="primary"
          size="small"
          code="button013"
          @click="batchSecondAuditPass()"
        >{{ $t('审核通过') }}
        </ody-button>
        <ody-button
          v-if="queryContent.obj.status === '2' && type != 1"
          name="batchSecondAuditNotPass"
          type="primary"
          size="small"
          code="button013"
          @click="batchSecondAuditNotPass()"
        >{{ $t('审核不通过') }}
        </ody-button>
        <ody-button
          v-if="queryContent.obj.status === '2' && isNeedSetParams === '0'"
          :disabled="tableListTotal === 0"
          name="exportAllMps8"
          type="primary"
          size="small"
          code="button014"
          @click="exportAllMps(2)"
        >{{ $t('导出待财务审核商品') }}
        </ody-button>
        <!-- <el-button name="exportMp" size="mini" type="primary" @click="exportMp">{{ $t('导出全部商品') }}</el-button> -->
      </div>
      <div slot="tabs">
        <el-tabs
          v-model="queryContent.obj.status"
          name="queryContent_obj_status"
          @tab-click="handleFilterGroupon"
        >
          <el-tab-pane :label="$t('全部')" name="-1"/>
          <el-tab-pane
            v-if="(isHasRoll('30520116') || isHasRoll('30530311x')) && operateModel == 2"
            :label="$t('待商家审核')"
            name="1"
          />
          <el-tab-pane v-if="isHasRoll('30520117')" :label="$t('待平台审核')" name="2"/>
          <el-tab-pane :label="$t('已进入促销活动')" name="3"/>
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="checked"
          :columns="table.columns"
          :operates="table.operates"
          :is-tree="true"
          :tree-props="treeProps"
          :load="loadChildren"
          :response="mpTableResponse"
          :selectable="selectable"
          :can-filter="false"
          :multiple="true"
          value-consists-of="ALL_WITH_INDETERMINATE"
          request-url="/back-promotion-web/applyActivityRead/queryAttendMpList.action"
          row-key="id"
          @getTableListTotal="getTableListTotal"
        >
          <template slot="priceLabel">
            <div>
              {{ getLabelName }}
            </div>
          </template>
          <template slot="promPrice" slot-scope="scope">
            {{ scope.row.contentValue }}
          </template>
          <template slot="promotionPrice" slot-scope="scope">
            {{ getPromotionPrice(scope.row.contentValue, scope.row.salePrice) }}
          </template>

          <template slot="status" slot-scope="scope">{{ scope.row.status | keyVal(statusMap) }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <promotion-mutex-goods-dialog
      v-if="visibleMutex"
      :visible-mutex.sync="visibleMutex"
      :table-data="mutexList"
      @success="goPass"
    />
  </div>
</template>
<script>
import constants from '@/utils/constants'
import * as utilService from '@/services/utilService'
import promotionMutexGoodsDialog from '@/components/promotion-mutex-goods-dialog'

export default {
  name: 'PromRegistrationRecordDetails',
  components: {
    promotionMutexGoodsDialog
  },
  data() {
    return {
      promotionDetail: {},
      visibleMutex: false,
      mutexList: [],
      refThemeId: '', // 关联的促销互动id
      checked: [],
      tableListTotal: 0,
      applyFirstAudit: null,
      applySecondAudit: null,
      operateModel: null,
      treeProps: {
        rootVal: '0',
        parentKey: 'parentId',
        hasChildren: 'hasChildren',
        children: 'childMpList'
      },
      isNeedSetParams: null,
      statusMap: {
        0: this.$t('设置促销参数审核失败'),
        1: this.$t('待设置促销参数'),
        2: this.$t('待平台审核'),
        3: this.$t('已进入促销活动'),
        4: this.$t('平台审核失败')
      },
      applyTypeArr: [
        { id: -1, text: this.$t('全部') },
        { id: 1, text: this.$t('单一促销') },
        { id: 2, text: this.$t('满额促销') },
        { id: 3, text: this.$t('满量促销') },
        { id: 4, text: this.$t('赠送类促销') },
        { id: 5, text: this.$t('秒杀') },
        { id: 6, text: this.$t('拼团') },
        { id: 7, text: this.$t('砍价') },
        { id: 8, text: this.$t('预售') }
      ],
      activityApplyDetail: {},
      row: null,
      queryAttendRecordList: [],
      queryList: {
        activityTitle: '',
        queryStatus: ''
      },
      queryContent: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          merchantName: undefined,
          merchantId: undefined,
          mpName: undefined,
          mpCode: undefined,
          activityAttendId: '',
          refThemeId: '',
          status: '-1',
          refType: 1
        }
      },
      table: {
        columns: [
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商家ID'),
            show: true,
            minWidth: 120,
            prop: 'merchantId'
          },
          {
            label: this.$t('商品编码'),
            prop: 'code',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'name',
            minWidth: 120, show: true
          },
          {
            label: this.$t('零售价'),
            prop: 'salePrice',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商品条码'),
            prop: 'barCode',
            minWidth: 120, show: true
          },
          {
            label: this.$t('计量单位'),
            prop: 'mainUnitName',
            minWidth: 120, show: true
          },
          {
            labelSlot: 'priceLabel',
            slot: 'promPrice',
            minWidth: 120, show: true
          },
          {
            label: this.$t('促销价'),
            slot: 'promotionPrice',
            minWidth: 120, show: true
          },

          {
            label: this.$t('个人单渠道限购'),
            prop: 'channelIndividualLimit',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商家单渠道限购'),
            prop: 'channelMerchantLimit',
            minWidth: 120, show: true
          },
          {
            label: this.$t('审核状态'),
            slot: 'status',
            minWidth: 120, show: true
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
    },
    getLabelName() {
      if (this.promotionDetail.promotionMethod === 1) {
        return '特价促销'
      } else if (this.promotionDetail.promotionMethod === 2) {
        return '折扣促销'
      } else if (this.promotionDetail.promotionMethod === 3) {
        return '直降促销'
      } else {
        return '...'
      }
    }
  },
  watch: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    const { activityAttendId, refThemeId } = this.$route.params

    // console.log(activityAttendId)
    this.activityAttendId = activityAttendId
    this.refThemeId = refThemeId
    await this.init()

    // this.activityAttendId

    // this.queryList.activityTitle = this.$route.params.activityTitle
    // this.queryContent.obj.activityAttendId = this.$route.params.id
    // this.queryList.queryStatus = this.$route.params.queryStatus
    // this.queryContent.obj.refThemeId = this.$route.params.merchantId

    // await this.query()
  },
  methods: {
    mpTableResponse(res) {
      const {
        data: { listObj }
      } = res

      const listData = listObj || []
      this.useAppendList = this.$portal.deepClone(listData)
      listData.forEach(x => {
        x.id = x.mpId
        x.flow = true
        // 如果是系列品
        if (x.typeOfProduct === 3) {
          x.hasChildren = true
        }
      })

      return res
    },
    getPromotionPrice(contentValue, price) {
      if (this.promotionDetail.promotionMethod === 1) {
        return contentValue
      } else if (this.promotionDetail.promotionMethod === 2) {
        return (price * contentValue / 10).toFixed(2)
      } else if (this.promotionDetail.promotionMethod === 3) {
        return price - contentValue
      } else {
        return ''
      }
    },
    async batchSecondAuditPass() {
      if (!(this.checked && this.checked.length)) {
        this.$message.error('请选择商品')
        return false
      }
      const res = await this.$confirm('确定要审核通过吗？', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消')
      })

      if (res !== 'confirm') {
        return
      }
      // 获取互斥

      const {
        data: { listObj: mutexList }
      } = await this.promotionAPI.queryMutexList({
        obj: {
          promotionId: this.refThemeId,
          mpDetailList: this.checked,
          activityAttendId: this.activityAttendId
        },
        currentPage: 1,
        itemsPerPage: 10
      })
      // 不冲突审核通过，如果有冲突审核不冲突的部分
      // 如果有互斥，去除互斥的商品
      if (mutexList && mutexList.length > 0) {
        this.mutexList = mutexList
        this.visibleMutex = true
      } else {
        this.setAttendMp(this.checked)
      }
    },
    goPass() {
      var arr = []
      this.checked.map(item => {
        const index = this.mutexList.findIndex(key => key.mpId === item.mpId)
        if (index === -1) {
          arr.push(item)
        }
      })
      if (arr.length > 0) {
        this.setAttendMp(arr)
      } else {
        this.$message({
          message: this.$t('你的商品均以互斥'),
          type: 'warning'
        })
      }
    },
    async setAttendMp(list) {
      const params = {
        activityAttendId: this.activityAttendId,
        mpDetailList: list,
        status: 3
      }
      const res = await this.promotionAPI.setAttendMp(params)
      if (res.code === '0') {
        this.$message({
          message: this.$t('操作成功'),
          type: 'success'
        })
        this.queryContent.obj.status = '3'
        this.query()
      }
    },
    async batchSecondAuditNotPass() {
      if (!(this.checked && this.checked.length)) {
        this.$message.error('请选择商品')
        return false
      }

      this.$prompt('管理员备注:', this.$t('提示'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        showClose: true,
        inputType: 'textarea',
        beforeClose: async(action, instance, done) => {
          const remark = instance.inputValue
          if (action === 'close') {
            done()
            return
          }

          if (instance.editorErrorMessage !== '') {
            return false
          }

          if (action === 'cancel') {
            done()
          } else if (action === 'confirm') {
            if (remark === '' || remark === null) {
              this.$message({
                'type': 'error',
                'message': this.$t('请填写备注')
              })
              return false
            }
            const res = await this.promotionAPI.secondAuditMpNotPass({
              activityAttendId: this.activityAttendId,
              mpDetailList: this.checked,
              remark
            })

            if (res.code === '0') {
              this.$message.success('操作成功')
              this.init()
              done()
            }
          }
        }
      })
    },
    async queryPromotionMutexList() {
      if (!(this.checked && this.checked.length)) {
        this.$message.error('请选择商品')
        return false
      }
    },
    getTableListTotal(total) {
      this.tableListTotal = total
    },
    isHasRoll(code) {
      return this.$portal.hasPermission(code)
    },
    getActivityTypeValue(e) {
      var type = e.refType
      // 7:秒杀
      var promotionType = e.promotionType
      if (type === 2) {
        return utilService.getDictionaryText(6, this.applyTypeArr)
      } else if (type === 1) {
        if (promotionType === 5) return '秒杀'
        return utilService.getDictionaryText(promotionType, this.applyTypeArr)
      } else if (type === 3) {
        return utilService.getDictionaryText(7, this.applyTypeArr)
      }
    },
    async init() {
      const id = this.activityAttendId
      const {
        data: activityApplyDetail
      } = await this.promotionAPI.queryApplyActivityDetail(id)
      this.activityApplyDetail = activityApplyDetail
      // this.isNeedSetParams = this.activityApplyDetail.isNeedSetParams
      const {
        data: config
      } = await this.promotionAPI.getLoadPageConfigCommonOscUrl(
        'APPLY_ACTIVITY_PAGE'
      )
      // 活动类型
      this.applyFirstAudit = config.applyFirstAudit
      this.applySecondAudit = config.applySecondAudit
      this.operateModel = config.operateModel
      // 活动类型
      this.isNeedSetParams = config.isNeedSetParams

      const {
        data: promotionDetail
      } = await this.promotionAPI.getPromotionDetailUrl({ id: this.refThemeId })
      this.promotionDetail = promotionDetail
      await this.query()
    },
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
    query() {
      this.checked = []
      const {
        activityAttendId,
        activityApplyDetail: { refType },
        refThemeId
      } = this

      const statusMap = {
        '-1': '-3',
        '1': '1',
        '2': '2',
        '3': '3'
      }

      // console.log(activityAttendId, this.activityAttendId)
      const params = {
        obj: {
          ...this.queryContent.obj,
          activityAttendId,
          refType,
          contentType: this.promotionDetail.promotionMethod,
          status: statusMap[this.queryContent.obj.status],
          refThemeId
        }
      }

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    async handleFilterGroupon() {
      await this.query()
    },
    async exportAllMps(status) {
      // console.log(222)
      var url = ''
      var params = {}
      if (this.type === 1) {
        url =
          '/api/back-promotion-web/applyActivityRead/exportPlatformAllApplyMp.do'
      } else {
        url = '/api/back-promotion-web/applyActivityRead/exportAllApplyMp.do'
      }

      params.activityAttendId = this.activityAttendId

      if (status !== -1) {
        params.status = status
      }

      if (this.activityApplyDetail.refType) {
        params.refType = this.activityApplyDetail.refType
      }

      if (this.activityApplyDetail.promotionType) {
        params.promotionType = this.activityApplyDetail.promotionType

        if (this.promotionDetail.promotionMethod) {
          params.promotionMethod = this.promotionDetail.promotionMethod
        }
      }

      await this.$portal.downloadFileByGet(url, params)
    },
    async loadChildren(tree, treeNode, resolve) {
      var condition = {
        'recordId': this.activityAttendId,
        'mpId': treeNode.mpId,
        'refType': this.activityApplyDetail.refType
      }
      if (this.activityApplyDetail.refType === 1) {
        condition.contentType = this.promotionDetail.promotionMethod
      }
      const res = await this.promotionAPI.getChildMpSelectedList(condition)

      res.data && res.data.forEach(item => {
        item.disable = true
        item.id = item.mpId
      })

      resolve(res.data)
    },
    selectable(row, index) {
      return !row.disable
    }
  }
}
</script>
