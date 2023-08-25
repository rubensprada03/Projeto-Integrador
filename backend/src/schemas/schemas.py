from pydantic import BaseModel, validator
from typing import Optional, List

class Usuario(BaseModel):
    id: Optional[int] = None
    nome: str
    cpf: str
    email: str
    senha: str
    confirmar_senha:str
    endereco: str
    telefone: str
    grupo : str = "estoquista"
    

    @validator('cpf')
    def validate_cpf_length(cls, cpf):
        if len(cpf) != 11:
            raise ValueError('CPF deve ter exatamente 11 dígitos')
        return cpf
    # produtos: List[produtos] = []  # Lista opcional de produtos associados ao usuário

class Produto(BaseModel):
    id: Optional[str] = None  # Campo opcional para o ID do produto
    nome: str  # Nome do produto (obrigatório)
    detalhes: str  # Detalhes do produto (obrigatório)
    preco: float  # Preço do produto (obrigatório)
    disponivel: bool = False  # Disponibilidade do produto (padrão: False, opcional)

    class Config:
        orm_mode = True
