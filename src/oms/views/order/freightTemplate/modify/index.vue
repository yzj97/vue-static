<template>
  <section>
    <div style="background-color: #fff;min-width: 800px;">
      <div style="padding: 20px;">
        <div class="context-class">
          <div class="head-class">
            <span v-show="newTemplateShow()">{{ $t('add') }}</span><!--新增-->
            <span v-show="!newTemplateShow()">{{ $t('common_update') }}</span><!--修改-->
            {{ $t('freight_formwork') }}<!--运费模板-->
          </div>
          <form role="form" class="form-class">
            <!-- 规则id，数据有id显示，没有不显示 -->
            <div class="form-group">
              <label class="control-label"><i style="color: #EF3838;margin-right: 5px;">*</i>{{ $t('template_name') }}</label><!--模板名称-->
              <div>
                <input
                  v-model="queryContent.templateName"
                  type="text"
                  name="templateName"
                  required
                  maxlength="40"
                  minlength="1"
                  @change="templateNameChanged()">
              </div>
            </div>
            <div class="lineDashed"/>
            <div class="form-group">
              <label class="control-label"><i style="color: #EF3838;margin-right: 5px;">*</i>{{ $t('common_merchant_name') }}</label><!--商家名称-->
              <div>
                <select
                  v-model="queryContent.merchantId"
                  name="merchantId"
                  @change="templateMerchantChanged()">
                  <option value="">{{ $t('common_choose_please') }}</option>
                  <option
                    v-for="obj in merchantList"
                    :key="obj.merchantId"
                    :value="obj.merchantId"
                    :label="obj.merchantName">{{ obj.merchantName }}</option>
                </select>
              </div>
            </div>

            <div class="lineDashed"/>

            <div class="form-group">
              <label class="control-label">
                <i style="color: #EF3838;margin-right: 5px;">*</i>{{ $t('is_it_free_from_mail') }}<!--是否免邮-->
              </label>
              <div>
                <label v-for="(item, index) in typeList" :key="index">
                  <input
                    v-model="queryContent.type"
                    :value="item.code"
                    :disabled="!newTemplateShow()"
                    type="radio"
                    name="freePostOption"
                    @click="clickChargeWay('type')"
                    @change="chooseChargeWay('type')"><i/>
                  {{ item.name }}
                </label>
              </div>
            </div>

            <div class="lineDashed"/>

            <div v-show="queryContent.type == TYPE_DEFINE">
              <div class="form-group">
                <label class="control-label"><i style="color: #EF3838;margin-right: 5px;">*</i>{{ $t('channel_mode') }}<!--渠道模式--></label>
                <div>
                  <label v-for="(item, index) in channelModeList" :key="index">
                    <input
                      :value="item"
                      :checked="checkedChannelMode(item)"
                      :disabled="!newTemplateShow() || disableChannelMode(item)"
                      type="checkbox"
                      name="channelModeOption"
                      @click="clickChannelMode(item)"><i/>
                    {{ item }}
                  </label>
                  <span class="err-msg-div">
                    {{ queryContentErrMsg.saveChannelModeErrMsg }}
                  </span>
                </div>
              </div>
              <div class="lineDashed"/>

              <div class="form-group">
                <label class="control-label"><i style="color: #EF3838;margin-right: 5px;">*</i>{{ $t('billing_method') }}<!--计费方式--></label>
                <div>
                  <label v-for="(item, index) in codes.CHARGE_WAYS" :key="index">
                    <input
                      v-model="queryContent.chargeWay"
                      :value="item.code"
                      :disabled="!newTemplateShow() || disableChargeWay(item)"
                      type="radio"
                      name="billingOption"
                      @click="clickChargeWay('chargeWay')"
                      @change="chooseChargeWay('chargeWay')"><i/>
                    {{ item.name }}
                  </label>

                </div>
              </div>
              <div class="lineDashed"/>
            </div>

            <div class="form-group">
              <label class="control-label"><i style="color: #EF3838;margin-right: 5px;">*</i>{{ $t('distribution_mode') }}<!--配送方式--></label>
              <div>
                {{ $t('in_addition_to_the_designated_area') }},{{ $t('freight_used_in_the_rest_of_the_region') }}"{{ $t('default_freight') }}"<!--除指定地区外，其余地区的运费采用“默认运费”-->
                <span style="color: red;font-size: 12px;">{{ $t('the_selection_of_the_distribution_mode_of_customers_can_be_selected') }}<!--（勾选的配送方式客户才可选用）--></span>
              </div>
              <div class="err-msg-div">
                <span>{{ queryContentErrMsg.selectedDeliveryListErrMsg }}</span>
              </div>

              <div class="delivery-method-class">
                <!-- 配送方式选择 -->
                <div v-for="(item, index) in selectedDeliveryList" :key="index">
                  <div>
                    <label>
                      <input
                        v-model="item.available"
                        name="item_available"
                        type="checkbox"
                        @change="selectedDeliveryChanged(item, 1, item.available)">
                      <i/>
                      {{ item.shipPingName }}
                    </label>
                  </div>
                  <div v-show="deliverTemplateItemShow(item)" class="panel-table-class">
                    <!-- Default panel contents -->
                    <div class="panel-heading">
                      <div class="form-inline">
                        <div class="form-group">
                          <label>{{ $t('default_freight') }}<!--默认运费-->：</label>
                          {{ getDeliveryTemplateItemDesc(0) }}
                        </div>
                        <div class="form-group">
                          <input
                            v-model="item.freightTemplateItemDefault.underUnit"
                            type="text"
                            style="width: 80px;"
                            name="underUnit"
                            placeholder="0"
                            maxlength="10"
                            minlength="1"
                            required
                            class="num-input"
                            @input="getNumber(item.freightTemplateItemDefault, 'underUnit')"
                            @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                        </div>
                        <div class="form-group">
                          {{ getDeliveryTemplateItemDesc(1) }}
                        </div>
                        <div class="form-group">
                          <input
                            v-model="item.freightTemplateItemDefault.underUnitCost"
                            type="text"
                            style="width: 80px;"
                            name="underUnitCost"
                            placeholder="0"
                            maxlength="10"
                            minlength="1"
                            required
                            class="num-input"
                            @input="getNumber(item.freightTemplateItemDefault, 'underUnitCost')"
                            @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                        </div>
                        <div class="form-group">
                          {{ getDeliveryTemplateItemDesc(2) }}
                        </div>
                        <div class="form-group">
                          <input
                            v-model="item.freightTemplateItemDefault.perUnit"
                            type="text"
                            style="width: 80px;"
                            name="perUnit"
                            placeholder="0"
                            maxlength="10"
                            minlength="1"
                            required
                            class="num-input"
                            @input="getNumber(item.freightTemplateItemDefault, 'perUnit')"
                            @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                        </div>
                        <div class="form-group">
                          {{ getDeliveryTemplateItemDesc(3) }}
                        </div>
                        <div class="form-group">
                          <input
                            v-model="item.freightTemplateItemDefault.perUnitCost"
                            type="text"
                            style="width: 80px;"
                            name="perUnitCost"
                            placeholder="0"
                            maxlength="10"
                            minlength="1"
                            required
                            class="num-input"
                            @input="getNumber(item.freightTemplateItemDefault, 'perUnitCost')"
                            @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                        </div>
                        <div class="form-group">
                          {{ getDeliveryTemplateItemDesc(4) }}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style="width:100%;">
                        <table v-if="item.freightTemplateItemList.length > 0" class="table-class" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #eaf0f0;">
                          <thead>
                            <tr>
                              <th>{{ $t('transport_to') }}<!--运送到--></th>
                              <th>{{ getDeliveryTemplateItemTh('underUnit') }}</th>
                              <th>{{ getDeliveryTemplateItemTh('underUnitCost') }}
                              </th>
                              <th>{{ getDeliveryTemplateItemTh('perUnit') }}</th>
                              <th>
                                {{ getDeliveryTemplateItemTh('perUnitCost') }}
                              </th>
                              <th>{{ $t('common_operate') }}<!--操作--></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(d, index) in item.freightTemplateItemList" :key="index" valign="middle">
                              <td>
                                <div class="area-display" style="display: inline-block;">
                                  <span v-for="(f, index) in d.distributionRegions" :key="index">
                                    <span v-if="f.selectAll">{{ f.name }}</span>
                                    <span v-for="(g, index) in f.children" v-show="!f.selectAll" :key="index">
                                      <span v-if="g.selectAll">{{ g.name }}</span>
                                      <span v-for="(h, index) in g.children" v-show="!g.selectAll" :key="index">
                                        {{ h.name }}
                                      </span>
                                    </span>
                                  </span>
                                </div>
                                <div style="display: inline-block;">
                                  <a v-if="$portal.hasPermission('OmsFreightTemplateListEditArea')" name="selectAreaModalShow" @click="selectAreaModalShow(item, d)">{{ $t('common_edit') }}<!--编辑--></a>
                                </div>
                              </td>
                              <td>
                                {{ getDeliveryTemplateItemTd('underUnit') }}
                                <input
                                  v-model="d.underUnit"
                                  name="d_underUnit"
                                  type="text"
                                  placeholder="0"
                                  class="num-input"
                                  @input="getNumber(d, 'underUnit')"
                                  @change="deliveryTemplateItemChanged(d)">
                              </td>
                              <td>
                                {{ getDeliveryTemplateItemTd('underUnitCost') }}
                                <input
                                  v-model="d.underUnitCost"
                                  name="d_underUnitCost"
                                  type="text"
                                  placeholder="0"
                                  class="num-input"
                                  @input="getNumber(d, 'underUnitCost')"
                                  @change="deliveryTemplateItemChanged(d)">
                              </td>
                              <td>
                                {{ getDeliveryTemplateItemTd('perUnit') }}
                                <input
                                  v-model="d.perUnit"
                                  name="d_perUnit"
                                  type="text"
                                  placeholder="0"
                                  class="num-input"
                                  @input="getNumber(d, 'perUnit')"
                                  @change="deliveryTemplateItemChanged(d)">
                              </td>
                              <td>
                                {{ getDeliveryTemplateItemTd('perUnitCost') }}
                                <input
                                  v-model="d.perUnitCost"
                                  name="d_perUnitCost"
                                  type="text"
                                  placeholder="0"
                                  class="num-input"
                                  @input="getNumber(d, 'perUnitCost')"
                                  @change="deliveryTemplateItemChanged(d)">
                              </td>
                              <td>
                                <a v-if="$portal.hasPermission('OmsFreightTemplateListRemoveFreightTemplateItem')" name="removeFreightTemplateItem" @click="removeFreightTemplateItem(item, index)">{{ $t('common_delete') }}<!--删除--></a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="panel-footer">
                      <ody-button name="OmsFreightTemplateListSetAreaFre_selectAreaModalShow" size="mini" code="OmsFreightTemplateListSetAreaFreight" @click="selectAreaModalShow(item, null, 1)">{{ $t('setting_freight_for_the_designated_area') }}</ody-button>
                      <!--<a name="selectAreaModalShow9" @click="selectAreaModalShow(item, null, 1)">{{ $t('为指定区域设置运费') }}&lt;!&ndash;为指定区域设置运费&ndash;&gt;</a>-->
                    </div>
                  </div>

                  <div v-show="deliverTemplateItemO2OShow(item) && (queryContent.chargeWay == CHARGE_WAYS_O2O_LADDER || queryContent.chargeWay == CHARGE_WAYS_O2O_FIX)">
                    <div class="panel-table-class" style="padding-top: 15px;">
                      <div style="margin-bottom: 15px;width: 100%">
                        <label class="control-label">{{ $t('default_freight') }}:</label><!-- 默认运费 -->
                        <div class="form-inline">
                          <div class="form-group">
                            <input
                              v-model="item.freightTemplateItemDefault.defaultPrice"
                              type="text"
                              name="defaultPrice"
                              maxlength="10"
                              minlength="1"
                              required
                              class="num-input"
                              @input="getNumber(item.freightTemplateItemDefault, 'defaultPrice')"
                              @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                          </div>
                          <div class="form-group">{{ $t('labelYuan') }}</div>
                          <span v-if="deliverTemplateItemO2OShow(item) && queryContent.chargeWay == CHARGE_WAYS_O2O_LADDER">
                            <label>{{ $t('默认距离') }}:</label><!-- 默认距离 -->
                            <div class="form-group">
                              <input
                                v-model="item.freightTemplateItemDefault.defaultDistance"
                                type="text"
                                name="defaultDistance"
                                maxlength="10"
                                minlength="1"
                                required
                                class="num-input"
                                @input="getNumber(item.freightTemplateItemDefault, 'defaultDistance')"
                                @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                            </div>
                            <div class="form-group">KM</div>
                            <label>{{ $t('every_increase') }}:</label><!-- 每增加 -->
                            <div class="form-group">
                              <input
                                v-model="item.freightTemplateItemDefault.addDistance"
                                type="text"
                                name="addDistance"
                                maxlength="10"
                                minlength="1"
                                required
                                class="num-input"
                                @input="getNumber(item.freightTemplateItemDefault, 'addDistance')"
                                @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                            </div>
                            <div class="form-group">KM</div>

                            <label>{{ $t('运费增加') }}:</label><!-- 运费增加 -->
                            <div class="form-group">
                              <input
                                v-model="item.freightTemplateItemDefault.addDisPrice"
                                type="text"
                                name="addDisPrice"
                                maxlength="10"
                                minlength="1"
                                required
                                class="num-input"
                                @input="getNumber(item.freightTemplateItemDefault, 'addDisPrice')"
                                @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                            </div>
                            <div class="form-group">{{ $t('labelYuan') }}</div><!-- 元 -->
                          </span>
                        </div>
                      </div>
                      <div class="lineDashed"/>
                      <div style="min-height: 50px" class="form-inline">
                        <label class="control-label" style="display: block;margin-bottom: 10px;">{{ $t('附加运费计费规则') }}：</label><!-- 附加运费计费规则 -->
                        <div>
                          <label style="display: block;margin-bottom: 10px;">
                            <input
                              v-model="item.freightTemplateItemDefault.onWeight"
                              type="checkbox"
                              name="onWeight"
                              @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                            <i/>
                            {{ $t('开启重量设置') }}
                          </label><!-- 开启重量设置 -->
                          <label v-show="item.freightTemplateItemDefault.onWeight">
                            <label>{{ $t('默认重量') }}:</label><!-- 默认重量 -->
                            <div class="form-group">
                              <input
                                v-model="item.freightTemplateItemDefault.defaultWeight"
                                type="text"
                                name="defaultWeight"
                                maxlength="10"
                                minlength="1"
                                class="num-input"
                                @input="getNumber(item.freightTemplateItemDefault, 'defaultWeight')"
                                @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                            </div>
                            <div class="form-group">g</div>
                            <label v-if="!item.freightTemplateItemDefault.onUpAdd">{{ $t('重量超过') }}:</label><!-- 重量超过 -->
                            <label v-if="item.freightTemplateItemDefault.onUpAdd">{{ $t('重量每增加') }}:</label><!-- 重量每增加 -->
                            <div class="form-group">
                              <input
                                v-if="item.freightTemplateItemDefault.onUpAdd"
                                v-model="item.freightTemplateItemDefault.addWeight"
                                type="text"
                                name="addWeight"
                                maxlength="10"
                                minlength="1"
                                class="num-input"
                                @input="getNumber(item.freightTemplateItemDefault, 'addWeight')"
                                @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                              <label v-if="!item.freightTemplateItemDefault.onUpAdd">{{ item.freightTemplateItemDefault.defaultWeight }}</label>
                            </div>
                            <div class="form-group">g</div>

                            <label>{{ $t('加价') }}:</label><!-- 加价 -->
                            <div class="form-group">
                              <input
                                v-model="item.freightTemplateItemDefault.addWeightPrice"
                                type="text"
                                name="addWeightPrice"
                                maxlength="10"
                                minlength="1"
                                class="num-input"
                                @input="getNumber(item.freightTemplateItemDefault, 'addWeightPrice')"
                                @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)">
                            </div>
                            <div class="form-group">{{ $t('labelYuan') }}</div><!-- 元 -->
                            <label>
                              <input
                                v-model="item.freightTemplateItemDefault.onUpAdd"
                                type="checkbox"
                                name="onUpAdd"
                                @change="deliveryTemplateItemChanged(item.freightTemplateItemDefault)"><i/>
                              {{ $t('累进计算') }}<!-- 累进计算 -->
                            </label>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-show="shippingFreeItemShow()">
                  <div>
                    <div>
                      <label>
                        <input
                          v-model="shippingFreeItem.available"
                          name="shippingFreeItem_available"
                          type="checkbox"
                          @change="selectedDeliveryChanged(shippingFreeItem.freightTemplateItemList, 2, shippingFreeItem.available)"><i/>
                        {{ $t('specified_conditions_package') }}<!--指定条件包邮-->
                      </label>
                    </div>
                  </div>
                  <div v-show="deliverTemplateItemShow(shippingFreeItem)" class="panel-table-class">
                    <!-- Default panel contents -->
                    <div>
                      <div style="width:100%;overflow-x: auto;overflow-y: hidden;">
                        <table class="table-class" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #eaf0f0;">
                          <thead>
                            <tr>
                              <th>{{ $t('选择地区') }}<!--选择地区--></th>
                              <th>{{ $t('choice_of_distribution_mode') }}<!--选择配送方式--></th>
                              <th>{{ $t('postal_conditions') }}<!--包邮条件--></th>
                              <th>{{ $t('common_operate') }}<!--操作--></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(d, index) in shippingFreeItem.freightTemplateItemList" :key="index" valign="middle">
                              <td>
                                <div class="area-display" style="display: inline-block;">
                                  <span v-for="(f, index) in d.distributionRegions" :key="index">
                                    <span v-if="f.selectAll">{{ f.name }}</span>
                                    <span v-for="(g, index) in f.children" v-show="!f.selectAll" :key="index">
                                      <span v-if="g.selectAll">{{ g.name }}</span>
                                      <span v-for="(h, index) in g.children" v-show="!g.selectAll" :key="index">
                                        {{ h.name }}
                                      </span>
                                    </span>
                                  </span>
                                </div>
                                <div style="display: inline-block;">
                                  <a v-if="$portal.hasPermission('OmsFreightTemplateListShippingFreeEdit')" name="selectAreaModalShow0" @click="selectAreaModalShow(shippingFreeItem, d)">{{ $t('common_edit') }}<!--编辑--></a>
                                  <a v-if="$portal.hasPermission('OmsFreightTemplateListShippingFreeSet')" name="setToDefaultArea" style="margin-left:10px;" @click="setToDefaultArea(d)">{{ $t('set_up_as_the_whole_country') }}<!--设为全国--></a>
                                </div>
                              </td>
                              <td>
                                <select
                                  v-model="d.distributionCode"
                                  name="d_distributionCode"
                                  @change="deliveryTemplateItemChanged(d)">
                                  <option
                                    v-for="(value, key) in getAvailableDeliveryList()"
                                    :key="value"
                                    :value="value"
                                    :label="key">{{ key }}</option>
                                </select>
                              </td>
                              <td style="text-align: center;">
                                <div>
                                  <select
                                    v-if="queryContent.chargeWay == CHARGE_WAYS_BASIC_NUM"
                                    v-model="d.chargeWay"
                                    name="d_chargeWay"
                                    @change="d.underUnit=0; d.underUnitCost=0;deliveryTemplateItemChanged(d);">
                                    <option
                                      v-for="o in codes.FREE_SHIPPING_CONDITION_10"
                                      :key="o.code"
                                      :value="o.code"
                                      :label="o.name">{{ o.name }}</option>
                                  </select>
                                  <select
                                    v-if="queryContent.chargeWay == CHARGE_WAYS_BASIC_WEIGHT"
                                    v-model="d.chargeWay"
                                    name="d_chargeWay4"
                                    @change="d.underUnit=0; d.underUnitCost=0;deliveryTemplateItemChanged(d);">
                                    <option
                                      v-for="o in codes.FREE_SHIPPING_CONDITION_11"
                                      :key="o.code"
                                      :value="o.code"
                                      :label="o.name">{{ o.name }}</option>
                                  </select>
                                  <select
                                    v-if="queryContent.chargeWay == CHARGE_WAYS_BASIC_VOLUME"
                                    v-model="d.chargeWay"
                                    name="d_chargeWay0"
                                    @change="d.underUnit=0; d.underUnitCost=0;deliveryTemplateItemChanged(d);">
                                    <option
                                      v-for="o in codes.FREE_SHIPPING_CONDITION_12"
                                      :key="o.code"
                                      :value="o.code"
                                      :label="o.name">{{ o.name }}</option>
                                  </select>
                                </div>
                                <div>
                                  {{ getFreeShippingDesc(d, 0) }}
                                  <input
                                    v-show="getFreeShippingInputShow(d, 0)"
                                    v-model="d.underUnit"
                                    name="d_underUnit4"
                                    type="text"
                                    style="width: 80px;"
                                    placeholder="0"
                                    @input="getNumber(d, 'underUnit')"
                                    @change="deliveryTemplateItemChanged(d)">{{ getFreeShippingDesc(d, 1) }}
                                  <input
                                    v-show="getFreeShippingInputShow(d, 1)"
                                    v-model="d.underUnitCost"
                                    name="d_underUnitCost3"
                                    type="text"
                                    style="width: 80px;"
                                    placeholder="0"
                                    @input="getNumber(d, 'underUnitCost')"
                                    @change="deliveryTemplateItemChanged(d)">{{ getFreeShippingDesc(d, 2) }}
                                </div>
                              </td>
                              <td>
                                <a v-if="$portal.hasPermission('OmsFreightTemplateListShippingFreeDelete')" name="removeFreightTemplateItem5" @click="removeFreightTemplateItem(shippingFreeItem, index)">{{ $t('common_delete') }}<!--删除--></a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <span style="padding-left: 10px;color: red;font-size: 12px;">{{ queryContentErrMsg.shippingFreeItemErrMsg }}</span>
                    <div class="panel-footer">
                      <ody-button name="OmsFreightTemplateListShippingFreeAdd_addShippingFreeRule" size="mini" code="OmsFreightTemplateListShippingFreeAdd" @click="addShippingFreeRule(shippingFreeItem, 2)">{{ $t('add') }}</ody-button>
                      <!--<a name="addShippingFreeRule" @click="addShippingFreeRule(shippingFreeItem, 2)">{{ $t('新增') }}&lt;!&ndash;新增&ndash;&gt;</a>-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="lineDashed"/>
            <div class="form-group">
              <div class="save-but-class">
                <ody-button name="OmsFreightTemplateList_Save_saveTemplate" code="OmsFreightTemplateList_Save" size="mini" type="primary" @click="saveTemplate()">{{ $t('save_and_return') }}</ody-button><!--保存并返回-->
                <el-button name="cancelSave" size="mini" @click="cancelSave()">{{ $t('common_cancel') }}<!--取消--></el-button>
                <!--<span style="color: red;font-size: 12px;text-align: center;">
                  {{ queryContentErrMsg.saveErrMsg }}
                </span>-->
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <ody-dialog
      :visible.sync="showAreaModal"
      :title="$t('region_setting')"
      width="70%">
      <section>
        <div class="modal">
          <div class="modal-body">
            <form>
              <div id="multiCity" class="checkbox-inline">
                <div v-for="(item, index) in provinceList" :key="index">
                  <ul v-if="(index + 1) % 4 == 0 || (provinceList.length == (index + 1))">
                    <li v-if="(index + 1) % 4 + 3 < 4" :id="'area' + provinceList[index - 3].code" class="lev0">
                      <div>
                        <label>
                          <input v-model="provinceList[index - 3].selected" name="provinceList[index - 3]_selected" type="checkbox" @change="selectMeAndSubItem(provinceList[index - 3])">
                          {{ provinceList[index - 3].name }}
                          <i v-if="provinceList[index - 3].selected && !provinceList[index - 3].selectAll" class="red-tip">
                            {{ $t('(not_all)') }}<!--(未全选)-->
                          </i>
                        </label>
                        <span name="expandEvent" @click="expandEvent(provinceList[index - 3], provinceList)">{{ (provinceList[index - 3].expanded) ? "-" : "+" }}</span>
                      </div>
                    </li>
                    <li v-if="(index + 1) % 4 + 2 < 4" :id="'area' + provinceList[index - 2].code" class="lev0">
                      <div>
                        <label>
                          <input v-model="provinceList[index - 2].selected" name="provinceList[index - 2]_selected" type="checkbox" @change="selectMeAndSubItem(provinceList[index - 2])"> {{ provinceList[index - 2].name }}
                          <i v-if="provinceList[index - 2].selected && !provinceList[index - 2].selectAll" class="red-tip">
                            {{ $t('(not_all)') }}<!--(未全选)-->
                          </i>
                        </label>
                        <span name="expandEvent7" @click="expandEvent(provinceList[index - 2], provinceList)">{{ (provinceList[index - 2].expanded) ? "-" : "+" }}</span>
                      </div>
                    </li>
                    <li v-if="(index + 1) % 4 + 1 < 4" :id="'area' + provinceList[index - 1].code" class="lev0">
                      <div>
                        <label>
                          <input v-model="provinceList[index - 1].selected" name="provinceList[index - 1]_selected" type="checkbox" @change="selectMeAndSubItem(provinceList[index - 1])"> {{ provinceList[index - 1].name }}
                          <i v-if="provinceList[index - 1].selected && !provinceList[index - 1].selectAll" class="red-tip">
                            {{ $t('(not_all)') }}<!--(未全选)-->
                          </i>
                        </label>
                        <span name="expandEvent74" @click="expandEvent(provinceList[index - 1], provinceList)">{{ (provinceList[index - 1].expanded) ? "-" : "+" }}
                        </span>
                      </div>
                    </li>
                    <li v-if="(index + 1) % 4 < 4" :id="'area' + provinceList[index].code" class="lev0">
                      <div>
                        <label>
                          <input v-model="provinceList[index].selected" name="provinceList[index]_selected" type="checkbox" @change="selectMeAndSubItem(provinceList[index])"> {{ provinceList[index].name }}
                          <i v-if="provinceList[index].selected && !provinceList[index].selectAll" class="red-tip">
                            {{ $t('(not_all)') }}<!--(未全选)-->
                          </i>
                        </label>
                        <span name="expandEvent3" @click="expandEvent(provinceList[index], provinceList)">{{ (provinceList[index].expanded) ? "-" : "+" }}
                        </span>
                      </div>
                    </li>
                  </ul>
                  <div v-if="(index + 1) % 4 == 0 || (provinceList.length == (index + 1))">
                    <ul v-if="(index + 1) % 4 + 3 < 4" :class="provinceList[index - 3].code + ' children'" style="display: none;">
                      <div v-for="(d1, index) in provinceList[index - 3].children" :key="index" class="area-div">
                        <div class="col-xs-3">
                          <li :id="'area' + d1.code" class="lev1 checkbox">
                            <div class="checkbox">
                              <label>
                                <input v-model="d1.selected" name="d1_selected" type="checkbox" @change="selectMeAndSubItem(d1)">{{ d1.name }}
                              </label>
                            </div>
                          </li>
                        </div>
                        <div class="col-xs-9">
                          <ul class="children2">
                            <li v-for="(f1, index) in d1.children" :id="'area' + f1.code" :key="index" class="lev2 checkbox-inline">
                              <div class="checkbox">
                                <label><input v-model="f1.selected" name="f1_selected" type="checkbox" @change="selectMeAndSubItem(f1)">{{ f1.name }}</label>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </ul>
                    <ul v-if="(index + 1) % 4 + 2 < 4" :class="provinceList[index - 2].code + ' children'" style="display: none;">
                      <div v-for="(d2, index) in provinceList[index - 2].children" :key="index" class="area-div">
                        <div class="col-xs-3">
                          <li :id="'area' + d2.code" class="lev1 checkbox">
                            <div class="checkbox">
                              <label>
                                <input v-model="d2.selected" name="d2_selected" type="checkbox" @change="selectMeAndSubItem(d2)">{{ d2.name }}
                              </label>
                            </div>
                          </li>
                        </div>
                        <div class="col-xs-9">
                          <ul class="children2">
                            <li v-for="(f2, index) in d2.children" :id="'area' + f2.code" :key="index" class="lev2 checkbox-inline">
                              <div class="checkbox">
                                <label><input v-model="f2.selected" name="f2_selected" type="checkbox" @change="selectMeAndSubItem(f2)">{{ f2.name }}</label>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </ul>
                    <ul v-if="(index + 1) % 4 + 1 < 4" :class="provinceList[index - 1].code + ' children'" style="display: none;">
                      <div v-for="(d3, index) in provinceList[index - 1].children" :key="index" class="area-div">
                        <div class="col-xs-3">
                          <li :id="'area' + d3.code" class="lev1 checkbox">
                            <div class="checkbox">
                              <label>
                                <input v-model="d3.selected" name="d3_selected" type="checkbox" @change="selectMeAndSubItem(d3)">{{ d3.name }}
                              </label>
                            </div>
                          </li>
                        </div>
                        <div class="col-xs-9">
                          <ul class="children2">
                            <li v-for="(f3, index) in d3.children" :id="'area' + f3.code" :key="index" class="lev2 checkbox-inline">
                              <div class="checkbox">
                                <label><input v-model="f3.selected" name="f3_selected" type="checkbox" @change="selectMeAndSubItem(f3)">{{ f3.name }}</label>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </ul>
                    <ul v-if="(index + 1) % 4 < 4" :class="provinceList[index].code + ' children'" style="display: none;">
                      <div v-for="(d4, index) in provinceList[index].children" :key="index" class="area-div">
                        <div class="col-xs-3">
                          <li :id="'area' + d4.code" class="lev1 checkbox">
                            <div class="checkbox">
                              <label>
                                <input v-model="d4.selected" name="d4_selected" type="checkbox" @change="selectMeAndSubItem(d4)">{{ d4.name }}
                              </label>
                            </div>
                          </li>
                        </div>
                        <div class="col-xs-9">
                          <ul class="children2">
                            <li v-for="(f4, index) in d4.children" :id="'area' + f4.code" :key="index" class="lev2 checkbox-inline">
                              <div class="checkbox">
                                <label><input v-model="f4.selected" name="f4_selected" type="checkbox" @change="selectMeAndSubItem(f4)">{{ f4.name }}</label>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
            <span style="color: red;font-size: 12px;">{{ selectRegionForTemplateErrMsg.noSelected }}</span>
          </div>
          <div class="modal-footer">
            <el-button name="selectRegionForTemplate" size="mini" type="primary" @click="selectRegionForTemplate()">{{ $t('confirm') }}</el-button>
            <el-button name="cancelSelectRegion" size="mini" @click="cancelSelectRegion()">{{ $t('common_cancel') }}</el-button>
          </div>
        </div>
      </section>
    </ody-dialog>
  </section>
</template>

<script>
var vm = null
export default {
  name: 'OmsFreightTemplateModify',
  data() {
    return {
      showAreaModal: false,
      TYPE_DEFINE: '10', // 自定义运费
      TYPE_MERCHANT: '11', // 卖家承担运费
      CHARGE_WAYS_BASIC_NUM: '10', // 按件数
      CHARGE_WAYS_BASIC_WEIGHT: '11', // 按重量
      CHARGE_WAYS_BASIC_VOLUME: '12', // 按体积
      CHARGE_WAYS_O2O_FIX: '200', // 配送区域固定设置配送运费(O2O)
      CHARGE_WAYS_O2O_LADDER: '201', // 按距离阶梯设置配送运费(O2O)
      CHANNEL_MODE_O2O: 'O+O', // 渠道模式O2O
      CHANNEL_MODE_POS: 'POS', // 渠道模式POS
      typeList: [
        {
          'code': '10',
          'name': this.$t('custom_freight')
        },
        {
          'code': '11',
          'name': this.$t('seller_bears_freight')
        }
      ],
      shippingFreeItem: {
        available: null
      },
      selectedDeliveryList: [],
      channelModeList: [], // 所有的渠道模式列表
      selectedChannelModeList: [], // 选中的渠道模式列表
      freightTemplateId: null, // 模板id
      queryContent: { // 模板详情
        templateName: null,
        merchantId: null,
        type: '10',
        chargeWay: '10'
        // deliverTemplateItemList: this.selectedDeliveryList
        // shippingFreeDeliverTemplateItem: this.shippingFreeItem
      },
      queryDeliveryPageContent: {}, // 配送方式查询
      deliveryList: [], // 配送方式返回启用的list
      deliveryListAll: [], // 配送方式返回所有的list
      provinceList: [],
      provinceListData: [],
      provinceListByLevel: {},
      currentOperateNode: null,
      selectRegionForTemplateErrMsg: {},
      deliveryTemplateItemText: [ // 初始化不同配送方式下的文本显示
        {
          'chargeWay': '10',
          'underUnit': { 'th': this.$t('number_of_items') + '(' + this.$t('piece') + ')', 'td': '' },
          'underUnitCost': { 'th': this.$t('the_first_fee') + '(' + this.$t('labelYuan') + ')', 'td': '' },
          'perUnit': { 'th': this.$t('number_of_options') + '(' + this.$t('piece') + ')', 'td': '' },
          'perUnitCost': { 'th': this.$t('续费') + '(' + this.$t('labelYuan') + ')', 'td': '' },
          'desc': this.$t('within1') + '[input]' + this.$t('piece') + this.$t('within2') + ',[input]' + this.$t('labelYuan') + ',' + this.$t('每增加') + '[input]' + this.$t('piece') + ',' + this.$t('增加运费') + '[input]' + this.$t('labelYuan')
        },
        {
          'chargeWay': '11',
          'underUnit': { 'th': this.$t('the_first_heavy') + '(g)', 'td': '' },
          'underUnitCost': { 'th': this.$t('the_first_fee') + '(' + this.$t('labelYuan') + ')', 'td': '' },
          'perUnit': { 'th': this.$t('continued_heavy') + '(g)', 'td': '' },
          'perUnitCost': { 'th': this.$t('续费') + '(' + this.$t('labelYuan') + ')', 'td': '' },
          'desc': this.$t('within1') + '[input]g' + this.$t('within2') + ',[input]' + this.$t('labelYuan') + ',' + this.$t('每增加') + '[input]g,' + this.$t('增加运费') + '[input]' + this.$t('labelYuan')
        },
        {
          'chargeWay': '12',
          'underUnit': { 'th': this.$t('first_volume') + '(cm³)', 'td': '' },
          'underUnitCost': { 'th': this.$t('the_first_fee') + '(' + this.$t('labelYuan') + ')', 'td': '' },
          'perUnit': { 'th': this.$t('continuous_volume') + '(cm³)', 'td': '' },
          'perUnitCost': { 'th': this.$t('续费') + '(' + this.$t('labelYuan') + ')', 'td': '' },
          'desc': this.$t('within1') + '[input]cm³' + this.$t('within2') + ',[input]' + this.$t('labelYuan') + ',' + this.$t('每增加') + '[input]cm³,' + this.$t('增加运费') + '[input]' + this.$t('labelYuan')
        }
      ],
      freeShippingText: [
        {
          'chargeWay': '10',
          'desc': {
            '10': this.$t('full') + '[input]' + this.$t('piece') + this.$t('包邮'),
            '13': '[input]' + this.$t('full') + '[input]' + this.$t('labelYuan') + this.$t('包邮'),
            '21': this.$t('full') + '[input]' + this.$t('piece') + ',' + this.$t('full') + '[input]' + this.$t('labelYuan') + this.$t('包邮')
          },
          'input_show': { '10': '0', '13': '1', '21': '0,1' }
        },
        {
          'chargeWay': '11',
          'desc': {
            '11': this.$t('within1') + '[input]g' + this.$t('within2') + this.$t('包邮'),
            '13': '[input]' + this.$t('full') + '[input]' + this.$t('labelYuan') + this.$t('包邮'),
            '20': this.$t('within1') + '[input]g' + this.$t('within2') + ',' + this.$t('full') + '[input]' + this.$t('labelYuan') + this.$t('包邮')
          },
          'input_show': { '11': '0', '13': '1', '20': '0,1' }
        },
        {
          'chargeWay': '12',
          'desc': {
            '12': this.$t('within1') + '[input]cm³' + this.$t('within2') + this.$t('包邮'),
            '13': '[input]' + this.$t('full') + '[input]' + this.$t('labelYuan') + this.$t('包邮'),
            '22': this.$t('within1') + '[input]cm³' + this.$t('within2') + ',' + this.$t('full') + '[input]' + this.$t('labelYuan') + this.$t('包邮')
          },
          'input_show': { '12': '0', '13': '1', '22': '0,1' }
        }
      ],
      areaData: { isNewAreaItemNode: false },
      queryContentErrMsg: {},
      queryModifyContent: { // 修改模板详情
        insertFreightTemplateList: [],
        deleteFreightTemplateList: [],
        updateFreightTemplateList: []
      },
      templateTempId: 1,
      defaultRegion: [{ code: 0, name: this.$t('whole_country') + '(' + this.$t('default_value') + ')', selectAll: true }],
      tmpValue: null,
      codes: {},
      merchantList: []
    }
  },
  watch: {
    // selectedDeliveryList: {
    //   handler: function(newItem, oldItem) {
    //     console.log(newItem)
    //   },
    //   deep: true
    // }
  },
  created() {
    vm = this
    this.queryContent.deliverTemplateItemList = this.selectedDeliveryList
    this.queryContent.shippingFreeDeliverTemplateItem = this.shippingFreeItem
  },
  mounted() {
    vm = this
    this.freightTemplateId = this.$route.params.freightTemplateId
    this.queryContent.deliverTemplateItemList = this.selectedDeliveryList
    this.queryContent.shippingFreeDeliverTemplateItem = this.shippingFreeItem
    this.init()
  },
  methods: {
    init() {
      vm = this
      this.initCodes()
      this.getDeliveryPageQuery()
      this.queryMerchantList()
    },
    newTemplateShow() {
      if (this.freightTemplateId) {
        return false
      }
      return true
    },
    queryMerchantList() {
      this.$oms.$api.common.merchantList({ 'currentPage': 1, 'itemsPerPage': 1000 }).then((result) => {
        if (eq(result.code, '0')) {
          result.data.listObj.forEach(function(item) {
            vm.merchantList.push({
              'merchantId': item['merchantId'],
              'merchantName': item['merchantName'],
              'channelInfoList': item['channelInfoList']
            })
          })
          vm.setMerchantChannelMode()
        }
      })
    },
    queryDetail() {
      this.$oms.$api.freightTemplate.freightTemplateGet({ id: vm.freightTemplateId }).then((result) => {
        if (eq(result.code, '0')) {
          var isBasicType = false
          vm.queryContent = result.data
          vm.queryContent.chargeWay = result.data.chargeWay.toString()
          vm.queryContent.type = result.data.type.toString()

          vm.queryModifyContent['freightTemplateId'] = vm.queryContent['freightTemplateId']
          vm.queryModifyContent['templateName'] = vm.queryContent['templateName']
          vm.queryModifyContent['merchantId'] = vm.queryContent['merchantId']
          vm.selectedDeliveryList = vm.queryContent.deliverTemplateItemList

          vm.shippingFreeItem = vm.queryContent.shippingFreeDeliverTemplateItem

          if (result.data && result.data.channelMode) {
            vm.selectedChannelModeList = result.data.channelMode.split(',')
          }

          // 如果先加载了商家列表，设置模板
          vm.setMerchantChannelMode()

          if (vm.selectedDeliveryList == null) {
            vm.resetDeliveryListData()
          } else {
            for (var i = 0; i < vm.deliveryListAll.length; i++) {
              var isExist = false
              for (var j = 0; j < vm.selectedDeliveryList.length; j++) {
                if (eq(vm.selectedDeliveryList[j].distributionCode, vm.deliveryListAll[i].shippingCode)) {
                  vm.selectedDeliveryList[j].shipPingName = vm.deliveryListAll[i].shipPingName
                  isExist = true
                  var chargeWay = vm.queryContent.chargeWay + ''
                  if (eq(chargeWay, vm.CHARGE_WAYS_BASIC_NUM) || eq(chargeWay, vm.CHARGE_WAYS_BASIC_WEIGHT) || eq(chargeWay, vm.CHARGE_WAYS_BASIC_VOLUME)) {
                    isBasicType = true
                    vm.selectedDeliveryList[j].freightTemplateItemDefault.distributionRegions = vm.defaultRegion
                  }
                  break
                }
              }
              if (!isExist) {
                var tmpItem = {}
                tmpItem.distributionCode = vm.deliveryListAll[i]['shippingCode']
                tmpItem.shipPingName = vm.deliveryListAll[i]['shipPingName']
                tmpItem.freightTemplateItemDefault = {}
                tmpItem.freightTemplateItemDefault['templateTempId'] = vm.templateTempId++
                tmpItem.freightTemplateItemDefault['type'] = 1
                tmpItem.freightTemplateItemDefault['chargeWay'] = vm.queryContent['chargeWay']
                tmpItem.freightTemplateItemDefault['distributionCode'] = tmpItem.distributionCode
                tmpItem.freightTemplateItemDefault['distributionRegions'] = vm.defaultRegion
                tmpItem.freightTemplateItemList = []

                vm.selectedDeliveryList.splice(i, 0, tmpItem)
              }
            }
          }

          // 处理免邮数据
          if (vm.shippingFreeItem == null) {
            vm.resetShippingFreeItemData()
          } else if (vm.shippingFreeItem.freightTemplateItemList) {
            vm.shippingFreeItem.freightTemplateItemList.forEach(function(item) {
              item.chargeWay = item.chargeWay + ''
            })
          }

          if (isBasicType) {
            // 初始化区域设置
            vm.initDetailProvinceList()
          }
        } else {
          this.$message.error('发生错误')
          this.back()
        }
      })
    },
    getDeliveryPageQuery() {
      this.$oms.$api.distributionModeItem.distributionModeItemList({ }).then((result) => {
        if (eq(result.code, '0')) { // 获取数据成功
          vm.deliveryListAll = result.data
          if (vm.freightTemplateId != null) {
            vm.deliveryList = vm.deliveryListAll
          } else {
            result.data.forEach(function(item) {
              if (eq(item.isAvailable, 1)) {
                vm.deliveryList.push(item)
              }
            })
          }
          vm.loadProvinceList()
        }
      })
    },
    // 加载地区信息
    loadProvinceList() {
      this.$oms.$api.common.getAreaListNoPaging({ filters: { }}).then((result) => {
        vm.provinceListData = vm.formatAreaData(result['data'])
        if (vm.freightTemplateId != null) {
          vm.queryDetail()
        } else {
          vm.initDetailDefault()
        }
      })
    },
    // 新增模版默认初始化
    initDetailDefault() {
      // 初始化
      this.queryContent.type = vm.TYPE_DEFINE
      this.queryContent.chargeWay = vm.CHARGE_WAYS_BASIC_NUM
      this.resetDeliveryListData()
      this.resetShippingFreeItemData()
    },
    initDetailProvinceList() {
      // 区域处理
      var deliverTemplateItemList = this.selectedDeliveryList

      for (var i = 0; i < deliverTemplateItemList.length; i++) {
        const freightTemplateItemList = deliverTemplateItemList[i].freightTemplateItemList
        for (var j = 0; j < freightTemplateItemList.length; j++) {
          freightTemplateItemList[j].distributionRegions
          this.resolveProvinceRegions(freightTemplateItemList[j].distributionRegions, this.provinceListData, false)
        }
      }

      // 免邮区域处理
      var shippingFreeDeliverTemplateItem = this.shippingFreeItem
      if (shippingFreeDeliverTemplateItem.available) {
        const freightTemplateItemList = shippingFreeDeliverTemplateItem.freightTemplateItemList
        for (var k in freightTemplateItemList) {
          freightTemplateItemList[k].distributionRegions
          this.resolveProvinceRegions(freightTemplateItemList[k].distributionRegions, this.provinceListData, false)
        }
      }
    },
    // 区域解析处理
    resolveProvinceRegions(region, provinceList, needAll) {
      if (needAll) {
        for (const j in provinceList) {
          var tmpRegion = {}
          tmpRegion.code = provinceList[j].code
          tmpRegion.name = provinceList[j].name
          tmpRegion.parentcode = provinceList[j].parentcode
          tmpRegion.level = provinceList[j].level
          tmpRegion.selectAll = true
          tmpRegion.children = []
          this.resolveProvinceRegions(tmpRegion.children, provinceList[j].children, true)
          region.push(tmpRegion)
        }
        return
      }

      for (var i in region) {
        if (eq(this.defaultRegion[0].code, region[i].code)) {
          region[i].name = this.defaultRegion[0].name
          return
        }
        for (let j = 0; j < provinceList.length; j++) {
          if (eq(region[i].code, provinceList[j].code)) {
            region[i].name = provinceList[j].name
            region[i].level = provinceList[j].level
            if (region[i].selectAll) {
              region[i].children = []
              this.resolveProvinceRegions(region[i].children, provinceList[j].children, true)
            } else {
              this.resolveProvinceRegions(region[i].children, provinceList[j].children, false)
            }

            break
          }
        }
      }
    },
    // 重置模板数据
    resetDeliveryListData() {
      for (var i in this.deliveryList) {
        this.selectedDeliveryList[i] = { available: false }
        // this.selectedDeliveryList[i].selected = 0
        this.selectedDeliveryList[i].distributionCode = this.deliveryList[i]['shippingCode']
        this.selectedDeliveryList[i].shipPingName = this.deliveryList[i]['shipPingName']
        this.selectedDeliveryList[i].freightTemplateItemDefault = {}
        this.selectedDeliveryList[i].freightTemplateItemList = []
      }
    },
    // 重置免邮模板数据
    resetShippingFreeItemData() {
      this.shippingFreeItem = this.queryContent.shippingFreeDeliverTemplateItem = {}
      this.shippingFreeItem.freightTemplateItemList = []
    },
    clickChargeWay(eleName) {
      this.tmpValue = this.queryContent[eleName]
    },
    // 监听计费方式值的变化
    chooseChargeWay(eleName) {
      // 判断是否有数据
      if (this.shippingFreeItem.available) {
        this.$confirm(this.$t('the_modification_of_the_billing_method_will_affect_the_cost_of_the_goods_in_the_order') + '!' + this.$t('whether_to_continue') + '?', this.$t('prompt'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          vm.handleConfirm(eleName, true)
        }).catch(() => {
          vm.handleConfirm(eleName, false)
        })
      } else {
        for (var i in this.selectedDeliveryList) {
          if (this.selectedDeliveryList[i].available) {
            this.$confirm(this.$t('the_modification_of_the_billing_method_will_affect_the_cost_of_the_goods_in_the_order') + '!' + this.$t('whether_to_continue') + '?', this.$t('prompt'), {
              confirmButtonText: this.$t('ok'),
              cancelButtonText: this.$t('cancel'),
              type: 'warning'
            }).then(() => {
              vm.handleConfirm(eleName, true)
            }).catch(() => {
              vm.handleConfirm(eleName, false)
            })
            break
          }
        }
      }
    },
    handleConfirm(eleName, result) {
      if (result) {
        // 重置数据
        vm.resetDeliveryListData()
        vm.resetShippingFreeItemData()
        return
      }
      vm.queryContent[eleName] = vm.tmpValue
      vm.tmpValue = null
      // setTimeout(function() {
      //   vm.$apply(function() {
      //     vm.queryContent[eleName] = vm.tmpValue
      //     vm.tmpValue = null
      //   })
      // }, 1)
    },
    // 选择渠道
    clickChannelMode(item) {
      if (vm.selectedChannelModeList.indexOf(item) >= 0) {
        vm.selectedChannelModeList.splice(vm.selectedChannelModeList.indexOf(item), 1)
      } else {
        vm.selectedChannelModeList.push(item)
        if (eq(item, vm.CHANNEL_MODE_O2O) && (!eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_O2O_FIX) && !eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_O2O_LADDER))) {
          this.queryContent.chargeWay = vm.CHARGE_WAYS_O2O_FIX
        }
        if (!eq(item, vm.CHANNEL_MODE_O2O) && (eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_O2O_FIX) || eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_O2O_LADDER))) {
          this.queryContent.chargeWay = vm.CHARGE_WAYS_BASIC_NUM
        }
      }
      if (this.queryContentErrMsg['saveChannelModeErrMsg']) {
        this.queryContentErrMsg['saveChannelModeErrMsg'] = ''
      }
    },
    // 是否选中渠道模式
    checkedChannelMode(item) {
      for (var i = 0; i < vm.selectedChannelModeList.length; i++) {
        if (eq(vm.selectedChannelModeList[i], item)) {
          return true
        }
      }
      return false
    },
    // 判断渠道是否应该disable
    disableChannelMode(item) {
      if (vm.selectedChannelModeList.length === 0) {
        return false
      }
      if (vm.selectedChannelModeList.indexOf(vm.CHANNEL_MODE_O2O) >= 0) {
        if (eq(item, vm.CHANNEL_MODE_O2O)) {
          return false
        }
        return true
      } else {
        if (eq(item, vm.CHANNEL_MODE_O2O)) {
          return true
        }
        return false
      }
    },
    // 选中配送方式、在自定义运费和计费方式为件数/重量/体积的情况下才做展示
    deliverTemplateItemShow(item) {
      if (item == null || item === 'undefined' || /^\s*$/.test(item)) {
        return false
      }
      return item.available && eq(this.queryContent.type, vm.TYPE_DEFINE) &&
        (eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_BASIC_NUM) ||
          eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_BASIC_WEIGHT) ||
          eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_BASIC_VOLUME))
    },
    // 选中配送方式、在自定义运费和计费方式为O2O的情况下才做展示
    deliverTemplateItemO2OShow(item) {
      return item['available'] && eq(this.queryContent.type, vm.TYPE_DEFINE)
    },
    // 在卖家承担运费和计费方式为金额的情况下不做展示
    shippingFreeItemShow() {
      if (eq(this.queryContent.type, vm.TYPE_MERCHANT)) {
        return false
      }
      if (eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_O2O_FIX) ||
        eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_O2O_LADDER)) {
        return false
      }
      return true
    },
    // 判断计费方式是否可用，O2O渠道模式下，只有O2O的才可以用
    disableChargeWay(item) {
      if (vm.selectedChannelModeList.length === 0) {
        return false
      }
      if (vm.selectedChannelModeList.indexOf(vm.CHANNEL_MODE_O2O) >= 0) {
        if (eq(item.code, vm.CHARGE_WAYS_O2O_FIX) || eq(item.code, vm.CHARGE_WAYS_O2O_LADDER)) {
          return false
        }
        return true
      } else {
        if (!eq(item.code, vm.CHARGE_WAYS_O2O_FIX) && !eq(item.code, vm.CHARGE_WAYS_O2O_LADDER)) {
          return false
        }
        return true
      }
    },
    // 重置所有区域选择数据
    resetProvinceList(provinceList) {
      for (var i in provinceList) {
        if (provinceList[i].selected || provinceList[i].disable || provinceList[i].expanded || provinceList[i].selectAll) {
          provinceList[i].selected = false
          provinceList[i].disable = false
          provinceList[i].expanded = false
          provinceList[i].selectAll = false
          this.disableAreaItem(provinceList[i].disable, provinceList[i].code)
          this.resetProvinceList(provinceList[i].children)
          document.querySelectorAll('#multiCity #area' + provinceList[i].code).forEach(function(el) {
            el.classList.remove('active')
          })
          document.querySelectorAll('.children').forEach(function(el) {
            el.style.display = 'none'
          })
          document.querySelectorAll('#multiCity ul[class="' + provinceList[i].code + ' children"]').forEach(function(el) {
            el.style.display = 'none'
          })
        }
      }
    },
    initAreaModal(parentRegion, provinceList) {
      for (var i in provinceList) {
        for (var k in parentRegion) {
          if (eq(provinceList[i].code, parentRegion[k].code)) {
            provinceList[i].disable = true
            // this.selectMeAndSubItem(provinceList[i])
            this.disableAreaItem(provinceList[i].disable, provinceList[i].code)
            this.initAreaModal(parentRegion[k].children, provinceList[i].children)
            break
          }
        }
      }
    },
    selectAreaModal(parentRegion, provinceList) {
      for (var i in provinceList) {
        for (var j in parentRegion) {
          if (eq(provinceList[i].code, parentRegion[j].code)) {
            provinceList[i].selected = true
            provinceList[i].selectAll = parentRegion[j].selectAll
            // this.selectMeAndSubItem(provinceList[i]);
            this.disableAreaItem(provinceList[i].disable, provinceList[i].code)
            this.selectAreaModal(parentRegion[j].children, provinceList[i].children)
            break
          }
        }
      }
    },
    // 新增或修改地区
    selectAreaModalShow(selectedDelivery, freightTemplateItem, type) {
      // 初始化数据
      if (this.provinceList == null || this.provinceList.length === 0) {
        // 性能优化，在每次选择区域的时候再做dom加载
        this.provinceList = this.provinceListData
      }
      this.selectRegionForTemplateErrMsg = {}
      this.resetProvinceList(this.provinceList)
      for (var k in selectedDelivery.freightTemplateItemList) {
        if (!eq(selectedDelivery.freightTemplateItemList[k], freightTemplateItem)) {
          this.initAreaModal(selectedDelivery.freightTemplateItemList[k].distributionRegions, this.provinceList)
        }
      }
      // 新增算法
      if (freightTemplateItem == null || freightTemplateItem['templateTempId'] != null) {
        this.areaData.isNewAreaItemNode = true
        this.areaData.type = type
        if (freightTemplateItem != null && freightTemplateItem['templateTempId'] != null) {
          this.currentOperateNode = freightTemplateItem
        } else {
          this.currentOperateNode = selectedDelivery
        }
      } else { // 修改算法
        this.areaData.isNewAreaItemNode = false
        this.currentOperateNode = freightTemplateItem
      }

      if (freightTemplateItem != null && freightTemplateItem.distributionRegions != null) {
        this.selectAreaModal(freightTemplateItem.distributionRegions, this.provinceList)
      }
      this.showAreaModal = true
    },
    // 确认修改
    selectRegionForTemplate() {
      var available
      var distributionCode
      // check是否选择城市
      if (!this.checkIsSelectedData()) {
        return
      }
      // 新增规则细节
      if (this.areaData.isNewAreaItemNode) {
        if (this.currentOperateNode['templateTempId'] == null) {
          const newIndex = this.currentOperateNode.freightTemplateItemList.length
          this.currentOperateNode.freightTemplateItemList[newIndex] = {}
          available = this.currentOperateNode['available']
          distributionCode = this.currentOperateNode['distributionCode']
          this.currentOperateNode = this.currentOperateNode.freightTemplateItemList[newIndex]
        }
      }

      this.currentOperateNode.distributionRegions = []

      // 保存数据
      this.setSelectedDistributionRegion(this.currentOperateNode.distributionRegions, this.provinceList)

      if (this.areaData.isNewAreaItemNode) {
        let isExist = false
        for (var i = 0; i < this.queryModifyContent.insertFreightTemplateList.length; i++) {
          if (eq(this.currentOperateNode['templateTempId'], this.queryModifyContent['insertFreightTemplateList'][i]['templateTempId'])) {
            isExist = true
            break
          }
        }
        if (isExist) {
          this.setChangeValues(this.queryModifyContent['insertFreightTemplateList'][i], this.currentOperateNode)
        } else {
          const newIndex = this.queryModifyContent['insertFreightTemplateList'].length
          this.queryModifyContent['insertFreightTemplateList'][newIndex] = {}
          this.queryModifyContent['insertFreightTemplateList'][newIndex]['distributionRegions'] = this.currentOperateNode.distributionRegions
          this.queryModifyContent['insertFreightTemplateList'][newIndex]['type'] = this.areaData.type
          this.queryModifyContent['insertFreightTemplateList'][newIndex]['templateTempId'] = this.templateTempId
          this.queryModifyContent['insertFreightTemplateList'][newIndex]['available'] = available
          if (eq(this.areaData.type, 1)) {
            this.queryModifyContent['insertFreightTemplateList'][newIndex]['distributionCode'] = distributionCode
            this.queryModifyContent['insertFreightTemplateList'][newIndex]['chargeWay'] = this.queryContent.chargeWay

            this.currentOperateNode['distributionCode'] = distributionCode
            this.currentOperateNode['chargeWay'] = this.queryContent.chargeWay
          }

          this.currentOperateNode['templateTempId'] = this.templateTempId
          this.currentOperateNode['type'] = this.areaData.type

          // 临时id递增
          this.templateTempId++
        }
      } else {
        let isExist = false
        for (var j in this.queryModifyContent.updateFreightTemplateList) {
          if (eq(this.queryModifyContent['updateFreightTemplateList'][j]['freightTemplateItemId'], this.currentOperateNode['freightTemplateItemId'])) {
            isExist = true
            this.queryModifyContent['updateFreightTemplateList'][j]['distributionRegions'] = this.currentOperateNode.distributionRegions
          }
        }
        if (!isExist) {
          var tmpValue = {}
          this.setChangeValues(tmpValue, this.currentOperateNode)
          this.queryModifyContent['updateFreightTemplateList'].push(tmpValue)
        }
      }
      // 释放节点
      this.areaData.isNewAreaItemNode = false
      this.areaData.type = null
      this.showAreaModal = false
    },
    // 指定条件包邮新增按钮
    addShippingFreeRule(shippingFreeItem, type) {
      var tmpNode = {}
      var available = shippingFreeItem['available']

      tmpNode['templateTempId'] = this.templateTempId
      tmpNode['type'] = type
      tmpNode['distributionRegions'] = this.defaultRegion

      shippingFreeItem['freightTemplateItemList'].push(tmpNode)

      var newIndex = this.queryModifyContent['insertFreightTemplateList'].length
      this.queryModifyContent['insertFreightTemplateList'][newIndex] = {}
      this.queryModifyContent['insertFreightTemplateList'][newIndex]['distributionRegions'] = this.defaultRegion
      this.queryModifyContent['insertFreightTemplateList'][newIndex]['type'] = type
      this.queryModifyContent['insertFreightTemplateList'][newIndex]['templateTempId'] = this.templateTempId
      this.queryModifyContent['insertFreightTemplateList'][newIndex]['available'] = available

      // 临时id递增
      this.templateTempId++

      this.$forceUpdate()
    },
    setToDefaultArea(itemNode) {
      this.$confirm(this.$t('do_you_set_up_the_area_as_the_default_value'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        itemNode['distributionRegions'] = vm.defaultRegion
        vm.deliveryTemplateItemChanged(itemNode)
      })
    },
    setSelectedDistributionRegion(parent, provinceList) {
      for (var i in provinceList) {
        if (provinceList[i].selected) {
          var tmpValue = {}
          tmpValue.code = provinceList[i].code
          tmpValue.parentcode = provinceList[i].parentcode
          tmpValue.name = provinceList[i].name
          tmpValue.level = provinceList[i].level
          tmpValue.selectAll = provinceList[i].selectAll
          tmpValue.children = []
          this.setSelectedDistributionRegion(tmpValue.children, provinceList[i].children)
          parent.push(tmpValue)
        }
        // 重置
        provinceList[i].selected = false
        provinceList[i].disable = false
      }
    },
    // check是否选择城市
    checkIsSelectedData() {
      var isSelectedProvince = false
      for (var i = 0; i < this.provinceList.length; i++) {
        if (this.provinceList[i].selected) {
          isSelectedProvince = true
          break
        }
      }
      if (!isSelectedProvince) {
        this.selectRegionForTemplateErrMsg.noSelected = this.$t('please_choose_at_least_one_city')
        return false
      }
      return true
    },
    removeFreightTemplateItem(selectedDelivery, index) {
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        if (selectedDelivery.freightTemplateItemList[index]['freightTemplateItemId'] != null) {
          var tmp = {}
          tmp.freightTemplateItemId = selectedDelivery.freightTemplateItemList[index].freightTemplateItemId
          this.queryModifyContent['deleteFreightTemplateList'].push(tmp)
        } else if (selectedDelivery.freightTemplateItemList[index]['templateTempId'] != null) {
          // 新增情况删除，需要删除insert下的数据
          for (var i in this.queryModifyContent.insertFreightTemplateList) {
            if (eq(this.queryModifyContent['insertFreightTemplateList'][i]['templateTempId'], selectedDelivery.freightTemplateItemList[index]['templateTempId'])) {
              this.queryModifyContent['insertFreightTemplateList'].splice(i, 1)
              break
            }
          }
        }
        // 删除选中数组中元素
        selectedDelivery.freightTemplateItemList.splice(index, 1)
        vm.$forceUpdate()
      })
    },
    cancelSelectRegion() {
      this.resetProvinceList(this.provinceList)
      this.areaData.isNewAreaItemNode = false
      this.showAreaModal = false
    },
    // 获取运送方式表头
    getDeliveryTemplateItemTh(pos) {
      for (var i in this.deliveryTemplateItemText) {
        if (eq(this.deliveryTemplateItemText[i].chargeWay, this.queryContent.chargeWay)) {
          return this.deliveryTemplateItemText[i][pos]['th']
        }
      }
    },
    // 获取运送方式表头
    getDeliveryTemplateItemTd(pos) {
      for (var i in this.deliveryTemplateItemText) {
        if (eq(this.deliveryTemplateItemText[i].chargeWay, this.queryContent.chargeWay)) {
          return this.deliveryTemplateItemText[i][pos]['td']
        }
      }
    },
    // 获取运送方式描述
    getDeliveryTemplateItemDesc(pos) {
      var describe = null
      var desc = []
      for (var i in this.deliveryTemplateItemText) {
        if (eq(this.deliveryTemplateItemText[i].chargeWay, this.queryContent.chargeWay)) {
          describe = this.deliveryTemplateItemText[i]['desc']
          break
        }
      }
      if (describe != null) {
        desc = describe.split('[input]')
        return desc[pos]
      }
      return ''
    },
    // 获取已选择的配送方式
    getAvailableDeliveryList() {
      var tempList = {}
      for (var i in this.selectedDeliveryList) {
        if (this.selectedDeliveryList[i]['available']) {
          tempList[this.selectedDeliveryList[i].shipPingName] = this.selectedDeliveryList[i].distributionCode
        }
      }
      return tempList
    },
    // 获取运送方式描述
    getFreeShippingDesc(d, pos) {
      var describe = null
      var desc = []
      for (var i in this.freeShippingText) {
        if (eq(this.freeShippingText[i].chargeWay, this.queryContent.chargeWay)) {
          describe = this.freeShippingText[i]['desc'][d.chargeWay]
          break
        }
      }
      if (describe != null) {
        desc = describe.split('[input]')
        return desc[pos]
      }
      return ''
    },
    // 获取免邮方式下的input框显示
    getFreeShippingInputShow(d, pos) {
      var describe = null
      var input_show = []
      for (var i in this.freeShippingText) {
        if (eq(this.freeShippingText[i].chargeWay, this.queryContent.chargeWay)) {
          describe = this.freeShippingText[i]['input_show'][d.chargeWay]
          break
        }
      }
      if (describe != null) {
        input_show = describe.split(',')
        for (var j in input_show) {
          if (eq(input_show[j], pos)) {
            return true
          }
        }
      }
      return false
    },
    // 取消修改
    cancelSave() {
      this.back()
    },
    // 数据保存
    saveTemplate() {
      // 判断数据有效性
      if (!this.validateData()) {
        return
      }
      this.queryContent.channelMode = vm.selectedChannelModeList.join(',')
      // 新增保存数据
      if (this.freightTemplateId == null) {
        this.$oms.$api.freightTemplate.freightTemplateAdd(this.queryContent).then((result) => {
          if (eq(result.code, '0')) {
            vm.$message.success(vm.$t('保存成功'))
            this.back()
          } else {
            vm.$message.error(result.message)
          }
        })
      } else {
        this.$oms.$api.freightTemplate.freightTemplateUpdate(this.queryModifyContent).then((result) => {
          if (eq(result.code, '0')) {
            // this.back()
            this.$message.success(this.$t('保存成功'))
            this.$portal.delActiveViewAndRefresh()
          } else {
            vm.$message.error(result.message)
          }
        })
      }
    },
    isNumberic(selectedDelivery) {
      return (selectedDelivery.underUnit == null || !isNaN(selectedDelivery.underUnit)) &&
        (selectedDelivery.underUnitCost == null || !isNaN(selectedDelivery.underUnitCost)) &&
        (selectedDelivery.perUnit == null || !isNaN(selectedDelivery.perUnit)) &&
        (selectedDelivery.perUnitCost == null || !isNaN(selectedDelivery.perUnitCost))
    },
    // 判断数据有效性
    validateData() {
      this.queryContentErrMsg = {}
      var retFlag = true
      var tmpErrMsg = {}

      // 判断是否选择了配送方式
      var isSelectedDelivery = false
      var isPerUnitZero = false // 续perUnit，不能为0或者空
      var isNumberic = true
      vm.o2oPass = true
      for (var i = 0; i < this.selectedDeliveryList.length; i++) {
        if (this.selectedDeliveryList[i]['available']) {
          isSelectedDelivery = true

          // 用户自定义运费模板的时候才做续perUnit是否为0判断
          if (eq(this.queryContent.type, 10)) {
            // 基础模板判断
            if (eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_BASIC_NUM) ||
              eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_BASIC_WEIGHT) ||
              eq(this.queryContent.chargeWay, vm.CHARGE_WAYS_BASIC_VOLUME)) {
              for (var j = 0; j < this.selectedDeliveryList[i].freightTemplateItemList.length; j++) {
                var perUnit = this.selectedDeliveryList[i].freightTemplateItemList[j].perUnit
                if ((perUnit == null || eq(perUnit, 0)) &&
                  (this.selectedDeliveryList[i].freightTemplateItemList[j] != null || this.selectedDeliveryList[i].freightTemplateItemList[j] !== undefined)) {
                  isPerUnitZero = true
                  break
                }
                if (!this.isNumberic(this.selectedDeliveryList[i].freightTemplateItemList[j])) {
                  isNumberic = false
                  break
                }
              }
            }
          }
        }
      }
      if (!this.queryContent.templateName) {
        tmpErrMsg['saveErrMsg'] = this.$t('模板名称不能为空')
        retFlag = false
      } else if (!this.queryContent.merchantId) {
        tmpErrMsg['saveErrMsg'] = this.$t('common_please_choose_merchant')
        retFlag = false
      } else if (!this.queryContent.type) {
        tmpErrMsg['saveErrMsg'] = this.$t('请选择是否免邮')
        retFlag = false
      } else if (!isSelectedDelivery) {
        tmpErrMsg['selectedDeliveryListErrMsg'] = this.$t('at_least_one_delivery_method_must_be_selected')
        retFlag = false
      }
      if (!isNumberic) {
        tmpErrMsg['selectedDeliveryListErrMsg'] = this.$t('quantity_and_price_must_be_numeral')
        retFlag = false
      }
      if (isPerUnitZero) {
        tmpErrMsg['selectedDeliveryListErrMsg'] = this.getDeliveryTemplateItemTh('perUnit') + this.$t('not_for') + '0'
        retFlag = false
      }
      if (!vm.o2oPass) {
        tmpErrMsg['selectedDeliveryListErrMsg'] = this.$t('invalid_number_tip')
        retFlag = false
      }

      var isShippingFreeNumberic = true
      if (this.shippingFreeItem['available']) {
        for (let j = 0; j < this.shippingFreeItem.freightTemplateItemList.length; j++) {
          if (this.shippingFreeItem.freightTemplateItemList[j]['distributionCode'] == null ||
            this.shippingFreeItem.freightTemplateItemList[j]['distributionCode'] === '') {
            tmpErrMsg['shippingFreeItemErrMsg'] = this.$t('at_least_one_delivery_method_must_be_selected')
            retFlag = false
            break
          }

          if (this.shippingFreeItem.freightTemplateItemList[j]['chargeWay'] == null ||
            this.shippingFreeItem.freightTemplateItemList[j]['chargeWay'] === '') {
            tmpErrMsg['shippingFreeItemErrMsg'] = this.$t('the_post_-_mail_condition_is_necessary')
            retFlag = false
            break
          }

          if ((this.shippingFreeItem.freightTemplateItemList[j].underUnit != null &&
            isNaN(this.shippingFreeItem.freightTemplateItemList[j].underUnit)) ||
            (this.shippingFreeItem.freightTemplateItemList[j].underUnit != null &&
              isNaN(this.shippingFreeItem.freightTemplateItemList[j].underUnitCost))) {
            isShippingFreeNumberic = false
            break
          }
        }
      }

      if (!isShippingFreeNumberic) {
        tmpErrMsg['shippingFreeItemErrMsg'] = this.$t('quantity_and_price_must_be_numeral')
        retFlag = false
      }

      if (eq(vm.queryContent.type, vm.TYPE_DEFINE) && vm.selectedChannelModeList.length === 0) {
        tmpErrMsg['saveChannelModeErrMsg'] = this.$t('请选择渠道模式')
        retFlag = false
      }

      if ((this.queryContent.chargeWay === this.CHARGE_WAYS_O2O_FIX || this.queryContent.chargeWay === this.CHARGE_WAYS_O2O_LADDER) && this.queryContent.type === this.TYPE_DEFINE) {
        for (var ii = 0; ii < this.queryContent.deliverTemplateItemList.length; ii++) {
          var delItem = this.queryContent.deliverTemplateItemList[ii]
          if (delItem.available && !delItem.freightTemplateItemDefault.defaultPrice) {
            // 报错
            this.$message.error(this.$t('请填写默认运费'))
            retFlag = false
          }
        }
      }

      if (tmpErrMsg['saveErrMsg']) {
        this.$message(tmpErrMsg['saveErrMsg'])
      }
      this.queryContentErrMsg = tmpErrMsg
      return retFlag
    },
    // 模板名称变化时触发
    templateNameChanged() {
      this.queryModifyContent['templateName'] = this.queryContent['templateName']
    },
    // 模板名称变化时触发
    templateMerchantChanged() {
      this.queryModifyContent['merchantId'] = this.queryContent['merchantId']
      // 设置商家下的渠道模式
      this.setMerchantChannelMode()
    },
    // 配送方式变化时触发
    selectedDeliveryChanged(item, type, available) {
      // 普通配送方式逻辑处理
      if (eq(type, 1)) {
        // 基础运费模板
        var distributionCode = item.distributionCode
        var freightTemplateItemList = item['freightTemplateItemList']
        for (var i in freightTemplateItemList) {
          this.setSelectedDeliveryChangedValue(freightTemplateItemList[i], available)
        }

        this.setSelectedDeliveryChangedValue(item['freightTemplateItemDefault'], available)

        // 清除取消后免邮条件已选中条件
        if (!available) {
          var shippingFreeItemList = this.shippingFreeItem.freightTemplateItemList
          for (var j in shippingFreeItemList) {
            if (eq(shippingFreeItemList[j].distributionCode, distributionCode)) {
              shippingFreeItemList[j].distributionCode = null
            }
          }
        }
      }

      // 指定条件包邮方式逻辑处理
      if (eq(type, 2)) {
        for (const i in item) {
          this.setSelectedDeliveryChangedValue(item[i], available)
        }
      }
      this.$forceUpdate()
    },
    setSelectedDeliveryChangedValue(item, available) {
      if (this.queryModifyContent.insertFreightTemplateList.length > 0) {
        for (var i = 0; i < this.queryModifyContent.insertFreightTemplateList.length; i++) {
          if (eq(item['templateTempId'], this.queryModifyContent['insertFreightTemplateList'][i]['templateTempId'])) {
            this.queryModifyContent['insertFreightTemplateList'][i]['available'] = available
            return
          }
        }
      }

      if (this.queryModifyContent.updateFreightTemplateList.length > 0) {
        for (var j in this.queryModifyContent.updateFreightTemplateList) {
          if (eq(item['freightTemplateItemId'], this.queryModifyContent['updateFreightTemplateList'][j]['freightTemplateItemId'])) {
            this.queryModifyContent['updateFreightTemplateList'][j]['available'] = available
            return
          }
        }
      }

      // 修改情况
      if (item['freightTemplateItemId'] != null) {
        // 之前没有做过记录的数据
        const tmpValue = {}
        this.setChangeValues(tmpValue, item)
        tmpValue['available'] = available
        this.queryModifyContent['updateFreightTemplateList'].push(tmpValue)
        return
      }

      // 修改情况
      if (item['templateTempId'] != null) {
        // 之前没有做过记录的数据
        const tmpValue = {}
        this.setChangeValues(tmpValue, item)
        tmpValue['available'] = available
        this.queryModifyContent['insertFreightTemplateList'].push(tmpValue)
        return
      }
    },
    deliveryTemplateItemChanged(item) {
      // 对于新增数据的修改
      // if(this.queryModifyContent.insertFreightTemplateList.length > 0){
      for (var i = 0; i < this.queryModifyContent.insertFreightTemplateList.length; i++) {
        if (eq(item['templateTempId'], this.queryModifyContent['insertFreightTemplateList'][i]['templateTempId'])) {
          this.setChangeValues(this.queryModifyContent['insertFreightTemplateList'][i], item)
          this.$forceUpdate()
          return
        }
      }
      // }

      // if(this.queryModifyContent.updateFreightTemplateList> 0){
      // 对于已记录过的数据的修改
      for (var j in this.queryModifyContent.updateFreightTemplateList) {
        if (eq(item['freightTemplateItemId'], this.queryModifyContent['updateFreightTemplateList'][j]['freightTemplateItemId'])) {
          this.setChangeValues(this.queryModifyContent['updateFreightTemplateList'][j], item)
          this.$forceUpdate()
          return
        }
      }
      // }

      // 之前没有做过记录的数据
      var tmpValue = {}
      this.setChangeValues(tmpValue, item)
      this.queryModifyContent['updateFreightTemplateList'].push(tmpValue)
      this.$forceUpdate()
    },
    setChangeValues(oldObj, newObj) {
      oldObj['freightTemplateItemId'] = newObj['freightTemplateItemId']
      oldObj['templateTempId'] = newObj['templateTempId']
      oldObj['distributionRegions'] = newObj['distributionRegions']
      oldObj['distributionCode'] = newObj['distributionCode']
      oldObj['type'] = newObj['type']
      oldObj['chargeWay'] = newObj['chargeWay']
      oldObj['underUnit'] = newObj['underUnit']
      oldObj['underUnitCost'] = newObj['underUnitCost']
      oldObj['perUnit'] = newObj['perUnit']
      oldObj['perUnitCost'] = newObj['perUnitCost']
      oldObj['merchantId'] = newObj['merchantId']

      oldObj['defaultPrice'] = newObj['defaultPrice']
      oldObj['defaultDistance'] = newObj['defaultDistance']
      oldObj['addDistance'] = newObj['addDistance']
      oldObj['onWeight'] = newObj['onWeight']
      oldObj['addDisPrice'] = newObj['addDisPrice']
      oldObj['onWeight'] = newObj['onWeight']
      oldObj['defaultWeight'] = newObj['defaultWeight']
      oldObj['addWeight'] = newObj['addWeight']
      oldObj['addWeightPrice'] = newObj['addWeightPrice']
      oldObj['onUpAdd'] = newObj['onUpAdd']
    },
    formatAreaData(data) {
      var oData = data
      var l1 = {}
      var l2 = {}
      var l3 = {}
      var fData = []
      for (var i in oData) {
        if (eq(oData[i].level, 1)) {
          l1[oData[i].code] = oData[i]
          l1[oData[i].code].expanded = false
          l1[oData[i].code].expandedText = '+'
          l1[oData[i].code].children = []
        } else if (eq(oData[i].level, 2)) {
          l2[oData[i].code] = oData[i]
          l2[oData[i].code].children = []
        } else if (eq(oData[i].level, 3)) {
          l3[oData[i].code] = oData[i]
          l3[oData[i].code].children = []
        }
      }
      for (const k in l3) {
        if (l2[l3[k]['parentcode']] != null && l2[l3[k]['parentcode']].children != null) {
          l2[l3[k]['parentcode']].children.push(l3[k])
        }
      }
      for (const k in l2) {
        if (l1[l2[k]['parentcode']] != null && l1[l2[k]['parentcode']].children != null) {
          l1[l2[k]['parentcode']].children.push(l2[k])
        }
      }
      for (const k in l1) {
        fData.push(l1[k])
      }
      this.provinceListByLevel['l1'] = l1
      this.provinceListByLevel['l2'] = l2
      this.provinceListByLevel['l3'] = l3
      return fData // JSON.parse(JSON.stringify(fData)); // .replace(/code/g, 'id'))
    },
    expandEvent(item, provinceList) {
      var expanded = item.expanded

      // 重置其他
      for (var i in provinceList) {
        provinceList[i].expanded = false
      }

      item.expanded = expanded

      // 样式控制
      var $other = document.querySelectorAll('#multiCity .lev0:not([id="area' + item.code + '"])')
      var $this = document.querySelectorAll('#multiCity #area' + item.code)

      $other.forEach(el => {
        el.classList.remove('active')
      })
      document.querySelectorAll('.children').forEach(el => {
        el.style.display = 'none'
      })
      document.querySelectorAll('#multiCity ul[class="' + item.code + ' children"]').forEach(el => {
        el.style.display = !item.expanded ? 'block' : 'none'
      })
      if (!item.expanded) {
        $this.forEach(el => {
          el.classList.add('active')
        })
      } else {
        $this.forEach(el => {
          el.classList.remove('active')
        })
      }
      // 设置为已展开/未展开
      item.expanded = !item.expanded
      this.$forceUpdate()
    },
    selectMeAndSubItem(item) {
      if (item.selected) {
        item.selected = true
        item.selectAll = true
        for (var i = 0; i < item.children.length; i++) {
          item.children[i].selected = true
          item.children[i].selectAll = true
          this.selectMeAndSubItem(item.children[i])
        }
      } else {
        item.selected = false
        item.selectAll = false
        for (const i in item.children) {
          item.children[i].selected = false
          item.children[i].selectAll = false
          this.selectMeAndSubItem(item.children[i])
        }
      }

      this.disableAreaItem(item.disable, item.code)

      if (eq(item.level, 2)) {
        this.selectAreaForParent(item, 'l1')
      } else if (eq(item.level, 3)) {
        this.selectAreaForParent(item, 'l2')
        this.selectAreaForParent(this.provinceListByLevel['l2'][item['parentcode']], 'l1')
      }
      this.$forceUpdate()
    },
    disableAreaItem(isDisable, itemCode) {
      if (isDisable) {
        document.querySelectorAll('#area' + itemCode + ' .checkbox ').forEach(item => {
          item.classList.add('disabled')
        })
        document.querySelectorAll('#area' + itemCode + ' input').forEach(item => {
          item.disabled = 'true'
        })
      } else {
        document.querySelectorAll('#area' + itemCode + ' .checkbox ').forEach(item => {
          item.classList.remove('disabled')
        })
        document.querySelectorAll('#area' + itemCode + ' input').forEach(item => {
          item.disabled = ''
        })
      }
    },
    selectAreaForParent(item, level) {
      var count = 0
      var countSelectAll = 0
      for (var i in this.provinceListByLevel[level][item['parentcode']].children) {
        if (this.provinceListByLevel[level][item['parentcode']].children[i].selected) {
          if (this.provinceListByLevel[level][item['parentcode']].children[i].selectAll) {
            countSelectAll++
          }
          count++
        }
      }

      if (countSelectAll !== this.provinceListByLevel[level][item['parentcode']].children.length) {
        this.provinceListByLevel[level][item['parentcode']].selectAll = false
      } else {
        this.provinceListByLevel[level][item['parentcode']].selectAll = true
      }

      if (item.selected) {
        this.provinceListByLevel[level][item['parentcode']].selected = true
      } else if (count === 0) {
        this.provinceListByLevel[level][item['parentcode']].selected = false
      }
    },
    initCodes() {
      this.$oms.$api.common.listByCategorysForOrder({ 'categorys': ['CHARGE_WAYS', 'FREE_SHIPPING_CONDITION_10', 'FREE_SHIPPING_CONDITION_11', 'FREE_SHIPPING_CONDITION_12'] }).then((data) => {
        vm.codes = data.data
      })
    },
    setMerchantChannelMode() {
      if (this.merchantList && this.queryContent['merchantId']) {
        for (var i = 0; i < this.merchantList.length; i++) {
          var item = this.merchantList[i]
          if (eq(item['merchantId'], this.queryContent['merchantId'])) {
            this.initChannelMode(item['channelInfoList'])
            break
          }
        }
      } else {
        vm.channelModeList = []
      }
    },
    initChannelMode(channelInfoList) {
      var items = channelInfoList
      var channelModes = []
      if (items) {
        items.forEach(function(item) {
          if (item.channelMode && channelModes.indexOf(item.channelMode) === -1) {
            channelModes.push(item.channelMode)
          }
        })
        if (channelModes.indexOf(vm.CHANNEL_MODE_O2O) >= 0) {
          // 将O+O放在渠道的最后一位
          channelModes.splice(channelModes.indexOf(vm.CHANNEL_MODE_O2O), 1)
          channelModes.push(vm.CHANNEL_MODE_O2O)
        }
        // 去除 POS
        if (channelModes.indexOf(vm.CHANNEL_MODE_POS) >= 0) {
          channelModes.splice(channelModes.indexOf(vm.CHANNEL_MODE_POS), 1)
        }
      }
      vm.channelModeList = channelModes
      if (vm.selectedChannelModeList) {
        vm.selectedChannelModeList.forEach(function(item, index) {
          if (channelModes.indexOf(item) < 0) {
            vm.selectedChannelModeList.splice(index, 1)
          }
        })
      }
    },
    getNumber(obj, key) {
      var val = obj[key]
      if (isNaN(val)) {
        val = (val + '').replace(/[^\d]/g, '')
      } else if (val === '' || (val + '').endsWith('.')) {
        val = (val + '').trim()
      }
      if (val) {
        var index
        if (this.queryContent.chargeWay === '10' && (key === 'underUnit' || key === 'perUnit')) {
          // 纯数字
          val = parseInt((val + '').replace('.', '')) + ''
        } else if ((index = (val + '').indexOf('.')) > -1) {
          // 保留两位小数
          val = val + ''
          val = val.substring(0, index + 3)
        }
      }
      obj[key] = val
      this.$forceUpdate()
    },
    back() {
      this.$portal.delActiveView()
      // this.$router.push({ name: 'OmsFreightTemplateList' })
    }
  }
}

function eq(var1, var2) {
  return var1 === var2 || (var1 + '') === (var2 + '')
}
</script>

<style lang="scss" scoped>
  body {
    font-size: 0.92em;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  .context-class {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 2px;
  }
  .form-class{
    margin-bottom: 30px;
  }
  .form-class input, .form-class select {
    margin-right: 2px;
    margin-left: 10px;
  }
  .head-class {
    color: #333333;
    font-weight: 700;
    padding: 10px 15px;
    margin-bottom: 10px;
    background-color: #f6f8f8;
    border-bottom: 1px solid #edf1f2;
  }
  .form-group{
    margin-bottom: 5px;
    margin-right: 5px!important;
    margin-left: 0px!important;
    vertical-align: text-top !important;
  }
  .lineDashed {
    height: auto !important;
    border-style: dashed !important;
    background-color: transparent;
    border-width: 0;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 0;
    overflow: hidden;
    border-bottom: 1px solid #dee5e7;
  }
  .control-label{
    text-align: right;
    margin-bottom: 0;
    padding-top: 3px;
    float: left;
    width: 17%;
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
    min-width: 110px;
  }
  .delivery-method-class {
    padding-right: 30px;
    margin-left: 16.67%;
    margin-top: 12px;
  }
  .panel-table-class{
    border-radius: 2px;
    border: 1px solid #ddd;
    margin-bottom: 20px;
    margin-top: 5px;
  }
  .panel-heading{
    color: #333333;
    padding: 10px 15px;
    background-color: #f6f8f8;
    border-bottom: 1px solid #edf1f2;
  }
  .form-inline .form-group {
    vertical-align: text-top !important;display: inline-block;
    margin-right: 5px!important;
    margin-left: 0px!important;
  }
  .panel-footer{
    padding: 10px 15px;
    border-radius: 0 0 2px 2px;
    border-top: 1px solid #edf1f2;
  }
  .table-class {
    border: 1px solid #edf1f2;
  }
  .table-class th {
    /* background-color: #8b8b8b; */
    background-color: #fff;
  }
  .table-class th, .table-class td {
    padding: 8px 10px;
    border-left: 1px solid #eaeff0;
    border-bottom: 1px solid #eaeff0;
  }
  .save-but-class {
    width: 100%;
    margin-top: 15px;
    margin-right: -15px;
    margin-left: -15px;
    text-align: center;
  }
  .num-input {
    width: 90px;
  }
  .area-display {
    width: 300px;
    overflow: hidden;
    padding-left: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  table td a {
    color: #1287d6;
  }
  /** 城市 */
  .modal {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    min-width: 800px;
    overflow-x: hidden;
    overflow-y: scroll;
    max-height: 600px;
    margin: auto auto;
    background-color: #fff;
  }
  .modal-body {
    position: relative;
    padding: 15px;
    background-color: #fff;
  }
  .modal .modal-footer{
    text-align: center;
    padding: 15px;
    border-top: 1px solid #e5e5e5;
  }
  #multiCity .active {
    background: #e9eef2;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  #multiCity .lev0 {
    width: 25%;
    float: left;
    font-size: 16px;
    min-width: 200px;
    padding-left: 10px;
    font-weight: bolder;
    font-family: "Microsoft Yahei", sans-serif;
  }
  #multiCity .lev0 span {
    display: inline-block;
    width: 15px;
    height: 15px;
    color: #fff;
    text-align: center;
    line-height: 13px;
    border-radius: 10px;
    margin-left: 5px;
    background-color: #B5C7D5;
    cursor: pointer;
  }
  #multiCity .red-tip {
    color: red;
    font-size: 12px;
  }
  .area-div {
    display: block;
    overflow: hidden;
    border-bottom: 1px dashed #fff
  }
  em, i {
    font-style: normal!important;
  }
  #multiCity .children {
    margin-top: 0px;
    background: #e9eef2;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 10px;
  }
  #multiCity ul {
    display: block;
    overflow: hidden;
    padding-left: 0px;
    margin-right: 30px;
    margin-bottom: 0px;
  }
  #multiCity ul li {
    list-style: none;
  }
  #multiCity .lev1 {
    padding: 10px 0;
    margin-left: 25px;
  }
  .col-xs-3 {
    width: 25%;
    float: left;
  }
  .col-xs-9 {
    width: 75%;
    float: left;
  }
  .radio, .checkbox {
    position: relative;
    display: block;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  #multiCity label {
    font-weight: 700;
  }
  .radio label, .checkbox label {
    display: inline-flex;
    min-height: 20px;
    padding-left: 20px;
    margin-bottom: 0;
    font-weight: 400;
    cursor: pointer;
  }
  #multiCity .children2 {
    background: #e9eef2;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    margin-right: 27px;
    padding: 10px 0;
  }
  #multiCity .lev2 {
    margin: 0px 10px;
  }
  .radio-inline, .checkbox-inline {
    position: relative;
    display: inline-block;
    padding-left: 20px;
    margin-bottom: 0;
    font-weight: 400;
    vertical-align: middle;
    cursor: pointer;
  }
  #multiCity input {
    zoom: 150%;
  }
  .err-msg-div {
     color: red;
     font-size: 12px;
     margin-top: 3px;
    margin-left: 10px;
     display: inline-block;
   }
</style>
