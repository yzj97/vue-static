<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('商家编号') + ':'" prop="orgCode">
              <el-input
                id="orgCode"
                v-model="searchForm.orgCode"
                :placeholder="$t('请输入商家编号')"
                name="searchForm_orgCode"
              />
            </ody-search-item>
            <ody-search-item :label="$t('商家名称') + ':'" prop="orgName">
              <el-input
                id="orgName"
                v-model="searchForm.orgName"
                :placeholder="$t('请输入商家名称')"
                name="searchForm_orgName"
              />
            </ody-search-item>
            <ody-search-item :label="$t('商家状态') + ':'" prop="businessStatus">
              <el-select
                id="businessStatus"
                v-model="searchForm.businessStatus"
                :placeholder="$t('全部')"
                name="searchForm_businessStatus"
              >
                <el-option value>{{ $t('全部') }}</el-option>
                <el-option
                  v-for="item in isAvailable"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('联系人') + ':'" prop="contactName">
              <el-input
                id="contactName"
                v-model="searchForm.contactName"
                :placeholder="$t('请输入联系人')"
                name="searchForm_contactName"
              />
            </ody-search-item>
            <ody-search-item :label="$t('联系人手机') + ':'" prop="contactMobile">
              <el-input
                id="contactMobile"
                v-model="searchForm.contactMobile"
                :placeholder="$t('请输入联系人手机')"
                name="searchForm_contactMobile"
              />
            </ody-search-item>
            <ody-search-item :label="$t('商家类型') + ':'" prop="merchantType">
              <el-select
                id="merchantType"
                v-model="searchForm.merchantType"
                :placeholder="$t('全部')"
                name="searchForm_merchantType"
              >
                <el-option value>{{ $t('全部') }}</el-option>
                <el-option
                  v-for="item in merchantType"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('创建时间') + ':'" :space="2" prop="createTimeStart">
              <!-- <el-col :span="12">
                <el-date-picker
                  id="createTimeStart"
                  v-model="searchForm.createTimeStart"
                  :placeholder="$t('开始日期')"
                  name="searchForm_createTimeStart"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                />
              </el-col>
              <el-col :span="12">
                <el-date-picker
                  id="createTimeEnd"
                  v-model="searchForm.createTimeEnd"
                  :placeholder="$t('结束日期')"
                  name="searchForm_createTimeEnd"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                />
              </el-col>-->
              <ody-date-range-picker
                v-model="createTime"
                :start-placeholder="$t('startDate')"
                :end-placeholder="$t('endDate')"
                name="searchForm_createTime"
                value-format="yyyy-MM-dd"
                type="datetimer"
                range-separator="-"
              />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button id="initForm" name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button
            id="search"
            name="MerchantManageQuery_search"
            code="MerchantManageQuery"
            size="small"
            type="primary"
            @click="search"
          >{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button
            id="addMerchant"
            name="MerchantManageAdd_addMerchant"
            code="MerchantManageAdd"
            size="mini"
            type="primary"
            @click="addMerchant"
          >{{ $t('新增商家') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list259"
          >
            <template slot="businessStatus" slot-scope="scope">
              <div>
                <el-switch
                  :disabled="!$portal.hasPermission('MerchantManageEnable') || (scope.row.merchantType !== '11' && scope.row.merchantType !== '12')"
                  :value="scope.row.businessStatus === '1'"
                  :active-text="scope.row.businessStatus === '1' ? $t('是') : $t('否')"
                  @change="changeStatus(scope.row)"
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
            @size-change="search"
            @current-change="query"
          />
        </div>
      </ody-list-table-area>

      <addMerchantDialog :visible.sync="showAddMerchant" @ok="query" />
    </section>
  </div>
</template>
<script>
import util from '@/utils/util'
import addMerchantDialog from '@/components/addMerchantDialog'
import Cookies from 'js-cookie'

export default {
  name: 'MerchantManage',
  components: {
    addMerchantDialog
  },
  data() {
    return {
      loading: false,
      // 搜索框对象
      searchForm: {
        orgCode: '',
        orgName: '',
        businessStatus: '',
        contactName: '',
        contactMobile: '',
        merchantType: ''
      },
      createTime: [],
      isAvailable: [],
      showAddMerchant: false,
      platformId: null,
      merchantType: [],
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'orgCode',
            label: this.$t('商家编号'),
            align: 'center',
            render: (h, params) => {
              return (
                <a
                  on-click={() => {
                    if (this.$portal.hasPermission('MerchantManageSee')) {
                      this.forwardToDetail(params.row)
                    }
                  }}
                >
                  <span style={'color:#1890FF'}>{params.row.orgCode}</span>
                </a>
              )
            }
          },
          {
            show: true,
            prop: 'orgName',
            label: this.$t('商家名称'),
            align: 'center'
          },
          {
            show: true,
            prop: 'departmentName',
            label: this.$t('组织架构'),
            align: 'center'
          },
          {
            show: true,
            prop: 'merchantTypeStr',
            label: this.$t('商家类型'),
            align: 'center'
          },
          {
            show: true,
            prop: 'contactName',
            label: this.$t('联系人'),
            align: 'center'
          },
          {
            show: true,
            prop: 'contactMobile',
            label: this.$t('联系人手机'),
            align: 'center'
          },
          {
            show: true,
            slot: 'businessStatus',
            label: this.$t('商家状态'),
            align: 'center'
          },
          {
            show: true,
            prop: 'createTimeStr',
            label: this.$t('创建时间'),
            align: 'center'
          }
        ],
        operates: {
          width: 100,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              hidden: (index, row) => {
                if (row.merchantType === '0') {
                  return true
                } else {
                  return false
                }
              },
              disabled: false,
              method: (index, row) => {
                this.editMerchant(row.orgId, row.orgCode, row.orgName)
              },
              code: 'MerchantManageEdit'
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.initPlatformId().then(() => {
      this.init()
    })
  },
  methods: {
    async initPlatformId() {
      this.platformId = Cookies.get('platformId')
      return Promise.resolve()
    },
    async init() {
      this.initForm()
      await this.initCode()
      try {
        await this.query()
      } catch (e) {
        console.log(e)
      }
    },
    initCode() {
      this.$merchant.$api.commonService
        .listMultiCode({ categories: ['IS_AVLIABLE', 'MERCHANT_TYPE'] })
        .then(res => {
          this.isAvailable = res.data.IS_AVLIABLE
          this.merchantType = res.data.MERCHANT_TYPE
        })
    },
    forwardToDetail(row) {
      this.$router.push({
        name: 'MerchantRead',
        params: { orgId: row.orgId }
      })
    },
    async search() {
      this.searchForm.currentPage = 1
      await this.query()
    },
    async query() {
      const merchantService = this.$merchant.$api.merchantService
      try {
        this.loading = true
        if (this.createTime && this.createTime.length) {
          this.searchForm.createTimeStart = this.createTime[0]
          this.searchForm.createTimeEnd = this.createTime[1]
        } else {
          this.searchForm.createTimeStart = null
          this.searchForm.createTimeEnd = null
        }
        const res = await merchantService.queryRegisterMerchantPageInfo(
          this.searchForm
        )
        this.listTable.list = res.data.listObj
        this.listTable.total = res.data.total
        this.listTable.list.forEach(one => {
          one.businessStatusStr = one.businessStatus === '1'
          one.merchantTypeStr =
            one.merchantType === '11' || one.merchantType === '0'
              ? this.$t('自营')
              : this.$t('入驻')
        })
        util.formatDate(this.listTable.list, 'createTime')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    changeStatus(merchant) {
      const params = {}
      params.id = merchant.id
      params.orgId = merchant.orgId
      if (merchant.businessStatus === '1') {
        params.businessStatus = '0'
      } else {
        params.businessStatus = '1'
      }

      const merchantService = this.$merchant.$api.merchantService
      merchantService
        .updateBusinessStatusRegisterMerchantInfo(params)
        .then(result => {
          if (result && result.code === '0') {
            this.$message({
              message: this.$t('状态更新成功'),
              type: 'success'
            })
            this.query()
          }
        })
    },
    // 初始化搜索对象
    initForm() {
      this.createTime = []
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10,
        platformId: this.platformId
      }
    },
    addMerchant() {
      this.showAddMerchant = true
    },
    editMerchant(orgId, orgCode, orgName) {
      this.$router.push({
        name: 'MerchantEdit',
        params: {
          orgId: orgId,
          orgCode: orgCode,
          orgName: orgName
        }
      })
    }
  }
}
</script>
