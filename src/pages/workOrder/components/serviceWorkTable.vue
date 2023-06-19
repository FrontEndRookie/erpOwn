<template>
  <div class="content-wrapper">
    <el-form :inline="true" size="medium" class="demo-form-inline">
      <div class="content-search-normal">
        <el-form-item label="目的港:" style="margin-left: 15px">
          <el-select
            v-model="selectResult.pod"
            id="pod"
            placeholder="目的港三字码"
            :remote-method="initAirportSearchByPage"
            ref="limitInput1"
            :loading="loading"
            @change="getCurrentData"
            clearable
            filterable
            remote
            reserve-keyword
          >
            <el-option
              v-for="item in podOpt"
              :disabled="pol == item.threeLetterCode"
              :key="item.threeLetterCode"
              :value="item.threeLetterCode"
            >
              <span>{{ item.threeLetterCode }}</span>
              <span style="margin-left: 5px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="航线姓名" label-width="80px">
          <el-select
            v-model="selectResult.principalId"
            id="airlineName"
            ref="limitInput2"
            placeholder="请输入航线"
            clearable
            filterable
            remote
            reserve-keyword
            style="width: 210px"
          >
            <el-option
              v-for="item in airManger"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间" label-width="80px">
          <el-date-picker
            style="width: 150px"
            v-model="selectResult.startCommitDate"
            type="date"
            :picker-options="pickerOptionsStartOne"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker
          >-
          <el-date-picker
            style="width: 150px"
            v-model="selectResult.endCommitDate"
            type="date"
            :picker-options="pickerOptionsEndOne"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否实单:" label-width="80px">
          <el-select v-model="selectResult.workOrderType" style="width: 210px">
            <el-option
              v-for="(item, index) in ifTrueOrder"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="searchClick('default')"
            size="mini"
            type="primary"
            icon="el-icon-search"
            v-auth="['401000_B']"
            >查询</el-button
          >
        </el-form-item>
      </div>
      <div class="operateButton">
        <div class="operateLeft">
          <el-button
            :type="dateFlag == 1 ? 'primary' : ''"
            plain
            size="mini"
            @click="timeChoose(1)"
            >今天</el-button
          >
          <el-button
            :type="dateFlag == 2 ? 'primary' : ''"
            plain
            size="mini"
            @click="timeChoose(2)"
            >昨日</el-button
          >
          <el-button
            :type="dateFlag == 3 ? 'primary' : ''"
            plain
            size="mini"
            @click="timeChoose(3)"
            >上周</el-button
          >
          <el-button
            :type="dateFlag == '0' ? 'primary' : ''"
            plain
            size="mini"
            @click="timeChoose(0)"
            >全部</el-button
          >
        </div>
        <div class="operateRight">
          <el-button
            @click="openWorkOrder"
            size="mini"
            type="warning"
            style="
              border: 1px solid rgb(245, 154, 35) !important;
              backgroundcolor: rgb(245, 154, 35) !important;
            "
            v-auth="['401004_B']"
            >新建询单</el-button
          >
          <el-button @click="exportCstListExcel" size="mini" type="primary" v-auth="['401002_B']"
            >导出列表</el-button
          >
          <div class="upFilter" @click="upFilter">
            <img
              style="width: 15px; height: 15px"
              src="../../../assets/workOrderFilter.svg"
              alt=""
            />
            高级筛选
          </div>
        </div>
      </div>
    </el-form>
    <!-- 高级筛选弹框 -->
    <el-dialog :visible.sync="upFilterDial" title="筛选" width="830px">
      <el-form class="upFilterForm" label-position="left">
        <el-form-item label="目的港" label-width="80px" style="width: 300px">
          <el-select
            v-model="selectResult.pod"
            id="pod1"
            placeholder="目的港三字码"
            :remote-method="podMethod"
            :loading="loading"
            @change="getCurrentData"
            clearable
            filterable
            remote
            reserve-keyword
            style="width: 210px"
          >
            <el-option
              v-for="item in podOpt"
              :disabled="pol == item.threeLetterCode"
              :key="item.threeLetterCode"
              :value="item.threeLetterCode"
            >
              <span>{{ item.threeLetterCode }}</span>
              <span style="margin-left: 5px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="提交时间"
          label-width="70px"
          style="width: 420px; margin-left: 10px"
        >
          <el-date-picker
            style="width: 150px"
            v-model="selectResult.startCommitDate"
            type="date"
            :picker-options="pickerOptionsStartOne"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker
          >-
          <el-date-picker
            style="width: 150px"
            v-model="selectResult.endCommitDate"
            type="date"
            :picker-options="pickerOptionsEndOne"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="航线姓名" label-width="80px" style="width: 300px">
          <el-select
            v-model="selectResult.principalId"
            placeholder="请输入航线"
            id="airlineName1"
            clearable
            filterable
            remote
            reserve-keyword
            style="width: 210px"
          >
            <el-option
              v-for="item in airManger"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="提交者"
          label-width="70px"
          style="width: 420px; margin-left: 10px"
        >
          <el-select
            v-model="selectResult.creatorId"
            placeholder="请输入提交者"
            id="commitPeople1"
            clearable
            filterable
            remote
            reserve-keyword
            style="width: 310px"
          >
            <el-option
              v-for="item in commitPeople"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="询单状态:" label-width="80px" style="width: 300px">
          <el-select v-model="selectResult.status" style="width: 210px">
            <el-option
              v-for="(item, index) in workOrderStatus"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="询单编号"
          label-width="70px"
          style="width: 420px; margin-left: 10px"
        >
          <el-input
            id="workOrderNo1"
            v-model="selectResult.workOrderNo"
            style="width: 310px"
            size="medium"
            :maxlength="11"
            clearable
            placeholder="请输入询单编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否实单:" label-width="80px" style="width: 300px">
          <el-select v-model="selectResult.workOrderType" style="width: 210px">
            <el-option
              v-for="(item, index) in ifTrueOrder"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="upFilterFooter">
        <el-button type="info" @click="upFilterDial = false">取消</el-button>
        <el-button type="primary" @click="advanceFilter">确定</el-button>
      </div>
    </el-dialog>
    <!-- 新建询单弹框 -->
    <el-dialog
      :visible.sync="workOrderDial"
      title="询单提交"
      width="960px"
      style="padding-bottom: 25px"
      :before-close="handleClose"
    >
      <div style="padding-top: 10px">
        <el-input
          class="bigInput"
          type="textarea"
          :rows="2"
          @change="getKeyWords($event)"
          placeholder="请输入内容"
          maxlength="150"
          show-word-limit
          v-model="form.content"
        >
        </el-input>
        <el-form
          style="display: flex; margin-top: 10px; flex-wrap: wrap"
          label-position="center"
        >
          <el-form-item
            label="目的港"
            label-width="70px"
            style="width: 200px"
            required
          >
            <el-input
              style="width: 100px"
              size="medium"
              v-model.trim="newMessage.pod"
              @blur="getCountry()"
              maxlength="4"

            >
            </el-input>
          </el-form-item>
          <el-form-item label="件数" label-width="70px" style="width: 200px">
            <el-input
              style="width: 140px"
              size="medium"
              v-model="newMessage.piece"
              maxlength="8"
              onkeyup="this.value = this.value.replace(/[^\d]/g,'');"
              @blur="newMessage.piece = $event.target.value"
            >
              <template slot="append">PCS</template>
            </el-input>
          </el-form-item>
          <el-form-item label="毛重" label-width="70px" style="width: 220px">
            <el-input
              style="width: 150px"
              size="medium"
              v-model.number="newMessage.weight"
              maxlength="8"
              onkeyup="this.value = this.value.replace(/[^\d]/g,'');"
              @blur="newMessage.weight = $event.target.value"
            >
              <template slot="append">KG</template>
            </el-input>
          </el-form-item>
          <el-form-item label="体积" label-width="70px" style="width: 240px">
            <el-input
              style="width: 170px"
              size="medium"
              v-model="newMessage.cbm"
              onkeyup="this.value= this.value.match(/^-?\d{0,6}(\.\d{0,4})?/)? this.value.match(/^-?\d{0,6}(\.\d{0,2})?/)[0] : ''"
              @blur="newMessage.cbm = $event.target.value"
              maxlength="9"
            >
              <template slot="append">CBM</template>
            </el-input>
          </el-form-item>
          <el-form-item label="国家" label-width="70px" style="width: 200px">
            <el-input
              style="width: 100px"
              size="medium"
              disabled
              v-model="newMessage.podCountry"
            ></el-input>
          </el-form-item>
          <el-form-item label="尺寸" label-width="70px" style="width: 200px">
            <el-input
              style="width: 140px"
              size="medium"
              v-model="newMessage.size"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="比重" label-width="70px" style="width: 200px">
            <el-input
              style="width: 140px"
              size="medium"
              v-model="newMessage.vwr"
              disabled
            >
            </el-input>
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item label="货好时间" required label-width="200px">
            <el-date-picker
              value-format="yyyy-MM-dd"
              type="date"
              v-model="newMessage.cargoReadyDate"
              :picker-options="pickAfterData"
              placeholder="选择货好时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="询单类型" label-width="200px">
            <el-select
              v-model="form.workOrderType"
              placeholder="请选择询单类型"
            >
              <el-option
                v-for="item in workOrderType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="航线人员" label-width="200px">
            <el-select
              v-model="form.airLinePeople"
              multiple
              collapse-tags
              filterable
              multiple-limit="6"
              clearable
              placeholder="请选择航线人员"
            >
              <el-option
                v-for="item in airManger"
                :key="item.value"
                :label="item.name"
                :value="item.name + '/' + item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" label-width="200px">
            <el-input
              v-model="form.remark"
              style="width: 220px;"
              type="textarea"
              :rows="2"
              maxlength="50"
              placeholder="请输入备注内容"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="文件"  label-width="200px">
             <el-upload
                         style="margin-left:230px"
                         action="#"
                         drag
                        auto-upload="false"
                        class="avatar-uploader"
                        accept=".pdf, .doc, .docx, .xls, .xlsx"
                        :before-upload="beforeAvatarUpload"
                        >
                        <div v-if="form.fileUrl" style="height:150px">
                          <img  
                          :src="uploadFile"   
                          width="140px" height="135px" class="avatar">
                          <span style="font-size:12px">{{uploadFileName}}</span>
                        </div>
                        <div v-else style="margin-top:45px">
                          <i  class="el-icon-folder-add " style="font-size:40px"></i>
                          <div style="margin-top:15px;font-size:13px;white-space:wrap">点击选择文件或拖曳至此</div>
                        </div>
                    </el-upload>
                    <div v-show="form.fileUrl" style="position: absolute;top: 0;left: 380px; height: 20px;width: 20px;font-size: 20px;">
                        <i @click='previewOffice' class="el-icon-zoom-in" title="点击预览"></i>
                    </div>
                    <div v-show="form.fileUrl" style="position: absolute;top: 0;left: 340px; height: 20px;width: 20px;font-size: 20px;">
                        <i  class="el-icon-circle-close" title="点击删除" @click="form.fileUrl=''"></i>
                    </div>
                  
          </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <div slot="footer" class="dialog-footer">
          <div style="text-align: center; ">
            <el-button size="medium" type="primary" @click="newWorkOrder"
              >提交</el-button
            >
            <el-button size="medium " style="margin-left:20px" @click="workOrderDial = false"
              >取 消
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-table
      ref="tableService"
      :data="tableData"
      border
      header
       :row-class-name="tableRowClassName"
      @row-click="rowClick"
      :cell-style="tableRowStyle"
      @sort-change="sortChange"
      class="finance-talbe"
      style="width: 100%"
    >
      <template slot="empty">
        <img class="data-pic" src="@/assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      <el-table-column
        prop="createTime"
        :sortable="versionType == '0' ? true : false"
        label="提交时间"
        min-width="80"
      ></el-table-column>
      <el-table-column
        prop="userName"
        :sortable="versionType == '0' ? true : false"
        label="提交者"
        min-width="80"
      ></el-table-column>
      <el-table-column
        label="目的港"
        :sortable="versionType == '0' ? true : false"
        prop="pod"
        min-width="40"
      ></el-table-column>
      <el-table-column
        label="件/毛/体"
        prop="cargoInfo"
        min-width="80"
      ></el-table-column>
      <el-table-column label="催单" min-width="80">
        <template slot-scope="scope">
          <el-button
            disabled
            type="info"
            size="mini"
            style="
              width: 68px;
              background-color: #909399;
              color: #fff;
              border: 0;
            "
            v-if="scope.row.status == 3"
            >已关闭</el-button
          >
          <el-button
            @click="remindOrder(scope.row.id)"
            type="primary"
            size="mini"
            style="width: 68px"
            v-else-if="
              scope.row.canRemind == 1 && scope.row.roundsRemindCount == 0
            "
            v-auth="['401003_B']"
            >催单</el-button
          >
          <el-button
            disabled
            type="info"
            size="mini"
            style="
              width: 68px;
              background-color: #909399;
              color: #fff;
              border: 0;
            "
            v-else-if="
              scope.row.canRemind == 0 && scope.row.roundsRemindCount == 0
            "
            v-auth="['401003_B']"
            >催单</el-button
          >
          <el-button
            @click="remindOrder(scope.row.id)"
            type="warning"
            size="mini"
            style="background: rgb(245, 154, 35) !important"
            v-else-if="scope.row.canRemind == 1 && scope.row.roundsRemindCount"
            >已催单{{ scope.row.roundsRemindCount }}</el-button
          >
          <el-button
            disabled
            type="warning"
            size="mini"
            style="
              width: 68px;
              background-color: #909399;
              color: #fff;
              border: 0;
            "
            v-else-if="scope.row.canRemind == 0 && scope.row.roundsRemindCount"
            >已催单{{ scope.row.roundsRemindCount }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="消息内容" min-width="120" prop="lastMsgContent">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="询单详情"
        min-width="80"
        class="allColumn"
      >
        <template slot-scope="scope">
          <el-popover
            popper-class="chatRoom"
            placement="bottom"
            width="200"
            trigger="manual"
            :ref="`popover${scope.$index}`"
          >
            <chatRoom
              v-if="!scope.row.arrow"
              @closeChatRoom="closePopover(scope.$index)"
              :scaleChat="true"
              style="transform: scale(0.6); transform-origin: -5%"
              :fromPageType="1"
              @getNewData="getNewData"
              :workOrderId="workOrderId"
              :extraData="extraData"
              :titleNo="titleNo"
              :contentMessage.sync="contentMessage"
              :workOrderType="workOrderTypeC"
            ></chatRoom>
            <div
              slot="reference"
              style="color: #02a7f0"
              @click.stop="changeRows(scope.$index,scope.row.id,true)"
            >
              详情
              <img
                :src="
                  scope.row.arrow
                    ? require('@/assets/xiajiantou.png')
                    : require('@/assets/shangjiantou.png')
                "
                alt=""
                style="width: 10px; height: 10px"
              />
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="workOrderType"
        :sortable="versionType == '0' ? true : false"
        label="询单类型"
        min-width="80"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.workOrderType | getData(1) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="workOrderNo"
        :sortable="versionType == '0' ? true : false"
        label="询单编号"
        min-width="80"
      ></el-table-column>

      <el-table-column
        prop="status"
        :sortable="versionType == '0' ? true : false"
        label="询单状态"
        min-width="80"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.status | getData(4) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="principalNames"
        label="航线人员"
        min-width="80"
      ></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-sizes="[10, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="text-align: right; padding: 19px 30px 18px 0; background: #fff"
    >
    </el-pagination>
  </div>
</template>
<script>
import chatRoom from "./chatRoom";
import scrollNotice from "@/components/scrollNotice";
import { exportFile } from "@/util/util.js";
export default {
  components: {
    scrollNotice,
    chatRoom,
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    versionType: {
      type: String,
      default: "0",
    },
  },
  created() {
    if (
      sessionStorage.getItem("lastPageNum") &&
      JSON.parse(sessionStorage.getItem("lastPageNum")).pageNum
    ) {
      this.pageNum = Number(
        JSON.parse(sessionStorage.getItem("lastPageNum")).pageNum
      );
    }
  },
  mounted() {
    //  let thisS = this
    // document.querySelectorAll('.content-wrapper')[0].onclick = function(e) {
    //     if((document.getElementsByClassName("el-table")[0] && document.getElementsByClassName("el-table")[0].contains(e.target))) {
    //     }else {
    //       thisS.clickAthor = true
    //     }
    //   }
    this.limitInput();
    //表格数据定时器
    // this.tableTimer = setInterval(()=>{this.searchClick()},5000)
    // this.pageRoleName = JSON.parse(sessionStorage.getItem("userInfo")).name;
    this.$http
      .post(this.$service.searchPrcpUserByPage, { pageNum: 1, pageSize: 5000 })
      .then((data) => {
        this.airManger = data.data.records;
      });
    this.$http
      .post(this.$service.searchCstUserByPage, { pageNum: 1, pageSize: 5000 })
      .then((data) => {
        this.commitPeople = data.data.records;
      });
    document.addEventListener("compositionstart", (e) => {
      this.flag = true;
    });
    document.addEventListener("compositionend", (e) => {
      this.flag = false;
    });
    this.initAirportSearchByPage();
    this.searchClick("fast");
  },
  data() {
    return {
      uploadFile:'',
      uploadFileType:'',
      uploadFileName:'',
      clickAthor:false,
      //聊天室
      //标题
      titleNo: "",
      //聊天成员及内容
      contentMessage: {},
      //询单或实单
      workOrderTypeC: -1,
      workOrderId: "",
      extraData:'',
      flag: false,
      //判断查询的类型
      searchType: "fast",
      //日期选择按钮
      dateFlag: 1,
      //高级筛选弹框
      upFilterDial: false,
      podOpt: [],
      filterResult: {},

      pickAfterData: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      newMessage: {
        vwr: "",
        pod: "",
        piece: "",
        cbm: "",
        weight: "",
        cargoReadyDate: "",
        size: "",
        podCountry: "",
      },
      copyPod: "",
      //表格数据定时器
      tableTimer: null,
      // pageRoleName: "",
      //新建询单弹框
      workOrderDial: false,
      //新建询单弹框结果
      form: { workOrderType: "", remark: "", airLinePeople: [] ,fileUrl:'',fileName:'',fileSize:''},
      //
      workOrderType: [
        { label: "询价", value: 0 },
        { label: "实单", value: 1 },
      ],
      //航线搜索框
      airManger: [],
      //提交者搜索框
      commitPeople: [],
      //询单状态搜索框
      workOrderStatus: [
        { value: "", label: "全部" },
        { value: "2", label: "已回复" },
        { value: "0", label: "待回复" },
      ],
      ifTrueOrder: [
        { value: "", label: "全部" },
        { value: "1", label: "实单" },
        { value: "0", label: "询价" },
      ],
      //搜索框结果
      selectResult: {
        pod: "",
        workOrderNo: "",
        endCommitDate: "",
        startCommitDate: "",
        principalId: "",
        status: "",
        workOrderType: "",
        creatorId: "",
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      popoverVisible: false,
      //询单详情popover
      workOrderDetail: {
        title: "",
        unFeedbackUsers: "",
        messages: [],
        content: "",
        principalUsers: [],
        principalResult: "",
        actualInfo: "",
      },
      workOrderBox: [],
      //提交时间
      // 限制结束日期大于开始日期
      pickerOptionsStartOne: {
        disabledDate: (time) => {
          let endDateVal = this.selectResult.endCommitDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        },
      },
      pickerOptionsEndOne: {
        disabledDate: (time) => {
          let beginDateVal = this.selectResult.startCommitDate;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        },
      },
      //表格排序
      sortBy: "",
      sortPath: "",
      //导出列表请求数据
      exportListData: "",
    };
  },
  watch: {
    versionType(){
      this.dateFlag = 1
      this.searchClick("fast")
    },
    copyPod(newValue) {
      this.$http
        .get(this.$service.searchByAirportCode + "?airportCode=" + newValue)
        .then((res) => {
          this.newMessage.podCountry =
            res.data && res.data.country ? res.data.country : "";
        });
    },
    'newMessage.weight'(){
      if(this.newMessage.weight&&this.newMessage.cbm){
        this.newMessage.vwr =`1:${Math.round(this.newMessage.weight / this.newMessage.cbm)}` 
      }else{
        this.newMessage.vwr =""
      }
    },
    'newMessage.cbm'(){
       if(this.newMessage.weight&&this.newMessage.cbm){
        this.newMessage.vwr =`1:${Math.round(this.newMessage.weight / this.newMessage.cbm)}` 
      }else{
        this.newMessage.vwr =""
      }
    },
  },
  methods: {
    previewOffice(){
      if(this.uploadFileType!='pdf'){
        this.$utils.previewOffice({ xpath: this.form.fileUrl })
      } else {
         ELEMENT.MessageBox({
          dangerouslyUseHTMLString: true,
          title:'预览',
          message: `<iframe src="${this.form.fileUrl}" style="width: 60vw; height: 80vh"></iframe>`,
          center: true,
          showConfirmButton: false,
          customClass: "image-preview-message-box",
        })
      .then(() => { })
      .catch(() => { });
      }
    },
  // 新建询单文件上传
        async beforeAvatarUpload(file) {
            // console.log(file);
            let fileType = {
              xls: 'application/vnd.ms-excel',
              xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              doc: "application/msword",
              pdf: "application/pdf"
            }
            if(!Object.values(fileType).includes(file.type)){
              this.$message.error('上传文件格式错误!');
              return
            }
         
            const isLt10M = file.size / 1024 < 200;
            if (!isLt10M) {
            this.$message.error('上传图片/文件大小不能超过 200kb!');
            return
            }
            const fileFormData = new FormData();
            fileFormData.append("file", file);
            try {
                const data = await this.$http.post(
                    this.$service.orderUpload,
                    fileFormData,
                );
                if (data) {
                  if(file.type == fileType.xls ||file.type == fileType.xlsx  ){
                      this.uploadFile = require('../../../assets/excelIcon.svg')
                      this.uploadFileType = 'xls'

                    } else if(file.type == fileType.docx ||file.type == fileType.doc ){
                      this.uploadFile = require('../../../assets/wordIcon.svg')
                      this.uploadFileType = 'doc'

                    }else if(file.type == fileType.pdf) {
                      this.uploadFile = require('../../../assets/pdfIcon.svg')
                      this.uploadFileType = 'pdf'
                    }
                    this.uploadFileName = file.name
                    this.form.fileUrl = data.fileUrl
                    this.form.fileName = data.fileName
                    this.form.fileSize = data.fileSize
                    
                    this.$message.success("上传成功")
                } else {
                    this.$message.error(message);
                }
            } catch (error) {
            }
        },


    //跳转到聊天室
    jumpToDetail(val) {
      this.$emit("jumpToDetail", val.id);
    },
    // 排序
    sortChange(column) {
      var pr = column.prop;
      var type = column.order;
      //   console.log(pr,type)
      switch (pr) {
        case "createTime":
          this.sortBy = "0";
          break;
        case "userName":
          this.sortBy = "1";
          break;
        case "pod":
          this.sortBy = "2";
          break;
        case "workOrderType":
          this.sortBy = "3";
          break;
        case "workOrderNo":
          this.sortBy = "4";
          break;
        case "status":
          this.sortBy = "5";
          break;
      }
      if (type == "descending") {
        this.sortPath = "1";
      } else if (type == "ascending") {
        this.sortPath = "0";
      } else {
        this.sortBy = "";
        this.sortPath = "";
        this.searchClick(this.searchType);
        return;
      }
      this.searchClick(this.searchType, {
        sortBy: this.sortBy,
        sortPath: this.sortPath,
      });
    },
    //普通筛选 限制
    limitInput() {
      const input1 = document.querySelector("#pod");
      input1.setAttribute("maxLength", 3);
      input1.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            input1.value = input1.value.replace(/[^a-zA-Z]/gi, "");
          }, 0);
        }
      };

      const input2 = document.querySelector("#airlineName");
      input2.setAttribute("maxLength", 10);
      input2.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            input2.value = input2.value.replace(
              /[^\u4e00-\u9fa5a-zA-Z0-9]/g,
              ""
            );
          }, 0);
        }
      };
    },
    //高级筛选弹框 限制
    upFilterInput() {
      const input1 = document.querySelector("#pod1");
      input1.setAttribute("maxLength", 3);
      input1.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            input1.value = input1.value.replace(/[^a-zA-Z]/gi, "");
          }, 0);
        }
      };
      const input2 = document.querySelector("#airlineName1");
      input2.setAttribute("maxLength", 10);
      input2.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            input2.value = input2.value.replace(
              /[^\u4e00-\u9fa5a-zA-Z0-9]/g,
              ""
            );
          }, 0);
        }
      };
      const input3 = document.querySelector("#commitPeople1");
      input3.setAttribute("maxLength", 10);
      input3.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            input3.value = input3.value.replace(
              /[^\u4e00-\u9fa5a-zA-Z0-9]/g,
              ""
            );
          }, 0);
        }
      };
      const input4 = document.querySelector("#workOrderNo1");
      input4.setAttribute("maxLength", 11);
      input4.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            input4.value = input4.value.replace(/[^a-zA-Z0-9]/gi, "");
          }, 0);
        }
      };
    },
    //日期快捷筛选
    timeChoose(type) {
      this.dateFlag = type;
      this.searchClick("fast");
    },
    //高级筛选
    upFilter() {
      this.upFilterDial = true;
      this.$nextTick(() => {
        this.upFilterInput();
      });
    },
    //目的港三字码
    initAirportSearchByPage(keyWord) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then((data) => {
          if (data.code == 200) {
            this.podOpt = data.data.records;
          } else {
            this.$message.error(data.message);
          }
        });
    },
    //表格样式
    tableRowStyle({ row }) {
      if (row.status == 2) {
        return "background-color:rgba(250, 128, 114,0.8);border-bottom:1px solid white";
      }
    },
    //获取国家
    getCountry() {
      this.$http
        .get(
          this.$service.searchByAirportCode +
            "?airportCode=" +
            this.newMessage.pod
        )
        .then((res) => {
          this.newMessage.podCountry =
            res.data && res.data.country ? res.data.country : "";
        });
    },
    //获取关键字
    getKeyWords(e) {
      this.$http.post(this.$service.stringIfContent, e).then((data) => {
        if (data.code == 200) {
          let copy = data.data;
          this.newMessage.pod = copy.pod;
          this.copyPod = copy.pod;
          this.newMessage.piece = copy.piece;
          this.newMessage.cbm = copy.cbm;
          this.newMessage.weight = copy.weight;
          this.newMessage.vwr = Math.round(copy.weight / copy.cbm)
            ? Math.round(copy.weight / copy.cbm)
            : "";
        } else {
          this.$message.error(data.message);
        }
      });
    },
    //新建询单确认关闭
    handleClose(done) {
      this.$confirm("确认关闭？", { customClass: "confirmClass" })
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getNewData(id) {
      this.$http
        .get(this.$service.getSingleChatBox + "?workId=" + id)
        .then((res) => {
          if (res.code == 200) {
            this.titleNo = Object.keys(res.data.mesList)[0];
            this.$set(
              this.contentMessage,
              "chatMessage",
              Object.values(res.data.mesList)[0]
            );
            this.contentMessage.chatMember = res.data.workOrderMember;
            this.workOrderType = res.data.workOrderType;
            this.workOrderId = res.data.workOrderId;
            this.extraData = {title:res.data.title,remark:res.data.remark,size:res.data.size,cargoReadyDate:res.data.cargoReadyDate}
          } else {
            this.$message.error(res.message);
          }
        });
    },
    hidePopover(index){
      this.$set(
              this.tableData[index],
              "arrow",
              true
            );
             if(!this.clickAthor){
              this.hidePop = true
            }
    },
     //订单详情弹框右上角X关闭
    closePopover(index) {
       this.$set(
              this.tableData[index],
              "arrow",
              !this.tableData[index].arrow
            );
       this.$refs["popover" + index].showPopper =
              !this.$refs["popover" + index].showPopper;
              // this.clickAthor = true
    },
    changeRows(index, id,tableClick) {
      // if(tableClick){
      //   this.clickAthor = false
      // }
      this.$http
        .get(this.$service.getSingleChatBox + "?workId=" + id)
        .then((res) => {
          if (res.code == 200) {
            this.titleNo = Object.keys(res.data.mesList)[0];
            this.$set(
              this.contentMessage,
              "chatMessage",
              Object.values(res.data.mesList)[0]
            );
        
            this.contentMessage.chatMember = res.data.workOrderMember;
            this.workOrderTypeC = res.data.workOrderType;
            this.workOrderId = res.data.workOrderId;
            this.extraData = {title:res.data.title,remark:res.data.remark,size:res.data.size,cargoReadyDate:res.data.cargoReadyDate}
                 this.tableData.forEach((items,indexs)=>{
          if(indexs!=index && !items.arrow){
            // console.log(this.tableData[indexs],indexs)
              this.tableData[indexs].arrow = !this.tableData[indexs].arrow;
              this.$refs["popover" + indexs].showPopper =
              !this.$refs["popover" + indexs].showPopper;
          }
        })
           this.$refs["popover" + index].showPopper  = !this.$refs["popover" + index].showPopper
            this.tableData[index].arrow = !this.tableData[index].arrow;
            // if(!this.hidePop){
            //    this.$set(
            //   this.tableData[index],
            //   "arrow",
            //   !this.tableData[index].arrow
            // );
            // }
            // this.hidePop = false
          //  this.$refs["popover" + index].showPopper  = !this.tableData[index].arrow
         
            // this.$refs["popover" + index].showPopper =
            //   !this.$refs["popover" + index].showPopper;
          } else {
            this.$message.error(res.message);
          }
        });
    },
    // 把每一行的索引放进row
    tableRowClassName({ row, rowIndex }) {
      row.cIndex = rowIndex;
    },
    rowClick(row,column){
      // this.hidePop = false
      // if(this.tableData.some(item=>!item.arrow)){
      //   this.clickAthor = true
      //   return
      // }
      if(column.label!="询单详情" && this.tableData.some(item=>!item.arrow)){
        return this.tableData.forEach((item,index)=>{
          if(!item.arrow){
              this.tableData[index].arrow = !this.tableData[index].arrow;
              this.$refs["popover" + index].showPopper = false
          }
        })
      }
      if(column.label=="催单"){
        // this.clickAthor = true
        return
      }
     else if(column.label=="询单详情"){
        // this.clickAthor = false
         //关闭之前打开的详情
        // this.tableData.forEach((item,index)=>{
        //   if(index!=row.cIndex && !item.arrow){
        //       this.tableData[index].arrow = !this.tableData[index].arrow;
        //       this.$refs["popover" + index].showPopper =
        //       !this.$refs["popover" + index].showPopper;
        //   }
        // })
        this.changeRows(row.cIndex,row.id)
      }else{
        this.jumpToDetail(row)
      }
    },
    //新建询单按钮
    openWorkOrder() {
      this.form = { workOrderType: "", remark: "", airLinePeople: [],fileUrl:'',fileName:'',fileSize:'',content:'到'}
      this.newMessage = {
          vwr: "",
          pod: "",
          piece: "",
          cbm: "",
          weight: "",
          cargoReadyDate: "",
          size: "",
          podCountry: "",
        }
        this.copyPod = ""
      this.workOrderDial = true;
    },
    //新建询单 弹框提交
    newWorkOrder() {
      if (this.form.airLinePeople == "") {
        this.$message.warning("请选择航线人员");
        return;
      } else if (!this.newMessage.pod) {
        this.$message.warning("请在输入框中输入内容获取目的港");
        return;
      } else if (!this.newMessage.cargoReadyDate) {
        this.$message.warning("请选择货好时间");
        return;
      }
       else if (!this.form.content) {
        this.$message.warning("请输入工单内容");
        return;
      }
      let request = {};
      request.roleName = "售前客服";
      request.workOrderType = this.form.workOrderType;
      request.remark = this.form.remark
      request.content = this.form.content
      request.principalIds = this.form.airLinePeople
        .map((item) => item.split("/")[1])
        .join();
      request.principalNames = this.form.airLinePeople
        .map((item) => item.split("/")[0])
        .join();
      request.size = this.newMessage.size;
      request.cargoReadyDate = this.newMessage.cargoReadyDate;
      request.pod = this.newMessage.pod;
      request.piece = this.newMessage.piece;
      request.cbm = this.newMessage.cbm;
      request.vwr = Math.round(this.newMessage.weight / this.newMessage.cbm);
      request.weight = this.newMessage.weight;
      request.podCountry = this.newMessage.podCountry;
      request.cargoReadyDate = this.newMessage.cargoReadyDate;
      request.fileUrl = this.form.fileUrl
      request.fileName = this.form.fileName
      request.fileSize = this.form.fileSize
     
      this.$http.post(this.$service.launchWorkOrder, request).then((res) => {
        if (res.code == 200) {
          this.$message.success("新建询单成功");
          this.dateFlag = 1
          this.searchClick("fast");
          this.workOrderDial = false;
        } else {
          this.$message.error(res.message);
        }
      });
      // clearInterval(this.tableTimer)
      // this.tableTimer = setInterval(()=>{this.searchClick('default')},5000)
    },

    //订单详情弹框右上角X关闭
    //    closePopover(index){
    //        this.tableData[index].arrow = !this.tableData[index].arrow
    //        let data = "popover"+index
    //        this.$refs[data].showPopper=false
    //    },

    //表格催单
    remindOrder(id) {
      this.$http
        .post(this.$service.remindWorkOrder + "?workOrderId=" + id)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("催单成功");
            this.searchClick(this.searchType);
          } else {
            this.$message.error(res.message);
          }
        });
      //    clearInterval(this.tableTimer)
      //     this.tableTimer = setInterval(()=>{this.searchClick()},5000)
    },
    //高级筛选
    advanceFilter() {
      this.searchClick("advance");
    },
    //查询按钮
    searchClick(val, sortData) {
      let request = {};
      //快捷筛选清除普通筛选条件
      if (val == "fast") {
        this.selectResult = {
          pod: "",
          workOrderNo: "",
          endCommitDate: "",
          startCommitDate: "",
          principalId: "",
          status: "",
          workOrderType: "",
          creatorId: "",
        };
      }

      let copy = JSON.parse(JSON.stringify(this.selectResult));

      if (val == "default") {
        this.dateFlag = "";
        this.searchType = "default";
        delete copy.workOrderNo;
        delete copy.status;
        delete copy.creatorId;
        request = copy;
      } else if (val == "fast") {
        this.searchType = "fast";
        request = copy;
        request.dateFlag = this.dateFlag;
      } else if (val == "advance") {
        this.dateFlag = "";
        this.searchType = "advance";
        request = copy;
      }
      if (sortData) {
        request = { ...sortData, ...request };
      } else {
        //非排序则清空排序
        this.$refs.tableService.clearSort();
      }
      request.pageSize = this.pageSize;
      request.pageNum = this.pageNum;
      request.versionType = this.versionType
      this.exportListData = request;
      this.$http
        .post(this.$service.searchByPageForCst, request)
        .then((data) => {
          if (data.code == 200) {
            let copyData = data.data.records;
            this.total = data.data.total;
            copyData.forEach((item) => (item.arrow = true));
            for (let i = 0; i < this.pageSize; i++) {
              this.$refs["popover" + i] &&
                (this.$refs["popover" + i].showPopper = false);
            }
            this.tableData = copyData;
            if (val == "advance") {
              this.upFilterDial = false;
            }
          } else {
            this.$message.error(data.message);
          }
        });
    },
    //清空
    // restClick(){
    //     this.selectResult = {
    //         workOrderNo:"",
    //         endCommitDate:"",
    //         startCommitDate:"",
    //         principalId:"",
    //         status:"",
    //         pageNum:1,
    //         pageSize:10,
    //     }
    //     this.searchClick()
    // },
    //导出文件
    exportCstListExcel() {
      this.$http
        .post(this.$service.exportCstListExcel, this.exportListData, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel",
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "客服询单列表" + ".xlsx"); // 设置下载文件名称
          aLink.click();
          document.body.appendChild(aLink);
        });
    },
    handleCurrentChange(e) {
      this.pageNum = e;
      this.searchClick(this.searchType);
    },
    handleSizeChange(e) {
      this.pageSize = e;
      this.pageNum = 1;
      this.searchClick(this.searchType);
    },
  },
  filters: {
    getData(value, type) {
      if (type == 1) {
        return value == 0 ? "询价" : value == 1 ? "实单" : '';
      } else if (type == 2) {
        return value == 0
          ? "低"
          : value == 1
          ? "中等"
          : value == 2
          ? "紧急"
          : "";
      } else if (type == 3) {
        return value == 0 ? "未超时" : value == 1 ? "超时" : "";
      } else if (type == 4) {
        return value == 0 ? "待回复" : value == 2 ? "已回复" : "";
      }
    },
  },
  destroyed() {
    // sessionStorage.setItem("lastPageNum","")
    // clearInterval(this.tableTimer)
  },
};
</script>
<style>
</style>
<style lang="">
.chatRoom {
  width: 350px !important;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
<style lang="less" scoped>
/deep/.el-upload--text{
  line-height: 0px!important;
}
/deep/.el-upload-dragger{
  width: 150px;
  height: 150px;
}
.upFilterForm {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
}
.upFilterFooter {
  text-align: right;
}
/deep/.el-table {
  th {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
  td {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
}

.workContent {
  /deep/ input {
    height: 50px;
  }
}
/deep/.bigInput {
  .el-textarea__inner {
    min-height: 150px !important;
  }
}

/deep/.confirmClass {
  width: 500px;
}

.content-wrapper {
  width: 100%;
  box-sizing: border-box;
  /*height: 100%;*/
  padding: 20px;
  overflow: hidden;
  background-color: #fff !important;
  .content-search-normal {
    text-align: left;
    padding-left:0!important;
  }
}
.el-form {
  background-color: #fff;
  text-align: center;
}

.operateButton {
  display: flex;
  justify-content: space-between;
  margin-bottom: -10px;
  .operateLeft {
    button {
      margin: 0px 0px 20px 15px;
    }
  }
  .operateRight {
    display: flex;
    align-items: center;
    .upFilter {
      cursor: pointer;
      color: #02a7f0;
      font-size: 15px;
      margin-left: 25px;
      margin-bottom: 20px;
    }
    button {
      margin: 0px 5px 20px 5px;
    }
  }
}
.popoverContent {
  border: 1px solid silver;
  height: 150px;
  overflow: scroll;
  margin-bottom: 10px;
}
/deep/ .el-dialog {
  padding-bottom: 25px;
}

</style>
