<template>
  <div>
    <el-tabs v-model="activeTab" name="activeTab" @tab-click="tabClick">
      <el-tab-pane :label="$t('商家权限')" name="1"/>
      <el-tab-pane :label="$t('店铺权限')" name="2"/>
      <el-tab-pane :label="$t('仓库权限')" name="3"/>
      <el-tab-pane :label="$t('经销商权限')" name="4"/>
      <el-tab-pane :label="$t('分销商权限')" name="5"/>
      <el-tab-pane :label="$t('加盟商权限')" name="6"/>
    </el-tabs>
    <el-row>
      <el-col :span="24">
        <ody-tree-transfer
          v-if="orgList && orgList.length"
          :data="orgList"
          :checked.sync="ownOrgList"
          name="orgList367"
        />
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="12" :offset="6">
        <el-button name="updateVisit" type="primary" @click="updateVisit" >{{ $t('确认') }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import util from '@/utils/util'
export default {
  name: 'OuserOperaAddVisit',
  data() {
    return {
      userId: 0,
      orgList: [],
      ownOrgList: [],
      ownOrgListOld: [],
      identitySubType: 0,
      activeTab: '1'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.orgList = []
      this.ownOrgList = []
      this.ownOrgListOld = []
      this.userId = this.$route.params.userId
      this.identitySubType = this.$route.params.identitySubType
      try {
        await this.getAuthOrg()
        await this.getAuthOrg(this.userId)
      } catch (e) {
        console.log(e)
      }
    },
    tabClick() {
      this.init()
    },
    getAuthOrg(userId) {
      const self = this
      const param = { userId: userId, type: this.activeTab }
      const merchantService = this.$ouser.$api.merchantService
      merchantService.getAuthOrg(param).then(res => {
        const orgList = []
        res.data.forEach(o => {
          if (o.id >= 0) {
            o.pId = -1 * parseInt(this.activeTab)
          } else {
            o.pId = 0
          }
          orgList.push(o)
        })
        if (userId) {
          self.ownOrgListOld = orgList
          self.ownOrgList = util.arr2tree(orgList, 'id', 'pId', 'name')
        } else {
          self.orgList = util.arr2tree(orgList, 'id', 'pId', 'name')
        }
      })
    },
    updateVisit() {
      const orgUserAuth = this.$ouser.$api.orgUserAuth
      const param = { userId: this.userId, orgInfoList: [], deleteOrgIds: [], orgType: this.activeTab }
      const self = this
      const checkedOrgInfoList = []
      this.ownOrgList.forEach(o => {
        tree2arr(o, checkedOrgInfoList)
      })
      checkedOrgInfoList.forEach(o => {
        let has = false
        self.ownOrgListOld.forEach(i => {
          if (i.orgId === o.orgId) {
            has = true
          }
        })
        if (!has) {
          param.orgInfoList.push(o)
        }
      })

      this.ownOrgListOld.forEach(o => {
        let deleted = true
        checkedOrgInfoList.forEach(i => {
          if (o.id === i.orgId) {
            deleted = false
          }
        })
        if (deleted) {
          param.deleteOrgIds.push(o.id)
        }
      })

      orgUserAuth.batchUpdateVisitControlInfo(param).then(res => {
        self.$message({
          message: '修改成功',
          type: 'success'
        })
        self.init()
      }
      )
    }
  }
}

const tree2arr = function(tree, arr) {
  if (tree.children) {
    tree.children.forEach(c => {
      tree2arr(c, arr)
    })
  }
  if (tree.id >= 0) {
    arr.push({ orgId: tree.id, orgType: tree.orgType })
  }
}
</script>

