// src/components/ui/CenteredModal.tsx// Modal centralizado reutilizavel - NOVAIX FITNESS
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing';
import { SHADOWS  } from '../../constants/shadows'
import { useColors  } from '../../context/ThemeContext';
const {
width: SCREEN_WIDTH 
} = Dimensions.get('window');
interface CenteredModalProps {
 visible: boolean;
 onClose: () => void;
 title?: string;
 children: React.ReactNode;
 width?: number | string;
}
export 
function CenteredModal({
visible, onClose, title, children, width = '85%' 
}: CenteredModalProps) {
 
const colors = useColors();
return (    <Modal visible={visible
} transparent animationType="fade" onRequestClose={onClose
}>      <TouchableOpacity style={styles.overlay
} activeOpacity={1
} onPress={onClose
}>        <View style={[styles.container, {
width 
} as any]
} onStartShouldSetResponder={() => 
true
}>          {title && (            <View style={styles.header
}>              <Text style={styles.title
}>{title
}</Text>              <TouchableOpacity onPress={onClose
} style={styles.closeBtn
}>                <Ionicons name="close" size={18
} color={colors.textMuted
} />              </TouchableOpacity>            </View>          )
}          {children
}        </View>      </TouchableOpacity>    </Modal>  );
}
const styles = StyleSheet.create({
 overlay: {
   flex: 1,    backgroundColor: 'rgba(0,0,0,0.6)',    justifyContent: 'center',    alignItems: 'center',    padding: SPACING.xl,  
},  container: {
   backgroundColor: COLORS.surface,    borderRadius: BORDER_RADIUS.xl,    padding: SPACING.xl,    ...SHADOWS.lg,  
},  header: {
   flexDirection: 'row',    justifyContent: 'space-between',    alignItems: 'center',    marginBottom: SPACING.lg,  
},  title: {
   fontFamily: 'Montserrat_700Bold',    fontSize: 16,    color: COLORS.textTitle,  
},  closeBtn: {
   width: 28,    height: 28,    borderRadius: 14,    backgroundColor: COLORS.surfaceElevated,    justifyContent: 'center',    alignItems: 'center',  
},
});