<template>
  <div class="pg-promotion-detail">
    <ody-box :title="$t('拼团活动详情')">
      <div class="detail-top">
        <div class="detail-top-titte">
          <span class="activity-name">活动名称：</span>
          <span class="acitvity-value">{{ detailData.activityTitle }}</span>
        </div>
        <div class="detail-top-content">
          <span class="activity-name">活动ID：</span>
          <span class="acitvity-value">{{ detailData.id }}</span>
        </div>
        <div class="detail-top-tatus">
          <label class="activity-name">当前状态：</label>
          <span v-if="detailData.status==0" class="acitvity-value">{{ $t('待提交') }}</span>
          <span v-if="detailData.status==1" class="acitvity-value">{{ $t('待审核') }}</span>
          <span v-if="detailData.status==2" class="acitvity-value">{{ $t('未开始') }}</span>
          <span v-if="detailData.status==3" class="acitvity-value">{{ $t('审核未通过') }}</span>
          <span v-if="detailData.status==4" class="acitvity-value">{{ $t('进行中') }}</span>
          <span v-if="detailData.status==5" class="acitvity-value">{{ $t('已过期') }}</span>
          <span v-if="detailData.status==6" class="acitvity-value">{{ $t('已关闭') }}</span>
        </div>
      </div>
      <div class="submitAudit">
        <ody-button
          v-show="detailData.status==0"
          name="submitVerifyActivity"
          type="primary"
          size="mini"
          code="button018"
          @click="submitVerifyActivity"
        >{{ $t('提交审核') }}</ody-button>
        <ody-button
          v-show="detailData.status==1"
          name="openVerifyPop"
          type="primary"
          size="mini"
          code="button019"
          @click="openVerifyPop"
        >{{ $t('审核') }}</ody-button>
      </div>
      <el-tabs v-model="selectFlag" name="selectFlag" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('拼团活动规则')" name="1" class="promotion-rules">
          <ody-space :space="4">
            <div class="base-info">
              <div class="item">
                <label>活动时间：</label>
                {{ detailData.effStartDate | parseTime }}-{{ detailData.effEndDate | parseTime }}
              </div>
              <div class="item">
                <label>是否包邮：</label>
                <span v-if="detailData.freeShipping==0">{{ $t('否') }}</span>
                <span v-else>{{ $t('是') }}</span>
              </div>
              <div class="item">
                <label>活动对象：</label>
                <span v-if="detailData.customerLimit==0">{{ $t('不限制') }}</span>
                <span v-else-if="detailData.customerLimit==1">{{ $t('仅限新用户') }}</span>
                <span v-else>{{ $t('仅限老用户') }}</span>
              </div>
              <div v-show="detailData.channelCodes" class="item">
                <label>活动渠道：</label>
                {{ detailData.channelCodes | getChannelName(channelMap) }}
              </div>
              <div class="item">
                <label>团单时长：</label>
                <span v-if="detailData.togetherTimeLimit && detailData.togetherTimeType==1">{{ detailData.togetherTimeLimit }}小时</span>
                <span v-else>{{ $t('不限制') }}</span>
              </div>
              <div v-if="detailData.autoCompleteTime" class="item" >
                <label>自动成团设置：</label>
                距结束{{ detailData.autoCompleteTime }}小时未成团则自动成团
              </div>
              <div class="item">
                <label>单用户参团限制：</label>
                <span v-if="detailData.individualJoinType==0">{{ $t('不限制') }}</span>
                <span v-else>{{ detailData.individualJoinTime }}</span>
              </div>
              <div class="item">
                <label>拼团人数：</label>
                {{ detailData.groupMembers }}人
              </div>
              <div class="item">
                <label>拼团模式：</label>
                <span v-if="detailData.type==0">{{ $t('单品') }}</span>
                <span v-else>{{ $t('任意') }}</span>
              </div>
              <div class="item">
                <label class="item-img-lable">活动图片：</label>
                <div v-for="item in groupImgList" :key="item.mpPicUrl" class="item-img-container">
                  <img :src="item.mpPicUrl" class="item-img" alt >
                </div>
              </div>
              <div v-show="detailData.description" class="item">
                <label>备注：</label>
                <div class="item-description" v-html="detailData.description" />
              </div>
            </div>
          </ody-space>
        </el-tab-pane>

        <el-tab-pane :label="$t('参与商品')" name="2">
          <ody-space :space="5">
            <ody-table
              :can-filter="false"
              :data="mpListBatch"
              :columns="ListBatch.columns"
              :is-tree="true"
              :default-expand-all="false"
              :multiple="true"
              :tree-props="{ rootVal: '0', parentKey: 'parentId', hasChildren: 'hasChildren', children: 'childMpList' }"
              :load="loadChildren"
              row-key="id"
              name="mpListBatch632"
            />
          </ody-space>
        </el-tab-pane>
      </el-tabs>
    </ody-box>
    <ody-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :title="$t('系统提示')"
      width="30%"
    >
      <span>{{ $t('提交审核成功') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button name="submitSuccess" type="primary" @click="submitSuccess">确 定</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  name: 'PromGroupActivitiesDetail',
  filters: {
    getChannelName(channelCodes, channelMap) {
      if (channelCodes) {
        return channelCodes
          .map(item => {
            if (channelMap[item]) {
              return channelMap[item].channelName
            }
          })
          .join('、')
      }
      return ''
    },
    getApplicablePlatform(applicablePlatformList, applicableMap) {
      if (applicablePlatformList) {
        var applicableArr = []
        if (applicableMap && applicableMap.length > 0) {
          applicablePlatformList.map(item => {
            const index = applicableMap.findIndex(key => key.id === item)
            if (applicableMap[index]) {
              applicableArr.push(applicableMap[index].text)
            }
          })
          return applicableArr.join('、')
        }
      }
      return ''
    },
    getUserScopeList(userScopeList, userScopeListMap) {
      if (userScopeList) {
        var userScopeArr = []
        if (userScopeListMap && userScopeListMap.length > 0) {
          userScopeList.map(item => {
            const index = userScopeListMap.findIndex(key => key.id === item)
            if (userScopeListMap[index]) {
              userScopeArr.push(userScopeListMap[index].text)
            }
          })
          return userScopeArr.join('、')
        }
      }
      return ''
    }
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      groupImgList: [],
      overLimitTypeList: [],
      selectFlag: '1',
      channelMap: {},
      applicableMap: {},
      userScopeListMap: [],
      memberTypeList: [],
      activeName: '1',
      promotionId: '',
      promotionAPI: '',
      detailData: {},
      merchantSearch: {
        merchantCode: '',
        merchantName: ''
      },
      dialogVisible: false, // 提交审核成功
      pathDetail: null, // 提交审核时传的入参
      promType: 2000, // 拼团类型
      mpListBatch: [],
      ListBatch: {
        columns: [
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            minWidth: 150, show: true
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            minWidth: 120, show: true
          },
          {
            label: this.$t('计量单位'),
            prop: 'mainUnitName',
            minWidth: 120, show: true
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            width: 150,
            show: true
          },
          {
            label: this.$t('店铺名称'),
            prop: 'storeName',
            minWidth: 150, show: true
          },
          {
            label: this.$t('零售价（元）'),
            prop: 'merchantProductPrice',
            minWidth: 150, show: true
          },
          {
            label: this.$t('拼团价（元）'),
            prop: 'groupnonPrice',
            minWidth: 150, show: true
          },
          {
            label: this.$t('个人单渠道限购'),
            prop: 'individualLimit',
            minWidth: 150, show: true
          },
          {
            label: this.$t('店铺单渠道限购'),
            prop: 'stockLimit',
            minWidth: 150, show: true
          }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.promotionId = this.$route.params.promotionId
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryPromotionActivityDetail()
    await this.getChannelArrByBusiness()
    await this.getLoadPageConfigCommonOscUrl()
    await this.loadPageConfigMethod()
    await this.queryAttendImagesUrl()
    await this.querySelectedMpListBatchUrl()

    // await this.queryPatchGrouponThemeDetail()
  },
  methods: {
    async loadChildren(tree, treeNode, resolve) {
      const params = {
        mpId: treeNode.mpId,
        patchGrouponThemeId: this.promotionId
      }
      const res = await this.promotionAPI.queryPatchGrouponMpChildList(
        params
      )
      res.data && res.data.forEach(item => {
        item.disable = true
      })
      resolve(res.data)
    },
    submitSuccess() {
      this.dialogVisible = false
    },
    // 提交审核queryPatchGrouponThemeDetail  patchGrouponThemeSubmitAuditUrl
    async submitVerifyActivity() {
      const confirm = await this.$confirm(this.$t('确认提交审核') + '？', this.$t('提交审核'))
      if (!confirm) {
        return
      }
      if (!this.checkProductList()) {
        return
      }
      if (this.detailData) {
        const {
          code
        } = await this.promotionAPI.patchGrouponThemeSubmitAuditUrl(
          this.detailData
        )
        if (+code === 0) {
          await this.queryPatchGrouponThemeDetailUrl()
          await this.querySelectedMpListBatchUrl()
          this.$message({
            message: this.$t('提交审核成功'),
            type: 'success'
          })
        }
      } else {
        return
      }
    },
    checkProductList() {
      if (this.mpListBatch === null || this.mpListBatch.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('没有获得商品信息，不能提交')
        })
        return false
      } else {
        for (let i = 0; i < this.mpListBatch.length; i++) {
          const item = this.mpListBatch[i]
          if (!item.groupnonPrice) {
            this.$message({
              type: 'error',
              message: this.$t('请输入拼团价')
            })
            return false
          }
          if (item.groupnonPrice >= item.merchantProductPrice) {
            this.$message({
              type: 'error',
              message: this.$t('拼团价应小于零售价')
            })
            return false
          }

          if (!item.individualLimit && item.typeOfProduct !== 2) {
            this.$message({
              type: 'error',
              message: this.$t('个人单渠道限购必填')
            })
            return false
          } else if (item.typeOfProduct !== 2) {
            if (!item.individualLimit) {
              this.$message({
                type: 'error',
                message: this.$t('个人单渠道限购必填')
              })
              return false
            }
            if (item.individualLimit > item.stockLimit) {
              this.$message({
                type: 'error',
                message: this.$t('个人单渠道限购应小于店铺单渠道限购')
              })
              return false
            }
          }
        }
      }
      return true
    },
    // 审核按钮
    openVerifyPop() {
      if (!this.checkProductList()) {
        return
      }
      this.$prompt('管理员备注:', this.$t('提示'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('通过'),
        cancelButtonText: this.$t('不通过'),
        showClose: true,
        inputType: 'textarea',
        inputPattern: /^.{0,100}$/,
        inputErrorMessage: this.$t('只能输入100字符以内'),
        beforeClose: async(action, instance, done) => {
          const remark = instance.inputValue

          if ((remark === '' || remark === null) && action === 'cancel') {
            this.$message('请填写备注')
            return
          }

          if (action === 'close') {
            done()
            return
          }

          if (instance.editorErrorMessage !== '') {
            return false
          }

          if (action === 'cancel') {
            this.promotionAPI
              .patchGrouponThemeAuditNotPass({
                id: this.promotionId,
                remark: remark,
                status: 1
              })
              .then(res => {
                if (+res.code === 0) {
                  this.queryPatchGrouponThemeDetailUrl()
                  this.querySelectedMpListBatchUrl()
                  done()
                }
              })
          } else if (action === 'confirm') {
            this.promotionAPI
              .patchGrouponThemeAuditPass({
                id: this.promotionId,
                remark: remark,
                status: 1
              })
              .then(async res => {
                if (+res.code === 0) {
                  await this.queryPatchGrouponThemeDetailUrl()
                  await this.querySelectedMpListBatchUrl()
                  done()
                }
              })
          }
        }
      })
    },
    // async handleSizeChange(merchantType) {
    //   if (merchantType === 1) {
    //     this.merchantTable.page.currentPage = 1
    //   } else {
    //     this.storeTable.page.currentPage = 1
    //   }
    //   await this.handleMerchantSubmit(merchantType)
    // },
    handleTabClick(val) {
      this.selectFlag = val.name
    },
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }
      const {
        data = {},
        code
      } = await this.promotionAPI.queryPatchGrouponThemeDetail(params)
      if (code === '0' && data) {
        this.detailData = data
        // 为了解决定时任务刷新状态延时
        if (this.detailData && this.detailData.status === 2) {
          const d = Date.now()
          if (this.detailData.effStartDate < d && this.detailData.effEndDate > d) {
            this.detailData.status = 4
          }
        }
      }
    },
    // 读取商家渠道信息
    async getChannelArrByBusiness() {
      const { data } = await this.promotionAPI.queryChannelMap({})
      this.channelMap = data
    },
    // getLoadPageConfigCommonOscUrl
    async getLoadPageConfigCommonOscUrl() {
      const { data } = await this.promotionAPI.getLoadPageConfigCommonOscUrl(
        'PAGE_CONFIG_NOT_SAME'
      )
      this.ConfigCommonOsc = data
    },
    // loadPageConfigMethod
    async loadPageConfigMethod() {
      const { data } = await this.promotionAPI.loadPageConfigMethod({})
      this.PageConfig = data
    },
    // 获取活动图片queryAttendImagesUrl
    async queryAttendImagesUrl() {
      const params = {
        refTheme: this.promotionId,
        refType: 3
      }
      const { data = {}, code } = await this.promotionAPI.queryAttendImagesUrl(
        params
      )
      if (code === '0' && data.length > 0) {
        this.groupImgList = data
      } else if (data.length === 0) {
        this.groupImgList = []
      }
    },
    // 参与商品列表querySelectedMpListBatchUrl
    async querySelectedMpListBatchUrl() {
      const params = {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          patchGrouponThemeId: this.promotionId
        }
      }
      const {
        data = {},
        code
      } = await this.promotionAPI.querySelectedMpListBatchUrl(params)
      if (code === '0' && data && data.listObj != null) {
        this.mpListBatch = data.listObj.map(x => {
          x.hasChildren = x.typeOfProduct === 3

          return x
        })
      } else if (code === '0' && data && !data.listObj) {
        this.mpListBatch = []
      }
    },
    async queryPatchGrouponThemeDetailUrl() {
      const params = {
        id: this.promotionId
      }
      const {
        data = {},
        code
      } = await this.promotionAPI.queryPatchGrouponThemeDetail(params)
      if (code === '0' && data) {
        this.detailData = data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item-img-lable {
  vertical-align: top;
}
.item-img-container {
  margin-left: 50px;
  display: inline-block;
  .item-img {
    margin: 0 5px 0 0;
    width: 80px;
    height: 80px;

  }
}
.pg-promotion-detail {
  .detail-top {
    margin-bottom: 20px;

    &-titte {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(69, 90, 100, 1);
      line-height: 22px;
      margin-bottom: 10px;
    }

    &-content {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(69, 90, 100, 1);
      line-height: 20px;

      &-item {
        margin-left: 20px;
      }
    }
  }

  .promotion-rules {
    .base-info {
      height: 100px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(69, 90, 100, 1);
      line-height: 17px;
    }

    .header {
      font-size: 14px;
      margin-bottom: 20px;
    }

    .item {
      margin-bottom: 10px;
      word-break: break-all;
    }
    .item-description {
      display: inline-block;
    }
  }
  .detail-top {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .submitAudit {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .activity-name {
    font-size: 12px;
    color: #666;
    font-weight: 500;
  }
  .acitvity-value {
    font-weight: 500;
    font-size: 12px;
    color: #ff6600;
  }
}
</style>
