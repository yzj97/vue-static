<template>
  <section>
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleTabSelect">
      <el-menu-item id="merchentInfo" index="0">{{ $t('基本信息') }}</el-menu-item>
      <el-menu-item id="merchantDetialCertificate" index="1">{{ $t('资质证书') }}</el-menu-item>
      <el-menu-item id="merchantDetailBrand" index="2">{{ $t('品牌管理') }}</el-menu-item>
      <el-menu-item id="merchantDetailCategory" index="3">{{ $t('类目管理') }}</el-menu-item>
      <el-menu-item id="merchantDetailFinance" index="4">{{ $t('财务信息') }}</el-menu-item>
      <el-menu-item id="merchantDetailChannel" index="5">{{ $t('渠道') }}</el-menu-item>
    </el-menu>

    <el-card>
      <baseInfo v-if="activeIndex === '0'" :id="id" :org-code.sync="orgCode" :org-name.sync="orgName" :only-read="onlyRead" />

      <certificate v-if="activeIndex === '1'" :org-id="id" :only-read="onlyRead" />

      <brand v-if="activeIndex === '2'" :org-id="id" :only-read="onlyRead" />

      <category v-if="activeIndex === '3'" :org-id="id" :only-read="onlyRead" />

      <finance v-if="activeIndex === '4'" :org-id="id" :org-code.sync="orgCode" :org-name.sync="orgName" :only-read="onlyRead" />

      <channel v-if="activeIndex === '5'" :org-id="id" :only-read="onlyRead"/>

    </el-card>
  </section>
</template>

<script>

import baseInfo from '@/components/merchantDetail/baseInfo'
import certificate from '@/components/merchantDetail/certificate'
import finance from '@/components/merchantDetail/finance'
import channel from '@/components/merchantDetail/channel'
import employee from '@/components/merchantDetail/employee'
import brand from '@/components/merchantDetail/brand'
import category from '@/components/merchantDetail/category'

export default {
  components: {
    baseInfo,
    certificate,
    finance,
    channel,
    employee,
    brand,
    category
  },
  props: {
    id: { type: Number, default: null },
    orgCode: { type: String, default: null },
    orgName: { type: String, default: null },
    onlyRead: { type: Boolean, default: true }
  },
  data() {
    return {
      // orgName: '',
      // orgCode: '',
      activeIndex: '0',
      brandList: [],
      brandTable: [
        {
          show: true,
          prop: 'brandName',
          label: this.$t('品牌名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'englishName',
          label: this.$t('品牌英文名'),
          align: 'center'
        },
        {
          show: true,
          prop: 'logUrl',
          label: this.$t('品牌LOGO'),
          align: 'center',
          render: (h, params) => {
            return (
              <div>
                <el-image
                  src={params.row.logUrl}
                ></el-image>
              </div>
            )
          }
        },
        {
          show: true,
          prop: 'seniorityStr',
          label: this.$t('资质证书/证书有效期'),
          align: 'center'
        },
        {
          show: true,
          prop: 'status',
          label: this.$t('审核状态'),
          align: 'center'
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('创建时间'),
          align: 'center'
        }
      ],
      brandOperates: {
        fixed: 'right',
        align: 'center',
        minWidth: 150,
        list: [
          {
            label: this.$t('编辑'),
            method(index, row) {

            }
          },
          {
            label: this.$t('删除'),
            method(index, row) {

            }
          }
        ]
      },
      brandPage: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
    },
    handleTabSelect(key, keyPath) {
      this.activeIndex = key
    },
    async handleBrandPageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.queryBrandList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleBrandPageCurrentChange() {
      try {
        await this.queryBrandList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async queryBrandList() {
      try {
        await this.loadBrandList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async loadBrandList() {
      const self = this
      self.$merchant.$api.productService.listMerchantBrand({ currentPage: self.brandPage.current, itemsPerPage: self.brandPage.size, merchantId: self.id }).then(res => {
        if (res && res.code === '0' && res.data) {
          self.brandList = res.data.listObj
          self.brandPage.total = res.data.total
        }
      })
    }
  }
}
</script>

<style scoped>
  /deep/ .el-card{
    overflow: unset !important;
    min-height: 600px;
  }
</style>
