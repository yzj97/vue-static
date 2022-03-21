<template>
  <section>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('用户账号')" prop="username">
              <el-input v-model="searchForm.username" name="searchForm_username"/>
            </ody-search-item>
            <ody-search-item :label="$t('姓名')" prop="identityCardName">
              <el-input v-model="searchForm.identityCardName" name="searchForm_identityCardName"/>
            </ody-search-item>
            <ody-search-item :label="$t('工号')" prop="employeNum">
              <el-input v-model="searchForm.employeNum" name="searchForm_employeNum"/>
            </ody-search-item>
            <ody-search-item :label="$t('手机号')" prop="mobile">
              <el-input v-model="searchForm.mobile" name="searchForm_mobile"/>
            </ody-search-item>
            <ody-search-item :label="$t('状态')" prop="isAvailable">
              <el-select v-model="searchForm.isAvailable" :placeholder="$t('全部')" name="searchForm_isAvailable">
                <el-option
                  v-for="item in isAvailable"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('岗位')" prop="positionId">
              <el-select v-model="searchForm.positionId" :placeholder="$t('全部')" name="searchForm_positionId">
                <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.positionName"
                  :value="item.id"/>
              </el-select>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="queryGuideUserPage" size="small" type="primary" @click="queryGuideUserPage">{{ $t('查询') }}</el-button>
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list184"/>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="searchForm.currentPage"
              :list="listTable.list"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="searchForm.itemsPerPage"
              :total.sync="listTable.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="queryGuideUserPage"
              @current-change="queryGuideUserPage"/>
          </div>
        </div>
      </ody-list-table-area>
    </section>
  </section>
</template>

<script>
import util from '@/utils/util'
import constants from '@/utils/constants'

export default {
  name: 'OuserGuideList',
  data() {
    return {
      // 列表框对象
      listTable: {
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'userId',
            'label': '用户ID',
            'align': 'center',
            'minWidth': 70
          },
          {
            'show': true,
            'prop': 'username',
            'label': '用户账号',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'identitySubTypeStr',
            'label': '账号类型',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'entityName',
            'label': '所属商家',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'identityCardName',
            'label': '姓名',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'positionName',
            'label': '岗位',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'employeNum',
            'label': '工号',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'mobile',
            'label': '手机号',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'isAvailableStr',
            'label': '状态',
            'align': 'center',
            'minWidth': 60
          }
        ],
        operates: {
          'width': 200,
          'fixed': 'right',
          'list': [
            {
              'label': '功能权限',
              show: true,
              'disabled': false,
              method(index, row) {
              }
            }
          ]
        }
      },
      // 搜索框对象
      searchForm: {},
      // 岗位
      positions: [],
      // 状态列表
      isAvailable: [],
      merchantInfo: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const userService = this.$ouser.$api.userService
      const merchantService = this.$ouser.$api.merchantService
      const self = this
      this.initForm()
      // 常量赋值
      this.isAvailable = constants.isAvailable
      try {
        await merchantService.queryPlatformAuthMerchantPage({}).then(res => {
          self.merchantInfo = res.data.listObj[0]
        })
        // 查询岗位列表
        await userService.queryPositionList({ 'entityIds': [this.merchantInfo.merchantId], 'currentPage': 1, 'itemsPerPage': 500 }).then((res) => {
          self.positions = res.data
        })
        await this.queryGuideUserPage()
      } catch (e) {
        console.log(e)
      }
    },
    // 初始化搜索对象
    initForm() {
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10
      }
    },
    queryGuideUserPage() {
      const employeeService = this.$ouser.$api.employeeService
      const self = this
      employeeService.queryGuideUserPage(this.searchForm).then(res => {
        self.listTable.total = res.data.total
        self.listTable.list = res.data.listObj
        self.listTable.list.forEach(one => {
          // 转换状态枚举和状态name
          one.isAvailableStr = util.getOnePropByKeyFromArr(self.isAvailable, one.isAvailable)
          one.entityName = self.merchantInfo.merchantName
          one.identitySubTypeStr = util.getOnePropByKeyFromArr(constants.identitySubTypes, one.identitySubType)
        })
      })
    }
  }
}
</script>

