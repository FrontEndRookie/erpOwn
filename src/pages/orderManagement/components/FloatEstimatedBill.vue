<template>
  <div class="float-estimated-bill" v-show="showEstimatedBill">
    <div class="estimated-wrap" :class="{ expand: expandBill }">
      <header class="bill-title">预估账单</header>
      <section>
        <div class="font-weight: bold;">国内段</div>
        <ul>
          <li class="list-item">
            <span class="title">空运费</span>
            <div class="content">
              <span
                >{{ form.bookingCw }} * {{ form.bookingPrice }} *
                {{ currencyRate }}</span
              >
              <span>￥{{ computedAirFreight }}</span>
            </div>
          </li>
          <li class="list-item" v-show="computedCustomsFees > 0">
            <span class="title">报关费</span>
            <div class="content">
              <span>100 * 1</span>
              <span>￥{{ computedCustomsFees }}</span>
            </div>
          </li>
        </ul>
      </section>
      <section class="total">￥{{ totalFees }}</section>
      <footer>
        <div>计费重量以最终确认账单为准</div>
        <div>此账单只针对该票货物空运费与报关费，如有其他杂费另计</div>
      </footer>
      <div class="expand-btn" @click="expandBill = !expandBill">
        <svg width="40px" height="16px">
          <path
            d="M 0 0, L 40 0, L 28 16, L 12 16, L 0 0"
            stroke-width="1"
            stroke="#000"
            fill="#fff"
          ></path>
          <line x1="0" y1="0" x2="40" y2="0" stroke="#fff" stroke-width="1" />
        </svg>
        <i class="el-icon-caret-top" v-show="expandBill"></i>
        <i class="el-icon-caret-bottom" v-show="!expandBill"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FloatEstimatedBill",
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
    currencyRate: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    return {
      expandBill: true,
    };
  },
  computed: {
    showEstimatedBill() {
      const {
        bookingCw,
        bookingPrice,
        bookingWeight,
        bookingCbm,
        bubblePoint,
      } = this.form;
      return (
        bookingCw && bookingPrice && bookingWeight && bookingCbm && bubblePoint
      );
    },
    // 空运费
    computedAirFreight() {
      const {
        form: { bookingCw, bookingPrice },
        currencyRate,
      } = this;
      return bookingCw * bookingPrice * currencyRate;
    },
    // 报关费
    computedCustomsFees() {
      const { customsType } = this.form;
      return 100 * (customsType == 2 ? 1 : 0);
    },
    // 预估总费用
    totalFees() {
      return (
        Number(this.computedAirFreight) + Number(this.computedCustomsFees)
      ).toLocaleString("en-US");
    },
  },
};
</script>

<style lang="less" scoped>
.float-estimated-bill {
  position: fixed;
  right: 20px;
  top: 20%;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #000;
  background: #fff;
  line-height: 20px;
  .estimated-wrap {
    width: 100px;
    height: 40px;
    overflow: hidden;
    transition: all 0.2s;
    &.expand {
      width: 260px;
      height: 250px;
    }
    .expand-btn {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 100%);
      width: 40px;
      height: 16px;
      svg,
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  header,
  section,
  footer {
    padding: 10px;
  }
  header {
    border-bottom: 1px dashed #000;
    text-align: center;
  }
  .bill-title {
    font-size: 16px;
  }
  .list-item {
    display: flex;
    align-items: center;
    .content {
      margin-left: 20px;
      flex: 1;
      min-width: 0;
      text-align: right;
    }
  }
  footer {
    border-top: 1px dashed #000;
  }
  .total {
    padding: 20px 10px;
    border-top: 1px dashed #000;
    text-align: right;
    font-size: 20px;
    color: #ff9914;
    font-weight: bold;
  }
}
</style>
