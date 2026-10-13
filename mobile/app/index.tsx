import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Signed in. Open the web app for full features.");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clearledger</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Sign in" onPress={signIn} />
      {message ? <Text style={styles.msg}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 12, backgroundColor: "#0f0c29" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16, color: "#f8fafc" },
  input: { borderWidth: 1, borderColor: "#475569", borderRadius: 8, padding: 12, color: "#f8fafc", backgroundColor: "#1e293b" },
  msg: { marginTop: 12, color: "#cbd5e1" },
});