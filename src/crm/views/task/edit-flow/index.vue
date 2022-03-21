<template>
  <el-container v-loading="loading" class="pg-task-edit">
    <el-aside width="226px" class="aside">
      <ody-tabs v-model="activeIndex" :list="tabsList" name="activeIndex" />
      <div class="scroll-wrap">
        <el-scrollbar v-show="activeIndex === 0">
          <template v-for="(node, index) in nodes" :index="index">
            <div :key="index" class="title">{{ node.nodeTypeName }}</div>
            <el-row :key="index" class="action-list">
              <el-col v-for="children in node.children" :span="12" :class="{disabled: getIsDisabled}" :key="children.nodeCode">
                <span :id="children.nodeCode" class="item">
                  <template v-if="getIsDisabled">
                    <img
                      :src="`/static/mxgraph/images/${children.nodeCode}.png`"
                      alt
                      width="25"
                      class="item-img"
                    >
                  </template>
                  <template v-else>
                    <el-tooltip
                      :content="$t('可拖拽至右侧区域')"
                      class="item"
                      effect="dark"
                      placement="top"
                    >
                      <img
                        :src="`/static/mxgraph/images/${children.nodeCode}.png`"
                        alt
                        width="25"
                        class="item-img"
                      >
                    </el-tooltip>
                  </template>
                  {{ children.nodeName }}
                </span>
              </el-col>
            </el-row>
          </template>
        </el-scrollbar>
        <div v-show="activeIndex === 1">
          <div v-loading="loadingTemplate" v-show="activeIndex === 1">
            <el-tree
              :default-expand-all="true"
              :data="templates"
              :props="defaultProps"
              name="templates366"
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </div>
    </el-aside>

    <el-container>
      <div id="task-flow-right-header" class="right-header">
        <ody-left-right>
          <div slot="left">
            <span
              v-permission="btn.code"
              v-for="(btn, index) in btns"
              :key="index"
              name="handleEditor"
              type="default"
              size="mini"
              class="btn"
              @click="handleEditor(btn.action)"
            >
              <i v-if="lock[btn.action]" class="el-icon-loading btn-img" />
              <img v-else :src="`/static/mxgraph/images/${btn.action}.png`" class="btn-img" >
              <div>{{ btn.label }}</div>
            </span>
          </div>
          <div slot="right">
            <!-- <el-button type="text">
              {{ $t('另存为模板') }}
            </el-button>-->
          </div>
        </ody-left-right>
      </div>
      <el-header style="height: 1px;" />

      <el-main class="main">
        <div id="right" ref="graphContainer" />
      </el-main>
      <div id="outlineContainer" class="outline-container" />
    </el-container>

    <!-- modal -->
    <crm-task-user-modal
      :visible.sync="modal.user.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.user.nodeInfo"
      @ok="handleModalOk"
    />

    <crm-task-filter-modal
      :visible.sync="modal.filter.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.filter.nodeInfo"
      @ok="handleModalOk"
    />

    <crm-task-join-modal
      :visible.sync="modal.join.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.join.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-pick-modal
      :visible.sync="modal.pick.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.pick.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-sub-modal
      :visible.sync="modal.sub.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.sub.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-switch-modal
      :visible.sync="modal.switch.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.switch.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-union-modal
      :visible.sync="modal.union.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.union.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-split-modal
      :visible.sync="modal.split.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.split.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-integral-modal
      :visible.sync="modal.integral.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.integral.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-growth-modal
      :visible.sync="modal.growth.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.growth.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-coupon-modal
      :visible.sync="modal.coupon.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.coupon.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-promotion-modal
      :visible.sync="modal.promotion.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.promotion.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-sms-modal
      :visible.sync="modal.sms.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.sms.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-wechat-modal
      :visible.sync="modal.wechat.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.wechat.nodeInfo"
      @ok="handleModalOk"
    />
    <crm-task-analysis-modal
      :visible.sync="modal.analysis.visible"
      :task-id="taskId"
      :task-status="status"
      :node-info="modal.analysis.nodeInfo"
      @ok="handleModalOk"
    />

    <ody-guide
      ref="taskFlowTip"
      :steps="stepsTaskFlow"
      guide-key="taskFlowTip"
      type="cssDriver"
    />
  </el-container>
  <!-- <div ref="graphContainer"></div> -->
</template>

<script>
/* eslint-disable new-cap */
import mxgraph from '@/graph/index'
import $ from 'jquery'
import { isEqual } from 'lodash'
import CrmTaskUserModal from '@/components/task-user-modal'
import CrmTaskFilterModal from '@/components/task-filter-modal'
import CrmTaskJoinModal from '@/components/task-join-modal'
import CrmTaskPickModal from '@/components/task-pick-modal'
import CrmTaskSubModal from '@/components/task-sub-modal'
import CrmTaskSwitchModal from '@/components/task-switch-modal'
import CrmTaskUnionModal from '@/components/task-union-modal'
import CrmTaskSplitModal from '@/components/task-split-modal'
import CrmTaskIntegralModal from '@/components/task-integral-modal'
import CrmTaskGrowthModal from '@/components/task-growth-modal'
import CrmTaskCouponModal from '@/components/task-coupon-modal'
import CrmTaskPromotionModal from '@/components/task-promotion-modal'
import CrmTaskSmsModal from '@/components/task-sms-modal'
import CrmTaskWechatModal from '@/components/task-wechat-modal'
import CrmTaskAnalysisModal from '@/components/task-analysis-modal'

const {
  mxCellOverlay,
  mxGuide,
  mxConnectionHandler,
  mxImage,
  mxGraph,
  mxRubberband,
  mxConstants,
  mxPerimeter,
  mxGraphHandler,
  mxEvent,
  mxEdgeHandler,
  mxCodec,
  mxUtils,
  mxClipboard,
  mxEventObject,
  mxOutline,
  mxEdgeStyle,
  mxEditor,
  mxCell,
  mxGeometry,
  mxHierarchicalLayout
} = mxgraph

function inArray(value, array) {
  return array.includes(value)
}

export default {
  name: 'CrmTaskEdit',
  components: {
    CrmTaskUserModal,
    CrmTaskFilterModal,
    CrmTaskJoinModal,
    CrmTaskPickModal,
    CrmTaskSubModal,
    CrmTaskSwitchModal,
    CrmTaskUnionModal,
    CrmTaskSplitModal,
    CrmTaskIntegralModal,
    CrmTaskGrowthModal,
    CrmTaskCouponModal,
    CrmTaskPromotionModal,
    CrmTaskSmsModal,
    CrmTaskWechatModal,
    CrmTaskAnalysisModal
  },
  props: {
    // msg: String
  },
  data() {
    const { id: taskId } = this.$route.params

    return {
      defaultProps: {
        children: 'modules',
        label: 'templateName'
      },
      stepsTaskFlow: [
        {
          element: '.cp-tabs .item:nth-child(1)',
          popover: {
            title: '操作节点',
            description: '拖动操作节点至右侧操作面板',
            position: 'bottom'
          }
        },
        {
          element: '.cp-tabs .item:nth-child(2)',
          popover: {
            title: '模板管理',
            description: '快速选择任务模板，方便快捷',
            position: 'bottom'
          }
        },
        {
          element: '#task-flow-right-header',
          popover: {
            title: '编辑项',
            description: '对于任务流节点的编辑方式，选中节点或者框选节点进行编辑',
            position: 'bottom'
          }
        }
      ],
      nodeRule: [
        {
          source: 'user',
          target: [
            // 筛选
            'filter',
            // 操作分组
            'join',
            'pick',
            'sub',
            'switch',
            'union',
            'split',
            // 会员权益
            'integral',
            'growth',
            // 营销方式
            'coupon',
            'promotion',
            // 触达方式
            'sms',
            'wechat',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 0,
          maxSourceInput: 0,
          minTargetOut: 1,
          ErrorRule:
            this.$t('【分组】节点后,只能连接【筛选】【操作分组】【会员权益】【营销方式】【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【分组】节点不能存在来源节点'),
          ErrorDown: this.$t('【分组】节点不能没有子节点')
        },
        {
          source: 'filter',
          target: [
            // 操作分组
            'join',
            'pick',
            'sub',
            'switch',
            'union',
            'split',
            // 会员权益
            'integral',
            'growth',
            // 营销方式
            'coupon',
            'promotion',
            // 触达方式
            'sms',
            'wechat',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 1,
          maxSourceInput: 1,
          minTargetOut: 1,
          ErrorRule:
            this.$t('【筛选】节点后,只能连接【操作分组】【会员权益】【营销方式】【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【筛选】节点只能存在一个来源节点'),
          ErrorDown: this.$t('【筛选】节点不能没有子节点')
        },
        {
          source: 'join',
          target: [
            // 筛选
            'filter',
            // 操作分组
            'join',
            'pick',
            'sub',
            'switch',
            'union',
            'split',
            // 会员权益
            'integral',
            'growth',
            // 营销方式
            'coupon',
            'promotion',
            // 触达方式
            'sms',
            'wechat',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 1,
          maxSourceInput: 100,
          minTargetOut: 1,
          ErrorRule:
            this.$t('【交集】节点后,只能连接【筛选】【操作分组】【会员权益】【营销方式】【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【交集】节点限制在100个来源节点内'),
          ErrorDown: this.$t('【交集】节点不能没有子节点')
        },
        {
          source: 'pick',
          target: [
            // 会员权益
            'integral',
            'growth',
            // 营销方式
            'coupon',
            'promotion',
            // 触达方式
            'sms',
            'wechat',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 1,
          maxSourceInput: 1,
          minTargetOut: 1,
          ErrorRule:
            this.$t('【抽样】节点后,只能连接【会员权益】【营销方式】【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【抽样】节点只能存在一个来源节点'),
          ErrorDown: this.$t('【抽样】节点不能没有子节点')
        },
        {
          source: 'sub',
          target: [
            // 筛选
            'filter',
            // 操作分组
            'join',
            'pick',
            'sub',
            'switch',
            'union',
            'split',
            // 会员权益
            'integral',
            'growth',
            // 营销方式
            'coupon',
            'promotion',
            // 触达方式
            'sms',
            'wechat',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 2,
          maxSourceInput: 100,
          minTargetOut: 1,
          ErrorRule:
            this.$t('【排除】节点后,只能连接【筛选】【操作分组】【会员权益】【营销方式】【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【排除】节点限制在100个来源节点内'),
          ErrorDown: this.$t('【排除】节点不能没有子节点')
        },
        {
          source: 'switch',
          target: [
            // 筛选
            'filter'
          ],
          minSourceInput: 2,
          maxSourceInput: 100,
          minTargetOut: 1,
          ErrorRule: this.$t('【排重】节点后,只能连接【筛选】节点'),
          ErrorUpper: this.$t('【排重】节点限制在100个来源节点内'),
          ErrorDown: this.$t('【排重】节点不能没有子节点')
        },
        {
          source: 'union',
          target: [
            // 筛选
            'filter',
            // 会员权益
            'integral',
            'growth',
            // 营销方式
            'coupon',
            'promotion',
            // 触达方式
            'sms',
            'wechat',
            // 效果分析
            'analysis',
            // 操作分组
            'join',
            'pick',
            'sub',
            'switch',
            'union',
            'split'
          ],
          minSourceInput: 1,
          maxSourceInput: 100,
          minTargetOut: 1,
          ErrorRule:
            this.$t('【合并】节点后,只能连接【筛选】【操作分组】【会员权益】【营销方式】【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【合并】节点限制在100个来源节点内'),
          ErrorDown: this.$t('【合并】节点不能没有子节点')
        },
        {
          source: 'split',
          target: [
            'integral',
            'growth',
            'coupon',
            'promotion',
            'sms',
            'wechat',
            'analysis'
          ],
          minSourceInput: 1,
          maxSourceInput: 100,
          minTargetOut: 1,
          ErrorRule: this.$t('【拆分】节点后,只能连接【会员权益】【营销方式】【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【拆分】节点限制在100个来源节点内'),
          ErrorDown: this.$t('【拆分】节点不能没有子节点')
        },
        {
          source: 'integral',
          target: [
            // 筛选
            'filter',
            // 触达方式
            'sms',
            'wechat',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 1,
          maxSourceInput: 1,
          minTargetOut: 0,
          ErrorRule: this.$t('【积分】节点后,只能连接【筛选】【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【积分】节点只能存在一个来源节点'),
          ErrorDown: ''
        },
        {
          source: 'growth',
          target: [
            // 筛选
            'filter',
            // 触达方式
            'sms',
            'wechat',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 1,
          maxSourceInput: 1,
          minTargetOut: 0,
          ErrorRule: this.$t('【成长值】节点后,只能连接【筛选】【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【成长值】节点只能存在一个来源节点'),
          ErrorDown: ''
        },
        {
          source: 'coupon',
          target: [
            // 筛选
            'filter',
            // 触达方式
            'sms',
            'wechat',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 1,
          maxSourceInput: 1,
          minTargetOut: 0,
          ErrorRule: this.$t('【优惠劵】节点后,只能连接【筛选】【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【优惠劵】节点只能存在一个来源节点'),
          ErrorDown: ''
        },
        {
          source: 'promotion',
          target: [
            // 触达方式
            'sms',
            'wechat',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 1,
          maxSourceInput: 1,
          minTargetOut: 0,
          ErrorRule: this.$t('【促销活动】节点后,只能连接【触达方式】【效果分析】节点'),
          ErrorUpper: this.$t('【促销活动】节点只能存在一个来源节点'),
          ErrorDown: ''
        },
        {
          source: 'sms',
          target: [
            // 筛选
            'filter',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 1,
          maxSourceInput: 1,
          minTargetOut: 0,
          ErrorRule: this.$t('【短信】节点后,只能连接【筛选】【效果分析】节点'),
          ErrorUpper: this.$t('【短信】节点只能存在一个来源节点'),
          ErrorDown: ''
        },
        {
          source: 'wechat',
          target: [
            // 筛选
            'filter',
            // 效果分析
            'analysis'
          ],
          minSourceInput: 1,
          maxSourceInput: 1,
          minTargetOut: 0,
          ErrorRule: this.$t('【微信】节点后,只能连接【筛选】【效果分析】节点'),
          ErrorUpper: this.$t('【微信】节点只能存在一个来源节点'),
          ErrorDown: ''
        },
        {
          source: 'analysis',
          target: [],
          minSourceInput: 1,
          maxSourceInput: 1,
          minTargetOut: 0,
          ErrorRule: this.$t('【效果分析】节点后,不允许连接子节点'),
          ErrorUpper: this.$t('【效果分析】节点只能存在一个来源节点'),
          ErrorDown: ''
        }
      ],
      tabsList: [
        '操作节点',
        '模板管理'
      ],
      taskId,
      loading: true,
      activeIndex: 0,
      nodes: [
      ],
      loadingTemplate: true,
      templates: [],
      modules: [
      ],
      btns: [
        {
          action: 'save',
          label: this.$t('保存'),
          code: 'mktTask_update'
        },
        // {
        //   action: 'batchedit',
        //   label: this.$t('批量编辑')
        // },
        {
          action: 'delete',
          label: this.$t('删除')
        },
        {
          action: 'undo',
          label: this.$t('撤销')
        },
        {
          action: 'redo',
          label: this.$t('恢复')
        },
        {
          action: 'zoomIn',
          label: this.$t('放大')
        },
        {
          action: 'zoomOut',
          label: this.$t('缩小')
        },
        {
          action: 'zoomActual',
          label: this.$t('还原')
        },
        {
          action: 'show',
          label: this.$t('展示')
        },
        {
          action: 'check',
          label: this.$t('检测')
        },
        {
          action: 'Arrange',
          label: this.$t('整理')
        },
        {
          action: 'goBack',
          label: this.$t('返回')
        }
      ],
      editor: null,
      parent: null,
      graph: null,
      undoMng: null,
      outline: null,
      layout: null,
      modal: {
        user: {
          visible: false
        },
        filter: {
          visible: false
        },
        join: {
          visible: false
        },
        pick: {
          visible: false
        },
        sub: {
          visible: false
        },
        switch: {
          visible: false
        },
        union: {
          visible: false
        },
        split: {
          visible: false
        },
        integral: {
          visible: false
        },
        growth: {
          visible: false
        },
        coupon: {
          visible: false
        },
        promotion: {
          visible: false
        },
        sms: {
          visible: false
        },
        wechat: {
          visible: false
        },
        analysis: {
          visible: false
        }
      },
      nodeValues: {},
      nodeLastEditCell: null,
      lock: {
        save: false
      },
      status: -1
    }
  },
  computed: {
    getIsDisabled() {
      // const map = {
      //   3: 'isDoing',
      //   4: 'isEnded',
      //   5: 'isClosed',
      //   0: 'isWaitSumbit',
      //   1: 'isWaitAudit',
      //   2: 'isAuditFail'
      // }

      return !['isWaitSumbit', 'isAuditFail'].includes(this.status)
    }
  },
  watch: {
    activeIndex(newVal) {
      if (newVal === 1) {
        this.loadModuleData()
      }
    }
  },
  created() {},
  async mounted() {
    // 加载数据
    await this.loadXMLAndNodeValues()

    // 加载左边node
    await this.loadListConfigNodes()

    mxConstants.MIN_HOTSPOT_SIZE = 16
    mxConstants.DEFAULT_HOTSPOT = 1

    // Enables guides
    mxGraphHandler.prototype.guidesEnabled = true

    // Alt disables guides
    mxGuide.prototype.isEnabledForEvent = function(evt) {
      return !mxEvent.isAltDown(evt)
    }

    // Enables snapping waypoints to terminals
    mxEdgeHandler.prototype.snapToTerminals = true

    var editor = new mxEditor()
    var graph = editor.graph
    // var model = graph.getModel()

    this.editor = editor
    this.graph = graph

    // Disable highlight of cells when dragging from toolbar
    graph.setDropEnabled(false)

    mxConnectionHandler.prototype.getConnectImage = function(state) {
      // eslint-disable-next-line new-cap
      return new mxImage(state.style[mxConstants.STYLE_IMAGE], 16, 16)
    }
    // Centers the port icon on the target port
    graph.connectionHandler.targetConnectImage = true

    // 设置需要box和box连接
    graph.setAllowDanglingEdges(false)

    // Sets the graph container and configures the editor
    editor.setGraphContainer(this.$refs.graphContainer)

    var config = mxUtils
      .load('static/mxgraph/resources/keyhandler-commons.xml')
      .getDocumentElement()
    editor.configure(config)

    // Defines the default group to be used for grouping. The
    // default group is a field in the mxEditor instance that
    // is supposed to be a cell which is cloned for new cells.
    // The groupBorderSize is used to define the spacing between
    // the children of a group and the group bounds.
    var group = new mxCell('Group', new mxGeometry(), 'group')
    group.setVertex(true)
    group.setConnectable(false)
    editor.defaultGroup = group
    editor.groupBorderSize = 20

    // Disables drag-and-drop into non-swimlanes.
    graph.isValidDropTarget = function(cell, cells, evt) {
      return this.isSwimlane(cell)
    }

    // Disables drilling into non-swimlanes.
    graph.isValidRoot = function(cell) {
      return this.isValidDropTarget(cell)
    }

    // Does not allow selection of locked cells
    graph.isCellSelectable = function(cell) {
      return !this.isCellLocked(cell)
    }

    // Returns a shorter label if the cell is collapsed and no
    // label for expanded groups

    graph.getLabel = function(cell) {
      var tmp = mxGraph.prototype.getLabel.apply(this, arguments) // "supercall"

      if (this.isCellLocked(cell)) {
        // Returns an empty label but makes sure an HTML
        // element is created for the label (for event
        // processing wrt the parent label)
        return ''
      } else if (this.isCellCollapsed(cell)) {
        var index = tmp.indexOf('</h1>')

        if (index > 0) {
          tmp = tmp.substring(0, index + 5)
        }
      }

      return tmp
    }

    // Disables HTML labels for swimlanes to avoid conflict
    // for the event processing on the child cells. HTML
    // labels consume events before underlying cells get the
    // chance to process those events.
    //
    // NOTE: Use of HTML labels is only recommended if the specific
    // features of such labels are required, such as special label
    // styles or interactive form fields. Otherwise non-HTML labels
    // should be used by not overidding the following function.
    // See also: configureStylesheet.
    graph.isHtmlLabel = function(cell) {
      return !this.isSwimlane(cell)
    }

    // 设定图表可编辑
    graph.setConnectable(true)

    // Highlights the vertices when the mouse enters
    // var highlight = new mxCellTracker(graph, '#00FF00');
    graph.setTooltips(true)
    graph.htmlLabels = true

    // 开启区域选择
    new mxRubberband(graph)
    this.parent = graph.getDefaultParent()

    // create
    this.createOutline(graph)
    // 设置样式
    this.configureStylesheet(graph)

    // 设置连接线规则
    this.setConnection(graph)

    this.handleLoadXml(this.xml || '')

    // 创建拖拽源
    this.createDragSource(graph)
    // 右键菜单定义
    // this.RightMenu(graph)

    // 双击
    this.dblClick(graph)

    // 删除
    this.removeCells(graph)

    // 头部按钮
    this.createToolbarAction(graph)

    this.loading = false

    // 加载step
    this.step()
  },
  methods: {
    handleNodeClick(data) {
      if (data.modules && data.modules.length) {
        return false
      }
      this.handleLoadXml(data.xml)
    },
    step() {
      setTimeout(() => {
        this.$nextTick(() => {
          if (!this.$refs.taskFlowTip.isViewed()) {
            this.$refs.taskFlowTip.start()
          }
        })
      }, 600)
    },
    async loadModuleData() {
      this.loadingTemplate = true
      const { data: templates } = await this.$crm.$api.mktTask.listTemplates()
      const allTemplateType = templates.map(x => x.templateType)
      const allTemplateTypeSet = new Set(allTemplateType)
      const onlyTemplateType = [...allTemplateTypeSet]
      const onlyTemplateTypeDesc = onlyTemplateType.sort(
        (a, b) => a.templateType - b.templateType
      )
      const templatesGroupByTemplateType = onlyTemplateTypeDesc.map(
        templateType => {
          const map = {
            1: this.$t('促销'),
            2: this.$t('会员关怀'),
            3: this.$t('节日关怀')
          }
          return {
            templateType,
            templateName: map[templateType],
            modules: templates.filter(x => x.templateType === templateType)
          }
        }
      )

      this.templates = templatesGroupByTemplateType
      this.loadingTemplate = false
    },
    setCellValue(cell, val) {
      let nodeName = val.nodeName

      if (val && val.execStartTime) {
        nodeName = `<span style="color: green">${this.$portal.parseTime(
          val.execStartTime
        )}</span><br/>${nodeName}`
      }

      cell.setValue(nodeName)
    },
    setCellOverlay(graph, cell, type, remark) {
      const overlays = graph.getCellOverlays(cell)
      let img
      let tip

      if (overlays) {
        graph.clearCellOverlays(cell)
      }

      if (type === 1) {
        img = '/static/mxgraph/images/datacomplete.png'
        tip = this.$t('设置完成')
      } else if (type === 2) {
        img = '/static/mxgraph/images/dataerror.png'
        tip = this.$t('设置错误') + '\n' + remark
      }

      var overlay = new mxCellOverlay(new mxImage(img, 16, 16), tip)
      overlay.verticalAlign = mxConstants.ALIGN_TOP

      graph.addCellOverlay(cell, overlay)
    },
    setNodeValue(cell, val) {
      const { id } = cell

      this.nodeValues[id] = val
    },
    validateNode(cell, val) {
      const { graph } = this
      const remark = this.getErrorMessageList(
        graph,
        cell,
        this.nodeValues
      ).join('\n')
      const type = remark ? 2 : 1

      // console.log(this.$t('正在检验'), cell)

      // 不管有没有错都设置图标
      this.setCellOverlay(graph, cell, type, remark)

      return type === 1
    },
    validateNodes() {
      const { graph } = this
      const allCells = graph.getChildCells(graph.getDefaultParent())
      let allOk = true

      allCells
        .filter(x => !x.isEdge())
        .forEach((cell, index) => {
          const isOk = this.validateNode(cell)
          if (!isOk) {
            allOk = false
          }
        })

      return allOk
    },
    getTargetListCells(graph, cellId, allEdgess) {
      const childrenList = this.getTargetCells(graph, cellId, allEdgess)
      let rtv = []

      if (childrenList && childrenList.length) {
        childrenList.forEach(item => {
          rtv = [
            ...rtv,
            item,
            ...this.getTargetListCells(graph, item.id, allEdgess)
          ]
        })
      }

      return rtv
    },
    getTargetCells(graph, cellId, allEdgess) {
      if (typeof allEdgess === 'undefined') {
        allEdgess = graph.getChildEdges(graph.getDefaultParent())
      }
      var childs = []
      for (var i = 0; i < allEdgess.length; i++) {
        if (
          allEdgess[i].source != null &&
          cellId === allEdgess[i].source.getId()
        ) {
          if (allEdgess[i].target != null) {
            childs.push(allEdgess[i].target)
          }
        }
      }
      return childs
    },
    getSourceListCells(graph, cellId, allEdgess) {
      const childrenList = this.getSourceCells(graph, cellId, allEdgess)
      let rtv = []

      if (childrenList && childrenList.length) {
        childrenList.forEach(item => {
          rtv = [
            ...rtv,
            item,
            ...this.getSourceListCells(graph, item.id, allEdgess)
          ]
        })
      }

      return rtv
    },
    // 获取节点的来源
    getSourceCells(graph, cellId, allEdgess) {
      if (typeof allEdgess === 'undefined') {
        allEdgess = graph.getChildEdges(graph.getDefaultParent())
      }
      var sourceCells = []
      for (var i = 0; i < allEdgess.length; i++) {
        if (
          allEdgess[i].target != null &&
          allEdgess[i].target.getId() === cellId
        ) {
          if (allEdgess[i].source != null) {
            sourceCells.push(allEdgess[i].source)
          }
        }
      }
      return sourceCells
    },
    getErrorMessageList(graph, validateCell, nodeValues, allEdgess) {
      if (typeof allEdgess === 'undefined') {
        allEdgess = graph.getChildEdges(graph.getDefaultParent())
      }
      try {
        // 清空节点状态图标
        // clearNodeIcon(validateCell);

        var cellId = validateCell.getId()
        var cellStyle = validateCell.getStyle()
        var sources = this.getSourceCells(graph, cellId, allEdgess)
        var targets = this.getTargetCells(graph, cellId, allEdgess)

        // var errorMsg = ''
        var errorMsgList = []

        // 验证连接合法性
        $.each(this.nodeRule, (index, object) => {
          if (cellStyle === object.source) {
            // 验证子连接类型合法
            for (var i = 0; i < targets.length; i++) {
              if (!inArray(targets[i].getStyle(), object.target)) {
                errorMsgList.push(object.ErrorRule)
                // return false
              }
            }
            // 验证最小来源连接
            if (sources.length < object.minSourceInput) {
              errorMsgList.push(this.$t('未设置来源节点'))
              // return false
            }
            // 验证最大来源连接
            if (sources.length > object.maxSourceInput) {
              errorMsgList.push(object.ErrorUpper)
              // return false
            }
            // 验证最小输出连接
            if (targets.length < object.minTargetOut) {
              errorMsgList.push(object.ErrorDown)
              // return false
            }
            // 导入子节点 只能连接分析节点
            if (
              sources.length === 1 &&
              sources[0].getStyle() === 'file' &&
              targets.length > 0
            ) {
              for (var j = 0; j < targets.length; j++) {
                if (targets[j].getStyle() !== 'analysis') {
                  errorMsgList.push(this.$t('本节点后只能连接分析节点！'))
                  // return false
                }
              }
            }
            // 联合分组子节点 只能连接分析节点
            if (
              sources.length === 1 &&
              sources[0].getStyle() === 'unionUser' &&
              targets.length > 0
            ) {
              for (var m = 0; m < targets.length; m++) {
                if (targets[m].getStyle() !== 'analysis') {
                  errorMsgList.push(this.$t('本节点后只能连接分析节点！'))
                  // return false
                }
              }
            }

            // 全局通用的数据验证
            // 1. 必须数值数据
            const val = nodeValues[validateCell.id]
            if (!val) {
              errorMsgList.push(this.$t('本节点必须设置数据'))
              return false
            }

            // 2. 之后的execStartTime比之前大
            const execStartTime = val &&
              val.style !== 'analysis' &&
              val.execStartTime

            if (execStartTime) {
              if (['isWaitSumbit', 'isWaitAudit', 'isAuditFail'].includes(this.status)) {
                const now = new Date()
                const year = now.getFullYear()
                const month = (now.getMonth() + 1 + '').padStart(2, '0')
                const date = (now.getDate() + '').padStart(2, '0')
                const nowDateTime = `${year}-${month}-${date} 00:00:00`

                if (execStartTime < nowDateTime) {
                  errorMsgList.push(this.$t('本节点设置时间必须大于今天'))
                }
              }

              const allTarget = this.getTargetListCells(
                graph,
                cellId,
                allEdgess
              )
              const checkTargetExecStartTime = allTarget.every(target => {
                const targetExecStartTime =
                  target &&
                  nodeValues[target.id] &&
                  nodeValues[target.id].style !== 'analysis' &&
                  nodeValues[target.id].execStartTime

                if (targetExecStartTime) {
                  return execStartTime < targetExecStartTime
                }
                return true
              })

              const allSource = this.getSourceListCells(
                graph,
                cellId,
                allEdgess
              )
              const checkSourceExecStartTime = allSource.every(source => {
                const sourceExecStartTime =
                  source &&
                  nodeValues[source.id] &&
                  nodeValues[source.id].style !== 'analysis' &&
                  nodeValues[source.id].execStartTime

                if (sourceExecStartTime) {
                  return execStartTime > sourceExecStartTime
                }
                return true
              })

              if (!(checkTargetExecStartTime && checkSourceExecStartTime)) {
                errorMsgList.push(this.$t('本节点设置时间必须大于子任务小于父任务'))
                // return false
              }
            }

            // 2. 之后的分析节点执行时间必须大于源节点执行时间
            const analysisExecStartTime = val &&
              val.style === 'analysis' &&
              val.execStartTime

            // 新加判断
            if (analysisExecStartTime) {
              const allSource = this.getSourceListCells(
                graph,
                cellId,
                allEdgess
              )
              debugger
              // console.log(allSource)
              const [firstExecNode] = allSource.filter(source => {
                const sourceExecStartTime =
                  source &&
                  nodeValues[source.id] &&
                  nodeValues[source.id].style !== 'analysis' &&
                  nodeValues[source.id].execStartTime

                return sourceExecStartTime
              })
              const firstExecStartTime = firstExecNode && firstExecNode.execStartTime
              const checkSourceExecStartTime = firstExecStartTime && analysisExecStartTime > firstExecStartTime

              if (!checkSourceExecStartTime) {
                errorMsgList.push(this.$t('本分析节点设置时间必须大于源节点'))
                // return false
              }
            }

            // 3. 拆分后的分组被变动，分组已经变化了，重新选择
            if (sources && sources[0] && sources[0].style === 'split') {
              const parantNodeData = nodeValues[sources[0].id]
              const filterGroupId = val.filterGroupId
              const allSplitIdList = parantNodeData.splitList.map(x => x.pageNodeId)

              if (!allSplitIdList.includes(filterGroupId)) {
                errorMsgList.push(this.$t('节点数据已经变化了，重新选择'))
              }

              // console.log(val, allTargetNodeData)
            }

            // 4. 排除
            if (val.style === 'sub') {
              const allSourceNodeData = sources.map(x => nodeValues[x.id].pageNodeId)
              // const allSubIdList = val.subList.map(x => x.pageNodeId)

              if (!allSourceNodeData.includes(val.subId)) {
                errorMsgList.push(this.$t('节点数据已经变化了，重新选择'))
              }
            }

            // 5. 排重 switch
            if (val.style === 'switch') {
              const allSourceNodeData = sources.map(x => nodeValues[x.id].pageNodeId)
              const allSwitchIdList = val.switchList.map(x => x.pageNodeId)

              // console.log(allSwitchIdList, allSourceNodeData)

              if (!allSwitchIdList.every(x => allSourceNodeData.includes(x))) {
                errorMsgList.push(this.$t('节点数据已经变化了，重新选择'))
              }
            }

            // 6. 父是排重
            if (sources && sources[0] && sources[0].style === 'switch') {
              const parantNodeData = nodeValues[sources[0].id]
              const filterGroupId = val.filterGroupId
              const allSwitchIdList = parantNodeData.switchList.map(x => x.pageNodeId)

              if (!allSwitchIdList.includes(filterGroupId)) {
                errorMsgList.push(this.$t('节点数据已经变化了，重新选择'))
              }
            }

            // 特殊数据验证
            if (object.ErrorData) {
              var dataError = object.ErrorData(
                graph,
                validateCell,
                nodeValues,
                sources,
                targets
              )
              if (dataError && dataError.length) {
                errorMsgList = [...errorMsgList, ...dataError]
                // errorMsg = dataError
                // return false
              }
            }
          }
        })

        // if (errorMsgList && errorMsgList.length) {
        //   return errorMsgList
        //   // 检测节点配置
        // }
        return errorMsgList
      } catch (e) {
        this.$message.error(e)
        return ['出现未知错误']
      }
    },
    handleModalOk(val) {
      // console.log('modal.ok', val)
      const { nodeLastEditCell: cell } = this
      this.setNodeValue(cell, val)
      this.setCellValue(cell, val)
      this.validateNode(cell, val)
    },
    handleLoadTemplate(xml) {
      if (this.getIsDisabled) {
        this.$message.error(this.$t('不允许使用模板替换！'))
        return false
      }
      this.handleLoadXml(xml)
    },
    handleLoadXml(xml) {
      var doc = mxUtils.parseXml(xml)
      var codec = new mxCodec(doc)
      codec.decode(doc.documentElement, this.graph.getModel())
    },
    async handleSave(editor, cell) {
      const xml = mxUtils.getXml(new mxCodec().encode(this.graph.getModel()))
      const { nodeValues, taskId: id } = this

      this.lock.save = true

      try {
        await this.$crm.$api.mktTask.update({
          id,
          xml,
          nodeValues
        })
        this.$message({
          message: this.$t('编辑任务成功'),
          type: 'success'
        })
        this.lock.save = false
      } catch (ex) {
        console.error(ex)
        this.lock.save = false
      }
    },
    handleArrange(editor, cell) {
      var parent = this.graph.getDefaultParent()
      this.layout.execute(parent)
    },
    hanleGoBack(editor, cell) {
      this.$portal.delActiveView()
    },
    handleCheck(editor, cell) {
      if (this.validateNodes()) {
        this.$message({
          message: this.$t('检测完成！'),
          type: 'success'
        })
      }
    },
    createToolbarAction(graph) {
      var layout = new mxHierarchicalLayout(
        graph,
        mxConstants.DIRECTION_WEST,
        true
      )
      // Moves stuff wider apart than usual
      layout.forceConstant = 100
      layout.disableEdgeStyle = false
      this.layout = layout

      this.editor.addAction('save', this.handleSave)

      // this.editor.addAction('stopAct', function(deitor, cell) {
      //   StopActivity()
      // })

      // this.editor.addAction('reStartAct', function(deitor, cell) {
      //   ReStartActivity()
      // })
      // this.editor.addAction('batchedit', function(editor, cell) {
      //   BatchEditNodes(currentGraph.getSelectionCells())
      // })
      // 检测
      this.editor.addAction('check', this.handleCheck)
      // // 测试短信/邮件
      // this.editor.addAction('test', function(editor, cell) {
      //   ChannelTest()
      // })

      // 整理
      this.editor.addAction('Arrange', this.handleArrange)
      // 返回
      this.editor.addAction('goBack', this.hanleGoBack)
      this.editor.addAction('zoomActual', this.handleZoomActual)
    },
    handleZoomActual() {
      this.graph.zoomActual()
    },
    handleEditor(action) {
      this.editor.execute(action)
    },
    createDragSource(graph) {
      // 创建输入拖动源
      this.nodes.forEach(node => {
        node.children.forEach(children => {
          this.createDragImage(
            graph,
            children.nodeCode,
            `static/mxgraph/images/${children.nodeCode}.png`,
            children.nodeName
          )
        })
      })
    },
    async loadListConfigNodes() {
      const { data } = await this.$crm.$api.mktTask.listConfigNodes()

      this.nodes = data
    },
    async loadXMLAndNodeValues() {
      const { taskId: id } = this
      const {
        data: { xml, nodeValues, status }
      } = await this.$portal.post(`/crm-web/mktTask/get/${id}`)
      const statusMap = {
        3: 'isDoing',
        4: 'isEnded',
        5: 'isClosed',
        0: 'isWaitSumbit',
        1: 'isWaitAudit',
        2: 'isAuditFail'
      }

      this.xml = xml || ''
      this.nodeValues = nodeValues ? JSON.parse(nodeValues) : {}
      this.status = statusMap[status]
    },
    RightMenu(graph) {
      var container = document.getElementById('right')
      var self = this
      // 禁用浏览器自带的右键事件
      mxEvent.disableContextMenu(container)

      // 使用本地函数安装弹出菜单处理程序
      graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
        return createPopupMenu(graph, menu, cell, evt)
      }

      // 创建右键的菜单
      function createPopupMenu(graph, menu, cell, evt) {
        if (cell != null) {
          menu.addItem(self.$t('复制步骤'), '', function() {
            var cells = []
            cells = graph.getSelectionCells()
            mxClipboard.copy(graph, cells)
          })
        }
        menu.addSeparator()
        menu.addItem(self.$t('删除步骤'), '', function() {
          self.del()
        })
      }
    },
    createDragImage(graph, id, image, text) {
      if (this.getIsDisabled) {
        return false
      }
      // 在给定的位置插入一个元素
      var funct1 = function(graph, evt, target, x, y) {
        var parent = graph.getDefaultParent()
        var model = graph.getModel()

        var v1 = null

        model.beginUpdate()
        try {
          v1 = graph.insertVertex(parent, null, text, x, y, 50, 50, id)
          v1.setConnectable(true)
        } finally {
          model.endUpdate()
        }

        graph.setSelectionCell(v1)
      }

      // 创建拖动源的预览
      var dragElt = document.createElement('div')
      dragElt.style.border = 'dashed black 1px'
      dragElt.style.width = '50px'
      dragElt.style.height = '50px'

      // 在点击拖动源图标时提供预览。 预览是提供的仅仅是拖动源的图片
      // 只有拖动源到容器内时才会显示元素的坐标预览

      var ds = mxUtils.makeDraggable(
        document.getElementById(id),
        graph,
        funct1,
        dragElt,
        0,
        0,
        true,
        true
      )

      // 从拖动源拖动时显示导航线。
      // 注意，对图形中已存在的元素拖动时显示导航线不在本方法约束范围。
      ds.setGuidesEnabled(true)

      // 从拖动源拖动元素到图形以外的区域时，显示拖动源图片预览
      // ds.createDragElement = mxDragSource.prototype.createDragElement;
    },
    createOutline(graph) {
      this.outline = new mxOutline(
        graph,
        document.getElementById('outlineContainer')
      )
    },
    configureStylesheet(graph) {
      var style = {}
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE
      style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter
      style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP
      style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER
      style[mxConstants.STYLE_IMAGE_ALIGN] = mxConstants.ALIGN_LEFT
      style[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP
      // style[mxConstants.STYLE_SPACING_TOP] = '56';
      // style[mxConstants.STYLE_GRADIENTCOLOR] = '#7d85df';
      // style[mxConstants.STYLE_STROKECOLOR] = '#5d65df';
      // style[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';
      style[mxConstants.STYLE_FONTCOLOR] = '#1d258f'
      style[mxConstants.STYLE_FONTFAMILY] = 'Microsoft YaHei'
      style[mxConstants.STYLE_FONTSIZE] = '12'
      style[mxConstants.STYLE_FONTSTYLE] = '1'
      style[mxConstants.STYLE_ROUNDED] = '1'
      style[mxConstants.STYLE_IMAGE_WIDTH] = '50'
      style[mxConstants.STYLE_IMAGE_HEIGHT] = '50'
      style[mxConstants.STYLE_OPACITY] = '100'
      style[mxConstants.STYLE_RESIZABLE] = false
      style[mxConstants.STYLE_FONTCOLOR] = '#000000'
      style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] =
        mxConstants.ALIGN_BOTTOM
      graph.getStylesheet().putDefaultVertexStyle(style)

      this.nodes.forEach(node => {
        node.children.forEach(children => {
          style = mxUtils.clone(style)
          style[
            mxConstants.STYLE_IMAGE
          ] = `/static/mxgraph/images/${children.nodeCode}.png`
          graph.getStylesheet().putCellStyle(children.nodeCode, style)
        })
      })

      style = graph.getStylesheet().getDefaultEdgeStyle()
      style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#FFFFFF'
      style[mxConstants.STYLE_STROKEWIDTH] = '1'
      style[mxConstants.STYLE_ROUNDED] = true
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation

      return style
    },
    findWay(graph, targetId, sourceId, callback) {
      const sourceList = this.getTargetCells(graph, targetId).map(x => x.id)

      if (sourceList.includes(sourceId)) {
        callback()
      } else {
        sourceList.forEach(newId => {
          this.findWay(graph, newId, sourceId, callback)
        })
      }
    },
    setConnection(graph) {
      const self = this
      // 变异的节点,恢复原名称
      function CellStyleToNormal(cellStyle) {
        if (cellStyle.indexOf('_') > -1) {
          return cellStyle.split('_')[0]
        }

        return cellStyle
      }

      graph.cellConnected = function(edge, terminal, source, constraint) {
        var canConnected = true

        if (edge.source != null) {
          var startType = CellStyleToNormal(edge.source.style)
          var endType = CellStyleToNormal(terminal.style)

          // 验证连接合法性
          $.each(self.nodeRule, function(index, object) {
            // 判断规则
            if (
              startType === object.source &&
              !inArray(endType, object.target)
            ) {
              self.$message.error(object.ErrorRule)
              canConnected = false
              return false
            }
            // 判断输入
            if (endType === object.source && terminal.getEdgeCount() > 0) {
              var endNodeInput = 1
              for (var i = 0; i < terminal.getEdgeCount(); i++) {
                var tempEdge = terminal.getEdgeAt(i)
                if (tempEdge !== edge) {
                  if (tempEdge.target === terminal) {
                    endNodeInput = endNodeInput + 1
                  }
                }
              }
              if (endNodeInput > object.maxSourceInput) {
                self.$message.error(object.ErrorUpper)
                canConnected = false
                return false
              }
            }
          })

          // 判断反连接
          if (canConnected) {
            // getWayList
            self.findWay(graph, terminal.id, edge.source.id, () => {
              canConnected = false
              self.$message.error(self.$t('已经存在连接，如果需要重新连接，请删除原连接！'))
            })
          }
        }

        // 是否闭环了

        if (!canConnected) {
          graph.removeCells([edge], true)
        }

        if (canConnected) {
          if (edge != null) {
            this.model.beginUpdate()
            try {
              this.setConnectionConstraint(edge, terminal, source, constraint)
              this.model.setTerminal(edge, terminal, source)
              this.resetEdgesOnConnect && this.resetEdge(edge)
            } finally {
              this.model.endUpdate()
            }
          }
        }
      }
    },
    dblClick(graph) {
      const self = this
      graph.dblClick = function(evt, cell) {
        var model = graph.getModel()
        if (!model.isVertex(cell)) {
          return false
        }

        const { id, style, value: nodeName } = cell
        let filterGroupList = []
        // const userGroupId = null
        let filterSendStatusList = []
        let subList = []
        let switchList = []
        let mustGroup = false
        let mustStatus = false
        let actionPageNodeList = []
        // const sendStatus = null

        self.nodeLastEditCell = cell
        self.modal[style].visible = true

        const settingData = self.nodeValues[id] || { nodeName, style }

        const parentList = self.getSourceCells(graph, id)

        if (style === 'filter') {
          if (parentList && parentList.length) {
            const parent = parentList[0]

            if (parent.style === 'switch') {
              // 排重
              const settingData = self.nodeValues[parent.id]

              filterGroupList = (
                (settingData && settingData.switchList) ||
                []
              )

              mustGroup = true
            } else if (parent.style === 'split') {
              // 拆分
              const settingData = self.nodeValues[parent.id]

              filterGroupList = (settingData && settingData.splitList) || []

              mustGroup = true
            } else if (
              ['integral', 'growth', 'coupon', 'sms', 'wechat'].includes(parent.style)
            ) {
              filterSendStatusList = [
                {
                  value: -1,
                  label: self.$t('全部')
                },
                {
                  value: 1,
                  label: self.$t('发放成功')
                },
                {
                  value: 0,
                  label: self.$t('发放失败')
                }
              ]
              mustStatus = true
            }
          }
        } else if (['sms', 'wechat'].includes(style)) {
          const allSource = self.getSourceListCells(graph, id)

          actionPageNodeList = allSource.filter(nodeCell => {
            return nodeCell &&
              self.nodeValues[nodeCell.id] &&
              ['integral', 'growth', 'coupon', 'promotion'].includes(self.nodeValues[nodeCell.id].style)
          }).map(x => self.nodeValues[x.id])
        } else if (style === 'sub') {
          if (parentList.length) {
            subList = parentList
              .map(x => self.nodeValues[x.id])
          }
          mustGroup = true
        } else if (style === 'switch') {
          // 排重
          const oldSwitchList = (settingData && settingData.switchList) || []
          let newSwitchList = []

          if (parentList.length) {
            newSwitchList = parentList.map(x => self.nodeValues[x.id])
          }

          const oldUserGroupIdList = oldSwitchList
            .map(x => x.pageNodeId)
            .sort((a, b) => a - b)
          const newUserGroupIdList = newSwitchList
            .map(x => x.pageNodeId)
            .sort((a, b) => a - b)

          if (isEqual(oldUserGroupIdList, newUserGroupIdList)) {
            switchList = oldSwitchList
          } else {
            switchList = newSwitchList
          }

          mustGroup = true
        } else if (style === 'analysis') {
          settingData.execTime =
            settingData.execStartTime && settingData.execEndTime
              ? [settingData.execStartTime, settingData.execEndTime]
              : []
        }

        self.modal[style].nodeInfo = {
          ...settingData,
          pageNodeId: id,
          mustGroup,
          mustStatus,
          filterGroupList,
          filterSendStatusList,
          subList,
          switchList,
          actionPageNodeList
        }

        // console.log('modal', this.modal)
      }
    },
    removeCells(graph) {
      const self = this
      /*
       * 节点是否允许删除
       *
       * 营销节点删除限制：
       * 1：活动不允许编辑,且非本次添加节点,不允许删除
       * 2：节点任务已被实际执行(不包括预执行),不允许删除
       */
      function CellIsCanDelete(nodeValues, cell) {
        if (cell.isEdge()) {
          // 连线 判断连线目标是否允许删除
          if (cell.target != null) {
            if (!cell.target.isEdge()) {
              return CellIsCanDelete(nodeValues, cell.target)
            } else {
              return true
            }
          } else {
            return true
          }
        } else {
          var cellId = cell.getId()
          var nodeValue = nodeValues[cellId]

          if (nodeValue && Object.keys(nodeValue).length > 0) {
            var guid = nodeValue.guid

            if (self.getIsDisabled || guid) {
              // 已执行的节点不能被删除
              // 已设置的节点,且不允许编辑的活动不能删除
              return false
            } else {
              return true
            }
          } else {
            return true
          }
        }
      }

      graph.removeCells = function(cells, includeEdges) {
        includeEdges = includeEdges != null ? includeEdges : true

        if (cells == null) {
          cells = this.getDeletableCells(this.getSelectionCells())
        }

        // Adds all edges to the cells
        if (includeEdges) {
          cells = this.getDeletableCells(this.addAllEdges(cells))
        }

        // 是否允许删除
        var isCanDeleted = true
        for (var i = 0; i < cells.length; i++) {
          if (isCanDeleted) {
            isCanDeleted = CellIsCanDelete(self.nodeValues, cells[i])
          } else {
            break
          }
        }

        if (!isCanDeleted) {
          self.$message.error(self.$t('不允许删除!'))
          return false
        }

        // 删除节点数据
        for (var j = 0; j < cells.length; j++) {
          if (!cells[j].isEdge()) {
            delete self.nodeValues[cells[j].getId()]
          }
        }

        this.model.beginUpdate()
        try {
          this.cellsRemoved(cells)
          this.fireEvent(
            new mxEventObject(
              mxEvent.REMOVE_CELLS,
              'cells',
              cells,
              'includeEdges',
              includeEdges
            )
          )
        } finally {
          this.model.endUpdate()
        }

        return cells
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-task-edit {
  border: 1px solid #eee;
  position: absolute;
  top: 8px;
  left: 20px;
  right: 20px;
  bottom: 8px;
  /deep/ {
    .el-scrollbar__wrap {
      overflow: auto !important;
    }
  }
  .aside {
    width: 226px;
    margin-right: 8px;
    position: relative;
    background-color: #fff;
    .scroll-wrap {
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0 15px;
    }

    .tabs-item {
      width: 50%;
      text-align: center;
      height: 40px !important;
      line-height: 40px !important;
    }

    .title {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(69, 90, 100, 1);
      line-height: 20px;
      margin-bottom: 10px;
    }
    .action-list {
      margin-bottom: 30px;
      .disabled {
        color: #ccc;
        cursor: not-allowed;
      }
    }
    .item {
      font-size: 13px;
      line-height: 20px;
      padding: 0;
      width: 98px;
      margin: 6px 0;
      clear: both;
      height: 24px;
      display: inline-block;
      cursor: pointer;
      text-align: left;
    }
    .item-img {
      display: inline-block;
      vertical-align: middle;
      margin-right: 2px;
      width: 25px;
    }
  }
}
.right-header {
  height: 45px;
  background: rgba(255, 255, 255, 1);
  margin-bottom: 10px;
  -ms-flex-negative: 0;
  -webkit-box-direction: normal;
  flex-shrink: 0;
  .btn {
    width: 45px;
    height: 45px;
    border-right: 1px solid #ced4da;
    display: inline-block;
    font-size: 12px;
    text-align: center;
    position: relative;
    cursor: pointer;
    padding-top: 26px;
    &-img {
      width: 14px;
      height: 14px;
      top: 8px;
      left: 15px;
      position: absolute;
    }
  }
}
.main {
  padding: 0;
}
#right {
  height: 100%;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: url('./images/grid.gif');
  cursor: default;
}
.outline-container {
  position: absolute;
  overflow: hidden;
  top: 60px;
  right: 5px;
  width: 268px;
  height: 140px;
  background: transparent;
  border: 3px;
  border-style: solid;
  border-color: black;
}

.el-menu-item-group__title {
  padding: 0px 0 7px 20px;
  line-height: normal;
  font-size: 12px;
  color: #909399;
}

.outline-wrapper {
  border: 1px solid #dedede;
  background: #fff;
  position: fixed;
  right: 0;
  top: 160px;
  border-radius: 4px;
  z-index: 10;
  > h4 {
    padding: 6px;
    font-size: 12px;
    border-bottom: 1px solid #e6e6e6;
  }
  #graphOutline {
    width: 200px;
  }
}
</style>
