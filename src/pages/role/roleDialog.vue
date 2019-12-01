<template>
  <div>
    <el-dialog
      title="新增角色"
      :visible.sync="dialog"
      width="30%"
      :close-on-click-modal='false'
      :modal-append-to-body='false'
      :before-close="closeDialog">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色" prop="rname">
          <el-input type="text" v-model="ruleForm.rname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色对应权限">
          <el-checkbox-group
            v-model="checkedRole">
            <el-checkbox v-for="role in roles" :label="role.pid" :key="role.pid">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "roleDialog",
    props: ['dialog'],
    data() {
      let validatePass = (rule, value, callback) => {
        let patt = /^[\s]*$/;//以空格开头并且已空格结尾，中间多次或者零次空格
        if (patt.test(value)) {
          callback(new Error('角色名不能为空且不能存在空格'));
        } else {
          callback();
        }
      };
      return {
        dialogVisible: this._props.dialog,
        ruleForm: {
          rname: '',
        },
        rules: {
          rname: [
            {validator: validatePass, trigger: 'blur'}
          ],
        },
        checkedRole: [],
        roles: [],
      };
    },
    methods: {
      closeDialog() {
        this.dialogVisible = false;
        this.$emit('childFn', this.dialogVisible);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.checkedRole.length <= 0) {
              this.$getMessage('请选择用户权限', 'error');
              return false;
            }
            //新增角色
            this.$axios.post('/apis/management/manage/role', {
              pid: this.checkedRole,
              rname: this.ruleForm.rname,
            }).then(res => {
              console.log(res.data);
              if (res.data.code === 200) {
                this.$getMessage('新增角色成功', 'success');
                setTimeout(() => {this.$router.go(0)},1500);
              }
            }).catch(err => {
              console.log(err.response);
            });
          } else {
            this.$getMessage('请填写对应信息', 'error');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    watch: {
      dialog: (n, o) => {

      }
    },
    mounted() {
      this.$axios.get('/apis/management/manage/permission').then(res => {
        if (res.data.code === 200) {
          //从数组中的对象取出特定字段并生成新的数组
          // let permissionName = res.data.data.map(obj => {
          //   return obj.name;
          // });
          // console.log(permissionName);
          this.roles = res.data.data;
        }
      }).catch(err => {
        console.log(err.response);
      })
    }
  }
</script>

<style scoped>
</style>
