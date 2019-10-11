<template>
  <img src="../assets/img/Flying_Whale_by_Shu_Le.jpg" width="100%" height="100%" alt="">
</template>

<script>
  export default {
    name: "Welcome",
    data () {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return{
        tableData: Array(5).fill(item)
      }
    }
  }
</script>

<style scoped>

</style>
