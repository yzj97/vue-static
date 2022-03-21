<template>
  <div class="member-list">
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <!--<ody-search-item :label="$t('membership_account')" prop="mobile">
              <el-input v-model="searchForm.mobile" name="searchForm_mobile"/>
            </ody-search-item>-->
            <ody-search-item
              :label="$t('member_cell_phone_number') + ':'"
              prop="mobile"
            >
              <el-input v-model="searchForm.mobile" name="searchForm_mobile5" />
            </ody-search-item>
            <ody-search-item
              :label="$t('member_nickname') + ':'"
              prop="nickname"
            >
              <el-input
                v-model="searchForm.nickname"
                name="searchForm_nickname"
              />
            </ody-search-item>
            <ody-search-item
              :label="$t('membership_status') + ':'"
              prop="isAvailable"
            >
              <el-select
                v-model="searchForm.isAvailable"
                :placeholder="$t('whole')"
                name="searchForm_isAvailable"
                clearable="true"
              >
                <el-option
                  v-for="item in isAvailable"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('会员类型:')" prop="memberTypeId">
              <el-select
                v-model="searchForm.memberTypeId"
                :placeholder="$t('whole')"
                name="searchForm_memberTypeId"
                clearable="true"
                @change="memberTypeLevelChange"
              >
                <el-option
                  v-for="item in memberTypeList"
                  :key="item.memberType"
                  :label="item.memberTypeName"
                  :value="item.memberType"
                />
              </el-select>
            </ody-search-item>

            <ody-search-item
              :label="$t('registration_time') + ':'"
              :space="2"
              class="register"
              prop="rangeDate"
            >
              <ody-date-range-picker
                ref="dateRangePicker"
                :start-placeholder="$t('startDate')"
                :end-placeholder="$t('endDate')"
                v-model="searchForm.rangeDate"
                :default="7"
                :clearable="false"
                name="searchForm_rangeDate"
                type="datetimer"
              />
            </ody-search-item>
            <ody-search-item :label="$t('会员等级:')" prop="memberLevelId">
              <el-select
                :disabled="!searchForm.memberTypeId"
                v-model="searchForm.memberLevelId"
                :placeholder="$t('whole')"
                name="searchForm_memberLevelId"
                clearable="true"
              >
                <el-option
                  v-for="item in membershipGradeList"
                  :key="item.id"
                  :label="item.levelName"
                  :value="item.id"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('所属门店:')" prop="boundStoreIds">
              <ody-store-choose
                ref="storeChoose"
                v-model="searchForm.boundStoreIds"
                :selected.sync="selectedStoreList"
                :multiple="true"
                :search-field="[
                  'channelCode',
                  'merchantId',
                  'storeCode',
                  'storeName'
                ]"
                :result-field="[
                  'storeCode',
                  'storeName',
                  'merchantName',
                  'mobile',
                  'contactName'
                ]"
                :placeholder="$t('请选择')"
                :collapse-tags="true"
                name="searchForm_boundStoreIds"
                type="select"
                value-key="storeId"
              />
            </ody-search-item>
            <ody-search-item
              :label="$t('guide_name') + ':'"
              prop="guideIdentityCardName"
            >
              <el-input
                v-model="searchForm.guideIdentityCardName"
                name="searchForm_guideIdentityCardName"
              />
            </ody-search-item>
            <ody-search-item :label="$t('guide_code') + ':'" prop="uEmployeeId">
              <el-input
                v-model="searchForm.uEmployeeId"
                name="searchForm_uEmployeeId"
                maxlength="16"
                show-word-limit
              />
            </ody-search-item>
            <ody-search-item
              :label="$t('social_account_inding') + ':'"
              prop="oauthSourceSystem"
            >
              <el-select
                v-model="searchForm.oauthSourceSystem"
                :placeholder="$t('whole') + ':'"
                name="searchForm_oauthSourceSystem"
                clearable="true"
              >
                <el-option
                  v-for="item in socialAccountIndingList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('微信公众号:')" prop="subscribe">
              <el-select
                v-model="searchForm.subscribe"
                :placeholder="$t('whole') + ':'"
                name="searchForm_subscribe"
                clearable="true"
              >
                <el-option
                  v-for="item in subscribeList"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>

            <ody-search-item
              v-if="growthRuleInfo.status === 1"
              :label="$t('会员等级有效期:')"
              class="register"
              prop="memberLevelEndTime"
            >
              <el-date-picker
                v-model="searchForm.memberLevelEndTime"
                :placeholder="$t('请选择等级日期')"
                name="searchForm_memberLevelEndTime"
                type="date"
              />
            </ody-search-item>
            <ody-search-item prop="isNotBoundGuide">
              <el-checkbox
                v-model="searchForm.isNotBoundGuide"
                name="searchForm_isNotBoundGuide"
              >{{ $t("unbound_shopping_guide") }}</el-checkbox
              >
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{
            $t("reset")
          }}</el-button>
          <ody-button
            name="OuserCenterMemberListQuery_handleQuery"
            code="OuserCenterMemberListQuery"
            size="small"
            type="primary"
            @click="handleQuery"
          >{{ $t("query") }}</ody-button
          >
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button
            name="OuserCenterMemberListAdd_saveMemberInit"
            code="OuserCenterMemberListAdd"
            size="small"
            type="primary"
            @click="saveMemberInit"
          >{{ $t("add_members") }}</ody-button
          >
          <ody-button
            :disabled="listTable.checkedList.length === 0"
            name="OuserCenterMemberChange_handleCommand"
            size="small"
            type="primary"
            code="OuserCenterMemberChange"
            @click="handleCommand('1')"
          >{{ $t("member_change_guide") }}</ody-button
          >
          <ody-button
            name="OuserCenterMemberChangeGuide_handleCommand"
            size="small"
            code="OuserCenterMemberChangeGuide"
            type="primary"
            @click="handleCommand('2')"
          >{{ $t("change_guide_binding") }}</ody-button
          >
          <ody-button
            :disabled="listTable.checkedList.length === 0"
            name="OuserCenterMemberListMemberLevelSetting_memberLevelSetting"
            code="OuserCenterMemberListMemberLevelSetting"
            size="small"
            type="primary"
            @click="memberLevelSetting"
          >{{ $t("setting_membership_grade") }}</ody-button
          >
          <ody-batch-import-button
            :import-api="importModel.importApi"
            :import-label="importModel.importLabel"
            :download-local-file="importModel.downloadLocalFile"
            :async="importModel.async"
            :pool="importModel.pool"
            :task-type="importModel.taskType"
            name="memberImportCode"
            code="memberImportCode"
            size="small"
            class="batch-import"
          >{{ $t("batch_import") }}</ody-batch-import-button
          >
          <ody-batch-export-button
            :get-export-data="exportModel.getExportData"
            :export-api="exportModel.exportApi"
            :async="exportModel.async"
            :pool="exportModel.pool"
            :task-type="exportModel.taskType"
            name="memberExportCode"
            code="memberExportCode"
            size="small"
            class="batch-export"
          >{{ $t("batch_export") }}</ody-batch-export-button
          >
          <el-popover placement="bottom" with="160" trigger="hover">
            <div class="btn-popover">
              <ody-import-task-button
                pool="ouser"
                task-type="memberImport"
                name="accounting_unit_info_seeImportTask"
                code="memberImportTaskCode"
                size="small"
                class="import-task"
              >{{ $t("seeImportTask") }}</ody-import-task-button
              >
              <ody-export-task-button
                pool="ouser"
                task-type="memberExport"
                name="accounting_unit_info_seeExportTask"
                code="memberExportTaskCode"
                size="small"
              >{{ $t("seeExportTask") }}</ody-export-task-button
              >
            </div>
            <el-button slot="reference" size="small">
              {{ $t("seeTask") }}
              <i class="el-icon-arrow-down" />
            </el-button>
          </el-popover>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data.sync="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            :checked.sync="listTable.checkedList"
            :can-filter="false"
            :multiple="true"
          >
            <template slot="mobile" slot-scope="scope">
              <el-link
                v-if="$portal.hasPermission('OuserCenterMemberListSee')"
                :title="scope.row.mobile"
                underline="true"
                type="primary"
                @click="todetail(scope.row.userId, scope.row.isAvailable)"
              >
                {{ scope.row.mobile }}
              </el-link>
              <span v-else>{{ scope.row.mobile }}</span>
            </template>
            <template slot="isAvailable" slot-scope="scope">
              <div name="updateStatus" @click="updateStatus(scope.row)">
                <el-switch
                  :disabled="
                    scope.row.isAvailable === 2 ||
                      !$portal.hasPermission('OuserCenterMemberEnable')
                  "
                  :value="scope.row.isAvailable === 1"
                  :active-text="
                    scope.row.isAvailable === 1
                      ? $t('enable')
                      : scope.row.isAvailable === 2
                        ? $t('注销')
                        : $t('disable')
                  "
                />
              </div>
            </template>
          </ody-table>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            :list="listTable.list"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="queryMemberInfoList"
            @current-change="queryMemberInfoList"
          />
        </div>
      </ody-list-table-area>
    </section>

    <!-- 添加会员弹框 -->
    <ody-dialog-full-right
      :visible.sync="saveMemberShow"
      :title="$t('add_members')"
      size="small"
    >
      <el-form
        ref="saveMember"
        :label-position="left"
        :rules="saveMemberRules"
        :model="saveMemberInfo"
        label-width="100px"
      >
        <el-form-item :label="$t('cell_phone_number')" prop="mobile">
          <el-input
            v-model="saveMemberInfo.mobile"
            name="saveMemberInfo_mobile"
            type="text"
            show-word-limit
            maxlength="11"
          />
        </el-form-item>
        <el-form-item :label="$t('member_nickname')">
          <el-input
            v-model="saveMemberInfo.nickname"
            name="saveMemberInfo_nickname"
            type="text"
            show-word-limit
            maxlength="20"
          />
        </el-form-item>
        <el-form-item :label="$t('registered_shop')">
          <ody-store-choose
            v-model="saveMemberInfo.storeName"
            :search-field="[
              'channelCode',
              'merchantId',
              'storeCode',
              'storeName'
            ]"
            :result-field="[
              'storeCode',
              'storeName',
              'merchantName',
              'mobile',
              'contactName'
            ]"
            name="saveMemberInfo_storeName"
            @ok="handleStoreOk"
            @clear="handleClear"
          />
          <!--<el-input
            v-model="saveMemberInfo.storeName"
            name="saveMemberInfo_storeName5"
            readonly="true"
            type="text"
            show-word-limit
          @focus="onShowShopModal"/>-->
        </el-form-item>
        <el-form-item :label="$t('guide')">
          <el-select
            v-model="saveMemberInfo.guide"
            :placeholder="$t('whole')"
            name="saveMemberInfo_guide"
          >
            <el-option
              v-for="item in shopGuideList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ody-button
          :disabled="saveMemberSubmiting"
          name="OuserCenterMemberSaveMember_saveMember"
          code="OuserCenterMemberSaveMember"
          type="primary"
          @click="saveMember"
        >{{ $t("preservation") }}</ody-button
        >
        <el-button name="saveMemberShow" @click="saveMemberShow = false">{{
          $t("cancel")
        }}</el-button>
      </div>
    </ody-dialog-full-right>

    <!-- 会员换绑弹框 -->
    <ody-dialog-full-right
      :visible.sync="memberBindingShow"
      :title="$t('member_change_guide')"
      size="medium"
    >
      <el-row>
        <el-col :span="20" :offset="2">
          <el-row>
            <el-form
              label-width="100px"
              label-position="right"
              class="good-form"
            >
              <el-form-item>
                <p>
                  {{ $t("member_checked_info", { memberCount: memberCount }) }}
                </p>
              </el-form-item>
              <el-form-item>
                <p>{{ $t("prompt_binding_guide") }}</p>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="changeBinding.newGuideUserId"
                  :placeholder="$t('member_input_new_guide_code')"
                  name="changeBinding_newGuideUserId"
                  maxlength="16"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item>
                <ody-button
                  name="OuserCenterMemberChooseShop_queryShopInfoList"
                  size="mini"
                  type="primary"
                  code="OuserCenterMemberChooseShop"
                  @click="queryShopInfoList"
                >{{ $t("choose_a_shop") }}</ody-button
                >
              </el-form-item>
            </el-form>
          </el-row>
        </el-col>
      </el-row>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="shopListTable.list"
            :columns="shopListTable.columns"
            :checked="shopListTable.checkedList"
            :highlight-current-row="true"
            name="shopListTable_list741"
            @selection-change="shopHandleSelectionChange"
          />
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="shopSearchForm.currentPage"
              :list="shopListTable.list"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="shopSearchForm.itemsPerPage"
              :total.sync="shopListTable.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="queryShopInfoList"
              @current-change="queryShopInfoList"
            />
          </div>
        </div>
      </ody-list-table-area>
      <el-row slot="footer">
        <el-button
          name="memberBindingShow"
          @click="memberBindingShow = false"
        >{{ $t("return") }}</el-button
        >
        <ody-button
          :disabled="shopListTable.checkedList.length === 0"
          name="OuserCenterMemberChangeBinding_memberChangeBinding"
          type="primary"
          code="OuserCenterMemberChangeBinding"
          @click="memberChangeBinding"
        >{{ $t("preservation") }}</ody-button
        >
      </el-row>
    </ody-dialog-full-right>

    <!-- 导购员换绑弹框 -->
    <ody-dialog-full-right
      :visible.sync="shoppingGuideShow"
      :title="$t('change_guide')"
      size="medium"
    >
      <el-row>
        <el-col :span="20" :offset="2">
          <el-row>
            <el-form
              label-width="100px"
              label-position="right"
              class="good-form"
            >
              <el-form-item :label="$t('old_guide')">
                <el-input
                  v-model="changeBinding.oldGuideUserId"
                  :placeholder="$t('member_input_old_guide_code')"
                  name="changeBinding_oldGuideUserId"
                  maxlength="16"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item :label="$t('new_guide')">
                <el-input
                  v-model="changeBinding.newGuideUserId"
                  :placeholder="$t('member_input_new_guide_code')"
                  name="changeBinding_newGuideUserId6"
                  maxlength="16"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item>
                <p>{{ $t("prompt_change_binding_guide") }}</p>
              </el-form-item>
              <el-form-item>
                <ody-button
                  name="OuserCenterGuideChooseShop_queryShopInfoList"
                  code="OuserCenterGuideChooseShop"
                  size="mini"
                  type="primary"
                  @click="queryShopInfoList"
                >{{ $t("choose_a_shop") }}</ody-button
                >
              </el-form-item>
            </el-form>
          </el-row>
        </el-col>
      </el-row>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="shopListTable.list"
            :columns="shopListTable.columns"
            :checked="shopListTable.checkedList"
            :highlight-current-row="true"
            name="shopListTable_list103"
            @selection-change="shopHandleSelectionChange"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="shopSearchForm.currentPage"
            :list="shopListTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="shopSearchForm.itemsPerPage"
            :total.sync="shopListTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="queryShopInfoList"
            @current-change="queryShopInfoList"
          />
        </div>
      </ody-list-table-area>
      <el-row slot="footer">
        <el-button
          name="shoppingGuideShow"
          @click="shoppingGuideShow = false"
        >{{ $t("return") }}</el-button
        >
        <ody-button
          :disabled="shopListTable.checkedList.length === 0"
          name="OuserCenterGuideChangeBinding_shoppingChangeBinding"
          type="primary"
          code="OuserCenterGuideChangeBinding"
          @click="shoppingChangeBinding"
        >{{ $t("preservation") }}</ody-button
        >
      </el-row>
    </ody-dialog-full-right>

    <!-- 添加会员店铺弹框 -->
    <!--<ShopModal :visible.sync="showShopModal" :form-data.sync="formData" :collect.sync="collect" @ok="handleStoreOk" />-->
    <MemberSetting
      :visible.sync="showMemberLevleSetting"
      :id-list.sync="idList"
      :member-type-id.sync="memberTypeId"
      @ok="clearCheck"
    />
  </div>
</template>

<script>
/* import ShopModal from '@/components/shopModal'*/
import basicUtil from '@/utils/basicUtil'
import constants from '@/utils/constants'
import ToMemberDetail from '@/components/member-list-detail'
import MemberSetting from '@/components/memberSetting'

export default {
  name: 'OuserCenterMemberList',
  components: {
    /* ShopModal,*/
    ToMemberDetail,
    MemberSetting
  },
  props: {
    authEnable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const self = this
    return {
      storeSelected: {},
      showMemberLevleSetting: false,
      idList: [],
      memberTypeId: null,
      importModel: {
        importApi: ['ouser-web', 'member', 'memberImport.do', {}],
        importLabel: '导入会员',
        downloadLocalFile: [require('@/excelFile/memberImportTemplate.xlsx')],
        pool: 'ouser',
        taskType: 'memberImport',
        async: true
      },
      exportModel: {
        exportApi: ['ouser-web', 'member', 'memberExport.do'],
        pool: 'ouser',
        taskType: 'memberExport',
        async: true,
        getExportData: () => {
          return this.getParam()
        }
      },
      filters: {},
      saveMemberRules: {
        mobile: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          {
            pattern: /^1[0-9]{10}$/,
            message: this.$t(
              'the_cell_phone_number_is_not_in_accordance_with_the_rules'
            ),
            trigger: 'change'
          }
        ],
        email: [
          {
            pattern: /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+\.[0-9a-zA-Z_]+/,
            message: this.$t('incorrect_mailbox_format'),
            trigger: 'change'
          }
        ]
      },
      loading: false,
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'mobile',
            label: this.$t('membership_account'),
            align: 'center',
            minWidth: 124,
            render: (h, params) => {
              return (
                <a
                  on-click={() => {
                    if (
                      this.$portal.hasPermission('OuserCenterMemberListSee')
                    ) {
                      this.todetail(params.row.userId, params.row.isAvailable)
                    }
                  }}
                >
                  <span style={'color:#1890FF'}>{params.row.mobile}</span>
                </a>
              )
            }
          },
          {
            show: true,
            prop: 'nickname',
            label: this.$t('member_nickname'),
            align: 'center',
            minWidth: 200
          },
          {
            show: true,
            prop: 'mobile',
            label: this.$t('cell_phone_number'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'memberTypeName',
            label: this.$t('会员类型'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'memberLevelName',
            label: this.$t('会员等级'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'park',
            label: this.$t('园区'),
            align: 'center',
            minWidth: 100
          },
          {
            show: true,
            prop: 'company',
            label: this.$t('公司/品牌'),
            align: 'center',
            minWidth: 100
          },
          {
            show: () => {
              return self.growthRuleInfo.status !== 0
            },
            prop: 'memberLevelEndTime',
            label: this.$t('会员等级有效期'),
            align: 'center',
            minWidth: 200,
            formatter(row, columns) {
              if (row.memberLevelEndTime && self.growthRuleInfo.status === 1) {
                return self.$portal.parseTime(
                  row.memberLevelEndTime,
                  '{y}-{m}-{d}'
                )
              }
              return '-'
            }
          },
          {
            show: true,
            prop: 'subscribe',
            label: this.$t('微信关注情况'),
            align: 'center',
            minWidth: 124,
            formatter(row, columns) {
              const sub = self.subscribeList.filter(
                i => i.value === row.subscribe
              )
              return sub.length !== 0 ? sub[0].label : ''
            }
          },

          {
            show: true,
            /* prop: 'guideIdentityCardName',*/
            label: this.$t('sales_assistant'),
            align: 'center',
            minWidth: 124,
            tooltip: false,
            render: (h, params) => {
              if (params.row.guideIdentityCardName) {
                return (
                  <span>
                    <sapn>{params.row.guideIdentityCardName}</sapn>
                    <el-tooltip effect='dark' placement='top'>
                      <div slot='content'>
                        <div>
                          <span>{self.$t('导购员')}：</span>
                          <span>{params.row.guideIdentityCardName}</span>
                          <br />
                          <span>{self.$t('导购员ID')}：</span>
                          <span>{params.row.uEmployeeId}</span>
                          <br />
                        </div>
                      </div>
                      <i class='el-icon-user' />
                    </el-tooltip>
                  </span>
                )
              } else {
                return ''
              }
            }
          },
          {
            show: true,
            prop: 'boundStoreName',
            label: this.$t('所属门店'),
            align: 'center',
            minWidth: 124,
            formatter(row, columns) {
              if (
                row.boundStoreId &&
                self.selectedStoreList &&
                self.selectedStoreList.length > 0
              ) {
                const store = self.selectedStoreList.filter(
                  i => i.storeId === row.boundStoreId
                )
                if (store && store.length > 0) {
                  return store[0].storeName
                }
              }
              return row.boundStoreName
            }
          },
          {
            show: true,
            prop: 'isAvailable',
            label: this.$t('membership_status'),
            align: 'center',
            minWidth: 124,
            slot: 'isAvailable'
          },
          {
            show: true,
            prop: 'createTime',
            label: this.$t('registration_time'),
            align: 'center',
            minWidth: 200,
            formatter(row, columns) {
              if (row.createTime) {
                return self.$portal.parseTime(
                  row.createTime,
                  '{y}-{m}-{d} {h}:{i}:{s}'
                )
              }
              return ''
            }
          }
        ]
      },
      shopListTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'orgCode',
            label: this.$t('shop_code'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'orgName',
            label: this.$t('shop_name'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'parentOrgName',
            label: this.$t('merchant'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'contactName',
            label: this.$t('store_contact'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'mobileNo',
            label: this.$t('cell_phone'),
            align: 'center',
            minWidth: 124
          }
        ]
      },
      // 搜索框对象
      searchForm: {},
      shopSearchForm: {},
      saveMemberShow: false,
      memberBindingShow: false,
      shoppingGuideShow: false,
      dialogVisible: false,
      saveMemberSubmiting: false,
      // 新增编辑弹框对象
      saveMemberInfo: {
        mobile: '',
        nickname: '',
        storeName: '',
        guide: ''
      },
      // 更换绑定实体
      changeBinding: {},
      // 状态
      isAvailable: [],
      // 会员类型
      memberTypeList: [],
      // 会员等级
      membershipGradeList: [],
      // 社交账号绑定
      socialAccountIndingList: [],
      // 对应门店导购员列表
      shopGuideList: [],
      // 会员换绑数
      memberCount: 0,
      // 消息内容
      messageContext: '',
      showShopModal: false,
      selectedStoreList: [], // 选中的店铺列表
      subscribeList: [],
      uploadUrl: '/crm-web/ouserGroup/asyncImport',
      memberImportModal: {
        visible: false,
        form: {
          fileName: null
        }
      },
      downloadTaskVisible: false,
      growthRuleInfo: {
        status: 1
      }
    }
  },
  computed: {
    getMemberTypeList() {
      function converArr(arr, map, map2) {
        return loop(arr, map)

        function loop(arr, map) {
          arr.forEach(function(x) {
            for (var p in map) {
              if (x[map[p]]) {
                x[p] = x[map[p]]
                delete x[map[p]]
              }
            }

            if (x.children && x.children.length) {
              x.children = loop(x.children, map2)
            }
          })
          return arr
        }
      }
      return converArr(
        this.memberTypeList,
        {
          label: 'memberTypeName',
          value: 'memberType',
          children: 'membershipLevels'
        },
        {
          label: 'levelName',
          value: 'levelCode'
        }
      )
    }
  },
  async mounted() {
    try {
      if (this.authEnable) {
        this.exportModel.exportApi = [
          'ouser-web',
          'member',
          'asyncExportAuth.do'
        ]
      } else {
        this.exportModel.exportApi = ['ouser-web', 'member', 'memberExport.do']
      }
      console.log(this.exportMethod)
      this.loading = true
      await this.init()
    } finally {
      this.loading = false
    }
  },
  methods: {
    showMemberImport() {
      this.memberImportModal.visible = true
    },
    handleRemove(file, fileList) {
      this.memberImportModal.form.fileName = ''
    },
    handlePreview(file) {
      this.memberImportModal.form.fileName = file.name
    },
    handleFilters() {
      if (this.timeRange && this.timeRange.length > 1) {
        this.filters.startCreateTime = this.timeRange[0]
        this.filters.endCreateTime = this.timeRange[1]
      } else {
        delete this.filters.startCreateTime
        delete this.filters.endCreateTime
      }
    },
    cancelMemberImport() {
      this.memberImportModal = {
        visible: false,
        form: {
          fileName: null
        }
      }
    },
    async submitMemberImport() {
      const [err] = await this.formValidate('memberImportModal')
      if (err) {
        return
      }
      const params = new FormData()
      Object.keys(this.memberImportModal.form).forEach(key => {
        params.append(key, this.memberImportModal.form[key])
      })
      const file = document.getElementsByName('fileData')[0].files[0]
      params.append('fileData', file)
      try {
        await this.$crm.$api.memberService.memberAsyncImport(params)
        this.cancelMemberImport()
        this.$message({
          message: this.$t('成功'),
          type: 'success'
        })
      } catch (ex) {
        console.error(ex)
      }
    },
    async handleQuery() {
      this.searchForm.currentPage = 1
      await this.queryMemberInfoList()
    },
    memberLevelSetting() {
      const userIds = []
      let memberTypeId = null
      this.listTable.checkedList.forEach(item => {
        if (!memberTypeId) {
          memberTypeId = item.memberTypeId
        } else {
          if (memberTypeId !== item.memberTypeId) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择相同的会员类型调整会员等级')
            })
            return
          }
        }
        userIds.push(item.userId)
      })
      if (userIds.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('PLEASE_CHOOSE_A_PRODUCT')
        })
        return
      }
      this.idList = userIds
      this.memberTypeId = memberTypeId
      this.showMemberLevleSetting = true
    },
    clearCheck() {
      this.listTable.checkedList = []
    },
    async init() {
      // 常量赋值
      constants.isAvailable.forEach(item => {
        this.isAvailable.push(item)
      })
      constants.socialAccountIndingList.forEach(item => {
        if (item.value !== 1) {
          this.socialAccountIndingList.push(item)
        }
      })
      constants.subscribeList.forEach(item => {
        this.subscribeList.push(item)
      })
      // 初始化搜索框对象
      this.initForm()
      this.getGrowthRuleInfo()
      try {
        // 查询会员类型
        this.initMemberTypeList()
        // 查询员工列表
        await this.queryMemberInfoList()
      } catch (e) {
        console.log(e)
      }
    },
    async initMemberTypeList() {
      const memberService = this.$crm.$api.memberService
      const result = await memberService.queryMemberType()
      this.memberTypeList = result.data || []
    },
    saveMemberInit(command) {
      this.saveMemberShow = true
      this.saveMemberInfo = {
        mobile: '',
        nickname: '',
        storeId: null,
        storeCode: '',
        storeName: '',
        guide: null
      }
    },
    handleCommand(command) {
      if (command === '1') {
        this.memberCount = this.listTable.checkedList.length
        this.changeBinding = {}
        this.memberBindingShow = true
      }
      if (command === '2') {
        this.changeBinding = {}
        this.shoppingGuideShow = true
      }
      this.shopListTable.list = []
      this.shopListTable.total = 0
      this.shopListTable.checkedList = []
    },
    // 初始化搜索对象
    initForm() {
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10,
        mobile: null,
        nickname: null,
        isAvailable: null,
        memberTypeId: null,
        memberLevelId: null,
        boundStoreIds: [],
        guideIdentityCardName: null,
        uEmployeeId: null,
        oauthSourceSystem: null,
        subscribe: null,
        rangeDate: [],
        memberLevelEndTime: null,
        isNotBoundGuide: false
      }
      this.memberTypeLevelChange()
      this.selectedStoreList = []
      this.$refs.dateRangePicker.setDefault(7)
      this.shopSearchForm = {
        currentPage: 1,
        itemsPerPage: 10
      }
    },
    // 查询列表
    async queryMemberInfoList() {
      const search = Object.assign({}, this.searchForm)
      const memberService = this.$crm.$api.memberService
      const self = this
      if (search.mobile && !/^[0-9]*$/.test(search.mobile)) {
        basicUtil.alert(
          self.$t('membership_account_do_not_conform_to_the_rules'),
          this
        )
        return
      }
      if (search.uEmployeeId && !/^[0-9]*$/.test(search.uEmployeeId)) {
        basicUtil.alert(self.$t('guide_code_only_number'), this)
        return
      }
      // if (search.memberTypeLevel != null && search.memberTypeLevel.length === 1) {
      //   search.memberType = search.memberTypeLevel[0]
      //   delete search.levelCode
      // } else if (search.memberTypeLevel != null && search.memberTypeLevel.length === 2) {
      //   search.levelCode = search.memberTypeLevel[1]
      //   delete search.memberType
      // }
      // delete search.memberTypeLevel

      if (search.rangeDate) {
        search.beginDate = search.rangeDate[0] // this.$portal.parseTime(search.rangeDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        search.endDate = search.rangeDate[1] // this.$portal.parseTime(search.rangeDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
        delete search.rangeDate
      } else {
        this.$message({
          type: 'warn',
          message: this.$t('必须指定注册时间范围')
        })
        return
      }

      if (this.growthRuleInfo.status === 0) {
        search.memberLevelEndTime = null
      }

      this.loading = true
      let res
      if (this.authEnable) {
        res = await memberService.queryMemberInfoListAuth(search)
      } else {
        res = await memberService.queryRedevMemberInfoList(search)
      }
      self.listTable.total = res.data.total
      if (!res.data.listObj) {
        res.data.listObj = []
      }
      // 返回的列表已经包含导购员
      // var userIds = []
      // res.data.listObj.forEach(item => {
      //   userIds.push(item.userId)
      // })
      // if (userIds.length > 0 && ((search.uEmployeeId === undefined) && (search.isNotBoundGuide === undefined || !search.isNotBoundGuide))) {
      //   const guideRes = await memberService.queryUserGuideInfoList({ userIds: userIds })

      //   if (guideRes.data.length > 0) {
      //     guideRes.data.forEach(guidItem => {
      //       res.data.listObj.forEach(item => {
      //         if (guidItem.userId === item.userId) {
      //           item.uEmployeeId = guidItem.uEmployeeId
      //           item.guideIdentityCardName = guidItem.guideIdentityCardName
      //         }
      //       })
      //     })
      //   }
      // }
      self.listTable.list = res.data.listObj

      var mobshow = this.$portal.hasPermission('30890355')
      if (!mobshow || !mobshow) {
        // 不显示手机
        for (var ii = 0; ii < self.listTable.list.length; ii++) {
          var pmo = self.listTable.list[ii].mobile
          if (pmo) {
            self.listTable.list[ii].mobile =
              pmo.substring(0, 3) + '****' + pmo.substring(7)
          }
        }
      }

      this.loading = false
    },
    getParam() {
      const searchInfo = Object.assign({}, this.searchForm)

      if (searchInfo.rangeDate) {
        searchInfo.beginDate = searchInfo.rangeDate[0]
        searchInfo.endDate = searchInfo.rangeDate[1]
      }
      if (searchInfo.id) {
        // 如果id不是数字，设置id-1，查询列表为空
        const id = Number(this.search.id)
        if (isNaN(id)) {
          searchInfo.id = -1
        }
      }
      var param = {
        jsonTxt: JSON.stringify({
          currentPage: 1,
          itemsPerPage: 1000,
          ...searchInfo
        }),
        templateCode: 'memberExport'
      }
      return param
    },
    saveMember() {
      const self = this
      const memberService = this.$crm.$api.memberService
      this.$refs['saveMember'].validate(valid => {
        if (valid) {
          self.saveMemberSubmiting = true
          memberService
            .registerForce(this.saveMemberInfo)
            .then(res => {
              if (res.code === '0' || res.code === 0) {
                if (
                  this.saveMemberInfo.guide !== null &&
                  this.saveMemberInfo.guide !== ''
                ) {
                  var changeBinding = {
                    newGuideUserId: this.saveMemberInfo.guide,
                    userIds: [res.id]
                  }
                  memberService.updateGuideByUserId(changeBinding).then(res => {
                    if (res.code === '0') {
                      self.memberBindingShow = false
                    }
                  })
                }
                self.$message({
                  type: 'success',
                  message: this.$t('common_save_success')
                })
                self.queryMemberInfoList()
                self.saveMemberShow = false
              }
            })
            .finally(res => {
              self.saveMemberSubmiting = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    memberChangeBinding() {
      const self = this
      const memberService = this.$crm.$api.memberService
      if (this.memberCount === 0) {
        basicUtil.alert(this.$t('member_select_at_least_one'), this)
        return
      }
      if (!this.changeBinding.newGuideUserId) {
        basicUtil.alert(this.$t('member_input_guide_code'), this)
        return
      }
      if (!/^\d*$/.test(this.changeBinding.newGuideUserId)) {
        basicUtil.alert(this.$t('guide_code_only_number'), this)
        return
      }
      const userIds = []
      this.listTable.checkedList.forEach(item => {
        userIds.push(item.userId)
      })
      this.changeBinding.userIds = userIds
      this.changeBinding.storeId = this.shopListTable.checkedList[0].id
      this.changeBinding.storeCode = this.shopListTable.checkedList[0].orgCode
      this.changeBinding.storeName = this.shopListTable.checkedList[0].orgName
      memberService.updateGuideByUserId(this.changeBinding).then(res => {
        if (res.code === '0') {
          basicUtil.alert(self.$t('save_success'), self)
          self.memberBindingShow = false
          this.listTable.checkedList = []
          self.queryMemberInfoList()
        }
      })
    },

    shoppingChangeBinding() {
      const memberService = this.$crm.$api.memberService
      if (!this.changeBinding.oldGuideUserId) {
        basicUtil.alert(this.$t('member_input_old_guide_code'), this)
        return
      }
      if (!this.changeBinding.newGuideUserId) {
        basicUtil.alert(this.$t('member_input_new_guide_code'), this)
        return
      }
      if (
        this.changeBinding.oldGuideUserId === this.changeBinding.newGuideUserId
      ) {
        basicUtil.alert(this.$t('member_input_guide_code_same'), this)
        return
      }
      if (
        !/^\d*$/.test(this.changeBinding.oldGuideUserId) &&
        !/^\d*$/.test(this.changeBinding.newGuideUserId)
      ) {
        basicUtil.alert(this.$t('guide_code_only_number'), this)
        return
      }
      const self = this
      memberService
        .queryUserCountByGuideUserId(this.changeBinding)
        .then(res => {
          if (res.code === '0') {
            const count = res.data.count
            memberService.checkNewGuideStatus(self.changeBinding).then(res1 => {
              if (res1.code === '0') {
                self
                  .$confirm(
                    self.$t('member_guide_count_info', { count: count }),
                    self.$t('prompt'),
                    {
                      confirmButtonText: self.$t('determine'),
                      cancelButtonText: self.$t('cancel'),
                      type: 'warning'
                    }
                  )
                  .then(() => {
                    self.changeBinding.storeId = this.shopListTable.checkedList[0].id
                    self.changeBinding.storeCode = this.shopListTable.checkedList[0].orgCode
                    self.changeBinding.storeName = this.shopListTable.checkedList[0].orgName
                    memberService
                      .updateGuideByGuideUserIdWithTx(self.changeBinding)
                      .then(res2 => {
                        if (res2.code === '0') {
                          basicUtil.alert(self.$t('save_success'), self)
                          self.shoppingGuideShow = false
                          self.queryMemberInfoList()
                        }
                      })
                  })
              }
            })
          }
        })
    },
    updateStatus(row) {
      if (
        row.isAvailable === 2 ||
        !this.$portal.hasPermission('OuserCenterMemberEnable')
      ) {
        return
      }
      const userId = row.userId
      const status = row.isAvailable === 1 ? 0 : 1
      const operateInfo =
        row.isAvailable === 1 ? this.$t('disable') : this.$t('enable')

      const self = this
      this.$confirm(
        self.$t('member_confirm_info', { operate: operateInfo }),
        self.$t('prompt'),
        {
          confirmButtonText: self.$t('determine'),
          cancelButtonText: self.$t('cancel'),
          type: 'warning'
        }
      ).then(() => {
        const memberService = this.$crm.$api.memberService
        memberService
          .updateStatus({ userId: userId, status: status })
          .then(res => {
            if (res.code === '0') {
              this.queryMemberInfoList()
            }
          })
      })
    },
    memberTypeLevelChange() {
      this.membershipGradeList = []
      this.searchForm.memberLevelId = null
      this.memberTypeList.forEach(item => {
        if (item.id === this.searchForm.memberTypeId) {
          this.membershipGradeList = item.membershipLevels
        }
      })
    },
    onShowShopModal() {
      this.showShopModal = true
    },
    handleStoreOk(shopInfo) {
      const self = this
      this.shopGuideList = []
      this.saveMemberInfo.guide = null
      this.saveMemberInfo.storeName = shopInfo.storeName
      this.saveMemberInfo.storeId = shopInfo.storeId
      this.saveMemberInfo.storeCode = shopInfo.storeCode // 根据店铺获取对应导购员
      const employeeService = this.$crm.$api.employeeService
      employeeService
        .queryStoreEmployeeList({
          platformId: 5,
          entityIds: [shopInfo.storeId],
          isAvailable: 1,
          currentPage: 1,
          itemsPerPage: 500
        })
        .then(res => {
          if (res.code === '0') {
            if (!res.data.listObj) {
              res.data.listObj = []
            }
            res.data.listObj.forEach(item => {
              self.shopGuideList.push({
                label: item.identityCardName,
                value: item.userId
              })
            })
          }
        })
    },
    async getGrowthRuleInfo() {
      const vue = this
      const param = {
        type: 2,
        subType: 0,
        entityType: 2
      }
      const crmService = vue.$crm.$api.crmService
      crmService.listRulePage(param).then(result => {
        if (result.code === '0' && result.data.length > 0) {
          var obj = result.data[0]
          vue.growthRuleInfo.status = obj.status
          vue.growthRuleInfo.id = obj.id
        }
      })
    },
    handleClear() {
      this.shopGuideList = []
      this.saveMemberInfo.guide = null
      this.saveMemberInfo.storeName = null
      this.saveMemberInfo.storeId = null
      this.saveMemberInfo.storeCode = null
    },
    shopHandleSelectionChange(val) {
      this.shopListTable.checkedList = [val]
    },
    queryShopInfoList() {
      if (this.memberBindingShow) {
        if (!this.changeBinding.newGuideUserId) {
          basicUtil.alert(this.$t('member_input_guide_code'), this)
          return
        }
        if (!/^\d*$/.test(this.changeBinding.newGuideUserId)) {
          basicUtil.alert(this.$t('guide_code_only_number'), this)
          return
        }
      } else if (this.shoppingGuideShow) {
        if (!this.changeBinding.oldGuideUserId) {
          basicUtil.alert(this.$t('member_input_old_guide_code'), this)
          return
        }
        if (!this.changeBinding.newGuideUserId) {
          basicUtil.alert(this.$t('member_input_new_guide_code'), this)
          return
        }
        if (
          this.changeBinding.oldGuideUserId ===
          this.changeBinding.newGuideUserId
        ) {
          basicUtil.alert(this.$t('member_input_guide_code_same'), this)
          return
        }
        if (
          !/^\d*$/.test(this.changeBinding.oldGuideUserId) ||
          !/^\d*$/.test(this.changeBinding.newGuideUserId)
        ) {
          basicUtil.alert(this.$t('guide_code_only_number'), this)
          return
        }
      } else {
        return
      }
      /* const employeeService = this.$crm.$api.employeeService
      employeeService.queryEmployeeStoreIds({ platformId: 5, userId: this.changeBinding.newGuideUserId, isAvailable: 1 }).then((res) => {
        if (res.code === '0') {
          if (res.data != null && res.data.length > 0) {
            const param = {
              currentPage: this.shopSearchForm.currentPage,
              itemsPerPage: this.shopSearchForm.itemsPerPage,
              storeIds: res.data
            }
            const userService = this.$crm.$api.userService
            userService.queryStoreInfoList(param).then((res) => {
              if (res.code === '0') {
                this.shopListTable.list = res.data.listObj
                this.shopListTable.total = res.data.total
                this.shopListTable.checkedList = []
              }
            })
          } else {
            this.shopListTable.list = []
            this.shopListTable.total = 0
            this.shopListTable.checkedList = []
          }
        }
      })*/
      const param = {
        currentPage: this.shopSearchForm.currentPage,
        itemsPerPage: this.shopSearchForm.itemsPerPage,
        userId: this.changeBinding.newGuideUserId
      }
      const userService = this.$crm.$api.userService
      userService.queryStoreInfoList(param).then(res => {
        if (res.code === '0') {
          this.shopListTable.list = res.data.listObj
          this.shopListTable.total = res.data.total
          this.shopListTable.checkedList = []
        }
      })
    },
    todetail(userId, isAvailable) {
      var newi = isAvailable === '启用' ? 1 : isAvailable === '停用' ? 0 : 2

      this.$router.push({
        name:
          this.authEnable === true
            ? 'OuserCenterMemberDetailStore'
            : 'OuserCenterMemberDetail',
        query: {
          userId: userId,
          showOrEdit: false,
          isAvailable: newi
        }
      })
    }
  }
}
</script>
<style scoped lang = "less">
.member-list{
/deep/ .el-picker-panel__footer {
.el-picker-panel__link-btn:nth-of-type(1) {
  display:none;
} }
}
</style>
<style scoped>
.batch-import{
  margin-left:16px;
  margin-right:16px;
}
.batch-export{
  margin-right:16px;
}
.import-task{
   margin-left:16px;
}
</style>
