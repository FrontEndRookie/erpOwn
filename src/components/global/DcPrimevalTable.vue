<template>
  <!-- 简易封装原生表格 -->
  <table class="dc-primeval-table">
    <thead>
      <tr>
        <th
          v-for="item in columns"
          :key="item.prop"
          :style="{ minWidth: item.width }"
        >
          <slot :name="`header-${item.prop}`">
            {{ item.label }}
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- 行 -->
      <tr
        v-for="(dataItem, dataIndex) in data"
        :key="dataIndex"
        :class="dataItem.class"
        :style="dataItem.style"
      >
        <!-- 列 -->
        <td v-for="columnItem in columns" :key="columnItem.prop">
          <slot :name="columnItem.prop" :row="dataItem" :index="dataIndex">
            {{ dataItem[columnItem.prop] }}
          </slot>
        </td>
      </tr>
      <tr v-if="data.length <= 0">
        <td :colspan="columns.length">暂无数据</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "DcPrimevalTable",
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="less" scoped>
.dc-primeval-table {
  th,
  td {
    padding: 10px;
    text-align: center;
    word-break: break-all;
  }
  tr {
    border: 1px solid #000;
  }
}
</style>