<template>
  <div>
    <div slot="content">
      <el-form ref="form" :model="form" label-width="240px">
        <el-form-item :label="$t('终端')">
          <el-radio-group v-model="platform" name="platform">
            <el-radio v-for="item in platformList" :label="item.code" :key="item.code">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('渠道')">
          <el-radio-group v-model="form.channelCode" name="form_channelCode" @change="handleChannelChange">
            <el-radio v-for="item in channelList" :label="item.channelCode" :key="item.channelCode">{{ item.channelName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('模板')">
          <el-radio-group v-model="form.template" name="form_template">
            <el-radio v-for="item in templateList" :label="item.code" :key="item.code">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('风格')">
          <el-radio-group v-model="form.style" name="form_style" @change="handleStyleChange">
            <el-radio v-for="item in styleList" :label="item.code" :key="item.code">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('颜色')">
          <div class="items">
            <div v-for="item in colorList" :key="item.color" :style="{'backgroundColor': (item.color || '#ffffff')}" name="handleColorChange" class="skin-color" @click="handleColorChange(item.color)">
              <i v-if="form.color === item.color" :style="{color: (item.color ? '#ffffff' : '#ff2300')}" class="el-icon-check"/>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="btn" style="text-align: center">
      <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
      <ody-button name="CmsSkinSetting01_handleSubmit" code="CmsSkinSetting01" size="small" type="primary" @click="handleSubmit">{{ $t('保存') }}</ody-button>
    </div>
    <div class="skin-img">
      <el-image :src="skinImg"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CmsSkinSetting',
  data() {
    return {
      platform: 'h5',
      form: {
        channelCode: '',
        template: 'default',
        style: '',
        color: ''
      },
      platformList: [{ code: 'h5', name: 'H5' }],
      skinImg: 'http://cdn.oudianyun.com/static/cms/template/new-ffffff.png',
      channelList: [],
      templateList: [
        { code: 'default', name: this.$t('默认') }
      ],
      colorList: [
        {
          color: '',
          img: 'http://cdn.oudianyun.com/static/cms/template/new-ffffff.png'
        }
      ],
      styleList: [
        {
          code: '',
          name: this.$t('默认风格'),
          colors: [
            {
              color: '',
              img: 'http://cdn.oudianyun.com/static/cms/template/new-ffffff.png'
            }
          ]
        },
        {
          code: 'single',
          name: this.$t('简约清新风'),
          colors: [
            {
              color: '#1a1a1a',
              img: 'http://cdn.oudianyun.com/static/cms/template/new-1a1a1a.png'
            },
            {
              color: '#2cc2c0',
              img: 'http://cdn.oudianyun.com/static/cms/template/new-2cc2c0.png'
            },
            {
              color: '#4ab9f9',
              img: 'http://cdn.oudianyun.com/static/cms/template/new-4ab9f9.png'
            },
            {
              color: '#fe4182',
              img: 'http://cdn.oudianyun.com/static/cms/template/new-fe4182.png'
            },
            {
              color: '#ff2300',
              img: 'http://cdn.oudianyun.com/static/cms/template/new-ff2300.png'
            },
            {
              color: '#ff9001',
              img: 'http://cdn.oudianyun.com/static/cms/template/new-ff9001.png'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.initChannel()
      await this.queryConfig()
    },
    async initChannel() {
      const vue = this
      const res = await vue.$cms.$api.common.listChannel({
        filters: {
          onOrOffLine: '1',
          channelType: '1',
          channelMode: [
            'B2B',
            'BBC',
            'O+O'
          ]
        }
      })

      vue.channelList = res.data
      vue.channelList.map(item => {
        item.style = ''
        item.color = ''
      })
      vue.form.channelCode = vue.channelList[0].channelCode
    },
    handleChannelChange(value) {
      this.channelList.map(item => {
        if (item.channelCode === value) {
          this.handleStyleChange(item.style)
          this.handleColorChange(item.color)
        }
      })
    },
    handleStyleChange(style) {
      this.form.style = style
      this.styleList.map(i => {
        if (i.code === style) {
          this.colorList = i.colors
          this.handleColorChange(this.colorList[0].color)
        }
      })
    },
    handleColorChange(color) {
      this.form.color = color
      this.colorList.map(item => {
        if (item.color === color) {
          this.skinImg = item.img
        }
      })
    },
    async queryConfig() {
      const vue = this
      const params = []
      vue.channelList.map(item => {
        params.push(item.channelCode + '.skinCode')
      })

      const res = await vue.$cms.$api.common.listPageInfoConfig({ keyList: params })
      if (res.data && res.data.length > 0) {
        res.data.map((item, index) => {
          if (item) {
            vue.channelList.map(channel => {
              const arr = item.value.split('_')
              if (arr && arr.length > 0 && item.key.indexOf(channel.channelCode) >= 0) {
                channel.style = arr[0]
                channel.color = '#' + arr[1]
                if (index === 0 && vue.form.channelCode === channel.channelCode) {
                  vue.handleStyleChange(channel.style)
                  vue.handleColorChange(channel.color)
                }
              }
            })
          }
        })
      }
    },
    handleReset() {
      this.channelList.map(item => {
        if (item.channelCode === this.form.channelCode) {
          this.handleStyleChange(item.style)
          this.handleColorChange(item.color)
        }
      })
    },
    handleSubmit() {
      const vue = this
      if (vue.form.style && vue.form.color) {
        const params = {
          key: vue.form.channelCode + '.skinCode',
          value: vue.form.style + '_' + vue.form.color.substr(1),
          desc: this.$t('CMS风格颜色设置')
        }
        vue.$cms.$api.common.setConfig(params).then(res => {
          vue.$message.success('保存成功')
          vue.queryConfig()
        })
      } else {
        vue.$message.success('保存成功')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .items {
    display: flex;
  }
  .red {
    color: red;
  }
  .skin-color{
    margin-right: 4px;
    width:25px;
    height:25px;
    overflow:hidden;
    position: relative;
    border:1px solid #eee;
    cursor: pointer;
    text-align: end;
  }
</style>
