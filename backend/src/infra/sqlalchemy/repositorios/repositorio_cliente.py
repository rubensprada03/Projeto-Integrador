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

    def autenticar(self, email: str, senha: str):
        cliente = self.obter_por_email(email)
        if not cliente:
            return None
        if bcrypt.checkpw(senha.encode('utf-8'), cliente.senha):
            return cliente
        return None

    def remover_endereco (self, cliente_id: int, endereco_id: int):
        cliente_bd = self.obter_por_id(cliente_id)

        if not cliente_bd:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")

        endereco_entrega_bd = self.session.query(models.EnderecoEntrega).filter(models.EnderecoEntrega.id == endereco_id).first()

        if not endereco_entrega_bd:
            raise HTTPException(status_code=404, detail="Endereco não encontrado")

        self.session.delete(endereco_entrega_bd)
        self.session.commit()

    def definir_endereco_principal(self, cliente_id: int, endereco_id: int):
        # Obtém o cliente
        cliente = self.session.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")

        # Desativa o atual endereço principal (se houver)
        for endereco in cliente.enderecos_entrega:
            if endereco.is_principal:
                endereco.is_principal = False

        # Procura o endereço que deseja definir como principal
        novo_endereco_principal = None
        for endereco in cliente.enderecos_entrega:
            if endereco.id == endereco_id:
                novo_endereco_principal = endereco
                break

        if not novo_endereco_principal:
            raise HTTPException(status_code=404, detail="Endereço não encontrado")

        # Ativa o novo endereço como principal
        novo_endereco_principal.is_principal = True

        # Salva as alterações
        self.session.commit()
