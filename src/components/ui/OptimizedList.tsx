// src/components/ui/OptimizedList.tsx// ============================================================// COMPONENTE: OptimizedList// TIPO: FlatList otimizado com configuracoes padrao// USO: Substituir FlatList em todas as listas// REGRAS: Usar em qualquer lista com 10+ itens// ============================================================
import { FlatList, FlatListProps, RefreshControl, StyleSheet  } from 'react-native'
import { COLORS  } from '../../constants/colors';
import { SPACING  } from '../../constants/spacing'
import { useColors  } from '../../context/ThemeContext';
interface OptimizedListProps<T> 
extends Omit<FlatListProps<T>, 'refreshControl'> {
 /** Dados da lista */  data: T[];
 /** Renderizar item */  renderItem: FlatListProps<T>['renderItem'];
 /** Chave unica do item */  keyExtractor: FlatListProps<T>['keyExtractor'];
 /** Se esta recarregando */  refreshing?: boolean;
 /** Callback de refresh */  onRefresh?: () => void;
 /** Se deve usar window optimization */  useWindowing?: boolean;
}/** * FlatList com otimizacoes padrao para performance. * * Otimizacoes incluidas: * - removeClippedSubviews=
true * - windowSize=5 * - maxToRenderPerBatch=10 * - initialNumToRender=10 * - getItemLayout (quando possivel) * * @example * ```tsx * <OptimizedList *   data={workouts
} *   renderItem={({
item 
}) => <WorkoutCard workout={item
} />
} *   keyExtractor={(item) => item.id
} *   refreshing={refreshing
} *   onRefresh={onRefresh
} * /> * ``` */
export 
function OptimizedList<T>({
 data, renderItem, keyExtractor, refreshing = 
false, onRefresh, useWindowing = 
true, ...props
}: OptimizedListProps<T>) {
 
const colors = useColors();
 
return (    <FlatList      data={data
}      renderItem={renderItem
}      keyExtractor={keyExtractor
}      removeClippedSubviews={useWindowing
}      windowSize={useWindowing ? 5 : 1
}      maxToRenderPerBatch={10
}      initialNumToRender={10
}      contentContainerStyle={styles.content
}      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing
} onRefresh={onRefresh
} tintColor={colors.primary
} /> : 
undefined
}      showsVerticalScrollIndicator={
false
}      {...props
}    />  );
}
const styles = StyleSheet.create({
 content: {
padding: SPACING.lg 
},
});