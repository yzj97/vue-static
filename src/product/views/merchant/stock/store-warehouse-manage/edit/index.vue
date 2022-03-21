<template>
  <div class="pg-store-warehouse-manage-edit">
    <ody-box>
      <el-form
        ref="warehouse"
        :model="warehouse"
        :rules="rules"
        :disabled="!loaded"
        label-width="240px"
        class="form">
        <el-form-item :label="$t('仓库编码') + ':'" prop="warehouseCode">
          <el-input
            v-model="warehouse.warehouseCode"
            :disabled="isEdit"
            :placeholder="$t('请输入') + $t('仓库编码')"
            name="warehouse_warehouseCode"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('仓库名称') + ':'" prop="warehouseName">
          <el-input
            v-model="warehouse.warehouseName"
            :placeholder="$t('请输入') + $t('仓库名称')"
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
        <el-form-item :label="$t('组织架构')" prop="departmentId">
          <ody-organization-select
            v-if="!isEdit"
            :disabled="isEdit"
            v-model="warehouse.departmentId"
            name="warehouse_departmentId" />
          <el-input
            v-if="isEdit"
            :disabled="isEdit"
            v-model="departmenName"
            name="supplier_basicInfo_orgName"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item :label="$t('外部仓库编码')" prop="outWarehouseCode">
          <el-input
            v-model="warehouse.outWarehouseCode"
            :placeholder="$t('请输入') + $t('外部仓库编码')"
            name="warehouse_outWarehouseCode"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('外部库区编码')" prop="outWarehouseAreaCode">
          <el-input
            v-model="warehouse.outWarehouseAreaCode"
            :placeholder="$t('请输入') + $t('外部库区编码')"
            name="warehouse_outWarehouseAreaCode"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('仓库地址')" prop="area">
          <ody-province-city-region-select v-if="loaded" v-model="warehouse.area" name="warehouse_area" />
        </el-form-item>
        <el-form-item :label="$t('详细地址')" prop="address">
          <el-input
            v-model="warehouse.address"
            :placeholder="$t('请输入')+$t('详细地址')"
            name="warehouse_address"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('负责人')" prop="warehouseContacter">
          <el-input
            v-model="warehouse.warehouseContacter"
            :placeholder="$t('请输入') + $t('负责人')"
            name="warehouse_warehouseContacter"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('联系电话')" prop="warehouseContacterMobile">
          <el-input
            v-model="warehouse.warehouseContacterMobile"
            :placeholder="$t('请输入')+$t('联系电话')"
            name="warehouse_warehouseContacterMobile"
            maxlength="11"
            show-word-limit
            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"/>
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="warehouseRemark">
          <el-input
            v-model="warehouse.warehouseRemark"
            :placeholder="$t('请输入')+$t('备注')"
            name="warehouse_warehouseRemark"
            type="textarea"
            maxlength="150"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('启用WMS管理')" prop="wmsSwitch">
          <ody-radio2
            :disabled="isEdit"
            v-model="warehouse.wmsSwitch"
            name="warehouse_wmsSwitch"
            list-key="wmsSwitch"/>
        </el-form-item>
        <el-form-item v-if="warehouse.warehouseType === 1" :label="$t('覆盖区域')" prop="warehouseCoverageList">
          <ody-button name="StoreWarehouseManageAddCoverage_handleChooseCity" size="mini" code="StoreWarehouseManageAddCoverage" @click="handleChooseCity">+ {{ $t('添加') }}</ody-button>
          {{ $t('已选择') }} {{ warehouse.warehouseCoverageList.length }} {{ $t('个') }}
        </el-form-item>
        <el-form-item v-if="warehouse.warehouseType === 2" :label="$t('手工设置库存同步规则')" prop="syncRule">
          <el-checkbox
            v-model="warehouse.syncRule"
            name="warehouse_syncRule"
            true-label="1"
            false-label="0"/>
          <el-tooltip placement="top">
            <div slot="content">
              1、{{ $t('当不勾选时，此时门店的库存同步逻辑默认按门店仓对应的线上O+O店铺进行库存共享同步') }}
              <br>
              2、{{ $t('当勾选时，需手工设置同步渠道店铺库存规则') }}
            </div>
            <ody-svg-icon icon-class="question" />
          </el-tooltip>
        </el-form-item>
      </el-form>
    </ody-box>
    <ody-fixed>
      <el-button
        :disabled="!loaded"
        name="handleWarehouseBack"
        size="medium"
        type="default"
        @click="handleWarehouseBack">{{ $t('返回') }}</el-button>
      <ody-button
        :disabled="!loaded"
        name="StoreWarehouseManageSave_handleWarehouseSubmit"
        size="medium"
        type="primary"
        code="StoreWarehouseManageSave"
        @click="handleWarehouseSubmit">{{ $t('保存') }}</ody-button>
    </ody-fixed>

    <ody-area-choose
      v-if="warehouseCoverage.visible"
      :visible="warehouseCoverage.visible"
      :set-data="warehouse.warehouseCoverageList"
      @cancel="handleSelectAreaHideDialog"
      @ok="handleSelectAreaConfirm"
    />
  </div>
</template>

<script>
export default {
  name: 'StoreWarehouseManageAdd',
  components: {
  },
  data() {
    const { status } = this.$route.params
    const isView = +status === 2
    const isEdit = +status === 1
    const isAdd = +status === 0

    return {
      departmenName: '',
      isAdd,
      isEdit,
      isView,
      loaded: false,
      warehouse: {
        warehouseCode: null, // 仓库编码
        warehouseName: null, // 仓库名称
        warehouseType: 1, // 仓库类型
        merchantId: null, // 商家
        outWarehouseCode: null, // 外部仓库编码
        outWarehouseAreaCode: null, // 外部库区编码
        area: [], // 仓库地址
        address: null, // 详细地址
        warehouseContacter: null, // 负责人
        warehouseContacterMobile: null, // 联系电话
        warehouseRemark: null, // 备注
        wmsSwitch: 0, // 启用WMS管理
        warehouseCoverageList: [], // 覆盖区域
        syncRule: '0' // 手工设置库存同步规则
      },
      rules: {
        warehouseCode: [
          { required: true, message: this.$t('请输入') + this.$t('仓库编码'), trigger: 'change', pattern: /^[0-9a-zA-Z_-]+$/ }
        ],
        warehouseName: [
          { required: true, message: this.$t('请输入') + this.$t('仓库名称'), trigger: 'change' }
        ],
        warehouseType: [
          { required: true, message: this.$t('请选择') + this.$t('仓库类型'), trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: this.$t('请选择') + this.$t('组织架构'), trigger: 'change' }
        ]
      },
      warehouseCoverage: {
        visible: false
      }
    }
  },
  async mounted() {
    const { id, warehouseType, merchantId } = this.$route.params
    if (this.isEdit) {
      // { data: { warehouseCoverageList = [], ...warehouse } = {}}
      const { data: {
        provinceCode,
        cityCode,
        districtCode,
        ...warehouse
      }
      } = await this.$product.$api.stockApi.getStockDetail(
        JSON.stringify(id)
      )
      // warehouse.warehouseCoverageList = warehouse.warehouseCoverageList || []
      const { data: { id: departmenId }} = await this.$portal.post('/ouser-web/department/getByEntityId.do', { entityId: warehouse.id })
      warehouse.departmentId = departmenId
      const { data: warehouseCoverageList } = await this.$portal.post(`/back-product-web/back/stock/storeWarehouse/listCoveragesByWarehouseId/${id}.do`, {
        warehouseType,
        isAvailable: 1,
        'wmsSwitch': 0,
        merchantId
      })
      warehouse.warehouseCoverageList = warehouseCoverageList.map(x => {
        return {
          code: +x.districtCode,
          ...x
        }
      }) || []

      // console.log('data-warehouseCoverageList', warehouse.warehouseCoverageList)

      warehouse.area = [provinceCode, cityCode, districtCode]

      this.oldWarehouseName = warehouse.warehouseName
      this.warehouse = warehouse
      this._beforeWarehouseCoverageList = JSON.parse(JSON.stringify(this.warehouse.warehouseCoverageList))
      const { data: { name: departmenName }} = await this.$portal.post('/ouser-web/department/getByEntityId.do', { entityId: merchantId })
      this.departmenName = departmenName
    }
    this.loaded = true
  },
  methods: {
    handleChooseCity() {
      this.warehouseCoverage.visible = true
    },
    handleSelectAreaHideDialog() {
      this.warehouseCoverage.visible = false
    },
    handleSelectAreaConfirm(data) {
      this.warehouseCoverage.visible = false
      this.warehouse.warehouseCoverageList = data
    },
    handleWarehouseBack() {
      this.$portal.delActiveView()
    },
    async handleWarehouseSubmit() {
      try {
        const [err] = await this.formValidate('warehouse')

        if (err) {
          return
        }
        // 解构内容
        const { area: [provinceCode, cityCode, districtCode], warehouseCoverageList, flag, ...params } = this.warehouse
        const newWarehouseCoverageList = JSON.parse(JSON.stringify(warehouseCoverageList))
        const countryCode = 100000
        const isAvailable = 1

        if (provinceCode) {
          params.provinceCode = provinceCode
        }

        if (cityCode) {
          params.cityCode = cityCode
        }

        if (districtCode) {
          params.districtCode = districtCode
        }

        params.flag = flag || 0

        // 提交
        if (this.isEdit) {
        // 更新before
          const { id: storeWarehouseId, merchantId } = this.$route.params
          const editWarehouseCoverageList = []
          this._beforeWarehouseCoverageList.forEach(beforeItem => {
            const newIndex = newWarehouseCoverageList.findIndex(x => x.code === beforeItem.code)
            const { provinceCode, cityCode, districtCode, isAvailable, id } = beforeItem

            const pushObj = {
              storeWarehouseId: storeWarehouseId + '',
              merchantId: +merchantId,
              countryCode,
              provinceCode: +provinceCode,
              cityCode: +cityCode,
              districtCode: +districtCode,
              isAvailable,
              id
            }

            if (newIndex === -1) {
              pushObj.isAvailable = 0
            } else {
              newWarehouseCoverageList.splice(newIndex, 1)
            }

            editWarehouseCoverageList.push(pushObj)
          })
          // add新增的
          newWarehouseCoverageList.map(x => {
            const { parentCodeList: [countryCode, provinceCode, cityCode], code: districtCode } = x

            editWarehouseCoverageList.push({
              storeWarehouseId: storeWarehouseId + '',
              merchantId: +merchantId,
              countryCode: +countryCode,
              provinceCode: +provinceCode,
              cityCode: +cityCode,
              districtCode: +districtCode,
              isAvailable
            })
          })

          params.warehouseCoverageList = editWarehouseCoverageList

          this._beforeWarehouseCoverageList = JSON.parse(JSON.stringify(editWarehouseCoverageList))

          params.flag = params.warehouseName === this.oldWarehouseName ? 0 : 1

          // console.log('edit-params', params)
          if (params.warehouseType === 1) { // 中心仓
            await this.$product.$api.stockApi.saveStoreCenterWarehouse(params)
          } else if (params.warehouseType === 2) { // 门店仓
            await this.$product.$api.stockApi.saveStoreStoreWarehouse(params)
          }

          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$portal.delActiveViewAndRefresh()
        } else {
          const addWarehouseCoverageList = []

          newWarehouseCoverageList.forEach(x => {
            const { parentCodeList: [countryCode, provinceCode, cityCode], code: districtCode } = x

            addWarehouseCoverageList.push({
              countryCode: +countryCode,
              provinceCode: +provinceCode,
              cityCode: +cityCode,
              districtCode: +districtCode,
              isAvailable
            })
          })

          params.warehouseCoverageList = addWarehouseCoverageList

          // console.log('add-params', params)
          if (params.warehouseType === 1) { // 中心仓
            await this.$product.$api.stockApi.saveStoreCenterWarehouse(params)
          } else if (params.warehouseType === 2) { // 门店仓
            await this.$product.$api.stockApi.saveStoreStoreWarehouse(params)
          }

          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.$portal.delActiveViewAndRefresh()
        }
      } catch (ex) {
        console.error(ex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-store-warehouse-manage-edit {
  .form {
    width: 800px;
  }
}
</style>
