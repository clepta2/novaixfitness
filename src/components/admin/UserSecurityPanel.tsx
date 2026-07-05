import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import TrustScoreCard from './TrustScoreCard';
import BlockModal from './BlockModal';
import { getUserAuditHistory, getUserBlocks, blockUser, unblockUser, getTrustScore, getActiveBlocks } from '../../services/security';

const formatAction = (action: string): string => {
  const map = {
    post_created: 'Post criado', comment_made: 'Comentário', reaction_made: 'Reação',
    message_sent: 'Mensagem', story_created: 'Story', live_created: 'Live',
    check_in: 'Check-in', login: 'Login', login_failed: 'Login falhou',
    content_flagged: 'Conteúdo reportado', block_applied: 'Bloqueio aplicado',
    user_blocked: 'Bloqueou usuário', unauthorized_access: 'Acesso não autorizado',
  };
  return map[action] || action;
};

export default function UserSecurityPanel({ userId, userName, userAvatar, onClose }) {
  const [trust, setTrust] = useState(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [activeBlocks, setActiveBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [activeTab, setActiveTab] = useState('audit');

  useEffect(() => { loadData(); }, [userId]);

  const loadData = async () => {
    setLoading(true);
    const [trustData, logs, allBlocks, active] = await Promise.all([
      getTrustScore(userId), getUserAuditHistory(userId, 50),
      getUserBlocks(userId), getActiveBlocks(userId),
    ]);
    setTrust(trustData);
    setAuditLogs(logs?.logs || []);
    setBlocks(allBlocks);
    setActiveBlocks(active);
    setLoading(false);
  };

  const handleBlock = async (blockData) => {
    await blockUser(userId, null, blockData);
    setShowBlockModal(false);
    loadData();
  };

  const handleUnblock = async (blockId) => {
    await unblockUser(blockId, null);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando dados de segurança...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar name={userName} uri={userAvatar} size="md" />
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userId}>ID: {userId?.slice(0, 8)}...</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <TrustScoreCard trust={trust} />

      {activeBlocks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BLOQUEIOS ATIVOS</Text>
          {activeBlocks.map(block => (
            <View key={block.id} style={[styles.blockItem, { borderLeftColor: block.severity === 'permanent' ? COLORS.error : COLORS.secondary }]}>
              <View style={styles.blockInfo}>
                <Text style={styles.blockReason}>{block.reason}</Text>
                <Text style={styles.blockMeta}>
                  {block.severity === 'permanent' ? 'PERMANENTE' : `Até ${new Date(block.expires_at).toLocaleDateString('pt-BR')}`}
                  {' · '}{block.block_type}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleUnblock(block.id)}>
                <Ionicons name="lock-open" size={18} color={COLORS.success} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'audit' && styles.tabActive]} onPress={() => setActiveTab('audit')}>
          <Text style={[styles.tabText, activeTab === 'audit' && styles.tabTextActive]}>HISTÓRICO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'blocks' && styles.tabActive]} onPress={() => setActiveTab('blocks')}>
          <Text style={[styles.tabText, activeTab === 'blocks' && styles.tabTextActive]}>BLOQUEIOS</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'audit' ? (
        <FlatList
          data={auditLogs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <View style={[styles.logDot, { backgroundColor: item.action?.includes('block') || item.action?.includes('flag') ? COLORS.error : COLORS.primary }]} />
              <View style={styles.logInfo}>
                <Text style={styles.logAction}>{formatAction(item.action)}</Text>
                <Text style={styles.logEntity}>{item.entity_type}{item.entity_id ? ` · ${item.entity_id.slice(0, 8)}` : ''}</Text>
                <Text style={styles.logTime}>{new Date(item.created_at).toLocaleString('pt-BR')}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum registro</Text>}
        />
      ) : (
        <FlatList
          data={blocks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.blockItem, !item.is_active && styles.blockInactive]}>
              <View style={styles.blockInfo}>
                <Text style={styles.blockReason}>{item.reason}</Text>
                <Text style={styles.blockMeta}>{item.severity} · {item.block_type} · {new Date(item.created_at).toLocaleDateString('pt-BR')}</Text>
              </View>
              <Ionicons name={item.is_active ? 'lock-closed' : 'lock-open'} size={16} color={item.is_active ? COLORS.error : COLORS.success} />
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum bloqueio registrado</Text>}
        />
      )}

      <TouchableOpacity style={styles.blockBtn} onPress={() => setShowBlockModal(true)}>
        <Ionicons name="lock-closed" size={18} color={COLORS.textTitle} />
        <Text style={styles.blockBtnText}>BLOQUEAR USUÁRIO</Text>
      </TouchableOpacity>

      <BlockModal visible={showBlockModal} onClose={() => setShowBlockModal(false)} onConfirm={handleBlock} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  userName: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  userId: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: SPACING.sm },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary },
  logItem: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  logDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  logInfo: { flex: 1 },
  logAction: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle },
  logEntity: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  logTime: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  blockItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border, borderLeftWidth: 3 },
  blockInactive: { opacity: 0.5 },
  blockInfo: { flex: 1 },
  blockReason: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle },
  blockMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  blockBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error, margin: SPACING.lg, padding: SPACING.md, borderRadius: BORDER_RADIUS.full },
  blockBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.xl },
});
