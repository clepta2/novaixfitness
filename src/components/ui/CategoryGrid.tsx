// src/components/ui/CategoryGrid.tsx
// Grid de categorias reutilizavel - NOVAIX FITNESS


import { View, StyleSheet } from 'react-native'

import { SPACING } from '../../constants/spacing';

import { CategoryChip } from './CategoryChip';


interface CategoryGridProps {
  categories: Array<
{ key: string; label: string; icon?: string }>;
  selected: string | null;
  onSelect: (key: string | null) => void;

}

export function CategoryGrid(
{ categories, selected, onSelect }: CategoryGridProps) 
{
return ( <View style=
{styles.grid
}>
      
{categories.map((cat) => ( <CategoryChip
          key=
{cat.key
}
          label=
{cat.label
}
          icon=
{cat.icon
}
          isSelected=
{selected === cat.key
}
          onPress=
{() => onSelect(selected === cat.key ? null : cat.key)
}
        />
      ))
}
    </View>
  );
}


const styles = StyleSheet.create(
{
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },

});
