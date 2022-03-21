<template>
  <div>
    <h3>使用帮助</h3>
    <h4>使用步骤</h4>
    <ul>
      <li>1、打开新增界面
        <p>
          点击页面【新增】按钮，打开新增抽屉
        </p>
        <img :src="require(`./imgs/add.png`)" width="800">
      </li>
      <li>2、填写数据库信息
        <p>
          页面上自动填写了当前使用的数据库信息，可以自行修改，修改好后，点击【连接】按钮
        </p>
        <img :src="require(`./imgs/connect.png`)" width="800">
      </li>
      <li>3、选择库名、表名
        <p>
          先选择库名，再选择表名，选好表名后，下方会展现几个Tab页，并且表的信息和字段会自动带出来，呈现在几个Tab页中
        </p>
        <img :src="require(`./imgs/db.png`)" width="800">
      </li>
      <li>5、基本信息Tab页
        <p>
          根据实际情况修改表单信息
        </p>
        <p>
          表单字段说明：
          <table class="doc-table">
            <tr>
              <th>字段名</th>
              <th>说明</th>
              <th>默认</th>
              <th>影响</th>
            </tr>
            <tr>
              <td>实体名</td>
              <td>当前表对应的实体名称</td>
              <td>表注释</td>
              <td>导出文件名、功能权限名、swagger文档等</td>
            </tr>
            <tr>
              <td>父菜单编码</td>
              <td>对应u_function中的parent_code</td>
              <td>center_01，对应用户中心</td>
              <td>菜单的层级关系</td>
            </tr>
            <tr>
              <td>菜单名称</td>
              <td>对应u_function中的name</td>
              <td>表注释</td>
              <td>菜单的显示名</td>
            </tr>
            <tr>
              <td>菜单编码</td>
              <td>对应u_function中的code</td>
              <td>表名</td>
              <td>菜单的编码</td>
            </tr>
            <tr>
              <td>Vue静态Pool名</td>
              <td>vue-static工程中的pool目录名</td>
              <td>与库名一致</td>
              <td>导入模板的路径等</td>
            </tr>
            <tr>
              <td>配置Pool名</td>
              <td>导入、导出、字典等配置表的pool字段</td>
              <td>与库名一致</td>
              <td>导入、导出、字典等数据</td>
            </tr>
            <tr>
              <td>War上下文路径</td>
              <td>此功能代码对应的项目工程的web上下文路径</td>
              <td>库名-web</td>
              <td>Api服务的请求路径</td>
            </tr>
            <tr>
              <td>包名前缀</td>
              <td>代码的包名前缀</td>
              <td>com.odianyun.库名</td>
              <td>生成代码的包名</td>
            </tr>
          </table>
        </p>
      </li>

      <li>5、查询Tab页
        <p>
          查询Tab页用于配置列表页面的过滤区域的显示
        </p>
        <img :src="require(`./imgs/search-tab.png`)" width="800">
        <p>
          表格中默认会展示公共字段之外的所有字段，可以根据实际情况【删除】不用的字段
        </p>
        <p>
          表格行中可编辑使用字段名、显示名，查询控件等信息
          行尾的操作一栏，有删除和同步两个操作
        </p>
        <p>
          此Tab页按钮说明：
          <table class="doc-table">
            <tr>
              <th>按钮</th>
              <th>说明</th>
            </tr>
            <tr>
              <td>添加字段</td>
              <td>添加一个字段，列表中默认没有公共字段，可以用这个来添加</td>
            </tr>
            <tr>
              <td>重置字段</td>
              <td>重置字段的增删改</td>
            </tr>
            <tr>
              <td>去掉公共字段</td>
              <td>去掉id,createTime,createUserid...等等公共字段</td>
            </tr>
            <tr>
              <td>删除</td>
              <td>删除此表格行。删除后可以通过【添加字段】再添加回来，不过此行的信息需要重新编辑</td>
            </tr>
            <tr>
              <td>同步</td>
              <td>同步此字段的信息到其他Tab页中的相同字段(前提是其他Tab页有这个字段)</td>
            </tr>
          </table>
        </p>
      </li>

      <li>6、添加字段
        <p>
          从字段列表中选择一个字段
        </p>
        <img :src="require(`./imgs/add-field-select.png`)" width="800">
        <p>
          或者添加自定义字段（通常用于添加完后，原表中又添加了新的字段）
        </p>
        <img :src="require(`./imgs/add-field-customized.png`)" width="800">
        <p>
          编辑好后，点【确定】，可以看到表格中新添加的字段
        </p>
        <img :src="require(`./imgs/add-field-after.png`)" width="800">
      </li>

      <li>7、属性编辑
        <p>
          从下拉框中选择一个控件后，可以编辑控件的属性
        </p>
        <img :src="require(`./imgs/edit-attr.png`)" width="800">
        <p>
          点击表格行中属性文本框后的编辑小图标，弹出属性编辑对话框，框中展示了当前选择控件的默认属性。
          可以修改属性的值，但是不能删除，也可以点击【+】按钮添加自定义属性
        </p>
        <img :src="require(`./imgs/attr-dialog.png`)" width="800">
        <p>
          编辑完成，点【确定】，关闭对话框，可以看到属性文本框中的信息发生变化，属性框不可直接编辑
        </p>
        <img :src="require(`./imgs/after-attr.png`)" width="800">
      </li>

      <li>8、列表Tab页
        <p>
          列表Tab页用于配置列表页面的表格区域
        </p>
        <img :src="require(`./imgs/table-tab.png`)" width="800">
        <p>
          表格中默认会展示公共字段之外的所有字段，可以根据实际情况【删除】不用的字段
        </p>
        <p>
          表格行中可编辑使用字段名、显示名、字典值等信息
          行尾的操作一栏，有删除和同步两个操作
        </p>
        <p>字典值：表示此字段的信息来源于misc.code表，字段值为code, 表格中最终显示的name</p>
        <p>
          此Tab页按钮说明：
          <table class="doc-table">
            <tr>
              <th>按钮</th>
              <th>说明</th>
            </tr>
            <tr>
              <td>添加字段</td>
              <td>添加一个字段，列表中默认没有公共字段，可以用这个来添加</td>
            </tr>
            <tr>
              <td>重置字段</td>
              <td>重置字段的增删改</td>
            </tr>
            <tr>
              <td>去掉公共字段</td>
              <td>去掉id,createTime,createUserid...等等公共字段</td>
            </tr>
            <tr>
              <td>表格是否显示复选框</td>
              <td>表格第一行是否为复选框（如果此开关为关闭状态，则没有批量删除功能）</td>
            </tr>
            <tr>
              <td>是否支持分页</td>
              <td>表格中的数据是否需要分页（如果此开关为关闭状态，则没有分页条）</td>
            </tr>
            <tr>
              <td>删除</td>
              <td>删除此表格行。删除后可以通过【添加字段】再添加回来，不过此行的信息需要重新编辑</td>
            </tr>
            <tr>
              <td>同步</td>
              <td>同步此字段的信息到其他Tab页中的相同字段(前提是其他Tab页有这个字段)</td>
            </tr>
          </table>
        </p>
      </li>

      <li>9、编辑Tab页
        <p>
          编辑Tab页用于配置编辑页或详情页
        </p>
        <img :src="require(`./imgs/edit-tab.png`)" width="800">
        <p>
          表格中默认会展示公共字段之外的所有字段，可以根据实际情况【删除】不用的字段
        </p>
        <p>
          表格行中可编辑使用字段名、显示名、编辑控件等信息
          行尾的操作一栏，有删除和同步两个操作
        </p>
        <p>
          此Tab页按钮说明：
          <table class="doc-table">
            <tr>
              <th>按钮</th>
              <th>说明</th>
            </tr>
            <tr>
              <td>添加字段</td>
              <td>添加一个字段，列表中默认没有公共字段，可以用这个来添加</td>
            </tr>
            <tr>
              <td>重置字段</td>
              <td>重置字段的增删改</td>
            </tr>
            <tr>
              <td>删除</td>
              <td>删除此表格行。删除后可以通过【添加字段】再添加回来，不过此行的信息需要重新编辑</td>
            </tr>
            <tr>
              <td>同步</td>
              <td>同步此字段的信息到其他Tab页中的相同字段(前提是其他Tab页有这个字段)</td>
            </tr>
          </table>
        </p>
      </li>

      <li>10、导入Tab页
        <p>
          导入Tab页用于配置导入功能
        </p>
        <img :src="require(`./imgs/import-tab.png`)" width="800">
        <p>
          表格中默认会展示公共字段之外的所有字段，可以根据实际情况【删除】不用的字段
        </p>
        <p>
          表格行中可编辑使用字段名、显示名、字典值等信息
          行尾的操作一栏，有删除和同步两个操作
        </p>
        <p>字典值：表示此字段的信息来源于misc.code表，字段值为code, 导入时使用name导入</p>
        <p>
          此Tab页按钮说明：
          <table class="doc-table">
            <tr>
              <th>按钮</th>
              <th>说明</th>
            </tr>
            <tr>
              <td>添加字段</td>
              <td>添加一个字段，列表中默认没有公共字段，可以用这个来添加</td>
            </tr>
            <tr>
              <td>重置字段</td>
              <td>重置字段的增删改</td>
            </tr>
            <tr>
              <td>去掉公共字段</td>
              <td>去掉id,createTime,createUserid...等等公共字段</td>
            </tr>
            <tr>
              <td>同步编辑字段</td>
              <td>将编辑Tab页表格中的字段信息同步过来（全部替换方式）</td>
            </tr>
            <tr>
              <td>是否异步导入</td>
              <td>导入是否为异步(如果此开关为关闭状态，则没有查看导入任务功能)</td>
            </tr>
            <tr>
              <td>删除</td>
              <td>删除此表格行。删除后可以通过【添加字段】再添加回来，不过此行的信息需要重新编辑</td>
            </tr>
            <tr>
              <td>同步</td>
              <td>同步此字段的信息到其他Tab页中的相同字段(前提是其他Tab页有这个字段)</td>
            </tr>
          </table>
        </p>
      </li>

      <li>11、导出Tab页
        <p>
          导出Tab页用于配置导出功能
        </p>
        <img :src="require(`./imgs/export-tab.png`)" width="800">
        <p>
          表格中默认会展示公共字段之外的所有字段，可以根据实际情况【删除】不用的字段
        </p>
        <p>
          表格行中可编辑使用字段名、显示名、字典值等信息
          行尾的操作一栏，有删除和同步两个操作
        </p>
        <p>字典值：表示此字段的信息来源于misc.code表，字段值为code, 导出时使用name</p>
        <p>
          此Tab页按钮说明：
          <table class="doc-table">
            <tr>
              <th>按钮</th>
              <th>说明</th>
            </tr>
            <tr>
              <td>添加字段</td>
              <td>添加一个字段，列表中默认没有公共字段，可以用这个来添加</td>
            </tr>
            <tr>
              <td>重置字段</td>
              <td>重置字段的增删改</td>
            </tr>
            <tr>
              <td>去掉公共字段</td>
              <td>去掉id,createTime,createUserid...等等公共字段</td>
            </tr>
            <tr>
              <td>同步列表字段</td>
              <td>将列表Tab页表格中的字段信息同步过来（全部替换方式）</td>
            </tr>
            <tr>
              <td>是否异步导出</td>
              <td>导出是否为异步(如果此开关为关闭状态，则没有查看导出任务功能)</td>
            </tr>
            <tr>
              <td>删除</td>
              <td>删除此表格行。删除后可以通过【添加字段】再添加回来，不过此行的信息需要重新编辑</td>
            </tr>
            <tr>
              <td>同步</td>
              <td>同步此字段的信息到其他Tab页中的相同字段(前提是其他Tab页有这个字段)</td>
            </tr>
          </table>
        </p>
      </li>

      <li>12、选择表类型
        <p>
          选择一个表类型，如果是有关联的表类型，如主表一对多附表或附表多对一主表，则会多一个【关联表】的Tab页
        </p>
        <img :src="require(`./imgs/rel.png`)" width="800">
      </li>

      <li>13、关联表Tab页
        <p>
          关联表Tab页根据表类型用于配置一对多表关联或多对一表关联
        </p>
        <img :src="require(`./imgs/rel-tab.png`)" width="800">
        <p>
          点击【添加】按钮，添加一个关联表
        </p>
        <img :src="require(`./imgs/rel-add-row.png`)" width="800">
        <p>
          选择主表字段、关联表、关联表字段，如想放弃添加，可以点击行尾的【移除】
        </p>
        <img :src="require(`./imgs/rel-row-confirm.png`)" width="800">
        <p>
          编辑好后，必须点击【确定】才能生效，关联表的字段会自动添加到各个Tab页的表格中
        </p>
        <img :src="require(`./imgs/rel-after-add-row.png`)" width="800">
      </li>

      <li>14、保存信息
        <p>
          点击【保存】按钮，保存所填写的信息后， 回到列表页
        </p>
      </li>
      <li>15、选择代码生成器
        <p>
          点击列表行中操作栏的【生成代码】,弹出生成代码对话框
          选择要对应的代码生成器， 也可以勾选【全选】来选择所有生成器
        </p>
        <img :src="require(`./imgs/code-dialog.png`)" width="800">
      </li>
      <li>16、生成代码
        <p>
          选择好代码生成器后，点击【确定】，静候片刻，服务器会返回一个ZIP文件的下载流
        </p>
        <img :src="require(`./imgs/code-checkall.png`)" width="800">
        <img :src="require(`./imgs/code-download.png`)" width="800">
      </li>
      <li>17、解压ZIP包
        <p>
          找到ZIP包的下载保存目录，解压后， 打开readme.md，如果没有md格式的编辑器， 也可以用文本编辑器打开
          按照readme.md中的提示，将各个代码文件放到对应的地方
        </p>
        <img :src="require(`./imgs/readme.png`)" width="800">
        <img :src="require(`./imgs/readme-content.png`)" width="800">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  async mounted() {

  }
}
</script>

<style scoped>
.vue-main {
    width: 100%;
    height: 100%;
}
.doc-table {
  border-collapse:collapse;
}
.doc-table td,th {
  border:1px solid #000;
  padding:5px;
}
</style>
