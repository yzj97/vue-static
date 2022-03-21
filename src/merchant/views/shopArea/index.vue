<template>
  <ody-box :title="$t('店铺区域管理')">
    <div class="header">
      <div class="lable">{{ $t('店铺') }}：</div>
      <ody-store-select v-model="storeId" :default-choose="true" name="storeId" value-key="storeId" />
    </div>
    <div class="content-box">
      <div class="left">
        <ody-top-title :title="$t('区域管理')" />
        <div class="btn">
          <el-input v-model="locationName" :placeholder="$t('请输入新区域名称')" name="locationName" maxlength="10">
            <template slot="append">
              <i
                v-if="$portal.hasPermission('MerchantShopArea01')"
                name="addStoreLocation"
                class="el-icon-plus"
                @click="addStoreLocation"
              />
            </template>
          </el-input>
        </div>
        <ody-table
          :data="storeLocationList"
          :checked="checked"
          :highlight-current-row="true"
          :columns="manageData.columns"
          :operates="manageData.operates"
          :can-filter="false"
          name="storeLocationList744"
          @selection-change="handleSelectionChange"
        >
          <template slot="locationName" slot-scope="scope">
            <span class="name-span">{{ scope.row.newLocationName }}</span>
            <el-popover placement="top-start" width="260" trigger="click">
              <div class="flex">
                <el-input
                  v-model="scope.row.locationName"
                  :placeholder="$t('请输入内容')"
                  maxlength="10"
                  name="scope_row_locationName"
                  class="flex-input"
                />
                <ody-button
                  name="MerchantShopArea02_updateStoreLocation"
                  type="primary"
                  size="small"
                  code="MerchantShopArea02"
                  @click="updateStoreLocation(scope.row)"
                >{{ $t('确定') }}</ody-button>
              </div>
              <i
                v-if="scope.row.showFlag !== true"
                slot="reference"
                class="el-icon-edit"
                @click.stop
              />
            </el-popover>
          </template>
        </ody-table>
      </div>
      <div class="right">
        <div class="detail">
          <div>{{ $t('区域详情') }}</div>
          <div
            v-if="checkDetail.code === 'diningArea' || checkDetail.parentCode === 'diningArea'"
            class="add-btn"
          >
            <el-input v-model="locationName2" :placeholder="$t('请输入子区域名称')" name="locationName2" maxlength="10">
              <template slot="append">
                <i
                  v-if="$portal.hasPermission('MerchantShopArea03')"
                  name="addStoreLocationChildren"
                  class="el-icon-plus"
                  @click="addStoreLocationChildren"
                />
              </template>
            </el-input>
          </div>
        </div>
        <div v-if="checked.length > 0" class="detail-tabs">
          <div v-for="(item, index) in checked[0].children" :key="item.id" class="detail-tabs-item">
            <div
              :class="{active : index === checkIndex}"
              :title="item.newLocationName"
              name="clickDatail"
              class="item"
              @click="clickDatail(index, item)"
            >{{ item.newLocationName }}</div>
            <div class="icons">
              <el-popover placement="top-start" width="260" trigger="click">
                <div class="flex">
                  <el-input
                    v-model="item.locationName"
                    :placeholder="$t('请输入内容')"
                    maxlength="10"
                    name="item_locationName"
                    class="flex-input"
                  />
                  <ody-button
                    name="MerchantShopArea04_updateStoreLocation"
                    type="primary"
                    size="small"
                    code="MerchantShopArea04"
                    @click="updateStoreLocation(item)"
                  >{{ $t('确定') }}</ody-button>
                </div>
                <i v-if="index !== 0" slot="reference" class="el-icon-edit" />
              </el-popover>
              <i
                v-if="$portal.hasPermission('MerchantShopArea12') && index !== 0"
                name="delStoreArea"
                class="el-icon-delete"
                @click="delStoreArea(item)"
              />
            </div>
          </div>
        </div>
        <el-tabs v-model="activeName" name="activeName">
          <el-tab-pane :label="$t('设备')" name="1">
            <div class="btn">
              <ody-button
                :disabled="btnDisabled"
                name="MerchantShopArea05_editEuipment"
                type="primary"
                size="small"
                code="MerchantShopArea05"
                @click="editEuipment({})"
              >{{ $t('增加设备') }}</ody-button>
            </div>
            <div class="table">
              <ody-table
                :data="equipmentsList"
                :columns="equipmentsTable.columns"
                :operates="equipmentsTable.operates"
                :can-filter="false"
                name="equipmentsList605"
              >
                <template
                  slot="terminalType"
                  slot-scope="scope"
                >{{ terminalTypeMap[scope.row.terminalType] }}</template>
                <template
                  slot="isAvailable"
                  slot-scope="scope"
                >{{ scope.row.isAvailable === 1 ? $t('启用') : $t('停用') }}</template>
              </ody-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('位置')" name="2">
            <div class="btn">
              <ody-button
                :disabled="btnDisabled"
                name="MerchantShopArea06_editLocation"
                type="primary"
                size="small"
                code="MerchantShopArea06"
                @click="editLocation({})"
              >{{ $t('增加位置') }}</ody-button>
            </div>
            <div class="table">
              <ody-table
                :data="locationList"
                :columns="locationTable.columns"
                :operates="locationTable.operates"
                :can-filter="false"
                name="locationList687"
              >
                <template slot="status" slot-scope="scope">{{ locationStatus[scope.row.status] }}</template>
              </ody-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <area-add-equipment
      v-if="equipmentVisible"
      :visible.sync="equipmentVisible"
      :choose-equipment="chooseEquipment"
      :check-detail="checkDetail"
      @init="queryStoreLocation"
    />
    <area-add-location
      v-if="locationVisible"
      :visible.sync="locationVisible"
      :choose-location="chooseLocation"
      :check-detail="checkDetail"
      :check-index="checkIndex"
      :checked="checked"
      :click-datail="clickDatail"
      :query-store-location="queryStoreLocation"
      @init="queryStoreLocation"
    />
    <shop-area-image
      v-if="areaImageVisible"
      :visible.sync="areaImageVisible"
      :item-data="chooseItem"/>

  </ody-box>
</template>

<script>
import AreaAddEquipment from '@/components/area-add-equipment'
import AreaAddLocation from '@/components/area-add-location'
import ShopAreaImage from '@/components/shop-area-image'
export default {
  name: 'MerchantShopArea',
  components: {
    AreaAddEquipment,
    AreaAddLocation,
    ShopAreaImage
  },
  data() {
    return {
      defaultArea: [
        {
          locationName: this.$t('收银区'),
          code: 'cashierArea'
        },
        {
          locationName: this.$t('就餐区'),
          code: 'diningArea'
        }
      ],
      imgUrl: '',
      chooseItem: '',
      locationVisible: false,
      equipmentVisible: false,
      areaImageVisible: false,
      statusMap: {
        '1': this.$t('启用'),
        '0': this.$t('停用')
      },
      locationStatus: {
        '-1': this.$t('停用'),
        '0': this.$t('空闲'),
        '1': this.$t('已开台'),
        '2': this.$t('使用中'),
        '3': this.$t('待清桌')
      },
      terminalTypeMap: {
        '1': this.$t('POS机'),
        '2': this.$t('摄像头'),
        '3': this.$t('厨打机')
      },
      btnDisabled: false,
      storeId: '',
      activeName: '1',
      locationName: '',
      locationName2: '',
      postApi: this.$merchant.$api.areaService,
      storeLocationList: [],
      checked: [],
      checkDetail: {},
      checkIndex: 0,
      manageData: {
        columns: [
          {
            label: this.$t('区域'),
            slot: 'locationName',
            show: true
          }
        ],
        operates: {
          width: 50,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              disabled: (index, row) => {
                return row.showFlag
              },
              method: (index, row, event) => {
                this.delStoreArea(row, event)
              },
              code: 'MerchantShopArea07'
            }
          ]
        }
      },
      equipmentsTable: {
        columns: [
          {
            label: this.$t('设备编码'),
            prop: 'terminalCode',
            show: true
          },
          {
            label: this.$t('设备名称'),
            prop: 'terminalName',
            show: true
          },
          {
            label: this.$t('设备类型'),
            slot: 'terminalType',
            show: true
          },
          {
            label: this.$t('状态'),
            slot: 'isAvailable',
            show: true
          }
        ],
        operates: {
          fixed: 'right',

          list: [
            {
              label: this.$t('编辑'),
              method: (index, row, event) => {
                this.editEuipment(row, event)
              },
              code: 'MerchantShopArea08'
            },
            {
              label: this.$t('删除'),
              method: (index, row, event) => {
                this.delEquipment(row)
              },
              code: 'MerchantShopArea09'
            }
          ]
        }
      },
      equipmentsList: [],
      chooseEquipment: {},
      locationList: [],
      chooseLocation: {},
      locationTable: {
        columns: [
          {
            label: this.$t('位置名称'),
            prop: 'locationName',
            show: true
          },
          {
            label: this.$t('容纳人数'),
            prop: 'maxUser',
            show: true
          },

          {
            label: this.$t('状态'),
            slot: 'status',
            show: true
          }
        ],
        operates: {
          fixed: 'right',
          width: 140,
          list: [
            {
              label: this.$t('编辑'),
              method: (index, row, event) => {
                this.editLocation(row, event)
              },
              code: 'MerchantShopArea10'
            },
            {
              label: this.$t('删除'),
              method: (index, row, event) => {
                this.delLocation(row)
              },
              code: 'MerchantShopArea11'
            },
            {
              label: this.$t('查看小程序码'),
              method: (index, row, event) => {
                this.checkUrl(row)
              },
              hidden: () => {
                return !(this.checkDetail.code === 'diningArea' || this.checkDetail.parentCode === 'diningArea')
              },
              code: 'MerchantShopArea13'
            }
          ]
        }
      }
    }
  },
  watch: {
    storeId: {
      async handler(val) {
        await this.queryStoreLocation()
      }
    },
    checkDetail: {
      async handler(val) {
        if (val.tables) {
          this.locationList = val.tables
        } else {
          this.locationList = []
        }

        if (val.id) {
          await this.queryEquipments(val.id)
        } else {
          this.equipmentsList = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    clickDatail(index, item) {
      this.checkIndex = index
      this.checkDetail = item
      console.log(this.checkDetail)
    },
    handleSelectionChange(val) {
      this.checked = [val]
      this.checkDetail = this.checked[0].children[0]
      this.checkIndex = 0
      console.log(this.checkDetail)
    },
    dealChecked(data) {
      if (data.length > 0) {
        this.btnDisabled = false
        if (this.checked.length > 0) {
          const index = data.findIndex(col => col.code === this.checked[0].code)
          if (index > -1) {
            this.checked = [data[index]]
          } else {
            this.checked = [data[0]]
          }
        } else {
          this.checked = [data[0]]
        }
        this.checkDetail = this.checked[0].children[0]
      } else {
        this.checked = []
        this.btnDisabled = true
        this.checkDetail = {}
      }
      this.checkIndex = 0
    },
    async queryStoreLocation() {
      const res = await this.postApi.queryStoreLocation({
        storeId: this.storeId
      })
      res.data.map(item => {
        item.newLocationName = item.locationName
        const { children = [], ...reset } = item
        item.children = [reset, ...children]
        item.children.map(row => {
          row.newLocationName = row.locationName
        })
        item.children[0].newLocationName =
          item.children[0].newLocationName + this.$t('默认区')
        item.children[0].parentName = item.children[0].locationName
        item.children[0].parentId = item.children[0].id

        // 对就餐区和收银区进行特殊处理
        const index = this.defaultArea.findIndex(row => row.code === item.code)
        if (index > -1) {
          item.showFlag = true
        } else {
          item.showFlag = false
        }
      })

      this.storeLocationList = res.data
      this.dealChecked(res.data)
    },
    async addStoreLocationChildren() {
      if (this.locationName2 === '') {
        this.$message('子区域名称不能为空')
        return
      }
      const params = {
        parentId: this.checkDetail.parentId,
        locationName: this.locationName2,
        locationType: 2,
        storeId: this.storeId
      }
      await this.postApi.addStoreLocation(params)
      this.locationName2 = ''
      this.queryStoreLocation()
    },
    async addStoreLocation() {
      if (this.locationName === '') {
        this.$message('新区域名称不能为空')
        return
      }
      const index = this.defaultArea.findIndex(row => row.locationName === this.locationName)
      const params = {
        code: index > -1 ? this.defaultArea[index].code : '',
        locationName: this.locationName,
        locationType: 2,
        storeId: this.storeId
      }
      await this.postApi.addStoreLocation(params)
      this.locationName = ''
      this.queryStoreLocation()
    },
    async delStoreArea(row, event) {
      if (event) {
        event.stopPropagation()
      }
      this.$confirm(
        this.$t('确定要删除该数据?该数据下的相关信息会同步删除!'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(async() => {
        await this.postApi.delStoreArea(row)
        this.queryStoreLocation()
      })
    },
    async updateStoreLocation(row) {
      await this.postApi.updateStoreLocation(row)
      this.queryStoreLocation()
      document.body.click()
    },
    async queryEquipments(id) {
      const params = {
        storeLocationId: id
      }
      const res = await this.postApi.queryEquipments(params)
      this.equipmentsList = res.data
    },
    editEuipment(item) {
      this.chooseEquipment = JSON.parse(JSON.stringify(item))
      this.equipmentVisible = true
    },
    async delEquipment(item) {
      this.$confirm(
        this.$t('确定要删除该数据?该数据下的相关信息会同步删除!'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(async() => {
        await this.postApi.delEquipment(item)
        this.queryStoreLocation()
      })
    },
    editLocation(item) {
      this.chooseLocation = JSON.parse(JSON.stringify(item))
      this.locationVisible = true
    },
    delLocation(item) {
      this.$confirm(
        this.$t('确定要删除该数据?该数据下的相关信息会同步删除!'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(async() => {
        const oldIndex = this.checkIndex
        await this.postApi.delStoreArea(item)
        await this.queryStoreLocation()
        const newDetail = this.checked[0].children[oldIndex]
        // 跳转回去
        this.clickDatail(oldIndex, newDetail)
      })
    },
    checkUrl(item) {
      this.chooseItem = item
      this.areaImageVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  display: flex;
  margin: 18px 0 18px 0;
  padding-left: 20px;
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: #455a64;
  background: #f8f9fa;
  height: 40px;
  line-height: 40px;
  .add-btn {
    margin-left: 10px;
  }
}
.detail-tabs {
  display: flex;
  font-size: 14px;
  border-bottom: 1px solid #e5e5e5;
  .detail-tabs-item {
    display: flex;
    .icons {
      margin-right: 10px;
      line-height: 40px;
    }
  }
  .item {
    cursor: pointer;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 40px;
    line-height: 40px;
    padding: 0 5px;
    &.active {
      position: relative;
      color: #409eff;
      border-bottom: 1px solid #409eff;
    }
  }
}
.flex {
  display: flex;
}
.flex-input {
  margin-right: 4px;
}
.name-span {
  width: 84px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.header {
  display: flex;
}

.lable {
  line-height: 32px;
}
.content-box {
  display: flex;

  .left {
    width: 240px;
    margin-right: 28px;
    .btn {
      margin-bottom: 20px;
    }
  }
  .right {
    flex: 1;
    .btn {
      margin-bottom: 20px;
    }
  }
}
</style>
