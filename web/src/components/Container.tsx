// Components
import { Flex, FlexProps } from "@primer/components";

const Container: React.FC<FlexProps> = ({ children, ...props }) => {
  return (
    <Flex justifyContent="center" width="100%">
      <Flex width="65rem" flexDirection="column" {...props}>
        {children}
      </Flex>
    </Flex>
  );
};

export default Container;
