import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Activity, TrendingUp, ExternalLink } from 'lucide-react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function BlockchainScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactionHistory();
    generateChartData();
  }, []);

  const loadTransactionHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('transactionHistory');
      if (history) {
        const parsedHistory = JSON.parse(history);
        setTransactions(parsedHistory);
      }
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    }
  };

  const generateChartData = () => {
    // Mock chart data for demonstration
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [100, 250, 400, 350, 600, 750],
          strokeWidth: 3,
          color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`,
        },
      ],
    };
    setChartData(data);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactionHistory();
    setRefreshing(false);
  };

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Activity size={24} color="#10b981" />
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>Credit Minting</Text>
          <Text style={styles.transactionProject}>{item.projectName}</Text>
          <Text style={styles.transactionAmount}>+{item.amount} credits</Text>
        </View>
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionDate}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
          <ExternalLink size={16} color="#6b7280" />
        </View>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionHash}>
          Tx Hash: {item.txHash}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>CONFIRMED</Text>
        </View>
      </View>
    </View>
  );

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#0f766e',
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Blockchain Activity</Text>
        <Text style={styles.subtitle}>Celo Alfajores Network</Text>
      </View>

      <View style={styles.content}>
        {chartData && (
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <TrendingUp size={24} color="#0f766e" />
              <Text style={styles.chartTitle}>Credits Minted Over Time</Text>
            </View>
            <LineChart
              data={chartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{transactions.length}</Text>
            <Text style={styles.statLabel}>Total Transactions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {transactions.reduce((sum, tx) => sum + tx.amount, 0)}
            </Text>
            <Text style={styles.statLabel}>Credits Minted</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTransaction}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#14b8a6" />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Activity size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>Your blockchain activity will appear here</Text>
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
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#134e4a',
    marginLeft: 8,
  },
  chart: {
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#134e4a',
    marginBottom: 16,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#134e4a',
  },
  transactionProject: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 2,
  },
  transactionMeta: {
    alignItems: 'flex-end',
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  transactionHash: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
});