<template>
  <div class="">
    <ody-dialog :visible.sync="dialogVisible" :title="$t('添加优惠券')" width="80%" @close="handleClose">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="350px" class="form">
            <el-row>
              <el-col :span="8">
                <el-form ref="info" :model="info" label-width="130px">
                  <el-form-item :label="$t('优惠券ID')" prop="name">
                    <el-input v-model="searchRelForm.obj.id" name="searchRelForm_obj_id" />
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="handleRelSearchReset" size="small" @click="handleRelSearchReset">{{ $t('common_reset') }}</el-button>
          <ody-button name="handleRelSearchSubmit" size="small" type="primary" @click="handleRelSearchSubmit">{{ $t('common_select') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="gridData"
            :columns="chooseColumns"
            :can-filter="false"
            :operates="chooseOperates"
            name="gridData039"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="relPage.currentPage"
            :list="gridData"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="relPage.itemsPerPage"
            :total.sync="relPage.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleRelSearchSubmit"
            @current-change="handleRelPageCurrentChange"
          />

        </div>
      </ody-list-table-area>
    </ody-dialog>
    <!--查看优惠券-->
    <ody-dialog :visible.sync="dialogVisibleView" :title="$t('查看优惠券')" width="80%" @close="handleViewClose">
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="viewLoading"
            :data="viewData"
            :columns="viewColumns"
            :can-filter="false"
            :operates="viewOperates"
            name="viewData704"
          />
        </div>
        <!--<div slot="page">
          <ody-pagination background
              :current-page.sync="viewPage.currentPage"
              :list="viewData"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="viewPage.itemsPerPage"
              :total.sync="viewPage.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleViewSearchSubmit"
              @current-change="handleViewPageCurrentChange"
            />

        </div>-->
      </ody-list-table-area>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: true
    },
    dialogVisibleView: {
      type: Boolean,
      default: true
    },
    ilist: {
      type: Object,
      default: function() {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      viewLoading: false,
      choosed: [],
      choosedArr: [],
      searchRelForm: getDefaultSearchForm(),
      relPage: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      chooseColumns: [
        {
          show: true,
          prop: 'id',
          label: this.$t('优惠券ID'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'themeTitle',
          label: this.$t('优惠券名称'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'couponAmount',
          label: this.$t('面值（元）'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'startTime',
          label: this.$t('有效时间'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            var startTime = new Date(row.startTime)
            var endTime = new Date(row.endTime)
            return this.$portal.parseTime(startTime) + ' - ' + this.$portal.parseTime(endTime)
          }
        },
        {
          show: true,
          prop: 'individualLimit',
          label: this.$t('每人限领（张）'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('使用条件（元）'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            return '满' + row.useLimit + this.$t('元可用')
          }
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('已发行量/已领取/已使用'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            return row.sendedCouopns + '/' + row.drawedCoupons + '/' + row.usedCouopns
          }
        }
      ],
      chooseOperates: {
        fixed: 'right',
        width: 150,
        align: 'center',
        list: [
          {
            label: this.$t('选择'),
            method: (index, row) => {
              this.choosed.push({ id: row.couponThemeIdStr })
              this.choosedArr.push(row.couponThemeIdStr)
              this.$emit('updateData', this.choosed)
            },
            disabled: (index, row) => {
              if (this.isAdd) {
                // 新增判断
                return this.choosedArr.indexOf(row.couponThemeIdStr) >= 0
              }

              return this.choosedArr.indexOf(row.couponThemeIdStr) >= 0 || !this.isEdit
            }
          },
          {
            label: this.$t('删除'),
            method: (index, row) => {
              var ind = this.choosedArr.indexOf(row.couponThemeIdStr)
              if (ind >= 0) {
                this.choosed.splice(ind, 1)
                this.choosedArr.splice(ind, 1)
                this.$emit('updateData', this.choosed)
              }
            },
            disabled: (index, row) => {
              if (this.isAdd) {
                // 新增判断
                return this.choosedArr.indexOf(row.couponThemeIdStr) < 0
              }
              return this.choosedArr.indexOf(row.couponThemeIdStr) < 0 || !this.isEdit
            }
          }
        ]

      },
      viewPage: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      viewColumns: [
        {
          show: true,
          prop: 'id',
          label: this.$t('优惠券ID'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'themeTitle',
          label: this.$t('优惠券名称'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'couponAmount',
          label: this.$t('面值（元）'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'startTime',
          label: this.$t('有效时间'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            var startTime = new Date(row.startTime)
            var endTime = new Date(row.endTime)
            return this.$portal.parseTime(startTime) + ' - ' + this.$portal.parseTime(endTime)
          }
        },
        {
          show: true,
          prop: 'individualLimit',
          label: this.$t('每人限领（张）'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('使用条件（元）'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            return '满' + row.useLimit + this.$t('元可用')
          }
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('已发行量/已领取/已使用'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            return row.sendedCouopns + '/' + row.drawedCoupons + '/' + row.usedCouopns
          }
        }
      ],
      viewOperates: {
        fixed: 'right',
        width: 150,
        align: 'center',
        list: [
          {
            label: this.$t('删除'),
            method: (index, row) => {
              var ind = this.choosedArr.indexOf(row.couponThemeIdStr)
              if (ind >= 0) {
                this.choosed.splice(ind, 1)
                this.choosedArr.splice(ind, 1)
                for (var j = 0; j < this.viewData.length; j++) {
                  if (this.viewData[j].couponThemeIdStr === row.couponThemeIdStr) {
                    this.viewData.splice(j, 1)
                    this.viewPage.total -= 1
                    break
                  }
                }
                this.$emit('updateData', this.choosed)
              }
            },
            disabled: (index, row) => {
              if (this.isAdd) {
                // 新增判断
                // return this.choosedArr.indexOf(row.couponThemeIdStr) < 0
                return false
              }
              // return this.choosedArr.indexOf(row.couponThemeIdStr) < 0 || !this.isEdit
              return !this.isEdit
            }
          }
        ]

      },
      gridData: [],
      viewData: []
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async showSelect() {
      this.viewLoading = true
      this.viewData = []
      // var pages = 0
      for (var i = 0; i < this.choosedArr.length; i++) {
        await chooseViewCouponList(this, this.choosedArr[i])
        // pages++
        // if (pages >= this.viewPage.itemsPerPage) {
        //   break
        // }
      }
      this.viewLoading = false
    },
    async showSelect2(arrs) {
      this.viewLoading = true
      this.viewData = []
      // var pages = 0
      for (var i = 0; i < arrs.length; i++) {
        await chooseViewCouponList(this, arrs[i].id)
        // pages++
        // if (pages >= this.viewPage.itemsPerPage) {
        //   break
        // }
      }
      this.viewLoading = false
    },
    async listCoupon() {
      await chooseCouponList(this)
    },
    async handleRelSearchSubmit() {
      try {
        this.relPage.currentPage = 1
        await this.listCoupon()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleViewSearchSubmit() {

    },
    handleViewPageCurrentChange() {

    },
    handleRelSearchReset() {
      this.searchRelForm = getDefaultSearchForm()
      this.handleRelSearchSubmit()
    },
    async handleRelPageCurrentChange() {
      try {
        await this.chooseCouponList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleClose() {
      this.$emit('closeDialog', !this.dialogVisible)
      return true
    },
    handleViewClose() {
      this.$emit('closeViewDialog', !this.dialogVisibleView)
      return true
    },
    matchCoupon() {
      var nowList = this.ilist
      this.choosed = []
      this.choosedArr = []
      for (var i = 0; i < nowList.length; i++) {
        if (nowList[i].type !== 3) { // 优惠券
          continue
        }
        var jsonCoupon = JSON.parse(nowList[i].param)
        if (!jsonCoupon) {
          continue
        }
        for (var ari = 0; ari < jsonCoupon.length; ari++) {
          this.choosed.push(jsonCoupon[ari])
          this.choosedArr.push(jsonCoupon[ari].id)
        }
      }
    },
    init() {
      // this.listCoupon()
      // this.matchCoupon()
    }
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {
      currentPage: 1,
      itemsPerPage: 10,
      obj: {}
    }
  )
}

async function chooseCouponList(vue) {
  const rightsInterests = vue.$crm.$api.rightsInterests
  vue.searchRelForm.obj.couponGiveRule = 4 // 前台领劵
  vue.searchRelForm.obj.status = 4 // 进行中
  const res = await rightsInterests.queryCouponActivityPG(vue.searchRelForm)
  if (res.code === '0') {
    vue.gridData = res.data.listObj
    vue.relPage.total = res.data.total
  }
}

async function chooseViewCouponList(vue, id) {
  const rightsInterests = vue.$crm.$api.rightsInterests
  var obj = getDefaultSearchForm()
  obj.obj.couponThemeIdsStr = [id]
  const res = await rightsInterests.queryCouponActivityPG(obj)
  if (res.code === '0') {
    console.log(id)
    console.log(res.data.listObj[0].couponThemeIdStr)
    res.data.listObj[0].couponThemeIdStr = id
    vue.viewData = vue.viewData.concat(res.data.listObj)
    vue.viewPage.total += res.data.total
    console.log(vue.viewData)
  }
}

</script>

<style lang="scss" scoped>
</style>
