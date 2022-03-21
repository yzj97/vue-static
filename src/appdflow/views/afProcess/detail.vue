<template>
  <v-g-editor ref="flowChart" class="af-process-detail">
    <ody-box :title="$t('基本信息')">
      <el-form
        ref="form"
        :model="sizeForm"
        label-width="120px"
        label-suffix=":"
        size="mini"
        class="clearfix"
      >
        <el-col :span="8">
          <el-form-item :label="$t('审批流ID')">{{ detail.id }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('审批流名称')">{{
            detail.name
          }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('状态')">
            {{ statusMap[detail.isAvailable] }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('商家')">{{
            detail.merchantName
          }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('审批单据')">{{
            typeCodeMap[detail.typeCode]
          }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('备注')">{{ detail.remark }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('创建人')">
            {{ detail.createUsername }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('创建时间')">{{
            detail.createTime
          }}</el-form-item>
        </el-col>
      </el-form>
    </ody-box>
    <div class="af-process-detail__sidebar">
      <flow-item-panel />
    </div>
    <div class="af-process-detail__container">
      <div class="af-process-detail__toolbar">
        <el-button :disabled="saveReadOnly" type="text" @click="handleSave">
          <!-- {{ $t("保存") }} -->
          <!-- <img src="/images/save.png" /> -->
          <el-image
            :src="saveImg"
            style="width: 15px; height: 15px; position:relative;top:23px;margin-left:10px;"
          />
        </el-button>
        <flow-toolbar />
        <el-button type="text" @click="handleCheck">
          <!-- {{ $t("检测") }} -->
          <el-image
            :src="checkImg"
            style="width: 15px; height: 17px;position:relative;top:-25px;left:290px;"
          />
        </el-button>
      </div>
      <div class="af-process-detail__main">
        <flow
          v-if="isLoaded"
          :data="flowChartData"
          :on-node-click="handleNodeClick"
          :graph="{ mode: 'readOnly' }"
        />
      </div>
    </div>
    <div class="af-process-detail__panel">
      <flow-detail-panel :type-code="detail.typeCode" />
    </div>
    <flow-context-menu />
    <register-edge
      :config="customEdgeConfig"
      name="custom-polyline"
      extend="flow-polyline"
    />
  </v-g-editor>
</template>

<script>
import VGEditor, { Flow, RegisterEdge } from 'vg-editor'
import { FlowToolbar } from '@/components/EditorToolbar'
import { FlowItemPanel } from '@/components/EditorItemPanel'
import { FlowDetailPanel } from '@/components/EditorDetailPanel'
import EditorMinimap from '@/components/EditorMinimap'
import { FlowContextMenu } from '@/components/EditorContextMenu'
import './iconfont'

export default {
  name: 'AppdflowProcessDetail',

  components: {
    VGEditor,
    Flow,
    FlowToolbar,
    FlowItemPanel,
    FlowDetailPanel,
    EditorMinimap,
    FlowContextMenu,
    RegisterEdge
  },

  data() {
    const id = this.$route.params.id
    let readOnly = this.$route.params.readOnly
    if (readOnly === 'false') {
      readOnly = false
    } else if (readOnly === 'true') {
      readOnly = true
    }
    return {
      saveImg: require('./images/save.png'),
      checkImg: require('./images/check.png'),
      statusMap: {
        0: this.$t('停用'),
        1: this.$t('启用')
      },
      typeCodeMap: {},
      flowChartData: {},
      customEdgeConfig: {
        getActivedStyle(item) {
          return {
            lineWidth: 3
          }
        },
        getSelectedStyle(item) {
          return {
            lineWidth: 3
          }
        }
      },
      id,
      saveReadOnly: readOnly,
      detail: {},
      isLoaded: false
    }
  },
  async mounted() {
    await this.initCode()
    if (this.id) {
      const { data } = await this.$api.appdflow.getById({
        id: this.id
      })
      this.detail = data
      this.detail.createTime = this.$portal.parseTime(
        this.detail.createTime,
        '{y}-{m}-{d} {h}:{i}:{s}'
      )
      this.isLoaded = true
      this.flowChartData = this.detail.content
    }
  },
  methods: {
    async initCode() {
      const res = await this.$appdflow.$api.afTypeConfig.list({})
      this.typeCodeMap = res.data.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
    },
    async handleSave() {
      const handleCheck = await this.handleCheck() // 保存调用检测方法
      if (!handleCheck) {
        return
      }
      const saveData = this.$refs.flowChart.editor
        .getCurrentPage()
        .getGraph()
        .save()
      const data = await this.$appdflow.$api.afProcess.saveNode({
        id: this.id,
        content: saveData
      })
      if (data.code === '0') {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      } else {
        this.$message(data.message)
      }
      // console.log(this.$refs.flowChart.propsAPI.read(data))
    },
    checkStartNode(params) {
      let checkStartNode = true
      const startNodes = params.nodes.filter(x => {
        if (x.ref.type === 0) {
          return x
        }
      })
      if (startNodes.length > 1) {
        this.$message('开始节点有且只能有一个')
        checkStartNode = false
      }
      return checkStartNode
    },
    checkEndNode(params) {
      let checkEndNode = true
      const endNodes = params.nodes.filter(x => {
        if (x.ref.type === 3) {
          return x
        }
      })
      if (endNodes.length > 1) {
        this.$message('结束节点有且只能有一个')
        checkEndNode = false
      }
      return checkEndNode
    },
    checkOtherEdges(params) {
      let checkOtherEdges = true
      const edgesSource = this.$portal.groupBy(params, 'source')

      const otherFactor = Object.values(edgesSource)

      otherFactor.forEach(item => {
        // 同源条件线 下面有2个其他
        const others = item.filter(x => x.ref && x.ref.radioVal === 2)

        if (others.length > 1) {
          this.$message('有多个其他')
          checkOtherEdges = false
        }
      })
      return checkOtherEdges
    },
    checkSectionLines(params) {
      let checkOtherLines = true
      const list = params.nodes.filter(x => {
        // 条件节点
        if (x.ref.type === 1) {
          x.line = []
          // 有几根线
          params.edges.forEach(y => {
            if (x.id === y.source) {
              x.line.push(y.ref.conditionList)
              x.linelabel = y.label
            }
          })
          return x
        }
      })
      console.log(list)
      list.forEach(x => {
        const sectionlist = []
        if (x.line.length > 1) {
          x.line.forEach(y => {
            const section = {}
            if (y.length > 1) {
              y.forEach(z => {
                if (z.operator === '>=') {
                  section.start = parseFloat(z.variableValue)
                } else if (z.operator === '>') {
                  section.start = parseFloat(z.variableValue) + 0.00001
                } else if (z.operator === '<=') {
                  section.end = parseFloat(z.variableValue)
                } else if (z.operator === '<') {
                  section.end = parseFloat(z.variableValue) - 0.00001
                }
              })
            } else if (y.length === 1) {
              if (y[0].operator === '>=') {
                section.start = parseFloat(y[0].variableValue)
                section.end = 99999999
              } else if (y[0].operator === '>') {
                section.start = parseFloat(y[0].variableValue) + 0.00001
                section.end = 99999999
              } else if (y[0].operator === '<=') {
                section.start = -99999999
                section.end = parseFloat(y[0].variableValue)
              } else if (y[0].operator === '<') {
                section.start = -99999999
                section.end = parseFloat(y[0].variableValue) - 0.00001
              }
            }
            section.label = y.linelabel
            sectionlist.push(section)
          })
          sectionlist.sort((a, b) => {
            return a.start - b.start
          })
          for (let i = 1; i < sectionlist.length; i++) {
            if (sectionlist[i].start <= sectionlist[i - 1].end) {
              console.log(x.label + '条件区间存在条件数值交集！')
              this.$message(x.label + '条件区间存在条件数值交集！')
              checkOtherLines = false
            }
          }
          return checkOtherLines
        }
      })
      return checkOtherLines
    },
    handleCheck() {
      // const isCheckPass = true
      // const graph = this.$refs.flowChart.editor

      // const item = graph.findById('01729835')
      // const model = this.$portal.deepClone(item)

      // model.style = {
      //   fill: 'red'
      // }

      // graph.updateItem(item, model)
      let checkResult = true

      const graphData = this.$refs.flowChart.editor
        .getCurrentPage()
        .getGraph()
        .save()

      // console.log(graphData)
      const checkStartNode = this.checkStartNode(graphData) // 检测开始节点
      const checkEndNode = this.checkEndNode(graphData) // 检测结束节点
      const checkOtherEdges = this.checkOtherEdges(graphData.edges) // 检测线上有两个其他
      const checkSectionLines = this.checkSectionLines(graphData) // 检测条件线上的范围
      if (
        !checkStartNode ||
        !checkEndNode ||
        !checkOtherEdges ||
        !checkSectionLines
      ) {
        checkResult = false
      }
      return checkResult
    },
    handleNodeClick(e) {}
  }
}
</script>
<style lang="scss" scoped>
.af-process-detail {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  overflow: hidden;
  &__sidebar {
    position: absolute;
    top: 245px;
    left: 0;
    bottom: 0;
    width: 200px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    &__item {
      margin-bottom: 16px;
    }
  }
  &__container {
    position: absolute;
    top: 245px;
    left: 210px;
    right: 302px;
    bottom: 0;
    background-color: #fff;
  }
  &__main {
    position: absolute;
    top: 45px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &__panel {
    position: absolute;
    top: 245px;
    right: 0;
    bottom: 0;
    width: 300px;
    background-color: #fff;
    padding: 0 20px;
  }
}
</style>
