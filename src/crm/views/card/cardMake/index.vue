<template>
  <section>
    <el-form ref="form" :model="edit" :inline="type === 0" label-width="100px" class="form">
      <div>
        <ody-left-right>
          <div slot="left">
            <el-form-item :label="$t('卡号生成方式')">
              <el-radio-group v-model="type" name="type" @change="onTypeChange">
                <el-radio :label="0">{{ $t('系统生成') }}</el-radio>
                <el-radio :label="1">{{ $t('手工导入') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div slot="right">
            <router-link to="cardMakeList" class="link-type">
              <span>{{ $t('查看历史制卡清单') }}</span>
            </router-link>
          </div>
        </ody-left-right>
      </div>
      <div v-if="type == 0">
        <ody-list-table-area>
          <div slot="btn">
            <ody-button
              :disabled="edit.cards.length >= 100"
              name="CrmGiftCardMakeChoosProduct_chooseMp"
              size="small"
              type="primary"
              code="CrmGiftCardMakeChoosProduct"
              @click="chooseMp"
            >{{ $t('选择卡') }}</ody-button>
            <ody-button
              :disabled="checkedRows.length === 0"
              name="CrmGiftCardMakeDeleteProduct_batchDelMp"
              size="small"
              type="primary"
              code="CrmGiftCardMakeDeleteProduct"
              @click="batchDelMp"
            >{{ $t('批量删除') }}</ody-button>
          </div>
          <div slot="table">
            <ody-table
              ref="table"
              :multiple="true"
              :checked.sync="checkedRows"
              :data="edit.cards"
              :columns="columns"
              :can-filter="false"
              :operates="operates"
              name="edit_cards068"
            >
              <template slot="numberLabel">
                <ody-tip-star :content="$t('制卡张数')" />
              </template>
              <template slot="number" slot-scope="scope">
                <el-form-item
                  :prop="'cards.' + scope.$index + '.number'"
                  :rules="[{required:true, message: $t('请输入') + $t('制卡张数')}]"
                  required="true"
                >
                  <el-input-number
                    :controls="false"
                    :precision="0"
                    :max="1000"
                    :min="1"
                    v-model="scope.row.number"
                    :placeholder="$t('请输入') + $t('制卡张数')"
                    name="scope_row_number"
                    size="mini"
                  />
                </el-form-item>
              </template>
            </ody-table>
          </div>
        </ody-list-table-area>
      </div>
      <div v-if="type == 1">
        <ody-list-table-area>
          <div slot="btn">
            <ody-button
              name="CrmGiftCardMakeChoosProduct_chooseMp2"
              size="small"
              type="primary"
              code="CrmGiftCardMakeChoosProduct"
              @click="chooseMp"
            >{{ $t('选择卡') }}</ody-button>
          </div>
          <div slot="table">
            <el-form-item
              :label="$t('卡商品名称')"
              :rules="[{required:true, message: $t('请选择卡')}]"
              required="true"
              prop="card.cardMpId"
            >{{ edit.card.cardMpName }}</el-form-item>
            <SimpleFileUpload
              :file-list.sync="edit.fileList"
              :disabled.sync="!edit.card.cardMpId"
              :tip-on-disabled="$t('请选择卡')"
              @downloadTemplate="downloadTemplate"
            />
          </div>
        </ody-list-table-area>
      </div>
    </el-form>
    <el-row type="flex" justify="center" style="margin-top: 5px">
      <ody-button
        v-loading.fullscreen.lock="saving"
        :code="type === 0 ? 'CrmGiftCard_add' : 'CrmGiftCard_importData'"
        name="save"
        size="small"
        type="primary"
        @click="save"
      >{{ $t('确认制卡') }}</ody-button>
    </el-row>

    <CardProductModal1
      v-if="type === 0"
      :title="$t('添加卡')"
      :visible.sync="mp1ChooseVisible"
      :checked-mp-ids="checkedMpIds"
      :multiple="true"
      :type="[34, 36]"
      :data-type="2"
      :type-of-product="[0, 2]"
      :extra-filters="mpItemFilters"
      @ok="onMpChoose"
    />

    <CardProductModal2
      v-if="type === 1"
      :title="$t('选择卡')"
      :visible.sync="mp2ChooseVisible"
      :checked-mp-ids="checkedMpIds"
      :multiple="false"
      :type="[34, 36]"
      :data-type="2"
      :type-of-product="[0, 2]"
      :extra-filters="mpItemFilters"
      @ok="onMpChoose"
    />
  </section>
</template>

<script>
import CardProductModal1 from '@/components/card-product-modal'
import CardProductModal2 from '@/components/card-product-modal'
import SimpleFileUpload from '@/components/simple-file-upload'
import util from '@/utils/util'
import cardMakeTemplate from '@/excelFile/cardMakeTemplate.xlsx'

export default {
  name: 'CrmGiftCardMake',
  components: {
    CardProductModal1,
    CardProductModal2,
    SimpleFileUpload
  },
  data() {
    return {
      mp1ChooseVisible: false,
      mp2ChooseVisible: false,
      checkedMpIds: [],
      checkedRows: [],
      saving: false,
      type: 0,
      edit: {
        cards: [],
        card: {},
        fileList: []
      },
      columns: [
        {
          show: true,
          prop: 'cardMpCode',
          label: this.$t('商品编码'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'cardMpName',
          label: this.$t('商品名称'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'typeName',
          label: this.$t('商品类型'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'faceValue',
          label: this.$t('面值') + '(' + this.$t('元') + ')',
          align: 'right',
          minWidth: 80,
          formatter: (row, column) =>
            row.type === 33 || row.type === 34
              ? this.$options.filters.currency(row.faceValue)
              : ''
        },
        {
          show: true,
          prop: 'giftMpCode',
          label: this.$t('兑换商品编码'),
          align: 'right',
          minWidth: 100
        },
        {
          show: true,
          prop: 'giftMpName',
          label: this.$t('兑换商品名称'),
          align: 'right',
          minWidth: 120
        },
        {
          show: true,
          slot: 'number',
          labelSlot: 'numberLabel',
          align: 'center',
          minWidth: 120
        }
      ],
      operates: {
        minWidth: '50px',
        fixed: 'right',
        list: [
          {
            label: this.$t('删除'),
            method: (index, row) => {
              try {
                util.confirm(
                  this,
                  this.$t('whether_to_delete_the_goods'),
                  () => {
                    this.removeCheckedRows(row)
                    this.checkedRows.splice(index, 1)
                  }
                )
              } catch (e) {
                console.log(e)
              }
            },
            code: 'CrmGiftCardMakeDeleteProduct'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {},
    downloadTemplate() {
      this.$portal.downloadFileByGet(
        cardMakeTemplate,
        {},
        this.$t('卡制作模板') + '.xlsx'
      )
    },
    chooseMp() {
      if (this.type === 0) {
        this.mp1ChooseVisible = true
      } else {
        this.mp2ChooseVisible = true
      }
    },
    onMpChoose(list) {
      if (this.type === 0) {
        list.forEach(item => {
          if (!this.checkedMpIds.includes(item.cardMpId)) {
            this.checkedMpIds.push(item.cardMpId)
            this.edit.cards.push(item)
          }
        })
      } else {
        this.edit.card = list[0]
        this.checkedMpIds.push(this.card.cardMpId)
      }
    },
    onTypeChange() {
      this.checkedMpIds = []
      if (this.type === 0) {
        this.edit.card = {}
      } else {
        this.edit.cards = []
      }
    },
    batchDelMp() {
      this.checkedRows.forEach((row, index) => {
        this.removeCheckedRows(row)
      })
      this.checkedRows = []
    },
    removeCheckedRows(row) {
      this.edit.cards.forEach((item, index) => {
        if (item.cardMpId === row.cardMpId) {
          this.edit.cards.splice(index, 1)
        }
      })
      this.checkedMpIds.forEach((item, index) => {
        if (item === row.cardMpId) {
          this.checkedMpIds.splice(index, 1)
        }
      })
    },
    save() {
      if (!this.validateData()) {
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saving = true
          const api = this.getSaveApi()
          api(this.getSaveData()).then(
            res => {
              this.saving = false
              this.$alert(
                this.$t('卡制作中，请到制卡清单查看'),
                this.$t('系统信息'),
                {
                  confirmButtonText: this.$t('确定'),
                  callback: action => {
                    this.$router.push({ name: 'CrmGiftCardMakeList' })
                  }
                }
              )
            },
            res => {
              this.saving = false
            }
          )
        }
      })
    },
    getSaveApi() {
      return this.type === 0
        ? this.$crm.$api.giftCard.make_add
        : this.$crm.$api.giftCard.make_importData
    },
    getSaveData() {
      if (this.type === 0) {
        return this.edit.cards
      } else {
        const uploadData = new FormData()
        uploadData.append('fileData', this.edit.fileList[0].raw)
        for (const p in this.edit.card) {
          uploadData.append(p, this.edit.card[p])
        }
        return uploadData
      }
    },
    validateData() {
      if (this.type === 0 && this.edit.cards.length < 1) {
        this.$message.info(this.$t('请选择卡'))
        return false
      }
      if (this.type === 0 && this.edit.cards.length > 100) {
        this.$message.info(this.$t('最多只能选100个卡商品'))
        return false
      }
      return true
    }
  }
}
</script>
