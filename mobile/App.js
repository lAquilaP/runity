
import React, { useState } from "react";

import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

import AnimatedBackground from "./src/components/AnimatedBackground";

import {
  BarlowCondensed_700Bold,
  BarlowCondensed_800ExtraBold,
} from "@expo-google-fonts/barlow-condensed";

import {
  ThemeProvider,
  useAppTheme,
} from "./src/theme/ThemeContext";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

function AuthenticatedScreen({ user, onLogout }) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.home,
        { backgroundColor: theme.background },
      ]}
    >
      <Text
        style={[
          styles.logo,
          { color: theme.primary },
        ]}
      >
        runity.
      </Text>

      <Text
        style={[
          styles.title,
          { color: theme.text },
        ]}
      >
        Login realizado!
      </Text>

      <Text
        style={[
          styles.description,
          { color: theme.textSecondary },
        ]}
      >
        Bem-vindo, {user.name || user.email}!
      </Text>

      <Pressable onPress={onLogout}>
        <Text style={{ color: theme.primary }}>
          Sair da conta
        </Text>
      </Pressable>
    </View>
  );
}

function Root() {
  const [session, setSession] = useState(null);
  const [screen, setScreen] = useState("login");
  const [loginData, setLoginData] = useState({
    email: "",
    notice: "",
  });

  if (session) {
    return (
      <AuthenticatedScreen
        user={session.user}
        onLogout={() => {
          setSession(null);
          setScreen("login");
          setLoginData({ email: "", notice: "" });
        }}
      />
    );
  }

  if (screen === "register") {
    return (
      <RegisterScreen
        onGoToLogin={(data = {}) => {
          setLoginData({
            email: data.email || "",
            notice: data.notice || "",
          });
          setScreen("login");
        }}
      />
    );
  }

  return (
    <LoginScreen
      key={`${loginData.email}-${loginData.notice}`}
      initialEmail={loginData.email}
      notice={loginData.notice}
      onLoginSuccess={setSession}
      onGoToRegister={() => {
        setScreen("register");
      }}
    />
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    BarlowCondensed_700Bold,
    BarlowCondensed_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#EA4B0B" />
      </View>
    );
  }

    
  return (
    <ThemeProvider>
      <AnimatedBackground>
        <Root />
      </AnimatedBackground>
    </ThemeProvider>
  );

}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  home: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },

  logo: {
    fontFamily: "BarlowCondensed_800ExtraBold",
    fontSize: 56,
  },

  title: {
    fontFamily: "BarlowCondensed_800ExtraBold",
    fontSize: 36,
  },

  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
});
