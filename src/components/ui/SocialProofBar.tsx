// src/components/ui/SocialProofBar.tsx// Barra de prova social (numeros + divisores) - NOVAIX FITNESS
import { View, Text, StyleSheet  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing';
import { SHADOWS  } from '../../constants/shadows'
import { useColors  } from '../../context/ThemeContext';
interface SocialProofItem {
 value?: string;
 label: string;
 stars?: boolean;
}
interface SocialProofBarProps {
 items: SocialProofItem[];
}
export 
function SocialProofBar({
items 
}: SocialProofBarProps) {
 
const colors = useColors();
return (    <View style={styles.container
}>      {items.map((item, i) => (        <View key={i
} style={styles.itemGroup
}>          {i > 0 && <View style={styles.divider
} />
}          <View style={styles.item
}>            {item.stars ? (              <View style={styles.starsRow
}>                {[1, 2, 3, 4, 5].map(s => (                  <Ionicons key={s
} name="star" size={12
} color={colors.primary
} />                ))
}              </View>            ) : (              <Text style={styles.value
}>{item.value
}</Text>            )
}            <Text style={styles.label
}>{item.label
}</Text>          </View>        </View>      ))
}    </View>  );
}
const styles = StyleSheet.create({
 container: {
flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: colors.border, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, width: '100%', justifyContent: 'space-around', ...SHADOWS.sm 
},  itemGroup: {
flexDirection: 'row', alignItems: 'center' 
},  divider: {
width: 1, height: 32, backgroundColor: colors.border, marginHorizontal: SPACING.md 
},  item: {
alignItems: 'center', flex: 1 
},  value: {
fontFamily: 'Montserrat_800ExtraBold', fontSize: 18, color: colors.primary 
},  label: {
fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textMuted, marginTop: 2, textAlign: 'center' 
},  starsRow: {
flexDirection: 'row', gap: 2, marginBottom: 2 
},
});