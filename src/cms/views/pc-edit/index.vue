<template>
  <div class="h5-edit">
    <div class="header">
      <div class="left header-item">
        <ody-button
          name="ui_handleBack"
          code="ui"
          class="btn-item"
          size="mini"
          @click="handleBack"
        >{{ $t('返回') }}</ody-button>
      </div>
      <div class="center header-item">
        <div class="center-title">,{{ getPageName }},{{ $t('页面配置') }}</div>
      </div>
      <div class="right header-item">
        <div class="btn-item">
          <ody-button name="ui_showEditPage" code="ui" size="mini" @click="showEditPage = true">{{ $t('页面设置') }}</ody-button>
        </div>
        <div class="btn-item">
          <ody-button
            name="ui_previewPage"
            code="ui"
            size="mini"
            @click="previewPage">{{ $t('预览') }}</ody-button>
        </div>
        <div class="btn-item">
          <ody-button
            name="ui_handleSubmit0"
            code="ui"
            size="mini"
            type="primary"
            @click="handleSubmit(true)"
          >{{ $t('保存') }}</ody-button>
        </div>
        <div class="btn-item">
          <ody-button
            name="ui_handleRelease0"
            code="ui"
            size="mini"
            type="primary"
            @click="handleRelease"
          >{{ $t('立即发布') }}</ody-button>
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
          @changeChooseIndex="changePageIndex"
        />
      </div>
      <div class="component-area">
        <cms-components-list :page-type="pageType" :code-list="codeList" :h5-iphone="pcModuleList" :platform="1"/>
      </div>
      <div class="preview-area">
        <cms-pc-preview
          :h5-iphone="pcModuleList"
          :page-model="pageForm"
          :page-id="pageId"
          :page-type="pageType"
          @changeEditPageStatus="changeEditPageStatus"
        />
      </div>
    </div>
    <ody-dialog-full-right :visible.sync="showForm" :title="$t('模块配置')" size="small">
      <div v-show="!showEditPage">
        <cms-edit-list
          ref="editList"
          :page-model="pageForm"
          :show-form.sync="showForm"
          :page-type="pageType"
          :page-id="pageId"
          :h5-iphone="pcModuleList"
          :update-module="updateModule"
          :plat-form="1"
        />
      </div>
    </ody-dialog-full-right>
    <ody-dialog-full-right :visible.sync="showEditPage" :title="$t('页面配置')" size="small">
      <div v-show="showEditPage">
        <cms-edit-page
          ref="editPage"
          :form-data="pageForm"
          @changeEditPageStatus="changeEditPageStatus"
        />
      </div>
    </ody-dialog-full-right>
    <cms-release-time
      v-if="releaseTimeFlag"
      :visible.sync="releaseTimeFlag"
      :page-id="pageId"
      @ok="openReleaseSuccessDialog"
    />
    <cms-release-success
      v-if="releaseSuccessFlag"
      :visible.sync="releaseSuccessFlag"
      :page-id="pageId"
      :page-release-time="pageReleaseTime"
      @cancel="handleReleaseBack"
      @ok="handleReleaseDone"
    />
  </div>
</template>

<script>
import CmsPageList from '@/components/page-list'
import CmsComponentsList from '@/components/components-list'
import CmsPcPreview from '@/components/pc-preview'
import CmsEditList from '@/components/edit-list'
import CmsEditPage from '@/components/edit-page'
import pcListConfig from '@/pc-components/index'
import editPageConfig from '@/components/edit-page/pcConfig'
import CmsReleaseTime from '@/components/cms-release-time'
import CmsReleaseSuccess from '@/components/cms-release-success'

export default {
  // name: 'CmsPcEdit',
  components: {
    CmsPageList,
    CmsComponentsList,
    CmsPcPreview,
    CmsEditList,
    CmsEditPage,
    CmsReleaseTime,
    CmsReleaseSuccess
  },
  data() {
    return {
      pageReleaseTime: '',
      releaseSuccessFlag: false,
      releaseTimeFlag: false,
      showPageListFlag: true,
      dataChangeFlag: false,
      showEditPage: false,
      showForm: false,
      cmsApi: this.$cms.$api.cmsEdit,
      pageList: [],
      choosePageIndex: '',
      pcModuleList: {
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
      pageType: ''
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
    'pcModuleList.list': {
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
    // 解决火狐浏览器的拖拽 搜索问题
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
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

      res.data && res.data.map(item => {
        channelCodeList.push(item.channelCode)
        channelCodeListChildren.push({
          html: item.channelName,
          label: item.channelCode,
          tag: 'el-checkbox'
        })
      })

      // 对于 editPageConfig 修改里面的 channelCodeList 参数
      editPageConfig.model.channelCodeList = this.$portal.deepClone(channelCodeList)
      const index = editPageConfig.fields.findIndex(row => row.prop === 'channelCodeList')
      if (index > -1) {
        editPageConfig.fields[index].children = this.$portal.deepClone(channelCodeListChildren)
      }
    },
    async getPageConfig() {
      // 页面配置修改从后端读取 原来是放在@/components/page-list/config中
      const res = await this.cmsApi.getPageConfig({
        platform: 1
      })
      this.pageList = res.data
    },
    dealParamsPageType() {
      if (this.$route.params.type) {
        this.choosePageIndex = this.pageList.findIndex(
          item => item.type === +this.$route.params.type
        )
        this.showPageListFlag = false
      } else {
        this.choosePageIndex = 0
      }
    },
    async init() {
      this.codeList = this.pageList[this.choosePageIndex].codeList
      await this.getPageIdList()
      this.pageType = this.pageList[this.choosePageIndex].type
      const index = this.pageIdList.findIndex(item => {
        return item.type === this.pageType
      })
      if (index > -1) {
        this.pageId = this.pageIdList[index].id
      } else {
        // 如果该页面没有生产pageId 调接口 再生成一个
        await this.addCmsTemplate(this.pageType)
      }
      // 拿到当前pageId 去拿当前页面的数据
      await this.getPageInfo()
    },
    async getPageIdList() {
      const res = await this.cmsApi.getCmsTemplate({ id: this.templateId })
      this.pageIdList = res.data.pageList
    },
    async getPageInfo() {
      const res = await this.cmsApi.getPageInfo({
        pageId: this.pageId,
        resortTabModule: 0
      })
      if (res.data.moduleList) {
        //  处理成页面的数据
        const data = res.data.moduleList
        data.map(item => {
          const pcListConfigClone = this.$portal.deepClone(pcListConfig)
          const index = pcListConfigClone.findIndex(row => {
            return row.code === item.templateCode
          })
          item.model = item.templateVariable
          item.code = item.templateCode
          item.fields = pcListConfigClone[index].fields
          item.rules = pcListConfigClone[index].rules
          item.name = pcListConfigClone[index].name
          this.handleGoodsForType(item)
        })
        this.pcModuleList.list = data
      } else {
        this.pcModuleList.list = []
      }
      this.$nextTick(() => {
        // 第一次进入判断成页面没有进行编辑 如果编辑 返回会提示的
        this.dataChangeFlag = false
      })
      this.dealGlobalPageInfo(res.data)
      this.dealReleaseTime(res.data)
      return res
    },
    handleGoodsForType(item) {
      if (+this.pageType === 18) {
        if (item.fields) {
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
    },
    dealGlobalPageInfo(data) {
      const pageInfo = this.$portal.deepClone(editPageConfig)
      if (data.channelList && data.channelList.length > 0) {
        pageInfo.model.channelCodeList = data.channelList.map(
          item => item.channel
        )
      }
      pageInfo.model.lang = data.lang
      pageInfo.model.name = data.name
      pageInfo.model.displayTitle = data.displayTitle
      pageInfo.model.bgColor = data.bgColor
      pageInfo.model.startDate = data.startDate

      this.pageForm = pageInfo
    },
    async addCmsTemplate(type) {
      const res = await this.cmsApi.addCmsTemplate({
        id: this.templateId,
        platform: 1,
        pageType: type
      })
      this.pageIdList.push(res.data.pageList)
      this.pageId = res.data.pageList[0].id
    },
    validateOne($form, callback) {
      if (!($form && $form.validate)) {
        callback([true, '没有找到验证表单'])
        return
      }
      $form.validate(valid => {
        if (valid) {
          callback([false, valid])
        } else {
          callback([true, $form.$attrs.name])
        }
      })
    },
    validatePage() {
      let flag = true
      this.$refs.editPage.$refs.editPageForm.validate(valid => {
        flag = valid
      })
      return flag
    },
    validateAll() {
      return new Promise(resolve => {
        const formList = this.$refs.editList.$refs.editForm
        // console.log('this.$refs.editList', this.$refs.editList, formList)
        if (!(formList && formList.length)) {
          resolve([true, '不能保存空模板'])
          return
        }

        const formLen = formList.length
        let loadIndex = 0
        const rtv = {}
        let hasError = false

        formList.forEach(($form, index) => {
          this.validateOne($form, res => {
            loadIndex += 1
            rtv[index] = res
            this.$set(this.pcModuleList.list[index], 'hasError', res[0])
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
        type: this.pageType,
        ...this.pageForm.model
      }
      if (params.bgColor === null) {
        params.bgColor = ''
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
      const data = this.$portal.deepClone(this.pcModuleList.list)
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
      // debugger
      const [err, msg] = await this.validateAll()
      // console.log('err', err, msg)
      const pageFlag = this.validatePage()
      if (!pageFlag) {
        this.showEditPage = true
      }
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
      this.dataChangeFlag = false
      const res = await this.getPageInfo()
      return res
    },
    changeEditPageStatus() {
      this.showEditPage = false
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
        this.$cms.$api.cmsPage.releasePage({ id: this.pageId }).then(res => {
          this.$message.success(this.$t('发布成功'))
        })
      })
    },
    changePageIndex(index) {
      if (this.dataChangeFlag) {
        this.$confirm(
          this.$t('确认要切换页面吗，你的数据还没有保存?'),
          this.$t('提示'),
          {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'info'
          }
        ).then(() => {
          this.pcModuleList.index = 0
          this.choosePageIndex = index
        })
      } else {
        this.pcModuleList.index = 0
        this.choosePageIndex = index
      }
    },
    handleBack() {
      if (this.dataChangeFlag) {
        this.$confirm(
          this.$t('确认要返回吗，你的数据还没有保存?'),
          this.$t('提示'),
          {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'info'
          }
        ).then(() => {
          this.$router.push({
            name: 'CmsPageList'
          })
          this.$portal.delActiveView()
        })
      } else {
        this.$router.push({
          name: 'CmsPageList'
        })
        this.$portal.delActiveView()
      }
    },
    async previewPage() {
      const res = await this.handleSubmit()
      if (res === false) return
      if (res.data && res.data.channelList && res.data.channelList.length > 0) {
        const index = res.data.channelList.findIndex(item => item.channel === '110001')
        const url = res.data.channelList[index].previewUrl + '&preview=1'
        window.open(url)
      }
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
        id: this.pageId,
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
    dealReleaseTime(data) {
      if (data.isTimingRelease === 1) {
        this.releaseSuccessFlag = true
        this.pageReleaseTime = data.releaseDate
      } else {
        this.releaseSuccessFlag = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.h5-edit {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  .header {
    background: #ffffff;
    height: 50px;
    line-height: 50px;
    box-shadow: 0 1px 5px 0 #e5e5e5;
    border-bottom: 1px solid #e6e6e6;
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
