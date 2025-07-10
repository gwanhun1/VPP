import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Text,
} from '@vpp/shared-ui';

export function App() {
  return (
    <div>
      <div>
        <Text variant="h1">메인페이지</Text>
        <Text variant="h2">메인페이지</Text>
        <Text variant="h3">메인페이지</Text>
        <Text variant="h4">메인페이지</Text>
        <Text variant="h5">메인페이지</Text>
        <Text variant="h6">메인페이지</Text>
        <Text variant="subtitle1">메인페이지</Text>
        <Text variant="subtitle2">메인페이지</Text>
        <Text variant="body">메인페이지</Text>
        <Text variant="body2">메인페이지</Text>
        <Text variant="caption">메인페이지</Text>
        <Text variant="overline">메인페이지</Text>
      </div>
      <div>
        <Button>버튼</Button>
      </div>
      <div>
        <Card>
          <CardHeader>1</CardHeader>
          <CardBody>2</CardBody>
          <CardFooter>3</CardFooter>
        </Card>
      </div>
      <div>
        <Input />
      </div>
      <div>
        <Badge>뱃지</Badge>
      </div>
    </div>
  );
}

export default App;
