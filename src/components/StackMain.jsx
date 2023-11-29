import 'react-native-gesture-handler';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerToggleButton } from '@react-navigation/drawer';
import Home from "../pages/Home";
import Details from "../pages/Details";
import { useContext } from 'react';
import { RecordContext } from '../context/context';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { View, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashBoard from '../pages/DashBoard';
import { AntDesign } from '@expo/vector-icons';
import MapsPages from '../pages/MapsPages';
const Drawer = createDrawerNavigator();
import { Entypo } from '@expo/vector-icons';



const StackMain = () => {
    //Esto es lo que va a ir dentro del main
    const { dataUserDb, setDataUserDb } = useContext(RecordContext);
    const signOut = () => {
        FIREBASE_AUTH.signOut()
        setDataUserDb('')
        ToastAndroid.show('Ha cerrado su sesion', ToastAndroid.LONG);
    }
    function CustomDrawerContent(props) {
        return (
            <View style={{ flex: 1 }}>
                <DrawerContentScrollView {...props} screenOptions={{}} >
                    <View style={{}}>
                        <DrawerItemList {...props} />

                    </View>

                </DrawerContentScrollView>
                <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#dedede' }}>

                    <TouchableOpacity onPress={() => signOut()} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}>
                        <Ionicons name="log-out-outline" size={24} color="white" />
                        <Text style={{ color: 'white', fontSize: 15, marginLeft: 8 }}>Cerrar Sesion</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
    console.log(dataUserDb)
    return (
        <NavigationContainer independent={true}>

            <Drawer.Navigator initialRouteName="Home" screenOptions={{
                drawerPosition: 'right',
                headerLeft: false,
                drawerStyle: { backgroundColor: '#272b34', paddingTop: 25 },
                headerRight: () => <DrawerToggleButton tintColor={'white'} />,
                drawerActiveBackgroundColor: '#313338',
                drawerInactiveBackgroundColor: '#272b34',
                drawerActiveTintColor: 'white',
                drawerInactiveTintColor: '#dedede',
                drawerLabelStyle: { marginLeft: -15, fontSize: 15 },
                unmountInactiveRoutes: true

            }} drawerContent={(props) => <CustomDrawerContent {...props} />} >

                {dataUserDb.rol === "estudiante" || dataUserDb.rol === "usuario" ? <>
                    <Drawer.Screen name="Home" component={Home} options={{
                        drawerIcon: ({ color }) => (<Ionicons name="home" size={24} color={color} />),
                        headerStyle: {
                            backgroundColor: '#1E1F22',
                            // Cambia el color de fondo de la pantalla


                        }, headerTintColor: 'white',
                        headerShadowVisible: false,
                    }} />
                    <Drawer.Screen name="Reportar Incidencia" component={Details} options={{
                        drawerIcon: ({ color }) => (<Ionicons name="create-sharp" size={24} color={color} />),
                        headerStyle: {
                            backgroundColor: '#1E1F22',
                            // Cambia el color de fondo de la pantalla
                        }, headerTintColor: 'white',
                        headerShadowVisible: false,
                    }} />

                </> : dataUserDb.rol === 'directorescuela' ?
                    <>

                        <Drawer.Screen name="Home" component={Home} options={{
                            drawerIcon: ({ color }) => (<Ionicons name="home" size={24} color={color} />),
                            headerStyle: {
                                backgroundColor: '#1E1F22',
                                // Cambia el color de fondo de la pantalla
                            }, headerTintColor: 'white',
                            headerShadowVisible: false,
                            headerTitleAlign: 'center', // Centra el título en el header
                        }} />

                        <Drawer.Screen name="Dashboard" component={DashBoard} options={{
                            drawerIcon: ({ color }) => (<AntDesign name="dashboard" size={24} color="white" />),
                            headerStyle: {
                                backgroundColor: '#1E1F22',
                                // Cambia el color de fondo de la pantalla
                            }, headerTintColor: 'white',
                            headerShadowVisible: false,
                            headerTitleAlign: 'center', // Centra el título en el header

                        }} />

                    </>
                    :
                    <>
                        {/* aca estan el director comunidad y directorgeneral */}
                        <Drawer.Screen name="Home" component={Home} options={{
                            drawerIcon: ({ color }) => (<Ionicons name="home" size={24} color={color} />),
                            headerStyle: {
                                backgroundColor: '#1E1F22',
                                // Cambia el color de fondo de la pantalla
                            }, headerTintColor: 'white',
                            headerShadowVisible: false,
                            headerTitleAlign: 'center', // Centra el título en el header
                        }} />
                        <Drawer.Screen name="Maps" component={MapsPages} options={{
                            drawerIcon: ({ color }) => (<Entypo name="map" size={24} color="white" />),
                            headerStyle: {
                                backgroundColor: '#1E1F22',
                                // Cambia el color de fondo de la pantalla
                            }, headerTintColor: 'white',
                            headerShadowVisible: false,
                            headerTitleAlign: 'center', // Centra el título en el header
                            headerTitle: 'Mapa'

                        }} />
                        <Drawer.Screen name="Dashboard" component={DashBoard} options={{
                            drawerIcon: ({ color }) => (<AntDesign name="dashboard" size={24} color="white" />),
                            headerStyle: {
                                backgroundColor: '#1E1F22',
                                // Cambia el color de fondo de la pantalla
                            }, headerTintColor: 'white',
                            headerShadowVisible: false,
                            headerTitleAlign: 'center', // Centra el título en el header

                        }} />

                    </>
                }










            </Drawer.Navigator>

        </NavigationContainer >
    )
}
export default StackMain;