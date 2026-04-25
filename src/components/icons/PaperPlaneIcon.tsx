import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/tokens';

interface Props {
  size?: number;
  color?: string;
}

export const PaperPlaneIcon: React.FC<Props> = ({
  size = 30,
  color = colors.primarySoft,
}) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path
      d="M5.625 6.094l18.75 8.281c.836.37.836 1.481 0 1.85l-18.75 8.281c-.79.349-1.624-.435-1.323-1.247l2.49-6.732c.107-.288.367-.49.673-.527L17 15l-11.535-.999a.79.79 0 01-.673-.527l-2.49-6.732c-.301-.812.534-1.596 1.323-1.248z"
      fill={color}
    />
  </Svg>
);
