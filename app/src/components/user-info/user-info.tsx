import { withStore } from '@/core/store'
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  message,
  Modal,
  Popconfirm,
  Row,
  Typography,
} from 'antd'
import * as React from 'react'
import { logoutKeyCloack } from '@/src/until/auth'
import { DeThi } from '@/src/components/app-thionline/typing'
const { Title } = Typography

interface UserInfoProps extends Partial<StoreProps> {
  user: StoreStates['user']
  trangThaiThi?: StoreStates['trangThaiThi']
  navigate: (to: string) => void
}

interface UserInfoState {
  loading: boolean
}

@withStore(['trangThaiThi'])
export class UserInfo extends React.Component<UserInfoProps, UserInfoState> {
  state: UserInfoState = {
    loading: false,
  }
  componentDidMount() {
    console.log('user2', this.props.user)
  }

  onLoginSuccessFul = (userInfo: UserInfoNS.RootObject): void => {
    this.props.dispatch?.({
      type: 'ACTION_SAVE_USER',
      data: userInfo.user,
    })
  }

  onLogout = (): void => {
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
  handleExit = () => {
    if (this.props.trangThaiThi) {
      Modal.confirm({
        className: 'modal-xac-nhan-thi',
        title: 'Cảnh báo',
        content: 'Bạn có chắc chắc muốn thoát? Nếu đăng xuất toàn bộ bài làm của bạn sẽ bị mất.',
        okText: 'OK',
        cancelText: 'Hủy',
        onOk: this.setExit,
      })
    }
  }
  setExit = () => {
    if (this.props.trangThaiThi) {
      this.props.dispatch?.({
        type: 'ACTION_SAVE_TRANGTHAITHI',
        data: {
          ...this.props.trangThaiThi,
          dangThi: false,
        },
      })
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
      'https://dhs-demo.aisenote.com/auth/realms/master/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2Fslink.ptit.edu.vn%2Fuser%2Flogin'
    )
    this.props.navigate('/login')
  }

  render(): JSX.Element {
    const { user } = this.props

    return (
      <Row justify="center" align="middle">
        <Col xs={24}>
          <Card bordered>
            <div>
              <Row justify="center" align="middle">
                <Col>
                  <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <Avatar size={128} src={undefined} />
                  </div>
                  <Title level={3}>{user?.hoTen}</Title>
                  <p
                    style={{
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '18px',
                    }}
                  >
                    {user?.maDinhDanh}
                  </p>
                </Col>
              </Row>
              {/*<Descriptions*/}
              {/*  column={1}*/}
              {/*  title="Thông tin sinh viên"*/}
              {/*  bordered={false}*/}
              {/*>*/}
              {/*  /!*<Descriptions.Item label="Mã khóa">*!/*/}
              {/*  /!*  {user?.maKhoa}*!/*/}
              {/*  /!*</Descriptions.Item>*!/*/}
              {/*  <Descriptions.Item label="Mã sinh viên">*/}
              {/*    {user?.maDinhDanh}*/}
              {/*  </Descriptions.Item>*/}
              {/*</Descriptions>*/}
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Popconfirm
                title="Bạn có muốn đăng xuất"
                onConfirm={() => this.onLogout()}
                okText="Có"
                cancelText="Không"
              >
                <Button type="primary" danger>
                  Đăng xuất
                </Button>
              </Popconfirm>
            </div>
            {/*{this.props.trangThaiThi?.dangThi && (*/}
            {/*  <Button type="primary" danger onClick={() => this.handleExit()}>*/}
            {/*    Thoát*/}
            {/*  </Button>*/}
            {/*)}*/}
          </Card>
        </Col>
      </Row>
    )
  }
}
