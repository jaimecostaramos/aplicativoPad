import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { createRef } from 'react';

import LoginScreen from './screens/LoginScreens';
import CadastroFuncionarioScreen from './screens/CadastroFuncionarioScreen';
import DashboardScreen from './screens/DashboardScreen';

const Stack = createNativeStackNavigator();
export const navigationRef = createRef();

// Inicializa SplashScreen para manter até o aplicativo estar pronto
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Callback para esconder a splash screen assim que o app estiver pronto
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  return (
    <NavigationContainer ref={navigationRef} onReady={onLayoutRootView}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CadastroFuncionario"
          component={CadastroFuncionarioScreen}
          options={{ title: 'Cadastro de Funcionário' }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
