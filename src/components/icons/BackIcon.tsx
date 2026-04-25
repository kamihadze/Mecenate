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
      d="M15 6L9 12L15 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
