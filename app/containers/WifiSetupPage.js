import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import Button from '../components/Button';
import Constants from '../constants';
import {decode as atob, encode as btoa} from 'base-64';
import analytics from '@react-native-firebase/analytics';
import Logger from '../helper/Logger';

const deviceDemo = {
  id: "demo-123",
  name: "demo-123",
  connect: () => {
    const promise = (resolve, reject) => {
      resolve(deviceDemo);
    }
    return new Promise(promise);
  },
  discoverAllServicesAndCharacteristics: () => deviceDemo,
  readCharacteristicForService: (serviceUuid, chUuid, transactionId="") => {
    const promise = (resolve, reject) => {
      console.log("readCharacteristicForService >>")
      resolve({
        value: btoa(JSON.stringify({
          r: Constants.WirelessServiceResponse.WirelessServiceResponseSuccess,
          c: Constants.WirelessServiceCommand.WirelessServiceCommandConnect
        }))
      });
    }
    return new Promise(promise);    
  },
  writeCharacteristicWithResponseForService: (serviceUuid, chUuid, transactionId="") => {
    return transactionId;
  }
}

class WifiSetupPage extends React.Component {

  constructor() {
    super();
    this.manager = new BleManager();
    console.log("wifi setup page init");
    this.state = {
      devices: [],
      connected: {},
      modalVisible: false,
      selectedDevice: null,
      wifiId: "",
      wifiPassword: ""
    }
    this.connectToDevice = this.connectToDevice.bind(this);
  }

  componentDidMount() {
    const subscription = this.manager.onStateChange(async (state) => {
      Logger.logInfo("wsp_ble_manager_state_change", state);
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        subscription.remove();
      } 
    }, true);
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, async (error, device) => {
      Logger.logInfo("wsp_ble_manager_device_scan", JSON.stringify({error, device}));

      if (error) {
          return
      }
      
      if (device) {
        this.setState({
          devices: [...this.state.devices, device],
          connected: {...this.state.connected, [device.id]: -3}
        });
        Logger.logInfo("wsp_ble_manager_device_detected", JSON.stringify({state: this.state}));
      }
    });
  }

  async connectToDevice(device) {
    Logger.logInfo("wsp_ble_connect_device", JSON.stringify(device));
    
    this.setState({
      modalVisible: true,
      selectedDevice: device
    })
  }

  onConnectToDevice(device) {
    if (this.state.wifiId === "" || this.state.wifiPassword === "") {
      return;
    }
    Logger.logInfo("wsp_ble_on_connect_device", JSON.stringify(device));
    this.setState({
      modalVisible: false,
      selectedDevice: null
    })
    device.connect()
      .then((device) => {
          return device.discoverAllServicesAndCharacteristics()
      })
      .then((device) => {
        Logger.logInfo("wsp_ble_prepare_request", JSON.stringify(device));
        const request = {
          c: Constants.WirelessServiceCommand.WirelessServiceCommandConnect,
          p: {
            e: this.state.wifiId,
            p: this.state.wifiPassword
          }
        }
        Logger.logInfo("wsp_ble_prepare_streaming", JSON.stringify(request));
        this.streamData(device, Constants.CharacteristicUuid, request)
        this.processPacket(device, Constants.CharacteristicUuid)
      })
      .catch((error) => {
          console.log(error)
      });
  }

  streamData(device, chUuid, request) {
    const requestBase64 = btoa(JSON.stringify(request));
    Logger.logInfo("wsp_ble_request_base64", JSON.stringify(requestBase64));
    device.writeCharacteristicWithResponseForService(Constants.ServiceUuid, chUuid, requestBase64, "0")
  }

  processPacket(device, chUuid) {    
    Logger.logInfo("wsp_ble_process_packet", JSON.stringify({device, chUuid}));
    device.readCharacteristicForService(Constants.ServiceUuid, chUuid).then((characteristic) => {
      Logger.logInfo("wsp_ble_read_packet", JSON.stringify({characteristic}));
      if (characteristic.value) {
        const value = atob(characteristic.value);
        Logger.logInfo("wsp_ble_read_value", JSON.stringify({value}));
        const response = JSON.parse(value);
        Logger.logInfo("wsp_ble_read_response", JSON.stringify({response}));
        if (response.r === Constants.WirelessServiceResponse.WirelessServiceResponseSuccess) {
          if (response.c === Constants.WirelessServiceCommand.WirelessServiceCommandConnect) {
            Logger.logInfo("wsp_ble_device_connected_success", JSON.stringify({response}));
            this.setState({
              connected: {
                ...this.state.connected,
                [device.id]: true
              }
            })
            return
          }
        }
        if (this.state.connected[device.id] < 0) {
          this.setState({
            connected: {
              ...this.state.connected,
              [device.id]: this.state.connected[device.id] + 1
            }
          })
          Logger.logInfo("wsp_ble_device_retry_read", JSON.stringify({state: this.state}));
          this.processPacket(device, chUuid);
        }
      }
    })
  }

  render() {
    return (
      <View style={styles.deviceList}>
        <View style={styles.deviceListHeader}>
          <Text style={styles.title}>Bluetooth Device List</Text>
        </View>
        {this.state.devices.map((device) => (
          <View key={device.id} style={styles.deviceRow}>
            <View key={device.id} style={styles.deviceInfo}>
              <Text style={styles.deviceInfoLabel}>Device Name: {device.name}</Text>
              <Text style={styles.deviceInfoLabel}>Device ID: {device.id}</Text>
            </View>
            <Button label="Connect" onClick={async () => await this.connectToDevice(device)}/>
          </View>
        ))}

        <Modal animationType = {"slide"} transparent = {true} 
          visible = {this.state.modalVisible}
          onRequestClose = {() => { console.log("Modal has been closed.") } }>
          
          <View style = {styles.modalContainer}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Input wifi credentials</Text>
              </View>
              <View style={styles.modalMain}>
                <TextInput style={styles.modalInput} placeholder="Wifi ID"
                  value={this.state.wifiId}
                  onChangeText={(text) => this.setState({wifiId: text})} />
                <TextInput style={styles.modalInput} placeholder="Wifi Password" secureTextEntry={true}
                  value={this.state.wifiPassword}
                  onChangeText={(text) => this.setState({wifiPassword: text})} />
              </View>
              <View style={styles.modalButtons}>
                <Button label="Connect" onClick={() => this.onConnectToDevice(this.state.selectedDevice)} />
                <Button label="Close" onClick={() => this.setState({modalVisible: !this.state.modalVisible})} />
              </View>
            </View>
            
          </View>
      </Modal>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  deviceList: {
    flex: 1,
    flexDirection: 'column',
  },
  deviceListHeader: {
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'left',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'black',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  deviceInfo: {
    flexDirection: 'column',
  },
  deviceInfoLabel: {
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  modal: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#efefef',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'gray'

  },
  modalHeader: {

  },
  modalMain: {

  },
  modalInput: {
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 3,
    backgroundColor: 'white'
  },
  modalTitle: {
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  text: {
    color: '#3f2949',
    marginTop: 10
  }
});

export default WifiSetupPage;