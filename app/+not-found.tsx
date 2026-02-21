import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography, Spacing } from '../src/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.section,
    backgroundColor: Colors.background,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
  },
  link: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  linkText: {
    ...Typography.body1,
    color: Colors.primary,
  },
});
