import React from "react";
import ButtonSaveBerita from "./ui/ButtonSaveBerita"; // tombol dasar
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

interface Props {
  htmlContent: string; // isi berita dalam bentuk HTML dari ReactQuill
}

const SaveBeritaButton: React.FC<Props> = ({ htmlContent }) => {
  // Konversi HTML ke teks biasa (untuk Word dan PDF)
  const htmlToPlainText = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  // 👉 Export ke Word
  const handleExportDocx = async () => {
    const plainText = htmlToPlainText(htmlContent);

    const doc = new Document({
      sections: [
        {
          children: plainText.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun(line)],
              })
          ),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "berita.docx");
  };

  // 👉 Export ke PDF
  const handleExportPdf = () => {
    const plainText = htmlToPlainText(htmlContent);

    // Buat instance PDF A4 (default unit: mm)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Atur text wrap otomatis
    const marginLeft = 10;
    const marginTop = 10;
    const maxWidth = 190; // lebar A4 - margin
    const lines = pdf.splitTextToSize(plainText, maxWidth);

    pdf.text(lines, marginLeft, marginTop);
    pdf.save("berita.pdf");
  };

  return (
    <div className="flex gap-3 mt-3">
      <ButtonSaveBerita
        type="button"
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={handleExportDocx}
      >
        Simpan sebagai Word (.docx)
      </ButtonSaveBerita>

      <ButtonSaveBerita
        type="button"
        className="bg-red-600 text-white hover:bg-red-700"
        onClick={handleExportPdf}
      >
        Simpan sebagai PDF (.pdf)
      </ButtonSaveBerita>
    </div>
  );
};

export default SaveBeritaButton;
