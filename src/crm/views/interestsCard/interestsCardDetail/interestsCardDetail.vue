<template>
  <section>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('基本信息') }}</span>
      </div>
      <div style="position:relative;">
        <div
          :style="{'background-image':'url('+detailObj.backgroundUrl+')','box-shadow':'0px 0px 10px #333333','background-repeat':'no-repeat','background-size':'300px 180px',width:'300px',borderRadius:'10px',height:'180px',position:'absolute',top:'20px',right:'20px'}"
        >
          <p
            style="margin:20px;color:#ffffff;font-size:24px;text-shadow:0px 0px 10px #000000;"
          >{{ detailObj.name }}</p>
          <span
            style="margin-left:20px;color:#ffffff;font-size:18px;text-shadow:0px 0px 10px #000000;"
          >{{ detailObj.cardEffDateType === '1' || detailObj.cardEffDateType === 1 ? $t('永久有效') : $t('有效期') + ' ' + (detailObj.expirationTimeStr ? detailObj.expirationTimeStr : '') + ' ' + $t('天') }}</span>
        </div>
      </div>
      <el-row>
        <el-col :span="6">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('卡号')">{{ detailObj.no }}</el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('权益卡名称')" required>
              <el-input
                v-model="detailObj.name"
                :disabled="$route.params.isEdit == 0"
                :placeholder="$t('请输入内容')"
                name="detailObj_name"
                show-word-limit
                maxlength="6"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('可领卡日期')" required>
              <el-radio
                :disabled="$route.params.isEdit == 0"
                v-model="detailObj.receiveDateType"
                name="detailObj_receiveDateType"
                label="1"
              >{{ $t('永久有效') }}</el-radio>
              <el-radio
                :disabled="$route.params.isEdit == 0"
                v-model="detailObj.receiveDateType"
                name="detailObj_receiveDateType1"
                label="2"
              >{{ $t('指定时间') }}</el-radio>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row v-show="detailObj.receiveDateType == 2">
        <el-col :span="6">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item prop="name">
              <ody-date-range-picker
                v-model="detailObj.receiveTime"
                :disabled="$route.params.isEdit == 0"
                :show-button="false"
                name="detailObj_receiveTime"
                type="datetimer"
              />
              <!--<ody-date-range-picker v-model="detailObj.receiveTime" :disabled="$route.params.isEdit == 0" :show-button="false" name="detailObj_receiveTime1"/>-->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('达成条件')" required>
              <el-radio
                :disabled="$route.params.isEdit == 0 || $route.params.isEdit == 1"
                v-model="detailObj.receiveType"
                name="detailObj_receiveType"
                label="1"
              >{{ $t('直接领取') }}</el-radio>
              <el-radio
                :disabled="$route.params.isEdit == 0 || $route.params.isEdit == 1"
                v-model="detailObj.receiveType"
                name="detailObj_receiveType3"
                label="2"
              >{{ $t('付费购买') }}</el-radio>
              <el-radio
                :disabled="$route.params.isEdit == 0 || $route.params.isEdit == 1"
                v-model="detailObj.receiveType"
                name="detailObj_receiveType2"
                label="3"
              >{{ $t('累计消费金额') }}</el-radio>
              <el-radio
                :disabled="$route.params.isEdit == 0 || $route.params.isEdit == 1"
                v-model="detailObj.receiveType"
                name="detailObj_receiveType1"
                label="4"
              >{{ $t('累计总积分') }}</el-radio>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item prop="name">
              <el-input
                v-show="detailObj.receiveType == 2"
                v-model="detailObj.price"
                :disabled="$route.params.isEdit == 0"
                :placeholder="$t('请输入内容')"
                name="detailObj_price"
                maxlength="6"
              >
                <template slot="prepend">{{ $t('价格') }}</template>
                <template slot="append">{{ $t('元') }}</template>
              </el-input>
              <el-input
                v-show="detailObj.receiveType == 3"
                v-model="detailObj.accAmount"
                :disabled="$route.params.isEdit == 0"
                :placeholder="$t('请输入内容')"
                name="detailObj_accAmount"
                maxlength="6"
              >
                <template slot="prepend">{{ $t('累计消费金额达') }}</template>
                <template slot="append">{{ $t('元') }}</template>
              </el-input>
              <el-input
                v-show="detailObj.receiveType == 4"
                v-model="detailObj.accPoint"
                :disabled="$route.params.isEdit == 0"
                :placeholder="$t('请输入内容')"
                name="detailObj_accPoint"
                maxlength="6"
              >
                <template slot="prepend">{{ $t('累计总积分达') }}</template>
                <template slot="append">{{ $t('分') }}</template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('卡有效期')" required>
              <el-radio
                :disabled="$route.params.isEdit == 0"
                v-model="detailObj.cardEffDateType"
                name="detailObj_cardEffDateType"
                label="1"
              >{{ $t('永久有效') }}</el-radio>
              <el-radio
                :disabled="$route.params.isEdit == 0"
                v-model="detailObj.cardEffDateType"
                name="detailObj_cardEffDateType1"
                label="2"
              >{{ $t('指定时间') }}</el-radio>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row v-show="detailObj.cardEffDateType == 2">
        <el-col :span="10">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item prop="name">
              <el-input
                v-model="detailObj.expirationTimeStr"
                :disabled="$route.params.isEdit == 0"
                :placeholder="$t('请输入内容')"
                name="detailObj_expirationTimeStr"
                maxlength="6"
              >
                <template slot="prepend">{{ $t('领卡时起') }}</template>
                <template slot="append">{{ $t('天内有效') }}</template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('权益卡背景')" required>
              <ody-upload-image
                :disabled="$route.params.isEdit == 0"
                v-model="detailObj.backgroundUrl"
                :pic-type="picType"
                :show-tip="false"
                name="detailObj_backgroundUrl"
              />
              <br >
              <span>{{ $t('权益卡背景提示') }}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('使用须知')">
              <el-input
                :disabled="$route.params.isEdit == 0"
                v-model="detailObj.information"
                name="detailObj_information"
                type="textarea"
                show-word-limit
                maxlength="1000"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <br >
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('选择权益组') }}</span>
      </div>
      <div>
        <ody-button
          :disabled="$route.params.isEdit == 0"
          name="CrmInterestsCardChooseGroup_selectGroup"
          style="margin-bottom:20px;"
          size="small"
          type="primary"
          code="CrmInterestsCardChooseGroup"
          @click="selectGroup"
        >{{ $t('选择权益组') }}</ody-button>
        <el-form>
          <ody-table
            :loading="loading"
            :data="chooseGroupList"
            :columns="groupColumns"
            :can-filter="false"
            :operates="groupOperates"
            name="chooseGroupList984"
          />
        </el-form>
      </div>
    </el-card>
    <br >
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('权益内容') }}</span>
      </div>
      <div>
        <el-form>
          <ody-table
            :loading="loading"
            :data="interestsList"
            :columns="columns"
            :can-filter="false"
            name="interestsList924"
          >
            <template slot="input" slot-scope="scope">
              <el-form-item prop="wu">
                <el-input
                  :disabled="$route.params.isEdit == 0"
                  v-model="scope.row.name"
                  name="scope_row_name"
                  maxlength="6"
                  show-word-limit
                />
              </el-form-item>
            </template>
            <template slot="interests" slot-scope="scope">
              <el-form-item prop="wu">
                <el-input
                  v-if="interestsTypeMap[parseInt(scope.row.type)].type === 'free'"
                  :disabled="true"
                  v-model="scope.row.param"
                  :placeholder="interestsTypeMap[parseInt(scope.row.type)].label"
                  name="scope_row_param"
                >
                  <template slot="append">{{ $t('折') }}</template>
                </el-input>
                <el-input
                  v-if="interestsTypeMap[parseInt(scope.row.type)].type === 'pre'"
                  :disabled="true"
                  v-model="scope.row.param"
                  :placeholder="interestsTypeMap[parseInt(scope.row.type)].label"
                  name="scope_row_param"
                >
                  <template slot="append">{{ $t('倍') }}</template>
                </el-input>
                <!--折-->
                <el-input
                  v-if="interestsTypeMap[parseInt(scope.row.type)].type === 'fixed'"
                  :disabled="true"
                  v-model="scope.row.param"
                  :placeholder="interestsTypeMap[parseInt(scope.row.type)].label"
                  name="scope_row_param7"
                />
                <!--倍-->
                <ody-promotion-coupon-choose
                  v-if="interestsTypeMap[parseInt(scope.row.type)].type === 'coupon'"
                  :disabled="true"
                  :view="true"
                  v-model="scope.row.couponObj.ids"
                  :selected.sync="scope.row.couponObj.selected"
                  :multiple="true"
                  :placeholder="$t('请选择')"
                  name="scope_row_couponObj_ids"
                />
                <ody-button
                  v-if="interestsTypeMap[parseInt(scope.row.type)].type === 'customer'"
                  name="CrmMembershipLevelSetLink_openDialogzdy"
                  size="small"
                  type="primary"
                  code="CrmMembershipLevelSetLink"
                  @click="openDialogzdy(scope.row)"
                >{{ $t('配置链接') }}</ody-button>
              </el-form-item>
            </template>
          </ody-table>
        </el-form>
      </div>
    </el-card>
    <br >
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('参与条件') }}</span>
      </div>
      <div>
        <el-row>
          <el-col :span="12">
            <el-form ref="info" :model="info" label-width="130px">
              <el-form-item :label="$t('渠道')" prop="name">
                <el-checkbox
                  :disabled="$route.params.isEdit == 0"
                  v-model="checkAllChannel"
                  :indeterminate="isIndeterminate"
                  name="checkAllChannel"
                  @change="channelAll"
                >{{ $t('全部') }}</el-checkbox>
                <el-checkbox-group
                  v-model="detailObj.channelArr"
                  name="detailObj_channelArr"
                  @change="handleCheckedChanncelChange"
                >
                  <el-checkbox
                    v-for="channel in channels"
                    :disabled="$route.params.isEdit == 0 || detailChannelArr.indexOf(channel.code) >= 0"
                    :label="channel.code"
                    :key="channel.code"
                  >{{ channel.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form ref="info" :model="info" label-width="130px">
              <el-form-item :label="$t('前端展示')" prop="name">
                <el-checkbox-group v-model="detailObj.areaArr" name="detailObj_areaArr">
                  <el-checkbox
                    :disabled="$route.params.isEdit == 0"
                    label="1"
                    @change="areaChange"
                  >{{ $t('权益卡专区') }}</el-checkbox>
                </el-checkbox-group>
                <el-input
                  v-show="detailObj.isFrontShow === 1"
                  v-model="detailObj.frontShowSort"
                  :disabled="$route.params.isEdit == 0"
                  :placeholder="$t('请输入优先级')"
                  name="detailObj_frontShowSort"
                  show-word-limit
                  maxlength="10"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <ody-fixed>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('关闭') }}</el-button>
      <ody-button
        v-show="$route.params.isEdit != 0"
        :loading="submitLoading"
        name="CrmInterestsCardSave_submit"
        size="small"
        type="primary"
        code="CrmInterestsCardSave"
        @click="submit"
      >{{ $t('common_save') }}</ody-button>
    </ody-fixed>

    <!--选择权益组-->
    <ody-dialog :visible.sync="dialogGroup" :title="$t('选择权益组')" width="960px">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="3px" class="form">
            <!-- 编号 -->
            <el-row>
              <el-col :span="16">
                <el-form ref="info" :model="info" label-width="130px">
                  <el-form-item :label="$t('权益组编号')" prop="name">
                    <el-input
                      v-model="searchForm.filters.id"
                      :placeholder="$t('请输入内容')"
                      name="searchForm_filters_id"
                      show-word-limit
                      maxlength="16"
                    />
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          <el-button name="selectGroup" size="small" type="primary" @click="selectGroup">{{ $t('common_select') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="groupList"
            :columns="groupListColumns"
            :can-filter="false"
            :checked.sync="checked"
            name="groupList309"
            multiple="true"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="page.current"
            :list="groupList"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.size"
            :total.sync="page.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleRelSearchSubmit"
            @current-change="handleRelPageCurrentChange"
          />
        </div>
      </ody-list-table-area>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancelChooseGroup" @click="cancelChooseGroup">{{ $t('取消') }}</el-button>
        <el-button name="chooseGroup" type="primary" @click="chooseGroup">{{ $t('确定') }}</el-button>
      </div>
    </ody-dialog>
    <couponView
      ref="mychild"
      :is-edit="false"
      :ilist="nowList"
      :dialog-visible="dialogVisible"
      :dialog-visible-view="dialogVisibleView"
      @closeViewDialog="closeViewDialogWindow"
      @closeDialog="closeDialogWindow"
      @updateData="updateCoupon"
    />

    <!-- 自定义权益弹框 -->
    <el-dialog :visible.sync="zdyDialog" :title="$t('添加自定义链接')">
      <el-form :model="form">
        <el-form-item v-show="false" :label-width="formLabelWidth" :label="$t('链接类型')">
          <el-radio
            :disabled="$route.params.isEdit == 0"
            v-model="zdyDialogParam.type"
            name="zdyDialogParam_type"
            label="url"
          >{{ $t('网址') }}</el-radio>
          <el-radio
            :disabled="$route.params.isEdit == 0"
            v-model="zdyDialogParam.type"
            name="zdyDialogParam_type2"
            label="img"
          >{{ $t('图片') }}</el-radio>
        </el-form-item>
        <el-form-item
          v-show="zdyDialogParam.type === 'url'"
          :label-width="formLabelWidth"
          :label="$t('链接地址')"
        >
          <el-input :disabled="true" v-model="zdyDialogParam.link" name="zdyDialogParam_link" autocomplete="off" />
        </el-form-item>
        <ody-upload-image
          v-show="zdyDialogParam.type === 'img'"
          :disabled="$route.params.isEdit == 0"
          v-model="zdyDialogParam.imgUrl"
          :pic-type="picType"
          :show-tip="true"
          name="zdyDialogParam_imgUrl"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancelDialogzdy" @click="cancelDialogzdy">{{ $t('common_cancel') }}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import couponView from '@/components/coupon-view'
import util from '@/utils/util'
export default {
  name: 'CrmInterestsCardDetail',
  components: {
    couponView,
    child: couponView
  },
  data() {
    // const vue = this
    return {
      interestsTypeMap: {},
      nowList: [],
      submitLoading: false,
      dialogVisibleView: false,
      dialogVisible: false,
      // { code: '110001', name: '欧电云自建BBC' }, { code: '110002', name: '欧电云自建B2B' }, { code: '110003', name: '欧电云自建O2O' }, { code: '120001', name: '欧电云自建POS' }
      channels: [],
      // '110001', '110002', '110003', '120001'
      channelCodes: [],
      zdyDialog: false,
      zdyDialogParam: {
        item: null, // 对象
        type: null, // 类型 url\img
        link: '', // 网页链接
        imgUrl: '' // 图片地址
      },
      isIndeterminate: true,
      detailObj: {
        name: null,
        information: null,
        frontShowSort: null,
        backgroundUrl: null,
        no: null,
        receiveValue: null,
        channelCodes: null,
        expirationTime: null,
        interestsGroupList: null,
        isFrontShow: null,
        receiveEndTime: null,
        receiveEndTimeStr: null,
        receiveStartTime: null,
        receiveStartTimeStr: null,
        price: null,
        accAmount: null,
        accPoint: null,
        expirationTimeStr: null,
        receiveType: '1',
        receiveDateType: '1',
        cardEffDateType: '1',
        channelArr: [],
        areaArr: []
      },
      detailChannelArr: [], // 原本的渠道
      disabled: '永久有效',
      searchForm: getDefaultSearchForm(),
      checked: [],
      checkAllChannel: false,
      interestsList: [],
      interestsObj: {
        id: null,
        name: null,
        interestsList: []
      },
      dialogGroup: false,
      groupList: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      groupListColumns: [
        {
          show: true,
          prop: 'id',
          label: this.$t('权益组编号'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('权益组名称'),
          align: 'center',
          minWidth: 80
        }
      ],
      chooseGroupList: [],
      groupColumns: [
        {
          show: true,
          prop: 'id',
          label: this.$t('权益组编号'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('权益组名称'),
          align: 'center',
          minWidth: 80
        }
      ],
      groupOperates: {
        fixed: 'right',
        width: 300,
        align: 'center',
        list: [
          {
            label: this.$t('删除'),
            method: (index, row) => {
              this.$confirm(this.$t('确认删除吗'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.delChooseGroup(row)
              })
            },
            disabled: (index, row) => {
              return this.$route.params.isEdit === 0
            },
            code: 'CrmInterestsCardDeleteGroup'
          }
        ]
      },
      columns: [
        // {
        //   show: true,
        //   prop: 'groupName',
        //   label: this.$t('权益组名称'),
        //   align: 'center',
        //   minWidth: 80
        // },
        {
          show: true,
          prop: 'typeStr',
          label: this.$t('权益类型'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            return this.interestsTypeMap[parseInt(row.type)].label
          }
        },
        {
          show: true,
          label: this.$t('权益名称'),
          prop: 'name',
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          label: this.$t('权益参数'), // 权益参数
          align: 'center',
          slot: 'interests',
          minWidth: 50
        }
      ]
    }
  },
  async mounted() {
    try {
      let interestsTypeCode = {}
      await this.$crm.$api.common.codeListMulti({ categorys: ['SYS_CHANNEL', 'interestsType'], pool: 'crm' }).then(res => {
        for (const i in res.data['SYS_CHANNEL']) {
          this.channels.push({ code: +i + '', name: res.data['SYS_CHANNEL'][i] })
          this.channelCodes.push(+i + '')
        }
        interestsTypeCode = res.data['interestsType']
      })
      let interestsTypeMap = {}
      await this.$crm.$api.common.getStringValue({ key: 'interestsType' }).then(res => {
        interestsTypeMap = JSON.parse(res.data)
      })

      for (const i of Object.keys(interestsTypeCode)) {
        const one = { label: interestsTypeCode[i] }
        for (const j of Object.keys(interestsTypeMap)) {
          const typeOne = interestsTypeMap[j]
          for (const k of typeOne.arr) {
            if (parseInt(k) === parseInt(i)) {
              one.type = j
              one.sort = typeOne.sort
            }
          }
        }

        this.interestsTypeMap[parseInt(i)] = one
      }

      if (this.$route.params.id == null || this.$route.params.id === 'x') {
        // 调用获取一个新卡号
        await getNo(this)
        return
      }
      const vue = this
      const id = this.$route.params.id
      const interestsCard = vue.$crm.$api.interestsCard
      await interestsCard.getInterestsCardInterestsList([{ id: id }]).then(res => {
        vue.detailObj.id = res.data[0].id
        vue.detailObj.no = res.data[0].no
        vue.detailObj.information = res.data[0].information
        vue.detailObj.name = res.data[0].name
        vue.detailObj.frontShowSort = res.data[0].frontShowSort
        vue.detailObj.backgroundUrl = res.data[0].backgroundUrl
        vue.detailObj.receiveType = res.data[0].receiveType
        vue.detailObj.receiveValue = res.data[0].receiveValue
        vue.detailObj.channelCodes = res.data[0].channelCodes
        vue.detailObj.expirationTime = res.data[0].expirationTime
        vue.detailObj.interestsGroupList = res.data[0].interestsGroupList
        vue.detailObj.isFrontShow = res.data[0].isFrontShow
        vue.detailObj.receiveEndTime = res.data[0].receiveEndTime
        vue.detailObj.receiveEndTimeStr = res.data[0].receiveEndTimeStr
        vue.detailObj.receiveStartTime = res.data[0].receiveStartTime
        vue.detailObj.receiveStartTimeStr = res.data[0].receiveStartTimeStr

        // 渠道转换
        if (vue.detailObj.channelCodes) {
          vue.detailObj.channelArr = vue.detailObj.channelCodes.split(',')
          vue.detailChannelArr = vue.detailObj.channelCodes.split(',')
          // vue.channelCodes = vue.detailObj.channelCodes.split(',')
          for (var i = 0; i < vue.detailObj.channelArr.length; i++) {
            vue.detailObj.channelArr[i] = vue.detailObj.channelArr[i] + ''
          }
          if (vue.detailObj.channelArr.length === 4) {
            vue.isIndeterminate = false
            vue.checkAllChannel = true
          }
        }
        // 是否前台展示
        if (vue.detailObj.isFrontShow === 1) {
          vue.detailObj.areaArr.push('1')
        }
        // 指定时间
        if (vue.detailObj.receiveStartTime || vue.detailObj.receiveEndTime) {
          vue.detailObj.receiveStartTime = vue.detailObj.receiveStartTimeStr
          vue.detailObj.receiveEndTime = vue.detailObj.receiveEndTimeStr
          vue.detailObj.receiveTime = [
            vue.detailObj.receiveStartTimeStr,
            vue.detailObj.receiveEndTimeStr
          ]
          vue.detailObj.receiveDateType = '2'
        } else {
          vue.detailObj.receiveDateType = '1'
        }
        // 达成条件
        vue.detailObj.receiveType = vue.detailObj.receiveType + ''
        switch (vue.detailObj.receiveType) {
          case '1':
            vue.detailObj.receiveValue = null
            break
          case '2':
            vue.detailObj.price = vue.detailObj.receiveValue
            break
          case '3':
            vue.detailObj.accAmount = vue.detailObj.receiveValue
            break
          case '4':
            vue.detailObj.accPoint = vue.detailObj.receiveValue
            break
          default:
            vue.detailObj.receiveValue = null
        }
        // 卡有效期
        if (vue.detailObj.expirationTime) {
          // 存在的话
          vue.detailObj.expirationTimeStr =
            vue.detailObj.expirationTime / 24 / 60 / 60 / 1000
          vue.detailObj.cardEffDateType = '2'
        } else {
          vue.detailObj.expirationTime = null
          vue.detailObj.cardEffDateType = '1'
        }

        vue.chooseGroupList = vue.detailObj.interestsGroupList
        for (var x = 0; x < vue.chooseGroupList.length; x++) {
          if (!vue.chooseGroupList[x].interestsList) {
            continue
          }
          for (var j = 0; j < vue.chooseGroupList[x].interestsList.length; j++) {
            vue.chooseGroupList[x].interestsList[j].groupName =
              vue.chooseGroupList[x].name
          }
          vue.interestsList = vue.interestsList.concat(
            vue.chooseGroupList[x].interestsList
          )
        }
        // 初始化赋值
        for (var ii = 0; ii < vue.interestsList.length; ii++) {
          vue.interestsList[ii].couponObj = {
            ids: [],
            selected: []
          }
          if (vue.interestsList[ii].type === 3) {
            // 优惠券
            vue.interestsList[ii].couponObj = {
              ids: [],
              selected: []
            }
            vue.interestsList[ii].couponObj.selected = JSON.parse(
              vue.interestsList[ii].param
            )
            vue.interestsList[ii].couponObj.ids = []
            for (
              var ci = 0;
              ci < vue.interestsList[ii].couponObj.selected.length;
              ci++
            ) {
              vue.interestsList[ii].couponObj.ids.push(
                vue.interestsList[ii].couponObj.selected[ci].id
              )
            }
          } else {
            vue.interestsList[ii].couponObj = {
              ids: [],
              selected: []
            }
          }
        }
        vue.interestsList = util.removeRepeatInterests(vue.interestsList, vue)
      })
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    viewCoupon(row) {
      this.dialogVisibleView = true
      this.nowList = [row]
      setTimeout(() => {
        this.$refs.mychild.matchCoupon()
        this.$refs.mychild.showSelect()
      }, 100)
    },
    closeViewDialogWindow(data) {
      this.dialogVisibleView = false
    },
    returnBack() {
      this.$portal.delActiveViewAndRefresh()
    },
    areaChange(val) {
      if (val) {
        this.detailObj.isFrontShow = 1
      } else {
        this.detailObj.isFrontShow = 0
      }
    },
    channelAll(val) {
      console.log(val)
      console.log(this.detailObj.channelArr)
      this.detailObj.channelArr = val
        ? this.channelCodes
        : this.detailChannelArr
      console.log(this.channelCodes)
      this.isIndeterminate = false
    },
    handleCheckedChanncelChange(value) {
      const checkedCount = value.length
      this.checkAllChannel = checkedCount === this.channelCodes.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.channelCodes.length
    },
    handleRelSearchSubmit() {
      this.selectGroup()
    },
    handleRelPageCurrentChange() {
      this.selectGroup()
    },
    selectGroup() {
      this.dialogGroup = true
      this.selectGroupList()
    },
    async selectGroupList() {
      await queryGroupList(this)
    },
    delChooseGroup(row) {
      var delId = row.id
      for (var i = 0; i < this.chooseGroupList.length; i++) {
        var cobj = this.chooseGroupList[i]
        if (cobj.id === delId) {
          this.chooseGroupList.splice(i, 1)
        }
      }
      var stayArr = []
      for (var j = 0; j < this.interestsList.length; j++) {
        // interestsList
        var iobj = this.interestsList[j]
        if (iobj.groupId !== delId) {
          stayArr.push(iobj)
        }
      }
      this.interestsList = stayArr
      if (this.interestsList && this.interestsList.length > 0) {
        queryinterestsList(this)
      }
    },
    async chooseGroup() {
      this.dialogGroup = false
      var idArr = []
      for (var j = 0; j < this.chooseGroupList.length; j++) {
        var chooseObj = this.chooseGroupList[j]
        idArr.push(chooseObj.id)
      }
      for (var i = 0; i < this.checked.length; i++) {
        var checkedObj = this.checked[i]
        if (idArr.indexOf(checkedObj.id) >= 0) {
          continue
        } else {
          this.chooseGroupList.push(checkedObj)
        }
      }
      this.checked = []
      await queryinterestsList(this)
    },
    cancelChooseGroup() {
      this.dialogGroup = false
      this.checked = []
    },
    async handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.selectGroupList()
    },
    openDialogzdy(row) {
      var param = row.param
      if (param && param !== '') {
        console.log(param)
        var paramObj = JSON.parse(param)
        this.zdyDialogParam.type = paramObj.type // 默认网址链接
        if (this.zdyDialogParam.type === 'url') {
          this.zdyDialogParam.link = paramObj.value
          this.zdyDialogParam.imgUrl = null
        } else {
          this.zdyDialogParam.imgUrl = paramObj.value
          this.zdyDialogParam.link = null
        }
      } else {
        // 默认值
        this.zdyDialogParam.type = 'url' // 默认网址链接
        this.zdyDialogParam.imgUrl = null
        this.zdyDialogParam.link = null
      }
      this.zdyDialogParam.item = row
      this.zdyDialog = true
    },
    cancelDialogzdy() {
      // 关闭并回复默认值
      this.zdyDialog = false
      this.zdyDialogParam.type = 'url' // 默认网址链接
      this.zdyDialogParam.imgUrl = null
      this.zdyDialogParam.link = null
      this.zdyDialogParam.item = null
    },
    async submit() {
      var vue = this
      if (!this.detailObj.name) {
        this.$message({
          message: vue.$t('名称必填'),
          type: 'warning'
        })
        return
      }
      if (
        this.detailObj.receiveDateType === '2' ||
        this.detailObj.receiveDateType === 2
      ) {
        if (
          !this.detailObj.receiveTime ||
          this.detailObj.receiveTime.length < 2
        ) {
          this.$message({
            message: vue.$t('可领卡日期必填'),
            type: 'warning'
          })
          return
        }
      }
      if (
        this.detailObj.receiveType === 2 ||
        this.detailObj.receiveType === '2'
      ) {
        var reg = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){0,4})?$/
        var check = reg.test(this.detailObj.price)
        if (
          !check ||
          this.detailObj.price === 0 ||
          this.detailObj.price === '0'
        ) {
          this.$message({
            message: vue.$t('请填写正确的付费价格'),
            type: 'warning'
          })
          return
        }
      }
      if (
        this.detailObj.receiveType === 3 ||
        this.detailObj.receiveType === '3'
      ) {
        var reg2 = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){0,4})?$/
        var check2 = reg2.test(this.detailObj.accAmount)
        if (!check2) {
          this.$message({
            message: vue.$t('请填写正确的消费金额'),
            type: 'warning'
          })
          return
        }
      }
      if (
        this.detailObj.receiveType === 4 ||
        this.detailObj.receiveType === '4'
      ) {
        var reg3 = /^[1-9]{1}[0-9]*$/
        var check3 = reg3.test(this.detailObj.accPoint)
        if (!check3) {
          this.$message({
            message: vue.$t('请填写正确的积分数量'),
            type: 'warning'
          })
          return
        }
      }
      if (
        this.detailObj.cardEffDateType === '2' ||
        this.detailObj.cardEffDateType === 2
      ) {
        if (!this.detailObj.expirationTimeStr) {
          this.$message({
            message: vue.$t('卡有效期必填'),
            type: 'warning'
          })
          return
        }
      }

      if (!this.detailObj.backgroundUrl) {
        this.$message({
          message: vue.$t('权益卡背景未上传'),
          type: 'warning'
        })
        return
      }

      if (this.detailObj.channelArr.length === 0) {
        this.$message({
          message: vue.$t('至少选择一个渠道'),
          type: 'warning'
        })
        return
      }
      if (this.detailObj.isFrontShow === 1) {
        var reg4 = /^([0-9]{1}\d*)$/
        var check4 = reg4.test(this.detailObj.frontShowSort)
        if (!check4) {
          this.$message({
            message: vue.$t('请填写正确的优先级'),
            type: 'warning'
          })
          return
        }
      }

      // if (this.chooseGroupList.length === 0) {
      //   this.$message({
      //     message: '权益组不能为空！',
      //     type: 'warning'
      //   })
      //   return
      // }
      this.submitLoading = true
      if (this.detailObj.id) {
        await update(this)
        this.submitLoading = false
      } else {
        await add(this)
        this.submitLoading = false
      }
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({
    page: 1,
    limit: 10,
    filters: {}
  })
}

async function getNo(vue) {
  vue.detailObj.interestsGroupList = vue.chooseGroupList
  const interestsCard = vue.$crm.$api.interestsCard
  const res = await interestsCard.getInterestsCardNo()
  if (res.code === '0') {
    vue.detailObj.no = res.data
  }
}

async function queryGroupList(vue) {
  const rightsInterests = vue.$crm.$api.rightsInterests
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  const res = await rightsInterests.listInterestsGroup(vue.searchForm)
  if (res) {
    const data = res.data
    vue.groupList = data
    vue.page.total = res.total
  }
}

async function queryinterestsList(vue) {
  if (!vue.chooseGroupList || vue.chooseGroupList.length === 0) {
    return
  }
  const rightsInterests = vue.$crm.$api.rightsInterests
  const res = await rightsInterests.interestsDetailList(vue.chooseGroupList)
  var nameMap = vue.chooseGroupList.reduce((m, i) => {
    m[i.id] = i.name
    return m
  }, {})
  if (res) {
    vue.interestsList = []
    const data = res.data
    for (var j = 0; j < data.length; j++) {
      if (data[j].status === 1) {
        if (data[j].type === 3) {
          // 优惠券
          data[j].couponObj = {
            ids: [],
            selected: []
          }
          data[j].couponObj.selected = JSON.parse(data[j].param)
          data[j].couponObj.ids = []
          for (var ci = 0; ci < data[j].couponObj.selected.length; ci++) {
            data[j].couponObj.ids.push(data[j].couponObj.selected[ci].id)
          }
        } else {
          data[j].couponObj = {
            ids: [],
            selected: []
          }
        }
        vue.interestsList.push(data[j])
      }
    }
    // vue.interestsList = data
    vue.interestsList = util.removeRepeatInterests(vue.interestsList, vue)
    for (var i = 0; i < vue.interestsList.length; i++) {
      vue.interestsList[i].groupName = nameMap[vue.interestsList[i].groupId]
    }
  }
}

// 折扣和积分的排除掉无用的，只留优惠力度最大的

async function add(vue) {
  vue.detailObj.interestsGroupList = vue.chooseGroupList
  const interestsCard = vue.$crm.$api.interestsCard
  // 渠道转换
  if (vue.detailObj.channelArr.length > 0) {
    vue.detailObj.channelCodes = vue.detailObj.channelArr.join(',')
  }
  // 是否前台展示
  if (vue.detailObj.areaArr.length > 0) {
    vue.detailObj.isFrontShow = 1 // 展示
  }
  // 指定时间
  if (vue.detailObj.receiveDateType === '2') {
    vue.detailObj.receiveStartTime = vue.detailObj.receiveTime[0]
    vue.detailObj.receiveEndTime = vue.detailObj.receiveTime[1]
  }
  // 达成条件
  switch (vue.detailObj.receiveType) {
    case '1':
      vue.detailObj.receiveValue = null
      break
    case '2':
      vue.detailObj.receiveValue = vue.detailObj.price
      break
    case '3':
      vue.detailObj.receiveValue = vue.detailObj.accAmount
      break
    case '4':
      vue.detailObj.receiveValue = vue.detailObj.accPoint
      break
    default:
      vue.detailObj.receiveValue = null
  }
  // 卡有效期
  if (vue.detailObj.cardEffDateType === '2') {
    // 指定时间
    vue.detailObj.expirationTime =
      parseInt(vue.detailObj.expirationTimeStr) * 24 * 60 * 60 * 1000
  } else {
    vue.detailObj.expirationTime = null
  }
  const res = await interestsCard.addInterestsCard(vue.detailObj)
  if (res.code === '0') {
    vue.$message({
      message: vue.$t('添加成功'),
      type: 'success'
    })
    vue.$portal.delActiveViewAndRefresh()
  }
}

async function update(vue) {
  vue.detailObj.interestsGroupList = vue.chooseGroupList
  const interestsCard = vue.$crm.$api.interestsCard

  // 卡有效期
  if (vue.detailObj.cardEffDateType === '2') {
    // 指定时间
    vue.detailObj.expirationTime =
      parseInt(vue.detailObj.expirationTimeStr) * 24 * 60 * 60 * 1000
  } else {
    vue.detailObj.expirationTime = null
  }

  // 领卡时间
  if (vue.detailObj.receiveDateType === '1') {
    // 永久有效
    vue.detailObj.receiveStartTime = null
    vue.detailObj.receiveEndTime = null
  } else {
    vue.detailObj.receiveStartTime = vue.detailObj.receiveTime[0]
    vue.detailObj.receiveEndTime = vue.detailObj.receiveTime[1]
  }

  // 达成条件
  switch (vue.detailObj.receiveType) {
    case '1':
      vue.detailObj.receiveValue = null
      break
    case '2':
      vue.detailObj.receiveValue = vue.detailObj.price
      break
    case '3':
      vue.detailObj.receiveValue = vue.detailObj.accAmount
      break
    case '4':
      vue.detailObj.receiveValue = vue.detailObj.accPoint
      break
    default:
      vue.detailObj.receiveValue = null
  }

  vue.detailObj.channelCodes = vue.detailObj.channelArr.join(',')

  const res = await interestsCard.updateInterestsCard(vue.detailObj)
  if (res.code === '0') {
    vue.$message({
      message: vue.$t('修改成功'),
      type: 'success'
    })
    vue.$portal.delActiveView()
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
