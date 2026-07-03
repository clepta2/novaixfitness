// src/components/ui/ReelsModal.tsx// Modal fullscreen de reels com FlatList paginada - NOVAIX FITNESSimport React  from 'react';
import { View, Modal, FlatList, Dimensions, StyleSheet, Text  } from 'react-native'
import { COLORS  } from '../../constants/colors';
import { useColors  } from '../../context/ThemeContext';
const {
height: SCREEN_HEIGHT 
} = Dimensions.get('window');
interface Reel {
 id: string;
 title?: string;
 [key: string]: unknown;
}
interface ReelsModalProps {
 visible: boolean;
 reels: Reel[];
 activeIndex: number;
 onIndexChange: (index: number) => void;
 onClose: () => void;
}
function ReelItem({
item, isPlaying 
}: {
item: Reel;
isPlaying: boolean 
}) {
 
const colors = useColors();
 
return (    <View style={reelStyles.container
}>      <Text style={reelStyles.title
}>{item.title || 'Reel'
}</Text>    </View>  );
}
const reelStyles = StyleSheet.create({
 container: {
flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' 
},  title: {
color: colors.textTitle, fontSize: 18, fontFamily: 'Inter_600SemiBold' 
},
});
export 
function ReelsModal({
visible, reels, activeIndex, onIndexChange, onClose 
}: ReelsModalProps) {
 
if (!visible || activeIndex === 
null) 
return 
null;
 
return (    <Modal visible={visible
} animationType="slide" transparent>      <View style={styles.container
}>        <FlatList          data={reels
}          keyExtractor={(item) => item.id
}          initialScrollIndex={activeIndex
}          getItemLayout={(_, index) => ({
length: SCREEN_HEIGHT, offset: SCREEN_HEIGHT * index, index 
})
}          pagingEnabled          showsVerticalScrollIndicator={
false
}          onMomentumScrollEnd={(e) => onIndexChange(Math.round(e.nativeEvent.contentOffset.y / SCREEN_HEIGHT))
}          renderItem={({
item, index 
}) => (            <ReelItem item={item
} isPlaying={index === activeIndex
} />          )
}        />      </View>    </Modal>  );
}
const styles = StyleSheet.create({
 container: {
flex: 1, backgroundColor: 'black', position: 'relative' 
},
});