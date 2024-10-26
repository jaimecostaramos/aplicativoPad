import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { loginStyles as styles } from '../styles/LoginStyles';
import logo from '../assets/images/LogoPad.png';

const LoginScreens = ({ navigation }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsFocused(false);
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.120:3000/login', {
        login,
        senha,
      });

      if (response.status === 200) {
        const { isAdmin } = response.data;
        if (isAdmin) {
          navigation.navigate('CadastroFuncionario');
        } else {
          navigation.navigate('Dashboard');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Erro', 'Login ou senha incorretos');
      } else {
        Alert.alert('Erro', 'Erro ao conectar ao servidor');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
        setIsFocused(false);
      }}>
        <View style={styles.inner}>
          {isFocused && (
            <BlurView intensity={100} style={styles.blurEffect} />
          )}
          <View style={styles.ellipse} />
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              BEM VINDO À <Text style={styles.padText}>PAD</Text> <Text style={styles.saudeText}>SAÚDE</Text>
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={isFocused ? styles.formContentBlurred : null}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Login"
                  placeholderTextColor="#EBEBEB"
                  value={login}
                  onChangeText={setLogin}
                  onFocus={() => setIsFocused(true)}
                />
              </View>
              <Text style={styles.inputDescription}>Digite aqui o seu Login!</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#EBEBEB"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                  onFocus={() => setIsFocused(true)}
                />
              </View>
              <Text style={styles.inputDescription}>Digite aqui a sua senha!</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreens;
