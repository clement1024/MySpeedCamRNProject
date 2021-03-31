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

  login() {
    this.props.navigation.navigate('Dashboard');
  }

  render() {
    
    return (
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logoImage} />

        <View style={styles.loginBox}>
          <TextInput style={styles.input} placeholder='Username' onChangeText={(t) => this.setState({username: t})} value={this.state.username} />
          <View style={styles.password}>
            <TextInput style={styles.inlineInput} placeholder='Password' onChangeText={(t) => this.setState({password: t})} value={this.state.password} secureTextEntry={this.state.showPassword} />
            <TouchableOpacity onPress={() => this.setState({showPassword: !this.state.showPassword})}>
              <Text style={{color: this.state.showPassword ? '#efefef' : 'gray', paddingTop: 6, paddingRight: 6}}>👁</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop: 10}}>
            <Button label='Login' onClick={this.login.bind(this)} />
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