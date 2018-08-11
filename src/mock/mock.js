import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { LoginUsers, Users } from './data/user'
// import { promises } from 'fs'
const _LoginUsers = LoginUsers
const _Users = Users
export default{
  /**
   * mock bootstrap
   */
  bootstrap() {
    var mock = new MockAdapter(axios)

    //  mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    })

    //  mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    })

    // 获取用户列表
    mock.onAny('http://localmock/user/info').reply(config => {
      const { token } = config.params
      return new Promise((resolve, reject) => {
        if (token !== '' || token !== undefined) {
          const mockUser = _Users[0]
          setTimeout(() => {
            resolve([200, {
              code: 20000,
              message: 'successed',
              user: mockUser
            }])
          }, 1000)
        } else {
          reject({ code: 4004, message: 'nouser' })
        }
      })
    })
    mock.onAny().reply(config => {
      console.log(config)
      // Unexpected request, error out
      return [500, {}]
    })
    // 登陆
    mock.onAny('/user/login').reply(config => {
      console.log('enter login')
      const { username, password } = config.params
      return new Promise((resolve, reject) => {
        const valid = _LoginUsers.filter(a => a.username === username && a.password === password)
        if (valid) {
          resolve([200, {
            code: 20000,
            message: 'successed'
          }])
        } else {
          reject()
        }
      })
    })
    //  登出
    mock.onAny('http://localmock/user/logout').reply(config => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, {
            code: 20000,
            message: 'successed'
          }])
        }, 1000)
      })
    })
  }
}
