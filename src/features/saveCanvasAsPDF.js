// saveCanvasAsPDF.js

// import React, {useRef} from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

export const saveCanvasAsPDF = async (canvasImage) => {
    try {
      console.log('Canvas Image Object:', canvasImage);
  
      if (!(canvasImage instanceof HTMLCanvasElement) && !(canvasImage instanceof Image)) {
        // console.error('Invalid CanvasImage Type: ', typeof canvasImage);
        return;
      }
  
      const pdf = new jsPDF();
  
      // Create a new canvas element
      const canvas = document.createElement('canvas');
      canvas.width = canvasImage.width;
      canvas.height = canvasImage.height;
      const context = canvas.getContext('2d');
  
      // Draw the image onto the new canvas
      context.drawImage(canvasImage, 0, 0);
  
      // Use the new canvas element to generate the PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
  
      saveAs(pdf.output('blob'), 'canvas_document.pdf');
    } catch (error) {
      console.error('Error saving canvas as PDF:', error);
    }
  };
  

export default saveCanvasAsPDF;
