// In App.js in a new project

import 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import React from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/FirebaseConfig';

import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './src/pages/Login';
import List from './src/pages/List';
import Details from './src/pages/Details';
import Home from './src/pages/Home';
import SignUp from './src/pages/SignUp';
import RecordProvider from './src/context/context';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import StackMain from './src/components/StackMain';
import RessetPassword from './src/pages/RessetPassword';





const Stack = createNativeStackNavigator();


const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1F22' }}>
      <ActivityIndicator style={{ transform: [{ scaleX: 3 }, { scaleY: 3 }] }} color='#2F5A73' />
    </View>
  );
};



function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true); // Nuevo estado de carga

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false); // Marcar como no cargando una vez que se determine el estado de autenticación
    });

    return () => {
      unsubscribe();
    };

  }, [])
  return (
    <>
      <StatusBar style="light" />
      <RecordProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login'>
            {loading ? (
              // Muestra un indicador de carga mientras se verifica el estado
              <>
                <Stack.Screen name='Loading' component={LoadingScreen} options={{ headerShown: false }} />


              </>



            ) : user ? (
              <Stack.Screen name='Main' component={StackMain} options={{ headerShown: false }} />

            ) : (
              <>
                <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
                <Stack.Screen name='RessetPassword' component={RessetPassword}
                  options={{
                    headerStyle: {
                      backgroundColor: '#1E1F22',
                    },
                    title: 'Cambiar contraseña',
                    headerTintColor: 'white'
                  }}
                />
                <Stack.Screen name='SignUp' component={SignUp} options={{
                  headerStyle: {
                    backgroundColor: '#1E1F22',
                  },
                  title: 'Registrarse',
                  headerTintColor: 'white'
                }} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </RecordProvider>
    </>
  );
}
const styles = StyleSheet.create({
  togglebutton: {
    backgroundColor: 'red',

  }
})
export default App;