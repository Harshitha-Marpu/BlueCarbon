import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Waves, TreePine, Flower2 } from 'lucide-react-native';
import { api, Project } from '@/utils/api';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const projectsData = await api.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      Alert.alert('Error', 'Failed to load projects');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'mangrove':
        return <TreePine size={40} color="#14b8a6" />;
      case 'seagrass':
        return <Waves size={40} color="#0d9488" />;
      case 'marsh':
        return <Flower2 size={40} color="#0f766e" />;
      default:
        return <TreePine size={40} color="#14b8a6" />;
    }
  };

  const renderProject = ({ item }: { item: Project }) => (
    <TouchableOpacity style={styles.projectCard}>
      <View style={styles.projectHeader}>
        {getProjectIcon(item.project_type)}
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.project_name}</Text>
          <Text style={styles.projectType}>
            {item.project_type.charAt(0).toUpperCase() + item.project_type.slice(1)} Project
          </Text>
        </View>
        <View style={styles.creditsContainer}>
          <Text style={styles.creditsAmount}>{item.balances.circulating}</Text>
          <Text style={styles.creditsLabel}>Credits</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#10b981' : '#6b7280' }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && projects.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Blue Carbon Projects</Text>
        <Text style={styles.subtitle}>Coastal Ecosystem Carbon Credits</Text>
      </View>
      
      <FlatList
        data={projects}
        keyExtractor={(item) => item.project_id.toString()}
        renderItem={renderProject}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#14b8a6" />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active projects found</Text>
            <Text style={styles.emptySubtext}>Pull to refresh</Text>
          </View>
        }
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
    marginLeft: 16,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#134e4a',
    marginBottom: 4,
  },
  projectType: {
    fontSize: 14,
    color: '#5eead4',
    backgroundColor: '#0f766e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  creditsContainer: {
    alignItems: 'center',
  },
  creditsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f766e',
  },
  creditsLabel: {
    fontSize: 12,
    color: '#5eead4',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});