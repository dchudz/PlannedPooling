import React, {useEffect} from 'react';

const WIDTH = 500;

const range = (start, end) => (
  Array.from(Array(end-start).keys()).map(i => i+start)
);

function chunkArray(array, chunk) {
  let i,j;
  let chunkList = [];
  for (i=0,j=array.length; i<j; i+=chunk) {
    chunkList.push(array.slice(i,i+chunk));
  }
  return chunkList;
}

function backAndForthIfy(array, rowLength) {
  const chunkList = chunkArray(array, rowLength);
  const newChunkList = range(0, chunkList.length).map(function(i) {
    if (i % 2 === 0) {return chunkList[i];}
    else {return chunkList[i].reverse();}
  });
  return [].concat.apply([], newChunkList);
}

function rep(arr, count) {
  const ln = arr.length;
  const b = [];
  for (let i = 0; i < count; i++) {
    b.push(arr[i % ln]);
  }
  return b;
}

//http://stackoverflow.com/questions/6798715/create-a-square-of-colors-with-jquery-or-javascript
function draw(canvas, state) {
  const unitsWide = state.unitsWide;
  const unitsTall = unitsWide;
  const totalSize = unitsWide * unitsTall;


  const colorChoices = state.colorChoices;
  const numStitchesChoices = state.numStitchesChoices;

  const colorsList = range(0, state.nColors).map(function(i) {return rep([colorChoices[i]], numStitchesChoices[i]);});
  let colors = rep([].concat.apply([], colorsList), totalSize);

  if (state.type === "flat") {
    colors = backAndForthIfy(colors, unitsWide);
  }

  makeRectanglesCanvas(canvas, colors, unitsWide, unitsTall);
}

function makeRectanglesCanvas(canvas, colors, unitsWide, unitsTall) {
  const unitSizeInPixels = WIDTH/unitsWide;
  const ctx = canvas.getContext('2d');
  const colors2d = chunkArray(colors, unitsWide);
  for (let i=0; i<unitsTall; i++){
    for (let j=0; j<unitsWide; j++){
      ctx.fillStyle = colors2d[i][j];
      ctx.strokeStyle = colors2d[i][j];

      ctx.fillRect( j*unitSizeInPixels, i*unitSizeInPixels, unitSizeInPixels + .5, unitSizeInPixels + .5);
    }
  }
}


const ColoredSquare = (props) => {
  let canvasRef = React.createRef();

  useEffect(() =>{
    let ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = props.colors[0];
    ctx.strokeStyle = props.colors[0];

    ctx.fillRect( 20, 20, 20, 20);

    const state = {
      nColors: props.colors.length,
      colorChoices: props.colors.map(color => '#' + color),
      numStitchesChoices: props.stitchCounts,
      unitsWide: props.numStitches,
      type: props.type
    };
    draw(canvasRef.current, state)

  });


  return (
    <div className="canvasContainer">
      <p/>
      <div>
      <canvas id="myCanvas" width={WIDTH} height={WIDTH} ref={canvasRef}>
      </canvas>
      </div>
      <div className="save">
        (Copy URL to clipboard)<button onClick={copyUrlToClipboard}>Save</button>
      </div>
    </div>
  )
};

const copyUrlToClipboard = () => {
  // https://stackoverflow.com/a/49618964
  let dummy = document.createElement('input'),
    text = window.location.href;
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
};

export default ColoredSquare;