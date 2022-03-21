<template>
  <section class="pg-member-detail">
    <ody-box>
      <el-tabs v-model="activeName" name="activeName" tab-position="left" @tab-click="handleClick">
        <el-tab-pane
          v-if="$portal.hasPermission('30890350')"
          :label="$t('member_information')"
          name="userBaseInfo"
        >
          <el-form ref="form" :rules="baseInfoRules" :model="userBaseInfo" label-width="180px">
            <el-form-item :label="$t('user_status')" label-width="70px">
              <el-switch
                :disabled="!editFunction || switching"
                :active-value="1"
                :inactive-value="0"
                v-model="userBaseInfo.isAvailable"
                :active-text="userBaseInfo.isAvailable === 1 ? '启用' : userBaseInfo.isAvailable === 2 ? '注销' : '停用'"
                name="userBaseInfo_isAvailable"
                @change="handleUpdateStatus(userBaseInfo.isAvailable)"
              />
            </el-form-item>
            <ody-title :title="$t('member_information')" />
            <el-form-item :label="$t('member_head')" class="inner-form">
              <ody-upload-image
                v-model="userBaseInfo.headPicUrl"
                :pic-type="picType"
                :show-tip="true"
                name="userBaseInfo_headPicUrl"
                disabled
              />
            </el-form-item>
            <el-form-item :label="$t('member_nickname')" class="inner-form">
              <el-input v-model="userBaseInfo.nickName" name="userBaseInfo_nickName" disabled />
            </el-form-item>
            <el-form-item :label="$t('remark_name')" class="inner-form">
              <el-input v-model="userBaseInfo.remarks" :disabled="!editFunction" name="userBaseInfo_remarks" maxlength="20" />
            </el-form-item>
            <el-form-item :label="$t('membership_account')" class="inner-form">
              <el-input v-model="userAccount.mobile" name="userAccount_mobile" disabled />
            </el-form-item>
            <el-form-item :label="$t('registration_time')" class="inner-form">
              <el-date-picker
                v-model="userAccount.createTime"
                :placeholder="$t('choose_date')"
                name="userAccount_createTime"
                type="datetime"
                disabled
              />
            </el-form-item>
            <el-form-item :label="$t('cell_phone_number')" class="inner-form">
              <el-input v-model="userAccount.mobile" name="userAccount_mobile9" disabled />
            </el-form-item>
            <div class="gap" />
            <ody-title :title="$t('member_material')" />
            <el-form-item :label="$t('membership_sex')" class="inner-form">
              <el-select
                v-model="userBaseInfo.sex"
                :placeholder="$t('please_choose')"
                :disabled="!editFunction"
                name="userBaseInfo_sex"
              >
                <el-option
                  v-for="item in sex"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('birthday')" class="inner-form">
              <el-date-picker
                v-model="userBaseInfo.birthday"
                :placeholder="$t('choose_date')"
                :disabled="!editFunction"
                name="userBaseInfo_birthday"
                type="date"
                format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item :label="$t('constellation')" class="inner-form">
              <el-select
                v-model="userBaseInfo.constellation"
                :placeholder="$t('please_choose')"
                :disabled="!editFunction"
                name="userBaseInfo_constellation"
              >
                <el-option
                  v-for="item in constellationList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  :disabled="!editFunction"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('animal_sign')" class="inner-form">
              <el-select
                v-model="userBaseInfo.animalSign"
                :placeholder="$t('please_choose')"
                :disabled="!editFunction"
                name="userBaseInfo_animalSign"
              >
                <el-option
                  v-for="item in animalSignList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('education_background')" class="inner-form">
              <el-select
                v-model="userBaseInfo.education"
                :placeholder="$t('please_choose')"
                :disabled="!editFunction"
                name="userBaseInfo_education"
              >
                <el-option
                  v-for="item in educationList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <div class="gap" />
            <ody-title :title="$t('note_information')" />
            <el-form-item :label="$t('guide_desc')" class="inner-form">
              <el-input v-model="userBaseInfo.guideDesc" name="userBaseInfo_guideDesc" type="textarea" disabled />
            </el-form-item>
            <el-form-item :label="$t('background_desc')" class="inner-form">
              <el-input
                v-model="userBaseInfo.platformRemark"
                :disabled="!editFunction"
                name="userBaseInfo_platformRemark"
                type="textarea"
                maxlength="200"
              />
            </el-form-item>
            <div class="gap" />
            <ody-title :title="$t('guide_information')" />
            <el-form-item :label="$t('binding_store')" class="inner-form">
              <el-input v-model="userBaseInfo.boundStoreName" name="userBaseInfo_boundStoreName" disabled />
            </el-form-item>
            <el-form-item :label="$t('binding_guide')" class="inner-form">
              <el-input v-model="userBaseInfo.guideIdentityCardName" name="userBaseInfo_guideIdentityCardName" disabled />
            </el-form-item>
            <el-form-item>
              <el-button name="tolist" size="small" @click="tolist">{{ $t('return') }}</el-button>
              <el-button
                :disabled="!editFunction"
                name="saveUserBaseInfo"
                size="small"
                type="primary"
                @click="saveUserBaseInfo"
              >
                {{
                $t('preservation') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          v-if="$portal.hasPermission('30890351')"
          :label="$t('binding_information')"
          name="bindingInformation"
        >
          <el-col :span="20">
            <!--            <ody-title :title="$t('social_account_binding')" >asdas</ody-title>-->
            <el-row>
              <el-image
                src="https://cdn.oudianyun.com/trunk/back-cms-web/1582899718275_46.12529282171492_481d41c7-636a-4b78-9d4a-ece81b00e9b4.jpeg"
                style="width: 30px; height: 30px;margin-left: 30px"
              />
              <span>{{ $t('微信') }}</span>
              <hr style="opacity: 0.1;margin-left: 30px" >
            </el-row>
            <el-row>
              <el-form :model="bindingInformation" label-width="180px">
                <el-form-item :label="$t('head_portrait')" class="inner-form">
                  <el-image
                    v-if="bindingInformation.wechantHeadPicUrl"
                    :src="bindingInformation.wechantHeadPicUrl"
                    :fit="cover"
                    style="width: 100px; height: 100px"
                  />
                </el-form-item>
                <el-form-item :label="$t('nickname')" class="inner-form">
                  <el-input v-model="bindingInformation.oauthUsername" name="bindingInformation_oauthUsername" disabled />
                </el-form-item>
                <el-form-item :label="$t('binding_time')" class="inner-form">
                  <el-date-picker
                    v-model="bindingInformation.updateTime"
                    :placeholder="$t('choose_date')"
                    name="bindingInformation_updateTime"
                    type="datetime"
                    disabled
                  />
                </el-form-item>
              </el-form>
            </el-row>
          </el-col>
          <el-col :span="3" :offset="1">
            <el-button
              v-if="bindingInformation.wechantHeadPicUrl"
              :disabled="!editFunction"
              name="removeBind"
              size="mini"
              type="primary"
              @click="removeBind(2)"
            >{{ $t('解除绑定') }}</el-button>
          </el-col>
        </el-tab-pane>
        <!--权益tab-->
        <el-tab-pane
          v-if="$portal.hasPermission('30890352')"
          :label="$t('rights_and_interests_information')"
          name="userLegalRightInfo"
        >
          <memberInterests ref="memberInterests" :user-id="$route.query.userId" />
          <!-- 下面为权益tab原本的代码，新逻辑写在memberInterests里，旧代码供参考移植使用，后续清除 -->
          <!-- <el-form label-width="180px">
            <ody-title :title="$t('member_interests')" />
            <el-form-item :label="$t('growth_value')" class="inner-form">
              <span class="number">{{ crmDetail.growthAccountInfo.balanceAmount }}</span>
              <add-modal
                :disabled="!editFunction"
                :type="2"
                :title="$t('调整成长值')"
                :user-id="$route.query.userId"
                :ok="getUserBaseInfoById"
              />
            </el-form-item>
            <el-form-item :label="$t('integral')" class="inner-form">
              <span class="number">{{ crmDetail.pointAccountInfo.balanceAmount }}</span>
              <add-modal
                :disabled="!editFunction"
                :type="1"
                :title="$t('调整积分')"
                :user-id="$route.query.userId"
                :ok="queryPointDetail"
              />
            </el-form-item>
            <div class="gap" />
            <ody-title :title="$t('membership_grade')" />
            <el-form-item :label="$t('member_type')" class="inner-form">
              <el-input v-model="crmDetail.memberTypeInfo.name" name="crmDetail_memberTypeInfo_name" disabled />
            </el-form-item>
            <el-form-item :label="$t('membership_grade')" class="inner-form">
              <el-input
                v-if="crmDetail.memberLevelInfo != null"
                v-model="crmDetail.memberLevelInfo.levelName"
                name="crmDetail_memberLevelInfo_levelName"
                disabled
              />
              <el-input v-else disabled />
            </el-form-item>
          </el-form>-->
        </el-tab-pane>
        <el-tab-pane
          v-if="$portal.hasPermission('OuserCenterMemberPointDetail')"
          :label="$t('会员积分')"
          name="memberPointInfo"
        >
          <MemberPoint ref="MemberPoint" :user-id="$route.query.userId" />
        </el-tab-pane>

        <!--优惠券tab-->
        <el-tab-pane
          v-if="$portal.hasPermission('30890352')"
          :label="$t('member_coupons')"
          name="memberCouponInfo"
        >
          <el-form label-width="180px">
            <ody-title :title="$t('coupon')" />
            <ody-title :title="couponCount + $t('Zhang')" />
            <hr >
            <div class="gap" />
            <ody-title :title="$t('member_coupons')" />
            <ody-list-search-area>
              <div slot="content">
                <el-form
                  ref="couponSearchForm"
                  :model="couponsSearchForm.obj"
                  label-width="100px"
                  class="form"
                >
                  <ody-search-item :label="$t('coupons_name')" prop="obj.couponActivityName">
                    <el-input
                      v-model="couponsSearchForm.obj.couponActivityName"
                      :placeholder="$t('请输入')"
                      name="couponsSearchForm_obj_couponActivityName"
                    />
                  </ody-search-item>
                  <ody-search-item
                    :label="$t('coupons_id')"
                    :rules="[
                      { pattern: /^[0-9]*$/, message: this.$t('仅支持数字'), trigger: 'change' },
                      { min: 0, max: 18, message: this.$t('长度在') + ' 0 ' + this.$t('到') + ' 18 ' + this.$t('个字符'), trigger: 'change' }
                    ]"
                    type="text"
                    prop="obj.couponId">
                    <el-input v-model="couponsSearchForm.obj.couponId" name="couponsSearchForm_obj_couponId" />
                  </ody-search-item>
                </el-form>
              </div>
              <div slot="btn">
                <el-button name="handleCouponSearchReset" size="small" @click="handleCouponSearchReset">{{ $t('reset') }}</el-button>
                <ody-button
                  name="OuserCenterMemberListCouponSearch_couponsFindDeviceAll"
                  size="small"
                  type="primary"
                  code="OuserCenterMemberListCouponSearch"
                  @click="couponsFindDeviceAll"
                >{{ $t('query') }}</ody-button>
              </div>
            </ody-list-search-area>
            <ody-table
              :can-filter="false"
              :data="couponsListTable.list"
              :columns="couponsListTable.columns"
              name="couponsListTable_list041"
            />
            <ody-pagination
              :current-page.sync="couponsSearchForm.currentPage"
              :list="couponsListTable.list"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="couponsSearchForm.itemsPerPage"
              :total.sync="couponsListTable.total"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="couponsFindDeviceAll"
              @current-change="couponsFindDeviceAll"
            />
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          v-if="$portal.hasPermission('30890353')"
          :label="$t('equipment_information')"
          name="userDeviceInfo"
        >
          <ody-title :title="$t('login_information')" />
          <ody-table :can-filter="false" :data="listTable.list" :columns="listTable.columns" name="listTable_list087" />

          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="findDeviceAll"
            @current-change="findDeviceAll"
          />
        </el-tab-pane>

        <el-tab-pane
          v-if="$portal.hasPermission('30890354')"
          :label="$t('member_portrait')"
          name="userPortraitInfo"
        >
          <el-form label-width="100px">
            <ody-title :title="$t('system_label')" />
            <el-tag
              v-for="tag in systemLabelTags"
              :key="tag.labelId"
              type="info"
              size="medium"
              class="tag"
            >{{ tag.labelName }}</el-tag>
            <div class="gap" />
            <ody-title :title="$t('combine_label')" />
            <el-tag
              v-for="tag in combineLabelTags"
              :key="tag.labelId"
              type="info"
              size="medium"
              class="tag"
            >{{ tag.labelName }}</el-tag>
            <div class="gap" />
            <ody-title :title="$t('manual_label')" />
            <el-tag
              v-for="tag in manualLabelTags"
              :key="tag.labelId"
              :disable-transitions="false"
              size="medium"
              type="info"
              class="tag"
              closable
              @close="handleCloseManualLabel(tag.labelId)"
            >{{ tag.labelName }}</el-tag>
            <el-button
              :disable-transitions="false"
              name="showAddLabelModal"
              size="small"
              type="text"
              class="width-auto"
              @click="showAddLabelModal"
            >+添加</el-button>
            <div class="gap" />
            <ody-title title="RFM" />
            <ody-space :space="3">
              <ody-form-show :title="$t('recent_sale')">
                <ody-form-show-item :label="$t('sale_store')">
                  ：
                  <span>{{ userPortraitInfo.recentTradeStoreName }}</span>
                </ody-form-show-item>
                <ody-form-show-item :label="$t('sale_date')">
                  ：
                  <span>{{ userPortraitInfo.recentOrderTime }}</span>
                </ody-form-show-item>
                <ody-form-show-item :label="$t('sale_amount')">
                  ：
                  <span>{{ userPortraitInfo.recentOrderMoney }}</span>
                </ody-form-show-item>
                <ody-form-show-item :label="$t('buy_total')">
                  ：
                  <span>{{ userPortraitInfo.recentMpNum }}</span>
                </ody-form-show-item>
                <ody-form-show-item :label="$t('since_the_last_sale')">
                  ：
                  <span>{{ userPortraitInfo.recentOrderDays }}</span>
                </ody-form-show-item>
              </ody-form-show>
              <ody-form-show :title="$t('average_sale')">
                <ody-form-show-item :label="$t('average_customer_price')">
                  ：
                  <span>{{ userPortraitInfo.averageOrderMoney }}</span>
                </ody-form-show-item>
                <ody-form-show-item :label="$t('average_nuit_price')">
                  ：
                  <span>{{ userPortraitInfo.averageMpPrice }}</span>
                </ody-form-show-item>
              </ody-form-show>
              <ody-form-show :title="$t('add_sale')">
                <ody-form-show-item :label="$t('add_sale_number')">
                  ：
                  <span>{{ userPortraitInfo.cumulativeOrderNum }}</span>
                </ody-form-show-item>
                <ody-form-show-item :label="$t('add_sale_amount')">
                  ：
                  <span>{{ userPortraitInfo.cumulativeOrderMoney }}</span>
                </ody-form-show-item>
                <ody-form-show-item :label="$t('add_buy_total')">
                  ：
                  <span>{{ userPortraitInfo.cumulativeOrderUnit }}</span>
                </ody-form-show-item>
              </ody-form-show>
            </ody-space>
            <div class="gap" />
            <ody-title :title="$t('consumption_period')" />
            <ody-space :space="3">
              <ody-form-show :title="$t('preference_shopping_weeks')">
                <ody-week-show :active-list="preferenceShoppingWeeksTags" />
              </ody-form-show>
              <ody-form-show :title="$t('preference_shopping_date')">
                <ody-time-show :active-list="preferenceShopingTimeTags" />
              </ody-form-show>
            </ody-space>
          </el-form>
        </el-tab-pane>

        <!--交易信息-->
        <el-tab-pane v-if="$portal.hasPermission('30890357')" :label="$t('transaction_info')" name>
          <ody-title :title="$t('orderListManagement')" />
          <ody-list-search-area>
            <div slot="content">
              <el-form ref="form" label-width="100px" class="form">
                <ody-search-item :label="$t('orderNumber')" prop="param.orderCode">
                  <el-input v-model="search.param.orderCode" name="search_param_orderCode" />
                </ody-search-item>
                <ody-search-item :label="$t('manual_order_purchaser_mobile')" prop="param.goodReceiverMobile">
                  <el-input v-model="search.param.goodReceiverMobile" name="search_param_goodReceiverMobile" />
                </ody-search-item>
                <ody-search-item :label="$t('out_order_code')" prop="param.outOrderCode">
                  <el-input v-model="search.param.outOrderCode" name="search_param_outOrderCode" />
                </ody-search-item>
                <ody-search-item :space="2" :label="$t('orderCreateTime')" prop="data.orderCreateTime">
                  <ody-date-range-picker
                    ref="orderCreateTime"
                    v-model="search.data.orderCreateTime"
                    :default="7"
                    name="search_data_orderCreateTime"
                    type="datetimer"
                  />
                </ody-search-item>
                <ody-search-item :label="$t('channel_selection')" prop="param.sysSource">
                  <el-select v-model="search.param.sysSource" name="search_param_sysSource">
                    <el-option :value="null" :label="$t('common_status_all')" />
                    <el-option
                      v-for="item in channels"
                      :label="item.channelName"
                      :key="item.channelCode"
                      :value="item.channelCode"
                    />
                  </el-select>
                </ody-search-item>
              </el-form>
            </div>
            <div slot="btn">
              <el-button name="initOrderData" size="small" @click="initOrderData">{{ $t('omni_i18n_重置') }}</el-button>
              <ody-button
                name="OuserCenterMemberListQueryOrderList_queryOrderList"
                size="small"
                type="primary"
                code="OuserCenterMemberListQueryOrderList"
                @click="queryOrderList"
              >{{ $t('omni_i18n_查询') }}</ody-button>
            </div>
          </ody-list-search-area>
          <ody-table
            :can-filter="false"
            :data="orderListTable.list"
            :columns="orderListTable.columns"
            name="orderListTable_list887"
          />

          <ody-pagination
            :current-page.sync="pageParam.page"
            :list="orderListTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageParam.limit"
            :total.sync="pageParam.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="onPageChange"
            @current-change="onPageChange"
          />
        </el-tab-pane>
      </el-tabs>

      <!-- 人工作业-积分模态框 -->
      <ody-dialog :visible.sync="addManualOperation.showDialog" :title="$t('新增人工作业')" width="400px">
        <el-form
          ref="addManualOperationForm"
          :model="addManualOperation.form"
          :rules="addManualOperation.rules"
          label-width="50px"
        >
          <el-form-item
            :label="$t('对象')"
            :rules="[{ required: true, message: $t('请选择对象') }]"
            class="register"
            required
            prop="opeObj"
          >
            <el-input v-model="addManualOperation.form.opeObj" name="addManualOperation_form_opeObj" readonly="true" />
          </el-form-item>
          <el-form-item
            :label="$t('积分')"
            :rules="[{ required: true, message: $t('请选择积分变动') }]"
            class="register"
            required
            prop="opeAmount"
          >
            <el-select v-model="addManualOperation.form.opeType" name="addManualOperation_form_opeType" style="width:100px;">
              <el-option
                v-for="item in opeTypeList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
            <el-input-number
              :controls="false"
              :precision="0"
              v-model="addManualOperation.form.opeAmount"
              name="addManualOperation_form_opeAmount"
              min="1"
              max="99999999"
              style="width:130px;"
            />
            {{ $t('积分') }}
          </el-form-item>
          <el-form-item
            :label="$t('渠道')"
            :rules="[{ required: true, message: $t('请选择渠道') }]"
            class="register"
            required
            prop="channelCode"
          >
            <el-select v-model="addManualOperation.form.channelCode" name="addManualOperation_form_channelCode" style="width:270px;">
              <el-option
                v-for="item in channels"
                :label="item.channelName"
                :key="item.channelCode"
                :value="item.channelCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('理由')"
            :rules="[{ required: true, message: $t('请选择理由') }]"
            class="register"
            required
            prop="opeReason"
          >
            <el-select
              v-model="addManualOperation.form.opeReason"
              name="addManualOperation_form_opeReason"
              style="width:270px;"
              @change="selectOpeReasonChange(addManualOperation.form.opeReason)"
            >
              <el-option
                v-for="item in opeReasonList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="isRemarkShow">
            <el-input v-model="addManualOperation.form.remark" name="addManualOperation_form_remark" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button name="cancelPointsForm" size="small" @click="cancelPointsForm">{{ $t('cancel') }}</el-button>
          <el-button name="submitPointsForm" size="small" type="primary" @click="submitPointsForm">{{ $t('preservation') }}</el-button>
        </div>
      </ody-dialog>

      <!-- 人工作业-成长值模态框 -->
      <ody-dialog
        :visible.sync="addGrowthManualOperation.showDialog"
        :title="$t('新增人工作业')"
        width="400px"
      >
        <el-form
          ref="addGrowthManualOperationForm"
          :model="addGrowthManualOperation.form"
          :rules="addGrowthManualOperation.rules"
          label-width="50px"
        >
          <el-form-item
            :label="$t('对象')"
            :rules="[{ required: true, message: $t('请选择对象') }]"
            class="register"
            required
            prop="opeObj"
          >
            <el-input v-model="addGrowthManualOperation.form.opeObj" name="addGrowthManualOperation_form_opeObj" readonly="true" />
          </el-form-item>
          <el-form-item
            :label="$t('成长值')"
            :rules="[{ required: true, message: $t('请选择成长值变动') }]"
            class="register"
            required
            prop="changeAmount"
          >
            <el-select v-model="addGrowthManualOperation.form.growthType" name="addGrowthManualOperation_form_growthType" style="width:90px;">
              <el-option
                v-for="item in growthType"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
            <el-input-number
              :controls="false"
              :precision="0"
              v-model="addGrowthManualOperation.form.changeAmount"
              name="addGrowthManualOperation_form_changeAmount"
              min="1"
              max="99999999"
              style="width:130px;"
            />
            {{ $t('成长值') }}
          </el-form-item>
          <el-form-item
            :label="$t('渠道')"
            :rules="[{ required: true, message: $t('请选择渠道') }]"
            class="register"
            required
            prop="channelCode"
          >
            <el-select v-model="addGrowthManualOperation.form.channelCode" name="addGrowthManualOperation_form_channelCode" style="width:270px;">
              <el-option
                v-for="item in channels"
                :label="item.channelName"
                :key="item.channelCode"
                :value="item.channelCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('理由')"
            :rules="[{ required: true, message: $t('请选择理由') }]"
            class="register"
            required
            prop="opeReason"
          >
            <el-select
              v-model="addGrowthManualOperation.form.opeReason"
              name="addGrowthManualOperation_form_opeReason"
              style="width:270px;"
              @change="selectGrowthOpeReasonChange(addGrowthManualOperation.form.opeReason)"
            >
              <el-option
                v-for="item in opeGrowthReasonList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="isRemarkShow">
            <el-input v-model="addGrowthManualOperation.form.remark" name="addGrowthManualOperation_form_remark" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button name="cancelGrowthForm" size="small" @click="cancelGrowthForm">{{ $t('cancel') }}</el-button>
          <el-button name="submitGrowthForm" size="small" type="primary" @click="submitGrowthForm">{{ $t('preservation') }}</el-button>
        </div>
      </ody-dialog>

      <!-- 添加标签弹框 -->
      <ody-dialog-full-right
        :visible.sync="labelModalShow"
        :title="$t('edit_manual_label')"
        size="medium"
      >
        <el-span v-for="tag in labelGroupTagList" :key="tag" style="line-height:30px">
          <el-col :span="24">
            <span style="font-size: 20px">{{ tag.name }}</span>
          </el-col>
          <el-col :span="24">
            <el-tag v-for="tagLabel in tag.labelList" :key="tagLabel" size="medium">
              <el-checkbox v-model="tagLabel.check" name="tagLabel_check" style="float: left;">{{ tagLabel.name }}</el-checkbox>
            </el-tag>
          </el-col>
        </el-span>
        <el-row slot="footer">
          <el-button name="labelModalShow" @click="labelModalShow = false">{{ $t('return') }}</el-button>
          <el-button
            :disabled="!editFunction"
            name="resetUcUserLabel"
            type="primary"
            @click="resetUcUserLabel"
          >{{ $t('preservation') }}</el-button>
        </el-row>
      </ody-dialog-full-right>
    </ody-box>
  </section>
</template>

<script>
import memberInterests from '@/components/memberInterests'
import basicUtil from '@/utils/basicUtil'
import constants from '@/utils/constants'
import { mapGetters } from 'vuex'
import AddModal from '@/components/manulOperation/add'
import ToOrderDetail from '@/components/toDetail'
import MemberPoint from '@/components/memberPoint'

export default {
  name: 'OuserCenterMemberDetail',
  components: {
    AddModal,
    ToOrderDetail,
    memberInterests,
    MemberPoint
  },
  data() {
    const self = this
    return {
      crmDetail: {
        growthAccountInfo: {},
        memberTypeInfo: {},
        pointAccountInfo: {},
        memberLevelInfo: {}
      },
      switching: false,
      systemLabelTags: [],
      combineLabelTags: [],
      manualLabelTags: [],
      preferenceShoppingWeeksTags: [],
      preferenceShopingTimeTags: [],
      constellationList: [],
      animalSignList: [],
      educationList: [],
      labelModalShow: false,
      inputVisible: false,
      inputValue: '',
      couponCount: 0,
      // table表格
      listTable: {
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'loginTime',
            label: this.$t('login_time'),
            align: 'center',
            minWidth: 180,
            formatter(row, columns) {
              if (row.loginTime) {
                return self.$portal.parseTime(
                  row.loginTime,
                  '{y}-{m}-{d} {h}:{i}:{s}'
                )
              }
              return ''
            }
          },
          {
            show: true,
            prop: 'OS',
            label: this.$t('operating_system'),
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            prop: 'Brand',
            label: this.$t('brand'),
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            prop: 'model',
            label: this.$t('model'),
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            prop: 'netType',
            label: this.$t('network'),
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            prop: 'ip',
            label: 'IP',
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            prop: 'loginAddress',
            label: this.$t('login_address'),
            align: 'center',
            minWidth: 100
          },
          {
            show: true,
            prop: 'browser',
            label: this.$t('浏览器'),
            align: 'center',
            minWidth: 180
          }
        ]
      },
      // table表格
      couponsListTable: {
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'id',
            label: this.$t('coupons_id'),
            align: 'center',
            minWidth: 160
          },
          {
            show: true,
            prop: 'themeTitle',
            label: this.$t('coupons_name'),
            align: 'center',
            minWidth: 160
          },
          {
            show: true,
            prop: 'couponCode',
            label: this.$t('coupons_number'),
            align: 'center',
            minWidth: 160
          },
          {
            show: true,
            prop: 'couponGiveRuleStr',
            label: this.$t('coupons_type'),
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            prop: 'startTime',
            label: this.$t('coupons_validity'),
            align: 'center',
            minWidth: 300,
            formatter(row, columns) {
              if (row.startTime) {
                return (
                  self.$portal.parseTime(
                    row.startTime,
                    '{y}-{m}-{d} {h}:{i}:{s}'
                  ) +
                  ' - ' +
                  self.$portal.parseTime(row.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
                )
              }
              return ''
            }
          },
          {
            show: true,
            prop: 'bindTime',
            label: this.$t('coupons_binding_date'),
            align: 'center',
            minWidth: 160,
            formatter(row, columns) {
              if (row.bindTime) {
                return self.$portal.parseTime(
                  row.bindTime,
                  '{y}-{m}-{d} {h}:{i}:{s}'
                )
              }
              return ''
            }
          },
          {
            show: true,
            prop: 'status',
            label: this.$t('coupons_status'),
            align: 'center',
            minWidth: 80,
            formatter(row, columns) {
              if (row.status === 0) {
                return '已发行'
              } else if (row.status === 1) {
                return '可使用'
              } else if (row.status === 2) {
                return '已使用'
              } else if (row.status === 3) {
                return '已作废'
              } else if (row.status === 4) {
                return '已过期'
              } else if (row.status === 5) {
                return '已赠送未领取'
              } else if (row.status === 6) {
                return '已领取'
              }
              return ''
            }
          }
        ]
      },
      labelGroupTagList: [],
      // 声明初始化对象
      userBaseInfo: {
        id: null,
        birthday: null,
        remarks: null,
        sex: null
      },
      baseInfoSubmiting: false,
      userAccount: {},
      bindingInformation: {},
      userPortraitInfo: {},
      pointDetail: {
        balanceAccount: null
      },
      searchForm: {},
      couponsSearchForm: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          cellNo: '',
          couponStatus: -1,
          couponActivityName: null,
          couponId: null
        }
      },
      invoiceInfo: getDefaultInvoiceInfo(),
      sex: [],
      activeName: 'userBaseInfo',
      province_list: [],
      city_list: [],
      area_list: [],
      invoiceTypeList: [
        { type: 1, name: 'ouserCenter.invoice_type_person' },
        { type: 2, name: 'ouserCenter.invoice_type_enterprise' }
      ],
      invoiceSubmiting: false,
      invoiceRules: {
        invoiceType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        invoiceTitle: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        regionCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        detailAddress: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        registerPhone: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.validatePhone, trigger: 'blur' }
        ],
        taxpayerIdentificationCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      channels: [],
      opeReasonList: [],
      opeGrowthReasonList: [],
      opeTypeList: [],
      growthType: [],
      addManualOperation: {
        showDialog: false,
        form: {
          opeObj: this.$route.query.userId,
          opeAmount: 1,
          channelCode: null,
          opeReason: null,
          opeObjs: [{ userId: this.$route.query.userId, username: null }],
          opeType: '1',
          remark: null
        }
      },
      addGrowthManualOperation: {
        showDialog: false,
        form: {
          opeObj: this.$route.query.userId,
          changeAmount: 1,
          channelCode: null,
          opeReason: null,
          opeObjs: [{ userId: this.$route.query.userId, username: null }],
          growthType: '1',
          remark: null
        }
      },
      showOrEdit: false,
      editFunction: false,
      search: {
        data: {
          orderCreateTime: []
        },
        param: {}
      },
      pageParam: {
        limit: 10,
        page: 1,
        total: 0
      },
      orderListTable: {
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'orderCode',
            label: this.$t('orderNumber'),
            minWidth: 180,
            render: (h, params) => {
              return (
                <ToOrderDetail
                  orderCode={params.row.orderCode}
                  orderSource={params.row.orderSource}
                  sysSource={params.row.sysSource}
                >
                  <span>{params.row.orderCode}</span>
                </ToOrderDetail>
              )
            }
          },
          {
            show: true,
            prop: 'outOrderCode',
            label: this.$t('order_difference_channel_order_code'),
            minWidth: 180
          },
          {
            show: true,
            prop: 'orderTypeStr',
            label: this.$t('order_type'),
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            prop: 'merchantName',
            label: this.$t('Merchant'),
            align: 'center',
            minWidth: 150
          },
          {
            show: true,
            prop: 'storeName',
            label: this.$t('Shop'),
            align: 'center',
            minWidth: 150
          },
          {
            show: true,
            prop: 'buyerName',
            label: this.$t('buyer'),
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            label: this.$t('receipt_information'),
            align: 'center',
            minWidth: 150,
            tooltip: false,
            render: (h, params) => {
              if (params.row.goodReceiverName) {
                const nameLabel = params.row.customerId
                  ? this.$t('经销商ID')
                  : this.$t('会员ID')
                const id = params.row.customerId || params.row.userId
                const idInfo = id ? nameLabel + '：' + id : ''
                var self = this
                return (
                  <span>
                    <el-tooltip effect='dark' placement='top'>
                      <div slot='content'>
                        <div>
                          <div>{idInfo}</div>
                          <span>{self.$t('consignee')}：</span>
                          <span>{params.row.goodReceiverName}</span>
                          <br />
                          <span>{self.$t('cell_phone_number')}：</span>
                          <span>{params.row.goodReceiverMobile}</span>
                          <br />
                          <span>{self.$t('common_addAddress')}：</span>
                          <span>{params.row.goodReceiverAddressAll}</span>
                        </div>
                      </div>
                      <i class='el-icon-user'></i>
                    </el-tooltip>
                    <sapn>{params.row.goodReceiverName}</sapn>
                  </span>
                )
              } else {
                return ''
              }
            }
          },
          {
            show: true,
            prop: 'orderRemarkUser',
            label: this.$t('manual_order_customer_remark'),
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            prop: 'orderRemarkMerchant2user',
            label: this.$t('manual_order_merchant_remark'),
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            label: this.$t('orderAmount'),
            align: 'center',
            minWidth: 80,
            formatter: (row, column) => {
              const orderTotalAmount =
                (row.orderAmount || 0) +
                (row.taxAmount || 0) +
                (row.orderDeliveryFee || 0)
              return this.$options.filters['currency'](
                orderTotalAmount,
                '￥',
                2
              )
            }
          },
          {
            show: true,
            prop: 'orderStatusStr',
            label: this.$t('order_status'),
            align: 'center',
            minWidth: 80
          },
          {
            show: true,
            label: this.$t('orderCreateTime'),
            align: 'center',
            minWidth: 140,
            formatter: (row, column) => {
              if (row.orderCreateTime) {
                return this.$portal.parseTime(
                  row.orderCreateTime,
                  '{y}-{m}-{d} {h}:{i}:{s}'
                )
              }
              return ''
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['functions'])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.queryCode()
      // 常量赋值
      this.sex = constants.sex
      this.queryBaseInfo()
      this.queryChannelMap()
      if (this.functions.indexOf('30890318') > 0) {
        this.editFunction = true
      }
      this.initOrderData()
    },

    initOrderData() {
      this.search.param = {}
      this.search.data = {
        orderCreateTime: []
      }
      this.$refs.orderCreateTime.setDefault(7)
    },
    validatePhone(rule, value, callback) {
      var pattern = /^1[345789]\d{9}$/
      if (pattern.test(value)) {
        return callback()
      }
      return callback(
        new Error(
          this.$t('the_cell_phone_number_is_not_in_accordance_with_the_rules')
        )
      )
    },
    queryBaseInfo() {
      const userId = this.$route.query.userId
      const memberService = this.$ouserCenter.$api.memberService
      // 查询会员账户信息
      memberService.finduUnionLogin({ userId: userId }).then(res => {
        if (res.code === '0') {
          this.userAccount = res.data
          //          this.userAccount.mobile = this.userAccount.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
          if (
            res.data.socialMediaAccounts != null &&
            res.data.socialMediaAccounts.length > 0 &&
            res.data.socialMediaAccounts.oauthSourceSystem === 2
          ) {
            this.bindingInformation.oauthSourceSystem =
              res.data.socialMediaAccounts[0].oauthSourceSystem
            this.bindingInformation.oauthUsername =
              res.data.socialMediaAccounts[0].oauthUsername
            this.bindingInformation.createTime =
              res.data.socialMediaAccounts[0].createTime
            this.bindingInformation.updateTime =
              res.data.socialMediaAccounts[0].updateTime
            this.bindingInformation.wechantHeadPicUrl =
              res.data.socialMediaAccounts[0].wechantHeadPicUrl
          } else {
            this.bindingInformation = {}
          }
          this.userAccount.isAvailable = this.$route.query.isAvailable
          this.couponsSearchForm.obj.cellNo = this.userAccount.mobile

          var mobshow = this.$portal.hasPermission('30890355')
          if (!mobshow || !mobshow) {
            // 不显示手机
            this.userAccount.mobile =
              this.userAccount.mobile.substring(0, 3) +
              '****' +
              this.userAccount.mobile.substring(7)
          }
        }
      })
      this.getUserBaseInfoById()
    },
    getUserBaseInfoById() {
      // 查询会员基本信息
      const memberService = this.$ouserCenter.$api.memberService
      memberService
        .getUserBaseInfoById({ id: this.$route.query.userId })
        .then(res => {
          if (res.code === '0') {
            this.userBaseInfo = res.data
            if (
              this.userBaseInfo.sex !== undefined &&
              this.userBaseInfo.sex !== null &&
              this.userBaseInfo.sex !== ''
            ) {
              this.userBaseInfo.sex = Number(this.userBaseInfo.sex)
            }
            if (this.userBaseInfo.school != null) {
              this.userBaseInfo.animalSign = this.userBaseInfo.school
            }
            this.queryPointDetail()
          }
        })
    },
    saveUserBaseInfo() {
      // 修改会员信息
      const memberService = this.$ouserCenter.$api.memberService
      const inputDto = {}
      inputDto.id = this.userBaseInfo.id
      inputDto.sex = this.userBaseInfo.sex
      inputDto.constellation = this.userBaseInfo.constellation
      inputDto.animalSign = this.userBaseInfo.animalSign
      inputDto.education = this.userBaseInfo.education
      inputDto.platformRemark = this.userBaseInfo.platformRemark
      if (this.userBaseInfo.birthday) {
        inputDto.birthday = this.$portal.parseTime(
          this.userBaseInfo.birthday,
          '{y}-{m}-{d}'
        )
      }
      inputDto.remarks = this.userBaseInfo.remarks
      this.baseInfoSubmiting = true
      const self = this
      memberService
        .updateUserInfo(inputDto)
        .then(res => {
          if (res.code === '0') {
            basicUtil.alert(self.$t('save_success'), self)
          }
        })
        .finally(res => {
          self.baseInfoSubmiting = false
        })
    },
    findDeviceAll() {
      const memberService = this.$ouserCenter.$api.memberService
      this.searchForm.userId = this.$route.query.userId
      memberService.findDevicePage(this.searchForm).then(res => {
        if (res.code === '0' && res.data) {
          this.listTable.total = res.data.total
          this.listTable.list = res.data.list || res.data.listObj || []

          this.listTable.list.forEach(i => {
            if (i.deviceInfo) {
              const parse = JSON.parse(i.deviceInfo)
              i.ip = parse.ip
              i.browser = parse.browser
              i.OS = parse.OS
              i.Brand = parse.Brand
              i.model = parse.model
              i.netType = parse.netType
              i.loginAddress = parse.loginAddress
              if (!i.OS && parse.source) {
                // 登录来源，Android：0， ios：1， h5:2 pc：3
                if (parse.source === 0) i.OS = 'Android'
                else if (parse.source === 1) i.OS = 'IOS'
                else if (parse.source === 2) i.OS = 'H5'
                else if (parse.source === 3) i.OS = 'PC'
                else i.OS = 'Other'
              }
            }
          })
        }
      })
    },
    couponsFindDeviceAll() {
      this.$refs['couponSearchForm'].validate(valid => {
        if (valid) {
          const userService = this.$ouserCenter.$api.userService
          userService.queryCouponTypePG(this.couponsSearchForm).then(res => {
            if (res.code === '0') {
              this.couponsListTable.total = res.data.total
              if (!res.data.listObj) {
                res.data.listObj = []
              }
              this.couponsListTable.list = res.data.listObj
            }
          })
        }
      })
    },
    couponsFindAll() {
      const userService = this.$ouserCenter.$api.userService
      const param = this.$portal.deepClone(this.couponsSearchForm)
      param.userIds = [this.$route.query.userId]
      userService.queryPersonalCouponCount(param).then(res => {
        if (res.code === '0') {
          this.couponCount = res.data
        }
      })
      this.couponsFindDeviceAll()
    },
    handleCouponSearchReset() {
      this.couponsSearchForm.obj.couponActivityName = null
      this.couponsSearchForm.obj.couponId = null
    },
    getUserLabels() {
      const userService = this.$ouserCenter.$api.userService
      var param = { userId: this.$route.query.userId }
      userService.listUserLabel(param).then(res => {
        if (res.code === '0') {
          if (!res.data.systemUserLabelList) {
            res.data.systemUserLabelList = []
          }
          this.systemLabelTags = res.data.systemUserLabelList
          if (!res.data.combineUserLabelList) {
            res.data.combineUserLabelList = []
          }
          this.combineLabelTags = res.data.combineUserLabelList
          if (!res.data.manualUserLabelList) {
            res.data.manualUserLabelList = []
          }
          this.manualLabelTags = res.data.manualUserLabelList
        }
      })
    },
    getUserConsumeInfo() {
      const userService = this.$ouserCenter.$api.userService
      var param = { userId: this.$route.query.userId }
      userService.getUserConsumeInfo(param).then(res => {
        if (res.code === '0') {
          this.userPortraitInfo = res.data
        }
      })
    },
    getUserPreference() {
      const userService = this.$ouserCenter.$api.userService
      var param = { userId: this.$route.query.userId }
      userService.getUserPreference(param).then(res => {
        if (res.code === '0') {
          this.preferenceShoppingWeeksTags = res.data.preferenceWeeks
          this.preferenceShopingTimeTags = res.data.preferenceShopingTime
        }
      })
    },
    async queryInvoiceQualification() {
      const invoiceQualification = this.$ouserCenter.$api.invoiceQualification
      await invoiceQualification
        .getInvoiceQualification({ invoiceDrawerId: this.$route.query.userId })
        .then(res => {
          if (res.code === '0' && res.data) {
            this.invoiceInfo = Object.assign(this.invoiceInfo, res.data)
          }
        })
      if (!this.invoiceInfo) {
        return
      }
      await this.getProvinceList()
      if (this.invoiceInfo.provinceCode) {
        this.invoiceInfo.provinceName = getNameFromArea(
          this.invoiceInfo.provinceCode,
          this.province_list
        )
        await this.loadAreaList(this.invoiceInfo.provinceCode, 2)
      }
      if (this.invoiceInfo.cityCode) {
        this.invoiceInfo.cityName = getNameFromArea(
          this.invoiceInfo.cityCode,
          this.city_list
        )
        await this.loadAreaList(this.invoiceInfo.cityCode, 3)
      }
      if (this.invoiceInfo.regionCode) {
        this.invoiceInfo.regionName = getNameFromArea(
          this.invoiceInfo.regionCode,
          this.area_list
        )
        this.changeArea()
      }
    },
    changeInvoiceType() {
      if (this.invoiceType === 1) {
        // 删除部分字段
        delete this.invoiceInfo.provinceCode
        delete this.invoiceInfo.cityCode
        delete this.invoiceInfo.regionCode
        delete this.invoiceInfo.detailAddress
        delete this.invoiceInfo.registerPhone
        delete this.invoiceInfo.taxpayerIdentificationCode
      } else {
        this.invoiceInfo = Object.assign(
          getDefaultInvoiceInfo(),
          this.invoiceInfo
        ) // 增加部分字段
      }
    },
    async saveInvoiceInfo() {
      const invoiceToUpdate = {
        invoiceDrawerId: this.$route.query.userId,
        invoiceType: this.invoiceInfo.invoiceToUpdate,
        invoiceTitle: this.invoiceInfo.invoiceTitle
      }
      this.invoiceSubmiting = true
      if (this.invoiceInfo.id) {
        invoiceToUpdate.id = this.invoiceInfo.id
      }
      if (this.invoiceType === 2) {
        invoiceToUpdate.registerAddress =
          this.invoiceInfo.provinceName +
          this.invoiceInfo.cityName +
          this.invoiceInfo.regionName +
          this.invoiceInfo.detailAddress
        invoiceToUpdate.provinceCode = this.invoiceInfo.provinceCode
        invoiceToUpdate.cityCode = this.invoiceInfo.cityCode
        invoiceToUpdate.regionCode = this.invoiceInfo.regionCode
        invoiceToUpdate.detailAddress = this.invoiceInfo.detailAddress
        invoiceToUpdate.registerPhone = this.invoiceInfo.registerPhone
        invoiceToUpdate.taxpayerIdentificationCode = this.invoiceInfo.taxpayerIdentificationCode
      }
      const self = this
      this.$refs['invoiceForm'].validate(valid => {
        if (valid) {
          const invoiceQualification =
            self.$ouserCenter.$api.invoiceQualification
          invoiceQualification
            .saveQualification(invoiceToUpdate)
            .then(result => {
              if (result.code === '0') {
                basicUtil.alert(self.$t('save_success'), self)
                self.getInvoiceQualification()
              }
            })
            .finally(res => {
              self.invoiceSubmiting = false
            })
        } else {
          self.invoiceSubmiting = false
        }
      })
    },
    async getProvinceList() {
      this.province_list = []
      await this.loadAreaList(100000, 1)
    },
    async loadCityList() {
      this.invoiceInfo.cityCode = null
      this.invoiceInfo.regionCode = null
      this.city_list = []
      this.area_list = []
      await this.loadAreaList(this.invoiceInfo.provinceCode, 2)

      const name = getNameFromArea(
        this.invoiceInfo.provinceCode,
        this.province_list
      )
      if (name) {
        this.invoiceInfo.provinceName = name
      }
    },
    async loadRegionList() {
      this.invoiceInfo.regionCode = null
      this.area_list = []
      await this.loadAreaList(this.invoiceInfo.cityCode, 3)

      const name = getNameFromArea(this.invoiceInfo.cityCode, this.city_list)
      if (name) {
        this.invoiceInfo.cityName = name
      }
    },
    changeArea() {
      const name = getNameFromArea(this.invoiceInfo.regionCode, this.area_list)
      if (name) {
        this.invoiceInfo.regionName = name
      }
    },
    async loadAreaList(parentCode, level) {
      if (parentCode) {
        const res = await this.$ouserCenter.$api.area.queryArea({
          parentCode: parentCode
        })
        if (res.code === '0') {
          if (level === 1) {
            this.province_list = res.data
          } else if (level === 2) {
            this.city_list = res.data
          } else {
            this.area_list = res.data
          }
        }
      }
    },
    handleClick(tab, event) {
      if (tab.index === '0') {
        this.queryBaseInfo()
      } else if (tab.index === '2') {
        // this.queryPointDetail()
        // this.couponsSearchForm = { currentPage: 1, itemsPerPage: 10 }
        // this.couponsFindDeviceAll()
        // 调用权益子组件信息
        this.$refs.memberInterests.init()
      } else if (tab.index === '3') {
        this.$refs.MemberPoint.init()
      } else if (tab.index === '4') {
        this.couponsFindAll()
      } else if (tab.index === '5') {
        this.searchForm = { currentPage: 1, itemsPerPage: 10 }
        this.findDeviceAll()
      } else if (tab.index === '6') {
        this.getUserLabels()
        this.getUserConsumeInfo()
        this.getUserPreference()
      } else if (tab.index === '7') {
        this.queryOrderList()
      }
    },
    queryPointDetail() {
      var vue = this
      const crmService = this.$ouserCenter.$api.crmService
      crmService.getDetail({ userId: this.$route.query.userId }).then(res => {
        vue.crmDetail = res.data
      })
    },
    showAddLabelModal() {
      this.labelModalShow = true
      this.labelGroupTagList = []
      const userService = this.$ouserCenter.$api.userService
      userService
        .queryArtificialImportLabelList({ labelRelevanceObject: 1 })
        .then(res => {
          if (res.code === '0') {
            if (!res.data) {
              res.data = []
            }
            res.data.forEach(item => {
              var labelGroupVo = { name: item.labelClassifyName, labelList: [] }
              if (item.labelList != null && item.labelList.length > 0) {
                item.labelList.forEach(labelItem => {
                  var check = false
                  if (this.manualLabelTags.length > 0) {
                    this.manualLabelTags.forEach(manualLabelItem => {
                      if (manualLabelItem.labelId === labelItem.labelId) {
                        check = true
                      }
                    })
                  }
                  labelGroupVo.labelList.push({
                    id: labelItem.labelId,
                    name: labelItem.labelName,
                    check: check
                  })
                })
              }
              this.labelGroupTagList.push(labelGroupVo)
            })
          }
        })
    },
    onAddManualOperationShow() {
      this.addManualOperation.showDialog = true
    },
    onAddGrowthManualOperationShow() {
      this.addGrowthManualOperation.showDialog = true
    },
    cancelPointsForm() {
      const vue = this
      vue.isRemarkShow = false
      vue.addManualOperation = {
        showDialog: false,
        form: {
          opeObj: this.$route.query.userId,
          opeAmount: 1,
          channelCode: null,
          opeReason: null,
          opeObjs: [{ userId: this.$route.query.userId, username: null }],
          opeType: '1',
          remark: null
        }
      }
    },
    submitPointsForm() {
      const vue = this
      this.$refs['addManualOperationForm'].validate(valid => {
        if (valid) {
          this.$ouserCenter.$api.points
            .addManualOperation(vue.addManualOperation.form)
            .then(res => {
              var message = '添加人工作业，操作成功！'
              var type = 'success'
              if (res.code === '0') {
                vue.cancelPointsForm()
                vue.queryPointDetail()
                if (res.message) {
                  message = res.message
                }
              } else {
                message = this.$t('操作失败！')
                type = 'error'
              }
              this.$message({
                message: message,
                type: type
              })
            })
        }
      })
    },
    cancelGrowthForm() {
      const vue = this
      vue.isRemarkShow = false
      vue.addGrowthManualOperation = {
        showDialog: false,
        form: {
          opeObj: this.$route.query.userId,
          changeAmount: 1,
          channelCode: null,
          opeReason: null,
          opeObjs: [{ userId: this.$route.query.userId, username: null }],
          growthType: '1',
          remark: null
        }
      }
    },
    submitGrowthForm() {
      const vue = this
      this.$refs['addGrowthManualOperationForm'].validate(valid => {
        if (valid) {
          this.$ouserCenter.$api.points
            .balenceAddManualOperation(vue.addGrowthManualOperation.form)
            .then(res => {
              var message = '添加人工作业，操作成功！'
              var type = 'success'
              if (res.code === '0') {
                vue.cancelGrowthForm()
                vue.getUserBaseInfoById()
                if (res.message) {
                  message = res.message
                }
              } else {
                message = this.$t('操作失败！')
                type = 'error'
              }
              this.$message({
                message: message,
                type: type
              })
            })
        }
      })
    },
    queryChannelMap() {
      // 获取渠道
      this.$ouserCenter.$api.points.queryChannelMap({}).then(resp => {
        this.channels = resp.data
      })
    },
    queryCode() {
      var categorys = {
        categories: [
          'CONSTELLATION',
          'ANIMAL_SIGN',
          'EDUCATION',
          'JOB_TYPE',
          'POINT_JOB_REASON',
          'GROWTH_JOB_REASON'
        ]
      }
      this.$ouserCenter.$api.userService.listMulti(categorys).then(resp => {
        this.constellationList = resp.data.CONSTELLATION
        this.animalSignList = resp.data.ANIMAL_SIGN
        this.educationList = resp.data.EDUCATION
        this.opeTypeList = resp.data.JOB_TYPE
        this.growthType = resp.data.JOB_TYPE
        this.opeReasonList = resp.data.POINT_JOB_REASON
        this.opeGrowthReasonList = resp.data.GROWTH_JOB_REASON
      })
    },
    selectOpeReasonChange(opeReason) {
      if (opeReason === '3') {
        this.isRemarkShow = true
      } else {
        this.isRemarkShow = false
      }
    },
    selectGrowthOpeReasonChange(opeReason) {
      if (opeReason === '4') {
        this.isRemarkShow = true
      } else {
        this.isRemarkShow = false
      }
    },
    handleCloseManualLabel(tagId) {
      if (!this.editFunction) {
        return
      }
      const userService = this.$ouserCenter.$api.userService
      userService
        .deletedMemberLabel({
          userId: this.$route.query.userId,
          labelIdList: [tagId]
        })
        .then(res => {
          if (res.code === '0') {
            this.getUserLabels()
          }
        })
    },
    resetUcUserLabel() {
      var labelIds = []
      this.labelGroupTagList.forEach(item => {
        item.labelList.forEach(labelItem => {
          if (labelItem.check) {
            labelIds.push(labelItem.id)
          }
        })
      })
      const userService = this.$ouserCenter.$api.userService
      userService
        .operationMemberLabelRelation({
          userId: this.$route.query.userId,
          labelIdList: labelIds
        })
        .then(res => {
          if (res.code === '0') {
            this.labelModalShow = false
            this.getUserLabels()
            this.$message({
              message: this.$t('successful_operation'),
              type: 'success'
            })
          }
        })
    },
    tolist() {
      this.$router.push({
        name: 'OuserCenterMemberList',
        query: {}
      })
    },
    async handleUpdateStatus(status) {
      const memberService = this.$ouserCenter.$api.memberService
      this.switching = true
      const res = await memberService.updateStatus({
        userId: this.$route.query.userId,
        status: status
      })
      this.switching = false

      if (res.code === '0') {
        // this.queryBaseInfo()
      }
    },
    removeBind(unionType) {
      const self = this
      this.$confirm(
        this.$t('此操作无法撤销') + '，' + this.$t('是否确认') + '?',
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      )
        .then(() => {
          self.$ouserCenter.$api.userService
            .revokeUnion({
              userId: this.$route.query.userId,
              unionType: unionType
            })
            .then(res => {
              self.$message({
                type: 'success',
                message: self.$t('解绑成功')
              })
              self.init()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消')
          })
        })
    },
    _getQueryOrderData() {
      if (this.search.data.orderCreateTime) {
        this.search.param.startOrderCreateTime = this.search.data.orderCreateTime[0]
        this.search.param.endOrderCreateTime = this.search.data.orderCreateTime[1]
      } else {
        delete this.search.param.startOrderCreateTime
        delete this.search.param.endOrderCreateTime
      }

      var queryArgs = {
        selectFields: [
          'id',
          'orderCode',
          'outOrderCode',
          'orderType',
          'merchantId',
          'merchantName',
          'storeId',
          'storeName',
          'userId',
          'customerId',
          'customerName',
          'customerType',
          'goodReceiverName',
          'goodReceiverMobile',
          'goodReceiverCountry',
          'goodReceiverProvince',
          'goodReceiverCity',
          'goodReceiverCounty',
          'goodReceiverArea',
          'goodReceiverAddress',
          'orderRemarkUser',
          'orderRemarkMerchant2user',
          'orderAmount',
          'taxAmount',
          'orderDeliveryFee',
          'orderStatus',
          'orderCreateTime',
          'orderSource',
          'sysSource',
          'orderLabel',
          'userName',
          'userId'
        ]
      }
      queryArgs.filters = Object.assign({}, this.search.param)
      queryArgs.filters.isLeaf = 1
      return queryArgs
    },
    async queryOrderList() {
      this.pageParam.page = 1
      await this.listOrderData()
    },
    onPageChange() {
      this.listOrderData()
    },
    async listOrderData() {
      const vue = this
      var receiverShow = this.$portal.hasPermission(
        'OuserCenterReceiverInfoShow'
      )
      // this.loading = true
      vue.search.param.userId = this.$route.query.userId
      var pageQueryArgs = Object.assign(
        this._getQueryOrderData(),
        this.pageParam
      )
      const userService = this.$ouserCenter.$api.userService
      userService.listSoPage(pageQueryArgs).then(result => {
        if (result.code === '0') {
          vue.orderListTable.list = result.data || []
          vue.orderListTable.list.forEach(item => {
            item.orderStatus = parseInt(item.orderStatus)
            item.goodReceiverAddressAll =
              item.goodReceiverProvince +
              item.goodReceiverCity +
              item.goodReceiverArea +
              item.goodReceiverAddress

            if (!receiverShow) {
              var goodReceiverMobile = item.goodReceiverMobile
              if (goodReceiverMobile != null) {
                item.goodReceiverMobile =
                  goodReceiverMobile.substring(0, 3) +
                  '****' +
                  goodReceiverMobile.substring(7)
              }
              var goodReceiverAddressAll = item.goodReceiverAddressAll
              if (
                goodReceiverAddressAll != null &&
                goodReceiverAddressAll.length >= 3
              ) {
                item.goodReceiverAddressAll =
                  item.goodReceiverAddressAll.substring(0, 2) +
                  '**' +
                  item.goodReceiverAddressAll.substring(
                    goodReceiverAddressAll.length - 1
                  )
              }
              var goodReceiverName = item.goodReceiverName
              if (goodReceiverName != null && goodReceiverName.length >= 2) {
                item.goodReceiverName =
                  item.goodReceiverName.substring(0, 1) + '**'
              }

              var buyerName = item.buyerName
              if (buyerName != null && buyerName.length >= 2) {
                item.buyerName = item.buyerName.substring(0, 1) + '**'
              }
            }
          })

          vue.pageParam.total = result.total
          vue.orderListTable.total = result.total
        }
      })
    }
  }
}

function getNameFromArea(code, list) {
  if (!code || !list || list.length === 0) {
    return
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].code + '' === code + '') {
      return list[i].name
    }
  }
}

function getDefaultInvoiceInfo() {
  return {
    invoiceType: 1,
    drawerType: 1,
    invoiceTitle: null,
    provinceCode: null,
    cityCode: null,
    regionCode: null,
    detailAddress: null,
    registerPhone: null,
    taxpayerIdentificationCode: null
  }
}
</script>
<style lang="scss" scoped>
.pg-member-detail {
  .gap {
    height: 40px;
  }

  .inner-form {
    width: 700px;
  }

  .tag {
    margin-right: 20px;
  }

  .number {
    width: 180px;
    display: inline-block;
  }

  .title1 {
    height: 16px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(69, 90, 100, 1);
    line-height: 16px;
  }

  .title2 {
    width: 100px;
    text-align: left;
    float: left;
    height: 16px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 171, 180, 1);
    line-height: 16px;
  }

  .content2 {
    height: 16px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(69, 90, 100, 1);
    line-height: 16px;
  }
}
</style>
