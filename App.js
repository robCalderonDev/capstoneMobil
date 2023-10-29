// In App.js in a new project

import 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import React from 'react';
import { View, Text, Button } from 'react-native';
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
import Sign from './src/pages/Sign';


const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();



const StackMain = () => {
  //Esto es lo que va a ir dentro del main
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home" screenOptions={{ drawerPosition: "right", headerLeft: false, headerRight: () => <DrawerToggleButton /> }} >
        <Drawer.Screen name="Home" component={Home} />

        <Drawer.Screen name="Details" component={Details} />
      </Drawer.Navigator>
    </NavigationContainer >
  )
}


function App() {
  const [user, setUser] = useState(null)


  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {

      setUser(user);
    })
  }, [])
  return (
    <>
      <StatusBar style="light" />
      <RecordProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login'>
            {user ? (
              <Stack.Screen name='Main' component={StackMain} options={{ headerShown: false }} />

            ) : (<>
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name='SignUp' component={SignUp} options={{
                // Oculta el encabezado
                headerStyle: {
                  backgroundColor: '#1E1F22',
                  // Cambia el color de fondo de la pantalla
                }, headerTintColor: 'white'
              }} />

            </>)}

          </Stack.Navigator>
        </NavigationContainer>
      </RecordProvider>
    </>

  );
}

export default App;