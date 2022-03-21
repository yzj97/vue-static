<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ $t('组合明细') }}</span>
    </div>
    <div>
      <el-form :inline="true" v-model="mp" name="mp">
        <el-col span="24">
          <el-form-item prop="combineType">
            <ody-tip-star slot="label" :content="$t('类型')"/>
            <el-radio v-model="mp.combineType" :label="0" :disabled="mp.id" name="mp_combineType">{{ $t('固定组合') }}</el-radio><span style="color: blue">{{ $t('示例') }}</span>&nbsp;&nbsp;&nbsp;
            <el-radio v-model="mp.combineType" :label="1" :disabled="mp.id" name="mp_combineType6">{{ $t('可选组合') }}</el-radio><span style="color: blue">{{ $t('示例') }}</span>
          </el-form-item>
        </el-col>
        <el-col span="12">
          <el-form-item prop="salePriceWithTax">
            <ody-tip-star slot="label" :content="$t('组合商品总价')"/>
            <el-input v-model.trim="mp.salePriceWithTax"/>
          </el-form-item>
        </el-col>
        <el-col span="12">
          <el-form-item prop="marketPrice">
            <ody-tip-star slot="label" :content="$t('市场价')"/>
            <el-input v-model.trim="mp.marketPrice"/>
          </el-form-item>
        </el-col>
      </el-form>
      <el-card v-for="(group, index) in mp.groupList" :key="group" style="margin-top: 10px">
        <el-form>
          <el-form-item>
            <el-col span="4"><ody-tip-star :content="$t('分组名称')"/></el-col>
            <el-col span="8"><el-input v-model.trim="group.groupName"/></el-col>
            <el-col span="12" align="right"><i name="deleteGroup" class="el-icon-close" style="color: gray; font-size: 18px" @click="deleteGroup(index)"/></el-col>
          </el-form-item>
          <el-form-item v-if="mp.combineType === 1">
            <el-col span="4">
              <ody-tip-star :content="$t('选择设置')"/>
            </el-col>
            <el-col span="4">
              <el-checkbox v-model="group.isRepeatSameView" :label="$t('允许重复选购同一商品')" name="group_isRepeatSameView" @change="changeRepeatSame(group)"/>
            </el-col>
            <el-col span="1">
              <ody-tip-star :content="$t('必选')"/>
            </el-col>
            <el-col span="2">
              <el-input v-model.number.trim="group.selectNum"/>
            </el-col>
            <el-col span="1">
              {{ $t('件') }}
            </el-col>
          </el-form-item>
        </el-form>
        <el-table
          :data="group.combineList"
          name="group_combineList386"
          max-height="550"
          border
          style="width: 100%; margin-top: 10px">
          <el-table-column
            :label="$t('商品名称')"
            prop="chineseName"/>
          <el-table-column prop="subNum" align="center">
            <template slot="header" slot-scope="{}">
              <ody-tip-star v-if="mp.combineType === 0" :content="$t('数量')"/>
              <span v-else>{{ $t('数量') }}</span>
            </template>
            <template slot-scope="scope">
              <el-input v-if="mp.combineType === 0" v-model.number.trim="scope.row.subNum"/>
              <span v-else>{{ scope.row.subNum }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('零售单价')"
            align="center"
            prop="salePriceWithTax"/>
          <el-table-column v-if="mp.combineType === 1" :label="$t('零售总价')" align="center">
            <template slot-scope="scope">
              {{ scope.row.salePriceWithTax * scope.row.subNum | currency }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('移动')" align="center">
            <template slot-scope="scope">
              <!-- 向上 -->
              <i name="upSort" class="el-icon-arrow-up" style="font-size:14px" @click="upSort(scope.row, scope.$index, group)"/>
              <!-- 向下 -->
              <i name="downSort" class="el-icon-arrow-down" style="font-size:14px" @click="downSort(scope.row, scope.$index, group)"/>
              <!-- 置顶 -->
              <i name="topSort" class="el-icon-caret-top" style="font-size:14px" @click="topSort(scope.row, scope.$index, group)"/>
              <!-- 置底 -->
              <i name="bottomSort" class="el-icon-caret-bottom" style="font-size:14px" @click="bottomSort(scope.row, scope.$index, group)"/>
            </template>
          </el-table-column>
          <el-table-column v-if="mp.combineType === 1" :label="$t('加价')" align="center">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.subAddPrice"/>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" align="center">
            <template slot-scope="scope">
              <el-button name="deleteRow" size="small" @click="deleteRow(group, scope.row, scope.$index)">{{ $t('删除') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row v-if="!group.combineList || group.combineList.length < 10" style="margin-top: 10px">
          <span name="openMpModal" style="color: blue" @click="openMpModal(group, index)">+{{ $t('添加SKU') }}</span>
        </el-row>
      </el-card>
      <el-row v-if="mp.groupList.length < 10" style="margin-top: 10px">
        <el-button name="addGroup" type="primary" @click="addGroup">{{ $t('添加分组') }}</el-button>
      </el-row>
    </div>
    <addSubMpModal v-if="visible" :param="querySubMpModalParam" :visible.sync="visible" @ok="closeMpModal"/>
  </el-card>
</template>

<script>
import addSubMpModal from '../combineMpAddSubMpModal'
export default {
  components: {
    addSubMpModal
  },
  props: {
    mp: {
      type: Object,
      default: () => {
        return { combineType: 0, salePriceWithTax: null, marketPrice: null, groupList: [], delGroupIds: [], delCombineIds: [] }
      }
    }
  },
  data() {
    return {
      visible: false,
      querySubMpModalParam: {}
    }
  },
  watch: {
    'mp.combineType': function(newVal, oldVal) {
      if (newVal === 0) {
        if (!this.mp.groupList || this.mp.groupList.length === 0) {
          return
        }
        for (const group of this.mp.groupList) {
          group.isRepeatSame = null
          group.isRepeatSameView = false
          group.selectNum = null
          if (!group.combineList || group.combineList.length === 0) {
            continue
          }
          for (const combine of group.combineList) {
            combine.subNum = 1
            combine.subAddPrice = null
          }
        }
      } else {
        if (!this.mp.groupList || this.mp.groupList.length === 0) {
          return
        }
        for (const group of this.mp.groupList) {
          group.isRepeatSame = null
          group.isRepeatSameView = false
          group.selectNum = null
          if (!group.combineList || group.combineList.length === 0) {
            continue
          }
          for (const combine of group.combineList) {
            combine.subNum = 1
            combine.subAddPrice = 0
          }
        }
      }
    }
  },
  mounted() {
    if (!this.mp.groupList || this.mp.groupList.length === 0) {
      this.mp.groupList.push({ merchantId: this.mp.merchantId, combineList: [] })
    }
    for (const group of this.mp.groupList) {
      group.isRepeatSameView = group.isRepeatSame === 1
      this.sortByOrderNum(group.combineList)
    }
    this.mp.delGroupIds = []
    this.mp.delCombineIds = []
    this.$forceUpdate()
  },
  methods: {
    // 可选组合是否允许重复选择改变
    changeRepeatSame(group) {
      group.isRepeatSame = group.isRepeatSameView ? 1 : 0
      this.$forceUpdate()
    },
    // 按照orderNum排序行
    sortByOrderNum(combineList) {
      if (combineList && combineList.length > 1) {
        combineList.sort((a, b) => {
          return a.orderNum - b.orderNum
        })
      }
      this.$forceUpdate()
    },
    // 添加分组
    addGroup() {
      if (!this.mp.groupList || this.mp.groupList.length === 0) {
        this.mp.groupList = []
      }
      if (this.mp.groupList.length >= 10) {
        return
      }
      this.mp.groupList.push({ merchantId: this.mp.merchantId, merchantProductId: this.mp.id, combineList: [] })
    },
    // 删除分组
    deleteGroup(index) {
      const group = this.mp.groupList[index]
      if (group.id) {
        this.mp.delGroupIds.push(group.id)
      }
      this.mp.groupList.splice(index, 1)
    },
    // 添加行 打开商品模态框
    openMpModal(group, index) {
      this.querySubMpModalParam = {}
      const existMpIds = []
      if (this.mp.groupList && this.mp.groupList.length > 0) {
        for (const group of this.mp.groupList) {
          if (!group.combineList || group.combineList.length === 0) {
            continue
          }
          for (const combine of group.combineList) {
            existMpIds.push(combine.subMpId)
          }
        }
      }
      this.querySubMpModalParam.mpIds = existMpIds
      this.querySubMpModalParam.merchantId = this.mp.merchantId
      this.querySubMpModalParam.limitCount = 10 - (group.combineList ? group.combineList.length : 0)
      this.querySubMpModalParam.index = index
      this.visible = !this.visible
    },
    // 添加行 关闭商品模态框
    closeMpModal(data) {
      const group = this.mp.groupList[data.index]
      let orderNum = group.combineList.length
      for (const item of data.list) {
        const combine = { orderNum: orderNum, subMpId: item.subMpId, salePriceWithTax: item.salePriceWithTax, chineseName: item.chineseName, subNum: 1 }
        if (this.mp.combineType === 1) {
          combine.subAddPrice = 0
        }
        group.combineList.push(combine)
        orderNum++
      }
    },
    // 删除行
    deleteRow(group, row, index) {
      if (row.id) {
        this.mp.delCombineIds.push(row.id)
      }
      group.combineList.splice(index, 1)
      for (let i = 0; i < group.combineList.length; i++) {
        group.combineList[i].orderNum = i
      }
    },
    // 行向上
    upSort(row, index, group) {
      if (index === 0) {
        return
      }
      group.combineList[index].orderNum--
      group.combineList[index - 1].orderNum++
      this.sortByOrderNum(group.combineList)
    },
    // 行向下
    downSort(row, index, group) {
      if (index === group.combineList.length - 1) {
        return
      }
      group.combineList[index].orderNum++
      group.combineList[index + 1].orderNum--
      this.sortByOrderNum(group.combineList)
    },
    // 行置顶
    topSort(row, index, group) {
      if (index === 0) {
        return
      }
      for (let i = 0; i < index; i++) {
        group.combineList[i].orderNum = i + 1
      }
      row.orderNum = 0
      this.sortByOrderNum(group.combineList)
    },
    // 行置底
    bottomSort(row, index, group) {
      if (index === group.combineList.length - 1) {
        return
      }
      for (let i = group.combineList.length - 1; i > index; i--) {
        group.combineList[i].orderNum = i - 1
      }
      row.orderNum = group.combineList.length - 1
      this.sortByOrderNum(group.combineList)
    }
  }
}
</script>
