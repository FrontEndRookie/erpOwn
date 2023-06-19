import Vue from 'vue';
import localforage from 'localforage'
const store = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: "chatStore",
});
export default new Vue({
  created() {
    this.init()
  },
  data() {
    return {
      chatDrafts: [],
    }
  },
  computed: {
    userId() {
      const userId = JSON.parse(sessionStorage.getItem('userInfo')).id
      return userId
    },
    currentChatDrafts() {
      return this.chatDrafts.filter(item => {
        return item.userId === this.userId && item.nodes.length > 0
      }).map(item => {
        const listDraftText = item.nodes.map(n => {
          if (n.indexOf('<img') === 0) {
            return '[图片]'
          }
          if (n.indexOf('<iframe') === 0) {
            return '[文件]'
          }
          if (['<br>', '<br/>'].includes(n) || String(n).trim() === '') {
            return ''
          }
          return n
        }).reduce((arr, nText) => {
          if (arr.slice(-1)[0] !== nText) {
            arr.push(nText)
          }
          return arr
        }, []).join('')
        return {
          ...item,
          listDraftText,
        }
      })
    },
  },
  methods: {
    async init() {
      await this.getChatDrafts()
    },
    // 添加
    addChatDraft({ chatId, nodes, msgs, files }) {
      const index = this.chatDrafts.findIndex(item => {
        return item.chatId === chatId && item.userId === this.userId
      })
      const chatRow = {
        userId: this.userId,
        chatId,
        nodes: Array.from(nodes).map(item => item.outerHTML || item.nodeValue),
        msgs,
        files,
      }
      if (index > -1) {
        if (chatRow.nodes.length > 0) {
          this.chatDrafts.splice(index, 1, chatRow)
        } else {
          this.chatDrafts.splice(index, 1)
        }
      } else {
        if (chatRow.nodes.length > 0) {
          this.chatDrafts.push(chatRow)
        }
      }
      this.addChatDrafts()
    },
    addChatDrafts() {
      try {
        store.setItem('chat_drafts', this.chatDrafts || [])
      } catch (error) {
        console.error(error)
      }
    },
    async getChatDrafts() {
      try {
        this.chatDrafts = await store.getItem('chat_drafts') || []
      } catch (error) {
        console.error(error)
      }
    },
    async getChatDraftById(chatId) {
      try {
        await this.getChatDrafts()
        return this.currentChatDrafts.find(item => item.chatId === chatId)
      } catch (error) {
        console.error(error)
      }
    },
    delChatDraftById(chatId) {
      const index = this.chatDrafts.findIndex(item => {
        return item.chatId === chatId && item.userId === this.userId
      })
      if (index > -1) {
        this.chatDrafts.splice(index, 1)
        this.addChatDrafts()
      }
    },
    isChatDraft(chatId, activeChatId) {
      if (!activeChatId) {
        return
      }
      const chatDraft = this.currentChatDrafts.find(item => {
        return item.chatId === chatId && item.userId === this.userId && chatId !== activeChatId
      })
      if (chatDraft) {
        return chatDraft
      }
    },
  },
})