import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  AnimatedContainer,
  PulseAnimation,
  BouncyButton,
  FadeInOut,
} from '../animations/AnimatedComponents';

/**
 * Demo component showcasing all available animations and widget features
 * Used for development and testing purposes
 */
export const AnimationsDemo: React.FC = () => {
  const [showContent, setShowContent] = useState(true);
  const [scale] = useState(new Animated.Value(1));

  const mockTasks = [
    { id: '1', title: 'Complete project setup', isCompleted: false, priority: 'high' as const },
    { id: '2', title: 'Review pull requests', isCompleted: false, priority: 'medium' as const },
    { id: '3', title: 'Update documentation', isCompleted: true, priority: 'low' as const },
    { id: '4', title: 'Fix bug in auth', isCompleted: false, priority: 'high' as const },
  ];

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.1, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="animation" size={32} color="#6366F1" />
        <Text style={styles.title}>Animation Showcase</Text>
      </View>

      {/* Fade In Out Demo */}
      <AnimatedContainer type="slideUp" delay={100}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fade In/Out Animation</Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowContent(!showContent)}
          >
            <Text style={styles.buttonText}>
              {showContent ? 'Hide' : 'Show'} Content
            </Text>
          </TouchableOpacity>

          <FadeInOut visible={showContent} style={styles.fadeContent}>
            <View style={styles.demoBox}>
              <MaterialCommunityIcons
                name="check-circle"
                size={48}
                color="#10B981"
              />
              <Text style={styles.demoText}>Smooth Fade Animation</Text>
              <Text style={styles.demoSubtext}>
                This content fades in and out smoothly
              </Text>
            </View>
          </FadeInOut>
        </View>
      </AnimatedContainer>

      {/* Pulse Animation Demo */}
      <AnimatedContainer type="slideUp" delay={200}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pulse Animation</Text>
          <PulseAnimation style={styles.pulseContainer}>
            <View style={styles.pulseBox}>
              <MaterialCommunityIcons
                name="bell-ring"
                size={40}
                color="#F59E0B"
              />
              <Text style={styles.pulseText}>Pulsing Element</Text>
            </View>
          </PulseAnimation>
        </View>
      </AnimatedContainer>

      {/* Bouncy Button Demo */}
      <AnimatedContainer type="slideUp" delay={300}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive Bouncy Buttons</Text>
          <View style={styles.buttonGrid}>
            <BouncyButton onPress={handlePress} style={styles.bouncyButton}>
              <View style={[styles.actionButton, { backgroundColor: '#6366F1' }]}>
                <MaterialCommunityIcons name="plus" size={24} color="#fff" />
              </View>
            </BouncyButton>

            <BouncyButton onPress={handlePress} style={styles.bouncyButton}>
              <View style={[styles.actionButton, { backgroundColor: '#10B981' }]}>
                <MaterialCommunityIcons name="check" size={24} color="#fff" />
              </View>
            </BouncyButton>

            <BouncyButton onPress={handlePress} style={styles.bouncyButton}>
              <View style={[styles.actionButton, { backgroundColor: '#EF4444' }]}>
                <MaterialCommunityIcons name="trash-can" size={24} color="#fff" />
              </View>
            </BouncyButton>

            <BouncyButton onPress={handlePress} style={styles.bouncyButton}>
              <View style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}>
                <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
              </View>
            </BouncyButton>
          </View>
        </View>
      </AnimatedContainer>

      {/* Scale Animation Demo */}
      <AnimatedContainer type="scaleIn" delay={400}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scale Animation</Text>
          <Animated.View style={[styles.scaleBox, { transform: [{ scale }] }]}>
            <MaterialCommunityIcons
              name="star"
              size={64}
              color="#F59E0B"
            />
            <Text style={styles.scaleText}>Press bouncy buttons to scale</Text>
          </Animated.View>
        </View>
      </AnimatedContainer>

      {/* Task List Animation */}
      <AnimatedContainer type="slideUp" delay={500}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Animated Task List</Text>
          <View style={styles.taskList}>
            {mockTasks.map((task, index) => (
              <AnimatedContainer
                key={task.id}
                type="slideUp"
                delay={600 + index * 50}
              >
                <View
                  style={[
                    styles.taskItem,
                    task.isCompleted && styles.taskItemCompleted,
                  ]}
                >
                  <View
                    style={[
                      styles.taskPriority,
                      {
                        backgroundColor:
                          task.priority === 'high'
                            ? '#EF4444'
                            : task.priority === 'medium'
                            ? '#F59E0B'
                            : '#10B981',
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.taskTitle,
                      task.isCompleted && styles.taskTitleCompleted,
                    ]}
                  >
                    {task.title}
                  </Text>
                  <MaterialCommunityIcons
                    name={
                      task.isCompleted
                        ? 'check-circle'
                        : 'check-circle-outline'
                    }
                    size={20}
                    color={task.isCompleted ? '#10B981' : '#CBD5E1'}
                  />
                </View>
              </AnimatedContainer>
            ))}
          </View>
        </View>
      </AnimatedContainer>

      {/* Info Card */}
      <AnimatedContainer type="slideUp" delay={700}>
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons
              name="information"
              size={24}
              color="#6366F1"
            />
            <Text style={styles.infoTitle}>Animation Tips</Text>
          </View>
          <Text style={styles.infoText}>
            • All animations use native drivers for 60fps performance
          </Text>
          <Text style={styles.infoText}>
            • Customize delays and durations in AnimatedContainer
          </Text>
          <Text style={styles.infoText}>
            • Use AnimatedContainer for entrance animations
          </Text>
          <Text style={styles.infoText}>
            • Combine multiple animations for complex effects
          </Text>
        </View>
      </AnimatedContainer>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  toggleButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  fadeContent: {
    marginTop: 12,
  },
  demoBox: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
  },
  demoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 8,
  },
  demoSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  pulseContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  pulseBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    width: 120,
    height: 120,
    justifyContent: 'center',
  },
  pulseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 8,
  },
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 12,
  },
  bouncyButton: {
    alignItems: 'center',
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scaleBox: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    marginTop: 12,
  },
  scaleText: {
    fontSize: 12,
    color: '#1E293B',
    marginTop: 12,
    fontWeight: '600',
  },
  taskList: {
    gap: 8,
    marginTop: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E2E8F0',
  },
  taskItemCompleted: {
    opacity: 0.6,
  },
  taskPriority: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  taskTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  infoText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
    lineHeight: 18,
  },
  spacer: {
    height: 40,
  },
});
