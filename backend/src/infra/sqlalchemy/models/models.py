from src.infra.sqlalchemy.config.database import Base
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey

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
