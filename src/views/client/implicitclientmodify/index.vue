<template>
<div>
  <h2 style="text-align:center;">管理Client</h2>
  <el-row type="flex" justify="center">
    <el-col :span='18'>
  <el-form :model="implicitClient" label-width="160px" :rules="implicitClientRules" ref="implicitClient">
    <el-form-item label='AllowedGrantType'>
      <el-input :disabled='true' v-model="implicitClient.allowedGrantTypes"></el-input>
    </el-form-item>
    <el-form-item label="ClientId" prop="clientId">
      <el-input v-model="implicitClient.clientId"></el-input>
    </el-form-item>
    <el-form-item label="ClientName" prop="clientName">
      <el-input v-model="implicitClient.clientName">
      </el-input>
    </el-form-item>
    <el-form-item label="redirectUris">
      <el-tooltip class="item" effect="dark" content="多路径用','分开" placement="right">
        <el-input v-model="implicitClient.redirectUris"></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="postLogoutRedirectUris">
      <el-tooltip class="item" effect="dark" content="多路径用','分开" placement="right">
        <el-input v-model="implicitClient.postLogoutRedirectUris"></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="allowedScopes">
      <el-select v-model="implicitClient.allowedScopes" multiple filterable size="medium"  placeholder="请选择">
        <el-option  v-for="item in apiScopes" :key="item.value"  :label="item.label"  :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="allowedCorsOrigins">
      <el-tooltip class="item" effect="dark" content="多路径用','分开" placement="right">
        <el-input v-model="implicitClient.allowedCorsOrigins"></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item>
      <el-button @click.native="submit" :loading="addLoading">保存</el-button>
    </el-form-item>
  </el-form>
    </el-col>
  </el-row>

</div>
</template>
<script>
import { postImplicitClientCreate } from '@/api/client'
import { getApiResources } from '@/api/apiResource'
export default {
  name: 'implicitClientModify',
  data() {
    return {
      implicitClient: {
        clientId: '',
        clientName: '',
        allowedGrantTypes: 'Implicit',
        redirectUris: '',
        postLogoutRedirectUris: '',
        allowedScopes: [],
        allowedCorsOrigins: ''
      },
      implicitClientRules: {
        clientId: [
          { required: true, message: 'ClientId不能为空', trigger: 'blur' }
        ],
        clientName: [
          { required: true, message: 'ClientName不能为空', trigger: 'blur' }
        ]
      },
      apiScopes: [],
      addLoading: false
    }
  },
  methods: {
    submit() {
      this.$refs['implicitClient'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗?', '提示', {}).then(() => {
            this.addLoading = true
            //  发到后台，创建一个入库单
            postImplicitClientCreate(this.implicitClient).then((res) => {
              this.addLoading = false
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              //  成功后需返回到列表，或者编辑界面
            }).catch((error) => {
              console.log(error)
              this.addLoading = false
              this.$message({
                message: '创建失败',
                type: 'error'
              })
            })
          })
        } else {
          console.log('enter InRepositoryCreate 验证失败')
        }
      })
    },
    getApiScopes() {
      //  获得IdentityResource和ApiResources，后台需组合后返回
      getApiResources().then(response => {
        this.apiScopes = response.data.map(item => {
          return { value: item.name, label: item.displayName }
        })
      }).catch(error => {
        console.log(error)
        this.apiScopes.push({ value: 'Error', label: 'Error' })
      })
    }
  },
  mounted() {
    this.getApiScopes()
  }
}
</script>
