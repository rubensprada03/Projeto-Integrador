from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from src.schemas import schemas
from src.infra.sqlalchemy.models import models
import bcrypt

class RepositorioCliente():

    def __init__(self, session: Session):
        self.session = session

    def obter_por_cpf(self, cpf: str):
        return self.session.query(models.Cliente).filter(models.Cliente.cpf == cpf).first()

    def obter_por_email(self, email: str):
        return self.session.query(models.Cliente).filter(models.Cliente.email == email).first()

    def criar(self, cliente: schemas.ClienteCreate):
        if self.obter_por_email(cliente.email):
            raise HTTPException(status_code=400, detail="Email já está em uso")
        
        if self.obter_por_cpf(cliente.cpf):
            raise HTTPException(status_code=400, detail="CPF já está em uso")

        if cliente.senha != cliente.confirmar_senha:
            raise HTTPException(status_code=400, detail="As senhas não coincidem")

        senha_hash = bcrypt.hashpw(cliente.senha.encode('utf-8'), bcrypt.gensalt())
        
        cliente_bd = models.Cliente(
            nome=cliente.nome,
            cpf=cliente.cpf,
            email=cliente.email,
            senha=senha_hash,
            data_nascimento=cliente.data_nascimento,
            genero=cliente.genero
        )

        self.session.add(cliente_bd)
        self.session.flush()  # Use flush para obter o ID do cliente recém-criado sem confirmar a transação

        endereco_entrega_bd = models.EnderecoEntrega(
            cliente_id=cliente_bd.id,
            cep=cliente.endereco_entrega.cep,
            logradouro=cliente.endereco_entrega.logradouro,
            numero=cliente.endereco_entrega.numero,
            complemento=cliente.endereco_entrega.complemento,
            bairro=cliente.endereco_entrega.bairro,
            cidade=cliente.endereco_entrega.cidade,
            uf=cliente.endereco_entrega.uf
        )

        self.session.add(endereco_entrega_bd)
        self.session.commit()
        self.session.refresh(cliente_bd)

        return cliente_bd

    def atualizar(self, cliente_id: int, cliente: schemas.ClienteUpdate):
        cliente_bd = self.session.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
        
        if not cliente_bd:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        for key, value in cliente.dict().items():
            if value is not None:
                setattr(cliente_bd, key, value)
        
        self.session.commit()
        return cliente_bd


    def atualizar_senha(self, cliente_id: int, senha_update: schemas.SenhaUpdate):
        cliente_bd = self.session.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
        
        if not cliente_bd:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")

        if senha_update.nova_senha != senha_update.confirmar_nova_senha:
            raise HTTPException(status_code=400, detail="As novas senhas não coincidem")

        senha_hash = bcrypt.hashpw(senha_update.nova_senha.encode('utf-8'), bcrypt.gensalt())
        cliente_bd.senha = senha_hash

        self.session.commit()
        return cliente_bd

    def obter_por_id(self, cliente_id: int):
        return self.session.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    
    def adicionar_endereco(self, cliente_id: int, endereco: schemas.EnderecoEntregaCreate):
        cliente_bd = self.obter_por_id(cliente_id)
        
        if not cliente_bd:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")

        endereco_entrega_bd = models.EnderecoEntrega(
            cliente_id=cliente_id,
            cep=endereco.cep,
            logradouro=endereco.logradouro,
            numero=endereco.numero,
            complemento=endereco.complemento,
            bairro=endereco.bairro,
            cidade=endereco.cidade,
            uf=endereco.uf
        )

        self.session.add(endereco_entrega_bd)
        self.session.commit()

        return endereco_entrega_bd

    def listar_clientes_com_enderecos(self):
        return self.session.query(models.Cliente).options(joinedload(models.Cliente.enderecos_entrega)).all()

    def obter_por_id_user(self, cliente_id: int):
        return (
            self.session.query(models.Cliente)
            .options(joinedload(models.Cliente.enderecos_entrega))
            .filter(models.Cliente.id == cliente_id)
            .first()
        )
