from src.infra.sqlalchemy.config.database import Base
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Date, UniqueConstraint
from sqlalchemy.orm import relationship

class Usuario(Base):

    __tablename__ = 'usuario'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    cpf = Column(String(length=11))
    email = Column(String)
    senha = Column(String)
    status = Column(Boolean, default=True)
    grupo = Column(String, default="estoquista")

class Produto(Base):

    __tablename__ = 'produto'
        
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(length=200))  # Nome do produto com no máximo 200 caracteres
    avaliacao = Column(Float(precision=1))  # Avaliação de 1 a 5 com precisão de 0,5
    descricao_detalhada = Column(String(length=2000))  # Descrição detalhada com no máximo 2000 caracteres
    preco = Column(Float(precision=2))  # Preço do produto com duas casas decimais
    qtd_estoque = Column(Integer) 
    status = Column(Boolean, default=True)
    imagens = Column(String)

class Cliente(Base):
    __tablename__ = "cliente"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    cpf = Column(String(length=11), unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    senha = Column(String, nullable=False)
    data_nascimento = Column(Date, nullable=False)
    genero = Column(String, nullable=False)
    
    # Relação one-to-many com a tabela EnderecoEntrega
    enderecos_entrega = relationship("EnderecoEntrega", back_populates="cliente")

class EnderecoEntrega(Base):
    __tablename__ = "endereco_entrega"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("cliente.id"))
    cep = Column(String(length=8), nullable=False)
    logradouro = Column(String, nullable=False)
    numero = Column(String, nullable=False)
    complemento = Column(String)
    bairro = Column(String, nullable=False)
    cidade = Column(String, nullable=False)
    uf = Column(String(length=2), nullable=False)

    # Relação com a tabela Cliente
    cliente = relationship("Cliente", back_populates="enderecos_entrega")