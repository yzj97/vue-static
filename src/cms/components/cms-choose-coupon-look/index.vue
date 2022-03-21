<template>
  <div class="cms-choose-coupon-look">
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('添加优惠券活动')"
      width="960px">

      <div class="btn-list">
        <div class="item-btn">
          <el-button
            name="openChooseCoupon"
            size="mini"
            type="primary"
            @click="openChooseCoupon">
            选择优惠券活动
          </el-button>
          <el-button
            name="batchDeleteCoupon"
            size="mini"
            @click="batchDeleteCoupon"
          >
            批量删除
          </el-button>
        </div>
      </div>
      <div class="table-area">
        <ody-table
          ref="table"
          :data="table.list"
          :columns="table.columns"
          :operates="table.operates"
          :multiple="true"
          :checked.sync="checkedList"
          name="table_list894"
        >
          <template slot="status" slot-scope="scope">
            {{ scope.row.status | keyVal(statusMap) }}
          </template>
          <template slot="sortValue" slot-scope="scope">
            <el-input-number v-model="scope.row.sortValue" :min="1" name="scope_row_sortValue" size="small" @change="updateSort(scope.row)" />
          </template>
          <template v-if="scope.row.startTime" slot="startTime" slot-scope="scope">
            {{ scope.row.startTime | parseTime }} - {{ scope.row.endTime | parseTime }}
          </template>
          <template slot="couponAmount" slot-scope="scope">
            {{ scope.row.couponDiscountType ? `${scope.row.couponAmount}折，折扣上限${scope.row.useUpLimit}元` : scope.row.couponAmount }}
          </template>
        </ody-table>
        <div class="block pagination-border-component">
          <ody-pagination
            :current-page="currentPage"
            :list="table.list"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>

      </div>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">关 闭</el-button>
      </span>
    </ody-dialog>
    <cms-choose-coupon-set
      v-if="couponSetVisible"
      :module-id="moduleId"
      :visible.sync="couponSetVisible"
      @ok="changeCoupon"/>
  </div>
</template>

<script>
import CmsChooseCouponSet from '@/components/cms-choose-coupon-set'
export default {
  components: {
    CmsChooseCouponSet
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    moduleId: {
      type: String,
      default: ''
    },
    goodsType: {
      type: Number,
      default: 0
    },
    formData: {
      type: Object,
      default: () => {}
    },
    pageId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checkedList: [],
      couponSetVisible: false,
      promotioncouponSetVisible: false,
      goodsPropertyVisible: false,
      itemInfo: {},
      promotionInfo: {},
      statusMap: {
        0: this.$t('待提交'),
        1: this.$t('待审核'),
        2: this.$t('未开始'),
        3: this.$t('审核未通过'),
        4: this.$t('进行中'),
        5: this.$t('已失效'),
        6: this.$t('已关闭')
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      table: {
        list: [],
        columns: [
          {
            label: this.$t('优惠券活动ID'),
            prop: 'id',
            show: true
          },
          {
            label: this.$t('优惠券活动名称'),
            width: 150,
            prop: 'themeTitle',
            show: true
          },
          {
            label: this.$t('券活动日期'),
            slot: 'startTime',
            show: true
          },
          {
            label: this.$t('状态'),
            slot: 'status',
            show: true
          },
          {
            label: this.$t('面值'),
            slot: 'couponAmount',
            show: true
          },
          {
            label: this.$t('顺序'),
            slot: 'sortValue',
            width: 150,
            show: true
          }
        ],
        operates: {
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.deleteItem(row)
              },
              code: 'ui'
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.currentPage = 1
      this.query()
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    openChooseCoupon() {
      this.couponSetVisible = true
    },
    query() {
      const params = {
        moduleId: this.moduleId,
        page: this.currentPage,
        limit: this.pageSize
      }
      this.$cms.$api.cmsEdit.listCmsModuleRefPage(params).then(res => {
        this.table.list = res.data.listObj || []
        if (this.table.list) {
          this.table.list.forEach(item => {
            if (item.status === 4 && new Date() > item.endTime) {
              item.status = 5
            }
          })
        }
        this.total = res.data.total || 0
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.query()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.query()
    },
    updateSort(item) {
      const params = {
        id: item.id,
        moduleId: this.moduleId,
        sortValue: item.sortValue
      }
      this.$cms.$api.cmsEdit.updateCmsModuleRef(params).then(res => {
        this.formData.model.dataChange += 1
        this.query()
      })
    },
    batchDeleteCoupon() {
      if (this.checkedList.length === 0) {
        this.$message('请先选择要删除的优惠券活动')
        return
      }
      const ids = this.checkedList.map(item => item.id)
      this.$cms.$api.cmsEdit.deleteCmsModuleRef(ids).then(res => {
        this.checkedList = []
        this.changeCoupon()
      })
    },
    deleteItem(item) {
      const id = [item.id]
      this.$cms.$api.cmsEdit.deleteCmsModuleRef(id).then(res => {
        if (this.table.list.length === 1 && this.currentPage > 1) {
          this.currentPage = this.currentPage - 1
        }
        this.modityCoupon()
      })
    },
    changeCoupon() {
      this.formData.model.dataChange += 1
      this.init()
    },
    modityCoupon() {
      this.formData.model.dataChange += 1
      this.query()
    }

  }
}
</script>

<style lang="less" scoped>
.btn-list {
  display: flex;
}
.table-area {
  margin-top: 10px;
}
.promotion-info{
  .lable-name{
    text-align: right;
    margin-right: 20px;
  }
}

</style>
