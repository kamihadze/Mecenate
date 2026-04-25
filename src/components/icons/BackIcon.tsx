import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/tokens';

interface Props {
  size?: number;
  color?: string;
}

export const BackIcon: React.FC<Props> = ({ size = 24, color = colors.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 6L10 12L16 18"
      stroke={color}
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
