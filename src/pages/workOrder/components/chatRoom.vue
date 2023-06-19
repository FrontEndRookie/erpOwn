<template>
   <div class="chat" :style="{width:biggerChat?'100%':''}">
    <div class="chatTitle">
      <div class="chatName" style="transform:translateY(6px)">{{titleNo}}</div>
      <div style="fontSize:20px;lineHeight:25px;transform:translateY(7px)">{{extraData.title}}</div>
      <div class="chatRight">
        <img @click="inviteDial" src="../../../assets/addAirLine.svg" v-if="fromPageType==1" style="width:25px;height:25px;cursor:pointer" alt="" v-auth="['401005_B']">
        <img @click="lockTop" :src="isTop?require('../../../assets/chatRoomTop.png'):require('../../../assets/chatRoomNTop.png') " style="width:25px;height:25px" alt="" v-if="moreChat">
        <i class="el-icon-close" @click="closeChatRoom" :style="{transform:scaleChat?'scale(1.5)':''}"></i>
      </div>
    </div>
    <div class="chatBox">
      <div class="boxLeft" :style="{width:biggerChat?'90%':''}" >
          <div class="chatContent" :id="`chatContent${workOrderId}`" :style="{height:biggerChat?'59vh':scaleChat?'350px':''}">
        <div class="contentWord" v-for="(item,index) in contentMessage.chatMessage" :key="index">
          <div v-if="item.mem!=3">
             <span :style="{color:item.mem==1?' #4B7902':item.mem=='0'?'#02A7F0':item.mem=='4'?'#D9001B':''}" style="margin-right:5px;">{{item.userName}}</span>
          <span :style="{color:item.mem==1?' #4B7902':item.mem=='0'?'#02A7F0':item.mem=='4'?'#D9001B':''}" >{{item.chatTime}}</span>
          <div class="sendWord" v-if="item.content">
            <!-- mem 4为报价信息 信息标红-->
            <span v-if="item.mem=='4'" style="color:#D9001B">{{item.content}}</span>
            <span v-else style="white-space:pre" v-html="item.content"></span>{{extraData.remark&&index==0?`备注:${extraData.remark}`:""}}
            <div>{{extraData.size&&index==0?`尺寸:${extraData.size}`:""}}</div>
            <div>{{extraData.cargoReadyDate&&index==0?`货好时间:${extraData.cargoReadyDate}`:""}}</div>
          </div>
          <!-- 首个消息额外信息 -->
          <div v-if="index==0" style="color:#D9001B;fontSize:16px;margin-top:-10px;margin-bottom:15px;fontWeight:600">
            {{extraData.title}}
          </div>
          <!-- 文件 -->
          <div v-if="item.fileUrl" style="margin-top:-10px;">
            <span v-if="item.content" :style="{color:item.mem==1?' #4B7902':item.mem=='0'?'#02A7F0':''}" style="margin-right:5px;">{{item.userName}}</span>
            <span v-if="item.content" :style="{color:item.mem==1?' #4B7902':item.mem=='0'?'#02A7F0':''}" >{{item.chatTime}}</span>
            <br>
            <div style="display:inline-block;margin-top:10px;margin-bottom:20px;border:1px solid silver;border-radius:5px">
              <div style="display:flex">
                <img style="width:60px;height:60px" :src="chatFileShow(item.fileUrl)" alt="">
                <div> 
                  <div style="margin-top:10px;font-size:14px;padding-right:5px">{{item.fileName}}</div>
                  <div style="margin-top:20px">{{item.fileSize}}</div>
                </div>
              </div>
              <hr>
              <div style="display:flex;justify-content:space-between;padding:5px">
                <span style="font-size:12px;color:#7ec6ec;cursor:pointer" @click="$utils.downloadFile({ url: item.fileUrl, name: item.fileName })">下载</span>
                <span style="font-size:12px;cursor:pointer" @click="previewOffice(item.fileUrl)">预览</span>
              </div>
            </div>
          </div>
          </div>
          <!-- 系统消息 -->
          <div v-else class="sendWord" style="text-align:center">
            "{{item.content}}"
          </div>
        </div>
      </div>
      <div class="chat-input">
        <div class="inputBox">
          <div
          :style="{width:biggerChat?'90%':''}" 
          style="fontSize:18px;word-break:break-all"
            id="editor"
            ref="editor"
            contenteditable="true"
            @paste.prevent="handlePasteContent($event)"
            @keyup="handleKeyUp($event)"
            @keydown="handleKeyDown($event)"
          ></div>
          <el-button  :style="{width:biggerChat?'90px':'',transform:biggerChat?'translateY(-100%)':'',height:biggerChat?'40px':''}" type="primary" size="mini" class="sendButton" @click="sendMessage" v-auth="{ 1: ['401001_B'], 2: ['402001_B'] }[fromPageType]">发送</el-button>
           <i class="el-icon-folder-opened" v-if="!getFile"  style="position:absolute;bottom:0;margin-left:10px;font-size:30px;cursor: pointer" @click="sendFile" />
          
        </div>
      </div>
      </div>
      <div class="boxRight" :style="{width:biggerChat?'10%':''}" style="position:relative">
        <div class="title" :style="{width:biggerChat?'130px':''}">工单成员 <span>{{contentMessage.chatMember&&contentMessage.chatMember.length}}</span></div>
        <div class="memberList" :style="{width:biggerChat?'130px':''}" v-for="(item,index) in contentMessage.chatMember" :key="index">
          <div style="margin:5px 0;fontSize:10px">{{item.name}} <span v-if="index==0">.{{workOrderType==0?'询价':workOrderType==1?'实单':''}}</span> </div>
        </div>
        <el-button v-if="fromPageType==2" @click="transferOrder" style="position:absolute;bottom:10px;left:30px" size="mini" type="warning" v-auth="['402003_B']">转单</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogShow">
      <div style="overflow-x:auto">
      <img :src="blowPic" alt="" />

      </div>
    </el-dialog >
    <el-dialog  :visible.sync="showInviteDial" append-to-body="true">
      <div style="padding:8px 0">
        <div style="margin-bottom:5px"> <el-input @input="setInputLimit" maxlength="10" class="inviteChoose" suffix-icon="el-icon-search" v-model="dialInput"></el-input></div>
        <div style="max-height:300px;overflow-y:auto">
          <div v-for="(item,index) in airlinPerpleComputed" style="display:flex;align-items:center;margin:4px 0;" :key="index">
          <span @click="chooseAirLine(item)" 
            :style="{border:item.disabled?'1px solid gray':item.checked?'1px solid #49f154':'1px solid rgb(2, 167, 240)'}"
            style="text-align:center;display:inline-block;width:20px;height:20px;border-radius:50%">
            <i class="el-icon-check" :style="{color:item.checked&&!item.disabled?'#49f154':item.disabled?'gray':''}" style="fontSize:18px;margin-right:10px" v-if="item.checked"></i>
            </span>
            <img src="../../../assets/headLogo.svg" style="width:22px;height:22px;margin-left:10px;margin-right:5px" alt="">
            {{item.name}}
        </div>
        </div>
        <div style="text-align:right;margin-top:8px">
          <el-button size="mini" @click="showInviteDial=false">取消</el-button>
          <el-button @click="confirmInvite" size="mini" type="primary">{{fromPageType==1?'确定':'转单'}}({{airManger.filter(item=>item.checked&&!item.disabled).length}})</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const { WS_URL:chatUrl} = process.env
export default {
  components: {
  },
  props: {
    biggerChat:{
      type:Boolean,
      default:false
    },
    extraData:{
      type:Object,
      default:()=>{
        return{}
      }
    },
    scaleChat:{
      type:Boolean,
      default:false
    },
    isTop:{
      type:Boolean,
      default:false
    },
    moreChat:{
      type:Boolean,
      default:false
    },
    fromPageType:{
      type:Number,
      default:()=>0
    },
   airManger:{
     type:Array,
     default:()=>{
       return []
     }
   },
   titleNo:{
     type:String,
     default:''
   },
   workOrderType:{
     type:Number,
     default:-1
   },
   workOrderId:{
     type:Number,
     deafault:0
   },
   contentMessage:{
     type:Object,
     default:()=>{
       return {}
     }

   },
    imgShowWidth: {
      // 聊天输入框中粘贴的图片显示的宽度
      type: Number,
      default: 50,
    },
    imgShowHeight: {
      // 聊天输入框中粘贴的图片显示的高度
      type: Number,
      default: 50,
    },
    enter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fileUrl:'',
      fileName:'',
      fileSize:'',
      getFile:false,
      datas:'',
      blowPic: "",
      dialogShow: false,
      msgList: [],
      loading: false,
      showInviteDial:false,
      dialInput:'',
      airManger:[],

      //ws长连接
            timeout: 30 * 1000,//30秒一次心跳
            timeoutObj: null,//心跳心跳倒计时
            serverTimeoutObj: null,//心跳倒计时
            timeoutnum: null,//断开 重连倒计时
    };
  },
  mounted(){
     this.$http.get(this.$service.userSearchNoAuth+'?roleName=航线负责人&pageSize=50000').then(data=>{
          this.airManger = data.data.records
          this.airManger.forEach(item=>item.checked=false)
        })
         this.initWebSocket()
  },
  methods: {
    //聊天室消息文件预览
    previewOffice(fileUrl){
      if(!fileUrl.includes('pdf')){
        this.$utils.previewOffice({ xpath: fileUrl })
      } else {
         ELEMENT.MessageBox({
          dangerouslyUseHTMLString: true,
          title:'预览',
          message: `<iframe src="${fileUrl}" style="width: 60vw; height: 80vh"></iframe>`,
          center: true,
          showConfirmButton: false,
          customClass: "image-preview-message-box",
        })
      .then(() => { })
      .catch(() => { });
      }
    },
    //聊天室消息显示文件图标
    chatFileShow(fileType){
       if(fileType.includes('xls') ||fileType.includes('xlsx')  ){
        return require('../../../assets/excelIcon.svg')
      } else if(fileType.includes('docx') || fileType.includes('doc') ){
        return require('../../../assets/wordIcon.svg')
      }else if(fileType.includes('pdf')) {
        return require('../../../assets/pdfIcon.svg')
      }
    },
    lockTop(){
      this.$http.post(this.$service.chatToTop+'?workOrderId='+this.workOrderId).then(res=>{
      if(res.code==200){
        this.$message.success(`${this.isTop?'取消':''}置顶成功`)
         this.$emit("getNewData",this.workOrderId)
      }
      else{this.$message.error(res.message)}
      })
    },
    //关闭聊天室
    closeChatRoom(){
      if(!this.scaleChat){
        if(!this.moreChat){
          this.$emit('closeChatRoom')
          return
        }
        this.$confirm('取消该工单展示?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          this.$http.post(this.$service.toDeleteBox+'?workOrderId='+this.workOrderId).then(res=>{
          if(res.code==200){
            this.$message.success("取消展示成功")
            this.$emit('closeChatRoom',true,this.fromPageType==2)
          }
          else{this.$message.error(res.message)}
          })
        }).catch(() => {
        this.$message({
        type: 'info',
        message: '已取消删除'
        }); });
      }else{
         this.$emit('closeChatRoom')
      }
    },
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
                    this.websocketsend('heartbeat');
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
          let id = JSON.parse(sessionStorage.getItem('userInfo')).id
						// 实例化socket
						this.socket = new WebSocket(`${chatUrl}workOrderChat/${this.workOrderId}-${id}`)
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
          
             let obj = JSON.parse(JSON.stringify(msg.data));
            // console.log("obj",obj)
            if(obj.indexOf('heartbeat')>0){
                //收到服务器信息，心跳重置
                    this.reset();
            } else{
              // console.log(msg)
              // console.log(obj.content,obj.content.includes('转单'))
              if(!this.moreChat && this.fromPageType==2  && obj && obj.includes('转单')){
                return
              }
                   this.$emit("getNewData",this.workOrderId)
                }
					},
    //成员邀请
    confirmInvite(){
      let res = this.airManger.filter(item=>item.checked&&!item.disabled)
      if(res.length=='0'){
        return this.$message.warning(`至少选择一人进行${this.fromPageType==1?'邀请':'转单'}`)
      }
      let request = {}
      res.forEach(item=>{
        request[item.id] =item.name 
      })
      this.$http.post(this.fromPageType ==1?this.$service.toAddPri:this.$service.toTransfer,{member:request,workOrderId:this.workOrderId}).then(res=>{
        if(res.code==200){
          this.$message.success(`${this.fromPageType==1?'邀请':'转单'}成功`)
          this.showInviteDial = false
          this.$emit("getNewData",this.workOrderId,this.fromPageType==2)
        }else{
          this.$message.error(res.message)
        }
      })
    },
    //上传文件
    async sendFile(){
      this.fileName = ''
      var range = window.getSelection(); 
         range.selectAllChildren(document.getElementById('editor')); 
         range.collapseToEnd(); 
      const accepts = [
        '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls', 'application/vnd.ms-excel',
        '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'doc','application/msword',
        'pdf','application/pdf'
      ]
      const files = await this.$utils.loadFile({
        accept: accepts.join(','),
      });
      // console.log(files[0]) 
      let fileType = {
        xls: 'application/vnd.ms-excel',
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        doc: "application/msword",
        pdf: "application/pdf"
      }
      
      let srcx = ''
      if(files[0].type == fileType.xls ||files[0].type == fileType.xlsx  ){
        srcx = require('../../../assets/excelIcon.svg')
      } else if(files[0].type == fileType.docx ||files[0].type == fileType.doc ){
        srcx = require('../../../assets/wordIcon.svg')
      }else if(files[0].type == fileType.pdf) {
        srcx = require('../../../assets/pdfIcon.svg')
      }else {
        return this.$message.error("请上传规定类型文件")
      }
      const fileFormData = new FormData();
      fileFormData.append("file", files[0]);
      try {
                const data = await this.$http.post(
                    this.$service.orderUpload,
                    fileFormData,
                );
                if (data) {
                    this.fileName = data.fileName
                    this.fileUrl = data.fileUrl
                    this.fileSize = data.fileSize
                    this.$message.success("上传成功")
                      let doc =document.createElement("iframe")
                      doc.style.display="inline-block"
                      doc.style.border = '1px solid #fff'
                      doc.style['min-width'] = '130px'
                      doc.style['max-width'] = '150px'
                      doc.style.height = '120px'
                      doc.srcdoc = `  <!DOCTYPE html>
                                                <html lang="en">                            
                                                <head>
                                                    <title></title>
                                                    <meta charset="UTF-8">   
                                                    <style>
                                                    </style>                    
                                                </head>
                                                <body>
                                                <div id="ifRameImg" style="text-align:center">
                                                  <img style="width:70px;height:70px;" src="${srcx}"/>
                                                </div>
                                                <div style="text-align:center;width:130px;overflow:hidden;font-size:12px;white-space:nowrap;text-overflow:ellipsis">${files[0].name}</div>
                                                </body>
                                                </html>`
                      this.cursorInsert(doc);
                      const oEditor = this.$refs.editor;
                      this.getInputResult(oEditor.childNodes);
                      var range2 = window.getSelection(); 
                      range2.selectAllChildren(document.getElementById('editor')); 
                      range2.collapseToEnd(); 
                } else {
                    this.$message.error(message);
                }
            } catch (error) {
            }
    
    },
    //消息发送
    sendMessage(){
      let request = {
        content: this.msgList[0]&&this.msgList[0].content?this.msgList[0].content:'', 
        userId: JSON.parse(sessionStorage.getItem('userInfo')).id, 
        userName: JSON.parse(sessionStorage.getItem('userInfo')).name, 
        workOrderId: this.workOrderId, 
        workOrderNo: this.titleNo
      }
      if(this.getFile) {
        request.fileUrl = this.fileUrl
        request.fileName = this.fileName
        request.fileSize = this.fileSize
      }
      this.$http.post(this.$service.chatSendMes,request, {
        headers: {
          diffFlag: {
            1: 1,
            2: 2,
          }[this.fromPageType]
        },
      }).then(res=>{
        if(res.code==200){
          this.clean()
        }
        else{
          this.$message.error(res.message)
        }
      })
    },
    chooseAirLine(val){
      if(val.disabled) return
      if(this.fromPageType ==1){
          if(!val.checked&&(this.airManger.filter(item=>item.checked&&!item.disabled).length+this.contentMessage.chatMember.length)==7){
          return this.$message.warning("航线人员不能超过6人")
        }
      }
     else if(this.fromPageType ==2){
      if(!val.checked&&this.airManger.filter(item=>item.checked&&!item.disabled).length==2){
         return this.$message.warning("转单最多2人")
      } 
     }
      this.airManger.forEach((item,index)=>{
        if(item.name==val.name){
          item.checked=!item.checked
          this.$forceUpdate()
        }
      })
    },
    setInputLimit(val){
      this.dialInput = val.replace(
              /[^\u4e00-\u9fa5a-zA-Z0-9]/g,
              ""
            );
    },
    //打开邀请成员弹框
    inviteDial(){
      if(this.contentMessage.chatMember.length>=7){
        return this.$message.warning("航线人员不得超过6人")
      }
      this.airManger.forEach(item=>{
        if( !this.contentMessage.chatMember.some(items=>items.id == item.id)){
          item.checked= false;
        }
      })
      this.showInviteDial = true
    },
    //转单
    transferOrder(){
           this.airManger.forEach(item=>{
        if( !this.contentMessage.chatMember.some(items=>items.id == item.id)){
          item.checked= false;
        }
      })
      this.showInviteDial = true
    },
     handlePasteContent(event) {
      //判断复制的是否是文字
      const pasteData = this.handlePasteWord(event.clipboardData);
      if (pasteData) return;
      //黏贴图片
      // this.handlePasteImage(event.clipboardData)
    },
  
    handleKeyUp(event) {
      // console.log(event.target.childNodes,123)
      const resultWord = event.target.childNodes;
      this.getInputResult(resultWord);
      if(event.ctrlKey &&event.keyCode === 13){
        event.preventDefault();
      }else if (event.keyCode === 13){
        this.sendMessage()
      }
    },

    handleKeyDown(event) {
      if (event.ctrlKey &&event.keyCode === 13) {
        // 禁止换行默认行为
        if (this.enter) {
          //替换成空格 需加不打印字符
          document.execCommand('insertHTML', false, '<br>&zwnj;');
        }
        event.preventDefault();
      }else if(event.keyCode === 13) {
        event.preventDefault();
      }
    },
  
    // 去格式粘贴 文本
    handlePasteWord(clipboardData) {
      const text = clipboardData.getData("text/plain");
      if (text) {
        const textNode = document.createTextNode(text);
        this.cursorInsert(textNode);
        return true;
      }
      return false;
    },

    // 粘贴图片
    async handlePasteImage(clipboardData) {
      // console.log(clipboardData.files);
      const img = this.getPasteImage(clipboardData.files);
      console.log(img);
      //后端处理 调接口返回src
      //   if (!img) return
      //   console.log(img)
      //   const uploadRes = await this.uploadImg(img)
      //   if (!uploadRes) {
      //     this.$message.error('图片上传失败,请重新上传')
      //     return
      //   }
      //前端处理 - 获取url
      let blob = new Blob([img]);
      const oImage = await this.getImageObject(
        blob,
        this.imgShowWidth,
        this.imgShowHeight
      );
      this.cursorInsert(oImage);
      // 光标处插入 image 后,获取整体输入内容
      const oEditor = this.$refs.editor;
      this.getInputResult(oEditor.childNodes);
    },
    // 获取一个 image object
    getImageObject(uploadRes) {
      //设置图片宽高
      const oImage = new Image(50, 50);
      //本地获取图片src
      oImage.src = URL.createObjectURL(uploadRes);
      oImage.style.cursor="pointer"
      oImage.title="点击查看大图"
      //图片点击事件
      oImage.onclick = () => {
        this.blowPic = oImage.src;
        this.dialogShow = true;
      };
      // console.log(uploadRes);
      return oImage;
    },
    //图片处理
     getPasteImage(clipboardDataFiles) {
      if (!clipboardDataFiles.length) {
        console.log("没有要粘贴的文件");
        return null;
      }
      // 防止复制多张图片
      const clipboardDataFileList = Array.from(clipboardDataFiles || []);
      let imgResult = '';
      clipboardDataFileList.forEach((file) => {
        if (!file.type.match(/image\//i)) {
          return;
        }
        imgResult = file;
      });
      return imgResult;
    },
      //上传图片至后端
    async uploadImg(file) {
      const formData = new FormData();
      formData.append(this.name, file);
      //后续调接口
      //
    },
    //获取输入结果
    getInputResult(editorChildNodes) {
      // console.log(editorChildNodes);
      let totalNum =0
      const oldMsgList = JSON.parse(JSON.stringify(this.msgList));
      this.msgList = []; // 重置
      this.getFile = false
      if(editorChildNodes.length =='0') {
        return
      }
      for (let i = 0; i < editorChildNodes.length; i++) {
        //判断元素节点 - 回车
        if (
          editorChildNodes[i].nodeType === 1 &&
          editorChildNodes[i].nodeName === "BR"
        ) {
          const ifWord = this.msgList[this.msgList.length - 1];
          if (ifWord&&ifWord.type === "text") {
            ifWord.content += "\n";
          }
        }else if(editorChildNodes[i].nodeType === 1  && editorChildNodes[i].nodeName =='IFRAME'){
          this.getFile = true
          totalNum += 1
        } 
        else if (
          //文本节点 -正常输入内容
          editorChildNodes[i].nodeType === 3 &&
          editorChildNodes[i].nodeValue
        ) {
          const ifWord = this.msgList[this.msgList.length - 1];
          if (ifWord&&ifWord.type === "text") {
            ifWord.content += editorChildNodes[i].nodeValue;
            console.log(editorChildNodes[i].nodeValue.length)
            if(editorChildNodes[i].nodeValue == ""){
            }
            else {
              totalNum+=editorChildNodes[i].nodeValue.length
            }
          } else {
            totalNum+=editorChildNodes[i].nodeValue.length
            this.msgList.push({
              type: "text",
              content: editorChildNodes[i].nodeValue,
            });
          }
        } else if (
          //图片判断
          editorChildNodes[i].nodeType === 1 &&
          editorChildNodes[i].nodeName === "IMG"
        ) {
          totalNum += 1
          this.msgList.push({
            type: "image",
            url: editorChildNodes[i].src,
          });
        }
      }
      if(totalNum>150){
        let num = totalNum - 150
        let all = this.$refs.editor.innerHTML.length
        this.$refs.editor.innerHTML = this.$refs.editor.innerHTML.substring(0,all-num)
        //  console.log(document.getElementById('editor'))
        //设置光标在文本末尾
         var range = window.getSelection(); 
         range.selectAllChildren(document.getElementById('editor')); 
         range.collapseToEnd(); 
      }
      console.log(this.msgList,totalNum)
      if (!this.msgList.length && !oldMsgList.length) {
        return;
      }
      this.$emit("change", [...this.msgList]);
    },

    // 光标处插入节点
    cursorInsert(node) {
      const selObj = window.getSelection();
      const range = selObj.getRangeAt(0); //获取当前光标位置
      // 光标处插入节点
      range.insertNode(node);
      // range.appendChild('&zwnj')
      // 取消insert node 后的选中状态，将光标恢复到 insert node 后面
      this.$nextTick(() => {
        range.collapse(false);
      });
    },

    
    // 清除 输入框
    clean() {
      this.$refs.editor.innerHTML = "";
    },
  },
  watch:{
   'contentMessage.chatMessage':{
     handler(){
      this.$nextTick(()=>{
        var div = document.getElementById(`chatContent${this.workOrderId}`);
        console.log(div)
       div.scrollTop = div.scrollHeight+300;
      })
     },
     immediate:true
   },
   workOrderId(){
     this.socket.onclose = this.websocketclose()
     this.initWebSocket()
     this.clean()
   }
  },
  computed:{
    airlinPerpleComputed(){
      this.airManger.forEach(item=>{
        if( this.contentMessage.chatMember.some(items=>items.name == item.name)){
          item.checked= true;
          item.disabled = true
        }
      })
      let res = this.airManger.filter(item=>item.name.includes(this.dialInput))
      // console.log(res)
      return res
    }
  },
  destroyed() {
    // 销毁监听
        clearTimeout(this.timeoutObj)
				this.socket.onclose = this.websocketclose()
  },
};
</script>

<style scoped lang='less'>
.chat {
  width: 620px;
  .chatTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: skyblue;
    padding: 10px;
    .chatName {
      color: #fff;
      font-size: 20px;
      line-height: 25px;
    }
  }
  .chatRight {
    .el-icon-user:before {
      font-size: 25px;
      color: #fff;
    }
    .el-icon-close:before {
      margin-left: 10px;
      font-size: 25px;
      color: #fff;
    }
  }
  .chatBox{
    padding: 5px;
    border: 1px solid silver;
    display: flex;
    .boxLeft{
      width: 500px;
       .chatContent{
      padding:10px 0px 20px 10px;
      border: 1px solid silver;
      margin-bottom: 5px;
      border-radius: 5px;
      height: 500px;
      overflow-y: auto ;
  .contentWord{
    margin-bottom:5px;
    span{
      font-size: 16px;
    }
    .sendWord{
      color: #7F7F7F;
      font-size: 14px;
      margin:5px 0;
      margin-bottom:15px;
      min-height: 12px;
    }
  }
 
}
 .chat-input {
  display: flex;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  position: relative;
  .inputBox {
    width: 100%;
    div:nth-of-type(1) {
      padding: 4px;
      width: 470px;
      min-height: 100px;
      outline: none;
      padding-bottom: 35px;
    }
  }
  .sendButton{
    position: absolute;
    right: 10px;
    transform: translateY(-34px);
    background-color: #12b7f5!important;
    border: #12b7f5!important;
  }
}
    }
    .boxRight{
      width: 110px;
      margin-left:10px;
      padding-top: 10px;
      border: 1px solid silver;
      font-size: 14px;
      border-radius: 5px;
      padding-left:10px;
      .title{
        display: inline-block;
        width: 80px;
        text-align: left;
        margin-bottom: 8px;
        span{
          display: inline-block;
        }
      }
      .memberList{
        width: 100px;
        text-align: left;
        display: inline-block;
        span{
          font-size: 12px;
        }
      }
    }
 
}
}
/deep/.el-dialog{
  width: 500px;
}
/deep/.el-input{
  .el-input__inner{
    border-radius: 10px!important;
    
  }
  .el-input__suffix{
    .el-input__suffix-inner{
      .el-icon-search{
        &::before{
           position: absolute;
           right: 5px;
            top: 10px;
            font-size: 20px;
        }
       
      }
    }
    }
}

</style>