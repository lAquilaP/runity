import { Ionicons } from "@expo/vector-icons";
import ThemeSwitch from "../components/ThemeSwitch";

import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { useAppTheme } from "../theme/ThemeContext";
import { spacing, radius } from "../theme/colors";
import { login } from "../services/api";

export default function LoginScreen({
  onLoginSuccess,
  onGoToRegister,
  initialEmail = "",
  notice = "",
}) {
  const { theme, mode, changeTheme } = useAppTheme();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(notice);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setMessage("Preencha seu e-mail e sua senha.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await login(email, password);

      if (!data.token || !data.user) {
        throw new Error("Resposta inválida do servidor.");
      }

      onLoginSuccess(data);
    } catch (error) {
      if (!error.response) {
        setMessage(
          "Não foi possível conectar ao servidor. Confira se o backend está ligado."
        );
      } else if (
        error.response.status === 400 ||
        error.response.status === 401
      ) {
        setMessage("E-mail ou senha inválidos.");
      } else {
        setMessage("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <ScrollView
    style={{ backgroundColor: "transparent" }}
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps="handled"
    >

      <StatusBar
        barStyle={
          mode === "dark" ? "light-content" : "dark-content"
        }
      />

      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.primary }]}>
            runity.
          </Text>

          <Text
            style={[
              styles.tagline,
              { color: theme.textSecondary },
            ]}
          >
            MAIS QUE CORRER. PERTENCER.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.heading, { color: theme.text }]}>
            BEM-VINDO DE VOLTA.
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.textSecondary },
            ]}
          >
            Entre na sua conta e encontre sua
            próxima comunidade de corrida.
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>
            E-mail
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            autoComplete="off"
            placeholder="seuemail@exemplo.com"
            placeholderTextColor={theme.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

                    
            <Text style={[styles.label, { color: theme.text }]}>
            Senha
            </Text>

            <View
            style={[
                styles.passwordContainer,
                {
                backgroundColor: theme.input,
                borderColor: theme.border,
                },
            ]}
            >
            <TextInput
                style={[
                styles.passwordInput,
                { color: theme.text },
                ]}
                placeholder="Digite sua senha"
                placeholderTextColor={theme.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="off"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={handleLogin}
            />


            <Pressable
            onPress={() => setShowPassword((current) => !current)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={
                showPassword ? "Ocultar senha" : "Mostrar senha"
            }
            >
            <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={theme.textSecondary}
            />
            </Pressable>

            </View>
            {message ? (
                <Text
                    style={[
                    styles.message,
                    { color: theme.primary },
                    ]}
                >
                    {message}
                </Text> 
                ) : null}

          <Pressable
            style={[
              styles.button,
              { backgroundColor: theme.primary },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.onPrimary} />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.onPrimary },
                ]}
              >
                Entrar
              </Text>
            )}
          </Pressable>

                    
            <Pressable
            onPress={onGoToRegister}
            style={styles.footerButton}
            accessibilityRole="button"
            >
            <Text
                style={[
                styles.footer,
                { color: theme.textSecondary },
                ]}
            >
                Ainda não tem uma conta?{" "}
                <Text style={{ color: theme.primary }}>
                Cadastre-se
                </Text>
            </Text>
            </Pressable>

        </View>

        <View style={styles.themeSwitchRow}>
            <ThemeSwitch />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  wrapper: {
    width: "100%",
    maxWidth: 440,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logo: {
    fontFamily: "BarlowCondensed_800ExtraBold",
    fontSize: 64,
    lineHeight: 72,
  },
  tagline: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 3,
    textAlign: "center",
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.xl,
  },
  heading: {
    fontFamily: "BarlowCondensed_800ExtraBold",
    fontSize: 35,
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  message: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginBottom: spacing.md,
  },
  button: {
    height: 52,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  footer: {
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: spacing.xl,
    fontSize: 13,
  },
  themeButton: {
    alignItems: "center",
    padding: spacing.lg,
  },
  themeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },

    passwordContainer: {
    height: 52,
    borderWidth: 1,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    },

    passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: spacing.lg,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    minWidth: 0,
    },

    eyeButton: {
    height: "100%",
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    },
    themeSwitchRow: {
    alignItems: "center",
    marginTop: 20,
    },
    footerButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
    alignItems: "center",
    },
});
