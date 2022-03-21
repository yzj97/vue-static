<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('类型:')" prop="type">
            <el-select v-model="search.type" :placeholder="$t('全部')" name="search_type">
              <el-option
                v-for="item in types"
                :key="item.key"
                :value="item.key"
                :label="item.value"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商家:')" prop="merchantId">
            <el-select v-model="search.merchantId" :placeholder="$t('全部')" name="search_merchantId">
              <el-option
                v-for="item in merchants"
                :key="item.merchantId"
                :value="item.merchantId"
                :label="item.merchantName"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('店铺:')" prop="storeId">
            <el-select v-model="search.storeId" :placeholder="$t('全部')" name="search_storeId">
              <el-option
                v-for="item in stores"
                :key="item.storeId"
                :value="item.storeId"
                :label="item.storeName"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('渠道:')" prop="channelCode">
            <el-select v-model="search.channelCode" :placeholder="$t('全部')" name="search_channelCode">
              <el-option
                v-for="item in channelCodes"
                :key="item.channelCode"
                :value="item.channelCode"
                :label="item.channelName"/>
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="ui_handleReset" code="ui" size="small" @click="handleReset">{{ $t('重置') }}</ody-button>
        <el-button size="small" type="primary" @click.prevent="handleSubmit">
          {{ $t('查询') }}
        </el-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <el-button name="addOne" type="primary" size="small" @click="addOne">{{ $t('新增') }}</el-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-url="/ouser-web/admin/listWechatConfigPage"
        >
          <template slot="type" slot-scope="scope">
            {{ typeMap[scope.row.type] }}
          </template>
          <template slot="channelCode" slot-scope="scope">
            {{ channelCodeMap[scope.row.channelCode] }}
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <ody-dialog
      :visible.sync="dialog.show"
      :title="$t('微信配置详情')"
      width="600px">
      <el-form ref="form" :model="dialog.obj" label-width="100px">
        <el-form-item :label="$t('类型')+'：'" :rules="[{ required: true, message: this.$t('请选择类型'), trigger: 'change' }]" prop="type" required>
          <el-select v-if="dialog.add === true" v-model="dialog.obj.type" :placeholder="$t('请选择')" name="dialog_obj_type">
            <el-option
              v-for="item in types"
              :key="item.key"
              :value="item.key"
              :label="item.value"/>
          </el-select>
          <el-input v-if="dialog.add === false" v-model="dialog.obj.typeName" name="dialog_obj_typeName" disabled sizi="mini"/>
        </el-form-item>
        <el-form-item :label="$t('商家')+'：'" :rules="[{ required: true, message: this.$t('请选择商家'), trigger: 'change' }]" prop="merchantId" required>
          <el-select v-if="dialog.add === true" v-model="dialog.obj.merchantId" :placeholder="$t('请选择')" name="dialog_obj_merchantId">
            <el-option
              v-for="item in merchants"
              :key="item.merchantId"
              :value="item.merchantId"
              :label="item.merchantName"/>
          </el-select>
          <el-input v-if="dialog.add === false" v-model="dialog.obj.merchantName" name="dialog_obj_merchantName" disabled sizi="mini"/>
        </el-form-item>
        <el-form-item :label="$t('店铺')+'：'" :rules="[{ required: true, message: this.$t('请选择店铺'), trigger: 'change' }]" prop="storeId" required>
          <el-select v-if="dialog.add === true" v-model="dialog.obj.storeId" :placeholder="$t('请选择')" name="dialog_obj_storeId">
            <el-option
              v-for="item in stores"
              :key="item.storeId"
              :value="item.storeId"
              :label="item.storeName"/>
          </el-select>
          <el-input v-if="dialog.add === false" v-model="dialog.obj.storeName" name="dialog_obj_storeName" disabled sizi="mini"/>
        </el-form-item>
        <el-form-item :label="$t('渠道')+'：'" :rules="[{ required: true, message: this.$t('请选择渠道'), trigger: 'change' }]" prop="channelCode" required>
          <el-select v-if="dialog.add === true" v-model="dialog.obj.channelCode" :placeholder="$t('请选择')" :disabled="dialog.add === false" name="dialog_obj_channelCode">
            <el-option
              v-for="item in channelCodes"
              :key="item.channelCode"
              :value="item.channelCode"
              :label="item.channelName"/>
          </el-select>
          <el-input v-if="dialog.add === false" v-model="dialog.obj.channelCodeName" name="dialog_obj_channelCodeName" disabled sizi="mini"/>
        </el-form-item>
        <el-form-item
          :label="$t('appId')+'：'"
          :rules="[
            { required: true, message: this.$t('请输入appId'), trigger: 'change' },
            { min: 1, max: 20, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 20 ' + this.$t('个字符'), trigger: 'change' }
          ]"
          prop="appId">
          <el-input v-model="dialog.obj.appId" name="dialog_obj_appId" sizi="mini"/>
        </el-form-item>
        <el-form-item
          :label="$t('appSecret')+'：'"
          :rules="[
            { required: true, message: this.$t('请输入appSecret'), trigger: 'change' },
            { min: 1, max: 50, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 50 ' + this.$t('个字符'), trigger: 'change' }
          ]"
          prop="appSecret">
          <el-input v-model="dialog.obj.appSecret" name="dialog_obj_appSecret" sizi="mini"/>
        </el-form-item>
        <el-form-item
          :label="$t('回调地址')+'：'"
          :rules="[
            { min: 1, max: 50, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 200 ' + this.$t('个字符'), trigger: 'change' }
          ]"
          prop="redirectUri">
          <el-input v-model="dialog.obj.redirectUri" name="dialog_obj_redirectUri" sizi="mini"/>
        </el-form-item>
        <el-form-item>
          <el-button name="initDialog" size="mini" @click="initDialog">{{ $t('取消') }}</el-button>
          <el-button name="commitDialog" type="primary" size="mini" @click="commitDialog">{{ $t('保存') }}</el-button>
        </el-form-item>
      </el-form>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: {},
      types: [],
      merchants: [],
      stores: [],
      typeMap: {},
      channelCodes: [],
      channelCodeMap: {},
      search: {
        merchantId: null,
        storeId: null,
        channelCode: null
      },
      table: {
        columns: [
          {
            label: this.$t('类型'),
            slot: 'type',
            show: true,
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('商家'),
            prop: 'merchantName',
            show: true,
            align: 'center',
            minWidth: 88
          },
          {
            label: this.$t('店铺'),
            show: true,
            minWidth: 200,
            align: 'center',
            prop: 'storeName'
          },
          {
            label: this.$t('渠道'),
            slot: 'channelCode',
            minWidth: 124,
            align: 'center',
            show: true
          },
          {
            label: this.$t('appId'),
            prop: 'appId',
            minWidth: 124,
            align: 'center',
            show: true
          },
          {
            label: this.$t('appSecret'),
            prop: 'appSecret',
            minWidth: 124,
            align: 'center',
            show: true
          },
          {
            label: this.$t('回调地址'),
            prop: 'redirectUri',
            minWidth: 200,
            align: 'center',
            show: true
          }
        ],
        operates: {
          width: 124,
          fixed: 'right',
          list: [
            {
              label: '编辑',
              method: (index, row) => {
                this.edit(row)
              },
              code: 'ui'
            },
            {
              label: '删除',
              method: (index, row) => {
                this.deleteOne(row)
              },
              code: 'ui'
            }
          ]
        }
      }
    }
  },
  async mounted() {
    await this.initDialog()
    await this.$ouser.$api.common.code_listMulti({ categorys: ['WEIXIN_ACCOUNT_TYPE'], pool: 'misc' }).then(res => {
      this.types = []
      for (const one of Object.keys(res.data.WEIXIN_ACCOUNT_TYPE)) {
        this.types.push({
          key: one,
          value: res.data.WEIXIN_ACCOUNT_TYPE[one]
        })
      }

      this.typeMap = this.types.reduce((rtv, item) => {
        rtv[item.key] = item.value
        return rtv
      }, {})
    })
    await this.$ouser.$api.common.queryChannelMap({}).then(res => {
      this.channelCodes = []
      for (const one of Object.keys(res.data)) {
        this.channelCodes.push(res.data[one])
      }
      this.channelCodes.push({
        channelCode: '-1',
        channelName: this.$t('默认')
      })
      this.channelCodeMap = this.channelCodes.reduce((rtv, item) => {
        rtv[item.channelCode] = item.channelName
        return rtv
      }, {})
    })
    await this.$ouser.$api.merchantService.queryPlatformAuthMerchantPage({ 'currentPage': 1, 'itemsPerPage': 1000 }).then(res => {
      this.merchants = res.data.listObj
      this.merchants.push({
        merchantId: -1,
        merchantName: this.$t('默认')
      })
    })
    await this.$ouser.$api.StoreorgpageinfoService.queryPlatformAuthStorePage({ 'currentPage': 1, 'itemsPerPage': 1000 }).then(res => {
      this.stores = res.data.listObj
      this.stores.push({
        storeId: -1,
        storeName: this.$t('默认')
      })
    })
    await this.query()
  },
  methods: {
    initDialog() {
      this.dialog = {
        show: false,
        add: false,
        obj: {
          storeId: null,
          merchantId: null,
          channelCode: null,
          appId: null,
          appSecret: null,
          typeName: null,
          type: null,
          merchantName: null,
          storeName: null
        }
      }
    },
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
    query() {
      const {
        ...params
      } = this.search

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    deleteOne(row) {
      this.$confirm(this.$t('此操作将永久删除') + ',' + this.$t('是否继续') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$ouser.$api.adminService.deleteOneWeixinConfig({ id: row.id }).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('删除成功')
          })
          this.query()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('已取消')
        })
      })
    },
    edit(row) {
      this.initDialog()
      this.dialog.show = true
      this.dialog.add = false
      this.dialog.obj = this.$portal.deepClone(row)
      this.dialog.obj.channelCodeName = this.channelCodeMap[this.dialog.obj.channelCode]
      this.dialog.obj.typeName = this.typeMap[this.dialog.obj.type]
    },
    addOne() {
      this.initDialog()
      this.dialog.show = true
      this.dialog.add = true
    },
    async commitDialog() {
      const [err] = await this.formValidate('form')

      if (err) {
        return
      }

      await this.save()
    },
    save() {
      if (this.dialog.add) {
        this.$ouser.$api.adminService.addWechatConfig(this.dialog.obj).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('保存成功')
          })
          this.initDialog()
          this.query()
        })
      } else {
        this.$ouser.$api.adminService.updateWechatConfig(this.dialog.obj).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('保存成功')
          })
          this.initDialog()
          this.query()
        })
      }
    }
  }
}
</script>
