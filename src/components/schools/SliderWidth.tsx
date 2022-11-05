import React from 'react';
import { NextPage } from 'next';
import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';

type Props = {
  tableWidth: number;
  setTableWidth: Function;
};

const SliderWidth: NextPage<Props> = ({ tableWidth, setTableWidth }) => {
  return (
    <Slider
      defaultValue={1200}
      min={1200}
      max={3500}
      value={tableWidth}
      onChange={(e: any) => setTableWidth(e)}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
};

export default SliderWidth;
