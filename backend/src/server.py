from fastapi import FastAPI, Depends, status, HTTPException, Response, File, UploadFile
import uuid
from sqlalchemy.orm import Session
from src.schemas.schemas import Produto, Usuario
from src.schemas import schemas
from src.infra.sqlalchemy.config.database import get_db
from src.infra.sqlalchemy.repositorios.produto import RepositorioProduto
from src.infra.sqlalchemy.repositorios.repositorio_usuario import RepositorioUsuario
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from src.security import verify_password, criar_token_jwt


app = FastAPI()

# Configurar origens permitidas (substitua * pelo seu domínio front-end)
origins = ["*"]

# Configurar middlewares para permitir CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# USUÁRIOS =>
# CRIAR USUARIO                                                    
@app.post('/usuario', status_code=status.HTTP_201_CREATED)
def criar_usuario(usuario: Usuario, session: Session = Depends(get_db)):
    if usuario.senha != usuario.confirmar_senha:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="As senhas não coincidem")

    repo_usuario = RepositorioUsuario(session)
    usuario_criado = repo_usuario.criar(usuario)
    return usuario_criado

# LISTAR USUARIO
@app.get('/usuario', status_code=status.HTTP_200_OK)
def listar_usuario(session: Session = Depends(get_db)):
    usuario = RepositorioUsuario(session).listar()
    return usuario

# EDITAR USUARIO
import bcrypt


# Editar usuarios
@app.put('/usuario/{usuario_id}', status_code=status.HTTP_200_OK)
def editar_usuario(
    usuario_id: int,
    novo_usuario: dict,
    session: Session = Depends(get_db)
):
    repo_usuario = RepositorioUsuario(session)
    usuario_existente = repo_usuario.obter_por_id(usuario_id)

    if usuario_existente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    campos_permitidos = {'nome', 'cpf', 'senha', 'grupo', 'status'}
    campos_para_atualizar = {campo: novo_usuario[campo] for campo in campos_permitidos if campo in novo_usuario}

    if 'senha' in campos_para_atualizar:
        senha = campos_para_atualizar.get('senha')
        senha_criptografada = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())
        campos_para_atualizar['senha'] = senha_criptografada

    usuario_atualizado = repo_usuario.editar(usuario_existente, campos_para_atualizar)
    return usuario_atualizado




# DELETAR USUÁRIO
@app.delete('/usuario/{usuario_id}', status_code=status.HTTP_204_NO_CONTENT)
def excluir_usuario(usuario_id: int, session: Session = Depends(get_db)):
    repo_usuario = RepositorioUsuario(session)
    usuario_existente = repo_usuario.obter_por_id(usuario_id)

    if usuario_existente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    repo_usuario.excluir(usuario_existente)
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    response.headers["X-Message"] = "Usuário excluído com sucesso."
    return response



# Rota para autenticação de login
@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_db)):
    # Autentica as credenciais do usuário
    repo_usuario = RepositorioUsuario(session)
    user = repo_usuario.autenticar(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(status_code=403,
                            detail="Usuário não autorizado"
                           )
    
    if not user.status:  # Verifica se o status é False (usuário desativado)
        raise HTTPException(status_code=403,
                            detail="Usuário não autorizado"
                           )
    
    # Verifica se o grupo do usuário é igual a "admin"
    if user.grupo == "admin":
        if not user.status:  # Verifica se o status é False (usuário desativado)
            raise HTTPException(status_code=403,
                                detail="Usuário não autorizado"
                               )
    
    if user.id == 1:
        return {
            "access_token": criar_token_jwt(user.id),
            "token_type": "bearer",
        }
    
    return {
        "access_token": criar_token_jwt(user.id),
        "token_type": "bearer",
    }


# Editar status
@app.put('/usuario/{usuario_id}/status', status_code=status.HTTP_200_OK)
def alterar_status_usuario(usuario_id: int, status: bool, session: Session = Depends(get_db)):
    repo_usuario = RepositorioUsuario(session)
    usuario_existente = repo_usuario.obter_por_id(usuario_id)

    if usuario_existente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    # Atualiza o status do usuário com o novo_status fornecido
    usuario_existente.status = status  # Alterado de novo_status para status
    session.commit()

    return {"message": "Status do usuário atualizado com sucesso"}
 

# ROTAS DE PRODUTOS=>

# Criar usuario
@app.post("/produtos/", response_model=Produto, status_code=status.HTTP_201_CREATED)
def create_produto(produto: Produto, db: Session = Depends(get_db)):
    repo = RepositorioProduto(db)
    return repo.criar(produto)

# Listar usuario
@app.get('/produtos/', status_code=status.HTTP_200_OK)
def listar_produto(session: Session = Depends(get_db)):
    produto = RepositorioProduto(session).listar()
    return produto

# DELETAR USUÁRIO
@app.delete('/produtos/{produto_id}', status_code=status.HTTP_204_NO_CONTENT)
def excluir_produto(produto_id: int, session: Session = Depends(get_db)):
    repo_produto = RepositorioProduto(session)
    produto_existente = repo_produto.obter_por_id(produto_id)

    if produto_existente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado")

    repo_produto.excluir(produto_existente)
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    response.headers["X-Message"] = "produto excluído com sucesso."
    return response



IMAGEDIR = "src/imagesProd/"

@app.post('/upload')
async def create_upload_file(file: UploadFile = File(...)):

    file.filename = f"{uuid.uuid4()}.jpg"
    contents = await file.read()

    #salvar arquivo
    with open (f"{IMAGEDIR}{file.filename}", "wb") as f:
        f.write(contents)

    return {"filename": file.filename}