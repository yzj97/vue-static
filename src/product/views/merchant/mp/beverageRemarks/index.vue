<template>
  <div class="beverage-remarks-panal">
    <div class="beverage-remarks-content">
      <div class="remarks-eg">
        <span>设置口味、加料等，供顾客点餐时选择。</span>
        <el-popover placement="top-start" width="400" trigger="hover">
          <div class="remarks-content-popover">
            <span class="title">{{ $t('菜品备注示例') }}</span>
            <span class="remarks-eg">菜品包含不同口味等需要用户选择时,可使用备注</span>
            <div class="remarkGroupList-dialog">
              <div class="remarkGroupList-dialog-productName">
                <span>{{ egData.productName }}</span>
                <i class="el-icon-close" />
              </div>
              <div class="remarkGroupList-dialog-groupList">
                <div v-for="item in egData.groupList" :key="item">
                  <span class="remarkGroupList-dialog-groupName">{{ item.groupName }}</span>
                  <div style="margin:10px 0px">
                    <span
                      v-for="label in item.labellist"
                      :key="label"
                      :class="[{ active: label.actived }, 'actived']"
                      class="remarkGroupList-dialog-label"
                    >{{ label.name }}</span>
                  </div>
                </div>
                <div style="margin:30px 0px">
                  <div class="span-text">
                    <span>￥12 不辣 不加 加葱</span>
                    <span style="padding-left:20px">
                      |
                      <i class="el-icon-remove-outline" /> 1
                      <i class="el-icon-circle-plus-outline" style="color:#f7b783ef" />
                    </span>
                  </div>
                  <el-button type="danger" class="submit">{{ $t('提交') }}</el-button>
                </div>
              </div>
            </div>
          </div>
          <el-button slot="reference" type="text">{{ $t('示例') }}</el-button>
        </el-popover>
      </div>
      <!-- 分组 -->
      <ProductBeverageGroup
        ref="remarkGroup"
        :id.sync="id"
        :merchantid.sync="merchantId"
        :charging-group-vos="remarkGroupList"
      />
      <el-button name="remarkGroupAdd" type="primary" icon="el-icon-plus" @click="remarkGroupAdd">{{ $t('添加自定义分组') }}</el-button>
      <el-button name="handleClick" type="primary" @click="handleClick">{{ $t('保存') }}</el-button>
    </div>
  </div>
</template>

<script>
import ProductBeverageGroup from '@/components/product-beverage-group'
export default {
  name: 'BeverageRemarks',
  components: {
    ProductBeverageGroup
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    merchantId: {
      type: Number,
      default: null
    },
    chargingGroupVos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      remarkGroupList: this.chargingGroupVos,
      egData: {
        productName: '超级至尊披萨',
        groupList: [
          {
            groupName: '请选择辣度',
            labellist: [
              { name: '不辣', actived: true },
              { name: '不辣', actived: false },
              { name: '不辣', actived: false }
            ]
          },
          {
            groupName: '沙拉酱',
            labellist: [
              { name: '不加', actived: true },
              { name: '加沙拉酱', actived: false }
            ]
          },
          {
            groupName: '加料',
            labellist: [
              { name: '加葱', actived: true },
              { name: '不加葱', actived: false }
            ]
          }
        ]
      }
    }
  },

  methods: {
    handleClick() {
      this.$refs.remarkGroup.ruleFormValidate().then(valid => {
        if (valid) {
          // this.$refs.remarkGroup.saveMpChargingList()
          // return valid
        }
      })
    },
    // 添加自定义分组
    remarkGroupAdd() {
      this.remarkGroupList = this.$refs.remarkGroup.encaGroupData()
    },
    handleClose() {
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="less" scoped>
.remarks-content-popover {
  display: flex;
  flex-direction: column;
  text-align: center;
  .title {
    font-weight: 600;
    color: #333;
    font-size: 18px;
  }
  .remarks-eg {
    font-size: 14px;
    font-weight: 400;
    color: rgba(69, 90, 100, 1);
  }
}
/deep/.remarkGroupList-dialog {
  border: 1px solid rgba(154, 170, 180, 0.2);
  padding: 10px 20px;
  width: 270px;
  margin: 20px auto;
  text-align: left;
  font-size: 14px;
  color: #999;
  font-weight: 400;
  & .remarkGroupList-dialog-productName {
    display: flex;
    justify-content: space-between;
    & span {
      color: #333;
      font-weight: 500;
    }
  }
  & .remarkGroupList-dialog-groupList {
    margin: 10px 0;
  }
  & .remarkGroupList-dialog-groupName {
    display: block;
    line-height: 20px;
    padding-left: 5px;
  }
  & .remarkGroupList-dialog-label {
    margin: 10px 5px;
    border: 1px solid rgba(154, 170, 180, 0.2);
    padding: 5px 10px;
    border-radius: 4px;
  }
  & .active {
    border: 1px solid #fd7a3d;
    background: #ffd4cb;
    color: #fd7a3d;
  }
  .span-text {
    font-size: 14px;
    & i {
      font-size: 18px;
      padding: 0 3px;
    }
  }
  .submit {
    width: 230px;
    margin-top: 20px;
  }
}
.beverage-remarks-panal {
  height: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  box-shadow: 0 0 6px 0 rgba(154, 170, 180, 0.2);
  border-radius: 4px;
}
.beverage-remarks-content {
  height: 100%;
  background-color: #fff;
  padding: 20px;
  margin: 0 120px;
}
.el-button--text {
  color: rgba(24, 144, 255, 1) !important;
  min-width: 50px !important;
}
.el-button--primary {
  margin-top: 10px;
  background: rgba(255, 255, 255, 1) !important;
  border: 1px dashed rgba(24, 144, 255, 1);
  color: rgba(24, 144, 255, 1);
  font-size: 14px;
  height: 32px !important;
}
</style>
