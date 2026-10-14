
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

import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "../theme/ThemeContext";
import { spacing, radius } from "../theme/colors";
import ThemeSwitch from "../components/ThemeSwitch";
import { register } from "../services/api";

export default function RegisterScreen({
  onGoToLogin,
}) {
  const { theme, mode } = useAppTheme();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setMessage("");

    if (
      !name.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      setMessage("Preencha todos os campos.");
      return;
    }

    if (!/^[a-zA-Z0-9._]{3,30}$/.test(username.trim())) {
      setMessage(
        "O usuário deve ter de 3 a 30 caracteres: letras, números, ponto ou underline."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Digite um e-mail válido.");
      return;
    }

    if (password.length < 8) {
      setMessage("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        username,
        email,
        password,
      });

      onGoToLogin({
        email: email.trim().toLowerCase(),
        notice: "Conta criada com sucesso! Faça seu login.",
      });
    } catch (error) {
      const status = error.response?.status;

      if (!error.response) {
        setMessage(
          "Não foi possível conectar ao servidor. Verifique o backend."
        );
      } else if (status === 409) {
        setMessage(
          "E-mail ou nome de usuário já cadastrado."
        );
      } else if (status === 400) {
        setMessage(
          error.response.data?.error ||
            "Confira os dados informados."
        );
      } else {
        setMessage(
          "Não foi possível criar sua conta. Tente novamente."
        );
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
          <Text
            style={[
              styles.heading,
              { color: theme.text },
            ]}
          >
            FAÇA PARTE.
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.textSecondary },
            ]}
          >
            Crie sua conta e encontre pessoas
            para correr junto.
          </Text>

          <Text
            style={[styles.label, { color: theme.text }]}
          >
            Nome completo
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
            placeholder="Como podemos te chamar?"
            placeholderTextColor={theme.placeholder}
            autoCapitalize="words"
            autoComplete="name"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

          <Text
            style={[styles.label, { color: theme.text }]}
          >
            Nome de usuário
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
            placeholder="Ex.: lucasaquila"
            placeholderTextColor={theme.placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
            editable={!loading}
          />

          <Text
            style={[styles.label, { color: theme.text }]}
          >
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
            placeholder="seuemail@exemplo.com"
            placeholderTextColor={theme.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          <Text
            style={[styles.label, { color: theme.text }]}
          >
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
              placeholder="Mínimo de 8 caracteres"
              placeholderTextColor={theme.placeholder}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="new-password"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />

            <Pressable
              onPress={() =>
                setShowPassword((current) => !current)
              }
              style={styles.eyeButton}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword
                  ? "Ocultar senha"
                  : "Mostrar senha"
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
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
            onPress={handleRegister}
            disabled={loading}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator
                color={theme.onPrimary}
              />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.onPrimary },
                ]}
              >
                Criar conta
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => onGoToLogin()}
            style={styles.footerButton}
            disabled={loading}
          >
            <Text
              style={[
                styles.footer,
                { color: theme.textSecondary },
              ]}
            >
              Já tem uma conta?{" "}
              <Text style={{ color: theme.primary }}>
                Entrar
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
    paddingVertical: spacing.lg,
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
    minWidth: 0,
    height: "100%",
    paddingHorizontal: spacing.lg,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },

  eyeButton: {
    height: "100%",
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
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

  footerButton: {
    marginTop: spacing.xl,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },

  footer: {
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    fontSize: 13,
  },

  themeSwitchRow: {
    alignItems: "center",
    marginTop: 20,
  },
});
