// src/components/ui/LegalModal.js
import { Modal, View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { styles } from '../../styles/registerStyles';

export default function LegalModal({ visible, title, content, onClose }) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBg}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <Text style={styles.modalHeader}>{title}</Text>
              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalBody}>{content}</Text>
              </ScrollView>
              <TouchableOpacity style={styles.modalBtn} onPress={onClose}>
                <Text style={styles.modalBtnText}>ENTENDI</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
