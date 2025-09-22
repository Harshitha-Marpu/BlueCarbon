import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { Settings, Plus, CreditCard as Edit3, Trash2, ChartBar as BarChart3 } from 'lucide-react-native';

interface Project {
  project_id: number;
  project_name: string;
  credits: number;
  project_type: string;
  status: string;
  balances: {
    circulating: number;
  };
}

const mockProjects: Project[] = [
  {
    project_id: 1,
    project_name: "Coastal Mangrove Restoration",
    credits: 1000,
    project_type: "mangrove",
    status: "active",
    balances: { circulating: 1000 }
  },
  {
    project_id: 2,
    project_name: "Seagrass Meadow Conservation",
    credits: 500,
    project_type: "seagrass",
    status: "active",
    balances: { circulating: 500 }
  },
  {
    project_id: 3,
    project_name: "Salt Marsh Protection",
    credits: 750,
    project_type: "marsh",
    status: "inactive",
    balances: { circulating: 750 }
  },
];

export default function AdminScreen() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    project_name: '',
    project_type: 'mangrove',
    credits: '',
    status: 'active'
  });

  const resetForm = () => {
    setFormData({
      project_name: '',
      project_type: 'mangrove',
      credits: '',
      status: 'active'
    });
    setEditingProject(null);
  };

  const handleAddProject = () => {
    if (!formData.project_name || !formData.credits) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newProject: Project = {
      project_id: Date.now(),
      project_name: formData.project_name,
      credits: parseInt(formData.credits),
      project_type: formData.project_type,
      status: formData.status,
      balances: { circulating: parseInt(formData.credits) }
    };

    setProjects([...projects, newProject]);
    setShowAddModal(false);
    resetForm();
    Alert.alert('Success', 'Project added successfully');
  };

  const handleEditProject = () => {
    if (!editingProject || !formData.project_name || !formData.credits) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const updatedProjects = projects.map(p => 
      p.project_id === editingProject.project_id 
        ? {
            ...p,
            project_name: formData.project_name,
            project_type: formData.project_type,
            credits: parseInt(formData.credits),
            status: formData.status,
            balances: { circulating: parseInt(formData.credits) }
          }
        : p
    );

    setProjects(updatedProjects);
    setShowAddModal(false);
    resetForm();
    Alert.alert('Success', 'Project updated successfully');
  };

  const handleDeleteProject = (projectId: number) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProjects(projects.filter(p => p.project_id !== projectId));
            Alert.alert('Success', 'Project deleted successfully');
          }
        }
      ]
    );
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      project_name: project.project_name,
      project_type: project.project_type,
      credits: project.credits.toString(),
      status: project.status
    });
    setShowAddModal(true);
  };

  const totalCredits = projects.reduce((sum, p) => sum + p.credits, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage blue carbon projects</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <BarChart3 size={32} color="#10b981" />
            <Text style={styles.statValue}>{totalCredits.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Credits</Text>
          </View>
          <View style={styles.statCard}>
            <Settings size={32} color="#3b82f6" />
            <Text style={styles.statValue}>{activeProjects}</Text>
            <Text style={styles.statLabel}>Active Projects</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <Plus size={24} color="#ffffff" />
            <Text style={styles.addButtonText}>Add New Project</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>All Projects</Text>
        {projects.map((project) => (
          <View key={project.project_id} style={styles.projectCard}>
            <View style={styles.projectHeader}>
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{project.project_name}</Text>
                <Text style={styles.projectType}>{project.project_type}</Text>
                <Text style={styles.projectCredits}>{project.credits} credits</Text>
              </View>
              <View style={styles.projectActions}>
                <View style={[styles.statusBadge, { backgroundColor: project.status === 'active' ? '#10b981' : '#6b7280' }]}>
                  <Text style={styles.statusText}>{project.status.toUpperCase()}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => openEditModal(project)}
                  >
                    <Edit3 size={16} color="#0f766e" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, { borderColor: '#ef4444' }]}
                    onPress={() => handleDeleteProject(project.project_id)}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Project Name</Text>
            <TextInput
              style={styles.input}
              value={formData.project_name}
              onChangeText={(text) => setFormData({...formData, project_name: text})}
              placeholder="Enter project name"
            />

            <Text style={styles.inputLabel}>Project Type</Text>
            <View style={styles.typeButtons}>
              {['mangrove', 'seagrass', 'marsh'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, formData.project_type === type && styles.selectedTypeButton]}
                  onPress={() => setFormData({...formData, project_type: type})}
                >
                  <Text style={[styles.typeButtonText, formData.project_type === type && styles.selectedTypeButtonText]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Credits</Text>
            <TextInput
              style={styles.input}
              value={formData.credits}
              onChangeText={(text) => setFormData({...formData, credits: text})}
              placeholder="Enter number of credits"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Status</Text>
            <View style={styles.statusButtons}>
              {['active', 'inactive'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusButton, formData.status === status && styles.selectedStatusButton]}
                  onPress={() => setFormData({...formData, status})}
                >
                  <Text style={[styles.statusButtonText, formData.status === status && styles.selectedStatusButtonText]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={editingProject ? handleEditProject : handleAddProject}
            >
              <Text style={styles.submitButtonText}>
                {editingProject ? 'Update Project' : 'Add Project'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccfbf1',
  },
  content: {
    padding: 20,
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
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#0f766e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#134e4a',
    marginBottom: 16,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectInfo: {
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
  projectCredits: {
    fontSize: 14,
    color: '#0d9488',
    marginTop: 4,
  },
  projectActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#0f766e',
    borderRadius: 6,
    padding: 6,
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f0fdfa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#0f766e',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalClose: {
    fontSize: 16,
    color: '#ccfbf1',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#134e4a',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#0f766e',
    borderColor: '#0f766e',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedTypeButtonText: {
    color: '#ffffff',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedStatusButton: {
    backgroundColor: '#0f766e',
    borderColor: '#0f766e',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedStatusButtonText: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#0f766e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});