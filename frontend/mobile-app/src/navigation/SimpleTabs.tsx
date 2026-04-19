import React from "react";
import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  ParamListBase,
  EventMapBase,
  TabNavigationState,
  TabRouter,
  TabRouterOptions,
  useNavigationBuilder,
} from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";

const TAB_ICONS: Record<string, string> = {
  // Trainer
  Dashboard: "⊞",
  Schedule: "📅",
  Clients: "👥",
  Billing: "💳",
  Profile: "👤",
  Settings: "⚙️",
  // Owner
  Setup: "⚙️",
  Trainers: "🏋️",
  Members: "👥",
  Slots: "📅",
  Attendance: "✅",
  // Member
  Home: "🏠",
  Workouts: "💪",
  Nutrition: "🥗",
  Community: "💬",
  Membership: "🎫",
};

type TabNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  {},
  EventMapBase
> &
  TabRouterOptions;

function TabNavigator({ initialRouteName, children, screenOptions }: TabNavigatorProps) {
  const theme = useGymTheme();
  const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });

  return (
    <NavigationContent>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1 }}>{descriptors[state.routes[state.index].key].render()}</View>
        <View style={[styles.tabBar, { borderTopColor: theme.border, backgroundColor: theme.panel }]}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const icon = TAB_ICONS[route.name] ?? "•";
            return (
              <Pressable
                key={route.key}
                style={({ pressed }) => [
                  styles.tab,
                  isFocused
                    ? { backgroundColor: theme.accent }
                    : { backgroundColor: "transparent" },
                  pressed && !isFocused ? { opacity: 0.6 } : null,
                ]}
                onPress={() => navigation.navigate(route.name)}
              >
                <Text style={[styles.tabIcon, { color: isFocused ? "#FFFFFF" : theme.muted }]}>{icon}</Text>
                <Text style={[styles.tabLabel, { color: isFocused ? "#FFFFFF" : theme.muted }]}>{route.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </NavigationContent>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 16,
    gap: 6,
  },
  tab: { flex: 1, borderRadius: 12, paddingVertical: 7, alignItems: "center", gap: 2 },
  tabIcon: { fontSize: 14 },
  tabLabel: { fontSize: 10, fontWeight: "700" },
});

export const createSimpleTabsNavigator = createNavigatorFactory(TabNavigator);
