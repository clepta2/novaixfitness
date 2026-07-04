// src/components/ui/ErrorState.tsx// Estado de erro reutilizávelimport React  from 'react';
import { View, Text, StyleSheet, ViewStyle  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing';
import { Button  } from './Button'
import { useColors  } from '../../context/ThemeContext';
interface ErrorStateProps {
 title?: string;
 message?: string;
 onRetry?: () => void;
 style?: ViewStyle;
}
export 
function ErrorState({
 title = 'Algo deu errado',  message = 'Tente novamente mais tarde',  onRetry,  style,
}: ErrorStateProps) {
 
const colors = useColors();
return (    <View style={[styles.container, style]
}>      <View style={styles.iconWrap
}>        <Ionicons name="alert-circle-outline" size={48
} color={colors.error
} />      </View>      <Text style={styles.title
}>{title
}</Text>      <Text style={styles.message
}>{message
}</Text>      {onRetry && (        <Button          title="TENTAR NOVAMENTE"          onPress={onRetry
}          variant="secondary"          size="sm"          style={styles.button
}          icon={
undefined as any
}          loading={
false
}          disabled={
false
}        />      )
}    </View>  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, gap: SPACING.md,
  },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.error + '15', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle, textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, textAlign: 'center', lineHeight: 20,
  },
  button: {
    marginTop: SPACING.sm,
  },
});