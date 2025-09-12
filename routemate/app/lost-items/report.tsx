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
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function LostItemReport() {
  const router = useRouter();
  const [trip, setTrip] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report a lost item</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.description}>
            Please provide the details of your lost item. We'll do our best to
            help you find it.
          </Text>

          {/* Select Previous Trip */}
          <Text style={styles.label}>Select a Previous Trip</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="directions-bus"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <Picker
              selectedValue={trip}
              onValueChange={(val) => setTrip(val)}
              style={styles.picker}
            >
              <Picker.Item label="Select from your recent trips" value="" />
              <Picker.Item
                label="Trip 12345: Route 177 - Kottawa to Kollupitiya (Yesterday)"
                value="trip_12345"
              />
              <Picker.Item
                label="Trip 67890: Route 138 - Homagama to Pettah (2 days ago)"
                value="trip_67890"
              />
              <Picker.Item
                label="Trip 54321: Route 122 - Avissawella to Colombo (Last week)"
                value="trip_54321"
              />
            </Picker>
          </View>

          {/* Item Name */}
          <Text style={styles.label}>Item Name</Text>
          <View style={styles.inputWrapper}>
            <Icon
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
            <Icon
              name="category"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <Picker
              selectedValue={category}
              onValueChange={(val) => setCategory(val)}
              style={styles.picker}
            >
              <Picker.Item label="Select category" value="" />
              <Picker.Item label="Electronics" value="electronics" />
              <Picker.Item label="Bags & Luggage" value="bags" />
              <Picker.Item label="Personal Items" value="personal" />
              <Picker.Item label="Documents" value="documents" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          {/* Date of Loss */}
          <Text style={styles.label}>Date of Loss</Text>
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => setShowDate(true)}
          >
            <Icon
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
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event: any, selectedDate: Date | undefined) => {
                setShowDate(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          {/* Lost Location */}
          <Text style={styles.label}>Lost Location (Optional)</Text>
          <View style={styles.inputWrapper}>
            <Icon
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
            <Icon
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
  picker: { flex: 1, height: 48 },
  submitBtn: {
    marginTop: 24,
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
