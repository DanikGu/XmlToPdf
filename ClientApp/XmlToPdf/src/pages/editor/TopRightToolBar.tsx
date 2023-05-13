import React from 'react';
import editCodeSvg from '/public/code-slash-outline.svg';
import zoomInSvg from '/public/add-outline.svg';
import zoomOutSvg from '/public/remove-outline.svg';

interface TopRightToolbarProps {
    switchEditorState: () => void;
    zoom: (step: number) => void;
}
  
class TopRightToolbar extends React.Component<TopRightToolbarProps> {
    render() {
      const { switchEditorState, zoom } = this.props;
      return (
        (
          <div className='top-right-toolbar'>
            <button className="top-right-toolbar-button" onClick={switchEditorState}><img src={editCodeSvg} /></button>
            <button className="top-right-toolbar-button" onClick={() => zoom(0.05)}><img src={zoomInSvg} /></button>
            <button className="top-right-toolbar-button" onClick={() => zoom(-0.05)}><img src={zoomOutSvg} /></button>
          </div>
        )
      );
    }
}
export default TopRightToolbar;