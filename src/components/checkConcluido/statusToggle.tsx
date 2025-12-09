import React from "react";

interface StatusToggleProps {
    value: "andamento" | "concluida";
    onChange?: (newStatus: "andamento" | "concluida") => void;
    somenteLeitura?: boolean;
    nomeAvaliacao?: string;
}
export const getStatusContainerClasses = (status: string | undefined) => {
    switch (status) {
        case 'andamento':
            return 'bg-yellow-50 border-yellow-400';
        case 'concluida':
            return 'bg-green-100 border-green-400';
        default:
            return 'bg-white border-gray-200';
    }
};

const StatusToggle: React.FC<StatusToggleProps> = ({
    value,
    onChange,
    somenteLeitura = false,
    nomeAvaliacao = "Farmácia"
}) => {
    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (somenteLeitura) return;
        const novoStatus = e.target.checked ? "concluida" : "andamento";
        onChange?.(novoStatus);
    };

    return (
        <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-blue-900">Avaliação {nomeAvaliacao}</h1>

            <label className={`flex items-center ${somenteLeitura ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}>
                <span className="mr-3 text-md font-semibold text-gray-700">
                    Consulta Finalizada
                </span>
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={value === "concluida"}
                        onChange={handleStatusChange}
                        className="sr-only peer"
                        disabled={somenteLeitura}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300
                        peer-checked:after:translate-x-full peer-checked:after:border-white
                        after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full
                        after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600">
                    </div>
                </div>
            </label>
        </div>
    );
};

export default StatusToggle;
