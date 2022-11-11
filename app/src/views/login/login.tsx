import * as React from 'react'
import { AppLogin } from '@/src/components/app-login'
import User = UserInfoNS.User
import humps from 'humps'
import { withStore } from '@/core/store'
import { useNavigate } from 'react-router-dom'
interface LoginProps extends PageProps, StoreProps {}
@withStore(['user'])
class Login extends React.Component<LoginProps, any> {
  render() {
    const onLoginSuccessFul = (userInfo: UserInfoNS.RootObject): void => {
      const userInfoCamel = humps.camelizeKeys(userInfo.user)
      this.props?.dispatch?.({
        type: 'ACTION_SAVE_USER',
        data: userInfoCamel as User,
      })
      this.props?.navigate('/exam')
    }
    return (
      <>
        <AppLogin onDone={onLoginSuccessFul} />
      </>
    )
  }
}
export default Login
