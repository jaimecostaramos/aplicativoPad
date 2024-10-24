import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';

const CadastroPacienteScreen = () => {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');
  const [telefoneEmergencia, setTelefoneEmergencia] = useState('');
  const [foto, setFoto] = useState(null);

  // Função para escolher uma foto da galeria ou tirar uma foto
  const escolherFoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Usuário cancelou o upload');
      } else if (response.error) {
        console.error('Erro ao escolher foto: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setFoto(source);  // Define a imagem escolhida
      }
    });
  };

  const handleCadastro = async () => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('dataNascimento', dataNascimento);
    formData.append('sexo', sexo);
    formData.append('altura', altura);
    formData.append('peso', peso);
    formData.append('endereco', endereco);
    formData.append('telefoneContato', telefoneContato);
    formData.append('telefoneEmergencia', telefoneEmergencia);

    if (foto) {
      const filename = foto.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const filetype = match ? `image/${match[1]}` : `image`;

      formData.append('foto', {
        uri: foto.uri,
        name: filename,
        type: filetype
      });
    }

    try {
      const response = await axios.post('http://192.168.1.120:3000/pacientes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar paciente');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Paciente</Text>

      {/* Campo de nome */}
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />

      {/* Escolher foto */}
      <Button title="Escolher Foto" onPress={escolherFoto} />
      {foto && <Image source={{ uri: foto.uri }} style={styles.image} />}

      {/* Outros campos... */}
      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

export default CadastroPacienteScreen;
