import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      // Fazendo uma requisição POST para o backend com login e senha
      const response = await axios.post('http://192.168.1.120:3000/login', {  // Substitua pelo IP correto do backend
        login,
        senha
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Login"
        value={login}
        onChangeText={setLogin}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;
