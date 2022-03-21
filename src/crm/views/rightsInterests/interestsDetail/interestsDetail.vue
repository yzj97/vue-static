<template>
  <section>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('权益组信息') }}</span>
      </div>
      <el-row>
        <el-col :span="8">
          <el-form ref="info" :model="info" label-width="130px">
            <el-form-item :label="$t('权益组名称')" required>
              <el-input
                v-model="interestsObj.name"
                :disabled="$route.params.isEdit == 0"
                :placeholder="$t('请输入内容')"
                name="interestsObj_name"
                show-word-limit
                maxlength="10"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <br>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('权益设置') }}</span>
      </div>
      <div>
        <el-form>
          <ody-table
            :loading="loading"
            :data="list"
            :columns="columns"
            :can-filter="false"
            name="list478"
          >
            <template slot="input" slot-scope="scope">

              <el-form-item prop="wu">
                <el-input
                  :disabled="$route.params.isEdit == 0"
                  v-model="scope.row.name"
                  name="scope_row_name"
                  maxlength="6"
                  show-word-limit/>
              </el-form-item>

            </template>
            <template slot="upload" slot-scope="scope">
              <el-form-item prop="wu">
                <ody-upload-image
                  :disabled="$route.params.isEdit == 0"
                  v-model="scope.row.picUrl"
                  :show-tip="false"
                  name="scope_row_picUrl"/>
              </el-form-item>
            </template>
            <template slot="switch" slot-scope="scope">
              <el-switch
                :disabled="$route.params.isEdit == 0"
                v-model="scope.row.statusFlag"
                :inactive-text="$t('common_close')"
                :active-text="$t('start-up')"
                :active-value="true"
                :inactive-value="false"
                name="scope_row_statusFlag"
                @change="updateSwitch"
              />
            </template>
            <template slot="pen" slot-scope="scope">
              <span name="openDesc" style="color:#0066ff" @click="openDesc(scope.row.information,scope.row)">{{ scope.row.information }}</span>
              <el-link
                :disabled="$route.params.isEdit == 0"
                name="openDesc7"
                icon="el-icon-edit"
                @click="openDesc(scope.row.information,scope.row)"/>
                <!--<el-button :disabled="$route.params.isEdit == 0" name="openDesc5" size="mini" icon="el-icon-edit" @click="openDesc(scope.row.information,scope.row)"/>-->
            </template>
            <template slot="interests" slot-scope="scope">
              <el-form-item prop="wu">
                <el-input
                  v-show="interestsTypeMap[parseInt(scope.row.type)].type === 'free'"
                  :disabled="$route.params.isEdit == 0"
                  v-model="scope.row.param"
                  :placeholder="$t('折扣')"
                  name="scope_row_param">
                  <template slot="append">{{ $t('fracture') }}</template>
                </el-input><!--折-->
                <el-input
                  v-show="interestsTypeMap[parseInt(scope.row.type)].type === 'pre'"
                  :disabled="$route.params.isEdit == 0"
                  v-model="scope.row.param"
                  :placeholder="$t('倍数')"
                  name="scope_row_param0">
                  <template slot="append">{{ $t('倍') }}</template>
                </el-input><!--倍-->
                <el-input
                  v-show="interestsTypeMap[parseInt(scope.row.type)].type === 'fixed'"
                  :disabled="$route.params.isEdit == 0"
                  v-model="scope.row.param"
                  :placeholder="$t('赠送数')"
                  name="scope_row_param0"/>
                <ody-promotion-coupon-choose
                  v-show="interestsTypeMap[parseInt(scope.row.type)].type === 'coupon'"
                  :search-field="selectedField"
                  :coupon-give-rule="18"
                  :disabled="$route.params.isEdit == 0"
                  :view="true"
                  v-model="couponObj.ids"
                  :selected.sync="couponObj.selected"
                  :multiple="true"
                  placeholder="$t('请选择')"
                  name="couponObj_ids"/>
                <el-button
                  v-show="interestsTypeMap[parseInt(scope.row.type)].type === 'customer'"
                  name="openDialogzdy"
                  size="small"
                  type="primary"
                  @click="openDialogzdy(scope.row)">{{ $t('配置链接') }}
                </el-button>
                <el-button
                  v-show="interestsTypeMap[parseInt(scope.row.type)].type === 'customer' && $route.params.isEdit != 0 && scope.$index != 3"
                  :disabled="scope.row.statusFlag"
                  name="delDialogzdy"
                  size="small"
                  type="danger"
                  @click="delDialogzdy(scope.row, scope.$index)">{{ $t('删除') }}
                </el-button>
              </el-form-item>
            </template>
          </ody-table>
          <el-row type="flex" class="row-bg" justify="end">
            <el-col :span="6" style="text-align:right;margin-top:20px;">
              <el-button v-show="$route.params.isEdit != 0" name="addzdy" size="small" type="primary" @click="addzdy">{{
              $t('添加自定义权益') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>

    <ody-fixed>
      <el-button
        v-show="$route.params.isEdit != 0"
        :loading="subloading"
        name="submit"
        size="small"
        type="primary"
        @click="submit">{{ $t('common_save') }}
      </el-button>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_back') }}</el-button>
    </ody-fixed>

    <ody-dialog :visible.sync="dialogFormVisible" :title="$t('简介')" width="30%">
      <el-form>
        <span v-show="$route.params.isEdit == 0">{{ descText }}</span>
        <el-input
          v-show="$route.params.isEdit != 0"
          v-model="descText"
          :disabled="$route.params.isEdit == 0"
          name="descText"
          type="textarea"
          show-word-limit
          maxlength="100"/>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="dialogFormVisible" @click="dialogFormVisible = false">{{ $t('common_cancel') }}</el-button>
        <el-button
          v-show="$route.params.isEdit != 0"
          :disabled="$route.params.isEdit == 0"
          name="descConfirm"
          type="primary"
          @click="descConfirm">{{ $t('confirm') }}
        </el-button>
      </div>
    </ody-dialog>
    <couponView
      ref="mychild"
      :is-add="$route.params.isAdd"
      :is-edit="$route.params.isEdit"
      :ilist="list"
      :dialog-visible="dialogVisible"
      :dialog-visible-view="dialogVisibleView"
      @closeViewDialog="closeViewDialogWindow"
      @closeDialog="closeDialogWindow"
      @updateData="updateCoupon"/>

    <!-- 自定义权益弹框 -->
    <el-dialog :visible.sync="zdyDialog" :title="$t('添加自定义链接')">
      <el-form :model="form">
        <el-form-item v-show="false" :label-width="formLabelWidth" :label="$t('链接类型')">
          <el-radio
            :disabled="$route.params.isEdit == 0"
            v-model="zdyDialogParam.type"
            name="zdyDialogParam_type"
            label="url">{{ $t('网址') }}
          </el-radio>
          <el-radio
            :disabled="$route.params.isEdit == 0"
            v-model="zdyDialogParam.type"
            name="zdyDialogParam_type9"
            label="img">{{ $t('图片') }}
          </el-radio>
        </el-form-item>
        <el-form-item v-show="zdyDialogParam.type === 'url'" :label-width="formLabelWidth" :label="$t('链接地址')">
          <el-input
            :disabled="$route.params.isEdit == 0"
            v-model="zdyDialogParam.link"
            name="zdyDialogParam_link"
            autocomplete="off"/>
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
        <el-button v-show="$route.params.isEdit != 0" name="saveDialogzdy" type="primary" @click="saveDialogzdy">{{
        $t('common_save') }}
        </el-button>
      </div>
    </el-dialog>

  </section>

</template>

<script>
import couponView from '@/components/coupon-view'

export default {
  name: 'CrmRightsInterestsDetail',
  components: {
    couponView,
    child: couponView
  },
  data() {
    // const vue = this
    return {
      subloading: false,
      selectedField: ['themeTitle'], // 'receiveChannelCode'
      zdyDialog: false,
      zdyDialogParam: {
        item: null, // 对象
        type: null, // 类型 url\img
        link: '', // 网页链接
        imgUrl: '' // 图片地址
      },
      couponObj: {
        ids: [],
        selected: []
      },
      dialogVisible: false,
      dialogVisibleView: false,
      searchForm: Object.assign(
        {
          page: 1,
          limit: 10,
          filters: {}
        }
      ),
      interestsObj: {
        id: null,
        name: null,
        interestsList: []
      },
      dialogFormVisible: false,
      descText: '',
      descObj: null,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'typeStr',
          label: this.$t('权益类型'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          label: this.$t('权益名称'),
          slot: 'input',
          align: 'center',
          minWidth: 70
        },
        {
          show: true,
          label: this.$t('权益图标'),
          slot: 'upload',
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          label: this.$t('简介'), // 简介
          slot: 'pen',
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          label: this.$t('启用'), // 启用
          slot: 'switch',
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          label: this.$t('权益参数'), // 权益参数
          align: 'center',
          slot: 'interests',
          minWidth: 120
        }
      ],
      interestsTypeMap: {}
    }
  },
  async mounted() {
    try {
      this.loading = true
      let interestsTypeCode = {}
      await this.$crm.$api.common.codeSelect({ category: 'interestsType', pool: 'crm' }).then(res => {
        interestsTypeCode = res.data
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
      this.list = []
      for (const one of Object.keys(this.interestsTypeMap)) {
        this.list.push({
          id: null,
          groupId: null,
          typeStr: this.interestsTypeMap[one].label,
          sort: this.interestsTypeMap[one].sort,
          type: one,
          name: '',
          picUrl: '',
          information: '',
          status: 0,
          statusFlag: false,
          param: null
        })
      }

      this.list.sort((i1, i2) => {
        return i1.sort - i2.sort
      })

      if (this.$route.params.id == null && !this.$route.params.isAdd) {
        this.$message({
          message: this.$t('页面已失效请重新打开'),
          type: 'warning'
        })
        this.$portal.delActiveView()
        return
      } else if (this.$route.params.isAdd) {
        return
      }
      const id = this.$route.params.id
      if (id) {
        await this.$crm.$api.rightsInterests.interestsGroupDetail({ id: id }).then(res => {
          this.interestsObj.name = res.data.name
          this.interestsObj.id = res.data.id
          this.list = res.data.interestsList
          for (var j = 0; j < this.list.length; j++) {
            this.list[j].typeStr = this.interestsTypeMap[parseInt(this.list[j].type)].label
            if (this.list[j].status === 1) {
              this.list[j].statusFlag = true
            } else {
              this.list[j].statusFlag = false
            }
            if (this.list[j].type === 3 && this.list[j].param && this.list[j].param !== '') { // 优惠券
              // 转换json数据
              var cobj = JSON.parse(this.list[j].param)
              this.couponObj.ids = []
              for (var ci = 0; ci < cobj.length; ci++) {
                this.couponObj.ids.push(cobj[ci].id)
              }

              this.couponObj.selected = cobj
            }
          }
          this.$refs.mychild.matchCoupon()
        })
      }
    } catch (ex) {
      console.log(ex)
    } finally {
      this.loading = false
      await this.$forceUpdate()
    }
  },
  methods: {
    returnBack() {
      this.$portal.delActiveView()
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
      } else { // 默认值
        this.zdyDialogParam.type = 'url' // 默认网址链接
        this.zdyDialogParam.imgUrl = null
        this.zdyDialogParam.link = null
      }
      this.zdyDialogParam.item = row
      this.zdyDialog = true
    },
    cancelDialogzdy() { // 关闭并回复默认值
      this.zdyDialog = false
      this.zdyDialogParam.type = 'url' // 默认网址链接
      this.zdyDialogParam.imgUrl = null
      this.zdyDialogParam.link = null
      this.zdyDialogParam.item = null
    },
    delDialogzdy(row, index) {
      this.$confirm(this.$t('确认删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: this.$t('删除成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('已取消')
        })
      })
    },
    saveDialogzdy() {
      var value
      if (this.zdyDialogParam.type === 'url') {
        // 校验连接地址 [a-zA-z]+://[^\s]*
        var rereg = /^(http|https):\/\/([\w.]+\/?)\S*/
        var recheck = rereg.test(this.zdyDialogParam.link)
        if (!recheck && this.zdyDialogParam.link && this.zdyDialogParam.link !== '') {
          this.$message({
            message: this.$t('请正确填写链接地址'),
            type: 'warning'
          })
          return
        }
        value = this.zdyDialogParam.link
      } else if (this.zdyDialogParam.type === 'img') {
        if (this.zdyDialogParam.imgUrl === null || this.zdyDialogParam.imgUrl === '') {
          this.$message({
            message: this.$t('请上传图片'),
            type: 'warning'
          })
          return
        }
        value = this.zdyDialogParam.imgUrl
      }
      var saveParam = {
        type: this.zdyDialogParam.type,
        value: value
      }
      this.zdyDialogParam.item.param = JSON.stringify(saveParam)
      this.zdyDialog = false
    },
    updateSwitch(e) {
      // 此方法变相解决el-switch无法切换值的bug
      var backName = this.list[0].name
      this.list[0].name = ''
      this.list[0].name = '2020人类迷惑操作'
      this.list[0].name = backName
    },
    addzdy() {
      var param = {
        id: null,
        groupId: null,
        typeStr: this.$t('自定义权益'),
        type: 4,
        name: '',
        picUrl: '',
        information: '',
        status: 0,
        statusFlag: false,
        param: null
      }
      this.list.push(param)
    },
    async chooseCoupon() {
      this.dialogVisible = true
      this.$refs.mychild.listCoupon()
    },
    viewCoupon() {
      var enStrs = []
      for (var i = 0; i < this.couponObj.selected.length; i++) {
        enStrs.push({ id: this.couponObj.selected[i].couponThemeIdStr })
      }
      this.list[2].param = JSON.stringify(enStrs)

      this.$refs.mychild.showSelect2(enStrs)
      this.dialogVisibleView = true
    },
    closeDialogWindow(data) {
      this.dialogVisible = false
    },
    closeViewDialogWindow(data) {
      this.dialogVisibleView = false
    },
    async submit() {
      this.subloading = true
      if (!this.interestsObj.name) {
        this.$message({
          message: this.$t('名称必填'),
          type: 'warning'
        })
        this.subloading = false
        return
      }

      for (let j = 0; j < this.list.length; j++) {
        const i = this.list[j]
        if (i.statusFlag) {
          const element = this.interestsTypeMap[parseInt(i.type)]
          const param = i.param
          if (element.type === 'fixed') {
            if (!/^([1-9][0-9]{0,9})$/.test(param)) {
              this.$message({
                message: element.label + this.$t('只允许大于0的正整数'),
                type: 'warning'
              })
              this.subloading = false
              return
            }
          } else if (element.type === 'pre') {
            if (!/^(1[0-9]{1,9}|[2-9])$/.test(param)) {
              this.$message({
                message: element.label + this.$t('只允许大于1的正整数'),
                type: 'warning'
              })
              this.subloading = false
              return
            }
          } else if (element.type === 'free') {
            if (!/^(0\.[1-9]|[1-9](\.[1-9])?)$/.test(param)) {
              this.$message({
                message: element.label + this.$t('只允许1-10之间一位小数'),
                type: 'warning'
              })
              this.subloading = false
              return
            }
          } else if (element.type === 'coupon') {
            if (this.couponObj.selected === null || this.couponObj.selected.length === 0) {
              this.$message({
                message: this.$t('请选择优惠券'),
                type: 'warning'
              })
              this.subloading = false
              return
            }
            i.param = JSON.stringify(this.couponObj.selected)
          }
        }
      }

      // 验证启用的名称
      var upSize = 0
      for (var t = 0; t < this.list.length; t++) {
        if (!this.list[t].statusFlag) {
          continue
        }
        upSize++
        if (!this.list[t].name || this.list[t].name === '') {
          this.$message({
            message: this.$t('已启用的权益名称必填'),
            type: 'warning'
          })
          this.subloading = false
          return
        }
        if (this.list[t].statusFlag) {
          if (!this.list[t].picUrl) {
            this.$message({
              message: this.$t('权益图标必填'),
              type: 'warning'
            })
            this.subloading = false
            return
          }
        }
        if (this.list[t].statusFlag) {
          if (!this.list[t].information) {
            this.$message({
              message: this.$t('简介是必填项'),
              type: 'warning'
            })
            this.subloading = false
            return
          }
        }
      }

      if (upSize === 0) {
        this.$message({
          message: this.$t('至少启用一条权益'),
          type: 'warning'
        })
        this.subloading = false
        return
      }

      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].statusFlag) {
          this.list[i].status = 1
        } else {
          this.list[i].status = 0
        }
      }
      this.interestsObj.interestsList = this.list
      if (this.interestsObj.id) {
        const rightsInterests = this.$crm.$api.rightsInterests
        const res = await rightsInterests.updateInterestsGroup(this.interestsObj)
        if (res.code === '0') {
          this.$message({
            message: this.$t('修改成功'),
            type: 'success'
          })
          this.$portal.delActiveView()
        }
      } else {
        const rightsInterests = this.$crm.$api.rightsInterests
        const res = await rightsInterests.addInterestsGroup(this.interestsObj)
        if (res.code === '0') {
          this.$message({
            message: this.$t('添加成功'),
            type: 'success'
          })
          this.$portal.delActiveView()
        }
      }
      this.subloading = false
    },
    openDesc(str, obj) {
      this.descText = str
      this.descObj = obj
      this.dialogFormVisible = true
    },
    descConfirm() {
      this.descObj.information = this.descText
      this.dialogFormVisible = false
    },
    updateCoupon(choosedList) {
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].type === 3) { // 优惠券
          this.list[i].param = JSON.stringify(choosedList)
          break
        }
      }
    }
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

  th:nth-child(2) div:before {
    content: '*';
    color: #ff1818;
  }

  th:nth-child(3) div:before {
    content: '*';
    color: #ff1818;
  }

  th:nth-child(4) div:before {
    content: '*';
    color: #ff1818;
  }

  th:nth-child(6) div:before {
    content: '*';
    color: #ff1818;
  }
</style>
