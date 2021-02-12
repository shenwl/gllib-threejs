import * as React from 'react';
import SingleModelScene from '../singleModelScene';

interface ModelContainerProps {
  modelUrl: string;
  [key: string]: any;
}

export default function ModelContainer(props: ModelContainerProps) {
  const { ...restProps } = props;

  return (
    <SingleModelScene {...restProps} />
  )
}