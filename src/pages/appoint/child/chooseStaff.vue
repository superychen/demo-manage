<template>
  <div>
    <div>
      <el-button @click="againStaff" type="warning" plain size="mini" round>重选员工</el-button>
    </div>
    <div class="wuxian">
      <el-col :span="24" v-for="(item,index) in list" :key="index">
        <el-card shadow="hover" :body-style="{ margin: '2px',padding:'0px'}">
          <el-checkbox v-model="list[index].isChecked" :disabled="isDisabled" @change="chooseCheck(item,index)"
                       :label="item.id" class="can1">
            {{item.staffNumber}}
          </el-checkbox>
          <span class="can2">{{item.staffName}}</span>
          <span class="can3">{{item.staffAge}}</span>
          <span class="can4">{{item.staffSex}}</span>
          <el-image fit="contain" style="width: 50px; height: 50px;" :src="$fastdfsUrl.fastdfs + item.staffPic"
                    class="can5"></el-image>
        </el-card>
        <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
      </el-col>
      <infinite-loading @infinite="infiniteHandler">
        <div slot="spinner">小弟拼命加载中...</div>
        //加载中的文字
        <div slot="no-more">已加载完毕!</div>
        //加载完毕的文字
        <div slot="no-results">暂无数据:(</div>
        //没有数据的文字
      </infinite-loading>
    </div>
    <div slot="footer" style="width:30%;margin-left: auto;margin-right: auto; margin-top: 10px;"
         class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button @click="appointStaff" type="primary">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading';

  export default {
    name: "chooseStaff",
    components: {InfiniteLoading},
    props: ['appId'],
    data() {
      return {
        list: [],
        page: 0,
        checkboxIds: [],
        isDisabled: false,
      }
    },
    methods: {
      infiniteHandler($state) {
        setTimeout(() => {
          this.page++;
          let pageSize = 4;
          this.$axios.get('apis/management/manage/distri/staff', {
            params: {
              pageNo: this.page,
              pageSize: pageSize,
            }
          }).then(res => {
            if (res.data.code === 200) {
              if (res.data.data.records.length !== 0) {
                res.data.data.records.forEach(v => {
                  v.isChecked = false;
                  this.list.push(v);
                })
              }
              if ((this.page * pageSize) >= res.data.data.total) {
                $state.complete();
                return false;
              } else {
                $state.loaded();
              }
            } else {
              $state.complete();
              return false;
            }
          }).catch(err => {
            console.log(err);
          });
        }, 1000);
      },
      chooseCheck(val, index) {
        if (val.isChecked === false) {
          let res = this.checkboxIds;
          for (let i = 0; i < res.length; i++) {
            if (res[i] === val.id) {
              let index = this.checkboxIds.indexOf(val.id);
              this.checkboxIds.splice(index, 1);
              return false;
            }
          }
        }
        this.checkboxIds.push(val.id);
        if (this.checkboxIds.length >= 3) {
          this.$getMessage('最多分配3个员工哟!!', 'info');
          this.isDisabled = true;
          return false;
        }
        console.log(this.checkboxIds);
      },
      //关闭
      dialogClose() {
        this.againStaff();
        this.$emit('staffClose', 0);
      },
      //重新选择员工
      againStaff() {
        this.checkboxIds = [];
        this.list.forEach(v => {
          v.isChecked = false;
        });
        this.isDisabled = false;
      },

      //分配员工
      appointStaff() {
        if (this.checkboxIds.length > 3 || this.checkboxIds.length === 0) {
          this.$getMessage('分配的员工不能为空且不能超过3个员工哟!!', 'warning');
          return false;
        }
        let _this = this;
        let appId = _this._props.appId;
        console.log(this.checkboxIds);
        let distriVo = {
          appId: appId,
          staffIds: this.checkboxIds,
        };
        this.$axios.post('apis/vehicle/appoint/distri', distriVo).then(res => {
          if (res.data.code === 200) {
            this.$getMessage('分配员工成功,对应员工', 'success');
            setTimeout(() => {
              this.$router.go(0)
            }, 1000);//刷新组件
          }
        }).catch(err => {
          console.log(err.response);
        })
      },
    },
  }
</script>

<style scoped>
  .wuxian {
    width: 100%;
    height: 300px;
    margin-top: 10px;
    overflow-y: auto;
  }

  .wuxian::-webkit-scrollbar {
    display: none
  }

  .can1 {
    position: relative;
    left: 10%;
    transform: translate(-50%, -80%);
  }

  .can2 {
    position: relative;
    left: 20%;
    transform: translate(-50%, -80%);
    display: inline-block;
  }

  .can3 {
    position: relative;
    left: 30%;
    transform: translate(-50%, -80%);
    display: inline-block;
  }

  .can4 {
    position: relative;
    left: 40%;
    transform: translate(-50%, -80%);
    display: inline-block;
  }

  .can5 {
    position: relative;
    left: 50%;
    transform: translate(-50%, 5%);
    display: inline-block;
  }
</style>
