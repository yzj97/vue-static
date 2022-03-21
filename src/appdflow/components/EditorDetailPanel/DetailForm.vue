<template>
  <div>
    <form v-if="isLoaded" @submit.prevent="handleSubmit">
      <!-- {{ formModel }} -->
      <div v-if="type === 'node'">
        <template v-if="formModel.shape === 'flow-rect'">
          <h3>审批节点配置</h3>
          <el-select
            v-model="formModel.ref.appdActorType"
            placeholder="请选择"
            @change="handleNodeOperateChange"
          >
            <el-option
              v-for="item in appdActorTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <template v-if="formModel.ref.appdActorType === 1">
            <ody-audit-add
              v-model="formModel.ref.actorList"
              @ok="handleSubmit"
            />
          </template>

          <template v-else-if="formModel.ref.appdActorType === 2">
            <div class="add-department-top">
              <el-radio-group v-model="formModel.ref.appdActorSubtype">
                <el-radio
                  :label="1"
                >部门主管
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="top"
                    content="部门主管为空时，上级部门主管审批"
                  >
                <i class="el-icon-info" /> </el-tooltip></el-radio
                ><br >
                <el-radio
                  :label="2"
                >连续多级主管
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="top"
                    content="商家（公司）主体下的组织体系内的连续多级主管审批"
                  >
                  <i class="el-icon-info" /> </el-tooltip
                ></el-radio>
                <br >
                <el-radio
                  :label="3"
                >指定部门
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="top"
                    content="指定部门的主管审批"
                  >
                  <i class="el-icon-info" /> </el-tooltip
                ></el-radio>
                <br >
              </el-radio-group>
            </div>
            <template v-if="formModel.ref.appdActorSubtype === 3">
              <ody-organization-add
                v-model="formModel.ref.actorList"
                @ok="handleSubmit"
              />
            </template>
          </template>
          <template v-else-if="formModel.ref.appdActorType === 3">
            <ody-position-add
              v-model="formModel.ref.actorList"
              @ok="handleSubmit"
            />
          </template>
          <h3>审批方式</h3>
          <div class="sign-wrap">
            <el-radio-group v-model="formModel.ref.appdType">
              <el-radio :label="1">或签（一名审批人同意即可）</el-radio> <br >
              <el-radio :label="2">会签（须所有审批人同意）</el-radio>
            </el-radio-group>
          </div>
        </template>
        <template v-else-if="formModel.shape === 'flow-rhombus'">
          <h3>条件配置</h3>
          <el-select
            v-model="formModel.label"
            placeholder="条件"
            @change="handleFactor"
          >
            <el-option
              v-for="item in factorTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </template>
      </div>
      <div v-else-if="type === 'edge'">
        <div v-if="showSelect" class="line-judge">
          <el-radio-group
            v-model="formModel.ref.radioVal"
            @change="handleEdgeChange"
          >
            <el-radio :label="1">输入条件值</el-radio>
            <div>
              <el-select
                v-model="formModel.ref.id"
                @change="handleEdgeOperateChange"
              >
                <el-option
                  v-for="item in lineTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-if="formModel.ref.displayStyle === 'number'"
                v-model="formModel.ref.conditionList['0'].variableValue"
                @blur="handleEdgeChange"
              />
              <div v-else-if="formModel.ref.displayStyle === 'numberRange'">
                <el-input
                  v-model="formModel.ref.conditionList['0'].variableValue"
                  placeholder=""
                  @blur="handleEdgeChange"
                >
                  <el-select
                    slot="append"
                    v-model="formModel.ref.conditionList['0'].operator"
                    :clearable="false"
                    style="width: 80px;"
                    @change="handleEdgeChange"
                  >
                    <el-option label="<" value=">" />
                    <el-option label="<=" value=">=" />
                  </el-select>
                </el-input>
                <div class="center">~</div>
                <el-input
                  v-model="formModel.ref.conditionList['1'].variableValue"
                  placeholder=""
                  @blur="handleEdgeChange"
                >
                  <el-select
                    slot="prepend"
                    v-model="formModel.ref.conditionList['1'].operator"
                    style="width: 80px;"
                    @change="handleEdgeChange"
                  >
                    <el-option label="<" value="<" />
                    <el-option label="<=" value="<=" />
                  </el-select>
                </el-input>
              </div>
            </div>
            <el-radio :label="2">其他</el-radio>
          </el-radio-group>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { omit } from 'lodash'

export default {
  name: 'DetailForm',

  props: {
    type: {
      type: String,
      default: null
    },
    typeCode: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      isLoaded: false,
      formModel: {},
      appdActorTypeOptions: [
        {
          value: 1,
          label: '指定审批人'
        },
        {
          value: 2,
          label: '组织部门'
        },
        {
          value: 3,
          label: '岗位'
        }
      ],
      factorTypeOptions: [
        {
          label: '商品数量',
          res: []
        },
        {
          label: '订单金额',
          res: []
        }
      ],
      lineTypeOptions: [],
      selectVal: '',
      showSelect: false,
      detail: []
    }
  },

  created() {
    const formModel = this.root.propsAPI.getSelected()[0].getModel()
    if (this.type === 'edge') {
      this.formModel = Object.assign(
        {},
        {
          label: '',
          ref: {
            type: 1,
            displayStyle: null,
            radioVal: 1,
            conditionList: []
          }
        },
        formModel
      )
    } else {
      this.formModel = Object.assign(
        {},
        {
          shape: 'flow-smooth',
          ref: {
            appdType: 1, // 审批方式 1: 或签 2: 会签
            appdActorType: 1, // 审批人员类型 1: 指定审批人 2: 组织部门 3: 岗位
            appdActorSubtype: 1, // 审判人员子类型 1: 部门主管 2: 连续多级主管 3: 指定部门
            actorList: []
          }
        },
        formModel
      )
    }
  },
  async mounted() {
    const { data } = await this.$appdflow.$api.afVariable.list({
      filters: {
        typeCode: this.typeCode
      }
    })
    if (data) {
      this.showSelect = true
    }
    const factorTypeOptions = Object.keys(data)
    this.factorTypeOptions = factorTypeOptions.map(x => {
      return {
        label: x,
        res: data[x]
      }
    })
    this.detail = data
    const factor = this.getFlowData()
    const nodes = factor.nodes
    const node = nodes.find(item => {
      if (item.id === this.formModel.source) {
        return item
      }
    })
    // 当前是线，获取父节点的node信息保留到lineTypeOptions
    if (this.type === 'edge' && node && node.label) {
      this.lineTypeOptions = data[node.label]

      if (
        this.formModel.ref.conditionList &&
        this.formModel.ref.conditionList.length === 0
      ) {
        const lineTypeOption = this.lineTypeOptions[0]

        this.updateEdgeByLineTypeOption(lineTypeOption)
      }
    }

    this.isLoaded = true
  },
  methods: {
    updateEdgeByLineTypeOption(lineTypeOption) {
      if (lineTypeOption.displayStyle === 'numberRange') {
        const [operatorLeft, operatorRight] = lineTypeOption.operator.split(
          ','
        )

        this.$set(this.formModel.ref, 'conditionList', [
          {
            variableId: lineTypeOption.id,
            operator: operatorLeft,
            variableValue: null
          },
          {
            variableId: lineTypeOption.id,
            operator: operatorRight,
            variableValue: null
          }
        ])
        this.$set(this.formModel.ref, 'radioVal', 1)
        this.formModel.ref.id = lineTypeOption.id
        this.formModel.ref.displayStyle = lineTypeOption.displayStyle
      } else if (lineTypeOption.displayStyle === 'number') {
        this.$set(this.formModel.ref, 'conditionList', [
          {
            variableId: lineTypeOption.id,
            operator: lineTypeOption.operator,
            variableValue: null
          }
        ])
        this.formModel.ref.id = lineTypeOption.id
        this.formModel.ref.displayStyle = lineTypeOption.displayStyle
        this.$set(this.formModel.ref, 'radioVal', 1)
      }
    },
    getFlowData() {
      return this.root.editor
        .getCurrentPage()
        .getGraph()
        .save()
    },
    handleSubmit(e, item) {
      const { getSelected, executeCommand, update } = this.root.propsAPI
      const { formModel } = this
      setTimeout(() => {
        const item = getSelected()[0]
        if (!item) return
        executeCommand(() => {
          // this is for duplicate node in mind chart
          update(item, { ...omit(formModel, 'children') })
        })
      }, 0)
    },
    removeEdgeData() {
      setTimeout(() => {
        const { nodes, edges } = this.getFlowData()
        // 当前节点this.formModel
        const connectEdges = edges.filter(x => x.source === this.formModel.id)

        connectEdges.forEach(edge => {
          edge.label = null
          edge.ref.id = null
          edge.ref.conditionList = []
        })

        this.root.propsAPI.read({
          nodes,
          edges
        })
      }, 0)
    },
    handleFactor(e) {
      this.handleSubmit()
      this.removeEdgeData()
    },
    handleNodeOperateChange() {
      this.formModel.ref.actorList = []
    },
    handleEdgeChange() {
      if (this.formModel.ref.radioVal === 1) {
        if (this.formModel.ref.displayStyle === 'number') {
          this.formModel.label = [
            this.formModel.ref.conditionList['0'].operator,
            this.formModel.ref.conditionList['0'].variableValue || ''
          ].join('')
        } else if (this.formModel.ref.displayStyle === 'numberRange') {
          this.formModel.label = [
            this.formModel.ref.conditionList['0'].operator === '>' ? '(' : '[',
            this.formModel.ref.conditionList['0'].variableValue || '',
            ',',
            this.formModel.ref.conditionList['1'].variableValue || '',
            this.formModel.ref.conditionList['1'].operator === '<' ? ')' : ']'
          ].join('')
        }
      } else {
        this.formModel.label = '其他'
      }

      this.handleSubmit()
    },
    handleEdgeOperateChange(e) {
      const lineTypeOption = this.lineTypeOptions.find(item => {
        return e === item.id
      })

      this.updateEdgeByLineTypeOption(lineTypeOption)
      this.handleEdgeChange()
    }
  },

  inject: ['root']
}
</script>
<style lang="scss" scoped>
.add-department-top {
  display: inline-block;
  margin-top: 20px;
  .el-radio {
    line-height: 36px;
    min-width: 1rem;
  }
}
.sign-wrap {
  .el-radio {
    line-height: 36px;
    min-width: 1rem;
  }
}
.line-judge label {
  margin-top: 20px;
}
.line-judge label:nth-child(1) {
  margin-bottom: 20px;
}
.el-input {
  width: 120px;
  margin-top: 20px;
}
.center {
  display: inline-block;
  width: 20px;
  height: 20px;
  font-size: 14px;
  text-align: center;
}
</style>
