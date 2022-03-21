export default {
  queryPromotionList: {
    url: 'back-promotion-web/promotionRead/queryPromotionList.do',
    method: 'post'
  },
  queryChannelMap: {
    url: 'ouser-web/api/channel/queryChannelMap.do',
    method: 'get'
  },
  loadPageConfigMethod: {
    url: 'back-promotion-web/oscRead/loadPageConfig.action',
    method: 'post'
  },
  // 会员类型
  queryMemberTypeList: {
    url: 'back-promotion-web/ouserRead/queryMemberTypeList.action',
    method: 'post'
  },
  loadOscConfigUrl: {
    url: 'back-promotion-web/oscRead/loadOscConfig.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 拼团-查询系列品
  queryPatchGrouponMpChildList: {
    url: `/back-promotion-web/patchGrouponThemeRead/queryPatchGrouponMpChildList.do`,
    method: 'post'
  },
  // 拼团详情页获取活动图片
  queryAttendImagesUrl: {
    url: 'back-promotion-web/patchGrouponThemeRead/queryAttendImages.action',
    method: 'post'
  },
  // 用户有权限管理的商家列表
  queryAuthMerchantPageUrl: {
    url: 'ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  // 拼团-拼团参团团员管理-支付方式
  queryPayPlatformList4Coupon: {
    url: 'back-promotion-web/opayRead/queryPayPlatformList4Coupon.action',
    method: 'post'
  },
  // 拼团-拼团开团管理
  queryGrouponInstList: {
    url: 'back-promotion-web/patchGrouponRead/queryGrouponInstList.do',
    method: 'post'
  },
  // 拼团-拼团参团团员管理
  queryGrouponDetailListPG: {
    url: 'back-promotion-web/patchGrouponRead/queryGrouponDetailListPG.do',
    method: 'post'
  },
  // 复制促销活动
  copyPromotionActivityUrl: {
    url: 'back-promotion-web/promotionActivityWrite/copy.do',
    method: 'post'
  },
  // 删除促销活动
  deletePromotionActivityMethod: {
    url: 'back-promotion-web/promotionActivityWrite/delete.do',
    method: 'post'
  },
  // 当前用户有权限管理的所有的实体组织列表（即门店列表）
  queryAuthStorePageUrl: {
    url: 'ouser-web/api/store/queryStoreOrgPageByAuth.do',
    method: 'post'
  },
  deleteFreeOrderActivityUrl: {
    url: 'back-promotion-web/freeOrderActivityWrite/deleteFreeOrderActivity.do',
    method: 'post'
  },
  lotteryDeleteActivityUrl: {
    url: 'back-promotion-web/lotteryThemeWrite/deleteLotteryActivity.do',
    method: 'post'
  },
  deleteCutThemeUrl: {
    url: 'back-promotion-web/cutPriceWrite/deleteCutTheme.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  getPublicCodeSelect: {
    url: 'back-promotion-web/code/select.do',
    method: 'post'
  },
  // 拼团-保存商品
  delPatchGrouponStockLmt: {
    url: 'back-promotion-web/patchGrouponThemeWrite/delPatchGrouponStockLmt.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 拼团的添加促销商品的保存
  savePatchGrouponStockLmt: {
    url: 'back-promotion-web/patchGrouponThemeWrite/savePatchGrouponStockLmt.do',
    method: 'post'
  },
  saveSelectionProduct: {
    url: 'back-promotion-web/promotionActivityWrite/saveSelectionProduct.do',
    method: 'post'
  },
  queryGiftLevelList: {
    url: 'back-promotion-web/giftRead/queryGiftLevelList.action',
    method: 'post'
  },
  addGiftLevel: {
    url: 'back-promotion-web/giftWrite/addGiftLevel.do',
    method: 'post'
  },
  updateGiftLevels: {
    url: 'back-promotion-web/giftWrite/updateGiftLevels.do',
    method: 'post'
  },
  delGiftLevel: {
    url: 'back-promotion-web/giftWrite/delGiftLevel.do',
    method: 'post'
  },
  getLoadPageConfigCommonOscUrl: {
    url: '/back-promotion-web/oscRead/loadPageConfigCommonOsc.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 拼团-保存图片
  saveAttendImages: {
    url: '/back-promotion-web/patchGrouponThemeWrite/saveAttendImages.do',
    method: 'post'
  },
  queryAttendImages: {
    url: '/back-promotion-web/patchGrouponThemeRead/queryAttendImages.action',
    method: 'post'
  },
  checkGrouponValue: {
    url: 'back-promotion-web/patchGrouponThemeRead/checkGrouponValue.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 拼团第二部获取详情
  queryPatchGrouponThemeDetail: {
    url: '/back-promotion-web/patchGrouponThemeRead/queryPatchGrouponThemeDetail.action',
    method: 'post'
  },
  // 拼团中添加促销商品
  queryOmnichannelProductList: {
    url: '/back-promotion-web/promotionChannelRead/queryOmnichannelProductList.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  loadOscConfig: {
    url: '/back-promotion-web/oscRead/loadOscConfig.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  savePatchGrouponTheme: {
    url: '/back-promotion-web/patchGrouponThemeWrite/savePatchGrouponTheme.do',
    method: 'post'
  },
  deleteMpBatch: {
    url: '/back-promotion-web/promotionActivityWrite/deleteMpBatch.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  patchGrouponThemeAuditNotPass: {
    url: '/back-promotion-web/patchGrouponThemeWrite/patchGrouponThemeAuditNotPass.do',
    method: 'post'
  },
  // 拼团活动提交审核
  patchGrouponThemeAuditPass: {
    url: '/back-promotion-web/patchGrouponThemeWrite/patchGrouponThemeAuditPass.do',
    method: 'post'
  },
  // 拼团活动的提交审核
  patchGrouponThemeSubmitAuditUrl: {
    url: '/back-promotion-web/patchGrouponThemeWrite/patchGrouponThemeSubmitAudit.do',
    method: 'post'
  },
  // 添加促销商品
  querySelectedMpListBatchUrl: {
    url: '/back-promotion-web/patchGrouponThemeRead/querySelectedMpListBatch.do',
    method: 'post'
  },
  getAllCommissionsUrl: {
    url: '/back-promotion-web/agentQuery/queryAllCommissions.action',
    method: 'post'
  },
  // 加载平台是否进行选品设置
  getLoadPlatformSelectionConfigUrl: {
    url: '/back-promotion-web/oscRead/loadPlatformSelectionConfig.action',
    method: 'post'
  },
  getLoadPlatformConfigUrl: {
    url: '/back-promotion-web/oscRead/loadPlatformConfig.action',
    method: 'post'
  },
  queryActivityThemeListUrl: {
    url: '/back-promotion-web/activityTheme/queryActivityThemeList.action',
    method: 'post'
  },
  addPatchGrouponThemeUrl: {
    url: '/back-promotion-web/patchGrouponThemeWrite/addPatchGrouponTheme.do',
    method: 'post'
  },
  // 拼团中上传活动图片
  uploadImg: {
    url: '/back-promotion-web/file/uploadImg.do',
    method: 'post'
  },
  // 编辑查看推荐码详情
  queryReferralCodeActivityDetail: {
    url: '/back-promotion-web/referralCodeRead/queryReferralCodeActivityDetail.action',
    method: 'post'
  },
  // 查询促销详情
  getPromotionDetailUrl: {
    url: '/back-promotion-web/promotionActivityRead/queryPromotionActivityDetail.action',
    method: 'post'
  },
  getAddPromotionUrl: {
    url: '/back-promotion-web/promotionActivityWrite/add.do',
    method: 'post'
  },
  getUpdatePromotionUrl: {
    url: '/back-promotion-web/promotionActivityWrite/update.do',
    method: 'post'
  },
  // 更新优惠券
  updateCouponActivity: {
    url: '/back-promotion-web/couponActivityWrite/updateCouponActivity.do',
    method: 'post'
  },
  // 关闭促销活动
  stopPromotionActivityMethod: {
    url: 'back-promotion-web/promotionActivityWrite/stop.do',
    method: 'post'
  },
  closeFreeOrderActivityUrl: {
    url: 'back-promotion-web/freeOrderActivityWrite/closeFreeOrderActivity.do',
    method: 'post'
  },
  // 关闭抽奖活动
  lotteryCloseActivityUrl: {
    url: 'back-promotion-web/lotteryThemeWrite/closeLotteryActivity.do',
    method: 'post'
  },
  // 关闭砍价活动
  closeCutThemeUrl: {
    url: 'back-promotion-web/cutPriceWrite/closeCutTheme.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  forceToCompleteGroupon: {
    url: '/back-promotion-web/patchGrouponThemeWrite/forceToCompleteGroupon.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  queryPlatformAuthStorePage: {
    url: '/ouser-web/api/store/queryPlatformAuthStorePage.do',
    method: 'post'
  },
  reAddPromotionScope: {
    url: 'back-promotion-web/promotionActivityWrite/reAddPromotionScope.do',
    method: 'post'
  },
  buildFrontPromDesc: {
    url: '/back-promotion-web/frontDesc/buildFrontPromDesc.action',
    method: 'post'
  },
  queryPromotionView: {
    url: '/back-promotion-web/promotionRead/queryPromotionView.do',
    method: 'post'
  },
  appendPromotionMps: {
    url: '/back-promotion-web/promotionActivityWrite/appendPromotionMps.do',
    method: 'post'
  },
  appendCutPriceMp: {
    url: '/back-promotion-web/cutPriceMpWrite/appendCutPriceMp.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  updateReferralCodeWriteShareInfo: {
    url: '/back-promotion-web/referralCodeWrite/updateShareInfo.do',
    method: 'post'
  },
  updateReferralCodeWrite: {
    url: '/back-promotion-web/referralCodeWrite/update.do',
    method: 'post'
  },
  copyCutPriceActivityUrl: {
    url: 'back-promotion-web/cutPriceWrite/copyCutTheme.do',
    method: 'post'
  },
  copyLotteryActivityUrl: {
    url: 'back-promotion-web/lotteryThemeWrite/copyLotteryTheme.do',
    method: 'post'
  },
  // 查询支付渠道
  queryPayChannelUrl: {
    url: 'back-promotion-web/opayRead/queryPayChannel.action',
    method: 'post'
  },
  updatePriceAndLimit: {
    url: 'back-promotion-web/promotionActivityWrite/updatePriceAndLimit.do',
    method: 'post'
  },
  updatePriceAndLimit2: {
    url: 'back-promotion-web/promotionActivityWrite/updatePriceAndLimit2.do',
    method: 'post'
  },
  deleteSelectionProduct: {
    url: 'back-promotion-web/promotionActivityWrite/deleteSelectionProduct.do',
    method: 'post'
  },
  addLevelGifts: {
    url: '/back-promotion-web/giftWrite/addLevelGifts.do',
    method: 'post'
  },
  updateLevelGifts: {
    url: '/back-promotion-web/giftWrite/updateLevelGifts.do',
    method: 'post'
  },
  delLevelGift: {
    url: '/back-promotion-web/giftWrite/delLevelGift.do',
    method: 'post'
  },
  submitLotteryActivity: {
    url: '/back-promotion-web/lotteryThemeWrite/submitLotteryActivity.do',
    method: 'post'
  },
  submitActivity: {
    url: '/back-promotion-web/promotionActivityWrite/submitActivity.do',
    method: 'post'
  },
  verifyActivityNotPass: {
    url: '/back-promotion-web/promotionActivityWrite/verifyActivityNotPass.do',
    method: 'post'
  },
  verifyActivityPass: {
    url: '/back-promotion-web/promotionActivityWrite/verifyActivityPass.do',
    method: 'post'
  },
  cutPriceActivityAuditPass: {
    url: '/back-promotion-web/cutPriceWrite/cutPriceActivityAuditPass.do',
    method: 'post'
  },
  cutPriceActivityAuditNotPass: {
    url: '/back-promotion-web/cutPriceWrite/cutPriceActivityAuditNotPass.do',
    method: 'post'
  },
  freeOrderActivitySubmitAudit: {
    url: '/back-promotion-web/freeOrderActivityWrite/freeOrderActivitySubmitAudit.do',
    method: 'post'
  },
  freeOrderActivityAuditPass: {
    url: '/back-promotion-web/freeOrderActivityWrite/freeOrderActivityAuditPass.do',
    method: 'post'
  },
  freeOrderActivityAuditNotPass: {
    url: '/back-promotion-web/freeOrderActivityWrite/freeOrderActivityAuditNotPass.do',
    method: 'post'
  },
  querySelectedCouponGiftList: {
    url: '/back-promotion-web/giftRead/querySelectedCouponGiftList.do',
    method: 'post'
  },
  querySelectedGiftList: {
    url: '/back-promotion-web/giftRead/querySelectedGiftList.do',
    method: 'post'
  },
  // 选品列表查询
  querySelectionProListMethod: {
    url: 'back-promotion-web/promotionActivityRead/querySelectionProductList.do',
    method: 'post'
  },
  queryCommissionsByIdUrl: {
    url: 'back-promotion-web/agentQuery/queryCommissionProxys.action',
    method: 'post'
  },
  // 加载系列品
  getPromotionChildMpSelectedList: {
    url: 'back-promotion-web/promotionActivityRead/getPromotionChildMpSelectedList.action',
    method: 'post'
  },
  getPromotionCutPriceMpChildList: {
    url: 'back-promotion-web/cutPriceRead/queryCutPriceMpChildList.do',
    method: 'post'
  },
  // 检查是否价格必填项都填了
  promotionPriceCheck: {
    url: 'back-promotion-web/promotionActivityRead/promotionPriceCheck.do',
    method: 'post'
  },
  // 试用活动查询已经申请的数量
  trialApplicedCount: {
    url: 'back-promotion-web/agentQuery/queryCommissionProxys.action',
    method: 'post'
  },
  // 提交审核
  submitActivityUrl: {
    url: 'back-promotion-web/promotionActivityWrite/submitActivity.do',
    method: 'post'
  },
  // 双语i18nActioni18nAction
  getSupportLanguages: {
    url: 'back-promotion-web/listLangs.action',
    method: 'post'
  },
  // 同步商品，互斥进度条处理
  querySynOrDealMutexMpProcesstUrl: {
    url: 'back-promotion-web/promotionActivityRead/querySynOrDealMutexMpProcess.action',
    method: 'post'
  },
  // 查询已选商家
  querySelectedMerchantListUrl: {
    url: '/back-promotion-web/promotionMerchant/listPromMerchant.do',
    method: 'post'
  },
  // 查询所有商家列表
  getMerchantPageListUrl: {
    url: '/ouser-web/api/merchant/getMerchantPage.do',
    method: 'post'
  },
  // 添加商家
  addMerchantListUrl: {
    url: '/back-promotion-web/promotionActivityWrite/addMerchantList.do',
    method: 'post'
  },
  // 券
  // 添加商家
  couponAddMerchantListUrl: {
    url: '/back-promotion-web/couponSelectionWrite/addMerchantList.do',
    method: 'post'
  },
  // 商家报名增加门店
  getAddStoreAttendUrl: {
    url: '/back-promotion-web/supplierEnrollWrite/addMerchantStoreList.do',
    method: 'post'
  },
  // 删除商家
  deleteMerchantListUrl: {
    url: '/back-promotion-web/promotionActivityWrite/deleteMerchantList.do',
    method: 'post'
  },
  // 异步处理互斥，暂用于全场参与的促销
  getDealPromotionMutex: {
    url: '/back-promotion-web/promotionMutexWrite/asynchronousDealMutex.do',
    method: 'post'
  },
  /** 拼团*/
  // 加载平台是否显示活动报名链接设置
  getLoadActivityRegisterConfigUrl: {
    url: '/back-promotion-web/oscRead/loadActivityRegisterConfig.action',
    method: 'post'
  },
  // 拼团列表
  getQueryGrouponActivityListUrl: {
    url: '/back-promotion-web/patchGrouponRead/queryGrouponList.do',
    method: 'post'
  },
  // 复制拼团活动
  getCopyPatchThemeUrl: {
    url: '/back-promotion-web/patchGrouponThemeWrite/copyPatchTheme.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 复制推荐码
  getCopyRecommendUrl: {
    url: '/back-promotion-web/referralCodeWrite/copy.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 删除推荐码列表数据
  getDelRecommendUrl: {
    url: '/back-promotion-web/referralCodeWrite/delete.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 关闭推荐码活动
  getCloseRecommendItemUrl: {
    url: '/back-promotion-web/referralCodeWrite/stop.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 关闭拼团活动
  getClosePatchThemeUrl: {
    url: '/back-promotion-web/patchGrouponThemeWrite/closePatchTheme.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 删除拼团活动
  getDeletePatchThemeUrl: {
    url: '/back-promotion-web/patchGrouponThemeWrite/deletePatchTheme.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 查询已选商家
  querySelectedMerchantUrl: {
    url: 'back-promotion-web/promotionMerchant/listPromMerchant.do',
    method: 'post'
  },
  deletePromotionMpBatchUrl: {
    url: 'back-promotion-web/promotionActivityWrite/deleteMpBatch.do',
    method: 'post'
  },
  getActivityScheduleMpListUrl: {
    url: 'back-promotion-web/promotionActivityRead/getActivityScheduleMpList.action',
    method: 'post'
  },
  // 查询审核列表
  queryPromotionAuditUrl: {
    url: 'back-promotion-web/promotionRead/queryPromotionList.do',
    method: 'post'
  },
  // 查询审核列表
  queryMerchantPromotionAuditUrl: {
    url: 'back-promotion-web/promotionRead/queryMerchantPromotionList.do',
    method: 'post'
  },
  // 查询促销活动报名列表
  queryApplyActivityList: {
    url: 'back-promotion-web/applyActivityRead/queryApplyActivityList.do',
    method: 'post'
  },
  // 查询报名列表详情
  queryAttendRecordList: {
    url: 'back-promotion-web/applyActivityRead/queryAttendRecordList.do',
    method: 'post'
  },
  // 优惠券列表查询
  queryCouponActivityPG: {
    url: 'back-promotion-web/couponActivityRead/queryCouponActivityPG.do',
    method: 'post'
  },
  // 优惠券发券类型
  loadCouponPageConfig: {
    url: 'back-promotion-web/oscRead/loadCouponPageConfig.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 报名记录详情
  queryAttendMpList: {
    url: 'back-promotion-web/applyActivityRead/queryAttendMpList.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  delMerchantList: {
    url: '/back-promotion-web/couponSelectionWrite/delMerchantList.do',
    method: 'post'
  },
  addCouponMerchantList: {
    url: '/back-promotion-web/couponSelectionWrite/addMerchantList.do',
    method: 'post'
  },
  queryLotteryAwards: {
    url: '/back-promotion-web/lotteryAwardsRead/queryLotteryAwards.action',
    method: 'post'
  },
  setAttendMp: {
    url: '/back-promotion-web/applyActivityWrite/setAttendMp.do',
    method: 'post'
  },
  // 查看报名活动
  queryApplyActivityDetail: {
    url: 'back-promotion-web/applyActivityRead/queryApplyActivityDetail.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 创建优惠券类目树
  constructBackTree: {
    url: 'back-promotion-web/categoryRead/constructBackTree.action',
    method: 'post'
  },
  // 保存优惠券
  saveCouponActivity: {
    url: 'back-promotion-web/couponActivityWrite/saveCouponActivity.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 选择品牌
  queryBrandListUrl: {
    url: 'back-promotion-web/merchantProductRead/queryBrandList.do',
    method: 'post'
  },
  queryBrandList: {
    url: 'back-promotion-web/couponSelectionRead/queryBrandList.do',
    method: 'post'
  },
  delSelectionLimit: {
    url: '/back-promotion-web/couponSelectionWrite/delSelectionLimit.do',
    method: 'post'
  },
  saveSelectionLimit: {
    url: 'back-promotion-web/couponSelectionWrite/saveSelectionLimit.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  querySelectedSelectionList: {
    url: 'back-promotion-web/couponSelectionRead/querySelectedSelectionList.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  querySelectedMerchantList: {
    url: 'back-promotion-web/couponSelectionRead/querySelectedMerchantList.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  queryCouponCategoryList: {
    url: 'back-promotion-web/mktUseRule/queryCouponCategoryList.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 完成创建优惠券
  queryCouponDetailById: {
    url: 'back-promotion-web/couponActivityRead/queryCouponDetailById.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 简单的更新，只允许更新优惠券名称，说明，分享描述等。没有活动状态的限制
  simpleUpdateCouponById: {
    url: 'back-promotion-web/couponActivityWrite/simpleUpdateCouponById.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 创建优惠券提交审核
  couponActivitySubmitAudit: {
    url: 'back-promotion-web/couponActivityWrite/couponActivitySubmitAudit.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 优惠券列表查看任务
  querySendCouponTaskList: {
    url: 'back-promotion-web/couponActivityRead/querySendCouponTaskList.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 创建抽奖类活动
  addLotteryTheme: {
    url: 'back-promotion-web/lotteryThemeWrite/addLotteryTheme.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 抽奖类活动类型
  queryLotteryTheme: {
    url: 'back-promotion-web/lotteryThemeRead/queryLotteryTheme.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 提交抽奖创建
  createLotteryAwardsRule: {
    url: 'back-promotion-web/lotteryThemeWrite/createLotteryAwardsRule.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 会员限购列表
  getMemberRestrictionsList: {
    url: 'frontier-trade-web/purchaseRule/back/newList.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 限购规则创建
  createRestrictions: {
    url: 'frontier-trade-web/purchaseRule/back/create.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 编辑限购规则
  editRestrictions: {
    url: 'frontier-trade-web/purchaseRule/back/detail.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 启用限购规则
  enableRestrictions: {
    url: 'frontier-trade-web/purchaseRule/back/enable.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  queryLotteryActivityDetail: {
    url: 'back-promotion-web/lotteryThemeRead/queryLotteryActivityDetail.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 支付优惠
  queryPayChannel: {
    url: '/back-promotion-web/opayRead/queryPayChannel.action',
    method: 'post'
  },
  // 砍价
  addCutPriceActivity: {
    url: '/back-promotion-web/cutPriceWrite/addCutPriceActivity.do',
    method: 'post'
  },
  queryCutPriceDetail: {
    url: '/back-promotion-web/cutPriceRead/queryCutPriceDetail.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  updateRstriction: {
    url: 'frontier-trade-web/purchaseRule/back/update.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  queryCutPriceMpList: {
    url: '/back-promotion-web/cutPriceRead/queryCutPriceMpList.action',
    method: 'post'
  },
  saveCutPriceActivity: {
    url: '/back-promotion-web/cutPriceWrite/saveCutPriceActivity.do',
    method: 'post'
  },
  cutPriceActivitySubmitAudit: {
    url: '/back-promotion-web/cutPriceWrite/cutPriceActivitySubmitAudit.do',
    method: 'post'
  },
  saveCutPriceProduct: {
    url: '/back-promotion-web/cutPriceMpWrite/saveCutPriceProduct.do',
    method: 'post'
  },
  batchDeleteCutPriceMP: {
    url: '/back-promotion-web/cutPriceMpWrite/batchDeleteCutPriceMP.do',
    method: 'post'
  },
  batchCutPriceMPPriceAndLimit: {
    url: '/back-promotion-web/cutPriceMpWrite/batchCutPriceMPPriceAndLimit.do',
    method: 'post'
  },
  checkCutPriceMPPrice: {
    url: '/back-promotion-web/cutPriceRead/checkCutPriceMPPrice.action',
    method: 'post'
  },
  // 生券张数
  generateCoupons: {
    url: '/back-promotion-web/couponActivityWrite/generateCoupons.do',
    method: 'post'
  },
  // 复制优惠券活动
  copyCouponTheme: {
    url: '/back-promotion-web/couponActivityWrite/copyCouponTheme.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 删除优惠券活动
  deleteCouponTheme: {
    url: '/back-promotion-web/couponActivityWrite/deleteCouponTheme.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 关闭优惠券活动
  closeCouponTheme: {
    url: '/back-promotion-web/couponActivityWrite/closeCouponTheme.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 发券
  provideCoupons: {
    url: '/back-promotion-web/couponActivityWrite/provideCoupons.do',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  },
  invalidCoupon: {
    url: '/back-promotion-web/couponWrite/invalidCoupon.do',
    method: 'post'
  },
  // 推荐码-活动列表接口
  queryReferralCodeActivityList: {
    url: 'back-promotion-web/referralCodeRead/queryReferralCodeActivityList.action',
    method: 'post'
  },
  // 推荐码--创建活动列表
  recommendAddUrl: {
    url: 'back-promotion-web/referralCodeWrite/add.do',
    method: 'post'
  },
  // 试用申请管理
  queryAppliced: {
    url: 'social-back-web/trial/appliced',
    method: 'post'
  },
  // 试用申请审核
  verifyAppliced: {
    url: 'social-back-web/trial/verify',
    method: 'post'
  },
  // 试用报告管理
  queryReport: {
    url: 'social-back-web/trial/report',
    method: 'post'
  },
  // 创建推荐码-提交审核接口
  recommendSubmitActivity: {
    url: 'back-promotion-web/referralCodeWrite/submitActivity.do',
    method: 'post'
  },
  // 创建推荐码-审核不通过
  codeVerifyActivityNotPass: {
    url: 'back-promotion-web/referralCodeWrite/verifyActivityNotPass.do',
    method: 'post'
  },
  // 创建推荐码-审核通过
  codeVerifyActivityPass: {
    url: 'back-promotion-web/referralCodeWrite/verifyActivityPass.do',
    method: 'post'
  },
  // 创建优惠券-审核不通过
  couponActivityAuditNotPass: {
    url: 'back-promotion-web/couponActivityWrite/couponActivityAuditNotPass.do',
    method: 'post'
  },
  // 创建优惠券-审核通过
  couponActivityAuditPass: {
    url: 'back-promotion-web/couponActivityWrite/couponActivityAuditPass.do',
    method: 'post'
  },
  // 审核列表审核抽奖类促销
  auditLotteryActivity: {
    url: 'back-promotion-web/lotteryThemeWrite/auditLotteryActivity.do',
    method: 'post'
  },
  // 增加报名活动
  addApplyActivity: {
    url: '/back-promotion-web/applyActivityWrite/addApplyActivity.do',
    method: 'post'
  },
  // 秒杀保存商品
  saveActivityScheduleMp: {
    url: '/back-promotion-web/promotionActivityWrite/saveActivityScheduleMp.do',
    method: 'post'
  },
  // 批量编辑秒杀
  updateActivityScheduleMp: {
    url: '/back-promotion-web/promotionActivityWrite/updateActivityScheduleMp.do',
    method: 'post'
  },
  // 秒杀系列品
  getActivityScheduleChildMpList: {
    url: '/back-promotion-web/promotionActivityRead/getActivityScheduleChildMpList.action',
    method: 'post',
    params: {
      // 'refType': 1,
      // 'refThemeId': '2007090000002038',
      // 'activityScheduleId': 2007090000002040,
      // 'mpId': 2007080000014796
    }
  },
  // 抽奖类链接
  getPromotionLinks: {
    url: '/back-promotion-web/linkRead/getLinks.action',
    method: 'post'
  },
  createOrderAgain: {
    url: '/social-back-web/trial/createOrderAgain',
    method: 'post'
  },
  sendMessageTrial: {
    url: '/social-back-web/trial/sendMessageTrial',
    method: 'post'
  },
  // 查看试用报告
  trialReportDetail: {
    url: '/social-back-web/trial/trialReportDetail',
    method: 'post'
  },
  // 更新试用报告
  trialReportUpdateStatus: {
    url: '/social-back-web/trial/updateStatus',
    method: 'post'
  },
  // 查询大集互斥商品列表（和德升不一致）
  queryMutexList: {
    url: '/back-promotion-web/applyActivityRead/queryMutexList.action',
    method: 'post'
  },
  // 查询互斥商品列表
  queryPromMutexList: {
    url: '/back-promotion-web/applyActivityRead/queryPromMutexList.action',
    method: 'post'
  },
  secondAuditMpNotPass: {
    url: '/back-promotion-web/applyActivityWrite/secondAuditMpNotPass.do',
    method: 'post'
  },
  // 秒杀删除
  delActivityScheduleMp: {
    url: '/back-promotion-web/promotionActivityWrite/delActivityScheduleMp.do',
    method: 'post'
  },
  // 秒杀检验各种价格是否未填
  activityScheduleMpCheck: {
    url: '/back-promotion-web/promotionActivityRead/activityScheduleMpCheck.action',
    method: 'post'
  },
  code_listMulti: {
    url: 'back-promotion-web/public/config/listMulti',
    method: 'post'
  },
  // 报名
  getRegistrationList: {
    url: '/back-promotion-web/supplierEnrollRead/querySupplierEnrollIndex.do',
    method: 'post'
  },
  // 分销商报名表保存
  saveActivityAttendRecord: {
    url: '/back-promotion-web/supplierEnrollWrite/saveBeforeCheckActivityAttendRecord.do',
    method: 'post'
  },
  queryActiveAttendDetail: {
    url: '/back-promotion-web/supplierEnrollRead/queryActiveAttendDetail.action',
    method: 'post'
  },
  // 查询商家所选报名店铺
  queryEnrollSelectedMerchantList: {
    url: '/back-promotion-web/supplierEnrollRead/querySelectedMerchantList.do',
    method: 'post'
  },
  // 商家报名门店删除
  deleteMerchantStoreList: {
    url: '/back-promotion-web/supplierEnrollWrite/deleteMerchantStoreList.do',
    method: 'post'
  },
  // 实时更新
  realTimeSave: {
    url: '/back-promotion-web/supplierEnrollWrite/realTimeSave.do',
    method: 'post'
  },
  // 加载是否配置结算价的配置项
  loadSettlementPriceConfig: {
    url: '/back-promotion-web/oscRead/loadSettlementPriceConfig.action',
    method: 'post'
  },
  // 申请报名
  merchantApplyMPMutexList: {
    url: '/back-promotion-web/supplierEnrollWrite/merchantApplyMPMutexList.do',
    method: 'post'
  },
  // 删除报名商品
  deleteMutexMpList: {
    url: '/back-promotion-web/supplierEnrollWrite/deleteMutexMpList.do',
    method: 'post'
  },
  // 继续提交报名商品
  deleteMutexExistMpList: {
    url: '/back-promotion-web/supplierEnrollWrite/deleteMutexExistMpList.do',
    method: 'post'
  },
  // 删除分销商选品
  deleteMPSelection: {
    url: '/back-promotion-web/supplierEnrollWrite/deleteMPSelection.do',
    method: 'post'
  },
  // 查询子品信息
  getChildMpSelectedList: {
    url: '/back-promotion-web/supplierEnrollRead/getChildMpSelectedList.action',
    method: 'post'
  },
  // 保存分销商选品
  saveRegistrationMPSelection: {
    url: '/back-promotion-web/supplierEnrollWrite/saveMPSelection.do',
    method: 'post'
  },
  // 撤回待设置参数商品
  updateMPStatusSelection: {
    url: '/back-promotion-web/supplierEnrollWrite/updateMPStatusSelection.do',
    method: 'post'
  },
  // 导入待设置参数商品信息
  uploaderCreat: {
    url: '/back-promotion-web/applyActivityUpload/importExcel.do',
    method: 'post'
  },
  listBackCategoryTree: {
    url: '/back-product-web/back/mp/category/listBackCategoryTree.do',
    method: 'post'
  },
  confirmPriceAndLimit: {
    url: '/back-promotion-web/promotionActivityWrite/confirmPriceAndLimit.do',
    method: 'post'
  }
}
