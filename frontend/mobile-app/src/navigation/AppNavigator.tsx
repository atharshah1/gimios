import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRole } from "../contexts/RoleContext";
import { useGymTheme } from "../contexts/ThemeContext";
import { ErrorScreen } from "../screens/common/ErrorScreen";
import { LoadingScreen } from "../screens/common/LoadingScreen";
import { HomeScreen } from "../screens/member/HomeScreen";
import { LiveWorkoutScreen } from "../screens/member/LiveWorkoutScreen";
import { ProfileScreen } from "../screens/member/ProfileScreen";
import { WorkoutDetailScreen } from "../screens/member/WorkoutDetailScreen";
import { WorkoutsScreen } from "../screens/member/WorkoutsScreen";
import { AttendanceHistoryScreen } from "../screens/member/AttendanceHistoryScreen";
import { OwnerAttendanceScreen } from "../screens/owner/OwnerAttendanceScreen";
import { OwnerBillingScreen } from "../screens/owner/OwnerBillingScreen";
import { OwnerDashboardScreen } from "../screens/owner/OwnerDashboardScreen";
import { OwnerMembersScreen } from "../screens/owner/OwnerMembersScreen";
import { OwnerSetupScreen } from "../screens/owner/OwnerSetupScreen";
import { OwnerSlotsScreen } from "../screens/owner/OwnerSlotsScreen";
import { OwnerTrainersScreen } from "../screens/owner/OwnerTrainersScreen";
import { ClientProfileScreen } from "../screens/trainer/ClientProfileScreen";
import { ClientsScreen } from "../screens/trainer/ClientsScreen";
import { DashboardScreen } from "../screens/trainer/DashboardScreen";
import { ScheduleScreen } from "../screens/trainer/ScheduleScreen";
import { SessionDetailsScreen } from "../screens/trainer/SessionDetailsScreen";
import { TrainerProfileScreen } from "../screens/trainer/TrainerProfileScreen";
import { MemberTabParamList, OwnerTabParamList, RootStackParamList, TrainerTabParamList } from "./types";
import { createSimpleTabsNavigator } from "./SimpleTabs";

const Stack = createNativeStackNavigator<RootStackParamList>();
const OwnerTabs = createSimpleTabsNavigator<OwnerTabParamList>();
const TrainerTabs = createSimpleTabsNavigator<TrainerTabParamList>();
const MemberTabs = createSimpleTabsNavigator<MemberTabParamList>();

function OwnerTabNavigator() {
  return (
    <OwnerTabs.Navigator>
      <OwnerTabs.Screen name="Dashboard" component={OwnerDashboardScreen} />
      <OwnerTabs.Screen name="Trainers" component={OwnerTrainersScreen} />
      <OwnerTabs.Screen name="Members" component={OwnerMembersScreen} />
      <OwnerTabs.Screen name="Slots" component={OwnerSlotsScreen} />
      <OwnerTabs.Screen name="Attendance" component={OwnerAttendanceScreen} />
      <OwnerTabs.Screen name="Billing" component={OwnerBillingScreen} />
      <OwnerTabs.Screen name="Setup" component={OwnerSetupScreen} />
    </OwnerTabs.Navigator>
  );
}

function TrainerTabNavigator() {
  return (
    <TrainerTabs.Navigator>
      <TrainerTabs.Screen name="Dashboard" component={DashboardScreen} />
      <TrainerTabs.Screen name="Schedule" component={ScheduleScreen} />
      <TrainerTabs.Screen name="Clients" component={ClientsScreen} />
      <TrainerTabs.Screen name="Profile" component={TrainerProfileScreen} />
    </TrainerTabs.Navigator>
  );
}

function MemberTabNavigator() {
  return (
    <MemberTabs.Navigator>
      <MemberTabs.Screen name="Home" component={HomeScreen} />
      <MemberTabs.Screen name="Workouts" component={WorkoutsScreen} />
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
        {role === "gym_owner" ? (
          <Stack.Screen name="OwnerTabs" component={OwnerTabNavigator} options={{ headerShown: false }} />
        ) : null}
        {role === "trainer" ? (
          <>
            <Stack.Screen name="TrainerTabs" component={TrainerTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="SessionDetails" component={SessionDetailsScreen} options={{ title: "Session" }} />
            <Stack.Screen name="ClientProfile" component={ClientProfileScreen} options={{ title: "Client Profile" }} />
          </>
        ) : null}
        {role === "member" ? (
          <>
            <Stack.Screen name="MemberTabs" component={MemberTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: "Workout" }} />
            <Stack.Screen name="LiveWorkout" component={LiveWorkoutScreen} options={{ title: "Live Workout" }} />
            <Stack.Screen
              name="AttendanceHistory"
              component={AttendanceHistoryScreen}
              options={{ title: "Attendance" }}
            />
          </>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
