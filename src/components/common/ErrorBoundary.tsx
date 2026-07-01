import { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { reportHandledError } from '../../services/crashReport';

type ErrorBoundaryProps = {
  children: ReactNode;
  screenName?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportHandledError(error, `ErrorBoundary:${this.props.screenName || 'unknown'}`);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReport = () => {
    const { error } = this.state;
    const message = encodeURIComponent(
      `Erro no app:\n${error?.message || 'Desconhecido'}\n\nComponente: ${this.props.screenName || 'N/A'}`
    );
    import('react-native').then(({ Linking }) => {
      Linking.openURL(`mailto:suporte@novaixfitness.com?subject=Reporte de Erro&body=${message}`);
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container} accessibilityLabel="Erro na tela" accessibilityRole="alert">
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.title}>Algo deu errado</Text>
          <Text style={styles.message}>{this.state.error?.message || 'Erro inesperado'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={this.handleRetry} accessibilityLabel="Tentar novamente" accessibilityRole="button">
            <Text style={styles.retryText}>TENTAR NOVAMENTE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportBtn} onPress={this.handleReport} accessibilityLabel="Reportar problema" accessibilityRole="button">
            <Text style={styles.reportText}>Reportar Problema</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginTop: SPACING.lg, textAlign: 'center' },
  message: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, marginTop: SPACING.sm, textAlign: 'center', paddingHorizontal: SPACING.lg },
  retryBtn: { marginTop: SPACING.xl, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  retryText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  reportBtn: { marginTop: SPACING.md, padding: SPACING.sm },
  reportText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textDescription, textDecorationLine: 'underline' },
});
