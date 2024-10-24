import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const DashboardScreen = () => {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');
  const [telefoneEmergencia, setTelefoneEmergencia] = useState('');
  const [foto, setFoto] = useState(null);

  // Função para pedir permissão de acesso à galeria
  const pedirPermissao = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de permissão para acessar suas fotos!',
        [{ text: 'OK' }]
      );
      return false;  // Retorna falso se a permissão não for concedida
    }
    return true;  // Retorna verdadeiro se a permissão for concedida
  };

  // Pede permissão quando o componente carrega
  useEffect(() => {
    pedirPermissao();
  }, []);

  // Função para escolher uma foto da galeria
  const escolherFoto = async () => {
    const permissaoConcedida = await pedirPermissao();
    if (!permissaoConcedida) return;  // Verifica se a permissão foi concedida

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // Logando o result completo para verificar sua estrutura
      console.log('Resultado do ImagePicker:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setFoto(selectedImage);  // Define a imagem selecionada com o URI correto
        Alert.alert('Sucesso', 'Imagem carregada com sucesso!');
        console.log('Imagem selecionada:', selectedImage.uri);  // Logando o URI para depuração
      } else {
        console.log('Seleção de imagem cancelada');
        Alert.alert('Aviso', 'Seleção de imagem cancelada.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao acessar a galeria');
      console.error('Erro ao selecionar imagem:', error);
    }
  };

  // Função para enviar o formulário para o backend
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

    // Verifica se a imagem foi selecionada e tem um URI válido
    if (foto && foto.uri) {
      const localUri = foto.uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const filetype = match ? `image/${match[1]}` : `image`;

      formData.append('foto', {
        uri: localUri,
        name: filename,
        type: filetype,
      });

      console.log('Imagem anexada ao FormData:', {
        uri: localUri,
        name: filename,
        type: filetype,
      });
    } else {
      console.log('Nenhuma foto foi selecionada ou a foto não tem um URI válido');
    }

    try {
      const response = await axios.post('http://192.168.1.120:3000/pacientes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!');
        // Limpar os campos após o cadastro
        setNome('');
        setDataNascimento('');
        setSexo('');
        setAltura('');
        setPeso('');
        setEndereco('');
        setTelefoneContato('');
        setTelefoneEmergencia('');
        setFoto(null);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar paciente');
      console.error('Erro ao cadastrar paciente:', error.response ? error.response.data : error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Paciente</Text>

      {/* Campos de texto do formulário */}
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Data de Nascimento (AAAA-MM-DD)" value={dataNascimento} onChangeText={setDataNascimento} />
      <TextInput style={styles.input} placeholder="Sexo (MASCULINO ou FEMININO)" value={sexo} onChangeText={setSexo} />
      <TextInput style={styles.input} placeholder="Altura (em metros)" value={altura} onChangeText={setAltura} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Peso (em kg)" value={peso} onChangeText={setPeso} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
      <TextInput style={styles.input} placeholder="Telefone de Contato" value={telefoneContato} onChangeText={setTelefoneContato} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Telefone de Emergência" value={telefoneEmergencia} onChangeText={setTelefoneEmergencia} keyboardType="phone-pad" />

      {/* Botão para escolher foto */}
      <Button title="Escolher Foto" onPress={escolherFoto} />
      {/* Exibe uma miniatura da imagem após a seleção */}
      {foto && foto.uri && <Image source={{ uri: foto.uri }} style={styles.image} />}

      {/* Botão para cadastrar */}
      <View style={styles.buttonContainer}>
        <Button title="Cadastrar Paciente" onPress={handleCadastro} />
      </View>
    </ScrollView>
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
    width: 200,
    height: 200,
    resizeMode: 'contain',  // Mantém a proporção da imagem
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,  // Adiciona espaço acima do botão para que ele não desapareça
  }
});

export default DashboardScreen;
