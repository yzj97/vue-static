// 运营平台-商品中心
export default {
  path: '/back-product-static/platfrom/mp',
  name: 'platform-product',
  meta: {
    title: '商品中心',
    icon: 'table'
  },
  children: [
    {
      path: 'mainData',
      name: 'Product1001',
      redirect: '/back-product-static/platfrom/mp/mainData',
      component: () => import('@/views/platform/mp/mainData/attribute'),
      meta: { title: '商品主数据', icon: 'table' },
      children: [
        {
          path: 'attribute/list',
          component: () => import('@/views/platform/mp/mainData/attribute/list'),
          name: 'Product1002',
          meta: { title: '属性管理' }
        },
        {
          path: 'attribute/batch',
          component: () => import('@/views/platform/mp/mainData/attribute/batch'),
          name: 'ProductAttributeBatch',
          meta: { title: '属性导入' },
          hidden: true
        },
        {
          path: 'attribute/edit',
          component: () => import('@/views/platform/mp/mainData/attribute/edit'),
          name: 'Product1003',
          meta: { title: '属性详情' },
          hidden: true
        },
        {
          path: 'brand/list',
          component: () => import('@/views/platform/mp/mainData/brand/list'),
          name: 'Product1004',
          meta: { title: '品牌管理' }
        },
        {
          path: 'brand/edit',
          component: () => import('@/views/platform/mp/mainData/brand/edit'),
          name: 'Product1005',
          meta: { title: '品牌详情' },
          hidden: true
        },
        {
          path: 'brand/batch',
          component: () => import('@/views/platform/mp/mainData/brand/batch'),
          name: 'BrandBatch',
          meta: { title: '品牌批量导入' },
          hidden: true
        }
      ]
    },
    {
      path: 'merchantProductDispatch',
      name: 'Product1006',
      component: () => import('@/views/platform/mp/merchantProductDispatch/list'),
      meta: { title: '运营商品分发结果查询' }
    },
    {
      path: 'PlatformMerchantProduct/list',
      name: 'PlatformMerchantProduct',
      component: () => import('@/views/merchant/mp/platformMerchantProduct/list'),
      meta: { title: '运营商品管理' }
    },
    {
      path: 'calcunit/list',
      component: () => import('@/views/platform/mp/mainData/calcunit/list'),
      name: 'Product1007',
      meta: { title: '计量单位' }
    },
    {
      path: 'product/createPlatform',
      name: 'ProductCreatePlatform',
      component: () => import('@/views/merchant/mp/productCreate/platform'),
      meta: { title: '新增运营商品' }
    },
    {
      path: 'product/category/list',
      component: () => import('@/views/platform/mp/mainData/category/list'),
      name: 'ProductCategoryList',
      meta: { title: '类目管理' }
    },
    {
      path: 'product/category/front',
      component: () => import('@/views/platform/mp/mainData/category/front'),
      name: 'ProductCategoryFront',
      meta: { title: '前台类目详情' },
      hidden: true
    },
    {
      path: 'product/category/front/batch',
      component: () => import('@/views/platform/mp/mainData/category/front/batch'),
      name: 'ProductFrontCategoryMappingBatch',
      meta: { title: '前台类目批量导入关联' },
      hidden: true
    },
    {
      path: 'product/category/behide',
      component: () => import('@/views/platform/mp/mainData/category/behide'),
      name: 'ProductCategoryBehide',
      meta: { title: '后台类目详情' },
      hidden: true
    },
    {
      path: 'product/category/batch',
      component: () => import('@/views/platform/mp/mainData/category/batch'),
      name: 'ProductCategoryBatch',
      meta: { title: '类目批量导入' },
      hidden: true
    },
    {
      path: 'merchantBrandManage/list',
      component: () => import('@/views/platform/mp/merchantBrandManage/list'),
      name: 'ProductMerchantBrandManage',
      meta: { title: '商家品牌资质管理' }
    },
    {
      path: 'merchantBrandManage/detail/:id',
      component: () => import('@/views/platform/mp/merchantBrandManage/detail'),
      name: 'ProductMerchantBrandListDetail',
      meta: { title: '品牌资质详情', icon: 'table' },
      hidden: true
    },
    {
      path: 'merchantCategory/list',
      component: () => import('@/views/platform/mp/merchantCategory/list'),
      name: 'MerchantCategory',
      meta: { title: '商家类目资质管理' }
    },
    {
      path: 'merchantCategoryDetail/:id',
      component: () => import('@/views/platform/mp/merchantCategory/detail'),
      name: 'MerchantCategoryDetail',
      hidden: true,
      meta: { title: '商家类目资质详情' }
    },
    {
      path: 'product-security',
      component: () => import('@/views/platform/mp/product-security'),
      name: 'ProductProductSecurity',
      meta: { title: '商品保障' }
    },
    {
      path: 'product-security-edit',
      component: () => import('@/views/platform/mp/product-security/edit'),
      name: 'ProductProductSecurityEdit',
      hidden: true,
      meta: { title: '编辑商品保障' }
    },
    {
      path: 'superscript',
      component: () => import('@/views/platform/mp/superscript'),
      name: 'Superscript',
      meta: { title: '商品角标' }
    },
    {
      path: 'superscript/batch',
      component: () => import('@/views/platform/mp/superscript/bind/batch'),
      name: 'SuperscriptBatch',
      meta: { title: '商品角标导入商品' },
      hidden: true
    },
    {
      path: 'superscript-bind',
      component: () => import('@/views/platform/mp/superscript/bind'),
      name: 'SuperscriptBind',
      hidden: true,
      meta: { title: '关联商品' }
    },
    {
      path: 'superscript-edit',
      component: () => import('@/views/platform/mp/superscript/edit'),
      name: 'SuperscriptEdit',
      hidden: true,
      meta: { title: '编辑角标' }
    },
    {
      path: 'superscript-detail',
      component: () => import('@/views/platform/mp/superscript/detail'),
      name: 'SuperscriptDetail',
      hidden: true,
      meta: { title: '角标详情' }
    },
    {
      path: 'product-white-list-audit',
      component: () => import('@/views/platform/mp/product-white-list-audit'),
      name: 'ProductWhiteListAudit',
      meta: { title: '商品审核白名单' }
    }
  ]
}
