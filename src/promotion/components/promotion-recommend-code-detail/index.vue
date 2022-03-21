<template>
  <div class="pg-promotion-detail">
    <ody-box :title="$t('推荐码活动详情')">
      <div class="detail-top">
        <div class="detail-top-titte">
          <span class="activity-name">{{ $t('活动名称') }}：</span>
          <span class="acitvity-value">{{ detailData.name }}</span>
        </div>
        <div class="detail-top-content">
          <span class="activity-name">{{ $t('活动ID') }}：</span>
          <span class="acitvity-value">{{ detailData.id }}</span>
        </div>
        <div class="detail-top-tatus">
          <label class="activity-name">{{ $t('当前状态') }}：</label>
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
          v-show="submitVerifyBtnShow"
          name="submitVerifyActivity"
          type="primary"
          size="medium"
          code="button018"
          @click="submitVerifyActivity"
        >{{ $t('提交审核') }}</ody-button>
        <ody-button
          v-show="verifyBtnShow"
          name="openVerifyPop"
          type="primary"
          size="medium"
          code="button019"
          @click="openVerifyPop"
        >{{ $t('审核') }}</ody-button>
        <!-- <ody-button v-show="detailData.status==0" name="submitVerifyActivity1" type="primary" size="mini" @click="submitVerifyActivity">{{ $t('提交审核') }}</ody-button>
        <ody-button v-show="detailData.status==1" name="openVerifyPop0" type="primary" size="mini" @click="openVerifyPop">{{ $t('审核') }}</ody-button>-->
      </div>
      <div class="baseDetail">
        <div class="baseInfo">
          <ody-title :title="$t('基本信息')" />
          <ody-space :space="4">
            <div class="base-info">
              <div class="item">
                <label class="activity-name">{{ $t('活动名称') }}：</label>
                <span>{{ detailData.name }}</span>
              </div>
              <div class="item">
                <label class="activity-name">{{ $t('活动时间') }}：</label>
                <span>{{ detailData.startTime }}{{ $t('至') }}{{ detailData.endTime }}</span>
              </div>
              <div v-show="detailData.channelCodes" class="item">
                <label class="activity-name">{{ $t('活动渠道') }}：</label>
                <span> {{ detailData.channelCodes | getChannelName(channelMap) }}&nbsp;&nbsp; &nbsp;</span>
              </div>
              <div class="item">
                <label class="activity-name">{{ $t('发放对象') }}：</label>
                <span v-if="detailData.activityObjects" class="item">
                  <span class="color">{{ $t('新老用户') }}：</span>
                  <span>{{ detailData.activityObjects[0].userScopes | getUserScopeList(userScopeListMap) }}</span>
                </span>
                <div v-if="detailData.activityObjects" class="item item-margin">
                  <span class="color">{{ $t('会员类型') }}：</span>
                  <span>{{ memberTypeList.join('、') }}</span>
                </div>
                <div v-show="detailData.activityObjects" class="item item-margin">
                  <span class="color">{{ $t('会员等级') }}：</span>
                  <div
                    v-for="item in memberTypeListArray"
                    :key="item.memberType"
                    class="levels-content"
                  >
                    <el-tag type="info" class="levels-tag">{{ item.memberTypeName }}</el-tag>
                    <span>{{ getMemberLevel(item.memberLevelList, detailData.activityObjects[0].memberLevels) }}</span>
                  </div>
                </div>
              </div>
              <div class="item">
                <label class="activity-name">{{ $t('使用对象') }}：</label>
                <span v-if="detailData.activityObjects" class="item">
                  <span class="color">{{ $t('新老用户') }}：</span>
                  <span>{{ detailData.activityObjects[1].userScopes | getUserScopeList(userScopeListMap) }}</span>
                </span>
                <div v-if="detailData.activityObjects" class="item item-margin">
                  <span class="color">{{ $t('会员类型') }}：</span>
                  <span>{{ memberTypeList.join('、') }}</span>
                </div>
                <div v-show="detailData.activityObjects" class="item item-margin">
                  <span class="color">{{ $t('会员等级') }}：</span>
                  <div
                    v-for="item in memberTypeListArray"
                    :key="item.memberType"
                    class="levels-content"
                  >
                    <el-tag type="info" class="levels-tag">{{ item.memberTypeName }}</el-tag>
                    <span>{{ getMemberLevel(item.memberLevelList, detailData.activityObjects[1].memberLevels) }}</span>
                  </div>
                </div>
              </div>
              <div class="item">
                <label class="activity-name">{{ $t('是否排斥优惠券') }}：</label>
                <span v-if="detailData.shareWithCoupon==1">{{ $t('否') }}</span>
                <span v-else>{{ $t('是') }}</span>
              </div>
              <div class="item">
                <label class="activity-name">{{ $t('是否排斥促销活动') }}：</label>
                <span v-if="detailData.shareWithPromotion==1">{{ $t('否') }}</span>
                <span v-else>{{ $t('是') }}</span>
              </div>
              <div class="item">
                <label class="activity-name">{{ $t('推荐码优惠') }}：</label>
                <span v-if="detailData.contentType === 2">
                  <span>{{ $t('满') }}{{ detailData.conditionValue }}元打{{ detailData.contentValue }}折,折扣上限{{ detailData.discountLimit }}{{ $t('元') }}</span>
                </span>
                <span v-else-if="detailData.contentType === 1">
                  <span>{{ $t('满') }}{{ detailData.conditionValue }}元，减{{ detailData.contentValue }}{{ $t('元') }}</span>
                </span>
              </div>
              <div class="item">
                <label class="activity-name">{{ $t('推荐码使用限制') }}：</label>
                <span>{{ $t('总次数限制') }}</span>
                <span>{{ detailData.totalLimit }}{{ $t('次') }}</span>
                <span>{{ $t('每ID次数限制') }}</span>
                <span>{{ detailData.individualLimit }}{{ $t('次') }}</span>
              </div>
            </div>
          </ody-space>
        </div>
        <div class="returnRules">
          <ody-title :title="$t('返利规则')" />
          <ody-space :space="4">
            <div class="base-info">
              <div class="item">
                <label class="activity-name">{{ $t('返利类型') }}：</label>
                <span v-if="detailData.rebateType == 1">{{ $t('佣金') }}</span>
              </div>
              <div class="item">
                <label class="activity-name">{{ $t('返利值') }}：</label>
                <span v-if="detailData.rebateModel==1">{{ detailData.rebateValue }}%</span>
                <span v-else>{{ detailData.rebateValue }}{{ $t('元') }}</span>
              </div>
              <div class="item useLang" style="display:flex;align-items:center">
                <label class="activity-name">{{ $t('使用规则') }}：</label>
                <div class="useRules">
                  <span v-if="detailData.useRule">中文：{{ detailData.useRule }}</span>
                  <span v-if="detailData.useRuleLan2" class="lan2">英文：{{ detailData.useRuleLan2 }}</span>
                </div>
              </div>
              <div v-if="detailData.shareVO" class="item">
                <label class="activity-name">{{ $t('分享标题') }}：</label>
                <span v-if="isDetail">{{ detailData.shareVO.shareTitle }}</span>
                <el-input v-if="isEdit" v-model="share.shareTitle" name="share_shareTitle"/>
              </div>
              <div v-if="detailData.shareVO" class="item">
                <label class="activity-name">{{ $t('分享描述') }}：</label>
                <span v-if="isDetail">{{ detailData.shareVO.shareDesc }}</span>
                <el-input v-if="isEdit" v-model="share.shareDesc" name="share_shareDesc"/>
              </div>
              <div v-if="detailData.shareVO" class="item">
                <label class="activity-name img-label">分享图片：</label>
                <img v-if="isDetail" :src="detailData.shareVO.shareImgUrl" class="img" >
                <ody-upload-image v-if="isEdit" v-model="share.shareImgUrl" :pic-size="51200" name="share_shareImgUrl"/>
                <div class="share-img-dsc">
                  建议尺寸100*100，仅限JPG、PNG格式，小于3M；
                  <a
                    name="getDefaultSharePic"
                    class="img-click"
                    @click="getDefaultSharePic"
                  >{{ $t('点击查看默认的系统图') }}</a>
                </div>
              </div>
              <div class="item">
                <label class="activity-name img-label">&nbsp;</label>
                <ody-button v-if="isEdit" name="ui_handleSaveShare" type="primary" code="ui" size="small" @click="handleSaveShare">{{ $t('保存') }}</ody-button>
              </div>
            </div>
          </ody-space>
        </div>
      </div>
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
    <ody-dialog
      :visible.sync="isShowDefaultPic"
      :title="$t('系统图')"
      width="600px"
      class="default-share-pic"
    >
      <img :src="defaultSharePic" alt >
    </ody-dialog>
  </div>
</template>

<script>
export default {
  name: 'PromRecommendCodeDetail',
  filters: {
    getChannelName(channelCodes, channelMap) {
      if (channelCodes) {
        return channelCodes
          .map(item => {
            if (channelMap[item]) {
              return channelMap[item].channelName
            }
          })
          .join('  ')
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
          return applicableArr.join('  ')
        }
      }
      return ''
    },
    getUserScopeList(userScopes, userScopeListMap) {
      if (userScopes) {
        var userScopeArr = []
        if (userScopeListMap && userScopeListMap.length > 0) {
          userScopes.map(item => {
            const index = userScopeListMap.findIndex(key => key.id === item)
            if (userScopeListMap[index]) {
              userScopeArr.push(userScopeListMap[index].text)
            }
          })
          return userScopeArr.join('  ')
        }
      }
      return ''
    }
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const { promotionId: refThemeId } = this.$route.params

    return {
      overLimitTypeList: [],
      selectFlag: '1',
      channelMap: {},
      applicableMap: {},
      userScopeListMap: [],
      memberTypeList: [],
      memberTypeListArray: [],
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
      promType: 8000, // 拼团类型
      isShowDefaultPic: false,
      defaultSharePic: '',
      share: {
        'refType': 1,
        refThemeId,
        shareTitle: '',
        shareDesc: '',
        shareImgUrl: ''
      }
    }
  },
  computed: {
    submitVerifyBtnShow() {
      if (this.promType === 8000) {
        return +this.detailData.status === 0 || +this.detailData.status === 3
      }
    },
    verifyBtnShow() {
      if (this.promType === 8000) {
        return +this.detailData.status === 1
      }
    }
  },
  created() {
    this.promotionId = this.$route.params.promotionId
    this.promotionAPI = this.$promotion.$api.promotion
    this.from = this.$route.params.from
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async init() {
      await this.getLoadPageConfigUrl()
      await this.queryReferralCodeActivityDetail()
      await this.queryMemberTypeList()
      await this.queryChannelMap()
      await this.getLoadPageConfigCommonOscUrl()
    // await this.loadPageConfigMethod()
    // await this.queryAttendImagesUrl()
    // await this.querySelectedMpListBatchUrl()
    // await this.queryPatchGrouponThemeDetail()
    },
    async handleSaveShare() {
      await this.promotionAPI.updateReferralCodeWriteShareInfo(this.share)
      this.$message({
        message: '操作成功',
        type: 'success'
      })
    },
    getMemberLevel(list, memberLevels) {
      var arr = []
      list.map(item => {
        if (memberLevels.indexOf(item.levelCode) > -1) {
          arr.push(item.levelName)
        }
      })
      return arr.join('  ')
    },
    // 活动平台
    async getLoadPageConfigUrl() {
      const { data } = await this.promotionAPI.loadPageConfigMethod({})
      this.applicableMap = data.applicablePlatform
      this.userScopeListMap = data.userScope
      console.log(this.userScopeListMap)
    },

    // 查看系统大图
    async getDefaultSharePic() {
      const {
        code,
        data = {}
      } = await this.$promotion.$api.promotion.loadOscConfigUrl(
        'DEFAULT_SHARE_PIC',
        {}
      )
      if (code === '0' && data.result) {
        this.isShowDefaultPic = true
        this.defaultSharePic = data.result
      }
    },

    submitSuccess() {
      this.dialogVisible = false
    },
    async submitVerifyActivity() {
      const confirm = await this.$confirm(this.$t('确认提交审核') + '？', this.$t('提交审核'))
      if (!confirm) {
        return
      }
      if (this.promType === 8000 || this.promType === '8000') {
        this.detailData.status = 1
        await this.promotionAPI.recommendSubmitActivity(
          this.detailData
        )
        await this.init()
      }
    },
    handleTabClick(val) {
      this.selectFlag = val.name
    },
    async queryReferralCodeActivityDetail() {
      const params = {
        id: this.promotionId
      }
      const {
        data = {},
        code
      } = await this.promotionAPI.queryReferralCodeActivityDetail(params)
      if (code === '0' && data) {
        this.detailData = data
        if (this.detailData.shareVO) {
          this.share.shareTitle = this.detailData.shareVO.shareTitle
          this.share.shareDesc = this.detailData.shareVO.shareDesc
          this.share.shareImgUrl = this.detailData.shareVO.shareImgUrl
        }
      }
    },
    // 获取会员类型
    async queryMemberTypeList() {
      const { data = {}, code } = await this.promotionAPI.queryMemberTypeList(
        {}
      )
      if (code === '0' && data) {
        // 获取会员类型
        this.memberTypeList = data.map(item => item.memberTypeName)
        this.memberTypeListArray = data
      }
    },
    // 读取商家渠道信息
    async queryChannelMap() {
      const { data } = await this.promotionAPI.queryChannelMap({})
      this.channelMap = data
    },
    // getLoadPageConfigCommonOscUrl
    async getLoadPageConfigCommonOscUrl() {
      const { data } = await this.promotionAPI.getLoadPageConfigCommonOscUrl(
        'PAGE_CONFIG_NOT_SAME'
      )
      this.ConfigCommonOsc = data
      this.merchantType = data.merchantType
    },
    // 审核
    openVerifyPop() {
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
            if (this.promType === 8000 || this.promType === '8000') {
              await this.promotionAPI
                .codeVerifyActivityNotPass({
                  ...this.detailData,
                  remark,
                  status: 4
                })
              await this.init()
              done()
            } else {
              await this.promotionAPI
                .verifyActivityNotPass({
                  id: this.promotionId,
                  remark: remark
                })
              await this.init()
              done()
            }
          } else if (action === 'confirm') {
            if (this.promType === 8000 || this.promType === '8000') {
              this.detailData.remark = remark
              this.detailData.status = 4
              const { code } = await this.promotionAPI.codeVerifyActivityPass(
                this.detailData
              )
              if (+code === 0) {
                await this.queryReferralCodeActivityDetail()
                done()
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pg-promotion-detail {
  .item-margin {
    margin-left: 64px;
  }
  .color {
    color: #999;
  }
  .img-label {
    vertical-align: top;
  }
  .img {
    display: inline-block;
    height: 100px;
    width: 100px;
  }
  .detail-top {
    margin-bottom: 20px;

    &-titte {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(69, 90, 100, 1);
      line-height: 22px;
      // margin-bottom: 10px;
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
  .baseDetail {
    margin-top: 30px;
  }
  .returnRules {
    margin-top: 30px;
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
    .useLang {
      display: flex;
      align-items: center;
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
  span {
    // font-size: 0.14rem;
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }
  .activity-name {
    // font-size: 0.14rem;
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }
  .item {
    min-height: 28px;
  }
  .lan2 {
    margin-left: 40px;
  }
  .acitvity-value {
    font-weight: 500;
    // font-size: 0.14rem;
    font-size: 14px;
    color: #ff6600;
  }
  .share-img-dsc{
    font-size: 14px;
    margin-top: 8px;
    // font-size: 0.10rem;
    // margin-top: 0.8rem;
  }
   .img-click {
    color: #00a0e9;
  }
}
</style>
