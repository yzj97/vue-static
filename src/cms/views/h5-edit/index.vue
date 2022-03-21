<template>
  <div class="h5-edit">
    <div class="header">
      <div class="left header-item">
        <ody-button
          name="ui_handleBack"
          code="ui"
          class="btn-item"
          size="mini"
          @click="handleBack">{{ $t('返回') }}</ody-button>
      </div>
      <div class="center header-item">
        <div class="center-title">{{ getPageName }}{{ $t('页面配置') }}</div>
      </div>
      <div class="right header-item">
        <div class="btn-item">
          <ody-button
            v-if="+pageType !== 8"
            name="ui_copyPage"
            code="CmsPageList04"
            size="mini"
            @click="copyPage">{{ $t('复制页面') }}</ody-button>
        </div>
        <div class="btn-item">
          <ody-button
            name="ui_showEditPage"
            code="CmsPageList06"
            size="mini"
            @click="openShowEidtPage">{{ $t('页面设置') }}</ody-button>
        </div>
        <div class="btn-item">
          <ody-button
            name="ui_previewPage"
            code="CmsPageList05"
            size="mini"
            @click="previewPage">{{ $t('预览') }}</ody-button>
        </div>
        <div class="btn-item">
          <ody-button
            v-if="showSaveBtn"
            name="ui_handleSubmit0"
            code="CmsPageList06"
            size="mini"
            type="primary"
            @click="handleSubmit(true)">{{ $t('保存') }}</ody-button>
        </div>
        <div class="btn-item">
          <ody-button
            v-if="+pageType !== 8"
            name="ui_handleRelease0"
            code="CmsPageList09"
            size="mini"
            type="primary"
            @click="handleRelease">{{ $t('立即发布') }}</ody-button>
        </div>
        <div class="btn-item">
          <ody-button
            v-if="+pageType !== 8"
            name="ui_handleReleaseTime0"
            code="CmsPageList09"
            size="mini"
            type="primary"
            @click="handleReleaseTime">{{ $t('定时发布') }}</ody-button>
        </div>

      </div>
    </div>
    <div class="content">
      <div v-show="showPageListFlag" class="page-area">
        <cms-page-list
          :page-list="pageList"
          :choose-index="choosePageIndex"
          @changeChooseIndex="changePageIndex"/>
      </div>
      <div class="component-area">
        <cms-components-list
          :page-type="pageType"
          :code-list="codeList"
          :h5-iphone="h5Iphone" />
      </div>
      <div class="preview-area">
        <cms-h5-iphone
          :h5-iphone="h5Iphone"
          :page-model="pageForm"
          :page-type="pageType"
          :page-id="pageId"
          :footer-model="pageFooter.model"
          @changeEditPageStatus="changeEditPageStatus"
          @openFooterEdit="openShowEditFooter"/>
      </div>
      <div class="flex1"/>
      <div class="editor-area">
        <div v-show="!(showEditPage|| showEidtFooter)">
          <cms-edit-list
            ref="editList"
            :page-model="pageForm"
            :show-form.sync="showForm"
            :page-type="pageType"
            :page-id="pageId"
            :h5-iphone="h5Iphone"
            :update-module="updateModule"/>
        </div>
        <div v-show="showEditPage">
          <cms-edit-page
            ref="editPage"
            :key="editPageData"
            :form-data="pageForm"
            @changeEditPageStatus="changeEditPageStatus"/>
        </div>
        <div v-show="showEidtFooter">
          <cms-edit-footer
            ref="editFooter"
            :key="editPageData"
            :page-type="pageType"
            :form-data="pageFooter"
            @changeEditPageStatus="changeEditPageStatus"/>
        </div>
      </div>
    </div>
    <cms-release-time
      v-if="releaseTimeFlag"
      :visible.sync="releaseTimeFlag"
      :page-id="sourcePageId"
      @ok="openReleaseSuccessDialog"
    />
    <cms-release-success
      v-if="releaseSuccessFlag"
      :visible.sync="releaseSuccessFlag"
      :page-id="sourcePageId"
      :page-release-time="pageReleaseTime"
      @cancel="handleReleaseBack"
      @ok="handleReleaseDone"
    />
    <cms-preview-table
      v-if="previewFlag"
      :visible.sync="previewFlag"
      :channel-list="channelList"
    />
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import CmsPageList from '@/components/page-list'
import CmsComponentsList from '@/components/components-list'
import CmsH5Iphone from '@/components/h5-iphone'
import CmsEditList from '@/components/edit-list'
import CmsEditPage from '@/components/edit-page'
import CmsEditFooter from '@/components/edit-footer'
// import pageList from '@/components/page-list/config'
import componentsListConfig from '@/h5-components/index'
import editPageConfig from '@/components/edit-page/config'
import editFooterConfig from '@/components/edit-footer/config'
import editInformationPageConfig from '@/components/edit-page/informationConfig'
import editPromotionPageConfig from '@/components/edit-page/promotionConfig'
import CmsReleaseTime from '@/components/cms-release-time'
import CmsReleaseSuccess from '@/components/cms-release-success'
import CmsPreviewTable from '@/components/cms-preview-table'

export default {
  // name: 'CmsH5Edit',
  components: {
    CmsPageList,
    CmsComponentsList,
    CmsH5Iphone,
    CmsEditList,
    CmsEditPage,
    CmsReleaseTime,
    CmsReleaseSuccess,
    CmsPreviewTable,
    CmsEditFooter
  },
  data() {
    return {
      showPageListFlag: true,
      channelList: [],
      previewFlag: false,
      editPageData: 1,
      pageReleaseTime: '',
      releaseSuccessFlag: false,
      releaseTimeFlag: false,
      dataChangeFlag: false,
      showEditPage: false,
      showEidtFooter: false,
      showForm: true,
      cmsApi: this.$cms.$api.cmsEdit,
      pageList: [],
      choosePageIndex: '',
      h5Iphone: {
        list: [],
        index: 0
      },
      codeList: [],
      pageId: '',
      templateId: this.$route.params.templateId,
      pageIdList: [],
      pageForm: {
        model: {},
        fields: [],
        rules: {}
      },
      pageFooter: {
        model: {},
        fields: [],
        rules: {}
      },
      pageType: '',
      status: null,
      showSaveBtn: false
    }
  },
  computed: {
    getPageName() {
      if (this.pageList && this.pageList.length > 0 && this.choosePageIndex !== '') {
        return this.pageList[this.choosePageIndex].label
      } else {
        return ''
      }
    }
  },
  watch: {
    choosePageIndex: {
      handler(val) {
        this.init()
      }
    },
    'h5Iphone.list': {
      handler(val) {
        this.dataChangeFlag = true
      },
      deep: true
    }
  },
  async created() {
    await this.getChannelList()
    await this.getPageConfig() // 等这个函数走完 拿到pageList 才能走下面的函数
    this.dealParamsPageType()
    eventBus.$on('CmsGetPageInfo', this.getPageInfo)
    // 解决火狐浏览器的拖拽 搜索问题
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  beforeDestroy() {
    eventBus.$off('CmsGetPageInfo', this.getPageInfo)
  },
  methods: {
    async getChannelList() {
      const res = await this.cmsApi.getChannelList({
        filters: {
          onOrOffLine: '1',
          channelType: '1',
          channelMode: ['O+O', 'B2B', 'BBC']
        }
      })

      var channelCodeList = []
      var channelCodeListChildren = []

      var channelCodeListInformationConfig = []
      var channelCodeListChildrenInformationConfig = []

      res.data && res.data.map(item => {
        channelCodeList.push(item.channelCode)
        channelCodeListChildren.push({
          html: item.channelName,
          label: item.channelCode,
          tag: 'el-checkbox'
        })
        if (item.channelMode === 'BBC') {
          channelCodeListInformationConfig.push(item.channelCode)
          channelCodeListChildrenInformationConfig.push({
            html: item.channelName,
            label: item.channelCode,
            tag: 'el-checkbox'
          })
        }
      })

      // 对于 editPageConfig 修改里面的 channelCodeList 参数
      editPageConfig.model.channelCodeList = this.$portal.deepClone(channelCodeList)
      const index = editPageConfig.fields.findIndex(row => row.prop === 'channelCodeList')
      if (index > -1) {
        editPageConfig.fields[index].children = this.$portal.deepClone(channelCodeListChildren)
      }

      // 对于 editPromotionPageConfig 修改里面的 channelCodeList 参数
      editPromotionPageConfig.model.channelCodeList = this.$portal.deepClone(channelCodeList)
      const promotionIndex = editPromotionPageConfig.fields.findIndex(row => row.prop === 'channelCodeList')
      if (promotionIndex > -1) {
        editPromotionPageConfig.fields[promotionIndex].children = this.$portal.deepClone(channelCodeListChildren)
      }
      // 对于 editInformationPageConfig 修改里面的 channelCodeList 参数
      editInformationPageConfig.model.channelCodeList = this.$portal.deepClone(channelCodeListInformationConfig)
      const informationIndex = editInformationPageConfig.fields.findIndex(row => row.prop === 'channelCodeList')
      if (informationIndex > -1) {
        editInformationPageConfig.fields[informationIndex].children = this.$portal.deepClone(channelCodeListChildrenInformationConfig)
      }
    },
    async getPageConfig() {
      // 页面配置修改从后端读取 原来是放在@/components/page-list/config中
      const res = await this.cmsApi.getPageConfig({
        platform: 2
      })
      this.pageList = res.data
    },
    dealParamsPageType() {
      if (this.$route.params.type) {
        this.choosePageIndex = this.pageList.findIndex(item => item.type === +this.$route.params.type)
        this.showPageListFlag = false
      } else {
        this.choosePageIndex = 0
      }
    },
    async init() {
      this.codeList = this.pageList[this.choosePageIndex].codeList
      if (this.pageIdList.length === 0) {
        await this.getPageIdList()
      }
      this.pageType = this.pageList[this.choosePageIndex].type
      const index = this.pageIdList.findIndex(item => { return item.type === this.pageType })
      if (index > -1) {
        this.pageId = this.pageIdList[index].id
        this.sourcePageId = this.pageIdList[index].sourcePageId
      } else {
        // 如果该页面没有生产pageId 调接口 再生成一个
        await this.addCmsTemplate(this.pageType)
        this.sourcePageId = ''
      }
      // 拿到当前pageId 去拿当前页面的数据
      await this.getPageInfo()
    },
    async getPageIdList() {
      const res = await this.cmsApi.getCmsTemplate({ id: this.templateId })
      this.pageIdList = res.data.pageList
    },
    async getPageInfo(isPreview) {
      const res = await this.cmsApi.getTempPageInfo({
        pageId: this.pageId,
        sourcePageId: this.sourcePageId,
        resortTabModule: 0
      })
      const templateObj = this.pageIdList.find(item => item.id === this.pageId || item.sourcePageId === this.pageId)
      templateObj['sourcePageId'] = res.data.sourcePageId
      templateObj['id'] = res.data.id

      this.pageId = res.data.id
      this.sourcePageId = res.data.sourcePageId
      console.log(this.pageId, this.sourcePageId)

      if (res.data.moduleList) {
        //  处理成页面的数据
        const data = res.data.moduleList
        data.map(item => {
          const componentsListConfigClone = this.$portal.deepClone(componentsListConfig)
          const index = componentsListConfigClone.findIndex(row => { return row.code === item.templateCode })
          item.model = item.templateVariable
          item.code = item.templateCode
          item.fields = this.$portal.deepClone(componentsListConfigClone[index].fields)
          item.rules = this.$portal.deepClone(componentsListConfigClone[index].rules)
          item.name = componentsListConfigClone[index].name
          this.handleGoodsForType(item)
        })
        this.h5Iphone.list = data
      } else {
        this.h5Iphone.list = []
      }
      // get 状态
      if (res.data.channelList && isPreview !== true) {
        const _channelList = res.data.channelList
        if (_channelList && _channelList.length > 0) {
          const status = (_channelList[0] || {}).status
          if (status !== 1) {
            this.showSaveBtn = true
          }
        }
      }
      this.$nextTick(() => { // 第一次进入判断成页面没有进行编辑 如果编辑 返回会提示的
        this.dataChangeFlag = false
      })
      this.dealGlobalPageInfo(res.data)
      this.dealReleaseTime(res.data)
    },
    handleGoodsForType(item) {
      if (+this.pageType === 18) {
        if (item.model && item.model.hasOwnProperty('displayBuyBtn')) {
          item.model.displayBuyBtn = false
        }
        if (item.fields) {
          const displayBuyBtnIndex = item.fields.findIndex(row => row.prop === 'displayBuyBtn')
          if (displayBuyBtnIndex > -1) {
            item.fields.splice(displayBuyBtnIndex, 1)
          }
          const goodsTypeIndex = item.fields.findIndex(row => row.prop === 'goodsType')
          if (goodsTypeIndex > -1) {
            item.fields.splice(goodsTypeIndex, 1)
          }
          const dataSortRoleIndex = item.fields.findIndex(row => row.prop === 'dataSortRole')
          if (dataSortRoleIndex > -1) {
            item.fields[dataSortRoleIndex].children.push(...[{
              label: this.$t('按积分从高到低'),
              value: 5,
              tag: 'el-option'
            },
            {
              label: this.$t('按积分从低到高'),
              value: 6,
              tag: 'el-option'
            }])
          }
        }
      }
      if (+this.pageType === 8) {
        if (item.fields) {
          const displayBuyBtnIndex = item.fields.findIndex(row => row.prop === 'displayBuyBtn')
          if (displayBuyBtnIndex > -1) {
            item.fields.splice(displayBuyBtnIndex, 1)
          }
          const displayNavIndex = item.fields.findIndex(row => row.prop === 'displayNav')
          if (displayNavIndex > -1) {
            item.fields.splice(displayNavIndex, 1)
          }
          const displayEvaluateIndex = item.fields.findIndex(row => row.prop === 'displayEvaluate')
          if (displayEvaluateIndex > -1) {
            item.fields.splice(displayEvaluateIndex, 1)
          }
        }
      }
    },
    dealGlobalPageInfo(data) {
      let pageInfo

      if (+this.pageType === 8) { // 对于咨询详情页面 页面设置不一样
        pageInfo = this.$portal.deepClone(editInformationPageConfig)
        if (data.channelList && data.channelList.length > 0) {
          pageInfo.model.channelCodeList = [...new Set(data.channelList.map(item => item.channel))]
          this.channelList = data.channelList
        }
        pageInfo.model.displayTitle = data.displayTitle
        pageInfo.model.categoryId = data.categoryId || ''
        pageInfo.model.coverImage = data.coverImage
        pageInfo.model.platformTypeList = data.platformTypeList || []
        pageInfo.model.description = data.description
        pageInfo.model.startDate = data.startDate
        pageInfo.model.shareTitle = data.shareTitle
        pageInfo.model.shareImg = data.shareImg
        pageInfo.model.shareDesc = data.shareDesc

        this.pageForm = pageInfo
      } else if (+this.pageType === 3) {
        pageInfo = this.$portal.deepClone(editPromotionPageConfig)
        if (data.channelList && data.channelList.length > 0) {
          pageInfo.model.channelCodeList = [...new Set(data.channelList.map(item => item.channel))]
          this.channelList = data.channelList
        }
        pageInfo.model.lang = data.lang
        pageInfo.model.name = data.name
        pageInfo.model.displayTitle = data.displayTitle
        pageInfo.model.bgColor = data.bgColor
        pageInfo.model.startDate = data.startDate
        pageInfo.model.shareTitle = data.shareTitle
        pageInfo.model.shareImg = data.shareImg
        pageInfo.model.shareDesc = data.shareDesc

        this.pageForm = pageInfo
      } else {
        pageInfo = this.$portal.deepClone(editPageConfig)
        if (data.channelList && data.channelList.length > 0) {
          pageInfo.model.channelCodeList = [...new Set(data.channelList.map(item => item.channel))]
          pageInfo.model.shopIdList = [...new Set(data.channelList.map(item => item.shopId))]
          this.channelList = data.channelList
        }
        pageInfo.model.lang = data.lang
        pageInfo.model.name = data.name
        pageInfo.model.displayTitle = data.displayTitle
        pageInfo.model.bgColor = data.bgColor
        pageInfo.model.startDate = data.startDate
        // 处理不是店铺首页 不加入店铺选择
        this.deleteGlobalPageFormForType(pageInfo)
        this.pageForm = pageInfo
      }

      // 对footer进行赋值
      const footerInfo = this.$portal.deepClone(editFooterConfig)
      if (this.pageType === 1 || this.pageType === 11) {
        footerInfo.model.footerList = data.footer || []
        this.pageFooter = footerInfo
      } else {
        this.showEidtFooter = false // 把footer关闭 可能有些页面没有footer
      }

      this.editPageData += 1 // 重新渲染这个组件 不然验证对不上
    },
    deleteGlobalPageFormForType(pageInfo) {
      if (+this.pageType !== 11) {
        if (pageInfo.model && pageInfo.model.hasOwnProperty('shopIdList')) {
          delete pageInfo.model['shopIdList']
        }
        if (pageInfo.fields) {
          const shopIdIndex = pageInfo.fields.findIndex(row => row.prop === 'shopIdList')
          if (shopIdIndex > -1) {
            pageInfo.fields.splice(shopIdIndex, 1)
          }
        }
        if (pageInfo.rules && pageInfo.rules.hasOwnProperty('shopIdList')) {
          delete pageInfo.rules['shopIdList']
        }
      }
    },
    dealReleaseTime(data) {
      if (data.isTimingRelease === 1) {
        this.releaseSuccessFlag = true
        this.pageReleaseTime = data.releaseDate
      } else {
        this.releaseSuccessFlag = false
      }
    },
    async addCmsTemplate(type) {
      const res = await this.cmsApi.addCmsTemplate({
        id: this.templateId,
        platform: 2,
        pageType: type
      })
      this.pageIdList.push(res.data.pageList[0])
      this.pageId = res.data.pageList[0].id
    },
    validateOne($form, callback) {
      if (!($form && $form.validate)) {
        callback([true, '没有找到验证表单'])
        return
      }
      $form.validate((valid) => {
        if (valid) {
          callback([false, valid])
        } else {
          callback([true, $form.$attrs.name])
        }
      })
    },
    validatePage() {
      let flag = true
      this.$refs.editPage.$refs.editPageForm.validate((valid) => {
        flag = valid
      })
      return flag
    },
    validateAll() {
      return new Promise((resolve) => {
        const formList = this.$refs.editList.$refs.editForm

        if (!(formList && formList.length)) {
          resolve([true, '不能保存空模板'])
          return
        }

        const formLen = formList.length
        let loadIndex = 0
        const rtv = {}
        let hasError = false

        formList.forEach(($form, index) => {
          this.validateOne($form, (res) => {
            loadIndex += 1
            rtv[index] = res
            this.$set(this.h5Iphone.list[index], 'hasError', res[0])
            if (res[0]) {
              hasError = true
            }
            if (loadIndex === formLen) {
              resolve([hasError, rtv])
            }
          })
        })
      })
    },
    async saveCmsPage() {
      const params = {
        id: this.pageId,
        sourcePageId: this.sourcePageId,
        type: this.pageType,
        ...this.pageForm.model
      }
      if (params.bgColor === null) {
        params.bgColor = ''
      }
      if (this.pageType === 1 || this.pageType === 11) {
        params.footer = this.pageFooter.model.footerList || []
      }
      await this.cmsApi.saveCmsPage(params)
    },
    async updateModule(itemInfo) {
      const item = this.$portal.deepClone(itemInfo)
      item.pageId = this.pageId
      item.templateCode = item.code
      item.name = item.model.customName
      item.templateVariable = item.model
      if (item.model.use && item.model.use.length > 0) {
        item.startDate = item.model.use[0]
        item.endDate = item.model.use[1]
      }

      delete item['code']
      delete item['model']
      delete item['fields']
      delete item['rules']
      delete item.renderType

      await this.cmsApi.updateCmsModule(item)
    },
    async batchUpdateModule(tip) {
      const data = this.$portal.deepClone(this.h5Iphone.list)
      const params = data.map((item, index) => {
        item.sortValue = index
        item.pageId = this.pageId
        item.templateCode = item.code
        item.name = item.model.customName
        item.templateVariable = item.model
        if (item.model.use && item.model.use.length > 0) {
          item.startDate = item.model.use[0]
          item.endDate = item.model.use[1]
        }
        delete item['code']
        delete item['model']
        delete item['fields']
        delete item['rules']
        delete item.renderType

        return item
      })
      await this.cmsApi.batchUpdateModule(params)
      // console.log(params)
    },
    async handleSubmit(tip) {
      const dataList = this.$portal.deepClone(this.h5Iphone.list)
      if (+this.pageType === 1 || +this.pageType === 11) {
        var flag = true
        dataList.map(item => {
          if (item.code === 'header') {
            flag = false
          }
        })
        if (flag) {
          this.$message(this.$t('请在页面上添加导航栏'))
          return false
        }
      }
      const [err, msg] = await this.validateAll()
      const pageFlag = this.validatePage()
      if (!pageFlag) {
        this.showEditPage = true
        this.showEidtFooter = false
      }
      // debugger
      if (err || !pageFlag) {
        console.log(msg)
        this.$message(this.$t('存在必填项没有填写'))
        return false
      }
      await this.batchUpdateModule()
      await this.saveCmsPage()
      if (tip) {
        this.$message.success(this.$t('保存成功'))
      }
      // 保存过后，还原pageId
      this.pageId = this.sourcePageId
      this.sourcePageId = null
      await this.getPageInfo()
      this.dataChangeFlag = false
    },
    changeEditPageStatus() {
      this.showEditPage = false
      this.showEidtFooter = false
      this.showForm = true
    },
    async handleRelease() {
      const res = await this.handleSubmit()
      if (res === false) return
      this.$confirm(this.$t('确认要发布吗?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'info'
      }).then(() => {
        this.$cms.$api.cmsPage.releasePage({ id: this.sourcePageId }).then(res => {
          this.$message.success(this.$t('发布成功'))
        })
      })
    },
    async handleReleaseTime() {
      const res = await this.handleSubmit()
      if (res === false) return
      this.releaseTimeFlag = true
    },
    handleReleaseBack() {
      this.$router.push({
        name: 'CmsPageList'
      })
      this.$portal.delActiveView()
    },
    handleReleaseDone() {
      const params = {
        id: this.sourcePageId,
        isTimingRelease: 0
      }
      this.cmsApi.timedRelease(params).then(res => {
        this.$message.success(this.$t('取消定时发布成功'))
        this.releaseSuccessFlag = false
      })
    },
    openReleaseSuccessDialog(time) {
      this.releaseSuccessFlag = true
      if (time) {
        this.pageReleaseTime = time
      }
    },
    changePageIndex(index) {
      if (this.dataChangeFlag) {
        this.$confirm(this.$t('确认要切换页面吗，你的数据还没有保存?'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'info'
        }).then(() => {
          this.h5Iphone.index = 0
          this.choosePageIndex = index
        })
      } else {
        this.h5Iphone.index = 0
        this.choosePageIndex = index
      }
    },
    handleBack() {
      if (this.dataChangeFlag) {
        this.$confirm(this.$t('确认要返回吗，你的数据还没有保存?'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'info'
        }).then(() => {
          if (this.sourcePageId && this.pageId) {
            // 删除临时页面数据
            this.$cms.$api.cmsPage.deletePage([this.pageId]).then(res => {})
          }
          this.$router.push({
            name: 'CmsPageList'
          })
          this.$portal.delActiveView()
        })
      } else {
        if (this.sourcePageId && this.pageId) {
          // 删除临时页面数据
          this.$cms.$api.cmsPage.deletePage([this.pageId]).then(res => {})
        }
        this.$router.push({
          name: 'CmsPageList'
        })
        this.$portal.delActiveView()
      }
    },
    async copyPage() {
      const res = await this.handleSubmit()
      if (res === false) return
      this.$confirm(this.$t('确认要复制吗?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'info'
      }).then(() => {
        this.$cms.$api.cmsPage.copyPage({ id: this.pageId }).then(res => {
          this.$message.success(this.$t('复制成功'))
        })
      })
    },
    async previewPage() {
      const res = await this.handleSaveTempPage()
      if (res === false) return
      this.previewFlag = true
    },
    async handleSaveTempPage() {
      const dataList = this.$portal.deepClone(this.h5Iphone.list)
      if (+this.pageType === 1 || +this.pageType === 11) {
        var flag = true
        dataList.map(item => {
          if (item.code === 'header') {
            flag = false
          }
        })
        if (flag) {
          this.$message(this.$t('请在页面上添加导航栏'))
          return false
        }
      }
      const [err, msg] = await this.validateAll()
      const pageFlag = this.validatePage()
      if (!pageFlag) {
        this.showEditPage = true
        this.showEidtFooter = false
      }
      // debugger
      if (err || !pageFlag) {
        console.log(msg)
        this.$message(this.$t('存在必填项没有填写'))
        return false
      }
      await this.batchUpdateModule()
      await this.saveTempCmsPage()
      await this.getPageInfo(true)
      this.dataChangeFlag = false
    },
    async saveTempCmsPage() {
      const params = {
        id: this.pageId,
        type: this.pageType,
        preview: 1,
        ...this.pageForm.model
      }
      if (params.bgColor === null) {
        params.bgColor = ''
      }
      if (this.pageType === 1 || this.pageType === 11) {
        params.footer = this.pageFooter.model.footerList || []
      }
      await this.cmsApi.saveCmsPage(params)
    },
    openShowEidtPage() {
      this.showEditPage = true
      this.showEidtFooter = false
    },
    openShowEditFooter() {
      this.showEditPage = false
      this.showEidtFooter = true
    }
  }

}
</script>

<style lang="less" scoped>
.h5-edit {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  .header{
    background: #ffffff;
    height: 50px;
    line-height: 50px;
    box-shadow: 0 1px 5px 0 #e5e5e5;
    border-bottom: 1px solid #E6E6E6;
    display: flex;
    .header-item {
      flex: 1;
    }
    .left {
      .btn-item {
        margin-left: 20px;
      }
    }
    .center {
      display: flex;
      justify-content: center;
      .center-title {
        color: #333333;
        font-size: 16px;
        font-weight: 450;
      }
    }
    .right {
      display: flex;
      justify-content: flex-end;
      margin-right: 20px;
       .btn-item {
        margin-left: 20px;
      }
    }
  }
  .content {
    display: flex;
    .component-area {
      width: 200px;
    }
    .preview-area {
      margin: 30px 0 0 50px;
      // display: flex;
      // justify-content: center;
      // -webkit-justify-content: center;
      // background: #f5f5f5;
    }
    .flex1 {
      flex: 1;
    }
    .editor-area {
      background: #ffffff;
      margin: 30px 10px 0 0;
    }
  }
}
</style>
