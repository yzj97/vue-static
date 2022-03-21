<template>
  <div>
    <div class="skucode-input">
      <!-- <el-input  v-model="itemInfo['skuBarCode']" :placeholder="showPlaceholder ? 'sku条形码' : ''"  name="itemInfo['skuBarCode']"/> -->
      <el-input :disabled="true" v-model="itemInfo['skuBarCode']" :placeholder="showPlaceholder ? $t('SKU条形码') : ''" name="itemInfo['skuBarCode']1"/>
      <el-popover
        placement="bottom"
        trigger="click"
        @hide="hideSkuCodeList(itemInfo)"
      >
        <div class="skucode-list">
          <div v-for="(barItem,barIndex) in itemInfo['barcodes']" :key="barIndex" class="skucode-item">
            <el-input v-model="barItem.barcode" name="barItem_barcode" maxlength="20"/>
            <i v-if="!isView" name="deleteSkuBarCode" class="el-icon-delete delete-skucode" @click="deleteSkuBarCode(itemInfo, barIndex)"/>
          </div>
          <div v-if="!isView" name="addSkuBarCodeList" class="add-skucode-btn" @click="addSkuBarCodeList(itemInfo)">
            <i class="el-icon-plus" />
          </div>
          <div v-if="!isView" class="skucode-bottom-btn" >
            <el-button name="cancelSkuBarCode" size="small" @click="cancelSkuBarCode()">{{ $t('取消') }}</el-button>
            <el-button name="saveSkuBarCode" size="small" type="primary" @click="saveSkuBarCode(itemInfo)">{{ $t('确认') }}</el-button>
          </div>
        </div>
        <span slot="reference" name="addSkuBarCode" class="skucode-add" @click="addSkuBarCode(itemInfo)">+</span>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    showPlaceholder: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      itemInfo: this.item
    }
  },
  watch: {
    item: {
      handler(newValue) {
        this.itemInfo = newValue
      }
    },
    deep: true
  },
  mounted() {
    this.saveSkuBarCode(this.itemInfo)
  },
  methods: {
    addSkuBarCode(row) {
      row.barcodesPhoto = this.$portal.deepClone(row.barcodes)
      return
      // if (row.barcodes === null) {
      //   row.barcodes = []
      // }
      // if (row.barcodes.length >= 10) {
      //   return this.$message('sku条形码下最多添加10条')
      // }
      // if (row.skuBarCode !== '' && row.skuBarCode !== undefined && row.skuBarCode !== null) {
      //   row.barcodes.push({ barcode: row.skuBarCode })
      //   row.skuBarCode = ''
      // }
      // row.barcodesPhoto = this.$portal.deepClone(row.barcodes)
      // console.log(this.$portal.deepClone(row))
    },
    deleteSkuBarCode(row, index) {
      row.barcodes.splice(index, 1)
    },
    addSkuBarCodeList(row) {
      if (row.barcodes === null) {
        row.barcodes = []
      }
      if (row.barcodes.length >= 10) {
        return this.$message('sku条形码下最多添加10条')
      }
      row.barcodes.push({ barcode: '', type: 1 })
    },
    cancelSkuBarCode() {
      document.body.click()
    },
    saveSkuBarCode(row) {
      if (row.barcodes == null) {
        row.barcodes = []
      }
      const arr = []
      if (row.barcodes === null) {
        row.barcodes = []
      }
      row.barcodes.map(item => {
        if (item.barcode !== '' && item.barcode !== undefined && item.barcode !== null) {
          arr.push(item)
        }
      })
      row.barcodesPhoto = arr
      if (row.barcodes.length > 0) {
        const index = row.barcodes.findIndex(item => item.type === 0)
        if (index > -1) {
          const item = row.barcodes[index]
          row.barcodes[index] = row.barcodes[0]
          row.barcodes[0] = item
        } else {
          row.barcodes[0].type = 0
        }
        row.skuBarCode = row.barcodes[0].barcode
      } else {
        row.skuBarCode = ''
      }
      document.body.click()
    },
    hideSkuCodeList(row) {
      row.barcodes = this.$portal.deepClone(row.barcodesPhoto)
    }
  }
}
</script>
<style lang="scss" scoped>
   .skucode-input {
    display: flex;
    align-items: center;
    .skucode-add{
      margin: 0 0 0 6px;
      font-size: 18px;
      color: var(--themeColor90);
      cursor: pointer;
    }
  }
  .skucode-list {
    .skucode-item {
      margin-top: 4px;
      display: flex;
      align-items: center;
      .delete-skucode {
        margin-left: 4px;
        cursor: pointer;
      }
    }
    .add-skucode-btn {
      cursor: pointer;
      border: 1px solid rgba(238,245,249,1);
      height: 34px;
      line-height: 34px;
      margin-top: 8px;
      text-align: center;
      font-weight: 700;
      font-size: 18px;
      &:hover {
        border: 1px solid var(--themeColor);
        color: var(--themeColor)
      }
    }
    .skucode-bottom-btn {
      margin-top: 8px;
      text-align: center;
    }
  }
</style>
