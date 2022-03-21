<template>
  <section>
    <div class="login-title">
      <a href="#" class="cp-logo">
        <span class="left">
          <img :src="websiteInfo.websiteLogo" width="41" height="41" alt="" style="border-style: none;">
        </span>
        <span class="right">{{ websiteInfo.websiteTitle }}</span>
      </a>
    </div>
    <div class="authCard" style="margin-top: 50px;">
      <div class="auth_center auth_split_div" style="position: relative;width: 400px">
        <el-row :gutter="12">
          <el-col :span="8">
            <div class="auth_split_div auth_image">
              <svg t="1596693094366" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3710" width="200" height="200">
                <path d="M139.636364 0h744.727272a139.636364 139.636364 0 0 1 139.636364 139.636364v744.727272a139.636364 139.636364 0 0 1-139.636364 139.636364H139.636364a139.636364 139.636364 0 0 1-139.636364-139.636364V139.636364a139.636364 139.636364 0 0 1 139.636364-139.636364z m496.733091 789.426424a12.132848 12.132848 0 0 0 12.815515-12.815515V582.438788a97.326545 97.326545 0 0 0-91.229091-99.793455h-96.19394a97.093818 97.093818 0 0 0-91.042909 99.793455v194.172121a12.132848 12.132848 0 0 0 12.815515 12.815515h252.83491z m-320.698182 0a11.915636 11.915636 0 0 0 12.567272-12.815515V574.339879a10.115879 10.115879 0 0 0-2.466909-10.333091 10.348606 10.348606 0 0 0-8.998788-3.816727h-39.098181a76.644848 76.644848 0 0 0-75.962182 75.729454v140.25697a12.148364 12.148364 0 0 0 12.598303 12.8h101.360485v0.465454z m489.720242 0a12.132848 12.132848 0 0 0 12.8-12.815515v-140.691394a76.412121 76.412121 0 0 0-75.962182-76.86206h-39.098181c-2.699636 0-7.64897 1.132606-8.998788 3.832242a25.801697 25.801697 0 0 0-2.466909 10.333091v202.27103a11.915636 11.915636 0 0 0 12.582787 12.815515l101.143273 1.117091zM730.763636 540.175515a89.894788 89.894788 0 1 0-88.544969-89.894788 88.793212 88.793212 0 0 0 88.560485 89.894788z m-439.140848 0a88.54497 88.54497 0 0 0 88.54497-89.894788 88.560485 88.560485 0 1 0-177.105455 0 88.560485 88.560485 0 0 0 88.560485 89.894788z m218.220606-78.196363a114.191515 114.191515 0 0 0 113.943273-115.308607 113.943273 113.943273 0 1 0-227.886546 0 114.393212 114.393212 0 0 0 113.943273 115.293091z" fill="#F1B619" p-id="3711" />
              </svg>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="auth_split_div" style="width: 100px;margin-top: 24%;">
              <div class="position-relative bg-green text-center" style="border-radius: 50%; width:32px; height:32px;margin: auto auto;">
                <svg style="margin-top: 8px!important;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                  <path fill="#fff" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                </svg>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="auth_split_div auth_image">
              <img :src="userInfo.headPicUrl" :alt="userInfo.username || userInfo.nickname">
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="text-align: center;margin-top: 25px">
        <h2>{{ $t('授权 => ') }} {{ authProject.projectName }}</h2>
        <div style="margin-top: 5px">{{ authProject.projectDomain }}</div>
      </div>
    </div>
    <el-card shadow="never" class="authCard" style="margin-top: 20px;text-align: center;">
      <div class="select_div">
        <span>授权类型：</span>
        <el-select v-model="authorization.authType" :clearable="false" name="authorization_authType" class="ody_select">
          <el-option v-for="item in authTypeList" :key="item.key" :label="item.value" :value="item.key"/>
        </el-select>
      </div>
      <div v-if="authorization.authType === 2" class="select_div">
        <span>请选择商家：</span>
        <ody-merchant-select v-model="authorization.merchantId" name="authorization_merchantId" class="ody_select" value-key="merchantId" />
      </div>
      <div v-if="authorization.authType === 3" class="select_div">
        <span>请选择店铺：</span>
        <ody-store-select v-model="authorization.storeId" name="authorization_storeId" class="ody_select" value-key="storeId" />
      </div>
      <div>
        <p>将允许 <span class="p_name">{{ authProject.projectName }}</span> 进行一下操作</p>
        <div>
          <ul v-if="authorization.authType === 1">
            <li>操作商家商品数据</li>
            <li>操作商家订单数据</li>
          </ul>
          <ul v-if="authorization.authType === 2">
            <li>操作商家商品数据</li>
            <li>操作商家订单数据</li>
          </ul>
          <ul v-if="authorization.authType === 3">
            <li>操作店铺订单数据</li>
            <li>操作店铺商品数据</li>
          </ul>
        </div>
      </div>
      <div style="margin-top: 10px">
        <el-button
          name="doCancel"
          size="small"
          @click="doCancel"
        >{{ $t('取消') }}</el-button>
        <el-button
          :disabled="!canAuth"
          name="doAuth"
          size="small"
          type="primary"
          @click="doAuth"
        >{{ $t('授权') }}</el-button>
      </div>
    </el-card>
  </section>
</template>

<script>
export default {
  name: 'Auth',
  data() {
    return {
      canAuth: true,
      authTypeList: [
        { key: 1, value: this.$t('用户所有权限') },
        { key: 2, value: this.$t('商家权限') },
        { key: 3, value: this.$t('店铺权限') }
      ],
      userInfo: {},
      websiteInfo: {},
      authProject: {},
      authorization: {
        authType: 1
      },
      storeMap: {},
      merchantMap: {},
      appKey: this.$route.query.appKey,
      redirectUrl: this.$route.query.redirectUrl
    }
  },
  async mounted() {
    await this.init()
  },
  async activated() {
    // await this.init()
  },
  methods: {
    async init() {
      if (!this.appKey || !this.redirectUrl) {
        await this.doCancel(this.$t(((!this.appKey) ? 'appKey' : 'redirectUrl') + ' 不能为空'))
        return
      }
      await this.$ouser.$api.openAuth.getUserInfo().then(res => {
        this.userInfo = res || {}
      })
      await this.$ouser.$api.openAuth.queryByAppKey({ appKey: this.appKey }).then(res => {
        this.authProject = res.data || {}
        this.authorization.authProjectId = this.authProject.id
        this.authorization.authProjectName = this.authProject.projectName
      })
      if (!this.authProject.id) {
        await this.doCancel('appKey 不存在')
        return
      }
      await this.$ouser.$api.openAuth.getStringValue({ key: 'adminSetting' }).then(res => {
        this.websiteInfo = JSON.parse(res.data)
      })
      this.initMerchant()
      this.initStore()
    },
    async doAuth() {
      this.canAuth = false
      try {
        await this.auth()
      } finally {
        this.canAuth = true
      }
    },
    async auth() {
      if (this.authProject === null || this.authProject.id === null) {
        await this.doCancel('appKey 不存在')
        return
      }
      if (this.authorization.authType === null || this.authorization.authType === '') {
        this.$message(this.$t('请选择授权类型'))
        return
      }
      if (this.authorization.authType === 2) {
        if (this.authorization.merchantId == null) {
          this.$message(this.$t('请选择授权商家'))
          return
        }
      } else {
        this.authorization.merchantId = null
        this.authorization.merchantName = null
      }
      if (this.authorization.authType === 3) {
        if (this.authorization.storeId == null) {
          this.$message(this.$t('请选择授权店铺'))
          return
        }
      } else {
        this.authorization.storeId = null
        this.authorization.storeName = null
      }
      if (this.authorization.storeId) {
        const store = this.storeMap[this.authorization.storeId]
        this.authorization.storeName = store.storeName
        this.authorization.merchantId = store.merchantId
        this.authorization.merchantName = store.merchantName
      }
      if (this.authorization.merchantId) {
        const merchant = this.merchantMap[this.authorization.merchantId]
        this.authorization.merchantName = merchant.merchantName
      }
      await this.$ouser.$api.openAuth.authorization(this.authorization).then(res => {
        if (res.code === '0' && res.data) {
          const authCode = res.data.authCode
          this.$message.success(this.$t('授权成功！'))
          if (!this.redirectUrl.trim().toLowerCase().startsWith('http')) {
            this.redirectUrl = 'http://' + this.redirectUrl.trim()
          }
          if (this.redirectUrl.indexOf('&') > 0) {
            location.href = this.redirectUrl + '&authCode=' + authCode
          } else {
            location.href = this.redirectUrl + '?authCode=' + authCode
          }
        } else {
          this.$message.error(this.$t('授权失败！'))
        }
      })
    },
    async doCancel(message) {
      if (message) {
        await this.$confirm(message, this.$t('错误'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'error'
        })
      }
      this.$portal.delActiveViewAndRefresh()
    },
    initMerchant() {
      const vue = this
      this.$ouser.$api.openAuth.queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 }).then(res => {
        res.data.listObj.map(item => {
          vue.merchantMap[item.merchantId] = item
        })
      })
    },
    initStore() {
      const vue = this
      this.$ouser.$api.openAuth.queryPlatformAuthStorePage({ currentPage: 1, itemsPerPage: 500 }).then(res => {
        res.data.listObj.map(item => {
          vue.storeMap[item.storeId] = item
        })
      })
    }
  }
}
</script>

<style scoped>
  .authCard {
    width: 50%;
    margin: auto;
  }
  .auth_split_div {
    margin: auto;
  }
  .auth_center:before {
    position: absolute;
    top: 50%;
    width: 100%;
    content: "";
    border-bottom: 2px dashed #e1e4e8;
  }
  .auth_image {
    width: 96px;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: none!important;
  }
  .auth_image img {
    width: 96px;
    height: 96px;
  }
  .select_div {
    margin-top: 10px;
  }
  .ody_select {
    width: 150px;
    display: inline-block
  }
  .p_name {
    font-weight: bold;
  }
  .text-center {
    text-align: center!important;
  }
  .position-relative {
    position: relative!important;
  }
  .bg-green {
    background-color: #28a745!important;
  }
  .login-title {
    position: absolute;
    top: 20px;
    left: 20px;
    color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: var(--themeColor);
  }
  .cp-logo {
    display: block;
    cursor: pointer;
    position: relative;
    color: inherit;
    text-decoration: none;
  }
  .cp-logo .left {
    display: inline-block;
    vertical-align: top;
    width: 41px;
    height: 41px;
    margin-right: 5px;
  }
  .cp-logo .right {
    display: inline-block;
    vertical-align: top;
    height: 41px;
    line-height: 38px;
    font-size: 28px;
    color: #fff;
    margin-right: 10px;
    letter-spacing: 4px;
    font-weight: 400;
  }
  .authCard ul {
    list-style:none;
    padding: 10px;
    margin: 0px;
  }
  .authCard ul li {
    padding: 3px 0px;
  }
</style>
