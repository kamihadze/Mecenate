import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors, sizes } from '../theme/tokens';

interface Props {
  uri: string;
  size?: number;
}

export const Avatar: React.FC<Props> = ({ uri, size = sizes.avatar }) => (
  <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
    <Image
      source={{ uri }}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      transition={150}
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.skeleton,
  },
});
