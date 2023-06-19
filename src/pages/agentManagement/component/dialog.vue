<template>
    <div>
        <el-dialog title="新增供应商" :visible="dialogVisible == 1 ?true:false" width="800px" @close='changeDialogVisible(1)' :close-on-click-modal="false">
            <el-form :model="form">
                <el-popover
                    placement="bottom"
                    title="提示"
                    width="400"
                    trigger="manual"
                    content="一家企业仅可关联一个账号,请谨慎确认手机号"
                    v-model="visible4">
                </el-popover>
                <el-form-item required="true" label="统一信用代码" :label-width="'140px'" style="position: relative;">
                    <el-input  @input="from1.socialCreditCode=$utils.pureNumber(from1.socialCreditCode,2);chanCode(from1.socialCreditCode)" v-model="from1.socialCreditCode"  autocomplete="off" maxlength="18" placeholder="请输入18位统一信用代码" show-word-limit></el-input>
                    <span v-if="dialogVisible == 5?false:true" class="spanrz" :class="rztype" @click="getCompanyInfo">认证</span>
                </el-form-item>
                <el-form-item required="true" label="供应商名称" :label-width="'140px'">
                    <el-input v-model="from1.agentName"  disabled="true" maxlength="100" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item required="true" label="供应商名称首字母" :label-width="'140px'">
                    <el-input @input="from1.namePy=$utils.pureNumber(from1.namePy,3)" v-model="from1.namePy" autocomplete="off" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item required="true" label="是否合作" :label-width="'140px'">
                    <el-radio v-model="from1.isCooperation" :label="1">是</el-radio>
                    <el-radio style="margin-left:150px" v-model="from1.isCooperation" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item required="true" label="是否有合同" :label-width="'140px'">
                    <el-radio :disabled="from1.isCooperation=='0'?true:false" v-model="from1.isContract" :label="1">是</el-radio>
                    <el-radio style="margin-left:150px" v-model="from1.isContract" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item required="true" label="结算方式" :label-width="'140px'">
                    <el-radio @change="jsfs(1,1)" v-model="from1.settlementWay" :label="1">付款买单</el-radio>
                    <el-radio @change="jsfs(1,2)" v-model="from1.settlementWay" :label="2">月结买单</el-radio>
                    <el-radio @change="jsfs(1,3)" v-model="from1.settlementWay" :label="3">固定天数</el-radio>
                </el-form-item>
                <div style="display:flex;flex-direction: row;justify-content: space-between;">
                    <el-form-item required="true" label="结算账期" :label-width="'140px'">
                        <el-select  v-if="from1.settlementWay===2"
                            style="width: 120px"
                            id="sysname"
                            v-model="from1.settlementDays"
                            placeholder="请选择结算账期"
                            clearable
                            filterable
                            remote
                            reserve-keyword
                            maxlength="3"
                            >
                            <el-option
                                v-for="item in settlementDaysArr"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                        <el-input type="text" v-else-if="from1.settlementWay===3" maxlength="3" @input="from1.settlementDays=$utils.pureNumber(from1.settlementDays)" show-word-limit style="width: 120px;" v-model="from1.settlementDays"></el-input>
                        <el-input v-else style="width: 120px;text-align: center" disabled="true" v-model="from1.settlementDays"></el-input>
                        &emsp;天
                    </el-form-item>
                    <el-form-item required="true" style="margin-right:42px" label="授信额度" :label-width="'140px'">
                        <el-input  v-if="from1.settlementWay===1?false:true" v-model="from1.creditLimit" @input="from1.creditLimit=$utils.pureNumber(from1.creditLimit)" show-word-limit autocomplete="off" maxlength="8" style="width: 120px"></el-input>
                        <el-input  v-else v-model="from1.creditLimit" disabled="true" style="width: 120px"></el-input>&emsp;元
                    </el-form-item>
                </div>
                <div style="display:flex;flex-direction: row;justify-content: space-between;">
                    <el-form-item label="航线负责人" required="true" :label-width="'140px'">
                        <el-select
                        id="sysname"
                        v-model="from1.principalId"
                        placeholder="请输入航线负责人"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 170px"
                        >
                        <el-option
                            v-for="item in principalArray"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="一代操作" style="margin-right:22px" required="true" :label-width="'140px'">
                        <el-select
                        id="sysname"
                        v-model="from1.salesId"
                        placeholder="请输入一代操作"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 170px"
                        >
                        <el-option
                            v-for="item in salesNameArray"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style="width:100%;height:0px;border-top:1px #e5e5e5 solid;margin-bottom: 10px;"></div>
                <div style="display:flex;height:auto;flex-direction: row;justify-content: space-between;">
                    <div>
                        <el-form-item style="font-weight:bold;color:#000000"  label="业务" :label-width="'140px'">
                        </el-form-item>
                        <el-form-item  label="企业联系人" :label-width="'140px'">
                            <el-input @input="from1.busName=$utils.pureNumber(from1.busName,1)" 
                            v-model="from1.busName" maxlength="30" autocomplete="off" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item  label="联系电话" :label-width="'140px'">
                            <el-input type="text" v-model="from1.busPhone" @input="from1.busPhone=$utils.pureNumber(from1.busPhone)"  maxlength="11"
                            autocomplete="off" placeholder="请输入联系电话" style="position: relative;"></el-input>
                            <!-- <span style="color:red;" v-if="showPhone1">请输入11位手机号码</span> -->
                            <!-- <span class="spanrII" @mousemove="visible4 = true" @mouseleave="visible4 = false">!</span> -->
                        </el-form-item>
                    </div>
                    <div style="width:1px;height:180px;background-color: #e5e5e5;margin-left: auto"></div>
                    <div>
                        <el-form-item style="font-weight:bold;color:#000000"  label="代理" :label-width="'140px'">
                        </el-form-item>
                        <el-form-item required="true"  label="代理联系人 " :label-width="'140px'">
                            <el-input @input="from1.contactsName=$utils.pureNumber(from1.contactsName,1)" 
                            v-model="from1.contactsName" maxlength="30" autocomplete="off" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item required="true" label="代理联系电话" :label-width="'140px'">
                            <el-input type="text" v-model="from1.phoneNum" @input="from1.phoneNum=$utils.pureNumber(from1.phoneNum)"  maxlength="11"
                            autocomplete="off" @blur="phoneLenght(from1.phoneNum)" placeholder="请输入联系电话" style="position: relative;"></el-input>
                            <div style="color:red;" v-if="showPhone1">请输入11位手机号码</div>
                            <!-- <span class="spanrII" @mousemove="visible4 = true" @mouseleave="visible4 = false">!</span> -->
                        </el-form-item>
                    </div>
                </div>
                
                <el-form-item label="航线信息" :label-width="'140px'" required="true">
                    <el-input maxlength="50" v-model="from1.airlineComment" show-word-limit autocomplete="off" placeholder="请输入信息"></el-input>
                </el-form-item>
                <el-form-item  label="营业执照" :label-width="'140px'" style="position: relative;">
                    <el-upload
                        class="avatar-uploader"
                        :on-preview="handlePictureCardPreview"
                        :before-upload="beforeAvatarUpload"
                        :disabled = "disNow">
                        <img v-if="from1.fileUrl" :src="from1.fileUrl"  class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div v-show="from1.fileUrl" style="position: absolute;top: 0;left: 160px; height: 20px;width: 20px;font-size: 20px;">
                        <i @click='handlePictureCardPreview(1)' class="el-icon-zoom-in"></i>
                    </div>
                    <!-- <img src="" alt="" style="height:100px;width:100px;border: 1px solid black;"> -->
                    <!-- <div style="height:100px;width:100px;border: 1px solid black;"><i class="el-icon-plus" style="size:100px"></i></div> -->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="z-index: 10;">
                <el-button @click="changeDialogVisible(1)">取 消</el-button>
                <el-button :disabled="show" type="primary" @click="changeDialogVisible(1,true)">保 存</el-button>
            </div>
        </el-dialog>
                    <el-dialog :visible.sync="dialogVisibles" width="80%" :modal="false">
                        <img width="100%" :src="fromObjImageUrl" alt="">
                    </el-dialog>
        <el-dialog title="编辑供应商" :visible="dialogVisible == 5?true:false" width="800px" @close='changeDialogVisible(5)' :close-on-click-modal="false">
            <el-form :model="form">
                <el-popover
                    placement="bottom"
                    title="提示"
                    width="400"
                    trigger="manual"
                    content=":一家企业仅可关联一个账号,请谨慎确认手机号.手机号的落入不代表生成了官网账号"
                    v-model="visible3">
                </el-popover>
                <el-form-item required="true" label="统一信用代码" :label-width="'140px'" style="position: relative;">
                    <el-input onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" :disabled="true" v-model="from5.socialCreditCode"  autocomplete="off" maxlength="18" placeholder="请输入18位统一信用代码"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item required="true" label="供应商名称" :label-width="'140px'">
                    <el-input v-model="from5.agentName" maxlength="100" disabled="true" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item required="true" label="供应商名称首字母" :label-width="'140px'">
                    <el-input  @input="from5.namePy=$utils.pureNumber(from5.namePy,3)" v-model="from5.namePy" maxlength="100" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item required="true" label="是否合作" :label-width="'140px'">
                    <el-radio v-model="from5.isCooperation" :label="1">是</el-radio>
                    <el-radio style="margin-left:150px" v-model="from5.isCooperation" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item required="true" label="是否有合同" :label-width="'140px'">
                    <el-radio :disabled="from5.isCooperation=='0'?true:false" v-model="from5.isContract" :label="1">是</el-radio>
                    <el-radio style="margin-left:150px" v-model="from5.isContract" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item required="true" label="结算方式" :label-width="'140px'">
                    <el-radio @change="jsfs(5,1)" v-model="from5.settlementWay" :label="1">付款买单</el-radio>
                    <el-radio @change="jsfs(5,2)" v-model="from5.settlementWay" :label="2">月结买单</el-radio>
                    <el-radio @change="jsfs(5,3)" v-model="from5.settlementWay" :label="3">固定天数</el-radio>
                </el-form-item>
                <div style="display:flex;flex-direction: row;justify-content: space-between;">
                    <el-form-item required="true" label="结算账期" :label-width="'140px'">
                    <el-select  v-if="from5.settlementWay===2"
                            style="width: 120px"
                            id="sysname"
                            v-model="from5.settlementDays"
                            placeholder="请选择结算账期"
                            clearable
                            filterable
                            remote
                            reserve-keyword
                            maxlength="3"
                            >
                            <el-option
                                v-for="item in settlementDaysArr"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                        <el-input type="text" v-else-if="from5.settlementWay===3" maxlength="3" @input="from5.settlementDays=$utils.pureNumber(from5.settlementDays)" show-word-limit style="width: 120px;" v-model="from5.settlementDays"></el-input>
                        <el-input v-else style="width: 120px;text-align: center" disabled="true" v-model="from5.settlementDays"></el-input>
                        &emsp;天
                    </el-form-item>
                    <el-form-item  style="margin-right:42px" required="true" label="授信额度" :label-width="'140px'">
                        <el-input  v-if="from5.settlementWay===1?false:true" v-model="from5.creditLimit" @input="from5.creditLimit=$utils.pureNumber(from5.creditLimit)" show-word-limit autocomplete="off" maxlength="8" style="width: 120px"></el-input>
                        <el-input  v-else v-model="from5.creditLimit" disabled="true" style="width: 120px"></el-input>&emsp;元
                    </el-form-item>
                </div>
                <div style="display:flex;flex-direction: row;justify-content: space-between;">
                    <el-form-item label="航线负责人" required="true" :label-width="'140px'">
                            <el-select
                            id="sysname"
                            v-model="from5.principalId"
                            placeholder="请输入航线负责人"
                            clearable
                            filterable
                            remote
                            reserve-keyword
                            maxlength="10"
                            style="width: 170px"
                            >
                            <el-option
                                v-for="item in principalArray"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item  style="margin-right:20px" label="一代操作" required="true" :label-width="'140px'">
                            <el-select
                            id="sysname"
                            v-model="from5.salesId"
                            placeholder="请输入一代操作"
                            clearable
                            filterable
                            remote
                            reserve-keyword
                            maxlength="10"
                            style="width: 170px"
                            >
                            <el-option
                                v-for="item in salesNameArray"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div style="width:100%;height:1px;background-color: #e5e5e5;margin-bottom: 10px;"></div>
                    <div style="display:flex;height:auto;flex-direction: row;justify-content: space-between;">
                        <div>
                            <el-form-item style="font-weight:bold;color:#000000"  label="业务" :label-width="'140px'">
                            </el-form-item>
                            <el-form-item label="企业联系人" :label-width="'140px'">
                                <el-input disabled="true" @input="from5.busName=$utils.pureNumber(from5.busName,1)" 
                                maxlength="30" v-model="from5.busName" autocomplete="off" placeholder="请输入姓名"></el-input>
                            </el-form-item>
                            <el-form-item required="true" label="联系电话" :label-width="'140px'" >
                                <el-input disabled="true" maxlength="11" v-model="from5.busPhone" autocomplete="off" placeholder="请输入联系电话"
                                @input="from5.busPhone=$utils.pureNumber(from5.busPhone)" style="position: relative;"></el-input>
                                <!-- <span style="color:red;" v-if="showPhone1">请输入11位手机号码</span> -->
                                <!-- <span class="spanrII" @mousemove="visible3 = true" @mouseleave="visible3 = false">!</span> -->
                            </el-form-item>
                        </div>
                        <div style="width:1px;height:180px;background-color: #e5e5e5;margin-left: auto"></div>
                        <div>
                            <el-form-item style="font-weight:bold;color:#000000"  label="代理" :label-width="'140px'">
                            </el-form-item>
                            <el-form-item label="代理联系人" :label-width="'140px'">
                                <el-input @input="from5.contactsName=$utils.pureNumber(from5.contactsName,1)" 
                                maxlength="30" v-model="from5.contactsName" autocomplete="off" placeholder="请输入姓名"></el-input>
                            </el-form-item>
                            <el-form-item required="true" label="代理联系电话" :label-width="'140px'" >
                                <el-input maxlength="11" v-model="from5.phoneNum" autocomplete="off" placeholder="请输入联系电话"
                                @input="from5.phoneNum=$utils.pureNumber(from5.phoneNum)" @blur="phoneLenght(from5.phoneNum)" style="position: relative;"></el-input>
                                <div style="color:red;" v-if="showPhone1">请输入11位手机号码</div>
                                <!-- <span class="spanrII" @mousemove="visible3 = true" @mouseleave="visible3 = false">!</span> -->
                            </el-form-item>
                        </div>
                    </div>
                <el-form-item label="航线信息" :label-width="'140px'" required="true">
                    <el-input maxlength="50" v-model="from5.airlineComment" show-word-limit autocomplete="off" placeholder="请输入信息"></el-input>
                </el-form-item>
                <el-form-item  label="营业执照" :label-width="'140px'" style="position: relative;">
                    <el-upload
                        class="avatar-uploader"
                        :on-preview="handlePictureCardPreview"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="from5.fileUrl" :src="from5.fileUrl"  class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div v-show="from5.fileUrl" style="position: absolute;top: 0;left: 160px; height: 20px;width: 20px;font-size: 20px;">
                        <i  @click='(handlePictureCardPreview(5))' class="el-icon-zoom-in"></i>
                    </div>
                    <!-- <img src="" alt="" style="height:100px;width:100px;border: 1px solid black;"> -->
                    <!-- <div style="height:100px;width:100px;border: 1px solid black;"><i class="el-icon-plus" style="size:100px"></i></div> -->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="z-index: 10;">
                <el-button @click="changeDialogVisible(5)">取 消</el-button>
                <el-button :disabled="show" type="primary" @click="changeDialogVisible(5,true)">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="" :visible="dialogVisible == 2?true:false" width="600px" @close='changeDialogVisible(2)' :close-on-click-modal="false">
            <el-form :model="form">
                <el-popover
                    placement="bottom"
                    title="提示"
                    width="400"
                    trigger="manual"
                    content="一家企业仅可关联一个账号,请谨慎确认手机号,手机号仅支持11位数字"
                    v-model="visible2">
                </el-popover>
                <el-form-item required="true" label="登陆账号" :label-width="'120px'"  style="position: relative;">
                    <el-input v-model="from2.phoneNum" autocomplete="off" maxlength="11" @input="from2.phoneNum=$utils.pureNumber(from2.phoneNum)" @blur="phoneLenght(from2.phoneNum)" placeholder="请输入联系电话"></el-input>
                    <span style="color:red;" v-if="showPhone1">请输入11位手机号码</span>
                    <!-- <span class="spanrII" @mousemove="visible2 = true" @mouseleave="visible2 = false">!</span> -->

                </el-form-item>
                <el-form-item required="true" label="初始密码" :label-width="'120px'">
                    <el-input v-model="from2.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item  label="企业名称" :label-width="'120px'">
                    <el-input disabled v-model="from2.agentName" autocomplete="off" placeholder="请输入企业名称"></el-input>
                </el-form-item>
                <el-form-item  label="企业信用代码" :label-width="'120px'">
                    <el-input disabled v-model="from2.socialCreditCode" autocomplete="off" placeholder="请输入企业信用代码"></el-input>
                </el-form-item>
                <!-- <el-form-item required="true" label="售前客服" :label-width="'120px'">
                    <el-input  autocomplete="off" placeholder="请输入姓名"></el-input>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible(2)">取 消</el-button>
                <el-button type="primary" @click="changeDialogVisible(2,true)">创建成功</el-button>
            </div>
        </el-dialog>
        <el-dialog title="| 一代入驻审核记录" :visible="dialogVisible == 3?true:false" width="700px" @close='changeDialogVisible(3)' :close-on-click-modal="false">
            <el-table :data="historyArr" style="width: 100%">
                <el-table-column prop="createTime" label="操作时间" width="200"></el-table-column>
                <el-table-column prop="operatorName" label="操作者" width="100"></el-table-column>
                <el-table-column prop="operation" label="操作" width="150"></el-table-column>
                <el-table-column prop="remarks" label="说明" width="150"></el-table-column>
            </el-table>
            <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible(3)">取 消</el-button>
                <el-button type="primary" @click="changeDialogVisible(3,true)">创建成功</el-button>
            </div> -->
        </el-dialog>
        <el-dialog title="审核通过" :visible="dialogVisible == 4?true:false" width="600px" @close='changeDialogVisible(4),getExamineShow = false' :close-on-click-modal="false">
            <el-form :model="form">
                <el-form-item required="true" label="统一信用代码" :label-width="'140px'" style="position: relative;">
                    <el-input disabled="true"  @input="from4.socialCreditCode=$utils.pureNumber(from4.socialCreditCode,2);chanCode(from4.socialCreditCode,'from4')" v-model="from4.socialCreditCode"  autocomplete="off" maxlength="18" placeholder="请输入18位统一信用代码" show-word-limit></el-input>
                    <!-- <span v-if="dialogVisible == 5?false:true" class="spanrz" @click="getCompanyInfo('from4')">认证</span> -->
                </el-form-item>
                <el-form-item required="true" label="供应商名称" :label-width="'140px'">
                    <el-input v-model="from4.agentName" disabled="true"  @input="from4.agentName=$utils.pureNumber(from4.agentName,1)" maxlength="100" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="供应商等级" required="true" :label-width="'140px'">
                        <el-select
                        id="sysname"
                        v-model="from4.level"
                        placeholder="请选择供应商等级"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 300px"
                        >
                        <el-option
                            v-for="item in levelArray"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                <el-form-item label="航线负责人" required="true" :label-width="'140px'">
                        <el-select
                        id="sysname"
                        v-model="from4.principalId"
                        placeholder="请输入航线负责人"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 300px"
                        >
                        <el-option
                            v-for="item in principalArray"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="一代操作" required="true" :label-width="'140px'">
                        <el-select
                        id="sysname"
                        v-model="from4.salesId"
                        placeholder="请输入一代操作"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 300px"
                        >
                        <el-option
                            v-for="item in salesNameArray"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="营业执照" :label-width="'140px'" style="position: relative;">
                        <el-upload
                            class="avatar-uploader"
                            :on-preview="handlePictureCardPreview"
                            :before-upload="beforeAvatarUpload"
                            :disabled = "disNow">
                            <img v-if="from4.fileUrl" :src="from4.fileUrl"  class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <div v-show="from4.fileUrl" style="position: absolute;top: 0;left: 160px; height: 20px;width: 20px;font-size: 20px;">
                            <i @click='handlePictureCardPreview(4)' class="el-icon-zoom-in"></i>
                        </div>
                        <!-- <img src="" alt="" style="height:100px;width:100px;border: 1px solid black;"> -->
                        <!-- <div style="height:100px;width:100px;border: 1px solid black;"><i class="el-icon-plus" style="size:100px"></i></div> -->
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible(4),getExamineShow = false">取 消</el-button>
                <el-button type="primary" @click="getExamineBefore(4,true,getExamineShow)">审核通过</el-button>
            </div>
        </el-dialog>
        <el-dialog title="" :visible="dialogVisible == 7?true:false" width="600px" @close='changeDialogVisible(7)' :close-on-click-modal="false">
            <el-form :model="form">
                <el-form-item required="true" label="驳回理由" :label-width="'120px'">
                    <el-input maxlength="30" v-model="from7.examineMassage" autocomplete="off" placeholder="请输入驳回理由"></el-input>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible(7)">取 消</el-button>
                <el-button type="primary" @click="changeDialogVisible(7,true)">确定驳回</el-button>
            </div>
        </el-dialog>
        <el-dialog title="确定审核通过" :visible="dialogVisible == 8?true:false" width="600px" @close='changeDialogVisible(8)' :close-on-click-modal="false">
            <el-form :model="form">
                <el-form-item required="true" label="审核理由" :label-width="'120px'">
                    <el-input maxlength="30" v-model="from8.examineMassage" autocomplete="off" placeholder="请输入审核理由"></el-input>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible(8)">取 消</el-button>
                <el-button type="primary" @click="changeDialogVisible(8,true)">审核通过</el-button>
            </div>
        </el-dialog>
        <el-dialog title="" :visible="dialogVisible == 6?true:false" width="600px" @close='changeDialogVisible(6)' :close-on-click-modal="false">
            <el-form :model="form">
                <el-form-item label="供应商等级" required="true" :label-width="'120px'">
                        <el-select
                        id="sysname"
                        v-model="from6.level"
                        placeholder="请选择供应商等级"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 300px"
                        >
                        <el-option
                            v-for="item in levelArray"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible(6)">取 消</el-button>
                <el-button type="primary" @click="changeDialogVisible(6,true)">确定变更</el-button>
            </div>
        </el-dialog>
        <el-dialog  :visible.sync="showsss">
          <el-form>
            <span style="display: block;font-size: 20px;height: 40px;line-height: 40px;">该企业已有入驻信息，继续操作将会使申请信息与企业信息绑定</span>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showsss = false">取 消</el-button>
            <el-button type="primary" @click="ssShow()">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="" :visible="dialogVisible == 10?true:false" width="600px" @close='changeDialogVisible(10)' :close-on-click-modal="false">
            <el-form :model="form" style="padding:20px">
            <div >
                <div style="font-weight:600;font-size:16px">企业信息</div>
            </div>
            <el-form-item label="企业名称" :label-width="'120px'">
                <span style="margin-left:20px;">{{from10.agentName}}</span>
            </el-form-item>
            <el-form-item label="统一信用代码" :label-width="'120px'">
                <span style="margin-left:20px;">{{from10.socialCreditCode}}</span>
            </el-form-item>
            <el-form-item  label="营业执照附件" :label-width="'120px'">
                <div style="margin-left:20px;" v-if="from10.fileUrl" class="avatar-uploader">
                    <img @click='handlePictureCardPreview(10)' :src="from10.fileUrl"  class="avatar">
                </div>
                <img v-else src="../../../assets/onimg.svg" style="width: 178px;margin-left:20px; height: 178px;" alt="">
            </el-form-item>
            <!-- <el-form-item label="企业主账号" :label-width="'120px'">
                <span style="margin-left:20px;">{{from10.agentName}}</span>
            </el-form-item> -->
            <!-- <el-form-item label="专属客服" :label-width="'120px'">
                <span style="margin-left:20px;">{{from10.agentName}}</span>
            </el-form-item> -->
            <div >
                <div style="font-weight:600;font-size:16px">企业联系方式</div>
            </div>
            <el-form-item label="企业联系人" :label-width="'120px'">
                    <span style="margin-left:20px;">{{from10.busName}}</span>
            </el-form-item>
            <el-form-item label="联系电话" :label-width="'120px'">
                <span style="margin-left:20px;">{{from10.busPhone}}</span>
            </el-form-item>
            <el-form-item label="企业邮箱" :label-width="'120px'">
                    <span style="margin-left:20px;">{{from10.busMail?from10.busMail:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="QQ号" :label-width="'120px'">
                <span style="margin-left:20px;">{{from10.busQQ?from10.busQQ:'暂无'}}</span>
            </el-form-item>
            <div >
                <div style="font-weight:600;font-size:16px">航线信息</div>
            </div>
            <el-form-item label="优势航线" :label-width="'120px'">
                <span style="margin-left:20px;">{{from10.dominantRoute}}</span>
            </el-form-item>
            </el-form>
        </el-dialog>
        <!-- <el-dialog title="" :visible="dialogVisible == 10?true:false" width="600px" @close='changeDialogVisible(10)' :close-on-click-modal="false">
            <el-form :model="form" style="padding:20px">
            <div >
                <div style="font-weight:600;font-size:16px">企业信息</div>
            </div>

            <div >
                <div style="font-weight:600;font-size:16px">企业联系方式</div>
            </div>
                <el-form-item label="优势航线" :label-width="'120px'">
                    <el-input v-model="from10.dominantRoute" autocomplete="off" disabled placeholder="暂无"></el-input>
                </el-form-item>
                <el-form-item  label="营业执照" :label-width="'120px'">
                    <div v-if="from10.fileUrl" class="avatar-uploader">
                        <img @click='handlePictureCardPreview(10)' :src="from10.fileUrl"  class="avatar">
                    </div>
                    <img v-else src="../../../assets/onimg.svg" style="width: 178px; height: 178px;" alt="">
                </el-form-item>
            </el-form>
        </el-dialog> -->
    </div>
</template>
<script>
  export default {
    props:['dialogVisible','historyArr','principalArray','salesNameArray','indexObj','oldAgentId'],
    data() {
      return {
          getExamineShow: false,
          showsss:false,
          restaurants:[{value: '/'},{value: '15'},{value: '30'},{value: '45'}],
          showPhone1:false,
          disNow:false,
          rztype:'falses',
        //   showPhone2:false,
        //   showPhone3:false,
          visible3:false,
          visible4:false,
          visible2:false,
          chaWarnNum:0,
          show:true,
          socialCreditCode:'',
          from1:{
              agentName:'', //供应商名称
              socialCreditCode:'', //统一社会信用代码
              namePy:'', //名称首字母拼音
              principalName:'', //航线负责人
              principalId:'',//航线负责人id
              salesId:'', //一代操作人员id
              salesName:'', //一代操作人员
              contactsName:'', //代理联系人名称
              phoneNum:'', //代理联系人电话
              busName:'', //企业联系人
              busPhone:'', //企业联系人电话
              fileUrl:'', //营业执照全路径地址
              isCooperation:1,
              isContract:1,
              settlementWay:1,
              settlementDays:'/',
              creditLimit:'/',
              airlineComment:'',
          },
          from5:{
              agentName:'', //供应商名称
              socialCreditCode:'', //统一社会信用代码
              namePy:'', //名称首字母拼音
              principalName:'', //航线负责人
              principalId:'',//航线负责人id
              salesId:'', //一代操作人员id
              salesName:'', //一代操作人员
              contactsName:'', //代理联系人名称
              phoneNum:'', //代理联系人电话
              busName:'', //企业联系人
              busPhone:'', //企业联系人电话
              fileUrl:'', //营业执照全路径地址
              isCooperation:'',
              isContract:'',
              settlementWay:'',
              settlementDays:'',
              creditLimit:'',
              airlineComment:'',
          },
          from2:{
              phoneNum:'',
              password:'',
              agentName:'',
              socialCreditCode:'',
              id:''
          },
          from4:{
              oldAgentId:null,
              salesId:'',//一代操作
              principalId:'',//航线负责人
              id:'',
              level:'',
              status:1,
              examineMassage:'审核通过',
              socialCreditCode:'',
              fileUrl:'',
              namePy:'',
              agentName:'',
          },
          from6:{
              level:'',
              id:'',
          },
          levelArray:[{id:1,name:'1星'},{id:2,name:'2星'},{id:3,name:'3星'},{id:4,name:'4星'},{id:5,name:'5星'}],
          from7:{
              id:'',
              status:2,
              examineMassage:''
          },
          from8:{
              salesId:'',//一代操作
              principalId:'',//航线负责人
              id:'',
              level:'',
              status:1,
              examineMassage:'',
          },
          from10:{
              fileUrl:'',
              dominantRoute:''//优势航线
          },
          settlementDaysArr:[{id:'15',name:'15'},{id:'30',name:'30'},{id:'45',name:'45'},{id:'60',name:'60'}],
          loading: false,
          dialogVisibles:false,
          fromObjImageUrl:'',
          historyArray:[],
      };
    },
    watch: {
        dialogVisible: {
            handler(newName, oldName) {
            // console.log('监听变化：'+newName);
            this.changeForm(newName)
            },
            immediate: true,
            deep: true
        },
        from1:{
            handler(newName, oldName) {
                this.showEdf(1,newName)
            },
            immediate: true,
            deep: true
        },
        from5:{
            handler(newName, oldName) {
                this.showEdf(5,newName)
            },
            immediate: true,
            deep: true
        },
        historyArr:{
            handler(newName, oldName) {
                this.changeHistory(newName)
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        chanCode(e,type){
            this.rztype = 'trues'
            if(type == 'from4'){
                if(this.socialCreditCode != this.from4.socialCreditCode){
                    this.from4.agentName='' //供应商名称
                    this.getExamineShow = false
                //   this.from1.socialCreditCode='' //统一社会信用代码
                }
            }else{
                if(this.socialCreditCode != this.from1.socialCreditCode){
                    this.from1.agentName='' //供应商名称
                //   this.from1.socialCreditCode='' //统一社会信用代码
                    this.from1.namePy='' //名称首字母拼音
                }
            }
        },
        ssShow(){
        this.showsss = false
        this.changeDialogVisible(4,true)
      },
     //资格审核预检查
      async getExamineBefore(index,type,show){//911200006008904220
    //   if(show){
          var number = false
        if(this.from4.salesId === '' || this.from4.salesId === null ||this.from4.salesId === 'null'){number = true}
        if(this.from4.principalId === ''  || this.from4.principalId === null ||this.from4.principalId === 'null'){number = true}
        if(this.from4.level === '' || this.from4.level === null ||this.from4.level === 'null'){number = true}
        if(this.from4.socialCreditCode === '' || this.from4.socialCreditCode === null ||this.from4.socialCreditCode === 'null'){number = true}
        if(this.from4.agentName === '' || this.from4.agentName === null ||this.from4.agentName === 'null'){number = true}
        if(number){return this.$message.error("请完整填写信息")}
        var obj={
          'socialCreditCode':this.from4.socialCreditCode,
        //   'socialCreditCode':'911200006008904220',
          'id':this.from4.id,
        }
        var data = await this.$http.post(this.$service.perExamine,obj)
        // console.log(data.data);
        if(data.data){
          this.from4.oldAgentId = data.data.id
          this.showsss = true
          this.getExamineShow = false
        }else{
            this.getExamineShow = false
            this.from4.oldAgentId = null
            this.changeDialogVisible(4,true)
        }
    //   }else{
    //       this.$message.error('请先点击认证')
    //   }
      },
        // 验证11位电话
        phoneLenght(val){
            if(val==null || val=='' || val.length != 11){
                this.showPhone1 = true
            }else{
                this.showPhone1 = false
            }
        },
        changeHistory(arr){
            // console.log(arr);
            this.historyArray = arr
        },
        //弹出提示
        chaWarn(){
            this.chaWarnNum = 1
        },
        // 初始数据
        changeForm(index){
            if(index == 5){
                this.from5 = JSON.parse(JSON.stringify(this.indexObj))
                this.from5.namePy = this.from5.namePy?this.from5.namePy.toUpperCase():''
                this.show = false
            }else if(index == 1){
                this.show = true
            }else if(index == 2){
                this.from2 = JSON.parse(JSON.stringify(this.indexObj))
            }else if(index == 6){
                this.from6.level = JSON.parse(JSON.stringify(this.indexObj.level))
                this.from6.id = JSON.parse(JSON.stringify(this.indexObj.id))
            }else if(index == 4){
                this.from4.level = JSON.parse(JSON.stringify(this.indexObj.level))
                this.from4.id = JSON.parse(JSON.stringify(this.indexObj.id))
                this.from4.salesId = JSON.parse(JSON.stringify(this.indexObj.salesId))
                this.from4.principalId = JSON.parse(JSON.stringify(this.indexObj.principalId))
                this.from4.agentName = JSON.parse(JSON.stringify(this.indexObj.agentName))
                this.from4.namePy = JSON.parse(JSON.stringify(this.indexObj.namePy))
                this.from4.socialCreditCode = JSON.parse(JSON.stringify(this.indexObj.socialCreditCode))
                this.from4.fileUrl = JSON.parse(JSON.stringify(this.indexObj.fileUrl))
                this.from4.oldAgentId = null
            }else if(index == 7){
                this.from7.id = JSON.parse(JSON.stringify(this.indexObj.id))
            }else if(index == 8){
                this.from8.level = JSON.parse(JSON.stringify(this.indexObj.level))
                this.from8.id = JSON.parse(JSON.stringify(this.indexObj.id))
                this.from8.salesId = JSON.parse(JSON.stringify(this.indexObj.salesId))
                this.from8.principalId = JSON.parse(JSON.stringify(this.indexObj.principalId))
            }else if(index == 10){
                // this.from10.fileUrl= JSON.parse(JSON.stringify(this.indexObj.fileUrl))
                // console.log(this.from10.fileUrl+"______",this.indexObj.fileUrl);
                // this.from10.dominantRoute= JSON.parse(JSON.stringify(this.indexObj.dominantRoute))//优势航线
                this.from10 = JSON.parse(JSON.stringify(this.indexObj))
                // console.log("1010101010:",this.from10);
            }
        },
        showEdf(type,obj){
            var showType = 1
            if(type == 1){
                if(obj.agentName===null || obj.agentName===''){
                    showType = 0
                }//供应商名称
                if(obj.socialCreditCode===null ||obj.socialCreditCode==''){
                    showType = 0
                    setTimeout(() => {
                        this.rztype == 'falses'
                    }, 0);} //统一社会信用代码
                if(obj.namePy===null ||obj.namePy===''){showType = 0} //名称首字母拼音
                // if(obj.principalName==''){showType = 0} //航线负责人
                if(obj.principalId===null ||obj.principalId===''){showType = 0}//航线负责人id
                if(obj.salesId===null ||obj.salesId===''){showType = 0} //一代操作人员id
                // if(obj.salesName==''){showType = 0} //一代操作人员
                // if(obj.contactsName==''){showType = 0} //联系人名称
                if(obj.phoneNum===null || obj.phoneNum === ''){
                    showType = 0
                    } else if(obj.phoneNum.length < 11){
                    this.showPhone1 = true
                    } //联系人电话
                if(obj.isCooperation===null ||obj.isCooperation === ''){showType = 0}
                if(obj.isContract===null ||obj.isContract === ''){showType = 0}
                if(obj.settlementWay===null ||obj.settlementWay === ''){showType = 0}
                if(obj.settlementDays===null ||obj.settlementDays === ''){showType = 0}
                if(obj.creditLimit===null ||obj.creditLimit === ''){showType = 0}
                if(obj.airlineComment==null ||obj.airlineComment === ''){showType = 0}
                if(obj.isCooperation=='0'){this.from1.isContract=0}
                // if(obj.creditLimit=='/'){this.from1.settlementDays= '/'}
                // if(obj.fileUrl==''){showType = 0}//营业执照全路径地址
            }else if(type == 5){
                 if(obj.agentName==null || obj.agentName==''){
                    showType = 0
                }//供应商名称
                if(obj.socialCreditCode==null ||obj.socialCreditCode==''){showType = 0} //统一社会信用代码
                if(obj.namePy==null ||obj.namePy==''){showType = 0} //名称首字母拼音
                // if(obj.principalName==''){showType = 0} //航线负责人
                if(obj.principalId==null ||obj.principalId==''){showType = 0}//航线负责人id
                if(obj.salesId==null ||obj.salesId==''){showType = 0} //一代操作人员id
                // if(obj.salesName==''){showType = 0} //一代操作人员
                // if(obj.contactsName==''){showType = 0} //联系人名称
                if(obj.phoneNum==null || obj.phoneNum == ''){
                    showType = 0
                    }else if(obj.phoneNum.length < 11){
                    // console.log('联系人电话<11:'+obj.phoneNum);
                    this.showPhone1 = true
                    } //联系人电话
                if(obj.isCooperation==null ||obj.isCooperation === ''){showType = 0}
                if(obj.isContract==null ||obj.isContract === ''){showType = 0}
                if(obj.settlementWay==null ||obj.settlementWay === ''){showType = 0}
                if(obj.settlementDays==null ||obj.settlementDays === ''){showType = 0}
                if(obj.creditLimit==null ||obj.creditLimit === ''){showType = 0}
                if(obj.airlineComment==null ||obj.airlineComment === ''){showType = 0}
                if(obj.isCooperation=='0'){this.from5.isContract=0}
                // if(obj.creditLimit=='/'){this.from5.settlementDays= '/'}
                // console.log(obj);
            }
            if(showType == 1){
                this.show = false
            }else{
                this.show = true
            }
        },
        // 图片预览
        handlePictureCardPreview(file) {
            if(file === 1){
                this.fromObjImageUrl = JSON.parse(JSON.stringify(this.from1)).fileUrl
            }else if(file === 4){
                this.fromObjImageUrl = JSON.parse(JSON.stringify(this.from4)).fileUrl
            }else if(file === 5){
                this.fromObjImageUrl = JSON.parse(JSON.stringify(this.from5)).fileUrl
            }else if(file === 10){
                this.fromObjImageUrl = JSON.parse(JSON.stringify(this.from10)).fileUrl
            }
            this.dialogVisibles = true;
        },
        jsfs(num,type){
            // console.log(num,type);
            if(num === 1){
                if(type === 1){
                    this.$set(this.from1, 'settlementDays', '/')
                    this.$set(this.from1, 'creditLimit', '/')
                }
                if(type === 2){
                    this.$set(this.from1, 'settlementDays', '15')
                    this.$set(this.from1, 'creditLimit', '')
                }
                if(type === 3){
                    this.$set(this.from1, 'settlementDays', '')
                    this.$set(this.from1, 'creditLimit', '')
                }
            }else if(num === 5){
                if(type === 1){
                    this.$set(this.from5, 'settlementDays', '/')
                    this.$set(this.from5, 'creditLimit', '/')
                }
                if(type === 2){
                    this.$set(this.from5, 'settlementDays', '15')
                    this.$set(this.from5, 'creditLimit', '')
                }
                if(type === 3){
                    this.$set(this.from5, 'settlementDays', '')
                    this.$set(this.from5, 'creditLimit', '')
                }
            }
        },
        // 图片上传
        async beforeAvatarUpload(file) {
            // console.log(file);
            console.log(file.type);
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/pdf' || file.type === 'image/jpg' || file.type === 'application/pdf' || file.type === 'image/bmp')?true:false
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isJPG) {
            this.$message.error('上传图片/文件只能是 JPG、JPG、PDF、PNG格式!');
            return
            }
            if (!isLt10M) {
            this.$message.error('上传图片/文件大小不能超过 10MB!');
            return
            }
            const fileFormData = new FormData();
            fileFormData.append("image", file);
            this.loading = true
            try {
                const data = await this.$http.post(
                    this.$service.uploadImage,
                    fileFormData,
                    // {
                    //     params: {
                    //     attachType: 1,
                    //     orderId: this.orderId,
                    //     },
                    // }
                );
                if (data) {
                    // this.images.push(data);
                    // console.log(data);
                    if(this.dialogVisible == 1){
                        this.from1.fileUrl = data
                        // console.log(this.from1);
                    }
                    if(this.dialogVisible == 5){
                        this.from5.fileUrl = data
                        // console.log(this.from5);
                    }
                    if(this.dialogVisible == 4){
                        this.$set(this.from4, 'fileUrl', data)
                    }
                    this.$message.success("上传成功")
                } else {
                    this.$message.error(message);
                }
                this.loading = false
            } catch (error) {
                this.loading = false
            }
        },
        // 通过名称或社会统一信用代码获取公司基本信息 、、认证
        async getCompanyInfo (type){//code 代理公司的名称或统一社会信用代码
            if(this.rztype == 'falses' && this.dialogVisible == 1){return}
            
            if(type == 'from4'){
                console.log(this.from4.socialCreditCode);
                if(this.from4.socialCreditCode == '' || this.from4.socialCreditCode == null || this.from4.socialCreditCode == 'null'){return this.$message.error('请输入社会统一信用代码');}
                this.socialCreditCode = this.from4.socialCreditCode
                var obj = this.from4.socialCreditCode //91520000214434146R

            }else{
                if(this.from1.socialCreditCode == '' || this.from4.socialCreditCode == null || this.from4.socialCreditCode == 'null'){return this.$message.error('请输入社会统一信用代码');}
                this.socialCreditCode = this.from1.socialCreditCode
                var obj = this.from1.socialCreditCode //91520000214434146R
            }
          var data =  await this.$http.post(this.$service.getCompanyInfo,obj)
          if(data.code == 200){
              if(data.data.message == '企业名称录入错误，未找到数据'){
                this.$message.error('未找到对应企业名称,请检查信用代码')
                this.rztype = 'falses'
                this.getExamineShow = false
              }else if(type == 'from4'){
                this.from4.agentName = data.data.name
                this.from4.namePy = data.data.namePy?(data.data.namePy).toUpperCase():'' //转大写
                this.getExamineShow = true
                this.$message.success('认证成功')
              }else{
                this.from1.agentName = data.data.name
                this.from1.namePy = data.data.namePy?(data.data.namePy).toUpperCase():'' //转大写
                this.$message.success('认证成功')
              }
              
        //   console.log(data.data);
          }else{
                this.$message.error(data.message)
            }
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
            console.log(item);
        },
        // 保存更改
        changeDialogVisible(type,save){
            // console.log(type);
            this.show = false
            this.showPhone1 = false
            if(type == 1){
                var obj = {
                    from:this.from1,
                    type:1,
                    save:save,
                }
                this.$emit('changeDialogVisible',obj)
                this.from1 = {
                    agentName:'', //供应商名称
                    socialCreditCode:'', //统一社会信用代码
                    namePy:'', //名称首字母拼音
                    principalName:'', //航线负责人
                    principalId:'',//航线负责人id
                    salesId:'', //一代操作人员id
                    salesName:'', //一代操作人员
                    contactsName:'', //代理联系人名称
                    phoneNum:'', //代理联系人电话
                    busName:'', //企业联系人
                    busPhone:'', //企业联系人电话
                    fileUrl:'', //营业执照全路径地址
                    isCooperation:1,
                    isContract:1,
                    settlementWay:1,
                    settlementDays:'/',
                    creditLimit:'/',
                    airlineComment:'',
                }
            }else if(type == 2){
                var obj = {
                    from:this.from2,
                    type:2,
                    save:save,
                }
                this.$emit('changeDialogVisible',obj)
                this.from2 = {
                    phoneNum:'',
                    password:'',
                    agentName:'',
                    socialCreditCode:'',
                    id:''
                }
            }else if(type == 3){
                var obj = {
                    from:this.from3,
                    type:3,
                    save:save,
                }
                this.$emit('changeDialogVisible',obj)
            }else if(type == 4){
                var obj = {
                    from:this.from4,
                    type:4,
                    save:save,
                }
                this.$emit('changeDialogVisible',obj)
                this.from4 = {
                        salesId:'',//一代操作
                        principalId:'',//航线负责人
                        id:'',
                        level:'',
                        status:1,
                        socialCreditCode:'',
                        namePy:'',
                        agentName:'',
                        fileUrl:'',
                        examineMassage:'审核通过',
                        oldAgentId:null,
                    }
            }else if(type == 5){
                var obj = {
                    from:this.from5,
                    type:5,
                    save:save,
                }
                this.$emit('changeDialogVisible',obj)
            }else if(type == 6){
                var obj = {
                    from:this.from6,
                    type:6,
                    save:save,
                }
                this.$emit('changeDialogVisible',obj)
            }else if(type == 7){
                var obj = {
                    from:this.from7,
                    type:7,
                    save:save,
                }
                this.$emit('changeDialogVisible',obj)
                this.from7 = {
                        id:'',
                        status:2,
                        examineMassage:''
                    }
            }else if(type == 8){
                var obj = {
                    from:this.from8,
                    type:8,
                    save:save,
                }
                this.$emit('changeDialogVisible',obj)
                this.from8 = {
                        salesId:'',//一代操作
                        principalId:'',//航线负责人
                        id:'',
                        level:'',
                        status:1,
                        examineMassage:'',
                    }
            }else if(type == 10){
                var obj = {
                    from:this.from10,
                    type:10,
                    save:save,
                }
                console.log('关闭10');
                this.from10 = {
                    fileUrl:'',
                    dominantRoute:''//优势航线
                }
                this.$emit('changeDialogVisible',obj)
            }
            this.indexObj = {
              agentName:'', //供应商名称
              socialCreditCode:'', //统一社会信用代码
              namePy:'', //名称首字母拼音
              principalName:'', //航线负责人
              principalId:'',//航线负责人id
              salesId:'', //一代操作人员id
              salesName:'', //一代操作人员
              contactsName:'', //联系人名称
              phoneNum:'', //联系人电话
              fileUrl:'', //营业执照全路径地址
          }
        },
        handleClose(done) {
            this.show = false
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        }
    }
  };
</script>
<style scoped>
 /* img{
     border: 1px solid black;
 } */
 .avatar-uploader .el-upload {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
    z-index: 0;
  }
  .avatar-uploader-icon{
      width: 100%;
    height: 100%;
  }
  .spanrz{
    position: absolute;
    display: block;
    width: 60px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    color: #409EFF;
    right:-50px;
    top:0;
  }
  .falses{
    color: #a7a7a7;
    cursor: auto;
  }
  .trues{
    color: #409EFF;
    cursor: pointer;
  }
  .spanrII{
    position: absolute;
    display: block;
    border: 1px solid #fea100 ;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    color: #fea100;
    font-size: 20px;
    right:-40px;
    top:5px;
  }
</style>