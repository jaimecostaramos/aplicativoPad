import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { TextInputMask } from 'react-native-masked-text';
import { Picker } from '@react-native-picker/picker';
import { cadastroPacienteStyles as styles } from '../styles/CadastroPacienteStyles'; // Importação dos estilos

const CadastroPacienteScreen = () => {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [imc, setImc] = useState(null);
  const [classificacaoImc, setClassificacaoImc] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');
  const [telefoneEmergencia, setTelefoneEmergencia] = useState('');
  const [foto, setFoto] = useState(null);

  const calcularImc = () => {
    const alturaMetros = parseFloat(altura);
    const pesoKg = parseFloat(peso);

    if (alturaMetros && pesoKg) {
      const imcCalculado = pesoKg / (alturaMetros * alturaMetros);
      setImc(imcCalculado.toFixed(1));
      definirClassificacao(imcCalculado);
    } else {
      setImc(null);
      setClassificacaoImc('');
    }
  };

  const definirClassificacao = (imcValor) => {
    if (imcValor < 18.5) {
      setClassificacaoImc('Baixo Peso');
    } else if (imcValor >= 18.5 && imcValor <= 24.9) {
      setClassificacaoImc('Peso Normal');
    } else if (imcValor >= 25 && imcValor <= 29.9) {
      setClassificacaoImc('Excesso de Peso');
    } else if (imcValor >= 30 && imcValor <= 34.9) {
      setClassificacaoImc('Obesidade Grau I');
    } else if (imcValor >= 35 && imcValor <= 39.9) {
      setClassificacaoImc('Obesidade Grau II');
    } else if (imcValor >= 40) {
      setClassificacaoImc('Obesidade Mórbida');
    }
  };

  useEffect(() => {
    calcularImc();
  }, [peso, altura]);

  const pedirPermissao = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos!', [{ text: 'OK' }]);
      return false;
    }
    return true;
  };

  useEffect(() => {
    pedirPermissao();
  }, []);

  const escolherFoto = async () => {
    const permissaoConcedida = await pedirPermissao();
    if (!permissaoConcedida) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setFoto(selectedImage);
        Alert.alert('Sucesso', 'Imagem carregada com sucesso!');
      } else {
        Alert.alert('Aviso', 'Seleção de imagem cancelada.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao acessar a galeria');
      console.error('Erro ao selecionar imagem:', error);
    }
  };

  const handleCadastro = async () => {
    const dataISO = dataNascimento.split('/').reverse().join('-');

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('dataNascimento', dataISO);
    formData.append('sexo', sexo);
    formData.append('altura', altura);
    formData.append('peso', peso);
    formData.append('imc', imc);
    formData.append('classificacaoImc', classificacaoImc);
    formData.append('endereco', endereco);
    formData.append('telefoneContato', telefoneContato);
    formData.append('telefoneEmergencia', telefoneEmergencia);

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
    }

    try {
      const response = await axios.post('http://192.168.1.120:3000/pacientes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!');
        setNome('');
        setDataNascimento('');
        setSexo('');
        setAltura('');
        setPeso('');
        setImc(null);
        setClassificacaoImc('');
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

      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInputMask
        type={'datetime'}
        options={{
          format: 'DD/MM/YYYY',
        }}
        value={dataNascimento}
        onChangeText={setDataNascimento}
        placeholder="Data de Nascimento (DD/MM/AAAA)"
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sexo}
          style={styles.picker}
          onValueChange={(itemValue) => setSexo(itemValue)}
        >
          <Picker.Item label="Selecione o Sexo" value="" />
          <Picker.Item label="Masculino" value="MASCULINO" />
          <Picker.Item label="Feminino" value="FEMININO" />
        </Picker>
      </View>

      <TextInput style={styles.input} placeholder="Altura (em metros)" value={altura} onChangeText={setAltura} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Peso (em kg)" value={peso} onChangeText={setPeso} keyboardType="numeric" />

      {imc && (
        <View style={styles.imcContainer}>
          <Text style={styles.imcText}>IMC: {imc}</Text>
          <Text style={styles.imcText}>Classificação: {classificacaoImc}</Text>
        </View>
      )}

      <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
      <TextInput style={styles.input} placeholder="Telefone de Contato" value={telefoneContato} onChangeText={setTelefoneContato} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Telefone de Emergência" value={telefoneEmergencia} onChangeText={setTelefoneEmergencia} keyboardType="phone-pad" />

      <Button title="Escolher Foto" onPress={escolherFoto} />
      {foto && foto.uri && <Image source={{ uri: foto.uri }} style={styles.image} />}

      <View style={styles.buttonContainer}>
        <Button title="Cadastrar Paciente" onPress={handleCadastro} />
      </View>
    </ScrollView>
  );
};

export default CadastroPacienteScreen;
