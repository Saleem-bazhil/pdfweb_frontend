const PDFDocument = require("pdfkit");

exports.generatePDF = async (req, res) => {
  try {
    const { title, description } = req.body;

    const doc = new PDFDocument();

    // Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=file.pdf");

    doc.pipe(res);

    // PDF Content
    doc.fontSize(25).text(title, { underline: true });
    doc.moveDown();
    doc.fontSize(16).text(description);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "PDF Generation Failed" });
  }
};
