import firestore from '@react-native-firebase/firestore';


const logInfo = (tag, desc) => {
  firestore()
  .collection('logs')
  .add({
    tag: tag,
    desc: desc,
    dt: firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log('Log [' + tag + ']' + ' - ' + desc);
  });
}

export default Logger = {
  logInfo
}