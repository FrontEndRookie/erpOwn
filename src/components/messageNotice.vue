<template>
  <div>
    <div v-show="!ifShowMore"  >
      <audio id="noticeMusic" controls  style="position:fixed;top:0;display:none">
      <source src="../assets/message.wav">
    </audio>
      <div
        @dblclick="showMore"
        class="messageOpen"
        style="position: fixed; bottom: 50px; right: 40px; z-index: 10"
      >
        <div
          style="
            fontsize: 15px;
            padding: 2px 0;
            padding-left: 3px;
            display: flex;
            align-items: center;
          "
        >
          <img
            v-if="ifShield=='0'"
            src="../assets/laba.svg"
            alt="" 
            :class="{blink:arrayNotice.length>0 && !ifShield}"
            style="width: 20px; height: 20px; margin-left:20px"
          />
          <img title="取消屏蔽" @click="shieldNotice" v-if="ifShield==1" src="../assets/shieldLogo.svg" alt="" style="width: 20px; height: 20px;margin-left:20px ">
          <el-badge :value="unReadCount"  :class="{blink:arrayNotice.length>0 && ifShield=='0'}" @click.native="showMore(ifShield==1)" :max="99" class="item">
            <span></span>
          </el-badge>
        </div>
        
      </div>
    </div>
    <!-- 未读消息弹框 -->
    <div
      style="
        position: fixed;
        bottom: 95px;
        right: 45px;
        border: 1px solid silver;
        border-radius: 10px;
        background: #fff;
        z-index: 10;
      "
      v-if="ifShowMore"
    >
      <div>
        <div class="noticeTitle">
          <div style="display:flex;align-items:center">
            未读消息<img
              :class="{blink:arrayNotice.length>0 && ifShield=='0'}"
              src="../assets/laba.svg"
              alt=""
              style="width: 15px; height: 15px; margin-left: 5px;"
            />
            <el-badge :value="unReadCount" :max="99" class="item " :class="{blink:arrayNotice.length>0 && ifShield=='0'}">
              <span></span>
            </el-badge>
          </div>
          <div class="titleRight">
            <div class="close" @click="showMore(false)">一</div>
            <div style="font-size:13px;cursor: pointer;text-decoration:underline;text-decoration-color:red;" @click="allHistory">
              <img style="width:25px;height:25px" src="../assets/figure.svg" alt=""> 全部历史 </div>
          </div>
        </div>

        <div>
          <div
            v-if="arrayNotice && arrayNotice.length == 0"
            style="
              min-width: 350px;
              min-height: 150px;
              text-align: center;
              fontsize: 14px;
              fontweight: bolder;
            "
          >
            <img class="data-pic" src="../assets/kong-icon.png" />
            <p style="margin-top: 15px">暂无数据</p>
          </div>
          <!-- 未读消息列表 -->
          <div
            v-else
            v-for="(item, index) in arrayNotice"
            :key="index"
            class="table"
            :style="{
              background: item.readType == 1 ? 'rgba(176,196,222,0.4)' : '',
            }"
               @click="
                  skipToAnother(
                    item.triggerStatus,
                    item.id,
                    item.orderNo,
                    item.orderId,
                    false,
                    item.readType,
                    item.pol
                  )
                "
          >
            <div
              v-for="(itemS, indexS) in headProperty"
              :key="indexS"
              :style="{
                width:
                    (item.triggerStatus == 21 || item.triggerStatus == 28 || item.triggerStatus == 39)
                      ? `${columnSs[indexS]}px` :  (item.triggerStatus >= 35 && item.triggerStatus <= 38)?
                  `${columnSss[indexS]}px`:  (((item.triggerStatus >= 23 && item.triggerStatus<=27) || item.triggerStatus == 34) && !item.orderNo)?`${columnSsss[indexS]}px`:
                  `${columnS[indexS]}px`,
              }"
              class="cell"
            >
              <div
                v-if="itemS == 'readType'"
                class="point"
                :style="{ background: item.readType == 1 ? 'gray' : '' }"
              ></div>
              <div v-else-if="itemS == 'dayTime'">
                {{ getTime(item.createTime, 1) }}
              </div>
              <div v-else-if="itemS == 'hourTime'">
                {{
                  item.triggerStatus == 10 || item.triggerStatus == 11
                    ? ""
                    : getTime(item.createTime, 2)
                }}
              </div>
              <div v-else-if="itemS == 'polPod'">
                {{ computedPolpod(item) }}
                
              </div>
              <div
                v-else-if="itemS == 'triggerStatus'"
                class="cellButton"
                @click="
                  skipToAnother(
                    item.triggerStatus,
                    item.id,
                    item.orderNo,
                    item.orderId,
                    false,
                    item.readType,
                    item.pol
                  )
                "
                :style="{
                  background: orderBackground(
                    item.triggerStatus,
                    item.readType
                  ),
                }"
              >
                {{ orderStatus(item) }}
              </div>
              
              <div v-else style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" :title="item[itemS]">{{ item[itemS] }}</div>
              <div
              style="display:none;text-align:center;width:100%"
              @click.stop=""
              class="ignore"
              v-if="itemS == 'triggerStatus'">
                <img title="忽略" src="../assets/ignoreMessage.svg" @click="ignoreMessage(item.id,false)" alt="" style="width:35px;height:30px;cursor:pointer"/>
                <span style="margin-left:2px">忽略</span>
              </div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;fontSize:14px;padding:12px">
            <div style="cursor:pointer" @click="shieldNotice">{{ifShield=='1'?'取消屏蔽':'屏蔽通知'}}</div>
            <div style="cursor:pointer" @click="ignoreAll">忽略全部</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 全部历史 -->
    <div class="allHistory" v-if="showAllHistory">
      <div class="listTitle">
        <div style="display: flex; align-items: center; fontsize: 14px">
          <img
            src="../assets/allHistory.svg"
            style="width: 25px; height: 25px; margin-right: 6px"
            alt=""
          />
          推送消息历史
        </div>
        <div class="titleRight">
          <div style="fontsize: 12px">
            未读
            <el-badge :value="allUnReadCount" :max="99" class="item">
              <span></span>
            </el-badge>
          </div>
          <div class="close" @click="allHistory">x</div>
        </div>
      </div>
      <div style="max-height: 500px; overflow-y: auto" class="scrollBar">
        <div
          v-if="allArray && allArray.length == 0"
          style="
            min-width: 300px;
            min-height: 130px;
            text-align: center;
            fontsize: 14px;
            fontweight: bolder;
          "
        >
          <img class="data-pic" src="../assets/kong-icon.png" />
          <p style="margin-top: 15px">暂无数据</p>
        </div>
        <!-- 全部消息列表 -->
        <div
          v-else
          v-for="(item, index) in allArray"
          :key="index"
          class="table"
          :style="{
            background: item.readType == 1 ? 'rgba(176,196,222,0.4)' : '',
          }"
        >
          <div
            v-for="(itemS, indexS) in headProperty"
            :key="indexS"
            @click="
                skipToAnother(
                  item.triggerStatus,
                  item.id,
                  item.orderNo,
                  item.orderId,
                  true,
                  item.readType,
                  item.pol
                )
              "
            :style="{
              flex:
                (item.triggerStatus == 21 || item.triggerStatus == 28 || item.triggerStatus == 39)
                  ? `${columnSs[indexS]}px` :  (item.triggerStatus >= 35 && item.triggerStatus <= 38)?
                  `${columnSss[indexS]}px`:   (((item.triggerStatus >= 23 && item.triggerStatus<=27) || item.triggerStatus == 34) && !item.orderNo)?`${columnSsss[indexS]}px`:
                  `${columnS[indexS]}px`,
            }"
            class="cell"
          >
            <div
              v-if="itemS == 'readType'"
              class="point"
              :style="{ background: item.readType == 1 ? 'gray' : '' }"
            ></div>
            <div v-else-if="itemS == 'dayTime'">
              {{ getTime(item.createTime, 1) }}
            </div>
            <div v-else-if="itemS == 'hourTime'">
              {{
                item.triggerStatus == 10 || item.triggerStatus == 11
                  ? ""
                  : getTime(item.createTime, 2)
              }}
            </div>
            <div v-else-if="itemS == 'polPod'">
                 {{ computedPolpod(item) }}
            </div>
            <div
              v-else-if="itemS == 'triggerStatus'"
              class="cellButton"
              @click="
                skipToAnother(
                  item.triggerStatus,
                  item.id,
                  item.orderNo,
                  item.orderId,
                  true,
                  item.readType,
                  item.pol
                )
              "
              :style="{
                background: orderBackground(item.triggerStatus, item.readType),
              }"
            >
              {{ orderStatus(item) }}
            </div>
            <div v-else :style="{'max-width':(item.triggerStatus == 21 || item.triggerStatus == 28)?'210px':''}" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:280px" :title="item[itemS]">{{ item[itemS] }}</div>
            <div
              style="display:none;text-align:center;width:100%"
              @click.stop=""
              class="ignore"
              v-if="itemS == 'triggerStatus' && item.readType != 1">
                <img title="忽略" @click="ignoreMessage(item.id,true)" src="../assets/ignoreMessage.svg" alt="" style="width:35px;height:30px;cursor:pointer"/>
                <span style="margin-left:2px">忽略</span>
              </div>
               <div
              style="display:none;text-align:center;width:100%;color: #fff;
                  border-radius: 4px;
                  padding: 3px 0;
                  width: 100%;
                  cursor: pointer;"
              @click.stop=""
              class="ignore"
              v-if="itemS == 'triggerStatus' && item.readType == 1"
              @click="
                skipToAnother(
                  item.triggerStatus,
                  item.id,
                  item.orderNo,
                  item.orderId,
                  true,
                  item.readType,
                  item.pol
                )
              "
              :style="{
                background: orderBackground(item.triggerStatus, item.readType),
              }">
              {{ orderStatus(item) }}
              </div>
          </div>
        </div>
      </div>
     
      <div style="display:flex;justify-content:space-between;align-items:center;fontSize:14px;padding:0 10px">
            <div style="cursor:pointer" @click="shieldNotice">{{ifShield=='1'?'取消屏蔽':'屏蔽通知'}}</div>
             <el-pagination
                style="margin-top: 10px; text-align: center"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageNum"
                :page-sizes="[20, 30, 50]"
                :page-size="pageSize"
                pager-count=5
                layout="prev, pager, next,total,sizes"
                :total="total"
              >
              </el-pagination>
            <div style="cursor:pointer" :style="{opacity:this.allUnReadCount=='0'?0:1}"  @click="ignoreAll">忽略全部</div>
          </div>
    </div>
    <!-- 遮罩层 -->
    <div class="hideBox" v-if="showAllHistory"></div>
  </div>
</template>

<script>
const { WS_URL:messageUrl} = process.env
export default {
  components: {},
  props: {},
  data() {
    return {
      //访问权限
      noVisitAuth:'',
      //消息通知v2
      ifShield:-1,

      //定时请求
      allIntervalRequest: "",
      noticeIntervalRequest: "",

      //ws长连接
            timeout: 30 * 1000,//30秒一次心跳
            timeoutObj: null,//心跳心跳倒计时
            serverTimeoutObj: null,//心跳倒计时
            timeoutnum: null,//断开 重连倒计时

      //全部历史弹框分页
      pageNum: 1,
      pageSize: 20,

      //消息列表弹框显示
      ifShowMore: false,
      //全部历史弹框显示
      showAllHistory: false,
      //消息列表数据
      arrayNotice: [],
      //消息列表未读数据
      unReadCount: 0,
      //全部历史数据
      allArray: [],
      allUnReadCount: 0,
      //表格表头属性
      headProperty: [
        "readType",
        "dayTime",
        "hourTime",
        "orderNo",
        "polPod",
        "triggerStatus",
      ],
      //消息列表/全部历史表格宽度
      columnS: [20, 80, 50, 125, 70, 140],
      columnSs: [20, 80, 50, 185, 10, 140],
      columnSss:[20, 80, 50, 75, 120, 140],
      columnSsss:[20, 80, 50, 5, 190, 140],

      //报错计数
      errorSize: 0,
      //首单号 -判断是否有新消息
      newFirstOrder: "",
    };
  },
  watch: {},
  computed: {
    //polpod部分显示
    computedPolpod(item){
      return (item)=>{
         if(((item.triggerStatus >= 23 && item.triggerStatus<=27) || item.triggerStatus == 34) && !item.orderNo) {
          return item.pod
         }
         else {
           return (item.pol &&item.pod)? item.pol + "-" + item.pod : item.triggerStatus>=35 && item.triggerStatus <= 38 ? item.pol :""
         }
      }
               

    },
    //状态文字
    orderStatus() {
      return ({ triggerStatus: f, createUserName }) => {
        if (f == 1) {
          return "订单生成,分配航线";
        } else if (f == 2) {
          // return "订单待审核";
          return "订单生成，待航线审核";
        } else if (f == 3) {
          return "订单已审核,待进仓";
        } else if (f == 4) {
          return "即将超时未进仓";
        } else if (f == 5) {
          return "客户已取消订单";
        } else if (f == 6) {
          return "货物已进仓";
        } else if (f == 7) {
          return "进仓数据已生成";
        } else if (f == 8) {
          return "进仓数据已确认";
        } else if (f == 9) {
          return "客户已确认账单";
        } else if (f == 10) {
          return "发票已开";
        } else if (f == 11) {
          return "发票部分开";
        } else if (f == 12) {
          return "账单解锁申请";
        } else if (f == 13) {
          return "账单解锁已通过";
        } else if (f == 14) {
          return "账单解锁已驳回";
        } else if (f == 15) {
          return "交单修改待审核";
        } else if (f == 16) {
          return "月结开票申请";
        } else if (f == 17) {
          return "单独开票申请";
        } else if (f == 18) {
          return "交单修改已通过";
        } else if (f == 19) {
          return "交单修改已驳回";
        } else if (f == 20) {
          return "进仓数据有异议";
        } else if (f == 21) {
          return "点击查看";
        } else if (f == 22) {
          return "进仓数据的申请复测";
        } else if (f == 23) {
          return "新工单-待处理";
        } else if (f == 24) {
          return "工单再询";
        } else if (f == 25) {
          return "工单已关闭";
        } else if (f == 26) {
          return "工单已回复";
        } else if (f == 27) {
          return "已转单";
        } else if (f == 28) {
          return '点击查看'
        }else if (f == 29) {
          return '订单生成,分配售前'
        }else if (f == 30) {
          return '操作已变更'
        }else if (f == 31) {
          return '起运港已变更'
        }else if (f == 32 || f == 33) {
          // return '订单已取消'
          return `${createUserName || ''}已取消订单`
        }else if (f == 34) {
          return '供应商报价'
        }else if (f == 35) {
          return '去审核'
        }
        else if (f == 36) {
          return '去打款'
        }
        else if (f == 37 || f == 38 || f == 39) {
          return '查看'
        }
        else if (f == 102) {
          return '进仓地图已生成'
        }
        else if (f == 103) {
          return '进仓地图已更新'
        }
        else if (f == 104) {
          return '请确认进仓数据'
        }
        else if (f == 109) {
          return '请重新确认进仓数据'
        }
        else if (f == 117) {
          return '已交单'
        }
        else if (f == 118) {
          return `${createUserName || ''}申请解锁`
        }
      };
    },
    //状态背景色
    orderBackground() {
      let blue = [3, 6, 7, 8, 11, 12, 15, 16, 17, 21,22, 23,24,25,26,27,28,30,31,34,35,36,37,38,39, 102, 103, 104, 109];
      let green = [9, 10, 13, 18];
      let red = [4, 5, 14, 19,32,33];
      let lightRed = [20];
      let pink = [1, 2, 29];
      let yellow = [117, 118];
      return (f, ifRead) => {
        if (ifRead == 1) {
          return "#555555";
        } else if (blue.indexOf(f) != -1) {
          return "#02a7f0";
        } else if (green.indexOf(f) != -1) {
          return "#70b603";
        } else if (red.indexOf(f) != -1) {
          return "#a30014";
        } else if (lightRed.indexOf(f) != -1) {
          return "#d9001b";
        } else if (pink.indexOf(f) != -1) {
          return "#ec808d";
        } else if (yellow.indexOf(f) != -1) {
          return "#f59a23";
        }
      };
    },
    //时间
    getTime() {
      return (data, type) => {
        // var userAgent = navigator.userAgent;
      //判断是否Safari浏览器
      // if (userAgent.indexOf("Safari") > -1) {
        data = data.replace(/\-/g,"/");  //把'-'转成'/' yyyy/mm/dd
      // }
        let res = new Date(data);
        // console.log(res)
        if (type == 1 && res) {
          return (
            res.getFullYear() +
            "-" +
            (res.getMonth() + 1 > 9
              ? res.getMonth() + 1
              : "0" + (res.getMonth() + 1)) +
            "-" +
            (res.getDate() > 9 ? res.getDate() : "0" + res.getDate())
          );
        }
        if (type == 2 && res) {
          return (
            (res.getHours() > 9 ? res.getHours() : "0" + res.getHours()) +
            ":" +
            (res.getMinutes() > 9 ? res.getMinutes() : "0" + res.getMinutes())
          );
        }
      };
    },
  },
  methods: {
    //消息通知v2
    ignoreMessage(id,ifAll){
this.$http.get(this.$service.toRead + "?mesId=" + id).then((res) => {
          if (res.code == 200) {
            if (ifAll) {
              this.allHistory();
              this.allHistoryData();
            } 
              this.noticeMessageData();
          }else {
            this.$message.error(res.message)
          }
          })
    },
    
    //忽略全部
    ignoreAll(){
      let id = JSON.parse(sessionStorage.getItem('userInfo')).id
      this.$http.post(this.$service.toAllRead+"?id="+id).then(res=>{
        if(res.code==200){
          this.ifShowMore = false
          this.noticeMessageData()
          if(this.showAllHistory){
            this.allHistoryData()
          }
        }
        else{this.$message.error(res.message)}
      })
    },
    //屏蔽通知
    shieldNotice(){
      let id = JSON.parse(sessionStorage.getItem('userInfo')).id
      this.$http.post(this.$service.toMaskMessage+"?id="+id).then(res=>{
      if(res.code==200){
        if(this.ifShield == '1') {
          this.ifShield = '0'
        } else {
          this.ifShowMore = false
          this.showAllHistory = false
          this.ifShield = '1'
        }
        }
      else{
        this.$message.error(res.message)
        }
      })
    },

    //
    reconnect() { // 重新连接
            if(this.lockReconnect) return;
            this.lockReconnect = true;
            //没连接上会一直重连，设置延迟避免请求过多
            this.timeoutnum && clearTimeout(this.timeoutnum);
            this.timeoutnum = setTimeout(() => {
                //新连接
                this.initWebSocket();
                this.lockReconnect = false;
            }, 5000);
        },
      reset() { // 重置心跳
            // 清除时间
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            // 重启心跳
            this.start();
        },
        start() { // 开启心跳
            this.timeoutObj && clearTimeout(this.timeoutObj);
            this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
            this.timeoutObj = setTimeout(() => {
                // 这里发送一个心跳，后端收到后，返回一个心跳消息，
                if (this.socket && this.socket.readyState == 1) { // 如果连接正常
                    this.websocketsend('ping');
                } else { // 否则重连
                    this.reconnect();
                }
                this.serverTimeoutObj = setTimeout(() => {
                    //超时关闭
                    this.socket.close();
                }, this.timeout);
 
            }, this.timeout)
        },
     initWebSocket() {
					if(typeof(WebSocket) === "undefined"){
						alert("您的浏览器不支持socket")
					}else{
            localStorage.setItem('closeWebsocket',true)
            // console.log(this.socket,"===");
            let id = JSON.parse(sessionStorage.getItem('userInfo')).id
						// 实例化socket
						this.socket = new WebSocket(messageUrl+'wsMes/erp_'+id)
						// 监听socket连接
						this.socket.onopen = this.open
						// 监听socket错误信息
						this.socket.onerror = this.error
						// 监听socket消息
						this.socket.onmessage = this.getMessage
            //关闭socket连接
            this.socket.onclose = this.websocketclose;
					}
				},
				open() {
          //开启新跳
          this.start()
					console.log("socket连接成功")
				},
				error() {
					console.log("连接错误")
				},
        websocketclose: function (e) {
            this.socket.close();
            console.log("connection closed ");
	  	},
      websocketsend(messsage) {
            this.socket.send(messsage)
      },
				getMessage(msg) {
            // console.log(msg);
            let obj = JSON.parse(JSON.stringify(msg.data));
            console.log("obj",obj)
            if(obj.indexOf("当前设备请下线")>0){
              this.websocketclose()
              // window.open(location.origin+"/#/?close=true","_self")
              this.$router.push("/?close=true")
              return
            }
            if (obj == 'pong') {
                //收到服务器信息，心跳重置
                    this.reset();
            } else if(obj == 'down'){
              this.$notify.error({
                title: '连接已断开',
                message: '消息通知连接已在其他页面建立，当前页面连接已下线',
                duration: 0
              });
                
                this.websocketclose()
              } else{
                      // let object = JSON.parse(msg.data)
                      // console.log(msg,msg.data)
                      // let obj_orderno = msg.data.substr(msg.data.indexOf("orderNo")+10,15)

                      // let orderno = document.getElementById('infoOrderNoId')?document.getElementById('infoOrderNoId').innerText:''
                      // console.log(orderno,obj_orderno)
                      // if(orderno && obj_orderno == orderno){
                      //   this.$store.commit('changeWarnOrderNo',obj_orderno)
                      // }
                      this.noticeMessageData()
                      this.allHistoryData()
                      this.$store.dispatch("getMenuCountInfo");
                      if(this.ifShield==1) {
                        return
                      }
                      this.ifShowMore = true
                      let audio = document.getElementById("noticeMusic")
                      if(audio!==null){             
                          //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
                        if(audio.paused)                     {  
                            audio.play();//audio.play();// 这个就是播放  
                        }else{
                        audio.pause();// 这个就是暂停
                        }
                      }
                      
                }
       
					}
				,
    //功能跳转页面
   async skipToAnother(type, id, orderNo, orderId, ifAll, ifRead,airLineId) {
      let obj_orderno = document.getElementById('infoOrderNoId')?document.getElementById('infoOrderNoId').innerText:''
      // console.log(orderNo,obj_orderno,obj_orderno == orderNo)
      if(obj_orderno && obj_orderno == orderNo){
        this.$store.commit('changeWarnOrderNo',orderNo)
        console.log("当前页面刷新");
      }
      let dataTime = new Date().getTime();
      if (ifRead != 1) {
        let res = await this.$http.get(this.$service.toRead + "?mesId=" + id)
        if(res.code != 200) {
          return this.$message.error(res.message)
        }
      }
        if (ifAll) {
          this.allHistory();
          this.allHistoryData();
        } 
          this.noticeMessageData();
        //跳转至订单页面
        if (
          (type >= 1 && type <= 11) ||
          type == 13 ||
          type == 14 ||
          type == 18 ||
          type == 19 ||
          type == 20 ||
          type == 22 || 
          (type >= 29 && type <= 33) ||
          type == 102 || 
          type == 103 ||
          type == 104 ||
          type == 109 ||
          type == 117 ||
          type == 118
        ) {
          //显示账单栏
          if (
            type == 9 ||
            type == 10 ||
            type == 11 ||
            type == 13 ||
            type == 14 ||
            type == 18 ||
            type == 19 ||
            type == 117
          ) {
            this.$router.push({
              path: "/orderManagement/orderDetailNew",
              query: { id: orderId, tab: 2},
            });
          }
          //显示进仓栏
          else if (type == 4 || type == 8 || type == 20 || type == 22 || type == 102 || type == 103 || type == 104 || type == 109) {
            this.$router.push({
              path: "/orderManagement/orderDetailNew",
              query: { id: orderId, tab: 3},
            });
          } else {
            this.$router.push({
              path: "/orderManagement/orderDetailNew",
              query: { id: orderId, tab: 1},
            });
          }
        }
        //跳转至财务开票页面
        else if (type == 16 || type == 17) {
          this.$router.push({
            name: "invoiceList",
            params: { orderNo: orderNo, tab: type == 16 ? 2 : 3, page: 2 },
            query: { time: dataTime },
          });
        }
        //跳转至财务列表页面
        else if (type == 12 || type == 15) {
          this.$router.push({
            name: "financeManage",
            params: {
              orderNo: orderNo,
              orderId: orderId,
              tab: type == 12 ? 1 : 2,
              page: 3,
            },
            query: { time: dataTime },
          });
        }
        //跳转到航线页面
        else if (type == 21) {
          this.$router.push({ name: "routeManage" ,query: { time: dataTime },params:{orderId:orderId,airlineIds:'',type:2}});
        }
        //跳转到工单页面
        else if((type >= 23 && type<=25)|| type ==26 || type == 27 || type == 34){
          if(!orderNo){
              if(this.noVisitAuth.some(item=>item=='420700_M')){
                this.$message.error("无权访问航线接待页面")
              }else {
                this.$router.push({ name: "airReception",  params: { orderId: orderId,chatType:airLineId },query: { time: dataTime },});
              }
          }
          else{
             if(this.noVisitAuth.some(item=>item=='400700_M') && this.noVisitAuth.some(item=>item=='401700_M')){
                this.$message.error("无权访问客服工单和航线工单页面")
              } else if(this.noVisitAuth.some(item=>item=='400700_M')){
                this.$router.push({ name: "airlineWorkOrder",  params: { orderId: orderId },query: { time: dataTime },});
              } else if(this.noVisitAuth.some(item=>item=='401700_M')){
                this.$router.push({ name: "serviceWorkOrder",  params: { orderId: orderId },query: { time: dataTime },});
              }
              else {
                this.$router.push({ name: "serviceWorkOrder",  params: { orderId: orderId },query: { time: dataTime },});
              }
          }
         
        }
      
       //跳转到航线页面
        else if (type == 28) {
          this.$router.push({ name: "routeManage" ,query: { time: dataTime },params:{orderId:orderId,airlineIds:airLineId,type:1}});
        }
        //跳转到客户列表
        else if(type == 35 || type == 36 || type == 37 || type == 38 ){
          this.$router.push({name:"clientManage",query:{companyName:orderNo,ifPage:true}})
        }
        //跳转到一代管理列表
        else if(type == 39 ){
          if(this.noVisitAuth.some(item=>item=='251700_M')){
            this.$message.error("无权访问一代管理列表页面")
          }
         else {
          this.$router.push({name:"generation",query:{tab:2,time: dataTime}})
         } 
        }
    },
    handleCurrentChange(e) {
      this.pageNum = e;
      this.allHistoryData();
    },
    handleSizeChange(e) {
      this.pageNum = 1;
      this.pageSize = e;
      this.allHistoryData();
    },
    //打开关闭消息列表
    showMore(ifShield) {
     if(ifShield){
       this.showAllHistory = true
       return
     }
      this.ifShowMore = !this.ifShowMore;

      if (this.ifShowMore) {
        this.noticeMessageData();
      }
    },
    //全部历史
    allHistory() {
      this.showAllHistory = !this.showAllHistory;
      if (this.showAllHistory) {
        this.allHistoryData();
      } 
    },
    //消息列表数据
    noticeMessageData(first) {
      let id = JSON.parse(sessionStorage.getItem("userInfo")).id;
      this.$http
        .get(this.$service.getBoxMessage + "?id=" + id + "&type=1")
        .then((res) => {
          if (res.code == 200) {
            this.arrayNotice = res.data.tmessageNotices;
            this.unReadCount = res.data.unReadCount;
            this.ifShield = res.data.isReceiveMes;
              if(first && this.arrayNotice.length>0 && this.ifShield=='0'){
              this.ifShowMore = true;
              let audio = document.getElementById("noticeMusic")
              if(audio!==null){             
                  //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
                if(audio.paused)  {
                    audio.play();//audio.play();// 这个就是播放  
                }else{
                 audio.pause();// 这个就是暂停
                }
              }
            }
          }
        });
    },
    //全部历史数据
    allHistoryData() {
      let id = JSON.parse(sessionStorage.getItem("userInfo")).id;
      let request = {
        id: id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        type: 1,
      };
      this.$http.post(this.$service.getAllMessage, request).then((res) => {
        if (res.code == 200) {
          this.allArray = res.data.tmessageNotices.records;

          //   this.unReadCount = res.data.unReadCount
          this.allUnReadCount = res.data.unReadCount;
          this.total = res.data.mesCount;
        }
      });
    },
    //悬浮框拖动
    //获取元素
    dragElement(){
      var dv = document.getElementsByClassName("messageOpen")[0];
        var x = 0;
        var y = 0;
        var l = 0;
        var t = 0;
        var isDown = false;
        //鼠标按下事件
        dv.onmousedown = function (e) {
          undefined;
          //获取x坐标和y坐标
          x = e.clientX;
          y = e.clientY;

          //获取左部和顶部的偏移量
          l = dv.offsetLeft;
          t = dv.offsetTop;
          //开关打开
          isDown = true;
          //设置样式
          dv.style.cursor = "move";
        };
        //鼠标移动
        window.onmousemove = function (e) {
          undefined;
          if (isDown == false) {
            undefined;
            return;
          }
          //获取x和y
          var nx = e.clientX;
          var ny = e.clientY;
          //计算移动后的左偏移量和顶部的偏移量
          var nl = nx - (x - l);
          var nt = ny - (y - t);

          dv.style.left = nl + "px";
          dv.style.top = nt + "px";
        };
        //鼠标抬起事件
        dv.onmouseup = function () {
          undefined;
          //开关关闭
          isDown = false;
          dv.style.cursor = "default";
        };
    }
  },
  created() {},
  mounted() {
    this.noVisitAuth = JSON.parse(sessionStorage.getItem('noAuthCodes'))
    this.initWebSocket()
    this.noticeMessageData(true);
    this.allHistoryData();
    this.dragElement()
  
  },
  beforeDestroy(){
    // console.log(this.socket,"-------=1=-------");
    clearTimeout(this.timeoutnum)
    clearTimeout(this.timeoutObj)
    this.socket.close();
    // console.log(this.socket,"-------=2=-------");
  },
  destroyed() {
    // 销毁监听
				this.socket.onclose = this.close
  },
};
</script>

<style scoped lang='less'>
@keyframes blink-normal{
  60% {opacity: 0;}
  };

.blink{
    animation: 1s blink-normal infinite step-end;
}

/deep/ .el-badge__content.is-fixed {
  position: absolute;
  top: 0;
  right: -5px;
  cursor: pointer;
}
.allHistory {
  width: 40%;
  min-width: 666px;
  position: absolute;
  left: 30%;
  top: 20%;
  background: #fff;
  border: 1px solid silver;
  border-radius: 10px;
  z-index: 300;
  padding-top: 5px;
  padding-bottom: 10px;
  .listTitle {
    border-bottom: 1px solid silver;
    display: flex;
    justify-content: space-between;
    padding: 25px 10px 5px;
    align-items: center;
    .titleRight {
      position: relative;
      transform: translateX(-18px);
      .close {
        position: absolute;
        right: -20px;
        top: -30px;
        color: silver;
        font-size: 15px;
        border: 1px solid silver;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        line-height: 13px;
        cursor: pointer;
        text-align: center;
      }
    }
  }
}
.hideBox {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
}
.arrow:after {
  content: " ";
  border-width: 8px;
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  bottom: -12px;
  right: 20px;
  margin-bottom: 1px;
  border-bottom-width: 0;
  border-top-color: silver;
}
.noticeTitle {
  border-bottom: 1px solid silver;
  display: flex;
  justify-content: space-between;
  padding: 30px 10px 5px;
  .titleRight {
    .close {
      position: absolute;
      right: 15px;
      top: 5px;
      color: silver;
      font-size: 22px;
      font-weight: 900;
      cursor: pointer;
    }
  }
}
.table {
  display: flex;
  justify-content: center;
  padding: 0 10px;
  padding-left: 0px;
  font-size: 14px;
  border-bottom: 1px solid silver;
  &:last-child {
    border-bottom: 0;
  }
  &:hover{
    background: #f2f2f2;
    .cell{
      cursor: pointer;
      .cellButton{
        display: none;
      }
      .ignore{
        display: inline!important;;
      }
    }
  }
  .cell {
    padding: 5px 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    cursor: default;
    .point {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: orange;
      border: 1px solid silver;
      margin: auto;
    }
    .cellButton {
      color: #fff;
      border-radius: 4px;
      padding: 3px 0;
      width: 100%;
      cursor: pointer;
    }
  }
}
.messageOpen {
  display: flex;
  border: 1px solid silver;
  border-radius: 15px;
  width: 90px;
  height: 30px;
  background: #fff;
}
.scrollBar::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.scrollBar::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: silver;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
.scrollBar::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}
</style>