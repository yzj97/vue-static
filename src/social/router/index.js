export default {
  path: '/social-back-web',
  name: 'SocialWeb',
  meta: {
    title: '导购中心',
    icon: 'table'
  },
  children: [
    {
      path: 'sensitive-word-manage',
      component: () => import('@/views/sensitive-word-manage'),
      name: 'SocialSensitiveWordManage',
      meta: { title: '评论敏感词库管理' }
    },
    {
      path: 'consult-config',
      component: () => import('@/views/consult-config'),
      name: 'SocialConsultConfig',
      meta: { title: '咨询问答配置' }
    },
    {
      path: 'product-comment-manage',
      component: () => import('@/views/product-comment-manage'),
      name: 'SocialProductCommentManage', // 2级路由-需要标注名称，不然不能缓存
      meta: {
        title: '商品评论管理'
      }
    },
    {
      path: 'question-answer-manage',
      component: () => import('@/views/question-answer-manage'),
      name: 'SocialQuestionAnswerManage',
      meta: { title: '问答管理' }
    },
    {
      path: 'consult-manage',
      component: () => import('@/views/consult-manage'),
      name: 'SocialConsultManage',
      meta: { title: '咨询管理' }
    },
    {
      path: 'app-version-manage',
      component: () => import('@/views/app-version-manage'),
      name: 'SocialAppVersionManage',
      meta: { title: 'APP版本管理' }
    },
    {
      path: 'app-version-edit',
      component: () => import('@/views/app-version-edit'),
      name: 'SocialAppVersionEdit',
      hidden: true,
      meta: { title: 'APP版本管理编辑' }
    },
    {
      path: 'sort-rule',
      component: () => import('@/views/sort-rule'),
      name: 'SocialSortRule',
      meta: { title: '排序规则' }
    },
    {
      path: 'sort-rule-config',
      component: () => import('@/views/sort-rule-config'),
      name: 'SocialSortRuleConfig',
      hidden: true,
      meta: { title: '排序规则设置' }
    },
    {
      path: 'main-dictionary',
      component: () => import('@/views/main-dictionary'),
      name: 'SocialMainDictionary',
      meta: { title: '主词典管理' }
    },
    {
      path: 'extension-dictionary',
      component: () => import('@/views/extension-dictionary'),
      name: 'SocialExtensionDictionary',
      meta: { title: '扩展词典管理' }
    },
    {
      path: 'synonym-dictionary',
      component: () => import('@/views/synonym-dictionary'),
      name: 'SocialSynonymDictionary',
      meta: { title: '同义词典管理' }
    },
    {
      path: 'community-manage',
      component: () => import('@/views/community-manage'),
      name: 'SocialCommunityManage',
      meta: { title: '社区管理', icon: 'table' },
      children: [
        {
          path: 'social-post-manage',
          component: () => import('@/views/community-manage/social-post-manage'),
          name: 'SocialPostManage',
          meta: { title: '帖子管理' }
        },
        {
          path: 'social-post-config',
          component: () => import('@/views/community-manage/social-post-manage/detail'),
          name: 'SocialPostManageConfig',
          hidden: true,
          meta: { title: '帖子管理' }
        },
        {
          path: 'social-comment-manage',
          component: () => import('@/views/community-manage/social-comment-manage'),
          name: 'SocialCommentManage',
          meta: { title: '帖子评论' }
        },
        {
          path: 'social-post-topic-manage',
          component: () => import('@/views/community-manage/social-post-topic-manage'),
          name: 'SocialPostTopicManage',
          meta: { title: '话题管理' }
        },
        {
          path: 'social-post-topic-manage-detail',
          component: () => import('@/views/community-manage/social-post-topic-manage/detail'),
          name: 'SocialPostTopicDetailManage',
          hidden: true,
          meta: { title: '话题管理' }
        },
        {
          path: 'social-post-classify-manage',
          component: () => import('@/views/community-manage/social-post-classify-manage'),
          name: 'SocialPostClassifyManage',
          meta: { title: '帖子分类管理' }
        },
        {
          path: 'apply-activity-user',
          component: () => import('@/views/apply-activity-user/list'),
          name: 'ApplyActivityUserList',
          meta: { title: '报名人数' }
        }
      ]
    },
    {
      path: 'live-manage',
      component: () => import('@/views/live-manage'),
      name: 'LiveManage',
      meta: { title: '直播管理', parenTitle: '内容中心', icon: 'table' },
      children: [
        {
          path: 'live-list-manage',
          component: () => import('@/views/live-manage/live-list-manage'),
          name: 'LiveListManage',
          meta: { title: '直播列表', parenTitle: '直播管理' }
        },
        {
          path: 'live-mange-config',
          component: () => import('@/views/live-manage/live-list-manage/detail'),
          name: 'LiveMangeConfig',
          hidden: true,
          meta: { title: '新建直播', parenTitle: '直播管理' }
        },
        {
          path: 'live-mange-config-edit',
          component: () => import('@/views/live-manage/live-list-manage/detail'),
          name: 'LiveMangeConfigEdit',
          hidden: true,
          meta: { title: '直播编辑', parenTitle: '直播管理' }
        },
        {
          path: 'live-mange-config-see',
          component: () => import('@/views/live-manage/live-list-manage/detail'),
          name: 'LiveMangeConfigSee',
          hidden: true,
          meta: { title: '直播查看', parenTitle: '直播管理' }
        },
        {
          path: 'applyActivity/list',
          component: () => import('@/views/applyActivity/list'),
          name: 'ApplyActivityManage',
          meta: {
            title: '活动报名管理'
          }
        },
        {
          path: 'applyActivity/add',
          name: 'ApplyActivityAdd',
          component: () => import('@/views/applyActivity/detail'),
          meta: {
            title: '新建报名活动'
          },
          hidden: true
        },
        {
          path: 'applyActivity/edit/:id',
          name: 'ApplyActivityEdit',
          component: () => import('@/views/applyActivity/detail'),
          meta: {
            title: '编辑报名活动'
          },
          hidden: true
        },
        {
          path: 'applyActivity/detail/:id',
          name: 'ApplyActivityDetail',
          component: () => import('@/views/applyActivity/detail'),
          meta: {
            title: '报名活动详情'
          },
          hidden: true
        }
      ]
    },
    {
      path: 'applyActivity/list',
      component: () => import('@/views/applyActivity/list'),
      name: 'ApplyActivityManage',
      meta: {
        title: '活动报名管理'
      }
    },
    {
      path: 'applyActivity/add',
      name: 'ApplyActivityAdd',
      component: () => import('@/views/applyActivity/detail'),
      meta: {
        title: '新建报名活动'
      },
      hidden: true
    },
    {
      path: 'applyActivity/edit/:id',
      name: 'ApplyActivityEdit',
      component: () => import('@/views/applyActivity/detail'),
      meta: {
        title: '编辑报名活动'
      },
      hidden: true
    },
    {
      path: 'applyActivity/detail/:id',
      name: 'ApplyActivityDetail',
      component: () => import('@/views/applyActivity/detail'),
      meta: {
        title: '报名活动详情'
      },
      hidden: true
    }
  ]
}
