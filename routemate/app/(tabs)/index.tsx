import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Welcome Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcome}>Welcome back, Ravi</Text>
            <Text style={styles.subtext}>Let's start your next journey.</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Traveler Rank */}
        <TouchableOpacity style={styles.rankCard}>
          <Text style={styles.rankTitle}>Traveler Rank</Text>
          <View style={styles.rankRow}>
            <Text style={styles.rankLevel}>Bronze</Text>
            <View style={styles.rankPoints}>
              <Ionicons name="ribbon-outline" size={18} color="#fff" />
              <Text style={styles.rankPts}>1,250 pts</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.rankNote}>
            You're 750 points away from Silver rank!
          </Text>
        </TouchableOpacity>

        {/* Nearest Bus Stop */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearest Bus Stop</Text>
          <TouchableOpacity style={styles.busStopCard}>
            <Ionicons name="bus-outline" size={28} color="#0066ff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.busStopName}>Colombo Fort</Text>
              <Text style={styles.busStopUpdate}>Updated just now</Text>
            </View>
            <Text style={styles.busStopDistance}>500m</Text>
            <Ionicons name="refresh-outline" size={20} color="#0066ff" />
          </TouchableOpacity>
        </View>

        {/* Recent Journeys */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Journeys</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.journeyCard}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1583422409516-2895c17a04ec",
                }}
                style={styles.journeyImg}
              />
              <Text style={styles.journeyText}>Kandy to Colombo</Text>
              <Text style={styles.journeySub}>Bus 123</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.journeyCard}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
                }}
                style={styles.journeyImg}
              />
              <Text style={styles.journeyText}>Galle to Matara</Text>
              <Text style={styles.journeySub}>Bus 456</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notificationCard}>
            <Ionicons name="notifications-outline" size={28} color="#f5a623" />
            <View style={{ flex: 1 }}>
              <Text style={styles.notificationTitle}>Route 789 Update</Text>
              <Text style={styles.notificationMsg}>
                A new schedule has been published.
              </Text>
            </View>
            <Text style={styles.notificationTime}>2h</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scroll: { padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcome: { fontSize: 22, fontWeight: "700", color: "#111" },
  subtext: { fontSize: 14, color: "#777" },
  settingsBtn: {
    backgroundColor: "#eee",
    borderRadius: 20,
    padding: 6,
  },

  // Traveler rank
  rankCard: {
    backgroundColor: "#a86f32",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  rankTitle: { color: "#fff", fontSize: 13 },
  rankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankLevel: { fontSize: 20, fontWeight: "700", color: "#fff" },
  rankPoints: { flexDirection: "row", alignItems: "center" },
  rankPts: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  progressBar: {
    backgroundColor: "#885528",
    height: 6,
    borderRadius: 4,
    marginVertical: 8,
  },
  progressFill: {
    width: "40%",
    backgroundColor: "#ffd700",
    height: 6,
    borderRadius: 4,
  },
  rankNote: { color: "#fff", fontSize: 12 },

  // Sections
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },

  // Nearest bus stop
  busStopCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    elevation: 1,
  },
  busStopName: { fontSize: 16, fontWeight: "600" },
  busStopUpdate: { fontSize: 12, color: "#888" },
  busStopDistance: {
    color: "#0066ff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },

  // Recent journeys
  journeyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    width: 160,
    overflow: "hidden",
  },
  journeyImg: { width: "100%", height: 90 },
  journeyText: { fontWeight: "600", fontSize: 14, marginTop: 6, marginLeft: 6 },
  journeySub: { fontSize: 12, color: "#666", marginLeft: 6, marginBottom: 6 },

  // Notifications
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  seeAll: { color: "#0066ff", fontWeight: "500" },
  notificationCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    elevation: 1,
  },
  notificationTitle: { fontWeight: "600", fontSize: 15 },
  notificationMsg: { color: "#666", fontSize: 13 },
  notificationTime: { fontSize: 12, color: "#888", marginLeft: 8 },
});
