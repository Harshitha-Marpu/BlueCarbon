import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LogOut, Award, TrendingUp, Wallet } from 'lucide-react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: 'Demo User',
    email: 'demo@bluecarbon.org',
    role: 'Minter',
    joinDate: '2024-01-15',
    totalCredits: 2500,
    projectsContributed: 5
  });
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadStats = async () => {
    try {
      const transactionHistory = await AsyncStorage.getItem('transactionHistory');
      if (transactionHistory) {
        const transactions = JSON.parse(transactionHistory);
        const totalMinted = transactions.reduce((sum: number, tx: any) => sum + tx.amount, 0);
        setUser(prev => ({ ...prev, totalCredits: totalMinted }));
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['authToken', 'userData']);
            // Navigate to login - in a real app this would use navigation
            Alert.alert('Success', 'Logged out successfully');
          }
        }
      ]
    );
  };

  const StatCard = ({ icon, title, value, subtitle }: any) => (
    <View style={styles.statCard}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User size={60} color="#0f766e" />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role}</Text>
          </View>
          <Text style={styles.joinDate}>
            Member since {new Date(user.joinDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon={<Award size={32} color="#10b981" />}
            title="Total Credits"
            value={user.totalCredits.toLocaleString()}
            subtitle="Minted"
          />
          <StatCard
            icon={<TrendingUp size={32} color="#3b82f6" />}
            title="Projects"
            value={user.projectsContributed}
            subtitle="Contributed"
          />
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Wallet size={24} color="#0f766e" />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Wallet Settings</Text>
              <Text style={styles.menuItemSubtitle}>Manage your blockchain wallet</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <TrendingUp size={24} color="#0f766e" />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Transaction History</Text>
              <Text style={styles.menuItemSubtitle}>View all your transactions</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdfa',
  },
  header: {
    backgroundColor: '#0f766e',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#134e4a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#5eead4',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#0f766e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  roleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  joinDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#134e4a',
    marginTop: 8,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#134e4a',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});