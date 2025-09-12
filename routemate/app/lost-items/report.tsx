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
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

export default function LostItemReport() {
  const router = useRouter();
  const { t } = useTranslation();
  const [trip, setTrip] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.description}>{t('lostReportIntro')}</Text>

          {/* Select Previous Trip */}
          <Text style={styles.label}>{t('selectPreviousTrip')}</Text>
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
              <Picker.Item label={t('selectFromRecentTrips')} value="" />
              <Picker.Item
                label={t('tripSample1')}
                value="trip_12345"
              />
              <Picker.Item
                label={t('tripSample2')}
                value="trip_67890"
              />
              <Picker.Item
                label={t('tripSample3')}
                value="trip_54321"
              />
            </Picker>
          </View>

          {/* Item Name */}
          <Text style={styles.label}>{t('itemName')}</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="inventory-2"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <TextInput
              placeholder={t('itemNamePlaceholder')}
              style={styles.input}
            />
          </View>

          {/* Category */}
          <Text style={styles.label}>{t('category')}</Text>
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
              <Picker.Item label={t('selectCategory')} value="" />
              <Picker.Item label={t('categoryElectronics')} value="electronics" />
              <Picker.Item label={t('categoryBags')} value="bags" />
              <Picker.Item label={t('categoryPersonal')} value="personal" />
              <Picker.Item label={t('categoryDocuments')} value="documents" />
              <Picker.Item label={t('categoryOther')} value="other" />
            </Picker>
          </View>

          {/* Date of Loss */}
          <Text style={styles.label}>{t('dateOfLoss')}</Text>
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
              {date.toDateString() || t('selectDate')}
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
          <Text style={styles.label}>{t('lostLocationOptional')}</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="location-on"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <TextInput
              placeholder={t('lostLocationPlaceholder')}
              style={styles.input}
            />
          </View>

          {/* Contact Number */}
          <Text style={styles.label}>{t('contactNumber')}</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="phone"
              size={20}
              color="#9ca3af"
              style={styles.icon}
            />
            <TextInput
              placeholder={t('yourContactNumber')}
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitText}>{t('submitReport')}</Text>
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
