import { WebView } from 'react-native-webview';
export const App = () => {
  return (
    <>
      <WebView source={{ uri: 'https://vppweb.vercel.app/' }} />
    </>
  );
};

export default App;
