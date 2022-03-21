<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('角标名称') + ':'" prop="name">
            <el-input v-model="search.name" name="search_name" />
          </ody-search-item>
          <ody-search-item :label="$t('角标编码') + ':'" prop="code">
            <el-input v-model="search.code" name="search_code" />
          </ody-search-item>
          <ody-search-item :label="$t('显示位置') + ':'" prop="displayType">
            <el-select
              v-model="search.displayType"
              :placeholder="$t('显示位置')"
              name="search_displayType"
            >
              <el-option
                v-for="(v, k) in displayType"
                :key="k"
                :label="v"
                :value="k"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('生效时间') + ':'" :space="2" prop="validTime">
            <ody-date-range-picker
              v-model="search.validTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_validTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{
          $t("重置")
        }}</el-button>
        <ody-button
          name="SuperscriptPageQuery_handleSubmit"
          size="small"
          type="primary"
          code="SuperscriptPageQuery"
          @click="handleSubmit"
        >{{ $t("查询") }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="SuperscriptPageAdd_addSuperscript"
          size="small"
          type="primary"
          code="SuperscriptPageAdd"
          @click="addSuperscript()"
        >{{ $t("新增") }}</ody-button
        >
      </div>
      <div slot="tabs">
        <el-tabs
          v-model="search.intervalType"
          name="search_intervalType"
          @tab-click="query"
        >
          <el-tab-pane :label="$t('common_all')" value />
          <el-tab-pane
            v-for="(v, k) in intervalType"
            :label="v"
            :key="k"
            :value="k"
          >
            <div slot="label">{{ v }} ( {{ intervalTypeCounts[k] }} )</div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :multiple="true"
          :columns="table.columns"
          :operates="table.operates"
          request-url="/back-product-web/back/mp/superscript/listSuperscriptByPage.do"
        >
          <template slot="displayTypeSlot" slot-scope="scope">{{
            scope.row.displayType | keyVal(displayType)
          }}</template>
          <template slot="intervalTypeSlot" slot-scope="scope">{{
            scope.row.intervalType | keyVal(intervalType)
          }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
export default {
  name: 'Superscript',
  data() {
    const self = this
    return {
      search: {
        name: '',
        code: '',
        validTime: [],
        displayType: null,
        intervalType: null
      },
      displayType: [],
      intervalType: [],
      intervalTypeCounts: {},
      table: {
        columns: [
          {
            label: self.$t('角标名称'),
            prop: 'name',
            show: true,
            align: 'left'
          },
          {
            label: self.$t('角标编码'),
            prop: 'code',
            show: true,
            align: 'left'
          },
          {
            label: self.$t('角标图片'),
            show: true,
            prop: 'iconUrl',
            align: 'left',
            formatter: param => {
              return param.iconUrl
                ? `<img width='50' src='${param.iconUrl}'>`
                : ''
            }
          },
          {
            label: self.$t('角标图片（第二语言）'),
            show: true,
            prop: 'iconUrlLan2',
            align: 'left',
            minWidth: 200,
            formatter: param => {
              return param.iconUrlLan2
                ? `<img width='50' src='${param.iconUrlLan2}'>`
                : ''
            }
          },
          {
            label: self.$t('显示位置'),
            slot: 'displayTypeSlot',
            show: true,
            align: 'left'
          },
          {
            label: self.$t('生效时间起'),
            prop: 'validFrom',
            show: true,
            align: 'left',
            minWidth: 200
          },
          {
            label: self.$t('生效时间止'),
            prop: 'validTo',
            show: true,
            align: 'left',
            minWidth: 200
          },
          {
            label: self.$t('生效状态'),
            slot: 'intervalTypeSlot',
            show: true,
            align: 'left'
          },
          {
            label: self.$t('优先级'),
            prop: 'priority',
            show: true,
            align: 'left'
          },
          {
            label: self.$t('备注'),
            prop: 'description',
            show: true,
            align: 'left',
            minWidth: 200
          }
        ],
        operates: {
          minWidth: 260,
          fixed: 'right',
          list: [
            {
              label: self.$t('common_watch_detail'),
              method: (index, row) => {
                this.$router.push({
                  name: 'SuperscriptDetail',
                  query: { id: row.id }
                })
              },
              code: 'SuperscriptPageDetail'
            },
            {
              label: self.$t('edit'),
              method: (index, row) => {
                this.$router.push({
                  name: 'SuperscriptEdit',
                  query: { id: row.id }
                })
              },
              code: 'SuperscriptPageEdit'
            },
            {
              label: self.$t('关联商品'),
              method: (index, row) => {
                this.$router.push({
                  name: 'SuperscriptBind',
                  query: { id: row.id }
                })
              },
              disabled: (index, row) => {
                return row.intervalType === 2
              },
              code: 'SuperscriptPageAssociationMp'
            },
            {
              label: self.$t('delete'),
              method: (index, row) => {
                this.deleteSuperscript(row)
              },
              code: 'SuperscriptPageDelete'
            }
          ]
        }
      }
    }
  },
  created() {
    this.mpApi = this.$product.$api.mpApi
  },
  async mounted() {
    await this._initCodes()
    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('search')
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    addSuperscript() {
      this.$router.push({
        name: 'SuperscriptEdit',
        query: {}
      })
    },
    query() {
      const {
        validTime,
        ...params
      } = this.search
      if (validTime !== null && validTime.length === 2) {
        const validTimeBegin = validTime[0]
        const validTimeEnd = validTime[1]
        params.validFrom = validTimeBegin
        params.validTo = validTimeEnd
      }

      params.intervalType -= 1
      this.mpApi.countIntervalTypes(this.formHasValue(params)).then(data => {
        if (data.code === '0') {
          [0, 1, 2].forEach(i => this.$set(this.intervalTypeCounts, i, 0))
          data.data.forEach(c => {
            this.$set(
              this.intervalTypeCounts,
              c.intervalType,
              c.intervalTypeCount
            )
          })
        }
      })
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    deleteSuperscript(s) {
      this.$confirm(this.$t('是否确认删除？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.mpApi.deleteSuperscriptById(s).then(res => {
          this.$message({
            showClose: true,
            message: this.$t('操作成功'),
            type: 'success'
          })
          this.query()
        })
      })
    },
    async _initCodes() {
      const vue = this
      this.$product.$api.common
        .listMultiCode({ categorys: ['DISPLAY_TYPE', 'INTERVAL_TYPE'] })
        .then(data => {
          if (data.code === '0') {
            vue.displayType = data.data.DISPLAY_TYPE
            vue.intervalType = data.data.INTERVAL_TYPE
          }
        })
    }
  }
}
</script>
