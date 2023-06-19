<template> </template>
<script>
import { mapMutations, mapState } from 'vuex'
const { WS_URL: chatUrl } = process.env;
export default {
  created() {
    this.initWebSocket();
  },
  data(){
    return {
      socket:"",
             //ws长连接
      timeout: 15 * 1000, //30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null, //断开 重连倒计时
    }
  },
  methods: {
    ...mapMutations('chatRoom',['setWsDisable','setChatRoomTitleBox']),

    initWebSocket() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        let id = JSON.parse(sessionStorage.getItem("userInfo")).id;
        // 实例化socket
        this.socket = new WebSocket(`${chatUrl}consul/erp-${id}`);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
        //关闭socket连接
        this.socket.onclose = this.websocketclose;
      }
    },
    open() {
      this.start();
      this.$notify.closeAll();
      console.log("socket连接成功", new Date());
      this.setWsDisable(false);
    },
    error() {
      console.log("连接错误");
    },
    websocketclose(e) {
      this.socket.close();
      this.setWsDisable(true);
      console.log("connection closed ", new Date());
    },
    websocketsend(messsage) {
      this.socket.send(messsage);
    },
    reconnect() {
      console.log("reconnect");
      // 重新连接
      if (this.lockReconnect) return;
      this.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      this.timeoutnum && clearTimeout(this.timeoutnum);
      this.timeoutnum = setTimeout(() => {
        //新连接
        this.initWebSocket(true);
        this.lockReconnect = false;
      }, 5000);
    },
    reset() {
      console.log("reset");
      // 重置心跳 清除时间
      clearTimeout(window.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      // 重启心跳
      this.start();
    },
    start() {
      console.log("start");
      // 开启心跳
      window.timeoutObj && clearTimeout(window.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      window.timeoutObj = setTimeout(() => {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (this.socket && this.socket.readyState == 1) {
          // 如果连接正常
          this.websocketsend("ping");
        } else {
          // 否则重连
          this.reconnect();
        }
        this.serverTimeoutObj = setTimeout(() => {
          this.$confirm(
            '<div><div style="font-size:17px">连接已断开</div><div style="text-align:center;margin-top:20px">网络异常，您已掉线</div></div>',
            "系统提示",
            {
              confirmButtonText: "重新登录",
              cancelButtonText: "关闭窗口",
              center: true,
              showClose: false,
              closeOnClickModal: false,
              dangerouslyUseHTMLString: true,
              customClass: "myConfirm"
            }
          )
            .then(() => {
              this.$router.push("/");
              sessionStorage.clear();
            })
            .catch(() => {
              window.close();
            });
          console.log("serverTimeoutObj");
          clearInterval(window.titleTimer);
          document.title = "接待会话";
        }, this.timeout);
      }, this.timeout);
    },
    async getMessage(msg) {
      // console.log(msg)
      let obj = JSON.parse(JSON.stringify(msg.data));
      if (obj == "pong") {
        //收到服务器信息，心跳重置
        this.reset();
      } else if (obj == "down") {
        this.$confirm(
          '<div><div style="font-size:17px">连接已断开</div><div style="text-align:center;margin-top:20px">聊天室已在其他页面打开，当前页面已下线</div></div>',
          "系统提示",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "关闭窗口",
            center: true,
            showClose: false,
            closeOnClickModal: false,
            dangerouslyUseHTMLString: true,
            customClass: "myConfirm"
          }
        )
          .then(() => {
            this.$router.push("/");
            sessionStorage.clear();
          })
          .catch(() => {
            window.close();
          });
        clearTimeout(this.serverTimeoutObj);
        clearTimeout(window.titleTimer);
        document.title = "接待会话";
        clearTimeout(window.timeoutObj);
        this.websocketclose();
      } else {
        clearInterval(window.titleTimer);
        if (
          obj.includes("type") &&
          obj.split(",")[1] &&
          obj.split(",")[1].split(":")[1] == 1
        ) {
          // console.log(1);
          this.$emit("update:ifVocation", false);

          this.titleShank();
          let audio = document.getElementById("noticeMusics");
          if (audio !== null) {
            //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
            if (audio.paused) {
              audio.play(); //audio.play();// 这个就是播放
            } else {
              audio.pause(); // 这个就是暂停
            }
          }
          let idx = obj.split(",")[0].split(":")[1];
          
          if (
            this.leftOrderMes.every(item => item.id != idx) ||
            this.leftOrderMes.length == 0
          ) {
            this.$parent.getNewData(idx, true);
          } else {
            this.$parent.getNewData(idx);
          }
          if (idx == this.activeIndex) {
            setTimeout(() => {
              clearInterval(window.titleTimer);
              document.title = "接待会话";
            }, 3000);
          }
        } else if (
          obj.includes("type") &&
          obj.split(",")[1] &&
          (obj.split(",")[1].split(":")[1] == 7 ||
            obj.split(",")[1].split(":")[1] == 8 ||
            obj.split(",")[1].split(":")[1] == 11)
        ) {
          // console.log(5);
          let targetType = obj.split(",")[1] && obj.split(",")[1].split(":")[1];
          if (targetType != 11) {
            this.titleShank();
            let audio = document.getElementById("noticeMusics");
            if (audio !== null) {
              //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
              if (audio.paused) {
                audio.play(); //audio.play();// 这个就是播放
              } else {
                audio.pause(); // 这个就是暂停
              }
            }
          }
          let id2 = obj.split(",")[0].split(":")[1];
         
          if (targetType == 7 || targetType == 11) {
            if (targetType == 11) {
              this.$emit("update:ifVocation", true);
            } else {
              this.$emit("update:ifVocation", false);
            }
            let idx2 = this.leftOrderMes.findIndex(item => item.id == id2);
            this.leftOrderMes.splice(idx2, 1);
            // console.log(this.leftOrderMes)
            this.setChatRoomTitleBox(this.leftOrderMes[0]);
            this.$parent.changeChatRoom({ ifWS: true, ...this.leftOrderMes[0] });
            setTimeout(() => {
              clearInterval(window.titleTimer);
              document.title = "接待会话";
            }, 3000);
          } else if (targetType == 8) {
            this.$parent.getNewData(id2, true);
          }
        }
      }
    },
     //ws新消息触发页面标题闪动
    titleShank() {
      let title1 = "接待会话";
      let title2 = "\u200e";
      let i = 0;
      clearInterval(window.titleTimer);
      setTimeout(() => {
        document.title = "接待会话";
      }, 1000);
      window.titleTimer = setInterval(() => {
        // 切换两个标题的显示
        // 判断
        if (i % 2 == 0) {
          document.title = title1;
        } else {
          document.title = title2;
        }
        i++;
      }, 500);
    },
  },
  computed:{
     ...mapState({
      activeIndex:state=>state.chatRoom.activeIndex,
      leftOrderMes:state=>state.chatRoom.leftOrderMes,
    }),
  },
 destroyed() {
    // 销毁监听
    clearInterval(window.titleTimer);
    setTimeout(() => {
      document.title = "接待会话";
    });
    clearTimeout(window.timeoutObj);
    this.websocketclose();
  }
};
</script>
