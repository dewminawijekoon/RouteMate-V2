// app/(tabs)/profile.tsx – compact flat design
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, StyleSheet, Pressable, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { API_URL } from '@/constants/config';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/src/components/LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { getApiUrl, API_CONFIG } from '@/constants/api';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isAuthenticated, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/300?img=12');
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        setLoaded(true);
        return;
      }

      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        setLoaded(true);
        return;
      }

      const res = await fetch(getApiUrl(API_CONFIG?.AUTH_ENDPOINTS?.ME || '/api/auth/me'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        const u = data?.user;
        if (u) {
          setUserId(u.user_id);
          setName(u.name || '');
          setEmail(u.email || '');
          setPhone(u.phone || '');
          if (u.profile_picture) setAvatar(u.profile_picture);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    finally { setLoaded(true); }
  }, [isAuthenticated]);

  useEffect(() => { fetchUser(); }, [fetchUser]);
  useFocusEffect(useCallback(() => { fetchUser(); }, [fetchUser]));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FB' }}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <ThemedText type="title" style={styles.topTitle}>{t('profile')}</ThemedText>
        <Pressable style={styles.topAction} onPress={() => setEditing((v) => !v)} accessibilityRole="button" accessibilityLabel={editing ? t('cancel') : t('edit')}>
          <Ionicons name={editing ? 'close' : 'create-outline'} size={18} color="#0B1220" />
          <ThemedText style={styles.topActionText}>{editing ? t('cancel') : t('edit')}</ThemedText>
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Profile card */}
          <View style={styles.cardRow}>
            <View style={{ width: 84, height: 84 }}>
              <Image source={{ uri: avatar }} style={styles.avatar} />
              <Pressable
                style={styles.camBadge}
                onPress={async () => {
                  try {
                    if (Platform.OS !== 'web') {
                      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert(t('permissionNeeded'), t('allowAccessPhotos'));
                        return;
                      }
                    }
                    const result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      allowsEditing: true,
                      aspect: [1, 1],
                      quality: 0.8,
                    });
                    if (!result.canceled) {
                      const uri = result.assets?.[0]?.uri;
                      if (uri) setAvatar(uri);
                    }
                  } catch (e) {
                    Alert.alert(t('error'), t('failedToPickImage'));
                  }
                }}
                accessibilityLabel={t('avatarUrl')}
              >
                <Ionicons name="camera" size={14} color="#fff" />
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              {!editing ? (
                <>
                  {loaded ? (
                    <>
                      <ThemedText type="title" style={styles.name}>{name || t('name')}</ThemedText>
                      <ThemedText style={styles.email}>{email || t('emailPlaceholder')}</ThemedText>
                      {!!phone && <ThemedText style={styles.phone}>{phone}</ThemedText>}
                      <ThemedText style={styles.greeting}>{t('greeting', { name: name || t('name') })}</ThemedText>
                    </>
                  ) : (
                    <>
                      <View style={styles.skelName} />
                      <View style={styles.skelLine} />
                      <View style={[styles.skelLine, { width: '40%' }]} />
                    </>
                  )}
                </>
              ) : (
                <>
                  <TextInput style={styles.input} placeholder={t('name')} value={name} onChangeText={setName} />
                  <TextInput style={styles.input} placeholder={t('email')}
                    value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
                  <TextInput style={styles.input} placeholder={t('phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                  <TextInput style={styles.input} placeholder={t('avatarUrl')} value={avatar} onChangeText={setAvatar} autoCapitalize="none" />
                </>
              )}
              {/* Language selector section */}
              <View style={styles.langSection}>
                <ThemedText style={styles.languageLabel}>{t('language')}</ThemedText>
                <LanguageSelector />
              </View>
            </View>
          </View>

          {editing && (
            <View style={styles.actions}>
              <Pressable style={[styles.btn, styles.secondary]} onPress={() => setEditing(false)}>
                <ThemedText style={[styles.btnText, { color: '#0B1220' }]}>{t('cancel')}</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.primary]}
                onPress={async () => {
                  try {
                    setLoading(true);
                    let pictureUrl = avatar;
                    // If avatar is a local file/blob, upload it first
                    if (!/^https?:/i.test(avatar)) {
                      const form = new FormData();
                      if (Platform.OS === 'web') {
                        const blob = await fetch(avatar).then((r) => r.blob());
                        form.append('file', blob, 'avatar.jpg');
                      } else {
                        form.append('file', { uri: avatar, name: 'avatar.jpg', type: 'image/jpeg' } as any);
                      }
                      const up = await fetch(`${API_URL}/users/${userId}/avatar`, { method: 'POST', body: form });
                      const upData = await up.json();
                      if (upData?.ok && upData?.url) {
                        pictureUrl = upData.url;
                        setAvatar(pictureUrl);
                      }
                    }

                    const res = await fetch(`${API_URL}/users/${userId}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, email, phone, profile_picture: pictureUrl }),
                    });
                    const data = await res.json();
                    if (data?.ok) {
                      // Re-fetch to ensure we reflect DB state
                      try {
                        const fresh = await fetch(`${API_URL}/users/${userId}`).then((r) => r.json());
                        const u = fresh?.user;
                        if (u) {
                          setName(u.name || '');
                          setEmail(u.email || '');
                          setPhone(u.phone || '');
                          if (u.profile_picture) setAvatar(u.profile_picture);
                        }
                      } catch {}
                      Alert.alert(t('saved'), t('profileUpdated'));
                      setEditing(false);
                    } else {
                      Alert.alert(t('error'), t('failedToUpdate'));
                    }
                  } catch {}
                  finally { setLoading(false); }
                }}
              >
                <ThemedText style={[styles.btnText, { color: '#fff' }]}>{loading ? t('saving') : t('save')}</ThemedText>
              </Pressable>
            </View>
          )}

          {/* Quick actions */}
          <View style={styles.tiles}>
            <MenuItem icon="settings-outline" label={t('preferences')} onPress={() => Alert.alert(t('preferences'))} />
            <MenuItem icon="headset-outline" label={t('customerCare')} onPress={() => Alert.alert(t('customerCare'))} />
            <MenuItem icon="help-circle-outline" label={t('helpCenter')} onPress={() => Alert.alert(t('helpCenter'))} />
            <MenuItem icon="log-out-outline" label={t('logout')} logout onPress={() => {
              Alert.alert(
                t('logout'),
                t('logoutConfirmation', 'Are you sure you want to logout?'),
                [
                  { text: t('cancel', 'Cancel'), style: 'cancel' },
                  { 
                    text: t('logout'), 
                    style: 'destructive',
                    onPress: () => signOut()
                  }
                ]
              );
            }} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress, logout }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; logout?: boolean }) {
  return (
    <Pressable style={[styles.menuItem, logout && styles.logoutItem]} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={18} color={logout ? '#EF4444' : '#0B1220'} />
      </View>
      <ThemedText style={styles.menuLabel}>{label}</ThemedText>
      <Ionicons name="chevron-forward-outline" size={18} color={logout ? '#EF4444' : '#94A3B8'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F5F7FB' },
  topTitle: { },
  topAction: { backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  topActionText: { fontWeight: '700', color: '#0B1220' },

  container: { padding: 16, gap: 12, flex: 1 },

  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E6EEF6', shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  camBadge: { position: 'absolute', right: 0, bottom: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  name: { fontWeight: '800', fontSize: 22, marginBottom: 4, color: '#0B1220' },
  email: { color: '#1F2937' },
  phone: { color: '#0F172A', marginTop: 2 },
  greeting: { color: '#334155', marginTop: 6 },

  input: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, marginBottom: 8, color: '#0B1220' },

  actions: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12 },
  primary: { backgroundColor: '#2563EB' },
  secondary: { backgroundColor: '#E2E8F0' },
  btnText: { fontWeight: '700' },

  tiles: { gap: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E6EEF6' },
  menuIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E0F2FE', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16, color: '#0B1220' },
  logoutItem: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FEE2E2' },
  skelName: { height: 20, width: '60%', backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 8 },
  skelLine: { height: 14, width: '80%', backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 6 },
  langSection: { marginTop: 12, gap: 8 },
  languageLabel: { fontWeight: '700', color: '#0B1220' },
});
