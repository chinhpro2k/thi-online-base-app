import {dataDevices} from "../../ultil/data";
import {Button, Card, Col, Divider, Popconfirm, Row, Tag} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined} from "@ant-design/icons";
import {LOGO_DEVICES} from "../../ultil/consts";

const Devices = () => {
    const { Meta } = Card;
  return(
      <>
          <Row gutter={[24, 16]} justify="center">
              {dataDevices.map((el) => (
                  <Col
                      xxl={{ span: 6 }}
                      xl={{ span: 8 }}
                      lg={{ span: 12 }}
                      md={{ span: 12 }}
                      sm={{ span: 22 }}
                      key={el.id}
                  >
                      <Popconfirm
                          title="Bạn có chắc chắn muốn xóa thiết bị"
                          okText="Có"
                          cancelText="Không"
                          // onConfirm={() => onDeleteDevice(el)}
                      >
                          <Button
                              style={{ position: 'absolute', top: '-14px', right: '-7px', zIndex: 4 }}
                              shape="circle"
                              size="large"
                              icon={<DeleteOutlined />}
                          ></Button>
                      </Popconfirm>
                      <Popconfirm
                          title="Bạn có muốn khởi động lại thiết bị"
                          okText="Có"
                          cancelText="Không"
                          // onConfirm={() => onReloadDevice(el)}
                      >
                          <Button
                              style={{
                                  position: 'absolute',
                                  top: '30px',
                                  right: '-7px',
                                  zIndex: 4,
                                  color: 'white',
                                  backgroundColor: '#1890ff',
                              }}
                              shape="circle"
                              size="large"
                              icon={<ReloadOutlined />}
                              title="Khởi động lại thiết bị"
                          ></Button>
                      </Popconfirm>
                      <Card
                          hoverable
                          style={{
                              overflow: 'hidden',
                              borderRadius: '10px',
                              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                          }}
                          cover={
                              <div
                                  onClick={() => {
                                      // history.push(`/device/${el?.id ?? ''}`);
                                      // setThongTinDevice(el);
                                  }}
                                  style={{
                                      width: '100%',
                                      height: 300,
                                      border: '1px solid rgba(1,1,1,0.1)',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                  }}
                              >
                                  <img alt="example" src={'https://kinhnghiemchungkhoan.com/wp-content/uploads/2021/10/internet-of-things-1.jpg'} style={{ height: '70%' }} />
                              </div>
                          }
                          actions={[
                              <>
                                  <Row gutter={[8, 8]} justify="center" align="middle">
                                      {el.agentInstalled ? (
                                          <Col xxl={11} sm={23}>
                                              <Button
                                                  // block
                                                  type="primary"
                                                  icon={<DeleteOutlined />}
                                                  // onClick={() => onUninstallDevice(el.id)}
                                                  style={{
                                                      width: '100%',
                                                  }}
                                              >
                                                  Gỡ tác tử
                                              </Button>
                                          </Col>
                                      ) : (
                                          <Col xxl={11} sm={23}>
                                              <Button
                                                  block
                                                  icon={<PlusOutlined />}
                                                  style={{
                                                      background: '#1890ff',
                                                      color: 'white',
                                                      width: '100%',
                                                  }}
                                                  // onClick={() => onInstallDevice(el)}
                                              >
                                                  Cài tác tử
                                              </Button>
                                          </Col>
                                      )}
                                      <Col xxl={11} sm={23}>
                                          <Button
                                              block
                                              type="primary"
                                              style={{
                                                  backgroundColor: 'white',
                                                  color: 'black',
                                                  width: '100%',
                                              }}
                                              icon={<EditOutlined />}
                                              // onClick={() => showModalChinhSua(el)}
                                          >
                                              Sửa thông tin
                                          </Button>
                                      </Col>
                                  </Row>
                                  ,
                              </>,
                          ]}
                      >
                          <Meta
                              onClick={() => {
                                  // history.push(`/device/${el?.id ?? ''}`);
                              }}
                              title={`Thiết bị: ${el.name}`}
                              description={
                                  <div>
                                      <div>
                                          <b>Username:</b> {el.username}
                                      </div>
                                      <div>
                                          <b>IP:</b> {`${el.ip}:${el.port}`}
                                          <Divider type="vertical" style={{ width: '3px' }} />
                                          <b>Protocol:</b> {el.protocol}
                                      </div>
                                      <div>
                                          <b>Trạng thái: </b>
                                          <Tag color={el.agentInstalled ? '#87d068' : '#f50'}>
                                              {el.agentInstalled ? 'Đang giám sát' : 'Chưa giám sát'}
                                          </Tag>
                                      </div>
                                      <div>
                                          <b>Theo dõi SystemCall: </b>
                                          <Tag color={el.tracing_syscall !== '' ? '#87d068' : '#f50'}>
                                              {el.tracing_syscall !== ''
                                                  ? `Đang theo dõi với pid: ${el?.tracing_syscall ?? ''}`
                                                  : 'Chưa theo dõi'}
                                          </Tag>
                                      </div>
                                      <div>
                                          <b>Địa chỉ Mac: </b>
                                          <Tag color="#87d068">{el.mac_addr}</Tag>
                                      </div>
                                      <div>
                                          <b>Theo dõi luồng mạng: </b>
                                          <Tag color="#f50">{!el.tracing_network ? "Chưa theo dõi" : 'Đang theo dõi'}</Tag>
                                      </div>
                                      <div>
                                          <b>Loại thiết bị: </b>
                                          <Tag color="#87d068">{el.hwagent ? "Hardware Agent" : 'Software Agent'}</Tag>
                                      </div>
                                  </div>
                              }
                          />
                      </Card>
                  </Col>
              ))}
          </Row>
      </>
  )
}
export default Devices;