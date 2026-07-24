import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, Linking, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AdBanner } from '../lib/admob';

const SUPA_URL = 'https://tolzqxflecqbjdefohom.supabase.co';
const SUPA_KEY = 'sb_publishable_aDlGZIIVARlRrtmednmZug_LffD21aU';
const PAYPAL = 'joanlazaro83@gmail.com';

const AMOUNTS = [2, 5, 10, 20];

export default function DonarScreen() {
  const [amount, setAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  async function handleDonate() {
    if (!finalAmount || finalAmount < 1) {
      Alert.alert('Cantidad inválida', 'El mínimo es 1€.');
      return;
    }
    setLoading(true);

    // Guardar en Supabase
    try {
      await fetch(`${SUPA_URL}/rest/v1/withdrawals`, {
        method: 'POST',
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          user_id: 'donation',
          user_email: name || 'Anónimo',
          amount: finalAmount,
          status: 'donation',
          note: message || '',
        }),
      });
    } catch (e) { console.warn('Supabase:', e.message); }

    setLoading(false);

    const url = `https://www.paypal.com/donate/?business=${encodeURIComponent(PAYPAL)}&amount=${finalAmount}&currency_code=EUR&item_name=${encodeURIComponent('r3dm community — Apoyo a Joan')}`;
    Linking.openURL(url);

    Alert.alert('¡Gracias por tu apoyo! 🙏', `${finalAmount}€ hacen posible que el arte continúe.`);
    setName('');
    setMessage('');
    setCustomAmount('');
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <LinearGradient colors={['#12071f', '#0a0a1a']} style={styles.header}>
        <Text style={styles.headerEmoji}>💜</Text>
        <Text style={styles.headerTitle}>Apoya a Joan</Text>
        <Text style={styles.headerSub}>100% va al artista directamente</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Elige cantidad</Text>
        <View style={styles.amountsRow}>
          {AMOUNTS.map(a => (
            <TouchableOpacity
              key={a}
              style={[styles.amountBtn, amount === a && !customAmount && styles.amountBtnActive]}
              onPress={() => { setAmount(a); setCustomAmount(''); }}
            >
              <Text style={[styles.amountBtnText, amount === a && !customAmount && styles.amountBtnTextActive]}>
                {a}€
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Otra cantidad (€)"
          placeholderTextColor="#475569"
          value={customAmount}
          onChangeText={setCustomAmount}
          keyboardType="numeric"
        />

        <Text style={styles.sectionLabel}>Tu nombre (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Para aparecer en el muro de donantes"
          placeholderTextColor="#475569"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.sectionLabel}>Mensaje para Joan (opcional)</Text>
        <TextInput
          style={[styles.input, styles.inputMulti]}
          placeholder="Escríbele algo..."
          placeholderTextColor="#475569"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{finalAmount || 0}€</Text>
        </View>

        <TouchableOpacity style={[styles.donateBtn, loading && styles.donateBtnDisabled]} onPress={handleDonate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.donateBtnText}>💜 Donar {finalAmount || 0}€ via PayPal</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Pago seguro vía PayPal. Tu donación apoya directamente a Joan aka R3DMOON.</Text>
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>¿Por qué apoyar?</Text>
        <Text style={styles.infoText}>
          Joan lleva años creando música electrónica experimental de forma completamente manual, sin ordenador ni IA para la producción musical.{'\n\n'}
          Más de 5.000 vídeos en YouTube, todos hechos a mano. Tu apoyo permite que este proyecto continúe y crezca.
        </Text>
        <Text style={styles.infoQuote}>"El talento te abre las puertas, la humildad las mantiene abiertas"</Text>
      </View>
      <View style={{padding: 16}}><AdBanner /></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: { padding: 28, paddingTop: 50, alignItems: 'center' },
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  headerTitle: { fontSize: 30, fontWeight: '900', color: '#fff' },
  headerSub: { color: '#8b5cf6', fontSize: 15, marginTop: 6 },
  card: { margin: 16, padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  sectionLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginTop: 16 },
  amountsRow: { flexDirection: 'row', gap: 10 },
  amountBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  amountBtnActive: { backgroundColor: 'rgba(124,58,237,0.25)', borderColor: '#7c3aed' },
  amountBtnText: { color: '#64748b', fontWeight: '700', fontSize: 16 },
  amountBtnTextActive: { color: '#a78bfa' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: '#e2e8f0', fontSize: 15, marginTop: 8 },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 16, padding: 16, backgroundColor: 'rgba(139,92,246,0.08)', borderRadius: 12 },
  totalLabel: { color: '#94a3b8', fontSize: 16, fontWeight: '600' },
  totalAmount: { color: '#a78bfa', fontSize: 28, fontWeight: '900' },
  donateBtn: { backgroundColor: '#7c3aed', borderRadius: 14, padding: 16, alignItems: 'center' },
  donateBtnDisabled: { opacity: 0.6 },
  donateBtnText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  disclaimer: { color: '#374151', fontSize: 12, textAlign: 'center', marginTop: 10 },
  infoCard: { margin: 16, marginTop: 0, padding: 20, backgroundColor: 'rgba(139,92,246,0.04)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(139,92,246,0.15)', marginBottom: 40 },
  infoTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  infoText: { color: '#64748b', fontSize: 14, lineHeight: 22 },
  infoQuote: { color: '#8b5cf6', fontStyle: 'italic', fontSize: 14, marginTop: 12 },
});
