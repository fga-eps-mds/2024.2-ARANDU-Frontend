export interface Subject {
    _id: string; // ID único da disciplina
    name: string; // Nome completo da disciplina
    shortName: string; // Nome curto ou abreviação da disciplina
    description: string; // Descrição da disciplina
    user: string; // ID do usuário associado à disciplina
    journeys: string[]; // Lista de IDs das jornadas associadas
    order: number; // Ordem da disciplina
    createdAt: string; // Data de criação (em formato ISO 8601)
    updatedAt: string; // Data de última atualização (em formato ISO 8601)
    __v: number; // Versão do documento (utilizado pelo MongoDB)
}
