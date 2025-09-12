// LostItemReport.js
import React, { useState } from "react";
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function LostItemReport() {
  const router = useRouter();
  const [trip, setTrip] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.description}>
            Please provide the details of your lost item. We'll do our best to
            help you find it.
          </Text>

          {/* Select Previous Trip */}
          <Text style={styles.label}>Select a Previous Trip</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="directions-bus"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <TouchableOpacity style={styles.picker}>
              <Text style={styles.pickerText}>
                {trip || "Select from your recent trips"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Item Name */}
          <Text style={styles.label}>Item Name</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="inventory-2"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <TextInput
              placeholder="e.g., Black backpack"
              style={styles.input}
            />
          </View>

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="category"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <TouchableOpacity style={styles.picker}>
              <Text style={styles.pickerText}>
                {category || "Select category"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Date of Loss */}
          <Text style={styles.label}>Date of Loss</Text>
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => setShowDate(true)}
          >
            <MaterialIcons
              name="calendar-today"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <Text style={styles.input}>
              {date.toDateString() || "Select date"}
            </Text>
          </TouchableOpacity>
          {showDate && (
            <View style={styles.datePickerContainer}>
              <Text style={styles.datePickerText}>Date picker functionality would go here</Text>
            </View>
          )}

          {/* Lost Location */}
          <Text style={styles.label}>Lost Location (Optional)</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="location-on"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <TextInput
              placeholder="e.g., Near the front seat"
              style={styles.input}
            />
          </View>

          {/* Contact Number */}
          <Text style={styles.label}>Contact Number</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="phone"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <TextInput
              placeholder="Your contact number"
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  content: { padding: 16 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 12, elevation: 1 },
  description: { color: "#4b5563", fontSize: 14, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginTop: 16 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 6,
    paddingLeft: 40,
    height: 48,
  },
  icon: { position: "absolute", left: 12 },
  input: { flex: 1, fontSize: 14, color: "#111827" },
  picker: { 
    flex: 1, 
    height: 48, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  pickerText: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  datePickerContainer: {
    padding: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginTop: 8,
  },
  datePickerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  submitBtn: {
    marginTop: 24,
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
