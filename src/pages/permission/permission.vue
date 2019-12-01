<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div style="opacity: 0;">0</div>
      </el-col>
      <el-col :span="3">
        <span>新增权限</span>
        <el-button type="primary" icon="el-icon-edit" @click="insertDialog = true" circle></el-button>
      </el-col>
      <el-col :span="6">
        <span>删除权限</span>
        <el-button :disabled="isDelete" type="danger" icon="el-icon-delete" circle></el-button>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple" style="color: white; font-size: 1px;opacity: 0;">
          1
        </div>
      </el-col>
      <el-col :span="16">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @select="showDelete"
          @select-all="showDelete">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="权限名称"
            width="120"
            prop="name">
          </el-table-column>
          <el-table-column
            prop="descript"
            label="权限描述"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="block" style="margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </div>
      </el-col>

      <el-dialog
        title="提示"
        :visible.sync="insertDialog"
        width="30%"
        :close-on-click-modal='false'
        :modal-append-to-body='false'
        :before-close="dialogClose">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item  label="权限名称" prop="perName">
            <el-input @input.native="changeCode" placeholder="只能输入英文字符"  type="text" v-model="ruleForm.perName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限描述" prop="perDesc">
            <el-input v-model="ruleForm.perDesc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-col :span="4">
        <div class="grid-content bg-purple">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      let checkAge = (rule, value, callback) => {
        if (value === ''　|| value.length > 30) {
          return callback(new Error('权限描述不能为空，且不得超过30个字符'));
        }else {
          callback();
        }
      };
      let validatePerName = (rule, value, callback) => {
        if (value === ''　||  value.length > 15) {
          callback(new Error('权限名称不能为空，且长度必须小于16'));
        } else {
          callback();
        }
      };
      return {
        tableData: [],
        multipleSelection: [],
        username: '',
        currentPage: 1, //分页时定义的页数
        totalSize: 0, //总的数据
        isDelete: true,
        pageSize: 5, //定义分label页个数的格式
        insertDialog: false, //新增时弹出框

        ruleForm: {
          perName: '',//权限名称
          perDesc: '' //权限描述
        },
        rules: {
          perName: [
            { validator: validatePerName, trigger: 'blur' }
          ],
          perDesc: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      showDelete(selection) {
        if (selection.length !== 0) {
          this.isDelete = false;
        } else {
          this.isDelete = true;
        }
      },
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.selectAllPermission();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.selectAllPermission();
      },

      dialogClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.insertDialog = false;
          })
          .catch(_ => {
          });
      },


      //查询所有的权限数据
      selectAllPermission() {
        this.$axios.get('/apis/management/manage/permission/all', {
          params: {
            pageNo: this.currentPage, //当前页
            pageSize: this.pageSize,　//每一页的个数
          }
        }).then(res => {
          this.tableData = res.data.data.records;
          this.totalSize = res.data.data.total; //总个数
        }).catch(err => {
          console.log(err.response);
        })
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
            //todo 新增请求
          } else {
            this.$getMessage('请先填写正确数据','error');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //禁止输入中文汉字
      changeCode() {
        this.$nextTick(() => {
          if(this.ruleForm.perName !== null){
            this.ruleForm.perName = this.ruleForm.perName.replace(/[^\w\.\/]/ig,'')
          }
        })
      },

    },

    //页面初始化时创建
    mounted() {
      this.selectAllPermission();
    }
  }
</script>

<style scoped>

</style>
