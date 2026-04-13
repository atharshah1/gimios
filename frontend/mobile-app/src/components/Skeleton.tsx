import React from "react";
import { StyleSheet, View } from "react-native";

export function Skeleton({ width = "100%", height = 14 }: { width?: number | `${number}%` | "100%"; height?: number }) {
  return <View style={[styles.block, { width, height }]} />;
}

const styles = StyleSheet.create({
  block: {
    borderRadius: 8,
    backgroundColor: "#2A302D",
  },
});
