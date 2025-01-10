

export const addPageNumbers = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 40,
      doc.internal.pageSize.getHeight() - 10
    );
  }
};

export const addDateToPDF = (doc, yPos = 10) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  const formattedDate = `${year}/${month}/${day}`;
  doc.setFontSize(10);
  doc.text(formattedDate, doc.internal.pageSize.getWidth() - 40, yPos, {
    align: "right",
  });
};