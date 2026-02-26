import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../context/HouseholdContext';

// Auth screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import SignInScreen from '../screens/auth/SignInScreen';

// Onboarding screens
import PainPointScreen from '../screens/onboarding/PainPointScreen';
import LivingSituationScreen from '../screens/onboarding/LivingSituationScreen';
import MainPainPointScreen from '../screens/onboarding/MainPainPointScreen';
import RoleIdentificationScreen from '../screens/onboarding/RoleIdentificationScreen';
import SetupChoiceScreen from '../screens/onboarding/SetupChoiceScreen';

// App screens
import HouseholdScreen from '../screens/app/HouseholdScreen';
import MyChoresScreen from '../screens/app/MyChoresScreen';
import AllChoresScreen from '../screens/app/AllChoresScreen';
import ChatScreen from '../screens/app/ChatScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import CompleteChoreScreen from '../screens/app/CompleteChoreScreen';

// Payment
import PaywallScreen from '../screens/payment/PaywallScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PainPoint" component={PainPointScreen} />
      <Stack.Screen name="LivingSituation" component={LivingSituationScreen} />
      <Stack.Screen name="MainPainPoint" component={MainPainPointScreen} />
      <Stack.Screen name="RoleIdentification" component={RoleIdentificationScreen} />
      <Stack.Screen name="SetupChoice" component={SetupChoiceScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="Household"
        component={HouseholdScreen}
        options={{
          title: 'Household',
          tabBarLabel: 'Household',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="MyChores"
        component={MyChoresScreen}
        options={{
          title: 'My Chores',
          tabBarLabel: 'My Chores',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🧹</Text>,
        }}
      />
      <Tab.Screen
        name="AllChores"
        component={AllChoresScreen}
        options={{
          title: 'All Chores',
          tabBarLabel: 'Chores',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Chat',
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💬</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const { household } = useHousehold();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : !household ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingStack} />
          </>
        ) : (
          <>
            <Stack.Screen name="App" component={AppTabs} />
            <Stack.Screen 
              name="CompleteChore"
              component={CompleteChoreScreen}
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="Paywall" 
              component={PaywallScreen}
              options={{
                presentation: 'modal',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Import Text for icon rendering
import { Text } from 'react-native';
