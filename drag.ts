/**
 * allowDrop preps an element to accept a drop
 */
function allowDrop(ev: DragEvent) {
  ev.preventDefault();
  // ev.dataTransfer.dropEffect = 'copy';
}

var offsetX = 0,
  offsetY = 0;

/**
 * drag sets the data to be transferred along with the cartesian coordinates
 */
function drag(ev: DragEvent) {
  ev.dataTransfer.setData('stamp', (ev.target as HTMLElement).id);

  // set cordX and cordY as offset
  offsetX = ev.clientX - (ev.target as HTMLElement).getBoundingClientRect().x;
  offsetY = ev.clientY - (ev.target as HTMLElement).getBoundingClientRect().y;
}

/**
 * drop draws the image on the canvas and stores the data in localStorage
 */
function drop(ev: DragEvent) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData('stamp');

  // draw image on canvas
  var canvas = ev.target as HTMLCanvasElement;
  var ctx = canvas.getContext('2d');
  var stamp = document.getElementById(data) as CanvasImageSource;

  // canvas left and top
  var rect = document.getElementById('the-canvas').getBoundingClientRect();
  var left = rect.left;
  var top = rect.top;

  var cordX = ev.clientX - left - offsetX;
  var cordY = ev.clientY - top - offsetY;

  const w = 150,
    h = 120;

  ctx.drawImage(stamp, cordX, cordY, w, h);

  storeDrawing(data, cordX, cordY, pageNum, w, h);
}

/**
 * storeDrawing stores the data in localStorage
 */
function storeDrawing(
  id: string,
  x: number,
  y: number,
  page: number,
  w: number,
  h: number
) {
  // get any current data
  const sdata = localStorage.getItem('stampede') || '{}';
  const data = JSON.parse(sdata);
  const drawings = data[page] || [];
  // add new drawing
  drawings.push({ id, x, y, w, h, page });
  data[page] = drawings;
  localStorage.setItem('stampede', JSON.stringify(data));
}

/**
 * removeDrawings removes drawings for a page from localStorage
 */
function removeDrawings(page: number) {
  // get any current data
  const sdata = localStorage.getItem('stampede') || '{}';
  const data = JSON.parse(sdata);
  // remove drawings for page
  delete data[page];
  localStorage.setItem('stampede', JSON.stringify(data));
}

interface Drawing {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
  page: number;
}

/**
 * getDrawings returns drawings for a page from localStorage
 */
function getDrawings(page: number): Drawing[] {
  // get any current data
  const sdata = localStorage.getItem('stampede') || '{}';
  const data = JSON.parse(sdata);
  return data[page] || [];
}

/**
 * reDraw iterates over drawings and draws them on the canvas
 */
function reDraw(drawings: Drawing[]) {
  for (const drawing of drawings) {
    var canvas = document.getElementById('the-canvas') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');
    var stamp = document.getElementById(drawing.id) as CanvasImageSource;
    ctx.drawImage(stamp, drawing.x, drawing.y, drawing.w, drawing.h);
  }
}

/**
 * clear clears the canvas and removes drawings from localStorage
 */
function clear() {
  var canvas = document.getElementById('the-canvas') as HTMLCanvasElement;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // remove drawings from local storage
  removeDrawings(pageNum);
  // re-render page
  queueRenderPage(pageNum);
}
document.getElementById('clear').addEventListener('click', clear);
