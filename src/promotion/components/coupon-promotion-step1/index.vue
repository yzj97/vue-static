<template>
  <div class="cp-coupon-theme-list">
    <el-row>
      <el-col :span="12" class="right-coupon-detail">
        <el-form
          ref="couponThemeViewContent"
          :model="couponThemeViewContent"
          :rules="rules"
          label-width="120px"
          class="form"
        >
          <ody-title :title="$t('发券规则')" />
          <div class="clearfix">
            <el-form-item
              :label="$t('发券类型')"
              class="coupon-type"
              prop="couponGiveRule"
              name="couponGiveRule"
              required
            >
              <promotion-coupon-give-rule-select
                v-model="couponThemeViewContent.couponGiveRule"
                :placeholder="$t('请选择')"
                name="couponThemeViewContent_couponGiveRule"
                @platformId="getPlatformId"
              />
            </el-form-item>
          </div>
          <div
            v-if="couponThemeViewContent.couponGiveRule === 12"
            class="receive-coupon-detail"
          >
            <ody-tip-star :content="$t('单次分享可领取的人数')" />
            <!-- <span class="glyphicon">！</span> -->
            <el-popover
              :content="$t('设置分享的劵包，可让x个用户领取，每个用户限领1张')"
              class="glyphicon-text"
              placement="top-end"
              width="60"
              trigger="hover"
            >
              <span slot="reference" class="glyphicon">!</span>
            </el-popover>
            <el-form-item class="coupon-limit" prop="shareNumLimit" name="shareNumLimit">
              <el-input
                v-model="couponThemeViewContent.shareNumLimit"
                name="couponThemeViewContent_shareNumLimit"
              />
            </el-form-item>
            <span>{{ $t("个") }}</span>
          </div>
          <div class="receive-coupon-detail">
            <ody-tip-star :content="$t('领取条件')" />
            <span>{{ $t("每ID总共可以领取") }}</span>
            <el-form-item class="coupon-limit" prop="individualLimit" name="individualLimit">
              <ody-input-number
                :min="1"
                :max="999999999"
                v-model="couponThemeViewContent.individualLimit"
                name="couponThemeViewContent_individualLimit"
              />
            </el-form-item>
            <span>{{ $t("张") }}</span>
            <div v-if="canShowEveryDayLimit()" class="every-day-limit">
              <span class="spacing">{{ $t("每ID每日可以领取") }}</span>
              <el-form-item class="coupon-limit" prop="everyDayLimit" name="everyDayLimit">
                <ody-input-number
                  :min="1"
                  :max="999999999"
                  v-model="couponThemeViewContent.everyDayLimit"
                  name="couponThemeViewContent.everyDayLimit"
                />
              </el-form-item>
              <span>{{ $t("张") }}</span>
            </div>
          </div>
          <el-form-item
            v-if="canShowActivityPlatformLimitShow()"
            :label="$t('新老用户')"
            prop="userScopeList"
            name="userScopeList"
          >
            <promotion-user-scope-checkbox
              v-model="couponThemeViewContent.userScopeList"
              :is-show-all="true"
              :checked-all="promotionId === ''"
              name="couponThemeViewContent_userScopeList"
            />
          </el-form-item>
          <el-form-item
            v-if="canShowMemberType()"
            :label="$t('会员类型')"
            prop="memberTypes"
            name="memberTypes"
          >
            <promotion-member-types-checkbox
              v-model="couponThemeViewContent.memberTypes"
              :selected.sync="memberTypesSelected"
              :checked-all="promotionId === ''"
              name="couponThemeViewContent_memberTypes"
            />
          </el-form-item>
          <el-form-item
            v-if="canShowMemberLevel()"
            :label="$t('会员等级')"
            prop="memberLevels"
            name="memberLevels"
          >
            <promotion-member-levels-checkbox
              v-model="couponThemeViewContent.memberLevels"
              :checked-all="promotionId === ''"
              name="couponThemeViewContent_memberLevels"
              @change="handleMemberLevelsChange"
            />
          </el-form-item>
          <el-form-item
            :label="$t('使用渠道')"
            prop="receiveChannelCodes"
            name="receiveChannelCodes"
            required
          >
            <promotion-channel-arr-checkbox
              v-model="couponThemeViewContent.receiveChannelCodes"
              :is-show-all="true"
              :checked-all="promotionId === ''"
              name="couponThemeViewContent_receiveChannelCodes"
            />
          </el-form-item>
          <!-- 目前前后台没有对接，暂时隐藏 -->
          <!-- <el-form-item
            v-if="couponThemeViewContent.couponGiveRule == 4 || couponThemeViewContent.couponGiveRule == 18"
            :label="$t('推送平台')"
            prop="pushPlatforms"
          >
            <promotion-coupon-push-platform-config-checkbox
              v-model="couponThemeViewContent.pushPlatforms"
              :is-show-all="true"
              :checked.sync="checked"
              name="couponThemeViewContent_pushPlatforms"
            />
          </el-form-item> -->
          <el-form-item
            v-show="
              (couponThemeViewContent.couponGiveRule == 4 ||
                couponThemeViewContent.couponGiveRule == 18) &&
                couponThemeViewContent.pushPlatforms &&
                couponThemeViewContent.pushPlatforms.length > 0
            "
            :label="$t('跳转渠道')"
            prop="dispatchChannel"
            name="dispatchChannel"
          >
            <promotion-dispatch-channel-select
              v-model="couponThemeViewContent.dispatchChannel"
              :placeholder="$t('请选择')"
              name="couponThemeViewContent_dispatchChannel"
            />
          </el-form-item>
          <ody-title :title="$t('基本信息')" />
          <el-form-item
            :label="$t('优惠券名称')"
            class="coupon-limit"
            prop="themeTitle"
            name="themeTitle"
          >
            <el-input
              v-model="couponThemeViewContent.themeTitle"
              :placeholder="$t('中文')"
              name="couponThemeViewContent_themeTitle"
              type="text"
              maxlength="10"
              show-word-limit
            />
          </el-form-item>
          <el-form-item class="coupon-limit" prop="themeTitleLan2" name="themeTitleLan2">
            <el-input
              v-model="couponThemeViewContent.themeTitleLan2"
              :placeholder="$t('英文')"
              name="couponThemeViewContent_themeTitleLan2"
              type="text"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>

          <el-form-item
            :label="$t('优惠券种类')"
            :key="couponThemeViewContent.couponGiveRule"
            prop="couponType"
            name="couponType"
            required
          >
            <promotion-coupon-type-radio
              v-model="couponThemeViewContent.couponType"
              :coupon-give-rule="couponThemeViewContent.couponGiveRule"
              name="couponThemeViewContent_couponType"
            />
          </el-form-item>
          <el-form-item
            :label="$t('金额抵扣类型')"
            :key="couponThemeViewContent.couponGiveRule"
            prop="couponDeductionType"
            name="couponDeductionType"
            required
          >
            <promotion-coupon-deduction-type-radio
              v-model="couponThemeViewContent.couponDeductionType"
              :coupon-give-rule="couponThemeViewContent.couponGiveRule"
              name="couponThemeViewContent_couponDeductionType"
              @change="couponDeductionTypeChange"
            />
          </el-form-item>
          <el-form-item
            :label="$t('优惠方式')"
            :key="couponThemeViewContent.couponGiveRule"
            prop="couponDiscountType"
            name="couponDiscountType"
            required
          >
            <promotion-coupon-discount-type-radio
              v-if="
                isLoaded && couponThemeViewContent.couponDeductionType === 0
              "
              key="coupon-discount-type-radio"
              v-model="couponThemeViewContent.couponDiscountType"
              :coupon-give-rule="couponThemeViewContent.couponGiveRule"
              :select-type="couponThemeViewContent.couponDeductionType"
              name="couponThemeViewContent_couponDiscountType"
            />
            <promotion-coupon-discount-type-radio1
              v-if="
                isLoaded && couponThemeViewContent.couponDeductionType === 1
              "
              key="coupon-discount-type-radio1"
              v-model="couponThemeViewContent.couponDiscountType"
              :coupon-give-rule="couponThemeViewContent.couponGiveRule"
              :select-type="couponThemeViewContent.couponDeductionType"
              name="couponThemeViewContent_couponDiscountType1"
            />
          </el-form-item>

          <el-form-item
            v-show="platformId != 2"
            :key="couponThemeViewContent.couponGiveRule"
            prop="applicationScope"
            name="applicationScope"
            required
          >
            <template slot="label">
              {{ $t("适用范围") }}
              <el-tooltip
                v-show="couponThemeViewContent.couponGiveRule != 12"
                :content="
                  $t(
                    '注：选择商家券仅可作用于商家商品,选择平台券则可作用于全平台商品。平台券可与 其他商家券叠加使用。'
                  )
                "
                class="item"
                effect="dark"
                placement="top-start"
              >
                <i class="el-icon-question" />
              </el-tooltip>
            </template>
            <ody-radio2
              v-if="couponThemeViewContent.couponGiveRule === 12"
              key="applicationScopeList1"
              v-model="couponThemeViewContent.applicationScope"
              name="couponThemeViewContent_applicationScope"
              list-key="applicationScopeList1"
            />
            <ody-radio2
              v-else-if="couponThemeViewContent.couponDeductionType === 1"
              key="applicationScopeList2"
              v-model="couponThemeViewContent.applicationScope"
              name="couponThemeViewContent_applicationScope9"
              list-key="applicationScopeList2"
            />
            <ody-radio2
              v-else
              key="applicationScopeList"
              v-model="couponThemeViewContent.applicationScope"
              name="couponThemeViewContent_applicationScope1"
              list-key="applicationScopeList"
            />
          </el-form-item>
          <!-- {{ couponThemeViewContent.couponDiscountType }} -->
          <!-- {{ couponThemeViewContent.couponGiveRule }} -->
          <el-form-item
            v-if="couponThemeViewContent.couponGiveRule === 12"
            :label="$t('优惠券面值种类')"
            prop="couponFaceValueType"
            name="couponFaceValueType"
            required
          >
            <ody-radio2
              v-model="couponThemeViewContent.couponFaceValueType"
              name="couponThemeViewContent_couponFaceValueType"
              list-key="couponFaceValueList"
            />
          </el-form-item>
          <el-form-item
            v-if="
              couponThemeViewContent.couponDiscountType == 0 &&
                couponThemeViewContent.couponFaceValueType != 1
            "
            key="couponDiscountType0"
            :label="$t('优惠券面值')"
            :rules="[{ required: true, message: '请输入优惠券面值', trigger: 'blur' }]"
            prop="couponAmount"
            name="couponAmount"
            class="coupon-discount-ext"
          >
            <ody-input-number
              v-model="couponThemeViewContent.couponAmount"
              :precision="1"
              :min="0.01"
              :max="9999999999.99"
              :decimal="2"
              name="couponThemeViewContent_couponAmount"
            />
            <span>{{ $t("元") }}</span>
          </el-form-item>
          <el-form-item
            v-if="couponThemeViewContent.couponDiscountType == 1"
            key="couponDiscountType1"
            class="coupon-discount-ext"
          >
            <template slot="label">
              <ody-tip-star :content="$t('优惠折扣')" />
            </template>
            <el-form-item
              :rules="{
                required: true,
                message: '优惠折扣不能为空',
                trigger: 'blur',
              }"
              style="display: inline-block; margin-bottom: 16px"
            >
              <el-input-number
                v-model="couponThemeViewContent.couponDiscount"
                :controls="false"
                :precision="1"
                :min="0.1"
                :max="9.9"
                name="couponThemeViewContent_couponDiscount"
                style="width: 150px"
              />
            </el-form-item>
            <span>{{ $t("折") }}</span>
            <span>{{ $t("折扣上限") }}</span>
            <el-form-item
              :rules="{
                required: true, message: '折扣上限必须填写有效金额', trigger: 'blur'
              }"
              prop="couponAmount"
              name="couponAmount"
              style="display: inline-block; margin-bottom: 16px"
            >
              <ody-input-number
                v-model="couponThemeViewContent.couponAmount"
                name="couponThemeViewContent_couponAmount"
              />
            </el-form-item>
            <span>{{ $t("元") }}</span>
          </el-form-item>
          <el-form-item
            v-if="
              couponThemeViewContent.couponGiveRule === 12 &&
                couponThemeViewContent.couponFaceValueType === 1
            "
          >
            <template slot="label">
              <ody-tip-star :content="$t('随机面值区间')" />
            </template>
            <el-form-item
              :rules="[
                {
                  required: true,
                  message: '优惠券随机金额不能为空',
                  trigger: 'blur',
                },
                { validator: validateStart, trigger: 'blur' },
              ]"
              style="display: inline-block; margin-bottom: 16px; width: 120px"
            >
              <ody-input-number
                v-model="couponThemeViewContent.couponAmount"
                name="couponThemeViewContent_couponAmount2"
              />
            </el-form-item>
            -
            <el-form-item
              :rules="[
                {
                  required: true,
                  message: '优惠券随机金额不能为空',
                  trigger: 'blur',
                },
                { validator: validateEnd, trigger: 'blur' },
              ]"
              style="display: inline-block; margin-bottom: 16px; width: 120px"
            >
              <ody-input-number
                v-model="couponThemeViewContent.couponAmountExt"
                name="couponThemeViewContent_couponAmountExt"
              />
            </el-form-item>
            <span>{{ $t("元") }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('发行总量')"
            class="coupon-discount-ext"
            prop="totalLimit"
            name="totalLimit"
          >
            <div class="coupon-limit">
              <ody-input-number
                v-model="couponThemeViewContent.totalLimit"
                :min="1"
                :max="999999999"
                :disabled="
                  couponThemeViewContent.couponGiveRule === 8 ||
                    couponThemeViewContent.couponGiveRule === 17
                "
                on-keypress="return(/[d.]/.test(String.fromCharCode(event.keyCode)))"
                name="couponThemeViewContent_totalLimit"
              />
              <span>{{ $t("张") }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('券活动日期')" prop="dataPicker" name="dataPicker">
            <el-date-picker
              v-model="couponThemeViewContent.dataPicker"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="couponThemeViewContent_dataPicker"
              type="datetimerange"
              range-separator="-"
            />
          </el-form-item>
          <el-form-item :label="$t('使用说明(中文)')" prop="themeDesc" name="themeDesc">
            <promotion-activity-description-input-chinese
              :rule-desc.sync="couponThemeViewContent.themeDesc"
              :maxlength="100"
            />
          </el-form-item>
          <el-form-item :label="$t('使用说明(英文)')" prop="themeDescLan2" name="themeDescLan2">
            <promotion-activity-description-input-english
              :rule-desc-lan.sync="couponThemeViewContent.themeDescLan2"
              :maxlength="100"
            />
          </el-form-item>
          <el-form-item
            v-if="
              couponThemeViewContent.applicationScope === 11 &&
                couponThemeViewContent.couponGiveRule === 4
            "
            :label="$t('用户前台直接领取')"
            prop="sourcePages"
            name="sourcePages"
          >
            <promotion-source-page-checkbox
              v-model="couponThemeViewContent.sourcePages"
              :is-show-all="true"
              :checked.sync="checked"
              name="couponThemeViewContent_sourcePages"
            />
          </el-form-item>
          <el-form-item
            v-if="
              couponThemeViewContent.pushPlatforms &&
                couponThemeViewContent.pushPlatforms.length > 0
            "
            :label="$t('上传商户LOGO')"
            class="coupon-limit"
            prop="mpPicUrl"
            name="mpPicUrl"
          >
            <ody-upload-image
              v-model="couponThemeViewContent.mpPicUrl"
              name="couponThemeViewContent_mpPicUrl"
            />
          </el-form-item>
          <el-form-item
            v-if="couponThemeViewContent.couponGiveRule === 12"
            :label="$t('分享标题')"
            class="coupon-limit"
            prop="shareTitle"
            name="shareTitle"
          >
            <el-input
              :placeholder="
                $t(
                  '随机面额券默认为拼手气,第{X}个领取的人得大红包；限输入30个字'
                )
              "
              v-model="couponThemeViewContent.shareTitle"
              name="couponThemeViewContent_shareTitle"
              maxlength="30"
            />
          </el-form-item>
          <el-form-item
            v-if="couponThemeViewContent.couponGiveRule === 12"
            :label="$t('分享描述')"
            class="coupon-limit"
            prop="shareDesc"
            name="shareDesc"
          >
            <el-input
              :placeholder="$t('默认为优惠券名称，限输入50个字')"
              v-model="couponThemeViewContent.shareDesc"
              name="couponThemeViewContent_shareDesc"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item
            v-if="couponThemeViewContent.couponGiveRule === 12"
            :label="$t('分享图片')"
            class="coupon-limit"
            prop="shareImgUrl"
            name="shareImgUrl"
          >
            <ody-upload-image
              v-model="couponThemeViewContent.shareImgUrl"
              name="couponThemeViewContent_shareImgUrl"
            />
          </el-form-item>
          <span
            v-if="couponThemeViewContent.couponGiveRule === 12"
            class="share-img-dsc"
          >
            建议尺寸100*100，仅限JPG、PNG格式，小于3M；
            <a
              name="getDefaultSharePic"
              class="img-click"
              @click="getDefaultSharePic"
            >{{ $t("点击查看默认的系统图") }}</a
            >
          </span>

          <ody-title :title="$t('使用规则')" />
          <div
            v-if="couponThemeViewContent.couponGiveRule != 102"
            class="receive-coupon-detail"
          >
            <ody-tip-star :content="$t('用券时间')" class="total-amount" />
            <el-form-item :space="2" class="coupon-use-time coupon-limit">
              <promotion-effdate-method-radio
                v-if="isLoaded"
                v-model="couponThemeViewContent.effdateCalcMethod"
                :time-config.sync="couponThemeViewContent.timeConfig"
                :data-picker.sync="couponThemeViewContent.dataPicker"
                :eff-days.sync="couponThemeViewContent.effDays"
                :coupon-type="couponThemeViewContent.couponType"
                name="couponThemeViewContent_effdateCalcMethod"
              />
            </el-form-item>
          </div>

          <el-form-item
            v-if="couponThemeViewContent.couponDeductionType === 0"
            class="coupon-use-time"
          >
            <template slot="label">
              <ody-tip-star :content="$t('使用条件')" />
            </template>
            <span>{{ $t("订单满") }}</span>
            <el-form-item
              prop="useLimit"
              name="useLimit"
              style="display: inline-block; margin-bottom: 16px"
            >
              <ody-input-number
                v-model="couponThemeViewContent.useLimit"
                :controls="false"
                :min="0.01"
                :max="999999999.99"
                :decimal="2"
                name="couponThemeViewContent_useLimit"
                style="width: 80px"
                @blur="useLimitUseLimit()"
              />
            </el-form-item>
            <span>{{ $t("元使用") }}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <template slot="themeTitle" slot-scope="scope">{{
        scope.row.themeTitle | keyVal(getCouponGiveRuleMap)
      }}</template>
      <el-col :span="10">
        <div class="giftCardCenter_rules_cardDetail_box">
          <div class="merchant-voucher">
            {{
              couponThemeViewContent.couponDeductionType
                | keyVal(getCouponDeductionTypeMap)
            }}
          </div>
          <el-row class="coupon-amount">
            <div class="coupon-detail">
              <div class="coupon-title">
                {{ couponThemeViewContent.themeTitle }}
              </div>
            </div>
            <div>
              <div class="amount">
                <span
                  v-show="
                    (couponThemeViewContent.couponDiscountType == 0 &&
                      couponThemeViewContent.couponGiveRule != 12) ||
                      (couponThemeViewContent.couponGiveRule == 12 &&
                      couponThemeViewContent.couponFaceValueType == 0)
                  "
                >{{ couponThemeViewContent.couponAmount }}</span
                >
                <div class="clearfix">
                  <span
                    v-show="
                      couponThemeViewContent.couponDiscountType == 1 &&
                        couponThemeViewContent.couponDiscount
                    "
                    style="float: right"
                  >{{ $t("折") }}</span
                  >
                  <span
                    v-show="couponThemeViewContent.couponDiscountType == 1"
                    style="float: right"
                  >
                    {{ couponThemeViewContent.couponDiscount }}
                  </span>
                </div>
                <div style="line-height: 12px">
                  <span
                    v-show="
                      couponThemeViewContent.couponDiscountType == 2 ||
                        (couponThemeViewContent.couponGiveRule == 12 &&
                        couponThemeViewContent.couponFaceValueType == 1)
                    "
                  >{{ $t("随机面值") }}</span
                  >
                  <span
                    v-show="
                      couponThemeViewContent.couponDiscountType == 1 &&
                        couponThemeViewContent.couponAmount
                    "
                    style="font-size: 14px"
                  >折扣上限{{ couponThemeViewContent.couponAmount }}</span
                  >
                </div>
              </div>
            </div>
          </el-row>

          <el-collapse
            v-model="activeNames"
            name="activeNames"
            class="coupon-use"
          >
            <el-collapse-item title name="1">
              <div class="use-detail">
                <span class="use-channel">
                  {{ $t("使用期限") }}：
                  <span
                    v-if="
                      couponThemeViewContent.effdateCalcMethod === 1 &&
                        couponThemeViewContent.startTimeConfig &&
                        couponThemeViewContent.endTimeConfig
                    "
                  >{{ couponThemeViewContent.startTimeConfig | parseTime }} -
                    {{ couponThemeViewContent.endTimeConfig | parseTime }}</span
                    >
                  <span
                    v-if="couponThemeViewContent.effdateCalcMethod === 2"
                  >自用户领取{{
                    couponThemeViewContent.effDays || "—"
                  }}天后失效</span
                  >
                </span>
                <div class="usage-description">
                  {{ $t("使用说明") }}：{{ couponThemeViewContent.themeDesc }}
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>
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
import constants from '@/utils/constants'
import PromotionCouponGiveRuleSelect from '@/components/promotion-coupon-give-rule-select'
import PromotionUserScopeCheckbox from '@/components/promotion-user-scope-checkbox'
import PromotionChannelArrCheckbox from '@/components/promotion-channel-arr-checkbox'
import PromotionCouponPushPlatformConfigCheckbox from '@/components/promotion-coupon-push-platform-config-checkbox'
import PromotionSourcePageCheckbox from '@/components/promotion-source-page-checkbox'
import PromotionDispatchChannelSelect from '@/components/promotion-dispatch-channel-select'
import PromotionMemberTypesCheckbox from '@/components/promotion-member-types-checkbox'
import PromotionMemberLevelsCheckbox from '@/components/promotion-member-levels-checkbox'
import PromotionCouponTypeRadio from '@/components/promotion-coupon-type-radio'
import PromotionCouponDeductionTypeRadio from '@/components/promotion-coupon-deduction-type-radio'
import PromotionCouponDiscountTypeRadio from '@/components/promotion-coupon-discount-type-radio'
import PromotionCouponDiscountTypeRadio1 from '@/components/promotion-coupon-discount-type-radio1'
import PromotionApplicationScopeRadio from '@/components/promotion-application-scope-radio'
import PromotionEffdateMethodRadio from '@/components/promotion-effdate-method-radio'
import PromotionActivityDescriptionInputChinese from '@/components/promotion-activity-description-input-chinese'
import PromotionActivityDescriptionInputEnglish from '@/components/promotion-activity-description-input-english'
export default {
  name: 'PromPromotionCouponThemeDetail',
  components: {
    PromotionCouponGiveRuleSelect,
    PromotionUserScopeCheckbox,
    PromotionChannelArrCheckbox,
    PromotionCouponPushPlatformConfigCheckbox,
    PromotionSourcePageCheckbox,
    PromotionDispatchChannelSelect,
    PromotionMemberTypesCheckbox,
    PromotionMemberLevelsCheckbox,
    PromotionCouponTypeRadio,
    PromotionCouponDeductionTypeRadio,
    PromotionCouponDiscountTypeRadio,
    PromotionCouponDiscountTypeRadio1,
    PromotionApplicationScopeRadio,
    PromotionEffdateMethodRadio,
    PromotionActivityDescriptionInputChinese,
    PromotionActivityDescriptionInputEnglish
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'text'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    promType: {
      type: String,
      default: ''
    },
    promotionId: {
      type: String,
      default: ''
    },
    selectApplicationScopeList: {
      type: String,
      default: 'applicationScopeList'
    }
  },
  data() {
    const vue = this
    const platformId = +this.$portal.getPlatformId()

    return {
      platformId,
      requiredList: [
        {
          value: 'couponGiveRule',
          label: '请选择发券类型'
        },
        {
          value: 'individualLimit',
          label: '请输入张数'
        },
        {
          value: 'everyDayLimit',
          label: '请输入张数'
        },
        {
          value: 'userScopeList',
          label: '请选择新老用户'
        },
        {
          value: 'memberTypes',
          label: '请选择会员类型'
        },
        {
          value: 'memberLevels',
          label: '请选择会员等级'
        },
        {
          value: 'receiveChannelCodes',
          label: '请选择渠道'
        },
        {
          value: 'themeTitle',
          label: '请输入中文名称'
        },
        {
          value: 'themeTitleLan2',
          label: '请输入英文名称'
        },
        // {
        //   value: 'applicationScope',
        //   label: '请选择适用范围'
        // },
        {
          value: 'couponAmount',
          label: '请输入优惠券面值'
        },
        {
          value: 'totalLimit',
          label: '请输入发行总量'
        },
        {
          value: 'startTime',
          label: '请选择时间'
        },
        {
          value: 'endTime',
          label: '请选择时间'
        },
        {
          value: 'themeDesc',
          label: '请输入中文使用说明'
        },
        {
          value: 'themeDescLan2',
          label: '请输入英文使用说明'
        },
        {
          value: 'startTimeConfig',
          label: '请选择时间'
        },
        {
          value: 'endTimeConfig',
          label: '请选择时间'
        },
        {
          value: 'useLimit',
          label: '请输入金额'
        },
        {
          value: 'shareNumLimit',
          label: '请输入人数'
        },

        {
          value: 'couponDiscount',
          label: '请输入优惠折扣'
        }
      ],
      isLoaded: false,
      activeNames: ['1'],
      needMemberTypeConfig: {
        value: null
      },
      needMemberLevelConfig: {
        value: null
      },
      pageViewConfig: {
        needPlatMemberTypeConfig: null,
        needPlatMemberLevelConfig: null,
        needPlatformConfig: null,
        needUserTypeConfig: null
      },
      everyDayLimitGiveRuleArr: [4, 12],
      couponDiscountExt: '',
      defaultSharePic: '',
      isShowDefaultPic: false,
      merchantSearch: {
        merchantCode: '',
        merchantName: ''
      },
      couponThemeViewContent: {
        mpPicUrl: '',
        shareTitle: '',
        shareDesc: '',
        shareImgUrl: '',
        id: this.promotionId,
        promotionType: this.promType,
        memberTypes: [], // 会员类型
        memberLevels: [], // 会员等级
        couponDeductionTypeList: [], // 金额抵扣类型数组
        couponDiscountTypes: [], // 优惠方式数组
        applicationScopes: [], // 适用范围数组
        userScopeList: [],
        receiveChannelCodes: {}, // 使用渠道
        pushPlatforms: [], // 推送渠道
        couponGiveRule: 4,
        shareNumLimit: undefined,
        individualLimit: undefined,
        everyDayLimit: undefined,
        themeTitle: undefined,
        themeTitleLan2: undefined,
        couponType: 0, // 优惠券种类
        couponDeductionType: 0, // 金额抵扣类型
        couponDiscountType: 0, // 优惠方式
        couponFaceValueType: 0, // 优惠券面值
        couponDiscount: undefined,
        applicationScope: platformId === 1 ? 0 : 11, // 适用范围
        couponAmount: '',
        totalLimit: undefined,
        themeDesc: undefined,
        themeDescLan2: undefined,
        effDays: '',
        useLimit: null,
        startTime: '',
        endTime: '',
        startTimeConfig: '',
        endTimeConfig: '',
        dispatchChannel: undefined,
        sourcePages: [], // 用户前台领取

        // 缺少的入参
        userTypeLimit: 0,
        themeType: 0,
        paymentTypes: [],
        payTypeLimit: 0,
        orderUseLimit: 1,
        merchantIdList: [],
        effdateCalcMethod: 1,
        applicablePlatform: 0,
        applicablePlatformList: [1, 3, 4, 6],
        /**
         * 0: {id: 1, text: "APP"}
          1: {id: 3, text: "H5"}
          2: {id: 4, text: "小程序"}
          3: {id: 6, text: "POS"}
         */
        participantTypeList: [],
        departmentId: 0,
        dataPicker: [],
        timeConfig: []
      },
      userMemberType: undefined, // 会员类型
      memberTypesSelected: [],
      couponDeductionTypeSelected: [],
      paymentTypeSelected: [],
      paymentTypeAllSelected: [],
      timeChecked: true,
      rules: {
        couponAmount: [
          { required: true, message: '请输入优惠券面值', trigger: 'blur' }
        ],
        dataPicker: [
          {
            required: true,
            type: 'array',
            message: '请选择时间',
            trigger: 'blur'
          }
        ],
        couponGiveRule: [
          { required: true, message: '请选择发券类型', trigger: 'change' }
        ],
        individualLimit: [
          { required: true, message: '请输入张数', trigger: 'blur' }
        ],
        everyDayLimit: [
          { required: true, message: '请输入张数', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (
                Number.isInteger(Number(value)) &&
                Number(value) > 0 &&
                Number(value) < 999999999
              ) {
                callback()
              } else {
                vue.$message.error(this.$t('请输入1-9个字符'))
                callback(new Error('请输入1-9个字符'))
              }
            }
          }
        ],
        themeTitle: [
          { required: true, message: '请输入中文名称', trigger: 'blur' }
        ],
        receiveChannelCodes: [
          {
            type: 'array',
            required: true,
            message: '请选择渠道',
            trigger: 'change'
          }
        ],
        themeTitleLan2: [
          { required: false, message: '请输入英文名称', trigger: 'blur' }
        ],
        // couponAmount: [
        //   { required: true, message: '请输入优惠券面值', trigger: 'blur' },
        //   {
        //     pattern: /^(?!0+$)(?!0*\.0*$)\d{1,9}(\.\d{1,2})?$/,
        //     message: '请输入2位小数且整数输入9位以内'
        //   }
        // ],
        totalLimit: [
          { required: true, message: '请输入发行总量', trigger: 'blur' }
        ],
        themeDesc: [
          { required: true, message: '请输入中文使用说明', trigger: 'blur' }
        ],
        themeDescLan2: [
          { required: false, message: '请输入英文使用说明', trigger: 'blur' }
        ],
        useLimit: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        couponDiscount: [
          { required: true, message: '请输入优惠折扣', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (
                !vue.couponThemeViewContent.couponAmount &&
                vue.couponThemeViewContent.couponAmount !== 0
              ) {
                vue.$message.error(this.$t('请输入折扣上限'))
                callback(new Error('请输入折扣上限'))
                return false
              }
              callback()
            }
          }
        ],
        applicationScope: [
          { required: true, message: '请选择适用范围', trigger: 'change' }
        ],
        userScopeList: [
          {
            type: 'array',
            required: true,
            message: this.$t('请选择新老用户'),
            trigger: 'change'
          }
        ],
        memberLevels: [
          {
            type: 'array',
            required: true,
            message: this.$t('请选择会员等级'),
            trigger: 'change'
          }
        ],
        memberTypes: [
          {
            type: 'array',
            required: true,
            message: this.$t('请选择会员类型'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    getCouponGiveRuleMap() {
      return constants.couponGiveRuleList[this.platformId].reduce(
        (rtv, item) => {
          rtv[item.value] = item.label
          return rtv
        },
        {}
      )
    },
    getCouponTypeMap() {
      return constants.couponTypeMapList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getCouponDeductionTypeMap() {
      return constants.couponDeductionTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getCouponDiscountTypeMap() {
      return constants.couponTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getChannelArrMap() {
      return constants.channelArrList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  watch: {
    'couponThemeViewContent.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected.length > 0) {
            this.couponThemeViewContent.memberLevels =
              this.memberTypesSelected.reduce((rtv, item) => {
                if (item.memberLevelList.length > 0) {
                  rtv = [
                    ...rtv,
                    ...item.memberLevelList.map((x) => x.levelCode)
                  ]
                  return rtv
                }
              }, [])
          }

          if (val && val.length <= 0) {
            this.couponThemeViewContent.memberLevels = []
          }
        })
      }
    },
    'couponThemeViewContent.couponDeductionType': function(val) {
      if (val === 1) {
        this.couponThemeViewContent.couponDiscountType = 0
        this.couponThemeViewContent.useLimit = null
        this.couponThemeViewContent.applicationScope = 11
        this.couponThemeViewContent.applicablePlatformList = [1, 3, 4, 6]
        /**
         * 0: {id: 1, text: "APP"}
          1: {id: 3, text: "H5"}
          2: {id: 4, text: "小程序"}
          3: {id: 6, text: "POS"}
         */
        this.couponThemeViewContent.participantTypeList = [1, 2]
      }
      if (val === 0) {
        this.couponThemeViewContent.couponDiscountType = 0
        this.couponThemeViewContent.applicationScope = 11
        this.couponThemeViewContent.applicablePlatformList = [1, 3, 4, 6]
        this.couponThemeViewContent.participantTypeList = [1, 2]
      }
    },
    'couponThemeViewContent.applicationScope': {
      handler(val) {
        if (val === 0) {
          this.couponThemeViewContent.themeType = 11
        }
        this.$emit('changeStep', val)
      },
      immediate: true
    },
    'couponThemeViewContent.dataPicker': function(val) {
      if (val && val.length) {
        this.couponThemeViewContent.startTime = this.$moment(
          val[0]
        ).toISOString()
        this.couponThemeViewContent.endTime = this.$moment(
          val[1]
        ).toISOString()
      }
    },
    'couponThemeViewContent.timeConfig': function(val) {
      if (val && val.length) {
        this.couponThemeViewContent.startTimeConfig = this.$moment(
          val[0]
        ).toISOString()
        this.couponThemeViewContent.endTimeConfig = this.$moment(
          val[1]
        ).toISOString()
      }
    },
    'couponThemeViewContent.couponGiveRule': function(val) {
      if (val === 8) {
        this.couponThemeViewContent.totalLimit = 999999999
        this.couponThemeViewContent.effdateCalcMethod = 2
        this.couponThemeViewContent.effDays = 30
        // this.couponThemeViewContent.startTimeConfig = ''
        // this.couponThemeViewContent.endTimeConfig = ''
      } else if (val === 17) {
        this.couponThemeViewContent.totalLimit = 999999999
      } else if (val === 12) {
        this.couponThemeViewContent.couponDiscountType = 0
        this.couponThemeViewContent.couponType = 0
        this.couponThemeViewContent.couponDeductionType = 0
        this.couponThemeViewContent.applicationScope = 0
        // this.couponThemeViewContent.effDays = ''
      } else if (val === 102) {
        this.couponThemeViewContent.effdateCalcMethod = 1
        this.couponThemeViewContent.startTimeConfig = ''
        this.couponThemeViewContent.endTimeConfig = ''
        this.couponThemeViewContent.couponDiscountType = 0
        this.couponThemeViewContent.couponType = 0
        this.couponThemeViewContent.couponDeductionType = 0
      } else {
        if (this.promotionId === '') {
          this.couponThemeViewContent.totalLimit = ''
          this.couponThemeViewContent.effDays = ''
        }
      }
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    this.platformId = +this.$portal.getPlatformId()
    // console.log(this.platformId, 789789)
    if (this.promotionId !== '') {
      await this.getQueryCouponDetailById()
    } else {
      await this.queryPromotionActivityDetail()
    }

    if (this.couponThemeViewContent.dataPicker != null) {
      this.couponThemeViewContent.startTime = this.$moment(
        this.couponThemeViewContent.dataPicker[0]
      ).toISOString()
      this.couponThemeViewContent.endTime = this.$moment(
        this.couponThemeViewContent.dataPicker[1]
      ).toISOString()
    }

    await this.queryLoadOscConfigUrl()
    await this.queryAuthMerchantPageUrl()
    this.isLoaded = true
    // this.query()
  },
  methods: {
    validateStart(rule, value, callback) {
      if (this.couponThemeViewContent.couponAmountExt) {
        if (
          this.couponThemeViewContent.couponAmount >
          this.couponThemeViewContent.couponAmountExt
        ) {
          this.$message.error('随机面值开始不能大于结束')
          callback(new Error(this.$t('随机面值开始不能大于结束')))
        }
      }
    },
    validateEnd(rule, value, callback) {
      if (this.couponThemeViewContent.couponAmount) {
        if (
          this.couponThemeViewContent.couponAmountExt <
          this.couponThemeViewContent.couponAmount
        ) {
          this.$message.error('随机面值结束不能小于开始')
          callback(new Error(this.$t('随机面值结束不能小于开始')))
        }
      }
    },
    useLimitUseLimit() {
      if (
        this.couponThemeViewContent.useLimit &&
        +this.couponThemeViewContent.couponAmount >
          +this.couponThemeViewContent.useLimit
      ) {
        this.$message.warning(
          this.$t('优惠券使用门槛小于优惠券面值，确定要设置？')
        )
      }
    },
    canShowMemberLevel() {
      if (this.needMemberTypeConfig.value === '1') {
        return this.canShowMemberTypeAndLevel()
      }
    },
    // 是否显示会员等级会员类型:除前台领券外不做限制,新增下单分享券不做限制
    canShowMemberTypeAndLevel() {
      if (this.couponThemeViewContent.couponGiveRule === 12) {
        return true
      }
      return (
        this.couponThemeViewContent.couponGiveRule === 4 ||
        this.couponThemeViewContent.couponGiveRule === 18
      )
    },

    canShowMemberType() {
      if (this.needMemberTypeConfig.value === '1') {
        return this.canShowMemberTypeAndLevel()
      }
      // 当页面配置取券活动配置的时候
      return false
    },
    async queryLoadOscConfigUrl() {
      const params = 'PAGE_CONFIG_NOT_SAME'
      const { data = {}} =
        await this.promotionAPI.getLoadPageConfigCommonOscUrl(params)

      // this.promotionDetailData = data
      // this.pageViewConfig.needPlatformConfig = data.NEED_PLATFORM_CONFIG
      // this.pageViewConfig.needUserTypeConfig = data.NEED_USER_TYPE_CONFIG
      this.needMemberTypeConfig.value = data.NEED_MEMBER_TYPE_CONFIG
      this.platformId = data.platformId
      this.needMemberLevelConfig.value = data.NEED_MEMBER_LEVEL_CONFIG
      this.pageViewConfig.needPlatMemberTypeConfig =
        data.NEED_MEMBER_TYPE_CONFIG
      this.pageViewConfig.needPlatMemberLevelConfig =
        data.NEED_MEMBER_LEVEL_CONFIG
      this.pageViewConfig.needPlatformConfig = data.NEED_PLATFORM_CONFIG
      this.pageViewConfig.needUserTypeConfig = data.NEED_USER_TYPE_CONFIG
    },
    // 领取对象显示
    userTypeLimitShow() {
      // 发券类型为2-注册自动发放 或 8-生日券发放 时，隐藏领取对象
      if (+this.pageViewConfig.needUserTypeConfig === 1) {
        return !(
          this.couponThemeViewContent.couponGiveRule === 11 ||
          this.couponThemeViewContent.couponGiveRule === 16 ||
          this.couponThemeViewContent.couponGiveRule === 2 ||
          this.couponThemeViewContent.couponGiveRule === 8
        )
      }
      return false
    },
    async queryAuthMerchantPageUrl() {
      const params = {
        currentPage: 1,
        itemsPerPage: 10
      }

      const { data: { listObj: allAuthMerchant = [] } = {}} =
        await this.promotionAPI.queryAuthMerchantPageUrl(params)

      this.couponThemeViewContent.merchantIdList = allAuthMerchant.map(
        (x) => x.merchantId
      )
    },
    // 显示个人
    canShowActivityPlatformLimitShow() {
      return this.userTypeLimitShow()
    },
    // 活动平台显示
    platformLimitShow() {
      return (
        +this.pageViewConfig.needPlatformConfig === 1 &&
        this.couponThemeViewContent.couponGiveRule === 10
      )
    },
    /**
     * 是否展示个人每日限领数量
     * @returns {boolean}
     */
    canShowEveryDayLimit() {
      // debugger
      return this.everyDayLimitGiveRuleArr.includes(
        this.couponThemeViewContent.couponGiveRule
      )
    },
    // 优惠券面值种类变化
    couponFaceValueTypeChange() {
      if (this.couponThemeViewContent.couponFaceValueType === 0) {
        this.couponThemeViewContent.couponDiscountType = 0
        this.couponDiscountExt = null
      }
      if (this.couponThemeViewContent.couponFaceValueType === 0) {
        this.defaultShareTitle = this.$t('固定面值')
      } else if (this.couponThemeViewContent.couponFaceValueType === 1) {
        this.defaultShareTitle = this.$t(' 随机面值')
      }
    },
    async getDefaultSharePic() {
      const { code, data = {}} =
        await this.$promotion.$api.promotion.loadOscConfigUrl(
          'DEFAULT_SHARE_PIC',
          {}
        )
      if (code === '0' && data.result) {
        this.isShowDefaultPic = true
        this.defaultSharePic = data.result
      }
    },
    async query() {
      const data = await this.getCouponActivity()

      return data || []
    },
    getCouponActivity() {
      this.$refs['couponThemeViewContent'].validate(async(valid) => {
        if (valid) {
          const params = this.couponThemeViewContent
          const { data = {}} =
            await this.$promotion.$api.promotion.saveCouponActivity(params, {})
          if (data) {
            this.$router.push({
              name: 'PromPromotionCouponThemeCreate',
              params: {}
            })
          }
        } else {
          return false
        }
      })
    },
    handleMemberLevelsChange(type, isChecked) {
      const beforeIndex = this.couponThemeViewContent.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected.findIndex((item) => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.couponThemeViewContent.memberTypes.push(type)
          this.memberTypesSelected = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.couponThemeViewContent.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected.splice(beforeTypeIndex, 1)
        }
      }
    },
    //
    async couponDeductionTypeChange() {
      // const { data = {}} = await this.$promotion.$api.promotion.loadCouponPageConfig('COUPON_PAGE_CONFIG', {})
      if (this.couponThemeViewContent.couponDeductionType === 0) {
        // this.couponThemeViewContent.couponDiscountTypes = data.COUPON_DISCOUNT_TYPE
        // this.deliveryTypeSelected = []
      } else if (this.couponThemeViewContent.couponDeductionType === 1) {
        this.couponThemeViewContent.couponDiscountType = 0
        // this.couponThemeViewContent.couponDiscountTypes.push({
        //   id: data.COUPON_DISCOUNT_TYPE[1].id,
        //   text: data.COUPON_DISCOUNT_TYPE[1].text
        // })
        this.couponThemeViewContent.useLimit = null
        this.couponThemeViewContent.applicationScope = 11
      }
    },
    async getQueryCouponDetailById() {
      const params = {
        id: this.promotionId
      }
      const { data = {}, code } = await this.promotionAPI.queryCouponDetailById(
        params
      )
      if (code === '0' && data) {
        data.useLimit = data.useLimit || null
        this.couponThemeViewContent = data
        if (data.couponDiscount && data.couponDiscount >= 10) {
          this.couponThemeViewContent.couponDiscount = data.couponDiscount / 10
        } else {
          this.couponThemeViewContent.couponDiscount = 0
        }
        this.couponThemeViewContent.totalLimit = data.totalLimit
        this.couponThemeViewContent.effdateCalcMethod = data.effdateCalcMethod
        // 处理不同ThemeType，适用范围applicationScope默认勾选值不一样
        this.couponThemeViewContent.applicationScope = data.themeType

        if (data.memberTypes) {
          this.couponThemeViewContent.memberTypes = data.memberTypes
        }
        if (data.startTime && data.endTime) {
          const startTime = await this.format(data.startTime)
          const endTime = await this.format(data.endTime)
          this.$set(this.couponThemeViewContent, 'dataPicker', [
            startTime,
            endTime
          ])
        }
        if (data.startTimeConfig && data.endTimeConfig) {
          const startTimeConfig = await this.format(data.startTimeConfig)
          const endTimeConfig = await this.format(data.endTimeConfig)
          this.$set(this.couponThemeViewContent, 'timeConfig', [
            startTimeConfig,
            endTimeConfig
          ])
        }
        // if (data.couponDiscount && data.couponDiscount >= 10) {
        //   this.couponThemeViewContent.couponDiscount = data.couponDiscount / 10
        // } else {
        //   this.couponThemeViewContent.couponDiscount = 0
        // }
      }
    },
    addTime(m) {
      return m < 10 ? '0' + m : m
    },
    format(shijianchuo) {
      // shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      return (
        y +
        '-' +
        this.addTime(m) +
        '-' +
        this.addTime(d) +
        ' ' +
        this.addTime(h) +
        ':' +
        this.addTime(mm) +
        ':' +
        this.addTime(s)
      )
    },
    async queryPromotionActivityDetail() {
      if (this.couponThemeViewContent.id === '') {
        return
      }

      const {
        data = {},
        data: {
          startTime = '',
          endTime = '',
          startTimeConfig = '',
          endTimeConfig = ''
        },
        code
      } = await this.promotionAPI.queryCouponDetailById(
        this.couponThemeViewContent
      )

      if (code === '0') {
        this.couponThemeViewContent = data
        this.$set(this.couponThemeViewContent, 'dataPicker', [
          startTime,
          endTime
        ])
        this.$set(this.couponThemeViewContent, 'timeConfig', [
          startTimeConfig,
          endTimeConfig
        ])
      }
    },
    couponAmountE(e) {
      if (e >= 500) {
        this.$message.warning(this.$t('优惠劵面值较大，确定要设置？'))
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.glyphicon {
  width: 15px;
  height: 15px;
  display: inline-block;
  padding-left: 4px;
  border-radius: 50%;
  background-color: black;
  color: #ffffff;
}
// .glyphicon-text {
//   background-color: black;
// }
.cp-coupon-theme-list {
  .el-step__title {
    font-size: 14px;
  }
  .giftCardCenter_rules_cardDetail_box {
    margin-top: 100px;
    margin-left: 40px;
    width: 320px;
    height: 182px;
    box-shadow: 0px 0px 6px 0px rgba(154, 170, 180, 0.2);
    border-radius: 4px;
  }
  .merchant-voucher {
    font-size: 12px;
    line-height: 17px;
    margin-left: 10px;
    color: rgba(69, 90, 100, 1);
    box-shadow: 0px 0px 6px 0px rgba(154, 170, 180, 0.2);
  }
  .coupon-amount {
    width: 100%;
    height: 150px;
    background: url("./images/4.png");
    background-position: center top;
    background-repeat: no-repeat;
    color: #fff;
    text-align: right;
    padding-right: 10px;
    .amount {
      margin-top: 10px;
      font-size: 50px;
      line-height: 60px;
      height: 60px;
      padding-right: 12px;
      .money-symbol {
        font-size: 26px;
      }
    }
    .coupon-name {
      font-size: 12px;
      line-height: 17px;
    }
  }
  .coupon-detail {
    color: #697a82;
    // height: 92px;
    position: relative;
    .coupon-title {
      font-size: 14px;
      font-weight: 500;
      height: 28px;
      line-height: 28px;
      text-align: left;
      color: yellow;
      padding-left: 10px;
    }
    .coupon-condition {
      font-size: 12px;
      line-height: 24px;
      height: 36px;
    }
    .coupon-deadline {
      font-size: 12px;
      position: absolute;
      bottom: 5px;
    }
  }
  .coupon-use {
    font-size: 12px;
    line-height: 17px;
    .use-detail {
      width: 290px;
      float: left;
      margin-top: 10px;
    }
  }
  .right-coupon-detail {
    .coupon-type {
      /deep/ {
        .el-input {
          // width: 210px;
        }
      }
    }
    .receive-coupon-limit {
      font-size: 14px;
      /deep/ {
        .el-form-item__content {
          margin-left: 0 !important;
        }
        .el-input {
          width: 100px;
        }
      }
    }
    .receive-coupon-detail {
      font-size: 14px;
      margin-left: 36px;
      /deep/ {
        .el-form-item__content {
          margin-left: 0 !important;
        }
        .el-input {
          width: 100px;
        }
      }
      .spacing {
        margin-left: 20px;
      }
      .coupon-limit {
        display: inline-block;
      }
      .total-amount {
        margin-left: 12px;
      }
    }
    .instructions-use {
      padding: 20px 0;
    }
    .coupon-use-time {
      /deep/ {
        .el-input {
          width: 74px;
        }
      }
      .eff-days {
        margin-top: 10px;
      }
    }
  }
  .every-day-limit {
    margin-left: 50px;
  }
  .share-img-dsc {
    font-size: 12px;
    margin-left: 100px;
  }
  .img-click {
    color: #00a0e9;
  }
  .coupon-discount-ext {
    width: 600px;
    /deep/ {
      .el-input--medium {
        width: 150px;
      }
    }
  }
  .default-share-pic {
    .wrap {
      text-align: center;
    }
  }
  .tip {
    display: inline-block;
    height: 32px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(69, 90, 100, 1);
    line-height: 16px;
  }
  /deep/ {
    .el-collapse-item__wrap {
      border-bottom: none;
      margin-top: -44px;
    }
    .el-collapse {
      border: none;
    }
    .el-collapse-item__header {
      border-bottom: none;
    }
  }
}
</style>
