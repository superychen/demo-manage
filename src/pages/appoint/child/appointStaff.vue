<template>
  <div>

    <el-dialog
      title="提示"
      :visible.sync="dialog"
      :modal="false"
      :close-on-click-modal='false'
      :before-close="dialogClose">
      <!--无限滚动-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import chooseStaff from "./chooseStaff";
  export default {
    name: "appointStaff",
    props: ['isDialog', 'appointmentId'],
    components: {chooseStaff},
    data() {
      return {
        dialog: false,
        count: 10,
        busy: false,
        data: [],
      };
    },
    //计算
    computed: {},
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

    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
