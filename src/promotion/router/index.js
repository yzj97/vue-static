export default {
  path: '/back-promotion-web',
  redirect: '/back-promotion-web/promotion-list-type',
  name: 'BackPromotionWeb',
  meta: {
    title: '营销中心',
    icon: 'table'
  },
  // TODO 路由title国际化
  children: [
    // {
    //   path: 'promotion/promotion-list-type/:type',
    //   hidden: true,
    //   name: '促销',
    //   meta: {
    //     title: view => {
    //       // 用来给面包屑和tabsView显示的动态名称
    //       const promotionTitleMap = new Map([
    //         ['1', '单一促销'],
    //         ['2', '满额促销'],
    //         ['3', '满量促销'],
    //         ['4', '赠送类促销'],
    //         ['11', '换购'],
    //         ['10', '组合促销'],
    //         ['18', '单品X件优惠'],
    //         ['15', '套餐'],
    //         ['14', '秒杀'],
    //         ['13', '预售'],
    //         ['9', '包邮促销'],
    //         ['5001', '抽奖类促销'],
    //         ['3001', '砍价'],
    //         ['12', '支付优惠'],
    //         ['16', '试用']
    //       ])
    //       return `${promotionTitleMap.get(view.params.type)}`
    //     }
    //   },
    //   component: () =>
    //     import('@/views/promotion/promotion-list-type/promotion-list-type')
    // },
    {
      path: 'promotion/promotion-audit-list',
      component: () => import('@/views/promotion/promotion-audit-list'),
      name: 'PromPromotionAuditList',
      meta: { title: '营销活动查询' }
    },
    {
      path: 'promotion/promotion-audit-list/list',
      component: () => import('@/views/promotion/promotion-audit-list/list'),
      name: 'PromPromotionAuditListList',
      meta: { title: '审核列表' }
    },
    {
      path: 'promotion/single-promotion/list',
      component: () => import('@/views/promotion/single-promotion/list/index'),
      name: 'PromSinglePromotion',
      meta: { title: '单一促销' }
    },
    {
      path: 'promotion/single-promotion/append/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/single-promotion/append/index'),
      name: 'PromSinglePromotionAppend',
      hidden: true,
      meta: { title: '单一促销活动追加商品' }
    },
    {
      path: 'promotion/single-promotion/edit/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/single-promotion/edit/index'),
      name: 'PromSinglePromotionEdit',
      hidden: true,
      meta: { title: '编辑单一促销活动' }
    },
    {
      path: 'promotion/single-promotion/create/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/single-promotion/create/index'),
      name: 'PromSinglePromotionCreate',
      hidden: true,
      meta: { title: '创建单一促销活动' }
    },
    {
      path: 'promotion/single-promotion/detail/:promotionType?/:promotionId',
      component: () => import('@/views/promotion/single-promotion/detail/index'),
      name: 'PromSinglePromotionDetail',
      hidden: true,
      meta: { title: '促销活动详情' }
    },
    {
      path: 'promotion/gift-promotion/list',
      name: 'PromGiftPromotion',
      component: () => import('@/views/promotion/gift-promotion/list'),
      meta: { title: '赠送类促销' }
    },
    {
      path: 'promotion/gift-promotion/append/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/gift-promotion/append/index'),
      name: 'PromGiftPromotionAppend',
      meta: { title: '赠送促销活动追加商品' },
      hidden: true
    },
    {
      path: 'promotion/gift-promotion/create/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/gift-promotion/create/index'),
      name: 'PromGiftPromotionCreate',
      meta: { title: '创建赠送促销活动' },
      hidden: true
    },
    {
      path: 'promotion/gift-promotion/edit/:promotionType/:promotionId',
      component: () => import('@/views/promotion/gift-promotion/edit/index'),
      name: 'PromGiftPromotionEdit',
      meta: { title: '编辑赠送促销活动' },
      hidden: true
    },
    {
      path: 'promotion/gift-promotion/detail/:promotionType?/:promotionId',
      component: () => import('@/views/promotion/gift-promotion/detail/index'),
      name: 'PromGiftPromotionDetail',
      hidden: true,
      meta: { title: '赠送类详情' }
    },
    {
      path: 'promotion/full-promotion/list',
      name: 'PromFullVolumePromotion',
      component: () =>
        import(
          '@/views/promotion/full-promotion/list'
        ),
      meta: { title: '满额促销' }
    },
    {
      path: 'promotion/fullPromotion/create/:promotionType?/:promotionId?',
      component: () =>
        import(
          '@/views/promotion/full-promotion/create'
        ),
      name: 'PromFullPromotionCreate',
      meta: { title: '创建满额促销活动' },
      hidden: true
    },
    {
      path: 'promotion/fullPromotion/edit/:promotionType?/:promotionId?',
      component: () =>
        import(
          '@/views/promotion/full-promotion/edit'
        ),
      name: 'PromFullPromotionEdit',
      meta: { title: '编辑满额促销活动' },
      hidden: true
    },
    {
      path: 'promotion/full-promotion-append/:promotionType?/:promotionId?',
      component: () => import('@/views/promotion/full-promotion/append'),
      name: 'PromFullPromotionAppend',
      hidden: true,
      meta: { title: '满额促销活动追加商品' }
    },
    {
      path: 'promotion/full-promotion/detail/:promotionType?/:promotionId?',
      component: () => import('@/views/promotion/full-promotion/detail/index'),
      name: 'PromFullPromotionDetail',
      hidden: true,
      meta: { title: '满额促销活动详情' }
    },
    {
      path: 'promotion/full-num-promotion/list',
      name: 'PromFullSalesPromotion',
      component: () =>
        import(
          '@/views/promotion/full-num-promotion/list'
        ),
      meta: { title: '满量促销' }
    },
    {
      path: 'promotion/fullNumPromotion/create/:promotionType?/:promotionId?',
      component: () =>
        import(
          '@/views/promotion/full-num-promotion/create'
        ),
      name: 'PromFullNumPromotionCreate',
      meta: { title: '创建满量促销活动' },
      hidden: true
    },
    {
      path: 'promotion/fullNumPromotion/edit/:promotionType?/:promotionId',
      component: () =>
        import(
          '@/views/promotion/full-num-promotion/edit'
        ),
      name: 'PromFullNumPromotionEdit',
      meta: { title: '编辑满量促销活动' },
      hidden: true
    },
    {
      path: 'promotion/full-num-promotion/:promotionType?/:promotionId?',
      component: () => import('@/views/promotion/full-num-promotion/append'),
      name: 'PromFullNumPromotionAppend',
      hidden: true,
      meta: { title: '满量促销追加商品' }
    },
    {
      path: 'promotion/full-num-promotion/detail/:promotionType?/:promotionId?',
      component: () => import('@/views/promotion/full-num-promotion/detail'),
      name: 'PromFullNumPromotionDetail',
      hidden: true,
      meta: { title: '满量促销活动详情' }
    },
    {
      path: 'promotion/repurchase/list',
      name: 'PromRedemption',
      component: () => import('@/views/promotion/repurchase/list'),
      meta: { title: '换购' }
    },
    {
      path: 'promotion/repurchase/append/:promotionType?/:promotionId',
      component: () => import('@/views/promotion/repurchase/append'),
      name: 'PromRepurchasePromotionAppend',
      hidden: true,
      meta: { title: '换购促销活动追加商品' }
    },
    {
      path: 'promotion/repurchase/detail/:promotionType?/:promotionId',
      component: () => import('@/views/promotion/repurchase/detail'),
      name: 'PromRepurchasePromotionDetail',
      hidden: true,
      meta: { title: '换购详情' }
    },
    {
      path: 'promotion/repurchase/edit/:promotionType/:promotionId',
      component: () => import('@/views/promotion/repurchase/edit/index'),
      name: 'PromRepurchasePromotionEdit',
      hidden: true,
      meta: { title: '编辑换购促销活动' }
    },
    {
      path: 'promotion/repurchase/create/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/repurchase/create/index'),
      name: 'PromRepurchasePromotionCreate',
      hidden: true,
      meta: { title: '创建换购促销活动' }
    },
    {
      path: 'promotion/compose/list',
      name: 'PromCombinationPromotion',
      component: () => import('@/views/promotion/compose/list'),
      meta: { title: '组合促销' }
    },
    {
      path: 'promotion/compose/append/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/compose/append/index'),
      name: 'ProComposePromotionAppend',
      hidden: true,
      meta: { title: '组合促销活动添加商品' }
    },
    {
      path: 'promotion/compose/edit/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/compose/edit/index'),
      name: 'ProComposePromotionEdit',
      hidden: true,
      meta: { title: '编辑组合促销活动' }
    },
    {
      path: 'promotion/compose/create/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/compose/create/index'),
      name: 'ProComposePromotionCreate',
      hidden: true,
      meta: { title: '创建组合促销活动' }
    },
    {
      path: 'promotion/compose/detail/:promotionId',
      component: () => import('@/views/promotion/compose/detail'),
      name: 'ProComposePromotionDetail',
      hidden: true,
      meta: { title: '查看组合促销活动' }
    },
    {
      path: 'promotion/package-promotion/list',
      name: 'PromPackage',
      component: () => import('@/views/promotion/package-promotion/list'),
      meta: { title: '套餐' }
    },
    {
      path: 'promotion/package-promotion/create/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/package-promotion/create'),
      name: 'PromPackagePromotionCreate',
      hidden: true,
      meta: { title: '创建套餐活动' }
    },
    {
      path: 'promotion/package-promotion/edit/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/package-promotion/edit'),
      name: 'PromPackagePromotionEdit',
      hidden: true,
      meta: { title: '编辑套餐活动' }
    },
    {
      path: 'promotion/package-promotion/detail/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/package-promotion/detail'),
      name: 'PromPackagePromotionDetail',
      hidden: true,
      meta: { title: '套餐活动详情' }
    },
    {
      path: 'promotion/spike-activity/',
      name: 'PromSpike',
      component: () => import('@/views/promotion/spike-activity/list'),
      meta: { title: '秒杀' }
    },
    {
      path: 'promotion/spike-activity/create/:promotionId?',
      component: () => import('@/views/promotion/spike-activity/create'),
      name: 'PromSpikeActivityCreate',
      hidden: true,
      meta: { title: '创建秒杀促销活动' }
    },
    {
      path: 'promotion/spike-activity/edit/:promotionId?',
      component: () => import('@/views/promotion/spike-activity/edit'),
      name: 'PromSpikeActivityEdit',
      hidden: true,
      meta: { title: '编辑秒杀促销活动' }
    },
    {
      path: 'promotion/spike-activity/detail/:promotionId?',
      component: () => import('@/views/promotion/spike-activity/detail'),
      name: 'PromSpikeActivityDetail',
      hidden: true,
      meta: { title: '秒杀活动详情' }
    },
    {
      path: 'promotion/spike-activity-append/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/spike-activity/append'),
      name: 'PromSpikeActivityAppend',
      hidden: true,
      meta: { title: '秒杀活动追加商品' }
    },
    {
      path: 'promotion/promotion-pre-sale/list',
      name: 'PromPresale',
      component: () => import('@/views/promotion/promotion-pre-sale/list'),
      meta: { title: '预售' }
    },
    {
      path: 'promotion/promotion-pre-sale/create/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/promotion-pre-sale/create/index'),
      name: 'PromPreSaleCreate',
      hidden: true,
      meta: { title: '创建预售促销活动' }
    },
    {
      path: 'promotion/promotion-pre-sale/edit/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/promotion-pre-sale/edit/index'),
      name: 'PromPreSaleEdit',
      hidden: true,
      meta: { title: '编辑预售促销活动' }
    },
    {
      path: 'promotion/promotion-pre-sale/detail/:promotionId/:promotionType?',
      component: () => import('@/views/promotion/promotion-pre-sale/detail/index'),
      name: 'PromPreSaleDetail',
      hidden: true,
      meta: { title: '预售促销活动详情' }
    },
    {
      path: 'promotion/free-promotion/list',
      name: 'PromShippingPromotion',
      component: () => import('@/views/promotion/free-promotion/list'),
      meta: { title: '包邮促销' }
    },
    {
      path: 'promotion/free-promotion/append/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/free-promotion/append/index'),
      name: 'PromFreeShippingActivityAppend',
      hidden: true,
      meta: { title: '包邮促销活动追加商品' }
    },
    {
      path: 'promotion/free-promotion/create/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/free-promotion/create/index'),
      name: 'PromFreeShippingActivityCreate',
      hidden: true,
      meta: { title: '创建包邮促销活动' }
    },
    {
      path: 'promotion/free-promotion/edit/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/free-promotion/edit/index'),
      name: 'PromFreeShippingActivityEdit',
      hidden: true,
      meta: { title: '编辑包邮促销活动' }
    },
    {
      path: 'promotion/free-promotion/detail/:promotionId',
      component: () => import('@/views/promotion/free-promotion/detail/index'),
      name: 'PromFreePromotionDetail',
      hidden: true,
      meta: { title: '促销活动详情' }
    },
    {
      path: 'promotion/lottery-activity/list',
      name: 'PromLotteryPromotion',
      component: () =>
        import(
          '@/views/promotion/lottery-activity/list'
        ),
      meta: { title: '抽奖类促销' }
    },
    {
      path: 'promotion/lottery-activity/detail/:promotionId',
      component: () =>
        import(
          '@/views/promotion/lottery-activity/detail/index'
        ),
      name: 'PromLotteryActivityDetail',
      meta: { title: '抽奖类促销活动详情' },
      hidden: true
    },
    {
      path: 'promotion/lottery-activity/create/:promotionType/:promotionId?',
      component: () =>
        import(
          '@/views/promotion/lottery-activity/create'
        ),
      name: 'PromLotteryActivityCreate',
      meta: { title: '创建抽奖类促销活动' },
      hidden: true
    },
    {
      path: 'promotion/lottery-activity/edit/:promotionId',
      component: () =>
        import(
          '@/views/promotion/lottery-activity/edit/index'
        ),
      name: 'PromLotteryActivityEdit',
      meta: { title: '编辑抽奖类促销活动' },
      hidden: true
    },
    {
      path: 'promotion/lottery-activity/intervene/:promotionId',
      component: () =>
        import(
          '@/views/promotion/lottery-activity/intervene'
        ),
      name: 'PromLotteryActivityIntervene',
      meta: { title: '抽奖干预' },
      hidden: true
    },
    {
      path: 'promotion/bargain/list',
      name: 'PromCutPrice',
      component: () => import('@/views/promotion/bargain/list'),
      meta: { title: '砍价' }
    },
    {
      path: 'promotion/bargain/edit/:promotionType/:promotionId',
      component: () => import('@/views/promotion/bargain/edit/index'),
      name: 'PromBargainPromotionEdit',
      hidden: true,
      meta: { title: '编辑砍价促销活动' }
    },
    {
      path: 'promotion/bargain/append/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/bargain/append/index'),
      name: 'PromBargainPromotionAppend',
      hidden: true,
      meta: { title: '砍价活动追加商品' }
    },
    {
      path: 'promotion/bargain/create/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/bargain/create/index'),
      name: 'PromBargainPromotionCreate',
      hidden: true,
      meta: { title: '创建砍价促销活动' }
    },
    {
      path: 'promotion/bargain/detail/:promotionType?/:promotionId',
      component: () => import('@/views/promotion/bargain/detail'),
      name: 'PromBargainPromotionDetail',
      hidden: true,
      meta: { title: '砍价活动详情' }
    },
    {
      path: 'promotion/payment-preferences/list',
      name: 'PromPaymentOffer',
      component: () => import('@/views/promotion/payment-preferences/list'),
      meta: { title: '支付优惠' }
    },
    {
      path: 'promotion/payment-preferences/edit/:promotionType/:promotionId',
      component: () => import('@/views/promotion/payment-preferences/edit/index'),
      name: 'ProPaymentPreferencesEdit',
      hidden: true,
      meta: { title: '编辑支付优惠活动' }
    },
    {
      path: 'promotion/payment-preferences/create/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/payment-preferences/create/index'),
      name: 'ProPaymentPreferencesCreate',
      hidden: true,
      meta: { title: '创建支付优惠活动' }
    },
    {
      path: 'promotion/payment-preferences/detail/:promotionType/:promotionId?',
      component: () => import('@/views/promotion/payment-preferences/detail/index'),
      name: 'PromPaymentPreferencesDetail',
      hidden: true,
      meta: { title: '支付优惠详情' }
    },
    {
      path: 'promotion/member-restrictions/list',
      component: () => import('@/views/promotion/member-restrictions/list'),
      name: 'PromMemberRestrictions',
      meta: { title: '会员限购' }
    },
    {
      path: 'promotion/member-restrictions/create/:promotionId?',
      component: () => import('@/views/promotion/member-restrictions/create'),
      name: 'PromMemberRestrictionsCreate',
      meta: { title: '创建限购规则' },
      hidden: true
    },
    {
      path: 'promotion/member-restrictions/edit/:promotionId?',
      component: () => import('@/views/promotion/member-restrictions/edit'),
      name: 'PromMemberRestrictionsEdit',
      meta: { title: '编辑限购规则' },
      hidden: true
    },
    {
      path: 'promotion/member-restrictions/detail/:promotionId',
      component: () => import('@/views/promotion/member-restrictions/detail'),
      name: 'PromMemberRestrictionsDetail',
      meta: { title: '限购详情' },
      hidden: true
    },
    {
      path: 'promotion/coupon-theme-list',
      component: () => import('@/views/promotion/coupon-theme-list/index'),
      name: 'PromCouponThemeList',
      meta: { title: '优惠券' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/promotion/coupon-theme-list/list'),
          name: 'PromPromotionCouponThemeList',
          meta: { title: '优惠券活动列表' }
        },
        {
          path: 'detail/:promotionId',
          component: () => import('@/views/promotion/coupon-theme-list/detail'),
          name: 'PromPromotionCouponThemeDetail',
          meta: { title: '优惠券详情' },
          hidden: true
        },
        {
          path: 'create',
          component: () => import('@/views/promotion/coupon-theme-list/create'),
          name: 'PromPromotionCouponThemeCreate',
          meta: { title: '创建优惠券' },
          hidden: true
        },
        {
          path: 'edit/:promotionId',
          component: () => import('@/views/promotion/coupon-theme-list/edit'),
          name: 'PromPromotionCouponThemeEdit',
          meta: { title: '编辑优惠券' },
          hidden: true
        },
        {
          path: 'details',
          component: () => import('@/views/promotion/coupon-theme-list/details'),
          name: 'PromPromotionCouponThemeListDetails',
          meta: { title: '优惠券明细' }
        }
      ]
    },
    {
      path: 'promotion/trial-management',
      component: () => import('@/views/promotion/trial-management/index'),
      name: 'PromotionTrialManagement',
      meta: { title: '试用管理' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/promotion/trial-management/list'),
          name: 'PromotionTrialManagement',
          meta: { title: '试用活动' }
        },

        {
          path: 'appliced',
          component: () => import('@/views/promotion/trial-management/appliced/index'),
          name: 'PromTrialApplicedList',
          meta: { title: '试用申请管理' }
        },
        {
          path: 'report',
          component: () => import('@/views/promotion/trial-management/report/index'),
          name: 'PromTrialReportList',
          meta: { title: '试用报告管理' }
        },
        {
          path: 'append/:promotionType?/:promotionId?',
          component: () => import('@/views/promotion/trial-management/append/index'),
          name: 'PromTrialActivityListAppend',
          meta: { title: '试用活动增加商品' },
          hidden: true
        },
        {
          path: 'edit/:promotionType?/:promotionId?',
          component: () => import('@/views/promotion/trial-management/edit/index'),
          name: 'PromTrialActivityListCreate',
          meta: { title: '创建试用活动' },
          hidden: true
        },
        {
          path: 'edit/:promotionType?/:promotionId?',
          component: () => import('@/views/promotion/trial-management/edit/index'),
          name: 'PromTrialActivityListEdit',
          meta: { title: '编辑试用活动' },
          hidden: true
        },
        {
          path: 'detail/:promotionType?/:promotionId?',
          component: () => import('@/views/promotion/trial-management/detail/index'),
          name: 'PromTrialActivityListDetail',
          meta: { title: '试用活动详情' },
          hidden: true
        },
        {
          path: 'report-detail/:id',
          component: () => import('@/views/promotion/trial-management/report-detail'),
          name: 'PromTrialReportDetail',
          meta: { title: '试用报告查看' },
          hidden: true
        }
      ]
    },
    {
      path: 'promotion/registration-management',
      component: () =>
        import('@/views/promotion/registration-management/index'),
      name: 'PromotionRegistrationManagementIndex',
      meta: { title: '报名管理' },
      children: [
        // 代理商报名,活动列表
        {
          path: 'supplier-enroll-management-index',
          component: () => import('@/views/promotion/registration-management/supplier-enroll-management-index/index.vue'),
          name: 'PromotionSupplierEnrollManagementIndex',
          meta: { title: '商家报名首页' }
        },
        {
          path: 'supplier-enroll-merchant-ctrl/:id/:refThemeId/:viewFlag/:refType/:merchantId',
          component: () => import('@/views/promotion/registration-management/supplier-enroll-merchant-ctrl/index.vue'),
          name: 'PromotionSupplierEnrollMerchantCtrl',
          hidden: true,
          meta: { title: '选择店铺' }
        },
        {
          path: 'supplier-enroll-management-apply-for-set/:id/:refThemeId/:viewFlag/:refType/:merchantId',
          component: () => import('@/views/promotion/registration-management/supplier-enroll-management-apply-for-set/index.vue'),
          name: 'PromotionSupplierEnrollManagementApplyForSet',
          hidden: true,
          meta: { title: '活动报名申请' }
        },
        {
          path: 'list',
          component: () =>
            import('@/views/promotion/registration-management/list'),
          name: 'PromotionRegistrationList',
          meta: { title: '促销报名活动列表' }
        },
        {
          path: 'detail/:id/:refThemeId',
          component: () =>
            import('@/views/promotion/registration-management/detail'),
          name: 'PromotionRegistrationDetail',
          meta: { title: '促销报名活动详情' },
          hidden: true
        },
        {
          path: 'record/:id/:refThemeId',
          component: () =>
            import('@/views/promotion/registration-management/record'),
          name: 'PromotionRegistrationRecord',
          meta: { title: '报名记录' },
          hidden: true
        },
        {
          path: 'record-detail/:activityAttendId?/:refThemeId',
          component: () => import('@/views/promotion/registration-management/record-detail'),
          name: 'PromRegistrationRecordDetails',
          meta: { title: '报名记录详情' },
          hidden: true
        },
        {
          path: 'supplier-enroll-management-record-list',
          component: () =>
            import(
              '@/views/promotion/registration-management/supplier-enroll-management-record-list'
            ),
          name: 'PromotionSupplierEnrollManagementRecordList',
          meta: { title: '商家报名列表' }
        },
        {
          path: 'rule/:refType/:refThemeId/:promotionType',
          component: () => import('@/views/promotion/registration-management/rule'),
          name: 'PromRegistrationRecordRule',
          meta: { title: '创建报名活动' },
          hidden: true
        }
      ]
    },
    {
      path: 'promotion/groupon',
      // redirect: '/promotion/groupon/grouponList',
      component: () => import('@/views/promotion/groupon/index'),
      name: 'PromGroupon',
      meta: {
        title: '拼团' /*,
        icon: 'promotion'*/
      },
      children: [
        {
          path: 'grouponList',
          component: () => import('@/views/promotion/groupon/grouponList'), // Parent router-view
          name: 'PromGrouponList',
          meta: { title: '拼团活动列表' }
        },
        {
          path: 'grouponInstList',
          component: () => import('@/views/promotion/groupon/grouponInstList'), // Parent router-view
          name: 'PromGrouponInstList',
          meta: { title: '拼团开团管理' }
        },
        {
          path: 'grouponInstDetail/:grouponInstId',
          component: () => import('@/views/promotion/groupon/grouponInstDetail'), // Parent router-view
          name: 'PromGrouponInstDetail',
          meta: { title: '开团管理详情' },
          hidden: true
        },
        {
          path: 'grouponMemberList',
          component: () => import('@/views/promotion/groupon/grouponMemberList'), // Parent router-view
          name: 'PromGrouponMemberList',
          meta: { title: '拼团参团团员管理' }
        },
        {
          path: 'activities-edit/:promotionId?',
          component: () => import('@/views/promotion/promotion-group-activities/edit/index'),
          name: 'PromGroupActivitiesEdit',
          hidden: true,
          meta: { title: '编辑拼团活动' }
        },
        {
          path: 'activities-edit/:promotionId?',
          component: () => import('@/views/promotion/promotion-group-activities/create/index'),
          name: 'PromGroupActivitiesCreate',
          hidden: true,
          meta: { title: '创建拼团活动' }
        },
        {
          path: 'activities-detail/:promotionId',
          component: () => import('@/views/promotion/promotion-group-activities/detail/index'),
          name: 'PromGroupActivitiesDetail',
          hidden: true,
          meta: { title: '拼团活动详情' }
        }
      ]
    },
    {
      path: 'promotion/recommendation',
      component: () => import('@/views/promotion/recommendation-list/index'),
      name: 'ProRecommendationList',
      meta: { title: '推荐码' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/promotion/recommendation-list/list'),
          name: 'PromPromotionRecommendationList',
          meta: { title: '推荐码活动列表', noCache: true }
        },
        {
          path: 'administration',
          component: () => import('@/views/promotion/recommendation-list/administration'),
          name: 'PromotionRecommendationAdministration',
          meta: { title: '推荐码管理' }
        },
        {
          path: 'code-edit/:promotionId?/:promotionType',
          component: () => import('@/views/promotion/promotion-recommend-code/edit/index'),
          name: 'PromRecommendCodeEdit',
          hidden: true,
          meta: { title: '编辑推荐码活动' }
        },
        {
          path: 'code-edit-share/:promotionId?/:promotionType',
          component: () => import('@/views/promotion/promotion-recommend-code/edit-share/index'),
          name: 'PromRecommendCodeEditShare',
          hidden: true,
          meta: { title: '编辑推荐码活动' }
        },
        {
          path: 'code-create/:promotionId?/:promotionType',
          component: () => import('@/views/promotion/promotion-recommend-code/create/index'),
          name: 'PromRecommendCodeCreate',
          hidden: true,
          meta: { title: '创建推荐码活动' }
        },
        {
          path: 'code-detail/:promotionId',
          component: () => import('@/views/promotion/promotion-recommend-code/detail/index'),
          name: 'PromRecommendCodeDetail',
          hidden: true,
          meta: { title: '推荐码活动详情' }
        }
      ]
    },
    {
      path: 'promotion/promotion-XofferPromotion/list',
      name: 'PromSingleXpieceDiscount',
      component: () =>
        import(
          '@/views/promotion/promotion-XofferPromotion/list'
        ),
      meta: { title: '单品X件优惠' }
    },
    {
      path: 'promotion/promotion-XofferPromotion/create/:promotionType/:promotionId?',
      component: () =>
        import(
          '@/views/promotion/promotion-XofferPromotion/create'
        ),
      name: 'PromXpieceDiscountCreate',
      meta: { title: '创建单品X件优惠' },
      hidden: true
    },
    {
      path: 'promotion/promotion-XofferPromotion/detail/:promotionId',
      component: () => import('@/views/promotion/promotion-XofferPromotion/detail/index'),
      name: 'PromXofferPromotionDetail',
      hidden: true,
      meta: { title: '单品x件促销活动详情' }
    },
    {
      path: 'promotion/promotion-XofferPromotion/append/:promotionId/:promotionType',
      component: () => import('@/views/promotion/promotion-XofferPromotion/append/index'),
      name: 'PromXofferPromotionAppend',
      hidden: true,
      meta: { title: '单品x件促销活动添加商品' }
    },
    {
      path: 'promotion/promotion-XofferPromotion/Edit/:promotionId/:promotionType?',
      component: () => import('@/views/promotion/promotion-XofferPromotion/edit/index'),
      name: 'PromXofferPromotionEdit',
      hidden: true,
      meta: { title: '编辑单品X件优惠' }
    }
  ]
}
