import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, Linking, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SUPA_URL = 'https://tolzqxflecqbjdefohom.supabase.co';
const SUPA_KEY = 'sb_publishable_aDlGZIIVARlRrtmednmZug_LffD21aU';
const PAYPAL = 'joanlazaro83@gmail.com';

export default function MemberScreen() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'supporter',
      emoji: '🎵',
      name: 'Supporter',
      price: '5€/mes',
      amount: 5,
      color: '#10b981',
      perks: ['Música exclusiva mensual', 'Comunidad privada', 'Newsletter de lanzamientos', 'Descuentos en merch'],
    },
    {
      id: 'creator',
      emoji: '🚀',
      name: 'Creator',
      price: '10€/mes',
      amount: 10,
      color: '#8b5cf6',
      perks: ['Todo lo de Supporter', 'Stems descargables', 'Cursos de producción IA', 'Discord VIP', 'Sesiones 1:1 mensuales'],
      featured: true,
    },
  ];

  async function handleJoin() {
    if (!selectedPlan) {
      Alert.alert('Elige un plan', 'Selecciona Supporter o Creator para continuar.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Email inválido', 'Introduce un email válido para activar tu membresía.');
      return;
    }

    setLoading(true);
    const plan = plans.find(p => p.id === selectedPlan);

    // Guardar en Supabase
    try {
      await fetch(`${SUPA_URL}/rest/v1/users`, {
        method: 'POST',
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          id: crypto.randomUUID?.() || `${Date.now()}`,
          email,
          name: name || email.split('@')[0],
          role: `r3dm_${selectedPlan}`,
          credits: 0,
          balance: plan.amount,
          banned: false,
        }),
      });
    } catch (e) {
      console.warn('Supabase:', e.message);
    }

    setLoading(false);

    // Redirigir a PayPal
    const url = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick-subscriptions&business=${encodeURIComponent(PAYPAL)}&item_name=${encodeURIComponent('r3dm community — ' + plan.name)}&a3=${plan.amount}&p3=1&t3=M&src=1&currency_code=EUR`;
    Linking.openURL(url);

    Alert.alert(
      '¡Bienvenido a r3dm community! 🎉',
      `Hola${name ? ' ' + name : ''}! Tu membresía ${plan.name} se activará tras confirmar el pago en PayPal.`,
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#12071f', '#0a0a1a']} style={styles.header}>
        <Text style={styles.headerTitle}>Únete a r3dm</Text>
        <Text style={styles.headerSub}>Apoya la música independiente</Text>
      </LinearGradient>

      <View style={styles.plans}>
        {plans.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[styles.planCard, selectedPlan === plan.id && styles.planSelected, plan.featured && styles.planFeatured]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.featured && <View style={styles.badge}><Text style={styles.badgeText}>POPULAR</Text></View>}
            <Text style={styles.planEmoji}>{plan.emoji}</Text>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
            <View style={styles.divider} />
            {plan.perks.map(p => (
              <Text key={p} style={styles.perk}>✓ {p}</Text>
            ))}
            {selectedPlan === plan.id && (
              <View style={styles.selectedMark}>
                <Text style={styles.selectedMarkText}>✓ Seleccionado</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* FORMULARIO */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Tus datos</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu email *"
          placeholderTextColor="#475569"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Tu nombre (opcional)"
          placeholderTextColor="#475569"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity
          style={[styles.joinBtn, loading && styles.joinBtnDisabled]}
          onPress={handleJoin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.joinBtnText}>Unirme ahora → PayPal</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          Pago seguro vía PayPal. Cancela cuando quieras.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: { padding: 28, paddingTop: 50, alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#fff' },
  headerSub: { color: '#8b5cf6', fontSize: 16, marginTop: 6 },
  plans: { padding: 16, gap: 14 },
  planCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', position: 'relative' },
  planSelected: { borderColor: '#7c3aed', backgroundColor: 'rgba(139,92,246,0.08)' },
  planFeatured: { borderColor: 'rgba(139,92,246,0.3)' },
  badge: { position: 'absolute', top: 14, right: 14, backgroundColor: '#7c3aed', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  planEmoji: { fontSize: 32, marginBottom: 8 },
  planName: { color: '#fff', fontSize: 22, fontWeight: '800' },
  planPrice: { fontSize: 28, fontWeight: '900', marginVertical: 6 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 12 },
  perk: { color: '#94a3b8', fontSize: 14, marginVertical: 3 },
  selectedMark: { marginTop: 12, backgroundColor: 'rgba(139,92,246,0.2)', borderRadius: 8, padding: 8, alignItems: 'center' },
  selectedMarkText: { color: '#a78bfa', fontWeight: '700' },
  form: { margin: 16, padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 40 },
  formTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 14 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: '#e2e8f0', fontSize: 15, marginBottom: 12 },
  joinBtn: { backgroundColor: '#7c3aed', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 6 },
  joinBtnDisabled: { opacity: 0.6 },
  joinBtnText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  disclaimer: { color: '#374151', fontSize: 12, textAlign: 'center', marginTop: 10 },
});
