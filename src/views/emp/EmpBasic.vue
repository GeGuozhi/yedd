<template>
  <div>
    <div class="firstContent">
      <div>
        <el-input style="width: 300px;margin-right: 10px"
                  v-model="empName"
                  @keydown.enter.native="normalSearch"
                  prefix-icon="el-icon-search"
                  clearable
                  @clear="initEmps"
                  :disabled="advInfoVisible"
                  aria-placeholder="请输入员工名进行搜索..."></el-input>
        <el-button type="primary" icon="el-icon-search" @click="normalSearch" :disabled="advInfoVisible">搜索</el-button>
        <el-button type="primary" @click="advButtonClick">
          <i :class="!advInfoVisible?'fa fa-angle-double-down':'fa fa-angle-double-up'" aria-hidden="true"></i>高级搜索
        </el-button>
      </div>
      <div>
        <el-button type="success">
          <i class="fa fa-level-up" aria-hidden="true"></i>导入数据
        </el-button>
        <el-button type="success">
          <i class="fa fa-level-down" aria-hidden="true"></i>导出数据
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="showAddView">添加员工</el-button>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="advInfoVisible"
           style="width:1290px; border :1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 10px;margin-top: 20px">
        <el-row>
          <el-col :span="6">政治面貌:
            <el-select v-model="emp.politicId"
                       size="mini"
                       filterable
                       clearable
                       style="width: 150px"
                       placeholder="政治面貌">
              <el-option v-for="(r,index) in politic"
                         :key="index"
                         :label="r.name"
                         :value="r.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">职称:
            <el-select v-model="emp.posId"
                       size="mini"
                       filterable
                       clearable
                       style="width: 150px"
                       placeholder="职称">
              <el-option v-for="(r,index) in pos"
                         :key="index"
                         :label="r.name"
                         :value="r.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">工作等级:
            <el-select v-model="emp.jobLevelId"
                       size="mini"
                       filterable
                       clearable
                       style="width: 150px"
                       placeholder="工作等级">
              <el-option v-for="(r,index) in jobLevel"
                         :key="index"
                         :label="r.name"
                         :value="r.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">所属部门:
            <el-select v-model="emp.departmentId"
                       size="mini"
                       filterable
                       clearable
                       style="width: 150px"
                       placeholder="所属部门">
              <el-option v-for="(r,index) in department"
                         :key="index"
                         :label="r.name"
                         :value="r.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">民&ensp;&ensp;&ensp;&ensp;族:
            <el-select v-model="emp.nationId"
                       size="mini"
                       filterable
                       clearable
                       style="width: 150px;margin-top: 10px"
                       placeholder="民族">
              <el-option v-for="(r,index) in nation"
                         :key="index"
                         :label="r.name"
                         :value="r.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6" :offset="12" style="margin-top: 10px;">
            <el-button size="mini" icon="el-icon-search" type="primary" style="margin-left: 72px;padding-right: 10px"
                       @click="advSearch">搜索
            </el-button>
            <el-button size="mini" icon="el-icon-loading" type="danger">取消</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>

    <div class="formStyle">
      <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="emps"
          stripe
          border
          style="width: 100%;height: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            fixed
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="workID"
            label="工号"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="gender"
            label="性别"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="birthday"
            label="出生日期"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="idCard"
            label="身份证号"
            align="left"
            width="180">
        </el-table-column>

        <el-table-column
            prop="wedlock"
            label="婚姻情况"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="nation.name"
            label="民族"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="nativePlace"
            label="籍贯"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="politicsStatus.name"
            label="政治面貌"
            align="left"
            width="120">
        </el-table-column>

        <el-table-column
            prop="email"
            label="email"
            align="left"
            width="180">
        </el-table-column>

        <el-table-column
            prop="phone"
            label="phone"
            align="left"
            width="150">
        </el-table-column>

        <el-table-column
            prop="address"
            label="address"
            align="left"
            width="350">
        </el-table-column>

        <el-table-column
            prop="department.name"
            label="所属部门"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="joblevel.name"
            label="工作等级"
            align="left"
            width="120">
        </el-table-column>

        <el-table-column
            prop="position.name"
            label="职称"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="engageForm"
            label="engageForm"
            align="left"
            width="100">
        </el-table-column>

        <el-table-column
            prop="tiptopDegree"
            label="tiptopDegree"
            align="left"
            width="110">
        </el-table-column>

        <el-table-column
            prop="specialty"
            label="specialty"
            align="left"
            width="150">
        </el-table-column>

        <el-table-column
            prop="school"
            label="school"
            align="left"
            width="150">
        </el-table-column>

        <el-table-column
            prop="beginDate"
            label="beginDate"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="workState"
            label="workState"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            prop="workID"
            label="workID"
            align="left"
            width="90">
        </el-table-column>

        <el-table-column
            label="合同期限"
            align="left"
            width="120">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag>
            年
          </template>
        </el-table-column>

        <el-table-column
            prop="conversionTime"
            label="conversionTime"
            align="left"
            width="120">
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button style="padding: 3px" size="mini" @click="doEditEmployee(scope.row)">编辑</el-button>
            <el-button style="padding: 3px" size="mini" type="primary" @click="doViewAdvInfo(scope.row)">查看高级资料
            </el-button>
            <el-button style="padding: 3px" size="mini" type="danger" @click="doDelEmployee(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
            @current-change="currentChange"
            @size-change="sizeChange"
            background
            layout="sizes,prev,pager,next,jumper,->,total"
            :total=total>

        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog
          :title="title"
          :visible.sync="dialogVisible"
          @closed="doClose"
          width="80%">
        <!--          :before-close="handleClose">-->
        <div>

          <el-form ref="empForm" :model="emp"><!--:rules="rules"-->
            <!--第一行-->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="姓名:" prop="name">
                  <label slot="label">姓&#12288;&#12288;名:</label>
                  <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px;" v-model="emp.name"
                            aria-placeholder="请输入员工姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="性别:" prop="gender">
                  <label slot="label">性&#12288;&#12288;别:</label>
                  <el-radio-group v-model="emp.gender" style="margin-top: 9px">
                    <el-radio label="男">男性</el-radio>
                    <el-radio label="女">女性</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出生日期:" prop="birthday">
                  <el-date-picker
                      v-model="emp.birthday"
                      type="date"
                      style="width: 150px"
                      value-format="yyyy-MM-dd"
                      aria-placeholder="出生日期"
                      size="mini">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="政治面貌:" prop="politicId">
                  <el-select v-model="emp.politicId"
                             size="mini"
                             filterable
                             style="width: 150px"
                             placeholder="政治面貌">
                    <el-option v-for="(r,index) in politic"
                               :key="index"
                               :label="r.name"
                               :value="r.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!--第二行-->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="职称:" prop="posId">
                  <label slot="label">职&#12288;&#12288;称:</label>
                  <el-select v-model="emp.posId"
                             size="mini"
                             filterable
                             style="width:150px"
                             placeholder="职称">
                    <el-option v-for="(r,index) in pos"
                               :key="index"
                               :label="r.name"
                               :value="r.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工作等级:" prop="jobLevelId">
                  <el-select v-model="emp.jobLevelId"
                             size="mini"
                             filterable
                             style="width: 150px"
                             placeholder="工作等级">
                    <el-option v-for="(r,index) in jobLevel"
                               :key="index"
                               :label="r.name"
                               :value="r.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属部门:" prop="departmentId">
                  <el-select v-model="emp.departmentId"
                             size="mini"
                             filterable
                             style="width: 150px"
                             placeholder="所属部门">
                    <el-option v-for="(r,index) in department"
                               :key="index"
                               :label="r.name"
                               :value="r.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="民族:" prop="nationId">
                  <label slot="label">民&#12288;&#12288;族:</label>
                  <el-select v-model="emp.nationId"
                             size="mini"
                             filterable
                             style="width: 150px"
                             placeholder="民族">
                    <el-option v-for="(r,index) in nation"
                               :key="index"
                               :label="r.name"
                               :value="r.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!--第三行-->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="身份证号:" prop="idCard">
                  <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px;" v-model="emp.idCard"
                            aria-placeholder="请输入身份证号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="婚姻:" prop="wedlock">
                  <label slot="label">婚&#12288;&#12288;姻:</label>
                  <el-radio-group v-model="emp.wedlock" style="margin-top: 9px">
                    <el-radio label="已婚">已婚</el-radio>
                    <el-radio label="未婚">未婚</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="籍贯:" prop="nativePlace">
                  <label slot="label">籍&#12288;&#12288;贯:</label>
                  <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px;" v-model="emp.nativePlace"
                            aria-placeholder="籍贯"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="邮箱:" prop="email">
                  <label slot="label">邮&#12288;&#12288;箱:</label>
                  <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px;" v-model="emp.email"
                            aria-placeholder="邮箱"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!--第四行-->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="手机号:" prop="phone">
                  <label slot="label">手机号&#12288;:</label>
                  <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px;" v-model="emp.phone"
                            aria-placeholder="手机号码"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="地址:" prop="address">
                  <label slot="label">地&#12288;&#12288;址:</label>
                  <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px;" v-model="emp.address"
                            aria-placeholder="地址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="聘用形式:" prop="engageForm">
                  <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px;" v-model="emp.engageForm"
                            aria-placeholder="聘用形式"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="学历:" prop="tiptopDegree">
                  <label slot="label">学&#12288;&#12288;历:</label>
                  <el-select v-model="emp.tiptopDegree"
                             size="mini"
                             filterable
                             style="width: 150px"
                             placeholder="学历">
                    <el-option v-for="item in tiptopDegree"
                               :key="item"
                               :label="item"
                               :value="item"></el-option>
                  </el-select>
                </el-form-item>


              </el-col>
            </el-row>

            <!--第五行-->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="专业:" prop="specialty">
                  <label slot="label">专&#12288;&#12288;业:</label>
                  <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px;" v-model="emp.specialty"
                            aria-placeholder="专业"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="毕业院校:" prop="school">
                  <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px;" v-model="emp.school"
                            aria-placeholder="毕业院校"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工作状态:" prop="workState">
                  <el-radio-group v-model="emp.workState" style="margin-top: 9px">
                    <el-radio label="在职">在职</el-radio>
                    <el-radio label="离职">离职</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同期限:" prop="contractTerm">
                  <el-input size="mini"
                            prefix-icon="el-icon-edit"
                            style="width: 150px;"
                            v-model="emp.contractTerm"
                            aria-placeholder="合同期限">
                    <template slot="append">年</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!--第六行-->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="入职日期:" prop="beginDate">
                  <el-date-picker
                      v-model="emp.beginDate"
                      type="date"
                      style="width: 150px"
                      value-format="yyyy-MM-dd"
                      aria-placeholder="入职日期"
                      size="mini">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="转正日期:" prop="conversionTime">
                  <el-date-picker
                      v-model="emp.conversionTime"
                      type="date"
                      style="width: 150px"
                      value-format="yyyy-MM-dd"
                      aria-placeholder="转正日期"
                      size="mini">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同开始日期:" prop="beginContract">
                  <el-date-picker
                      v-model="emp.beginContract"
                      type="date"
                      style="width: 120px"
                      value-format="yyyy-MM-dd"
                      aria-placeholder="合同开始日期"
                      size="mini">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同结束日期:" prop="endContract">
                  <el-date-picker
                      v-model="emp.endContract"
                      type="date"
                      style="width: 120px"
                      value-format="yyyy-MM-dd"
                      aria-placeholder="合同结束日期"
                      size="mini">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="doCancelDialog">取 消</el-button>
          <el-button type="primary" @click="doAddEmployee">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
export default {
  name: "EmpBasic.vue",
  data() {
    return {
      emps: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      empName: '',
      dialogVisible: false,
      advInfoVisible: false,
      emp: {
        id: '',
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlace: '',
        politicId: '',
        email: '',
        phone: '',
        address: '',
        departmentId: '',
        jobLevelId: '',
        posId: '',
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '',
        workID: '',
        contractTerm: '',
        conversionTime: '',
        notWorkDate: '',
        beginContract: '',
        endContract: '',
        workAge: '',
        salaryId: ''
      },
      pos: [],
      department: [],
      jobLevel: [],
      nation: [],
      politic: [],
      maxWorkId: '',
      tiptopDegree: [
        '博士', '硕士', '本科', '大专', '高中', '初中', '小学', '其他'
      ],
      title: ''
    }
  },
  mounted() {
    this.initEmps();
    this.getPos();
    this.getDepartment();
    this.getJobLevel();
    this.getNation();
    this.getPolitic();
  },
  methods: {
    advSearch() {
      this.loading = true;
      let empName = this.empName ? ('&name=' + this.empName) : '';
      let politicId = this.emp.politicId ? ('&politicId=' + this.emp.politicId) : '';
      let posId = this.emp.posId ? ('&posId=' + this.emp.posId) : '';
      let jobLevelId = this.emp.jobLevelId ? ('&jobLevelId=' + this.emp.jobLevelId) : '';
      let departmentId = this.emp.departmentId ? ('&departmentId=' + this.emp.departmentId) : '';
      let nationId = this.emp.nationId ? ('&nationId=' + this.emp.nationId) : '';
      this.getRequest('/employee/basic/getEmployee/?' +
          'currentPage=' + this.currentPage +
          '&size=' + this.size
          + empName + politicId + posId + jobLevelId + departmentId + nationId
      ).then(resp => {
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
          this.loading = false;
        }
        this.loading = false;
      })
    },
    doViewAdvInfo(row) {
      this.title = '员工高级资料';
      this.emp = row;

      this.emp.posId = row.position.id;
      this.emp.departmentId = row.department.id;
      this.emp.jobLevelId = row.joblevel.id;
      this.emp.nationId = row.nation.id;
      this.emp.politicId = row.politicsStatus.id;

      this.dialogVisible = true;
    },
    doEditEmployee(row) {
      this.title = '编辑员工资料';
      this.emp = row;

      this.emp.posId = row.position.id;
      this.emp.departmentId = row.department.id;
      this.emp.jobLevelId = row.joblevel.id;
      this.emp.nationId = row.nation.id;
      this.emp.politicId = row.politicsStatus.id;

      this.dialogVisible = true;
    },
    doDelEmployee(row) {
      this.deleteRequest('/employee/basic/deleteEmployee/' + row.id).then(resp => {
        if (resp) {
          this.initEmps();
        }
      })
    },
    doAddEmployee() {
      if (this.emp.id) {
        this.putRequest('/employee/basic/updateEmployee', this.emp).then(resp => {
          if (resp) {
            this.dialogVisible = false;
            this.initEmps();
          }
        })
      } else {
        this.postRequest('/employee/basic/addEmployee', this.emp).then(resp => {
          if (resp) {
            this.dialogVisible = false;
            this.initEmps();
          }
        })
      }
    },
    doCancelDialog() {
      this.dialogVisible = false
    },
    doClose() {
      this.clearControls();
      this.dialogVisible = false
      console.log('关闭');
    },
    getMaxWorkId() {
      this.getRequest('/employee/basic/maxWorkId').then(resp => {
        if (resp) {
          this.maxWorkId = resp.obj;
        }
      })
    },
    getPos() {
      this.getRequest('/employee/basic/getAllPositions').then(resp => {
        if (resp) {
          this.pos = resp;
        }
      })
    },
    getDepartment() {
      this.getRequest('/employee/basic/getAllDeps').then(resp => {
        if (resp) {
          this.department = resp;
        }
      })
    },
    getJobLevel() {
      this.getRequest('/employee/basic/getAllJoblevels').then(resp => {
        if (resp) {
          this.jobLevel = resp;
        }
      })
    },
    getNation() {
      this.getRequest('/employee/basic/getAllNations').then(resp => {
        if (resp) {
          this.nation = resp;
        }
      })
    },
    getPolitic() {
      this.getRequest('/employee/basic/getAllPoliticsStatus').then(resp => {
        if (resp) {
          this.politic = resp;
        }
      })
    },
    clearControls() {
      this.emp.posId = '';
      this.emp.departmentId = '';
      this.emp.jobLevelId = '';
      this.emp.nationId = '';
      this.emp.politicId = '';
    },
    showAddView() {
      this.title = '添加员工';
      this.emp = {
        id: '',
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlace: '',
        politicId: '',
        email: '',
        phone: '',
        address: '',
        departmentId: '',
        jobLevelId: '',
        posId: '',
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '',
        workID: '',
        contractTerm: '',
        conversionTime: '',
        notWorkDate: '',
        beginContract: '',
        endContract: '',
        workAge: '',
        salaryId: ''
      };
      this.dialogVisible = true;
    },
    sizeChange(size) {
      this.size = size;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmps();
    },
    normalSearch() {
      this.clearControls();
      this.initEmps();
    },
    advButtonClick(){
      this.advInfoVisible = !this.advInfoVisible;
      this.clearControls();
    },
    initEmps() {
      this.loading = true;
      let empName = this.empName ? ('&name=' + this.empName) : '';
      let politicId = this.emp.politicId ? ('&politicId=' + this.emp.politicId) : '';
      let posId = this.emp.posId ? ('&posId=' + this.emp.posId) : '';
      let jobLevelId = this.emp.jobLevelId ? ('&jobLevelId=' + this.emp.jobLevelId) : '';
      let departmentId = this.emp.departmentId ? ('&departmentId=' + this.emp.departmentId) : '';
      let nationId = this.emp.nationId ? ('&nationId=' + this.emp.nationId) : '';
      this.getRequest('/employee/basic/getEmployee/?' +
          'currentPage=' + this.currentPage +
          '&size=' + this.size
          + empName + politicId + posId + jobLevelId + departmentId + nationId
      ).then(resp => {
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
          this.loading = false;
        }
        this.loading = false;
      })
    }
  }
}
</script>

<style>
.firstContent {
  display: flex;
  justify-content: space-between;
}

.formStyle {
  margin-top: 20px;
}

.slide-fade-enter-active {
  transition: all .8s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to {
  transition: translateX(10px);
  opacity: 0;
}

</style>