<template>
  <div class="cms-link-url">

    <el-dialog :visible.sync="dialogVisible" :title="$t('设置链接地址')" :append-to-body="true" width="960px">
      <div class="tabs-wrapper">
        <el-tabs v-model="activeName" name="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(tab,tabIndex) in ConfigData.tabOptions" :key="tabIndex" :label="tab.label" :name="tab.name">
            <div v-if="tab.name==='custom'" class="custom-content-wrapper">
              <div class="custom-wrapper">
                <label class="custom-wrapper-tip">添加链接:</label>
                <el-input v-model="tab.link.data" :placeholder="$t('输入链接地址,外部链接请加上//')" name="link_data" clearable/>
              </div>
            </div>
            <div v-if="tab.name==='product'" class="product-wrapper">
              <cms-link-url-product v-model="link" :page-model="pageModel" :page-type="pageType" name="link"/>
            </div>
            <div v-if="tab.name==='search'" class="search-wrapper">
              <label class="custom-wrapper-tip">添加关键字:</label>
              <el-input v-model="tab.link.data" :placeholder="$t('输入搜索关键词')" name="link_data2" clearable/>
            </div>
            <div v-if="tab.name==='station'" class="station-wrapper">
              <label class="custom-wrapper-tip">站内页名称:</label>
              <el-select v-model="optionChecked" name="optionChecked" @change="handleChange">
                <el-option v-for="(option,optionIndex) in ConfigData.options" :key="optionIndex" :label="option.label" :value="option.value" />
              </el-select>
            </div>
            <div v-if="tab.name==='category'" class="category-wrapper">
              <el-form ref="form" :inline="true" :model="form" label-width="80px">
                <label v-for="(pagechannel,pagemodelchannelIndex) in pageModel.model.channelCodeList" :key="pagemodelchannelIndex">
                  <label v-for="(channel,channelIndex) in ConfigData.channel" :key="channelIndex">
                    <el-form-item v-if="pagechannel=== channel.code" :label="channel.label" label-width="auto">
                      <cms-link-url-category v-model="channel.link" :channel="channel.code" :page-type="pageType" name="channel_link"/>
                    </el-form-item>
                  </label>
                </label>
              </el-form>
            </div>
            <div v-if="tab.name==='promotion'" class="product-wrapper">
              <cms-link-url-page v-model="link" :page-model="pageModel" :page-type="pageType" :plat-form="platForm" name="link"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="linkurl-footer-wrapper">
        <el-button name="handleShowDialog" size="small" @click="handleShowDialog(false)">{{ $t('取消') }}</el-button>
        <el-button name="handleSubmit" type="primary" size="small" @click="handleSubmit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-button v-if="!showReault" :class="showtip?'link-url-tip':''" name="handleShowDialog9" type="text" @click="handleShowDialog(true)">{{ $t('设置链接到的页面地址') }}</el-button>
    <div v-if="showReault">
      <el-button type="success" size="small">{{ link.type }}</el-button>
      <el-button name="handleShowDialog6" type="text" @click="handleShowDialog(true)" >{{ $t('修改') }}</el-button>
      <el-button name="handleReset" type="text" @click="handleReset">{{ $t('清空') }}</el-button>
    </div>
  </div>
</template>

<script>
import CmsLinkUrlProduct from '@/components/cms-link-url-product'
import CmsLinkUrlCategory from '@/components/cms-link-url-category'
import CmsLinkUrlPage from '@/components/cms-link-url-page'
import ConfigData from './config.js'
export default {
  components: {
    CmsLinkUrlProduct,
    CmsLinkUrlCategory,
    CmsLinkUrlPage
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    showtip: {
      type: Boolean,
      default: true
    },
    pageModel: {
      type: Object,
      default: () => ({ model: {}})
    },
    pageType: {
      type: String,
      default: ''
    },
    platForm: { // 平台 1:PC ,2:H5
      type: Number,
      default: 2
    },
    formData: {
      type: Object,
      default: () => ({ model: { titleType: 0 }})

    }
  },
  data() {
    return {
      ConfigData: JSON.parse(JSON.stringify(ConfigData)),
      activeName: 'custom',
      dialogVisible: false,
      showReault: false,
      link: {
        status: true,
        type: '',
        data: '',
        appData: ''
      },
      chooseLabel: this.$t('自定义'),
      chooseName: 'custom',
      optionChecked: '/index.html',
      categoryValue: []
    }
  },
  watch: {
    value: {
      handler(val) {
        console.log('asdasdasd',val)
        if (val && val.type) {
          this.showReault = true
          this.link = this.value
        }
      },
      deep: true
    },
    pageType: {
      handler(val) {
        this.deleteConfigData()
        if (val === 18) { // 积分商城才允许配置我能兑换
          this.addConfigData()
        } else {
          this.showReault = false
          this.link = {}
          this.clearOption()
        }
      }
    }

  },
  async mounted() {
    const options = await this.$cms.$api.cmsEdit.getPublicPage({ key: 'station_config' })
    this.ConfigData.options = JSON.parse(options.data.value) || []
    if (this.value && this.value.type) {
      this.showReault = true
      this.link = this.value
    }
    this.deleteConfigData()
    if (this.pageType === 18) { // 积分商城才允许配置我能兑换
      this.addConfigData()
    }
  },
  methods: {
    async deleteConfigData() {
      if ((this.ConfigData.options.findIndex(item => item.value === '/search.html?canConversion=true')) !== -1) {
        this.ConfigData.options.splice(this.ConfigData.options.findIndex(item => item.value === '/search.html?canConversion=true'), 1)
      }
      if (+this.platForm === 1) {
        const valueLabel = ['砍价', '砍价单', '拼团', '我的团', '秒杀', '抽奖', '分类页', '领券中心', '社区']
        valueLabel.map(item => {
          const index = this.ConfigData.options.findIndex(row => row.label === item)
          if (index > -1) {
            this.ConfigData.options.splice(index, 1)
          }
        })
      }
      const res = await this.$cms.$api.common.getSwitcherBoolean({ key: 'live.switch' })
      if (!res.data) {
        const index = this.ConfigData.options.findIndex(row => row.label === '直播专区')
        if (index > -1) {
          this.ConfigData.options.splice(index, 1)
        }
      }
    },
    addConfigData() {
      this.ConfigData.options.push({ label: this.$t('我能兑换'), value: '/search.html?canConversion=true' })
    },
    initChoose(val) {
      const tempVal = this.$portal.deepClone(val || {})
      const type = tempVal && tempVal.type ? tempVal.type.split('|')[0] : this.$t('自定义')
      for (var item of this.ConfigData.tabOptions) {
        if (item.label === type) {
          this.activeName = item.name
          this.chooseLabel = item.label
          this.chooseName = item.name
          if (type === this.ConfigData.tabOptions[0].label) { // 自定义
            if (this.pageType === 18 && tempVal.data) {
              if (tempVal.data.indexOf('pageType=18&canConversion=true') !== -1) {
                if (tempVal.data.indexOf('?') === -1) {
                  tempVal.data = tempVal.data.split('?pageType=18&canConversion=true')[0]
                } else {
                  tempVal.data = tempVal.data.split('&pageType=18&canConversion=true')[0]
                }
              }
            }
          }
          if (type === this.ConfigData.tabOptions[1].label) { // 商品
            if (this.pageType === 18 && tempVal.data) {
              if (tempVal.data.indexOf('&pageType=18&canConversion=true') !== -1) {
                tempVal.data = tempVal.data.split('&pageType=18&canConversion=true')[0]
              }
            }
          }
          if (type === this.ConfigData.tabOptions[3].label) { // 站内页
            if (this.pageType === 18 && tempVal.data) {
              if (tempVal.data.indexOf('?canConversion=true&pageType=18') !== -1) {
                tempVal.data = tempVal.data.split('?canConversion=true&pageType=18')[0]
              }
            }
            this.optionChecked = tempVal.data || '/index.html'
          }
          if (type === this.ConfigData.tabOptions[2].label) { // 搜索页
            if (tempVal.data && tempVal.data.indexOf('?keyword=') !== -1) {
              tempVal.data = tempVal.type.split('|')[1] || ''
            }
          }
          if (type === this.ConfigData.tabOptions[4].label) { // 类目
            if (this.pageType === 18) {
              if (tempVal.BBC.data && tempVal.BBC.data.indexOf('&pageType=18&canConversion=true') !== -1) {
                tempVal.BBC.data = tempVal.BBC.data.split('&pageType=18&canConversion=true')[0]
              }
              if (tempVal.B2B.data && tempVal.B2B.data.indexOf('&pageType=18&canConversion=true') !== -1) {
                tempVal.B2B.data = tempVal.B2B.data.split('&pageType=18&canConversion=true')[0]
              }
              if (tempVal.O2O.data && tempVal.O2O.data.indexOf('&pageType=18&canConversion=true') !== -1) {
                tempVal.O2O.data = tempVal.O2O.data.split('&pageType=18&canConversion=true')[0]
              }
            }
          }
          if (type === this.ConfigData.tabOptions[5].label) { // 页面
            if (this.pageType === 18 && tempVal.data) {
              if (tempVal.data.indexOf('&pageType=18&canConversion=true') !== -1) {
                tempVal.data = tempVal.data.split('&pageType=18&canConversion=true')[0]
              }
            }
          }
          item.link = tempVal
        } else {
          item.link = {}
        }
      }
      if (tempVal && tempVal.category) {
        this.ConfigData.channel[0].link = tempVal.BBC
        this.ConfigData.channel[1].link = tempVal.B2B
        this.ConfigData.channel[2].link = tempVal.O2O
      }
      console.log('tempVal', tempVal)
    },

    handleShowDialog(val) {
      if (val) {
        this.initChoose(this.value)
      } else {
        this.ConfigData.channel[0].link = {}
        this.ConfigData.channel[1].link = {}
        this.ConfigData.channel[2].link = {}
      }
      this.dialogVisible = val
    },
    handleClick(tab, event) {
      this.chooseLabel = tab.label
      this.chooseName = tab.name
    },
    async handleSubmit() {
      this.setLinkData()
      // 如果不输入 确定按钮不通过
      if (Reflect.has(this.link, 'data') === false) {
        this.$message(this.$t('内容不能为空'))
        return
      } else {
        if (this.link.category) {
          if (Reflect.ownKeys(this.link.B2B).length === 0 && Reflect.ownKeys(this.link.BBC).length === 0 && Reflect.ownKeys(this.link.O2O).length === 0) {
            this.$message(this.$t('内容不能为空'))
            return
          }
        } else {
          if (this.link.data === null || this.link.data === '' || this.link.data === '/search.html?keyword=') {
            this.$message(this.$t('内容不能为空'))
            return
          }
        }
      }
      this.link.appData = this.link.data
      this.showReault = true
      this.$emit('input', this.link)
      this.dialogVisible = false
    },
    setLinkData() {
      if (this.chooseName === this.ConfigData.tabOptions[0].name) {
        this.link.data = this.ConfigData.tabOptions[0].link.data || ''
        if (this.pageType === 18) {
          if (this.link.data.indexOf('?') === -1) {
            this.link.data += '?pageType=18&canConversion=true'
          } else {
            this.link.data += '&pageType=18&canConversion=true'
          }
        }
        this.link.type = this.chooseLabel + '|' + (this.ConfigData.tabOptions[0].link.data || '')
        this.clearCategory()
        this.clearOption()
      }
      if (this.chooseName === this.ConfigData.tabOptions[2].name) {
        this.link.data = '/search.html?keyword=' + (this.ConfigData.tabOptions[2].link.data || '')
        if (this.pageType === 18) {
          this.link.data += '&pageType=18&canConversion=true'
        }
        this.link.type = this.chooseLabel + '|' + (this.ConfigData.tabOptions[2].link.data || '')
        this.clearCategory()
        this.clearOption()
      }
      if (this.chooseName === this.ConfigData.tabOptions[3].name) {
        this.link.data = this.optionChecked
        if (this.pageType === 18) {
          if (this.optionChecked.indexOf('?canConversion=true') === -1) { // 我能兑换
            this.link.data += '?canConversion=true&pageType=18'
          }
        }
        for (var item of this.ConfigData.options) {
          if (item.value === this.optionChecked) {
            this.link.type = this.ConfigData.tabOptions[3].label + '|' + (item.label || '')
          }
        }
        this.clearCategory()
      }
      if (this.chooseName === this.ConfigData.tabOptions[4].name) {
        var typeName = []
        for (var channel of this.ConfigData.channel) {
          var link = {}
          if (channel.link.name && !channel.link.data) {
            channel.link.name ? typeName.push(channel.link.name) : ''
            let data = '/search.html?categoryId=' + channel.link.id + '&categoryName=' + channel.link.name
            if (this.pageType === 18) {
              data += '&pageType=18&canConversion=true'
            }
            link = { data: data, appData: data }
          }
          if (channel.type === 'BBC') {
            this.link.BBC = link
          }
          if (channel.type === 'B2B') {
            this.link.B2B = link
          }
          if (channel.type === 'O2O') {
            this.link.O2O = link
          }
        }
        this.link.data = null
        this.link.category = true
        this.link.type = this.ConfigData.tabOptions[4].label + '|' + typeName.splice(',')
        this.clearOption()
      } else {
        this.link.category = false
      }
    },
    // 清除选中类目数据
    clearCategory() {
      this.link.BBC = {}
      this.link.B2B = {}
      this.link.O2O = {}
    },
    // 恢复站内页默认数据
    clearOption() {
      this.optionChecked = '/index.html'
    },
    handleReset() {
      this.link = {}
      for (var channel of this.ConfigData.channel) {
        channel.link = {}
      }
      this.optionChecked = '/index.html'
      this.value = {}
      this.showReault = false
      this.$emit('input', {})
    },
    handleChange(val) {
      this.optionChecked = val
    }
  }
}
</script>

<style lang="scss" scoped>
.link-url-tip::before{
  content: '链接到:';
  padding-right:0.3rem ;
  font-size: 0.12rem;
  color: #666;
}
.el-button--text{
 padding: 0 !important;
}
.linkurl-footer-wrapper{
  display: flex;
  justify-content: flex-end;
  padding-top: 0.2rem;
}
.tabs-wrapper{
  border-bottom: 0.01rem solid #eeeeee;
  min-height: 4.86rem;
}
.custom-wrapper-tip{
  color: #333;
  font-size: 0.14rem;
  font-weight: 400;
  min-width: 0.65rem;
}
.custom-wrapper,.product-wrapper,.search-wrapper,.station-wrapper{
  padding: 0.15rem 0;
}
.custom-content-wrapper{
  display: flex;
  flex-direction: column;
}
.custom-link-tip{
  padding-left: 0.65rem;
}
.el-input--medium{
  flex:1;
}
.custom-wrapper,.search-wrapper,.station-wrapper,.category-wrapper{
  display: flex;
}
</style>
