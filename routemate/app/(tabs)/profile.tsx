import { StyleSheet, View, Image, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedText type="title" style={styles.header}>
          Profile
        </ThemedText>

        {/* Avatar + Info */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }} // placeholder avatar
            style={styles.avatar}
          />
          <ThemedText type="title" style={styles.name}>
            Arun Perera
          </ThemedText>
          <ThemedText style={styles.email}>arun.perera@email.com</ThemedText>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          <MenuItem icon="person-outline" label="Edit Profile" onPress={() => Alert.alert('Edit Profile')} />
          <MenuItem icon="settings-outline" label="Settings" onPress={() => Alert.alert('Settings')} />
          <MenuItem icon="headset-outline" label="Customer Care" onPress={() => Alert.alert('Customer Care')} />
          <MenuItem icon="help-circle-outline" label="FAQ/Help Center" onPress={() => Alert.alert('Help Center')} />
          <MenuItem icon="log-out-outline" label="Logout" logout onPress={() => Alert.alert('Logged out')} />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress, logout }: { icon: any; label: string; onPress: () => void; logout?: boolean }) {
  return (
    <Pressable style={[styles.menuItem, logout && styles.logoutItem]} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={22} color={logout ? 'red' : '#1D3D47'} />
      </View>
      <ThemedText style={[styles.menuLabel, logout && { color: 'red' }]}>{label}</ThemedText>
      <Ionicons name="chevron-forward-outline" size={20} color={logout ? 'red' : '#999'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    marginBottom: 4,
  },
  email: {
    color: '#666',
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
  },
  logoutItem: {
    backgroundColor: '#FEE2E2',
  },
});
