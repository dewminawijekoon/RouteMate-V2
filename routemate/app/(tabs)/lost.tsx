import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@/constants/config';
import { useSocket } from '@/hooks/useSocket';
import { useTranslation } from 'react-i18next';

type LostItemApi = {
  lost_item_id: number | string;
  user_id?: number | string | null;
  trip_id?: number | null;
  item_name: string;
  description?: string | null;
  item_category?: string | null;
  status?: string | null;
  lost_date?: string | null;
  contact_info?: string | null;
  lost_location?: string | null;
  created_at?: string | null;
};

type LostItem = {
  id: string;
  title: string;
  description?: string | null;
  contact?: string | null;
  location?: string | null;
  created_at?: string | null;
};

export default function LostScreen() {
  const socket = useSocket();
  const { t } = useTranslation();
  const [items, setItems] = useState<LostItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');

  async function load() {
    try {
      const res = await fetch(`${API_URL}/lost-items`);
      const data = await res.json();
      const items: LostItem[] = (data.items as LostItemApi[] || []).map((it) => ({
        id: String(it.lost_item_id ?? Date.now()),
        title: it.item_name,
        description: it.description ?? null,
        contact: it.contact_info ?? null,
        location: it.lost_location ?? null,
        created_at: it.created_at ?? it.lost_date ?? null,
      }));
      setItems(items);
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const handler = (apiItem: any) => {
      const it = apiItem as Partial<LostItemApi>;
      const mapped: LostItem = {
        id: String(it.lost_item_id ?? Date.now()),
        title: it.item_name as string,
        description: (it.description as string) ?? null,
        contact: (it.contact_info as string) ?? null,
        location: (it.lost_location as string) ?? null,
        created_at: (it.created_at as string) ?? (it.lost_date as string) ?? null,
      };
      setItems((prev) => [mapped, ...prev]);
    };
    socket.on('lost-item', handler);
    return () => {
      socket.off('lost-item', handler);
    };
  }, [socket]);

  async function submit() {
    if (!title.trim()) {
      Alert.alert(t('titleRequired'));
      return;
    }
    try {
      const body: any = {
        item_name: title.trim(),
        description: description.trim() || undefined,
        contact_info: contact.trim() || undefined,
        lost_location: location.trim() || undefined, // can be free text or "lat,lng"
      };
      const res = await fetch(`${API_URL}/lost-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Socket-Id': (socket as any)?.id ?? '' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.ok) {
        setTitle('');
        setDescription('');
        setContact('');
        setLocation('');
        Alert.alert(t('posted'), t('lostItemReported'));
      } else {
        Alert.alert(t('error'), t('failedToPost'));
      }
    } catch (e) {
      Alert.alert(t('error'), t('failedToPost'));
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Ionicons name="briefcase-outline" size={24} color="#000" />
        <Text style={styles.headerTitle}>{t('lostFound')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder={t('formTitlePlaceholder')} value={title} onChangeText={setTitle} />
        <TextInput style={[styles.input, styles.textArea]} placeholder={t('formDescriptionPlaceholder')} value={description} onChangeText={setDescription} multiline />
        <TextInput style={styles.input} placeholder={t('formContactPlaceholder')} value={contact} onChangeText={setContact} />
        <TextInput style={styles.input} placeholder={t('formLocationPlaceholder')} value={location} onChangeText={setLocation} />
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>{t('post')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.title}</Text>
              {!!item.bus_no && <Text style={styles.bus}>{t('busPrefix')} {item.bus_no}</Text>}
            </View>
            {!!item.description && <Text style={styles.desc}>{item.description}</Text>}
            {!!item.contact && <Text style={styles.contact}>{t('contactPrefix')} {item.contact}</Text>}
            {!!item.created_at && <Text style={styles.time}>{new Date(item.created_at).toLocaleString()}</Text>}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  form: { padding: 16, backgroundColor: '#F7F8FA' },
  input: {
    height: 44, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', paddingHorizontal: 12, marginBottom: 10,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#2D6CDF', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '700' },
  bus: { color: '#555' },
  desc: { color: '#333', marginBottom: 6 },
  contact: { color: '#444' },
  time: { fontSize: 12, color: '#888', marginTop: 6 },
});
