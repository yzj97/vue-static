<template>
  <div class="cms-footer-list">
    <!-- {{ value }} -->
    <div name="reset" class="reset" @click="reset">
      <span>{{ $t('恢复默认设置') }}</span>
      <i class="el-icon-refresh-right"/>
    </div>
    <div class="footer-items">
      <div v-for="(item, index) in value" :key="index" class="footer-item">
        <div class="opration-wrapper">
          <span v-if="index === 0" class="up-disable"/>
          <span v-else name="up" class="up" @click="up(index)"/>
          <span v-if="index === (value.length -1)" class="down-disable"/>
          <span v-else name="down" class="down" @click="down(index)"/>
          <span v-if="value.length>1" name="deleteItem" class="delete" @click="deleteItem(index)"/>
        </div>
        <el-form label-width="100px" class="form">
          <el-form-item :label="$t('默认图标')">
            <cms-url v-model="item.icon" name="item_icon"/>
          </el-form-item>
          <el-form-item :label="$t('选中图标')">
            <cms-url v-model="item.activeIcon" name="item_activeIcon"/>
          </el-form-item>
          <el-form-item :label="$t('导航名称')">
            <el-input v-model="item.text" name="item_text" maxlength="4"/>
          </el-form-item>
          <el-form-item :label="$t('导航选中颜色')">
            <el-color-picker v-model="item.textActiveColor" name="item_textActiveColor"/>
          </el-form-item>
          <el-form-item :label="$t('链接地址')">
            <cms-footer-url :page-type="pageType" v-model="item.link" :showtip="false" name="item_link"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-button v-if="value.length <= 5" name="addItem" plain class="slider-add-btn" @click="addItem"> 添加 <i class="el-icon-plus"/></el-button>
  </div>
</template>
<script>
import defaultFooter from '@/components/cms-footer-list/defaultFooter'
import CmsUrl from '@/components/cms-url'
import CmsFooterUrl from '@/components/cms-footer-url'
export default {
  components: {
    CmsUrl,
    CmsFooterUrl
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    pageType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {

    }
  },
  watch: {
    'value': {
      handler(val) {
        if (val && val.length === 0) {
          if (this.pageType === 1) {
            this.value = this.$portal.deepClone(defaultFooter)
          } else {
            var arr = []
            const len = Math.floor(defaultFooter.length / 2)
            for (let i = 0; i < defaultFooter.length; i++) {
              if (i === len) {
                arr.push({
                  icon: 'https://public-2020.ks3-cn-shanghai.ksyun.com/trunk/cms/1594633932767_37.511076992652356_f10636d5-b449-4f4b-be2a-21df8d6a0ffe.png',
                  activeIcon: 'https://public-2020.ks3-cn-shanghai.ksyun.com/trunk/cms/1594633932767_37.511076992652356_f10636d5-b449-4f4b-be2a-21df8d6a0ffe.png',
                  text: this.$t('扫码购'),
                  textActiveColor: '#E60012',
                  link: '/scanCode.html'
                })
                arr.push(defaultFooter[i])
              } else {
                arr.push(defaultFooter[i])
              }
            }
            this.value = this.$portal.deepClone(arr)
          }
        }
        this.$emit('input', this.value)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    reset() {
      if (this.pageType === 1) {
        this.value = this.$portal.deepClone(defaultFooter)
      } else {
        var arr = []
        const len = Math.floor(defaultFooter.length / 2)
        for (let i = 0; i < defaultFooter.length; i++) {
          if (i === len) {
            arr.push({
              icon: 'https://public-2020.ks3-cn-shanghai.ksyun.com/trunk/cms/1594633932767_37.511076992652356_f10636d5-b449-4f4b-be2a-21df8d6a0ffe.png',
              activeIcon: 'https://public-2020.ks3-cn-shanghai.ksyun.com/trunk/cms/1594633932767_37.511076992652356_f10636d5-b449-4f4b-be2a-21df8d6a0ffe.png',
              text: this.$t('扫码购'),
              textActiveColor: '#E60012',
              link: '/scanCode.html'
            })
            arr.push(defaultFooter[i])
          } else {
            arr.push(defaultFooter[i])
          }
        }
        this.value = this.$portal.deepClone(arr)
      }
      this.$emit('input', this.value)
    },
    deleteItem(index) {
      this.value.splice(index, 1)
      this.$emit('input', this.value)
    },
    // 下移
    down(index) {
      var arrs = this.$portal.deepClone(this.value)
        ;[arrs[index], arrs[index + 1]] = [arrs[index + 1], arrs[index]]
      this.value = arrs
      this.$emit('input', arrs)
    },
    // 上移
    up(index) {
      var arrs = this.$portal.deepClone(this.value)
        ;[arrs[index], arrs[index - 1]] = [arrs[index - 1], arrs[index]]
      this.value = arrs
      this.$emit('input', arrs)
    },
    addItem() {
      const valueItem = {
        icon: '',
        activeIcon: '',
        text: '',
        textActiveColor: '',
        link: '/index.html'
      }
      this.value.push(valueItem)
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  .el-form-item {
    margin-bottom: 16px !important;
  }
}
.cms-footer-list {
  .reset {
    text-align: right;
    cursor: pointer;
  }
  .footer-item {
    padding-top: 20px;
    border-bottom: 1px solid #f1f1f1;
    position: relative;
  }
  .opration-wrapper {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100px;
    width: 32px;
    margin-left: -0.3rem;
    .span {
      height: 18px;
      width: 18px;
      flex: 1;
      cursor: pointer;
    }
    .up-disable {
      .span;
      background: url('../../img/up-disable.png') no-repeat center center;
      background-size: 100%;
    }
    .up {
      .span;
      background: url('../../img/up.png') no-repeat center center;
      background-size: 100%;
    }
    .down-disable {
      .span;
      background: url('../../img/down-disable.png') no-repeat center center;
      background-size: 100%;
    }
    .down {
      .span;
      background: url('../../img/down.png') no-repeat center center;
      background-size: 100%;
    }
    .delete {
      .span;
      background: url('../../img/delete.png') no-repeat center center;
      background-size: 100%;
    }
  }
  .slider-add-btn{
    width: 100%;
    border: 0.01rem dashed #eee;
    margin-top: 0.1rem;
    color: #666;
  }
}
</style>
