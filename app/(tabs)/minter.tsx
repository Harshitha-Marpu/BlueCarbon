import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreditCard, Plus, Activity } from 'lucide-react-native';
import { api, Project } from '@/utils/api';

interface Transaction {
  id: number;
  projectId: number;
  projectName: string;
  amount: number;
  txHash: string;
  timestamp: string;
  status: string;
}

export default function MinterScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mintAmount, setMintAmount] = useState('100');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadProjects();
    loadTransactionHistory();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsData = await api.getProjects();
      setProjects(projectsData);
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0]);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      Alert.alert('Error', 'Failed to load projects');
    }
  };

  const loadTransactionHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('transactionHistory');
      if (history) {
        setTransactions(JSON.parse(history));
      }
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    }
  };

  const saveTransaction = async (transaction: Transaction) => {
    try {
      const history = [...transactions, transaction];
      setTransactions(history);
      await AsyncStorage.setItem('transactionHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const mintCredits = async (projectId: number, amount: number) => {
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await api.mintCredits({ project_id: projectId, amount });
      
      const transaction: Transaction = {
        id: Date.now(),
        projectId,
        projectName: projects.find(p => p.project_id === projectId)?.project_name,
        amount,
        txHash: response.txHash,
        timestamp: new Date().toISOString(),
        status: response.status
      };

      await saveTransaction(transaction);
      
      Alert.alert(
        'Success!', 
        `Minted ${amount} credits successfully!\nTx Hash: ${response.txHash.substring(0, 20)}...`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Minting failed:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to mint credits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProject = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={[styles.projectCard, selectedProject?.project_id === item.project_id && styles.selectedCard]}
      onPress={() => setSelectedProject(item)}
    >
      <View style={styles.cardHeader}>
        <CreditCard size={32} color="#0f766e" />
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.project_name}</Text>
          <Text style={styles.projectType}>{item.project_type}</Text>
          <Text style={styles.availableCredits}>{item.balances.circulating} credits available</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Activity size={24} color="#10b981" />
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionProject}>{item.projectName}</Text>
          <Text style={styles.transactionAmount}>+{item.amount} credits</Text>
          <Text style={styles.transactionHash}>Tx: {item.txHash.substring(0, 20)}...</Text>
        </View>
        <Text style={styles.transactionDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Credit Minter</Text>
        <Text style={styles.subtitle}>Mint carbon credits on Celo Alfajores</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select Project</Text>
        <FlatList
          data={projects}
          keyExtractor={(item) => item.project_id.toString()}
          renderItem={renderProject}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.projectList}
          ListEmptyComponent={
            <View style={styles.emptyProjectsContainer}>
              <Text style={styles.emptyText}>No projects available</Text>
            </View>
          }
        />

        {selectedProject && (
          <View style={styles.mintSection}>
            <Text style={styles.sectionTitle}>Mint Amount</Text>
            <TextInput
              style={styles.amountInput}
              value={mintAmount}
              onChangeText={setMintAmount}
              placeholder="Enter amount to mint"
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.mintButton, loading && styles.mintButtonDisabled]}
              onPress={() => mintCredits(selectedProject.project_id, parseInt(mintAmount))}
              disabled={loading}
            >
              <Plus size={24} color="#ffffff" />
              <Text style={styles.mintButtonText}>
                {loading ? 'Minting...' : `Mint ${mintAmount} Credits`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTransaction}
          style={styles.transactionList}
          ListEmptyComponent={
            <View style={styles.emptyTransactionsContainer}>
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>Mint some credits to see transaction history</Text>
            </View>
          }
        />
      </View>
    </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccfbf1',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#134e4a',
    marginBottom: 12,
    marginTop: 16,
  },
  projectList: {
    marginBottom: 20,
  },
  emptyProjectsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  emptyTransactionsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#14b8a6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectInfo: {
    marginLeft: 12,
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#134e4a',
  },
  projectType: {
    fontSize: 14,
    color: '#5eead4',
    backgroundColor: '#0f766e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  availableCredits: {
    fontSize: 14,
    color: '#0d9488',
    marginTop: 4,
  },
  mintSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  mintButton: {
    backgroundColor: '#0f766e',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mintButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  mintButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  transactionList: {
    flex: 1,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  transactionProject: {
    fontSize: 16,
    fontWeight: '500',
    color: '#134e4a',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  transactionHash: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
  },
});