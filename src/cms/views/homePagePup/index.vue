<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('弹窗名称')" prop="name">
            <el-input v-model="searchForm.ejectName" clearable maxlength="15"/>
          </ody-search-item>
          <ody-search-item :label="$t('前端渠道名称')" prop="channelCodes">
            <el-select v-model="searchForm.channelCodes" multiple>
              <el-option v-for="item in channelList" :key="item.previewUrl" :label="item.channelName" :value="item.channelCode" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('状态')" prop="ejectStatus">
            <el-select v-model="searchForm.ejectStatus">
              <el-option :label="$t('开启')" :value="0"/>
              <el-option :label="$t('停用')" :value="1"/>
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button size="small" @click="initForm">{{ $t('重置') }}</el-button>
        <el-button size="small" type="primary" @click="queryList">{{ $t('查询') }}</el-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button type="primary" size="small" code="ui" @click="addPup">新增</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="listTable.list"
          :columns="listTable.columns"
          :operates="listTable.operates"
          name="listTable_list184"/>
      </div>
      <div slot="page">
        <div class="block">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="queryGuideUserPage"
            @current-change="queryGuideUserPage"/>
        </div>
      </div>
    </ody-list-table-area>
    <ody-dialog
      v-if="pupUpVisible"
      :visible="pupUpVisible"
      :title="$t('弹框配置')"
      width="960px"
      @close="pupUpClose"
    >
      <el-form ref="formDialog" :rules="rules" :model="pupSet" class="form-dialog">
        <el-form-item prop="ejectName" label="弹窗名称：">
          <el-input v-model="pupSet.ejectName" placeholder="请输入弹窗名称" maxlength="15"/>
        </el-form-item>
        <el-form-item prop="channelCode" label="前端渠道名称：">
          <el-select v-model="pupSet.channelCode" :disabled="!isAdd">
            <el-option v-for="item in channelList" :key="item.channelCode" :label="item.channelName" :value="item.channelCode" />
          </el-select>
        </el-form-item>
        <el-form-item prop="picUrl" label="请上传弹窗图片：">
          <div class="picUrl">
            <ody-upload-image
              v-model="pupSet.picUrl"
              :pic-type="['png','jpg','jpeg']"
              :pic-size="2048"
              :show-tip="false"
            />
            <div class="picUrl-tips">
              <span>提示：</span>
              <div>1.此图片用于在前端商城首页位置弹窗展示</div>
              <div>2.上传一张图片，支持JPG、JPEG、PNG格式</div>
              <div>3.推荐使用方形图片，建议尺寸460*600px，单张大小不超过2M</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="againEject" label="再次弹出设置：">
          <el-radio v-model="pupSet.againEject" :label="0" :disabled="!isAdd">是</el-radio>
          <el-radio v-model="pupSet.againEject" :label="1" :disabled="!isAdd">否</el-radio>
        </el-form-item>
        <el-form-item v-if="pupSet.againEject === 0" :rules="{required: true, message: $t('总弹出次数不能为空'), trigger: ['change', 'blur'] }" prop="ejectNum" label="总弹出次数：">
          <ody-input-number :min="1" :max="99" v-model="pupSet.ejectNum"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <ody-button code="ui" size="small" @click="pupUpClose">取消</ody-button>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">确定</ody-button>
      </span>
    </ody-dialog>
  <StationJump ref="StationJump" :label-name="labelName" @input="getSetLink" v-model="pupValue"/></div>
</template>
<script>
import StationJump from '@/components/station-jump'
export default {
  name: 'HomePagePup',
  components: {
    StationJump
  },
  data() {
    return {
      listTable: {
        list: [],
        columns: [
          {
            'show': true,
            'prop': 'lineNo',
            'label': '序号',
            'align': 'center',
            'minWidth': 70
          },
          {
            'show': true,
            'prop': 'ejectName',
            'label': '弹窗名称',
            'align': 'center',
            'minWidth': 200
          },
          {
            'show': true,
            'prop': 'channelName',
            'label': '渠道名',
            'align': 'center',
            'minWidth': 200
          },
          {
            'show': true,
            'prop': 'channelType',
            'label': '渠道类型',
            'align': 'center',
            'minWidth': 200,
            render: (h, params) => {
              return (
                <span>{+params.row.channelType === 1 ? '自建渠道' : '第三方电商'}</span>
              )
            }
          },
          {
            'show': true,
            'prop': 'ejectStatus',
            'label': '状态',
            'align': 'center',
            'minWidth': 80,
            render: (h, params) => {
              return (
                <span>{+params.row.ejectStatus === 1 ? '停用' : '启用'}</span>
              )
            }
          }
        ],
        operates: {
          'width': 200,
          'fixed': 'right',
          'list': [
            {
              'label': '编辑',
              show: true,
              'disabled': false,
              code: 'ui',
              method: (index, row) => {
                this.openDialog(row)
              }
            },
            {
              'label': '跳转设置',
              show: true,
              'disabled': false,
              code: 'ui',
              method: (index, row) => {
                this.stationJump(row)
              }
            },
            {
              'label': '开启',
              'disabled': false,
              code: 'ui',
              method: (index, row) => {
                this.openOrClose(row)
              },
              hidden: (index, row) => {
                return row.ejectStatus === 0 || row.ejectStatus === null
              }
            },
            {
              'label': '关闭',
              'disabled': false,
              code: 'ui',
              method: (index, row) => {
                this.openOrClose(row)
              },
              hidden: (index, row) => {
                return row.ejectStatus === 1
              }
            }
          ]
        },
        total: 0
      },
      searchForm: {
        currentPage: 1,
        itemsPerPage: 10
      },
      rules: {
        ejectName: { required: true, message: '请输入弹窗名称', trigger: ['change', 'blur'] },
        picUrl: { required: true, message: '当前图片不能为空，请上传后重新提交保存', trigger: 'change' },
        channelCode: { required: true, message: '请选择渠道', trigger: 'change' }
        // ejectNum: { required: true, message: '总弹出次数不能为空', trigger: ['change', 'blur'] }
      },
      pupSet: {
        picUrl: '',
        againEject: 1,
        ejectNum: 1,
        ejectName: '',
        channelCode: ''
      },
      pupUpVisible: false,
      editPupId: '',
      setId: '',
      labelName: '',
      channelList: [],
      isAdd: true,
      pupValue: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.queryHomePagePupList()
      this.getChannelList()
    },
    async queryHomePagePupList() {
      const { code, data, total } = await this.$cms.$api.homePup.listPage(this.searchForm)
      if (+code === 0) {
        data.forEach((element, idx) => {
          element.lineNo = idx + 1
        })
        this.listTable.list = data
        this.listTable.total = total
      } else {
        this.listTable.list = []
        this.listTable.total = 0
      }
    },
    pupUpClose() {
      this.pupUpVisible = false
    },
    handleSubmit() {
      if (this.isAdd) {
        this.addPupCon()
      } else {
        this.editPup()
      }
    },
    editPup() {
      this.$refs.formDialog.validate((valid) => {
        if (valid) {
          if (this.pupSet.againEject === 1) {
            this.pupSet.ejectNum = 1
          }
          const params = {
            id: this.setId,
            ...this.pupSet
          }
          this.$cms.$api.homePup.updatePic(params).then((res) => {
            if (+res.code === 0) {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.init()
              this.pupUpVisible = false
            }
          })
        }
      })
    },
    addPupCon() {
      this.$refs.formDialog.validate((valid) => {
        if (valid) {
          if (this.pupSet.againEject === 1) {
            this.pupSet.ejectNum = 1
          }
          const params = {
            ...this.pupSet
          }
          this.$cms.$api.homePup.addEject(params).then((res) => {
            if (+res.code === 0) {
              this.$message({
                message: '新建成功',
                type: 'success'
              })
              this.init()
              this.pupUpVisible = false
            }
          })
        }
      })
    },
    openDialog({ id, picUrl, ejectNum, againEject, ejectName, channelCode }) {
      this.setId = id
      this.pupSet.picUrl = picUrl
      this.pupSet.ejectNum = ejectNum
      this.pupSet.againEject = againEject
      this.pupSet.ejectName = ejectName
      this.pupSet.channelCode = channelCode
      this.isAdd = false
      this.pupUpVisible = true
    },
    // 站内跳转链接配置
    stationJump({ id, labelName }) {
      this.setId = id
      try {
        if(labelName){
        this.pupValue = JSON.parse(labelName)
        }else{
        this.pupValue = {}
        }
      } catch (error) {
        console.log('error',error)
      }
      setTimeout(() => {
        this.$refs.StationJump.handleShowDialog(true)
      }, 300);
      
    },
    getSetLink(val) {
      const params = {
        'ejectUrl': val.data,
        'id': this.setId,
        'labelName': JSON.stringify(val)
      }
      this.$cms.$api.homePup.updateEject(params).then((res) => {
        if (+res.code === 0) {
          this.$message({
            message: '设置链接地址成功',
            type: 'success'
          })
          this.init()
        }
      })
    },
    async openOrClose({ id, ejectStatus, channelCode }) {
      const params = {
        id,
        channelCode,
        ejectStatus: ejectStatus === 1 ? 0 : 1
      }
      const { code } = await this.$cms.$api.homePup.openOrClose(params)
      if (+code === 0) {
        this.$message({
          message: ejectStatus === 1 ? '开启成功' : '关闭成功',
          type: 'success'
        })
        this.init()
      }
    },
    async getChannelList() {
      const { data: { listObj }} = await this.$cms.$api.homePup.queryChannelPage({ 'currentPage': 1, 'itemsPerPage': 100 })
      this.channelList = listObj || []
    },
    addPup() {
      this.isAdd = true
      this.pupSet = Object.assign({}, { picUrl: '', againEject: 1, ejectNum: 1, ejectName: '', channelCode: '' })
      this.pupUpVisible = true
    },
    queryList() {
      this.queryHomePagePupList()
    },
    initForm() {
      this.searchForm = Object.assign({}, { currentPage: 1, itemsPerPage: 10 })
    },
    queryGuideUserPage() {
      this.queryHomePagePupList()
    }
  }
}
</script>
<style scoped lang="scss">
  /deep/ .tools-wrap{
    padding-top: 0px;
  }
  .picUrl{
    display: flex;
    .picUrl-tips{
      margin-left: 30px;
    }
  }
  // /deep/ .el-upload--picture-card{
  //   width: 115px !important;
  //   height: 150px !important;
  //   i{
  //     position: absolute;
  //     left: 50%;
  //     top: 50%;
  //     transform: translate(-50%,-50%);
  //   }
  // }
  // /deep/ .el-upload-list__item{
  //   width: 115px !important;
  //   height: 150px !important;
  // }
  .form-dialog{
    /deep/ .el-form-item{
      display: flex;
    }
  }

</style>
