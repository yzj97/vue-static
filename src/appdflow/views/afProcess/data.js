export default {
  'nodes': [{
    'type': 'node',
    'size': '72*72',
    'shape': 'flow-circle',
    'color': '#FA8C16',
    'label': '开始',
    'ref': {
      'type': 0
    },
    'x': 468,
    'y': 61,
    'id': '01729835',
    'index': 0
  }, {
    'type': 'node',
    'size': '80*48',
    'shape': 'flow-rect',
    'color': '#1890FF',
    'label': '审批',
    'ref': {
      'type': 2,
      'appdType': 1, // 审批方式 1: 或签 2: 会签
      'appdActorType': 1, // 审批人员类型 1: 指定审批人 2: 组织部门 3: 岗位
      'appdActorSubtype': 1, // 审判人员子类型 1: 部门主管 2: 连续多级主管 3: 指定部门
      'actorList': []
    },
    'x': 468,
    'y': 201.5,
    'id': 'b69121d6',
    'index': 1
  }, {
    'type': 'node',
    'size': '80*72',
    'shape': 'flow-rhombus',
    'color': '#13C2C2',
    'label': '条件',
    'ref': {
      'type': 1
    },
    'x': 468,
    'y': 339.5,
    'id': 'a459eb24',
    'index': 2
  }, {
    'type': 'node',
    'size': '80*48',
    'shape': 'flow-rect',
    'color': '#1890FF',
    'label': '审批',
    'ref': {
      'type': 2,
      'appdType': 1, // 审批方式 1: 或签 2: 会签
      'appdActorType': 1, // 审批人员类型 1: 指定审批人 2: 组织部门 3: 岗位
      'appdActorSubtype': 1, // 审判人员子类型 1: 部门主管 2: 连续多级主管 3: 指定部门
      'actorList': []
    },
    'x': 672.3,
    'y': 201.6,
    'id': '18e81721',
    'index': 3
  }, {
    'type': 'node',
    'size': '72*72',
    'shape': 'flow-circle',
    'color': '#FA8C16',
    'label': '结束',
    'x': 468,
    'y': 502.00000000000006,
    'id': '03511b2c',
    'ref': {
      'type': 3
    },
    'index': 9
  }],
  'edges': [{
    'source': '01729835',
    'sourceAnchor': 2,
    'target': 'b69121d6',
    'targetAnchor': 0,
    'id': '070785c1',
    'radioVal': 1,
    'index': 4,
    'label': '',
    'ref': {
      'type': 1,
      'conditionList': [
        {
          'nodeCode': '2',
          'variableId': 1,
          'operator': '>=',
          'variableValue': '10'
        }
      ]
    }

  }, {
    'source': 'b69121d6',
    'sourceAnchor': 2,
    'target': 'a459eb24',
    'targetAnchor': 0,
    'id': 'a3bbe682',
    'radioVal': 1,
    'index': 5,
    'label': '',
    'ref': {
      'type': 1,
      'conditionList': [
        {
          'nodeCode': '2',
          'variableId': 1,
          'operator': '<=',
          'variableValue': '30'
        }
      ]
    }

  }, {
    'source': 'a459eb24',
    'sourceAnchor': 1,
    'target': '18e81721',
    'targetAnchor': 2,
    'id': '25f2209d',
    'radioVal': 2,
    'index': 6,
    'label': '',
    'ref': {
      'type': 1
    }

  }, {
    'source': '18e81721',
    'sourceAnchor': 3,
    'target': 'b69121d6',
    'targetAnchor': 1,
    'id': 'd3a887fa',
    'radioVal': 1,
    'index': 7,
    'label': '',
    'ref': {
      'type': 1,
      'id': 26,
      'conditionList': [
        {
          'nodeCode': '2',
          'variableId': 1,
          'operator': '>=',
          'variableValue': '50'
        }
      ]
    }

  }, {
    'source': 'a459eb24',
    'sourceAnchor': 2,
    'target': '03511b2c',
    'targetAnchor': 0,
    'id': '494f8cc4',
    'radioVal': 1,
    'index': 8,
    'label': '20~30',
    'ref': {
      'type': 1,
      'id': 1,
      'conditionList': [
        {
          'nodeCode': '2',
          'variableId': 1,
          'operator': '>=',
          'variableValue': '20'
        },
        {
          'nodeCode': '2',
          'variableId': 1,
          'operator': '<=',
          'variableValue': '30'
        }
      ]
    }

  }]
}
