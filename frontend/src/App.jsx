import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './App.css';

const socketUrl = 'ws:localhost:3001/websockets';

function App() {
  const { lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    console.log(lastMessage);
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <>
      <div>
        {lastMessage ? (
          <span>Last message: {JSON.parse(lastMessage.data).message}</span>
        ) : null}
      </div>
      <span>The WebSocket is currently {connectionStatus}</span>
    </>
  );
}

export default App;
