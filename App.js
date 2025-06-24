import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './assets/screens/HomeScreen';

const Stack = createNativeStackNavigator();



export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
           <Stack.Screen name="Home" component={HomeScreen} />
         

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}