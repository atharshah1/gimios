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
            return (
              <Pressable
                key={route.key}
                style={[styles.tab, isFocused ? { backgroundColor: theme.accent } : { backgroundColor: theme.panelSoft }]}
                onPress={() => navigation.navigate(route.name)}
              >
                <Text style={[styles.tabLabel, { color: isFocused ? "#12200B" : theme.muted }]}>{route.name}</Text>
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
    padding: 10,
    gap: 8,
    justifyContent: "space-between",
  },
  tab: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: "center" },
  tabLabel: { fontSize: 11, fontWeight: "700" },
});

export const createSimpleTabsNavigator = createNavigatorFactory(TabNavigator);
