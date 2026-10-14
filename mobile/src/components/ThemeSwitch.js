
import React, { useEffect, useRef } from "react";

import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme/ThemeContext";

export default function ThemeSwitch() {
  const { mode, changeTheme } = useAppTheme();

  const isDark = mode === "dark";
  const progress = useRef(
    new Animated.Value(isDark ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isDark ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [isDark, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 36],
  });

  return (
    <Pressable
      onPress={changeTheme}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel="Modo escuro"
      style={[
        styles.track,
        {
          backgroundColor: isDark
            ? "#EA4B0B"
            : "#E5E1DB",
        },
      ]}
    >
      <View style={styles.icons}>
        <Ionicons
          name="sunny"
          size={16}
          color={isDark ? "#FFFFFF" : "#777777"}
        />

        <Ionicons
          name="moon"
          size={16}
          color={isDark ? "#FFFFFF" : "#777777"}
        />
      </View>

      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX }] },
        ]}
      >
        <Ionicons
          name={isDark ? "moon" : "sunny"}
          size={17}
          color="#171717"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 76,
    height: 40,
    borderRadius: 24,
    padding: 4,
    justifyContent: "center",
  },

  icons: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  thumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
