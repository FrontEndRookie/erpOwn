<template>
  <div>
    <div class="contextmenu-content">
      <div class="list">
        <div class="rightKeyItem" @click="setToTop">
          <img src="@/assets/inquiry/toTop.svg" alt="" class="icon"> 
          {{toTop?'取消置顶':'置顶'}}
        </div>
        <div class="rightKeyItem" @click="changeUnRead()">
          <img src="@/assets/inquiry/chatRoomUnread.svg" alt="" class="icon">
          {{unRead?'标为已读':'标为未读'}}
        </div>
        <div class="rightKeyItem" @click="$parent.titleRemoveChat(targetData.id)">
          <img src="@/assets/inquiry/chatRoomDelete.svg" alt="" class="icon" style="transform:translateY(-2px)">
          隐藏会话
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
        contentEl:'',
        targetData:'',
        unRead:true,
        toTop:true,

    };
  },
  created() {},
  mounted() {
    this.contentEl = document.querySelector(".contextmenu-content");
  },
  
  methods: {
    adjustPos(x, y, w, h) {
      const PADDING_RIGHT = 6; // 右边留点空位，防止直接贴边了，不好看
      const PADDING_BOTTOM = 6; // 底部也
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      if (x + w > vw - PADDING_RIGHT) x -= w;
      if (y + h > vh - PADDING_BOTTOM) y -= h;
      return { x, y };
    },
    showContextMenu(x, y) {
      this.contentEl.style.left = x + "px";
      this.contentEl.style.top = y + "px";
    //   mask.style.display = "";
    },
    hideContextMenu() {
    //   mask.style.display = "none";
      this.contentEl.style.top = "99999px";
      this.contentEl.style.left = "99999px";
    },
    onContextMenu (e,value) {
        // console.log(value)
        this.targetData = value
        let unReadData = sessionStorage.getItem('userId') == this.targetData.customerId?this.targetData.customerUnreadCount:this.targetData.serviceUnreadCount
        unReadData>0?(this.unRead=true):(this.unRead=false)
        this.targetData.isTop==1?(this.toTop=true):(this.toTop=false)
        e.preventDefault();
        const rect = this.contentEl.getBoundingClientRect();
        // console.log(rect)
        const { x, y } = this.adjustPos(
          e.clientX,
          e.clientY,
          rect.width,
          rect.height
        );
        this.showContextMenu(x, y);
    },
    //标为未读/已读
    changeUnRead(){
      let request = this.$http.post((this.unRead?this.$service.toSignRead:this.$service.toSignUnRead)+this.targetData.id)
      request.then(res=>{
        if(res.code == 200) {
            this.$message.success(`标为${this.unRead?'已读':'未读'}成功`)
            if(this.unRead)
            {
              this.targetData.customerUnreadCount = 0;
              this.targetData.serviceUnreadCount = 0;
              }
            else
            {this.targetData.customerUnreadCount=1;
            this.targetData.serviceUnreadCount = 1;}
          }
        })
    },
  
    //置顶/取消置顶
    setToTop(){
      this.$http.post(this.$service.setTopStatus+`${this.targetData.id}&type=${this.targetData.isTop==1?2:1}`).then(res=>{
        if(res.code == 200) {
          this.$message.success(`${this.targetData.isTop==1?'取消':''}置顶成功`)
          this.$emit('setToTop',{isTop:this.targetData.isTop,id:this.targetData.id})
        }
      
      })
    }
  },
  destroyed() {}
};
</script>

<style scoped lang="less">
/* 菜单内容的容器 */
.contextmenu-content {
  position: fixed;
  left: 999999px;
  top: 999999px;
  z-index: 50;
  user-select: none;
}
/* 例子使用内容 */
.list {
  border: 1px solid #cecece;
  border-radius: 4px;
  min-width: 140px;
  overflow: hidden; /* 处理圆角 */
  font-size: 16px;
  .icon{
    width:30px;
    height: 30px;
  }
}
.rightKeyItem {
  box-sizing: border-box;
  padding:0 5px;
  height: 40px;
  line-height: 40px;
  word-break: keep-all; 
  background-color: #fff;
  img{
    margin-right:10px
  }
}
.rightKeyItem:hover {
  background-color: dodgerblue;
  color: #fff;
}
</style>
