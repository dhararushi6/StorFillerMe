import React, { useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

const COLORS = {
  background: '#F7F3E8',
  primary: '#D15C29',
  text: '#111111',
  secondaryText: '#666666',
  border: '#E7D8CB',
  white: '#FFFFFF',
};

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyScreen() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));

  const [timer, setTimer] = useState(RESEND_SECONDS);

  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((current) => current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const updateOtp = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, '');

    if (!cleanValue) {
      const updatedOtp = [...otp];
      updatedOtp[index] = '';
      setOtp(updatedOtp);
      return;
    }

    const updatedOtp = [...otp];

    cleanValue.split('').forEach((digit, offset) => {
      const targetIndex = index + offset;

      if (targetIndex < OTP_LENGTH) {
        updatedOtp[targetIndex] = digit;
      }
    });

    setOtp(updatedOtp);

    const nextIndex = Math.min(index + cleanValue.length, OTP_LENGTH - 1);

    inputs.current[nextIndex]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) {
      return;
    }

    setOtp(Array(OTP_LENGTH).fill(''));
    setTimer(RESEND_SECONDS);
    inputs.current[0]?.focus();

    // Later this is where your real OTP API call can go.
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== OTP_LENGTH) {
      return;
    }

    router.push('/(auth)/shop-detail');
  };

  const formattedTimer = `00:${String(timer).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>

            <View style={styles.progressContainer}>
              <View style={styles.activeProgress} />
              <View style={styles.activeProgress} />
              <View style={styles.inactiveProgress} />
              <View style={styles.inactiveProgress} />
            </View>

            <Pressable onPress={() => router.replace('/(auth)')} style={styles.headerButton}>
              <Text style={styles.closeIcon}>×</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Verify your{'\n'}number</Text>

            <Text style={styles.subtitle}>
              We've sent a 6-digit code to <Text style={styles.phoneNumber}>+91 xxxxx xxxxx</Text>
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => updateOtp(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  style={styles.otpInput}
                />
              ))}
            </View>

            <Pressable onPress={handleResend} disabled={timer > 0}>
              <Text style={styles.resendText}>
                Resend code in <Text style={styles.timer}>{formattedTimer}</Text>
              </Text>
            </Pressable>

            {timer === 0 && (
              <Pressable onPress={handleResend}>
                <Text style={styles.resendButton}>Resend code</Text>
              </Pressable>
            )}
          </View>
        </View>

        <Pressable
          style={[styles.button, otp.join('').length !== OTP_LENGTH && styles.buttonDisabled]}
          disabled={otp.join('').length !== OTP_LENGTH}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },

  header: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerButton: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    fontSize: 34,
    color: COLORS.text,
  },

  closeIcon: {
    fontSize: 29,
    color: COLORS.text,
  },

  progressContainer: {
    flexDirection: 'row',
    gap: 7,
  },

  activeProgress: {
    width: 19,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },

  inactiveProgress: {
    width: 19,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#EDE8DD',
  },

  content: {
    paddingTop: 25,
  },

  title: {
    color: COLORS.text,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '500',
  },

  subtitle: {
    marginTop: 7,
    color: COLORS.secondaryText,
    fontSize: 12,
    lineHeight: 18,
  },

  phoneNumber: {
    color: COLORS.primary,
  },

  otpContainer: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 28,
  },

  otpInput: {
    width: 40,
    height: 52,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 20,
  },

  resendText: {
    marginTop: 14,
    fontSize: 11,
    color: COLORS.secondaryText,
  },

  timer: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  resendButton: {
    marginTop: 8,
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },

  button: {
    height: 48,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
