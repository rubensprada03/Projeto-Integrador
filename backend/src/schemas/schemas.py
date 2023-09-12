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

class ProdutoBase(BaseModel):
    nome: str
    avaliacao: float
    descricao_detalhada: str
    preco: float
    qtd_estoque: int
    status: bool = True
    imagens: List[str] = []

    @validator('avaliacao')
    def validate_avaliacao(cls, value):
        if not (1 <= value <= 5) or value % 0.5 != 0:
            raise ValueError('Avaliação deve estar entre 1 e 5 com precisão de 0,5')
        return value
    
class Produto(BaseModel):
    nome: str
    avaliacao: float
    descricao_detalhada: str
    preco: float
    qtd_estoque: int
    status: bool = True
    imagens: List[str] = []  # Defina como uma lista vazia por padrão

class ProdutoSimples(BaseModel):
    nome: str
    avaliacao: float
    descricao_detalhada: str
    preco: float
    qtd_estoque: int
    status: bool = True

class ProdutoEdit(BaseModel):
    nome: str
    avaliacao: float
    descricao_detalhada: str
    preco: float
    qtd_estoque: int
