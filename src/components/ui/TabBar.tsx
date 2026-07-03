// src/components/ui/TabBar.tsx// Barra de tabs horizontal scrollavel - NOVAIX FITNESS
import { View, Text, TouchableOpacity, ScrollView, StyleSheet  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing';
import { useColors  } from '../../context/ThemeContext';
interface Tab {
 id: string;
 label: string;
 icon?: string;
}
interface TabBarProps {
 tabs: Tab[];
 activeTab: string;
 onSelect: (id: string) => void;
}
export 
function TabBar({
tabs, activeTab, onSelect 
}: TabBarProps) {
 
const colors = useColors();
return (    <ScrollView horizontal showsHorizontalScrollIndicator={
false
} style={styles.scroll
}>      <View style={styles.tabs
}>        {tabs.map((tab) => (          <TouchableOpacity            key={tab.id
}            style={[styles.tab, activeTab === tab.id && styles.tabActive]
}            onPress={() => onSelect(tab.id)
}          >            {tab.icon && (              <Ionicons                name={tab.icon as any
}                size={16
}                color={activeTab === tab.id ? colors.primary : colors.textMuted
}              />            )
}            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]
}>              {tab.label
}            </Text>          </TouchableOpacity>        ))
}      </View>    </ScrollView>  );
}
const styles = StyleSheet.create({
 scroll: {
paddingHorizontal: SPACING.lg 
},  tabs: {
flexDirection: 'row', gap: SPACING.xs 
},  tab: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: colors.border 
},  tabActive: {
backgroundColor: colors.primary, borderColor: colors.primary 
},  tabText: {
fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.textMuted 
},  tabTextActive: {
color: colors.background 
},
});