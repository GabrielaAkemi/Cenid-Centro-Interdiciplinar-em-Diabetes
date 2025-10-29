import React from "react";
import { Download } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Attachment {
  id: number;
  file_info: {
    id: number;
    original_name: string;
    url: string;
  };
}

interface ListaAnexosProps {
  attachments: Attachment[];
}

const ListaAnexos: React.FC<ListaAnexosProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return <p className="text-gray-500 text-sm">Nenhum anexo disponível.</p>;
  }

  return (
    <div className="space-y-2 mt-2">
      {attachments.map((a) => (
        <div
          key={a.id}
          className="flex items-center justify-between p-2 border rounded-md bg-gray-50 hover:bg-gray-100"
        >
          <span className="text-sm text-gray-800 truncate max-w-[70%]">
            {a.file_info.original_name}
          </span>
          <a
            href={`${API_URL}${a.file_info.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <Download size={16} className="mr-1" />
            Baixar
          </a>
        </div>
      ))}
    </div>
  );
};

export default ListaAnexos;
