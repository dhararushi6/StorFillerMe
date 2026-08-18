import { TextInput, StyleSheet } from 'react-native';

import { COLORS } from '../constants/colors';

import { INPUT_THEME } from '../constants/theme';

type Props = {
  placeholder: string;

  value: string;

  onChangeText: (text: string) => void;
};

export default function AuthInput({ placeholder, value, onChangeText }: Props) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: INPUT_THEME.height,

    borderWidth: INPUT_THEME.borderWidth,

    borderColor: COLORS.inputBorder,

    borderRadius: INPUT_THEME.borderRadius,

    paddingHorizontal: INPUT_THEME.paddingHorizontal,

    marginBottom: INPUT_THEME.marginBottom,

    backgroundColor: COLORS.inputBackground,
  },
});
