<template>
  <div>
    <el-row>
      <el-col :span="3">
      </el-col>
      <el-col :span="2">
        <div style="opacity: 0;">0</div>
      </el-col>
      <el-col :span="3">
        <span>新增环节</span>
        <el-button @click="openDialog" type="primary" icon="el-icon-edit" circle></el-button>
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
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="stepTitle"
            label="环节标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="stepIndicator"
            label="合格指标率"
            width="280">
            <template slot-scope="scope">
              <el-progress type="dashboard" :percentage="scope.row.stepIndicator" :color="colors"></el-progress>
            </template>
          </el-table-column>
          <el-table-column
            prop="stepIntroduce"
            label="环节描述"
            width="180"
            height="130">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="deleteStep(scope.row)" type="text" style="color: red;" size="small">删除</el-button>
              <el-button @click="updateStep(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="dialog"
      :close-on-click-modal='false'
      :modal-append-to-body='false'
      :before-close="handleClose">
      <el-form :model="form" ref="form" class="demo-ruleForm">
        <el-input v-model="form.id" type="hidden" autocomplete="off"></el-input>
        <el-form-item label="环节标题" prop="stepTitle" :rules="[{ required: true, message: '环节标题不能为空'}]"
                      :label-width="formLabelWidth">
          <el-input v-model="form.stepTitle" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="合格指标率" prop="stepIndicator" :rules="[{ required: true, message: '合格指标率不能为空'}]"
                      :label-width="formLabelWidth">
          <!--          <el-input v-model="form.stepIndicator" placeholder="请输入百分比数目"></el-input>-->
          <el-select v-model="form.stepIndicator" placeholder="请选择年龄">
            <el-option v-for="(item,ind) in stepOption" :key="ind" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-progress style="margin-left: 35%;" type="dashboard" :percentage="form.stepIndicator"
                     :color="colors"></el-progress>

        <el-form-item label="环节描述" prop="stepIntroduce" :rules="[{ required: true, message: '环节描述不能为空'}]"
                      :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.stepIntroduce" placeholder="请输入环节描述"></el-input>
        </el-form-item>

        <el-form-item style="margin-left: 35%;">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="insertStep('form')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "step",
    data() {
      return {
        tableData: [],
        colors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ],
        dialog: false,
        form: {
          id: '',
          stepTitle: '',
          stepIndicator: 60,
          stepIntroduce: '',
        },
        formLabelWidth: '100px',
        stepOption: [],
        currentPage: 1, //分页时定义的页数
        totalSize: 0, //总的数据
        pageSize: 5, //定义分label页个数的格式
      }
    },
    methods: {
      //当前页存在的个数
      handleSizeChange(val) {
        this.pageSize = val;
        this.initSteps()
      },
      //当前页变化
      handleCurrentChange(val) {
        //当前多少页
        this.currentPage = val;
        this.initSteps()
      },
      //选择年龄段
      addStepOption() {
        let minStep = 30;
        let maxStep = 94;
        for (let step = minStep; step <= maxStep;) {
          step = step + 5;
          this.stepOption.push(step);
        }
      },
      openDialog() {
        this.initForm();
        this.$nextTick(() => {
          this.dialog = true;
        });
      },
      handleClose() {
        this.dialog = false;
      },
      //新增环节
      insertStep(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            let VehicleStep = this.form;
            if (VehicleStep.id !== null && VehicleStep.id !== "") {
              this.$axios.put('apis/management/manage/step', VehicleStep).then(res => {
                if (res.data.code === 200) {
                  this.$getMessage('修改环节成功', 'success');
                  this.initSteps();
                  this.dialog = false;
                }
              }).catch(err => {
                console.log(err.response);
              })
            } else {
              this.$axios.post('apis/management/manage/step', VehicleStep).then(res => {
                if (res.data.code === 200) {
                  this.$getMessage('新增环节成功', 'success');
                  this.initSteps();
                  this.dialog = false;
                }
              }).catch(err => {
                console.log(err.response);
              })
            }
          } else {
            this.$getMessage('新增环节失败', 'error');
          }
        })
      },
      //修改环节
      updateStep(row) {
        this.form.stepIndicator = row.stepIndicator;
        this.form.stepIntroduce = row.stepIntroduce;
        this.form.stepTitle = row.stepTitle;
        this.form.id = row.id;
        this.dialog = true;
      },
      deleteStep(step) {
        this.$confirm('此操作将永久删除该环节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete('apis/management/manage/step?id=' + step.id).then(res => {
            if (res.data.code === 200) {
              this.$getMessage('删除成功', 'success');
              this.initSteps();
            }
          }).catch(err => {
            console.log(err);
          })
        }).catch(() => {
          this.$getMessage('已取消删除', 'info');
        });
      },
      initForm() {
        this.form.stepTitle = '';
        this.form.id = '';
        this.form.stepIndicator = 60;
        this.form.stepIntroduce = '';
      },
      //初始化
      initSteps() {
        this.$axios.get('apis/management/manage/step', {
          params: {
            pageNo: this.currentPage,
            pageSize: this.pageSize,
          }
        }).then(res => {
          this.tableData = res.data.data.records;
          this.currentPage = res.data.data.current;
          this.totalSize = res.data.data.total;
        }).catch(err => {
          console.log(err.response);
        })
      },
    }
    ,
    mounted() {
      this.addStepOption();
      this.initSteps();
    }
  }
</script>

<style scoped>

</style>
