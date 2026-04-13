import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRole } from "../contexts/RoleContext";
import { useGymTheme } from "../contexts/ThemeContext";
import { ErrorScreen } from "../screens/common/ErrorScreen";
import { LoadingScreen } from "../screens/common/LoadingScreen";
import { BillingScreen } from "../screens/trainer/BillingScreen";
import { ClientProfileScreen } from "../screens/trainer/ClientProfileScreen";
import { ClientsScreen } from "../screens/trainer/ClientsScreen";
import { DashboardScreen } from "../screens/trainer/DashboardScreen";
import { HrmsScreen } from "../screens/trainer/HrmsScreen";
import { ScheduleScreen } from "../screens/trainer/ScheduleScreen";
import { SessionDetailsScreen } from "../screens/trainer/SessionDetailsScreen";
import { SettingsScreen } from "../screens/trainer/SettingsScreen";
import { CommunityScreen } from "../screens/member/CommunityScreen";
import { HomeScreen } from "../screens/member/HomeScreen";
import { LiveWorkoutScreen } from "../screens/member/LiveWorkoutScreen";
import { MembershipScreen } from "../screens/member/MembershipScreen";
import { NutritionScreen } from "../screens/member/NutritionScreen";
import { ProfileScreen } from "../screens/member/ProfileScreen";
import { WorkoutDetailScreen } from "../screens/member/WorkoutDetailScreen";
import { WorkoutsScreen } from "../screens/member/WorkoutsScreen";
import { MemberTabParamList, RootStackParamList, TrainerTabParamList } from "./types";
import { createSimpleTabsNavigator } from "./SimpleTabs";

const Stack = createNativeStackNavigator<RootStackParamList>();
const TrainerTabs = createSimpleTabsNavigator<TrainerTabParamList>();
const MemberTabs = createSimpleTabsNavigator<MemberTabParamList>();

function TrainerTabNavigator() {
  return (
    <TrainerTabs.Navigator>
      <TrainerTabs.Screen name="Dashboard" component={DashboardScreen} />
      <TrainerTabs.Screen name="Schedule" component={ScheduleScreen} />
      <TrainerTabs.Screen name="Clients" component={ClientsScreen} />
      <TrainerTabs.Screen name="HRMS" component={HrmsScreen} />
      <TrainerTabs.Screen name="Billing" component={BillingScreen} />
      <TrainerTabs.Screen name="Settings" component={SettingsScreen} />
    </TrainerTabs.Navigator>
  );
}

function MemberTabNavigator() {
  return (
    <MemberTabs.Navigator>
      <MemberTabs.Screen name="Home" component={HomeScreen} />
      <MemberTabs.Screen name="Workouts" component={WorkoutsScreen} />
      <MemberTabs.Screen name="Nutrition" component={NutritionScreen} />
      <MemberTabs.Screen name="Community" component={CommunityScreen} />
      <MemberTabs.Screen name="Membership" component={MembershipScreen} />
      <MemberTabs.Screen name="Profile" component={ProfileScreen} />
    </MemberTabs.Navigator>
  );
}

export function AppNavigator() {
  const { role, loading, error, retry } = useRole();
  const theme = useGymTheme();

  if (loading) return <LoadingScreen />;
  if (error || !role) return <ErrorScreen retry={retry} />;

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.background,
          card: theme.panel,
          text: theme.text,
          border: theme.border,
          primary: theme.accent,
        },
      }}
    >
      <Stack.Navigator>
        {role === "trainer" ? (
          <>
            <Stack.Screen name="TrainerTabs" component={TrainerTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="SessionDetails" component={SessionDetailsScreen} options={{ title: "Session" }} />
            <Stack.Screen name="ClientProfile" component={ClientProfileScreen} options={{ title: "Client" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="MemberTabs" component={MemberTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: "Workout" }} />
            <Stack.Screen name="LiveWorkout" component={LiveWorkoutScreen} options={{ title: "Live" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
