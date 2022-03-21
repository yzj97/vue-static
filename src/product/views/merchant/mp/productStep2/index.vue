<template>
  <div name="hidenFilteTable" @click="hidenFilteTable">
    <el-card>
      <el-form>
        <!-- 商家平台显示选择商家 -->
        <el-row>
          <el-col :span="6">
            <el-form-item
              v-show="createMp.dataType === 2"
              :label="$t('商家')"
              label-width="100px"
              required
            >
              <ody-merchant-select
                v-model="createMp.productVO.merchantId"
                :item-disabled="itemDisabled"
                name="createMp_productVO_merchantId"
                value-key="merchantId"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('商品类型')" label-width="100px" required>
          <el-radio-group v-model="createMp.productInfoVO.type" name="createMp_productInfoVO_type">
            <el-radio-button v-for="item in productTypeList" :key="item.key" :label="item.key">
              <strong>{{ item.value }}</strong>
              <div>（{{ typeDesc[item.key] || item.value }}）</div>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div v-if="createMp.productInfoVO.useType === 0">
          <el-form-item :label="$t('商品类目')" label-width="100px" required>
            <el-col :span="8">
              <el-popover
                ref="popover"
                v-model="showFilterCategory"
                name="showFilterCategory"
                placement="bottom"
                width="400"
                trigger="manual"
              >
                <el-table
                  ref="table"
                  :data="leaveList"
                  :show-header="false"
                  name="leaveList387"
                  height="200px"
                  @row-click="clickLeave"
                >
                  <el-table-column>
                    <template slot-scope="scope">
                      <div v-html="processName(scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
                <el-input
                  slot="reference"
                  :placeholder="$t('请输入类目名称')"
                  v-model="categoryName"
                  name="categoryName"
                  @focus="hidenFilteTable"
                />
              </el-popover>
            </el-col>
            <el-col :span="12">
              <el-button
                type="primary"
                size="mini"
                @click.stop="queryCategory"
              >{{ $t('查找类目') }}
              </el-button>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('最近使用')" label-width="100px">
            <el-row v-if="createMp.productVO.merchantId">
              <el-button
                v-for="item in historyList"
                :key="item.id"
                name="quickSelected"
                type="text"
                size="mini"
                class="text-button"
                @click="quickSelected(item.id, item.fullIdPath)"
              >{{ item.name }}
              </el-button>
            </el-row>
            <el-col :span="18">
              <el-card shadow="never">
                <product-category-card
                  ref="categoryCard"
                  :root-category.sync="rootCategory"
                  :category-map.sync="categoryMap"
                  @checkedCategory="checkedCategory"
                />
              </el-card>
            </el-col>
          </el-form-item>
        </div>
      </el-form>
      <ody-fixed>
        <el-button name="cancel" type="default" @click="cancel">{{ $t('取消') }}</el-button>
        <el-button
          :disabled="(!createMp.productInfoVO.categoryId && createMp.productInfoVO.useType === 0) || !createMp.productVO.merchantId"
          name="toNext"
          type="primary"
          @click="toNext"
        >{{ $t('下一步') }}
        </el-button>
      </ody-fixed>
    </el-card>
  </div>
</template>

<script>
import productCategoryCard from '@/components/product-category-card'
import $ from 'jquery'

const giftCardProductTypes = ['33', '34', '35', '36'] // 礼品卡商品类型,
function isGiftCard(typeCode) {
  return giftCardProductTypes.indexOf(typeCode) > -1
}

export default {
  components: {
    productCategoryCard
  },
  props: {
    createMp: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      typeDesc: {},
      categoryName: null, // 类目名称筛选
      historyList: [], // 类目使用记录
      rootCategory: {},
      categoryList: [],
      categoryMap: {},
      historyLimit: 10,
      showFilterCategory: false, // 显示查询的结果
      leaveList: [], // 查询结果
      productTypeList: [],
      giftCardSwitch: false // 礼品卡开关
    }
  },
  watch: {
    'createMp.productVO.merchantId': {
      async handler(value) {
        await this.reloadCategory(true)
      },
      deep: true
    }
  },
  async mounted(d) {
    this.initTypeDesc()
    if (this.createMp.productInfoVO.useType !== 1) {
      // 如果是原料，不加载类目
      await this.loadRootCategory()
    }
    Promise.all([this.$product.$api.common.listMultiCode({ categorys: ['PRODUCT_TYPE'] }), this.initGiftCardSwitch()]).then(([resp1, resp2]) => {
      this.initCodes(resp1)
    })
    // if (this.createMp.dataType === 1) {
    //   this.createMp.productVO.merchantId = -1
    // }
    $('body').on('click.hidePopover', this.hidenFilteTable)
  },
  beforeDestroy() {
    $('body').off('click.hidePopover')
  },
  methods: {
    itemDisabled(row, index) {
      if (
        row.merchantCode === 'defaultMerchant' &&
        this.createMp.dataType === 1
      ) {
        this.createMp.productVO.merchantId = row.merchantId
      }
      return false
    },
    hidenFilteTable(event) {
      this.showFilterCategory = false
    },
    clickLeave(row) {
      this.hidenFilteTable()
      this.quickSelected(row.id, row.fullIdPath)
    },
    processName(row) {
      // 搜索结果高亮查询值
      let name = row.fullNamePath
      if (name) {
        name = row.fullNamePath.substring(row.fullNamePath.indexOf('>') + 1)
      } else {
        name = row.name
      }
      name = name.replace(/-/g, '>')
      if (this.categoryName) {
        name = name.replace(
          new RegExp('(' + this.categoryName + ')', 'g'),
          '<span style="color:blue; font-weight: bold">$1</span>'
        )
      }
      return name
    },
    filterHistoryList() {
      // 获取节点使用历史
      var history = localStorage[this.createMp.productVO.merchantId]
      if (history) {
        history = JSON.parse(history)
      }
      if (this.createMp.productVO.merchantId) {
        const grantList = this.rootCategory.children || []
        const grantIds = grantList.map(i => i.id)
        if (history && Array.isArray(history)) {
          this.historyList = history
            .filter(i => {
              for (var index = 0; index < grantIds.length; index++) {
                if (
                  i.fullIdPath &&
                  i.fullIdPath.indexOf(grantIds[index]) >= 0
                ) {
                  return true
                }
              }
              return false
            })
            .sort((a, b) => b.time - a.time)
          return
        }
      }
      this.historyList = []
    },
    async reloadCategory(loadHistory) {
      // 重新加载节点
      this.createMp.productInfoVO.categoryId = null
      if (this.createMp.productInfoVO.useType === 1) {
        // 如果是原料，不加载类目
        return
      }

      if (this.$refs['categoryCard']) {
        this.$refs['categoryCard'].clearCard()
      }
      if (this.createMp.productVO.merchantId) {
        if (!this.rootCategory || !this.rootCategory.id) {
          await this.loadRootCategory()
        }
        await this.loadSubCategory(this.rootCategory.id)
      }
      if (loadHistory) {
        this.filterHistoryList()
      }
    },
    async loadSubCategory(categoryId) {
      // 加载子节点
      if (this.createMp.dataType === 1) {
        await this.loadChildrenCategory(categoryId)
      } else {
        await this.loadMerchantChildrenCategory(categoryId)
      }
    },
    async loadRootCategory() {
      // 加载根节点
      const { data } = await this.$product.$api.mpApi.queryBackedRootCategory()
      this.rootCategory = data
      this.categoryList = []
      this.$set(this.categoryMap, data.id, data)
    },
    async loadMerchantChildrenCategory(categoryId) {
      // 加载商家子节点
      const {
        data
      } = await this.$product.$api.mpApi.queryGrantedCategoryListByParent({
        merchantId: this.createMp.productVO.merchantId,
        parentId: categoryId
      })
      if (data) {
        data.forEach(element => {
          element.label = element.name
          this.$set(this.categoryMap, element.id, element)
          if (categoryId === this.rootCategory.id) {
            this.categoryList.push(element)
          }
        })
        this.$set(this.categoryMap[categoryId], 'children', data)
      }
    },
    async loadChildrenCategory(categoryId) {
      // 加载子节点
      const { data } = await this.$product.$api.mpApi.queryCategoryListByParent(
        {
          parentId: categoryId
        }
      )
      if (data) {
        data.forEach(element => {
          element.label = element.name
          this.$set(this.categoryMap, element.id, element)
          if (categoryId === this.rootCategory.id) {
            this.categoryList.push(element)
          }
        })
        this.$set(this.categoryMap[categoryId], 'children', data)
      }
    },
    checkedCategory(category) {
      // 点击类目
      if (category.isLeaves === 1) {
        // 叶子节点
        this.createMp.productInfoVO.categoryId = category.id
        this.createMp.productInfoVO.categoryFullIdPath = category.fullIdPath
        this.createMp.productInfoVO.categoryName = category.name
        this.createMp.productInfoVO.categoryFullNamePath = category.fullNamePath
      } else {
        this.createMp.productInfoVO.categoryId = null
        this.createMp.productInfoVO.categoryFullIdPath = null
        this.createMp.productInfoVO.categoryName = null
        this.createMp.productInfoVO.categoryFullNamePath = null
        this.loadSubCategory(category.id)
      }
    },
    async queryCategory() {
      // 输入类目名，选择类目
      // 查询类目
      const { data } = await this.$product.$api.mpApi.listBackCategory()
      let resultList = data || []
      if (this.createMp.dataType === 2) {
        resultList = data.filter(i => i.isLeaves === 1)
      }
      const grantList = this.rootCategory.children || []
      const grantIds = grantList.map(i => i.id)
      if (this.categoryName === undefined || this.categoryName == null) {
        this.categoryName = ''
      }
      resultList = resultList.filter(i => {
        for (var index = 0; index < grantIds.length; index++) {
          // 根目录名称不在检索范围内
          if (this.categoryName != null) {
            if (
              i.fullIdPath.indexOf(grantIds[index]) >= 0 &&
              i.fullNamePath &&
              i.fullNamePath
                .substring(i.fullNamePath.indexOf('>') + 1)
                .toLowerCase()
                .indexOf(this.categoryName.toLowerCase()) >= 0
            ) {
              return true
            }
          }
        }
        return false
      })
      this.leaveList = resultList
      this.showFilterCategory = true
    },
    async quickSelected(categoryId, fullIdPath) {
      // 通过历史或者搜索快速选择类目
      delete this.rootCategory.children
      await this.reloadCategory(false)
      // 根据选中的节点，自动生成card
      this.$refs['categoryCard'].autoCreateCard(fullIdPath)
    },
    storeCategoryHistory() {
      // 保存历史
      if (this.createMp.productInfoVO.useType === 1) {
        // 如果是成品，保存类目
        return
      }
      const historyMap = this.historyList.reduce((r, i) => {
        r[i.id] = i
        return r
      }, {})
      if (historyMap[this.createMp.productInfoVO.categoryId]) {
        const category = historyMap[this.createMp.productInfoVO.categoryId]
        category.time = new Date().getTime()
        category.fullIdPath = this.createMp.productInfoVO.categoryFullIdPath
        category.name = this.createMp.productInfoVO.categoryName
        category.fullNamePath = this.createMp.productInfoVO.categoryFullNamePath
        this.historyList.splice(this.historyList.indexOf(category), 1, category)
      } else {
        this.historyList.splice(0, 0, {
          id: this.createMp.productInfoVO.categoryId,
          fullIdPath: this.createMp.productInfoVO.categoryFullIdPath,
          name: this.createMp.productInfoVO.categoryName,
          fullNamePath: this.createMp.productInfoVO.categoryFullNamePath,
          time: new Date().getTime()
        })
      }
      if (this.historyList.length > this.historyLimit) {
        this.historyList.splice(
          this.historyLimit,
          this.historyList.length - this.historyLimit
        )
      }
      localStorage[this.createMp.productVO.merchantId] = JSON.stringify(
        this.historyList
      )
    },
    initGiftCardSwitch() {
      const vue = this
      return vue.$product.$api.productApi.getBooleanSwitcher({ key: 'giftCard.switch' }).then(data => {
        console.log(data)
        vue.giftCardSwitch = data != null && data.data === true
      })
    },
    async initCodes(data) {
      if (data.code === '0') {
        const dataList = []
        for (var i in data.data.PRODUCT_TYPE) {
          if (i === '31' || isGiftCard(i)) {
            if (this.createMp.productVO.typeOfProduct !== 4 && this.createMp.productInfoVO.useType === 0) {
              dataList.push({ key: i, value: data.data.PRODUCT_TYPE[i] })
            }
          } else {
            dataList.push({ key: i, value: data.data.PRODUCT_TYPE[i] })
          }
        }
        this.productTypeList = dataList.filter(item => {
          if (item.key === '1' || item.key === '50') {
            return true
          } else {
            return false
          }
          // if (isGiftCard(item.key)) {
          //   console.log(this.giftCardSwitch)
          //   return this.giftCardSwitch
          // }
          // if (item.key === '37' && this.createMp.productVO.typeOfProduct === 0 && this.createMp.productInfoVO.useType === 1) {
          //   return false
          // }
          // return true
        })
        this.createMp.productInfoVO.type = '1'
      }
    },
    toNext() {
      this.$emit('next')
    },
    cancel() {
      this.$emit('cancel')
    },
    async initTypeDesc() {
      const { data } = await this.$product.$api.productApi.getStringValue({ key: 'PRODUCT_TYPE_DESC', pool: 'product' })
      this.typeDesc = JSON.parse(data)
    }
  }
}
</script>
<style scoped lang="scss">
.big-button {
  padding: 30px !important;
  margin: 10px;
  background: rgba(255, 255, 255, 1) !important;
  border: 1px dashed rgba(24, 144, 255, 1);
  color: rgba(24, 144, 255, 1) !important;
  font-size: 18px;
  height: 80px !important;
}

.text-button {
  color: rgba(24, 144, 255, 1) !important;
}
/deep/ .el-card__body {
  min-height: 400px !important;
}
</style>
