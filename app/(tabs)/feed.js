// app/(tabs)/feed.js
// Tela de Comunidade/Feed - NOVAIX FITNESS

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';

const feedPosts = [
  {
    id: '1',
    user: 'Carlos Silva',
    time: '2h atrás',
    content: 'Completei meu treino de pernas hoje! 💪',
    likes: 24,
    comments: 5,
  },
  {
    id: '2',
    user: 'Maria Santos',
    time: '5h atrás',
    content: 'Streak de 30 dias! Não pare! 🔥',
    likes: 56,
    comments: 12,
  },
];

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>COMUNIDADE</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Posts */}
        {feedPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Ionicons name="person-circle" size={40} color={COLORS.primary} />
              <View style={styles.postUserInfo}>
                <Text style={styles.postUserName}>{post.user}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="heart-outline" size={20} color={COLORS.textMuted} />
                <Text style={styles.postActionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="chatbubble-outline" size={20} color={COLORS.textMuted} />
                <Text style={styles.postActionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="share-outline" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="barbell" size={24} color={COLORS.textMuted} />
          <Text style={styles.tabLabel}>Treinos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="people" size={24} color={COLORS.primary} />
          <Text style={styles.tabLabel}>Comunidade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person" size={24} color={COLORS.textMuted} />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 24,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
  },
  addButton: {
    padding: 4,
  },
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postUserInfo: {
    marginLeft: 12,
  },
  postUserName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  postTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  postContent: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textTitle,
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postActionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
