<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item>
            <el-select v-model="pol" placeholder="起运港三字码" :remote-method="polMethod" :loading="loading" clearable
              filterable remote reserve-keyword>
              <el-option v-for="(item,index) in polOpt" :disabled="pod == item.threeLetterCode"
                :key="item.threeLetterCode" :value="item.threeLetterCode">
                <span>{{item.threeLetterCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="tp" placeholder="中转港" :remote-method="tpMethod" :loading="loading" clearable
              filterable remote reserve-keyword>
              <el-option v-for="(item,index) in ptOpt" :disabled="tp == item.threeLetterCode"
                :key="item.threeLetterCode" :value="item.threeLetterCode">
                <span>{{item.threeLetterCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-select placeholder="中转/直飞" size="medium" v-model="legCount" clearable style="width: 130px;">
              <el-option v-for="item in legCountOpt" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-select v-model="pod" placeholder="目的港三字码" :remote-method="podMethod" :loading="loading" clearable
              filterable remote reserve-keyword>
              <el-option v-for="item in podOpt" :disabled="pol == item.threeLetterCode" :key="item.threeLetterCode"
                :value="item.threeLetterCode">
                <span>{{item.threeLetterCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="agentName" placeholder="代理公司名称" :remote-method="agentMethod" :loading="loading" clearable
              filterable remote reserve-keyword style="width: 220px;">
              <el-option v-for="item in agentOpt" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="airCompanyCode" placeholder="航司代码" :remote-method="companyMethod" :loading="loading"
              clearable filterable remote reserve-keyword>
              <el-option v-for="item in airCompanyCodeOpt"
                :key="item.airCompanyCode"
                :value="item.airCompanyCode">
                <span>{{item.airCompanyCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="airLinePersonName" placeholder="航线负责人" :remote-method="companyMethod" :loading="loading"
              clearable filterable remote reserve-keyword>
              <el-option v-for="item in airLinePersonNameArr"
                :key="item.value"
                :value="item.value">
                <span>{{item.value}}</span>
                <!-- <span style="margin-left: 5px;">{{item.value}}</span> -->
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-select placeholder="航线区域" size="medium" v-model="continent" clearable style="width: 130px;">
              <el-option v-for="item in routeArea" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->


          <!-- <el-form-item>
            <el-select placeholder="状态" size="medium" v-model="status" clearable style="width: 130px;">
              <el-option v-for="item in statusOpt" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <div style="display:flex;flex-direction: row;">
              <el-button @click="skipHistory" v-auth="['201001_B']">历史操作 </el-button>
              <!-- <img style="height: 30px;width: 30px;display: inline-block;background-size: 100% 100%;border-radius: 50%;background-image:url('@/src/assets/history.jpg');"> -->
            </div>
          </el-form-item>
          <el-form-item>
            <!-- <div class="block">
              <el-date-picker
                v-model="dataValue"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </div> -->
            <div style="display:flex;flex-direction: row;">
              <i class="el-icon-date" style="font-size:38px;cursor: pointer;" @click="dogShow = true"></i>
              <el-dialog
                title="选择时间"
                :visible.sync="dogShow"
                width="600px"
                @open="openDia"
                :close-on-click-modal="false"
                @close="handleClose(3)">
                <div class="timeTip">{{newDate.split(' ').slice(1).join('')}}</div>
                <div class="timeTip2">{{newDate.split(' ').slice(0,1).join('')}}<span></span><a @click="inputShow = true" v-if="inputShow == false"> 手动设置具体日期 </a></div>
                
                <div v-if="inputShow == true" style="margin:20px 0;width:100%;text-align: right;">
                  <el-input controls='false' style="width:100px" v-model="valueTi.year" @blur="retTime" @input="valueTi.year=$utils.pureNumber(valueTi.year)" max="2100" min="2000" :maxlength="4"></el-input>年
                  <el-input controls='false' style="width:60px" v-model="valueTi.moth" @blur="retTime" @input="valueTi.moth=$utils.pureNumber(valueTi.moth)" max="12" min="1" :maxlength="2"></el-input>月
                  <el-input controls='false' style="width:60px" v-model="valueTi.day" @blur="retTime" @input="valueTi.day=$utils.pureNumber(valueTi.day)" max="31" min="1" :maxlength="2"></el-input>日
                  <span style="display:inline-block;width:30px"></span>
                  <el-button style="display:inline-block;margin-right:30px ;background: #1989FA;color:white;" @click="handleClose(2)">确定</el-button>
                </div>
                <el-calendar v-model="valueTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="border-top: 1px rgb(26, 26, 26) solid;">
                  <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法--> 
                  <template
                    slot="dateCell"
                    slot-scope="{date, data}">
                    <div :class="data.isSelected ? 'is-selecteds' : ''" style="height:100%">
                      <p :class="data.isSelected ? 'is-selected' : ''"  @click="allcalendar(data)" style="height: 50px;font-size: 16px;line-height: 50px;text-align: center;">
                        <!-- {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}} -->
                        {{ Number(data.day.split('-').slice(2).join('')) }} {{ data.isSelected ? '✔️' : ''}}
                      </p>
                    </div>
                  </template>
                  <!-- <div
                      slot="dateCell"
                      slot-scope="{ data }"
                      @click="allcalendar(data)"
                    >
                      <p :class="data.isSelected ? 'is-selected' : ''">
                        {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
                      </p>
                    </div> -->
                </el-calendar>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="handleClose(1)">取 消</el-button>
                  <el-button type="primary" @click="handleClose(2)">确 定</el-button>
                </span>
              </el-dialog>
              
              <!-- <img style="height: 30px;width: 30px;display: inline-block;background-size: 100% 100%;border-radius: 50%;background-image:url('@/src/assets/history.jpg');"> -->
            </div>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary" icon="el-icon-search" v-auth="['201000_B']">查询</el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>

          <el-form-item style="float: right;margin-right: 0">
            <el-row>
              <el-button @click="newAdd" size="medium" v-auth="['201008_B']">新增航线</el-button>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
      <Table ref="multipleTable1" :messageTime='messageTime' :tableData='tableData' :columns='columns' :operation='operation' @sortChange='sortChange'
        :total='total' :currentPage='pageNum' :pageSize='pageSize' @sizeChange='handleSizeChange' @sortChangeA="sortChangeA"
        @currentChange='handleCurrentChange' @handleClick='handleClick' @switchChangeUser="switchChangeUser">
      </Table>
      
    </div>
    <!-- <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="150px">

    </el-dialog> -->
  </div>
</template>

<script>
  import Table from '@/components/Table'
  import {
    toData
  } from '@/util/assist'
  export default {
    data() {
      return {
        messageTime:'',
        inputShow:false,
        dogtype:1,
        timeValue:'',
        valueTime:new Date(),
        valueTi:{
          year:2022,
          moth:1,
          day:1,
        },
        dogShow:false,
        sortInt:1,
        // dataValue:'',
        openCalendar:false,
        //table
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        columns: [{
            label: '航线ID',
            prop: 'id',
            show: true,
            sort:false,
            width: '90'
          },
          {
            label: '航司代码',
            // prop: 'airCompanyCode',
            prop: 'airCompanyCode',
            show: true,
            sort:true,
            width: '100'
          },
          {
            label: '起运港',
            prop: 'pol',
            show: true,
            sort: true,
            width: '100'
          },
          {
            label: '目的港',
            prop: 'pod',
            show: true,
            sort: true,
            width: '100'
          },
          {
            label: '航线区域',
            prop: 'continent',
            show: true,
            sort: true,
            width: '100'
          },
          {
            label: '中转/直飞',
            // prop: 'nonStop',
            prop: 'tp',
            sort: true,
            show: true,
            width: '100'
          },
          {
            label: '时效',
            prop: 'legCount',
            show: true,
            width: '50'
          },
          // {
          //   label: '飞机型号',
          //   prop: 'planeType',
          //   show: true,
          //   width: '150'
          // },
          // {
          //   label: '托盘',
          //   prop: 'tray',
          //   show: true,
          //   width: '50'
          // },
          // {
          //   label: '散货',
          //   prop: 'bulkCargo',
          //   show: true,
          //   width: '50'
          // },
          // {
          //   label: '状态',
          //   prop: 'status',
          //   show: true,
          //   width: '100'
          // },
          // {
          //   label: 'MUST GO',
          //   prop: 'status',
          //   show: true,
          //   width: '80'
          // },
          {
            label: '代理公司',
            sort: false,
            prop: 'agentName',
            // prop: 'airlineUpdateTime',
            show: true,
            width: '180'
          },
          {
            label: '更新时间',
            sort: true,
            prop: 'updateTime',
            // prop: 'airlineUpdateTime',
            show: true,
            width: '180'
          },
          {
            label: '更新时间',
            sort: true,
            prop: 'importUnchangeTime',
            show: true,
            width: '180'
          },
          {
            label: '航线负责人',
            sort: true,
            prop: 'airLinePersonName',
            show: true,
            width: '120'
          }
        ],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '100',
          options: [{
              label: '编辑',
              method: 'routeEdit',
              auth: ['201005_B'],
            },
            // {
            //   label: '删除',
            //   method: 'routeDel'
            // },
            {
              label: '查看',
              method: 'routeView',
              auth: ['201006_B'],
            }
          ]
        },
        pol: '',
        pod: '',
        tp:'',
        agentName: '',
        airCompanyCode: '',
        legCount: '',
        continent: '',
        airLinePersonName:'',
        routeArea: [
          {
            name: '全部',
            value: '0'
          },
          {
            name: '欧洲',
            value: '1'
          },
          {
            name: '亚洲',
            value: '2'
          },
          {
            name: '非洲',
            value: '3'
          },
          {
            name: '北美洲',
            value: '4'
          },
          {
            name: '南美洲',
            value: '5'
          },
          {
            name: '南极洲',
            value: '6'
          },
          {
            name: '大洋洲',
            value: '7'
          },
        ],
        legCountOpt: [{
            name: '全部',
            value: '2'
          },
          {
            name: '直飞',
            value: '1'
          },
          {
            name: '中转',
            value: '0'
          },
        ],
        status: '',
        statusOpt: [{
            name: '全部',
            value: '2'
          },
          {
            name: '下架',
            value: '1'
          },
          {
            name: '上架',
            value: '0'
          },
        ],
        loading: false,
        polOpt: [],
        podOpt: [],
        airCompanyCodeOpt: [],
        agentOpt: [],
        airLinePersonNameArr:[],
        ptOpt:[],
        newDate:'',
        aaa:'',
        // winHeight:'',
        // winWidth:'',
      }
    },
    // watch:{
    //   dogShow: {
    //         handler(newName, oldName) {
    //         // console.log('监听变化：'+newName);
    //         this.changeForm(newName)
    //         },
    //         immediate: true,
    //         deep: true
    //     },
    // },
    beforeMount(){
      var d = this.valueTime //转换时间戳
      // this.valueTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      this.valueTi.year = d.getFullYear()
      this.valueTi.moth = d.getMonth() + 1
      this.valueTi.day = d.getDate()
    },
    mounted() {
      // this.winHeight = (window.innerHeight/2-20)+'px'
      // this.winWidth = (window.innerWidth/2-200)+'px'
      // console.log(this.winHeight,this.winWidth);
       if(this.$route.query.time) {
         if(this.$route.params.type == 1){
          this.initAirlineSearchByPage(true)
        } else if(this.$route.params.type == 2) {
          this.initAirlineSearchByPage(true)
        }
      } else {
      this.initAirlineSearchByPage()

      }
      this.initAirportSearchByPage()
      this.initCompanySearchByPage()
      this.initAgentList()
      this.airLinePersonNames()
    },
    methods: {
      handleClose(type){
        clearTimeout(this.aaa)
        if(type == 1){
          this.timeValue = this.timeValue
        }else if(type == 2){
          console.log(this.valueTi.year.length);
          if((""+this.valueTi.year).length != 4){
            return this.$message.error('年份不合法')
          }
          if((""+this.valueTi.day).length == 0){
            return this.$message.error('请输入月份')
          }
          if((""+this.valueTi.moth).length == 0){
            return this.$message.error('请输入日期')
          }
          if((""+this.valueTi.day).length == 1){
            this.valueTi.day = '0'+this.valueTi.day
          }
          if((""+this.valueTi.moth).length == 1){
            this.valueTi.moth = '0'+this.valueTi.moth
          }
          this.timeValue = this.valueTi.year + '-' + this.valueTi.moth + '-' + this.valueTi.day
          // this.timeValue = '2022-04-07'
        }else if(type == 3){
          this.timeValue = this.timeValue
        }
        console.log(this.timeValue);
        this.dogShow = false
        this.inputShow =false
        this.initAirlineSearchByPage()
      },
      retTime(time){
        if(this.valueTi.year == '' || this.valueTi.moth == "" || this.valueTi.day == ''){
          return
        }
        this.valueTime = this.valueTi.year + '-' + this.valueTi.moth + '-' + this.valueTi.day
        this.timeValue = this.valueTime
      },
      openDia(){
        this.getLangDate()
      },
      dateFilter(date){ //值小于10时，在前面补0
         if(date < 10){
            return "0"+date
            }
            return date
     },
    getLangDate(){
         var dateObj = new Date(); //表示当前系统时间的Date对象
         var year = dateObj.getFullYear(); //当前系统时间的完整年份值
         var month = dateObj.getMonth()+1; //当前系统时间的月份值
         var date = dateObj.getDate(); //当前系统时间的月份中的日
         var day = dateObj.getDay(); //当前系统时间中的星期值
         var weeks = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
         var week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
         var hour = dateObj.getHours(); //当前系统时间的小时值
         var minute = dateObj.getMinutes()//当前系统时间的分钟值
         var second = dateObj.getSeconds()//当前系统时间的秒钟值
         var timeValue = "" +((hour >= 12) ? (hour >= 18) ? "晚上" : "下午" : "上午" ); //当前时间属于上午、晚上还是下午
         this.newDate = this.dateFilter(year)+"年"+this.dateFilter(month)+"月"+this.dateFilter(date)+"日 "+this.dateFilter(hour)+":"+this.dateFilter(minute)+":"+this.dateFilter(second)
        //  document.getElementById("nowTime").innerHTML = "当前时间： "+newDate+"　"+week
         this.aaa = setTimeout(this.getLangDate,1000)
         console.log(this.newDate);
     },
      allcalendar(data) {
        // const loading = this.$loading({
        //   // lock: true,  //加上这个 页面点击日历的时候会莫名其妙抖动一下 因为我界面上有滚动条，所以我注释了
        //   text: "Loading",
        //   spinner: "el-icon-loading",
        //   background: "rgba(0, 0, 0, 0.7)",
        // });
          this.valueTime = data.day; //取到你需要的日期data.day
          //需要用到这日期做啥事，比如做为调接口的参数
          // loading.close();
          // console.log(this.valueTime);
          var d = new Date(this.valueTime)
          this.valueTi.year = d.getFullYear()
          this.valueTi.moth = d.getMonth() + 1
          this.valueTi.day = d.getDate()
          // this.timeValue = this.valueTime
      },
      // 时间排序
      sortChangeA(e){
        if(e == 'descending'){//降序
          this.sortInt = 1
        }else if(e=='ascending'){//升序
          this.sortInt = ""
        }else{//升序
          this.sortInt = 1
        }
        // console.log(e);
        this.initAirlineSearchByPage()
      },
      // 跳转到操作历史页面
      skipHistory(){
        this.$router.push('/routeManagement/historyOperating')
      },

      airLinePersonNames(){
        this.$http.post(this.$service.personNames).then((data) => {
          if(data.code == 200){
            var arrays = []
            for(let i=0;i<data.data.length;i++){
              var obj = {
                'value':data.data[i]
              }
              arrays.push(obj)
            }
            this.airLinePersonNameArr = arrays
          }else{
            this.$message.error(data.message)
          }
        })
      },
      // sortChange(e){
      //   console.log(e);
      // },
      // 历史操作
      history(){
        
      },
      //起始港三字码
      initAirportSearchByPage(keyWord, type) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.airportSearchByPage + '?keyWord=' + keyWord).then((data) => {
          this.loading = false
          if (data.code == 200) {
            if (type == '起始港') {
              this.polOpt = data.data.records
            } else if (type == '目的港') {
              this.podOpt = data.data.records
            } else if (type == '中转港') {
              this.ptOpt = data.data.records
            } else {
              this.polOpt = data.data.records
              this.podOpt = data.data.records
              this.ptOpt = data.data.records
            }
          } else {
            this.$message.error(data.message)
          }
        })
      },
      polMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord, '起始港')
      },
      tpMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord, '中转港')
      },
      podMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord, '目的港')
      },
      //航司公司
      initCompanySearchByPage(keyWord) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.companySearchByPage + '?keyWord=' + keyWord).then((data) => {
          this.loading = false
          if (data.code == 200) {
            this.airCompanyCodeOpt = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },
      companyMethod(keyWord) {
        this.initCompanySearchByPage(keyWord)
      },
      //代理公司
      initAgentList(agentName) {
        if(agentName == '' || agentName == undefined){
          var data = ''
        }else{
          var data = ''+agentName
        }
        this.$http.post(this.$service.getlistAgent, data).then((data) => {
          if (data.code == 200) {
            this.agentOpt = data.data
          }
        })
      },
      agentMethod(agentName) {
        this.initAgentList(agentName)
      },
      switchChangeUser(item) {
        var data = {
          id: item.row.id,
          status: item.row.status ? 0 : 1
        }
        this.$http.post(this.$service.airlineUpdate, data).then(data => {
          if (data.code == 200) {
            this.$message.success('状态更新成功')
            this.initAirlineSearchByPage()
          } else {
            this.$message.error('状态更新失败')
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      //航线列表
      initAirlineSearchByPage(ifNewData) {
        const vm = this
        // var dataVal = (""+this.dataValue).slice(0,10)
        var data = {
          crOrUpDate:this.timeValue,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          pol: this.pol,
          pod: this.pod,
          sortInt: this.sortInt,
          // status: this.status,
          // legCount: this.legCount,
          tp: this.tp,
          airCompanyCode: this.airCompanyCode,
          agentName: this.agentName,
          // continent: this.continent
          airLinePersonName: this.airLinePersonName
        }
        if(ifNewData){
          data.airlineIds = this.$route.params.airlineIds?this.$route.params.airlineIds.split(","):[]
        }
        vm.$http.post(ifNewData?vm.$service.notUpInSeByPage:vm.$service.airlineSearchByPage, data).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.records
            if(this.timeValue == null || this.timeValue == '' || this.timeValue == undefined || data.data.records.length > 0){
              this.messageTime = ''
              return
            }else{
              var time = this.timeValue.split('-')
              this.messageTime = Number(time.slice(0,1).join(''))+'年'+Number(time.slice(1,2).join(''))+'月'+Number(time.slice(2).join(''))+'日 暂无航线'
              console.log(this.messageTime);
            }
          }else {
            this.$message.error(data.message)
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      //查询
      searchClick() {
        this.pageSize = 10
        this.pageNum = 1
        this.initAirlineSearchByPage()
      },
      //重置
      restClick() {
        this.timeValue = ''
        this.sortInt= 1
        // this.dataValue=''
        this.pol = ''
        this.pod = ''
        this.agentName = ''
        this.tp = ''
        this.airLinePersonName=''
        this.airCompanyCode = ''
        this.legCount = ''
        this.status = ''
        this.pageSize = 10
        this.pageNum = 1
        this.initAirlineSearchByPage()
        this.initAirportSearchByPage()
        this.initCompanySearchByPage()
        this.initAgentList()
      },
      //新增
      newAdd() {
        this.$router.push('/routeManagement/routeAdd')
      },
      //操作
      handleClick(scope) {
        var vm = this
        if (scope.method == 'routeEdit') {
          this.$router.push({
            path: '/routeManagement/routeEdit',
            query: {
              id: scope.row.id
            }
          })
        } else if (scope.method == 'routeDel') {
          this.$confirm("确定删除这条航线?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            console.log(scope.row);
            // return console.log('中断');
            for(let i=0;i<scope.row.length;i++){
              vm.$http.delete(vm.$service.airlineDelete + '?id=' + scope.row[i].id).then(data => {
                if (data.code == 200) {
                  // vm.$message.success('ID:'+scope.row[i].id+',删除成功')
                  vm.$message.success('删除成功')
                  this.initAirlineSearchByPage()
                } else {
                  vm.$message.error('ID:'+scope.row[i].id+',删除失败')
                }
              })
            }
            
          }).catch(() => {
            console.log('取消')
          })
        } else if (scope.method == 'routeView') {
          this.$router.push({
            path: '/routeManagement/routeDetails',
            query: {
              id: scope.row.id
            }
          })
        }
      },
      handleCurrentChange(e) {
        this.pageNum = e
        this.initAirlineSearchByPage(this.$route.query.time?true:false)
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.initAirlineSearchByPage(this.$route.query.time?true:false)
      },
    },
    watch: {
      tableData(idx) {
        return idx
      },
      '$route.query.time':{
        immediate:false,
        handler(newValue){
           if(this.$route.params.type == 1){
            this.initAirlineSearchByPage(true)
          } else if(this.$route.params.type == 2) {
            this.initAirlineSearchByPage(true)
          }
        }
      }
    },
    components: {
      Table
    }
  }
</script>


<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");
    /deep/ input::-webkit-outer-spin-button,
    /deep/ input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }
  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }

  .el-form {
    background-color: #FFF;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 20px;
    vertical-align: bottom;
  }

  .messageTimestyle{
    position: absolute;
    top: 0;
    width: 300px;
    height: 40px;
    background: #1989FA;
  }

  .parimary_btn {
    background-color: #9ac143 !important;
    border-color: #9ac143 !important;

    &:hover {
      color: #f1e3d5 !important;
      background-color: #7f9e3c !important;
      border-color: #7f9e3c !important;
    }
  }
  .timeTip{
    margin-top: 10px;
    height: 40px;
    line-height: 40px;
    font-size: 30px;
  }
  .timeTip2 span{
    display: inline-block;
    width: 200px;
  }
  .icon-shouqi {
    color: #3985ca;
    margin-right: 2px;
    font-size: 14px;
    margin-left: 15px;
  }
  /deep/ .el-calendar-table .el-calendar-day{
    padding: 0;
  }

  .shouqi {
    cursor: pointer;
    color: #3985ca;
    position: relative;
  }

  .shouqi .iconfont {
    font-size: 2px;
    position: absolute;
    height: 20px;
    line-height: 20px;
    margin-top: 7px;
    margin-left: 10px;
  }
  .is-selected {
    color: #f3f6f9;
  }
  .is-selecteds {
    background: #1989FA;
  }
  .wrapper,
  .content {
    width: 100%;

    /*background-color: #fff;*/
  }
  .el-table .sort-caret.ascending {
    border-bottom-color: #FFF;
  }
  /deep/ .current{
    height: 50px;
  }
  /deep/ .el-calendar-day{
    height: 50px;
  }
  .content-search-normal {
    padding: 20px 20px 0 20px !important;
    background: #fff;
  }

  .content-search-high {
    padding: 0 0 20px 30px;
  }

  /deep/ .el-dialog {
    min-width: 480px;
    border-radius: 6px;
  }
  .el-calendar {
  text-align: center;
  }
  .temp {
    padding: 20px;
  }
  .is-selected {
    width: 100%;
    height: 100%;
  }
</style>
