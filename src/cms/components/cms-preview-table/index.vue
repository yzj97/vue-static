<template>
  <div class="cms-preview-table">
    <div v-if="visible" class="cms-preview-mask">
      <div class="cms-preview-content">
        <div class="cms-preview-details">
          <iframe :src="currentPageUrl+'&preview=1'" class="cms-preview-frame-item"/>
        </div>
        <div class="cms-preview-select-code">
          <i name="handleClose" class="el-icon-close icon-close-wrapper" @click="handleClose"/>
          <div class="cms-preview-select-wrapper">
            <label class="custom-wrapper-tip">渠道:</label>
            <el-select v-model="currentPageUrl" :clearable="false" name="currentPage" @change="handleChange">
              <el-option v-for="item in channelList" :key="item.previewUrl" :label="item.channename" :value="item.previewUrl" />
            </el-select>
          </div>
          <ody-qrcode :width="3.28" :hight="3.28" :value="qrcodeUrl" :key="qrcodeUrl" class="qrcode">
            <ody-button v-clipboard:copy="'http:' + currentPageUrl+'&preview=1'" v-clipboard:success="clipboardSuccess" code="ui" type="text">
              {{ $t('复制链接') }}
            </ody-button>
          </ody-qrcode>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    channelList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      channelMap: {
        110001: this.$t('自建BBC'),
        110002: this.$t('自建B2B'),
        110003: this.$t('自建O2O')
      },
      channelTable: {
        columns: [
          {
            label: this.$t('渠道'),
            slot: 'channelName',
            show: true,
            align: 'center',
            minWidth: 180
          },
          {
            label: this.$t('发布状态'),
            prop: 'statusStr',
            show: true,
            align: 'center',
            minWidth: 120
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          align: 'center',
          list: [
            {
              slot: 'handleView',
              code: 'ui'
            }
          ]
        }
      },
      currentPageUrl: '',
      qrcodeUrl: '' // 二维码地址
    }
  },

  async mounted() {
    const hash = {}
    if (this.channelList && this.channelList.length > 0) {
      this.currentPageUrl = this.channelList[0].previewUrl
      this.qrcodeUrl = 'http:' + this.currentPageUrl + '&preview=1'
      this.channelList.map(item => {
        item.channename = this.channelMap[item.channel]
      })
    }
    this.channelList = await this.channelList.reduce(function(item, next) {
      hash[next.channel] ? '' : hash[next.channel] = true && item.push(next)
      return item
    }, [])
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleChange(val) {
      this.currentPageUrl = val
      this.qrcodeUrl = 'http:' + this.currentPageUrl + '&preview=1'
    }
  }

}
</script>

<style lang="less" scoped>
  .cms-preview-mask{
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    .cms-preview-content{
      height: 100%;
      display: flex;
      justify-content: center;
      padding: 0.6rem;
      .cms-preview-details{
        position: relative;
        background:url('../../img/phone-white.png');
        width:4.32rem;
        height: 8.42rem;
        .cms-preview-frame-item{
          position: absolute;
          width: 3.75rem;
          height: 6.29rem;
          right: 0.29rem;
          top: 1rem;
        }
      }
      .cms-preview-select-code{
        color:#fff;
        min-width: 4.05rem;
        padding: 0 0.4rem;
        .icon-close-wrapper{
          font-size: 0.3rem;
          float:right;
        }
        *, :after, :before {
            z-index: 266;
        }
        .cms-preview-select-wrapper{
          padding:0.4rem 0.2rem 0.3rem  0.2rem;
          display: flex;
          align-items: center;
          .custom-wrapper-tip{
            min-width: 0.6rem;
          }
        }
      }
    }

  }
  .qrcode {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
  }
</style>
