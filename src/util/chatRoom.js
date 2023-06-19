const chatRoomUtil = {
  //聊天室消息显示文件图标
  chatFileShow(fileType) {
    if (fileType.includes("xls") || fileType.includes("xlsx")) {
      return require("@/assets/inquiry/excelIcon.svg");
    } else if (fileType.includes("docx") || fileType.includes("doc")) {
      return require("@/assets/inquiry/wordIcon.svg");
    } else if (fileType.includes("pdf")) {
      return require("@/assets/inquiry/pdfIcon.svg");
    }
  },
  //聊天室左侧 最后提交日期
  lastTimeShow(val) {
    if (!val) {
      return "";
    }
    let value = new Date(val);
    let now = new Date();
    if (value.getDate() == now.getDate()) {
      return (
        (value.getHours() > 9 ? value.getHours() : "0" + value.getHours()) +
        ":" +
        (value.getMinutes() > 9 ? value.getMinutes() : "0" + value.getMinutes())
      );
    } else if (chatRoomUtil.isToday(val) == "昨天") {
      return (
        "昨天" +
        (value.getHours() > 9 ? value.getHours() : "0" + value.getHours()) +
        ":" +
        (value.getMinutes() > 9 ? value.getMinutes() : "0" + value.getMinutes())
      );
    } else if (chatRoomUtil.iSameWeek(val, new Date())) {
      return "星期" + new Date(val).getDay();
    } else if (value.getFullYear() == new Date().getFullYear()) {
      return value.getMonth() + 1 + "月" + value.getDate() + "日";
    } else {
      return (
        value.getFullYear() +
        "年" +
        value.getMonth() +
        1 +
        "月" +
        value.getDate() +
        "日"
      );
    }
  },
  // 判断日期是不是今天、昨天、明天
  isToday(str) {
    let d = new Date(str).setHours(0, 0, 0, 0);
    let today = new Date().setHours(0, 0, 0, 0);
    let obj = {
      "-86400000": "昨天",
      0: "今天",
      86400000: "明天"
    };
    if (d - today < -86400000) {
      return "昨天之前";
    }
    return obj[d - today];
  },
  //日期处理
  iSameWeek(date1, date2) {
    let dt1 = new Date();
    dt1.setTime(date1);
    let dt2 = new Date();
    dt2.setTime(date2);
    let md1 = chatRoomUtil.tmonday(dt1);
    let md2 = chatRoomUtil.tmonday(dt2);
    return md1 === md2;
  },
  tmonday(dtm) {
    let dte = new Date(dtm);
    let day = dte.getDay();
    let dty = dte.getDate();
    if (day === 0) {
      day = 7;
    }
    dte.setDate(dty - day + 1);
    return dte.getFullYear() + "-" + dte.getMonth() + "-" + dte.getDate();
  },
  headerNameShow(val) {
    if (!val.customerName) {
      return "";
    }
    if (val.userLabel) {
      if (val.customerName.indexOf("-") > -1) {
        return val.customerName.split("-")[1].slice(0, 3);
      } else if (val.customerName.indexOf("_") > -1) {
        return val.customerName.split("_")[1].slice(0, 3);
      } else {
        return val.customerName.slice(0, 3);
      }
    } else {
      return val.customerName && val.customerName.slice(-4);
    }
  },
  //获取周一到周日
  getWeekSE() {
    var now = new Date();
    var nowTime = now.getTime();
    var day = now.getDay();
    day == 0 ? (day = 7) : "";
    var oneDayTime = 24 * 60 * 60 * 1000;
    //显示周一
    var MondayTime = nowTime - (day + 6) * oneDayTime;
    //显示周日
    var SundayTime = nowTime - day * oneDayTime;
    //初始化日期时间
    var monday = new Date(MondayTime);
    var sunday = new Date(SundayTime);

    function format(shijianchuo) {
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
    }
    return [format(monday), format(sunday)];
  },
  dateFormat(val) {
    return val < 10 ? "0" + val : val;
  }
};
export default chatRoomUtil;
