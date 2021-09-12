import useDrag from '../hooks/useDrag';
import { BoardObject } from '../@types/boardObject';

type DraggableObjectType = {
  object: BoardObject,
  selectedId: string,
  moveObject: any,
  selectObjectId:any,
};

const DraggableObject = (prop: DraggableObjectType) => {
  const {
    object, selectedId, moveObject, selectObjectId,
  } = prop;

  const {
    picturePosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDrag({ x: object.x, y: object.y });

  return (
    <>
      <div
        style={{
          ...picturePosition as React.CSSProperties,
          margin: '5px',
          padding: '5px',
          border: object.isFramed ? '2px solid #fff' : 'none',
          cursor: 'pointer',
          userSelect: 'none',
          transform: `rotate(${object.angle}deg)`,
          fontSize: object.type === 'text' ? '30px' : '50px',
          color: selectedId === object.id ? '#f00' : '#fff',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseMove}
        onMouseUp={() => {
          handleMouseUp();
          moveObject(
            object.id,
            parseInt(picturePosition.right, 10),
            parseInt(picturePosition.bottom, 10),
          );
        }}
        onClick={(e) => { e.stopPropagation(); selectObjectId(); }}
      >
        {object.text}
      </div>
    </>
  );
};

export default DraggableObject;
