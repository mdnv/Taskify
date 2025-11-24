import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../components/ui/ThemeProvider';
import { useTaskStore } from '../store/useTaskStore';
import { useCategoryStore } from '../store/useCategoryStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const AnalyticsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { getAnalyticsData } = useTaskStore();
  const { categories } = useCategoryStore();

  const analytics = getAnalyticsData();

  const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = 
    ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon as any} size={24} color="#FFFFFF" />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );

  const ProgressBar: React.FC<{ label: string; value: number; max: number; color: string }> = 
    ({ label, value, max, color }) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.progressValue, { color: colors.textSecondary }]}>
          {value}/{max}
        </Text>
      </View>
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              backgroundColor: color,
              width: `${(value / max) * 100}%` 
            }
          ]} 
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Track your productivity and progress
        </Text>
      </View>

      {/* Overview Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Tasks"
          value={analytics.totalTasks}
          icon="format-list-checks"
          color={colors.primary}
        />
        <StatCard
          title="Completed"
          value={analytics.completedTasks}
          icon="check-circle"
          color={colors.success}
        />
        <StatCard
          title="Completion Rate"
          value={`${analytics.completionRate.toFixed(1)}%`}
          icon="trending-up"
          color={colors.warning}
        />
        <StatCard
          title="Avg. Time"
          value={`${Math.round(analytics.averageCompletionTime / (1000 * 60 * 60 * 24))}d`}
          icon="clock"
          color={colors.secondary}
        />
      </View>

      {/* Priority Distribution */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tasks by Priority</Text>
        <ProgressBar
          label="High Priority"
          value={analytics.tasksByPriority.high}
          max={analytics.totalTasks}
          color={colors.error}
        />
        <ProgressBar
          label="Medium Priority"
          value={analytics.tasksByPriority.medium}
          max={analytics.totalTasks}
          color={colors.warning}
        />
        <ProgressBar
          label="Low Priority"
          value={analytics.tasksByPriority.low}
          max={analytics.totalTasks}
          color={colors.success}
        />
      </View>

      {/* Category Performance */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Category Performance</Text>
        {analytics.tasksByCategory.map((item) => {
          const category = categories.find(cat => cat.id === item.categoryId);
          if (!category || item.count === 0) return null;
          
          const completionRate = item.count > 0 ? (item.completed / item.count) * 100 : 0;
          
          return (
            <View key={item.categoryId} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View 
                    style={[
                      styles.categoryColor, 
                      { backgroundColor: category.color }
                    ]} 
                  />
                  <Text style={[styles.categoryName, { color: colors.text }]}>
                    {category.name}
                  </Text>
                </View>
                <Text style={[styles.completionRate, { color: colors.textSecondary }]}>
                  {completionRate.toFixed(0)}%
                </Text>
              </View>
              <ProgressBar
                label={`${item.completed} completed of ${item.count}`}
                value={item.completed}
                max={item.count}
                color={category.color}
              />
            </View>
          );
        })}
      </View>

      {/* Weekly Progress */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Progress</Text>
        <View style={styles.weeklyGrid}>
          {analytics.weeklyCompletion.map((day, index) => (
            <View key={day.date} style={styles.dayColumn}>
              <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
                {new Date(day.date).toLocaleDateString('en', { weekday: 'narrow' })}
              </Text>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.completedBar,
                    { 
                      height: `${Math.min(day.completed * 20, 100)}%`,
                      backgroundColor: colors.success
                    }
                  ]} 
                />
                <View 
                  style={[
                    styles.createdBar,
                    { 
                      height: `${Math.min(day.created * 20, 100)}%`,
                      backgroundColor: colors.primary
                    }
                  ]} 
                />
              </View>
              <View style={styles.dayStats}>
                <Text style={[styles.dayStat, { color: colors.success }]}>{day.completed}</Text>
                <Text style={[styles.dayStat, { color: colors.primary }]}>{day.created}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Created</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 48) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  completionRate: {
    fontSize: 12,
    fontWeight: '600',
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  barContainer: {
    height: 100,
    width: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 2,
  },
  completedBar: {
    width: 8,
    borderRadius: 4,
  },
  createdBar: {
    width: 8,
    borderRadius: 4,
  },
  dayStats: {
    marginTop: 4,
    alignItems: 'center',
  },
  dayStat: {
    fontSize: 10,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
  },
});