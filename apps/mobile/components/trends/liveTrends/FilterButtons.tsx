import { Badge, Text } from '@vpp/shared-ui';
import { TouchableOpacity } from 'react-native';

type FilterButtonsProps = {
  title: string;
  id: number;
  filter: number;
  onPress: () => void;
};

const FilterButtons = ({ title, id, filter, onPress }: FilterButtonsProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Badge
        variant={filter === id ? 'point' : 'primary'}
        rounded="full"
        size="lg"
      >
        <Text
          variant="body2"
          weight="bold"
          color={filter === id ? 'white' : 'primary'}
        >
          {title}
        </Text>
      </Badge>
    </TouchableOpacity>
  );
};

export default FilterButtons;
