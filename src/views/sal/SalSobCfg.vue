<template>
  <div>
    <el-table :data="emps" border stripe size="mini">
      <el-table-column type="selection" align="left" width="55"></el-table-column>
      <el-table-column prop="name" align="left" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" align="left" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="workID" align="left" label="工号" width="180"></el-table-column>
      <el-table-column prop="phone" align="left" label="工号" width="180"></el-table-column>
      <el-table-column prop="department.name" align="left" label="所属部门" width="180"></el-table-column>

      <el-table-column align="center" label="工资账套" width="180">
        <template slot-scope="scope">
          <el-tooltip placement="right" v-if="scope.row.salary">
            <div slot="content">
              <table>
                <tr>
                  <td>基本工资</td>
                  <td>{{ scope.row.salary.basicSalary }}</td>
                </tr>
                <tr>
                  <td>奖金</td>
                  <td>{{ scope.row.salary.bonus }}</td>
                </tr>
                <tr>
                  <td>午餐补助</td>
                  <td>{{ scope.row.salary.lunchSalary }}</td>
                </tr>
                <tr>
                  <td>交通补助</td>
                  <td>{{ scope.row.salary.trafficSalary }}</td>
                </tr>
                <tr>
                  <td>养老金基数</td>
                  <td>{{ scope.row.salary.pensionBase }}</td>
                </tr>
                <tr>
                  <td>养老金比率</td>
                  <td>{{ scope.row.salary.pensionPer }}</td>
                </tr>
                <tr>
                  <td>医疗基数</td>
                  <td>{{ scope.row.salary.medicalBase }}</td>
                </tr>
                <tr>
                  <td>医疗报销比率</td>
                  <td>{{ scope.row.salary.medicalPer }}</td>
                </tr>
                <tr>
                  <td>公积金基数</td>
                  <td>{{ scope.row.salary.accumulationFundBase }}</td>
                </tr>
                <tr>
                  <td>公积金比率</td>
                  <td>{{ scope.row.salary.accumulationFundPer }}</td>
                </tr>
              </table>
            </div>
            <el-button>{{ scope.row.salary.name }}</el-button>
          </el-tooltip>
          <el-tag v-else>暂未设置</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-popover placement="left"
                      title="编辑工资账套"
                      @show="showPop(scope.row.salary)"
                      @hide="hidePop(scope.row)"
                      width="200"
                      size="mini"
                      trigger="click">
            <div>
              <el-select v-model="selectedSalary" placeholder="请选择">
                <el-option
                    v-for="(r,index) in salaries"
                    :key="index"
                    :label="r.name"
                    :value="r.id">
                </el-option>
              </el-select>
            </div>
            <el-button slot="reference" type="danger">修改工资账套</el-button>
          </el-popover>
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
</template>
<script>
export default {
  name: "SalSobCfg.vue",
  data() {
    return {
      emps: [],
      currentPage: 1,
      size: 10,
      total: 0,
      salaries: [],
      selectedSalary: null
    }
  },
  mounted() {
    this.initEmps();
    this.initSalaries();
  },
  methods: {
    hidePop(data) {
      if (this.selectedSalary && ((data.salary == null) || (data.salary.id != this.selectedSalary))) {
        this.putRequest('/salary/sobcfg/updateEmployeeWithSalary?empId=' +
            data.id + '&salaryId=' + this.selectedSalary).then(resp => {
              this.initEmps();
        })
      }
    },
    showPop(salary) {
      if (salary) {
        this.selectedSalary = salary.id
      } else {
        this.selectedSalary = null;
      }
    },
    initSalaries() {
      this.getRequest('/salary/sobcfg/salaries').then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      })
    },
    sizeChange(size) {
      this.size = size;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmps();
    },
    initEmps() {
      this.getRequest('/salary/sobcfg/getEmployeeWithSalary?currentPage=' + this.currentPage + '&size=' + this.size).then(resp => {
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      })
    }
  }
}
</script>

<style>

</style>