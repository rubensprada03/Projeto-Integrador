from pydantic import BaseModel
from typing import Optional, List

class Usuario(BaseModel):
    id: Optional[str] = None
    nome: str
    email: str
    senha: str
    endereco: str
    telefone: str
    

    #produtos: List[produtos] = []

class Produto(BaseModel):
    id: Optional[str] =None
    nome: str
    detalhes: str
    preco: float
    disponivel: bool = False

    class Config:
        orm_mode = True

    