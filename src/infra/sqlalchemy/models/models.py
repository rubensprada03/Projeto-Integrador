from src.infra.sqlalchemy.config.database import Base
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey

class Usuario(Base):

    __tablename__ = 'usuario'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    cpf = Column(String(length=11))
    email = Column(String)
    senha = Column(String)
    endereco = Column(String)
    telefone = Column(String)
    grupo = Column(String, default="estoquista") 

class Produto(Base):

    __tablename__ = 'produto'
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    detalhes = Column(String)
    categoria = Column(String)
    preco = Column(Float)
    disponivel = Column(Boolean)
    #usuario_id = Column(Integer, ForeignKey('usuario.id)) LINK: https://www.youtube.com/watch?v=CIV9Oyx-yjk&t=310s MINUTO: 6