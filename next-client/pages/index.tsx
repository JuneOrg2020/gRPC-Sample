import type { NextPage } from 'next';

import MessagesContainer from '../src/containers/MessageBoard';
import { gRPCClients } from '../src/gRPCClients';

export const App: NextPage = () => (
  <>
    <MessagesContainer clients={gRPCClients} />
  </>
);

export default App;
