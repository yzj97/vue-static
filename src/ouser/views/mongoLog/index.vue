<template>
  <div>
    <el-card>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane name="action">
          <span slot="label"> ActionLog
            <el-popover
              placement="top-start"
              title="使用帮助"
              width="600"
              trigger="hover">
              <div>
                <p><strong>一般用来查询调用Controller层的记录</strong></p>
                <ol>
                  <li>App: 使用pool对应的包名，如：订单（oms）, 用户（ouser）</li>
                  <li>UUID: 对应当前日志的标识，一次请求的相关mongo日志使用相同的UUID</li>
                  <li>Controller: 控制器的全路径或者简单名称</li>
                  <li>Operation: 记录日志时加入的操作描述</li>
                  <li>入参：对应请求参数，可以使用多个层次，例如：字段名：userIdList，值：2010200000000252</li>
                  <li>出参：对应返回，可以使用多个层次，例如：字段名：data.userId，值：2010200000000252</li>
                  <li>查询结果列/详情/关联数据（相同uuid的数据） 提供快速复制功能</li>
                </ol>
              </div>
              <i slot="reference" class="el-icon-info"/>
            </el-popover>
          </span>
          <action ref="action" />
        </el-tab-pane>
        <el-tab-pane name="invoke">
          <span slot="label"> InvokeLog
            <el-popover
              placement="top-start"
              title="使用帮助"
              width="600"
              trigger="hover">
              <div>
                <p><strong>一般用来查询服务相互调用的记录</strong></p>
                <ol>
                  <li>App: 使用pool对应的包名，如：订单（oms）, 用户（ouser）</li>
                  <li>UUID: 对应当前日志的标识，一次请求的相关mongo日志使用相同的UUID</li>
                  <li>Type: 标识调用类型，如：SOA</li>
                  <li>Service: 一般是service名称（或者全路径）</li>
                  <li>Api: 调用的url接口</li>
                  <li>入参：对应请求参数，可以使用多个层次，如果入参保存的为字符串，不需要输入字段名</li>
                  <li>出参：对应返回，可以使用多个层次，例如：字段名：data.data.merchantId，值：2010290000000220</li>
                  <li>查询结果列/详情/关联数据（相同uuid的数据） 提供快速复制功能</li>
                </ol>
              </div>
              <i slot="reference" class="el-icon-info"/>
            </el-popover>
          </span>
          <invoke ref="invoke" />
        </el-tab-pane>
        <el-tab-pane name="operation">
          <span slot="label"> OperationLog
            <el-popover
              placement="top-start"
              title="使用帮助"
              width="600"
              trigger="hover">
              <div>
                <p><strong>一般用来查询Service层的记录</strong></p>
                <ol>
                  <li>App: 使用pool对应的包名，如：订单（oms）, 用户（ouser）</li>
                  <li>UUID: 对应当前日志的标识，一次请求的相关mongo日志使用相同的UUID</li>
                  <li>Service: 一般是service名称（或者全路径）</li>
                  <li>ModelName: 实体类型，一般是实体类名称，例如So</li>
                  <li>ModelRefId: 实体对应的标识，一般是code或者id，也可以直接使用拼接后的标识，例如：So:201127763948929426</li>
                  <li>Notes：操作描述，例如：已发货 </li>
                  <li>Operation：一般是操作对应的字段名，例如：orderStatus </li>
                  <li>Context：实体的数据属性查询，例如：字段名：orderCode，值：201127763948929426</li>
                  <li>查询结果列/详情/关联数据（相同uuid的数据） 提供快速复制功能</li>
                </ol>
              </div>
              <i slot="reference" class="el-icon-info"/>
            </el-popover>
          </span>
          <operation ref="operation" />
        </el-tab-pane>
        <el-tab-pane name="detail">
          <span slot="label"> DetailLog
            <el-popover
              placement="top-start"
              title="使用帮助"
              width="600"
              trigger="hover">
              <div>
                <p><strong>一般用来查询调用Service层的记录详情</strong></p>
                <ol>
                  <li>App: 使用pool对应的包名，如：订单（oms）, 用户（ouser）</li>
                  <li>UUID: 对应当前日志的标识，一次请求的相关mongo日志使用相同的UUID</li>
                  <li>ModelName: 实体类型，一般是实体类名称，例如So</li>
                  <li>ModelRefId: 实体对应的标识，一般是code或者id，也可以直接使用拼接后的标识，例如：So:201127763948929426</li>
                  <li>Notes：操作描述，例如：已发货 </li>
                  <li>Operation：一般是操作对应的字段名，例如：orderStatus </li>
                  <li>Context：实体的数据属性查询，例如：字段名：orderCode，值：201127763948929426</li>
                  <li>查询结果列/详情/关联数据（相同uuid的数据） 提供快速复制功能</li>
                </ol>
              </div>
              <i slot="reference" class="el-icon-info"/>
            </el-popover>
          </span>
          <detail ref="detail" />
        </el-tab-pane>
        <el-tab-pane name="model">
          <span slot="label"> ModelLog
            <el-popover
              placement="top-start"
              title="使用帮助"
              width="600"
              trigger="hover">
              <div>
                <p><strong>一般用来查询调用实体数据变更的记录</strong></p>
                <ol>
                  <li>App: 使用pool对应的包名，如：订单（oms）, 用户（ouser）</li>
                  <li>UUID: 对应当前日志的标识，一次请求的相关mongo日志使用相同的UUID</li>
                  <li>ModelName: 实体类型，一般是实体类名称，例如So</li>
                  <li>ModelRefId: 实体对应的标识，一般是code或者id，也可以直接使用拼接后的标识，例如：So:201127763948929426</li>
                  <li>TableName: 实体对应的表名</li>
                  <li>查询结果列/详情/关联数据（相同uuid的数据） 提供快速复制功能</li>
                </ol>
              </div>
              <i slot="reference" class="el-icon-info"/>
            </el-popover>
          </span>
          <model ref="model" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import action from '@/components/mongoLog/action.vue'
import detail from '@/components/mongoLog/detail.vue'
import operation from '@/components/mongoLog/operation.vue'
import invoke from '@/components/mongoLog/invoke.vue'
import model from '@/components/mongoLog/model.vue'
export default {
  name: 'OuserMongoLog',
  components: {
    action,
    detail,
    operation,
    invoke,
    model
  },
  data() {
    return {
      activeName: 'action'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.findMongoLog()
    },
    handleClick(tab, event) {
      this.findMongoLog()
    },
    findMongoLog() {
      if (this.$refs[this.activeName] && this.$refs[this.activeName].init) {
        this.$refs[this.activeName].init()
      }
    }
  }
}
</script>
