import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CadastroPacienteScreen from './CadastroPacienteScreen';
import InformacoesMedicasScreen from './InformacoesMedicasScreen';
import HistoricoResumidoScreen from './HistoricoResumidoScreen';

const Tab = createMaterialTopTabNavigator();

const DashboardScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14 },
        tabBarStyle: { backgroundColor: '#f5f5f5' },
        tabBarIndicatorStyle: { backgroundColor: '#2196F3' },
      }}
    >
      <Tab.Screen name="Cadastro de Paciente" component={CadastroPacienteScreen} />
      <Tab.Screen name="Informações Médicas" component={InformacoesMedicasScreen} />
      <Tab.Screen name="Histórico Resumido" component={HistoricoResumidoScreen} />
    </Tab.Navigator>
  );
};

export default DashboardScreen;
