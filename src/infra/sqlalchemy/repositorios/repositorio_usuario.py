from sqlalchemy.orm import Session
from src.schemas import schemas
from src.infra.sqlalchemy.models import models
from sqlalchemy import select, update
import bcrypt

class RepositorioUsuario():

    def __init__(self, session: Session):
        self.session = session

    def criar(self, usuario: schemas.Usuario):
        # Gere o hash da senha usando bcrypt
        senha_hash = bcrypt.hashpw(usuario.senha.encode('utf-8'), bcrypt.gensalt())

        usuario_bd = models.Usuario(nome=usuario.nome,
                                    email=usuario.email,
                                    senha=senha_hash,  # Armazene o hash da senha no banco de dados
                                    endereco=usuario.endereco,
                                    telefone=usuario.telefone)
        self.session.add(usuario_bd)
        self.session.commit()
        self.session.refresh(usuario_bd)
        return usuario_bd

    def listar(self):
        smtm = select(models.Usuario)
        usuarios = self.session.execute(smtm).scalars().all()
        return usuarios
    
    def obter_por_id(self, usuario_id: int):
        return self.session.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()

    def editar(self, usuario_existente: models.Usuario, novo_usuario_dict: dict):
        for attr, value in novo_usuario_dict.items():
            setattr(usuario_existente, attr, value)
        self.session.commit()
        self.session.refresh(usuario_existente)
        return usuario_existente
    
    def excluir(self, usuario: models.Usuario):
        self.session.delete(usuario)
        self.session.commit()

    def autenticar(self, email: str, senha: str):
        usuario = self.session.query(models.Usuario).filter(models.Usuario.email == email).first()

        if usuario and bcrypt.checkpw(senha.encode('utf-8'), usuario.senha):
            return usuario

        return None


