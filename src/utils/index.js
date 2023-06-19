import { Loading } from 'element-ui'
import Router from "@/router"
import ServiceAPI from '@/service/index'
import DcHttp from '@/util/http.js'
import dayjs from 'dayjs'
import Big from 'big.js'
import DcStatus from '@/status'
import { Message } from 'element-ui'
const Utils = {
  dayjs,
  Big,
  // 账单倒计时24小时
  billCountDown(createTime, timer) {
    const endTime = new Date(createTime).getTime() + 24 * 60 * 60 * 1000
    const nowTime = new Date().getTime()
    let duringTime = endTime - nowTime
    if (duringTime <= 0) {
      duringTime = 0
      // clearInterval(timer)
    }
    const h = Math.floor(duringTime / 1000 / 60 / 60 % 24);
    const m = Math.floor(duringTime / 1000 / 60 % 60);
    const s = Math.floor(duringTime / 1000 % 60);

    function addZero(num) {
      return `${num <= 9 ? '0' : ''}${num}`
    }
    return `${addZero(h)}:${addZero(m)}:${addZero(s)}`
  },
  // 前n后二纯数字
  clearNoNum(value, n) {
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数  
    if (value.indexOf(".") < 0 && value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
      value = '' + parseFloat(value);
      if (value.length > n) {
        value = value.substring(value.length - n)
      }
    }
    if (value.indexOf(".") > 0 && value != "") {//以上已经过滤，此处控制小数点前面位数
      var arrItem = value.split('.')[0]
      var index = value.indexOf(".")
      if (arrItem.length > n) {
        value = value.substring(index - n)
      }
    }
    return value
  },
  // 返回纯数字
  pureNumber(val, num) {
    if (num == 1) {
      // 中英文无特殊符号
      var value = val.replace(/[\d]|&quot;|&lt;|&gt;|[\（\）\……\~\`\·\|\【\】\》\《\'\!\！\{\}\#\$\￥\%\^\&\*\(\)\[\]\:\;\：\；\\\‘\“\”\’\,\，\.\。\/\、\?\？\_\-\——\=\+]|@|/g, '')
    } else if (num == 2) {
      // 字母数字
      var value = val.replace(/[^\w\.\/]/ig, '')
    } else if (num == 3) {
      // 大写字母
      var value = val.replace(/[^\A-\Z]/g, '')
    } else if (num == 4) {
      // 纯数字带 - 
      var value = val.replace(/[^\d\-]/g, '')
    } else if (num == 5) {
      // 正整数
      var value = val.replace(/[^\d]/g, '')
      value = '' + Number(value)
      if (value.length == 1 && value == 0) {
        value = ''
      }
    } else {
      // 纯数字
      var value = val.replace(/[^\d]/g, '')
    }
    return value
  },
  // 返回数字
  getNumber(val, isInt = false) {
    val = val.replace(/[^\d.]+/g, '')
    if (isInt) {
      return val < 0 ? 1 : Math.floor(val)
    }
    // 判断是否为数字
    const test = (/^[+-]?(0|([1-9]\d*))(\.\d+)?$/).test(val)
    if (test) {
      return val
    } else {
      // 去除多余小数点
      let pointFlag = false
      val = val.split('').reduce((str, item) => {
        if (item === '.') {
          if (!pointFlag) {
            str += item
          }
        } else {
          str += item
        }
        if (item === '.') {
          pointFlag = true
        }
        return str
      }, '')
      // 排除小数点开头
      const pointStart = val[0] === '.'
      if (pointStart) {
        return '0.'
      }
      // 排除000这种
      const allZero = val.split('').every(item => Number(item) === 0)
      if (allZero) {
        return 0
      }
      // 排除00122这种
      if (!allZero && !val.includes('.')) {
        return Number(val)
      }
      return val
    }
  },
  // 输入限制函数 总毛重
  changW(val, type) {
    // var value = (val.detail.value).toString()
    var value = (val).toString()
    value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    var newstr = ''
    if (value.slice(0, 1) == ('.')) {
      return ''
    }
    // 开头为 "0"
    if (value.slice(0, 1) == '0') {
      if (type == 'PCS') {
        return ''
      }
      if (value.slice(1, 2) == '0') {
        return '0'
      } else if (value.slice(1, 2) == true) {
        return value.slice(1)
      }
    }
    // console.log(type);
    if (type == 'PCS') {
      value = value.replace(/\./g, '')
      if (value.slice(0, 1) == '0') {
        value = ''
      }
      return value
    }
    if (type == 'weight') {
      if (value.length > 1 && (value.slice(0, 1) == '0') && (value.slice(1, 2) != '.')) {
        // console.log("wei");
        return value.slice(1)
      }
      if (value.indexOf('.') == -1) {
        newstr = value.slice(0, 6)
        return newstr
      }
      if (value.indexOf('.') > -1) {
        value = value.replace(/\.{2,}/g, ".");
        var index = value.indexOf('.')
        var str1 = value.slice(0, index + 1)
        if (index > 5) {
          str1 = str1.slice(0, 6) + '.'
        }
        var str2 = value.slice(index + 1, index + 3)
        str2 = str2.replace(/\./g, '')
        newstr = str1.concat(str2)
        return newstr
      }
    }
    if (type == 'cbm') { // 前四后四
      if (value.length > 1 && (value.slice(0, 1) == '0') && (value.slice(1, 2) != '.')) {
        console.log("wei");
        return value.slice(1)
      }
      if (value.indexOf('.') == -1) {
        newstr = value.slice(0, 4)
        return newstr
      }
      if (value.indexOf('.') > -1) {
        value = value.replace(/\.{2,}/g, ".");
        var index = value.indexOf('.')
        var str1 = value.slice(0, index + 1)
        if (index > 3) {
          str1 = str1.slice(0, 4) + '.'
        }
        var str2 = value.slice(index + 1, index + 5)
        str2 = str2.replace(/\./g, '')
        newstr = str1.concat(str2)
        return newstr
      }
    }
    if (type == 'Fcbm') {
      if (value.length > 1 && (value.slice(0, 1) == '0') && (value.slice(1, 2) != '.')) {
        // console.log("wei");
        return value.slice(1)
      }
      if (value.indexOf('.') == -1) {
        newstr = value
        return newstr
      }
      if (value.indexOf('.') > -1) {
        value = value.replace(/\.{2,}/g, ".");
        var index = value.indexOf('.')
        var str1 = value.slice(0, index + 1)
        var str2 = value.slice(index + 1, index + 3)
        str2 = str2.replace(/\./g, '')
        newstr = str1.concat(str2)
        return newstr
      }
    }
    // console.log(this.wxCargoDetailDTOListfirst.cbm);
  },
  // 详情页操作本页刷新
  async orderDetailRefresh(order) {
    // 获取最新订单状态
    const { code, data: { id } } = await DcHttp.get(
      ServiceAPI.orderSearchDetail, {
      params: {
        orderId: order.id,
      }
    }
    );
    if (code !== 200) {
      return
    }
    Router.replace({ name: 'OrderDetail', query: { id, timestamp: new Date().getTime() } })
  },
  /**
   * 载入本地文件
   * @param attrs 需要对input(file)设置的属性
   */
  loadFile(attrs = {}) {
    return new Promise(resolve => {
      const input = document.createElement('input')
      input.type = 'file'
      Object.keys(attrs).forEach(item => {
        input[item] = attrs[item]
      })
      input.style.display = 'none'
      input.onchange = (ev) => {
        resolve(ev.target.files)
        document.documentElement.removeChild(input)
      }
      document.documentElement.appendChild(input)
      input.click()
    })
  },
  // 获取Office文件预览地址，区分线上本地测试开发环境
  getOfficeViewUrl(xpath) {
    const url = Utils.getOfficeUrl(xpath)
    const docViewer = `https://view.officeapps.live.com/op/embed.aspx?src=` // 微软预览
    return `${docViewer}${url}`
  },
  // 获取Office文件实际地址
  getOfficeUrl(xpath) {
    // 处理域名前缀问题
    const host = getHost()
    function getHost() {
      if (process.env.NODE_ENV === 'development' || window.location.host.includes(`10.8.0.1`)) {
        return `https://mytest.feilaida.com`
      } else {
        return window.location.origin
      }
    }
    return `${host}${xpath}`
  },
  
  // MessageBox预览Office文件
  previewOffice({ xpath, title = "预览" }) {
    let url = xpath
    if (!xpath.includes("pdf")) {
      url = Utils.getOfficeViewUrl(xpath)
    }
    ELEMENT.MessageBox({
      dangerouslyUseHTMLString: true,
      title,
      message: `<iframe src="${url}" style="width: 60vw; height: 80vh"></iframe>`,
      center: true,
      showConfirmButton: false,
      customClass: "image-preview-message-box",
    })
      .then(() => { })
      .catch(() => { });
  },
  // MessageBox预览image
  previewImage({ url, title = "预览" }) {
    ELEMENT.MessageBox({
      dangerouslyUseHTMLString: true,
      title,
      message: `<img src="${url}" style="min-width: 100%; max-width: 80vw;" />`,
      center: true,
      showConfirmButton: false,
      customClass: "image-preview-message-box",
    })
      .then(() => { })
      .catch(() => { });
  },
  // MessageBox预览
  previewEmbeddableFile({ url, title = "预览" }) {
    ELEMENT.MessageBox({
      dangerouslyUseHTMLString: true,
      title,
      message: `<embed src="${url}" style="width: 60vw; height: 80vh" />`,
      center: true,
      showConfirmButton: false,
      customClass: "image-preview-message-box",
    })
      .then(() => { })
      .catch(() => { });
  },
  // 下载文件
  downloadFile({ url, name = '未命名', type, disabled = false }) {
    if (disabled) {
      return
    }
    const tagA = document.createElement("a");
    name = `${name}${type ? `.${type}` : ''}`
    tagA.href = url;
    tagA.setAttribute("download", name); // 设置下载文件名称
    document.body.appendChild(tagA);
    tagA.click();
    document.body.removeChild(tagA)
  },
  // 创建loading
  createLoading({ text = '加载中', spinner = 'el-icon-loading', customClass = 'dc-global-loading', background = 'transparent' } = {}) {
    return Loading.service({
      lock: true,
      spinner,
      customClass,
      background,
      text,
    })
  },
  // 复制对象数据by指定keys，返回只包含keys的新对象
  copyDataByKeys(copyObj = {}, copyKeys = []) {
    return Object.entries(copyObj).reduce((obj, [key, val]) => {
      if (copyKeys.includes(key)) {
        obj[key] = val;
      }
      return obj;
    }, {});
  },
  /**
   * 返回有效数字
   * @param {Array} format [int, float] 有效位数
   * @param {*} newVal 
   * @param {*} oldVal 
   */
  getValidNumber({ format, newVal, oldVal }) {
    if (isNaN(newVal) || newVal === null) {
      return oldVal === null ? '' : oldVal
    }
    newVal = String(newVal)
    const [intLen = 10 ** 9, floatLen = 0] = format
    const [valInt, valFloat = ''] = newVal.split('.')
    // 无效数字判断
    const invalidList = [
      newVal < 0, // 负数
      newVal.length > 1 && newVal.split('')[0] === '0' && newVal.split('')[1] !== '.', // 0开头整数例如 023
      floatLen === 0 && newVal.includes('.'), // 整数带小数点
      valInt.length > intLen, // 整数部分超出
      valFloat.length > floatLen, // 小数部分超出
    ]
    const isInvalid = invalidList.find(item => item)
    // 类似02 03 直接返回2 3
    // if (Number(newVal) !== 0 && Number(oldVal) === 0) {
    //   return Number(newVal)
    // }
    return isInvalid ? oldVal : newVal
  },
  /**
   * 返回计费重
   * @param {Number} bubblePoint 分泡比例
   * @param {*} weight 重量
   * @param {*} volume 体积
   */
  getBillingWeight({ bubblePoint, weight, volume }) {
    bubblePoint = Number(bubblePoint)
    const { volumeRatio, weightRatio } = DcStatus.commonStatus.getStatus('bubblePoints', bubblePoint)
    // 体积重
    const volumeWeight = volume * (10 ** 3) / 6
    // 不分泡默认计费重
    const defaultBillingWeight = Math.max(volumeWeight, weight)
    const billingWeight = (() => {
      switch (bubblePoint) {
        case 10:
          return defaultBillingWeight
        default:
          return defaultBillingWeight * volumeRatio + weight * weightRatio;
      }
    })()
    return Math.round(billingWeight)
  },
  // 从企业微信登录
  async loginFormMobile(route) {
    const m_token = route.query.m_token
    if (m_token) {
      const { data: { sysUser, noAuthCodes, authFields } } = await DcHttp.post(ServiceAPI.getUserInfoByToken, {}, {
        headers: {
          tokenId: m_token,
        },
      })
      sessionStorage.setItem('userInfo', JSON.stringify(sysUser))
      sessionStorage.setItem('userId', sysUser.id)
      sessionStorage.setItem('tokenId', m_token)
      sessionStorage.setItem('noAuthCodes', JSON.stringify(noAuthCodes))
      sessionStorage.setItem('authFields', JSON.stringify(authFields))
      delete route.query.m_token
      return Promise.resolve()
    }
    return Promise.reject('没有m_token')
  },
  authCheckDisabled(authCodes = []) {
    if (authCodes.length === 0) {
      return false
    }
    const noAuthCodes = JSON.parse(sessionStorage.getItem('noAuthCodes')) || []
    return authCodes.every(code => noAuthCodes.includes(code))
  },
  authCheckHidden(authCodes = []) {
    if (authCodes.length === 0) {
      return 'visible'
    }
    const noAuthCodes = JSON.parse(sessionStorage.getItem('noAuthCodes')) || []
    return authCodes.every(code => noAuthCodes.includes(code)) ? 'hidden' : 'visible'
  },
  cancelOrderBtnDisabled(order) {
    // financeStatus 0=未交单,1=已交单,2=申请解锁,3=交单待审核,4=修改中
    // 【未交单】【修改中】且 应收空运费所在账单为【未发起对账】可以取消
    const { financeStatus } = order
    if ([0, 4].includes(financeStatus)) {
      return false
    }
    return true
  },
  exportBuffer({ buffer = 'Hello World', exportName = 'default.txt', resolve, reject, callback }) {
    const enc = new TextDecoder("utf-8");
    const uint8_msg = new Uint8Array(buffer);
    const json = enc.decode(uint8_msg);
    if (json.includes("code")) {
      const res = JSON.parse(json)
      const { code, message } = res
      if (code === 200) {
        resolve && resolve(res)
      } else {
        Message.error(message)
        reject && reject(res)
      }
    } else {
      const tagA = document.createElement("a");
      const blob = new Blob([buffer]);
      tagA.href = URL.createObjectURL(blob);
      tagA.setAttribute("download", `${exportName}`);
      tagA.click();
      document.body.appendChild(tagA);
      callback && callback()
    }
  },
  comparedJSON(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  },
  // 等待N秒
  sleep(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  },
  getAgentPayWayBySettlementWay(settlementWay) {
    const agentPayWay = {
      1: 0, // 付款买单
      2: 1, // 月结买单
      3: 2, // 固定天数
    }[settlementWay]
    return agentPayWay
  },
  getOrderDisableds(order) {
    if (!order) {
      return {}
    }
    const { status, canCwChange, canPriceChange, openStatus, financeStatus } = order
    const cancelOrderDisabled = [39].includes(status)
    const freezedOrderDisabled = openStatus === 0
    const polDisabled = [41, 43].includes(status)
    const podDisabled = [41, 43].includes(status)
    const departureDateDisabled = [41, 43].includes(status)
    const agentDisabled = [41, 43].includes(status)
    const bubblePointDisabled = [41, 43].includes(status)
    const bookingDataDisabled = ![1, 2, 3, 5, 9].includes(status)
    const inboundGuideDisabled = ![9].includes(status)
    const inboundDataDisabled = ![13, 15].includes(status)
    const inboundCwDisabled = canCwChange === 1 // 0 可编辑 | 1 不可编辑
    const bookingPriceDisabled = canPriceChange === 1 // 0 可编辑 | 1 不可编辑
    const airCompanyDisabled = [41, 43].includes(status)
    const flightNoDisabled = [41, 43].includes(status)
    const waybillNoDisabled = ![1, 2, 3, 9, 13, 15, 17, 21].includes(status)
    const subWaybillNoDisabled = ![1, 2, 3, 9, 13, 15, 17, 21].includes(status)
    const costPriceDisabled = ![0, 4].includes(financeStatus)
    const miscellaneousFeesDisabled = ![0, 4].includes(financeStatus) || true
    const ownRoteDisabled = [41, 43].includes(status)
    const costBubblePointDisabled = ![0, 4].includes(financeStatus)
    return {
      polDisabled,
      podDisabled,
      departureDateDisabled,
      agentDisabled,
      bubblePointDisabled,
      bookingDataDisabled,
      inboundGuideDisabled,
      inboundDataDisabled,
      inboundCwDisabled,
      bookingPriceDisabled,
      airCompanyDisabled,
      flightNoDisabled,
      waybillNoDisabled,
      subWaybillNoDisabled,
      cancelOrderDisabled,
      freezedOrderDisabled,
      orderDisabled: cancelOrderDisabled || freezedOrderDisabled,
      costPriceDisabled,
      miscellaneousFeesDisabled,
      ownRoteDisabled,
      costBubblePointDisabled,
    }
  },
   // MessageBox预览富文本
   previewHtml({ html, title = "预览",customClass="image-preview-message-box" }) {
    ELEMENT.MessageBox({
      dangerouslyUseHTMLString: true,
      title,
      message: html,
      showConfirmButton: false,
      customClass:customClass ,
    })
      .then(() => { })
      .catch(() => { });
  },
  previewFbaProduct({ content, title }) {
    const html = `
    <main class="fba-product-preview dc-custom-editor">
      <header class="product-title">${title}</header>
      <section class="product-content">${content}</section>
    </main>`
    Utils.previewHtml({ html })
  },
   /*4.用正则表达式实现html解码*/
   htmlDecodeByRegExp(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "'");
    s = s.replace(/&quot;/g, '"');
    s = s.replace(/div/g, 'p');
    return s;
  },
}
export default Utils