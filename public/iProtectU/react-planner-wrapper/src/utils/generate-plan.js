import { ReactPlannerConstants } from 'react-planner';
const {
  MODE_IDLE,
  MODE_2D_ZOOM_IN,
  MODE_2D_ZOOM_OUT,
  MODE_2D_PAN,
  MODE_WAITING_DRAWING_LINE,
  MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX,
  MODE_DRAGGING_ITEM,
  MODE_DRAWING_LINE,
  MODE_DRAWING_HOLE,
  MODE_DRAWING_ITEM,
  MODE_DRAGGING_HOLE,
  MODE_ROTATING_ITEM,
  MODE_3D_FIRST_PERSON,
  MODE_3D_VIEW,
} = ReactPlannerConstants;

const is2D = (mode) =>
  [
    MODE_IDLE,
    MODE_2D_ZOOM_IN,
    MODE_2D_ZOOM_OUT,
    MODE_2D_PAN,
    MODE_WAITING_DRAWING_LINE,
    MODE_DRAGGING_LINE,
    MODE_DRAGGING_VERTEX,
    MODE_DRAGGING_ITEM,
    MODE_DRAWING_LINE,
    MODE_DRAWING_HOLE,
    MODE_DRAWING_ITEM,
    MODE_DRAGGING_HOLE,
    MODE_ROTATING_ITEM,
  ].includes(mode);

const is3D = (mode) => [MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode);

export const generatePlan = (mode) => {
  let canvas;
  if (is3D(mode)) {
    canvas = document.getElementsByTagName('canvas')[0];
    return new Promise((resolve, reject) => resolve(canvas.toDataURL()));
  } else if (is2D(mode)) {
    let svgElements = document.getElementsByTagName('svg');

    // I get the element with max width (which is the viewer)
    let maxWidthSVGElement = svgElements[0];
    for (let i = 1; i < svgElements.length; i++) {
      if (
        svgElements[i].width.baseVal.value >
        maxWidthSVGElement.width.baseVal.value
      ) {
        maxWidthSVGElement = svgElements[i];
      }
    }

    let serializer = new XMLSerializer();
    let img = new Image();

    canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    // Set width and height for the new canvas
    let heightAtt = document.createAttribute('height');
    heightAtt.value = maxWidthSVGElement.height.baseVal.value;
    canvas.setAttributeNode(heightAtt);

    let widthAtt = document.createAttribute('width');
    widthAtt.value = maxWidthSVGElement.width.baseVal.value;
    canvas.setAttributeNode(widthAtt);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    img.crossOrigin = 'anonymous';
    img.src = `data:image/svg+xml;base64,${window.btoa(
      serializer.serializeToString(maxWidthSVGElement)
    )}`;

    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          maxWidthSVGElement.width.baseVal.value,
          maxWidthSVGElement.height.baseVal.value
        );
        return resolve(canvas.toDataURL());
      };
    });
  }
};
