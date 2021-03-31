import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import Button from '../components/Button';

const logoImage = require("../assets/logo.png");

class LoginPage extends React.Component {
  state = {
    username: "",
    password: "",
    showPassword: false
  };

  connectCamera() {
    this.props.navigation.navigate('Setup');
  }

  render() {
    
    return (
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logoImage} />

        <View style={styles.loginBox}>
        

          <View style={{marginTop: 10}}>
            <Button label='Connect Camera' onClick={this.connectCamera.bind(this)} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logoImage: {
    width: 200,
    height: 120,
    resizeMode: 'contain'
  },
  loginBox: {

  },
  input: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 5,
    width: 200
  },
  password: {
    flexDirection: 'row',    
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    marginVertical: 5,
    width: 200
  },
  inlineInput: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
  }
});

export default LoginPage;