<template>
  <div>
    <div class="textBox">
      <transition name="slide">
        <p class="text" :key="text.id" :style="styleObject">
          {{ text.val }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "scroll",
  props: {
    scrollInterval:{
      type:Number,
      default:2000
    },
    styleObject:{
      type:Object,
      default:()=>{
        return {
          fontSize:18+'px',
          color:"#f59a23"
        }
      }
    },
    textArr: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      timer: null,

      number: 0,
    };
  },
  computed: {
    text() {
      return {
        id: this.number,
        val: this.textArr[this.number],
      };
    },
  },
  mounted() {
    this.startMove();
  },
  methods: {
    startMove() {
      if (this.textArr.length > 0) {
        this.timer = setInterval(() => {
          if (this.number == this.textArr.length) {
            this.number = 0;
          } else {
            this.number += 1;
          }
        }, this.scrollInterval); 
      }
    },
  },
  watch: {
    textArr: {
      handler() {
        clearInterval(this.timer);
        this.number = 0;
        this.startMove();
      },
      deep: true,
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
};
</script>

<style scoped>
.textBox {
  width: 100%;
  height: 40px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  text-align: center;
}
.text {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.slide-enter-active {
  transition: all 0.5s linear;
}
.slide-leave-active {
  animation: none;
}

.slide-enter {
  transform: translateY(20px) scale(1);
  opacity: 1;
}
</style>