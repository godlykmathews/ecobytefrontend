import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, FlatList, 
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Utensils, Clock, Plus, User, ArrowRight, LogOut, CheckCircle } from 'lucide-react-native';

/**
 * FASTAPI CONNECTED VERSION (OTP ENABLED)
 * IMPORTANT: Replace the IP address below with your laptop's local IP address.
 * You can find it by running 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux) in your terminal.
 */
const API_URL = 'https://ecobyte-weld.vercel.app'; 

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash'); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [foodItems, setFoodItems] = useState([]);
  const [formData, setFormData] = useState({});
  
  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpId, setOtpId] = useState(null);

  useEffect(() => {
    if (currentScreen === 'splash') {
      setTimeout(() => setCurrentScreen('roleSelection'), 2500);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen === 'custDashboard') {
      fetchListings();
    }
  }, [currentScreen]);

  // --- API HELPER ---
  const fetchListings = async () => {
    try {
      const response = await fetch(`${API_URL}/listings`);
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Connection Error', 'Ensure backend is running on port 8081');
    }
  };

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setFormData({});
    setOtpSent(false);
    setOtpId(null);
    setCurrentScreen('roleSelection');
  };

  // --- AUTHENTICATION ACTIONS (OTP FLOW) ---

  const handleLoginSendOTP = async () => {
    if (!formData.phone) return Alert.alert('Error', 'Enter phone number');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await response.json();
      
      if (response.ok) {
        setOtpId(data.otp_id);
        setOtpSent(true);
        // In a real app, you wouldn't show this alert. This is for dev/testing only.
        Alert.alert('OTP Sent', `Your Debug OTP is: ${data.dev_otp}`); 
      } else {
        Alert.alert('Error', data.detail || 'User not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Network Error. Check IP and Port.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ otp_id: otpId, otp: formData.otp })
      });
      const data = await response.json();

      if (response.ok && data.auth_token) {
        setCurrentUser(data.user);
        if (data.user.role === 'owner') setCurrentScreen('restDashboard');
        else setCurrentScreen('custDashboard');
        setFormData({});
        setOtpSent(false);
      } else {
        Alert.alert('Error', 'Invalid OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Verification Failed');
    }
  };

  // --- REGISTRATION ACTIONS ---

  const handleOwnerRegister = async () => {
    try {
      // Using FormData because the backend expects Form fields for owners
      const form = new FormData();
      form.append('phone', formData.phone);
      form.append('restaurant_name', formData.restName);
      form.append('owner_name', formData.ownerName);
      form.append('location', formData.location);
      form.append('fssai', formData.fssai);

      const response = await fetch(`${API_URL}/auth/register/owner`, {
        method: 'POST',
        body: form
      });
      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        setCurrentScreen('restDashboard');
        setFormData({});
      } else {
        Alert.alert('Registration Failed', data.detail);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not register');
    }
  };

  const handleCustomerRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/register/customer`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          phone: formData.phone,
          name: formData.name,
          location: formData.location,
          role: 'customer'
        })
      });
      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        setCurrentScreen('custDashboard');
        setFormData({});
      } else {
        Alert.alert('Registration Failed', data.detail);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not register');
    }
  };

  // --- LISTING ACTION ---

  const handleAddListing = async () => {
    try {
      // Matching the Pydantic model 'ListingCreate'
      const payload = {
        item: formData.itemName,
        description: "Fresh food available",
        originalPrice: parseFloat(formData.originalPrice),
        discountedPrice: parseFloat(formData.discountedPrice),
        hoursValid: parseInt(formData.hoursValid) || 24,
        category: "General"
      };

      const response = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Alert.alert('Success', 'Food Item Listed!');
        setFormData({});
      } else {
        Alert.alert('Error', 'Failed to list item');
      }
    } catch (error) {
      Alert.alert('Error', 'Network Error');
    }
  };

  // --- UI SCREENS ---

  const SplashScreen = () => (
    <View style={styles.splashContainer}>
      <Utensils size={80} color="#fff" />
      <Text style={styles.splashTitle}>EcoBite</Text>
      <Text style={styles.splashSubtitle}>Powered by FastAPI</Text>
    </View>
  );

  const RoleSelectionScreen = () => (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Welcome Back</Text>
      <TouchableOpacity style={[styles.roleCard, {backgroundColor:'#E3F2FD'}]} onPress={() => setCurrentScreen('login')}>
        <User size={32} color="#1565C0"/>
        <Text style={styles.roleTitle}>Login (OTP)</Text>
      </TouchableOpacity>
      
      <Text style={styles.subHeader}>New here? Register as:</Text>
      <View style={{flexDirection:'row', gap:10}}>
        <TouchableOpacity style={styles.smallCard} onPress={() => setCurrentScreen('custRegister')}>
          <User size={24} color="#333"/>
          <Text>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallCard} onPress={() => setCurrentScreen('ownerRegister')}>
          <Utensils size={24} color="#333"/>
          <Text>Restaurant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const LoginScreen = () => (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Login with OTP</Text>
      <View style={styles.formContainer}>
        <TextInput 
          placeholder="Phone Number" 
          keyboardType="phone-pad" 
          style={styles.input} 
          onChangeText={t => updateForm('phone', t)} 
          editable={!otpSent}
        />
        {otpSent && (
          <TextInput 
            placeholder="Enter OTP" 
            keyboardType="number-pad" 
            style={styles.input} 
            onChangeText={t => updateForm('otp', t)} 
          />
        )}
        
        {!otpSent ? (
          <TouchableOpacity style={styles.primaryButton} onPress={handleLoginSendOTP}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify & Login</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={() => handleLogout()} style={{marginTop:20}}>
          <Text style={{textAlign:'center', color:'#666'}}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const OwnerRegisterScreen = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Restaurant Sign Up</Text>
      <View style={styles.formContainer}>
        <TextInput placeholder="Phone" keyboardType="phone-pad" style={styles.input} onChangeText={t => updateForm('phone', t)} />
        <TextInput placeholder="Restaurant Name" style={styles.input} onChangeText={t => updateForm('restName', t)} />
        <TextInput placeholder="Owner Name" style={styles.input} onChangeText={t => updateForm('ownerName', t)} />
        <TextInput placeholder="Location" style={styles.input} onChangeText={t => updateForm('location', t)} />
        <TextInput placeholder="FSSAI Number" style={styles.input} onChangeText={t => updateForm('fssai', t)} />
        <TouchableOpacity style={styles.primaryButton} onPress={handleOwnerRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('roleSelection')}>
          <Text style={styles.linkText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const CustomerRegisterScreen = () => (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Customer Sign Up</Text>
      <View style={styles.formContainer}>
        <TextInput placeholder="Phone" keyboardType="phone-pad" style={styles.input} onChangeText={t => updateForm('phone', t)} />
        <TextInput placeholder="Your Name" style={styles.input} onChangeText={t => updateForm('name', t)} />
        <TextInput placeholder="Location" style={styles.input} onChangeText={t => updateForm('location', t)} />
        <TouchableOpacity style={styles.primaryButton} onPress={handleCustomerRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('roleSelection')}>
          <Text style={styles.linkText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const RestaurantDashboard = () => (
    <View style={styles.container}>
      <View style={styles.dashHeader}>
        <Text style={styles.dashName}>{currentUser?.restaurant_name}</Text>
        <TouchableOpacity onPress={handleLogout}><LogOut size={24} color="#D32F2F" /></TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Add Food Item</Text>
      <View style={styles.addItemCard}>
        <TextInput placeholder="Item Name" style={styles.input} onChangeText={t => updateForm('itemName', t)} />
        <View style={styles.row}>
          <TextInput placeholder="Original Price" keyboardType="numeric" style={[styles.halfInput]} onChangeText={t => updateForm('originalPrice', t)} />
          <TextInput placeholder="Discount Price" keyboardType="numeric" style={[styles.halfInput]} onChangeText={t => updateForm('discountedPrice', t)} />
        </View>
        <TextInput placeholder="Hours Valid (e.g. 4)" keyboardType="numeric" style={styles.input} onChangeText={t => updateForm('hoursValid', t)} />
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddListing}>
          <Plus size={20} color="#fff" />
          <Text style={styles.buttonText}>List Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CustomerDashboard = () => (
    <View style={styles.container}>
      <View style={styles.dashHeader}>
        <Text style={styles.dashName}>Hello, {currentUser?.name}</Text>
        <TouchableOpacity onPress={handleLogout}><LogOut size={24} color="#D32F2F" /></TouchableOpacity>
      </View>
      <FlatList
        data={foodItems}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.listingCard}>
            <View style={styles.row}>
              <Text style={styles.restName}>{item.restaurant}</Text>
              <Text style={styles.expiry}>{item.hoursValid}h left</Text>
            </View>
            <Text style={styles.itemName}>{item.item}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{item.discountedPrice}</Text>
              <Text style={styles.oldPrice}>₹{item.originalPrice}</Text>
              <TouchableOpacity style={styles.claimButton} onPress={() => Alert.alert('Success', 'Reserved')}>
                <Text style={{color:'#fff', fontWeight:'bold'}}>Claim</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        {currentScreen === 'splash' && <SplashScreen />}
        {currentScreen === 'roleSelection' && <RoleSelectionScreen />}
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'custRegister' && <CustomerRegisterScreen />}
        {currentScreen === 'ownerRegister' && <OwnerRegisterScreen />}
        {currentScreen === 'restDashboard' && <RestaurantDashboard />}
        {currentScreen === 'custDashboard' && <CustomerDashboard />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FA' },
  container: { flex: 1, padding: 20 },
  splashContainer: { flex: 1, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  splashTitle: { fontSize: 40, fontWeight: 'bold', color: '#fff', marginTop: 20 },
  splashSubtitle: { fontSize: 16, color: '#E8F5E9', marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 20 },
  subHeader: { fontSize: 16, color: '#666', marginTop: 20, marginBottom: 10 },
  formContainer: { marginTop: 10 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#eee', fontSize: 16 },
  halfInput: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#eee', fontSize: 16, flex: 1, marginHorizontal: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  primaryButton: { backgroundColor: '#1E88E5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  addButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  linkText: { color: '#1E88E5', textAlign: 'center', marginTop: 20, fontSize: 16 },
  roleCard: { padding: 20, borderRadius: 16, alignItems: 'center', flexDirection: 'row', gap: 15, marginBottom: 20 },
  smallCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 16, alignItems: 'center', gap: 10, elevation: 2 },
  roleTitle: { fontSize: 18, fontWeight: 'bold', color: '#1565C0' },
  dashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  dashName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  addItemCard: { backgroundColor: '#fff', padding: 15, borderRadius: 16, elevation: 2 },
  listingCard: { backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 15, elevation: 3 },
  restName: { fontSize: 14, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
  itemName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#4CAF50' },
  oldPrice: { fontSize: 16, color: '#999', textDecorationLine: 'line-through' },
  claimButton: { backgroundColor: '#4CAF50', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginLeft: 'auto' },
  expiry: { fontSize: 12, color: '#E65100', fontWeight: 'bold', backgroundColor: '#FFF3E0', padding: 4, borderRadius: 4 }
});