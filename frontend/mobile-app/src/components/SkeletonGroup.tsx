import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "./Skeleton";

export function SkeletonGroup({ rows = 3 }: { rows?: number }) {
  return (
    <View style={styles.wrap}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} width="100%" height={14 + (index % 2) * 6} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
});
