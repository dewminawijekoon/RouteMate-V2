// app/notifications.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'Bus Alert',
      message: 'Bus 255 arriving in 3 minutes',
      time: '1 min ago',
      icon: 'bus-outline',
      color: '#4A90E2',
      bgColor: '#EAF3FF',
      read: false,
    },
    {
      id: '2',
      type: 'Lost and Found',
      message: 'Lost bag reported in bus ND 5368',
      time: '5 mins ago',
      icon: 'briefcase-outline',
      color: '#F2994A',
      bgColor: '#FFF4E8',
      read: false,
    },
    {
      id: '3',
      type: 'Route Update',
      message: 'Heavy traffic near Pettah',
      time: '10 mins ago',
      icon: 'map-outline',
      color: '#27AE60',
      bgColor: '#E9F9F0',
      read: false,
    },
    {
      id: '4',
      type: 'Bus Alert',
      message: 'Bus 177 delayed by 10 minutes',
      time: '30 mins ago',
      icon: 'bus-outline',
      color: '#4A90E2',
      bgColor: '#EAF3FF',
      read: false,
    },
    {
      id: '5',
      type: 'Route Update',
      message: 'New bus route added: Colombo to Kandy',
      time: '1 hour ago',
      icon: 'map-outline',
      color: '#27AE60',
      bgColor: '#E9F9F0',
      read: false,
    },
    {
      id: '6',
      type: 'Lost and Found',
      message: 'Found a wallet in bus ND 5368',
      time: '2 hours ago',
      icon: 'briefcase-outline',
      color: '#F2994A',
      bgColor: '#FFF4E8',
      read: false,
    },
  ]);

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
        <Text style={styles.headerTitle}>Notifications</Text>
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
