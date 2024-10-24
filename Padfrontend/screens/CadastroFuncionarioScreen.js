import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const CadastroFuncionarioScreen = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    try {
      const response = await axios.post('http://192.168.1.120:3000/funcionarios', {
        nome,
        email,
        login,
        senha,
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso!');
        setNome('');
        setEmail('');
        setLogin('');
        setSenha('');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar funcionário');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Funcionário</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
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
      <Button title="Cadastrar" onPress={handleCadastro} />
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

export default CadastroFuncionarioScreen;
