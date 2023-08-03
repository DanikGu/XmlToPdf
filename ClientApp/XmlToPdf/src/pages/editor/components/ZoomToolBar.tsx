import React, { useCallback }  from 'react';
import editCodeSvg from '/public/code-slash-outline.svg';
import zoomInSvg from '/public/add-outline.svg';
import zoomOutSvg from '/public/remove-outline.svg';

interface ZoomToolBarProps {
    setZoom: (step: number) => void;
}

const ZoomToolBar: React.FC<ZoomToolBarProps> = (props: ZoomToolBarProps) => {
  const { setZoom } = props;
  const zooming = React.useRef(false);
  const startZooming = (step: number) => {
    const setNext = () => setTimeout(() => {
      if(zooming.current) {
        setZoom(step)
        setNext()
      }
    }
    , 200);
    zooming.current = true;
    setZoom(step)
    setNext();
  }
  return (
    <div className='top-right-toolbar'>
        <button className="top-right-toolbar-button" 
          onMouseDown={() => startZooming(0.05)} 
          onMouseUp={() => zooming.current = false}
          onMouseLeave={() => zooming.current = false}
        ><img src={zoomInSvg} alt="Zoom In" /></button>
        <button className="top-right-toolbar-button" 
          onMouseDown={() => startZooming(-0.05)} 
          onMouseUp={() => zooming.current = false}
          onMouseLeave={() => zooming.current = false}
        ><img src={zoomOutSvg} alt="Zoom Out" /></button>
    </div>
  );
}

export default ZoomToolBar;