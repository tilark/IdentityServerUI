<template>
<div>
  <h2 style="text-align:center;">管理Client</h2>
  <el-row justify="left">
    <el-col :span='18'>
  <el-form :model="implicitClient" label-width="200px" :rules="implicitClientRules" ref="implicitClient">
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
    <el-form-item
    v-for="(item, index) in implicitClient.redirectUris"
    :label="'RedirectUri' + index"
    :key="item.key"
    :prop="'redirectUris.' + index + '.value'"
    :rules="{
      required: true, message: 'redirecturi不能为空', trigger: 'blur'
    }"
    >
    <el-col :span='15'>
      <el-input v-model="item.value"></el-input>
    </el-col>
    <span>&nbsp;</span>
    <el-button type="primary" @click="addRedirecturi"><i class="el-icon-plus"></i></el-button>
    <el-button type="danger" @click.prevent="removeRedirecturi(item)"><i class="el-icon-delete"></i></el-button>
    </el-form-item>
    <el-form-item
    v-for="(item, index) in implicitClient.postLogoutRedirectUris"
    :label="'PostLogoutRedirectUri' + index"
    :key="item.key"
    :prop="'postLogoutRedirectUris.' + index + '.value'"
    :rules="{
      required: true, message: 'postLogoutRedirectUri不能为空', trigger: 'blur'
    }"
    >
    <el-col :span='15'>
      <el-input v-model="item.value"></el-input>
    </el-col>
    <span>&nbsp;</span>
    <el-button type="primary" @click="addPostLogoutRedirectUri"><i class="el-icon-plus"></i></el-button>
    <el-button type="danger" @click.prevent="removePostLogoutRedirectUri(item)"><i class="el-icon-delete"></i></el-button>
    </el-form-item>
    <el-form-item
    v-for="(item, index) in implicitClient.allowedCorsOrigins"
    :label="'AllowedCorsOrigins' + index"
    :key="item.key"
    :prop="'allowedCorsOrigins.' + index + '.value'"
    :rules="{
      required: true, message: 'AllowedCorsOrigin不能为空', trigger: 'blur'
    }"
    >
    <el-col :span='15'>
      <el-input v-model="item.value"></el-input>
    </el-col>
    <span>&nbsp;</span>
    <el-button type="primary" @click="addAllowedCorsOrigins"><i class="el-icon-plus"></i></el-button>
    <el-button type="danger" @click.prevent="removeAllowedCorsOrigins(item)"><i class="el-icon-delete"></i></el-button>
    </el-form-item>

    <el-form-item label="AllowedScopes">
      <el-col :span='15'>
        <el-select v-model="implicitClient.allowedScopes" multiple filterable size="medium"  placeholder="请选择">
          <el-option  v-for="item in apiScopes" :key="item.value"  :label="item.label"  :value="item.value">
        </el-option>
      </el-select>
      </el-col>
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
        redirectUris: [{ value: '' }],
        postLogoutRedirectUris: [{ value: '' }],
        allowedScopes: [],
        allowedCorsOrigins: [{ value: '' }]
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
            //  发到后台，创建一个入库单，转换implicitClient
            const implicitClientMap = Object.assign({}, this.implicitClient)
            implicitClientMap.redirectUris = implicitClientMap.redirectUris.map(a => a.value.trim())
            implicitClientMap.postLogoutRedirectUris = implicitClientMap.postLogoutRedirectUris.map(a => a.value)
            implicitClientMap.allowedCorsOrigins = implicitClientMap.allowedCorsOrigins.map(a => a.value)
            postImplicitClientCreate(implicitClientMap).then((res) => {
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
          this.$message({
            message: '验证失败',
            type: 'error'
          })
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
    },
    removeRedirecturi(item) {
      var index = this.implicitClient.redirectUris.indexOf(item)
      if (index !== -1 && this.implicitClient.redirectUris.length > 1) {
        this.implicitClient.redirectUris.splice(index, 1)
      }
    },
    addRedirecturi() {
      this.implicitClient.redirectUris.push({
        value: '',
        key: Date.now()
      })
    },
    removePostLogoutRedirectUri(item) {
      var index = this.implicitClient.postLogoutRedirectUris.indexOf(item)
      if (index !== -1 && this.implicitClient.postLogoutRedirectUris.length > 1) {
        this.implicitClient.postLogoutRedirectUris.splice(index, 1)
      }
    },
    addPostLogoutRedirectUri() {
      this.implicitClient.postLogoutRedirectUris.push({
        value: '',
        key: Date.now()
      })
    },
    removeAllowedCorsOrigins(item) {
      var index = this.implicitClient.allowedCorsOrigins.indexOf(item)
      if (index !== -1 && this.implicitClient.allowedCorsOrigins.length > 1) {
        this.implicitClient.allowedCorsOrigins.splice(index, 1)
      }
    },
    addAllowedCorsOrigins() {
      this.implicitClient.allowedCorsOrigins.push({
        value: '',
        key: Date.now()
      })
    }
  },
  mounted() {
    this.getApiScopes()
  }
}
</script>
