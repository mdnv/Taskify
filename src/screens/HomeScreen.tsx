import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useTheme } from '../components/ui/ThemeProvider';
import { useCategoryStore } from '../store/useCategoryStore';
import { TaskList } from '../components/tasks/TaskList';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { CategoryChip } from '../components/categories/CategoryChip';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../types';
import { DraggableTaskList } from '../components/tasks/DraggableTaskList';
import { useSettingsStore } from '../store/useSettingsStore';
import { EnhancedTaskForm } from '../components/tasks/EnhancedTaskForm';
import { HomeWidget } from '../widgets/HomeWidget';
import { useTaskStore } from '../store/useTaskStore';
import { TestTaskForm } from '../components/tasks/TestTaskForm';

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const {
    tasks,
    filters,
    isLoading,
    searchQuery,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleCompletion,
    setFilter,
    setSearchQuery,
    getFilteredTasks,
    clearCompleted,
    getOverdueTasks,
    reorderTasks,
  } = useTaskStore();

  const { categories, loadCategories } = useCategoryStore();
  const { settings, setSortBy } = useSettingsStore();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [quickTask, setQuickTask] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  const filteredTasks = getFilteredTasks();
  const overdueTasks = getOverdueTasks();

  const handleAddQuickTask = () => {
    if (quickTask.trim()) {
      addTask({
        title: quickTask.trim(),
        priority: 'medium',
      });
      setQuickTask('');
    }
  };

  const handleToggleTask = (taskId: string) => {
    toggleCompletion(taskId);
  };

  const handleOpenApp = () => {
    // Widget will use this callback when task is tapped
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'order'>) => {
    addTask(taskData);
    setIsAddModalVisible(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalVisible(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'order'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setIsEditModalVisible(false);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.isCompleted).length,
    active: tasks.filter(task => !task.isCompleted).length,
    overdue: overdueTasks.length,
  };

  const FilterButton: React.FC<{ status: 'all' | 'active' | 'completed'; label: string }> = ({ status, label }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filters.status === status ? colors.primary : colors.surface,
        },
      ]}
      onPress={() => setFilter({ status })}
    >
      <Text
        style={[
          styles.filterText,
          {
            color: filters.status === status ? '#FFFFFF' : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const PriorityFilter: React.FC<{ priority: 'low' | 'medium' | 'high'; label: string }> = ({ priority, label }) => (
    <TouchableOpacity
      style={[
        styles.priorityFilter,
        {
          backgroundColor: filters.priority === priority ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setFilter({ priority: filters.priority === priority ? undefined : priority })}
    >
      <View
        style={[
          styles.priorityDot,
          { backgroundColor: colors.primary },
        ]}
      />
      <Text
        style={[
          styles.priorityFilterText,
          {
            color: filters.priority === priority ? '#FFFFFF' : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SortOption: React.FC<{ sortKey: 'created' | 'dueDate' | 'priority' | 'manual'; label: string; icon: string }> = 
    ({ sortKey, label, icon }) => (
    <TouchableOpacity
      style={[
        styles.sortOption,
        {
          backgroundColor: settings.sortBy === sortKey ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setSortBy(sortKey)}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color={settings.sortBy === sortKey ? '#FFFFFF' : colors.text}
      />
      <Text
        style={[
          styles.sortOptionText,
          {
            color: settings.sortBy === sortKey ? '#FFFFFF' : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Main ScrollView that wraps entire content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Stats */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.title, { color: colors.text }]}>Taskify</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowSearch(!showSearch)}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <MaterialCommunityIcons
                  name="filter-variant"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats.total}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {stats.completed}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Done
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>
                {stats.active}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Active
              </Text>
            </View>
            {stats.overdue > 0 && (
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.error }]}>
                  {stats.overdue}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Overdue
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Search Bar */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search tasks..."
            />
          </View>
        )}

        {/* Enhanced Filters with Sort Options */}
        {showFilters && (
          <View style={[styles.filtersPanel, { backgroundColor: colors.surface }]}>
            <Text style={[styles.filtersTitle, { color: colors.text }]}>Filters & Sort</Text>
            
            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionLabel, { color: colors.text }]}>Sort By</Text>
              <View style={styles.sortOptions}>
                <SortOption sortKey="created" label="Recently Added" icon="clock" />
                <SortOption sortKey="dueDate" label="Due Date" icon="calendar" />
                <SortOption sortKey="priority" label="Priority" icon="flag" />
                <SortOption sortKey="manual" label="Manual" icon="drag" />
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionLabel, { color: colors.text }]}>Priority</Text>
              <View style={styles.priorityFilters}>
                <PriorityFilter priority="high" label="High" />
                <PriorityFilter priority="medium" label="Medium" />
                <PriorityFilter priority="low" label="Low" />
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionLabel, { color: colors.text }]}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryFilters}>
                  <TouchableOpacity
                    style={[
                      styles.categoryFilter,
                      {
                        backgroundColor: !filters.category ? colors.primary : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setFilter({ category: undefined })}
                  >
                    <Text
                      style={[
                        styles.categoryFilterText,
                        {
                          color: !filters.category ? '#FFFFFF' : colors.text,
                        },
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  {categories.map((category) => (
                    <CategoryChip
                      key={category.id}
                      category={category}
                      selected={filters.category === category.id}
                      onPress={() => setFilter({ 
                        category: filters.category === category.id ? undefined : category.id 
                      })}
                      size="small"
                      showCount
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[
                styles.overdueFilter,
                {
                  backgroundColor: filters.showOverdue ? colors.error : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setFilter({ showOverdue: !filters.showOverdue })}
            >
              <MaterialCommunityIcons
                name="alert"
                size={16}
                color={filters.showOverdue ? '#FFFFFF' : colors.error}
              />
              <Text
                style={[
                  styles.overdueFilterText,
                  {
                    color: filters.showOverdue ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                Show Overdue Only
              </Text>
            </TouchableOpacity>

            {(filters.priority || filters.category || filters.showOverdue || settings.sortBy !== 'created') && (
              <TouchableOpacity
                style={styles.clearFilters}
                onPress={() => {
                  setFilter({ priority: undefined, category: undefined, showOverdue: false });
                  setSortBy('created');
                }}
              >
                <Text style={[styles.clearFiltersText, { color: colors.primary }]}>
                  Clear All Filters & Sort
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Quick Add Input */}
        <View style={styles.quickAddContainer}>
          <View style={styles.inputWrapper}>
            <Input
              value={quickTask}
              onChangeText={setQuickTask}
              placeholder="Add a quick task..."
              onSubmitEditing={handleAddQuickTask}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: quickTask.trim() ? colors.primary : colors.textSecondary }
            ]}
            onPress={handleAddQuickTask}
            disabled={!quickTask.trim()}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Widget Preview */}
        <View style={[styles.widgetContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <HomeWidget 
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onOpenApp={handleOpenApp}
          />
        </View>

        {/* Filter Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <FilterButton status="all" label="All" />
          <FilterButton status="active" label="Active" />
          <FilterButton status="completed" label="Completed" />
          
          {stats.completed > 0 && (
            <TouchableOpacity
              style={[styles.clearButton, { borderColor: colors.error }]}
              onPress={clearCompleted}
            >
              <Text style={[styles.clearText, { color: colors.error }]}>
                Clear Completed
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Task List - Now inside ScrollView */}
        {settings.sortBy === 'manual' ? (
          <DraggableTaskList
            tasks={filteredTasks}
            onToggleTask={toggleCompletion}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onReorderTasks={reorderTasks}
            refreshing={isLoading}
            onRefresh={loadTasks}
          />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggleTask={toggleCompletion}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            refreshing={isLoading}
            onRefresh={loadTasks}
          />
        )}
      </ScrollView>

      {/* FAB - Outside ScrollView to stay fixed */}
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
        title="Add Test Task"
      >
        <TestTaskForm
          onSubmit={handleAddTask}
          onCancel={() => setIsAddModalVisible(false)}
        />
      </Modal>

      <Modal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        title="Add New Task"
      >
        <EnhancedTaskForm
          onSubmit={handleAddTask}
          onCancel={() => setIsAddModalVisible(false)}
        />
      </Modal>

      <Modal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingTask(null);
        }}
        title="Edit Task"
      >
        {editingTask && (
          <EnhancedTaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => {
              setIsEditModalVisible(false);
              setEditingTask(null);
            }}
          />
        )}
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Space for FAB
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filtersPanel: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    flex: 1,
    minWidth: '45%',
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  priorityFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityFilterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryFilterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  overdueFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    alignSelf: 'flex-start',
  },
  overdueFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearFilters: {
    marginTop: 8,
    padding: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 2,
  },
  inputWrapper: {
    flex: 1,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -15,
  },
  filterContainer: {
    marginBottom: 8,
    maxHeight: 48,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 50,
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  widgetContainer: {
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
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