import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Linking, Image, ActivityIndicator, Dimensions, RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AdBanner } from '../lib/admob';

const { width } = Dimensions.get('window');

const SUPA_URL = 'https://tolzqxflecqbjdefohom.supabase.co';
const SUPA_KEY = 'sb_publishable_aDlGZIIVARlRrtmednmZug_LffD21aU';

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({ totalMembers: 0, monthlyRevenue: '0', totalDonations: '0' });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadStats() {
    try {
      const res = await fetch(`${SUPA_URL}/rest/v1/users?role=like.r3dm_*&select=id,role`, {
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
      });
      const members = await res.json();
      const supporters = Array.isArray(members) ? members.filter(m => m.role === 'r3dm_supporter').length : 0;
      const creators = Array.isArray(members) ? members.filter(m => m.role === 'r3dm_creator').length : 0;
      setStats({
        totalMembers: Array.isArray(members) ? members.length : 0,
        supporters,
        creators,
        monthlyRevenue: (supporters * 5 + creators * 10).toFixed(0),
        totalDonations: '—',
      });
    } catch (e) {
      console.warn('Stats error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { loadStats(); }, []);

  const onRefresh = () => { setRefreshing(true); loadStats(); };

  const openWeb = (url) => Linking.openURL(url);

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8b5cf6" />
    }>
      {/* HERO */}
      <LinearGradient colors={['#0a0a1a', '#12071f', '#0a0a1a']} style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>🎵 COMUNIDAD MUSICAL</Text>
        </View>
        <Text style={styles.heroTitle}>r3dm</Text>
        <Text style={styles.heroSub}>community</Text>
        <Text style={styles.heroDesc}>
          Música experimental · Acid Techno · Arte alternativo · Tecnología libre
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => navigation.navigate('Membresía')}
          >
            <Text style={styles.btnPrimaryText}>Unirse ahora</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            onPress={() => openWeb('https://youtube.com/@joanakar3dmoon')}
          >
            <Text style={styles.btnOutlineText}>▶ YouTube</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* STATS */}
      {loading ? (
        <ActivityIndicator color="#8b5cf6" style={{ marginVertical: 24 }} />
      ) : (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stats.totalMembers}</Text>
            <Text style={styles.statLabel}>Miembros</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stats.monthlyRevenue}€</Text>
            <Text style={styles.statLabel}>Mes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>5k+</Text>
            <Text style={styles.statLabel}>Vídeos YT</Text>
          </View>
        </View>
      )}

      {/* QUOTE */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          "El talento te abre las puertas, la humildad las mantiene abiertas"
        </Text>
        <Text style={styles.quoteAuthor}>— Joan aka R3DMOON</Text>
      </View>

      {/* REDES */}
      <Text style={styles.sectionTitle}>Encuéntrame en</Text>
      <View style={styles.socialRow}>
        {[
          { label: '🎬 YouTube', url: 'https://youtube.com/@joanakar3dmoon', color: '#ef4444' },
          { label: '📷 Instagram', url: 'https://www.instagram.com/joan_aka_r3dmoon', color: '#ec4899' },
          { label: '📘 Facebook', url: 'https://www.facebook.com/share/18qGg8sEa6/', color: '#3b82f6' },
        ].map((s) => (
          <TouchableOpacity key={s.label} style={[styles.socialBtn, { borderColor: s.color }]} onPress={() => openWeb(s.url)}>
            <Text style={[styles.socialBtnText, { color: s.color }]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PLANES */}
      <Text style={styles.sectionTitle}>Planes de membresía</Text>
      <View style={styles.plansRow}>
        <TouchableOpacity style={styles.planCard} onPress={() => navigation.navigate('Membresía')}>
          <Text style={styles.planEmoji}>🎵</Text>
          <Text style={styles.planName}>Supporter</Text>
          <Text style={styles.planPrice}>5€/mes</Text>
          <Text style={styles.planDesc}>Música exclusiva + comunidad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.planCard, styles.planCardFeatured]} onPress={() => navigation.navigate('Membresía')}>
          <Text style={styles.planEmoji}>🚀</Text>
          <Text style={styles.planName}>Creator</Text>
          <Text style={[styles.planPrice, { color: '#a78bfa' }]}>10€/mes</Text>
          <Text style={styles.planDesc}>Acceso completo + stems</Text>
        </TouchableOpacity>
      </View>

      <View style={{padding: 16, paddingBottom: 4}}><AdBanner /></View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>r3dm community © 2025</Text>
        <Text style={styles.footerText}>Joan aka R3DMOON · España</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  hero: { padding: 28, paddingTop: 60, alignItems: 'center' },
  heroBadge: { backgroundColor: 'rgba(139,92,246,0.15)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 16 },
  heroBadgeText: { color: '#a78bfa', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  heroTitle: { fontSize: 64, fontWeight: '900', color: '#ffffff', letterSpacing: -2 },
  heroSub: { fontSize: 20, color: '#8b5cf6', fontWeight: '600', marginTop: -8, marginBottom: 12, letterSpacing: 6 },
  heroDesc: { color: '#64748b', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  heroButtons: { flexDirection: 'row', gap: 12 },
  btn: { paddingHorizontal: 22, paddingVertical: 13, borderRadius: 12 },
  btnPrimary: { backgroundColor: '#7c3aed' },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnOutline: { borderWidth: 1, borderColor: 'rgba(139,92,246,0.5)' },
  btnOutlineText: { color: '#a78bfa', fontWeight: '600', fontSize: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, paddingVertical: 24 },
  statCard: { alignItems: 'center', backgroundColor: 'rgba(139,92,246,0.08)', borderRadius: 16, padding: 16, flex: 1, marginHorizontal: 4, borderWidth: 1, borderColor: 'rgba(139,92,246,0.15)' },
  statNum: { fontSize: 26, fontWeight: '800', color: '#ffffff' },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: '600' },
  quoteCard: { margin: 20, padding: 20, backgroundColor: 'rgba(139,92,246,0.06)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(139,92,246,0.2)', borderLeftWidth: 3, borderLeftColor: '#7c3aed' },
  quoteText: { color: '#cbd5e1', fontStyle: 'italic', fontSize: 15, lineHeight: 24 },
  quoteAuthor: { color: '#8b5cf6', fontSize: 13, fontWeight: '600', marginTop: 8 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginHorizontal: 20, marginTop: 20, marginBottom: 12 },
  socialRow: { flexDirection: 'column', gap: 10, marginHorizontal: 20 },
  socialBtn: { padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  socialBtnText: { fontWeight: '700', fontSize: 15 },
  plansRow: { flexDirection: 'row', gap: 12, marginHorizontal: 20, marginBottom: 20 },
  planCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  planCardFeatured: { borderColor: 'rgba(139,92,246,0.4)', backgroundColor: 'rgba(139,92,246,0.06)' },
  planEmoji: { fontSize: 28, marginBottom: 6 },
  planName: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  planPrice: { color: '#10b981', fontWeight: '800', fontSize: 20, marginVertical: 4 },
  planDesc: { color: '#64748b', fontSize: 12, textAlign: 'center' },
  footer: { padding: 24, alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  footerText: { color: '#374151', fontSize: 12 },
});
