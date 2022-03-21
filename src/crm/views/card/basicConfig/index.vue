<template>
  <div slot="tabs">
    <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick">
      <!--卡基础设置-->
      <el-tab-pane :label="$t('cash_config')">
        <el-form ref="form" :model="serviceChargeInfo" style="margin-top: 10px;margin-left: 30px;">
          <el-form-item :label="$t('service_charge')">
            <el-row>
              <el-col :span="3">
                <ody-input-number
                  v-model="serviceChargeInfo.value"
                  :decimal="2"
                  :min="0.01"
                  :max="999"
                  name="serviceChargeInfo_value"
                  style="margin-left: 10px"
                />
              </el-col>
              <el-col :span="7" style="margin-left: 10px">
                <sapn>{{ $t('labelYuan') }}</sapn>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center" style="margin-top: 30px;">
              <el-col :span="21">
                <ody-button
                  name="GiftCardBasicConfig01_updateServiceChargeRule"
                  size="small"
                  type="primary"
                  code="GiftCardBasicConfig01"
                  @click="updateServiceChargeRule"
                >{{ $t('preservation') }}</ody-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!--礼品卡分享配置-->
      <el-tab-pane :label="$t('gift_card_share_config')">
        <el-form ref="form" :model="cardInfo">
          <el-form-item :label="$t('share_title')">
            <el-row>
              <el-col :span="14">
                <el-input
                  v-model="cardInfo.title"
                  :placeholder="$t('limit_char_30')"
                  name="cardInfo_title"
                  maxlength="30"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('share_describe')" class="inner-form">
            <el-row>
              <el-col :span="14">
                <el-input
                  v-model="cardInfo.description"
                  :placeholder="$t('limit_char_50')"
                  name="cardInfo_description"
                  maxlength="50"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('share_photo')">
            <el-row style="margin-top: 20px">
              <div style="float: left;width: 300px;margin-top: -5px">
                <ody-upload-image
                  :file-list.sync="cardFileList"
                  :pic-type="picType"
                  :pic-size="2048"
                  :multiple="false"
                  @error="error"
                />
              </div>
              <div style="float: left;margin-top: -5px">
                <span class="info_class">
                  {{ $t('upload_photo_tip') }}
                  <el-link type="primary">
                    <a :href="sysImageGiftCard" target="_blank">{{ $t('click_default_gift_image') }}</a>
                  </el-link>
                </span>
              </div>
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-row type="flex" justify="center" style="margin-top: 30px">
              <el-col :span="10">
                <ody-button
                  name="GiftCardBasicConfig02_updateCardInfoRule"
                  size="small"
                  type="primary"
                  code="GiftCardBasicConfig02"
                  @click="updateCardInfoRule"
                >{{ $t('preservation') }}</ody-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!--提货卡分享设置-->
      <el-tab-pane :label="$t('pick_up_card_share_config')">
        <el-form ref="form" :model="pickUpCardInfo">
          <el-form-item :label="$t('title')">
            <el-row>
              <el-col :span="14">
                <el-input
                  v-model="pickUpCardInfo.title"
                  :placeholder="$t('limit_char_30')"
                  name="pickUpCardInfo_title"
                  maxlength="30"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('describe')" class="inner-form">
            <el-row>
              <el-col :span="14">
                <el-input
                  v-model="pickUpCardInfo.description"
                  :placeholder="$t('limit_char_50')"
                  name="pickUpCardInfo_description"
                  maxlength="50"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('photo')">
            <el-row style="margin-top: 20px">
              <div style="float: left;width: 300px;margin-top: -5px">
                <ody-upload-image
                  :file-list.sync="pickUpCardFileList"
                  :pic-type="picType"
                  :pic-size="2048"
                  :multiple="false"
                  @error="error"
                />
              </div>
              <div style="float: left;margin-top: -5px">
                <span class="info_class">
                  {{ $t('upload_photo_tip') }}
                  <el-link type="primary">
                    <a
                      :href="sysImagePickUpCard"
                      target="_blank"
                    >{{ $t('click_default_gift_image') }}</a>
                  </el-link>
                </span>
              </div>
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-row type="flex" justify="center" style="margin-top: 30px">
              <el-col :span="10">
                <ody-button
                  name="GiftCardBasicConfig03_updatePickUpCardInfoRule"
                  size="small"
                  type="primary"
                  code="GiftCardBasicConfig03"
                  @click="updatePickUpCardInfoRule"
                >{{ $t('preservation') }}</ody-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'GiftCardBasicConfig',
  components: {},
  data() {
    return {
      activeState: '0',
      loading: false,
      list: [],
      serviceChargeInfo: {
        value: 0
      },
      cardInfo: {
        title: null,
        description: null
      },
      pickUpCardInfo: {
        title: null,
        description: null
      },
      cardFileList: [],
      pickUpCardFileList: [],
      picType: ['png', 'jpg', 'jpeg'],
      sysImageGiftCard: null,
      sysImagePickUpCard: null
    }
  },
  watch: {
    cardFileList: function(newVal, oldVal) {
      if (newVal[0]) {
        this.cardInfo.imageUrl = newVal[0].url
      } else {
        this.cardInfo.imageUrl = ''
      }
    },
    pickUpCardFileList: function(newVal, oldVal) {
      if (newVal[0]) {
        this.pickUpCardInfo.imageUrl = newVal[0].url
      } else {
        this.pickUpCardInfo.imageUrl = ''
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      this.getServiceChargeInfo()
      this.getCardInfo()
      this.getPickUpCardInfo()
      this.getSystemImage()
    },
    async handleTabsClick() {
      try {
        this.switchTab(this.activeState)
      } catch (ex) {
        console.log(ex)
      }
    },
    switchTab(type) {
      this.type = Number(type)
      if (this.type === 0) {
        this.getServiceChargeInfo()
      } else if (this.type === 1) {
        this.getCardInfo()
      } else if (this.type === 2) {
        this.getPickUpCardInfo()
      }
    },
    async getSystemImage() {
      const res = await this.$crm.$api.common.codeListMulti({
        categorys: ['GIFT_CARD_SYS_IMAGE'],
        pool: 'social'
      })
      this.sysImageGiftCard = res.data.GIFT_CARD_SYS_IMAGE.defaultGiftCard
      this.sysImagePickUpCard = res.data.GIFT_CARD_SYS_IMAGE.defaultPickUpCard
    },
    async getServiceChargeInfo() {
      const vue = this
      const param = {
        type: 1,
        subType: 1,
        entityType: 1
      }
      const crmService = vue.$crm.$api.common
      crmService.getSocialRuleByType(param).then(result => {
        if (result.code === '0') {
          var obj = result.data
          vue.serviceChargeInfo.id = obj.id
          var param = JSON.parse(obj.param)
          vue.serviceChargeInfo.value = param.value
        }
      })
    },
    async getCardInfo() {
      const vue = this
      const param = {
        type: 1,
        subType: 2,
        entityType: 1
      }
      const crmService = vue.$crm.$api.common
      crmService.getSocialRuleByType(param).then(result => {
        if (result.code === '0') {
          var obj = result.data
          vue.cardInfo.id = obj.id
          var param = JSON.parse(obj.param)
          vue.cardInfo.title = param.title
          vue.cardInfo.description = param.description
          vue.cardInfo.imageUrl = param.imageUrl
          vue.cardFileList = []
          if (param.imageUrl) {
            vue.cardFileList.push({ url: param.imageUrl })
          }
        }
      })
    },
    async getPickUpCardInfo() {
      const vue = this
      const param = {
        type: 1,
        subType: 3,
        entityType: 1
      }
      const crmService = vue.$crm.$api.common
      crmService.getSocialRuleByType(param).then(result => {
        if (result.code === '0') {
          var obj = result.data
          vue.pickUpCardInfo.id = obj.id
          var param = JSON.parse(obj.param)
          vue.pickUpCardInfo.title = param.title
          vue.pickUpCardInfo.description = param.description
          vue.pickUpCardInfo.imageUrl = param.imageUrl
          vue.pickUpCardFileList = []
          if (param.imageUrl) {
            vue.pickUpCardFileList.push({ url: param.imageUrl })
          }
        }
      })
    },
    async updateCardInfoRule() {
      const vue = this
      var param = {
        title: vue.cardInfo.title,
        description: vue.cardInfo.description,
        imageUrl: vue.cardInfo.imageUrl
      }
      var updateParam = {
        id: vue.cardInfo.id,
        type: 1,
        subType: 2,
        entityType: 1,
        param: JSON.stringify(param)
      }
      const crmService = vue.$crm.$api.common
      crmService.updateSocialRule(updateParam).then(result => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('common_update_success')
          })
        }
      })
    },
    async updateServiceChargeRule() {
      const vue = this
      var param = {
        value: parseFloat(vue.serviceChargeInfo.value)
      }
      var updateParam = {
        id: vue.serviceChargeInfo.id,
        type: 1,
        subType: 1,
        entityType: 1,
        param: JSON.stringify(param)
      }
      const crmService = vue.$crm.$api.common
      crmService.updateSocialRule(updateParam).then(result => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('common_update_success')
          })
        }
      })
    },
    async updatePickUpCardInfoRule() {
      const vue = this
      var param = {
        title: vue.pickUpCardInfo.title,
        description: vue.pickUpCardInfo.description,
        imageUrl: vue.pickUpCardInfo.imageUrl
      }
      var updateParam = {
        id: vue.pickUpCardInfo.id,
        type: 1,
        subType: 3,
        entityType: 1,
        param: JSON.stringify(param)
      }
      const crmService = vue.$crm.$api.common
      crmService.updateSocialRule(updateParam).then(result => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('common_update_success')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
