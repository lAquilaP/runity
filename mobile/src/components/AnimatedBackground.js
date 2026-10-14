
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
} from "react-native";

import { colors } from "../theme/colors";
import { useAppTheme } from "../theme/ThemeContext";

export default function AnimatedBackground({ children }) {
  const { mode } = useAppTheme();

  const animation = useRef(
    new Animated.Value(mode === "dark" ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: mode === "dark" ? 1 : 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [mode, animation]);

  return (
    <View style={styles.container}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: colors.light.background },
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: colors.dark.background,
            opacity: animation,
          },
        ]}
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
