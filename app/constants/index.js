export default Constants =  {
  ServiceUuid: "e081fec1-f757-4449-b9c9-bfa83133f7fc",
  CharacteristicUuid: "e081fec1-f757-4449-b9c9-bfa83133f7fc",
  WirelessServiceResponse: {
    WirelessServiceResponseSuccess: 0,
    WirelessServiceResponseInvalidCommand: 1,
    WirelessServiceResponseInvalidParameters: 2,
    WirelessServiceResponseNetworkManagerNotAvailabl: 3,
    WirelessServiceResponseWirelessNotAvailable: 4,
    WirelessServiceResponseWirelessNotEnabled: 5,
    WirelessServiceResponseNetworkingNotEnabled: 6,
    WirelessServiceResponseUnknownError: 7
  },
  WirelessServiceCommand: {
    WirelessServiceCommandInvalid: -1,
    WirelessServiceCommandGetNetworks: 0,
    WirelessServiceCommandConnect: 1,
    WirelessServiceCommandConnectHidden: 2,
    WirelessServiceCommandDisconnect: 3,
    WirelessServiceCommandScan: 4,
    WirelessServiceCommandGetCurrentConnection: 5
  }
}