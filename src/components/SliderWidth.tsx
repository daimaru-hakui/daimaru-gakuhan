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
  width: number;
};

const SliderWidth: NextPage<Props> = ({ tableWidth, setTableWidth, width }) => {
  return (
    <Slider
      defaultValue={width}
      min={width}
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
