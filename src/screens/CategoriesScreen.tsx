import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useTheme } from '../components/ui/ThemeProvider';
import { EmptyState } from '../components/ui/EmptyState';
import { useCategoryStore } from '../store/useCategoryStore';
import { useTaskStore } from '../store/useTaskStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { CategoryChip } from '../components/categories/CategoryChip';
import { CategoryForm } from '../components/categories/CategoryForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category } from '../types';
import { BackupRestore } from '../components/backup/BackupRestore'; // Phase 3: Import BackupRestore

export const CategoriesScreen: React.FC = () => {
  const { colors } = useTheme();
  const { categories, loadCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { getTasksByCategory } = useTaskStore();
  const { settings, toggleTheme } = useSettingsStore();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showBackup, setShowBackup] = useState(false); // Phase 3: Backup modal state

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = (categoryData: Omit<Category, 'id' | 'taskCount'>) => {
    addCategory(categoryData);
    setIsAddModalVisible(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalVisible(true);
  };

  const handleUpdateCategory = (categoryData: Omit<Category, 'id' | 'taskCount'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      setIsEditModalVisible(false);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.taskCount > 0) {
      alert('Cannot delete category with tasks. Please reassign or delete the tasks first.');
      return;
    }
    deleteCategory(category.id);
  };

  // Phase 3: Get category analytics data
  const getCategoryAnalytics = (categoryId: string) => {
    const tasks = getTasksByCategory(categoryId);
    const completed = tasks.filter(task => task.isCompleted).length;
    const total = tasks.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      completed,
      total,
      completionRate
    };
  };

  if (categories.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="folder-outline"
          title="No Categories"
          message="Create your first category to organize tasks!"
        />
        <View style={styles.createButton}>
          <Button
            title="Create Category"
            onPress={() => setIsAddModalVisible(true)}
            fullWidth
          />
        </View>
        
        {/* Phase 3: Add backup option even when no categories exist */}
        <View style={styles.dataManagementSection}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>Data Management</Text>
          <TouchableOpacity
            style={[styles.settingButton, { backgroundColor: colors.surface }]}
            onPress={() => setShowBackup(true)}
          >
            <MaterialCommunityIcons
              name="backup-restore"
              size={24}
              color={colors.primary}
            />
            <View style={styles.settingButtonContent}>
              <Text style={[styles.settingButtonTitle, { color: colors.text }]}>
                Backup & Restore
              </Text>
              <Text style={[styles.settingButtonSubtitle, { color: colors.textSecondary }]}>
                Manage your data backups
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Categories</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Organize your tasks with categories
          </Text>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => {
            const analytics = getCategoryAnalytics(category.id);
            
            return (
              <View key={category.id} style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
                <View style={styles.categoryHeader}>
                  <CategoryChip
                    category={category}
                    size="large"
                    showCount
                  />
                  <View style={styles.categoryActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditCategory(category)}
                    >
                      <MaterialCommunityIcons
                        name="pencil"
                        size={18}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteCategory(category)}
                    >
                      <MaterialCommunityIcons
                        name="delete"
                        size={18}
                        color={colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Phase 3: Enhanced category stats with progress */}
                <View style={styles.categoryStats}>
                  <View style={styles.statRow}>
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                      {category.taskCount} task{category.taskCount !== 1 ? 's' : ''}
                    </Text>
                    {analytics.total > 0 && (
                      <Text style={[styles.completionText, { color: colors.success }]}>
                        {analytics.completionRate.toFixed(0)}% complete
                      </Text>
                    )}
                  </View>
                  
                  {/* Phase 3: Progress bar for completion rate */}
                  {analytics.total > 0 && (
                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            backgroundColor: category.color,
                            width: `${analytics.completionRate}%` 
                          }
                        ]} 
                      />
                    </View>
                  )}
                  
                  {/* Phase 3: Quick stats */}
                  {analytics.total > 0 && (
                    <View style={styles.quickStats}>
                      <View style={styles.quickStat}>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={12}
                          color={colors.success}
                        />
                        <Text style={[styles.quickStatText, { color: colors.textSecondary }]}>
                          {analytics.completed} done
                        </Text>
                      </View>
                      <View style={styles.quickStat}>
                        <MaterialCommunityIcons
                          name="progress-clock"
                          size={12}
                          color={colors.warning}
                        />
                        <Text style={[styles.quickStatText, { color: colors.textSecondary }]}>
                          {analytics.total - analytics.completed} pending
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Phase 3: Enhanced Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>Appearance</Text>
          <TouchableOpacity
            style={[styles.settingButton, { backgroundColor: colors.surface }]}
            onPress={toggleTheme}
          >
            <MaterialCommunityIcons
              name={settings.theme === 'light' ? 'weather-night' : 'weather-sunny'}
              size={24}
              color={colors.primary}
            />
            <View style={styles.settingButtonContent}>
              <Text style={[styles.settingButtonTitle, { color: colors.text }]}>
                {settings.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={[styles.settingButtonSubtitle, { color: colors.textSecondary }]}>
                Switch to {settings.theme === 'light' ? 'dark' : 'light'} theme
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Phase 3: Data Management Section */}
        <View style={styles.dataManagementSection}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>Data Management</Text>
          
          <TouchableOpacity
            style={[styles.settingButton, { backgroundColor: colors.surface }]}
            onPress={() => setShowBackup(true)}
          >
            <MaterialCommunityIcons
              name="backup-restore"
              size={24}
              color={colors.primary}
            />
            <View style={styles.settingButtonContent}>
              <Text style={[styles.settingButtonTitle, { color: colors.text }]}>
                Backup & Restore
              </Text>
              <Text style={[styles.settingButtonSubtitle, { color: colors.textSecondary }]}>
                Manage your data backups
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingButton, { backgroundColor: colors.surface }]}
            onPress={() => {
              // Phase 3: Export categories report
              const categoriesReport = categories.map(cat => {
                const analytics = getCategoryAnalytics(cat.id);
                return {
                  name: cat.name,
                  taskCount: cat.taskCount,
                  completed: analytics.completed,
                  completionRate: analytics.completionRate,
                  color: cat.color
                };
              });
              console.log('Categories Report:', categoriesReport);
              alert('Categories report logged to console. Check developer tools.');
            }}
          >
            <MaterialCommunityIcons
              name="chart-box"
              size={24}
              color={colors.warning}
            />
            <View style={styles.settingButtonContent}>
              <Text style={[styles.settingButtonTitle, { color: colors.text }]}>
                Categories Report
              </Text>
              <Text style={[styles.settingButtonSubtitle, { color: colors.textSecondary }]}>
                View category analytics
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Phase 3: Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: colors.surface }]}
              onPress={() => setIsAddModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                New Category
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: colors.surface }]}
              onPress={() => {
                // Phase 3: Quick category cleanup
                const emptyCategories = categories.filter(cat => cat.taskCount === 0);
                if (emptyCategories.length > 0) {
                  alert(`Found ${emptyCategories.length} empty categories that can be deleted.`);
                } else {
                  alert('No empty categories found.');
                }
              }}
            >
              <MaterialCommunityIcons
                name="broom"
                size={20}
                color={colors.warning}
              />
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                Clean Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setIsAddModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modals */}
      <Modal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        title="Create Category"
      >
        <CategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setIsAddModalVisible(false)}
        />
      </Modal>

      <Modal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingCategory(null);
        }}
        title="Edit Category"
      >
        {editingCategory && (
          <CategoryForm
            category={editingCategory}
            onSubmit={handleUpdateCategory}
            onCancel={() => {
              setIsEditModalVisible(false);
              setEditingCategory(null);
            }}
          />
        )}
      </Modal>

      {/* Phase 3: Backup & Restore Modal */}
      <Modal
        visible={showBackup}
        onClose={() => setShowBackup(false)}
        title="Backup & Restore"
      >
        <BackupRestore />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  categoriesGrid: {
    gap: 12,
    marginBottom: 32,
  },
  categoryCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  categoryStats: {
    alignItems: 'flex-start',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
  },
  completionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    width: '100%',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickStatText: {
    fontSize: 12,
  },
  settingsSection: {
    marginBottom: 24,
  },
  dataManagementSection: {
    marginBottom: 24,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 8,
  },
  settingButtonContent: {
    flex: 1,
  },
  settingButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingButtonSubtitle: {
    fontSize: 14,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  createButton: {
    margin: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});