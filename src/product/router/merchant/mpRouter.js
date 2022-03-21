// 商家平台-商品中心
export default {
  path: '/back-product-static/merchant/mp',
  name: 'merchant-product',
  meta: {
    title: '商品中心',
    icon: 'table'
  },
  children: [
    {
      path: 'MerchantProductManage/list',
      name: 'MerchantProductManage',
      component: () => import('@/views/merchant/mp/merchantProductManage/list'),
      meta: { title: '商家商品管理' }
    },
    {
      path: 'merchantProductDispatch',
      name: 'Product_20_03',
      component: () =>
        import('@/views/merchant/mp/merchantProductDispatch/list'),
      meta: { title: '商家商品分发结果查询' }
    },
    {
      path: 'weighProductExport',
      name: 'WeighProductExport',
      component: () => import('@/views/merchant/mp/weighProductExport/list'),
      meta: { title: '称重商品导出' }
    },
    {
      path: 'store-product-list',
      name: 'StoreProductList',
      component: () => import('@/views/merchant/mp/storeProductList'),
      meta: { title: '店铺商品管理' }
    },
    {
      path: 'product/createMerchant',
      name: 'ProductCreateMerchant',
      component: () => import('@/views/merchant/mp/productCreate/merchant'),
      meta: { title: '新增商家商品' }
    },
    {
      path: 'product/detail',
      name: 'ProductDetail',
      component: () => import('@/views/merchant/mp/product'),
      meta: { title: '商品详情' },
      hidden: true
    },
    {
      path: 'product/material/batch/product',
      name: 'ProductMaterialBatchProduct',
      component: () => import('@/views/merchant/mp/productCreate/batch/product'),
      meta: { title: '批量导入商品' },
      hidden: true
    },
    {
      path: 'product/material/batch',
      name: 'ProductMaterialBatch',
      component: () => import('@/views/merchant/mp/productCreate/batch/material'),
      meta: { title: '批量导入原料' },
      hidden: true
    },
    {
      path: 'product/img/batch',
      name: 'ProductImgBatch',
      component: () => import('@/views/merchant/mp/productCreate/batch/img'),
      meta: { title: '批量导入图片' },
      hidden: true
    },
    {
      path: 'product/material/detail',
      name: 'ProductDetailMaterial',
      component: () => import('@/views/merchant/mp/product/material/detail'),
      meta: { title: '原料详情' },
      hidden: true
    },
    {
      path: 'merchant/mp/productTools',
      component: () => import('@/views/merchant/mp/productTools'),
      name: 'ProductTools',
      // redirect: '/back-product-static/product/tools/saleArea',
      meta: { title: '商品工具' },
      children: [
        {
          path: 'saleArea',
          component: () => import('@/views/merchant/mp/productTools/saleArea'),
          name: 'SaleAreaManagement',
          meta: { title: '销售区域设置' }
        }, {
          path: 'bom',
          component: () => import('@/views/merchant/mp/productTools/bom'),
          name: 'BomManagement',
          meta: { title: 'BOM管理' }
        },
        {
          path: 'bom/detail',
          component: () => import('@/views/merchant/mp/productTools/bom/detail'),
          name: 'BomManagementDetail',
          meta: { title: 'BOM详情' },
          hidden: true
        },
        {
          path: 'calcunit',
          component: () => import('@/views/merchant/mp/productTools/calcUnit'),
          name: 'CalcUnit',
          meta: { title: '辅计量单位设置' }
        },
        {
          path: 'calcunit/batch',
          component: () => import('@/views/merchant/mp/productTools/calcUnit/batch'),
          name: 'CalcUnitBatch',
          meta: { title: '辅计量单位导入' },
          hidden: true
        },
        {
          path: 'orderStartNum',
          component: () => import('@/views/merchant/mp/productTools/orderStartNum'),
          name: 'OrderStartNum',
          meta: { title: '起订量设置' }
        },
        {
          path: 'orderStartNum/batch',
          component: () => import('@/views/merchant/mp/productTools/orderStartNum/batch'),
          name: 'OrderStartNumBatch',
          meta: { title: '起订量导入' },
          hidden: true
        }
      ]
    },
    {
      path: 'merchantCategory/list',
      component: () => import('@/views/merchant/mp/merchant-category/list'),
      name: 'MerchantCategoryList',
      meta: { title: '商家类目管理' }
    },
    {
      path: 'merchantCategory/detail',
      component: () => import('@/views/merchant/mp/merchant-category/detail'),
      name: 'MerchantCategoryTreeDetail',
      meta: { title: '商家类目详情' },
      hidden: true
    },
    {
      path: 'priceAudit/merchant',
      component: () => import('@/views/merchant/mp/priceAuditMerchant'),
      name: 'PriceAuditMerchant',
      meta: { title: '商家商品价格变更审核' }
    },
    {
      path: 'priceAudit/store',
      component: () => import('@/views/merchant/mp/priceAuditStore'),
      name: 'PriceAuditStore',
      meta: { title: '店铺商品价格变更审核' }
    },
    {
      path: 'storeCategory/list',
      component: () => import('@/views/merchant/mp/store-category/list'),
      name: 'StoreCategoryList',
      meta: { title: '店铺类目管理' }
    },
    {
      path: 'storeCategory/detail',
      component: () => import('@/views/merchant/mp/store-category/detail'),
      name: 'StoreCategoryTreeDetail',
      meta: { title: '店铺类目详情' },
      hidden: true
    },
    {
      path: 'storeCategory/detail/batch',
      component: () => import('@/views/merchant/mp/store-category/detail/batch'),
      name: 'ProductStoreCategoryMappingBatch',
      meta: { title: '店铺类目批量导入关联' },
      hidden: true
    },
    {
      path: 'merchant-advanced-pricing',
      component: () => import('@/views/merchant/mp/advanced-pricing'),
      name: 'MerchantAdvancedPricing',
      meta: { title: '高级定价' }
    },
    {
      path: 'merchant-advanced-pricing-edit/:id',
      component: () => import('@/views/merchant/mp/advanced-pricing/edit'),
      name: 'MerchantAdvancedPricingEdit',
      hidden: true,
      meta: { title: '编辑高级定价' }
    },
    {
      path: 'importCenter',
      component: () => import('@/views/merchant/mp/importCenter'),
      name: 'ImportCenter',
      meta: { title: '商品上传中心' }
    },
    {
      path: 'materialProductManage/list',
      component: () => import('@/views/merchant/mp/product/material/platform'),
      name: 'PlatformMaterialProduct',
      meta: { title: '运营原料管理' }
    },
    {
      path: 'merchantMaterialProductManage/list',
      component: () => import('@/views/merchant/mp/product/material/merchant'),
      name: 'MerchantMaterialProduct',
      meta: { title: '商家原料管理' }
    },
    {
      path: 'importData/importPrice',
      component: () => import('@/views/merchant/mp/importData/importPrice'),
      name: 'ImportPrice',
      hidden: true,
      meta: { title: '批量改价' }
    },
    {
      path: 'importData/StoreImportData',
      component: () => import('@/views/merchant/mp/importData/storeImportData'),
      name: 'StoreImportData',
      hidden: true,
      meta: { title: '批量修改' }
    },
    {
      path: 'importData/importNoWarehouseProductStock',
      component: () => import('@/views/merchant/mp/importData/importNoWarehouseProductStock'),
      name: 'ImportNoWarehouseProductStock',
      hidden: true,
      meta: { title: '批量改库存' }
    },
    {
      path: 'importData/importStockWarning',
      component: () => import('@/views/merchant/mp/importData/importStockWarning'),
      name: 'ImportstockWarning',
      hidden: true,
      meta: { title: '批量改库存预警' }
    },
    {
      path: 'importData/importLockInventory',
      component: () => import('@/views/merchant/mp/importData/importLockInventory'),
      name: 'ImportLockInventory',
      hidden: true,
      meta: { title: '批量改锁定库存' }
    }
  ]
}
