<template>
  <div>
    <el-dialog
      title="分配员工"
      :visible.sync="dialog"
      :modal="false"
      :show-close="false"
      :close-on-click-modal='false'>
      <!--无限滚动-->
      <choose-staff :appId="appId"  @staffClose="staffClose"></choose-staff>
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
        appId: '',
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
        this.appId = appId;
      },
      staffClose(msg) {
        if (msg === 0) {
          this.dialogClose();
        } else {
          this.$getMessage('出错出错!!!', "error");
        }
      },
    },
    created() {

    }
  }
</script>

<style scoped>

  .el-dialog__body {
    padding: 0 !important;
  }

</style>
