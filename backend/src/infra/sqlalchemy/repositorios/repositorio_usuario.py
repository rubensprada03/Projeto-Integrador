from sqlalchemy.orm import Session
from fastapi import HTTPException
from src.schemas import schemas
from src.infra.sqlalchemy.models import models
from sqlalchemy import select, update
import bcrypt

class RepositorioUsuario():

    def __init__(self, session: Session):
        self.session = session

    def criar(self, usuario: schemas.Usuario):
        if self.obter_por_email(usuario.email):
            raise HTTPException(status_code=400, detail="Email já está em uso")
        
        if self.obter_por_cpf(usuario.cpf):
            raise HTTPException(status_code=400, detail="Cpf ja em uso")

        if usuario.senha != usuario.confirmar_senha:
            raise HTTPException(status_code=400, detail="As senhas não coincidem")

        # Gere o hash da senha usando bcrypt
        senha_hash = bcrypt.hashpw(usuario.senha.encode('utf-8'), bcrypt.gensalt())
        
        usuario_bd = models.Usuario(nome=usuario.nome,
                                    cpf=usuario.cpf,
                                    email=usuario.email,
                                    senha=senha_hash,
                                    endereco=usuario.endereco,
                                    telefone=usuario.telefone,
                                    grupo=usuario.grupo)
        self.session.add(usuario_bd)
        self.session.commit()
        self.session.refresh(usuario_bd)
        return usuario_bd

    def criar_com_verificacao(self, usuario: schemas.Usuario):
        if usuario.senha != usuario.confirmar_senha:
            raise HTTPException(status_code=400, detail="As senhas não coincidem")

        return self.criar(usuario)



    def obter_por_email(self, email: str):
        return self.session.query(models.Usuario).filter(models.Usuario.email == email).first()
    
    def obter_por_cpf(self, cpf: str):
        return self.session.query(models.Usuario).filter_by(cpf=cpf).first()


    def listar(self):
        # Executa uma consulta SELECT para buscar todos os usuários no banco de dados
        smtm = select(models.Usuario)
        usuarios = self.session.execute(smtm).scalars().all()
        return usuarios
    
    def obter_por_id(self, usuario_id: int):
        # Busca um usuário pelo ID fornecido
        return self.session.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()

    def editar(self, usuario_existente: models.Usuario, novo_usuario_dict: dict):
        # Atualiza os atributos do usuário existente com os valores do novo dicionário
        for attr, value in novo_usuario_dict.items():
            setattr(usuario_existente, attr, value)
        # Confirma a transação e atualiza o usuário existente
        self.session.commit()
        self.session.refresh(usuario_existente)
        return usuario_existente
    
    def excluir(self, usuario: models.Usuario):
        # Remove o usuário do banco de dados
        self.session.delete(usuario)
        self.session.commit()

    def autenticar(self, email: str, senha: str):
        # Busca um usuário pelo email fornecido
        usuario = self.session.query(models.Usuario).filter(models.Usuario.email == email).first()

        # Verifica se a senha fornecida corresponde ao hash de senha armazenado
        if usuario and bcrypt.checkpw(senha.encode('utf-8'), usuario.senha):
            return usuario

        return None

    def ativar_usuario(self, usuario: models.Usuario):
        usuario.status = True
        self.session.commit()

    def desativar_usuario(self, usuario: models.Usuario):
        usuario.status = False
        self.session.commit()

