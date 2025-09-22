import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login01 from '../screens/Login01';
import Login02 from '../screens/Login02';
import MessageList from '../screens/MessageList';
import Menu from '../screens/Menu';

const Stack = createStackNavigator();

const AppNavigator = ({ initialRoute, adData, isAdVisible, setAdVisible }) => {
  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login01" component={Login01} />
      <Stack.Screen name="Login02" component={Login02} />
      <Stack.Screen name="MessageList" component={MessageList} />
      <Stack.Screen name="Menu">
        {props => (
          <Menu
            {...props}
            adData={adData}
            isAdVisible={isAdVisible}
            setAdVisible={setAdVisible}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppNavigator;