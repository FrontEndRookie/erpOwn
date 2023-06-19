<template>
    <div
          class="chatContent"
          id="chatContent"
          :style="{ height: $parent.chatRevoke ? '100vh' : '' }"
        >
          <div class="chatCTitle">
            <div class="titleLeft">
              <div
                  class="headerImg"
                >
                 <img src="@/assets/inquiry/lx.png" alt="">
                 <span style="margin-left:10px;font-size:17px;transform:translateY(22px);position:absolute">{{chatRoomPeople}}</span>
                </div>
            </div>
            <div class="titleCenter">
              {{chatRoomTitleBox.startArea}} - {{chatRoomTitleBox.pod}}
            </div>
            <div class="titleRight">
                <el-tooltip class="item" effect="dark" content="不展示该聊天，可通过搜索查询" placement="top-start">
                  <div class="rBox" style="cursor:pointer" @click="$parent.titleRemoveChat(chatRoomTitleBox.id)">
                      <img src="@/assets/inquiry/chatRoomDelete.svg" alt="" />
                      <div>隐藏会话</div>
                  </div>
                </el-tooltip>
              <div class="rBox">
                <img src="@/assets/inquiry/header.png" alt="" />
                <div>{{ chatMessageExtra.chatName }}</div>
              </div>
               <div
                v-if="!$parent.lastReply"
                class="rBox"
                style="cursor:not-allowed"
              >
                <img src="@/assets/inquiry/cargoLogo.png" alt="" />
                <div>生成货盘信息</div>
              </div>
              <div
                v-if="$parent.lastReply && !$parent.palletId"
                @click="!ifSelf?$parent.getNewPallet():$message.warning('当前为询盘发起人，无法生成货盘信息')"
                class="rBox"
                :style="{cursor:ifSelf?'not-allowed':'pointer'}"
              >
                <img src="@/assets/inquiry/cargoLogo.png" alt="" />
                <div>生成货盘信息</div>
              </div>
              <div
                v-if="$parent.lastReply && $parent.palletId"
                @click="$parent.getNewPallet"
                class="rBox"
                style="cursor:pointer"
              >
                <img src="@/assets/inquiry/cargoLogoAct.svg" alt="" />
                <div>已生成货盘信息</div>
              </div>
           </div>
          </div>
          <div
            class="contentWord"
            v-for="(item, index) in chatRoomContent"
            :key="index"
            style="position: relative"
          >
            <!-- 文件 -->
            <div v-if="item.fileUrl">
              <div
                style="display: flex"
                :style="{
                  'justify-content':
                    item.senderId == UserID ? 'flex-end' : ''
                }"
              >
                
                <div
                  v-if="item.senderId != UserID"
                  class="headerImg"
                ><span>{{chatRoomTitleBox.pod}}</span>
                    <div class="headerArea">{{chatRoomTitleBox.startArea}}</div></div>
                <div>
                  <div
                    style="color: #333333; font-size: 13px"
                    :style="{
                      'text-align':
                        item.senderId == UserID ? 'right' : ''
                    }"
                  >
                    {{
                      item.senderId == UserID
                        ? item.sysSendName
                          ? item.sysSendName
                          : "罗新国际"
                        : (item.sysSendName?`罗新-${item.sysSendName}`:chatRoomPeople)
                    }}
                    <span
                      style="color: #999; font-size: 12px"
                      :style="{
                        'margin-left':
                          item.senderId == UserID ? '5px' : ''
                      }"
                      >{{ item.createTime }}</span
                    >
                  </div>
                  <div
                    style="
                  display: inline-block;
                  margin-top: 10px;
                  margin-bottom: 20px;
                  border: 1px solid silver;
                  border-radius: 5px;
                "
                  >
                    <div style="display: flex">
                      <img
                        style="width: 60px; height: 60px"
                        :src="chatRoom.chatFileShow(item.fileUrl)"
                        alt=""
                      />
                      <div>
                        <div
                          style="
                        margin-top: 10px;
                        font-size: 14px;
                        padding-right: 5px;
                      "
                        >
                          {{ item.fileName }}
                        </div>
                        <div style="margin-top: 20px">{{ item.fileSize }}</div>
                      </div>
                    </div>
                    <hr />
                    <div
                      style="
                    display: flex;
                    justify-content: space-between;
                    padding: 5px;
                  "
                    >
                      <span
                        style="font-size: 12px; color: #7ec6ec; cursor: pointer"
                        @click="
                          $utils.downloadFile({
                            url: item.fileUrl,
                            name: item.fileName
                          })
                        "
                        >下载</span
                      >
                      <span
                        style="font-size: 12px; cursor: pointer"
                        @click="$utils.previewOffice({ xpath: item.fileUrl })"
                        >预览</span
                      >
                    </div>
                  </div>
                </div>
                <img
                  v-if="item.senderId == UserID"
                  :src="
                    item.status == 3
                      ? require('@/assets/inquiry/header.png')
                      : require('@/assets/inquiry/header.png')
                  "
                  alt=""
                  style="width: 50px; height: 50px; margin-left: 12px"
                />
              </div>
            </div>

            <!-- 系统消息 -->
            <div
              v-else-if="
                item.content &&
                  (item.status == 4 ||
                    item.status == 5 ||
                    item.status == 7 ||
                    item.status == 8)
              "
              class="systemWord"
            >
              <div
                style="flex: 0 0 300px; border-bottom: 2px solid #e3e7e7;margin-right:12px"
              ></div>
              {{
                item.status == 5 || item.status == 7 || item.status == 8
                  ? item.createTime
                  : ""
              }}
              {{ item.content[0].src }}
              <div
                style="flex: 0 0 300px; border-bottom: 2px solid #e3e7e7;margin-left:12px"
              ></div>
            </div>
            <div v-else>
              <div
                style="display: flex"
                :style="{
                  'justify-content':
                    item.senderId == UserID ? 'flex-end' : ''
                }"
              >
              
                 <div
                  v-if="
                    item.senderId != UserID
                  "
                  class="headerImg"
                ><span>{{chatRoomTitleBox.pod}} </span>
                    <div class="headerArea">{{chatRoomTitleBox.startArea}}</div></div>
                <img
                  v-if="item.status == 6"
                  src="@/assets/inquiry/header.png"
                  alt=""
                  style="width: 50px; height: 50px; margin-right: 12px"
                />
                <div>
                  <div
                    style="color: #333333; font-size: 13px"
                    :style="{
                      'text-align':
                        item.senderId == UserID ? 'right' : '',
                      color: item.status == 6 ? '#df2f45' : ''
                    }"
                  >
                    {{
                      item.senderId == UserID
                        ? item.sysSendName
                          ? item.sysSendName
                          : "罗新国际"
                        : (item.sysSendName?`罗新-${item.sysSendName}`:chatRoomPeople)
                    }}
                    <span
                      style="color: #999; font-size: 12px"
                      :style="{
                        'margin-left':
                          item.senderId == UserID ? '5px' : '',
                        color: item.status == 6 ? '#df2f45' : ''
                      }"
                    >
                      <span style="margin-right:3px;font-size:15px"
                        >{{ item.status == 6 ? item.fileName : "" }}
                        {{
                          item.status == 6
                            ? "(" + item.agentUserAccount + ")"
                            : ""
                        }}</span
                      >
                      {{ item.createTime }}</span
                    >
                  </div>
                  <div
                    class="sendWord"
                    :style="{
                      backgroundColor:
                        item.senderId == UserID ? '#CCE2FF' : '',
                      color: item.senderId == UserID ? '#666' : ''
                    }"
                    style="position: relative; word-break: break-all"
                  >
                    <div
                      style="display:inline-block;line-height:24px"
                      v-for="(items, indexs) in item.content"
                      :key="indexs"
                    >
                        <chatRoomImg
                          v-if="items.type == 'image'"
                          :imgSrc="items.src"
                        ></chatRoomImg>
                      <span
                        v-else-if="item.status == 6"
                        v-html="'报价：' + items.src"
                        style="white-space:pre-wrap;color:#df2f45"
                      ></span>

                      <span
                        v-else
                        v-html="items.src"
                        style="white-space:pre-wrap;word-break: break-word;"
                        :style="{
                          color:
                            item.status == 6
                              ? '#df2f45'
                              : item.status == 10
                              ? '#ff7700'
                              : ''
                        }"
                      ></span>
                       <div v-if="index==0" style="display:flex;justify-content:space-between;margin-top:6px">
                          <span style="flex:1">期望起运地:{{chatRoomTitleBox.expectPol?chatRoomTitleBox.expectPol:'无'}}</span>
                          <span style="margin-left:6px;flex:1">目标价:{{chatRoomTitleBox.expectPrice?chatRoomTitleBox.expectPrice:'无'}}</span>
                        </div>
                    </div>
                    <div
                      v-if="
                        item.senderId != UserID
                      "
                      style="
                        position: absolute;
                        top: 5px;
                        border: 1px solid #000;
                        height: 0;
                        width: 0;
                        border-left: 6px solid rgba(0, 0, 0, 0);
                        border-right: 6px solid #fff;
                        border-top: 6px solid rgba(0, 0, 0, 0);
                        border-bottom: 6px solid rgba(0, 0, 0, 0);
                        left: -12px;
                      "
                      class="contentArrow"
                    ></div>
                    <div
                      v-if="item.senderId == UserID"
                      style="
                        position: absolute;
                        top: 5px;
                        border: 1px solid #000;
                        height: 0;
                        width: 0;
                        border-left: 6px solid #CCE2FF;
                        border-right: 6px solid rgba(0, 0, 0, 0);
                        border-top: 6px solid rgba(0, 0, 0, 0);
                        border-bottom: 6px solid rgba(0, 0, 0, 0);
                        right: -12px;
                      "
                      class="contentArrow"
                    ></div>
                  </div>
                </div>
                <img
                  v-if="item.senderId == UserID"
                  :src="
                    item.status == 3
                      ? require('@/assets/inquiry/header.png')
                      : require('@/assets/inquiry/header.png')
                  "
                  alt=""
                  style="width: 50px; height: 50px; margin-left: 12px"
                />
              </div>
            </div>
          </div>
        </div>
</template>
<script>
import chatRoom from '@/util/chatRoom.js'
import chatRoomImg from './chatRoomImg.vue'
import { mapState, mapGetters } from 'vuex'
export default{
  components:{
    chatRoomImg
  },
    data(){
        return {
            chatRoom,
            UserID:''
        }
    },
    created(){
      this.UserID = sessionStorage.getItem('userId')
    },
    computed:{
        ...mapState({
            chatMessageExtra:state=>state.chatRoom.chatMessageExtra,
            chatRoomTitleBox:state=>state.chatRoom.chatRoomTitleBox,
            chatRoomContent:state=>state.chatRoom.chatRoomContent,
        }),
        chatRoomPeople(){
         let target = sessionStorage.getItem('userId') == this.chatRoomTitleBox.customerId?this.chatRoomTitleBox.chatName:this.chatRoomTitleBox.customerName
          return (target?'罗新-':'') +target
        },
        ifSelf(){
          let target = sessionStorage.getItem('userId') == this.chatRoomTitleBox.customerId?this.chatRoomTitleBox.chatName:this.chatRoomTitleBox.customerName
          return target == this.chatMessageExtra.chatName 
        }
    },
    watch:{
         chatRoomContent: {
            handler() {
                this.$nextTick(() => {
                let div = document.getElementById("chatContent");
                // console.log(div)
                div.scrollTop = div.scrollHeight + 300;
                });
            },
            immediate: true
        }
    }
}
</script>
<style scoped lang="less">
.chatContent {
        box-sizing: border-box;
        padding-bottom: 20px;
        border: 1px solid #dcdfe6;
        // margin-bottom: 5px;
        background-color: #f5f8fb;
        // border-radius: 5px;
        height: 79vh;
        overflow-y: auto;
        .chatCTitle {
          position: sticky;
          top: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(192, 192, 192, 0.2);
          margin-bottom: 10px;
          padding: 10px 0;
          background-color: #fff;
          color:#0038A7;
          z-index: 10;
          .titleCenter{
            font-size: 16px;
          }
          .titleLeft {
            display: flex;
            margin-left: 10px;
               .headerImg {
                padding-left: 20px;
                 img{
                  width: 95px;
                  height: 45px;
                 }
                }
          }
          .titleRight {
            display: flex;
            text-align: center;
            margin-right: 10px;
            .rBox {
              margin-left: 12px;
              div {
                margin-top: 4px;
              }
            }
            img {
              width: 40px;
              height: 40px;
            }
          }
        }
        .contentWord {
          padding: 0 8px;
          margin-bottom: 5px;
           .headerImg {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              margin-right: 12px;
              color:white;
              background-color: #0038a7;
              font-size: 14px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .headerArea{
                color:#F59A23;
                font-size: 12px;
                margin-top: 10px;
              }
            }
          span {
            font-size: 16px;
          }
          .systemWord {
            color: #99a8b4;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .sendWord {
            color: #7f7f7f;
            font-size: 13px;
            margin: 10px 0;
            min-height: 12px;
            max-width: 280px;
            padding: 10px;
            background-color: #fff;
            border-radius: 5px;
            //   word-break: break-all;
            //   webkit-box-shadow: 0px 2px 9px rgb(0 0 0 / .15);
            box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.15);
            &::after {
              position: absolute;
              content: "";
              border-right: 10px solid pink;
            }
          }
        }
      }
.contentArrow {
  &::after {
    content: " ";
    border-width: 6px;
  }
}
</style>
