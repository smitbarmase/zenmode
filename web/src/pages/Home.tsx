import {
  Box,
  Button,
  ButtonPrimary,
  Dialog,
  Flex,
  Heading,
  TextInput,
  Text,
} from "@primer/components";
import { gql, Reference } from "@apollo/client";

// Graphql
import { MeQuery, useCreatePodMutation, User } from "../generated/graphql";

// Hooks
import useInputModal from "../hooks/useInputModal";

// Components
import Container from "../components/Container";
import Pods from "../components/home/Pods";
import Invites from "../components/home/Invites";
import UnderlineNavbar from "../components/UnderlineNavbar";

// Constants
import { homeNavItems } from "../constants/navItems";

// Image
import Profile from "../images/profile.png";
import { currentDate, timeAgo } from "../utils/date";

interface HomeProps {
  me: NonNullable<MeQuery["me"]>;
}

const Home: React.FC<HomeProps> = ({ me }) => {
  const [createPodMutation] = useCreatePodMutation();

  const {
    value,
    dialogProps,
    inputProps,
    buttonProps,
    handleClose,
  } = useInputModal();

  const handleCreatePod = () => {
    createPodMutation({
      variables: { name: value },
      update: (cache, { data }) => {
        cache.modify({
          id: cache.identify(me as User),
          fields: {
            pods(existingPodsRefs: Reference[]) {
              const newPodRef = cache.writeFragment({
                fragment: gql`
                  fragment NewPod on Pod {
                    id
                    name
                    joined
                    createdAt
                  }
                `,
                data: data!.createPod.pod,
              });
              return [newPodRef, ...existingPodsRefs];
            },
          },
        });
      },
    });
    handleClose();
  };

  return (
    <Box>
      <Dialog {...dialogProps} onDismiss={handleClose} aria-labelledby="label">
        <Dialog.Header>Create new pod</Dialog.Header>
        <Box p={3}>
          <TextInput placeholder="Enter pod name" width={1} {...inputProps} />
          <Flex mt={3} justifyContent="flex-end">
            <Button mr={1} onClick={handleClose}>
              Cancel
            </Button>
            <ButtonPrimary onClick={handleCreatePod}>Create</ButtonPrimary>
          </Flex>
        </Box>
      </Dialog>
      <UnderlineNavbar navItems={homeNavItems} />
      <Container flexDirection="row" pt={3}>
        <Box flex={1} mr={3}>
          <Heading fontSize={2} mb={3}>
            Profile
          </Heading>
          <Flex mb={3}>
            <Box marginRight={3}>
              <img
                src={Profile}
                alt={me.username}
                width={75}
                height={75}
                style={{ borderRadius: 4 }}
              />
            </Box>
            <Box>
              <Heading>{me.username}</Heading>
              <Flex>
                <Text fontSize={1} mr={2} color="gray.6">
                  Joined
                </Text>
                <Text fontSize={1} color="gray.7" fontWeight="bold">
                  {currentDate(me.createdAt)}
                </Text>
              </Flex>
            </Box>
          </Flex>
          <Heading fontSize={2} mb={3}>
            Invites
          </Heading>
          <Invites me={me} />
        </Box>
        <Box flex={2}>
          <Heading fontSize={2} mb={3}>
            Pods
          </Heading>
          <Pods me={me} buttonProps={buttonProps} />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
