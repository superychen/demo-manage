<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialog"
      :modal="false"
      :close-on-click-modal='false'
      :before-close="dialogClose">
      <!--无限滚动-->
      <div class="infinite-list-wrapper" style="overflow:auto">
        <ul
          class="list"
          v-infinite-scroll="load"
          infinite-scroll-disabled="disabled">
          <li v-for="i in count" class="list-item">{{ i }}</li>
        </ul>
        <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "appointStaff",
    props: ['isDialog', 'appointmentId'],
    data() {
      return {
        dialog: false,
        count: 10,
        loading: false
      };
    },
    //计算
    computed: {
      noMore() {
        return this.count >= 20
      },
      disabled() {
        return this.loading || this.noMore
      }
    },
    watch: {
      isDialog: {
        handler(newVal, oldVal) {
          let _this = this;
          if (newVal === 1) {
            this.chooseStaff(_this._props.appointmentId);
            this.dialog = true;
          } else {
            this.dialog = false;
          }
        }
      }
    },
    methods: {
      dialogClose() {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit("closeDialog", 0);
          })
          .catch(_ => {
            this.$getMessage('取消关闭', 'info')
          });
      },
      chooseStaff(appId) {
        // this.$axios.get('')
      },
      //加载
      load() {
        this.loading = true;
        setTimeout(() => {
          this.count += 2;
          this.loading = false
        }, 2000)
      },

    },
  }
</script>

<style scoped>

</style>
