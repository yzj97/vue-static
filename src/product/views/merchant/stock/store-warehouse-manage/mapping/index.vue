<template>
  <div class="pg-store-warehouse-manage-mapping">
    <ody-box style="margin-bottom: 20px;">
      <ody-top-title :title="$t('仓库信息')" />
      <el-form
        ref="warehouse"
        :model="warehouse"
        :rules="rules"
        :disabled="true"
        label-width="240px"
        class="form"
      >
        <el-form-item :label="$t('仓库编码')" prop="warehouseCode">
          <el-input
            v-model="warehouse.warehouseCode"
            :disabled="isEdit"
            :placeholder="$t('请输入') + ' ' + $t('仓库编码')"
            name="warehouse_warehouseCode"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('仓库名称')" prop="warehouseName">
          <el-input
            v-model="warehouse.warehouseName"
            :placeholder="$t('请输入') + ' ' + $t('仓库名称')"
            name="warehouse_warehouseName"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('仓库类型')" prop="warehouseType">
          <ody-select2
            :disabled="isEdit"
            v-model="warehouse.warehouseType"
            :placeholder="$t('请选择')"
            name="warehouse_warehouseType"
            list-key="warehouseTypes"
          />
        </el-form-item>
      </el-form>
    </ody-box>
    <ody-box v-if="warehouse.warehouseType === 1">
      <ody-top-title :title="$t('拟合库存映射')" />
      <ody-list-table-area>
        <div slot="btn">
          <ody-button
            name="StoreWarehouseManageListAddMapping_handleCenterMappingOpen"
            type="primary"
            size="small"
            code="StoreWarehouseManageListAddMapping"
            @click="handleCenterMappingOpen"
          >{{ $t('新增') }}</ody-button>
        </div>
        <div slot="table">
          <el-table :data="centerMappingList" name="centerMappingList265" style="width: 100%">
            <el-table-column :label="$t('拟合仓')" prop="targetWarehouseName" />
            <el-table-column :label="$t('分配模式')">
              <template slot-scope="scope">
                <ody-select2
                  :disabled="isEdit"
                  v-model="scope.row.assignType"
                  :placeholder="$t('请选择')"
                  name="scope_row_assignType"
                  list-key="mappingAssignTypes"
                  @change="handleCenterMappingAssignTypeChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('分配值')">
              <template slot-scope="scope">
                <el-input :disabled="scope.row.assignType == 3" v-model="scope.row.assignValue" name="scope_row_assignValue">
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('启用')">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isAvailable"
                  :active-value="1"
                  :inactive-value="0"
                  :active-text="$t('启用')"
                  name="scope_row_isAvailable"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </ody-list-table-area>
      <product-modal-add-mapping
        v-if="addCenterMapping.visible"
        :config="centerMappingList"
        :merchant-id="merchantId"
        :visible.sync="addCenterMapping.visible"
        @ok="handleCenterMappingAdded"
      />
    </ody-box>
    <ody-box v-if="warehouse.warehouseType === 2">
      <ody-top-title :title="$t('渠道店铺可售数量')" />
      <ody-list-table-area>
        <div slot="btn">
          <ody-button
            name="StoreWarehouseManageListAddStoreMapping_handleStoreMappingOpen"
            type="primary"
            size="small"
            code="StoreWarehouseManageListAddStoreMapping"
            @click="handleStoreMappingOpen"
          >{{ $t('新增') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table :data="storeMappingList" :columns="columns" :can-filter="false" name="storeMappingList019">
            <template slot="assignType" slot-scope="scope">
              <ody-select2
                v-model="scope.row.assignType"
                :placeholder="$t('请选择')"
                name="scope_row_assignType8"
                list-key="mappingAssignTypes"
                @change="handleCenterMappingAssignTypeChange(scope.row)"
              />
            </template>

            <template slot="assignValue" slot-scope="scope">
              <ody-input-number :min="1" :max="999" :disabled="scope.row.assignType === 3" v-model="scope.row.assignValue" name="scope_row_assignValue7">
                <template slot="append">%</template>
              </ody-input-number>
            </template>

            <template slot="alarmValue" slot-scope="scope">
              <ody-input-number :min="1" :max="999" v-model="scope.row.alarmValue" name="scope_row_alarmValue" />
            </template>

            <template slot="isNeedHold" slot-scope="scope">
              <el-checkbox
                v-model="scope.row.isNeedHold"
                :true-label="1"
                :false-label="0"
                name="scope_row_isNeedHold"
                @change="handleIsNeedHoldChange(scope.row)"
              >{{ $t('是') }}</el-checkbox>
            </template>

            <template slot="holdLevel" slot-scope="scope">
              <ody-input-number :min="1" :max="999" :disabled="scope.row.isNeedHold === 0" v-model="scope.row.holdLevel" name="scope_row_holdLevel" />
            </template>

            <template slot="isAvailable" slot-scope="scope">
              <el-switch
                v-model="scope.row.isAvailable"
                :active-value="1"
                :inactive-value="0"
                :active-text="$t('启用')"
                name="scope_row_isAvailable0"
              />
            </template>
          </ody-table>
        </div>
      </ody-list-table-area>
      <product-add-shop-stock-modal
        v-if="addStoreMapping.visible"
        :stock-visible.sync="addStoreMapping.visible"
        :merchant-id="merchantId"
        :shop-ids="shopIds"
        :is-fitting="isFitting"
        @ok="handleStoreMappingAdded"
      />
    </ody-box>
    <ody-fixed>
      <el-button :disabled="!loaded" name="handleMappingBack" size="medium" type="default" @click="handleMappingBack">{{ $t('返回') }}</el-button>
      <ody-button
        :disabled="!loaded"
        name="StoreWarehouseManageListSave_handleMappingSubmit"
        size="medium"
        type="primary"
        code="StoreWarehouseManageListSave"
        @click="handleMappingSubmit"
      >{{ $t('保存') }}</ody-button>
    </ody-fixed>
  </div>
</template>

<script>
import ProductModalAddMapping from '@/components/modal-add-mapping'
import ProductAddShopStockModal from '@/components/addShopStockModal'

export default {
  components: {
    ProductModalAddMapping,
    ProductAddShopStockModal
  },
  data() {
    const {
      warehouseCode,
      warehouseName,
      warehouseType,
      merchantId
    } = this.$route.params

    return {
      loaded: false,
      isFitting: false,
      warehouse: {
        warehouseCode,
        warehouseName,
        warehouseType: +warehouseType
      },
      rules: {
        warehouseCode: [
          {
            required: true,
            message: this.$t('请输入') + ' ' + this.$t('仓库编码'),
            trigger: 'change',
            pattern: /^[0-9a-zA-Z]+$/
          }
        ],
        warehouseName: [
          { required: true, message: this.$t('请输入') + ' ' + this.$t('仓库名称'), trigger: 'change' }
        ],
        warehouseType: [
          { required: true, message: this.$t('请选择') + ' ' + this.$t('仓库类型'), trigger: 'change' }
        ],
        merchantId: [
          { required: true, message: this.$t('请选择') + ' ' + this.$t('商家'), trigger: 'change' }
        ]
      },
      // 中心仓
      addCenterMapping: {
        visible: false
      },
      centerMappingList: [],
      // 门店仓
      addStoreMapping: {
        visible: false
      },
      virtualWarehouseId: '',
      storeMappingList: [],
      merchantId,
      shopIds: [],
      columns: [
        {
          show: true,
          prop: 'storeName',
          label: this.$t('店铺'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          slot: 'assignType',
          label: this.$t('分配模式'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          slot: 'assignValue',
          label: this.$t('分配值'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          slot: 'alarmValue',
          label: this.$t('置零阈值'),
          align: 'center'
        },
        {
          show: true,
          slot: 'isNeedHold',
          label: this.$t('渠道独享'),
          align: 'center'
        },
        {
          show: true,
          slot: 'holdLevel',
          label: this.$t('独占优先级'),
          align: 'center'
        },
        {
          show: true,
          slot: 'isAvailable',
          label: this.$t('操作'),
          align: 'center',
          minWidth: 80
        }
      ]
    }
  },
  async mounted() {
    const { merchantId, warehouseId, warehouseType } = this.$route.params
    // 获取数据

    if (+warehouseType === 2) {
      const {
        data: warehouse
      } = await this.$product.$api.stockApi.getStoreWarehouseById({
        id: warehouseId
      })

      this.warehouse = warehouse

      const { data = [] } = await this.$portal.post(
        `/back-product-web/back/stock/storeWarehouse/listChannels/${warehouse.virtualWarehouseId}.do`,
        {}
      )

      data.forEach(x => {
        if (x.assignValue) {
          x.assignValue = x.assignValue * 100
        }
      })

      this.storeMappingList = data
    } else if (+warehouseType === 1) {
      const { data = [] } = await this.$portal.post(
        `/back-product-web/back/stock/imWarehouseStockMappingRule/listMappings/${merchantId}/${warehouseId}.do`,
        {}
      )

      data.forEach(x => {
        if (x.assignValue) {
          x.assignValue = x.assignValue * 100
        }
      })

      this.centerMappingList = data
    }

    this.loaded = true
  },
  methods: {
    handleIsNeedHoldChange(row) {
      if (row.isNeedHold === 0) {
        row.holdLevel = ''
      }
    },
    handleStoreMappingAdded(val) {
      this.storeMappingList.push(val)
      this.addStoreMapping.visible = false
    },
    handleMappingBack() {
      this.$portal.delActiveView()
    },
    handleCenterMappingAssignTypeChange(row) {
      if (row.assignType === 3) {
        row.assignValue = 100
      }
    },
    handleStoreMappingOpen() {
      this.addStoreMapping.visible = true

      this.shopIds = this.storeMappingList.map(item => {
        return item.storeId
      })
      this.isFitting = false
    },
    handleCenterMappingOpen() {
      this.addCenterMapping.visible = true
    },
    handleCenterMappingAdded(mapping) {
      this.centerMappingList.push(mapping)
      this.addCenterMapping.visible = false
    },
    centerParams() {
      const {
        warehouseId,
        merchantId,
        warehouseName,
        warehouseCode
      } = this.$route.params

      return {
        warehouseMappingList: this.centerMappingList.map(x => {
          return {
            isAvailable: x.isAvailable,
            sourceWarehouseId: x.sourceWarehouseId || warehouseId,
            sourceWarehouseName: x.sourceWarehouseName || warehouseName,
            sourceWarehouseCode: x.sourceWarehouseCode || warehouseCode,
            targetWarehouseId: x.targetWarehouseId,
            targetWarehouseCode: x.targetWarehouseCode,
            targetWarehouseName: x.targetWarehouseName,
            assignType: x.assignType,
            assignValue: x.assignValue,
            merchantId: merchantId,
            id: x.id
          }
        }),
        channelList: []
      }
    },
    storeParams() {
      const { merchantId } = this.$route.params

      return {
        warehouseMappingList: [],
        channelList: this.storeMappingList.map(x => {
          return {
            isAvailable: x.isAvailable,
            merchantId: merchantId,
            storeWarehouseId: this.warehouse.virtualWarehouseId,
            storeId: x.storeId,
            storeName: x.storeName,
            storeCode: x.storeCode,
            channelCode: x.channelCode,
            alarmValue: x.alarmValue,
            assignType: x.assignType,
            assignValue: x.assignValue,
            isNeedHold: x.isNeedHold,
            holdLevel: x.holdLevel,
            id: x.id
          }
        })
      }
    },
    async handleMappingSubmit() {
      const { warehouseType } = this.$route.params
      let params

      // 中心仓
      if (+warehouseType === 1) {
        params = this.centerParams()
      } else if (+warehouseType === 2) {
        params = this.storeParams()
      }

      await this.$portal
        .post(
          `/back-product-web/back/stock/storeWarehouse/saveMappings/${warehouseType}.do`,
          params
        )
        .then(res => {
          this.$message({
            message: this.$t('保存成功'),
            type: 'success'
          })
          this.$portal.delActiveView()
        })
        .catch(ex => {
          this.$message({
            message: ex.message,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-store-warehouse-manage-mapping {
  .form {
    width: 800px;
  }
}
</style>
