// In App.js in a new project

import { react, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import List from './src/pages/List';
import { User, onAuthStateChanged } from 'firebase/auth'
import { FIREBASE_AUTH } from './src/FirebaseConfig';
import Details from './src/pages/Details';
import Main from './src/components/Main';
import SignUp from './src/pages/SignUp';
import RecordProvider from './src/context/context';




const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();


const InsideMain = () => {
  //Esto es lo que va a ir dentro del main
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name='Main' component={Main} />
      <InsideStack.Screen name='details' component={Details} />
    </InsideStack.Navigator>
  )
}

<Stack.Screen name="SignUp" component={SignUp} />


function App() {
  const [user, setUser] = useState(null)


  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.group('user', user)
      setUser(user);
    })
  }, [])
  return (
    <RecordProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          {user ? (
            <Stack.Screen name='Main' component={InsideMain} options={{ headerShown: false }} />

          ) : (<>
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='SignUp' component={SignUp} />

          </>)}

        </Stack.Navigator>
      </NavigationContainer>
    </RecordProvider>
  );
}

export default App;