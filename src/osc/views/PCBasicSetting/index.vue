<template>
  <div>
    <section>
      <!--table域-->
      <ody-list-table-area>
        <div slot="tabs">
          <div slot="tabs">
            <el-tabs v-model="tabModel" name="tabModel" @tab-click="handleClickPanel">
              <el-tab-pane :label="$t('前台基本信息')" name="first"/>
              <el-tab-pane :label="$t('后台基本信息')" name="second"/>
            </el-tabs>
          </div>
        </div>
        <div v-if="tabsContent === 'backBasicSetting'" slot="table">

          <el-form ref = "backBasicSetting" :rules="backBasicSettingRules" :model="backBasicSetting" style="margin-left: 70px; margin-top: 50px;" label-width="150px">
            <el-form-item :label="$t('后台网站域名')">
              {{ backBasicSetting.websiteDomain }}
            </el-form-item>
            <el-form-item :label="$t('网站负责人')" prop="websiteLeader">
              <el-input v-model="backBasicSetting.websiteLeader" :placeholder="$t('网站负责人')" name="backBasicSetting_websiteLeader"/>
            </el-form-item>
            <el-form-item :label="$t('联系电话')" prop="websiteContactPhone">
              <el-input v-model="backBasicSetting.websiteContactPhone" :placeholder="$t('联系电话')" name="backBasicSetting_websiteContactPhone"/>
            </el-form-item>
            <el-form-item :label="$t('后台logo')">
              <ody-upload-image :file-list.sync="websiteLogo"/>
            </el-form-item>
            <el-form-item :label="$t('后台title图片')">
              <ody-upload-image :file-list.sync="websiteTitleImg"/>
            </el-form-item>
            <el-form-item :label="$t('后台背景图片')">
              <ody-upload-image :file-list.sync="backImgUrl"/>
            </el-form-item>
            <el-form-item :label="$t('网站favicon')">
              <ody-upload-image :file-list.sync="websiteFavicon" :limit = "1"/>
            </el-form-item>
            <el-form-item :label="$t('网站后台标题')" prop="websiteTitle">
              <el-input v-model="backBasicSetting.websiteTitle" :placeholder="$t('网站后台标题')" name="backBasicSetting_websiteTitle"/>
            </el-form-item>
            <el-form-item :label="$t('后台版权信息')">
              <el-input v-model="backBasicSetting.websiteRight" :placeholder="$t('后台版权信息')" name="backBasicSetting_websiteRight"/>
            </el-form-item>
          </el-form>

          <div slot="btn">
            <el-row style="margin-top: 30px; text-align: center;">
              <el-button v-if="tabsContent === 'backBasicSetting'" name="saveBackSetting" style="width: 150px;" size="small" type="primary" @click="saveBackSetting">{{ $t('保存') }}</el-button>
            </el-row>
          </div>
        </div>

        <div v-if="tabsContent === 'frontBasicSetting'" slot="table">
          <el-form ref = "frontBasicSetting" :rules="frontBasicSettingRules" :model="frontBasicSetting" style="margin-left: 70px; margin-top: 50px;" label-width="150px">
            <el-form-item :label="$t('网站前台网址')">
              {{ frontBasicSetting.websiteDomain }}
            </el-form-item>
            <el-form-item :label="$t('网站名称')" prop="websiteName">
              <el-input v-model="frontBasicSetting.websiteName" :placeholder="$t('网站名称')" name="frontBasicSetting_websiteName"/>
            </el-form-item>
            <el-form-item :label="$t('网站标题')" prop="websiteTitle">
              <el-input v-model="frontBasicSetting.websiteTitle" :placeholder="$t('网站标题')" name="frontBasicSetting_websiteTitle"/>
            </el-form-item>
            <el-form-item :label="$t('网站默认LOGO')" prop="websiteLogoFront">
              <ody-upload-image :file-list.sync="websiteLogoFront"/>
            </el-form-item>
            <el-form-item :label="$t('个人中心LOGO')" prop="personPageLogo">
              <ody-upload-image :file-list.sync="personPageLogo"/>
            </el-form-item>
            <el-form-item :label="$t('网站favicon')">
              <ody-upload-image :file-list.sync="websiteFaviconFront" :limit = "1"/>
            </el-form-item>
            <el-form-item :label="$t('前台版权信息')">
              <el-button name="initRightDialog" style="width: 150px;" size="small" type="primary" @click="initRightDialog">{{ $t('查看并修改') }}</el-button>
            </el-form-item>
            <el-form-item :label="$t('商城用户注册协议')">
              <el-button name="initRegisterDialog" style="width: 150px;" size="small" type="primary" @click="initRegisterDialog">{{ $t('查看并修改') }}</el-button>
            </el-form-item>
            <el-form-item :label="$t('页尾图片')" prop="footImageName">
              <div>
                <el-input v-model="footImageName" :placeholder="$t('页尾图片名称')" name="footImageName"/>
                <ody-upload-image :file-list.sync="footerImageURL"/>
              </div>
            </el-form-item>
            <el-form-item :label="$t('热线电话')" prop="footerPhoneName">
              <div>
                <el-input v-model="footBasicSetting.footerPhoneName" :placeholder="$t('热线电话名称')" name="footBasicSetting_footerPhoneName"/>
                <el-input v-model="footPhone1" :placeholder="$t('热线电话1')" name="footPhone1"/>
                <el-input v-model="footPhone2" :placeholder="$t('热线电话2')" name="footPhone2"/>
              </div>
            </el-form-item>
            <el-form-item :label="$t('工作时间')" prop="footerWorktimeName">
              <div>
                <el-input v-model="footBasicSetting.footerWorktimeName" :placeholder="$t('工作时间名称')" name="footBasicSetting_footerWorktimeName"/>
                <el-input v-model="footBasicSetting.footerWorktime" :placeholder="$t('工作时间')" name="footBasicSetting_footerWorktime"/>
              </div>
            </el-form-item>
          </el-form>

          <div slot="btn">
            <el-row style="margin-top: 30px; text-align: center;">
              <el-button v-if="tabsContent === 'frontBasicSetting'" name="saveFrontSetting" style="width: 150px;" size="small" type="primary" @click="saveFrontSetting">{{ $t('保存') }}</el-button>
            </el-row>
          </div>
        </div>

    </ody-list-table-area></section>
    <div >
      <ody-dialog :visible.sync="websiteRightDialog.show" :title="websiteRightDialog.title">
        <div>
          <ody-tinymce :height="300" v-model="websiteRightDialog.obj.websiteRight" name="websiteRightDialog_obj_websiteRight"/>
          <el-row style="margin-top: 30px; text-align: center;">
            <el-button name="websiteRightDialog_show" style="width: 150px;" size="small" @click="websiteRightDialog.show = false">{{ $t('取消') }}</el-button>
            <el-button name="saveSitRight" style="width: 150px;" size="small" type="primary" @click="saveSitRight">{{ $t('保存') }}</el-button>
          </el-row>
        </div>
      </ody-dialog>
      <ody-dialog :visible.sync="registerDialog.show" :title="registerDialog.title">
        <el-form ref = "registerDialog" :rules="registerDialogRules" :model="registerDialog.obj" style="margin-top: 50px;" label-width="150px">
          <el-form-item :label="$t('注册协议名称')" prop="registerProtocolName">
            <el-input v-model="registerDialog.obj.registerProtocolName" :placeholder="$t('注册协议名称')" name="registerDialog_obj_registerProtocolName"/>
          </el-form-item>
        </el-form>
        <div>
          <ody-tinymce :height="300" v-model="registerDialog.obj.registerProtocol" name="registerDialog_obj_registerProtocol"/>
          <el-row style="margin-top: 30px; text-align: center;">
            <el-button name="registerDialog_show" style="width: 150px;" size="small" @click="registerDialog.show = false">{{ $t('取消') }}</el-button>
            <el-button name="saveRegister" style="width: 150px;" size="small" type="primary" @click="saveRegister">{{ $t('保存') }}</el-button>
          </el-row>
        </div>
      </ody-dialog>
    </div>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  name: 'OscPCBasicSetting',
  data() {
    // const self = this
    return {
      tabsContent: '',
      tabModel: {},
      websiteLogo: [],
      websiteTitleImg: [],
      backImgUrl: [],
      websiteFavicon: [],
      websiteLogoFront: [],
      websiteFaviconFront: [],
      personPageLogo: [],
      footerImageURL: [],
      backBasicSetting: {},
      frontBasicSetting: {},
      footBasicSetting: {},
      footerImageName: '',
      footImageName: '',
      footPhone1: '',
      footPhone2: '',
      websiteRightDialog: { show: false, title: '', obj: {}},
      registerDialog: { show: false, title: '', obj: {}},
      backBasicSettingRules: {
        websiteLeader: [
          { required: true, message: '请输入负责人', trigger: 'change' }
        ],
        websiteContactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'change' }
        ],
        websiteTitle: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ]
      },
      frontBasicSettingRules: {
        // websiteName: [
        //   { required: true, message: '请输入网站名称', trigger: 'change' }
        // ],
        // websiteLogoFront: [
        //   { required: true, message: '请上传logo', trigger: 'change' }
        // ],
        // personPageLogo: [
        //   { required: true, message: '请上传logo', trigger: 'change' }
        // ],
        // footImageName: [
        //   { required: true, message: '请上传页尾图片', trigger: 'change' }
        // ],
        // footerWorktimeName: [
        //   { required: true, message: '请输入工作时间', trigger: 'change' }
        // ],
        // websiteTitle: [
        //   { required: true, message: '请输入标题', trigger: 'change' }
        // ],
        // footerPhoneName: [
        //   { required: true, message: '请输入热线电话', trigger: 'change' }
        // ]
      },
      registerDialogRules: {
        registerProtocolName: [
          { required: true, message: '请输入注册协议名称', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const self = this
      self.tabsContent = 'frontBasicSetting'
      self.initFrontSetting()
      self.tabModel = 'first'
    },
    initRightDialog() {
      const self = this
      const basicSettingService = this.$osc.$api.basicSettingService
      basicSettingService.getWebsiteRight({}).then(res => {
        self.websiteRightDialog.obj = res.resultData
        self.websiteRightDialog.show = true
        self.websiteRightDialog.title = '编辑版权信息'
      })
    },
    saveSitRight() {
      const self = this
      const basicSettingService = this.$osc.$api.basicSettingService
      basicSettingService.saveWebsiteRight(self.websiteRightDialog.obj).then(res => {
        self.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    initRegisterDialog() {
      const self = this
      const basicSettingService = this.$osc.$api.basicSettingService
      basicSettingService.getRegisterProtocol({}).then(res => {
        self.registerDialog.obj = res.resultData
        self.registerDialog.show = true
        self.registerDialog.title = '编辑用户协议'
      })
      self.registerDialog.show = false
    },
    saveRegister() {
      const self = this
      const basicSettingService = this.$osc.$api.basicSettingService
      self.$refs['registerDialog'].validate((valid) => {
        if (valid) {
          basicSettingService.saveRegisterProtocol(self.registerDialog.obj).then(res => {
            self.$message({
              message: '修改成功',
              type: 'success'
            })
          })
          self.registerDialog.show = false
        }
      })
    },
    saveBackSetting() {
      const self = this
      const basicSettingService = this.$osc.$api.basicSettingService

      self.buildSaveBackSetting()
      self.$refs['backBasicSetting'].validate((valid) => {
        if (valid) {
          basicSettingService.saveBackBasicSetting(util.copy(self.backBasicSetting)).then(res => {
            self.$message({
              message: '修改成功',
              type: 'success'
            })
          })
        }
      })
    },
    saveFrontSetting() {
      const self = this
      const basicSettingService = this.$osc.$api.basicSettingService
      self.buildSaveFrontSetting()

      self.$refs['frontBasicSetting'].validate((valid) => {
        basicSettingService.saveFrontBasicSetting(self.frontBasicSetting).then(res => {
          self.$message({
            message: '修改成功',
            type: 'success'
          })
        })
        self.buildSaveFootSetting()
        basicSettingService.saveFrontPageFooterSetting(self.footBasicSetting).then(res => {
          self.$message({
            message: '修改成功',
            type: 'success'
          })
        })
      })
    },
    initBackSetting() {
      const self = this
      self.backBasicSetting = {}
      const basicSettingService = this.$osc.$api.basicSettingService
      basicSettingService.getBackBasicSetting().then(res => {
        self.backBasicSetting = res.resultData
        self.initBackImg()
      })
    },
    initFrontSetting() {
      const self = this
      self.frontBasicSetting = {}
      self.footBasicSetting = {}
      self.footBasicSetting = {}
      self.footerImageURL = []
      const basicSettingService = this.$osc.$api.basicSettingService
      basicSettingService.getFrontBasicSetting().then(res => {
        self.frontBasicSetting = res.resultData
        self.initFrontImg()
        basicSettingService.getPageFooterSetting({}).then(res => {
          self.footBasicSetting = res.resultData
          self.footImageName = self.footBasicSetting.footerImageArray[0].footerImageName
          self.footerImageURL = [{ 'url': res.resultData.footerImageArray[0].footerImageURL }]
          self.footPhone1 = self.footBasicSetting.footerPhoneArray[0]
          self.footPhone2 = self.footBasicSetting.footerPhoneArray[1]
        }).catch(e => {
          self.footBasicSetting.footerPhoneArray = ['', '']
          console.log(e)
        })
      })
    },
    buildSaveFrontSetting() {
      const self = this

      if (self.websiteLogoFront.length > 0) {
        self.frontBasicSetting.websiteLogo = self.websiteLogoFront[0].url
      } else {
        self.frontBasicSetting.websiteLogo = ''
      }
      if (self.personPageLogo.length > 0) {
        self.frontBasicSetting.personPageLogo = self.personPageLogo[0].url
      } else {
        self.frontBasicSetting.personPageLogo = ''
      }
      if (self.websiteFaviconFront.length > 0) {
        self.frontBasicSetting.websiteFavicon = self.websiteFaviconFront[0].url
      } else {
        self.frontBasicSetting.websiteFavicon = ''
      }
    },
    buildSaveFootSetting() {
      const self = this
      console.log(self.footerImageURL)
      self.footBasicSetting.footerImageArray[0].footerImageURL = self.footerImageURL[0].url
      self.footBasicSetting.footerImageArray[0].footerImageName = self.footImageName

      self.footBasicSetting.footerPhoneArray[0] = self.footPhone1
      self.footBasicSetting.footerPhoneArray[1] = self.footPhone2
    },
    buildSaveBackSetting() {
      const self = this

      if (self.websiteLogo.length > 0) {
        self.backBasicSetting.websiteLogo = self.websiteLogo[0].url
      } else {
        self.backBasicSetting.websiteLogo = ''
      }
      if (self.websiteTitleImg.length > 0) {
        self.backBasicSetting.websiteTitleImg = self.websiteTitleImg[0].url
      } else {
        self.backBasicSetting.websiteTitleImg = ''
      }
      if (self.backImgUrl.length > 0) {
        self.backBasicSetting.backImgUrl = self.backImgUrl[0].url
      } else {
        self.backBasicSetting.backImgUrl = ''
      }
      if (self.websiteFavicon.length > 0) {
        self.backBasicSetting.websiteFavicon = self.websiteFavicon[0].url
      } else {
        self.backBasicSetting.websiteFavicon = ''
      }
    },
    initBackImg() {
      const self = this
      self.websiteLogo = []
      self.websiteTitleImg = []
      self.backImgUrl = []
      self.websiteFavicon = []
      if (self.backBasicSetting.websiteLogo !== undefined && self.backBasicSetting.websiteLogo !== null) {
        var websitLogo = { 'url': self.backBasicSetting.websiteLogo }
        self.websiteLogo.push(websitLogo)
      }
      if (self.backBasicSetting.websiteTitleImg !== undefined && self.backBasicSetting.websiteTitleImg !== null) {
        var websiteTitleImg = { 'url': self.backBasicSetting.websiteTitleImg }
        self.websiteTitleImg.push(websiteTitleImg)
      }
      if (self.backBasicSetting.backImgUrl !== undefined && self.backBasicSetting.backImgUrl != null) {
        var backImgUrl = { 'url': self.backBasicSetting.backImgUrl }
        self.backImgUrl.push(backImgUrl)
      }

      if (self.backBasicSetting.websiteFavicon !== undefined && self.backBasicSetting.websiteFavicon != null) {
        var websiteFavicon = { 'url': self.backBasicSetting.websiteFavicon }
        self.websiteFavicon.push(websiteFavicon)
      }
    },
    initFrontImg() {
      const self = this
      self.websiteLogoFront = []
      self.personPageLogo = []
      self.websiteFaviconFront = []
      if (self.frontBasicSetting.websiteLogo !== undefined && self.frontBasicSetting.websiteLogo !== null) {
        var websiteLogoFront = { 'url': self.frontBasicSetting.websiteLogo }
        self.websiteLogoFront.push(websiteLogoFront)
      }
      if (self.frontBasicSetting.personPageLogo !== undefined && self.frontBasicSetting.personPageLogo !== null) {
        var personPageLogo = { 'url': self.frontBasicSetting.personPageLogo }
        self.personPageLogo.push(personPageLogo)
      }
      if (self.frontBasicSetting.websiteFavicon !== undefined && self.frontBasicSetting.websiteFavicon != null) {
        var websiteFaviconFront = { 'url': self.frontBasicSetting.websiteFavicon }
        self.websiteFaviconFront.push(websiteFaviconFront)
      }
    },
    handleClickPanel(data) {
      const self = this
      console.log(self.tabModel)
      if (data.index === '0') {
        self.tabsContent = 'frontBasicSetting'
        self.initFrontSetting()
      } else {
        self.tabsContent = 'backBasicSetting'
        self.initBackSetting()
      }
    }
  }
}
</script>
