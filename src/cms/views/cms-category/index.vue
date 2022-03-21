<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('分类ID:')">
            <el-input v-model="searchForm.id" :placeholder="$t('请输入分类ID')" name="searchForm_id"/>
          </ody-search-item>
          <ody-search-item :label="$t('分类名称:')">
            <el-input v-model="searchForm.categoryName" :placeholder="$t('请输入分类名称')" name="searchForm_categoryName"/>
          </ody-search-item>
          <ody-search-item :label="$t('状态:')">
            <el-select v-model="searchForm.isAvailable" :placeholder="$t('全部')" name="searchForm_isAvailable">
              <el-option
                v-for="item in isAvailables"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('所属终端:')">
            <el-select v-model="searchForm.platform" :placeholder="$t('全部')" name="searchForm_platformIds">
              <el-option
                v-for="item in platformIds"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="CmsCategoryList01_handlePageCurrentChange" code="CmsCategoryList01" size="small" type="primary" @click="handlePageCurrentChange">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <!--新增-->
        <ody-button name="CmsCategoryList02_add" code="CmsCategoryList02" size="small" type="primary" @click="add">{{ $t('添加分类') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="tableData"
          :columns="columns"
          :expand="false"
          :can-filter="false"
          :operates="operates"
          name="tableData399"
          row-key="id"
        >
          <template slot="images" slot-scope="scope">
            <div>
              <el-image :src="scope.row.images" :preview-src-list="[scope.row.images]" style="width: 120px; height: 120px"/>
            </div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.currentPage"
          :list="tableData"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.itemsPerPage"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>

    <ody-dialog :visible.sync="dialogAddVisible" :title="addOrUpdateTitle" :close-on-click-modal="false" :before-close="closeDialog" width="700px">
      <el-form ref="form" :model="infoForm" label-width="80px">
        <el-form-item :label="$t('上级分类')" required>
          <el-cascader
            v-model="infoForm.superCategoryList"
            :options="categoryTree"
            :props="{ value:'id', label: 'categoryName', checkStrictly: true, expandTrigger: 'hover' }"
            name="value"
            @change="handleChange"/>
        </el-form-item>
        <el-form-item :label="$t('所属终端')" required>
          <el-checkbox-group v-model="infoForm.platIds" name="infoForm_platIds">
            <el-checkbox :label="1" :disabled="disabledPC" name="pids">PC</el-checkbox>
            <el-checkbox :label="2" :disabled="disabledH5" name="pids">H5</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('分类名称')" required>
          <el-input v-model="infoForm.categoryName" name="infoForm_categoryName" maxlength="12" show-word-limit/>
        </el-form-item>
        <el-form-item :label="$t('排序')">
          <el-input-number v-model="infoForm.sortValue" :min="0" :max="999999" name="infoForm_sortValue" size="medium"/>
        </el-form-item>
        <el-form-item :label="$t('图片')">
          <ody-upload-image
            v-model="infoForm.images"
            :pic-type="['jpg', 'jpeg', 'png']"
            :pic-size="4096"
            :show-tip="false"
          />
          <div>{{ $t('提示：支持上传一张，建议尺寸700*700PX，单张大小不超过4M，支持JPG、JPEG、PNG格式') }}</div>
        </el-form-item>
        <el-form-item :label="$t('状态')" required>
          <el-radio-group v-model="infoForm.isAvailable" name="infoForm_isAvailable">
            <el-radio :label="1">{{ $t('启用') }}</el-radio>
            <el-radio :label="0">{{ $t('禁用') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <ody-button name="ui_submit" code="ui" size="small" type="primary" @click="submit">{{ $t('确定') }}</ody-button>
        <ody-button name="ui_closeDialog" code="ui" size="small" @click="closeDialog">{{ $t('取消') }}</ody-button>
      </span>
    </ody-dialog>

  </section>
</template>

<script>
export default {
  name: 'CmsCategoryList', // 2级路由-需要标注名称，不然不能缓存
  data() {
    return {
      categoryTree: [],
      selectCategoryType: null,
      disabledPC: false,
      disabledH5: false,
      addOrUpdateTitle: this.$t('分类新增'),
      isAvailables: [{ 'code': 1, 'name': this.$t('启用') }, { 'code': 0, 'name': this.$t('禁用') }],
      platformIds: [{ 'code': 1, 'name': 'PC' }, { 'code': 2, 'name': 'H5' }],
      dialogAddVisible: false,
      searchForm: getDefaultSearchForm(),
      infoForm: {
        superCategoryList: [],
        isAvailable: 1,
        platIds: [],
        images: '',
        levelValue: null,
        categoryName: null
      },
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      tableData: [],
      columns: [
        {
          label: this.$t('分类名称'),
          prop: 'categoryName',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('分类ID'),
          prop: 'id',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('所属终端'),
          prop: 'id',
          show: true,
          formatter: (row, column, cellValue) => {
            var str = ''
            if (row.platformList && row.platformList.length > 0) {
              for (var index in row.platformList) {
                var item = row.platformList[index]
                if (item.platform === 1) {
                  str = str + 'PC '
                } else if (item.platform === 2) {
                  str = str + 'H5 '
                }
              }
            }
            return str
          }
        },
        {
          label: this.$t('排序'),
          align: 'center',
          prop: 'sortValue',
          show: true
        },
        {
          label: this.$t('状态'),
          prop: 'isAvailable',
          show: true,
          formatter: (row, column, cellValue) => {
            if (row.isAvailable && row.isAvailable === 1) {
              return this.$t('启用')
            } else {
              return this.$t('禁用')
            }
          }
        },
        {
          label: this.$t('图片'),
          slot: 'images',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('修改时间'),
          prop: 'createTime',
          show: true,
          formatter: (row, column, cellValue) => {
            if (row.updateTime) {
              return this.$portal.parseTime(new Date(row.updateTime), '{y}-{m}-{d} {h}:{i}:{s}')
            }
            if (row.createTime) {
              return this.$portal.parseTime(new Date(row.createTime), '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 300,
        align: 'center',
        list: [
          {
            label: this.$t('编辑'),
            code: 'CmsCategoryList03',
            method: (index, row) => {
              this.update(row)
            }
          },
          {
            label: this.$t('添加子类'),
            code: 'CmsCategoryList06',
            method: (index, row) => {
              this.addSon(row)
            },
            hidden: (index, row) => {
              if (row.levelValue === 2) {
                return true
              } else {
                return false
              }
            }
          },
          {
            label: this.$t('启用'),
            code: 'CmsCategoryList04',
            method: (index, row) => {
              this.updateAvailable(row, 1)
            },
            hidden: (index, row) => {
              if (row.isAvailable === 0) {
                return false
              } else {
                return true
              }
            }
          },
          {
            label: this.$t('禁用'),
            code: 'CmsCategoryList04',
            method: (index, row) => {
              this.updateAvailable(row, 0)
            },
            hidden: (index, row) => {
              if (row.isAvailable === 1) {
                return false
              } else {
                return true
              }
            }
          },
          {
            label: this.$t('删除'),
            code: 'CmsCategoryList05',
            method: (index, row) => {
              this.$confirm(this.$t('delete_cannot_revert_confirm_delete'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.del(row)
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: this.$t('已取消')
                })
              })
            },
            hidden: (index, row) => {
              if (row.isSystem === 0) {
                return false
              } else {
                return true
              }
            }
          }
        ]
      }
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
    init() {
      this.handleQuery()
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
    },
    async handleQuery() {
      const vue = this
      vue.loading = true
      const params = {
        page: vue.page.currentPage,
        limit: vue.page.itemsPerPage,
        filters: {
          levelValueList: [1],
          categoryType: 1,
          ...this.formHasValue(this.searchForm)
        }
      }

      try {
        const res = await vue.$cms.$api.category.listPage(params)
        vue.page.total = res.total
        vue.tableData = res.data
      } finally {
        vue.loading = false
      }
    },
    handlePageCurrentChange() {
      this.handleQuery()
    },
    handlePageSizeChange() {
      this.handleQuery()
    },
    closeDialog() {
      this.dialogAddVisible = false
      this.infoForm = { superCategoryList: [], isAvailable: 1, platIds: [], images: '', levelValue: null, categoryName: null }
      this.disabledPC = false
      this.disabledH5 = false
    },
    async del(row) {
      var vue = this
      const category = this.$cms.$api.category
      await category.deleteCmsCategory({ categoryId: row.id }).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: this.$t('删除成功')
          })
          vue.handlePageCurrentChange()
        }
      })
    },
    async add() {
      await this.listCategoryTree()
      this.addOrUpdateTitle = this.$t('分类新增')
      this.dialogAddVisible = true
    },
    async addSon(row) {
      await this.listCategoryTree()
      this.addOrUpdateTitle = this.$t('新增子类')
      this.infoForm.superCategoryList = [row.superCategory, row.id]
      this.handleChange([row.superCategory, row.id])
      this.dialogAddVisible = true
    },
    async updateAvailable(row, flag) {
      var vue = this
      const category = this.$cms.$api.category
      await category.updateAvailable({ id: row.id, isAvailable: flag }).then(res => {
        if (res) {
          if (res) {
            vue.$message({
              message: vue.$t('保存成功'),
              type: 'success'
            })
            vue.handlePageCurrentChange()
          }
        }
      })
    },
    async update(row) {
      await this.listCategoryTree()
      this.addOrUpdateTitle = this.$t('分类编辑')
      this.setInfo(row)
      this.dialogAddVisible = true
    },
    setInfo(row) {
      const vue = this
      vue.infoForm.id = row.id
      vue.infoForm.categoryName = row.categoryName
      vue.infoForm.superCategory = row.superCategory
      vue.infoForm.sortValue = row.sortValue
      vue.infoForm.images = row.images
      vue.infoForm.isAvailable = row.isAvailable
      vue.infoForm.levelValue = row.levelValue
      if (row.levelValue !== 0 && row.levelValue !== 1) {
        // 不是顶级
        for (const index in vue.categoryTree) {
          const item = vue.categoryTree[index]
          if (item.id === row.superCategory) {
            vue.infoForm.superCategoryList = [item.superCategory, row.superCategory]
            break
          } else {
            for (const childIndex in item.children) {
              const childItem = item.children[childIndex]
              if (childItem.id === row.superCategory) {
                vue.infoForm.superCategoryList = [childItem.superCategory, row.superCategory]
                break
              }
            }
          }
        }
      } else {
        vue.infoForm.superCategoryList = [row.superCategory]
      }

      vue.infoForm.platIds = []
      for (const index in row.platformList) {
        if (row.platformList[index]) {
          vue.infoForm.platIds.push(row.platformList[index].platform)
        }
      }

      if (row.children && row.children.length > 0) {
        for (const childIndex in row.children) {
          const platformList = row.children[childIndex].platformList
          for (const childPlatformIndex in platformList) {
            const childPlatform = platformList[childPlatformIndex]
            if (childPlatform.isAvailable === 1 && childPlatform.platform === 1) {
              vue.disabledPC = true
            }
            if (childPlatform.isAvailable === 1 && childPlatform.platform === 2) {
              vue.disabledH5 = true
            }
          }
        }
      } else {
        // 是子类
        if (vue.infoForm.platIds.indexOf(1) === -1) {
          vue.disabledPC = true
        } else if (vue.infoForm.platIds.indexOf(2) === -1) {
          vue.disabledH5 = true
        }
      }
    },
    async submit() {
      var vue = this
      if (vue.valid()) {
        var param = {}
        param.categoryName = vue.infoForm.categoryName
        param.isAvailable = vue.infoForm.isAvailable
        if (vue.infoForm.sortValue) {
          param.sortValue = vue.infoForm.sortValue
        }
        param.superCategory = vue.infoForm.superCategoryList[vue.infoForm.superCategoryList.length - 1]
        param.categoryType = this.selectCategoryType
        param.platformIds = this.infoForm.platIds.join(',')
        param.levelValue = this.infoForm.levelValue
        param.images = this.infoForm.images
        if (this.infoForm.id) {
          param.id = this.infoForm.id
        }

        // add
        const category = this.$cms.$api.category
        await category.saveOrUpdateCategory(param).then(res => {
          if (res) {
            this.$message({
              message: vue.$t('保存成功'),
              type: 'success'
            })
          }
        })

        this.closeDialog()
        this.handlePageCurrentChange()
      }
    },
    handleChange(value) {
      const vue = this
      vue.disabledPC = false
      vue.disabledH5 = false
      vue.infoForm.platIds = []
      var id = value[value.length - 1]
      for (const index in vue.categoryTree) {
        const item = vue.categoryTree[index]
        if (item.id === id) {
          vue.setCategory(item)
          break
        } else {
          for (const childIndex in item.children) {
            const childItem = item.children[childIndex]
            if (childItem.id === id) {
              vue.setCategory(childItem)
              break
            }
          }
        }
      }
    },
    setCategory(item) {
      const vue = this
      vue.selectCategoryType = item.categoryType
      vue.infoForm.levelValue = item.levelValue + 1
      const idArr = []
      let pcDisable = true
      let h5Disable = true
      for (const index in item.platformList) {
        if (item.platformList[index].platform === 1) { // PC
          pcDisable = false
        }
        if (item.platformList[index].platform === 2) { // H5
          h5Disable = false
        }
        idArr.push(item.platformList[index].platform)
      }
      vue.disabledH5 = h5Disable
      vue.disabledPC = pcDisable
      vue.infoForm.platIds = idArr
    },
    valid() {
      var vue = this
      if (!vue.infoForm.superCategoryList || vue.infoForm.superCategoryList.length <= 0) {
        this.$message({
          message: vue.$t('请选择上级分类'),
          type: 'warning'
        })
        return false
      }
      if (!vue.infoForm.platIds || vue.infoForm.platIds.length === 0) {
        this.$message({
          message: vue.$t('所属终端不能为空'),
          type: 'warning'
        })
        return false
      }
      if (!vue.infoForm.categoryName || vue.infoForm.categoryName === '') {
        this.$message({
          message: vue.$t('分类名称是必填项'),
          type: 'warning'
        })
        return false
      }

      return true
    },
    async listCategoryTree() {
      const vue = this
      const res = await vue.$cms.$api.category.listTree({ filters: { levelValueList: [0, 1] }})
      vue.categoryTree = res.data
    }
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {
      platform: null,
      id: null,
      categoryName: null,
      isAvailable: null
    }
  )
}

</script>

<style lang="scss" scoped>
</style>
