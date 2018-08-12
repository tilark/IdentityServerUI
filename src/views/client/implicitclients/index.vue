<template>
<section>
  <h2 style="text-align:center;">管理Client</h2>
  <!--查询条件-->
  <el-form :inline="true" :model="searchForm" ref="searchForm" label-position="left">
    <el-form-item label="ClientId">
      <el-input :value="searchForm.clientId"></el-input>
    </el-form-item>
    <el-form-item label="ClientName">
      <el-input :value="searchForm.clientName"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getImplicitClientList">查询</el-button>
    </el-form-item>
  </el-form>
    <!--列表-->
  <el-table :data="clientList" highlight-current-row v-loading="listLoading"
  @selection-change="selsChange" style="width: 100%">
    <el-table-column type="selection" width="55"></el-table-column>
    <!-- <el-table-column type="index" :index="indexMethod" width="60"></el-table-column> -->
    <el-table-column prop="clientId" label="ClientId"  sortable></el-table-column>
      <el-table-column prop="clientName" label="ClientName" sortable>
    </el-table-column>
    <el-table-column prop="allowedGrantType" label="GrantType" align="center" sortable>
    </el-table-column>
    <el-table-column prop="redirectUris" label="redirectUris" sortable>
    </el-table-column>
    <el-table-column prop="postLogoutRedirectUris" label="postLogoutRedirectUris" sortable>
    </el-table-column>
    <el-table-column prop="allowedScopes" label="allowedScopes" sortable>
    </el-table-column>
    <el-table-column prop="allowedCorsOrigins" label="allowedCorsOrigins"  sortable>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template  slot-scope="props">
        <el-button type="primary" size="small"
            @click="handleEdit(props.$index, props.row)">编辑
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</section>
</template>
<script>
import { getImplicitClients } from '@/api/client'
export default{
  name: 'clients',
  data() {
    return {
      searchForm: {
        clientId: '',
        clientName: ''
      },
      sels: [],
      listLoading: false,
      clientList: []
    }
  },
  methods: {
    getImplicitClientList() {
      this.$refs.searchForm.validate(valid => {
        if (valid) {
          this.listLoading = true
          getImplicitClients(this.searchForm).then(response => {
            this.listLoading = false
            this.clientList = response.data
          }).catch(error => {
            this.listLoading = false
            console.log('getImplicitClientList error', error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    selsChange(sels) {
      this.sels = sels
    }
  }
}
</script>
