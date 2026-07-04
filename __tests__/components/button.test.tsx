import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/ui/Button';

describe('Button Component', () => {
  it('deve renderizar com título', () => {
    const { getByText } = render(<Button title="TESTAR" onPress={() => {}} />);
    expect(getByText('TESTAR')).toBeTruthy();
  });

  it('deve chamar onPress ao pressionar', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="CLICAR" onPress={onPress} />);
    fireEvent.press(getByText('CLICAR'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar variante primary por padrão', () => {
    const { getByText } = render(<Button title="BOTÃO" onPress={() => {}} />);
    const button = getByText('BOTÃO');
    expect(button).toBeTruthy();
  });

  it('deve renderizar variante secondary', () => {
    const { getByText } = render(<Button title="SECUNDÁRIO" onPress={() => {}} variant="secondary" />);
    expect(getByText('SECUNDÁRIO')).toBeTruthy();
  });

  it('deve renderizar variante danger', () => {
    const { getByText } = render(<Button title="PERIGO" onPress={() => {}} variant="danger" />);
    expect(getByText('PERIGO')).toBeTruthy();
  });

  it('deve renderizar variante ghost', () => {
    const { getByText } = render(<Button title="FANTASMA" onPress={() => {}} variant="ghost" />);
    expect(getByText('FANTASMA')).toBeTruthy();
  });

  it('deve renderizar variante google', () => {
    const { getByText } = render(<Button title="GOOGLE" onPress={() => {}} variant="google" />);
    expect(getByText('GOOGLE')).toBeTruthy();
  });

  it('deve renderizar variante apple', () => {
    const { getByText } = render(<Button title="APPLE" onPress={() => {}} variant="apple" />);
    expect(getByText('APPLE')).toBeTruthy();
  });

  it('deve desabilitar quando loading', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button title="CARREGANDO" onPress={onPress} loading={true} />);
    const button = getByRole('button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('deve desabilitar quando disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="DESABILITADO" onPress={onPress} disabled={true} />);
    fireEvent.press(getByText('DESABILITADO'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('deve aceitar tamanho sm', () => {
    const { getByText } = render(<Button title="PEQUENO" onPress={() => {}} size="sm" />);
    expect(getByText('PEQUENO')).toBeTruthy();
  });

  it('deve aceitar tamanho lg', () => {
    const { getByText } = render(<Button title="GRANDE" onPress={() => {}} size="lg" />);
    expect(getByText('GRANDE')).toBeTruthy();
  });
});
