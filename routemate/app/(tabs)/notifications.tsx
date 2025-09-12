// app/notifications.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '@/hooks/useSocket';
import { useTranslation } from 'react-i18next';

type IoniconName = 'bus-outline' | 'briefcase-outline' | 'map-outline';

type NotificationItem = {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: IoniconName;
  color: string;
  bgColor: string;
  read: boolean;
};

export default function NotificationsScreen() {
  const socket = useSocket();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: t('busAlert'),
      message: t('busArrivingIn', { bus: '255', minutes: 3 }),
      time: t('minutesAgo', { count: 1 }),
      icon: 'bus-outline',
      color: '#4A90E2',
      bgColor: '#EAF3FF',
      read: false,
    },
    {
      id: '2',
      type: t('lostFound'),
      message: t('lostBagReportedInBus', { bus: 'ND 5368' }),
      time: t('minutesAgo', { count: 5 }),
      icon: 'briefcase-outline',
      color: '#F2994A',
      bgColor: '#FFF4E8',
      read: false,
    },
    {
      id: '3',
      type: t('routeUpdate'),
      message: t('heavyTrafficNear', { place: 'Pettah' }),
      time: t('minutesAgo', { count: 10 }),
      icon: 'map-outline',
      color: '#27AE60',
      bgColor: '#E9F9F0',
      read: false,
    },
    {
      id: '4',
      type: t('busAlert'),
      message: t('busDelayedBy', { bus: '177', minutes: 10 }),
      time: t('minutesAgo', { count: 30 }),
      icon: 'bus-outline',
      color: '#4A90E2',
      bgColor: '#EAF3FF',
      read: false,
    },
    {
      id: '5',
      type: t('routeUpdate'),
      message: t('newBusRouteAdded', { route: 'Colombo to Kandy' }),
      time: t('hoursAgo', { count: 1 }),
      icon: 'map-outline',
      color: '#27AE60',
      bgColor: '#E9F9F0',
      read: false,
    },
    {
      id: '6',
      type: t('lostFound'),
      message: t('foundWalletInBus', { bus: 'ND 5368' }),
      time: t('hoursAgo', { count: 2 }),
      icon: 'briefcase-outline',
      color: '#F2994A',
      bgColor: '#FFF4E8',
      read: false,
    },
  ]);

  useEffect(() => {
    if (!socket) return;
    const handler = (payload: { text: string; user: string; ts: number }) => {
      const item: NotificationItem = {
        id: String(payload.ts),
        type: t('newPost'),
        message: `${payload.user}: ${payload.text}`,
        time: t('justNow'),
        icon: 'map-outline',
        color: '#27AE60',
        bgColor: '#E9F9F0',
        read: false,
      };
      setNotifications((prev) => [item, ...prev]);
      Alert.alert(t('newPost'), `${payload.user} posted: ${payload.text}`);
    };
    socket.on('new-post', handler);
    const lostHandler = (item: any) => {
      const n: NotificationItem = {
        id: String(item.lost_item_id || Date.now()),
        type: t('lostItem'),
        message: `${item.item_name || ''}`,
        time: t('justNow'),
        icon: 'briefcase-outline',
        color: '#F2994A',
        bgColor: '#FFF4E8',
        read: false,
      };
      setNotifications((prev) => [n, ...prev]);
      Alert.alert(t('lostFound'), `${item.item_name || ''}`);
    };
    socket.on('lost-item', lostHandler);
    const pushStatusHandler = (data: any) => {
      const success = data?.success ?? 0;
      const failure = data?.failure ?? 0;
      const msg = failure
        ? t('pushSentOkFailed', { success, failure })
        : t('pushSentOk', { success });
      const n: NotificationItem = {
        id: `${Date.now()}-push`,
        type: t('system'),
        message: msg,
        time: t('justNow'),
        icon: 'briefcase-outline',
        color: '#27AE60',
        bgColor: '#E9F9F0',
        read: false,
      };
      setNotifications((prev) => [n, ...prev]);
      Alert.alert(t('notificationStatus'), msg);
    };
    socket.on('push-status', pushStatusHandler);
    return () => {
      socket.off('new-post', handler);
      socket.off('lost-item', lostHandler);
      socket.off('push-status', pushStatusHandler);
    };
  }, [socket]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="#000" />
        <Text style={styles.headerTitle}>{t('notifications')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Notification list */}
      <ScrollView contentContainerStyle={styles.container}>
        {notifications.map((notice) => (
          <TouchableOpacity
            key={notice.id}
            onPress={() => markAsRead(notice.id)}
            activeOpacity={0.8}
          >
            <View style={styles.card}>
              {/* Icon circle */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: notice.bgColor },
                ]}
              >
                <Ionicons name={notice.icon} size={22} color={notice.color} />
              </View>

              {/* Text Section */}
              <View style={styles.textContainer}>
                <Text style={[styles.type, { color: notice.color }]}>
                  {notice.type}
                </Text>
                <Text style={styles.message}>{notice.message}</Text>
                <Text style={styles.time}>{notice.time}</Text>
              </View>

              {/* Status dot (only if unread) */}
              {!notice.read && (
                <View
                  style={[styles.dot, { backgroundColor: notice.color }]}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  container: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  type: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
