const baseUrl = 'back-product-web/back/mp'

/**
 * 商品接口
 */
export default {
  /**
   * 品牌
   */
  // 分页查询品牌列表
  listBrand: {
    url: baseUrl + '/brand/listBrand.do',
    method: 'post'
  },
  // 根据id查询品牌
  viewBrandInfoById: {
    url: baseUrl + '/brand/viewBrandInfoById.do',
    method: 'post'
  },
  // 新增品牌
  addBrandInfo: {
    url: baseUrl + '/brand/addBrandInfo.do',
    method: 'post'
  },
  // 更新品牌
  updateBrandInfo: {
    url: baseUrl + '/brand/updateBrandInfo.do',
    method: 'post'
  },
  importBrand: {
    url: baseUrl + '/brand/importData.do',
    method: 'post'
  },
  /**
   * 类目
   */
  // 查询后台类目根节点
  queryBackedRootCategory: {
    url: baseUrl + '/category/queryBackedRootCategory.do',
    method: 'post'
  },
  // 根据parent_id查询类目子节点
  queryCategoryListByParent: {
    url: baseUrl + '/category/queryCategoryListByParent.do',
    method: 'post'
  },
  // 根据parent_id查询商家下已经授权的类目子节点
  queryGrantedCategoryListByParent: {
    url: baseUrl + '/category/queryGrantedCategoryListByParent.do',
    method: 'post'
  },
  // 根据商家id查询该商家下已经授权的类目
  queryGrantedCategoryListByMerchant: {
    url: baseUrl + '/category/queryGrantedCategoryListByMerchant.do',
    method: 'post'
  },
  // 查询所有后台类目
  listBackCategory: {
    url: baseUrl + '/category/listBackCategory.do',
    method: 'post'
  },
  // 根据id获取目录详情
  getCategoryDetail: {
    url: baseUrl + '/category/getCategoryDetail.do',
    method: 'post'
  },
  /**
   * 商品分发结果
   */
  // 商品分发结果分页查询
  queryMerchantProductDispatchByPage: {
    url:
      baseUrl +
      '/merchantProductDispatch/queryMerchantProductDispatchByPage.do',
    method: 'post'
  },
  queryMerchantProductByCode: {
    url: baseUrl + '/merchantProduct/queryMerchantProductByCode.do',
    method: 'post'
  },
  queryMeasurementUnitByMerchantId: {
    url: baseUrl + '/merchantProduct/queryMeasurementUnitByMerchantId.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 组合商品添加SKU分页查询
  listMerchantProductForAddMpCombineByPage: {
    url: baseUrl + '/mpCombine/listMerchantProductForAddMpCombineByPage.do',
    method: 'post'
  },
  // 下载
  asyncEvent: {
    url: baseUrl + '/asyncTask/asyncEvent.do',
    method: 'post'
  },
  // 查询商品
  listMerchantProductByPageOnModal: {
    url: baseUrl + '/merchantProduct/listMerchantProductByPageOnModal.do',
    method: 'post'
  },
  // 查询商品和货号价格
  listProductInfoByPage: {
    url: baseUrl + '/product/listProductInfoByPage.do',
    method: 'post'
  },
  cloneProduct: {
    url: baseUrl + '/product/cloneProduct.do',
    method: 'post'
  },
  /**
   * 属性
   */
  // 查询属性列表
  queryAttributeByPage: {
    url: baseUrl + '/attribute/queryAttributeByPage.do',
    method: 'post'
  },
  // 删除属性
  deleteAttribute: {
    url: baseUrl + '/attribute/deleteAttribute.do',
    method: 'post'
  },
  // 根据id查询属性
  viewAttributeInfoById: {
    url: baseUrl + '/attribute/viewAttributeInfoById.do',
    method: 'post'
  },
  // 新增/更新属性
  addAttributeInfo: {
    url: baseUrl + '/attribute/addAttributeInfo.do',
    method: 'post'
  },
  importAttribute: {
    url: baseUrl + '/attribute/importAttribute.do',
    method: 'post'
  },
  // 获取商品分页数据
  listMpByBrandCategoryPage: {
    url: baseUrl + '/merchantProduct/listMpByBrandCategoryPage.do',
    method: 'post'
  },
  categoryChildList: {
    url: 'back-product-web2/extra/category/listChildrenCategory.do',
    method: 'post'
  },
  categoryList: {
    url: 'back-product-web2/extra/category/listRootCategory.do',
    method: 'post'
  },
  // 新增或更新计量单位
  addOrUpdateCalculationUnit: {
    url: baseUrl + '/calculation/addOrUpdateCalculationUnit.do',
    method: 'post'
  },
  // ------------新增的接口----------------- //
  querySelectedPlatformMpProtectionList: {
    url: baseUrl + '/platform/querySelectedPlatformMpProtectionList.do',
    method: 'post'
  },
  queryMerchantProdSecurityList: {
    url: baseUrl + '/merchantProdSecurity/queryMerchantProdSecurityList.do',
    method: 'post'
  },
  queryCalculationUnitByPage: {
    url: baseUrl + '/calculation/queryCalculationUnitByPage.do',
    method: 'post'
  },
  // 商家品牌资质审核
  updateMerchantBrandStatusByIds: {
    url: baseUrl + '/merchantBrand/updateMerchantBrandStatusByIds.do',
    method: 'post'
  },
  // 根据id查询商家品牌详情
  getMerchantBrandById: {
    url: baseUrl + '/merchantBrand/getMerchantBrandById.do',
    method: 'post'
  },
  getCategoryApplyInfoById: {
    url: baseUrl + '/categoryApply/getCategoryApplyInfoById.do',
    method: 'post'
  },
  getCategoryApplyTree: {
    url: baseUrl + '/categoryApply/getCategoryApplyTree.do',
    method: 'post'
  },
  auditCategoryApply: {
    url: baseUrl + '/categoryApply/auditCategoryApply.do',
    method: 'post'
  },
  listRootCategoryTreeBack: {
    url: baseUrl + '/category/listRootCategoryBack.do',
    method: 'post'
  },
  addRootCategoryTreeBack: {
    url: baseUrl + '/category/addCategoryRoot.do',
    method: 'post'
  },
  addCopyCategory: {
    url: baseUrl + '/category/addCopyCategory.do',
    method: 'post'
  },
  appendCopyCategory: {
    url: baseUrl + '/category/appendCopyCategory.do',
    method: 'post'
  },
  deleteRootCategoryTreeBack: {
    url: baseUrl + '/category/deleteCategoryRoot.do',
    method: 'post'
  },
  listCategoryTree: {
    url: baseUrl + '/category/listCategoryTree.do',
    method: 'post'
  },
  newListCategoryTree: {
    url: baseUrl + '/newCategory/newListCategoryTree.do',
    method: 'post'
  },
  listBackCategoryTree: {
    url: baseUrl + '/category/listBackCategoryTree.do',
    method: 'post'
  },
  addCategoryAttributes: {
    url: baseUrl + '/category/addCategoryAttributes.do',
    method: 'post'
  },
  updateCategoryAttributes: {
    url: baseUrl + '/category/updateCategoryAttributes.do',
    method: 'post'
  },
  // 编辑类目查询类目属性
  listCategoryAttributes: {
    url: baseUrl + '/category/queryCategoryAttribute.do',
    method: 'post'
  },
  deleteCategoryAttribute: {
    url: baseUrl + '/category/deleteCategoryAttribute.do',
    method: 'post'
  },
  updateCategorySortNode: {
    url: baseUrl + '/category/updateCategorySort.do',
    method: 'post'
  },
  addCategoryChild: {
    url: baseUrl + '/category/addCategoryChild.do',
    method: 'post'
  },
  newAddCategoryChild: {
    url: baseUrl + '/newCategory/newAddCategoryChild.do',
    method: 'post'
  },
  updateCategory: {
    url: baseUrl + '/category/updateCategory.do',
    method: 'post'
  },
  newUpdateCategory: {
    url: baseUrl + '/newCategory/newUpdateCategory.do',
    method: 'post'
  },
  listQueryAggregationNode: {
    url: baseUrl + '/category/listQueryAggregationNode.do',
    method: 'post'
  },
  aggregationBatchBackGroundNode: {
    url: baseUrl + '/category/aggregationBatchBackGroundNode.do',
    method: 'post'
  },
  batchDeleteAggreationNode: {
    url: baseUrl + '/category/batchDeleteAggreationNode.do',
    method: 'post'
  },
  saveAggreationMp: {
    url: baseUrl + '/category/saveAggreationMp.do',
    method: 'post'
  },
  batchDelAggregationProduct: {
    url: baseUrl + '/category/batchDelAggregationProduct.do',
    method: 'post'
  },
  importCategory: {
    url: baseUrl + '/category/importCategory.do',
    method: 'post'
  },
  importFrontCategory: {
    url: baseUrl + '/category/importFrontCategory.do',
    method: 'post'
  },
  importMerchantCategory: {
    url: baseUrl + '/category/importMerchantCategory.do',
    method: 'post'
  },
  importStoreCategory: {
    url: baseUrl + '/category/importStoreCategory.do',
    method: 'post'
  },
  importCategoryMapping: {
    url: baseUrl + '/category/importCategoryMapping.do',
    method: 'post'
  },
  importMerchantCategoryMapping: {
    url: baseUrl + '/category/importMerchantCategoryMapping.do',
    method: 'post'
  },
  importPrice: {
    // url: baseUrl + '/product/importPrice',
    url: baseUrl + '/product/redev/redevImportPrice',
    method: 'post'
  },
  importNoWarehouseProductStock: {
    url: baseUrl + '/product/importNoWarehouseProductStock',
    method: 'post'
  },
  redevImportNoWarehouseProductStock: {
    url: baseUrl + '/product/redev/redevImportNoWarehouseProductStock',
    method: 'post'
  },
  redevImportProductStockWarning: {
    url: baseUrl + '/product/redev/redevImportProductStockWarning',
    method: 'post'
  },
  // 计价单位列表
  calculationList: {
    url: baseUrl + '/calculation/listAllCalculationUnit.do',
    method: 'post'
  },
  mpCalcUnitList: {
    url: baseUrl + '/mpCalcUnit/list.do',
    method: 'post'
  },
  listMpCalcUnitByMpIds: {
    url: baseUrl + '/mpCalcUnit/listMpCalcUnitByMpIds.do',
    method: 'post'
  },
  saveOrUpdate: {
    url: baseUrl + '/mpCalcUnit/saveOrUpdate.do',
    method: 'post'
  },
  importCalcUnit: {
    url: baseUrl + '/mpCalcUnit/importData.do',
    method: 'post'
  },
  // 新增编辑商品时查询类目属性
  queryCategoryAttribute: {
    url: baseUrl + '/product/queryCategoryAttribute.do',
    method: 'post'
  },
  // 新增/保存商品
  saveOrUpdateProductInfo: {
    url: baseUrl + '/product/saveOrUpdateProductInfo.do',
    method: 'post'
  },
  // 新新增/保存商品
  newSaveOrUpdateProductInfo: {
    url: baseUrl + '/newProduct/newSaveOrUpdateProductInfo.do',
    method: 'post'
  },
  // 获取商品详情
  getProductDetail: {
    url: baseUrl + '/product/getProductDetail.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  updateMerchantProductNameById: {
    url: baseUrl + '/product/updateMerchantProductNameById.do',
    method: 'post'
  },
  platformMerchantProductDispatch: {
    url: baseUrl + '/product/platformMerchantProductDispatch.do',
    method: 'post'
  },
  queryMerchantProductPriceInfo: {
    url: baseUrl + '/merchantProductPrice/queryMerchantProductPriceInfo.do',
    method: 'post'
  },
  batchUpdateMerchantProductPriceById: {
    url: baseUrl + '/merchantProductPrice/batchUpdatePriceById.do',
    method: 'post'
  },
  batchUpdatePlatformProductPriceById: {
    url: baseUrl + '/platformMpPrice/batchUpdatePriceById.do',
    method: 'post'
  },
  listMerchantCategory: {
    url: baseUrl + '/category/listMerchantCategory.do',
    method: 'post'
  },
  listStoreCategory: {
    url: baseUrl + '/category/listStoreCategory.do',
    method: 'post'
  },
  updateMerchantProductSaleArea: {
    url: baseUrl + '/merchantProductSaleArea/updateMerchantProductSaleArea.do',
    method: 'post'
  },
  orderStartNumList: {
    url: baseUrl + '/orderStartNum/list.do',
    method: 'post'
  },
  orderStartNumSave: {
    url: baseUrl + '/orderStartNum/save.do',
    method: 'post'
  },
  orderStartNumUpdate: {
    url: baseUrl + '/orderStartNum/update.do',
    method: 'post'
  },
  importOrderStartNum: {
    url: baseUrl + '/orderStartNum/importData.do',
    method: 'post'
  },
  queryPlatformMpProtectionPage: {
    url: baseUrl + '/platform/queryPlatformMpProtectionPage.do',
    method: 'post'
  },
  queryPlatformMpProtectionById: {
    url: baseUrl + '/platform/queryPlatformMpProtectionById.do',
    method: 'post'
  },
  platformMpProtectionEdit: {
    url: baseUrl + '/platform/platformMpProtectionEdit.do',
    method: 'post'
  },
  deletePlatformMpProtectionById: {
    url: baseUrl + '/platform/deletePlatformMpProtectionById.do',
    method: 'post'
  },
  queryMerchantProdSecurityPage: {
    url: baseUrl + '/merchantProdSecurity/queryMerchantProdSecurityPage.do',
    method: 'post'
  },
  merchantProdSecurityEdit: {
    url: baseUrl + '/merchantProdSecurity/merchantProdSecurityEdit.do',
    method: 'post'
  },
  deleteMerchantProdSecurityById: {
    url: baseUrl + '/merchantProdSecurity/deleteMerchantProdSecurityById.do',
    method: 'post'
  },
  queryMerchantProdSecurityById: {
    url: baseUrl + '/merchantProdSecurity/queryMerchantProdSecurityById.do',
    method: 'post'
  },
  listSuperscriptByPage: {
    url: baseUrl + '/superscript/listSuperscriptByPage.do',
    method: 'post'
  },
  countIntervalTypes: {
    url: baseUrl + '/superscript/countIntervalTypes.do',
    method: 'post'
  },
  getSuperscriptById: {
    url: baseUrl + '/superscript/getSuperscriptById.do',
    method: 'post'
  },
  saveSuperscriptWithTx: {
    url: baseUrl + '/superscript/saveSuperscriptWithTx.do',
    method: 'post'
  },
  deleteSuperscriptById: {
    url: baseUrl + '/superscript/deleteSuperscriptById.do',
    method: 'post'
  },
  getAggregationMpByParam: {
    url: baseUrl + '/superscript/getAggregationMpByParam.do',
    method: 'post'
  },
  saveAggreationMpWithTx: {
    url: baseUrl + '/superscript/saveAggreationMpWithTx.do',
    method: 'post'
  },
  batchDeleteAggregationMp: {
    url: baseUrl + '/superscript/batchDeleteAggregationMp.do',
    method: 'post'
  },
  importAggreationMp: {
    url: baseUrl + '/superscript/importAggreationMp.do',
    method: 'post'
  },
  bom_listPage: {
    url: baseUrl + '/mpBom/listPage.do',
    method: 'post'
  },
  bom_getById: {
    url: baseUrl + '/mpBom/getById.do',
    method: 'get'
  },
  bom_add: {
    url: baseUrl + '/mpBom/add.do',
    method: 'post'
  },
  bom_update: {
    url: baseUrl + '/mpBom/update.do',
    method: 'post'
  },
  bom_listBomProductForPage: {
    url: baseUrl + '/mpBom/listBomProductForPage.do',
    method: 'post'
  },
  bom_listBomItemProductForPage: {
    url: baseUrl + '/mpBom/listBomItemProductForPage.do',
    method: 'post'
  },
  bom_existBomCode: {
    url: baseUrl + '/mpBom/existBomCode.do'
  },
  // 判断用户运营平台是否下发商品
  listPlatformDispatchByUserId: {
    url: baseUrl + '/merchantProductDispatch/listPlatformDispatchByUserId.do',
    method: 'post'
  },
  // 判断用户商家平台是否下发商品
  listMerchantDispatchByUserId: {
    url: baseUrl + '/merchantProductDispatch/listMerchantDispatchByUserId.do',
    method: 'post'
  },
  exportStoreWeighMp: {
    url: baseUrl + '/weighMerchantProduct/exportStoreWeighMp.do',
    method: 'post'
  },
  listStoreWeighMp: {
    url: baseUrl + '/weighMerchantProduct/listStoreWeighMp.do',
    method: 'post'
  },
  merchantProductDispatch: {
    url: baseUrl + '/product/merchantProductDispatch.do',
    method: 'post'
  },
  submitMerchantProduct: {
    url: baseUrl + '/product/submitMerchantProduct.do',
    method: 'post'
  },
  cancelSubmitMerchantProduct: {
    url: baseUrl + '/product/cancelSubmitMerchantProduct.do',
    method: 'post'
  },
  auditMerchantProduct: {
    url: baseUrl + '/product/auditMerchantProduct.do',
    method: 'post'
  },
  merchantProductCanSale: {
    url: baseUrl + '/product/merchantProductCanSale.do',
    method: 'post'
  },
  storeMpCanSaleByMpInfo: {
    url: baseUrl + '/product/storeMpCanSaleByMpInfo.do',
    method: 'post'
  },
  storeMpCanSale: {
    url: baseUrl + '/product/storeMpCanSale.do',
    method: 'post'
  },
  redevStoreMpCanSale: {
    url: baseUrl + '/newProduct/storeMpCanSaleRedev.do',
    method: 'post'
  },
  platformOperateStoreMpShelve: {
    url: baseUrl + '/product/platformOperateStoreMpShelve.do',
    method: 'post'
  },
  updateStoreMpFreightTemplate: {
    url: baseUrl + '/product/updateStoreMpFreightTemplate.do',
    method: 'post'
  },
  updateStoreMpOperateZone: {
    url: baseUrl + '/product/updateStoreMpOperateZone.do',
    method: 'post'
  },
  updateStoreMpStock: {
    url: baseUrl + '/product/updateStoreMpStock.do',
    method: 'post'
  },
  updatePlatformMpNameById: {
    url: baseUrl + '/product/updatePlatformMpNameById.do',
    method: 'post'
  },
  queryFreightTemplateListByMerchantId: {
    url: baseUrl + '/freightTemplate/queryFreightTemplateListByMerchantId.do',
    method: 'post'
  },
  listStoreProductStockById: {
    url: baseUrl + '/product/listStoreProductStockById.do',
    method: 'post'
  },
  platformOperateStoreMpUnShelve: {
    url: baseUrl + '/product/platformOperateStoreMpUnShelve.do',
    method: 'post'
  },
  countCategoryApplyByStatus: {
    url: baseUrl + '/categoryApply/countCategoryApplyByStatus.do',
    method: 'post'
  },
  countCategoryAuditByStatus: {
    url: baseUrl + '/categoryApply/countCategoryAuditByStatus.do',
    method: 'post'
  },
  countBrandAuditByStatus: {
    url: baseUrl + '/merchantBrand/countBrandAuditByStatus.do',
    method: 'post'
  },
  countMerchantProductStatus: {
    url: baseUrl + '/product/countMerchantProductStatus.do',
    method: 'post'
  },
  exportMpTemplate: {
    url: baseUrl + '/batchCreateProduct/exportMpTemplate.do',
    method: 'post'
  },
  // 分组获取商家价格审核列表状态的数量
  getWhiteList: {
    url: baseUrl + '/merchantProductAuditWhite/getWhiteList.do',
    method: 'post'
  },
  // 分组获取商家价格审核列表状态的数量
  deleteWhite: {
    url: baseUrl + '/merchantProductAuditWhite/deleteWhite.do',
    method: 'post'
  },
  // 分组获取商家价格审核列表状态的数量
  addWhite: {
    url: baseUrl + '/merchantProductAuditWhite/addWhite.do',
    method: 'post'
  },
  countMaterialProductStatus: {
    url: baseUrl + '/product/countMaterialProductStatus.do',
    method: 'post'
  },
  redevImportLockProductStock: {
    url: baseUrl + '/product/redev/redevImportLockProductStock',
    method: 'post'
  },
  listStoreProductStockByIdNew: {
    url: baseUrl + '/product/listStoreProductStockByIdNew.do',
    method: 'post'
  },
  updateStoreMpStockNew: {
    url: baseUrl + '/product/updateStoreMpStockNew.do',
    method: 'post'
  }

}
