<template>
  <el-form-item v-if="contentTypeArr.length" :label="$t('promotion_type')" required >
    <el-tooltip v-if="promType===4" :content="getTips()" class="item" effect="dark" placement="top">
      <i class="el-icon-question"/>
    </el-tooltip>
    <el-radio-group v-model="contentType" name="contentType" @change="changeContentType">
      <el-radio v-for="item in contentTypeArr" :label="item.id" :key="item.id">
        {{ $t(item.text) }}
      </el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
import { getContentTypeArrs } from '../../services/constantService'
export default {
  props: {
    promType: {
      type: Number,
      default: -1
    },
    contentType: {
      type: Number,
      default() {
        return -1
      }
    }
  },
  data() {
    return {
      contentTypeArr: []
    }
  },
  async mounted() {
    // 此处取渠道
    this.contentTypeArr = await this.getContentTypesByType(this.promType)
    if (this.contentTypeArr.length > 0) {
      this.contentType = this.contentTypeArr[0].id
    } else {
      this.contentType = this.getContentTypeByPromType()
    }
    this.$emit('update:contentType', this.contentType)
  },
  methods: {
    getContentTypesByType(type) {
      const allPromotionTypes = getContentTypeArrs()
      let types = ''
      allPromotionTypes.forEach(function(item) {
        if (type === item.id) {
          types = item.children
        }
      })
      return types
    },
    changeContentType() {
      this.$emit('update:contentType', this.contentType)
      this.$emit('change', this.contentType)
    },
    getContentTypeByPromType() {
      let contentType = -1
      // 组合促销、支付优惠、预售、赠送、换购的contentType需要特殊处理，这里只处理contentType唯一的
      switch (this.promType) {
        case 7: contentType = 9
          break
        case 9: contentType = 11
          break
        case 14: contentType = 18
          break
        case 15: contentType = 20
          break
        case 16: contentType = 21
          break
      }
      return contentType
    },
    getTips() {
      let tips = ''
      tips += this.$t('POS渠道')
      tips += '：'
      tips += this.$t('仅支持满商品赠优惠券')
      tips += ','
      tips += this.$t('买商品赠商品')
      tips += this.$t('主赠相同')
      tips += this.$t('及赠优惠券')
      return tips
    }
  }
}
</script>
