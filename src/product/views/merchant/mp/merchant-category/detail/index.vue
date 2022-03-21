<template>
  <div class="front">
    <div class="front-left">
      <el-row>
        <el-col :span="5">{{ $t('类目树ID') }}:</el-col>
        <el-col :span="12">{{ categoryId }}</el-col>
      </el-row>
      <categoryTreeEdit
        :category-id="categoryId"
        :is-edit="!isView"
        @getData="getData"
        @toBatch="toBatch"
      />
    </div>
    <div class="front-right">
      <div class="category-detail">
        <h4>{{ $t('类目详情') }}</h4>
        <el-col :span="8">{{ $t('类目编码') }}：{{ detailInfo.categoryCode }}</el-col>
        <el-col :span="8">{{ $t('第三方编码') }}：{{ detailInfo.thirdCode }}</el-col>
        <el-row>
          <el-col :span="8">{{ $t('类目名称') }}：{{ detailInfo.name }}</el-col>
        </el-row>
        <el-row class="margin10">
          <el-col :span="8">{{ $t('类目名称') }}({{ lang }})：{{ detailInfo.nameLan2 }}</el-col>
          <el-col :span="8">{{ $t('状态') }}：{{ visibleMap[detailInfo.isVisible] }}</el-col>
          <el-col :span="8">
            {{ $t('图片') }}：
            <el-image :src="detailInfo.pictureUrl" fit="fill" style="width: 80px; height: 80px" />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import categoryTreeEdit from '@/components/category-tree-edit'
import mpConstant from '@/constant/mpConstant.js'
export default {
  components: {
    categoryTreeEdit
  },
  data() {
    return {
      AttrVisible: false,
      linkVisible: false,
      taskVisible: false,
      selectedRelations: [],
      visibleMap: mpConstant.VISIBLE_TYPE,
      categoryId: this.$route.query.id,
      isView: this.$route.query.isView,
      detailInfo: {},
      activeName: '1',
      lang: this.$t('第二语言'),
      maxSortValue: 0,
      tableData: [],
      columns: [
        {
          label: this.$t('商家类目名称'),
          prop: 'leftTreeNodeName',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('后台类目名称'),
          prop: 'rightTreeNodeName',
          align: 'center',
          show: true,
          minWidth: 160
        }
      ],
      operates: {
        align: 'center',
        width: 150,
        fixed: 'right',
        list: [
          {
            label: this.$t('解除关联'),
            method: (index, row) => {
              this.deleteRelation(row)
            },
            code: 'MerchantCategoryManageDisassociation'
          }
        ]
      }
    }
  },
  mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      this.isView =
        typeof this.$route.query.isView === 'boolean'
          ? this.$route.query.isView
          : this.$route.query.isView !== 'false'
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    cancel() {
      this.AttrVisible = false
    },
    getData(data) {
      this.detailInfo = data
    },
    ok() {
      this.AttrVisible = false
      console.log(this.selected)
    },
    linkCategory(data) {
      console.log(data)
    },
    toBatch(importType, taskType) {
      if (this.$portal.hasPermission('MerchantCategoryManageImport')) {
        this.$router.push({
          name: 'ProductCategoryBatch',
          query: { importType: importType, taskType: taskType, treeId: this.categoryId }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.front {
  display: flex;
  .front-left {
    min-height: 700px;
    width: 400px;
    background: #ffffff;
    padding: 20px;
  }
  .front-right {
    flex: 1;
    background: #ffffff;
    padding: 20px;
    min-height: 700px;
    margin-left: 1px;
    .margin10 {
      margin: 10px 0 20px 0;
    }
    .category-detail {
      border-bottom: 1px solid #f1f1f1;
    }
  }
}
</style>
