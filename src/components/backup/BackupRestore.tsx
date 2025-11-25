import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { useTaskStore } from '../../store/useTaskStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { Button } from '../common/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

export const BackupRestore: React.FC = () => {
  const { colors } = useTheme();
  const { exportData, importData, tasks } = useTaskStore();
  const { categories } = useCategoryStore();
  
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      
      const data = exportData();
      const jsonString = JSON.stringify(data, null, 2);
      const fileName = `Taskify_Backup_${new Date().toISOString().split('T')[0]}.json`;
      
      if (Platform.OS === 'web') {
        // For web - create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // For mobile - save to file and share
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, jsonString);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('Backup Created', `Backup saved to: ${fileUri}`);
        }
      }
      
      Alert.alert('Success', 'Backup created successfully!');
    } catch (error) {
      console.error('Backup error:', error);
      Alert.alert('Error', 'Failed to create backup');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    try {
      Alert.alert(
        'Restore Backup',
        'This will replace all your current data. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Restore', 
            style: 'destructive',
            onPress: async () => {
              setIsRestoring(true);
              
              const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
              });

              if (!result.canceled && result.assets && result.assets.length > 0) {
                try {
                  const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
                  const backupData = JSON.parse(fileContent);
                  
                  // Validate backup data structure
                  if (!backupData.tasks || !backupData.categories || !backupData.settings) {
                    throw new Error('Invalid backup file format');
                  }
                  
                  importData(backupData);
                  Alert.alert('Success', 'Data restored successfully!');
                } catch (parseError) {
                  Alert.alert('Error', 'Invalid backup file format');
                }
              }
              
              setIsRestoring(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore backup');
      setIsRestoring(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      let csvContent = 'Title,Description,Priority,Category,Completed,Due Date,Created At\n';
      
      if (tasks && Array.isArray(tasks)) {
        tasks.forEach(task => {
          const category = categories.find(cat => cat.id === task.categoryId);
          const row = [
            `"${task.title.replace(/"/g, '""')}"`,
            `"${(task.description || '').replace(/"/g, '""')}"`,
            task.priority,
            category?.name || '',
            task.isCompleted ? 'Yes' : 'No',
            task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
            task.createdAt.toISOString().split('T')[0]
          ].join(',');
          
          csvContent += row + '\n';
        });
      }

      const fileName = `Taskify_Export_${new Date().toISOString().split('T')[0]}.csv`;
      
      if (Platform.OS === 'web') {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, csvContent);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
      }
      
      Alert.alert('Success', 'CSV export completed!');
    } catch (error) {
      console.error('CSV export error:', error);
      Alert.alert('Error', 'Failed to export CSV');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Backup & Restore</Text>
      
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="backup-restore" size={24} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Backup Data</Text>
        </View>
        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
          Create a backup of all your tasks, categories, and settings
        </Text>
        <Button
          title="Create Backup"
          onPress={handleBackup}
          loading={isBackingUp}
          fullWidth
        />
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="database-import" size={24} color={colors.warning} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Restore Data</Text>
        </View>
        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
          Restore your data from a previous backup file
        </Text>
        <Button
          title="Restore Backup"
          onPress={handleRestore}
          loading={isRestoring}
          variant="outline"
          fullWidth
        />
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="file-export" size={24} color={colors.success} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Export to CSV</Text>
        </View>
        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
          Export your tasks to CSV format for use in other applications
        </Text>
        <Button
          title="Export CSV"
          onPress={handleExportCSV}
          variant="secondary"
          fullWidth
        />
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <MaterialCommunityIcons name="information" size={20} color={colors.textSecondary} />
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Your data is stored locally on your device. Regular backups are recommended.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});