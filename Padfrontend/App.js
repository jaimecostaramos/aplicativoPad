import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreens';
import CadastroFuncionarioScreen from './screens/CadastroFuncionarioScreen';
import DashboardScreen from './screens/DashboardScreen';  // Importando a tela de Dashboard

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="CadastroFuncionario" component={CadastroFuncionarioScreen} options={{ title: 'Cadastro de Funcionário' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
