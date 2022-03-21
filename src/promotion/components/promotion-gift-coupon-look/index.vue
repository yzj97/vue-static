<template>
  <div>
    <ody-dialog
      v-if="visible"
      :visible.sync="visible"
      :title="$t('查看赠送优惠券')"
      width="960px"
      @close="handleClose"
    >
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :data="mpTable.data"
            :columns="mpTable.columns"
            :can-filter="false"
            :operates="!editFlag ? mpTable.operates : ''"
            name="mpTable_data064"
          >
            <template slot="couponAmount" slot-scope="scope">
              <div>{{ scope.row.couponAmount + scope.row.couponUnit }}</div>
            </template>
            <template slot="time" slot-scope="scope">
              <div>{{ getTime(scope.row) }}</div>
            </template>
            <template slot="limit" slot-scope="scope">
              <div>{{ scope.row.totalLimit + '/' + scope.row.drawedCoupons }}</div>
            </template>
          </ody-table>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="mpSearch.currentPage"
            :list="mpTable.data"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="mpSearch.itemsPerPage"
            :total.sync="mpTable.page.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange()"
            @current-change="handleCurrentChange()"
          />
        </div>
      </ody-list-table-area>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">关 闭</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    },
    editFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mpSearch: {
        currentPage: 1,
        itemsPerPage: 10,
        ...this.params
      },
      mpTable: {
        columns: [
          {
            label: this.$t('优惠券id'),
            prop: 'id',
            show: true,
            minWidth: 150
          },
          {
            label: this.$t('优惠券名称'),
            prop: 'themeTitle',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('面值'),
            slot: 'couponAmount',
            show: true,
            minWidth: 100
          },
          {
            label: this.$t('有效时间'),
            slot: 'time',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('每人限领（张）'),
            prop: 'individualLimit',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('使用条件（元）'),
            prop: 'useLimit',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('总量限制/已发行量'),
            slot: 'limit',
            show: true,
            minWidth: 180
          }
        ],
        operates: {
          width: 80,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.deleteSelectionProduct([row])
              },
              code: 'ui'
            }
          ]
        },
        data: [],
        page: {
          total: 0
        }
      }
    }
  },
  mounted() {
    this.querySelectedGiftList()
  },
  methods: {
    getTime(row) {
      if (row.effdateCalcMethod === 2) {
        return `自用户领取${row.effDays}天失效`
      } else if (row.effdateCalcMethod === 1) {
        return `${this.$portal.parseTime(
          row.startTimeConfig,
          '{y}-{m}-{d} {h}:{i}:{s}'
        )}-${this.$portal.parseTime(
          row.endTimeConfig,
          '{y}-{m}-{d} {h}:{i}:{s}'
        )}`
      }
    },
    handleClose() {
      this.$emit('cancel')
    },
    async handleCurrentChange() {
      await this.querySelectedGiftList()
    },
    async handleSizeChange() {
      this.mpSearch.currentPage = 1
      await this.querySelectedGiftList()
    },
    async querySelectedGiftList() {
      const params = this.mpSearch

      const {
        data: { listObj = [], total = 10 } = {}
      } = await this.$promotion.$api.promotion.querySelectedCouponGiftList(
        params
      )
      this.mpTable.page.total = total

      this.mpTable.data = listObj || []
    },
    async deleteSelectionProduct(row) {
      if (row.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择需要删除的商品')
        })
        return
      }

      const res = await this.$confirm(this.$t('确定删除吗?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })

      if (!res) {
        return
      }

      const ids = row
        .map(x => {
          if (x.typeOfProduct === 1000) {
            return x.childMpList[0].id
          }
          return x.id
        })

      await this.$promotion.$api.promotion.delLevelGift({
        ids: [...new Set(ids)],
        promotionRuleId: this.params.promotionRuleId
      })
      await this.querySelectedGiftList()
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  max-height: none !important;
}
.cp-tree-select {
  width: 200px;
  display: inline-block;
}
.el-select {
  display: inline-block !important;
  vertical-align: inherit !important;
}
</style>
