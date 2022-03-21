<template>
  <div>
    <el-row>
      <el-col :span="6">
        <h3>{{ $t('编辑管辖店铺') }}</h3>
        <el-input
          v-model="filterText"
          :placeholder="$t('输入关键字进行过滤')"
          name="filterText"/>

        <el-tree
          ref="filterTree"
          :data="departmentTree"
          :props="defaultProps"
          :highlight-current="highlight_current"
          :filter-node-method="filterNode"
          name="departmentTree979"
          class="filter-tree"
          node-key="id"
          default-expand-all
          @node-click="departmentNodeClick"/>
      </el-col>
      <el-col :span="16" style="margin-left: 5%">
        <h3>{{ checkedDepartment.label }}</h3>
        <div>
          <ody-tree-transfer
            v-if="sourceDeparmentTree && sourceDeparmentTree.length"
            :data="sourceDeparmentTree"
            :checked.sync="selectedValue"
            name="sourceDeparmentTree343"/>
        </div>
        <div v-if="sourceDeparmentTree && sourceDeparmentTree.length" style="text-align: center; margin-top: 20px;">
          <el-row>
            <el-button name="handleSaveSelectedTree" type="primary" @click="handleSaveSelectedTree">{{ $t('保存') }}</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  name: 'OuserOperaShop',
  data() {
    return {
      // 选中的地区
      checkedDepartment: '',
      filterText: '',
      departmentTree: [],
      selectedValue: [],
      sourceDeparmentTree: []
    }
  },
  watch: {
    // 监控部门树搜索框值的变化
    filterText(val) {
      this.$refs.filterTree.filter(val)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化树
    async init() {
      const departmentService = this.$ouser.$api.departmentService
      const self = this
      try {
        // 1、初始化组织结构
        const res = await departmentService.queryDepartmentByParams({ type: 0 })
        let minLevel = 99
        for (const d of res.data) {
          if (d.level < minLevel) {
            minLevel = d.level
          }
        }
        res.data.forEach(d => {
          if (d.level === minLevel) {
            d.parentCode = '0'
          }
        })
        self.departmentTree = util.arr2tree(res.data, 'code', 'parentCode', 'name')
      } catch (e) {
        console.log(e)
      }
    },
    // 组织架构点击事件
    departmentNodeClick(data) {
      this.checkedDepartment = data
      this.initSelectedTree()
    },
    // 初始化选中的树（最右边的）
    async initSelectedTree() {
      try {
        const departmentService = this.$ouser.$api.departmentService
        const storeorgpageinfoService = this.$ouser.$api.StoreorgpageinfoService
        const self = this
        //  2、初始化所有店铺列表
        await storeorgpageinfoService.queryStoreOrgPageByParams({}).then(res => {
          res.data.listObj.forEach(s => {
            s.pId = 0
          })
          self.sourceDeparmentTree = util.arr2tree(res.data.listObj, 'storeId', 'pId', 'storeName')
        })
        // 1、查询所选地区已有的店铺列表
        // 1.1根据父节点查询已有的店铺列表
        const reqStoreObj = { 'parentCode': self.checkedDepartment.code }
        departmentService.queryDepartmentByParams(reqStoreObj).then(storeRes => {
          if (storeRes === null || storeRes.code !== '0' || storeRes.data === null || storeRes.data.length === 0) {
            self.selectedValue = []
            return
          }
          const storeList = storeRes.data
          // 1.2 根据结果组装id列表
          const ids = []
          for (let i = 0; i < storeList.length; i++) {
            const obj = storeList[i]
            ids.push(obj.storeId)
          }
          // 2、根据已有的列表查询店铺所属信息
          const storeIds = { 'storeIds': ids }
          storeorgpageinfoService.queryStoreOrgPageByParams(storeIds).then(res => {
            res.data.listObj.forEach(s => {
              s.pId = 0
            })
            self.selectedValue = util.arr2tree(res.data.listObj, 'storeId', 'pId', 'storeName')
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 保存选中的树的数据
    handleSaveSelectedTree() {
      const departmentService = this.$ouser.$api.departmentService
      const self = this
      const selectedTreeData = util.copy(self.selectedValue)
      // 开始组装数据 保存 department
      const requestList = self.initData(selectedTreeData)
      const requestModel = { departmentList: requestList, parentCode: this.checkedDepartment.code }
      departmentService.save(requestModel).then(res => {
        self.$message({
          message: '修改成功',
          type: 'success'
        })
        this.initSelectedTree()
      })
    },
    // 组装数据
    initData(arr) {
      const self = this
      var result = []
      for (let i = 0; i < arr.length; i++) {
        var obj = {}
        const a = arr[i]
        obj.name = a.label
        obj.storeId = a.storeId
        obj.level = 3
        obj.type = 1
        // 设置父节点
        obj.parentCode = self.checkedDepartment.code

        result.push(obj)
      }
      return result
    }
  }
}

</script>
<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>
