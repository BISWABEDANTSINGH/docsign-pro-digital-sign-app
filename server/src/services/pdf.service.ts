import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import Document from '../models/document.model';
import Signature from '../models/signature.model';

export const generateSignedPdf = async (documentId: string) => {
  const doc = await Document.findById(documentId);
  if (!doc) throw new Error("Document not found");

  const signatures = await Signature.find({ documentId });
  if (signatures.length === 0) throw new Error("No signatures applied to this document yet.");

  const originalPdfBytes = fs.readFileSync(doc.fileUrl);
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();

  for (const sig of signatures) {
    if (sig.signatureImage) {
      let imageBytes;

      if (sig.signatureImage.startsWith("data:image")) {
        const base64Data = sig.signatureImage.replace(/^data:image\/\w+;base64,/, "");
        imageBytes = Buffer.from(base64Data, 'base64');
      } else {
        const imagePath = path.join(__dirname, '../../../', sig.signatureImage);
        imageBytes = fs.readFileSync(imagePath);
      }

      const embeddedImage = await pdfDoc.embedPng(imageBytes);

      // 🔥 FIX: Target the specific page the user signed! 
      // (Subtract 1 because arrays start at 0, but pages start at 1)
      const targetPageNum = sig.page ? sig.page - 1 : 0;
      const targetPage = pages[targetPageNum];
      
      // Get the exact dimensions of this specific page
      const { width: pdfWidth, height: pdfHeight } = targetPage.getSize();

      const sigPhysicalWidth = (sig.widthPercent / 100) * pdfWidth;
      const sigPhysicalHeight = (sig.heightPercent / 100) * pdfHeight;
      const sigX = (sig.xPercent / 100) * pdfWidth;
      const sigY = pdfHeight - ((sig.yPercent / 100) * pdfHeight) - sigPhysicalHeight;

      targetPage.drawImage(embeddedImage, {
        x: sigX,
        y: sigY,
        width: sigPhysicalWidth,
        height: sigPhysicalHeight,
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const newFileName = `signed-${Date.now()}-${path.basename(doc.fileUrl)}`;
  const newPath = path.join('uploads', newFileName);
  
  fs.writeFileSync(newPath, pdfBytes);

  doc.status = "signed";
  doc.fileUrl = `uploads/${newFileName}`; 
  await doc.save();

  return newPath;
};