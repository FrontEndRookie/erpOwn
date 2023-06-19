<template>
  <div style="padding-bottom: 15px">
    <div v-if="datatype != 'order0'" class="policy">
      <div>
        <p style="margin-left: 50px">分单类型</p>
        <div class="radioSelect">
          <el-radio-group
            v-model="radioSelect"
            @change="radioSelectChange(true)"
          >
            <el-radio :label="0">系统分单</el-radio>
            <el-radio :label="1">客户分单</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div
        style="display: flex; justify-content: space-around; flex-wrap: wrap"
      >
        <div>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <span style="color: red">*</span>
            分单号 HAWB NOs
          </div>
          <div>
            <input
              ref="inputAgain"
              style="border: 1px solid black; cursor: not-allowed"
              type="text"
              disabled
              onKeyUp="this.value= this.value.match(/[\w]{0,20}/)? this.value.match(/[\w]{0,20}/)[0] : ''"
              @blur="inputData.input1 = $event.target.value"
              maxlength="20"
              spellcheck="false"
              v-model="inputData.input1"
              clearable
            />
          </div>
        </div>

        <div>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <span style="color: red">*</span>
            件数 No. of Piecess
          </div>
          <div>
            <input
              style="border: 1px solid black"
              type="text"
              maxlength="4"
              onKeyUp="value=value.replace(/[^0-9]/g,'')"
              @blur="inputData.input2 = $event.target.value"
              spellcheck="false"
              v-model="inputData.input2"
              clearable
            />
          </div>
        </div>

        <div>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <span style="color: red">*</span>
            毛重 Gross Weights
          </div>
          <div>
            <input
              style="border: 1px solid black"
              type="text"
              onkeyup="this.value= this.value.match(/^\d{0,6}(\.\d{0,2})?/)? this.value.match(/^\d{0,6}(\.\d{0,2})?/)[0] : ''"
              ref="input1"
              @blur="
                inputData.input3 = Number($event.target.value).toFixed(2);
                getWeight();
              "
              spellcheck="false"
              v-model="inputData.input3"
              clearable
            />
          </div>
        </div>

        <div>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <span style="color: red">*</span>
            体积 Measurements
          </div>
          <div>
            <input
              style="border: 1px solid black"
              type="text"
              onkeyup="this.value= this.value.match(/^-?\d{0,4}(\.\d{0,3})?/)? this.value.match(/^-?\d{0,4}(\.\d{0,3})?/)[0] : ''"
              ref="input2"
              @blur="
                inputData.input4 = Number($event.target.value).toFixed(3);
                getWeight();
              "
              spellcheck="false"
              v-model="inputData.input4"
              clearable
            />
          </div>
        </div>

        <div>
          <div style="margin-bottom: 10px; margin-top: 10px">
            <span style="color: red">*</span>
            计费重 Chargeable Weights
          </div>
          <div>
            <input
              style="border: 1px solid black"
              type="text"
              ref="input3"
              onKeyUp="this.value= this.value.match(/^\d+(\.\d{0,1})?/)? this.value.match(/^\d+(\.\d{0,1})?/)[0] : ''"
              @blur="inputData.input5 = $event.target.value"
              spellcheck="false"
              v-model="inputData.input5"
              clearable
            />
          </div>
        </div>
      </div>
    </div>
    <div class="itemList">
      <div class="item1" v-for="(itm, indx) in texts" :key="indx">
        <div class="text">
          <span v-if="(datatype == 'order0' && itm.title1 != '操作信息' && itm.title1 != '通知人') || (datatype != 'order0' && itm.title1 != '操作信息')" style="color: red">*</span
          >{{ itm.title1 }}
        </div>
        <div class="text">{{ itm.title2 }}</div>
        <el-input
          type="textarea"
          :placeholder="getHolder(indx)"
          ref="inputArea"
          v-model="texts[indx].content"
          onKeyUp="value=value.replace(/[\u4e00-\u9fa5]/g,'')"
          @blur="texts[indx].content = $event.target.value"
          spellcheck="false"
          :maxlength="itm.maxLength"
          show-word-limit
        >
        </el-input>
      </div>
    </div>
    <div class="footer">
      <div class="footer-one">
        <!-- table -->
        <div v-if="datatype == 'order0'">
          <div class="text"><span style="color: red">*</span>杂费</div>
          <div class="text">Other charges</div>
          <div style="display: flex">
            <div
              style="
                border: 1px solid black;
                width: 100px;
                height: 40px;
                line-height: 40px;
                text-align: center;
              "
              v-for="(item, index) in tableHead"
              :key="index"
            >
              {{ item.name }}
            </div>
          </div>

          <div
            v-for="(item, index) in tableData"
            :key="index"
            style="display: flex"
          >
            <div
              style="width: 100px; border: 1px solid black"
              v-for="(item1, index1) in tableHead"
              :key="index1"
            >
              <div v-if="item1.label == 'a'">
                <el-input
                  clearable
                  maxlength="50"
                  @change="ifSame(index,$event)"
                  v-model="tableData[index].name"
                >
                </el-input>
              </div>
              <div v-if="item1.label == 'b'">
                <el-input
                  clearable
                  maxlength="50"
                  onkeyup="this.value= this.value.match(/^-?\d{0,6}(\.\d{0,2})?/)? this.value.match(/^-?\d{0,6}(\.\d{0,2})?/)[0] : ''"
                  @blur = "((val)=>{toFixTwo(val,index)})"
                  v-model="tableData[index].value"
                ></el-input>
              </div>
              <div
                style="display: flex; justify-content: space-around"
                v-if="item1.label == 'c'"
              >
                <a
                  style="border: 1px solid #6289dc; margin-top: 10px"
                  v-if="tableData.length == index + 1"
                  @click="tableDataChange(1)"
                  >添加</a
                >

                <a
                  v-if="tableData.length > 1"
                  style="border: 1px solid #6289dc; margin-top: 10px"
                  @click="tableDataChange(-1)"
                  >删除</a
                >
              </div>
            </div>
          </div>
        </div>
        <div class="radio">
          <div class="text">支付信息</div>
          <div class="text">Accounting Information</div>
          <el-radio-group v-model="radio" @change="radioChange" :disabled="datatype == 'order0'">
            <el-radio :label="0">运费预付</el-radio>
            <el-radio :label="1">运费到付</el-radio>
          </el-radio-group>
       
        </div>
      </div>
      <div class="lis1">
        <el-button
          class="cun"
          type="warning"
          size="mini"
          @click="save(datatype, currentIndex)"
          >保存数据</el-button
        >
        <el-button class="res" size="mini" @click="relick(datatype)"
          >清空</el-button
        >
      </div>
      <div class="lis2">
        <el-button class="alig" size="mini" @click="previewData(currentIndex)"
          v-auth="['153001_B']"
          >提单预览</el-button
        >
        <el-popover
          placement="top"
          width="160"
          ref="downloadPop"
          v-model="visible"
        >
          <div style="display: flex; justify-content: space-between">
            <p style="fontsize: 12px; height: 28px; line-height: 28px">
              下载类型:
            </p>
            <el-select
              size="mini"
              style="width: 100px"
              v-model="value"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </div>
          <div style="text-align: center; margin: 0; margin-top: 20px">
            <a style="border: 1px solid #6289dc" @click="visible = false"
              >取消</a
            >
            <a
              style="border: 1px solid #6289dc"
              @click="installData(datatype)"
              >确定</a
            >
          </div>
          <el-button
            type="primary"
            slot="reference"
            size="mini"
            @click="commitData(currentIndex)"
            v-auth="['153002_B']"
            >提单下载</el-button
          >
        </el-popover>
      </div>
    </div>
    <el-dialog title="预览pdf" :visible.sync="dialogVisible" width="80%" center>
      <embed
        :src="filePath"
        style="width: 100%; height: 100%"
        :key="previewKey"
      />
    </el-dialog>

    <el-dialog
      title="预览舱单pdf"
      :visible.sync="dialogCangDan"
      width="80%"
      center
    >
      <embed
        :src="cangDanPath"
        style="width: 100%; height: 100%"
        :key="previewKey"
      />
    </el-dialog>
  </div>
</template>
<script>
const { BILL_URL:billUrl} = process.env
export default {
  props: {
    datatype: String,
    mainData: Object,
    menudata: Array,
    currentIndex: Number,
    noPrice: Number,
    orderPoint: Number,
  },
  data() {
    return {
      initWtal:"",
      //调接口新字段 
      // carrierInfo:'',
      // 绑定key值重新渲染
      previewKey: 1,
      // 弹出框状态
      visible: false,
      // 下载格式选择
      options: [
        {
          label: "pdf",
          value: "pdf",
        },
        {
          label: "excel",
          value: "excel",
        },
      ],
      // 默认选择格式
      value: "pdf",
      // textarea绑定数组
      texts: [
        {
          title1: "发货信息",
          title2: "Shipper's Name and Address",
          content: "",
          maxLength: "245",
        },
        {
          title1: "收货信息",
          title2: "Consignee's Name and Address",
          content: "",
          maxLength: "245",
        },
        {
          title1: "通知人",
          title2: "notify party",
          content: "",
          maxLength: "130",
        },
        {
          title1: "品名",
          title2: "Nature and Quantity of Goods",
          content: "",
          maxLength: "245",
        }, 
       
        {
          title1: "操作信息",
          title2: "Handling information",
          content: "",
          maxLength: "245",
        },
      ],
      // 支付信息单选按钮
      radio: 0,
      // 分单类型单选按钮
      radioSelect: 0,
      // 预览pdf模态框状态
      dialogVisible: false,
      // 舱单模态框状态
      dialogCangDan: false,
      // 舱单预览文件路径
      cangDanPath: "",
      //预览文件路径
      filePath: "",
      // 下载文件路径
      dataPath: "",
      // 方便控制预览之后提示
      previewState: "",
      newAddData: "",
      // 杂费数据
      tableData: [{}],
      // 表头
      tableHead: [
        { name: "杂费", label: "a" },
        { name: "金额", label: "b" },
        { name: "操作", label: "c" },
      ],
      inputData: {
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        input5: "",
      },
      keysArray: [],
    };
  },
  mounted() {
    this.initData();
    if(this.datatype =="order0") {
      this.options[1].disabled = true
    }
  },
  activated() {
    // console.log('activated');
  },
  methods: {
    limitNum(e){
      console.log(e)
    },
     isRepeat(arr){ 
        var hash = {}; 
        for(var i in arr) { 
        if(hash[arr[i]]) 
        return true; 
        hash[arr[i]] = true; 
        } 
        return false; 
    },
    ifSame(index,event){
      
      this.tableData[index].name = event.replace(/[\W]/g,'').toUpperCase()
      let copy = JSON.parse(JSON.stringify(this.tableData))
      let resultS = copy.map(item=>{
        if (!item.name || item.name != ""){
            return String(item.name).toUpperCase()
        }
      })
      let result = resultS.filter(item=>item!="")
      console.log(result)
     if(this.isRepeat(result)){
       this.$message.warning("杂费不允许重复")
       this.tableData[index].name = ""
     }
    },
    toFixTwo(e,index){
      if(e.target.value) {
        this.tableData[index].value = Number(e.target.value).toFixed(2)
      }
    },
    //杂费表格添加删除
    tableDataChange(pushPOP) {
      if(pushPOP == -1) {
        this.tableData.pop();
      }
      if (this.tableData.length == 5) {
        return this.$message.warning("杂费表格最多添加五条数据");
      }
      if (pushPOP == 1) {
        this.tableData.push({});
      }
    },

    getWeight() {
      if (this.inputData.input3 && this.inputData.input4) {
        // var max = "";
       
        //   max = this.inputData.input4 * 167;
        //   if(max < this.inputData.input3) {
        //     max = this.inputData.input3
        //   }
        // if (this.orderPoint) {
        //   this.inputData.input5 = Math.ceil(
        //     (max * this.orderPoint) / 10 +
        //       this.inputData.input3 * (1 - this.orderPoint / 10)
        //   );
        // }
       this.inputData.input5 = this.$utils.getBillingWeight({bubblePoint:this.orderPoint ? this.orderPoint:10,weight:this.inputData.input3,volume:this.inputData.input4})
      } else {
        this.inputData.input5 = ""
      }
    },
    newAdd(self,nowIndex) {
      console.log(this.menudata)
      this.keysArray = [
        "LXC" + this.mainData.orderNo.slice(-6) + "A",
        "LXC" + this.mainData.orderNo.slice(-6) + "B",
        "LXC" + this.mainData.orderNo.slice(-6) + "C",
        "LXC" + this.mainData.orderNo.slice(-6) + "D",
        "LXC" + this.mainData.orderNo.slice(-6) + "E",
      ];
      let arr = this.keysArray;
      for (let i = 0, j = arr.length; i < j; i++) {
        if (this.menudata.every((item) => item.hab != arr[i])) {
          // console.log(this.menudata)
          this.newAddData = arr[i];
          break;
        }
      }
      this.$set(
        this.menudata[nowIndex?nowIndex-1:this.menudata.length - 1],
        "hab",
        this.newAddData
      );
      this.inputData.input1 = this.newAddData;
      // this.carrierInfo = this.mainData.carrierInfo
      this.radioSelect = 0;
      if(!self){
        this.radioSelectChange();
      }
    },
    getHolder(idx) {
      if (idx == 0) {
        return "Y8航班需提供发货人税号";
      }
      if (idx == 1) {
        return "Y8航班需提供收货人税号. 提示：目的港LOS需提供收货人BA.NO以及MF.NO";
      }
      if (idx == 3) {
        return "TK航班请提供 HS CODE";
      }
    },
    // 初始化页面数据
    initData() {
      // 主单数据展示
      if (this.datatype == "order0") {
        this.texts[0].content = this.mainData.shipperInfo;
        this.texts[1].content = this.mainData.consigneeInfo;
        this.texts[2].content = this.mainData.notificationInfo;
        this.texts[3].content = this.mainData.goodsInfo;
        this.texts[4].content = this.mainData.handlingInfo;
        // this.carrierInfo = this.mainData.carrierInfo

        // if (this.mainData.wtVal == "0") {
        //   this.radio = 0;
        // } else if (this.mainData.wtVal == "1") {
        //   this.radio = 1;
        // }
        let json = this.mainData.otherCharges;
        var arr = [];
        // 数据处理
        if (JSON.stringify(json) != "{}" && json) {
          let names = Object.keys(json);
          let values = Object.values(json);
          for (let i = 0; i < names.length; i++) {
            let o = {};
            o.name = names[i];
            o.value = values[i];
            arr.push(o);
          }
          this.tableData = arr;
        }
      }
      // 分单数据展示
      //  有分泡
      if (this.orderPoint) {
        for (let i = 0, j = 5; i < j; i++) {
          if (this.datatype == (this.menudata[i] && this.menudata[i].title)) {
            if (!this.mainData.hawbList) {
              break;
            }
            let data = this.mainData.hawbList[i];
            if (data && data.wtVal && data.wtVal == "0") {
              this.initWtal = 0
              this.radio = 0;
            } else if (data && data.wtVal && data.wtVal == "1") {
              this.initWtal = 1
              this.radio = 1;
            }
            if (data && data.hawb) {
              var keys = data.hawb;
            }
            this.keysArray = [
              "LXC" + this.mainData.orderNo.slice(-6) + "A",
              "LXC" + this.mainData.orderNo.slice(-6) + "B",
              "LXC" + this.mainData.orderNo.slice(-6) + "C",
              "LXC" + this.mainData.orderNo.slice(-6) + "D",
              "LXC" + this.mainData.orderNo.slice(-6) + "E",
            ];
            if (this.keysArray.includes(keys)) {
              this.radioSelect = 0;

              this.radioSelectChange();
            } else {
              this.radioSelect = 1;
              this.radioSelectChange();
            }
            if (data) {
              // this.carrierInfo = data.carrierInfo
              this.inputData.input1 = data.hawb;
              this.inputData.input2 = data.pieces;
              this.inputData.input3 = data.grossWeight;
              this.inputData.input4 = data.measurement;
              this.inputData.input5 = data.chargeableWeight;
              this.texts[0].content = data.shipperInfo;
              this.texts[1].content = data.consigneeInfo;
              this.texts[2].content = data.notificationInfo;
              this.texts[3].content = data.goodsInfo;
              this.texts[4].content = data.handlingInfo;
            }
          }
        }
      } else {
        for (let i = 0, j = 5; i < j; i++) {
          if (this.datatype == (this.menudata[i] && this.menudata[i].title)) {
            if (!this.mainData.hawbList) {
              break;
            }
            let data = this.mainData.hawbList[i];
            if (data && data.wtVal && data.wtVal == "0") {
              this.radio = 0;
              this.initWtal = 0
            } else if (data && data.wtVal && data.wtVal == "1") {
              this.initWtal = 1
              this.radio = 1;
            }
            if (data && data.hawb) {
              var keys = data.hawb;
            }
            this.keysArray = [
              "LXC" + this.mainData.orderNo.slice(-6) + "A",
              "LXC" + this.mainData.orderNo.slice(-6) + "B",
              "LXC" + this.mainData.orderNo.slice(-6) + "C",
              "LXC" + this.mainData.orderNo.slice(-6) + "D",
              "LXC" + this.mainData.orderNo.slice(-6) + "E",
            ];
            if (this.keysArray.includes(keys)) {
              this.radioSelect = 0;
              this.radioSelectChange();
            } else {
              this.radioSelect = 1;
              this.radioSelectChange();
            }
            if (data) {
              this.$refs.input1.disabled = true;
              this.$refs.input1.style.cursor = "not-allowed";
              this.$refs.input2.disabled = true;
              this.$refs.input2.style.cursor = "not-allowed";
              this.$refs.input3.disabled = true;
              this.$refs.input3.style.cursor = "not-allowed";
              this.inputData.input1 = data.hawb;
              this.inputData.input2 = data.pieces;
              this.texts[0].content = data.shipperInfo;
              this.texts[1].content = data.consigneeInfo;
              this.texts[2].content = data.notificationInfo;
              this.texts[3].content = data.goodsInfo;
              this.texts[4].content = data.handlingInfo;
            }
          }
        }
      }
    },
    // 舱单预览和下载
    cangDanDialog() {
      this.dialogCangDan = true;
      var order = this.mainData.orderNo;
      this.previewKey = this.previewKey + 1;
      this.cangDanPath = `${billUrl}/preview/ware/pdf/noAuth/${order}`;
    },
    // 限制系统分单不可输入
    radioSelectChange(self) {
      if (this.radioSelect == 1) {
        this.$refs.inputAgain.style.cursor = "";
        this.$refs.inputAgain.disabled = false;
        //初始状态是系统分单,切换后存储当前分单号
        if(self && this.initWtal == 0) {
          sessionStorage.setItem(`orderNo${this.datatype.slice(-1)}`,this.inputData.input1)
        }
      } else {
        this.$refs.inputAgain.style.cursor = "not-allowed";
        this.$refs.inputAgain.disabled = true;
        //切换回系统分担后，获取之前分单号
        if(self && this.initWtal == 0) {
         this.inputData.input1 = sessionStorage.getItem(`orderNo${this.datatype.slice(-1)}`)
        }
         //初始状态为客户分单,切换系统分单获取新的分单号
        if(this.initWtal == 1) {
          this.initWtal = 0
          this.newAdd(true,this.datatype.slice(-1))
        }
      }
    },
    // 主单修改保存
    saveMainData() {
      if (this.mainData.id) {
        var obj = {};
        // 处理数据
        let data = this.tableData;
        for (let i = 0; i < data.length; i++) {
          obj[data[i].name] = data[i].value;
        }

        let json = {
          id: this.mainData.id,
          shipperInfo: this.texts[0].content,
          consigneeInfo: this.texts[1].content,
          notificationInfo: this.texts[2].content,
          goodsInfo: this.texts[3].content,
          handlingInfo: this.texts[4].content,
          otherCharges: JSON.stringify(obj),
          wtVal: this.radio,
          // carrierInfo:this.carrierInfo
        };
        this.$http.post(this.$service.billLading+"/edit", json)
          .then((data) => {
            if (data.code == 200) {
              this.$message.success("保存成功");
              json.otherCharges = obj;
              json.orderNo = this.mainData.orderNo;
              this.$emit("sonSaveData", [0, json]);
            } else {
              this.$message.error(data.message);
            }
          });
      } else {
        this.$message.error("请先输入订单号");
      }
    },
    // 分单修改保存
    saveOtherData(type, index) {
      if (this.mainData.id) {
        let idx = type.slice(-1);
        let data = this.mainData.hawbList[index - 1];
        let copy = JSON.parse(JSON.stringify(data));
        let arr = [];
        for (let i = 0; i < this.menudata.length; i++) {
          arr.push(this.menudata[i].name);
        }
        arr.splice(index - 1, 1);
        for (let i = 0; i < arr.length; i++) {
          if (this.inputData.input1 == arr[i]) {
            this.$message.error("分单号不可相同");
            return;
          }
        }
        delete copy.ifNewData;

        if (Object.keys(copy).length > 0) {
          let json = {
            id: data.id,
            shipperInfo: this.texts[0].content,
            consigneeInfo: this.texts[1].content,
            notificationInfo: this.texts[2].content,
            goodsInfo: this.texts[3].content,
            handlingInfo: this.texts[4].content,
            hawb: this.inputData.input1,
            pieces: this.inputData.input2,
            grossWeight: this.inputData.input3,
            measurement: this.inputData.input4,
            chargeableWeight: this.inputData.input5,
            wtVal: this.radio,
            // carrierInfo:this.carrierInfo
          };
          
          this.$http.post(this.$service.billLading+"/edit", json)
            .then((data) => {
              if (data.code == 200) {
                this.$message.success("保存成功");
                this.$emit("sonSaveData", [index, json]);
              } else {
                this.$message.error(data.message);
              }
            });
        } else {
          let params = {
            chargeableWeight: this.inputData.input5,
            consigneeInfo: this.texts[1].content,
            goodsInfo: this.texts[3].content,
            grossWeight: this.inputData.input3,
            handlingInfo: this.texts[4].content,
            hawb: this.inputData.input1,
            measurement: this.inputData.input4,
            notificationInfo: this.texts[2].content,
            orderNo: this.mainData.orderNo,
            pieces: this.inputData.input2,
            shipperInfo: this.texts[0].content,
            wtVal: this.radio,
            // carrierInfo:this.carrierInfo
          };
         this.$http.post(this.$service.billLading+"/save", params)  
            .then((data) => {
              if (data.code == 200) {
                this.$message.success("保存成功");
                params.id = data.data.id;
                this.$emit("sonSaveData", [index, params]);
              } else {
                this.$message.error(data.message);
              }
            });
        }
      } else {
        this.$message.error("请先输入订单号");
      }
    },
    // 保存
    save(type) {
      
      let index = this.currentIndex;
      this.previewKey = this.previewKey + 1;
      if (type == "order0") {
        for (let i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].name || !this.tableData[i].value) {
            this.$message.error("杂费和金额均为必填项");
            return;
          }
        }
        if (
          this.texts[0].content != "" &&
          this.texts[1].content != "" &&
          this.texts[3].content != "" &&
          this.tableData[0].name != "" &&
          this.tableData[0].value != "" 
          
          //&& this.carrierInfo != ""
        ) {
          // if (this.noPrice == 1) {
          //    this.$message.warning("价格无法找到,支持excel版本下载后本地修改");
          // }
          this.saveMainData();
        } else {
          this.$message.error("带*的为必填项，请输入完后再操作");
        }
      } else {
        // 有分泡
        if (this.orderPoint) {
          if (
            this.texts[0].content &&
            this.texts[1].content &&
            this.texts[2].content &&
            this.texts[3].content &&
            this.inputData.input1 &&
            this.inputData.input2 &&
            this.inputData.input3 &&
            this.inputData.input4 &&
            this.inputData.input5 
            // &&this.carrierInfo
          ) {
            // if (this.noPrice == 1) {
            //  this.$message.warning("价格无法找到,支持excel版本下载后本地修改");
            // }
            this.saveOtherData(type, index);
          } else {
            this.$message.error("带*的为必填项，请输入完后再操作");
          }
        } else {
          if (
            this.texts[0].content &&
            this.texts[1].content &&
            this.texts[2].content &&
            this.texts[3].content &&
            this.inputData.input1 &&
            this.inputData.input2
            // &&this.carrierInfo
          ) {
            // if (this.noPrice == 1) {
            //  this.$message.warning("价格无法找到,支持excel版本下载后本地修改");
            // }
            this.saveOtherData(type, index);
          } else {
            this.$message.error("带*的为必填项，请输入完后再操作");
          }
        }
      }
    },
    // 重置清空输入信息
    relick(datatype) {
      // 主单清空
      if (datatype == "order0") {
        this.texts[0].content = "";
        this.texts[1].content = "";
        this.texts[2].content = "";
        this.texts[3].content = "";
        this.texts[4].content = "";
        // this.carrierInfo = '';
        this.tableData = [{}];
      } else {
        if(this.radioSelect == 1){
          this.inputData.input1 = "";
        }
        this.inputData.input2 = "";
        this.inputData.input3 = "";
        this.inputData.input4 = "";
        this.inputData.input5 = "";
        this.texts[0].content = "";
        this.texts[1].content = "";
        this.texts[2].content = "";
        this.texts[3].content = "";
        this.texts[4].content = "";
        // this.carrierInfo = '';

      }
    },
    // 判断已有数据是否改变,改变了提示用户先保存在预览和下载
    tipsComing(type) {
      // 主单
      if (!type) {
        let obj = {};
        let data = this.tableData;
        for (let i = 0; i < data.length; i++) {
          obj[data[i].name] = data[i].value;
        }
        let json = JSON.stringify(obj);
        let getjson = JSON.stringify(this.mainData.otherCharges);
        if (
          this.texts[0].content != this.mainData.shipperInfo ||
          this.texts[1].content != this.mainData.consigneeInfo ||
          this.texts[2].content != this.mainData.notificationInfo ||
          this.texts[3].content != this.mainData.goodsInfo ||
          this.texts[4].content != this.mainData.handlingInfo ||
          this.radio != this.mainData.wtVal ||
          json != getjson 
          // ||this.carrierInfo != this.mainData.carrierInfo
        ) {
          this.$refs.downloadPop.disabled = true;
          this.$message.error("请先保存数据后再预览和下载最新的数据");
          this.previewState = true;
        }
      } else {
        // 分单
        if (this.orderPoint) {
          for (var i = 0, j = 5; i < j; i++) {
            if (type == i + 1) {
              i = type - 1;
              var data = this.mainData.hawbList[i];
              if (this.mainData.hawbList[i].hawb) {
                var keys = this.mainData.hawbList[i].hawb.slice(0, 3);
              }
              if (keys == "LXC") {
                var meta = 0;
              } else {
                var meta = 1;
              }
              if (
                this.radioSelect != meta ||
                this.inputData.input1 != data.hawb ||
                this.inputData.input2 != data.pieces ||
                this.inputData.input3 != data.grossWeight ||
                this.inputData.input4 != data.measurement ||
                this.inputData.input5 != data.chargeableWeight ||
                this.texts[0].content != data.shipperInfo ||
                this.texts[1].content != data.consigneeInfo ||
                this.texts[2].content != data.notificationInfo ||
                this.texts[3].content != data.goodsInfo ||
                this.texts[4].content != data.handlingInfo ||
                // this.carrierInfo != data.carrierInfo ||
                this.radio != data.wtVal
              ) {
                this.$refs.downloadPop.disabled = true;
                this.$message.error("请先保存数据后再预览和下载最新的数据");
                this.previewState = true;
              }
            }
          }
        } else {
          for (var i = 0, j = 5; i < j; i++) {
            if (type == i + 1) {
              i = type - 1;
              var data = this.mainData.hawbList[i];
              if (this.mainData.hawbList[i].hawb) {
                var keys = this.mainData.hawbList[i].hawb.slice(0, 3);
              }
              if (keys == "LXC") {
                var meta = 0;
              } else {
                var meta = 1;
              }
              if (
                this.radioSelect != meta ||
                this.inputData.input1 != data.hawb ||
                this.inputData.input2 != data.pieces ||
                this.texts[0].content != data.shipperInfo ||
                this.texts[1].content != data.consigneeInfo ||
                this.texts[2].content != data.notificationInfo ||
                this.texts[3].content != data.goodsInfo ||
                this.texts[4].content != data.handlingInfo ||
                this.radio != data.wtVal 
                // || this.carrierInfo != data.carrierInfo
              ) {
                this.$refs.downloadPop.disabled = true;
                this.$message.error("请先保存数据后再预览和下载最新的数据");
                this.previewState = true;
              }
            }
          }
        }
      }
    },
    // 预览
    previewData(type) {
      // 主单预览
      if (!type) {
        let id = this.mainData.id;
        // 有主单数据
        if (id) {
          if (
            !this.texts[0].content ||
            !this.texts[1].content ||
            !this.texts[3].content ||
            !this.tableData[0].name ||
            !this.tableData[0].value
            // ||!this.carrierInfo
          ) {
            this.$message.warning("*为必填项，请填写后再预览或下载");
            return;
          }
          this.tipsComing(type);
          if (this.previewState) {
            this.dialogVisible = false;
            this.previewState = false;
          } else {
           
              this.$http.get(`${this.$service.billLading}/preview/bill/pdf/${id}`, {
                responseType: 'blob',
              })
              .then((data) => {
                this.filePath = URL.createObjectURL(data);
                this.dialogVisible = true;
              });
          }
          return;
        } else {
          this.$message.error("请先输入订单号");
          return;
        }
      }
      // 请求了数据
      if (this.mainData.id) {
        let idx = type;
        let data = this.mainData.hawbList[idx - 1];
        if (data) {
          var copy = JSON.parse(JSON.stringify(data));
          delete copy.ifNewData;
        }
        // 有分单数据
        if (JSON.stringify(copy) != "{}" && copy) {
          this.tipsComing(type);
          if (this.previewState) {
            this.dialogVisible = false;
            this.previewState = false;
          } else {
            
              this.$http.get( `${this.$service.billLading}/preview/bill/pdf/${data.id}`, {
                responseType: 'blob',
              })
              .then((res) => {
                this.filePath = URL.createObjectURL(res);
                this.dialogVisible = true;
              });
          }
          return;
        } else {
          this.$message.error("请先保存数据");

          return;
        }
      } else {
        this.$message.error("请先输入订单号");
      }
    },
    // 下载
    installData(type) {
      this.visible = false;
      let typ = this.value;
      if (type == "order0") {
        let id = this.mainData.id;
        this.$http.get(this.$service.billLading+`/download/bill/${typ}/${id}`, {
          responseType: 'blob',
          getHeaders: true,
        }).then(res=>{
          const downloadName = window.Dc_TempHeaders['content-disposition'].split(';').filter(item => item.includes('filename'))[0].split('=')[1]
          this.dataPath = URL.createObjectURL(res);
          const aLink = document.createElement("a");
          aLink.href = this.dataPath
          aLink.setAttribute('download', downloadName)
          aLink.click()
        })
        return;
      }
      let idx = type.slice(-1);
      let data = this.mainData.hawbList[idx - 1];
      if (data) {
         this.$http.get(this.$service.billLading+`/download/bill/${typ}/${data.id}`, {
          responseType: 'blob',
        }).then(res=>{
          const downloadName = window.Dc_TempHeaders['content-disposition'].split(';').filter(item => item.includes('filename'))[0].split('=')[1]
          this.dataPath = URL.createObjectURL(res);
          const aLink = document.createElement("a");
          aLink.href = this.dataPath
          aLink.setAttribute('download', downloadName)
          aLink.click()
        })
        return;
      }
    },
    // 限制无订单号输入点击下载
    commitData(type) {
      
      // 没有请求数据
      if (!this.mainData.id) {
        this.$refs.downloadPop.disabled = true;
        this.$message.error("请先输入订单号");
      }
      // 请求了数据
      else {
        if (!type) {
          if (
            !this.texts[0].content ||
            !this.texts[1].content ||
            !this.texts[3].content ||
            !this.tableData[0].name ||
            !this.tableData[0].value
          ) {
            this.$message.warning("*为必填项，请填写后再预览或下载");
            this.$refs.downloadPop.disabled = true;
            return;
          }
          this.tipsComing(type);
        }
        if (type) {
          this.tipsComing(type);
        }
        var idx = type.toString().slice(-1);
        let data = this.mainData.hawbList[idx - 1];

        if (data) {
          delete data.ifNewData;
          // 请求了数据但是是新建分单提示先保存数据
          if (this.mainData.id && JSON.stringify(data) == "{}") {
            this.$refs.downloadPop.disabled = true;
            // this.$message.error("请先保存数据");
          }
        }
      }
    },
  },
  watch: {
    // 监听传过来的数据以页面初始化数据
    mainData() {
      this.initData();
    },
    currentIndex() {},
  },
};
</script>
<style scoped lang="less">
/deep/.el-dialog__body {
  height: 800px;
  overflow: scroll;
}
.itemList {
  display: flex;
  // justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 50px;
  .item1{
    margin-right:20px;
    margin-left:20px;
  }
}
.text {
  height: 20px;
  padding: 5px;
}
.radioSelect {
  position: relative;
  left: 120px;
  bottom: 15px;
}

.policy {
  height: 100px;
  margin-top: 30px;
}
.item1 {
  margin-top: 5px;
}
/deep/.el-textarea {
  textarea {
    height: 120px !important;
    width: 400px !important;
  }
}

.footer-one {
  display: flex;

  // height: 100px;
  margin-top: 20px;
  margin-left: 20px;
}
.radio {
  margin-left: 60px;
}
.cun {
  background-color: orange !important;
}
.res {
  background-color: rgb(129, 211, 248) !important;
}
.lis1 {
  float: right;
  margin-right: 80px;
}
.alig {
  background-color: #909399;
  color: #fff;
}
.lis2 {
  text-align: center;
  margin-top: 90px;
}
</style>