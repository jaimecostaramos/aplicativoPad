import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A50F5',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurEffect: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  ellipse: {
    position: 'absolute',
    top: -height * 0.3,
    width: 566,
    height: 566,
    borderRadius: 283,
    backgroundColor: '#F8F8F8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },
  logoContainer: {
    position: 'absolute',
    top: height * 0.15 - 30, // Subindo 30px
  },
  logo: {
    width: 236,
    height: 133,
    resizeMode: 'contain',
  },
  welcomeContainer: {
    position: 'absolute',
    top: height * 0.15 + 283 + 10 - 30, // Subindo 30px
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 29,
    color: '#91F2C5',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  padText: {
    fontSize: 29,
    color: '#F3F3F3',
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  saudeText: {
    fontSize: 29,
    color: '#F3F3F3',
    fontWeight: '400',
    fontFamily: 'Roboto',
  },
  formContainer: {
    position: 'absolute',
    bottom: 50 + 30, // Subindo 30px
    width: '90%', // Limita a largura do formulário para 90% da tela
    maxWidth: 366, // Máximo de 366px de largura
  },
  formContentBlurred: {
    zIndex: 2,
  },
  inputContainer: {
    width: '100%', // Garante que o campo ocupe toda a largura disponível
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderColor: '#F3F3F3',
    borderWidth: 1,
    backgroundColor: 'rgba(238, 238, 238, 0.05)',
    marginBottom: 5,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: '#EBEBEB',
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  inputDescription: {
    width: '100%', // Adapta a largura para a mesma do input
    fontSize: 9,
    color: '#E0E0E0',
    fontWeight: '500',
    fontFamily: 'Roboto',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 12, // Ajuste para o border-radius de 12px
    overflow: 'hidden',
    alignSelf: 'stretch', // Alinha o botão para esticar horizontalmente
  },
  button: {
    backgroundColor: '#91F2C5', // Cor de fundo do botão conforme especificado
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  buttonText: {
    color: '#0A0A0A', // Cor do texto do botão
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
});
