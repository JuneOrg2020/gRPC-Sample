import { useState, useEffect } from 'react';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import DraggableObject from '../components/DraggableObject';
import { GRPCClients } from '../gRPCClients';
import { BoardObject } from '../@types/boardObject';
import { MessageRequest } from '../messenger/messenger_pb';

type Props = {
  clients: GRPCClients;
};

const INITIAL_POS = {
  x: 550,
  y: 900,
};

const MessagesContainer: React.FC<Props> = ({ clients }) => {
  const [boardObjects, setBoardObjets] = useState<BoardObject[]>([]);
  const [postedText, setText] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('');

  const { messengerClient } = clients;

  const arrowButtons = [
    '←', '→', '↑', '↓',
  ];

  const shareObject = (object: BoardObject) => {
    const req = new MessageRequest();
    req.setMessage(JSON.stringify(object));
    messengerClient.createMessage(req, null, (res) => (console.log(res)));
  };

  const makePostInfo = (type :string, text :string) => {
    const d = new Date();
    return {
      ...INITIAL_POS,
      angle: 0,
      key: boardObjects.length,
      isShared: false,
      isDeleted: false,
      isFramed: false,
      text,
      type,
      id: `ID${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}_${boardObjects.length}`,
    };
  };

  const postText = () => {
    if (postedText.length === 0) {
      return;
    }

    shareObject(
      makePostInfo('text', postedText),
    );

    setText('');
  };

  const postArrow = (arrowStr: string) => {
    shareObject(
      makePostInfo('arrow', arrowStr),
    );
  };

  const searchId = (id: string) => {
    const target = boardObjects.filter((item) => item.id === id);

    if (target.length === 0) {
      return null;
    }

    return target[0];
  };

  const deleteObject = (id :string) => {
    const target = searchId(id);
    if (target === null) {
      return;
    }
    target.isDeleted = true;
    shareObject(target);
  };

  const moveObject = (id :string, x :number, y :number) => {
    const target = searchId(id);
    if (target === null) {
      return;
    }
    target.x = x;
    target.y = y;
    shareObject(target);
  };

  const rotateObject = (id: string, addAngle: number) => {
    const target = searchId(id);
    if (target === null) {
      return;
    }
    target.angle += addAngle;
    target.angle %= 360;

    shareObject(target);
  };

  const toggleframingObject = (id: string) => {
    const target = searchId(id);
    if (target === null) {
      return;
    }
    target.isFramed = !target.isFramed;
    shareObject(target);
  };

  useEffect(() => {
    const stream = messengerClient.getMessages(new Empty());
    stream.on('data', (m: any) => {
      const data = JSON.parse(m.getMessage());
      setBoardObjets((state) => {
        const target = state.filter((item) => item.id === data.id);

        if (target.length === 0) {
          return [...state, data];
        }

        const otherObjects = state.filter(
          (item) => item.id !== data.id,
        );

        return [
          ...otherObjects,
          {
            isDeleted: true, // dummy
          },
          data,
        ];
      });
    });
  }, [messengerClient]);

  return (
    <div>
      <div
        style={{
          width: '1200px',
          margin: 'auto',
          marginTop: '50px',
          marginBottom: '50px',
        }}
      >
        <input
          type="text"
          style={{
            width: '400px',
          }}
          value={postedText}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              postText();
            }
          }}
        />
        <button
          style={{
            marginLeft: '5px',
            width: '50px',
          }}
          onClick={() => postText()}
        >
          投稿
        </button>
        {
          arrowButtons.map((item) => (
            <button
              style={{
                marginLeft: '5px',
                width: '50px',
              }}
              key={item}
              onClick={() => postArrow(item)}
            >
              {item}
            </button>
          ))
        }
        {
          selectedId !== '' && (
            <>
              <button
                style={{
                  marginLeft: '20px',
                  width: '50px',
                }}
                onClick={() => deleteObject(selectedId)}
              >
                削除
              </button>
              <button
                style={{
                  marginLeft: '5px',
                  width: '70px',
                }}
                onClick={() => rotateObject(selectedId, 45)}
              >
                45°回転
              </button>
              <button
                style={{
                  marginLeft: '5px',
                  width: '70px',
                }}
                onClick={() => rotateObject(selectedId, 90)}
              >
                90°回転
              </button>
              <button
                style={{
                  marginLeft: '5px',
                  width: '50px',
                }}
                onClick={() => toggleframingObject(selectedId)}
              >
                枠線
              </button>
            </>
          )
        }
        <div
          style={{
            background: '#090',
            width: '100%',
            height: '1000px',
            border: '4px solid #fff',
            position: 'relative',
          }}
          onClick={() => { setSelectedId(''); }}
        >
          {boardObjects.map((item, index) => (
            item.isDeleted ? ''
              : <DraggableObject
                  key={item.id + index}
                  object={item}
                  selectedId={selectedId}
                  moveObject={moveObject}
                  selectObjectId={() => { setSelectedId(item.id); }}
                />
          ))}
        </div>
      </div>

    </div>
  );
};

export default MessagesContainer;
