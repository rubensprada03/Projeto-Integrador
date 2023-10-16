from pydantic import BaseModel, validator
from typing import Optional, List

class Usuario(BaseModel):
    id: Optional[int] = None
    nome: str
    cpf: str
    email: str
    senha: str
    confirmar_senha: str
    status: bool = True
    grupo: str = "estoquista"

    @validator('cpf')
    def validate_cpf(cls, cpf):
        # Remova quaisquer caracteres não numéricos do CPF
        cpf = ''.join(filter(str.isdigit, cpf))

        # Verifique se o CPF tem 11 dígitos
        if len(cpf) != 11:
            raise ValueError('CPF deve ter exatamente 11 dígitos')
            
        # Calcula o primeiro dígito verificador
        soma = 0
        for i in range(9):
            soma += int(cpf[i]) * (10 - i)
        resto = soma % 11
        if resto < 2:
            digito_verificador1 = 0
        else:
            digito_verificador1 = 11 - resto

        # Calcula o segundo dígito verificador
        soma = 0
        for i in range(10):
            soma += int(cpf[i]) * (11 - i)
        resto = soma % 11
        if resto < 2:
            digito_verificador2 = 0
        else:
            digito_verificador2 = 11 - resto

        # Verifica se os dígitos verificadores estão corretos
        if int(cpf[9]) != digito_verificador1 or int(cpf[10]) != digito_verificador2:
            raise ValueError('CPF inválido')

        return cpf

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

from datetime import date

class EnderecoEntrega(BaseModel):
    cep: str
    logradouro: str
    numero: str
    complemento: Optional[str]
    bairro: str
    cidade: str
    uf: str

    class Config:
        orm_mode = True

class ClienteCreate(BaseModel):
    nome: str
    cpf: str
    email: str
    senha: str
    confirmar_senha: str
    data_nascimento: date
    genero: str
    endereco_entrega: EnderecoEntrega

    @validator('cpf')
    def validate_cpf(cls, cpf):
        # Remova quaisquer caracteres não numéricos do CPF
        cpf = ''.join(filter(str.isdigit, cpf))

        # Verifique se o CPF tem 11 dígitos
        if len(cpf) != 11:
            raise ValueError('CPF deve ter exatamente 11 dígitos')
            
        # Calcula o primeiro dígito verificador
        soma = 0
        for i in range(9):
            soma += int(cpf[i]) * (10 - i)
        resto = soma % 11
        if resto < 2:
            digito_verificador1 = 0
        else:
            digito_verificador1 = 11 - resto

        # Calcula o segundo dígito verificador
        soma = 0
        for i in range(10):
            soma += int(cpf[i]) * (11 - i)
        resto = soma % 11
        if resto < 2:
            digito_verificador2 = 0
        else:
            digito_verificador2 = 11 - resto

        # Verifica se os dígitos verificadores estão corretos
        if int(cpf[9]) != digito_verificador1 or int(cpf[10]) != digito_verificador2:
            raise ValueError('CPF inválido')

        return cpf
    
class ClienteUpdate(BaseModel):
    nome: Optional[str]
    data_nascimento: Optional[date]
    genero: Optional[str]

class SenhaUpdate(BaseModel):
    nova_senha: str
    confirmar_nova_senha: str

class EnderecoEntregaCreate(BaseModel):
    cep: str
    logradouro: str
    numero: str
    complemento: Optional[str] = None
    bairro: str
    cidade: str
    uf: str

from typing import List

class EnderecoEntregaOut(BaseModel):
    cep: str
    logradouro: str
    numero: str
    complemento: Optional[str] = None
    bairro: str
    cidade: str
    uf: str

class ClienteOut(BaseModel):
    id: int
    nome: str
    cpf: str
    email: str
    data_nascimento: date
    genero: str
    enderecos_entrega: List[EnderecoEntrega] = []

    class Config:
        orm_mode = True
