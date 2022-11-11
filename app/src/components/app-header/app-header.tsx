import React from 'react'
import { withStore } from '@/core/store'
import { Dropdown, MenuProps, Modal, Typography } from 'antd'
import './app-header.less'
import { Link } from 'react-router-dom'
import { logoutKeyCloack } from '@/src/until/auth'
interface HeaderProps extends Partial<StoreProps> {
  user: StoreStates['user']
  trangThaiThi?: StoreStates['trangThaiThi']
  navigate: (to: string) => void
}
const { Title } = Typography
@withStore(['trangThaiThi'])
export default class AppHeader extends React.Component<HeaderProps, any> {
  componentDidMount() {
    console.log('user-info header', this.props.user)
  }
  handleExit = () => {
    if (this.props.trangThaiThi?.dangThi) {
      Modal.confirm({
        className: 'modal-xac-nhan-thi',
        title: 'Cảnh báo',
        content:
          'Bạn có chắc chắc muốn đăng xuất khỏi hệ thống? Nếu đăng xuất toàn bộ bài làm của bạn sẽ bị mất.',
        okText: 'OK',
        cancelText: 'Hủy',
        onOk: this.handleLogout,
      })
    } else {
      this.handleLogout()
    }
  }
  handleLogout = () => {
    setTimeout(() => {
      this.props.dispatch?.({
        type: 'ACTION_SAVE_USER',
        data: undefined,
      })

      this.props.dispatch?.({
        type: 'ACTION_SAVE_TRANGTHAITHI',
        data: undefined,
      })

      this.props.dispatch?.({
        type: 'ACTION_SAVE_LOGS',
        data: [],
      })
      $tools.removeAccessToken()
    }, 3000)
    logoutKeyCloack(
      'https://slinkid.ptit.edu.vn/auth/realms/master/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2Fslink.ptit.edu.vn%2Fuser%2Flogin'
    )
    this.props.navigate('/login')
  }
  render() {
    const { user } = this.props
    const items: MenuProps['items'] = [
      {
        label: <Link to="https://www.antgroup.com">Trang cá nhân</Link>,
        key: '0',
      },
      {
        label: <p onClick={() => this.handleExit()}>Đăng xuất</p>,
        key: '3',
      },
    ]
    return (
      <div className="header">
        <div className="logo" style={{ display: 'flex' }}>
          <img
            style={{ width: '30px', marginRight: '16px' }}
            src={'assets/tray-icon/logo.png'}
            alt={'logo-ptit'}
          />
          <h1>THI ONLINE</h1>
        </div>
        <div className="info">
          <Dropdown menu={{ items }} trigger={['click']}>
            <div className="avatar" onClick={(e) => e.preventDefault()}>
              {user?.hoTen?.[0]}
            </div>
          </Dropdown>

          <h3>
            {user?.hoTen} - {user?.maDinhDanh}
          </h3>
        </div>
      </div>
    )
  }
}
