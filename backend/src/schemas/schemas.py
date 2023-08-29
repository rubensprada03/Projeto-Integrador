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
    status: bool = True
    grupo : str = "estoquista"
    

    @validator('cpf')
    def validate_cpf_length(cls, cpf):
        if len(cpf) != 11:
            raise ValueError('CPF deve ter exatamente 11 dígitos')
        return cpf
    # produtos: List[produtos] = []  # Lista opcional de produtos associados ao usuário

class Produto(BaseModel):
    id: Optional[str] = None 
    nome: str  
    detalhes: str  
    preco: float  
    disponivel: bool = False  

    class Config:
        orm_mode = True
