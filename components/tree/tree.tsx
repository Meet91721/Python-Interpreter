import Tree from 'react-d3-tree';

import { NODE } from '../outputs/parser';

export default function ReactD3Tree({ tree }: { tree: NODE }) {
  return (
    <Tree
      data={tree}
      orientation={"vertical"}
    />
  );
}
