import html2canvas from 'html2canvas';
import saveAs from 'file-saver';
import saveCanvasAsPDF from './saveCanvasAsPDF';

export const saveCanvasAsImage = async (format, canvasData) => {
  console.log(canvasData)
  try {
    const canvasImage = await html2canvas(document.getElementById("canvas-card"));
    console.log(canvasImage);

    if (format === 'png') {
      saveAs(canvasImage.toDataURL('image/png'), 'canvas_image.png');
    } else if (format === 'jpg') {
      saveAs(canvasImage.toDataURL('image/jpeg'), 'canvas_image.jpg');
    } else if (format === 'svg') {
      // ... handle SVG format
      
      const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const imageElement = document.createElementNS("http://www.w3.org/2000/svg", "image");

      imageElement.setAttribute("href", canvasImage.toDataURL('image/png'));
      imageElement.setAttribute("width", canvasImage.width.toString()+ "px");
      imageElement.setAttribute("height", canvasImage.height.toString()+ "px");
      svgElement.appendChild(imageElement);

      const svgData = new XMLSerializer().serializeToString(svgElement);
      saveAs(new Blob([svgData], { type: "image/svg+xml" }), 'canvas_image.svg');

    } else if (format === 'pdf') { // ... handle PDF format
      console.log('PDF Button Clicked');
      console.log('Canvas Image Object:', canvasImage);
      saveCanvasAsPDF(canvasImage);
      
    } else if (format === 'html') {
      // ... handle HTML format
    }
  } catch (error) {
    console.error('Error saving canvas as image:', error);
  }
};
