<template>
  <div>
    <div v-for="(group,index) in remarkGroupList" :key="index">
      <div v-if="group.isDeleted != 1" class="remarks-content">
        <el-form
          ref="ruleForm"
          :disabled="isView"
          :model="group"
          :rules="rules"
          class="el-form-group"
        >
          <el-form-item
            :rules="[{ required: true, message: '请输入分组名称', trigger: 'blur' },{validator: validateCharacter, trigger: 'blur' }]"
            prop="groupName"
            name="groupName"
            class="reamrkName-class"
          >
            <el-col span="4"><ody-tip-star :content="$t('分组名称')"/></el-col>
            <el-input v-model="group.groupName" :placeholder="$t('请输入分组名称')" name="group_groupName" maxlength="10" />
            <i name="deleteRole" class="el-icon-close" @click="deleteRole(index)" />
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请输入选择项', trigger: 'blur' }]"
            prop="selectNum"
            name="selectNum"
            class="ChooseNumberMax-class"
          >
            <el-col span="4"><ody-tip-star :content="$t('选择设置')"/></el-col>
            最多选择
            <ody-input-number
              v-model="group.selectNum"
              :max="group.mpChargings ? group.mpChargings.length : 0"
              :min="1"
              name="group_selectNum"
            />项
          </el-form-item>
          <ody-table
            :data="group.mpChargings"
            :columns="columns"
            :operates="operates"
            :key="key"
            name="group_mpChargings010"
            class="table-class-input"
          >
            <template slot="remarkName" slot-scope="scope">
              <el-form-item
                :prop="'mpChargings.' + scope.$index + '.chargingName'"
                :name="'mpChargings.' + scope.$index + '.chargingName'"
                :rules="[{ required: true, message: '请设置备注名称', trigger: 'blur' },{validator: validateCharacterOfchargingName, trigger: 'blur' }]"
              >
                <el-input v-model="scope.row.chargingName" name="scope_row_chargingName" maxlength="10" />
              </el-form-item>
            </template>
            <template slot="chargingPrice" slot-scope="scope">
              <el-form-item
                v-if="scope.row.chineseName"
                key="chargingPriceChineseName"
                :prop="'mpChargings.' + scope.$index + '.chargingPrice'"
                :name="'mpChargings.' + scope.$index + '.chargingPrice'"
                :rules="scope.row.chineseName?[{ required: true, message: '请设置加料价格', trigger: 'blur' },{ validator: validatorprice, trigger: 'blur'}]:0"
              >
                <el-input
                  v-model="scope.row.chargingPrice"
                  :max="99999999"
                  :min="scope.row.chineseName?0.01:0"
                  name="scope_row_chargingPrice"
                />
              </el-form-item>
              <el-form-item
                v-else
                key="chargingPriceChargingPrice"
                :prop="'mpChargings.' + scope.$index + '.chargingPrice'"
                :name="'mpChargings.' + scope.$index + '.chargingPrice'"
              >
                <el-input
                  v-model="scope.row.chargingPrice"
                  :max="99999999"
                  :min="0"
                  :disabled="true"
                  name="scope_row_chargingPrice1"
                />
              </el-form-item>
            </template>
            <template slot="relatedMaterials" slot-scope="scope">
              <choose-beverage
                v-model="scope.row.chineseName"
                :id="scope.row.id"
                :merchant-id="merchantId"
                :parindex="index"
                :index="scope.$index"
                :selected-beverageid="selectedBeverageId"
                :merchant-product-id="scope.row.merchantProductId"
                :warehouse-type="warehouseType"
                :data-type="dataType"
                :is-view="isView"
                name="scope_row_chineseName"
                value-key="code"
                @getrelatedUnit="getrelatedUnit"
                @clearMun="clearMun"
              />
            </template>
            <template slot="consumption" slot-scope="scope">
              <el-row>
                <el-col :span="9">
                  <el-form-item
                    v-if="scope.row.chineseName"
                    key="chargingPriceconsumption"
                    :prop="'mpChargings.' + scope.$index+'.wastageNum'"
                    :name="'mpChargings.' + scope.$index+'.wastageNum'"
                    :rules="scope.row.chineseName?[{ required: true, message: '消耗量', trigger: 'blur' }]:0"
                  >
                    <ody-input-number v-model="scope.row.wastageNum" :max="99999999" name="scope_row_wastageNum" />
                  </el-form-item>
                  <el-form-item
                    v-else
                    key="chargingPriceconsumption"
                    :prop="'mpChargings.' + scope.$index+'.wastageNum'"
                    :name="'mpChargings.' + scope.$index+'.wastageNum'"
                  >
                    <ody-input-number
                      v-model="scope.row.wastageNum"
                      :max="99999999"
                      :disabled="true"
                      name="scope_row_wastageNum6"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    v-if="scope.row.chineseName"
                    key="chineseNameunitCode"
                    :prop="'mpChargings.' + scope.$index+'.unitCode'"
                    :name="'mpChargings.' + scope.$index+'.unitCode'"
                    :rules="scope.row.chineseName?[{ required: true, message: '计量单位', trigger: 'blur' }]:''"
                  >
                    <el-select v-model="scope.row.unitCode" :placeholder="$t('请选择')" name="scope_row_unitCode" clearable>
                      <el-option
                        v-for="(item,index) in scope.row.calculationList"
                        :key="index"
                        :label="item.measurementUnit"
                        :value="item.measurementUnitCode"
                        @change="changewastageNum((scope.$index,index))"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-else
                    key="chineseNamecalculation"
                    :prop="'mpChargings.' + scope.$index+'.unitCode'"
                    :name="'mpChargings.' + scope.$index+'.unitCode'"
                  >
                    <el-select
                      v-model="scope.row.unitCode"
                      :placeholder="$t('请选择')"
                      name="scope_row_unitCode9"
                      disabled="true"
                      clearable
                    >
                      <el-option
                        v-for="(item,index) in scope.row.calculationList"
                        :key="index"
                        :label="item.measurementUnit"
                        :value="item.measurementUnitCode"
                        @change="changewastageNum((scope.$index,index))"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <template slot="moveOpra" slot-scope="scope">
              <!-- 上移 -->
              <!-- <i name="down" class="el-icon-bottom el-icon opra-color" @click="down(scope.$index,index)" /> -->
              <!-- 下移 -->
              <!-- <i name="up" class="el-icon-top el-icon opra-color" @click="up(scope.$index,index)" /> -->
              <!-- 沉底 -->
              <!-- <i
                name="downBottom"
                class="el-icon-upload2 el-icon opra-color"
                @click="downBottom(scope.$index,index)"
              />-->
              <!-- 置顶 -->
              <!-- <i name="upTop" class="el-icon-download el-icon opra-color" @click="upTop(scope.$index,index)" /> -->

              <el-button-group>
                <!-- 上移 -->
                <el-button
                  name="up3"
                  type="text"
                  size="mini"
                  icon="el-icon-arrow-up"
                  plain
                  @click="up(scope.$index,index)"
                />
                <!-- 下移 -->
                <el-button
                  name="down6"
                  type="text"
                  size="mini"
                  icon="el-icon-arrow-down"
                  plain
                  @click="down(scope.$index,index)"
                />
                <!-- 置顶 -->
                <el-button
                  name="upTop5"
                  type="text"
                  size="mini"
                  icon="el-icon-top"
                  plain
                  @click="upTop(scope.$index,index)"
                />
                <!-- 沉底 -->
                <el-button
                  name="downBottom4"
                  type="text"
                  size="mini"
                  icon="el-icon-bottom"
                  plain
                  @click="downBottom(scope.$index,index)"
                />
              </el-button-group>
            </template>
            <template slot="opraItem" slot-scope="scope">
              <a
                v-if="!isView"
                name="deleteencaMemoItem"
                href="javascript:void(0)"
                style="color:rgba(24, 144, 255, 1)"
                @click="deleteencaMemoItem(scope.$index,index)"
              >{{ $t('删除') }}</a>
            </template>
          </ody-table>
          <el-button
            v-if="!isView"
            name="memoItemAdd"
            type="text"
            icon="el-icon-plus"
            @click="memoItemAdd(index)"
          >{{ $t('添加备注项') }}</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import ChooseBeverage from '@/components/choose-beverage'
export default {
  components: {
    ChooseBeverage
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    id: {
      type: Number,
      default: null
    },
    merchantId: {
      type: Number,
      default: null
    },
    chargingGroupVos: {
      type: Array,
      default: () => []
    },
    dataType: {
      type: Number,
      default: null
    },
    isView: {
      type: Boolean,
      default: false
    },
    warehouseType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      key: 1,
      remarkGroupList: this.chargingGroupVos,
      selectedBeverageId: [],
      unitList: [],
      rules: {
        groupName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ],
        selectNum: [
          { required: true, message: '请设置选择项', trigger: 'blur' }
        ]
      },
      columns: [
        {
          show: true,
          slot: 'remarkName',
          label: '备注名称',
          width: 200
        },
        {
          show: true,
          slot: 'chargingPrice',
          label: '加价金额',
          width: 200
        },
        {
          show: true,
          slot: 'relatedMaterials',
          label: '关联原料',
          width: 230
        },
        {
          show: true,
          slot: 'consumption',
          label: '消耗量',
          width: 300
        },
        {
          show: true,
          slot: 'moveOpra',
          label: '移动',
          width: 200
        },
        {
          show: true,
          slot: 'opraItem',
          label: '操作',
          align: 'center'
        }
      ],
      relatedObject: {},
      delMpChargingList: []
    }
  },
  created() {},
  async mounted() {
    this.getselectedBeverageId(this.remarkGroupList)
    if (this.id) {
      this.initRemarks(this.id)
    }
  },
  methods: {
    // 已选原料id
    async getselectedBeverageId(vo) {
      this.selectedBeverageId = await this.getmerId(vo)
    },
    getmerId(vo) {
      return new Promise((resolve, reject) => {
        const arr = []
        vo.forEach(item => {
          item.mpChargings.forEach(char => {
            if (char.merchantProductId) {
              arr.push(char.merchantProductId)
            }
          })
        })
        resolve(arr)
      })
    },
    validatorprice(rule, value, callback) {
      if (value <= 0) {
        callback('加价金额必须大于0')
      } else {
        callback()
      }
    },
    // 验证组名是否重复
    validateCharacter(rule, value, callback) {
      let validate = 0
      this.remarkGroupList.forEach(paritem => {
        if (value === paritem.groupName) {
          validate++
        }
      })
      if (validate <= 1) {
        callback()
      } else {
        callback('存在相同名称的分组')
      }
    },
    // 验证备注名是否重复
    validateCharacterOfchargingName(rule, value, callback) {
      let validate = 0
      this.remarkGroupList.forEach(paritem => {
        paritem.mpChargings.forEach(item => {
          if (value === item.chargingName) {
            validate++
          }
        })
      })
      if (validate <= 1) {
        callback()
      } else {
        callback('存在相同的备注名')
      }
    },
    // 封装分组数据
    encaGroupData() {
      if (this.remarkGroupList && this.remarkGroupList.length >= 10) {
        this.$message.error('分组不能超过10个')
        return this.remarkGroupList
      }
      const tableData = []
      const obj = {
        chargingName: '',
        chargingNameErrMsg: null,
        chargingPrice: 0,
        dataType: 2,
        orderNum: 1,
        consumption: 0,
        unitValue: '',
        wastageNum: ''
      }
      tableData.push(obj)
      const groupItem = {
        groupName: '',
        selectNum: '',
        merchantId: this.merchantId,
        channelCode: -1,
        storeId: -1,
        merchantProductId: this.id,
        dataType: 2,
        mpChargings: tableData,
        saveMpChargingList: tableData,
        updateMpchargingList: [],
        delMpChargingList: []
      }
      this.remarkGroupList.push(groupItem)
      return this.remarkGroupList
    },
    // 初始化备注信息
    initRemarks(id) {
      const url =
        'back-product-web/back/mp/mpCharging/listMpChargingGroupById.do'
      const params = {
        id: id
      }
      this.loading = true
      this.$portal.post(url, params).then(result => {
        this.loading = false
        if (result && result.code === '0') {
          this.remarkGroupList = result.data
        } else {
          this.$emit('error')
        }
      })
    },
    // 同步修改信息
    updatemargn() {
      if (this.remarkGroupList && this.remarkGroupList.length > 0) {
        this.remarkGroupList.forEach(paritem => {
          paritem.updateMpchargingList = paritem.mpChargings
        })
        this.remarkGroupList.concat(this.delCurrentMpChargingGroup)
      }
    },
    // 获取当前原料的计量单位
    getrelatedUnit(obj, parentIndex, index) {
      this.getunitList(obj.id, parentIndex, index)
    },
    // 保存
    saveMpChargingList() {
      if (this.remarkGroupList.length <= 0) {
        return
      }
      this.remarkGroupList.forEach(paritem => {
        paritem.updateMpchargingList = paritem.mpChargings
      })
      var params = this.remarkGroupList
      this.mpChargingGroupOpration(params)
    },
    ruleFormValidate() {
      let val = true
      if (this.remarkGroupList.length > 0) {
        for (const item of this.$refs.ruleForm) {
          item.validate(valid => {
            if (valid === false) {
              val = false
            }
          })
        }
        if (val) {
          this.updatemargn()
        }
      }
      return val
    },
    // 删除当前分组
    deleteRole(index) {
      this.$confirm('是否继续删除该分组?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消')
      })
        .then(() => {
          this.remarkGroupList[index].isDeleted = 1
          const data = this.remarkGroupList[index]
          if (this.remarkGroupList[index].id) {
            this.delCurrentMpChargingGroup.push(data)
          }
          const arr = []
          data.mpChargings.forEach(char => {
            if (char.merchantProductId) {
              arr.push(char.merchantProductId)
            }
          })
          for (let i = 0, length = arr.length; i < length; i++) {
            for (let j = 0, l = this.selectedBeverageId.length; j < l; j++) {
              if (this.selectedBeverageId[j] === arr[i]) {
                this.selectedBeverageId.splice(j, 1)
              }
            }
          }
          this.remarkGroupList[index].mpChargings.length = 0
          this.remarkGroupList.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch((e) => {
          console.info(e)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除当前备注项组
    deleteencaMemoItem(sonIndex, parentIndex) {
      const MpCharging = this.remarkGroupList[parentIndex].mpChargings[sonIndex]
      this.remarkGroupList[parentIndex].isDeleted = 0
      const delMpChargingList =
        this.remarkGroupList[parentIndex].delMpChargingList || []
      delMpChargingList.push(MpCharging)
      this.remarkGroupList[parentIndex].delMpChargingList = delMpChargingList
      this.remarkGroupList[parentIndex].mpChargings.splice(sonIndex, 1)
    },
    // 保存-1、修改-2、删除-3分组信息
    mpChargingGroupOpration(params) {
      this.loading = true
      const url = '/back-product-web/back/mp/mpCharging/saveMpChargingGroup.do'
      this.$portal.post(url, params).then(result => {
        this.loading = false
        if (result && result.code === '0') {
          this.initRemarks(this.id)
        } else {
          this.$emit('error')
        }
      })
    },
    // 添加备注项
    memoItemAdd(index) {
      this.remarkGroupList = this.encaMemoItemData(index)
    },
    // 封装备注项数据
    encaMemoItemData(i) {
      const group = this.remarkGroupList[i]
      if (group.mpChargings && group.mpChargings.length >= 10) {
        this.$message.error('同一分组内的备注不能超过10个')
        return this.remarkGroupList
      }
      const obj = {
        remarkName: '',
        chargingPrice: 0,
        relatedMaterials: 0,
        consumption: 0,
        unitValue: '',
        orderNum: group.mpChargings.length + 1
      }
      group.mpChargings.push(obj)
      group.saveMpChargingList = group.saveMpChargingList || [obj]
      return this.remarkGroupList
    },
    // 查询当前商品的主计量单位和所有辅助计量单位
    getunitList(id, parentIndex, index) {
      const url =
        '/back-product-web/back/mp/merchantProduct/listMpCalculationUnitByMpId.do'
      const params = {
        id: id
      }
      this.loading = true
      this.$portal.post(url, params).then(result => {
        this.loading = false
        if (result && result.code === '0') {
          this.$set(
            this.remarkGroupList[parentIndex].mpChargings[index],
            'merchantProductId',
            id
          )
          this.$set(
            this.remarkGroupList[parentIndex].mpChargings[index],
            'calculationList',
            result.data
          )
          this.$set(
            this.remarkGroupList[parentIndex].mpChargings[index],
            'unitCode',
            result.data[0].measurementUnitCode
          )
          this.$set(
            this.remarkGroupList[parentIndex].mpChargings[index],
            'wastageNum',
            ''
          )
          this.getselectedBeverageId(this.remarkGroupList)
        } else {
          this.$message({
            message: '该原料暂未关联计量单位',
            type: 'error'
          })
        }
      })
    },
    // 清空消耗量
    clearMun(parentIndex, index) {
      this.$set(
        this.remarkGroupList[parentIndex].mpChargings[index],
        'merchantProductId',
        ''
      )
      this.$set(
        this.remarkGroupList[parentIndex].mpChargings[index],
        'chineseName',
        ''
      )
      this.$set(
        this.remarkGroupList[parentIndex].mpChargings[index],
        'calculationList',
        []
      )
      this.$set(
        this.remarkGroupList[parentIndex].mpChargings[index],
        'unitCode',
        ''
      )
      this.$set(
        this.remarkGroupList[parentIndex].mpChargings[index],
        'wastageNum',
        ''
      )
    },
    changewastageNum(sonIndex, parentIndex) {
      this.remarkGroupList[parentIndex].mpChargings[sonIndex].wastageNum = ''
    },
    // 下移
    down(sonIndex, parentIndex) {
      var arrs = this.remarkGroupList[parentIndex].mpChargings
      var length = arrs.length - 1
      if (length * 1 === sonIndex * 1) return false
      ;[arrs[sonIndex].orderNum, arrs[sonIndex + 1].orderNum] = [
        arrs[sonIndex + 1].orderNum,
        arrs[sonIndex].orderNum
      ]
      ;[arrs[sonIndex], arrs[sonIndex + 1]] = [
        arrs[sonIndex + 1],
        arrs[sonIndex]
      ]
      this.$set(this.remarkGroupList[parentIndex].mpChargings, arrs)
      this.key += 1
    },

    // 上移
    up(sonIndex, parentIndex) {
      var arrs = this.remarkGroupList[parentIndex].mpChargings
      if (sonIndex * 1 === 0) return false
      ;[arrs[sonIndex].orderNum, arrs[sonIndex - 1].orderNum] = [
        arrs[sonIndex - 1].orderNum,
        arrs[sonIndex].orderNum
      ]
      ;[arrs[sonIndex], arrs[sonIndex - 1]] = [
        arrs[sonIndex - 1],
        arrs[sonIndex]
      ]
      this.$set(this.remarkGroupList[parentIndex].mpChargings, arrs)
      this.key += 1
    },
    // 沉底
    downBottom(sonIndex, parentIndex) {
      var arrs = this.remarkGroupList[parentIndex].mpChargings
      var length = arrs.length - 1
      if (length * 1 === sonIndex * 1) return false
      ;[arrs[sonIndex].orderNum, arrs[length].orderNum] = [
        arrs[length].orderNum,
        arrs[sonIndex].orderNum
      ]
      ;[arrs[sonIndex], arrs[length]] = [arrs[length], arrs[sonIndex]]
      this.$set(this.remarkGroupList[parentIndex].mpChargings, arrs)
      this.key += 1
    },

    // 置顶
    upTop(sonIndex, parentIndex) {
      var arrs = this.remarkGroupList[parentIndex].mpChargings
      if (sonIndex * 1 === 0) return false
      ;[arrs[sonIndex].orderNum, arrs[0].orderNum] = [
        arrs[0].orderNum,
        arrs[sonIndex].orderNum
      ]
      ;[arrs[sonIndex], arrs[0]] = [arrs[0], arrs[sonIndex]]
      this.$set(this.remarkGroupList[parentIndex].mpChargings, arrs)
      this.key += 1
    }
  }
}
</script>
<style lang="less" scoped>
.opra-color {
  font-size: 20px;
  font-weight: 900;
  color: #ced4da;
}
.remarks-content {
  border: 1px solid rgba(206, 212, 218, 1);
  margin-bottom: 5px;
}
/deep/.reamrkName-class {
  display: flex;
  .el-input__inner {
    width: 200px !important;
  }
}
/deep/.ChooseNumberMax-class {
  display: flex;
  .el-input__inner {
    width: 80px !important;
  }
}
/deep/.table-class-input {
  .el-input__inner {
    width: 100px !important;
  }
}
/deep/.el-form-item__content {
  width: 100%;
  display: flex;
}
.el-icon {
  padding-right: 20px;
}
.el-form-group {
  padding: 20px;
}
.el-icon-close {
  text-align: right;
}
</style>
