<template>
  <section>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('基本信息') }}</span>
      </div>
      <el-row>
        <el-col :span="8">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('会员类型')" required>
              <el-select
                :disabled="$route.params.isEdit == 0 || $route.params.isEdit == 1"
                v-model="detailObj.memberType"
                :placeholder="$t('请选择')"
                name="detailObj_memberType"
              >
                <el-option
                  v-for="item in levelOption"
                  :key="item.memberType"
                  :label="item.memberTypeName"
                  :value="item.memberType"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('等级名称')" required>
              <el-input
                v-model="detailObj.levelName"
                :disabled="$route.params.isEdit == 0"
                :placeholder="$t('请输入内容')"
                name="detailObj_levelName"
                show-word-limit
                maxlength="6"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('所需成长值')" required>
              <el-input
                v-model="detailObj.growthValue"
                :disabled="$route.params.isEdit == 0 || $route.params.isEdit == 1"
                :placeholder="$t('请输入内容')"
                name="detailObj_growthValue"
                show-word-limit
                maxlength="10"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('等级图标')">
              <ody-upload-image
                :disabled="$route.params.isEdit == 0"
                v-model="detailObj.iconUrl"
                :pic-type="picType"
                :show-tip="false"
                name="detailObj_iconUrl"
              />
              <br>
              <span>{{ $t('上传提示') }}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('等级有效期')" prop="name">
              <el-radio
                v-model="disabled"
                :disabled="$route.params.isEdit == 0"
                :label="$t('永久有效')"
                name="disabled"
              >{{ $t('永久有效') }}
              </el-radio>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <br>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('选择权益组') }}</span>
      </div>
      <div>
        <ody-button
          :disabled="$route.params.isEdit == 0"
          name="CrmMembershipLevelAddGroup_selectGroup"
          style="margin-bottom:20px;"
          size="small"
          type="primary"
          code="CrmMembershipLevelAddGroup"
          @click="selectGroup"
        >{{ $t('选择权益组') }}
        </ody-button>
        <el-form>
          <ody-table
            :loading="loading"
            :data="chooseGroupList"
            :columns="groupColumns"
            :can-filter="false"
            :operates="groupOperates"
            name="chooseGroupList155"
          />
        </el-form>
      </div>
    </el-card>
    <br>
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
            name="interestsList062"
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
                >{{ $t('配置链接') }}
                </ody-button>
              </el-form-item>
            </template>
          </ody-table>
        </el-form>
      </div>
    </el-card>

    <ody-fixed>
      <ody-button
        v-show="$route.params.isEdit != 0"
        name="CrmMembershipLevelSave_submit"
        size="small"
        type="primary"
        code="CrmMembershipLevelSave"
        @click="submit"
      >{{ $t('common_save') }}
      </ody-button>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_back') }}</el-button>
    </ody-fixed>

    <!--选择权益组-->
    <ody-dialog :visible.sync="dialogGroup" :title="$t('选择权益组')" width="600px">
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
          <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}
          </el-button>
          <el-button name="selectGroup" size="small" type="primary" @click="selectGroup">{{ $t('common_select') }}
          </el-button>
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
            name="groupList228"
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
        <ody-button
          name="CrmMembershipLevelAddGroup_chooseGroup"
          type="primary"
          code="CrmMembershipLevelAddGroup"
          @click="chooseGroup"
        >{{ $t('添加') }}
        </ody-button>
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
          >{{ $t('网址') }}
          </el-radio>
          <el-radio
            :disabled="$route.params.isEdit == 0"
            v-model="zdyDialogParam.type"
            name="zdyDialogParam_type3"
            label="img"
          >{{ $t('图片') }}
          </el-radio>
        </el-form-item>
        <el-form-item
          v-show="zdyDialogParam.type === 'url'"
          :label-width="formLabelWidth"
          :label="$t('链接地址')"
        >
          <el-input :disabled="true" v-model="zdyDialogParam.link" name="zdyDialogParam_link" autocomplete="off"/>
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
  name: 'CrmMembershipLevelDetail',
  components: {
    couponView,
    child: couponView
  },
  data() {
    // const vue = this
    return {
      nowList: [],
      dialogVisibleView: false,
      dialogVisible: false,
      detailObj: {},
      disabled: '永久有效',
      searchForm: getDefaultSearchForm(),
      checked: [],
      levelOption: [],
      interestsList: [],
      zdyDialog: false,
      zdyDialogParam: {
        item: null, // 对象
        type: null, // 类型 url\img
        link: '', // 网页链接
        imgUrl: '' // 图片地址
      },
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
            code: 'CrmMembershipLevelDeleteGroup'
          }
        ]
      },
      columns: [
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
      ],
      interestsTypeMap: {}
    }
  },
  async mounted() {
    try {
      let interestsTypeCode = {}
      await this.$crm.$api.common.codeListMulti({ categorys: ['interestsType'], pool: 'crm' }).then(res => {
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

      await this.$crm.$api.memberType.listMemberType({}).then(res => {
        this.levelOption = res.data
      })
      if (!this.$route.params.id) {
        return
      }
      const vue = this
      const id = this.$route.params.id
      const ucMembershipLevel = vue.$crm.$api.ucMembershipLevel
      await ucMembershipLevel.getUcMembershipLevelInterestsList([
        { id: id }
      ]).then(res => {
        vue.detailObj = res.data[0]
        vue.chooseGroupList = vue.detailObj.interestsGroupList
        for (var i = 0; i < vue.chooseGroupList.length; i++) {
          if (!vue.chooseGroupList[i].interestsList) {
            continue
          }
          for (var j = 0; j < vue.chooseGroupList[i].interestsList.length; j++) {
            vue.chooseGroupList[i].interestsList[j].groupName =
              vue.chooseGroupList[i].name
          }

          vue.interestsList = vue.interestsList.concat(
            vue.chooseGroupList[i].interestsList
          )
        }
        // 初始化优惠券数值
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
      this.$portal.delActiveViewAndRefresh('CrmMembershipLevel')
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
    chooseGroup() {
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
      queryinterestsList(this)
    },
    cancelChooseGroup() {
      this.dialogGroup = false
      this.checked = []
    },
    async handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.selectGroupList()
    },
    async submit() {
      var vue = this
      if (!this.detailObj.memberType) {
        this.$message({
          message: vue.$t('会员类型必填'),
          type: 'warning'
        })
        return
      }
      if (!this.detailObj.levelName) {
        this.$message({
          message: vue.$t('等级名称必填'),
          type: 'warning'
        })
        return
      }
      // 折扣验证1-10之间一位小数
      var reg = /^[1-9]{1}[0-9]*$/
      // var reg = /^[0-9]\d*$/
      var check = reg.test(this.detailObj.growthValue)
      if (!check && this.detailObj.isDefault !== 1) {
        this.$message({
          message: vue.$t('所需成长值要求必填且大于等于1的正整数'),
          type: 'warning'
        })
        return
      }
      // if (this.chooseGroupList.length === 0) {
      //   this.$message({
      //     message: '权益组不能为空！',
      //     type: 'warning'
      //   })
      //   return
      // }
      if (this.detailObj.id) {
        await update(this)
      } else {
        await add(this)
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
  console.log(vue.chooseGroupList)
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
    vue.interestsList = util.removeRepeatInterests(vue.interestsList, vue)
    // vue.interestsList = data
    for (var i = 0; i < vue.interestsList.length; i++) {
      vue.interestsList[i].groupName = nameMap[vue.interestsList[i].groupId]
    }
  }
}

async function add(vue) {
  vue.detailObj.interestsGroupList = vue.chooseGroupList
  const ucMembershipLevel = vue.$crm.$api.ucMembershipLevel
  const res = await ucMembershipLevel.addUcMembershipLevel(vue.detailObj)
  if (res.code === '0') {
    vue.$message({
      message: vue.$t('添加成功'),
      type: 'success'
    })
    // vue.$portal.delActiveView()
    vue.$portal.delActiveViewAndRefresh('CrmMembershipLevel')
  }
}

async function update(vue) {
  vue.detailObj.interestsGroupList = vue.chooseGroupList
  const ucMembershipLevel = vue.$crm.$api.ucMembershipLevel
  const res = await ucMembershipLevel.updateUcMembershipLevel(vue.detailObj)
  if (res.code === '0') {
    vue.$message({
      message: vue.$t('修改成功'),
      type: 'success'
    })
    // vue.$portal.delActiveView()
    vue.$portal.delActiveViewAndRefresh('CrmMembershipLevel')
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
